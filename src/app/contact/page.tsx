import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { OpenArceeButton } from "@/components/arcee/OpenArceeButton";
import { ArrowUpRight } from "@/components/icons";
import { Reveal } from "@/components/motion/Reveal";
import { Scribble } from "@/components/motion/Scribble";
import { PageHero } from "@/components/shell/PageHero";
import { EmailButton } from "@/components/ui/EmailButton";
import { PAGES } from "@/content/pages";
import { SITE } from "@/content/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Get in touch with Itesh Singh Tomar for roles, collaborations or a project that needs both a model and a product around it.",
  path: "/contact",
});

const CHANNELS = [
  { label: "LinkedIn", href: SITE.socials.linkedin, day: "The formal version.", night: "Where the resume lives." },
  { label: "GitHub", href: SITE.socials.github, day: "The receipts.", night: "Read the code, not the claims." },
  { label: "X", href: SITE.socials.x, day: "Occasional thoughts.", night: "Late-night thoughts." },
];

export default function ContactPage() {
  return (
    <main className="flex-1">
      <PageHero copy={PAGES.contact}>
        <p>Roles, collaborations, or a project that needs both a model and a product around it.</p>
      </PageHero>

      <section className="px-gutter pb-[clamp(64px,10vw,140px)]">
        <div className="mx-auto flex max-w-[960px] flex-col items-center gap-14">
          <Reveal>
            <EmailButton email={SITE.email} />
          </Reveal>

          <ul className="w-full border-b border-line">
            {CHANNELS.map((c, i) => (
              <Reveal as="li" key={c.label} delay={i * 80} className="border-t border-line">
                <a href={c.href} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-6 py-6">
                  <Scribble className="display-sans text-[clamp(40px,6vw,84px)] transition-colors group-hover:text-accent-text">{c.label}</Scribble>
                  <span className="flex items-center gap-3 text-right text-fg-muted">
                    <span className="day-only hidden sm:inline">{c.day}</span>
                    <span className="night-only hidden sm:inline">{c.night}</span>
                    <ArrowUpRight className="text-[28px] text-fg transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>

          <div className="flex flex-col items-center gap-3 text-center">
            <p className="max-w-md text-fg-muted">Rather not open your mail app? Leave a message with Arcee, the site&apos;s chatbot.</p>
            <OpenArceeButton
              seed="I want to leave a message for Itesh"
              className="btn btn-violet"
            >
              Leave Arcee a message
            </OpenArceeButton>
          </div>
        </div>
      </section>
    </main>
  );
}
