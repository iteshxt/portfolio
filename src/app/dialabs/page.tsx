import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { OpenArceeButton } from "@/components/arcee/OpenArceeButton";
import { LabBot } from "@/components/dialabs/LabBot";
import { LabNotebook } from "@/components/dialabs/LabNotebook";
import { ArrowDown, ArrowUpRight, Spark } from "@/components/icons";
import { SectionTitle } from "@/components/type/SectionTitle";
import { ScrollButton } from "@/components/ui/ScrollButton";
import { Sticker } from "@/components/ui/Sticker";
import { DIALABS_SITE, DIALABS_URL, RELEASES, TEAM_RELEASES } from "@/content/dialabs";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "DiaLabs",
  description: "DiaLabs, the open-source AI/ML lab Itesh co-founded: PatentIQ, DiaChat, fine-tuned models, Stryde and more.",
  path: "/dialabs",
});

export default function DiaLabsPage() {
  return (
    <main className="flex-1">
      {/* The lab's robot, watching you */}
      <section data-section="DiaLabs" className="px-gutter pt-28 pb-[clamp(56px,8vw,112px)] md:pt-36">
        <div className="mx-auto grid max-w-[1240px] items-center gap-[clamp(40px,6vw,96px)] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col items-start">
            <p data-animate="rise" className="font-serif text-[clamp(20px,1.9vw,28px)] text-fg-muted italic">
              DiaLabs · co-founded
            </p>
            <h1
              data-animate="rise"
              style={{ "--d": "80ms" } as CSSProperties}
              className="mt-4 max-w-[12ch] text-[clamp(44px,6.4vw,100px)] leading-[1.02] font-semibold tracking-[-0.045em] [font-variation-settings:'wdth'_80]"
            >
              A lab that works in the{" "}
              <Sticker size="word" tone="lime" tilt={-3}>
                open
              </Sticker>
              .
            </h1>
            <p data-animate="rise" style={{ "--d": "160ms" } as CSSProperties} className="mt-7 max-w-[44ch] text-[clamp(16px,1.3vw,19px)] leading-[1.55] text-fg-muted">
              An open-source AI and ML organisation that releases free products, models and developer tools. Every release starts as a question.
            </p>
            <div data-animate="rise" style={{ "--d": "240ms" } as CSSProperties} className="mt-8 flex flex-wrap gap-3">
              <ScrollButton to="notebook" className="btn btn-ink">
                Open the notebook
                <ArrowDown />
              </ScrollButton>
              <a href={DIALABS_SITE} target="_blank" rel="noreferrer" className="btn btn-paper">
                Visit dialabs.tech
                <ArrowUpRight />
              </a>
            </div>
          </div>
          <div data-animate="slap" style={{ "--d": "200ms" } as CSSProperties} className="relative flex justify-center lg:justify-end">
            <LabBot />
            {/* The lab's address, stuck on the edge of its sticker like a URL sticker on a laptop. */}
            <a
              href={DIALABS_SITE}
              target="_blank"
              rel="noreferrer"
              data-cursor="Visit the lab"
              className="lab-url absolute right-[6%] bottom-[6%] inline-flex items-center gap-1.5 rounded-[12px] border-[4px] border-white bg-ink px-3.5 py-1.5 font-mono text-[clamp(13px,1.2vw,16px)] font-semibold text-lime shadow-[0_12px_22px_-10px_rgb(0_0_0/0.55)] lg:right-0"
            >
              dialabs.tech <ArrowUpRight className="text-[12px]" />
            </a>
            <p aria-hidden="true" className="labbot-note absolute top-[2%] left-0 flex items-start gap-1 text-accent-text lg:-left-[4%]">
              <span className="-rotate-[8deg] font-hand text-[clamp(22px,2vw,28px)] leading-none whitespace-nowrap">it&rsquo;s watching you</span>
              <svg viewBox="0 0 60 48" className="mt-3 w-[46px] overflow-visible">
                <path d="M4 6 C 20 4, 34 10, 38 22 C 41 31, 36 38, 30 34 C 24 30, 34 22, 44 30 C 50 35, 53 40, 55 44" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M46 41 L 56 45 L 58 34" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </p>
          </div>
        </div>
      </section>

      {/* The notebook */}
      <section id="notebook" data-section="The notebook" className="px-gutter scroll-mt-10 py-[clamp(48px,7vw,104px)]">
        <div className="mx-auto max-w-[1240px]">
          <SectionTitle kicker="The notebook" className="mb-[clamp(32px,5vw,60px)]">
            Every release was a{" "}
            <Sticker size="word" tone="sunflower" tilt={2}>
              question
            </Sticker>
            .
          </SectionTitle>
          <LabNotebook releases={RELEASES} />
          <div className="mt-[clamp(28px,4vw,48px)] flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
            <p className="font-serif text-[clamp(18px,1.6vw,22px)] text-fg-muted italic">Also from the lab, by the rest of the team:</p>
            <ul className="flex flex-wrap gap-2">
              {TEAM_RELEASES.map((t) => (
                <li key={t} className="rounded-full border-[3px] border-[var(--die)] bg-surface px-3.5 py-1 text-[14px] shadow-[0_6px_14px_-10px_rgb(0_0_0/0.4)]">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* The end */}
      <section data-section="Join in" className="px-gutter pt-[clamp(24px,4vw,48px)] pb-[clamp(110px,12vw,170px)]">
        <div className="mx-auto flex max-w-[1240px] flex-col items-start gap-8 border-t-2 border-dashed border-line pt-[clamp(40px,6vw,80px)] md:flex-row md:items-end md:justify-between">
          <SectionTitle kicker="Next experiment">
            Everything here is{" "}
            <Sticker size="word" tone="lavender" tilt={-2}>
              open
            </Sticker>
            .
          </SectionTitle>
          <div className="flex flex-wrap gap-3">
            <a href={DIALABS_SITE} target="_blank" rel="noreferrer" className="btn btn-ink">
              Visit the lab
              <ArrowUpRight />
            </a>
            <a href={DIALABS_URL} target="_blank" rel="noreferrer" className="btn btn-paper">
              Read the code
              <ArrowUpRight />
            </a>
            <OpenArceeButton seed="Tell me about DiaLabs" className="btn btn-lime">
              <Spark />
              Ask Arcee about the lab
            </OpenArceeButton>
          </div>
        </div>
      </section>
    </main>
  );
}
