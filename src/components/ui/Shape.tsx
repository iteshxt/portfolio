import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/**
 * Die-cut stickers in the accent colours (docs/design.md §2.2, §2.5): abstract
 * shapes for the intro loader, and field stickers (terminal, braces, a neural
 * net, a chip, a git branch, an AI sparkle) stuck around the home hero.
 */

const DIE_CUT = { stroke: "#fff", strokeWidth: 7, strokeLinejoin: "round" as const, paintOrder: "stroke" as const };

/** A 12-point burst, as polygon points in a 100×100 box. */
const BURST = Array.from({ length: 24 }, (_, i) => {
  const a = (i * Math.PI) / 12;
  const r = i % 2 ? 33 : 47;
  return `${(50 + r * Math.sin(a)).toFixed(1)},${(50 - r * Math.cos(a)).toFixed(1)}`;
}).join(" ");

const ART = {
  burst: <polygon points={BURST} fill="var(--sunflower)" {...DIE_CUT} />,
  blob: <path d="M52 9C75 7 93 25 91 49 89 74 70 92 46 91 22 89 7 71 9 47 11 25 30 11 52 9Z" fill="var(--lime)" {...DIE_CUT} />,
  squiggle: (
    <>
      <path d="M10 58C22 28 34 28 40 50S58 72 64 50 82 28 90 44" fill="none" stroke="#fff" strokeWidth="26" strokeLinecap="round" />
      <path d="M10 58C22 28 34 28 40 50S58 72 64 50 82 28 90 44" fill="none" stroke="var(--tomato)" strokeWidth="14" strokeLinecap="round" />
    </>
  ),
  arch: (
    <>
      <path d="M16 74A34 34 0 0 1 84 74" fill="none" stroke="#fff" strokeWidth="30" strokeLinecap="round" />
      <path d="M16 74A34 34 0 0 1 84 74" fill="none" stroke="var(--lavender)" strokeWidth="18" strokeLinecap="round" />
    </>
  ),
};

/** Neural-net sticker: 2-3-2 nodes, every node wired to the next layer. */
const NET = [
  [[28, 36], [28, 64]],
  [[50, 24], [50, 50], [50, 76]],
  [[72, 38], [72, 62]],
];
const NET_WIRES = NET.slice(0, -1).flatMap((layer, i) => layer.flatMap((a) => NET[i + 1].map((b) => `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`))).join("");

const MONO = { fontFamily: "var(--font-mono)", fontWeight: 700 };

const FIELD = {
  terminal: (
    <>
      <rect x="8" y="16" width="84" height="68" rx="13" fill="var(--ink)" {...DIE_CUT} />
      <circle cx="22" cy="29" r="3.5" fill="var(--tomato)" />
      <circle cx="33" cy="29" r="3.5" fill="var(--sunflower)" />
      <circle cx="44" cy="29" r="3.5" fill="var(--lime)" />
      <text x="20" y="70" fontSize="30" fill="var(--lime)" style={MONO}>
        &gt;_
      </text>
    </>
  ),
  braces: (
    <>
      <rect x="10" y="12" width="80" height="76" rx="22" fill="var(--violet)" {...DIE_CUT} />
      <text x="50" y="62" fontSize="34" textAnchor="middle" fill="#fff" style={MONO}>
        {"{ }"}
      </text>
    </>
  ),
  neural: (
    <>
      <rect x="8" y="8" width="84" height="84" rx="24" fill="var(--lavender)" {...DIE_CUT} />
      <path d={NET_WIRES} stroke="var(--violet-ink)" strokeWidth="2.5" />
      {NET.flat().map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="6" fill="#fff" stroke="var(--violet-ink)" strokeWidth="3" />
      ))}
    </>
  ),
  chip: (
    <>
      <path d="M36 10v14M50 10v14M64 10v14M36 76v14M50 76v14M64 76v14M10 36h14M10 50h14M10 64h14M76 36h14M76 50h14M76 64h14" stroke="#fff" strokeWidth="11" strokeLinecap="round" />
      <path d="M36 12v12M50 12v12M64 12v12M36 76v12M50 76v12M64 76v12M12 36h12M12 50h12M12 64h12M76 36h12M76 50h12M76 64h12" stroke="var(--ink)" strokeWidth="4.5" strokeLinecap="round" />
      <rect x="22" y="22" width="56" height="56" rx="10" fill="var(--sunflower)" {...DIE_CUT} />
      <text x="50" y="59" fontSize="22" textAnchor="middle" fill="var(--ink)" style={MONO}>
        AI
      </text>
    </>
  ),
  branch: (
    <>
      <circle cx="50" cy="50" r="42" fill="var(--tomato)" {...DIE_CUT} />
      <path d="M38 30v40M62 36c0 18-24 14-24 28" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <circle cx="38" cy="28" r="6.5" fill="var(--tomato)" stroke="#fff" strokeWidth="4.5" />
      <circle cx="38" cy="72" r="6.5" fill="var(--tomato)" stroke="#fff" strokeWidth="4.5" />
      <circle cx="62" cy="31" r="6.5" fill="var(--tomato)" stroke="#fff" strokeWidth="4.5" />
    </>
  ),
  sparkle: <path d="M50 6C54 34 66 46 94 50 66 54 54 66 50 94 46 66 34 54 6 50 34 46 46 34 50 6Z" fill="var(--lime)" {...DIE_CUT} />,
};

const ALL = { ...ART, ...FIELD };

export type ShapeName = keyof typeof ALL;

export function Shape({ name, className, style }: { name: ShapeName; className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={cn("overflow-visible drop-shadow-[0_10px_14px_rgb(0_0_0/0.28)]", className)} style={style}>
      {ALL[name]}
    </svg>
  );
}
