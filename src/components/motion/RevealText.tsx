"use client";

import { useRef, type ReactNode } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Masked line reveal for big statements (docs/design.md §6): each line rises
 * from below its mask with expo out when the block scrolls into view.
 */
type Props = {
  as?: "p" | "h2" | "h3" | "div";
  className?: string;
  children: ReactNode;
};

export function RevealText({ as: Tag = "p", className, children }: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      el.style.visibility = "visible";
      if (prefersReducedMotion()) return;
      const split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "reveal-line",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 120,
            duration: 1,
            ease: "expo.out",
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }),
      });
      return () => split.revert();
    },
    { scope: ref },
  );

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
