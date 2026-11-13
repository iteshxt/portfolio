import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { GuestPasses } from "@/components/about/GuestPass";
import { StickerLid } from "@/components/about/StickerLid";
import { ArrowUpRight } from "@/components/icons";
import { RevealText } from "@/components/motion/RevealText";
import { SectionTitle } from "@/components/type/SectionTitle";
import { CuriousEnd } from "@/components/ui/CuriousEnd";
import { Sticker } from "@/components/ui/Sticker";
import { CERTIFICATES, EDUCATION, EXPERIENCE } from "@/content/profile";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: "Itesh Singh Tomar: ML engineer and full-stack developer. How he works, who he's built for, and the stickers on his laptop.",
  path: "/about",
});

/** How he works, each backed by something real in the work. */
const PRINCIPLES = [
  { line: "Evals before claims.", proof: "Arcee ships against 44 whole-task evals; at Caudal AI Labs the job was evaluating LLM systems." },
  { line: "Write the decision down.", proof: "Arcee's design choices live in numbered decision records, each with what was tried and why." },
  { line: "Small commits, often.", proof: "377 commits in Arcee's first 18 days, every one small enough to read and undo." },
  { line: "Local when it can be.", proof: "Arcee runs fully on Ollama with --core local; DiaChat answers on the visitor's own GPU." },
  { line: "Ship the product around the model.", proof: "PatentIQ is a mentor dashboard, reports and billing, not just a prompt." },
];

export default function AboutPage() {
  const degree = EDUCATION[0];
  return (
    <main className="flex-1">
      {/* The lid */}
      <section data-section="About" className="px-gutter pt-28 pb-[clamp(56px,8vw,112px)] md:pt-32">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-[clamp(28px,4vw,52px)] flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
            <div>
              <p data-animate="rise" className="font-serif text-[clamp(20px,1.9vw,28px)] text-fg-muted italic">
                About
              </p>
              <h1
                data-animate="rise"
                style={{ "--d": "80ms" } as CSSProperties}
                className="mt-3 max-w-[16ch] text-[clamp(40px,5.6vw,88px)] leading-[1.04] font-semibold tracking-[-0.045em] [font-variation-settings:'wdth'_80]"
              >
                Most of me fits on a{" "}
                <Sticker size="word" tone="violet" tilt={-2.5}>
                  laptop lid
                </Sticker>
                .
              </h1>
            </div>
            <p data-animate="rise" style={{ "--d": "160ms" } as CSSProperties} className="max-w-[34ch] text-[clamp(16px,1.3vw,19px)] leading-[1.5] text-fg-muted md:text-right">
              ML engineer and full-stack developer. Every sticker on this lid is true, and each one has a story.
            </p>
          </div>
          <StickerLid />
        </div>
      </section>

      {/* How he works */}
      <section data-section="How I work" className="px-gutter py-[clamp(56px,8vw,120px)]">
        <div className="mx-auto max-w-[1240px]">
          <SectionTitle kicker="How I work">
            A few{" "}
            <Sticker size="word" tone="lime" tilt={2}>
              house rules
            </Sticker>
            .
          </SectionTitle>
          <ol className="mt-[clamp(32px,5vw,64px)] border-b border-line">
            {PRINCIPLES.map((p, i) => (
              <li key={p.line} className="grid gap-3 border-t border-line py-[clamp(22px,3vw,36px)] md:grid-cols-[5rem_1fr_minmax(0,22rem)] md:items-baseline md:gap-8">
                <span className="font-mono text-[14px] text-fg-muted">{String(i + 1).padStart(2, "0")}</span>
                <RevealText className="text-[clamp(30px,4.2vw,60px)] leading-[1.02] font-semibold tracking-[-0.045em] [font-variation-settings:'wdth'_80]">{p.line}</RevealText>
                <p className="font-mono text-[13px] leading-relaxed text-fg-muted">{p.proof}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Work for others */}
      <section data-section="Shipped for others" className="px-gutter py-[clamp(56px,8vw,120px)]">
        <div className="mx-auto max-w-[1240px]">
          <SectionTitle kicker="Shipped for others" className="mb-[clamp(32px,5vw,64px)]">
            Who I&rsquo;ve{" "}
            <Sticker size="word" tone="sunflower" tilt={-2}>
              worked
            </Sticker>{" "}
            for.
          </SectionTitle>
          <GuestPasses items={EXPERIENCE} />
        </div>
      </section>

      {/* The fine print */}
      <section data-section="The fine print" className="px-gutter py-[clamp(40px,6vw,80px)]">
        <div className="mx-auto grid max-w-[1240px] gap-8 border-t-2 border-dashed border-line pt-8 md:grid-cols-[12rem_1fr_1fr] md:gap-12">
          <h2 className="font-serif text-[clamp(24px,2.2vw,30px)] italic">The fine print</h2>
          <div>
            <p className="font-mono text-[11px] tracking-wider text-fg-muted uppercase">Studying</p>
            <p className="mt-2 text-[15px] leading-snug">
              {degree.detail}
              <br />
              <span className="text-fg-muted">
                {degree.school}, {degree.period.replace(/[A-Za-z]{3} /g, "")}
              </span>
            </p>
          </div>
          <div>
            <p className="font-mono text-[11px] tracking-wider text-fg-muted uppercase">Certificates</p>
            <ul className="mt-2 flex flex-col gap-1.5 text-[15px] leading-snug">
              {CERTIFICATES.map((c) => (
                <li key={c.name}>
                  {c.url ? (
                    <a href={c.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline decoration-line underline-offset-4 hover:decoration-current">
                      {c.name} <ArrowUpRight className="text-[12px]" />
                    </a>
                  ) : (
                    c.name
                  )}
                  <span className="text-fg-muted"> · {c.issuer}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CuriousEnd
        kicker="Still curious?"
        seed="Tell me about Itesh"
        second={{ href: "/contact", label: "Say hi", transitionLabel: "Contact" }}
        title={
          <>
            Ask the{" "}
            <Sticker size="word" tone="lavender" tilt={-2}>
              chatbot
            </Sticker>{" "}
            about me.
          </>
        }
      />
    </main>
  );
}
