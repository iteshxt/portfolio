"use client";

import type { CSSProperties } from "react";
import { Star } from "@/components/icons";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { CATEGORY_LABELS, type Project } from "@/content/projects";
import { jumpToProject } from "./jump";

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
 * glide down to their tile on the shelf.
 */
export function ShippingManifest({ projects, stars }: { projects: Project[]; stars: number }) {
  return (
    <div className="manifest w-full max-w-[420px] drop-shadow-[0_24px_30px_rgb(0_0_0/0.16)]">
      <div className="receipt bg-surface px-5 pt-6 pb-9 font-mono text-[13px] text-fg">
        <p className="text-center text-[15px] font-semibold tracking-[0.2em]">SHIPPING MANIFEST</p>
        <p className="mt-1 text-center text-[12px] text-fg-muted">everything that made it out the door</p>
        <p className="mt-4 flex justify-between border-y border-dashed border-line py-1.5 text-[11px] tracking-wider text-fg-muted">
          <span>NO. ITEM</span>
          <span>KIND · YEAR</span>
        </p>
        <div className="manifest-window relative mt-1 h-[min(46vh,380px)] overflow-hidden">
          <div className="manifest-roll" style={{ "--rows": projects.length } as CSSProperties}>
            <Rows projects={projects} />
            <Rows projects={projects} copy />
          </div>
        </div>
        <div className="mt-2 flex flex-col gap-1 border-t border-dashed border-line pt-3">
          <p className="flex justify-between font-semibold">
            <span>TOTAL SHIPPED</span>
            <span>{projects.length}</span>
          </p>
          <p className="flex justify-between text-fg-muted">
            <span>WITH A CASE FILE</span>
            <span>{stars}</span>
          </p>
        </div>
        <div aria-hidden="true" className="manifest-barcode mx-auto mt-5 h-11 w-[78%]" />
        <p className="mt-2 text-center text-[11px] text-fg-muted">thanks for scrolling</p>
      </div>
    </div>
  );
}
