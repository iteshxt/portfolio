import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og";

export const alt = "Contact Itesh Singh Tomar";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({ kicker: "Contact", parts: ["Write me a ", { sticker: "postcard", tone: "tomato" }, "."] });
}
