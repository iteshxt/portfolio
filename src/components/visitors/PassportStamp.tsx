import type { CSSProperties } from "react";
import { STICKERS, type StickerMood } from "@/lib/arcee/stickers";
import { cn } from "@/lib/cn";
import type { VisitorEntry } from "@/lib/visitors/types";

/**
 * A visitor's stamp in the passport (docs/design.md §2.18): a rubber-stamp impression in one
 * ink, worn by a grain texture. Its shape, ink, tilt and wear come from the visitor's number
 * alone, so the arrival card's live preview (numbered with the next number) is the very stamp
 * that thumps in, and a stamp always looks the same. It carries the visitor number, their name,
 * their line, the date and time they arrived, and the cat they picked, printed in the stamp's ink like a
 * passport photo (the still frame).
 */

export const STAMP_SHAPES = ["circle", "rect", "oval", "ticket"] as const;
type Shape = (typeof STAMP_SHAPES)[number];

/** What a stamp prints. The arrival card's preview has no id yet, and maybe no cat. */
export type StampData = Pick<VisitorEntry, "n" | "name" | "line" | "d"> & { id?: string; cat?: StickerMood; tm?: string };

/** Inks dark enough to read on the passport's paper even through the grain (each about 6:1 or more on #f7f3e8). */
const INKS = ["#5a17c9", "#a8301a", "#17653a", "#23306b", "#7a4900"];

/** A small stable hash of the visitor number (FNV-1a over its digits). */
function hash(n: number): number {
  const s = `visitor-${n}`;
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

export function stampLook(n: number): { shape: Shape; ink: string; tilt: number; grain: string } {
  const h = hash(n);
  return {
    shape: STAMP_SHAPES[Math.abs(n) % STAMP_SHAPES.length],
    ink: INKS[(Math.abs(n) * 3 + (h % 2)) % INKS.length],
    tilt: ((h % 2400) / 100 - 12) * (n % 3 === 0 ? 0.6 : 1),
    // Where the grain tile (160 px) starts, so each stamp is worn differently.
    grain: `-${(h >>> 8) % 160}px -${(h >>> 16) % 160}px`,
  };
}

/** "No. 0142"; "No. ····" while the number isn't known. */
export const visitorNo = (n: number) => (n > 0 ? `No. ${String(n).padStart(4, "0")}` : "No. ····");

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-11-17" → "17 Nov 2026" (read as a calendar date, so no time zone can shift it). Empty when unknown. */
export function formatVisitDate(d: string | undefined): string {
  const m = d ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(d) : null;
  if (!m) return "";
  const month = MONTHS[Number(m[2]) - 1];
  return month ? `${Number(m[3])} ${month} ${m[1]}` : "";
}

/** Long names step down a size so they stay on one or two lines (round stamps are narrower). */
function nameSize(name: string, shape: Shape): string {
  const len = [...name].length;
  if (shape === "circle") return len <= 7 ? "text-[24px]" : len <= 12 ? "text-[18px]" : "text-[14px]";
  return len <= 9 ? "text-[26px]" : len <= 15 ? "text-[21px]" : "text-[17px]";
}

/**
 * `draft`: the arrival card's preview while the visitor fills it in. Lighter ink, and stand-ins
 * ("Your name", an empty photo frame) for what they haven't given yet.
 */
export function PassportStamp({ entry, draft, className, style }: { entry: StampData; draft?: boolean; className?: string; style?: CSSProperties }) {
  const { shape, ink, tilt, grain } = stampLook(entry.n);
  const cat = entry.cat ? STICKERS[entry.cat] : null;
  const no = visitorNo(entry.n);
  const date = formatVisitDate(entry.d).toUpperCase();
  // The moment they stamped in: date and their own clock time ("17 NOV 2026 · 22:14"); older stamps have the date only.
  const time = date && entry.tm && /^\d{2}:\d{2}$/.test(entry.tm) ? entry.tm : "";
  const moment = time ? `${date} · ${time}` : date;
  const name = entry.name || (draft ? "Your name" : "");
  const rimId = `rim-${entry.id ?? "draft"}-${entry.n}`;
  return (
    <div
      className={cn("visa-stamp", `visa-stamp-${shape}`, draft && "visa-stamp-draft", className)}
      style={{ "--ink": ink, "--tilt": `${tilt.toFixed(1)}deg`, "--grain": grain, ...style } as CSSProperties}
    >
      {shape === "circle" && (
        // The number and the site run round the top of the rim, the date (or CLEARED) round the bottom, like a real entry stamp.
        <svg aria-hidden="true" viewBox="0 0 200 200" className="visa-stamp-rim">
          <defs>
            <path id={`${rimId}-top`} d="M 24 100 A 76 76 0 0 1 176 100" />
            <path id={`${rimId}-bottom`} d="M 30 112 A 70 70 0 0 0 170 112" />
          </defs>
          <text className="visa-stamp-rim-text">
            <textPath href={`#${rimId}-top`} startOffset="50%" textAnchor="middle">
              VISITOR {no.toUpperCase()} · ITESHXT.ME
            </textPath>
          </text>
          <text className="visa-stamp-rim-text">
            <textPath href={`#${rimId}-bottom`} startOffset="50%" textAnchor="middle">
              ★ {moment || "CLEARED"} ★
            </textPath>
          </text>
        </svg>
      )}
      <div className="visa-stamp-body">
        {(shape === "rect" || shape === "ticket") && (
          <p className="visa-stamp-head">
            <span>Arrived</span>
            <span>{no}</span>
          </p>
        )}
        <div className="visa-stamp-main">
          {cat ? (
            <picture className="contents">
              <img src={cat.still} alt="" width={40} height={40} loading="lazy" decoding="async" className="visa-stamp-photo" />
            </picture>
          ) : (
            <span aria-hidden="true" className="visa-stamp-photo visa-stamp-photo-empty" />
          )}
          <div className="min-w-0">
            <p className={cn("visa-stamp-name", nameSize(name, shape), draft && !entry.name && "visa-stamp-standin")}>{name}</p>
            {entry.line && <p className="visa-stamp-line">{entry.line}</p>}
          </div>
        </div>
        {(shape === "rect" || shape === "ticket") && <p className="visa-stamp-foot">{time ? moment : date ? `${date} · iteshxt.me` : "iteshxt.me · cleared"}</p>}
        {shape === "oval" && (
          <p className="visa-stamp-oval-no">
            <span>Arrived · {no}</span>
            {moment && <span>{moment}</span>}
          </p>
        )}
      </div>
    </div>
  );
}
