import type { CSSProperties } from "react";
import { OpenArceeButton } from "@/components/arcee/OpenArceeButton";
import { ArrowRight, Spark } from "@/components/icons";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { Sticker } from "@/components/ui/Sticker";

/** Where the visitor probably meant to go, with a model's misplaced confidence. */
const GUESSES = [
  { href: "/", label: "Home", confidence: 97, tone: "bg-lime text-[#2B3600]" },
  { href: "/work", label: "Work", confidence: 91, tone: "bg-sunflower text-[#4A3A00]" },
  { href: "/about", label: "About", confidence: 88, tone: "bg-lavender text-violet-ink" },
  { href: "/dialabs", label: "DiaLabs", confidence: 84, tone: "bg-violet text-white" },
  { href: "/contact", label: "Contact", confidence: 79, tone: "bg-tomato text-[#2A0700]" },
];

/**
 * The 404 (docs/design.md §2.15): the sticker that was this page has peeled off.
 * An empty die-cut outline is left on the mat, the "404" sticker lands askew
 * beside it with its corner curled, and a model suggests where you meant to go.
 */
export default function NotFound() {
  return (
    <main className="faded-mat px-gutter flex flex-1 flex-col items-center justify-center pt-24 pb-32 text-center">
      <p data-animate="rise" className="font-serif text-[clamp(20px,1.9vw,28px)] text-fg-muted italic">
        404
      </p>
      <h1
        data-animate="rise"
        style={{ "--d": "80ms" } as CSSProperties}
        className="mt-2 max-w-[18ch] text-[clamp(36px,4.6vw,68px)] leading-[1.05] font-semibold tracking-[-0.045em] text-balance [font-variation-settings:'wdth'_80]"
      >
        The model{" "}
        <Sticker size="word" tone="violet" tilt={-2.5}>
          hallucinated
        </Sticker>{" "}
        this page.
      </h1>

      {/* Where the page was, and the sticker that peeled off it. */}
      <div aria-hidden="true" className="relative mt-[clamp(28px,4vw,48px)] mb-[clamp(120px,12vw,150px)] h-[clamp(150px,17vw,220px)] w-[min(460px,80vw)]">
        <div className="lost-outline absolute inset-0 grid place-items-center rounded-[28px]">
          <span className="font-mono text-[clamp(11px,1vw,13px)] tracking-[0.2em] text-fg-muted uppercase">this page used to be here</span>
        </div>
        <div className="lost-sticker absolute inset-0 grid place-items-center rounded-[28px] border-[6px] border-white bg-violet text-white">
          <span className="text-[clamp(84px,11vw,150px)] leading-none font-semibold tracking-[-0.06em] [font-variation-settings:'wdth'_74]">404</span>
          <span className="lost-curl absolute right-0 bottom-0" />
        </div>
      </div>

      <p className="font-serif text-[clamp(20px,1.8vw,24px)] text-fg-muted italic">Did you mean…</p>
      <ul className="mt-4 flex max-w-[720px] flex-wrap justify-center gap-3">
        {GUESSES.map((g, i) => (
          <li key={g.href} data-animate="slap" style={{ "--d": `${1300 + i * 80}ms` } as CSSProperties}>
            <TransitionLink
              href={g.href}
              transitionLabel={g.label}
              data-cursor={`${g.confidence}% sure`}
              className={`lost-guess inline-flex items-center gap-2 rounded-[14px] border-[4px] border-white px-4 py-2 text-[18px] font-semibold tracking-[-0.02em] shadow-[0_10px_18px_-10px_rgb(0_0_0/0.45)] ${g.tone}`}
              style={{ rotate: `${[-2, 1.5, -1, 2, -1.5][i]}deg` } as CSSProperties}
            >
              {g.label}
              <span className="font-mono text-[12px] font-medium opacity-75">{g.confidence}%</span>
            </TransitionLink>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <TransitionLink href="/" transitionLabel="Home" className="btn btn-ink">
          Take me home
          <ArrowRight />
        </TransitionLink>
        <OpenArceeButton seed="I ended up on a page that doesn't exist. Where should I go?" className="btn btn-lime">
          <Spark />
          Ask Arcee instead
        </OpenArceeButton>
      </div>
    </main>
  );
}
