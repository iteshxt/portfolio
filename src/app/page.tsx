import type { Metadata } from "next";
import { ArchiveMarquee } from "@/components/home/ArchiveMarquee";
import { ContactCta } from "@/components/home/ContactCta";
import { DiaLabsTeaser } from "@/components/home/DiaLabsTeaser";
import { ExperienceList } from "@/components/home/ExperienceList";
import { StarStack } from "@/components/home/StarStack";
import { Suspense } from "react";
import { OpenArceeButton } from "@/components/arcee/OpenArceeButton";
import { ArrowDown, ArrowRight, Spark } from "@/components/icons";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { LocalTime } from "@/components/shell/LocalTime";
import { NowBuilding } from "@/components/shell/NowBuilding";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { SectionHeading } from "@/components/type/SectionHeading";
import { ShiftHeadline } from "@/components/type/ShiftHeadline";
import { Sticker } from "@/components/ui/Sticker";
import { HOME } from "@/content/pages";
import { EXPERIENCE } from "@/content/profile";
import { ARCHIVE_PROJECTS, STAR_PROJECTS } from "@/content/projects";

const FACTS = [
  { text: "B.Tech CSE · LPU · CGPA 8.53", tone: "paper", tilt: -2 },
  { text: "320+ LeetCode", tone: "lime", tilt: 2 },
  { text: "Co-founder, DiaLabs", tone: "lavender", tilt: -1.5 },
  { text: "Based in Delhi", tone: "sunflower", tilt: 2.5 },
] as const;

export const metadata: Metadata = { alternates: { canonical: "/" } };

/** Concrete, scannable facts under the intro line. */
const GLANCE = [
  { k: "Now", v: "Final-year B.Tech CSE at LPU, graduating 2027" },
  { k: "Last role", v: "AI systems evaluation intern at Caudal AI Labs" },
  { k: "Shipped", v: "Payments and logistics for 500+ monthly customers at Sutr" },
  { k: "Building", v: "DiaLabs: free, open-source AI products and dev tools" },
] as const;

