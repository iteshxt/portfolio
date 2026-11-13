import type { Metadata } from "next";
import { ContactCta } from "@/components/home/ContactCta";
import { ArchiveWall } from "@/components/home/ArchiveWall";
import { ArrowDown } from "@/components/icons";
import { PageIntro } from "@/components/shell/PageIntro";
import { SectionTitle } from "@/components/type/SectionTitle";
import { ScrollButton } from "@/components/ui/ScrollButton";
import { Sticker } from "@/components/ui/Sticker";
import { CaseStack } from "@/components/work/CaseStack";
import { ARCHIVE_PROJECTS, STAR_PROJECTS } from "@/content/projects";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Work",
  description: "Three star projects with full case studies (Arcee, PatentIQ, DiaChat) and everything else Itesh has built and shipped.",
  path: "/work",
});

export default function WorkPage() {
  const total = STAR_PROJECTS.length + ARCHIVE_PROJECTS.length;
  return (
    <main className="flex-1">
      <PageIntro
        section="Work"
        kicker="Work"
        title={[
          "Things I\u2019ve ",
          { word: "built", tone: "lime", tilt: -2.5 },
          " and ",
          { word: "shipped", tone: "violet", tilt: 2, after: "." },
        ]}
        lead={`${total} projects: three with full case studies, the rest with live links and code.`}
      >
        <ScrollButton to="case-studies" className="btn btn-ink">
          The case studies
          <ArrowDown />
        </ScrollButton>
        <ScrollButton to="everything-else" className="btn btn-paper">
          Everything else
          <ArrowDown />
        </ScrollButton>
      </PageIntro>

      {/* Star projects: posters that stack as you scroll */}
      <section id="case-studies" data-section="Case studies" className="px-gutter py-[clamp(48px,8vw,120px)]">
        <div className="mx-auto max-w-[1180px]">
          <SectionTitle kicker="Case studies" className="mb-[clamp(32px,5vw,64px)]">
            The three with the{" "}
            <Sticker size="word" tone="tomato" tilt={-2}>
              full story
            </Sticker>
            .
          </SectionTitle>
          <CaseStack projects={STAR_PROJECTS} />
        </div>
      </section>

      {/* Everything else */}
      {ARCHIVE_PROJECTS.length > 0 && (
        <section id="everything-else" data-section="Everything else" className="px-gutter py-[clamp(48px,8vw,120px)]">
          <div className="mx-auto max-w-[1440px]">
            <SectionTitle kicker="Everything else">
              The rest,{" "}
              <span className="whitespace-nowrap">
                <Sticker size="word" tone="lime" tilt={2}>
                  all shipped
                </Sticker>
                .
              </span>
            </SectionTitle>
            <ArchiveWall projects={ARCHIVE_PROJECTS} first={12} />
          </div>
        </section>
      )}

      <ContactCta />
    </main>
  );
}
