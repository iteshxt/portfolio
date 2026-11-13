"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { animatePoint, peelEnd, peelShape, toClipPath, toSvgPoints, type Point } from "@/lib/peel";
import { play } from "@/lib/sound";
import { Shape } from "@/components/ui/Shape";
import { useUI, type TransitionPhase } from "@/store/ui";

/**
 * The slap + peel page transition (docs/design.md §2.2, docs/spec.md §5.3):
 * a violet sticker slaps onto the screen, the route changes underneath, then
 * the sticker peels away. Every full page load starts covered and peels open
 * (the intro).
 */

export type Flight = {
  /** Star project slug; the case-study stage marked data-fly-target={slug} is where it lands. */
  slug: string;
  /** The card visual that lifts off (marked data-fly-source). */
  source: HTMLElement;
};

type GoOptions = {
  /** Completion shown on the sticker while it covers the screen, e.g. "builds agents". */
  label?: string;
  /** Where the sticker slaps in from (viewport px). Defaults to the bottom centre. */
  origin?: { x: number; y: number };
  /** A star card's visual flies over the sticker and lands in the case-study stage. */
  fly?: Flight;
};

type Box = { left: number; top: number; width: number; height: number };

const boxOf = (el: Element): Box => {
  const r = el.getBoundingClientRect();
  return { left: r.left, top: r.top, width: r.width, height: r.height };
};

const px = (b: Box) => ({ left: `${b.left}px`, top: `${b.top}px`, width: `${b.width}px`, height: `${b.height}px` });

const lerpBox = (a: Box, b: Box, t: number): Box => ({
  left: a.left + (b.left - a.left) * t,
  top: a.top + (b.top - a.top) * t,
  width: a.width + (b.width - a.width) * t,
  height: a.height + (b.height - a.height) * t,
});

/** Where the flying visual waits, centred, while the route changes under the sticker. */
function holdBox(): Box {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const width = Math.min(vw * 0.78, 760);
  const height = Math.min(width * 0.64, vh * 0.56);
  return { left: (vw - width) / 2, top: (vh - height) / 2, width, height };
}

/** The first non-transparent background up the tree (the card's accent fill). */
function backgroundOf(el: Element | null): string {
  for (let n = el; n; n = n.parentElement) {
    const bg = getComputedStyle(n).backgroundColor;
    if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") return bg;
  }
  return "var(--violet)";
}

// Next keeps recently left pages in the DOM, hidden, for back/forward; only visible elements count.
const isShown = (el: HTMLElement) => el.getClientRects().length > 0 && el.offsetWidth > 0;

/** The visible stage for a slug. */
function findTarget(slug: string): HTMLElement | null {
  const all = document.querySelectorAll<HTMLElement>(`[data-fly-target="${CSS.escape(slug)}"]`);
  return Array.from(all).find(isShown) ?? null;
}

/** The new page has rendered: its headline is on screen (not a hidden page's). */
const hasVisibleHeadline = () => Array.from(document.querySelectorAll<HTMLElement>("main h1")).some(isShown);

type Go = (href: string, options?: GoOptions) => void;

const TransitionContext = createContext<Go>(() => {});

export function useTransitionGo(): Go {
  return useContext(TransitionContext);
}

const SLAP_MS = 420;
const PEEL_MS = 720;
const SAFETY_MS = 7000;
const READY_WAIT_MS = 1500;
const LAND_GRACE_MS = 600;
const HOLD_TILT = -1.5;
/** A white die-cut edge plus a drop shadow while the visual is lifted (it reads on the violet sticker). */
const liftShadow = (k: number) =>
  `0 0 0 ${6 * k}px rgb(255 255 255 / ${k}), 0 ${40 * k}px ${90 * k}px -30px rgb(0 0 0 / ${0.5 * k})`;
/** The intro counter runs at least this long on a first visit, so it reads as a loader, not a flash. */
const INTRO_MIN_MS = 1100;
/** Repeat visits in the same tab get a much shorter intro. */
const INTRO_REPEAT_MS = 350;
const INTRO_SEEN_KEY = "intro-seen";

