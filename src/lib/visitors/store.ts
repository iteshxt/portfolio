import { randomBytes } from "node:crypto";
import { Redis } from "@upstash/redis";
import type { StickerMood } from "@/lib/arcee/stickers";
import type { VisitorEntry, VisitorList } from "./types";
import { isCalendarDate } from "./validate";

/** "HH:MM", 24-hour. */
const isClockTime = (s: unknown): s is string => typeof s === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(s);

/**
 * Where the passport's stamps live (docs/design.md §2.18). Upstash Redis when configured
 * (needed on Vercel), an in-memory store otherwise (local development and e2e), same as
 * lib/scan-store. Only what the visitor typed and picked, plus an id, a number and the date
 * and wall-clock time they signed: no place, no IP.
 *
 * Redis layout:
 * - `visitors:n`       INCR counter, the last visitor number given out (the next is this + 1)
 * - `visitors:entries` hash id -> entry JSON (visible stamps; `d` is the visit date and `tm` the "HH:MM" time, either missing on older ones)
 * - `visitors:order`   sorted set, score = number, member = id
 * - `visitors:hidden`  hash id -> entry JSON (hidden stamps, kept so they can be restored by hand)
 */

const K = { n: "visitors:n", entries: "visitors:entries", order: "visitors:order", hidden: "visitors:hidden" };

type Memory = { n: number; entries: Map<string, VisitorEntry>; hidden: Map<string, VisitorEntry> };

/**
 * On globalThis so the route handler that signs and the page that reads share one store
 * in development, where they can load separate copies of this module.
 */
const g = globalThis as typeof globalThis & { __visitorsMemory?: Memory };
function memory(): Memory {
  g.__visitorsMemory ??= { n: 0, entries: new Map(), hidden: new Map() };
  return g.__visitorsMemory;
}

let redis: Redis | null | undefined;
function store(): Redis | null {
  if (redis === undefined) {
    const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
    redis = url && token ? new Redis({ url, token }) : null;
  }
  return redis;
}

/** True when stamps survive a restart (Redis); false on the in-memory fallback. */
export function hasStorage(): boolean {
  return store() !== null;
}

/**
 * Upstash deserialises JSON values by itself; accept either form. Stamps from before dates
 * (or times) existed have no `d` (or `tm`); a `d` that isn't a real "YYYY-MM-DD", or a `tm`
 * that isn't an "HH:MM", is dropped and the stamp kept.
 */
function parse(value: unknown): VisitorEntry | null {
  if (!value) return null;
  try {
    const v = (typeof value === "string" ? JSON.parse(value) : value) as VisitorEntry;
    if (typeof v?.id !== "string" || typeof v.n !== "number") return null;
    const badDate = "d" in v && !isCalendarDate(v.d);
    const badTime = "tm" in v && !isClockTime(v.tm);
    if (!badDate && !badTime) return v;
    const kept = { ...v };
    if (badDate) delete kept.d;
    if (badTime) delete kept.tm;
    return kept;
  } catch {
    return null;
  }
}

/** 16 random bytes, base64url: unguessable, since the id is half of the hide link. */
function newId(): string {
  return randomBytes(16).toString("base64url");
}

/**
 * Stamps a validated card; `d` ("YYYY-MM-DD") and `tm` ("HH:MM", when the visitor's clock was
 * believable) come from resolveVisitMoment.
 */
export async function signVisitor(card: { name: string; line: string; cat: StickerMood; d: string; tm?: string }): Promise<VisitorEntry> {
  const r = store();
  const stamp = (id: string, n: number): VisitorEntry => ({
    id,
    n,
    name: card.name,
    line: card.line,
    cat: card.cat,
    d: card.d,
    ...(card.tm ? { tm: card.tm } : {}),
  });
  if (!r) {
    const m = memory();
    const entry = stamp(newId(), ++m.n);
    m.entries.set(entry.id, entry);
    return entry;
  }
  const n = await r.incr(K.n);
  const entry = stamp(newId(), n);
  const tx = r.multi();
  tx.hset(K.entries, { [entry.id]: JSON.stringify(entry) });
  tx.zadd(K.order, { score: n, member: entry.id });
  await tx.exec();
  return entry;
}

/**
 * Visible stamps, newest first, how many there are in all, and the number the next stamp
 * gets (the counter + 1: hidden stamps keep their numbers, so it can be above total + 1).
 */
export async function listVisitors(limit = 500): Promise<VisitorList> {
  const r = store();
  if (!r) {
    const m = memory();
    const all = [...m.entries.values()].sort((a, b) => b.n - a.n);
    return { entries: all.slice(0, limit), total: all.length, next: m.n + 1 };
  }
  const [ids, total, counter] = await Promise.all([
    r.zrange<string[]>(K.order, 0, limit - 1, { rev: true }),
    r.zcard(K.order),
    r.get<number | string>(K.n),
  ]);
  // No counter yet means nobody has signed: the first stamp is No. 1.
  const signed = Number(counter ?? 0);
  const next = (Number.isSafeInteger(signed) && signed > 0 ? signed : 0) + 1;
  if (ids.length === 0) return { entries: [], total, next };
  const map = (await r.hmget<Record<string, unknown>>(K.entries, ...ids)) ?? {};
  const entries = ids.map((id) => parse(map[id])).filter((e): e is VisitorEntry => e !== null);
  return { entries, total, next };
}

export async function getVisitor(id: string): Promise<VisitorEntry | null> {
  if (!id) return null;
  const r = store();
  if (!r) return memory().entries.get(id) ?? null;
  return parse(await r.hget(K.entries, id));
}

/** Takes a stamp off the passport, keeping it aside. False when there was nothing to hide. */
export async function hideVisitor(id: string): Promise<boolean> {
  if (!id) return false;
  const r = store();
  if (!r) {
    const m = memory();
    const entry = m.entries.get(id);
    if (!entry) return false;
    m.entries.delete(id);
    m.hidden.set(id, entry);
    return true;
  }
  const raw = await r.hget(K.entries, id);
  const entry = parse(raw);
  if (!entry) return false;
  const tx = r.multi();
  tx.hset(K.hidden, { [id]: JSON.stringify(entry) });
  tx.hdel(K.entries, id);
  tx.zrem(K.order, id);
  await tx.exec();
  return true;
}
