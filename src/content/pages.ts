/**
 * Headline copy per page (docs/design.md §2.3, §11). Each headline is a bold
 * sans line plus a serif line that twists or completes it. The name appears
 * once (the home kicker) — headlines are statements, not "Itesh does X".
 */

export type HeadlineLine = { sans: string; serif: string };

export type PageCopy = {
  kicker: { day: string; night: string };
  day: HeadlineLine[];
  night: HeadlineLine[];
};

export const HOME: PageCopy = {
  kicker: { day: "By day: what Itesh builds", night: "By night: how it works" },
  day: [
    { sans: "Agents", serif: "that act" },
    { sans: "Products", serif: "people pay for" },
    { sans: "Models,", serif: "fine-tuned" },
    { sans: "A lab", serif: "called DiaLabs" },
  ],
  night: [
    { sans: "Logs,", serif: "read twice" },
    { sans: "Evals", serif: "for everything" },
    { sans: "Bugs,", serif: "fixed at 3am" },
    { sans: "Docs", serif: "that exist" },
  ],
};

export const PAGES = {
  arcee: {
    kicker: { day: "Star project 01 · Arcee", night: "Arcee, under the hood" },
    day: [{ sans: "An agent", serif: "for your desktop" }],
    night: [{ sans: "Plans, guards,", serif: "then acts" }],
  },
  patentiq: {
    kicker: { day: "Star project 02 · PatentIQ", night: "PatentIQ, under the hood" },
    day: [{ sans: "Patents,", serif: "screened by AI" }],
    night: [{ sans: "Citations first,", serif: "then Gemini" }],
  },
  diachat: {
    kicker: { day: "Star project 03 · DiaChat", night: "DiaChat, under the hood" },
    day: [{ sans: "A companion", serif: "in your browser" }],
    night: [{ sans: "Gemma 3, live", serif: "on WebGPU" }],
  },
  work: {
    kicker: { day: "Work, by day", night: "Work, by night" },
    day: [{ sans: "Real products,", serif: "real users" }],
    night: [{ sans: "Payments, logistics,", serif: "retries" }],
  },
  dialabs: {
    kicker: { day: "DiaLabs, by day", night: "DiaLabs, by night" },
    day: [{ sans: "DiaLabs,", serif: "co-founded" }],
    night: [{ sans: "Open models,", serif: "open data" }],
  },
  about: {
    kicker: { day: "About, by day", night: "About, by night" },
    day: [{ sans: "The human", serif: "behind it" }],
    night: [{ sans: "Evals, edge cases,", serif: "failure modes" }],
  },
  contact: {
    kicker: { day: "Contact", night: "Contact, after hours" },
    day: [{ sans: "Say", serif: "hello" }],
    night: [{ sans: "Leave Arcee", serif: "a message" }],
  },
  notFound: {
    kicker: { day: "404", night: "404, at night" },
    day: [{ sans: "Nothing", serif: "to see here" }],
    night: [{ sans: "The model", serif: "hallucinated" }],
  },
} satisfies Record<string, PageCopy>;

export type PageKey = keyof typeof PAGES;

export const STAR_SLUGS = ["arcee", "patentiq", "diachat"] as const;
export type StarSlug = (typeof STAR_SLUGS)[number];
