"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import type { HeadlineLine } from "@/content/pages";
import { cn } from "@/lib/cn";
import { fitFontSize } from "@/lib/fit";
import { prefersReducedMotion } from "@/lib/motion";
import { useUI } from "@/store/ui";

/**
 * Two-line headline (docs/design.md §2.3, docs/spec.md §5.4): a condensed
 * sans statement and a serif line that types itself in.
 * Both lines are fitted to the container width; with `cycle`, it deletes and
 * retypes through every line.
 */

type Props = {
  lines: HeadlineLine[];
  as?: "h1" | "h2";
  cycle?: boolean;
  className?: string;
};

const TYPE_MS = 80;
const DELETE_MS = 35;
const HOLD_MS = 1700;

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function Headline({ lines, as: Tag = "h1", cycle = false, className }: Props) {
  const wrapRef = useRef<HTMLHeadingElement>(null);
  const sansRef = useRef<HTMLSpanElement>(null);
  const serifRef = useRef<HTMLSpanElement>(null);
  const typedRef = useRef<HTMLSpanElement>(null);
  const measureSansRef = useRef<HTMLSpanElement>(null);
  const measureSerifRef = useRef<HTMLSpanElement>(null);
  const phase = useUI((s) => s.transitionPhase);
  const canType = phase === "revealing" || phase === "idle";
  const first = lines[0];

  // Fit to width. Sizes are the minimum across all lines so cycling never jumps.
  useIsoLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const fit = () => {
      // Leave a little breathing room so wide lines never kiss the gutters.
      const width = wrap.clientWidth * 0.96;
      const ms = measureSansRef.current;
      const mf = measureSerifRef.current;
      if (!width || !ms || !mf || !sansRef.current || !serifRef.current) return;
      const height = window.innerHeight;
      // Phones get a higher cap so short statements still fill the width.
      const narrow = width < 640;
      const sansMax = Math.min(width * (narrow ? 0.36 : 0.24), height * 0.3);
      const serifMax = Math.min(width * (narrow ? 0.3 : 0.2), height * 0.26);
      const sans = Math.min(...lines.map((l) => fitFontSize(ms, l.sans, width, 20, sansMax)));
      const serif = Math.min(...lines.map((l) => fitFontSize(mf, `${l.serif}_`, width, 18, serifMax)));
      sansRef.current.style.fontSize = `${sans}px`;
      serifRef.current.style.fontSize = `${serif}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    // Hidden (other-shift) headlines measure as 0 wide; refit when the shift flips.
    const mo = new MutationObserver(fit);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-shift"] });
    document.fonts.ready.then(fit);
    document.fonts.addEventListener("loadingdone", fit);
    return () => {
      ro.disconnect();
      mo.disconnect();
      document.fonts.removeEventListener("loadingdone", fit);
    };
  }, [lines]);

  // Clear the serif line before the reveal so it can type itself in.
  useIsoLayoutEffect(() => {
    if (prefersReducedMotion() || !typedRef.current) return;
    typedRef.current.textContent = "";
  }, []);

  useEffect(() => {
    const typed = typedRef.current;
    const sans = sansRef.current;
    const wrap = wrapRef.current;
    if (!canType || !typed || !sans || !wrap || prefersReducedMotion()) return;

    let timer = 0;
    let i = 0;
    let index = 0;
    let deleting = false;
    sans.textContent = lines[0].sans;
    typed.textContent = "";
    delete wrap.dataset.typed;

    const tick = () => {
      const line = lines[index];
      if (!deleting) {
        i += 1;
        typed.textContent = line.serif.slice(0, i);
        if (i < line.serif.length) {
          timer = window.setTimeout(tick, TYPE_MS);
        } else if (cycle && lines.length > 1) {
          deleting = true;
          timer = window.setTimeout(tick, HOLD_MS);
        } else {
          wrap.dataset.typed = "done";
        }
      } else {
        i -= 1;
        typed.textContent = line.serif.slice(0, i);
        if (i > 0) {
          timer = window.setTimeout(tick, DELETE_MS);
        } else {
          deleting = false;
          index = (index + 1) % lines.length;
          sans.textContent = lines[index].sans;
          timer = window.setTimeout(tick, 220);
        }
      }
    };

    timer = window.setTimeout(tick, 260);
    return () => window.clearTimeout(timer);
  }, [canType, cycle, lines]);

  return (
    <Tag ref={wrapRef} className={cn("relative w-full text-center", className)}>
      <span className="sr-only">{`${first.sans} ${first.serif}`}</span>
      <span aria-hidden="true" className="flex flex-col items-center">
        <span ref={sansRef} className="display-sans block whitespace-nowrap text-[clamp(56px,14vw,220px)]">
          {first.sans}
        </span>
        <span
          ref={serifRef}
          className="display-serif block whitespace-nowrap text-accent-text text-[clamp(44px,11vw,170px)]"
        >
          <span ref={typedRef}>{first.serif}</span>
          <span className="headline-caret" />
        </span>
      </span>
      {/* Zero-size, clipped box: the measuring spans keep their natural width without causing overflow. */}
      <span aria-hidden="true" className="pointer-events-none invisible absolute top-0 left-0 size-0 overflow-hidden whitespace-nowrap">
        <span ref={measureSansRef} className="display-sans block w-max" />
        <span ref={measureSerifRef} className="display-serif block w-max" />
      </span>
    </Tag>
  );
}
