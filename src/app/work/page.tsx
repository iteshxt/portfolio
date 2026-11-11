import type { Metadata } from "next";
import { PageHero } from "@/components/shell/PageHero";
import { SectionHeading } from "@/components/type/SectionHeading";
import { StarCards } from "@/components/work/StarCards";
import { WorkGrid } from "@/components/work/WorkGrid";
import { PAGES } from "@/content/pages";
import { ARCHIVE_PROJECTS, STAR_PROJECTS } from "@/content/projects";

export const metadata: Metadata = { title: "Work" };

export default function WorkPage() {
  return (
    <main className="flex-1">
      <PageHero copy={PAGES.work}>
        <p>Three star projects with full case studies, then everything else he&apos;s built and shipped.</p>
      </PageHero>

      <section className="px-gutter pb-[clamp(64px,10vw,140px)]">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading
            className="mb-10"
            kicker={{ day: "Star projects", night: "Star projects, under the hood" }}
            day={{ sans: "The good", serif: "stuff" }}
            night={{ sans: "The hard", serif: "parts" }}
          />
          <StarCards projects={STAR_PROJECTS} />
        </div>
      </section>

      {ARCHIVE_PROJECTS.length > 0 && (
        <section className="px-gutter pb-[clamp(64px,10vw,140px)]">
          <div className="mx-auto max-w-[1440px]">
            <SectionHeading
              className="mb-10"
              kicker={{ day: "Archive", night: "Archive, by night" }}
              day={{ sans: "Everything", serif: "else" }}
              night={{ sans: "Side quests,", serif: "main effort" }}
            />
            <WorkGrid projects={ARCHIVE_PROJECTS} />
          </div>
        </section>
      )}
    </main>
  );
}
