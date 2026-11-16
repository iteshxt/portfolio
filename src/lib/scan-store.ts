import { Redis } from "@upstash/redis";

/**
 * Where a phone scan of the manifest barcode meets the desktop that showed it
 * (docs/design.md §2.17). Upstash Redis when configured (needed on Vercel, where
 * each request can land on a different instance); an in-memory map otherwise,
 * which is enough for local development. Codes expire after an hour.
 */

const TTL_SECONDS = 3600;
const memory = new Map<string, number>();
let redis: Redis | null | undefined;

function store(): Redis | null {
  if (redis === undefined) {
    const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
    redis = url && token ? new Redis({ url, token }) : null;
  }
  return redis;
}

export const SCAN_CODE = /^[a-z0-9]{4,8}$/;

export async function markScanned(code: string): Promise<void> {
  const r = store();
  if (r) await r.set(`scan:${code}`, Date.now(), { ex: TTL_SECONDS });
  else memory.set(code, Date.now() + TTL_SECONDS * 1000);
}

export async function wasScanned(code: string): Promise<boolean> {
  const r = store();
  if (r) return (await r.get(`scan:${code}`)) !== null;
  const until = memory.get(code);
  if (!until) return false;
  if (until < Date.now()) {
    memory.delete(code);
    return false;
  }
  return true;
}
