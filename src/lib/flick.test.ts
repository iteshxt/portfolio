import { describe, expect, it } from "vitest";
import { flickImpulse } from "./flick";

describe("flickImpulse", () => {
  it("spins clockwise when swiped down across the right side", () => {
    expect(flickImpulse(30, 0, 0, 2).spin).toBeGreaterThan(0);
  });

  it("spins the other way when swiped up across the right side", () => {
    expect(flickImpulse(30, 0, 0, -2).spin).toBeLessThan(0);
  });

  it("pushes in the direction of travel", () => {
    const hit = flickImpulse(0, 0, 1.5, -1);
    expect(hit.pushX).toBeGreaterThan(0);
    expect(hit.pushY).toBeLessThan(0);
    expect(hit.spin).toBeCloseTo(0);
  });

  it("caps wild swipes", () => {
    const hit = flickImpulse(200, 200, 50, -50);
    expect(Math.abs(hit.spin)).toBeLessThanOrEqual(22);
    expect(Math.abs(hit.pushX)).toBeLessThanOrEqual(3 * 2.4);
  });
});
