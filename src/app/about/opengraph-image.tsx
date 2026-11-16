import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og";

export const alt = "About Itesh Tomar";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({ kicker: "About", parts: ["Most of me fits on a ", { sticker: "laptop lid", tone: "violet" }, "."] });
}
