/**
 * Headline copy per page (docs/design.md §11). Each headline is a sans line
 * that starts the sentence and a serif line that completes it.
 */

export type HeadlineLine = { sans: string; serif: string };

export type PageCopy = {
  kicker: { day: string; night: string };
  day: HeadlineLine[];
  night: HeadlineLine[];
};

export const HOME: PageCopy = {
  kicker: { day: "By day: what he builds", night: "By night: how it works" },
  day: [
    { sans: "Itesh builds", serif: "agents" },
    { sans: "Itesh ships", serif: "real products" },
    { sans: "Itesh fine-tunes", serif: "models" },
    { sans: "Itesh co-founded", serif: "DiaLabs" },
  ],
  night: [
    { sans: "Itesh reads", serif: "the logs" },
    { sans: "Itesh evals", serif: "everything" },
    { sans: "Itesh debugs", serif: "at 3am" },
    { sans: "Itesh writes", serif: "the docs" },
  ],
};

export const PAGES = {
  arcee: {
    kicker: { day: "Star project 01 · Arcee", night: "Arcee, under the hood" },
    day: [{ sans: "Itesh builds", serif: "agents" }],
    night: [{ sans: "Plans, guards,", serif: "then acts" }],
  },
  patentiq: {
    kicker: { day: "Star project 02 · PatentIQ", night: "PatentIQ, under the hood" },
    day: [{ sans: "Itesh screens", serif: "patents" }],
    night: [{ sans: "Citations first,", serif: "then Gemini" }],
  },
  diachat: {
    kicker: { day: "Star project 03 · DiaChat", night: "DiaChat, under the hood" },
    day: [{ sans: "Itesh fine-tunes", serif: "companions" }],
    night: [{ sans: "Gemma 3, live", serif: "on WebGPU" }],
  },
  work: {
    kicker: { day: "Work, by day", night: "Work, by night" },
    day: [{ sans: "Itesh ships", serif: "real products" }],
    night: [{ sans: "Payments, logistics,", serif: "retries" }],
  },
  dialabs: {
    kicker: { day: "DiaLabs, by day", night: "DiaLabs, by night" },
    day: [{ sans: "Itesh co-founded", serif: "DiaLabs" }],
    night: [{ sans: "Open models,", serif: "open data" }],
  },
  about: {
    kicker: { day: "About, by day", night: "About, by night" },
    day: [{ sans: "Itesh worked", serif: "at Caudal AI" }],
    night: [{ sans: "Evals, edge cases,", serif: "failure modes" }],
  },
  contact: {
    kicker: { day: "Contact", night: "Contact, after hours" },
    day: [{ sans: "Itesh wants", serif: "to hear from you" }],
    night: [{ sans: "Leave Arcee", serif: "a message" }],
  },
  notFound: {
    kicker: { day: "404", night: "404, at night" },
    day: [{ sans: "Itesh didn't", serif: "build this" }],
    night: [{ sans: "The model", serif: "hallucinated" }],
  },
} satisfies Record<string, PageCopy>;

export type PageKey = keyof typeof PAGES;

export const STAR_SLUGS = ["arcee", "patentiq", "diachat"] as const;
export type StarSlug = (typeof STAR_SLUGS)[number];
