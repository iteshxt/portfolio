import { describe, expect, it } from "vitest";
import { PATTERNS, code128Values, code128Widths } from "./code128";

describe("code 128", () => {
  it("has a complete, unique pattern table", () => {
    expect(PATTERNS).toHaveLength(107);
    expect(new Set(PATTERNS).size).toBe(107);
    PATTERNS.slice(0, 106).forEach((p) => expect([...p].reduce((n, d) => n + Number(d), 0)).toBe(11));
    expect([...PATTERNS[106]].reduce((n, d) => n + Number(d), 0)).toBe(13);
  });
  it("encodes with start B, checksum and stop", () => {
    // (104 + 48·1 + 42·2 + 42·3 + 17·4 + 18·5 + 19·6 + 35·7) mod 103 = 879 mod 103 = 55
    const v = code128Values("PJJ123C");
    expect(v[0]).toBe(104);
    expect(v.slice(1, -2)).toEqual([48, 42, 42, 17, 18, 19, 35]);
    expect(v.at(-2)).toBe(55);
    expect(v.at(-1)).toBe(106);
  });
  it("produces bar/space widths that add up", () => {
    const w = code128Widths("iteshxt.me/s/ab12");
    expect(w.reduce((a, b) => a + b, 0)).toBe((17 + 2) * 11 + 13);
  });
});
