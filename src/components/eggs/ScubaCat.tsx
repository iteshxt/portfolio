"use client";

import { useEffect, useMemo, type CSSProperties } from "react";
import { play } from "@/lib/sound";

/** How many cats in the flood, and the longest any of them takes (delay + swim). */
const CATS = 16;
const SWIM_MS = 9800;

type Swimmer = {
  top: number;
  scale: number;
  delay: number;
  dur: number;
  tilt: number;
  back: boolean;
  bob: number;
};

/** Small seeded generator so a run's school is random but stable across re-renders. */
function school(seed: number): Swimmer[] {
  let s = (seed * 2654435761) % 2 ** 32 || 1;
  const rnd = () => (s = (s * 1664525 + 1013904223) % 2 ** 32) / 2 ** 32;
  // The lead cat swims the middle at full size; it's the one reduced motion keeps.
  const lead: Swimmer = {
    top: 38,
    scale: 1,
    delay: 0.1,
    dur: 6.2,
    tilt: -6,
    back: false,
    bob: 1.6,
  };
  return Array.from({ length: CATS }, (_, i) =>
    i === 0
      ? lead
      : {
          // Spread the rows down the screen, then jitter them so it doesn't look like a grid.
          top: Math.min(
            86,
            Math.max(-4, (i / CATS) * 92 - 4 + (rnd() - 0.5) * 10),
          ),
          scale: 0.45 + rnd() * 0.75,
          delay: rnd() * 3.2,
          dur: 4.8 + rnd() * 1.8,
          tilt: (rnd() - 0.5) * 24,
          back: rnd() < 0.3,
          bob: 1.2 + rnd() * 0.9,
        },
  );
}

/** His scuba-cat sticker (a transparent cut-out), die-cut with a white outline; the still frame stands in under reduced motion. */
function CatDiver({
  flip = false,
  tilt = -6,
}: {
  flip?: boolean;
  tilt?: number;
}) {
  return (
    <picture
      className="scuba-sticker block size-[clamp(150px,17vw,220px)]"
      style={{ transform: `rotate(${tilt}deg) scaleX(${flip ? -1 : 1})` }}
    >
      <source
        srcSet="/stickers/cats/scuba-still.webp"
        media="(prefers-reduced-motion: reduce)"
      />
      <img
        src="/stickers/cats/scuba.webp"
        alt=""
        width={200}
        height={200}
        className="size-full object-contain"
      />
    </picture>
  );
}

function Bubbles() {
  return [0, 1, 2, 3].map((i) => (
    <span
      key={i}
      className="scuba-bubble absolute top-2 right-0 block rounded-full border-2 border-[#0E0E10] bg-white/70"
      style={{
        width: 10 + (i % 3) * 6,
        height: 10 + (i % 3) * 6,
        animationDelay: `${i * 0.6}s`,
      }}
    />
  ));
}

/**
 * A flood of scuba cats swims across the screen (both ways, all sizes) trailing bubbles,
 * then calls `onDone`. Triggered by the Konami code, the terminal's `scuba` and the
 * barcode egg (see LazyOverlays). Reduced motion gets one calm cat instead of the flood.
 */
export function ScubaCat({ run, onDone }: { run: number; onDone: () => void }) {
  const cats = useMemo(() => school(run + 1), [run]);

  useEffect(() => {
    const bubbles = window.setInterval(() => play("bubble"), 450);
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
    <div
      key={run}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[85] overflow-hidden"
    >
      {cats.map((c, i) => (
        <div
          key={i}
          className={`scuba-swim absolute left-0 ${c.back ? "scuba-swim-back" : ""} ${i > 0 ? "scuba-extra" : ""}`}
          style={
            {
              top: `${c.top}%`,
              "--delay": `${c.delay}s`,
              "--dur": `${c.dur}s`,
            } as CSSProperties
          }
        >
          <div
            className="scuba-bob relative"
            style={{ scale: c.scale, animationDuration: `${c.bob}s` }}
          >
            <CatDiver flip={c.back} tilt={c.tilt} />
            {i % 3 === 0 && <Bubbles />}
          </div>
        </div>
      ))}
    </div>
  );
}
