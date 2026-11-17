"use client";

import { useMemo, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { ArrowRight } from "@/components/icons";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { markEgg } from "@/lib/eggs";
import { scrollToElement } from "@/lib/motion";
import { play } from "@/lib/sound";
import { useUI } from "@/store/ui";
import { AWAY_TITLE } from "./QuietEggs";

type Egg = {
  id: string;
  name: string;
  find: ReactNode;
  /** The shell: fill, pattern and pattern colour. */
  shell: { fill: string; pattern: "dots" | "stripes" | "zigzag" | "stars" | "plain"; ink: string };
};

const EGGS: Egg[] = [
  { id: "terminal", name: "The hidden terminal", find: <>Press <Kbd>`</Kbd> or <Kbd>~</Kbd> anywhere, or type <Kbd>terminal</Kbd> into &ldquo;Where to?&rdquo;.</>, shell: { fill: "#0E0E10", pattern: "zigzag", ink: "#CCFF33" } },
  { id: "commands", name: "Commands nobody lists", find: <>In the terminal, try <Kbd>sudo hire itesh</Kbd>, <Kbd>rm -rf /</Kbd>, <Kbd>ls secrets</Kbd> or <Kbd>scuba</Kbd>.</>, shell: { fill: "#CBB8FF", pattern: "dots", ink: "#7A2CFF" } },
  { id: "scuba", name: "Scuba cat", find: <>Type <Kbd>↑ ↑ ↓ ↓ ← → ← → B A</Kbd> on any page.</>, shell: { fill: "#FFC700", pattern: "stripes", ink: "#FF4B2B" } },
  { id: "tab", name: "Come back", find: <>Switch to another tab and watch this one&rsquo;s title.</>, shell: { fill: "#FF4B2B", pattern: "dots", ink: "#FFC700" } },
  { id: "owl", name: "3am mode", find: <>Visit between 2 and 5 in the morning. The site goes night by itself, and admits it&rsquo;s awake too.</>, shell: { fill: "#15121D", pattern: "stars", ink: "#CBB8FF" } },
  { id: "print", name: "Print to resume", find: <>Print any page (<Kbd>Ctrl</Kbd> + <Kbd>P</Kbd>). You get a one-page resume, not a screenshot.</>, shell: { fill: "#F5F5F4", pattern: "stripes", ink: "#7A2CFF" } },
  { id: "404", name: "The hallucinated page", find: <>Visit any address that doesn&rsquo;t exist.</>, shell: { fill: "#7A2CFF", pattern: "zigzag", ink: "#FFFFFF" } },
  { id: "barcode", name: "You, shipped", find: <>Scan the barcode at the bottom of the shipping manifest on the Work page with your phone (Google Lens or any barcode app reads it), sign the arrival card, and watch your name print on the other screen. Your stamp goes in the visitors&apos; passport.</>, shell: { fill: "#0E0E10", pattern: "stripes", ink: "#FFFFFF" } },
  { id: "now", name: "Currently building", find: <>The latest push to GitHub, live, in the home hero, the footer and the terminal&rsquo;s <Kbd>now</Kbd>.</>, shell: { fill: "#CCFF33", pattern: "stars", ink: "#0E0E10" } },
];

function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="rounded-[6px] border-[2px] border-[var(--die)] bg-bg px-1.5 py-px font-mono text-[0.85em] whitespace-nowrap text-fg shadow-[0_2px_0_var(--line)]">{children}</kbd>;
}

function subscribeFound(onChange: () => void) {
  window.addEventListener("egg:found", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener("egg:found", onChange);
    window.removeEventListener("storage", onChange);
  };
}
function readFound() {
  try {
    return localStorage.getItem("eggs-found") ?? "[]";
  } catch {
    return "[]";
  }
}

const EGG_PATH = "M50 4C24 4 6 52 6 80c0 28 19 46 44 46s44-18 44-46C94 52 76 4 50 4Z";
/** The crack runs across the middle; the top cap lifts off along it. */
const CRACK = "0,58 10,50 20,60 30,49 40,61 50,50 60,61 70,49 80,60 90,50 100,58";

function Shell({ egg, i }: { egg: Egg; i: number }) {
  const { fill, pattern, ink } = egg.shell;
  const p = `egg-p-${i}`;
  const art = (
    <>
      <path d={EGG_PATH} fill={fill} />
      {pattern !== "plain" && <path d={EGG_PATH} fill={`url(#${p})`} />}
      <path d={EGG_PATH} fill="url(#egg-shine)" />
    </>
  );
  return (
    <svg viewBox="-6 -6 112 140" className="egg-svg w-full overflow-visible" aria-hidden="true">
      <defs>
        <pattern id={p} width={pattern === "stripes" ? 100 : 18} height={pattern === "stripes" ? 16 : 18} patternUnits="userSpaceOnUse" patternTransform={pattern === "stripes" ? "rotate(-12)" : undefined}>
          {pattern === "dots" && <circle cx="9" cy="9" r="3.4" fill={ink} />}
          {pattern === "stripes" && <rect y="5" width="100" height="5" fill={ink} />}
          {pattern === "zigzag" && <path d="M0 12 L4.5 6 L9 12 L13.5 6 L18 12" fill="none" stroke={ink} strokeWidth="2.4" />}
          {pattern === "stars" && <path d="M9 3l1.7 4.3L15 9l-4.3 1.7L9 15l-1.7-4.3L3 9l4.3-1.7Z" fill={ink} />}
        </pattern>
        <radialGradient id="egg-shine" cx="0.32" cy="0.26" r="0.75">
          <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.18" />
        </radialGradient>
        <clipPath id={`${p}-bottom`}>
          <polygon points={`${CRACK} 100,140 0,140`} />
        </clipPath>
        <clipPath id={`${p}-top`}>
          <polygon points={`0,-10 100,-10 ${CRACK.split(" ").reverse().join(" ")}`} />
        </clipPath>
      </defs>
      {/* The die-cut edge and shadow, drawn once behind both halves. */}
      <path d={EGG_PATH} fill="none" stroke="var(--die)" strokeWidth="7" className="egg-edge" />
      <g clipPath={`url(#${p}-bottom)`}>
        {art}
        <ellipse cx="50" cy="56" rx="40" ry="6" className="egg-inside" fill="#FFC700" />
      </g>
      <g className="egg-cap" clipPath={`url(#${p}-top)`}>
        {art}
      </g>
    </svg>
  );
}

/**
 * The /easter-eggs page's centrepiece (docs/design.md §2.16): an egg carton with
 * one dyed, sticker-patterned egg per secret. Crack one and its cap pops off and
 * a slip slides out: what it is, how to find it yourself, and a button to try it
 * right here. Eggs found on your own wear a stamp.
 */
export function EggCarton({ nowSlot }: { nowSlot: ReactNode }) {
  const [open, setOpen] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const slipRef = useRef<HTMLDivElement>(null);
  // Eggs found on your own, kept in this browser; updates live when one is found.
  const foundRaw = useSyncExternalStore(subscribeFound, readFound, () => "[]");
  const found = useMemo(() => {
    try {
      return JSON.parse(foundRaw) as string[];
    } catch {
      return [];
    }
  }, [foundRaw]);

  const egg = EGGS.find((e) => e.id === open);

  function crack(id: string) {
    play("flick");
    setNote("");
    setOpen((cur) => (cur === id ? null : id));
    // Bring the slip into view if it lands below the fold.
    window.setTimeout(() => {
      const slip = slipRef.current;
      if (slip && slip.getBoundingClientRect().bottom > window.innerHeight - 90) {
        scrollToElement(slip, -(window.innerHeight - slip.offsetHeight - 110));
      }
    }, 120);
  }

  function tryIt(id: string) {
    const ui = useUI.getState();
    setNote("");
    switch (id) {
      case "terminal":
      case "commands":
        ui.setTerminalOpen(true);
        break;
      case "scuba":
        window.dispatchEvent(new Event("egg:scuba"));
        break;
      case "tab": {
        const was = document.title;
        document.title = AWAY_TITLE;
        markEgg("tab");
        setNote("Look at this tab's title. (It does this for real when you leave.)");
        window.setTimeout(() => (document.title = was), 4000);
        break;
      }
      case "owl": {
        const root = document.documentElement;
        root.classList.add("shift-fade");
        ui.setShift("night", { persist: false });
        window.setTimeout(() => root.classList.remove("shift-fade"), 260);
        markEgg("owl");
        play("found");
        ui.pushToast("Why are you awake?", "Same. The site went dark to keep you company.");
        break;
      }
      case "print":
        window.print();
        break;
    }
  }

  return (
    <div className="flex flex-col gap-[clamp(28px,4vw,48px)]">
      {/* The carton */}
      <div className="carton relative mx-auto w-full max-w-[860px] rounded-[30px] border-[5px] border-[var(--die)] p-[clamp(16px,2.4vw,32px)]">
        <p aria-hidden="true" className="carton-label absolute -top-5 right-6 rounded-[8px] border-[3px] border-[var(--die)] bg-surface px-3 py-1 font-mono text-[11px] font-semibold tracking-[0.18em] uppercase shadow-[0_8px_14px_-8px_rgb(0_0_0/0.5)] md:right-10">
          Grade A · 9 eggs · hand-hidden
        </p>
        <ul className="grid grid-cols-3 gap-[clamp(10px,1.6vw,22px)]">
          {EGGS.map((e, i) => (
            <li key={e.id} className="carton-cup grid place-items-center rounded-[50%] px-[18%] pt-[8%] pb-[12%]">
              <button
                type="button"
                onClick={() => crack(e.id)}
                aria-pressed={open === e.id}
                aria-label={`Egg ${i + 1}: ${e.name}`}
                data-cursor={open === e.id ? "Close it" : "Crack it"}
                data-animate="slap"
                data-cracked={open === e.id || undefined}
                style={{ "--d": `${i * 70}ms`, "--tilt": `${[-4, 3, -2, 5, -5, 2, -3, 4, -1][i]}deg` } as CSSProperties}
                className="egg relative w-full"
              >
                <Shell egg={e} i={i} />
                {found.includes(e.id) && (
                  <span className="egg-found absolute -right-2 top-[6%] rounded-[5px] border-[2px] px-1.5 py-px font-mono text-[10px] font-semibold tracking-wider uppercase">Found</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* The slip from the cracked egg */}
      <div ref={slipRef} aria-live="polite" className="mx-auto w-full max-w-[760px]">
        {egg ? (
          <div key={egg.id} className="egg-slip relative rounded-[6px] bg-surface px-[clamp(20px,3vw,40px)] py-[clamp(20px,2.6vw,32px)]">
            <p className="font-mono text-[12px] tracking-[0.2em] text-fg-muted uppercase">
              Egg {String(EGGS.indexOf(egg) + 1).padStart(2, "0")} of {String(EGGS.length).padStart(2, "0")} {found.includes(egg.id) && "· you found this one yourself"}
            </p>
            <h2 className="mt-2 text-[clamp(30px,3.6vw,50px)] leading-none font-semibold tracking-[-0.045em] [font-variation-settings:'wdth'_80]">{egg.name}</h2>
            <p className="mt-4 text-[clamp(16px,1.3vw,18px)] leading-relaxed">
              <span className="font-serif text-[1.15em] text-fg-muted italic">How to find it: </span>
              {egg.find}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              {egg.id === "404" ? (
                <TransitionLink href="/this-page-is-a-hallucination" transitionLabel="Nowhere" className="btn btn-ink">
                  Take me nowhere
                  <ArrowRight />
                </TransitionLink>
              ) : egg.id === "barcode" ? (
                <>
                  <TransitionLink href="/work" transitionLabel="Work" className="btn btn-ink">
                    Go to the manifest
                    <ArrowRight />
                  </TransitionLink>
                  <TransitionLink href="/visitors" transitionLabel="Visitors" className="btn btn-paper">
                    See the passport
                  </TransitionLink>
                </>
              ) : egg.id === "now" ? (
                <div className="rounded-[14px] border-[3px] border-dashed border-line px-4 py-3">{nowSlot}</div>
              ) : (
                <button type="button" onClick={() => tryIt(egg.id)} className="btn btn-ink">
                  Try it
                  <ArrowRight />
                </button>
              )}
              {note && <p className="font-hand text-[22px] text-accent-text">{note}</p>}
            </div>
          </div>
        ) : (
          <p className="text-center font-hand text-[clamp(22px,2vw,28px)] text-accent-text">crack an egg to see what&rsquo;s inside</p>
        )}
      </div>

      <p className="text-center font-mono text-[13px] tracking-wider text-fg-muted">
        Found on your own: {found.filter((f) => EGGS.some((e) => e.id === f)).length} of {EGGS.length}
      </p>
    </div>
  );
}
