import { describe, expect, it } from "vitest";
import { peelEnd, peelProgress, peelRest, peelShape, toClipPath, type Point } from "./peel";

const W = 1000;
const H = 600;

function area(poly: Point[]): number {
  let a = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x1, y1] = poly[i];
    const [x2, y2] = poly[(i + 1) % poly.length];
    a += x1 * y2 - x2 * y1;
  }
  return Math.abs(a) / 2;
}

describe("peelShape", () => {
  it("keeps the whole sticker when the pointer is on the corner", () => {
    const s = peelShape(W, H, [W, 0]);
    expect(area(s.kept)).toBeCloseTo(W * H);
    expect(s.flap).toHaveLength(0);
  });

  it("peels a small corner triangle at rest, and the flap mirrors it", () => {
    const s = peelShape(W, H, peelRest(W, 40));
    const keptArea = area(s.kept);
    const flapArea = area(s.flap);
    expect(keptArea + flapArea).toBeCloseTo(W * H, 0);
    expect(flapArea).toBeGreaterThan(0);
    expect(flapArea).toBeLessThan(2000);
  });

  it("peels everything at the end point", () => {
    const [x, y] = peelEnd(W, H);
    const s = peelShape(W, H, [x, y]);
    expect(area(s.kept)).toBeCloseTo(0, 3);
    expect(area(s.flap)).toBeCloseTo(W * H, 0);
  });

  it("puts the peeled corner on the pointer", () => {
    const p: Point = [600, 250];
    const s = peelShape(W, H, p);
    const tip = s.flap.find(([fx, fy]) => Math.hypot(fx - p[0], fy - p[1]) < 1e-6);
    expect(tip).toBeDefined();
  });
});

describe("peelProgress", () => {
  it("goes from 0 at the corner to 1 at the end", () => {
    expect(peelProgress(W, H, [W, 0])).toBe(0);
    expect(peelProgress(W, H, peelEnd(W, H))).toBeCloseTo(1);
  });
});

describe("toClipPath", () => {
  it("collapses empty regions to a zero-area polygon", () => {
    expect(toClipPath([])).toBe("polygon(0 0, 0 0, 0 0)");
  });

  it("formats px coordinates", () => {
    expect(
      toClipPath([
        [0, 0],
        [10, 0],
        [10, 5],
      ]),
    ).toBe("polygon(0.0px 0.0px, 10.0px 0.0px, 10.0px 5.0px)");
  });
});
