"use client";

import { useEffect, useState } from "react";
import { TransitionLink } from "@/components/transition/TransitionLink";

/**
 * Minimal top bar: the wordmark placeholder (the logo comes after the site,
 * see docs/prd.md §4). It slides away while scrolling down so it never sits
 * on top of content, and comes back on the way up.
 */
export function TopBar() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (Math.abs(y - last) < 6) return;
        setHidden(y > last && y > 120);
        last = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header
      data-hidden={hidden}
      className="px-gutter pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between pt-5 transition-transform duration-500 ease-[var(--ease-expo-out)] data-[hidden=true]:-translate-y-[160%]"
    >
      <TransitionLink
        href="/"
        transitionLabel="Home"
        aria-label="Home"
        className="pointer-events-auto font-serif text-[28px] italic leading-none"
      >
        itesh
      </TransitionLink>
    </header>
  );
}
