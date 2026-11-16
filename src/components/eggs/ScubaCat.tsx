"use client";

import { useEffect } from "react";
import { play } from "@/lib/sound";

const SWIM_MS = 7600;

/** His scuba-cat sticker (a transparent cut-out), die-cut with a white outline; the still frame stands in under reduced motion. */
function CatDiver() {
  return (
    <picture className="scuba-sticker block size-[clamp(150px,17vw,220px)] -rotate-6">
      <source srcSet="/stickers/cats/scuba-still.webp" media="(prefers-reduced-motion: reduce)" />
      <img src="/stickers/cats/scuba.webp" alt="" width={200} height={200} className="size-full object-contain" />
    </picture>
  );
}

/**
 * The cat swims across the screen trailing bubbles, then calls `onDone`.
 * Triggered by the Konami code or the terminal's `scuba` (see LazyOverlays).
 * Reduced motion gets a calm appearance instead of a swim.
 */
export function ScubaCat({ run, onDone }: { run: number; onDone: () => void }) {
  useEffect(() => {
    const bubbles = window.setInterval(() => play("bubble"), 700);
    const done = window.setTimeout(() => {
      window.clearInterval(bubbles);
      onDone();
    }, SWIM_MS);
    return () => {
      window.clearInterval(bubbles);
      window.clearTimeout(done);
    };
  }, [run, onDone]);

  return (
    <div key={run} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[85] overflow-hidden">
      <div className="scuba-swim absolute top-[38%] left-0">
        <div className="scuba-bob relative">
          <CatDiver />
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="scuba-bubble absolute top-2 right-0 block rounded-full border-2 border-[#0E0E10] bg-white/70"
              style={{ width: 10 + (i % 3) * 6, height: 10 + (i % 3) * 6, animationDelay: `${i * 0.55}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
