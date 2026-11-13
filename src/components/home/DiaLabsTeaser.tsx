import { ArrowRight } from "@/components/icons";
import { Reveal } from "@/components/motion/Reveal";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { SectionTitle } from "@/components/type/SectionTitle";
import { Sticker, type StickerTone } from "@/components/ui/Sticker";

const RELEASES: { name: string; tone: StickerTone }[] = [
  { name: "PatentIQ", tone: "tomato" },
  { name: "DiaChat", tone: "sunflower" },
  { name: "dia-convo-v1.2c", tone: "lime" },
  { name: "Stryde", tone: "paper" },
  { name: "Dia Moderator", tone: "lavender" },
];

/** DiaLabs as one chapter (not the headline): a full-bleed violet block. */
export function DiaLabsTeaser() {
  return (
    <section className="px-gutter bg-violet py-[clamp(72px,11vw,150px)] text-white">
      <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <SectionTitle kicker="Co-founded" inverse>
          DiaLabs, an{" "}
          <Sticker size="word" tone="lime" tilt={-3}>
            open
          </Sticker>{" "}
          lab.
        </SectionTitle>
        <Reveal className="flex flex-col gap-7">
          <p className="max-w-lg text-[clamp(17px,1.5vw,21px)] leading-snug">
            An open-source AI/ML organisation that releases free AI products and developer tools: fine-tuned Gemma and Qwen models, a
            conversation dataset, a patent evaluator, and the apps that run them.
          </p>
          <ul className="flex flex-wrap gap-2.5">
            {RELEASES.map((r, i) => (
              <li key={r.name}>
                <Sticker tone={r.tone} tilt={i % 2 ? 2.5 : -2}>
                  {r.name}
                </Sticker>
              </li>
            ))}
          </ul>
          <TransitionLink
            href="/dialabs"
            transitionLabel="DiaLabs"
            className="btn btn-paper"
          >
            Inside the lab
            <ArrowRight />
          </TransitionLink>
        </Reveal>
      </div>
    </section>
  );
}
