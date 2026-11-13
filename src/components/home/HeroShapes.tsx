import { Shape, type ShapeName } from "@/components/ui/Shape";

/** Around the edges of the home hero, clear of the text, the peel hint and the corners' UI. */
const PLACES: { name: ShapeName; where: string; tilt: number; delay: number }[] = [
  { name: "terminal", where: "top-[15%] left-[6%] w-[clamp(64px,6.6vw,104px)]", tilt: -9, delay: 1.9 },
  { name: "neural", where: "top-[11%] left-[30%] w-[clamp(48px,4.6vw,74px)]", tilt: 7, delay: 2.0 },
  { name: "sparkle", where: "top-[30%] right-[6%] w-[clamp(52px,5.2vw,82px)]", tilt: 10, delay: 2.1 },
  { name: "branch", where: "bottom-[24%] left-[8%] w-[clamp(56px,5.6vw,88px)]", tilt: -12, delay: 2.2 },
  { name: "chip", where: "bottom-[11%] left-[25%] w-[clamp(52px,5vw,80px)]", tilt: 6, delay: 2.3 },
  { name: "braces", where: "bottom-[27%] right-[12%] w-[clamp(56px,5.4vw,86px)]", tilt: -6, delay: 2.4 },
];

/**
 * Field stickers (terminal, braces, neural net, chip, git branch, sparkle)
 * stuck around the hero once the intro peels away (docs/design.md §2.5): they
 * slap on, then drift gently. CSS only; still for
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
