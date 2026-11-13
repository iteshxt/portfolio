/**
 * The hero sits on a lifted sheet (docs/design.md §2.5): a rounded paper sheet
 * laid on the page with a soft shadow, a cutting-mat grid that fades towards its
 * edges, a slow colour glow behind the headline, and its bottom-right corner
 * curled up to show the lavender underside. The curl grows as you scroll
 * (--curl, set by MotionLayer on [data-curl]). CSS only.
 */
export function HeroBackdrop() {
  return (
    <div aria-hidden="true" data-curl="" className="hero-backdrop pointer-events-none absolute inset-x-3 top-3 bottom-3 -z-10 sm:inset-x-6 sm:top-[76px] sm:bottom-6">
      <div className="hero-sheet absolute inset-0">
        <div className="hero-mat absolute inset-0" />
        <div className="hero-glow absolute top-1/2 left-1/2" />
      </div>
      <div className="hero-flap absolute right-0 bottom-0" />
    </div>
  );
}
