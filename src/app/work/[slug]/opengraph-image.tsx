import { CASE_STUDIES } from "@/content/case-studies";
import { STAR_SLUGS, type StarSlug } from "@/content/pages";
import { STAR_PROJECTS } from "@/content/projects";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og";

export const alt = "A star project by Itesh Singh Tomar";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// Each project's own colours: its sticker wears them, as on the case file.
const BRAND: Record<StarSlug, { bg: string; fg: string }> = {
  arcee: { bg: "#1C1108", fg: "#FF8C1A" },
  patentiq: { bg: "#452CF9", fg: "#FFFFFF" },
  diachat: { bg: "#FFB000", fg: "#3D2A00" },
};

export function generateStaticParams() {
  return STAR_SLUGS.map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = (STAR_SLUGS as readonly string[]).includes(slug) ? (slug as StarSlug) : "arcee";
  const project = STAR_PROJECTS.find((p) => p.slug === s);
  return ogCard({
    kicker: `Case file · ${String(project?.order ?? 1).padStart(2, "0")} / 03`,
    parts: [{ sticker: CASE_STUDIES[s].name, ...BRAND[s] }],
    sub: CASE_STUDIES[s].summary.day,
    size: 128,
  });
}
