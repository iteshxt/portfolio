import { describe, expect, it } from "vitest";
import { filterNav, NAV_ITEMS } from "./nav";

describe("filterNav", () => {
  it("returns everything for an empty query", () => {
    expect(filterNav(NAV_ITEMS, "  ")).toHaveLength(NAV_ITEMS.length);
  });

  it("matches day completions, night completions and page names", () => {
    expect(filterNav(NAV_ITEMS, "agents").map((i) => i.label)).toEqual(["Arcee"]);
    expect(filterNav(NAV_ITEMS, "webgpu").map((i) => i.label)).toEqual(["DiaChat"]);
    expect(filterNav(NAV_ITEMS, "dialabs").map((i) => i.label)).toEqual(["DiaLabs"]);
  });

  it("ignores a typed 'Itesh' prefix", () => {
    expect(filterNav(NAV_ITEMS, "Itesh ships").map((i) => i.label)).toEqual(["Work"]);
  });

  it("returns nothing for unrelated text (handed to Arcee instead)", () => {
    expect(filterNav(NAV_ITEMS, "what's his favourite food")).toEqual([]);
  });
});
