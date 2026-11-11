"use client";

import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
import { prefersReducedMotion, supportsViewTransitions } from "@/lib/motion";
import {
  animatePoint,
  peelEnd,
  peelProgress,
  peelRest,
  peelShape,
  toClipPath,
  toSvgPoints,
  type Point,
} from "@/lib/peel";
import type { Shift } from "@/lib/shift";
import { applyShiftToDom, otherShift, useUI } from "@/store/ui";

/**
 * The day/night toggle: the page's top-right corner is curled up, and peeling
 * it swaps the shift (docs/design.md §2.1, docs/spec.md §5.2).
 *
 * The old shift is a View Transition snapshot; each frame we clip that
 * snapshot to the part of the "sticker" that's still stuck down and draw the
 * folded flap on top. Without View Transitions (or with reduced motion) the
 * shift simply crossfades.
 */

const REST = 34;
const BOX = 112;
const RESTING = peelShape(BOX, BOX, peelRest(BOX, REST));

type Session = {
  from: Shift;
  to: Shift;
  w: number;
  h: number;
  pointer: Point;
  start: Point;
  dragging: boolean;
  release: "complete" | "back" | null;
  ready: boolean;
  ended: boolean;
  completed: boolean;
  style: HTMLStyleElement;
  keepAlive: Animation | null;
  transition: ViewTransition | null;
  raf: number;
  cancelAnim: (() => void) | null;
};

