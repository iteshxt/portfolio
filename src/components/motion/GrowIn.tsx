"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * A block that grows from an inset rounded sticker into a full-bleed band as it
 * scrolls into view (docs/design.md §2.11), driven by its position on each
 * frame of scroll. Full size from the start for reduced motion.
 */
export function GrowIn({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let raf = 0;
    const update = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Starts once the block is a fifth of the way up the screen, done by the time it nears the top.
      const p = Math.min(1, Math.max(0, (vh * 0.8 - r.top) / (vh * 0.6)));
      const e = 1 - (1 - p) ** 3;
      el.style.clipPath = `inset(0 ${((1 - e) * 7).toFixed(2)}% round ${((1 - e) * 56).toFixed(1)}px)`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={ref} id={id} className={className}>
      {children}
    </div>
  );
}
