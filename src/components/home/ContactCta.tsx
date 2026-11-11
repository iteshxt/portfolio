import { ArrowUpRight } from "@/components/icons";
import { Reveal } from "@/components/motion/Reveal";
import { Scribble } from "@/components/motion/Scribble";
import { SectionHeading } from "@/components/type/SectionHeading";
import { EmailButton } from "@/components/ui/EmailButton";
import { SITE } from "@/content/site";

/** Closing call to action: ink block by day, violet block by night. */
export function ContactCta() {
  return (
    <section className="px-gutter bg-ink py-[clamp(72px,12vw,160px)] text-paper night:bg-violet night:text-white">
      <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-10">
        <SectionHeading
          tone="inverse"
          kicker={{ day: "Contact", night: "Contact, after hours" }}
          day={{ sans: "Got something", serif: "worth building?" }}
          night={{ sans: "Still awake?", serif: "So is the inbox." }}
        />
        <Reveal className="flex flex-col gap-6">
          <p className="max-w-lg text-[clamp(17px,1.5vw,21px)] opacity-80">
            Roles, collaborations, or a project that needs both a model and a product around it. Say hi.
          </p>
          <EmailButton email={SITE.email} />
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {(
              [
                ["LinkedIn", SITE.socials.linkedin],
                ["GitHub", SITE.socials.github],
                ["X", SITE.socials.x],
              ] as const
            ).map(([label, href]) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[18px]">
                  <Scribble inverse>{label}</Scribble> <ArrowUpRight className="text-[15px]" />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
