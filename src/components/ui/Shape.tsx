import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/**
 * Wordless die-cut stickers in the accent colours (docs/design.md §2.2): the
 * intro loader slaps them on, and they stay stuck around the home hero.
 */

const DIE_CUT = { stroke: "#fff", strokeWidth: 7, strokeLinejoin: "round" as const, paintOrder: "stroke" as const };

/** A 12-point burst, as polygon points in a 100×100 box. */
const BURST = Array.from({ length: 24 }, (_, i) => {
  const a = (i * Math.PI) / 12;
  const r = i % 2 ? 33 : 47;
  return `${(50 + r * Math.sin(a)).toFixed(1)},${(50 - r * Math.cos(a)).toFixed(1)}`;
}).join(" ");

const ART = {
  burst: <polygon points={BURST} fill="var(--sunflower)" {...DIE_CUT} />,
  blob: <path d="M52 9C75 7 93 25 91 49 89 74 70 92 46 91 22 89 7 71 9 47 11 25 30 11 52 9Z" fill="var(--lime)" {...DIE_CUT} />,
  squiggle: (
    <>
      <path d="M10 58C22 28 34 28 40 50S58 72 64 50 82 28 90 44" fill="none" stroke="#fff" strokeWidth="26" strokeLinecap="round" />
      <path d="M10 58C22 28 34 28 40 50S58 72 64 50 82 28 90 44" fill="none" stroke="var(--tomato)" strokeWidth="14" strokeLinecap="round" />
    </>
  ),
  arch: (
    <>
      <path d="M16 74A34 34 0 0 1 84 74" fill="none" stroke="#fff" strokeWidth="30" strokeLinecap="round" />
      <path d="M16 74A34 34 0 0 1 84 74" fill="none" stroke="var(--lavender)" strokeWidth="18" strokeLinecap="round" />
    </>
  ),
};

export type ShapeName = keyof typeof ART;

export function Shape({ name, className, style }: { name: ShapeName; className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={cn("overflow-visible drop-shadow-[0_10px_14px_rgb(0_0_0/0.28)]", className)} style={style}>
      {ART[name]}
    </svg>
  );
}
