/**
 * Peel geometry for the sticker peel (docs/spec.md §5.1).
 *
 * The page is a sticker peeled from its top-right corner C towards the
 * pointer P. The fold line is the perpendicular bisector of C and P:
 * - points closer to C than to P have been peeled off (they're on the flap),
 * - the flap is that peeled region reflected across the fold line.
 */

export type Point = readonly [number, number];

export type PeelShape = {
  /** Region of the sticker still stuck down (clip the top layer to this). */
  kept: Point[];
  /** Region the sticker has been lifted from (shows what's underneath). */
  peeled: Point[];
  /** The folded-over back of the sticker, in page coordinates. */
  flap: Point[];
  /** Point on the fold line (midpoint of corner and pointer), for shading. */
  fold: Point;
  /** Where the peeled corner ends up (always equals the pointer). */
  tip: Point;
};

/** Signed distance-like value: > 0 means "on the corner's side of the fold". */
function side(x: Point, m: Point, d: Point): number {
  return (x[0] - m[0]) * d[0] + (x[1] - m[1]) * d[1];
}

/** One-plane Sutherland–Hodgman: keeps the part of `poly` where sign*side ≤ 0. */
function clipHalfPlane(poly: Point[], m: Point, d: Point, sign: 1 | -1): Point[] {
  const out: Point[] = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const fa = sign * side(a, m, d);
    const fb = sign * side(b, m, d);
    if (fa <= 0) out.push(a);
    if ((fa < 0 && fb > 0) || (fa > 0 && fb < 0)) {
      const t = fa / (fa - fb);
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
  }
  return out;
}

/** Peel shape for a width×height sticker peeled from its top-right corner to `p`. */
export function peelShape(width: number, height: number, p: Point): PeelShape {
  const c: Point = [width, 0];
  const d: Point = [c[0] - p[0], c[1] - p[1]];
  const m: Point = [(c[0] + p[0]) / 2, (c[1] + p[1]) / 2];
  const dd = d[0] * d[0] + d[1] * d[1];
  const rect: Point[] = [
    [0, 0],
    [width, 0],
    [width, height],
    [0, height],
  ];

  if (dd < 1e-6) return { kept: rect, peeled: [], flap: [], fold: c, tip: c };

  const kept = clipHalfPlane(rect, m, d, 1);
  const peeled = clipHalfPlane(rect, m, d, -1);
  const flap = peeled.map((x): Point => {
    const t = side(x, m, d) / dd;
    return [x[0] - 2 * t * d[0], x[1] - 2 * t * d[1]];
  });

  return { kept, peeled, flap, fold: m, tip: p };
}

/** Pointer position where the sticker is fully peeled off (fold beyond the far corner). */
export function peelEnd(width: number, height: number): Point {
  return [-width - 40, 2 * height + 40];
}

/** Pointer position for the small resting curl in the corner. */
export function peelRest(width: number, size = 34): Point {
  return [width - size, size];
}

/** How far the peel has travelled, 0 (resting) → 1 (fully peeled). */
export function peelProgress(width: number, height: number, p: Point): number {
  const dist = Math.hypot(width - p[0], p[1]);
  const full = Math.hypot(width + 40 + width, 2 * height + 40);
  return Math.min(1, Math.max(0, dist / full));
}

/** CSS `polygon()` in px. An empty region becomes a zero-area polygon. */
export function toClipPath(points: Point[]): string {
  if (points.length < 3) return "polygon(0 0, 0 0, 0 0)";
  return `polygon(${points.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(", ")})`;
}

/** SVG `points` attribute. */
export function toSvgPoints(points: Point[]): string {
  return points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Animates a point from `from` to `to`, calling `onFrame` every animation frame.
 * Returns a cancel function. Resolves `onDone` when it finishes (not when cancelled).
 */
export function animatePoint(
  from: Point,
  to: Point,
  durationMs: number,
  onFrame: (p: Point) => void,
  onDone?: () => void,
  ease: (t: number) => number = easeInOutCubic,
): () => void {
  let raf = 0;
  const start = performance.now();
  const step = (now: number) => {
    const k = Math.min(1, (now - start) / durationMs);
    const e = ease(k);
    onFrame([from[0] + (to[0] - from[0]) * e, from[1] + (to[1] - from[1]) * e]);
    if (k < 1) raf = requestAnimationFrame(step);
    else onDone?.();
  };
  raf = requestAnimationFrame(step);
  return () => cancelAnimationFrame(raf);
}
