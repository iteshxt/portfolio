import type { CSSProperties } from "react";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { StarVisual } from "@/components/home/StarVisual";
import { RevealText } from "@/components/motion/RevealText";
import { Scribble } from "@/components/motion/Scribble";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { SectionTitle } from "@/components/type/SectionTitle";
import { Sticker } from "@/components/ui/Sticker";
import type { CaseStudy } from "@/content/case-studies";
import type { Project } from "@/content/projects";
import { STAR_PROJECTS } from "@/content/projects";
import { brandOf } from "@/lib/brand";
import { cn } from "@/lib/cn";
import { StarStage } from "./StarStage";

const NOTE_TONES = ["case-note-sunflower", "case-note-lavender", "case-note-lime", "case-note-paper"];
const STATE = {
  done: { label: "Gate passed", cls: "case-stamp-done" },
  doing: { label: "In progress", cls: "case-stamp-doing" },
  next: { label: "Next", cls: "case-stamp-next" },
} as const;

/**
 * A star project's case study, as the case file opened (docs/design.md §2.11):
 * the folder from the work page, open on the desk, in the project's own colours.
 * An index card with a status stamp, the evidence, what it does, how it works
 * (a pipeline that draws itself as you scroll), notes taped in for the decisions,
 * the project's extra exhibit, and the next file's tab to finish.
 */
