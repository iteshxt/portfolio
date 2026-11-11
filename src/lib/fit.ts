/**
 * Finds the largest font size (px) at which `text` fits `maxWidth` on one line,
 * using a hidden measuring element styled like the target (docs/spec.md §5.4).
 */
export function fitFontSize(
  measure: HTMLElement,
  text: string,
  maxWidth: number,
  minPx: number,
  maxPx: number,
): number {
  measure.textContent = text;
  let lo = minPx;
  let hi = Math.max(minPx, maxPx);
  for (let i = 0; i < 14; i++) {
    const mid = (lo + hi) / 2;
    measure.style.fontSize = `${mid}px`;
    if (measure.scrollWidth <= maxWidth) lo = mid;
    else hi = mid;
  }
  return Math.floor(lo * 10) / 10;
}
