"use client";

import { useEffect } from "react";
import { foundEgg, markEgg } from "@/lib/eggs";

export const AWAY_TITLE = "come back (╥﹏╥)";

/**
 * The small, no-UI eggs (docs/prd.md §6.5):
 * - the tab title begs you to come back while you're on another tab
 * - 3am mode: between 02:00 and 04:59 the bootstrap script forced night and set
 *   data-owl; once the intro is done, a toast admits we're awake too
 */
export function QuietEggs() {
  useEffect(() => {
    let saved = "";
    const onVisibility = () => {
      if (document.hidden) {
        markEgg("tab");
        saved = document.title;
        document.title = AWAY_TITLE;
      } else if (saved) {
        document.title = saved;
        saved = "";
      }
    };
    const onPrint = () => markEgg("print");
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("beforeprint", onPrint);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("beforeprint", onPrint);
    };
  }, []);

  useEffect(() => {
    if (document.documentElement.dataset.owl !== "true") return;
    const timer = window.setTimeout(
      () => foundEgg("owl", "Why are you awake?", "Same. The site went dark to keep you company."),
      2600,
    );
    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
