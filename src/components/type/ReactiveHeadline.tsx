"use client";

import { Fragment, useEffect, useRef, type ReactNode } from "react";
import { Sticker, type StickerTone } from "@/components/ui/Sticker";
import { prefersReducedMotion } from "@/lib/motion";

/** Plain text, or a word set as a sticker. */
export type HeadlinePart = string | { word: string; tone: StickerTone; tilt: number; after?: string };

/** Mona Sans axes: resting, and at the cursor (heavier and narrower, so line length stays put). */
const REST = { wght: 600, wdth: 82 };
const PEAK = { wght: 900, wdth: 66 };
const RADIUS = 240;

function letters(text: string, key: string): ReactNode {
  return text.split(/(\s+)/).map((chunk, i) =>
    /^\s+$/.test(chunk) ? (
      <Fragment key={`${key}-${i}`}>{chunk}</Fragment>
    ) : (
      // Words stay unbroken; each letter is its own span for the effect.
      <span key={`${key}-${i}`} className="inline-block whitespace-nowrap">
        {[...chunk].map((ch, j) => (
          <span key={j} data-rx="" className="inline-block">
            {ch}
          </span>
        ))}
      </span>
    ),
  );
}

/**
 * The home headline (docs/design.md §2.5): letters near the cursor swell (weight
 * up, width down) and relax as it moves away, on a smoothed rAF loop that sleeps
 * when nothing moves. Fine pointers only; static for touch and reduced motion.
 */
export function ReactiveHeadline({ parts, className }: { parts: HeadlinePart[]; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const els = [...root.querySelectorAll<HTMLElement>("[data-rx]")];
    const level = new Float32Array(els.length);
    let centres: { x: number; y: number }[] = [];
    const pointer = { x: -9999, y: -9999 };
    let raf = 0;
    let running = false;

    const measure = () => {
      centres = els.map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2 + window.scrollX, y: r.top + r.height / 2 + window.scrollY };
      });
    };

    const frame = () => {
      let moving = false;
      const px = pointer.x + window.scrollX;
      const py = pointer.y + window.scrollY;
      for (let i = 0; i < els.length; i++) {
        const c = centres[i];
        const d = Math.hypot(c.x - px, c.y - py);
        const target = d < RADIUS ? (1 - d / RADIUS) ** 2 : 0;
        const next = level[i] + (target - level[i]) * 0.16;
        if (Math.abs(next - level[i]) > 0.002) moving = true;
        level[i] = next;
        els[i].style.fontVariationSettings = `"wght" ${(REST.wght + (PEAK.wght - REST.wght) * next).toFixed(0)}, "wdth" ${(REST.wdth + (PEAK.wdth - REST.wdth) * next).toFixed(1)}`;
      }
      if (moving) raf = requestAnimationFrame(frame);
      else running = false;
    };
    const wake = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    };
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      wake();
    };
    const onLeave = () => {
      pointer.x = pointer.y = -9999;
      wake();
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    document.fonts.ready.then(measure);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <h1 ref={ref} className={className}>
      {parts.map((part, i) =>
        typeof part === "string" ? (
          <Fragment key={i}>{letters(part, `t${i}`)}</Fragment>
        ) : (
          <span key={i} className="whitespace-nowrap">
            <Sticker size="word" tone={part.tone} tilt={part.tilt}>
              {letters(part.word, `w${i}`)}
            </Sticker>
            {part.after}
          </span>
        ),
      )}
    </h1>
  );
}
