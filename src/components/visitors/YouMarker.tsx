"use client";

import { useEffect, useRef } from "react";
import { scrollToElement } from "@/lib/motion";
import { useUI } from "@/store/ui";

/**
 * Someone who just signed arrives with ?you=<id>: once the page transition has finished (scrolling
 * is frozen while it covers the screen), scroll to their stamp, thump it in and write "that's you!"
 * beside it (docs/design.md §2.18). Pure DOM work after hydration, so the server-rendered passport
 * is the same for everyone.
 */
export function YouMarker() {
  const phase = useUI((s) => s.transitionPhase);
  const done = useRef(false);
  useEffect(() => {
    if (done.current || phase !== "idle") return;
    const id = new URLSearchParams(window.location.search).get("you");
    if (!id || !/^[A-Za-z0-9_-]{8,64}$/.test(id)) return;
    const slot = document.querySelector<HTMLElement>(`[data-stamp="${id}"]`);
    if (!slot) return;
    done.current = true;
    const t = window.setTimeout(() => {
      slot.dataset.you = "";
      scrollToElement(slot, -window.innerHeight * 0.3);
    }, 250);
    return () => window.clearTimeout(t);
  }, [phase]);
  return null;
}
