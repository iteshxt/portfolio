"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { Star } from "@/components/icons";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { CATEGORY_LABELS, type Project } from "@/content/projects";
import { cn } from "@/lib/cn";
import { code128Widths } from "@/lib/code128";
import { foundEgg } from "@/lib/eggs";
import { jumpToProject } from "./jump";

/**
 * What the barcode says, printed under it like a real label: the scan address without
 * "https://" (fewer characters keep the bars wide enough to scan off a screen).
 */
const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://iteshxt.me").replace(/\/+$/, "");
const scanText = (code: string) => `${SITE.replace(/^https?:\/\//, "")}/s/${code}`;
const CODE_KEY = "manifest-code";
const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";
/** Blank modules either side of the bars (Code 128 wants at least 10). */
const QUIET = 10;
/** The barcode's width in modules, quiet zones included (every code is 4 characters). */
const MODULES = code128Widths(scanText("0000")).reduce((a, b) => a + b, 0) + QUIET * 2;

/** This visitor's barcode code, made once per tab. Empty on the server. */
function readCode(): string {
  try {
    let code = sessionStorage.getItem(CODE_KEY);
    if (!code) {
      code = Array.from(crypto.getRandomValues(new Uint8Array(4)), (b) => ALPHABET[b % ALPHABET.length]).join("");
      sessionStorage.setItem(CODE_KEY, code);
    }
    return code;
  } catch {
    return "";
  }
}
const noSubscribe = () => () => {};

/**
 * A real Code 128 barcode, black on white whatever the theme, so phones can read it.
 * It fills the label's width whenever that gives every module 2 screen pixels or more.
 * Below that (a 1x desktop screen) fractional modules round unevenly, some bars a pixel
 * fat and others thin, so it shrinks to exactly 1 screen pixel per module instead.
 * "scan me" writes itself in above it once it's on screen.
 */
function Barcode({ text }: { text: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>();
  const [seen, setSeen] = useState(false);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => {
      const dpr = window.devicePixelRatio || 1;
      const perModule = (el.clientWidth * dpr) / MODULES;
      setWidth(perModule >= 2 ? undefined : (Math.max(1, Math.floor(perModule)) * MODULES) / dpr);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    window.addEventListener("resize", fit); // zooming changes the pixel ratio, not always the box
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold: 0.9 });
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);
  let d = "";
  let x = QUIET;
  code128Widths(text).forEach((w, i) => {
    if (i % 2 === 0) d += `M${x} 0h${w}v1h-${w}z`;
    x += w;
  });
  return (
    <div ref={box} className="flex justify-center">
      <div className="relative w-full" style={width ? { width } : undefined}>
        <svg viewBox={`0 0 ${MODULES} 1`} preserveAspectRatio="none" shapeRendering="crispEdges" className="block h-14 w-full" role="img" aria-label={`Barcode: ${text}`}>
          <rect width={MODULES} height="1" fill="#FFFFFF" />
          <path d={d} fill="#0E0E10" />
        </svg>
        {seen && <ScanMe />}
      </div>
    </div>
  );
}

/**
 * Handwritten "scan me" above the barcode's right end, its curly arrow pointing down at
 * the bars. It never covers a bar or the quiet zone, so the code always scans.
 */
function ScanMe() {
  return (
    <div aria-hidden="true" className="scan-me pointer-events-none absolute right-[14%] bottom-[calc(100%+4px)] flex items-start text-accent-text">
      <span className="mt-1 -rotate-[9deg] font-hand text-[22px] leading-none whitespace-nowrap">scan me</span>
      <svg viewBox="0 0 50 50" className="scan-me-arrow ml-1.5 w-[40px] overflow-visible">
        <path className="scan-me-stroke" pathLength={1} d="M3 10 C 12 12, 22 12, 28 8 C 34 4, 32 -2, 26 0 C 20 2, 22 12, 30 16 C 38 20, 40 32, 38 46" />
        <path className="scan-me-stroke scan-me-head" pathLength={1} d="M31.5 39.5 L 38 47 L 44.5 39.5" />
      </svg>
    </div>
  );
}

/**
 * The scan egg (docs/design.md §2.17): while the barcode is on screen, ask now and then
 * whether a phone has scanned it, then (more slowly) whether they signed the visitors'
 * passport, to print their name. Gives up after 15 minutes.
 */
