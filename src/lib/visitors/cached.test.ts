import { beforeEach, describe, expect, it, vi } from "vitest";

// "use cache" is only a string outside Next: stand in for the cache calls and the store.
const cacheLife = vi.fn();
const cacheTag = vi.fn();
const listVisitors = vi.fn();
vi.mock("next/cache", () => ({ cacheLife, cacheTag }));
vi.mock("./store", () => ({ listVisitors }));

const { cachedVisitors } = await import("./cached");

describe("cachedVisitors", () => {
  beforeEach(() => {
    cacheLife.mockClear();
    cacheTag.mockClear();
    listVisitors.mockReset();
  });

  it("caches the stamps for minutes under the visitors tag", async () => {
    const result = {
      entries: [
        { id: "b", n: 3, name: "Bo", line: "hi", cat: "sus", d: "2026-11-17" },
        { id: "a", n: 1, name: "Ada", line: "", cat: "hype" },
      ],
      total: 2,
      next: 4,
    };
    listVisitors.mockResolvedValue(result);
    expect(await cachedVisitors()).toEqual(result);
    expect(cacheTag).toHaveBeenCalledWith("visitors");
    expect(cacheLife.mock.calls).toEqual([["minutes"]]);
  });

  it("keeps a failed read for seconds only, so an empty passport doesn't stick", async () => {
    listVisitors.mockRejectedValue(new Error("redis down"));
    // next: 0 means unknown, so the pages hide the next visitor number.
    expect(await cachedVisitors()).toEqual({ entries: [], total: 0, next: 0 });
    expect(cacheLife.mock.calls).toEqual([["seconds"]]);
  });
});
