import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/**
 * Wordless die-cut shapes in the accent colours that the intro loader slaps on
 * (docs/design.md §2.2).
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

/** Extra loader shapes: a sparkle, a zigzag and a capsule. */
const MORE = {
  sparkle: <path d="M50 6C54 34 66 46 94 50 66 54 54 66 50 94 46 66 34 54 6 50 34 46 46 34 50 6Z" fill="var(--paper)" {...DIE_CUT} />,
  zigzag: (
    <>
      <path d="M8 62 26 38 44 62 62 38 80 62 94 44" fill="none" stroke="#fff" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 62 26 38 44 62 62 38 80 62 94 44" fill="none" stroke="var(--lime)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  capsule: <rect x="12" y="32" width="76" height="36" rx="18" fill="var(--lavender)" {...DIE_CUT} transform="rotate(-20 50 50)" />,
};

const ALL = { ...ART, ...MORE };

export type ShapeName = keyof typeof ALL;

export function Shape({ name, className, style, ...rest }: { name: ShapeName; className?: string; style?: CSSProperties; "data-route-shape"?: string }) {
  return (
    <svg {...rest} viewBox="0 0 100 100" aria-hidden="true" className={cn("overflow-visible drop-shadow-[0_10px_14px_rgb(0_0_0/0.28)]", className)} style={style}>
      {ALL[name]}
    </svg>
  );
}
