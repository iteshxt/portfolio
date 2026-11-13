"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Top-centre sticker pill (docs/design.md §2.7): the section you're in
 * ("02 · Selected work", from [data-section] on the page) and a line that fills
 * with your scroll through the page. Hidden on pages without sections.
 */
export function ScrollStatus() {
  const pathname = usePathname();
  const [sections, setSections] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const barRef = useRef<HTMLSpanElement>(null);

  // The current section is the last one whose top has passed the middle of the screen.
  useEffect(() => {
    let els: HTMLElement[] = [];
    let raf = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
      const mid = window.innerHeight / 2;
      let idx = 0;
      els.forEach((el, k) => {
        if (el.getBoundingClientRect().top <= mid) idx = k;
      });
      setCurrent(idx);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    // Wait a frame so the new page's sections are in the DOM.
    const start = requestAnimationFrame(() => {
      els = [...document.querySelectorAll<HTMLElement>("main [data-section]")].filter((el) => el.offsetParent !== null);
      setSections(els.map((el) => el.dataset.section ?? ""));
      update();
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(start);
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  if (!sections.length) return null;
  const label = sections[current] ?? sections[0];
  return (
    <div
      aria-hidden="true"
      className="status-pill pointer-events-none fixed top-4 left-1/2 z-40 hidden -translate-x-1/2 overflow-hidden rounded-full border-[3px] border-white bg-surface text-fg sm:block"
    >
      <span className="flex items-center gap-2.5 py-1.5 pr-4 pl-1.5">
        <span className="rounded-full bg-violet px-2 py-0.5 text-[12px] leading-none font-bold text-white tabular-nums">
          {String(current + 1).padStart(2, "0")}
        </span>
        <span key={label} className="status-label text-[14px] leading-none font-semibold tracking-[-0.01em]">
          {label}
        </span>
        <span className="text-[12px] leading-none text-fg-muted tabular-nums">of {String(sections.length).padStart(2, "0")}</span>
      </span>
      {/* No scale utility here: it would multiply with the scaleX set on scroll and pin the bar at zero. */}
      <span ref={barRef} className="absolute inset-x-0 bottom-0 h-[4px] origin-left bg-violet" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}