export function PeelCorner() {
  const shift = useUI((s) => s.shift);
  const syncShiftFromDom = useUI((s) => s.syncShiftFromDom);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const flapRef = useRef<SVGPolygonElement>(null);
  const shadeRef = useRef<SVGPolygonElement>(null);
  const gradRef = useRef<SVGLinearGradientElement>(null);
  const sessionRef = useRef<Session | null>(null);
  const pointerHandled = useRef(false);

  // The bootstrap script picked the shift before React loaded; adopt it.
  useEffect(() => {
    syncShiftFromDom();
  }, [syncShiftFromDom]);

  function render(s: Session, p: Point) {
    const shape = peelShape(s.w, s.h, p);
    s.style.textContent = `:root.peeling::view-transition-old(root){clip-path:${toClipPath(shape.kept)};}`;
    const pts = toSvgPoints(shape.flap);
    flapRef.current?.setAttribute("points", pts);
    shadeRef.current?.setAttribute("points", pts);
    const g = gradRef.current;
    if (g) {
      g.setAttribute("x1", String(shape.fold[0]));
      g.setAttribute("y1", String(shape.fold[1]));
      g.setAttribute("x2", String(shape.tip[0]));
      g.setAttribute("y2", String(shape.tip[1]));
    }
  }

  function cleanup(s: Session) {
    if (s.ended) return;
    s.ended = true;
    cancelAnimationFrame(s.raf);
    s.cancelAnim?.();
    s.style.remove();
    document.documentElement.classList.remove("peeling");
    flapRef.current?.setAttribute("points", "");
    shadeRef.current?.setAttribute("points", "");
    sessionRef.current = null;
    if (s.completed) useUI.getState().setShift(s.to);
    else useUI.getState().setShift(s.from, { persist: false });
  }

  function finish(s: Session, completed: boolean) {
    s.completed = completed;
    if (s.keepAlive) s.keepAlive.finish();
    else s.transition?.skipTransition();
  }

  function dragLoop(s: Session) {
    const tick = () => {
      if (!s.dragging || s.ended) return;
      render(s, s.pointer);
      s.raf = requestAnimationFrame(tick);
    };
    s.raf = requestAnimationFrame(tick);
  }

  function complete(s: Session) {
    cancelAnimationFrame(s.raf);
    const progress = peelProgress(s.w, s.h, s.pointer);
    const duration = 300 + 450 * (1 - progress);
    s.cancelAnim = animatePoint(
      s.pointer,
      peelEnd(s.w, s.h),
      duration,
      (p) => {
        s.pointer = p;
        render(s, p);
      },
      () => finish(s, true),
    );
  }

  function springBack(s: Session) {
    cancelAnimationFrame(s.raf);
    s.cancelAnim = animatePoint(
      s.pointer,
      [s.w - 0.5, 0.5],
      320,
      (p) => {
        s.pointer = p;
        render(s, p);
      },
      () => {
        // The old snapshot covers the whole screen now, so flipping back is invisible.
        applyShiftToDom(s.from);
        finish(s, false);
      },
    );
  }

  function crossfade(to: Shift) {
    const root = document.documentElement;
    root.classList.add("shift-fade");
    useUI.getState().setShift(to);
    window.setTimeout(() => root.classList.remove("shift-fade"), 260);
  }

  function startPeel(e: ReactPointerEvent<HTMLButtonElement> | null) {
    if (sessionRef.current) return;
    const from: Shift = document.documentElement.dataset.shift === "night" ? "night" : "day";
    const to = otherShift(from);

    if (!supportsViewTransitions() || prefersReducedMotion()) {
      crossfade(to);
      return;
    }

    const w = window.innerWidth;
    const h = window.innerHeight;
    const style = document.createElement("style");
    document.head.appendChild(style);
    const start: Point = e ? [e.clientX, e.clientY] : peelRest(w, REST);

    const s: Session = {
      from,
      to,
      w,
      h,
      pointer: start,
      start,
      dragging: Boolean(e),
      release: null,
      ready: false,
      ended: false,
      completed: false,
      style,
      keepAlive: null,
      transition: null,
      raf: 0,
      cancelAnim: null,
    };
    sessionRef.current = s;

    // The flap is the back of the *old* shift's sticker.
    flapRef.current?.setAttribute("fill", from === "day" ? "var(--violet)" : "var(--lavender)");
    document.documentElement.classList.add("peeling");
    render(s, peelRest(w, REST));
    if (e) buttonRef.current?.setPointerCapture(e.pointerId);

    const transition = document.startViewTransition(() => applyShiftToDom(to));
    s.transition = transition;

    transition.ready
      .then(() => {
        if (s.ended) return;
        // Keeps the transition alive while we drive the clip path by hand.
        s.keepAlive = document.documentElement.animate(
          { opacity: [1, 1] },
          { duration: 600_000, pseudoElement: "::view-transition-group(root)" },
        );
        s.ready = true;
        if (s.release === "back") springBack(s);
        else if (s.release === "complete" || !s.dragging) complete(s);
        else dragLoop(s);
      })
      .catch(() => {
        // The DOM update still ran; treat it as a completed switch.
        s.completed = true;
        cleanup(s);
      });

    transition.finished.finally(() => cleanup(s));
  }

  function onPointerDown(e: ReactPointerEvent<HTMLButtonElement>) {
    if (e.button !== 0) return;
    e.preventDefault();
    pointerHandled.current = true;
    startPeel(e);
  }

  function onPointerMove(e: ReactPointerEvent<HTMLButtonElement>) {
    const s = sessionRef.current;
    if (!s || !s.dragging) return;
    s.pointer = [Math.min(s.w - 1, Math.max(0, e.clientX)), Math.min(s.h, Math.max(1, e.clientY))];
  }

  function onPointerUp() {
    const s = sessionRef.current;
    if (!s || !s.dragging) return;
    s.dragging = false;
    const moved = Math.hypot(s.pointer[0] - s.start[0], s.pointer[1] - s.start[1]);
    const release = moved < 6 || peelProgress(s.w, s.h, s.pointer) > 0.3 ? "complete" : "back";
    if (!s.ready) s.release = release;
    else if (release === "complete") complete(s);
    else springBack(s);
  }

  function onClick() {
    // Pointer clicks are handled on pointerdown/up; this catches Enter/Space.
    if (pointerHandled.current) {
      pointerHandled.current = false;
      return;
    }
    startPeel(null);
  }

  const next = otherShift(shift);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={onClick}
        aria-label={`Switch to the ${next} shift`}
        title={`Peel to switch to the ${next} shift`}
        className="group fixed top-0 right-0 z-[70] size-16 cursor-grab touch-none select-none active:cursor-grabbing"
      >
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${BOX} ${BOX}`}
          className="pointer-events-none absolute top-0 right-0 size-28 origin-top-right transition-transform duration-300 ease-[var(--ease-expo-out)] group-hover:scale-[1.35] group-focus-visible:scale-[1.35]"
        >
          <defs>
            <linearGradient id="peel-rest-shade" gradientUnits="userSpaceOnUse" x1={RESTING.fold[0]} y1={RESTING.fold[1]} x2={RESTING.tip[0]} y2={RESTING.tip[1]}>
              <stop offset="0" stopColor="#000" stopOpacity="0.22" />
              <stop offset="0.45" stopColor="#000" stopOpacity="0" />
              <stop offset="1" stopColor="#fff" stopOpacity="0.25" />
            </linearGradient>
          </defs>
          <polygon points={toSvgPoints(RESTING.peeled)} style={{ fill: "var(--peel-under)" }} />
          <polygon points={toSvgPoints(RESTING.flap)} style={{ fill: "var(--flap)" }} />
          <polygon points={toSvgPoints(RESTING.flap)} fill="url(#peel-rest-shade)" />
        </svg>
      </button>

      {/* The flap while peeling. It has its own view-transition-name so it paints above the old snapshot. */}
      <svg
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[90] h-full w-full overflow-visible [view-transition-name:peel-flap]"
      >
        <defs>
          <linearGradient ref={gradRef} id="peel-shade" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#000" stopOpacity="0.28" />
            <stop offset="0.35" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.22" />
          </linearGradient>
        </defs>
        <polygon ref={flapRef} points="" className="[filter:drop-shadow(-10px_14px_18px_rgb(0_0_0/0.28))]" />
        <polygon ref={shadeRef} points="" fill="url(#peel-shade)" />
      </svg>
    </>
  );
}
