"use client";

import { useEffect } from "react";
import { foundEgg } from "@/lib/eggs";

const AWAY_TITLE = "come back (╥﹏╥)";

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
        saved = document.title;
        document.title = AWAY_TITLE;
      } else if (saved) {
        document.title = saved;
        saved = "";
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (document.documentElement.dataset.owl !== "true") return;
    const timer = window.setTimeout(
      () => foundEgg("owl", "Why are you awake?", "Same. The night shift is on: this is where the details live."),
      2600,
    );
    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
