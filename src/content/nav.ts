/**
 * Pages for the "Where to?" navigator (docs/design.md §2.8): each shows as a
 * die-cut sticker with its name; the one-line description (`day`) is its cursor hint. `night`
 * is kept as an extra search term.
 */

export type NavItem = {
  href: string;
  label: string;
  kind: "star" | "page";
  day: string;
  night: string;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/work/arcee", label: "Arcee", kind: "star", day: "the desktop agent", night: "how the agent thinks" },
  { href: "/work/patentiq", label: "PatentIQ", kind: "star", day: "the patent screener", night: "the citation pipeline" },
  { href: "/work/diachat", label: "DiaChat", kind: "star", day: "the AI companion", night: "the WebGPU bits" },
  { href: "/work", label: "Work", kind: "page", day: "real products", night: "the payment flows" },
  { href: "/dialabs", label: "DiaLabs", kind: "page", day: "the lab", night: "the open models" },
  { href: "/about", label: "About", kind: "page", day: "the human", night: "the edge cases" },
  { href: "/arcee", label: "Chat", kind: "page", day: "ask Arcee anything", night: "the chatbot" },
  { href: "/contact", label: "Contact", kind: "page", day: "how to say hi", night: "the inbox" },
  { href: "/", label: "Home", kind: "page", day: "the start", night: "the start" },
];

/** Case-insensitive match on either completion or the page name. */
export function filterNav(items: NavItem[], query: string): NavItem[] {
  const q = query.trim().toLowerCase().replace(/^show\s*me\s*/, "");
  if (!q) return items;
  return items.filter((item) =>
    [item.day, item.night, item.label].some((text) => text.toLowerCase().includes(q)),
  );
}
