"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./motion";

/**
 * Flickable stickers (docs/design.md §6): swiping the cursor across one gives
 * it a push and a spin based on where and how fast it was hit, then a spring
 * settles it back. Fine pointers only; nothing for touch or reduced motion.
 */

const pointer = { x: 0, y: 0, vx: 0, vy: 0, t: 0 };
let tracking = false;

function trackPointer() {
  if (tracking) return;
  tracking = true;
  window.addEventListener(
    "pointermove",
    (e) => {
      const now = performance.now();
      const dt = Math.max(8, now - pointer.t);
      pointer.vx = pointer.vx * 0.4 + ((e.clientX - pointer.x) / dt) * 0.6;
      pointer.vy = pointer.vy * 0.4 + ((e.clientY - pointer.y) / dt) * 0.6;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.t = now;
    },
    { passive: true },
  );
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Torque from a hit: the 2D cross product of the hit offset and the pointer velocity. */
export function flickImpulse(offsetX: number, offsetY: number, vx: number, vy: number) {
  const cvx = clamp(vx, -3, 3);
  const cvy = clamp(vy, -3, 3);
  return {
    spin: clamp((offsetX * cvy - offsetY * cvx) * 0.08, -22, 22),
    pushX: cvx * 2.4,
    pushY: cvy * 2.4,
  };
}

export function useFlick<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    trackPointer();

    const s = { x: 0, y: 0, r: 0, vx: 0, vy: 0, vr: 0 };
    let raf = 0;
    let running = false;

    const step = () => {
      // Spring back to rest with damping, once per frame.
      s.vx = (s.vx - s.x * 0.07) * 0.86;
      s.vy = (s.vy - s.y * 0.07) * 0.86;
      s.vr = (s.vr - s.r * 0.06) * 0.88;
      s.x += s.vx;
      s.y += s.vy;
      s.r += s.vr;
      const energy = Math.abs(s.x) + Math.abs(s.y) + Math.abs(s.r) + Math.abs(s.vx) + Math.abs(s.vy) + Math.abs(s.vr);
      if (energy > 0.03) {
        el.style.transform = `translate(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px) rotate(${s.r.toFixed(2)}deg)`;
        raf = requestAnimationFrame(step);
      } else {
        running = false;
        el.style.transform = "";
      }
    };

    const onEnter = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const hit = flickImpulse(e.clientX - (rect.left + rect.width / 2), e.clientY - (rect.top + rect.height / 2), pointer.vx, pointer.vy);
      s.vr += hit.spin;
      s.vx += hit.pushX;
      s.vy += hit.pushY;
      if (!running) {
        running = true;
        raf = requestAnimationFrame(step);
      }
    };

    el.addEventListener("pointerenter", onEnter);
    return () => {
      el.removeEventListener("pointerenter", onEnter);
      cancelAnimationFrame(raf);
      el.style.transform = "";
    };
  }, []);

  return ref;
}
