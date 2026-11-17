import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * One-click moderation for the passport (docs/design.md §2.18): each new stamp's email
 * carries a link signed with HMAC-SHA256 over the stamp id, so hiding needs no admin
 * panel and no login. The key is VISITOR_HIDE_SECRET, or the Resend key (already a
 * server-only secret) when that isn't set. No key, no hide links.
 */

function key(): string | null {
  return process.env.VISITOR_HIDE_SECRET || process.env.RESEND_API_KEY || null;
}

/** 43 base64url characters, or null when no key is configured. */
export function hideToken(id: string): string | null {
  const k = key();
  if (!k || !id) return null;
  return createHmac("sha256", k).update(`visitor-hide:${id}`).digest("base64url");
}

export function verifyHideToken(id: string, token: string): boolean {
  const expected = hideToken(id);
  if (!expected || typeof token !== "string") return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}
