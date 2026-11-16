"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { Star } from "@/components/icons";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { CATEGORY_LABELS, type Project } from "@/content/projects";
import { foundEgg } from "@/lib/eggs";
import { code128Widths } from "@/lib/code128";
import { jumpToProject } from "./jump";

/** The scan address printed in the barcode (and in plain text under it, like a real barcode). */
const scanUrl = (code: string) => `iteshxt.me/s/${code}`;
const CODE_KEY = "manifest-code";
const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";

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

/** A real Code 128 barcode, black on white whatever the theme, so phones can read it. */
function Barcode({ text }: { text: string }) {
  const widths = code128Widths(text);
  const quiet = 10;
  const total = widths.reduce((a, b) => a + b, 0) + quiet * 2;
  let x = quiet;
  const bars: { x: number; w: number }[] = [];
  widths.forEach((w, i) => {
    if (i % 2 === 0) bars.push({ x, w });
    x += w;
  });
  return (
    <svg viewBox={`0 0 ${total} 40`} preserveAspectRatio="none" className="block h-12 w-full" role="img" aria-label={`Barcode: ${text}`}>
      <rect width={total} height="40" fill="#FFFFFF" />
      {bars.map((b, i) => (
        <rect key={i} x={b.x} width={b.w} height="40" fill="#0E0E10" />
      ))}
    </svg>
  );
}

/**
 * The barcode egg (docs/design.md §2.17): while the barcode is on screen, ask now
 * and then whether a phone has scanned it. Stops after 15 minutes.
 */
function useScanned(code: string, target: React.RefObject<HTMLElement | null>) {
  const [scanned, setScanned] = useState(false);
  useEffect(() => {
    const el = target.current;
    if (!code || !el || scanned) return;
    let visible = false;
    let timer = 0;
    const started = Date.now();
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    const tick = async () => {
      if (Date.now() - started > 15 * 60_000) return;
      if (visible && document.visibilityState === "visible") {
        try {
          const res = await fetch(`/api/scan?code=${code}`, { cache: "no-store" });
          const data = (await res.json()) as { scanned?: boolean };
          if (data.scanned) {
            setScanned(true);
            window.dispatchEvent(new Event("egg:scuba"));
            foundEgg("barcode", "Easter egg found: you've been shipped", "You're item 23 on the manifest.");
            return;
          }
        } catch {
          // Offline or a hiccup: try again next tick.
        }
      }
      timer = window.setTimeout(tick, 2500);
    };
    timer = window.setTimeout(tick, 2500);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [code, target, scanned]);
  return scanned;
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
 * glide down to their tile on the shelf. The barcode is real: scan it with a phone
 * and you're shipped too (item 23), live, on this screen.
 */
export function ShippingManifest({ projects, stars }: { projects: Project[]; stars: number }) {
  const code = useSyncExternalStore(noSubscribe, readCode, () => "");
  const barcodeRef = useRef<HTMLDivElement>(null);
  const scanned = useScanned(code, barcodeRef);
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
            <span className="flex flex-1 items-center gap-1.5">
              You <Star className="text-[12px]" />
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
        <div ref={barcodeRef} className="mx-auto mt-5 w-[86%]">
          {code ? <Barcode text={scanUrl(code)} /> : <div aria-hidden="true" className="manifest-barcode h-12 w-full" />}
        </div>
        <p className="mt-1.5 text-center text-[11px] tracking-[0.12em] text-fg-muted">{code ? scanUrl(code) : "\u00a0"}</p>
        {scanned && (
          <p aria-hidden="true" className="mt-3 flex justify-center">
            <span className="manifest-scanned rounded-[6px] border-[3px] px-2.5 py-0.5 text-[15px] font-bold tracking-[0.2em]">SCANNED</span>
          </p>
        )}
        <p className="mt-1 text-center text-[11px] text-fg-muted">thanks for scrolling</p>
      </div>
    </div>
  );
}
