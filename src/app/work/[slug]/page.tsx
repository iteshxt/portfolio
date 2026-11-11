import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageShell } from "@/components/shell/PageShell";
import { PAGES, STAR_SLUGS, type StarSlug } from "@/content/pages";

const NAMES: Record<StarSlug, string> = { arcee: "Arcee", patentiq: "PatentIQ", diachat: "DiaChat" };

function isStarSlug(slug: string): slug is StarSlug {
  return (STAR_SLUGS as readonly string[]).includes(slug);
}

export function generateStaticParams() {
  return STAR_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return isStarSlug(slug) ? { title: NAMES[slug] } : {};
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

  return (
    <PageShell copy={PAGES[slug]}>
      <p>The full case study is being written: the day story, the night story, the works.</p>
    </PageShell>
  );
}
