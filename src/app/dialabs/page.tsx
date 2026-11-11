import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { ArrowUpRight } from "@/components/icons";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { PageHero } from "@/components/shell/PageHero";
import { SectionHeading } from "@/components/type/SectionHeading";
import { DIALABS_URL, RELEASES, TEAM_NOTE } from "@/content/dialabs";
import { PAGES } from "@/content/pages";
import { cn } from "@/lib/cn";

export const metadata: Metadata = pageMetadata({
  title: "DiaLabs",
  description: "DiaLabs, the open-source AI/ML lab Itesh co-founded: PatentIQ, DiaChat, fine-tuned models, Stryde and more.",
  path: "/dialabs",
});

const KIND_TONE: Record<string, string> = {
  App: "bg-violet text-white",
  Model: "bg-lime text-[#2B3600]",
  Tool: "bg-lavender text-violet-ink",
  Bot: "bg-tomato text-[#2A0700]",
  Site: "bg-sunflower text-[#4A3A00]",
};

export default function DiaLabsPage() {
  return (
    <main className="flex-1">
      <PageHero copy={PAGES.dialabs}>
        <p>An open-source AI/ML organisation, co-founded by Itesh, that releases free AI products and developer tools.</p>
      </PageHero>

      <section className="px-gutter pb-[clamp(64px,10vw,140px)]">
        <div className="mx-auto max-w-[1440px]">
          <RevealText className="max-w-[24ch] text-[clamp(28px,4vw,60px)] leading-[1.06] font-medium tracking-[-0.03em] [font-variation-settings:'wdth'_85]">
            <span className="day-only">Models, data and the apps that use them, all out in the open.</span>
            <span className="night-only">Fine-tune, evaluate, ship, publish the weights. Then do it again.</span>
          </RevealText>
        </div>
      </section>

      <section className="px-gutter pb-[clamp(64px,10vw,140px)]">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <SectionHeading kicker={{ day: "Releases" }} day={{ sans: "Out in", serif: "the open" }} />
            <a
              href={DIALABS_URL}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-fg px-5 py-3 text-[15px] font-medium"
            >
              DiaLabs on GitHub
              <ArrowUpRight className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {RELEASES.map((r, i) => (
              <Reveal as="li" key={r.name} delay={(i % 3) * 80} className="flex flex-col justify-between gap-6 rounded-[26px] border border-line bg-surface p-6">
                <div>
                  <span className={cn("inline-block rounded-full px-3 py-0.5 text-[12px] font-medium", KIND_TONE[r.kind])}>{r.kind}</span>
                  <h3 className="display-sans mt-4 text-[clamp(32px,3.2vw,44px)]">{r.name}</h3>
                  <p className="mt-3 leading-snug">
                    <span className="day-only">{r.day}</span>
                    <span className="night-only">{r.night}</span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-[15px]">
                  {r.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline decoration-line underline-offset-4 hover:decoration-current">
                      {l.label} <ArrowUpRight className="text-[13px]" />
                    </a>
                  ))}
                </div>
              </Reveal>
            ))}
          </ul>
          <p className="mt-10 max-w-2xl text-fg-muted">{TEAM_NOTE}</p>
        </div>
      </section>
    </main>
  );
}