function AvailableDot() {
  return (
    <span className="relative flex size-2">
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime opacity-70 motion-reduce:animate-none" />
      <span className="relative inline-flex size-2 rounded-full bg-lime ring-1 ring-black/10" />
    </span>
  );
}

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="px-gutter relative flex min-h-[100svh] flex-col items-center justify-center pt-24 pb-40 text-center md:pt-28 md:pb-32">
        {/* Meta strip: availability and local time (desktop). */}
        <div className="px-gutter absolute inset-x-0 top-[72px] hidden items-center justify-between text-[13px] text-fg-muted md:flex">
          <span className="flex items-center gap-2">
            <AvailableDot />
            Open to ML and full-stack roles
          </span>
          <span className="font-mono">
            Delhi, IN · <LocalTime />
          </span>
        </div>

        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-[13px] text-fg-muted md:hidden">
          <AvailableDot />
          Open to ML and full-stack roles
        </span>

        <ShiftHeadline copy={HOME} cycle heightScale={0.78} />

        <div className="mt-[clamp(20px,3.2vh,40px)] flex flex-col items-center gap-6">
          <p className="max-w-[60ch] text-[clamp(16px,1.35vw,20px)] text-balance leading-[1.5] text-fg-muted">
            <span className="day-only">
              Right now: a desktop agent that plans and uses your apps, an AI screener for patent drafts, and a fine-tuned
              Gemma&nbsp;3 that runs in the browser.
            </span>
            <span className="night-only">
              Planner/executor loops, citation checks before the LLM, Gemma on WebGPU. Every call logged, every model
              evaluated.
            </span>
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {FACTS.map((f) => (
              <Sticker key={f.text} tone={f.tone} tilt={f.tilt} className="text-[14px]">
                {f.text}
              </Sticker>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <TransitionLink
              href="/work"
              transitionLabel="Work"
              className="group inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 text-[15px] font-medium text-bg transition-colors hover:bg-violet hover:text-white"
            >
              See the work
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </TransitionLink>
            <OpenArceeButton
              seed="What are you building right now?"
              className="group inline-flex items-center gap-2 rounded-full border border-fg px-6 py-3 text-[15px] font-medium transition-colors hover:bg-fg hover:text-bg"
            >
              <Spark className="transition-transform duration-500 group-hover:rotate-90" />
              Ask Arcee
            </OpenArceeButton>
          </div>
        </div>

        <p className="absolute bottom-28 left-1/2 flex -translate-x-1/2 items-center gap-2 font-serif text-[18px] text-fg-muted md:bottom-10 md:left-[clamp(16px,4vw,48px)] md:translate-x-0">
          <ArrowDown className="animate-bounce motion-reduce:animate-none" />
          <span className="day-only">Scroll for the good stuff</span>
          <span className="night-only">Scroll for the details</span>
        </p>
        <div className="absolute right-[clamp(16px,4vw,48px)] bottom-9 hidden max-w-[min(340px,calc(50vw-260px))] lg:block">
          <Suspense fallback={null}>
            <NowBuilding compact />
          </Suspense>
        </div>
      </section>

      {/* Intro */}
      <section className="px-gutter py-[clamp(64px,10vw,140px)]">
        <div className="mx-auto max-w-[1440px]">
          <RevealText className="max-w-[22ch] text-[clamp(30px,4.6vw,72px)] leading-[1.05] font-medium tracking-[-0.03em] [font-variation-settings:'wdth'_85]">
            <span className="day-only">
              ML engineer and full-stack developer. Fine-tunes models, builds agents, ships products people actually pay for.
            </span>
            <span className="night-only">
              Evals before vibes. Logs before guesses. Decision records for the big calls, tests for the small ones.
            </span>
          </RevealText>
          <Reveal as="div" delay={150} className="mt-[clamp(40px,6vw,80px)]">
            <dl className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
              {GLANCE.map((g) => (
                <div key={g.k} className="border-t border-fg pt-4">
                  <dt className="font-serif text-[20px] italic text-fg-muted">{g.k}</dt>
                  <dd className="mt-1 text-[17px] leading-[1.45] font-medium">{g.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Star projects */}
      <section className="px-gutter pt-[clamp(32px,6vw,80px)] pb-[clamp(48px,8vw,120px)]">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading
            kicker={{ day: "Star projects", night: "Star projects, under the hood" }}
            day={{ sans: "The good", serif: "stuff" }}
            night={{ sans: "The hard", serif: "parts" }}
          />
          <StarStack projects={STAR_PROJECTS} />
        </div>
      </section>

      {/* Archive */}
      {ARCHIVE_PROJECTS.length > 0 && (
        <section className="px-gutter py-[clamp(48px,8vw,120px)]">
          <div className="mx-auto max-w-[1440px]">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                kicker={{ day: "Everything else", night: "Everything else, shipped" }}
                day={{ sans: "More", serif: "projects" }}
                night={{ sans: "Side quests,", serif: "main effort" }}
              />
              <TransitionLink
                href="/work"
                transitionLabel="Work"
                className="group inline-flex items-center gap-2 rounded-full border border-fg px-5 py-3 text-[15px] font-medium"
              >
                See all work
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </TransitionLink>
            </div>
            <ArchiveMarquee projects={ARCHIVE_PROJECTS} />
          </div>
        </section>
      )}

      <DiaLabsTeaser />

      {/* Experience */}
      <section className="px-gutter py-[clamp(64px,10vw,140px)]">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              kicker={{ day: "Experience", night: "Experience, the how" }}
              day={{ sans: "Shipped", serif: "for others" }}
              night={{ sans: "Tested,", serif: "then shipped" }}
            />
            <TransitionLink
              href="/about"
              transitionLabel="About"
              className="group inline-flex items-center gap-2 rounded-full border border-fg px-5 py-3 text-[15px] font-medium"
            >
              The full story
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </TransitionLink>
          </div>
          <ExperienceList items={EXPERIENCE} />
        </div>
      </section>

      <ContactCta />
    </main>
  );
}
