"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { animatePoint, peelEnd, peelShape, toClipPath, toSvgPoints, type Point } from "@/lib/peel";
import { play } from "@/lib/sound";
import { useUI, type TransitionPhase } from "@/store/ui";

/**
 * The slap + peel page transition (docs/design.md §2.2, docs/spec.md §5.3):
 * a violet sticker slaps onto the screen, the route changes underneath, then
 * the sticker peels away. Every full page load starts covered and peels open
 * (the intro).
 */

type GoOptions = {
  /** Completion shown on the sticker while it covers the screen, e.g. "builds agents". */
  label?: string;
  /** Where the sticker slaps in from (viewport px). Defaults to the bottom centre. */
  origin?: { x: number; y: number };
};

type Go = (href: string, options?: GoOptions) => void;

const TransitionContext = createContext<Go>(() => {});

export function useTransitionGo(): Go {
  return useContext(TransitionContext);
}

const SLAP_MS = 420;
const PEEL_MS = 720;
const SAFETY_MS = 7000;
const READY_WAIT_MS = 1500;

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const setPhaseInStore = useUI((s) => s.setTransitionPhase);

  const rootRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const flapRef = useRef<SVGPolygonElement>(null);
  const shadeRef = useRef<SVGPolygonElement>(null);
  const gradRef = useRef<SVGLinearGradientElement>(null);

  const phase = useRef<TransitionPhase>("covered");
  const pendingPath = useRef<string | null | undefined>(undefined);
  const safety = useRef(0);
  // The intro peel happens before any interaction, so it stays silent.
  const introDone = useRef(false);

  const setPhase = useCallback(
    (p: TransitionPhase) => {
      phase.current = p;
      if (rootRef.current) rootRef.current.dataset.phase = p;
      setPhaseInStore(p);
    },
    [setPhaseInStore],
  );

  const renderPeel = useCallback((w: number, h: number, p: Point) => {
    const shape = peelShape(w, h, p);
    if (sheetRef.current) sheetRef.current.style.clipPath = toClipPath(shape.kept);
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
  }, []);

  const reveal = useCallback(() => {
    window.clearTimeout(safety.current);
    const root = rootRef.current;
    const sheet = sheetRef.current;
    if (!root || !sheet || phase.current === "revealing" || phase.current === "idle") return;
    setPhase("revealing");
    delete root.dataset.intro;
    if (introDone.current) play("peel");
    introDone.current = true;

    const done = () => {
      root.style.display = "none";
      sheet.style.clipPath = "";
      sheet.style.opacity = "";
      flapRef.current?.setAttribute("points", "");
      shadeRef.current?.setAttribute("points", "");
      if (labelRef.current) labelRef.current.textContent = "";
      setPhase("idle");
    };

    if (prefersReducedMotion()) {
      sheet.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: "ease-out" }).finished.then(done, done);
      return;
    }

    const w = window.innerWidth;
    const h = window.innerHeight;
    animatePoint([w - 2, 2], peelEnd(w, h), PEEL_MS, (p) => renderPeel(w, h, p), done);
  }, [renderPeel, setPhase]);

  const cover = useCallback(async (options: GoOptions) => {
    const root = rootRef.current;
    const sheet = sheetRef.current;
    if (!root || !sheet) return;
    sheet.style.clipPath = "none";
    root.style.display = "block";
    if (labelRef.current) labelRef.current.textContent = options.label ?? "";

    if (prefersReducedMotion()) {
      await sheet.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, fill: "forwards" }).finished;
      sheet.getAnimations().forEach((a) => a.cancel());
      return;
    }

    const x = options.origin?.x ?? window.innerWidth / 2;
    const y = options.origin?.y ?? window.innerHeight - 40;
    sheet.style.transformOrigin = `${x}px ${y}px`;
    labelRef.current?.animate([{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], {
      duration: 260,
      delay: 180,
      easing: "cubic-bezier(.16,1,.3,1)",
      fill: "backwards",
    });
    await sheet.animate(
      [
        { transform: "scale(0.08) rotate(-14deg)", borderRadius: "48px" },
        { transform: "scale(1.06) rotate(2deg)", borderRadius: "12px", offset: 0.75 },
        { transform: "none", borderRadius: "0px" },
      ],
      { duration: SLAP_MS, easing: "cubic-bezier(.2,.9,.3,1.2)" },
    ).finished;
  }, []);

  const go = useCallback<Go>(
    (href, options = {}) => {
      if (phase.current !== "idle") return;
      const target = new URL(href, window.location.href);
      if (target.pathname === window.location.pathname && target.search === window.location.search) return;

      router.prefetch(href);
      play("slap");
      setPhase("covering");
      cover(options).then(() => {
        setPhase("covered");
        pendingPath.current = target.pathname;
        router.push(href);
        safety.current = window.setTimeout(reveal, SAFETY_MS);
      });
    },
    [cover, reveal, router, setPhase],
  );

  // Reveal once the new route has rendered underneath the sticker. Content behind
  // Suspense can stream in a moment after the path changes, so wait (briefly)
  // for the page's headline before peeling.
  useEffect(() => {
    if (phase.current !== "covered" || pendingPath.current === undefined) return;
    if (pendingPath.current !== null && pendingPath.current !== pathname) return;
    pendingPath.current = undefined;
    const startedAt = performance.now();
    let raf = 0;
    const waitForContent = () => {
      const ready = document.querySelector("main h1") !== null;
      if (ready || performance.now() - startedAt > READY_WAIT_MS) raf = requestAnimationFrame(reveal);
      else raf = requestAnimationFrame(waitForContent);
    };
    raf = requestAnimationFrame(waitForContent);
    return () => cancelAnimationFrame(raf);
  }, [pathname, reveal]);

  // Intro: the page loads covered by the sticker, then peels open.
  useEffect(() => {
    if (prefersReducedMotion()) {
      const root = rootRef.current;
      if (root) root.style.display = "none";
      setPhase("idle");
      return;
    }
    let cancelled = false;
    const fontsReady = Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))]);
    fontsReady.then(() => {
      if (!cancelled) setTimeout(reveal, 120);
    });
    return () => {
      cancelled = true;
    };
  }, [reveal, setPhase]);

  // Back/forward: cover instantly, reveal when the route has changed.
  useEffect(() => {
    const onPopState = () => {
      const root = rootRef.current;
      const sheet = sheetRef.current;
      if (!root || !sheet || phase.current !== "idle" || prefersReducedMotion()) return;
      sheet.style.clipPath = "none";
      root.style.display = "block";
      setPhase("covered");
      pendingPath.current = null;
      safety.current = window.setTimeout(reveal, 900);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [reveal, setPhase]);

  return (
    <TransitionContext.Provider value={go}>
      {children}
      <div
        ref={rootRef}
        data-slap-root=""
        data-intro=""
        data-phase="covered"
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[80]"
      >
        <div ref={sheetRef} className="absolute inset-0 flex items-center justify-center bg-violet will-change-transform">
          <span ref={labelRef} className="display-serif px-6 text-center text-[clamp(40px,8vw,120px)] text-white" />
        </div>
        <svg className="absolute inset-0 h-full w-full overflow-visible">
          <defs>
            <linearGradient ref={gradRef} id="slap-shade" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#000" stopOpacity="0.28" />
              <stop offset="0.35" stopColor="#000" stopOpacity="0" />
              <stop offset="1" stopColor="#fff" stopOpacity="0.25" />
            </linearGradient>
          </defs>
          <polygon
            ref={flapRef}
            points=""
            style={{ fill: "var(--lavender)" }}
            className="[filter:drop-shadow(-10px_14px_18px_rgb(0_0_0/0.28))]"
          />
          <polygon ref={shadeRef} points="" fill="url(#slap-shade)" />
        </svg>
      </div>
    </TransitionContext.Provider>
  );
}
