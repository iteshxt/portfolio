"use client";

import type { ReactNode } from "react";
import { scrollToElement } from "@/lib/motion";

/** A button that glides to an element on the page (by id), through the smooth scroller. */
export function ScrollButton({ to, className, children }: { to: string; className?: string; children: ReactNode }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        const el = document.getElementById(to);
        if (el) scrollToElement(el, -72);
      }}
    >
      {children}
    </button>
  );
}
