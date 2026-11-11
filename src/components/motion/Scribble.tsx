"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Six hand-drawn underlines (docs/design.md §6), drawn in a 200×20 box. */
const SCRIBBLES = [
  "M3 12 C 40 5, 80 17, 120 10 S 178 7, 197 12",
  "M3 10 Q 50 3 100 11 T 197 9",
  "M2 14 C 30 7, 62 7, 92 12 S 150 18, 198 6",
  "M4 9 C 60 15, 120 4, 196 12 M 24 16 C 80 12, 140 18, 182 14",
  "M2 10 q 12 -7 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0",
  "M3 13 C 70 2, 130 21, 197 7",
];

/**
 * Wraps link text with a scribble that draws itself on hover or focus,
 * a different one each time. Pure CSS: a clip wipes the stroke in.
 */
export function Scribble({ children, className, inverse = false }: { children: ReactNode; className?: string; inverse?: boolean }) {
  const [variant, setVariant] = useState(0);
  const [on, setOn] = useState(false);

  function enter() {
    setVariant((v) => (v + 1 + Math.floor(Math.random() * (SCRIBBLES.length - 1))) % SCRIBBLES.length);
    setOn(true);
  }

  return (
    <span className={cn("relative inline-block", className)} onPointerEnter={enter} onPointerLeave={() => setOn(false)} onFocus={enter} onBlur={() => setOn(false)}>
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 200 20"
        preserveAspectRatio="none"
        data-on={on}
        className="scribble-svg pointer-events-none absolute -bottom-[0.32em] left-0 h-[0.45em] min-h-2 w-full overflow-visible"
      >
        <path d={SCRIBBLES[variant]} className={cn("scribble", inverse && "scribble-inverse")} />
      </svg>
    </span>
  );
}
