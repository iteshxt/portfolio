import type { CSSProperties } from "react";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { StarVisual } from "@/components/home/StarVisual";
import { Scribble } from "@/components/motion/Scribble";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { CATEGORY_LABELS, type Project } from "@/content/projects";
import { brandOf } from "@/lib/brand";
import { cn } from "@/lib/cn";

/**
 * The star projects on the work page as case files (docs/design.md §2.10): a
 * folder with a tab in the project's colours, the artwork on one side and the
 * what, the how and the stack on the other, alternating sides as you go down.
 * The "how" is shown openly here, unlike the home posters.
 */
export function CaseFiles({ projects }: { projects: Project[] }) {
  return (
    <ol className="flex flex-col gap-[clamp(56px,8vw,112px)]">
      {projects.map((p, i) => {
        const brand = brandOf(p);
        return (
          <li key={p.slug} data-animate="rise" style={{ "--d": "60ms" } as CSSProperties}>
            <article data-fly-card="" className={cn("case-file group relative pt-11", i % 2 === 1 && "case-file-flip")}>
              <p
                className={cn(
                  "case-file-tab absolute top-0 rounded-t-[14px] border-[4px] border-b-0 border-[var(--die)] px-4 pt-2 pb-4 font-mono text-[13px] tracking-wider uppercase",
                  brand.fill,
                  brand.onFill,
                )}
              >
                Case {String(p.order).padStart(2, "0")}
              </p>
              <div className="case-file-body relative grid overflow-hidden rounded-[26px] border-[5px] border-[var(--die)] bg-surface shadow-[0_28px_60px_-34px_rgb(0_0_0/0.45)] md:grid-cols-2">
                <div
                  data-fly-source={p.slug}
                  data-cursor="Open"
                  className={cn(
                    "relative flex min-h-[240px] items-center justify-center night:[filter:saturate(0.85)_brightness(0.88)] md:min-h-[460px]",
                    brand.fill,
                    i % 2 === 1 && "md:order-last",
                  )}
                >
                  <StarVisual slug={p.slug} />
                </div>
                <div className="flex flex-col gap-5 p-[clamp(22px,3.2vw,52px)]">
                  <p className="font-mono text-[13px] tracking-wide text-fg-muted uppercase">
                    {CATEGORY_LABELS[p.category]} · {p.year}
                  </p>
                  <h3 className="-mt-2 text-[clamp(44px,5.6vw,92px)] leading-[0.92] font-semibold tracking-[-0.05em] [font-variation-settings:'wdth'_78]">
                    {p.name}
                  </h3>
                  <p className="max-w-[42ch] text-[clamp(17px,1.4vw,20px)] leading-snug">{p.day}</p>
                  <div className="max-w-[46ch] border-l-[3px] border-violet pl-4">
                    <p className="font-serif text-[18px] text-fg-muted italic">Under the hood</p>
                    <p className="mt-1 text-[15px] leading-snug text-fg-muted">{p.night}</p>
                  </div>
                  <ul className="flex flex-wrap gap-1.5" aria-label="Stack">
                    {p.stack.map((s) => (
                      <li key={s} className="rounded-full border border-line px-2.5 py-0.5 text-[12px] text-fg-muted">
                        {s}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
                    <TransitionLink href={`/work/${p.slug}`} transitionLabel={p.name} className="btn btn-ink">
                      Open the case file
                      <ArrowRight />
                    </TransitionLink>
                    {p.links.live && (
                      <a href={p.links.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[15px] font-medium">
                        <Scribble>Try it live</Scribble> <ArrowUpRight className="text-[14px]" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          </li>
        );
      })}
    </ol>
  );
}
