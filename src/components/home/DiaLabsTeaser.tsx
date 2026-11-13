import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { GrowIn } from "@/components/motion/GrowIn";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { SectionTitle } from "@/components/type/SectionTitle";
import { PeelReveal } from "@/components/ui/PeelReveal";
import { Sticker } from "@/components/ui/Sticker";
import { RELEASES } from "@/content/dialabs";

const COVERS = [
  "bg-patentiq text-patentiq-ink",
  "bg-diachat text-diachat-ink",
  "bg-lime text-[#2B3600]",
  "bg-surface text-fg",
  "bg-tomato text-[#2A0700]",
  "bg-lavender text-violet-ink",
];
const TILTS = [-2.5, 2, 1.5, -2, -1.5, 2.5];

/**
 * DiaLabs as one chapter (docs/design.md §2.11): a violet band that grows from a
 * sticker as it scrolls in, with the lab's releases as a board of peelable
 * stickers (name and kind on top; what it is and its links underneath).
 */
export function DiaLabsTeaser() {
  return (
    <section data-section="DiaLabs" className="py-[clamp(24px,4vw,48px)]">
      <GrowIn className="px-gutter bg-violet py-[clamp(72px,10vw,140px)] text-white">
        <div className="mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-[1fr_1.15fr] lg:items-center">
          <div className="flex flex-col items-start gap-7">
            <SectionTitle kicker="Co-founded" inverse>
              DiaLabs, an{" "}
              <Sticker size="word" tone="lime" tilt={-3}>
                open
              </Sticker>{" "}
              lab.
            </SectionTitle>
            <p className="max-w-md text-[clamp(17px,1.5vw,21px)] leading-snug">
              An open-source AI/ML organisation that releases free AI products and developer tools. Peel a sticker to see what each one is.
            </p>
            <TransitionLink href="/dialabs" transitionLabel="DiaLabs" className="btn btn-paper">
              Inside the lab
              <ArrowRight />
            </TransitionLink>
          </div>
          <ul className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
            {RELEASES.map((r, i) => (
              <li key={r.name} style={{ rotate: `${TILTS[i % TILTS.length]}deg` }}>
                <PeelReveal label={r.name} eyebrow={r.kind} cover={COVERS[i % COVERS.length]} className="h-full [&>div:first-child]:min-h-[128px] [&>div:first-child]:border-white/30">
                  <p className="text-[15px] leading-snug">{r.day}</p>
                  <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[14px] font-semibold">
                    {r.links.map((l) => (
                      <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline-offset-4 hover:underline">
                        {l.label} <ArrowUpRight className="text-[12px]" />
                      </a>
                    ))}
                  </p>
                </PeelReveal>
              </li>
            ))}
          </ul>
        </div>
      </GrowIn>
    </section>
  );
}
