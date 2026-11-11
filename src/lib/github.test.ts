import { describe, expect, it } from "vitest";
import { latestPush, summariseCommit } from "./github";

describe("latestPush", () => {
  it("picks the first push event with a head commit", () => {
    const events = [
      { type: "WatchEvent", repo: { name: "iteshxt/x" }, created_at: "2026-11-11T10:00:00Z", payload: {} },
      { type: "PushEvent", repo: { name: "iteshxt/cineflex-app" }, created_at: "2026-11-10T09:26:26Z", payload: { head: "552b74f" } },
      { type: "PushEvent", repo: { name: "iteshxt/older" }, created_at: "2026-11-01T00:00:00Z", payload: { head: "aaa" } },
    ];
    expect(latestPush(events)).toEqual({ repo: "iteshxt/cineflex-app", head: "552b74f", at: "2026-11-10T09:26:26Z" });
  });

  it("returns null for junk or no pushes", () => {
    expect(latestPush(null)).toBeNull();
    expect(latestPush({ message: "API rate limit exceeded" })).toBeNull();
    expect(latestPush([{ type: "CreateEvent" }])).toBeNull();
  });
});

describe("summariseCommit", () => {
  it("keeps only the first line", () => {
    expect(summariseCommit("fix: why does this work\n\nlong body")).toBe("fix: why does this work");
  });

  it("truncates long subjects with an ellipsis", () => {
    const s = summariseCommit("a".repeat(120), 20);
    expect(s).toHaveLength(20);
    expect(s.endsWith("…")).toBe(true);
  });
});
