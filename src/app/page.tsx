import type { Metadata } from "next";
import { ArchiveWall } from "@/components/home/ArchiveWall";
import { ContactCta } from "@/components/home/ContactCta";
import { DiaLabsTeaser } from "@/components/home/DiaLabsTeaser";
import { ExperienceList } from "@/components/home/ExperienceList";
import { StarPosters } from "@/components/home/StarPosters";
import { Suspense } from "react";
import { OpenArceeButton } from "@/components/arcee/OpenArceeButton";
import { ArrowDown, ArrowRight, Spark } from "@/components/icons";
import { RevealText } from "@/components/motion/RevealText";
import { NowBuilding } from "@/components/shell/NowBuilding";
import { PeelHint } from "@/components/shell/PeelHint";
import { HeroBackdrop } from "@/components/home/HeroBackdrop";
import { Sticker } from "@/components/ui/Sticker";
import { ReactiveHeadline } from "@/components/type/ReactiveHeadline";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { SectionTitle } from "@/components/type/SectionTitle";
import { EXPERIENCE } from "@/content/profile";
import { ARCHIVE_PROJECTS, STAR_PROJECTS } from "@/content/projects";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section data-section="Hello" className="px-gutter relative isolate flex min-h-[100svh] flex-col items-center justify-center pt-24 pb-40 text-center md:pt-28 md:pb-32">
        <HeroBackdrop />
        <PeelHint />

        <div data-parallax="0.28" data-parallax-fade="" className="flex flex-col items-center">
        <p className="font-serif text-[clamp(20px,1.9vw,28px)] text-fg-muted italic">Hi, I&rsquo;m Itesh.</p>
        {/* One readable statement instead of a giant cycling headline; the key words are flickable stickers. */}
        {/* Letters swell towards the cursor; each sticker is kept with its punctuation. */}
        <ReactiveHeadline
          className="mt-4 max-w-[21ch] text-[clamp(38px,5vw,76px)] leading-[1.16] font-semibold tracking-[-0.04em] text-balance [font-variation-settings:'wdth'_82]"
          parts={[
            "I build ",
            { word: "agents", tone: "violet", tilt: -3, after: "," },
            " train ",
            { word: "models", tone: "lime", tilt: 2.5 },
            " and ship ",
            { word: "products", tone: "sunflower", tilt: -2, after: "." },
          ]}
        />

        <div className="mt-[clamp(24px,3.6vh,44px)] flex flex-col items-center gap-7">
          <p className="max-w-[56ch] text-[clamp(16px,1.3vw,19px)] text-balance leading-[1.55] text-fg-muted">
            Right now: a desktop agent that plans and uses your apps, an AI screener for patent drafts, and a fine-tuned
            Gemma&nbsp;3 that runs in the browser.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <TransitionLink
              href="/work"
              transitionLabel="Work"
              className="btn btn-ink"
            >
              See the work
              <ArrowRight />
            </TransitionLink>
            <OpenArceeButton
              seed="What are you building right now?"
              className="btn btn-lime"
            >
              <Spark />
              Ask Arcee
            </OpenArceeButton>
          </div>
        </div>
        </div>

        <p className="absolute bottom-28 left-1/2 flex -translate-x-1/2 items-center gap-2 font-serif text-[18px] text-fg-muted md:bottom-10 md:left-[clamp(16px,4vw,48px)] md:translate-x-0">
          <ArrowDown className="animate-bounce motion-reduce:animate-none" />
          Scroll for the good stuff
        </p>
        <div className="absolute right-[clamp(104px,9vw,150px)] bottom-12 hidden max-w-[min(340px,calc(50vw-300px))] lg:block">
          <Suspense fallback={null}>
            <NowBuilding compact />
          </Suspense>
        </div>
      </section>

      {/* Intro */}
      <section data-section="In short" className="px-gutter py-[clamp(64px,10vw,140px)]">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4">
          <p className="font-serif text-[clamp(18px,1.7vw,24px)] text-fg-muted italic">In short</p>
          <RevealText className="max-w-[30ch] text-[clamp(26px,3.4vw,50px)] leading-[1.2] font-medium tracking-[-0.03em] [font-variation-settings:'wdth'_85]">
            I&rsquo;m an ML engineer and full-stack developer. I fine-tune models, build agents, and ship the product around them, the kind
            people actually pay for.
          </RevealText>
        </div>
      </section>

      {/* Star projects: posters sliding through a pinned section */}
      <section data-section="Selected work" className="pt-[clamp(32px,6vw,80px)] pb-[clamp(48px,8vw,120px)] md:py-0">
        <StarPosters
          projects={STAR_PROJECTS}
          header={
            <div className="px-gutter mx-auto w-full max-w-[1440px]">
              <SectionTitle kicker="Selected work">
                Three I&rsquo;m most{" "}
                <Sticker size="word" tone="tomato" tilt={-2.5}>
                  proud
                </Sticker>{" "}
                of.
              </SectionTitle>
            </div>
          }
        />
      </section>

      {/* Archive */}
      {ARCHIVE_PROJECTS.length > 0 && (
        <section data-section="More projects" className="px-gutter py-[clamp(48px,8vw,120px)]">
          <div className="mx-auto max-w-[1440px]">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionTitle kicker="Everything else">
                More{" "}
                <span className="whitespace-nowrap">
                  <Sticker size="word" tone="lime" tilt={2}>
                    projects
                  </Sticker>
                  ,
                </span>{" "}
                all shipped.
              </SectionTitle>
              <TransitionLink
                href="/work"
                transitionLabel="Work"
                className="btn btn-paper"
              >
                See all work
                <ArrowRight />
              </TransitionLink>
            </div>
            <ArchiveWall projects={ARCHIVE_PROJECTS} />
          </div>
        </section>
      )}

      <DiaLabsTeaser />

      {/* Experience */}
      <section data-section="Experience" className="px-gutter py-[clamp(64px,10vw,140px)]">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <SectionTitle kicker="Experience">
              Shipped for{" "}
              <span className="whitespace-nowrap">
                <Sticker size="word" tone="sunflower" tilt={-2}>
                  others
                </Sticker>
                .
              </span>
            </SectionTitle>
            <TransitionLink
              href="/about"
              transitionLabel="About"
              className="btn btn-paper"
            >
              The full story
              <ArrowRight />
            </TransitionLink>
          </div>
          <ExperienceList items={EXPERIENCE} />
        </div>
      </section>

      <ContactCta />
    </main>
  );
}
