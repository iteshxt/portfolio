import { Shape, type ShapeName } from "@/components/ui/Shape";

/** Where the loader's stickers end up: around the edges of the home hero, clear of the text. */
const PLACES: { name: ShapeName; where: string; tilt: number; delay: number }[] = [
  { name: "burst", where: "top-[16%] left-[7%] w-[clamp(56px,6vw,92px)]", tilt: -10, delay: 1.9 },
  { name: "blob", where: "top-[28%] right-[6%] w-[clamp(50px,5.4vw,84px)]", tilt: 8, delay: 2.05 },
  { name: "squiggle", where: "bottom-[24%] left-[9%] w-[clamp(64px,6.6vw,104px)]", tilt: -6, delay: 2.2 },
  { name: "arch", where: "bottom-[27%] right-[12%] w-[clamp(50px,5vw,80px)]", tilt: 12, delay: 2.35 },
];

/**
 * The intro loader's die-cut shapes, stuck around the hero once it peels away
 * (docs/design.md §2.5): they slap on, then drift gently. CSS only; still for
 * reduced motion. Hidden on phones, where they'd crowd the headline.
 */
export function HeroShapes() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
      {PLACES.map((p) => (
        <Shape
          key={p.name}
          name={p.name}
          className={`hero-shape absolute ${p.where}`}
          style={{ rotate: `${p.tilt}deg`, animationDelay: `${p.delay}s, ${p.delay + 0.5}s` }}
        />
      ))}
    </div>
  );
}
