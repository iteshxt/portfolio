import { beforeEach, describe, expect, it } from "vitest";
import { getVisitor, hasStorage, hideVisitor, listVisitors, signVisitor } from "./store";

const D = "2026-11-17";

describe("visitor store (in-memory fallback)", () => {
  beforeEach(() => {
    delete (globalThis as { __visitorsMemory?: unknown }).__visitorsMemory;
  });

  it("has no durable storage without Redis", () => {
    expect(hasStorage()).toBe(false);
  });

  it("starts empty, with No. 1 up next", async () => {
    expect(await listVisitors()).toEqual({ entries: [], total: 0, next: 1 });
  });

  it("numbers and dates stamps in order and lists newest first", async () => {
    const a = await signVisitor({ name: "Ada", line: "", cat: "hype", d: "2026-11-16" });
    const b = await signVisitor({ name: "Bo", line: "hi", cat: "sus", d: D });
    expect([a.n, b.n]).toEqual([1, 2]);
    expect([a.d, b.d]).toEqual(["2026-11-16", D]);
    expect(a.id).toMatch(/^[A-Za-z0-9_-]{22}$/);
    expect(a.id).not.toBe(b.id);
    const { entries, total, next } = await listVisitors();
    expect(total).toBe(2);
    expect(next).toBe(3);
    expect(entries.map((e) => e.name)).toEqual(["Bo", "Ada"]);
    expect(Object.keys(entries[0]).sort()).toEqual(["cat", "d", "id", "line", "n", "name"]);
  });

  it("keeps the time of signing when there is one", async () => {
    const a = await signVisitor({ name: "Ada", line: "", cat: "hype", d: D, tm: "22:14" });
    const b = await signVisitor({ name: "Bo", line: "", cat: "hype", d: D });
    expect(a.tm).toBe("22:14");
    expect("tm" in b).toBe(false);
    expect(await getVisitor(a.id)).toEqual(a);
    expect(Object.keys((await listVisitors()).entries[1]).sort()).toEqual(["cat", "d", "id", "line", "n", "name", "tm"]);
  });

  it("respects the limit but counts everything", async () => {
    for (const name of ["a", "b", "c"]) await signVisitor({ name, line: "", cat: "derp", d: D });
    const { entries, total, next } = await listVisitors(2);
    expect(entries.map((e) => e.name)).toEqual(["c", "b"]);
    expect(total).toBe(3);
    expect(next).toBe(4);
  });

  it("hides a stamp and keeps the numbers", async () => {
    const a = await signVisitor({ name: "Ada", line: "", cat: "hype", d: D });
    await signVisitor({ name: "Bo", line: "", cat: "hype", d: D });
    expect(await getVisitor(a.id)).toEqual(a);
    expect(await hideVisitor(a.id)).toBe(true);
    expect(await hideVisitor(a.id)).toBe(false);
    expect(await getVisitor(a.id)).toBeNull();
    const { entries, total, next } = await listVisitors();
    expect(entries.map((e) => e.name)).toEqual(["Bo"]);
    expect(total).toBe(1);
    // The hidden stamp keeps No. 1, so the next visitor is No. 3, not total + 1.
    expect(next).toBe(3);
    const c = await signVisitor({ name: "Cy", line: "", cat: "hype", d: D });
    expect(c.n).toBe(3);
  });

  it("keeps counting when every stamp is hidden", async () => {
    const a = await signVisitor({ name: "Ada", line: "", cat: "hype", d: D });
    await hideVisitor(a.id);
    expect(await listVisitors()).toEqual({ entries: [], total: 0, next: 2 });
  });

  it("ignores unknown ids", async () => {
    expect(await getVisitor("nope")).toBeNull();
    expect(await hideVisitor("")).toBe(false);
  });
});
