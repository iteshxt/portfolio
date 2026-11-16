"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { onScrollFrame } from "@/lib/scroll-frame";

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
    let top = 0;
    let vh = 0;
    let last = "";
    // Shared scroll loop (lib/scroll-frame): measure, then write only when the shape changes.
    const read = () => {
      top = el.getBoundingClientRect().top;
      vh = window.innerHeight;
    };
    const write = () => {
      // Starts once the block is a fifth of the way up the screen, done by the time it nears the top.
      const p = Math.min(1, Math.max(0, (vh * 0.8 - top) / (vh * 0.6)));
      const e = 1 - (1 - p) ** 3;
      const next = `inset(0 ${((1 - e) * 7).toFixed(2)}% round ${((1 - e) * 56).toFixed(1)}px)`;
      if (next !== last) el.style.clipPath = last = next;
    };
    read();
    write();
    return onScrollFrame({ read, write });
  }, []);

  return (
    <div ref={ref} id={id} className={className}>
      {children}
    </div>
  );
}
