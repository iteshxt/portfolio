"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Pins its area while the page scroll drives a horizontal track of children
 * (docs/design.md §2.9): the outer box gets the height the sideways travel
 * needs, the inner box sticks to the viewport and the track slides left. From
 * tablet width up; phones get a swipeable snap carousel instead, and reduced
 * motion a plain row.
 * Exposes progress as --track-progress (0–1) for counters and bars.
 */
export function PinnedTrack({ header, children }: { header?: ReactNode; children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const o = outer.current;
    const t = track.current;
    if (!o || !t || prefersReducedMotion()) return;
    const wide = window.matchMedia("(min-width: 768px)");
    let raf = 0;
    let distance = 0;

    const measure = () => {
      if (!wide.matches) {
        o.style.height = "";
        t.style.transform = "";
        distance = 0;
        return;
      }
      distance = Math.max(0, t.scrollWidth - window.innerWidth);
      o.style.height = `${distance + window.innerHeight}px`;
      update();
    };
    const update = () => {
      if (!distance) return;
      const p = Math.min(1, Math.max(0, -o.getBoundingClientRect().top / distance));
      t.style.transform = `translate3d(${(-p * distance).toFixed(1)}px, 0, 0)`;
      o.style.setProperty("--track-progress", p.toFixed(4));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(t);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    wide.addEventListener("change", measure);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
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
