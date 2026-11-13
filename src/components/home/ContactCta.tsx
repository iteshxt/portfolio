import { OpenArceeButton } from "@/components/arcee/OpenArceeButton";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { Reveal } from "@/components/motion/Reveal";
import { Scribble } from "@/components/motion/Scribble";
import { SectionHeading } from "@/components/type/SectionHeading";
import { EmailButton } from "@/components/ui/EmailButton";
import { SITE } from "@/content/site";

const CHANNELS = [
  { label: "LinkedIn", href: SITE.socials.linkedin, day: "The formal version.", night: "Where the resume lives." },
  { label: "GitHub", href: SITE.socials.github, day: "The receipts.", night: "Read the code, not the claims." },
  { label: "X", href: SITE.socials.x, day: "Occasional thoughts.", night: "Late-night thoughts." },
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
        <SectionHeading
          tone="inverse"
          kicker={{ day: "Contact", night: "Contact, after hours" }}
          day={{ sans: "Got something", serif: "worth building?" }}
          night={{ sans: "Still awake?", serif: "So is the inbox." }}
        />
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
                  <Scribble inverse className="display-sans text-[clamp(34px,3.6vw,56px)]">
                    {c.label}
                  </Scribble>
                  <span className="flex items-center gap-4 text-right text-[15px]">
                    <span className="day-only hidden sm:inline">{c.day}</span>
                    <span className="night-only hidden sm:inline">{c.night}</span>
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
