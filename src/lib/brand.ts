import type { Project, StarBrand } from "@/content/projects";

/**
 * Each star project in its own app's colours (docs/design.md §3.4), as classes
 * over the --arcee / --patentiq / --diachat tokens: the card frame, the fill
 * behind its artwork, and dots with text on them.
 */
export const BRAND: Record<StarBrand, { frame: string; fill: string; dot: string; onDot: string }> = {
  // Amber frame around the near-black the Arcee app draws its particle ring on.
  arcee: { frame: "border-arcee", fill: "bg-arcee-deep", dot: "bg-arcee", onDot: "text-arcee-ink" },
  patentiq: { frame: "border-patentiq", fill: "bg-patentiq", dot: "bg-patentiq", onDot: "text-patentiq-ink" },
  diachat: { frame: "border-diachat", fill: "bg-diachat", dot: "bg-diachat", onDot: "text-diachat-ink" },
};

export const brandOf = (project: Project) => BRAND[project.brand ?? "patentiq"];
