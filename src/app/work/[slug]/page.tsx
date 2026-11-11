import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CaseStudyView } from "@/components/case/CaseStudyView";
import { CASE_STUDIES } from "@/content/case-studies";
import { STAR_SLUGS, type StarSlug } from "@/content/pages";
import { STAR_PROJECTS } from "@/content/projects";

function isStarSlug(slug: string): slug is StarSlug {
  return (STAR_SLUGS as readonly string[]).includes(slug);
}

function projectFor(slug: StarSlug) {
  const project = STAR_PROJECTS.find((p) => p.slug === slug);
  if (!project) throw new Error(`Missing star project data for ${slug}`);
  return project;
}

export function generateStaticParams() {
  return STAR_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (!isStarSlug(slug)) return {};
  const study = CASE_STUDIES[slug];
  return { title: study.name, description: study.summary.day };
}

// `params` is URL data, so it's read behind Suspense to keep the route's App Shell
// shareable for instant navigation (partial prefetching).
export default function StarProjectPage({ params }: PageProps<"/work/[slug]">) {
  return (
    <Suspense fallback={<main className="flex-1" />}>
      <StarProject params={params} />
    </Suspense>
  );
}

async function StarProject({ params }: { params: PageProps<"/work/[slug]">["params"] }) {
  const { slug } = await params;
  if (!isStarSlug(slug)) notFound();
  const study = CASE_STUDIES[slug];
  return <CaseStudyView study={study} project={projectFor(slug)} next={projectFor(study.next)} />;
}
