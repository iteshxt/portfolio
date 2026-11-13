import { OpenArceeButton } from "@/components/arcee/OpenArceeButton";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { Reveal } from "@/components/motion/Reveal";
import { Scribble } from "@/components/motion/Scribble";
import { SectionTitle } from "@/components/type/SectionTitle";
import { Sticker } from "@/components/ui/Sticker";
import { EmailButton } from "@/components/ui/EmailButton";
import { SITE } from "@/content/site";

const CHANNELS = [
  { label: "LinkedIn", href: SITE.socials.linkedin, day: "The formal version." },
  { label: "GitHub", href: SITE.socials.github, day: "The receipts." },
  { label: "X", href: SITE.socials.x, day: "Occasional thoughts." },
];

/**
 * Closing call to action: ink block by day, violet block by night. The heading
 * spans the top; below it, the email and Arcee on one side and the channels as
 * big rows on the other (stacked on phones).
 */
export function ContactCta() {
  return (
    <section className="px-gutter bg-ink py-[clamp(72px,12vw,160px)] text-paper night:bg-violet night:text-white">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-[clamp(40px,6vw,72px)]">
        <SectionTitle kicker="Contact" inverse>
          Got something{" "}
          <span className="whitespace-nowrap">
            <Sticker size="word" tone="lime" tilt={-2}>
              worth building
            </Sticker>
            ?
          </span>
        </SectionTitle>
        <Reveal className="grid gap-12 border-t border-white/20 pt-[clamp(28px,4vw,48px)] lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col items-start gap-7">
            <p className="max-w-md text-[clamp(17px,1.5vw,21px)] leading-snug">
              Roles, collaborations, or a project that needs both a model and a product around it. Say hi.
            </p>
            <EmailButton email={SITE.email} />
            <OpenArceeButton
              seed="I want to leave a message for Itesh"
              className="group inline-flex items-center gap-2 text-[16px] underline decoration-white/40 underline-offset-[6px] transition-colors hover:decoration-current"
            >
              Or leave Arcee a message
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </OpenArceeButton>
          </div>
          <ul className="border-b border-white/20">
            {CHANNELS.map((c) => (
              <li key={c.label} className="border-t border-white/20">
                <a href={c.href} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-6 py-5">
                  <Scribble inverse className="text-[clamp(30px,3.2vw,48px)] font-semibold tracking-[-0.04em] [font-variation-settings:'wdth'_82]">
                    {c.label}
                  </Scribble>
                  <span className="flex items-center gap-4 text-right text-[15px]">
                    <span className="hidden sm:inline">{c.day}</span>
                    <ArrowUpRight className="text-[24px] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