function useScanned(code: string, target: React.RefObject<HTMLElement | null>) {
  const [state, setState] = useState<{ scanned: boolean; name?: string }>({ scanned: false });
  const done = state.scanned && !!state.name;
  useEffect(() => {
    const el = target.current;
    if (!code || !el || done) return;
    let visible = false;
    let timer = 0;
    let cancelled = false;
    const abort = new AbortController();
    let scannedYet = state.scanned;
    const started = Date.now();
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    const tick = async () => {
      if (Date.now() - started > 15 * 60_000) return;
      if (visible && document.visibilityState === "visible") {
        try {
          const res = await fetch(`/api/scan?code=${code}`, { cache: "no-store", signal: abort.signal });
          const data = (await res.json()) as { scanned?: boolean; name?: string };
          if (cancelled) return;
          if (data.scanned && !scannedYet) {
            scannedYet = true;
            window.dispatchEvent(new Event("egg:scuba"));
            foundEgg("barcode", "Easter egg found: you've been shipped", "You're item 23 on the manifest.");
          }
          if (data.scanned) {
            setState((s) => (s.scanned && s.name === data.name ? s : { scanned: true, name: data.name }));
            if (data.name) return;
          }
        } catch {
          // Offline, a hiccup or the page going away: try again next tick (unless it went away).
        }
      }
      if (cancelled) return;
      timer = window.setTimeout(tick, scannedYet ? 4000 : 2500);
    };
    timer = window.setTimeout(tick, 2500);
    return () => {
      cancelled = true;
      abort.abort();
      io.disconnect();
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- restart only when the code, target or "finished" changes
  }, [code, target, done]);
  return state;
}

function Rows({ projects, copy = false }: { projects: Project[]; copy?: boolean }) {
  return (
    <ol aria-hidden={copy || undefined} inert={copy || undefined} className="flex flex-col">
      {projects.map((p, i) => {
        const line = (
          <>
            <span className="w-7 shrink-0 text-fg-muted">{String(i + 1).padStart(2, "0")}</span>
            <span className="manifest-name flex min-w-0 flex-1 items-center gap-1.5">
              <span className="truncate">{p.name}</span>
              {p.tier === "star" && <Star className="shrink-0 text-[12px] text-violet" />}
            </span>
            <span className="shrink-0 text-fg-muted">
              {CATEGORY_LABELS[p.category]} · {p.year.slice(-4)}
            </span>
          </>
        );
        return (
          <li key={p.slug}>
            {p.tier === "star" ? (
              <TransitionLink href={`/work/${p.slug}`} transitionLabel={p.name} data-cursor="Case file" className="manifest-row">
                {line}
              </TransitionLink>
            ) : (
              <button type="button" onClick={() => jumpToProject(p.slug)} data-cursor="Find it" className="manifest-row">
                {line}
              </button>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/**
 * The work page's hero piece (docs/design.md §2.10): a printed shipping manifest
 * of everything shipped. It prints in, then rolls slowly upwards like a till
 * roll (paused while you point at it). Star rows open their case study; the rest
 * glide down to their tile on the shelf. The barcode is real: scan it with a phone,
 * sign the visitors' passport, and you're shipped too (item 23, by name), live, on this screen.
 */
export function ShippingManifest({ projects, stars }: { projects: Project[]; stars: number }) {
  const code = useSyncExternalStore(noSubscribe, readCode, () => "");
  const barcodeRef = useRef<HTMLDivElement>(null);
  const { scanned, name } = useScanned(code, barcodeRef);
  return (
    <div className="manifest w-full max-w-[420px] drop-shadow-[0_24px_30px_rgb(0_0_0/0.16)]">
      <div className="receipt bg-surface px-5 pt-6 pb-9 font-mono text-[13px] text-fg">
        <p className="text-center text-[15px] font-semibold tracking-[0.2em]">SHIPPING MANIFEST</p>
        <p className="mt-1 text-center text-[12px] text-fg-muted">everything that made it out the door</p>
        <p className="mt-4 flex justify-between border-y border-dashed border-line py-1.5 text-[11px] tracking-wider text-fg-muted">
          <span>NO. ITEM</span>
          <span>KIND · YEAR</span>
        </p>
        {scanned && (
          <p className="manifest-you mt-1 flex items-center gap-2.5 rounded-[6px] px-1 py-[7px] font-semibold">
            <span className="w-7 shrink-0">{String(projects.length + 1).padStart(2, "0")}</span>
            <span key={name ?? "you"} className={cn("flex min-w-0 flex-1 items-center gap-1.5", name && "manifest-you-name")}>
              <span className="truncate">{name ?? "You"}</span> <Star className="shrink-0 text-[12px]" />
            </span>
            <span className="shrink-0">just now</span>
          </p>
        )}
        <div className="manifest-window relative mt-1 h-[min(46vh,380px)] overflow-hidden">
          <div className="manifest-roll" style={{ "--rows": projects.length } as CSSProperties}>
            <Rows projects={projects} />
            <Rows projects={projects} copy />
          </div>
        </div>
        <div className="mt-2 flex flex-col gap-1 border-t border-dashed border-line pt-3">
          <p className="flex justify-between font-semibold">
            <span>TOTAL SHIPPED</span>
            <span key={scanned ? "you" : "all"} className={scanned ? "manifest-total-pop" : undefined}>
              {projects.length + (scanned ? 1 : 0)}
            </span>
          </p>
          <p className="flex justify-between text-fg-muted">
            <span>WITH A CASE FILE</span>
            <span>{stars}</span>
          </p>
        </div>
        {/* Room above for "scan me"; the label uses some of the receipt's margin, for wider bars. */}
        <div ref={barcodeRef} className="-mx-3 mt-12">
          {code ? <Barcode text={scanText(code)} /> : <div aria-hidden="true" className="manifest-barcode h-14" />}
        </div>
        <p className="mt-1.5 text-center text-[11px] tracking-[0.12em] text-fg-muted">
          {code ? (
            <a href={`/s/${code}`} className="underline decoration-dotted underline-offset-2 hover:text-fg">
              {scanText(code)}
            </a>
          ) : (
            "\u00a0"
          )}
        </p>
        {scanned && (
          <p aria-hidden="true" className="mt-3 flex justify-center">
            <span className="manifest-scanned rounded-[6px] border-[3px] px-2.5 py-0.5 text-[15px] font-bold tracking-[0.2em]">SCANNED</span>
          </p>
        )}
        <p className="mt-1 text-center text-[11px] text-fg-muted">
          thanks for scrolling ·{" "}
          <TransitionLink href="/visitors" transitionLabel="Visitors" className="underline decoration-dotted underline-offset-2 hover:text-fg">
            the visitors&apos; passport
          </TransitionLink>
        </p>
      </div>
    </div>
  );
}
