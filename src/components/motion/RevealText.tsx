"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Masked line reveal for big statements (docs/design.md §6): each line rises
 * from below its mask with expo out when the block scrolls into view. GSAP
 * (with SplitText + ScrollTrigger) is loaded on demand, after first paint.
 */
type Props = {
  as?: "p" | "h2" | "h3" | "div";
  className?: string;
  children: ReactNode;
};

export function RevealText({ as: Tag = "p", className, children }: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.visibility = "visible";
      return;
    }
    let cancelled = false;
    let revert: (() => void) | undefined;

    import("@/lib/gsap")
      .then(({ gsap, SplitText }) => {
        if (cancelled) return;
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "reveal-line",
          autoSplit: true,
          // Lines-only splitting keeps words intact for screen readers; skip the
          // aria-label SplitText would put on the paragraph (not allowed on <p>).
          aria: "none",
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 120,
              duration: 1,
              ease: "expo.out",
              stagger: 0.08,
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            }),
        });
        el.style.visibility = "visible";
        revert = () => split.revert();
      })
      .catch(() => {
        // If the animation code can't load, just show the text.
        el.style.visibility = "visible";
      });

    return () => {
      cancelled = true;
      revert?.();
    };
  }, []);

  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        ref.current = node;
      }}
      data-reveal-text=""
      className={className}
    >
      {children}
    </Tag>
  );
}
