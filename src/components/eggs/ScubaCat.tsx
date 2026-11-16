"use client";

import { useEffect } from "react";
import { play } from "@/lib/sound";

const SWIM_MS = 7600;

/** His scuba-cat sticker, die-cut like the rest; the still frame stands in under reduced motion. */
function CatDiver() {
  return (
    <span className="scuba-sticker block -rotate-6 size-[clamp(140px,16vw,210px)] overflow-hidden rounded-[28%] border-[6px] border-white bg-white shadow-[0_14px_24px_rgb(0_0_0/0.22)]">
      <picture className="block size-full">
        <source srcSet="/stickers/cats/scuba-still.webp" media="(prefers-reduced-motion: reduce)" />
        <img src="/stickers/cats/scuba.webp" alt="" width={210} height={210} className="size-full object-cover" />
      </picture>
    </span>
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
