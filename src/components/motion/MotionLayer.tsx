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
 * - a sticker cursor follows fine pointers and shows [data-cursor] labels.
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

  // Magnetic buttons and the sticker cursor (fine pointers only).
  useEffect(() => {
    const el = cursor.current;
    if (!el || prefersReducedMotion() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const pos = { x: -100, y: -100, tx: -100, ty: -100 };
    let raf = 0;
    let magnet: HTMLElement | null = null;

    const loop = () => {
      pos.x += (pos.tx - pos.x) * 0.22;
      pos.y += (pos.ty - pos.y) * 0.22;
      el.style.transform = `translate3d(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const release = () => {
      if (magnet) magnet.style.translate = "";
      magnet = null;
    };
    const onMove = (e: PointerEvent) => {
      pos.tx = e.clientX;
      pos.ty = e.clientY;
      el.dataset.on = "";
      const target = e.target as HTMLElement;
      const tagged = target.closest<HTMLElement>("[data-cursor]");
      const interactive = target.closest("a, button, [role=option], input, label");
      el.dataset.mode = tagged ? "label" : interactive ? "hover" : "";
      if (label.current) label.current.textContent = tagged?.dataset.cursor ?? "";
      const btn = target.closest<HTMLElement>(".btn");
      if (btn !== magnet) release();
      if (btn) {
        magnet = btn;
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.25;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.35;
        btn.style.translate = `${dx.toFixed(1)}px ${dy.toFixed(1)}px`;
      }
    };
    const onLeave = () => {
      delete el.dataset.on;
      release();
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      release();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={cursor} aria-hidden="true" className="sticker-cursor pointer-events-none fixed top-0 left-0 z-[95] hidden md:block">
      <span className="sticker-cursor-dot">
        <span ref={label} className="sticker-cursor-label" />
      </span>
    </div>
  );
}
