"use client";

import type Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { useUI } from "@/store/ui";

const frozen = (phase: string) => phase === "covering" || phase === "covered";

/**
 * Lenis smooth scrolling (docs/design.md §6), running on its own animation
 * frame so GSAP isn't needed for first load. Lenis itself loads after
 * hydration (the intro covers the screen meanwhile), keeping it out of the
 * first-load budget. Off for reduced motion.
 */
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const phase = useUI((s) => s.transitionPhase);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let cancelled = false;
    import("lenis").then(({ default: LenisClass }) => {
      if (cancelled) return;
      const lenis = new LenisClass({ lerp: 0.12, autoRaf: true });
      // It may arrive while a transition covers the screen.
      if (frozen(useUI.getState().transitionPhase)) lenis.stop();
      lenisRef.current = lenis;
    });
    return () => {
      cancelled = true;
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, []);

  // A new page mounts under the transition sticker: jump to the top there.
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  // Freeze scrolling while the screen is covered.
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (frozen(phase)) lenis.stop();
    else lenis.start();
  }, [phase]);

  return null;
}
