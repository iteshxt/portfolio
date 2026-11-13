"use client";

import { scrollToTop } from "@/lib/motion";

/** A peel-cornered tab in the footer that scrolls back to the top. */
export function BackToTop() {
  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="top-tab relative rounded-[12px] border-[3px] border-white bg-ink px-3.5 py-2 text-[13px] font-semibold text-paper"
    >
      Back to top ↑
    </button>
  );
}
