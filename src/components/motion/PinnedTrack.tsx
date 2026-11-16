"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { onScrollFrame } from "@/lib/scroll-frame";

/**
 * Pins its area while the page scroll drives a horizontal track of children
 * (docs/design.md §2.9): the outer box gets the height the sideways travel
 * needs, the inner box sticks to the viewport and the track slides left. From
 * tablet width up; phones get a swipeable snap carousel instead, and reduced
 * motion a plain row.
 */
export function PinnedTrack({ header, children }: { header?: ReactNode; children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const o = outer.current;
    const t = track.current;
    if (!o || !t || prefersReducedMotion()) return;
    const wide = window.matchMedia("(min-width: 768px)");
    let distance = 0;
    let top = 0;
    let last = "";

    const measure = () => {
      if (!wide.matches) {
        o.style.height = "";
        t.style.transform = "";
        distance = 0;
        return;
      }
      distance = Math.max(0, t.scrollWidth - window.innerWidth);
      o.style.height = `${distance + window.innerHeight}px`;
      read();
      write();
    };
    // Shared scroll loop (lib/scroll-frame): measure in the read phase, move in the write phase.
    const read = () => {
      if (distance) top = o.getBoundingClientRect().top;
    };
    const write = () => {
      if (!distance) return;
      const p = Math.min(1, Math.max(0, -top / distance));
      const next = `translate3d(${(-p * distance).toFixed(1)}px, 0, 0)`;
      if (next !== last) t.style.transform = last = next;
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(t);
    const off = onScrollFrame({ read, write });
    window.addEventListener("resize", measure);
    wide.addEventListener("change", measure);
    return () => {
      off();
      ro.disconnect();
      window.removeEventListener("resize", measure);
      wide.removeEventListener("change", measure);
      o.style.height = "";
      t.style.transform = "";
    };
  }, []);

  return (
    <div ref={outer} className="relative">
      <div className="flex flex-col gap-10 md:sticky md:top-0 md:h-screen md:justify-center md:gap-[4vh] md:overflow-hidden">
        {header}
        <div
          ref={track}
          className="px-gutter flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6 [scrollbar-width:none] will-change-transform md:w-max md:snap-none md:items-center md:gap-[3vw] md:overflow-visible md:pr-[12vw] md:pb-0"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
