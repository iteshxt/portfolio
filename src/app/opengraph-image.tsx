import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og";

export const alt = "Itesh Singh Tomar: agents that act";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({ kicker: "ML engineer & full-stack developer", sans: "Agents", serif: "that act" });
}
