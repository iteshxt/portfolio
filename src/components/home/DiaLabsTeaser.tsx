import { ArrowRight } from "@/components/icons";
import { Reveal } from "@/components/motion/Reveal";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { SectionHeading } from "@/components/type/SectionHeading";
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
        <SectionHeading
          tone="inverse"
          kicker={{ day: "Co-founded", night: "Co-founded, and still tinkering" }}
          day={{ sans: "DiaLabs,", serif: "an open lab" }}
          night={{ sans: "Open models,", serif: "open data" }}
        />
        <Reveal className="flex flex-col gap-7">
          <p className="max-w-lg text-[clamp(17px,1.5vw,21px)] leading-snug">
            <span className="day-only">
              An open-source AI/ML organisation that releases free AI products and developer tools.
            </span>
            <span className="night-only">
              A fine-tuned Qwen model, a conversation dataset, a patent evaluator, and the apps that run them.
            </span>
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
            className="group inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-[15px] font-medium text-violet-ink"
          >
            Inside the lab
            <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </TransitionLink>
        </Reveal>
      </div>
    </section>
  );
}
