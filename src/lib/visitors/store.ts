import { randomBytes } from "node:crypto";
import { Redis } from "@upstash/redis";
import type { StickerMood } from "@/lib/arcee/stickers";
import type { VisitorEntry } from "./types";

/**
 * Where the passport's stamps live (docs/design.md §2.18). Upstash Redis when configured
 * (needed on Vercel), an in-memory store otherwise (local development and e2e), same as
 * lib/scan-store. Only what the visitor typed and picked, plus an id and a number: no
 * time, no place, no IP.
 *
 * Redis layout:
 * - `visitors:n`       INCR counter, the next visitor number
 * - `visitors:entries` hash id -> entry JSON (visible stamps)
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

/** Upstash deserialises JSON values by itself; accept either form. */
function parse(value: unknown): VisitorEntry | null {
  if (!value) return null;
  try {
    const v = (typeof value === "string" ? JSON.parse(value) : value) as VisitorEntry;
    return typeof v?.id === "string" && typeof v.n === "number" ? v : null;
  } catch {
    return null;
  }
}

/** 16 random bytes, base64url: unguessable, since the id is half of the hide link. */
function newId(): string {
  return randomBytes(16).toString("base64url");
}

export async function signVisitor(card: { name: string; line: string; cat: StickerMood }): Promise<VisitorEntry> {
  const r = store();
  if (!r) {
    const m = memory();
    const entry: VisitorEntry = { id: newId(), n: ++m.n, name: card.name, line: card.line, cat: card.cat };
    m.entries.set(entry.id, entry);
    return entry;
  }
  const n = await r.incr(K.n);
  const entry: VisitorEntry = { id: newId(), n, name: card.name, line: card.line, cat: card.cat };
  const tx = r.multi();
  tx.hset(K.entries, { [entry.id]: JSON.stringify(entry) });
  tx.zadd(K.order, { score: n, member: entry.id });
  await tx.exec();
  return entry;
}

/** Visible stamps, newest first, plus how many there are in all. */
export async function listVisitors(limit = 500): Promise<{ entries: VisitorEntry[]; total: number }> {
  const r = store();
  if (!r) {
    const all = [...memory().entries.values()].sort((a, b) => b.n - a.n);
    return { entries: all.slice(0, limit), total: all.length };
  }
  const [ids, total] = await Promise.all([r.zrange<string[]>(K.order, 0, limit - 1, { rev: true }), r.zcard(K.order)]);
  if (ids.length === 0) return { entries: [], total };
  const map = (await r.hmget<Record<string, unknown>>(K.entries, ...ids)) ?? {};
  const entries = ids.map((id) => parse(map[id])).filter((e): e is VisitorEntry => e !== null);
  return { entries, total };
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
