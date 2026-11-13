"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * The DiaLabs robot (its own mark, docs/design.md §2.13) as a big die-cut
 * sticker: its eyes follow the cursor, it blinks now and then, and the antenna
 * light pulses. Still for touch and reduced motion (the blink and pulse are CSS).
 */
export function LabBot() {
  const eyes = useRef<SVGGElement>(null);

  useEffect(() => {
    const g = eyes.current;
    if (!g || prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    const onMove = (e: PointerEvent) => {
      const r = g.ownerSVGElement?.getBoundingClientRect();
      if (!r) return;
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height * 0.55);
      const d = Math.hypot(dx, dy) || 1;
      const reach = Math.min(1, d / 420);
      tx = (dx / d) * 7 * reach;
      ty = (dy / d) * 6 * reach;
      if (!raf) raf = requestAnimationFrame(step);
    };
    const step = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      g.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.05 ? requestAnimationFrame(step) : 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="labbot relative grid aspect-square w-[clamp(220px,30vw,400px)] place-items-center rounded-full border-[8px] border-white bg-violet text-white shadow-[0_34px_60px_-30px_rgb(0_0_0/0.55)]">
      <svg viewBox="0 0 130 130" aria-hidden="true" className="w-[62%] overflow-visible" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <circle className="labbot-light" cx="65" cy="11" r="6" />
        <path d="M65 17v11" />
        <rect x="20" y="28" width="90" height="86" rx="34" />
        <path d="M20 58h-6a6 6 0 0 0-6 6v14a6 6 0 0 0 6 6h6M110 58h6a6 6 0 0 1 6 6v14a6 6 0 0 1-6 6h-6" />
        <rect x="36" y="46" width="58" height="52" rx="20" />
        <g ref={eyes}>
          <g className="labbot-eyes">
            <ellipse cx="53" cy="72" rx="4.5" ry="8.5" fill="currentColor" stroke="none" />
            <ellipse cx="77" cy="72" rx="4.5" ry="8.5" fill="currentColor" stroke="none" />
          </g>
        </g>
      </svg>
    </div>
  );
}
