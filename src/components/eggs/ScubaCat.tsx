"use client";

import { useEffect } from "react";
import { play } from "@/lib/sound";

const SWIM_MS = 7600;

/** A scuba-diving cat (drawn for this site), nodding to his scuba-cat boot theme. */
function CatDiver() {
  return (
    <svg viewBox="0 0 240 150" className="h-auto w-[clamp(180px,22vw,300px)]" aria-hidden="true">
      {/* flippers */}
      <path d="M38 98c-16-4-28 2-34 12 12 0 22-2 30-6" fill="#CCFF33" stroke="#0E0E10" strokeWidth="4" strokeLinejoin="round" />
      <path d="M46 112c-12 6-18 16-16 28 9-6 16-14 20-22" fill="#CCFF33" stroke="#0E0E10" strokeWidth="4" strokeLinejoin="round" />
      {/* tail */}
      <path d="M44 84c-18-6-26-24-18-36" fill="none" stroke="#0E0E10" strokeWidth="14" strokeLinecap="round" />
      <path d="M44 84c-18-6-26-24-18-36" fill="none" stroke="#FFC700" strokeWidth="7" strokeLinecap="round" />
      {/* body */}
      <ellipse cx="96" cy="96" rx="58" ry="30" fill="#FFC700" stroke="#0E0E10" strokeWidth="4" />
      <path d="M70 76c2 12 2 26-2 40M96 68c2 14 2 32-2 52" stroke="#E0A800" strokeWidth="5" strokeLinecap="round" fill="none" />
      {/* air tank */}
      <rect x="62" y="56" width="62" height="20" rx="10" fill="#7A2CFF" stroke="#0E0E10" strokeWidth="4" />
      {/* head */}
      <path d="M150 48 158 20 176 40M196 40l14-20 4 30" fill="#FFC700" stroke="#0E0E10" strokeWidth="4" strokeLinejoin="round" />
      <circle cx="182" cy="74" r="40" fill="#FFC700" stroke="#0E0E10" strokeWidth="4" />
      {/* mask */}
      <rect x="152" y="54" width="62" height="34" rx="14" fill="#CBB8FF" fillOpacity="0.85" stroke="#0E0E10" strokeWidth="5" />
      <circle cx="170" cy="70" r="5" fill="#0E0E10" />
      <circle cx="196" cy="70" r="5" fill="#0E0E10" />
      <path d="M160 62c4-3 8-4 12-3" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* nose + mouth */}
      <path d="M180 96l4 4 4-4" fill="none" stroke="#0E0E10" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* snorkel */}
      <path d="M214 66c12 0 16-8 16-20V18" fill="none" stroke="#0E0E10" strokeWidth="11" strokeLinecap="round" />
      <path d="M214 66c12 0 16-8 16-20V18" fill="none" stroke="#FF4B2B" strokeWidth="5" strokeLinecap="round" />
      {/* paw */}
      <ellipse cx="140" cy="118" rx="12" ry="8" fill="#FFC700" stroke="#0E0E10" strokeWidth="4" />
    </svg>
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
