import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { SectionHeading } from "@/components/type/SectionHeading";
import { ShiftHeadline } from "@/components/type/ShiftHeadline";
import type { CaseStudy } from "@/content/case-studies";
import { PAGES } from "@/content/pages";
import type { Project } from "@/content/projects";
import { brandOf } from "@/lib/brand";
import { cn } from "@/lib/cn";
import { StarStage } from "./StarStage";

/**
 * Star project case study (docs/prd.md §7.2). Both stories are always on the
 * page; the current shift's story comes first (day: what, night: how).
 */
export function CaseStudyView({ study, project, next }: { study: CaseStudy; project: Project; next: Project }) {
  const brand = brandOf(project);

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="px-gutter flex flex-col items-center gap-10 pt-28 pb-16 text-center">
        <ShiftHeadline copy={PAGES[study.slug]} />
        <div className={cn("relative w-full max-w-[1200px] border-[clamp(8px,1.1vw,16px)]", brand.frame, brand.fill)}>
          <StarStage slug={study.slug} className="h-[clamp(320px,58vh,620px)]" />
        </div>
      </section>

      {/* Meta strip */}
      <section className="px-gutter pb-[clamp(48px,7vw,96px)]">
        <dl className="mx-auto grid max-w-[1200px] gap-6 border-y border-line py-6 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              ["Role", study.role],
              ["When", study.timeline],
              ["Status", study.status],
            ] as const
          ).map(([k, v]) => (
            <div key={k}>
              <dt className="text-[13px] text-fg-muted">{k}</dt>
              <dd className="mt-1 text-[16px]">{v}</dd>
            </div>
          ))}
          <div>
            <dt className="text-[13px] text-fg-muted">Links</dt>
            <dd className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[16px]">
              {project.links.live && (
                <a href={project.links.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline decoration-line underline-offset-4 hover:decoration-current">
                  Live <ArrowUpRight className="text-[13px]" />
                </a>
              )}
              {project.links.repo && (
                <a href={project.links.repo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline decoration-line underline-offset-4 hover:decoration-current">
                  Code <ArrowUpRight className="text-[13px]" />
                </a>
              )}
              {project.links.extra?.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline decoration-line underline-offset-4 hover:decoration-current">
                  {l.label} <ArrowUpRight className="text-[13px]" />
                </a>
              ))}
            </dd>
          </div>
        </dl>
      </section>

      {/* Summary + stats */}
      <section className="px-gutter pb-[clamp(64px,10vw,140px)]">
        <div className="mx-auto max-w-[1200px]">
          <RevealText className="max-w-[26ch] text-[clamp(28px,3.8vw,56px)] leading-[1.08] font-medium tracking-[-0.03em] [font-variation-settings:'wdth'_85]">
            <span className="day-only">{study.summary.day}</span>
            <span className="night-only">{study.summary.night}</span>
          </RevealText>
          <ul className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {study.stats.map((s, i) => (
              <Reveal as="li" key={s.label} delay={i * 80} className="border-t-2 border-fg pt-4">
                <p className="display-sans text-[clamp(56px,6vw,96px)] normal-case">{s.value}</p>
                <p className="mt-2 max-w-[22ch] text-fg-muted">{s.label}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* The two stories: current shift first */}
      <div className="flex flex-col">
        <section className="px-gutter order-1 pb-[clamp(64px,10vw,140px)] night:order-2">
          <div className="mx-auto max-w-[1200px]">
            <SectionHeading
              className="mb-6"
              kicker={{ day: "By day: what it does", night: "And by day: what it does" }}
              day={{ sans: "What it", serif: "does" }}
            />
            <p className="mb-10 max-w-2xl text-[clamp(17px,1.5vw,21px)] text-fg-muted">{study.day.intro}</p>
            <ul className="grid gap-5 md:grid-cols-2">
              {study.day.points.map((p, i) => (
                <Reveal as="li" key={p.title} delay={(i % 2) * 90} className="rounded-[26px] border border-line bg-surface p-6">
                  <span className={cn("mb-4 block size-3 rounded-full", brand.dot)} />
                  <h3 className="text-[clamp(20px,1.8vw,24px)] font-semibold tracking-tight">{p.title}</h3>
                  <p className="mt-2 leading-snug text-fg-muted">{p.body}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        <section className="px-gutter order-2 pb-[clamp(64px,10vw,140px)] night:order-1">
          <div className="mx-auto max-w-[1200px]">
            <SectionHeading
              className="mb-6"
              kicker={{ day: "And by night: how it works", night: "By night: how it works" }}
              day={{ sans: "How it", serif: "works" }}
            />
            <p className="mb-12 max-w-2xl text-[clamp(17px,1.5vw,21px)] text-fg-muted">{study.night.intro}</p>

            <ol className="relative mb-16 flex flex-col gap-0 before:absolute before:top-3 before:bottom-3 before:left-[19px] before:w-px before:bg-line">
              {study.night.pipeline.map((s, i) => (
                <Reveal as="li" key={s.step} delay={i * 60} className="relative grid grid-cols-[40px_1fr] gap-5 py-4">
                  <span className={cn("relative z-10 flex size-10 items-center justify-center rounded-full font-mono text-[13px]", brand.dot, brand.onDot)}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="pt-1.5">
                    <h3 className="display-sans text-[clamp(28px,3vw,40px)]">{s.step}</h3>
                    <p className="mt-1 max-w-2xl leading-snug text-fg-muted">{s.body}</p>
                  </div>
                </Reveal>
              ))}
            </ol>

            <h3 className="mb-6 font-serif text-[clamp(26px,2.6vw,36px)] italic">Decisions that mattered</h3>
            <ul className="grid gap-5 md:grid-cols-2">
              {study.night.decisions.map((d, i) => (
                <Reveal as="li" key={d.title} delay={(i % 2) * 90} className="rounded-[26px] bg-ink p-6 text-paper night:bg-surface night:text-fg">
                  <h4 className="text-[clamp(19px,1.7vw,22px)] font-semibold tracking-tight">{d.title}</h4>
                  <p className="mt-2 leading-snug opacity-75">{d.body}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* Breakdown / progress */}
      {(study.breakdown || study.progress) && (
        <section className="px-gutter pb-[clamp(64px,10vw,140px)]">
          <div className="mx-auto max-w-[1200px]">
            {study.breakdown && (
              <>
                <SectionHeading className="mb-4" kicker={{ day: study.breakdown.caption }} day={{ sans: "The", serif: "rubric" }} />
                <ul className="mt-10 flex flex-col gap-3">
                  {study.breakdown.rows.map((r, i) => (
                    <Reveal as="li" key={r.label} delay={i * 40} className="grid grid-cols-[minmax(0,14rem)_1fr_4rem] items-center gap-4">
                      <span className="text-[15px]">
                        {r.label}
                        {r.note && <span className="ml-2 rounded-full bg-lime px-2 py-0.5 text-[11px] text-[#2B3600]">{r.note}</span>}
                      </span>
                      <span className="h-3 overflow-hidden rounded-full bg-line">
                        <span className={cn("block h-full rounded-full", brand.dot)} style={{ width: `${(r.value / r.max) * 100}%` }} />
                      </span>
                      <span className="text-right font-mono text-[14px]">{r.value} pts</span>
                    </Reveal>
                  ))}
                </ul>
              </>
            )}
            {study.progress && (
              <>
                <SectionHeading className="mb-4" kicker={{ day: study.progress.caption }} day={{ sans: "Gated", serif: "phases" }} />
                <ol className="mt-10 border-b border-line">
                  {study.progress.rows.map((r, i) => (
                    <Reveal as="li" key={r.label} delay={i * 50} className="grid gap-2 border-t border-line py-5 sm:grid-cols-[3rem_14rem_1fr_auto] sm:items-baseline sm:gap-6">
                      <span className="font-mono text-[13px] text-fg-muted">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-[18px] font-medium">{r.label}</span>
                      <span className="text-fg-muted">{r.note}</span>
                      <span
                        className={cn(
                          "w-fit rounded-full px-3 py-0.5 text-[12px] font-medium",
                          r.state === "done" && "bg-lime text-[#2B3600]",
                          r.state === "doing" && "bg-sunflower text-[#4A3A00]",
                          r.state === "next" && "border border-line text-fg-muted",
                        )}
                      >
                        {r.state === "done" ? "Gate passed" : r.state === "doing" ? "In progress" : "Next"}
                      </span>
                    </Reveal>
                  ))}
                </ol>
              </>
            )}
          </div>
        </section>
      )}

      {/* Next project */}
      <section className="px-gutter pb-[clamp(72px,10vw,140px)]">
        <TransitionLink
          href={`/work/${next.slug}`}
          transitionLabel={next.name}
          className="group mx-auto flex max-w-[1200px] items-end justify-between gap-6 border-t-2 border-fg pt-6"
        >
          <span>
            <span className="block font-serif text-[clamp(18px,1.6vw,22px)] text-fg-muted">Next star project</span>
            <span className="display-sans block text-[clamp(56px,10vw,160px)] transition-colors group-hover:text-accent-text">{next.name}</span>
          </span>
          <ArrowRight className="mb-[2vw] shrink-0 text-[clamp(36px,5vw,72px)] transition-transform duration-500 ease-[var(--ease-expo-out)] group-hover:translate-x-2" />
        </TransitionLink>
      </section>
    </main>
  );
}