export function CaseStudyView({ study, project, next }: { study: CaseStudy; project: Project; next: Project }) {
  const brand = brandOf(project);
  const nextBrand = brandOf(next);
  const links = [
    project.links.live && { label: "Live", href: project.links.live },
    project.links.repo && { label: "GitHub", href: project.links.repo },
    ...(project.links.extra ?? []),
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <main className="flex-1">
      {/* The opened file */}
      <section data-section={study.name} className="px-gutter pt-24 pb-[clamp(48px,7vw,96px)] md:pt-28">
        <div className="mx-auto max-w-[1320px]">
          <div className="flex items-end justify-between gap-4">
            <p
              className={cn(
                "case-tab rounded-t-[14px] border-[4px] border-b-0 border-[var(--die)] px-4 pt-2 pb-3 font-mono text-[13px] tracking-wider uppercase",
                brand.fill,
                brand.onFill,
              )}
            >
              Case {String(project.order).padStart(2, "0")} / {String(STAR_PROJECTS.length).padStart(2, "0")}
            </p>
            <TransitionLink href="/work" transitionLabel="Work" className="mb-3 inline-flex items-center gap-1.5 text-[14px] font-medium text-fg-muted hover:text-fg">
              <ArrowRight className="rotate-180" /> <Scribble>All work</Scribble>
            </TransitionLink>
          </div>
          <div className={cn("case-sheet relative grid overflow-hidden rounded-[28px] rounded-tl-none border-[5px] border-[var(--die)] lg:grid-cols-[1fr_1.05fr]", brand.fill, brand.onFill)}>
            <div className="relative z-10 flex flex-col gap-6 p-[clamp(22px,3.4vw,56px)] lg:justify-between">
              <div>
                <p className="font-mono text-[13px] tracking-wide uppercase opacity-80">
                  {project.year} · the case file
                </p>
                <h1 className="mt-3 text-[clamp(56px,9vw,148px)] leading-[0.88] font-semibold tracking-[-0.055em] [font-variation-settings:'wdth'_76]">
                  {study.name}
                </h1>
                <p className="mt-5 max-w-[34ch] text-[clamp(17px,1.5vw,22px)] leading-snug">{study.summary.day}</p>
              </div>
              {/* The index card clipped to the file, with its status stamped on. */}
              <dl className="case-card relative grid max-w-[460px] gap-x-6 gap-y-3 rounded-[16px] bg-surface p-5 pt-[60px] text-fg sm:grid-cols-2">
                <div>
                  <dt className="font-mono text-[11px] tracking-wider text-fg-muted uppercase">Role</dt>
                  <dd className="mt-0.5 text-[15px] leading-snug">{study.role}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] tracking-wider text-fg-muted uppercase">When</dt>
                  <dd className="mt-0.5 text-[15px] leading-snug">{study.timeline}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="font-mono text-[11px] tracking-wider text-fg-muted uppercase">Links</dt>
                  <dd className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-[15px] font-semibold">
                    {links.map((l) => (
                      <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">
                        <Scribble>{l.label}</Scribble> <ArrowUpRight className="text-[13px]" />
                      </a>
                    ))}
                  </dd>
                </div>
                <p aria-label={`Status: ${study.status}`} className="case-status-stamp absolute top-3.5 right-4 left-5 w-fit max-w-[calc(100%-36px)] rounded-[6px] border-[3px] px-2.5 py-1 text-center font-mono text-[12px] leading-tight font-semibold tracking-wider uppercase">
                  {study.status}
                </p>
              </dl>
            </div>
            <StarStage slug={study.slug} className="min-h-[300px] night:[filter:saturate(0.85)_brightness(0.88)] lg:min-h-[560px]" />
          </div>
        </div>
      </section>

      {/* The evidence */}
      <section data-section="Evidence" className="px-gutter pb-[clamp(64px,9vw,128px)]">
        <ul className="mx-auto grid max-w-[1320px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {study.stats.map((s, i) => (
            <li
              key={s.label}
              data-animate="slap"
              style={{ "--d": `${i * 90}ms` } as CSSProperties}
              className="flex flex-col gap-2 rounded-[22px] border-[4px] border-[var(--die)] bg-surface p-6 shadow-[0_14px_30px_-20px_rgb(0_0_0/0.35)]"
            >
              <span className={cn("size-2.5 rounded-full", brand.dot)} />
              <p className="text-[clamp(48px,5vw,76px)] leading-none font-semibold tracking-[-0.05em] [font-variation-settings:'wdth'_78]">{s.value}</p>
              <p className="text-[15px] leading-snug text-fg-muted">{s.label}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* What it does */}
      <section data-section="What it does" className="px-gutter py-[clamp(48px,7vw,96px)]">
        <div className="mx-auto grid max-w-[1320px] gap-[clamp(32px,5vw,80px)] lg:grid-cols-[0.85fr_1.15fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionTitle kicker="What it does">
              In plain{" "}
              <Sticker size="word" tone="lime" tilt={-2}>
                words
              </Sticker>
              .
            </SectionTitle>
            <p className="mt-6 max-w-[40ch] text-[clamp(17px,1.4vw,20px)] leading-snug text-fg-muted">{study.day.intro}</p>
          </div>
          <ol className="border-b border-line">
            {study.day.points.map((p, i) => (
              <li key={p.title} data-animate="rise" style={{ "--d": `${i * 70}ms` } as CSSProperties} className="grid grid-cols-[3.5rem_1fr] gap-4 border-t border-line py-7">
                <span className="font-mono text-[14px] text-fg-muted">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-[clamp(22px,2vw,30px)] leading-tight font-semibold tracking-[-0.03em] [font-variation-settings:'wdth'_85]">{p.title}</h3>
                  <p className="mt-2 max-w-[52ch] leading-snug text-fg-muted">{p.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* How it works */}
      <section data-section="How it works" className="px-gutter py-[clamp(56px,8vw,120px)]">
        <div className="mx-auto max-w-[1320px]">
          <SectionTitle kicker="How it works">
            Under the{" "}
            <Sticker size="word" tone="violet" tilt={2}>
              hood
            </Sticker>
            .
          </SectionTitle>
          <RevealText className="mt-8 max-w-[30ch] text-[clamp(24px,2.9vw,42px)] leading-[1.18] font-medium tracking-[-0.03em] [font-variation-settings:'wdth'_85]">
            {study.summary.night}
          </RevealText>
          <p className="mt-6 max-w-[56ch] text-fg-muted">{study.night.intro}</p>

          {/* The pipeline: a line runs through the steps and fills as you scroll past. */}
          <ol className="case-pipe relative mt-14 grid gap-8 md:gap-5" style={{ "--steps": study.night.pipeline.length } as CSSProperties}>
            <span aria-hidden="true" className={cn("case-pipe-line", brand.dot)} />
            {study.night.pipeline.map((s, i) => (
              <li key={s.step} data-animate="rise" style={{ "--d": `${i * 90}ms` } as CSSProperties} className="relative grid grid-cols-[44px_1fr] gap-4 md:flex md:flex-col md:gap-4">
                <span className={cn("relative z-10 flex size-11 items-center justify-center rounded-full border-[3px] border-[var(--die)] font-mono text-[13px] font-semibold", brand.dot, brand.onDot)}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-[clamp(24px,2.2vw,32px)] leading-none font-semibold tracking-[-0.04em] [font-variation-settings:'wdth'_80]">{s.step}</h3>
                  <p className="mt-2 text-[15px] leading-snug text-fg-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* Decisions: notes taped into the file */}
          <h3 className="mt-[clamp(64px,8vw,112px)] font-serif text-[clamp(26px,2.6vw,36px)] italic">Decisions that mattered</h3>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {study.night.decisions.map((d, i) => (
              <li
                key={d.title}
                data-animate="slap"
                style={{ "--d": `${i * 80}ms`, "--tilt": `${[-1.2, 0.9, -0.6, 1.1][i % 4]}deg` } as CSSProperties}
                className={cn("case-note relative rounded-[6px] p-6 pt-8", NOTE_TONES[i % NOTE_TONES.length])}
              >
                <h4 className="text-[19px] leading-tight font-semibold tracking-[-0.02em]">{d.title}</h4>
                <p className="mt-2 text-[15px] leading-snug opacity-80">{d.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The exhibit: PatentIQ's rubric, Arcee's gated phases */}
      {study.breakdown && (
        <section data-section="The rubric" className="px-gutter py-[clamp(48px,7vw,96px)]">
          <div className="mx-auto max-w-[1320px]">
            <SectionTitle kicker="Exhibit A">
              The{" "}
              <Sticker size="word" tone="sunflower" tilt={-2}>
                rubric
              </Sticker>
              .
            </SectionTitle>
            <p className="mt-4 text-fg-muted">{study.breakdown.caption}</p>
            <ul className="mt-10 flex flex-col gap-3.5">
              {study.breakdown.rows.map((r, i) => (
                <li key={r.label} data-animate="row" style={{ "--d": `${i * 45}ms`, "--w": r.value / r.max } as CSSProperties} className="case-bar grid grid-cols-[minmax(0,15rem)_1fr_4.5rem] items-center gap-4">
                  <span className="flex items-center gap-2 text-[15px]">
                    {r.label}
                    {r.note && <span className="rounded-full bg-lime px-2 py-0.5 text-[11px] font-semibold text-[#2B3600]">{r.note}</span>}
                  </span>
                  <span className="h-4 overflow-hidden rounded-full bg-line">
                    <span className={cn("case-bar-fill block h-full rounded-full", brand.dot)} />
                  </span>
                  <span className="text-right font-mono text-[14px]">{r.value} pts</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      {study.progress && (
        <section data-section="The gates" className="px-gutter py-[clamp(48px,7vw,96px)]">
          <div className="mx-auto max-w-[1320px]">
            <SectionTitle kicker="Exhibit A">
              Built in gated{" "}
              <Sticker size="word" tone="sunflower" tilt={-2}>
                phases
              </Sticker>
              .
            </SectionTitle>
            <p className="mt-4 text-fg-muted">{study.progress.caption}</p>
            <ol className="mt-10 border-b border-line">
              {study.progress.rows.map((r, i) => (
                <li key={r.label} data-animate="rise" style={{ "--d": `${i * 60}ms` } as CSSProperties} className="grid items-center gap-3 border-t border-line py-6 sm:grid-cols-[3rem_15rem_1fr_auto] sm:gap-6">
                  <span className="font-mono text-[13px] text-fg-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[19px] font-semibold tracking-[-0.02em]">{r.label}</span>
                  <span className="text-fg-muted">{r.note}</span>
                  <span className={cn("case-stamp w-fit rounded-[5px] border-[2.5px] px-2.5 py-0.5 font-mono text-[12px] font-semibold tracking-wider uppercase", STATE[r.state].cls)}>
                    {STATE[r.state].label}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* The next file's tab */}
      <section className="px-gutter pt-[clamp(32px,5vw,64px)] pb-[clamp(96px,10vw,150px)]">
        <div className="mx-auto max-w-[1320px]">
          <TransitionLink href={`/work/${next.slug}`} transitionLabel={next.name} data-fly-card="" className="case-next group block">
            <span className={cn("inline-block rounded-t-[14px] border-[4px] border-b-0 border-[var(--die)] px-4 pt-2 pb-3 font-mono text-[13px] tracking-wider uppercase", nextBrand.fill, nextBrand.onFill)}>
              Next file
            </span>
            <span className={cn("case-next-body relative -mt-[2px] flex items-center justify-between gap-6 overflow-hidden rounded-[24px] rounded-tl-none border-[5px] border-[var(--die)] p-[clamp(20px,3vw,40px)]", nextBrand.fill, nextBrand.onFill)}>
              <span>
                <span className="block font-mono text-[13px] tracking-wide uppercase opacity-80">
                  Case {String(next.order).padStart(2, "0")}
                </span>
                <span className="mt-2 block text-[clamp(52px,9vw,140px)] leading-[0.88] font-semibold tracking-[-0.055em] [font-variation-settings:'wdth'_76]">{next.name}</span>
                <span className="mt-3 inline-flex items-center gap-2 text-[16px] font-semibold">
                  Open it <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" />
                </span>
              </span>
              <span data-fly-source={next.slug} className="case-next-art relative hidden h-[clamp(140px,16vw,220px)] w-[clamp(180px,24vw,340px)] shrink-0 items-center justify-center sm:flex">
                <StarVisual slug={next.slug} />
              </span>
            </span>
          </TransitionLink>
        </div>
      </section>
    </main>
  );
}
