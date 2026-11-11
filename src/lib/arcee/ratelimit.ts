import { createHash } from "node:crypto";
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
    redis =
      process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
        ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
        : null;
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

/** Hashes the visitor's IP so no raw IP is ever stored. */
export function visitorKey(headers: Headers): string {
  const ip = headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "local";
  return createHash("sha256").update(`iteshxt.me:${ip}`).digest("hex").slice(0, 32);
}

export async function limitChat(visitor: string): Promise<Limit> {
  const perVisitor = await check({ name: "chat", key: visitor, limit: 20, windowSec: 600 });
  if (!perVisitor.ok) return perVisitor;
  return check({ name: "chat-global", key: "all", limit: 1500, windowSec: 86_400 });
}

export async function limitMessage(visitor: string): Promise<Limit> {
  return check({ name: "message", key: visitor, limit: 3, windowSec: 86_400 });
}
