import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og";

export const alt = "DiaLabs, co-founded by Itesh Tomar";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({ kicker: "DiaLabs · co-founded", parts: ["A lab that works in the ", { sticker: "open", tone: "lime" }, "."] });
}
