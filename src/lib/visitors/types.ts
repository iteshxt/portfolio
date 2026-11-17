import type { StickerMood } from "@/lib/arcee/stickers";

/**
 * The visitors' passport (docs/design.md §2.18): people who scanned the manifest QR code and
 * signed in. Shared contract between the API (app/api/visitors), the store (lib/visitors/store)
 * and the pages (/s/[code] arrival card, /visitors passport).
 *
 * Privacy: only what the visitor typed and picked is kept. No time, no place, no IP.
 */
export type VisitorEntry = {
  /** Random, unguessable id (used in the hide link and to highlight "you" on /visitors). */
  id: string;
  /** Visitor number, 1, 2, 3… in signing order (hidden stamps keep theirs, so numbers can skip). */
  n: number;
  /** 1–24 characters. */
  name: string;
  /** "Reason for visit": 0–80 characters, may be empty. */
  line: string;
  /** The cat they picked as their passport photo. */
  cat: StickerMood;
};

/** POST /api/visitors */
export type SignRequest = {
  /** The manifest code from the QR (/s/[code]); must have been scanned within the last hour. */
  code: string;
  name: string;
  line?: string;
  cat: StickerMood;
  /** Honeypot: real visitors never fill it. */
  website?: string;
};

export type SignError = "invalid" | "rejected" | "rate-limited" | "not-scanned" | "unavailable";

export type SignResponse = { ok: true; entry: VisitorEntry } | { ok: false; error: SignError; message: string };

/** Cache tag for the passport's list of stamps (revalidated when someone signs or a stamp is hidden). */
export const VISITORS_TAG = "visitors";

export const NAME_MAX = 24;
export const LINE_MAX = 80;

/** "0142": a visitor number as it's printed on the stamp. */
export const visitorNo = (n: number) => String(n).padStart(4, "0");
