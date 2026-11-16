import { describe, expect, it } from "vitest";
import { latestActivityPush, latestPush, summariseCommit } from "./github";

describe("latestPush", () => {
  it("picks the newest push even when the feed is out of order", () => {
    const events = [
      { type: "PushEvent", repo: { name: "iteshxt/portfolio" }, created_at: "2026-11-13T11:48:56Z", payload: { head: "fb49e34" } },
      { type: "PushEvent", repo: { name: "iteshxt/portfolio" }, created_at: "2026-11-13T21:48:49Z", payload: { head: "ca41147" } },
      { type: "PushEvent", repo: { name: "iteshxt/cineflex-app" }, created_at: "2026-11-11T08:43:07Z", payload: { head: "fff52be" } },
    ];
    expect(latestPush(events)).toEqual({ repo: "iteshxt/portfolio", head: "ca41147", at: "2026-11-13T21:48:49Z" });
  });

  it("skips events that aren't pushes with a head commit", () => {
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

describe("latestActivityPush", () => {
  it("picks the newest push from a repo's activity feed", () => {
    const activity = [
      { activity_type: "push", after: "ca41147", timestamp: "2026-11-13T21:48:49Z" },
      { activity_type: "push", after: "a7e6510", timestamp: "2026-11-15T19:49:41Z" },
      { activity_type: "branch_creation", after: "zzz", timestamp: "2026-11-16T00:00:00Z" },
    ];
    expect(latestActivityPush("iteshxt/portfolio", activity)).toEqual({ repo: "iteshxt/portfolio", head: "a7e6510", at: "2026-11-15T19:49:41Z" });
  });

  it("returns null for junk", () => {
    expect(latestActivityPush("x/y", { message: "Not Found" })).toBeNull();
    expect(latestActivityPush("x/y", [])).toBeNull();
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
