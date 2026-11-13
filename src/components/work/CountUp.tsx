"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * A number that ticks up from zero once it's on screen. The server renders the
 * final value (no layout shift, nothing to hydrate differently); the count runs
 * on the DOM node only.
 */
export function CountUp({ to, duration = 1400, pad = 2 }: { to: number; duration?: number; pad?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const fmt = (n: number) => String(n).padStart(pad, "0");
    el.textContent = fmt(0);
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      // Starts once the page transition has had a moment to clear.
      const start = performance.now() + 450;
      const tick = (now: number) => {
        const t = Math.min(1, Math.max(0, (now - start) / duration));
        el.textContent = fmt(Math.round(to * (1 - (1 - t) ** 3)));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration, pad]);

  return (
    <span ref={ref} className="tabular-nums">
      {String(to).padStart(pad, "0")}
    </span>
  );
}
