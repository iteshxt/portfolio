/**
 * The "two shifts" theme system: day shows what Itesh builds, night shows how.
 * See docs/spec.md §3 and docs/prd.md §6.1.
 */

export type Shift = "day" | "night";

export const SHIFT_STORAGE_KEY = "shift";
export const SHIFT_QUERY_PARAM = "shift";

/**
 * Decides the shift for a visit. Pure and self-contained (no outer references)
 * because it's also serialised into the pre-paint bootstrap script below.
 *
 * Priority: ?shift= query → saved choice → 3am owl hours → local clock
 * (day 07:00–18:59, otherwise night).
 */
export function resolveShift(
  query: string | null,
  stored: string | null,
  hour: number,
): { shift: Shift; owl: boolean } {
  const owl = hour >= 2 && hour < 5;
  if (query === "day" || query === "night") return { shift: query, owl };
  if (owl) return { shift: "night", owl };
  if (stored === "day" || stored === "night") return { shift: stored, owl };
  return { shift: hour >= 7 && hour < 19 ? "day" : "night", owl };
}

/**
 * Inline script for <head>: sets data-shift (and data-owl) on <html> before
 * first paint so there's no flash of the wrong shift. The server can't know
 * the visitor's clock, so this has to run in the browser.
 */
export const shiftBootstrapScript = `(function(){try{var resolveShift=${resolveShift.toString()};var r=resolveShift(new URLSearchParams(location.search).get(${JSON.stringify(
  SHIFT_QUERY_PARAM,
)}),localStorage.getItem(${JSON.stringify(
  SHIFT_STORAGE_KEY,
)}),new Date().getHours());var d=document.documentElement;d.dataset.shift=r.shift;if(r.owl)d.dataset.owl="true";}catch(e){document.documentElement.dataset.shift="day";}})();`;
