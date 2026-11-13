"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Site-wide motion (docs/design.md §6):
 * - [data-animate] elements get data-in when they scroll into view (CSS does
 *   the rest: headings rise, stickers slap on, rows stagger via --d);
 * - [data-parallax] elements drift with scroll by their factor and fade;
 * - .btn buttons lean towards the cursor (magnetic);
 * - a custom pointer sticker replaces the system cursor on fine pointers (text
 *   fields keep the native I-beam) and shows [data-cursor] labels.
 * Reduced motion: everything shows at rest, no cursor, no parallax.
 */
export function MotionLayer() {
  const pathname = usePathname();
  const cursor = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  // Scroll reveals; re-scanned on route change and when new nodes appear.
  useEffect(() => {
    const reduced = prefersReducedMotion();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.in = "";
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    const scan = () => {
      document.querySelectorAll<HTMLElement>("[data-animate]:not([data-in])").forEach((el) => {
        if (reduced) el.dataset.in = "";
        else io.observe(el);
      });
    };
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  // Parallax.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let raf = 0;
    const update = () => {
      // The hero sheet's corner curls further as you scroll away from it.
      document.querySelectorAll<HTMLElement>("[data-curl]").forEach((el) => {
        // By the time the hero leaves, most of the sheet has peeled away diagonally.
        const p = Math.min(1, window.scrollY / (window.innerHeight * 0.95));
        const reach = Math.max(el.offsetWidth, el.offsetHeight) * 1.1;
        const corner = Math.min(112, Math.max(64, window.innerWidth * 0.07)); // matches --corner in CSS
        el.style.setProperty("--curl", `${(1 + (reach / corner - 1) * p ** 1.4).toFixed(3)}`);
      });
      document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        const f = Number(el.dataset.parallax) || 0.2;
        const y = window.scrollY;
        if (y > window.innerHeight * 1.5) return;
        el.style.translate = `0 ${(y * f).toFixed(1)}px`;
        if (el.dataset.parallaxFade !== undefined) el.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.8)));
      });
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    // Only once scrolling starts: setting styles before hydration finishes would mismatch.
    if (window.scrollY > 0) onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  // Magnetic buttons and the custom cursor, which replaces the system one (fine pointers only).
  useEffect(() => {
    const el = cursor.current;
    if (!el || prefersReducedMotion() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const root = document.documentElement;
    root.dataset.customCursor = "";
    let raf = 0;
    let x = -100;
    let y = -100;
    let magnet: HTMLElement | null = null;

    const place = () => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const release = () => {
      if (magnet) magnet.style.translate = "";
      magnet = null;
    };
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(place);
      el.dataset.on = "";
      const target = e.target as HTMLElement;
      const typing = target.closest("input, textarea, [contenteditable=true]");
      const tagged = target.closest<HTMLElement>("[data-cursor]");
      const interactive = target.closest("a, button, [role=option], label, summary");
      el.dataset.mode = typing ? "text" : tagged ? "label" : interactive ? "hover" : "";
      if (label.current) label.current.textContent = tagged?.dataset.cursor ?? "";
      const btn = target.closest<HTMLElement>(".btn");
      if (btn !== magnet) release();
      if (btn) {
        magnet = btn;
        const r = btn.getBoundingClientRect();
        btn.style.translate = `${((e.clientX - (r.left + r.width / 2)) * 0.25).toFixed(1)}px ${((e.clientY - (r.top + r.height / 2)) * 0.35).toFixed(1)}px`;
      }
    };
    const onDown = () => (el.dataset.down = "");
    const onUp = () => delete el.dataset.down;
    const onLeave = () => {
      delete el.dataset.on;
      release();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    root.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      release();
      delete root.dataset.customCursor;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={cursor} aria-hidden="true" className="site-cursor pointer-events-none fixed top-0 left-0 z-[200]">
      {/* A rounded pointer sticker; its tip sits exactly on the pointer. */}
      <svg viewBox="0 0 28 32" className="site-cursor-arrow">
        <path d="M3 2.5 24.5 14.2c1.4.8 1.2 2.9-.4 3.3l-8.6 2.4-4.4 7.8c-.8 1.4-2.9 1.1-3.3-.5L2 4.3C1.7 3 2 2.1 3 2.5Z" />
      </svg>
      <span ref={label} className="site-cursor-label" />
    </div>
  );
}
