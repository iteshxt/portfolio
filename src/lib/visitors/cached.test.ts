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
    const result = { entries: [{ id: "a", n: 1, name: "Ada", line: "", cat: "hype" }], total: 1 };
    listVisitors.mockResolvedValue(result);
    expect(await cachedVisitors()).toEqual(result);
    expect(cacheTag).toHaveBeenCalledWith("visitors");
    expect(cacheLife.mock.calls).toEqual([["minutes"]]);
  });

  it("keeps a failed read for seconds only, so an empty passport doesn't stick", async () => {
    listVisitors.mockRejectedValue(new Error("redis down"));
    expect(await cachedVisitors()).toEqual({ entries: [], total: 0 });
    expect(cacheLife.mock.calls).toEqual([["seconds"]]);
  });
});
