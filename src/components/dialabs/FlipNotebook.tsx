"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ArrowUpRight } from "@/components/icons";
import { Scribble } from "@/components/motion/Scribble";
import type { Release } from "@/content/dialabs";
import { cn } from "@/lib/cn";
import { onScrollFrame } from "@/lib/scroll-frame";
import { KIND_TONE } from "./LabNotebook";

/** Scroll distance per page turn, in viewport heights. */
const TURN_VH = 75;

function QuestionPage({ r, i }: { r: Release; i: number }) {
  return (
    <div className="flex h-full flex-col justify-between p-[clamp(24px,3vw,48px)]">
      <div className="flex items-center gap-3">
        <span className="font-mono text-[13px] tracking-[0.2em] text-fg-muted uppercase">Exp</span>
        <span className="text-[clamp(44px,5vw,72px)] leading-none font-semibold tracking-[-0.05em] [font-variation-settings:'wdth'_76]">{String(i + 1).padStart(2, "0")}</span>
        <span className={cn("ml-1 rounded-full border-[3px] border-[var(--die)] px-3 py-0.5 text-[12px] font-semibold shadow-[0_6px_14px_-8px_rgb(0_0_0/0.4)]", KIND_TONE[r.kind])}>{r.kind}</span>
      </div>
      <div>
        <h3 className="text-[clamp(34px,4vw,60px)] leading-[0.95] font-semibold tracking-[-0.045em] [font-variation-settings:'wdth'_80]">{r.name}</h3>
        <p className="mt-4 max-w-[26ch] font-serif text-[clamp(20px,2vw,28px)] leading-[1.2] italic">&ldquo;{r.question}&rdquo;</p>
      </div>
      <p className="font-hand text-[clamp(18px,1.6vw,22px)] text-fg-muted">the question</p>
    </div>
  );
}

function AnswerPage({ r, last }: { r: Release; last: boolean }) {
  return (
    <div className="flex h-full flex-col justify-between p-[clamp(24px,3vw,48px)] pl-[clamp(36px,4vw,64px)]">
      <dl className="flex flex-col gap-5 text-[clamp(15px,1.2vw,17px)] leading-snug">
        <div>
          <dt className="font-mono text-[11px] tracking-wider text-fg-muted uppercase">Method</dt>
          <dd className="mt-1">{r.night}</dd>
        </div>
        <div>
          <dt className="font-mono text-[11px] tracking-wider text-fg-muted uppercase">Result</dt>
          <dd className="mt-1">{r.result}</dd>
        </div>
      </dl>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <span className="notebook-stamp rounded-[5px] border-[2.5px] px-2.5 py-0.5 font-mono text-[12px] font-semibold tracking-wider uppercase">{r.stamp}</span>
        {r.links.map((l) => (
          <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold">
            <Scribble>{l.label}</Scribble> <ArrowUpRight className="text-[13px]" />
          </a>
        ))}
      </div>
      <p className="self-end font-hand text-[clamp(18px,1.6vw,22px)] text-fg-muted">{last ? "last page, for now" : "keep scrolling to turn the page →"}</p>
    </div>
  );
}

/**
 * The lab notebook as a real book (docs/design.md §2.13). From tablet width up the
 * section pins and the notebook lies open: each experiment is a spread, the
 * question on the left page and the method, result and links on the right.
 * Scrolling turns the right-hand page over its spine to the next spread, the turn
 * tied to the scroll position. Phones get the plain list (`fallback`).
 */
export function FlipNotebook({ releases, title, fallback }: { releases: Release[]; title: ReactNode; fallback: ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const leaves = useRef<(HTMLDivElement | null)[]>([]);
  const counter = useRef<HTMLSpanElement>(null);
  const turns = releases.length - 1;

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let top = 0;
    let span = 0;
    // What was last written per leaf, so unchanged leaves aren't touched (z-index and
    // data-turning changes restyle and re-layer the 3D pages).
    const lastT: string[] = [];
    const lastZ: string[] = [];
    const lastTurning: boolean[] = [];
    let lastCount = "";
    // Shared scroll loop (lib/scroll-frame): measure, then write.
    const read = () => {
      top = el.getBoundingClientRect().top;
      span = el.offsetHeight - window.innerHeight;
    };
    const write = () => {
      const p = span > 0 ? Math.min(turns, Math.max(0, (-top / span) * turns)) : 0;
      leaves.current.forEach((leaf, k) => {
        if (!leaf) return;
        const t = Math.min(1, Math.max(0, p - k));
        // Ease each turn so the page lifts slowly, swings, then settles.
        const e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
        const transform = `rotateY(${(-180 * e).toFixed(2)}deg)`;
        if (transform !== lastT[k]) leaf.style.transform = lastT[k] = transform;
        // Turned leaves stack on the left, the latest on top; unturned ones on the right, the next on top.
        const z = String(t >= 0.5 ? 100 + k : 100 - k);
        if (z !== lastZ[k]) leaf.style.zIndex = lastZ[k] = z;
        const turning = t > 0 && t < 1;
        if (turning !== lastTurning[k]) {
          lastTurning[k] = turning;
          if (turning) leaf.dataset.turning = "";
          else delete leaf.dataset.turning;
        }
      });
      const count = `${String(Math.min(releases.length, Math.round(p) + 1)).padStart(2, "0")} / ${String(releases.length).padStart(2, "0")}`;
      if (counter.current && count !== lastCount) counter.current.textContent = lastCount = count;
    };
    read();
    write();
    return onScrollFrame({ read, write });
  }, [turns, releases.length]);

  return (
    <>
      <div className="md:hidden">
        <div className="mb-8">{title}</div>
        {fallback}
      </div>
      <div ref={wrap} className="relative hidden md:block" style={{ height: `calc(100vh + ${turns * TURN_VH}vh)` }}>
        <div className="sticky top-0 flex h-screen flex-col justify-center gap-[clamp(18px,3vh,32px)] pt-20 pb-24">
          {title}
          <div className="book relative mx-auto h-[min(58vh,560px)] w-full" style={{ perspective: "2600px" }}>
            {/* The left page under everything: the first experiment's question. */}
            <div className="book-page book-left absolute inset-y-0 left-0 w-1/2">
              <QuestionPage r={releases[0]} i={0} />
            </div>
            {/* The right page under everything (only ever seen if nothing is left to turn). */}
            <div className="book-page book-right absolute inset-y-0 right-0 w-1/2" />
            {releases.map((r, k) => (
              <div
                key={r.name}
                ref={(node) => {
                  leaves.current[k] = node;
                }}
                className="book-leaf absolute inset-y-0 right-0 w-1/2"
                style={{ zIndex: 100 - k }}
              >
                <div className="book-face book-page book-right absolute inset-0">
                  <AnswerPage r={r} last={k === releases.length - 1} />
                </div>
                <div className="book-face book-back book-page book-left absolute inset-0">
                  {releases[k + 1] ? <QuestionPage r={releases[k + 1]} i={k + 1} /> : null}
                </div>
              </div>
            ))}
            <span aria-hidden="true" className="book-spine pointer-events-none absolute inset-y-0 left-1/2 z-[300] w-10 -translate-x-1/2" />
          </div>
          <p className="text-center font-mono text-[13px] tracking-wider text-fg-muted">
            Page <span ref={counter}>01 / {String(releases.length).padStart(2, "0")}</span>
          </p>
        </div>
      </div>
    </>
  );
}
