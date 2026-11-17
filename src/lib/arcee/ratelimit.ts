import { createHmac } from "node:crypto";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Rate limits for Arcee (docs/spec.md §8.1): per hashed IP plus a global daily
 * cap to protect the Groq quota. Uses Upstash Redis when configured, and a
 * per-instance in-memory fallback otherwise (local development).
 */

type Limit = { ok: boolean; retryAfter?: number };
type Rule = { key: string; limit: number; windowSec: number };

const memory = new Map<string, { count: number; reset: number }>();

function memoryLimit({ name, key, limit, windowSec }: Rule & { name: string }): Limit {
  const now = Date.now();
  // Each rule counts separately, even for the same visitor.
  const id = `${name}:${key}`;
  const entry = memory.get(id);
  if (!entry || entry.reset < now) {
    memory.set(id, { count: 1, reset: now + windowSec * 1000 });
    return { ok: true };
  }
  if (entry.count >= limit) return { ok: false, retryAfter: Math.ceil((entry.reset - now) / 1000) };
  entry.count += 1;
  return { ok: true };
}

let redis: Redis | null | undefined;
const limiters = new Map<string, Ratelimit>();

function upstash(): Redis | null {
  if (redis === undefined) {
    // Upstash's own names, or the KV_* names Vercel's Marketplace integration sets.
    const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
    redis = url && token ? new Redis({ url, token }) : null;
  }
  return redis;
}

async function check(rule: Rule & { name: string }): Promise<Limit> {
  const r = upstash();
  if (!r) return memoryLimit(rule);
  let limiter = limiters.get(rule.name);
  if (!limiter) {
    limiter = new Ratelimit({ redis: r, limiter: Ratelimit.slidingWindow(rule.limit, `${rule.windowSec} s`), prefix: `arcee:${rule.name}` });
    limiters.set(rule.name, limiter);
  }
  const res = await limiter.limit(rule.key);
  return res.success ? { ok: true } : { ok: false, retryAfter: Math.max(1, Math.ceil((res.reset - Date.now()) / 1000)) };
}

/**
 * A keyed hash of the visitor's IP, so no raw IP is ever stored. Keyed with a server
 * secret (a plain hash of every IPv4 address takes minutes to reverse) and mixed with
 * the UTC day, so keys can't be linked across days either.
 */
/**
 * The network a request comes from: IPv4 as it is, IPv6 cut to its /64 (one phone or home
 * controls a whole /64 and hops between addresses in it, which would dodge per-visitor limits).
 */
export function clientNetwork(raw: string): string {
  let ip = raw.trim().replace(/^\[|\](:\d+)?$/g, "").replace(/%.*$/, "");
  const mapped = ip.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i);
  if (mapped) return mapped[1];
  if (!ip.includes(":")) return ip;
  ip = ip.toLowerCase();
  const [head, tail = ""] = ip.split("::");
  const left = head ? head.split(":") : [];
  const right = ip.includes("::") ? (tail ? tail.split(":") : []) : [];
  const groups = ip.includes("::") ? [...left, ...Array(Math.max(0, 8 - left.length - right.length)).fill("0"), ...right] : left;
  return `${groups
    .slice(0, 4)
    .map((g) => g.replace(/^0+(?=.)/, ""))
    .join(":")}::/64`;
}

export function visitorKey(headers: Headers): string {
  const ip = clientNetwork(headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "local");
  const secret = process.env.RATE_LIMIT_SECRET || process.env.VISITOR_HIDE_SECRET || process.env.RESEND_API_KEY || "iteshxt.me";
  const day = new Date().toISOString().slice(0, 10);
  return createHmac("sha256", secret).update(`${day}:${ip}`).digest("hex").slice(0, 32);
}

export async function limitChat(visitor: string): Promise<Limit> {
  const perVisitor = await check({ name: "chat", key: visitor, limit: 20, windowSec: 600 });
  if (!perVisitor.ok) return perVisitor;
  return check({ name: "chat-global", key: "all", limit: 1500, windowSec: 86_400 });
}

export async function limitMessage(visitor: string): Promise<Limit> {
  return check({ name: "message", key: visitor, limit: 3, windowSec: 86_400 });
}

/** The manifest barcode: generous, it's only there to stop someone hammering it. */
export async function limitScan(visitor: string): Promise<Limit> {
  return check({ name: "scan", key: visitor, limit: 30, windowSec: 600 });
}

/** The desktop manifest polls for its scan every few seconds; this only stops code enumeration. */
export async function limitScanPoll(visitor: string): Promise<Limit> {
  return check({ name: "scan-poll", key: visitor, limit: 300, windowSec: 600 });
}

/**
 * The visitors' passport (docs/design.md §2.18): one stamp per visitor (IP and scan code) per
 * day, a few per IP so people behind one address (mobile carrier NAT, office wifi) can each
 * sign, a global daily cap (the same 40 as the owner emails, so no stamp goes up without a hide link), and a looser cap on attempts
 * so the scan-code check can't be hammered. Attempts are counted apart from stamps, so a
 * rejected card doesn't use up the day's stamp.
 */
export async function limitSign(visitor: string, code: string): Promise<Limit> {
  const perScan = await check({ name: "sign", key: `${visitor}:${code}`, limit: 1, windowSec: 86_400 });
  if (!perScan.ok) return perScan;
  const perIp = await check({ name: "sign-ip", key: visitor, limit: 3, windowSec: 86_400 });
  if (!perIp.ok) return perIp;
  // Matches the owner-email cap: every stamp gets an email with its hide link, so every stamp can be taken down.
  return check({ name: "sign-global", key: "all", limit: 40, windowSec: 86_400 });
}

/**
 * Owner emails for new stamps, capped apart from the stamps: they share the contact form's
 * Resend quota (100 a day on the free tier), and a flood shouldn't silence real messages.
 */
export async function limitSignEmail(): Promise<Limit> {
  return check({ name: "sign-email", key: "all", limit: 40, windowSec: 86_400 });
}

export async function limitSignAttempt(visitor: string): Promise<Limit> {
  return check({ name: "sign-try", key: visitor, limit: 20, windowSec: 600 });
}
