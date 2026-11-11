"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Fades and lifts its content in when it scrolls into view (docs/design.md §6:
 * y 40 → 0, expo out, 0.8s). Pure CSS transition + IntersectionObserver.
 */
type Props = {
  as?: "div" | "section" | "li" | "article" | "p" | "header";
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

export function Reveal({ as: Tag = "div", delay = 0, className, style, children }: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
      el.dataset.in = "";
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.in = "";
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        ref.current = node;
      }}
      data-reveal=""
      className={className}
      style={{ ...style, ["--reveal-delay" as string]: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
