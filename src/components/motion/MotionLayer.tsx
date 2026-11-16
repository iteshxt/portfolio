"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { onScrollFrame } from "@/lib/scroll-frame";

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
    // Start once the browser is idle: marking elements before React has hydrated them would mismatch.
    const mo = new MutationObserver(scan);
    const start = () => {
      scan();
      mo.observe(document.body, { childList: true, subtree: true });
    };
    const canIdle = typeof window.requestIdleCallback === "function";
    const idle: number = canIdle ? window.requestIdleCallback(start, { timeout: 600 }) : window.setTimeout(start, 300);
    return () => {
      if (canIdle) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  // Parallax and the hero curl, on the shared scroll loop (lib/scroll-frame): all
  // measuring first, then writing, and only when a value actually changes.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    type Curl = { targets: HTMLElement[]; reach: number; corner: number; vw: number; vh: number; last: string };
    type Drift = { f: number; fade: boolean; lastT: string; lastO: string };
    // Elements are looked up each frame (pages stream in), their state kept per element.
    const curlState = new WeakMap<HTMLElement, Curl>();
    const driftState = new WeakMap<HTMLElement, Drift>();
    let curls: [HTMLElement, Curl][] = [];
    let drifts: [HTMLElement, Drift][] = [];
    let y = 0;
    let vh = 0;
    const read = () => {
      y = window.scrollY;
      vh = window.innerHeight;
      const vw = window.innerWidth;
      curls = [...document.querySelectorAll<HTMLElement>("[data-curl]")].map((el) => {
        let c = curlState.get(el);
        if (!c) {
          // --curl is a registered, non-inherited property (globals.css): it's set on each
          // element that draws the fold (the section, the sheet and the flap), so changing it
          // doesn't restyle everything inside the hero.
          c = { targets: [el, ...el.querySelectorAll<HTMLElement>("[data-curl-part]")], reach: 0, corner: 0, vw: 0, vh: 0, last: "" };
          curlState.set(el, c);
        }
        if (c.vw !== vw || c.vh !== vh) {
          c.reach = Math.max(el.offsetWidth, el.offsetHeight) * 1.1;
          c.corner = Math.min(112, Math.max(64, vw * 0.07)); // matches --corner in CSS
          c.vw = vw;
          c.vh = vh;
        }
        return [el, c];
      });
      drifts = [...document.querySelectorAll<HTMLElement>("[data-parallax]")].map((el) => {
        let d = driftState.get(el);
        if (!d) {
          d = { f: Number(el.dataset.parallax) || 0.2, fade: el.dataset.parallaxFade !== undefined, lastT: "", lastO: "" };
          driftState.set(el, d);
        }
        return [el, d];
      });
    };
    const write = () => {
      // By the time the hero leaves, most of the sheet has peeled away diagonally.
      const p = Math.min(1, y / (vh * 0.95));
      for (const [, c] of curls) {
        const v = (1 + (c.reach / c.corner - 1) * p ** 1.4).toFixed(3);
        if (v === c.last) continue;
        c.last = v;
        for (const t of c.targets) t.style.setProperty("--curl", v);
      }
      if (y > vh * 1.5) return;
      for (const [el, d] of drifts) {
        const t = `0 ${(y * d.f).toFixed(1)}px`;
        if (t !== d.lastT) el.style.translate = d.lastT = t;
        if (d.fade) {
          const o = String(Math.max(0, 1 - y / (vh * 0.8)));
          if (o !== d.lastO) el.style.opacity = d.lastO = o;
        }
      }
    };
    // Only once scrolling starts: setting styles before hydration finishes would mismatch.
    if (window.scrollY > 0) {
      read();
      write();
    }
    return onScrollFrame({ read, write });
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
