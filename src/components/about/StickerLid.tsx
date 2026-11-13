"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { StarVisual } from "@/components/home/StarVisual";
import { ArrowRight } from "@/components/icons";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { cn } from "@/lib/cn";
import { useFlick } from "@/lib/flick";
import { scrollToElement } from "@/lib/motion";

type Story = { title: string; body: string; href?: string; link?: string };

type LidSticker = {
  id: string;
  /** Read out for screen readers and shown by the cursor. */
  label: string;
  /** Where it sits on the lid from tablet width up: centre in % and tilt in degrees. */
  at: [x: number, y: number, r: number];
  shape: "round" | "word" | "badge";
  className: string;
  face: ReactNode;
  story: Story;
};

const ROUND = "size-[clamp(84px,9vw,128px)] rounded-full";

/** Every sticker is true. Facts come from the projects and the CV (docs/design.md §2.12). */
const STICKERS: LidSticker[] = [
  {
    id: "arcee",
    label: "Arcee",
    at: [17, 30, -8],
    shape: "round",
    className: cn(ROUND, "bg-arcee-deep"),
    face: <StarVisual slug="arcee" />,
    story: {
      title: "Arcee, the one I'm proudest of",
      body: "A desktop agent for Ubuntu that plans a request and does it with your apps. Built solo since October 2026: 110 tools, 43 of 44 whole-task evals passing on local models.",
      href: "/work/arcee",
      link: "Open the case file",
    },
  },
  {
    id: "ubuntu",
    label: "Ubuntu",
    at: [31, 13, 9],
    shape: "badge",
    className: "rounded-full bg-[#E95420] px-4 py-2 text-white",
    face: <span className="font-semibold">ubuntu</span>,
    story: { title: "Daily driver: Ubuntu and GNOME", body: "Which is why Arcee is built for Ubuntu, GNOME and Wayland first: it had to work on the machine it was written on." },
  },
  {
    id: "dialabs",
    label: "DiaLabs",
    at: [47, 17, -4],
    shape: "word",
    className: "rounded-[16px] bg-violet px-5 pt-2 pb-3 text-white",
    face: <span className="text-[clamp(26px,3vw,40px)] leading-none font-semibold tracking-[-0.04em] [font-variation-settings:'wdth'_80]">DiaLabs</span>,
    story: {
      title: "Co-founder, DiaLabs",
      body: "An open-source AI and ML organisation that releases free models, datasets and developer tools. PatentIQ and DiaChat were built there.",
      href: "/dialabs",
      link: "See the lab",
    },
  },
  {
    id: "patentiq",
    label: "PatentIQ",
    at: [79, 25, 7],
    shape: "round",
    className: cn(ROUND, "bg-patentiq"),
    face: <StarVisual slug="patentiq" />,
    story: {
      title: "PatentIQ, co-built at DiaLabs",
      body: "Scores student patent drafts on an 11-part, 100-point rubric, after checking every cited patent against live search. About 60% of the commits are his.",
      href: "/work/patentiq",
      link: "Open the case file",
    },
  },
  {
    id: "cat",
    label: "A cat sticker",
    at: [93, 12, 12],
    shape: "round",
    // The cat SVG is already die-cut, so it skips the frame.
    className: "lid-bare size-[clamp(62px,6vw,88px)]",
    // eslint-disable-next-line @next/next/no-img-element -- a tiny local SVG, nothing to optimise
    face: <img src="/stickers/happy.svg" alt="" width={88} height={88} className="size-full" />,
    story: { title: "The chatbot replies in cats", body: "Arcee, the guide on this site, answers questions about the work and sends a cat sticker to match its mood. Ask it something.", href: "/arcee", link: "Ask Arcee" },
  },
  {
    id: "python",
    label: "Python",
    at: [34, 50, 6],
    shape: "word",
    className: "rounded-[14px] bg-sunflower px-4 pt-1.5 pb-2.5 text-[#4A3A00]",
    face: <span className="font-mono text-[clamp(18px,1.8vw,24px)] font-semibold">python</span>,
    story: { title: "Python for the models", body: "Arcee's harness, the evals and the fine-tuning work are Python; PyTorch on top for training." },
  },
  {
    id: "typescript",
    label: "TypeScript",
    at: [53, 44, -3],
    shape: "word",
    className: "rounded-[14px] bg-[#3178C6] px-4 pt-1.5 pb-2.5 text-white",
    face: <span className="font-mono text-[clamp(18px,1.8vw,24px)] font-semibold">TS</span>,
    story: { title: "TypeScript for the product", body: "Next.js and React for the things people click: this site, Sutr's store, PatentIQ's dashboard, DiaChat." },
  },
  {
    id: "caudal",
    label: "Caudal AI Labs",
    at: [68, 49, 4],
    shape: "badge",
    className: "rounded-[12px] bg-surface px-4 py-2 text-fg",
    face: (
      <span className="flex flex-col items-start leading-tight">
        <span className="font-mono text-[10px] tracking-widest text-fg-muted uppercase">guest pass</span>
        <span className="text-[clamp(15px,1.4vw,19px)] font-semibold">Caudal AI Labs</span>
      </span>
    ),
    story: { title: "Evaluating LLMs at Caudal AI Labs", body: "Summer 2026: tested LLM systems for accuracy, originality and instruction-following, and turned their failure modes into feedback for the next model." },
  },
  {
    id: "pytorch",
    label: "PyTorch",
    at: [87, 56, -9],
    shape: "word",
    className: "rounded-[14px] bg-tomato px-4 pt-1.5 pb-2.5 text-[#2A0700]",
    face: <span className="text-[clamp(18px,1.8vw,24px)] font-semibold tracking-[-0.02em]">PyTorch</span>,
    story: { title: "Fine-tuning, on purpose", body: "Small models tuned for one job beat big ones guessing at it, as long as there's an eval to prove it." },
  },
  {
    id: "commits",
    label: "small commits",
    at: [21, 61, -5],
    shape: "word",
    className: "rounded-[14px] bg-surface px-4 pt-1.5 pb-2.5 text-fg",
    face: <span className="font-mono text-[clamp(14px,1.3vw,17px)]">git commit -m &ldquo;small&rdquo;</span>,
    story: { title: "Small commits, often", body: "377 commits in Arcee's first 18 days, each one small enough to read and undo." },
  },
  {
    id: "nextjs",
    label: "Next.js",
    at: [12, 82, 5],
    shape: "round",
    className: cn("size-[clamp(72px,7vw,104px)] rounded-full bg-ink text-white"),
    face: <span className="text-[clamp(22px,2.3vw,32px)] font-semibold tracking-[-0.04em]">N</span>,
    story: { title: "Next.js, most days", body: "This site runs on it, and so do Sutr's store and PatentIQ's front end." },
  },
  {
    id: "sutr",
    label: "Sutr",
    at: [45, 70, -6],
    shape: "badge",
    className: "rounded-[14px] bg-paper px-5 pt-1.5 pb-2.5 text-ink",
    face: <span className="font-serif text-[clamp(26px,2.6vw,36px)] italic">sutr.</span>,
    story: {
      title: "Sutr Clothing, the first real customers",
      body: "Full-stack developer from April to November 2025: the store and its admin, Razorpay payments and Ekart deliveries, for 500+ customers a month.",
      href: "https://sutr.store",
      link: "Visit the store",
    },
  },
  {
    id: "evals",
    label: "evals before claims",
    at: [31, 87, 3],
    shape: "word",
    className: "rounded-[14px] bg-lime px-4 pt-1.5 pb-2.5 text-[#2B3600]",
    face: <span className="text-[clamp(16px,1.6vw,22px)] font-semibold tracking-[-0.02em]">evals before claims</span>,
    story: { title: "Evals before claims", body: "If it isn't measured, it doesn't go on the site. Every number in the case files comes from an eval report or the repo." },
  },
  {
    id: "diachat",
    label: "DiaChat",
    at: [66, 77, -5],
    shape: "round",
    className: cn(ROUND, "bg-diachat"),
    face: <StarVisual slug="diachat" />,
    story: {
      title: "DiaChat, a model in your tab",
      body: "A companion that runs a 1B chat model in the browser on your own GPU, with a CPU fallback for everyone else.",
      href: "/work/diachat",
      link: "Open the case file",
    },
  },
  {
    id: "local",
    label: "local-first",
    at: [87, 86, 4],
    shape: "word",
    className: "rounded-full bg-lavender px-4 pt-1.5 pb-2.5 text-violet-ink",
    face: <span className="text-[clamp(16px,1.6vw,22px)] font-semibold">local-first</span>,
    story: { title: "On the laptop when it can be", body: "Arcee runs entirely on Ollama with --core local; DiaChat answers on your own GPU. The cloud is a fallback, not a given." },
  },
];

