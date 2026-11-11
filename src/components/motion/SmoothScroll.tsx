"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { useUI } from "@/store/ui";

/**
 * Lenis smooth scrolling (docs/design.md §6), running on its own animation
 * frame so GSAP isn't needed for first load. Off for reduced motion.
 */
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const phase = useUI((s) => s.transitionPhase);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.12, autoRaf: true });
    lenisRef.current = lenis;
    return () => {
      lenis.destroy();
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
    if (phase === "covering" || phase === "covered") lenis.stop();
    else lenis.start();
  }, [phase]);

  return null;
}
