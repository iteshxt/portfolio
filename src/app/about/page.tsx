import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { ExperienceList } from "@/components/home/ExperienceList";
import { ArrowUpRight } from "@/components/icons";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { PageHero } from "@/components/shell/PageHero";
import { SectionHeading } from "@/components/type/SectionHeading";
import { Sticker, type StickerTone } from "@/components/ui/Sticker";
import { PAGES } from "@/content/pages";
import { ACHIEVEMENTS, CERTIFICATES, EDUCATION, EXPERIENCE, SKILLS } from "@/content/profile";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: "Itesh Singh Tomar: ML engineer and full-stack developer. Experience at Caudal AI Labs and Sutr Clothing, skills, education and achievements.",
  path: "/about",
});

const SKILL_TONES: StickerTone[] = ["lime", "lavender", "sunflower", "paper"];

export default function AboutPage() {
  return (
    <main className="flex-1">
      <PageHero copy={PAGES.about} />

      <section className="px-gutter pb-[clamp(64px,10vw,140px)]">
        <div className="mx-auto max-w-[1440px]">
          <RevealText className="max-w-[24ch] text-[clamp(28px,4vw,60px)] leading-[1.06] font-medium tracking-[-0.03em] [font-variation-settings:'wdth'_85]">
            <span className="day-only">
              Computer science student at LPU. Works across the model and the product: fine-tuning, evaluation, and the app people actually use.
            </span>
            <span className="night-only">
              Small commits, written decisions, evals before claims, and models that run locally whenever they can.
            </span>
          </RevealText>
        </div>
      </section>

      <section className="px-gutter pb-[clamp(64px,10vw,140px)]">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading
            className="mb-10"
            kicker={{ day: "Experience", night: "Experience, the how" }}
            day={{ sans: "Shipped", serif: "for others" }}
            night={{ sans: "Tested,", serif: "then shipped" }}
          />
          <ExperienceList items={EXPERIENCE} detailed />
        </div>
      </section>

      <section className="px-gutter pb-[clamp(64px,10vw,140px)]">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading
            className="mb-10"
            kicker={{ day: "Toolbox" }}
            day={{ sans: "Daily", serif: "drivers" }}
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {SKILLS.map((group, g) => (
              <Reveal key={group.group} delay={g * 80} className="flex flex-col gap-4">
                <h3 className="font-serif text-[22px] italic">{group.group}</h3>
                <ul className="flex flex-wrap gap-2.5">
                  {group.items.map((item, i) => (
                    <li key={item}>
                      <Sticker tone={SKILL_TONES[g % SKILL_TONES.length]} tilt={i % 2 ? 1.5 : -1.5}>
                        {item}
                      </Sticker>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-gutter pb-[clamp(64px,10vw,140px)]">
        <div className="mx-auto grid max-w-[1440px] gap-16 lg:grid-cols-2">
          <div>
            <SectionHeading className="mb-8" kicker={{ day: "Education" }} day={{ sans: "School", serif: "stuff" }} />
            <ol className="border-b border-line">
              {EDUCATION.map((e, i) => (
                <Reveal as="li" key={e.school} delay={i * 70} className="flex flex-col gap-1 border-t border-line py-5">
                  <span className="text-[19px] font-medium">{e.school}</span>
                  <span className="text-fg-muted">
                    {e.detail} · {e.score}
                  </span>
                  <span className="text-[14px] text-fg-muted">
                    {e.period} · {e.place}
                  </span>
                </Reveal>
              ))}
            </ol>
          </div>
          <div>
            <SectionHeading className="mb-8" kicker={{ day: "Achievements" }} day={{ sans: "Proof", serif: "of work" }} />
            <ul className="flex flex-col gap-4">
              {ACHIEVEMENTS.map((a, i) => (
                <Reveal as="li" key={a.title} delay={i * 70} className="rounded-[22px] border-[5px] border-white bg-lavender p-5 text-violet-ink shadow-[0_14px_34px_-18px_rgb(0_0_0/0.4)]" style={{ rotate: i % 2 ? "1deg" : "-1deg" }}>
                  <p className="text-[19px] font-semibold">{a.title}</p>
                  <p className="mt-1">{a.detail}</p>
                  {a.url && (
                    <a href={a.url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-[15px] underline underline-offset-4">
                      Visit <ArrowUpRight className="text-[13px]" />
                    </a>
                  )}
                </Reveal>
              ))}
            </ul>
            <h3 className="mt-10 mb-4 font-serif text-[22px] italic">Certificates</h3>
            <ul className="border-b border-line">
              {CERTIFICATES.map((c) => (
                <li key={c.name} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-line py-4">
                  <span>
                    {c.url ? (
                      <a href={c.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline decoration-line underline-offset-4 hover:decoration-current">
                        {c.name} <ArrowUpRight className="text-[13px]" />
                      </a>
                    ) : (
                      c.name
                    )}
                  </span>
                  <span className="text-[14px] text-fg-muted">
                    {c.issuer} · {c.date}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
