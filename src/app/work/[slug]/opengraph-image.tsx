import { CASE_STUDIES } from "@/content/case-studies";
import { PAGES, STAR_SLUGS, type StarSlug } from "@/content/pages";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og";

export const alt = "A star project by Itesh Singh Tomar";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// Each project's own colour, the darker shade where it's headline text on paper.
const ACCENT: Record<StarSlug, string> = { arcee: "#E05A00", patentiq: "#452CF9", diachat: "#D99A00" };

export function generateStaticParams() {
  return STAR_SLUGS.map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = (STAR_SLUGS as readonly string[]).includes(slug) ? (slug as StarSlug) : "arcee";
  const line = PAGES[s].day[0];
  return ogCard({ kicker: `Star project · ${CASE_STUDIES[s].name}`, sans: line.sans, serif: line.serif, accent: ACCENT[s] });
}
