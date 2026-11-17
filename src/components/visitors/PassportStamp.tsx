import type { CSSProperties } from "react";
import { STICKERS } from "@/lib/arcee/stickers";
import { cn } from "@/lib/cn";
import type { VisitorEntry } from "@/lib/visitors/types";

/**
 * A visitor's stamp in the passport (docs/design.md §2.18): a rubber-stamp impression in one
 * ink, worn by a grain texture. Its shape, ink and tilt come from the visitor's number and id,
 * so each stamp always looks the same. It carries the visitor number, their name, their line,
 * and the cat they picked, printed in the stamp's ink like a passport photo (the still frame).
 */

export const STAMP_SHAPES = ["circle", "rect", "oval", "ticket"] as const;
type Shape = (typeof STAMP_SHAPES)[number];

/** Inks dark enough to read on the passport's paper even through the grain (each about 6:1 or more on #f7f3e8). */
const INKS = ["#5a17c9", "#a8301a", "#17653a", "#23306b", "#7a4900"];

/** A small stable hash of the id, for the tilt. */
function hash(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  return h >>> 0;
}

export function stampLook(entry: Pick<VisitorEntry, "id" | "n">): { shape: Shape; ink: string; tilt: number; grain: string } {
  const h = hash(entry.id);
  return {
    shape: STAMP_SHAPES[entry.n % STAMP_SHAPES.length],
    ink: INKS[(entry.n * 3 + (h % 2)) % INKS.length],
    tilt: ((h % 2400) / 100 - 12) * (entry.n % 3 === 0 ? 0.6 : 1),
    // Where the grain tile (160 px) starts, so each stamp is worn differently.
    grain: `-${(h >>> 8) % 160}px -${(h >>> 16) % 160}px`,
  };
}

export const visitorNo = (n: number) => `No. ${String(n).padStart(4, "0")}`;

/** Long names step down a size so they stay on one or two lines (round stamps are narrower). */
function nameSize(name: string, shape: Shape): string {
  const len = [...name].length;
  if (shape === "circle") return len <= 7 ? "text-[24px]" : len <= 12 ? "text-[18px]" : "text-[14px]";
  return len <= 9 ? "text-[26px]" : len <= 15 ? "text-[21px]" : "text-[17px]";
}

export function PassportStamp({ entry, className, style }: { entry: VisitorEntry; className?: string; style?: CSSProperties }) {
  const { shape, ink, tilt, grain } = stampLook(entry);
  const cat = STICKERS[entry.cat] ?? STICKERS.hype;
  const no = visitorNo(entry.n);
  return (
    <div
      className={cn("visa-stamp", `visa-stamp-${shape}`, className)}
      style={{ "--ink": ink, "--tilt": `${tilt.toFixed(1)}deg`, "--grain": grain, ...style } as CSSProperties}
    >
      {shape === "circle" && (
        // The number and the site run round the rim, like a real entry stamp.
        <svg aria-hidden="true" viewBox="0 0 200 200" className="visa-stamp-rim">
          <defs>
            <path id={`rim-top-${entry.id}`} d="M 24 100 A 76 76 0 0 1 176 100" />
            <path id={`rim-bottom-${entry.id}`} d="M 30 112 A 70 70 0 0 0 170 112" />
          </defs>
          <text className="visa-stamp-rim-text">
            <textPath href={`#rim-top-${entry.id}`} startOffset="50%" textAnchor="middle">
              VISITOR {no} · ITESHXT.ME
            </textPath>
          </text>
          <text className="visa-stamp-rim-text">
            <textPath href={`#rim-bottom-${entry.id}`} startOffset="50%" textAnchor="middle">
              ★ CLEARED ★
            </textPath>
          </text>
        </svg>
      )}
      <div className="visa-stamp-body">
        {shape === "circle" && <span className="sr-only">Visitor {no}</span>}
        {(shape === "rect" || shape === "ticket") && (
          <p className="visa-stamp-head">
            <span>Arrived</span>
            <span>{no}</span>
          </p>
        )}
        <div className="visa-stamp-main">
          <picture className="contents">
            <img src={cat.still} alt="" width={40} height={40} loading="lazy" decoding="async" className="visa-stamp-photo" />
          </picture>
          <div className="min-w-0">
            <p className={cn("visa-stamp-name", nameSize(entry.name, shape))}>{entry.name}</p>
            {entry.line && <p className="visa-stamp-line">{entry.line}</p>}
          </div>
        </div>
        {(shape === "rect" || shape === "ticket") && <p className="visa-stamp-foot">iteshxt.me · cleared</p>}
        {shape === "oval" && <p className="visa-stamp-oval-no">Arrived · {no}</p>}
      </div>
    </div>
  );
}
