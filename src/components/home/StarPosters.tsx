import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { PinnedTrack } from "@/components/motion/PinnedTrack";
import { Scribble } from "@/components/motion/Scribble";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { PeelReveal } from "@/components/ui/PeelReveal";
import type { Project } from "@/content/projects";
import { brandOf } from "@/lib/brand";
import { cn } from "@/lib/cn";
import { StarVisual } from "./StarVisual";

/**
 * Star projects as posters (docs/design.md §2.9): each one a big die-cut sticker
 * in its app's colours, artwork large, name huge, and "how it works" under a
 * peelable sticker. They slide sideways through a pinned section as you scroll.
 */
export function StarPosters({ projects, header }: { projects: Project[]; header: React.ReactNode }) {
  return (
    <PinnedTrack header={header}>
      {projects.map((p, i) => {
        const brand = brandOf(p);
        return (
          <article
            key={p.slug}
            data-fly-card=""
            className={cn(
              "poster relative grid shrink-0 overflow-hidden rounded-[28px] border-[6px] border-white shadow-[0_30px_70px_-30px_rgb(0_0_0/0.5)] md:h-[min(68vh,620px)] md:w-[min(82vw,1120px)] md:grid-cols-[1fr_1.1fr]",
              brand.fill,
              brand.onFill,
            )}
            style={{ rotate: `${i % 2 ? 0.8 : -0.8}deg` }}
          >
            <div className="relative z-10 flex flex-col justify-between gap-8 p-[clamp(22px,3vw,44px)]">
              <div>
                <p className="font-mono text-[13px] tracking-wide uppercase opacity-80">
                  {String(p.order).padStart(2, "0")} / {String(projects.length).padStart(2, "0")} · {p.year}
                </p>
                <h3 className="mt-4 text-[clamp(56px,7vw,124px)] leading-[0.9] font-semibold tracking-[-0.05em] [font-variation-settings:'wdth'_78]">
                  {p.name}
                </h3>
                <p className="mt-5 max-w-sm text-[clamp(17px,1.4vw,21px)] leading-snug">{p.day}</p>
              </div>
              <div className="flex flex-col gap-5">
                <PeelReveal label="Peel for how it works" cover="bg-surface text-fg" className="max-w-md">
                  <p className="font-mono text-[12px] tracking-wide uppercase opacity-80">How it works</p>
                  <p className="mt-2 text-[15px] leading-snug">{p.night}</p>
                  <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Stack">
                    {p.stack.map((s) => (
                      <li key={s} className="rounded-full border border-current/25 px-2.5 py-0.5 text-[12px]">
                        {s}
                      </li>
                    ))}
                  </ul>
                </PeelReveal>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                  <TransitionLink href={`/work/${p.slug}`} transitionLabel={p.name} className="btn btn-paper">
                    Read the case study
                    <ArrowRight />
                  </TransitionLink>
                  {p.links.live && (
                    <a href={p.links.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[15px] font-medium">
                      <Scribble inverse>Try it live</Scribble> <ArrowUpRight className="text-[14px]" />
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div data-fly-source={p.slug} data-cursor="View" className={cn("poster-art relative flex min-h-72 items-center justify-center", brand.fill)}>
              <StarVisual slug={p.slug} />
            </div>
          </article>
        );
      })}
    </PinnedTrack>
  );
}
