import type { Metadata } from "next";
import { ArchiveMarquee } from "@/components/home/ArchiveMarquee";
import { ContactCta } from "@/components/home/ContactCta";
import { DiaLabsTeaser } from "@/components/home/DiaLabsTeaser";
import { ExperienceList } from "@/components/home/ExperienceList";
import { StarStack } from "@/components/home/StarStack";
import { ArrowDown, ArrowRight } from "@/components/icons";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
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

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="px-gutter relative flex min-h-[100svh] flex-col items-center justify-center pt-24 pb-36 text-center">
        <ShiftHeadline copy={HOME} cycle />
        <p className="absolute bottom-28 left-1/2 flex -translate-x-1/2 items-center gap-2 font-serif text-[18px] text-fg-muted md:bottom-10 md:left-[clamp(16px,4vw,48px)] md:translate-x-0">
          <ArrowDown className="animate-bounce motion-reduce:animate-none" />
          <span className="day-only">Scroll for the good stuff</span>
          <span className="night-only">Scroll for the details</span>
        </p>
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
          <Reveal as="div" delay={150} className="mt-10 flex flex-wrap gap-3">
            {FACTS.map((f) => (
              <Sticker key={f.text} tone={f.tone} tilt={f.tilt}>
                {f.text}
              </Sticker>
            ))}
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
