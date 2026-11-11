import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { TransitionLink } from "@/components/transition/TransitionLink";
import type { Project } from "@/content/projects";
import { cn } from "@/lib/cn";
import { StarVisual } from "./StarVisual";

const FRAME = {
  violet: "border-violet",
  tomato: "border-tomato",
  sunflower: "border-sunflower",
} as const;

const FILL = {
  violet: "bg-violet",
  tomato: "bg-tomato",
  sunflower: "bg-sunflower",
} as const;

/**
 * Star projects as a stack of framed cards (docs/design.md §6 "featured
 * stack"): each card sticks near the top and the next one slides over it.
 * Pure CSS (position: sticky), so it's smooth everywhere and free on mobile.
 */
export function StarStack({ projects }: { projects: Project[] }) {
  return (
    <ol className="mt-12 flex flex-col gap-[14vh] pb-[6vh]">
      {projects.map((p, i) => {
        const accent = p.accent ?? "violet";
        return (
          <li key={p.slug} className="sticky" style={{ top: `calc(10vh + ${i * 26}px)` }}>
            <article
              className={cn(
                "grid overflow-hidden border-[clamp(8px,1.1vw,16px)] bg-surface shadow-[0_30px_80px_-40px_rgb(0_0_0/0.45)] md:min-h-[min(70vh,620px)] md:grid-cols-[1.15fr_1fr]",
                FRAME[accent],
              )}
              style={{ rotate: `${i % 2 === 0 ? -0.8 : 0.9}deg` }}
            >
              <div className="flex flex-col justify-between gap-8 p-[clamp(20px,3vw,44px)]">
                <div>
                  <p className="font-mono text-[13px] text-fg-muted">
                    0{p.order} · {p.year}
                  </p>
                  <h3 className="display-sans mt-4 text-[clamp(56px,9vw,150px)]">{p.name}</h3>
                  <p className="mt-5 max-w-md text-[clamp(17px,1.5vw,21px)] leading-snug">
                    <span className="day-only">{p.day}</span>
                    <span className="night-only">{p.night}</span>
                  </p>
                </div>
                <div className="flex flex-col gap-5">
                  <ul className="flex flex-wrap gap-2" aria-label="Stack">
                    {p.stack.map((s) => (
                      <li key={s} className="rounded-full border border-line px-3 py-1 text-[13px] text-fg-muted">
                        {s}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                    <TransitionLink
                      href={`/work/${p.slug}`}
                      transitionLabel={p.name}
                      className="group inline-flex items-center gap-2 rounded-full bg-fg px-5 py-3 text-[15px] font-medium text-bg"
                    >
                      Read the case study
                      <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                    </TransitionLink>
                    {p.links.live && (
                      <a href={p.links.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[15px] underline decoration-line underline-offset-4 hover:decoration-current">
                        Try it live <ArrowUpRight className="text-[14px]" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className={cn("relative flex min-h-56 items-center justify-center", FILL[accent])}>
                <StarVisual slug={p.slug} />
              </div>
            </article>
          </li>
        );
      })}
    </ol>
  );
}
