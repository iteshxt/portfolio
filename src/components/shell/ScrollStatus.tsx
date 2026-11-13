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

  useEffect(() => {
    // Wait a frame so the new page's sections are in the DOM.
    let io: IntersectionObserver | undefined;
    const raf = requestAnimationFrame(() => {
      const els = [...document.querySelectorAll<HTMLElement>("main [data-section]")].filter((el) => el.offsetParent !== null);
      setSections(els.map((el) => el.dataset.section ?? ""));
      setCurrent(0);
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) if (e.isIntersecting) setCurrent(els.indexOf(e.target as HTMLElement));
        },
        { rootMargin: "-45% 0px -54% 0px" },
      );
      els.forEach((el) => io!.observe(el));
    });
    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, [pathname]);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
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
  }, [pathname]);

  if (!sections.length) return null;
  const label = sections[current] ?? sections[0];
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-4 left-1/2 z-40 hidden -translate-x-1/2 overflow-hidden rounded-full border-[3px] border-white bg-surface shadow-[0_8px_18px_-10px_rgb(0_0_0/0.4)] sm:block"
    >
      <span className="flex items-center gap-2 px-4 pt-1.5 pb-2 font-mono text-[12px] tracking-wide uppercase">
        <span className="text-accent-text font-bold">{String(current + 1).padStart(2, "0")}</span>
        <span key={label} className="status-label text-fg">
          {label}
        </span>
        <span className="text-fg-muted">/ {String(sections.length).padStart(2, "0")}</span>
      </span>
      <span ref={barRef} className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-violet" />
    </div>
  );
}
