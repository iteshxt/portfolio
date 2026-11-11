/** ↑ ↑ ↓ ↓ ← → ← → B A, which summons the scuba cat (docs/prd.md §6.5). */
export const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

/**
 * Advances the match by one key and returns the new progress (0–10).
 * A wrong key resets, except extra ↑ presses, which keep the two ups that count.
 */
export function konamiStep(progress: number, key: string): number {
  const k = key.length === 1 ? key.toLowerCase() : key;
  if (progress < KONAMI.length && k === KONAMI[progress]) return progress + 1;
  if (k === "ArrowUp") return progress >= 2 && KONAMI[progress - 1] === "ArrowUp" ? 2 : 1;
  return 0;
}
