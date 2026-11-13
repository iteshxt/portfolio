import type { Metadata } from "next";
import { OpenArceeButton } from "@/components/arcee/OpenArceeButton";
import { ArrowDown, ArrowRight, Spark } from "@/components/icons";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { SectionTitle } from "@/components/type/SectionTitle";
import { ScrollButton } from "@/components/ui/ScrollButton";
import { Sticker } from "@/components/ui/Sticker";
import { CaseFiles } from "@/components/work/CaseFiles";
import { CountUp } from "@/components/work/CountUp";
import { ProjectShelf } from "@/components/work/ProjectShelf";
import { ShippingManifest } from "@/components/work/ShippingManifest";
import { ARCHIVE_PROJECTS, STAR_PROJECTS } from "@/content/projects";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Work",
  description: "Three star projects with full case studies (Arcee, PatentIQ, DiaChat) and everything else Itesh has built and shipped.",
  path: "/work",
});

export default function WorkPage() {
  const all = [...STAR_PROJECTS, ...ARCHIVE_PROJECTS];
  return (
    <main className="flex-1">
      {/* Hero: a count of everything shipped, and the manifest that lists it */}
      <section data-section="Work" className="faded-mat px-gutter pt-28 pb-[clamp(56px,8vw,112px)] md:pt-36">
        <div className="mx-auto grid max-w-[1320px] items-center gap-[clamp(40px,6vw,96px)] lg:grid-cols-[1.15fr_0.85fr]">
          <div className="flex flex-col items-start">
            <p data-animate="rise" className="font-serif text-[clamp(20px,1.9vw,28px)] text-fg-muted italic">
              Work
            </p>
            <h1
              data-animate="rise"
              style={{ "--d": "80ms" } as React.CSSProperties}
              className="mt-4 max-w-[13ch] text-[clamp(44px,6.4vw,104px)] leading-[1.02] font-semibold tracking-[-0.045em] [font-variation-settings:'wdth'_80]"
            >
              <Sticker size="word" tone="lime" tilt={-3}>
                <CountUp to={all.length} />
              </Sticker>{" "}
              things, built and{" "}
              <Sticker size="word" tone="violet" tilt={2}>
                shipped
              </Sticker>
              .
            </h1>
            <p data-animate="rise" style={{ "--d": "160ms" } as React.CSSProperties} className="mt-7 max-w-[44ch] text-[clamp(16px,1.3vw,19px)] leading-[1.55] text-fg-muted">
              Everything that made it out the door. Three come with the full story; the rest with live links and code.
            </p>
            <div data-animate="rise" style={{ "--d": "240ms" } as React.CSSProperties} className="mt-8 flex flex-wrap gap-3">
              <ScrollButton to="case-files" className="btn btn-ink">
                Open the case files
                <ArrowDown />
              </ScrollButton>
              <ScrollButton to="the-shelf" className="btn btn-paper">
                Browse the shelf
                <ArrowDown />
              </ScrollButton>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <ShippingManifest projects={all} stars={STAR_PROJECTS.length} />
          </div>
        </div>
      </section>

      {/* Star projects as case files */}
      <section id="case-files" data-section="Case files" className="px-gutter scroll-mt-10 py-[clamp(56px,8vw,120px)]">
        <div className="mx-auto max-w-[1240px]">
          <SectionTitle kicker="Case files" className="mb-[clamp(36px,5vw,72px)]">
            Three with the{" "}
            <Sticker size="word" tone="tomato" tilt={-2}>
              full story
            </Sticker>
            .
          </SectionTitle>
          <CaseFiles projects={STAR_PROJECTS} />
        </div>
      </section>

      {/* Everything else, on the shelf */}
      {ARCHIVE_PROJECTS.length > 0 && (
        <section id="the-shelf" data-section="The shelf" className="px-gutter scroll-mt-10 py-[clamp(56px,8vw,120px)]">
          <div className="mx-auto max-w-[1320px]">
            <SectionTitle kicker="The shelf">
              The rest,{" "}
              <span className="whitespace-nowrap">
                <Sticker size="word" tone="sunflower" tilt={2}>
                  all shipped
                </Sticker>
                .
              </span>
            </SectionTitle>
            <ProjectShelf projects={ARCHIVE_PROJECTS} />
          </div>
        </section>
      )}

      {/* The end of the manifest: somewhere to go next, not a contact form */}
      <section data-section="That's the lot" className="px-gutter pt-[clamp(24px,4vw,48px)] pb-[clamp(110px,12vw,170px)]">
        <div className="mx-auto flex max-w-[1320px] flex-col items-start gap-8 border-t-2 border-dashed border-line pt-[clamp(40px,6vw,80px)] md:flex-row md:items-end md:justify-between">
          <SectionTitle kicker="That&rsquo;s the lot">
            Curious about{" "}
            <span className="whitespace-nowrap">
              <Sticker size="word" tone="lavender" tilt={-2}>
                one
              </Sticker>
              ?
            </span>
          </SectionTitle>
          <div className="flex flex-wrap gap-3">
            <OpenArceeButton seed="Tell me more about one of the projects" className="btn btn-lime">
              <Spark />
              Ask Arcee about it
            </OpenArceeButton>
            <TransitionLink href="/about" transitionLabel="About" className="btn btn-paper">
              The person behind them
              <ArrowRight />
            </TransitionLink>
          </div>
        </div>
      </section>
    </main>
  );
}
