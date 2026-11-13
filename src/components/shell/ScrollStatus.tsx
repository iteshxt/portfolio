"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { scrollToElement } from "@/lib/motion";

/**
 * Top-centre sticker pill (docs/design.md §2.7): a ring around the section number
 * fills with your progress through the page, the current section's name slides
 * in, and a row of dots (one per [data-section]) jumps to any section. Hidden on
 * phones and on pages without sections.
 */
export function ScrollStatus() {
  const pathname = usePathname();
  const [sections, setSections] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const ringRef = useRef<SVGCircleElement>(null);
  const els = useRef<HTMLElement[]>([]);

  // The current section is the last one whose top has passed the middle of the screen.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      ringRef.current?.style.setProperty("stroke-dashoffset", String(100 - p * 100));
      const mid = window.innerHeight / 2;
      let idx = 0;
      els.current.forEach((el, k) => {
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
      els.current = [...document.querySelectorAll<HTMLElement>("main [data-section]")].filter((el) => el.offsetParent !== null);
      setSections(els.current.map((el) => el.dataset.section ?? ""));
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
    <nav
      aria-label="Sections on this page"
      className="status-pill fixed top-4 left-1/2 z-40 hidden -translate-x-1/2 items-center gap-3 rounded-full border-[3px] border-white bg-surface py-1.5 pr-4 pl-1.5 text-fg sm:flex"
    >
      {/* A ring that fills with your progress through the page, around the section number. */}
      <span aria-hidden="true" className="relative grid size-8 place-items-center">
        <svg viewBox="0 0 24 24" className="absolute inset-0 -rotate-90">
          <circle cx="12" cy="12" r="10" fill="none" stroke="var(--line)" strokeWidth="2.5" />
          <circle ref={ringRef} cx="12" cy="12" r="10" fill="none" stroke="var(--violet)" strokeWidth="2.5" strokeLinecap="round" pathLength={100} strokeDasharray="100" strokeDashoffset="100" />
        </svg>
        <span className="text-[11px] font-bold tabular-nums">{current + 1}</span>
      </span>
      <span key={label} aria-live="polite" className="status-label min-w-[7.5rem] text-[14px] leading-none font-semibold tracking-[-0.01em]">
        {label}
      </span>
      <span className="flex items-center gap-1.5">
        {sections.map((name, k) => (
          <button
            key={name}
            type="button"
            aria-label={`Go to ${name}`}
            aria-current={k === current ? "true" : undefined}
            onClick={() => els.current[k] && scrollToElement(els.current[k])}
            data-cursor={name}
            className={cn(
              "h-2 rounded-full transition-all duration-300 ease-[var(--ease-expo-out)] hover:scale-125",
              k === current ? "w-5 bg-violet" : k < current ? "w-2 bg-lavender" : "w-2 bg-line",
            )}
          />
        ))}
      </span>
    </nav>
  );
}
