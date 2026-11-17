import type { StickerMood } from "@/lib/arcee/stickers";

/**
 * The visitors' passport (docs/design.md §2.18): people who scanned the manifest's barcode and
 * signed in. Shared contract between the API (app/api/visitors), the store (lib/visitors/store)
 * and the pages (/s/[code] arrival card, /visitors passport).
 *
 * Privacy: only what the visitor typed and picked is kept, plus the date and time they signed
 * (on their own wall clock, no time zone kept). No place, no IP.
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
  /**
   * The day they signed, on their own calendar: "YYYY-MM-DD", printed on the stamp like an entry
   * date. Missing on stamps made before dates existed.
   */
  d?: string;
  /**
   * The time they signed, on their own wall clock: "HH:MM", 24-hour, printed next to the date.
   * Missing on stamps made before times existed, and when the visitor's clock wasn't believable.
   */
  tm?: string;
};

/** POST /api/visitors */
export type SignRequest = {
  /** The manifest code from the barcode (/s/[code]); must have been scanned within the last hour. */
  code: string;
  name: string;
  line?: string;
  cat: StickerMood;
  /**
   * The visitor's local date, "YYYY-MM-DD". The server keeps it when it's within a day of its own
   * UTC date (every time zone is), and uses its own UTC date otherwise.
   */
  date?: string;
  /**
   * The visitor's local moment, ISO 8601 with their offset ("2026-11-17T22:14:05+05:30"). When it
   * names an instant within 15 minutes of the server's clock, the stamp gets its date and wall-clock
   * time; otherwise the server falls back to `date` (kept for older clients) and no time.
   */
  at?: string;
  /** Honeypot: real visitors never fill it. */
  website?: string;
};

/** What the passport and the arrival card read: visible stamps (newest first), how many there are,
 * and the number the next stamp will get (hidden stamps keep their numbers, so it can be above total + 1). */
export type VisitorList = { entries: VisitorEntry[]; total: number; next: number };

export type SignError = "invalid" | "rejected" | "rate-limited" | "not-scanned" | "unavailable";

export type SignResponse = { ok: true; entry: VisitorEntry } | { ok: false; error: SignError; message: string };

/** Cache tag for the passport's list of stamps (revalidated when someone signs or a stamp is hidden). */
export const VISITORS_TAG = "visitors";

export const NAME_MAX = 24;
export const LINE_MAX = 80;

/** "0142": a visitor number as it's printed on the stamp. */
export const visitorNo = (n: number) => String(n).padStart(4, "0");