function LidStickerButton({ s, i, active, onPick }: { s: LidSticker; i: number; active: boolean; onPick: (id: string, pin: boolean) => void }) {
  const ref = useFlick<HTMLButtonElement>();
  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={active}
      aria-label={s.label}
      data-cursor={s.label}
      data-animate="slap"
      onPointerEnter={(e) => e.pointerType === "mouse" && onPick(s.id, false)}
      onFocus={() => onPick(s.id, false)}
      onClick={() => onPick(s.id, true)}
      style={{ "--x": `${s.at[0]}%`, "--y": `${s.at[1]}%`, "--r": `${s.at[2]}deg`, "--d": `${200 + i * 70}ms` } as CSSProperties}
      className={cn(
        "lid-sticker flex shrink-0 items-center justify-center overflow-hidden border-[4px] border-white whitespace-nowrap shadow-[0_10px_18px_-8px_rgb(0_0_0/0.55)]",
        s.className,
      )}
    >
      {s.face}
    </button>
  );
}

/**
 * The about page's centrepiece (docs/design.md §2.12): a laptop lid covered in
 * die-cut stickers, every one of them true. Point at or tap a sticker and its
 * story shows on the label under the lid. From tablet width up the stickers sit
 * where they were stuck; on phones they wrap.
 */
