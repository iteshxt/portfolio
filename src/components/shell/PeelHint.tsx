/**
 * Handwritten "peel here" with a squiggly arrow pointing at the peel corner
 * (home only). Pure CSS: it writes itself in after the intro peels, then nudges
 * towards the corner now and then. Rests once the visitor has peeled during this
 * visit ([data-peeled] on <html>, from a session flag the store sets and the
 * shift bootstrap reads), and comes back on the next visit.
 */
export function PeelHint() {
  return (
    <div
      aria-hidden="true"
      className="peel-hint pointer-events-none absolute top-[58px] right-[46px] z-10 flex items-start text-accent-text sm:top-[64px] sm:right-[54px]"
    >
      <span className="mt-[30px] -rotate-[8deg] font-hand text-[24px] leading-none whitespace-nowrap sm:mt-[38px] sm:text-[30px]">
        peel here
      </span>
      <svg viewBox="0 0 80 64" className="peel-hint-arrow -ml-0.5 w-[56px] overflow-visible sm:w-[72px]">
        <path
          className="peel-hint-stroke"
          pathLength={1}
          d="M3 50 C 16 50, 27 44, 32 34 C 36 26, 31 19, 26 23 C 21 28, 30 35, 42 29 C 53 23, 62 13, 72 5"
        />
        <path className="peel-hint-stroke peel-hint-head" pathLength={1} d="M59 5 L 73 4 L 69 17" />
      </svg>
    </div>
  );
}