export function TransitionProvider({
  children,
  intro,
}: {
  children: ReactNode;
  /** Server-rendered loader shown on the intro sticker (IntroScreen). */
  intro?: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const setPhaseInStore = useUI((s) => s.setTransitionPhase);

  const rootRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const routeUiRef = useRef<HTMLDivElement>(null);
  const routeCounterRef = useRef<HTMLSpanElement>(null);
  const routeBarRef = useRef<HTMLSpanElement>(null);
  const routeRaf = useRef(0);
  const flapRef = useRef<SVGPolygonElement>(null);
  const shadeRef = useRef<SVGPolygonElement>(null);
  const gradRef = useRef<SVGLinearGradientElement>(null);
  const flyerRef = useRef<HTMLDivElement>(null);
  const flight = useRef<{ slug: string; box: Box } | null>(null);
  const flightRaf = useRef(0);

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

  const clearFlyer = useCallback(() => {
    const flyer = flyerRef.current;
    cancelAnimationFrame(flightRaf.current);
    if (!flyer) return;
    flyer.getAnimations().forEach((a) => a.cancel());
    flyer.style.display = "none";
    flyer.style.opacity = "";
    flyer.replaceChildren();
  }, []);

  // Cover: the card's visual lifts off its card and settles in the centre, above the sticker.
  const launch = useCallback(
    (fly: Flight) => {
      const flyer = flyerRef.current;
      if (!flyer) return;
      clearFlyer();
      const card = fly.source.closest("[data-fly-card]") ?? fly.source;
      const tilt = Number.parseFloat(getComputedStyle(card).rotate) || 0;
      const from = boxOf(fly.source);
      const hold = holdBox();
      flight.current = { slug: fly.slug, box: hold };
      flyer.style.background = backgroundOf(fly.source);
      flyer.replaceChildren(...Array.from(fly.source.children, (n) => n.cloneNode(true)));
      Object.assign(flyer.style, px(hold), { rotate: `${HOLD_TILT}deg`, boxShadow: liftShadow(1), display: "flex" });
      flyer.animate(
        [
          { ...px(from), rotate: `${tilt}deg`, boxShadow: liftShadow(0) },
          { ...px(hold), rotate: `${HOLD_TILT}deg`, boxShadow: liftShadow(1) },
        ],
        { duration: SLAP_MS + 120, easing: "cubic-bezier(.16,1,.3,1)" },
      );
    },
    [clearFlyer],
  );

  // Reveal: it follows the stage's live position (the headline may still be fitting) as the
  // sticker peels, then fades into the real one underneath.
  const land = useCallback(() => {
    const flyer = flyerRef.current;
    const f = flight.current;
    flight.current = null;
    if (!flyer || !f) return;
    const fadeOut = (extra: Keyframe = {}) =>
      flyer
        .animate([{ opacity: 1 }, { opacity: 0, ...extra }], { duration: 260, easing: "ease-out", fill: "forwards" })
        .finished.then(clearFlyer, clearFlyer);
    flyer.getAnimations().forEach((a) => a.cancel());
    const startedAt = performance.now();
    let foundAt = 0;
    const step = (now: number) => {
      const target = findTarget(f.slug);
      if (!target) {
        // Give a late stage a moment; otherwise drop the visual where it is.
        if (foundAt || now - startedAt > LAND_GRACE_MS) fadeOut({ scale: 0.92 });
        else flightRaf.current = requestAnimationFrame(step);
        return;
      }
      foundAt ||= now;
      const t = Math.min(1, (now - foundAt) / PEEL_MS);
      const e = 1 - (1 - t) ** 4;
      Object.assign(flyer.style, px(lerpBox(f.box, boxOf(target), e)), {
        rotate: `${HOLD_TILT * (1 - e)}deg`,
        boxShadow: liftShadow(1 - e),
      });
      if (t < 1) flightRaf.current = requestAnimationFrame(step);
      else fadeOut();
    };
    flightRaf.current = requestAnimationFrame(step);
  }, [clearFlyer]);

  const reveal = useCallback(() => {
    window.clearTimeout(safety.current);
    const root = rootRef.current;
    const sheet = sheetRef.current;
    if (!root || !sheet || phase.current === "revealing" || phase.current === "idle") return;
    setPhase("revealing");
    delete root.dataset.intro;
    // The route counter jumps to 100 as the sticker peels away.
    cancelAnimationFrame(routeRaf.current);
    if (routeCounterRef.current) routeCounterRef.current.textContent = "100";
    if (routeBarRef.current) routeBarRef.current.style.transform = "scaleX(1)";
    if (introDone.current) play("peel");
    introDone.current = true;

    const done = () => {
      root.style.display = "none";
      sheet.style.clipPath = "";
      sheet.style.opacity = "";
      flapRef.current?.setAttribute("points", "");
      shadeRef.current?.setAttribute("points", "");
      if (labelRef.current) labelRef.current.textContent = "";
      delete root.dataset.route;
      setPhase("idle");
    };

    if (prefersReducedMotion()) {
      sheet.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: "ease-out" }).finished.then(done, done);
      return;
    }

    const w = window.innerWidth;
    const h = window.innerHeight;
    land();
    animatePoint([w - 2, 2], peelEnd(w, h), PEEL_MS, (p) => renderPeel(w, h, p), done);
  }, [land, renderPeel, setPhase]);

  // While a route loads under the sticker: the counter eases towards 90%, and a few
  // stickers slap on at random spots (clear of the name and counter).
  const startRouteUi = useCallback(() => {
    const ui = routeUiRef.current;
    if (!ui) return;
    if (rootRef.current) rootRef.current.dataset.route = "";
    cancelAnimationFrame(routeRaf.current);
    const start = performance.now();
    const tick = (now: number) => {
      const v = 90 * (1 - Math.exp(-(now - start) / 420));
      if (routeCounterRef.current) routeCounterRef.current.textContent = String(Math.floor(v)).padStart(3, "0");
      if (routeBarRef.current) routeBarRef.current.style.transform = `scaleX(${(v / 100).toFixed(3)})`;
      routeRaf.current = requestAnimationFrame(tick);
    };
    routeRaf.current = requestAnimationFrame(tick);
    ui.querySelectorAll<HTMLElement>("[data-route-shape]").forEach((el, i) => {
      el.style.left = `${8 + Math.random() * 80}%`;
      el.style.top = `${10 + Math.random() * 42}%`;
      el.animate(
        [
          { opacity: 0, transform: `translate(-50%, -50%) scale(1.8) rotate(${Math.random() * 40 - 20}deg)` },
          { opacity: 1, transform: `translate(-50%, -50%) scale(1) rotate(${Math.random() * 30 - 15}deg)` },
        ],
        { duration: 420, delay: 160 + i * 110, easing: "cubic-bezier(.2,.9,.3,1.2)", fill: "both" },
      );
    });
  }, []);

  const cover = useCallback(async (options: GoOptions) => {
    const root = rootRef.current;
    const sheet = sheetRef.current;
    if (!root || !sheet) return;
    sheet.style.clipPath = "none";
    root.style.display = "block";
    // A flying visual is the label; the two would overlap in the centre.
    if (labelRef.current) labelRef.current.textContent = options.fly ? "" : (options.label ?? "");

    if (prefersReducedMotion()) {
      await sheet.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, fill: "forwards" }).finished;
      sheet.getAnimations().forEach((a) => a.cancel());
      return;
    }

    if (options.fly) launch(options.fly);
    root.dataset.fly = options.fly ? "true" : "false";
    startRouteUi();

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
  }, [launch, startRouteUi]);

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
      const ready = flight.current ? findTarget(flight.current.slug) !== null : hasVisibleHeadline();
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
    let fontsLoaded = false;
    let raf = 0;
    let fadeTimer = 0;
    const fontsReady = Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))]);
    fontsReady.then(() => {
      fontsLoaded = true;
    });

    let seen = false;
    try {
      seen = sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
      sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {}
    const minMs = seen ? INTRO_REPEAT_MS : INTRO_MIN_MS;

    // The counter eases towards ~90% while things load, then runs to 100.
    const start = performance.now();
    let shown = 0;
    const counter = rootRef.current?.querySelector<HTMLElement>("[data-intro-counter]");
    const bar = rootRef.current?.querySelector<HTMLElement>("[data-intro-bar]");
    const finish = () => {
      const ui = rootRef.current?.querySelector<HTMLElement>(".intro-ui");
      if (!ui) return reveal();
      ui.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-16px)" }], {
        duration: 260,
        easing: "cubic-bezier(.16,1,.3,1)",
        fill: "forwards",
      });
      fadeTimer = window.setTimeout(() => {
        if (!cancelled) reveal();
      }, 200);
    };
    const tick = () => {
      if (cancelled) return;
      const elapsed = performance.now() - start;
      const done = fontsLoaded && elapsed >= minMs;
      const target = done ? 100 : 90 * (1 - Math.exp(-elapsed / (minMs * 0.45)));
      shown += (target - shown) * (done ? 0.28 : 0.16);
      if (done && shown > 99.4) shown = 100;
      const n = Math.floor(shown);
      if (counter) counter.textContent = String(n).padStart(3, "0");
      if (bar) bar.style.transform = `scaleX(${shown / 100})`;
      if (shown >= 100) fadeTimer = window.setTimeout(finish, 140);
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(fadeTimer);
    };
  }, [reveal, setPhase]);

  useEffect(() => () => cancelAnimationFrame(flightRaf.current), []);

  // Back/forward: cover instantly, reveal when the route has changed.
  useEffect(() => {
    const onPopState = () => {
      const root = rootRef.current;
      const sheet = sheetRef.current;
      if (!root || !sheet || phase.current !== "idle" || prefersReducedMotion()) return;
      sheet.style.clipPath = "none";
      root.style.display = "block";
      root.dataset.fly = "false";
      startRouteUi();
      setPhase("covered");
      pendingPath.current = null;
      safety.current = window.setTimeout(reveal, 900);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [reveal, setPhase, startRouteUi]);

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
          {/* Route UI (not during the intro): where you're going, a counter, a bar and a few stickers. */}
          <div ref={routeUiRef} className="route-ui px-gutter absolute inset-0 text-white">
            {(["burst", "flower", "zigzag"] as const).map((name) => (
              <Shape key={name} name={name} data-route-shape="" className="absolute w-[clamp(52px,6vw,92px)] opacity-0" />
            ))}
            <div className="absolute inset-x-[clamp(16px,4vw,48px)] bottom-[clamp(28px,4vw,48px)] flex items-end justify-between gap-6">
              <div className="route-label min-w-0">
                <p className="font-mono text-[12px] tracking-wide uppercase opacity-75">Going to</p>
                <span
                  ref={labelRef}
                  className="mt-2 block truncate text-[clamp(52px,9vw,150px)] leading-[0.9] font-semibold tracking-[-0.05em] [font-variation-settings:'wdth'_78]"
                />
              </div>
              <span className="display-sans flex shrink-0 items-start text-[clamp(56px,10vw,170px)] leading-none tabular-nums">
                <span ref={routeCounterRef}>000</span>
                <span className="display-serif mt-[0.08em] text-[0.32em] text-lavender">%</span>
              </span>
            </div>
            <span className="absolute inset-x-[clamp(16px,4vw,48px)] bottom-4 block h-[3px] overflow-hidden rounded-full bg-white/20">
              <span ref={routeBarRef} className="block h-full origin-left rounded-full bg-lime" style={{ transform: "scaleX(0)" }} />
            </span>
          </div>
          {intro}
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
      <div
        ref={flyerRef}
        data-flyer=""
        aria-hidden="true"
        className="pointer-events-none fixed z-[81] hidden items-center justify-center overflow-hidden will-change-[left,top,width,height]"
      />
    </TransitionContext.Provider>
  );
}