export function StickerLid() {
  const [picked, setPicked] = useState<string | null>(null);
  const [pinned, setPinned] = useState(false);
  const captionRef = useRef<HTMLDivElement>(null);
  const current = STICKERS.find((s) => s.id === picked);

  const onPick = (id: string, pin: boolean) => {
    if (!pin && pinned) return;
    setPicked(id);
    setPinned(pin);
    // On a tall phone lid the label can be off screen: bring it up.
    const caption = captionRef.current;
    if (pin && caption && caption.getBoundingClientRect().bottom > window.innerHeight - 90) {
      scrollToElement(caption, -(window.innerHeight - caption.offsetHeight - 110));
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="lid relative overflow-hidden rounded-[clamp(20px,2.4vw,32px)] p-5 md:aspect-[16/9.4] md:p-0" onPointerLeave={() => !pinned && setPicked(null)}>
        {/* The embossed mark in the middle of the lid. */}
        <span aria-hidden="true" className="lid-mark pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[clamp(48px,7vw,104px)] italic">
          itesh
        </span>
        <div className="relative flex flex-wrap items-center justify-center gap-3 md:static md:block">
          {STICKERS.map((s, i) => (
            <LidStickerButton key={s.id} s={s} i={i} active={picked === s.id} onPick={onPick} />
          ))}
        </div>
      </div>

      {/* The label under the lid, like a caption in a museum case. */}
      <div ref={captionRef} aria-live="polite" className="flex min-h-[96px] flex-col gap-2 rounded-[18px] border-[3px] border-dashed border-line px-5 py-4 md:flex-row md:items-center md:justify-between md:gap-8">
        {current ? (
          <>
            <div>
              <p className="text-[clamp(18px,1.6vw,22px)] font-semibold tracking-[-0.02em]">{current.story.title}</p>
              <p className="mt-1 max-w-[70ch] text-[15px] leading-snug text-fg-muted">{current.story.body}</p>
            </div>
            {current.story.href &&
              (current.story.href.startsWith("http") ? (
                <a href={current.story.href} target="_blank" rel="noreferrer" className="btn btn-paper shrink-0">
                  {current.story.link} <ArrowRight />
                </a>
              ) : (
                <TransitionLink href={current.story.href} transitionLabel={current.label} className="btn btn-ink shrink-0">
                  {current.story.link} <ArrowRight />
                </TransitionLink>
              ))}
          </>
        ) : (
          <p className="font-hand text-[clamp(22px,2vw,28px)] text-accent-text">point at a sticker (or tap one) for the story</p>
        )}
      </div>
    </div>
  );
}
