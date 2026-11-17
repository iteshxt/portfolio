import { describe, expect, it } from "vitest";
import { QR_FIXTURES } from "./qr.fixtures";
import { qrMatrix, type Ecl } from "./qr";

const rows = (m: boolean[][]) => m.map((r) => r.map((c) => (c ? "1" : "0")).join(""));

describe("qrMatrix", () => {
  it.each(Object.entries(QR_FIXTURES))("matches libqrencode module for module (%s)", (_, fx) => {
    // Any of the 8 masks is a valid code; libqrencode's mask scoring differs slightly from the spec's,
    // so the reference must equal one of them exactly (data, ECC, format and version bits included).
    const masks = Array.from({ length: 8 }, (_, k) => rows(qrMatrix(fx.text, { ecl: fx.ecl as Ecl, mask: k })));
    expect(masks.some((m) => m.join("\n") === fx.rows.join("\n"))).toBe(true);
  });

  it("picks the smallest version and draws the three finder patterns", () => {
    const m = qrMatrix("https://iteshxt.me/s/ab12");
    expect(m.length).toBe(25); // version 2 at level M
    const finder = (x: number, y: number) => m[y][x] && m[y][x + 6] && m[y + 6][x] && m[y + 6][x + 6] && !m[y + 1][x + 1] && m[y + 3][x + 3];
    expect(finder(0, 0) && finder(m.length - 7, 0) && finder(0, m.length - 7)).toBe(true);
  });

  it("refuses text that doesn't fit a version 10 code", () => {
    expect(() => qrMatrix("x".repeat(400))).toThrow();
  });
});
