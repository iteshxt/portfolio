import { Shape, type ShapeName } from "@/components/ui/Shape";

/**
 * What the intro sticker shows while the first page loads (docs/design.md §2.2):
 * the wordmark, a 000→100 counter, a rotating line of what's being "warmed up"
 * and a few wordless die-cut shapes slapping on, like a sticker sheet. Rendered on the server so it's there at first
 * paint; TransitionProvider drives the counter and bar (found by data attributes), then fades it out
 * before the peel. Hidden outside the intro (CSS: `.intro-ui`).
 */

const DAY_WORDS = ["agents", "models", "products", "a lab"];
const NIGHT_WORDS = ["logs", "evals", "edge cases", "docs"];

/** Shapes only, no words: the loader shouldn't read like a CV. */
const SHAPES: { name: ShapeName; where: string; tilt: number; delay: number }[] = [
  { name: "burst", where: "top-[12%] left-[6%] w-[clamp(64px,7vw,104px)]", tilt: -10, delay: 220 },
  { name: "blob", where: "top-[24%] right-[6%] w-[clamp(60px,6.4vw,96px)]", tilt: 8, delay: 460 },
  { name: "squiggle", where: "bottom-[6%] left-[15%] w-[clamp(72px,8vw,120px)]", tilt: -6, delay: 700 },
  { name: "arch", where: "bottom-[16%] right-[13%] w-[clamp(58px,6vw,92px)]", tilt: 12, delay: 900 },
];

function Rotator({ words }: { words: string[] }) {
  // Last word repeats the first so the CSS loop is seamless.
  const loop = [...words, words[0]];
  return (
    <span className="intro-rotator relative block h-[1.1em] overflow-hidden text-left">
      <span className="intro-rotator-track flex flex-col">
        {loop.map((w, i) => (
          <span key={i} className="block h-[1.1em] leading-[1.1em]">
            {w}
          </span>
        ))}
      </span>
    </span>
  );
}

/** Server component, passed into TransitionProvider as `intro` so it adds no client JS. */
export function IntroScreen() {
  return (
    <div className="intro-ui px-gutter absolute inset-0 flex flex-col justify-between pt-5 pb-[max(20px,env(safe-area-inset-bottom))] text-white">
      <div className="flex items-start justify-between">
        <span className="font-serif text-[28px] italic leading-none">itesh</span>
        <span className="font-mono text-[12px] tracking-wide uppercase opacity-70">Portfolio · ’26</span>
      </div>

      <div className="relative flex flex-col items-center gap-4 text-center">
        <span className="flex items-start gap-[0.25em] font-serif text-[clamp(20px,2.2vw,30px)] leading-[1.1] italic opacity-90">
          <span>Warming up</span>
          <span className="day-only">
            <Rotator words={DAY_WORDS} />
          </span>
          <span className="night-only">
            <Rotator words={NIGHT_WORDS} />
          </span>
        </span>
        <span className="display-sans flex items-start text-[clamp(96px,22vw,300px)] tabular-nums">
          <span data-intro-counter="">000</span>
          <span className="display-serif mt-[0.08em] text-[0.32em] text-lavender">%</span>
        </span>
        <div className="pointer-events-none absolute inset-0 hidden sm:block" aria-hidden="true">
          {SHAPES.map((shape) => (
            <Shape
              key={shape.name}
              name={shape.name}
              className={`intro-sticker absolute ${shape.where}`}
              style={{ rotate: `${shape.tilt}deg`, animationDelay: `${shape.delay}ms` }}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="font-mono text-[12px] tracking-wide uppercase opacity-80">
          <span className="day-only">Booting the day shift</span>
          <span className="night-only">Booting the night shift</span>
        </p>
        <span className="block h-[3px] w-full overflow-hidden rounded-full bg-white/20">
          <span data-intro-bar="" className="block h-full origin-left scale-x-0 rounded-full bg-lime" />
        </span>
      </div>
    </div>
  );
}
