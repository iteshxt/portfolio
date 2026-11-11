/**
 * Projects (docs/spec.md §6). Stars get case studies; everything else lives
 * in the archive with a one-line day (what) and night (how) description.
 * Facts come from the GitHub repos, the CV and iteshxt.me — no invented metrics.
 */

export type ProjectCategory = "ai" | "web" | "mobile" | "tool";

export type Project = {
  slug: string;
  name: string;
  tier: "star" | "archive";
  category: ProjectCategory;
  year: string;
  day: string;
  night: string;
  stack: string[];
  links: { live?: string; repo?: string; extra?: { label: string; href: string }[] };
  /** Star projects only: frame colour and running order. */
  accent?: "violet" | "tomato" | "sunflower";
  order?: number;
};

export const STAR_PROJECTS: Project[] = [
  {
    slug: "arcee",
    name: "Arcee",
    tier: "star",
    order: 1,
    accent: "violet",
    category: "ai",
    year: "2026",
    day: "A desktop agent you talk or type to. It plans the request, uses your apps and reports back.",
    night: "Planner/executor loop with safety tiers, a sandboxed shell and an escalation ladder from Groq to local models.",
    stack: ["Python", "GTK", "Groq", "Ollama", "Wayland"],
    links: { repo: "https://github.com/iteshxt/arcee-agent" },
  },
  {
    slug: "patentiq",
    name: "PatentIQ",
    tier: "star",
    order: 2,
    accent: "tomato",
    category: "ai",
    year: "2026",
    day: "Screens university patent ideas and grades them across 11 weighted IP dimensions.",
    night: "Verifies citations against external sources before Gemini inference, with a PDF prompt-injection canary.",
    stack: ["TypeScript", "Next.js", "Gemini", "Structured JSON"],
    links: { live: "https://patentiq.dialabs.tech", repo: "https://github.com/DiaLabs/PatentIQ" },
  },
  {
    slug: "diachat",
    name: "DiaChat",
    tier: "star",
    order: 3,
    accent: "sunflower",
    category: "ai",
    year: "2025–2026",
    day: "A private Gen Z AI companion that runs entirely in your browser.",
    night: "Gemma-3 1B fine-tuned with PyTorch and Unsloth, served on WebGPU through WebLLM with a CPU fallback.",
    stack: ["PyTorch", "Unsloth", "WebLLM", "WebGPU", "Next.js"],
    links: { live: "https://chat.dialabs.tech", repo: "https://github.com/DiaLabs/dia-chat" },
  },
];

/** Filled from the GitHub audit (see docs/prd.md §5.3). */
export const ARCHIVE_PROJECTS: Project[] = [];

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  ai: "AI",
  web: "Web",
  mobile: "Mobile",
  tool: "Tools",
};
