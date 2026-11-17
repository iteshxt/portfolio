import { beforeEach, describe, expect, it } from "vitest";
import { getVisitor, hasStorage, hideVisitor, listVisitors, signVisitor } from "./store";

describe("visitor store (in-memory fallback)", () => {
  beforeEach(() => {
    delete (globalThis as { __visitorsMemory?: unknown }).__visitorsMemory;
  });

  it("has no durable storage without Redis", () => {
    expect(hasStorage()).toBe(false);
  });

  it("numbers stamps in order and lists newest first", async () => {
    const a = await signVisitor({ name: "Ada", line: "", cat: "hype" });
    const b = await signVisitor({ name: "Bo", line: "hi", cat: "sus" });
    expect([a.n, b.n]).toEqual([1, 2]);
    expect(a.id).toMatch(/^[A-Za-z0-9_-]{22}$/);
    expect(a.id).not.toBe(b.id);
    const { entries, total } = await listVisitors();
    expect(total).toBe(2);
    expect(entries.map((e) => e.name)).toEqual(["Bo", "Ada"]);
    expect(Object.keys(entries[0]).sort()).toEqual(["cat", "id", "line", "n", "name"]);
  });

  it("respects the limit but counts everything", async () => {
    for (const name of ["a", "b", "c"]) await signVisitor({ name, line: "", cat: "derp" });
    const { entries, total } = await listVisitors(2);
    expect(entries.map((e) => e.name)).toEqual(["c", "b"]);
    expect(total).toBe(3);
  });

  it("hides a stamp and keeps the numbers", async () => {
    const a = await signVisitor({ name: "Ada", line: "", cat: "hype" });
    await signVisitor({ name: "Bo", line: "", cat: "hype" });
    expect(await getVisitor(a.id)).toEqual(a);
    expect(await hideVisitor(a.id)).toBe(true);
    expect(await hideVisitor(a.id)).toBe(false);
    expect(await getVisitor(a.id)).toBeNull();
    const { entries, total } = await listVisitors();
    expect(entries.map((e) => e.name)).toEqual(["Bo"]);
    expect(total).toBe(1);
    const c = await signVisitor({ name: "Cy", line: "", cat: "hype" });
    expect(c.n).toBe(3);
  });

  it("ignores unknown ids", async () => {
    expect(await getVisitor("nope")).toBeNull();
    expect(await hideVisitor("")).toBe(false);
  });
});
