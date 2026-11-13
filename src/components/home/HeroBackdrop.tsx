/**
 * The hero sits on a lifted sheet (docs/design.md §2.5): a rounded paper sheet
 * with a cutting-mat grid that fades towards its edges and a soft
 * violet glow. The hero section itself is clipped along the same fold
 * (.hero-peel), so its content peels away with the sheet, and the folded
 * corner (the flap) lies on top of that content. The curl grows as you scroll
 * (--curl, set by MotionLayer on [data-curl]). CSS only.
 */
export function HeroBackdrop() {
  return (
    <>
      <div aria-hidden="true" className="hero-backdrop pointer-events-none absolute inset-x-3 top-3 bottom-3 -z-10 sm:inset-x-6 sm:top-[76px] sm:bottom-6">
        <div className="hero-sheet absolute inset-0">
          <div className="hero-mat absolute inset-0" />
          <div className="hero-glow absolute top-1/2 left-1/2" />
        </div>
      </div>
      <div aria-hidden="true" className="hero-flap pointer-events-none absolute z-10" />
    </>
  );
}
