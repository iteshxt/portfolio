import { Redis } from "@upstash/redis";
import { getVisitor } from "@/lib/visitors/store";

/**
 * Where a phone scan of the manifest barcode meets the desktop that showed it
 * (docs/design.md §2.17). Upstash Redis when configured (needed on Vercel, where
 * each request can land on a different instance); an in-memory map otherwise,
 * which is enough for local development. Codes expire after an hour.
 */

const TTL_SECONDS = 3600;

/** `id` is the stamp the name came from, so hiding the stamp also takes the name off the manifest. */
type Scan = { until: number; name?: string; id?: string };
type Signed = { name?: string; id?: string };
/**
 * On globalThis so /api/scan (which marks) and /api/visitors (which checks and adds the
 * name) share one map in development, where routes can load separate module copies.
 */
const g = globalThis as typeof globalThis & { __scanMemory?: Map<string, Scan> };
const memory = (g.__scanMemory ??= new Map<string, Scan>());
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

/**
 * Marks a code as scanned for the next hour. Signing the passport marks it again with the
 * visitor's name (docs/design.md §2.18), so the desktop manifest can print who arrived;
 * a later re-scan keeps that name. Only the name they chose to put in the passport, no time.
 */
export async function markScanned(code: string, name?: string, id?: string): Promise<void> {
  const keep: Signed = name ? { name, id } : await readScan(code).then((s) => (s ? { name: s.name, id: s.id } : {}));
  const r = store();
  if (r) await r.set(`scan:${code}`, JSON.stringify(keep.name ? keep : {}), { ex: TTL_SECONDS });
  else memory.set(code, { until: Date.now() + TTL_SECONDS * 1000, ...keep });
}

async function readScan(code: string): Promise<Signed | null> {
  const r = store();
  if (r) {
    const raw = await r.get<unknown>(`scan:${code}`);
    return raw === null || raw === undefined ? null : signedOf(raw);
  }
  const entry = memory.get(code);
  if (!entry) return null;
  if (entry.until < Date.now()) {
    memory.delete(code);
    return null;
  }
  return { name: entry.name, id: entry.id };
}

/**
 * Whether the code was scanned, and the signer's name once they've signed. A name whose
 * stamp has since been hidden is left out: moderation reaches the live manifest too.
 */
export async function scanInfo(code: string): Promise<{ scanned: boolean; name?: string }> {
  const scan = await readScan(code);
  if (!scan) return { scanned: false };
  if (!scan.name) return { scanned: true };
  if (scan.id && !(await getVisitor(scan.id))) return { scanned: true };
  return { scanned: true, name: scan.name };
}

/** Older values are a bare timestamp; newer ones are {name?, id?} (Upstash may hand back either form). */
function signedOf(raw: unknown): Signed {
  let value = raw;
  if (typeof raw === "string") {
    try {
      value = JSON.parse(raw);
    } catch {
      value = null;
    }
  }
  if (!value || typeof value !== "object") return {};
  const v = value as Record<string, unknown>;
  return { name: typeof v.name === "string" ? v.name : undefined, id: typeof v.id === "string" ? v.id : undefined };
}

export async function wasScanned(code: string): Promise<boolean> {
  return (await readScan(code)) !== null;
}
