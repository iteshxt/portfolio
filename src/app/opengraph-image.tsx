import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og";

export const alt = "Itesh Tomar: agents that act";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({ kicker: "Hi, I’m Itesh.", parts: ["I build ", { sticker: "agents", tone: "violet" }, ", train ", { sticker: "models", tone: "lime", tilt: 2 }, " and ship ", { sticker: "products", tone: "sunflower" }, "."], size: 92 });
}
