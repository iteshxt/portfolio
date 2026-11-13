"use client";

import { prefersReducedMotion } from "@/lib/motion";

/** A peel-cornered tab in the footer that scrolls back to the top. */
export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" })}
      className="top-tab relative rounded-[14px] border-[3px] border-white bg-ink px-4 py-3 text-[14px] font-semibold text-paper"
    >
      Back to top ↑
    </button>
  );
}
