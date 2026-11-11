import { describe, expect, it } from "vitest";
import { resolveShift } from "./shift";

describe("resolveShift", () => {
  it("follows the local clock on a first visit", () => {
    expect(resolveShift(null, null, 7).shift).toBe("day");
    expect(resolveShift(null, null, 18).shift).toBe("day");
    expect(resolveShift(null, null, 19).shift).toBe("night");
    expect(resolveShift(null, null, 6).shift).toBe("night");
  });

  it("prefers a saved choice over the clock", () => {
    expect(resolveShift(null, "night", 12).shift).toBe("night");
    expect(resolveShift(null, "day", 23).shift).toBe("day");
  });

  it("lets the query param win over everything", () => {
    expect(resolveShift("day", "night", 3)).toEqual({ shift: "day", owl: true });
    expect(resolveShift("night", "day", 12)).toEqual({ shift: "night", owl: false });
  });

  it("forces night with the owl flag between 02:00 and 04:59", () => {
    expect(resolveShift(null, "day", 2)).toEqual({ shift: "night", owl: true });
    expect(resolveShift(null, "day", 4)).toEqual({ shift: "night", owl: true });
    expect(resolveShift(null, "day", 5)).toEqual({ shift: "day", owl: false });
  });

  it("ignores junk values", () => {
    expect(resolveShift("purple", "blue", 12).shift).toBe("day");
  });

  it("is serialisable into the bootstrap script", async () => {
    const { shiftBootstrapScript } = await import("./shift");
    expect(() => new Function(shiftBootstrapScript)).not.toThrow();
  });
});
