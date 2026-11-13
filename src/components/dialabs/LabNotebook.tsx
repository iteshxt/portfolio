import type { CSSProperties } from "react";
import { ArrowUpRight } from "@/components/icons";
import { Scribble } from "@/components/motion/Scribble";
import type { Release } from "@/content/dialabs";
import { cn } from "@/lib/cn";

export const KIND_TONE: Record<Release["kind"], string> = {
  App: "bg-violet text-white",
  Model: "bg-lime text-[#2B3600]",
  Tool: "bg-lavender text-violet-ink",
  Bot: "bg-tomato text-[#2A0700]",
  Site: "bg-sunflower text-[#4A3A00]",
};

/**
 * The lab's releases as experiments in a notebook (docs/design.md §2.13): a sheet
 * of graph paper with a red margin line; each entry is numbered, asks the question
 * the release set out to answer, then gives the method (how it's built) and the
 * result, stamped, with its links.
 */
export function LabNotebook({ releases }: { releases: Release[] }) {
  return (
    <div className="notebook relative overflow-hidden rounded-[28px] border-[5px] border-[var(--die)] bg-surface shadow-[0_30px_70px_-40px_rgb(0_0_0/0.5)]">
      <ol className="relative">
        {releases.map((r, i) => (
          <li
            key={r.name}
            data-animate="rise"
            style={{ "--d": "60ms" } as CSSProperties}
            className="notebook-entry grid gap-6 border-b-2 border-dashed border-line px-[clamp(20px,3.4vw,56px)] py-[clamp(28px,4vw,52px)] last:border-b-0 md:grid-cols-[9rem_1fr_minmax(0,24rem)] md:gap-10"
          >
            <div className="flex items-center gap-3 md:flex-col md:items-start">
              <p className="font-mono text-[13px] tracking-[0.2em] text-fg-muted uppercase">Exp</p>
              <p className="text-[clamp(44px,5vw,72px)] leading-none font-semibold tracking-[-0.05em] [font-variation-settings:'wdth'_76]">{String(i + 1).padStart(2, "0")}</p>
              <span className={cn("rounded-full border-[3px] border-[var(--die)] px-3 py-0.5 text-[12px] font-semibold shadow-[0_6px_14px_-8px_rgb(0_0_0/0.4)]", KIND_TONE[r.kind])}>{r.kind}</span>
            </div>
            <div>
              <h3 className="text-[clamp(32px,3.8vw,56px)] leading-[0.95] font-semibold tracking-[-0.045em] [font-variation-settings:'wdth'_80]">{r.name}</h3>
              <p className="mt-4 max-w-[34ch] font-serif text-[clamp(21px,2vw,28px)] leading-[1.2] italic">&ldquo;{r.question}&rdquo;</p>
            </div>
            <div className="flex flex-col gap-4 text-[15px] leading-snug">
            <dl className="flex flex-col gap-4">
              <div>
                <dt className="font-mono text-[11px] tracking-wider text-fg-muted uppercase">Method</dt>
                <dd className="mt-1">{r.night}</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] tracking-wider text-fg-muted uppercase">Result</dt>
                <dd className="mt-1">{r.result}</dd>
              </div>
            </dl>
              <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-3">
                <span className="notebook-stamp rounded-[5px] border-[2.5px] px-2.5 py-0.5 font-mono text-[12px] font-semibold tracking-wider uppercase">{r.stamp}</span>
                {r.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold">
                    <Scribble>{l.label}</Scribble> <ArrowUpRight className="text-[13px]" />
                  </a>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
