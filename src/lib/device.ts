import { prefersReducedMotion } from "./motion";

/**
 * Device tiering for 3D (docs/spec.md §7). Client-only.
 * - "off": reduced motion, Save-Data, very low memory or no WebGL2 → 2D stills
 * - "lite": phones and small screens → simpler geometry, lower pixel ratio
 * - "full": everything else
 */
export type Tier3D = "off" | "lite" | "full";

type NavigatorExtras = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

export function tier3D(): Tier3D {
  if (typeof window === "undefined" || prefersReducedMotion()) return "off";
  const nav = navigator as NavigatorExtras;
  if (nav.connection?.saveData) return "off";
  if ((nav.deviceMemory ?? 8) <= 2) return "off";
  try {
    const canvas = document.createElement("canvas");
    if (!canvas.getContext("webgl2")) return "off";
  } catch {
    return "off";
  }
  const small = window.matchMedia("(max-width: 767px)").matches;
  const fewCores = (nav.hardwareConcurrency ?? 8) <= 4;
  return small || fewCores ? "lite" : "full";
}
