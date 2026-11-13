import { Shape, type ShapeName } from "@/components/ui/Shape";

/**
 * What the intro sticker shows while the first page loads (docs/design.md §2.2):
 * the wordmark, a 000→100 counter, a rotating line of what's being "warmed up"
 * and a few wordless die-cut shapes slapping on, like a sticker sheet. Rendered on the server so it's there at first
 * paint; TransitionProvider drives the counter and bar (found by data attributes), then fades it out
 * before the peel. Hidden outside the intro (CSS: `.intro-ui`).
 */

const WORDS = ["agents", "models", "products", "evals", "a lab"];

/** Shapes only, no words; where each lands is decided per visit by the script below. */
const SHAPES: { name: ShapeName; size: string }[] = [
  { name: "burst", size: "w-[clamp(52px,6.4vw,100px)]" },
  { name: "blob", size: "w-[clamp(46px,5.6vw,88px)]" },
  { name: "squiggle", size: "w-[clamp(60px,7vw,112px)]" },
  { name: "arch", size: "w-[clamp(46px,5.4vw,84px)]" },
  { name: "sparkle", size: "w-[clamp(40px,4.6vw,72px)]" },
  { name: "flower", size: "w-[clamp(48px,5.6vw,88px)]" },
  { name: "zigzag", size: "w-[clamp(56px,6.6vw,104px)]" },
  { name: "capsule", size: "w-[clamp(48px,5.8vw,92px)]" },
];

/**
 * Picks a random spot (clear of the counter and of each other), delay and tilt
 * for every shape before first paint, as CSS variables on <html> so React's
 * markup stays untouched.
 */
const PLACE_SHAPES = `(function(){try{var s=document.documentElement.style,p=[];for(var i=0;i<${8};i++){var x,y,t=0;do{x=3+Math.random()*88;y=7+Math.random()*80;t++}while(t<60&&((x>20&&x<74&&y>22&&y<72)||p.some(function(q){return Math.abs(q[0]-x)<13&&Math.abs(q[1]-y)<15})));p.push([x,y]);s.setProperty('--is'+i+'x',x.toFixed(1)+'%');s.setProperty('--is'+i+'y',y.toFixed(1)+'%');s.setProperty('--is'+i+'d',(150+Math.random()*1100|0)+'ms');s.setProperty('--is'+i+'r',(Math.random()*40-20|0)+'deg')}}catch(e){}})();`;

/** Where the shapes sit if the script doesn't run: around the edges. */
const FALLBACK = [
  [8, 14],
  [86, 22],
  [12, 78],
  [84, 74],
  [30, 10],
  [64, 86],
  [6, 46],
  [90, 50],
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
      <span className="font-serif text-[28px] italic leading-none">itesh</span>

      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {SHAPES.map((shape, i) => (
          <Shape
            key={shape.name}
            name={shape.name}
            className={`intro-sticker absolute ${shape.size}`}
            style={{
              left: `var(--is${i}x, ${FALLBACK[i][0]}%)`,
              top: `var(--is${i}y, ${FALLBACK[i][1]}%)`,
              rotate: `var(--is${i}r, ${i % 2 ? 10 : -10}deg)`,
              animationDelay: `var(--is${i}d, ${200 + i * 140}ms)`,
              translate: "-50% -50%",
            }}
          />
        ))}
        <script dangerouslySetInnerHTML={{ __html: PLACE_SHAPES }} />
      </div>

      <div className="relative flex flex-col items-center gap-4 text-center">
        <span className="flex items-start gap-[0.25em] font-serif text-[clamp(20px,2.2vw,30px)] leading-[1.1] italic opacity-90">
          <span>Warming up</span>
          <Rotator words={WORDS} />
        </span>
        <span className="display-sans flex items-start text-[clamp(96px,22vw,300px)] tabular-nums">
          <span data-intro-counter="">000</span>
          <span className="display-serif mt-[0.08em] text-[0.32em] text-lavender">%</span>
        </span>
      </div>

      <span className="block h-[3px] w-full overflow-hidden rounded-full bg-white/20">
        <span data-intro-bar="" className="block h-full origin-left scale-x-0 rounded-full bg-lime" />
      </span>
    </div>
  );
}
