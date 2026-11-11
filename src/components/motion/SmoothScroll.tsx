"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { useUI } from "@/store/ui";

/**
 * Lenis smooth scrolling driven by GSAP's ticker, so ScrollTrigger stays in
 * sync (docs/design.md §6). Off for reduced motion.
 */
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const phase = useUI((s) => s.transitionPhase);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1 });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // A new page mounts under the transition sticker: jump to the top there.
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  // Page heights change after every reveal; recompute trigger positions.
  useEffect(() => {
    if (phase !== "idle") return;
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(raf);
  }, [phase, pathname]);

  // Freeze scrolling while the screen is covered.
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (phase === "covering" || phase === "covered") lenis.stop();
    else lenis.start();
  }, [phase]);

  return null;
}
