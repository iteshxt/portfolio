import { ARCHIVE_PROJECTS, STAR_PROJECTS } from "@/content/projects";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og";

export const alt = "Work by Itesh Singh Tomar";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({ kicker: "Work", parts: [{ sticker: String(STAR_PROJECTS.length + ARCHIVE_PROJECTS.length), tone: "lime" }, " things, built and ", { sticker: "shipped", tone: "violet", tilt: 2 }, "."] });
}
