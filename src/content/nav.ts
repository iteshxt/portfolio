/**
 * "Itesh ___" navigation: every page is a way to finish the sentence
 * (docs/prd.md §6.2, docs/design.md §11). Day completions say what,
 * night completions say how; both lead to the same page.
 */

export type NavItem = {
  href: string;
  label: string;
  kind: "star" | "page";
  day: string;
  night: string;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/work/arcee", label: "Arcee", kind: "star", day: "builds agents", night: "plans, guards, then acts" },
  { href: "/work/patentiq", label: "PatentIQ", kind: "star", day: "screens patents", night: "checks citations first" },
  { href: "/work/diachat", label: "DiaChat", kind: "star", day: "fine-tunes companions", night: "runs Gemma on WebGPU" },
  { href: "/work", label: "Work", kind: "page", day: "ships real products", night: "handles payments and retries" },
  { href: "/dialabs", label: "DiaLabs", kind: "page", day: "co-founded DiaLabs", night: "open-sources models" },
  { href: "/about", label: "About", kind: "page", day: "worked at Caudal AI", night: "evals the edge cases" },
  { href: "/contact", label: "Contact", kind: "page", day: "wants to hear from you", night: "reads every message" },
  { href: "/", label: "Home", kind: "page", day: "starts over", night: "goes back home" },
];

/** Case-insensitive match on either completion or the page name. */
export function filterNav(items: NavItem[], query: string): NavItem[] {
  const q = query.trim().toLowerCase().replace(/^itesh\s*/, "");
  if (!q) return items;
  return items.filter((item) =>
    [item.day, item.night, item.label].some((text) => text.toLowerCase().includes(q)),
  );
}
