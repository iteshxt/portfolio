"use client";

import { useRef, type CSSProperties } from "react";
import { ArceeChat, ArceeStamp, SUGGESTIONS } from "@/components/arcee/ArceeChat";
import { TransitionLink } from "@/components/transition/TransitionLink";

const KNOWS = ["The three star projects and how they work", "Everything else he has shipped", "Where he has worked and what he did", "DiaLabs and its releases", "How to reach him, or take a message"];

/**
 * The full-page Arcee (docs/design.md §2.13): the same conversation as the
 * floating panel, big, beside postcards: what Arcee knows, questions to try
 * (click to ask), and how leaving a message works.
 */
export function ArceePage() {
  const ask = useRef<(q: string) => void>(() => {});
  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-start">
      <div data-animate="rise" className="flex h-[min(74vh,760px)] min-h-[520px] flex-col overflow-hidden rounded-[30px] border-[5px] border-white bg-surface shadow-[0_30px_70px_-34px_rgb(0_0_0/0.5)]">
        <header className="flex items-center gap-4 bg-arcee-deep px-6 py-4 text-paper">
          <ArceeStamp className="size-14 rounded-full border-2 border-arcee/60" />
          <div>
            <p className="text-[22px] leading-tight font-semibold tracking-[-0.02em] text-arcee">Arcee</p>
            <p className="text-[14px] text-paper/80">Answers from what&apos;s on this site. Talks about Itesh in the third person.</p>
          </div>
        </header>
        <ArceeChat variant="page" active ask={(fn) => (ask.current = fn)} />
      </div>

      <aside className="flex flex-col gap-6">
        <div data-animate="slap" className="postcard" style={{ "--d": "80ms" } as CSSProperties}>
          <div className="flex items-start justify-between gap-4">
            <p className="font-mono text-[12px] tracking-wide text-fg-muted uppercase">What I know</p>
            <ArceeStamp className="size-12" />
          </div>
          <ul className="mt-3 flex flex-col gap-1.5 text-[15px]">
            {KNOWS.map((k) => (
              <li key={k} className="flex gap-2">
                <span aria-hidden="true" className="mt-[7px] size-1.5 shrink-0 rounded-full bg-violet" />
                {k}
              </li>
            ))}
          </ul>
        </div>

        <div data-animate="slap" className="postcard" style={{ "--d": "160ms" } as CSSProperties}>
          <p className="font-mono text-[12px] tracking-wide text-fg-muted uppercase">Try asking</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[...SUGGESTIONS, "What's DiaLabs?", "Which project uses WebGPU?"].map((s) => (
              <button key={s} type="button" onClick={() => ask.current(s)} className="filter-chip text-[13px]">
                {s}
              </button>
            ))}
          </div>
        </div>

        <div data-animate="slap" className="postcard" style={{ "--d": "240ms" } as CSSProperties}>
          <p className="font-mono text-[12px] tracking-wide text-fg-muted uppercase">Leaving a message</p>
          <p className="mt-2 text-[15px] leading-snug">
            Tell Arcee what you want to say. It drafts the message and shows it to you first; nothing is sent until you press send.
          </p>
          <p className="mt-3 border-t border-dashed border-line pt-2 text-[14px] text-fg-muted">
            Not to be confused with{" "}
            <TransitionLink href="/work/arcee" transitionLabel="Arcee" className="font-semibold text-fg underline decoration-violet underline-offset-4">
              Arcee, the desktop agent
            </TransitionLink>
            , which only shares the name.
          </p>
        </div>
      </aside>
    </div>
  );
}
