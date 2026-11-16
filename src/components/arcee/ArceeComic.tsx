"use client";

import type { UIMessage } from "ai";
import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { ArrowDown, ArrowUpRight } from "@/components/icons";
import { Shape } from "@/components/ui/Shape";
import { allowedUrls } from "@/lib/arcee/corpus";
import { STICKERS, type StickerMood } from "@/lib/arcee/stickers";
import { cn } from "@/lib/cn";
import { scrollToElement, scrollToY } from "@/lib/motion";
import { SUGGESTIONS } from "./ArceeChat";
import { DraftCard, type Draft } from "./DraftCard";
import { isEmptyReply, moodFor, plain, repeatedParts, replyText, RichText, STICKER_TEXT_ALL, useArceeConversation, type ToolPart } from "./reply";

const MORE = ["What's DiaLabs?", "Which project uses WebGPU?"];
const KNOWS = ["The three star projects and how they work", "Everything else he has shipped", "Where he has worked and what he did", "DiaLabs and its releases", "How to reach him, or take a message"];

/** Narration for each new panel, like the captions between comic panels. */
const NARRATION = ["A question lands.", "Moments later…", "Meanwhile, on the page…", "And then:", "Plot twist:", "Later that scroll…", "Back at the guide…", "Next panel, please."];

/** Each mood's colour (the halftone aura behind the cat) and its sound effect. */
const MOOD_LOOK: Record<StickerMood, { tone: string; sfx: string }> = {
  hype: { tone: "var(--sunflower)", sfx: "WOW!" },
  judging: { tone: "var(--lavender)", sfx: "HMM…" },
  shush: { tone: "var(--lime)", sfx: "SHHH!" },
  crying: { tone: "var(--lavender)", sfx: "SNIFF" },
  sobbing: { tone: "var(--lavender)", sfx: "WAAAH!" },
  fighting: { tone: "var(--tomato)", sfx: "POW!" },
  derp: { tone: "var(--lime)", sfx: "DUH?" },
  stressed: { tone: "var(--tomato)", sfx: "EEK!" },
  sus: { tone: "var(--lavender)", sfx: "SUS…" },
};

const pad = (n: number) => String(n).padStart(2, "0");

type Exchange = { question: UIMessage; reply?: UIMessage };

/** Each question with the reply that followed it (if any yet). */
function pair(messages: UIMessage[]): Exchange[] {
  const out: Exchange[] = [];
  for (const m of messages) {
    if (m.role === "user") out.push({ question: m });
    else if (m.role === "assistant" && out.length && !out[out.length - 1].reply) out[out.length - 1].reply = m;
  }
  return out;
}

function questionText(m: UIMessage): string {
  return (m.parts as ToolPart[])
    .filter((p) => p.type === "text")
    .map((p) => p.text ?? "")
    .join(" ")
    .trim();
}

/** Arcee in a panel: always one of his cats, on a halftone aura in the mood's colour, with the mood's sound effect. */
function Cat({ mood, thinking = false, size = "md", sfx = true }: { mood: StickerMood; thinking?: boolean; size?: "sm" | "md" | "lg"; sfx?: boolean }) {
  const s = STICKERS[mood];
  const look = MOOD_LOOK[mood];
  const box = size === "lg" ? "size-[clamp(104px,15vw,176px)]" : size === "sm" ? "size-[clamp(60px,6vw,80px)]" : "size-[clamp(84px,11vw,140px)]";
  return (
    <div className="comic-cast relative shrink-0" style={{ "--tone": look.tone } as CSSProperties}>
      <span className="comic-aura" aria-hidden="true" />
      <picture className={cn(box, "comic-cat relative block overflow-hidden rounded-[22%] border-[4px] border-[var(--die)]", thinking && "arcee-thinking")}>
        <source srcSet={s.still} media="(prefers-reduced-motion: reduce)" />
        <img src={s.src} alt={thinking ? "" : s.alt} width={176} height={176} className="size-full object-cover" />
      </picture>
      {sfx && !thinking && (
        <span className="comic-sfx" aria-hidden="true">
          {look.sfx}
        </span>
      )}
    </div>
  );
}

/** What Arcee says in the bubble: text with safe links, page hand-offs and message drafts. */
function ReplyBody({ m, allowed }: { m: UIMessage; allowed: Set<string> }) {
  const skip = repeatedParts(m);
  return (
    <>
      {(m.parts as ToolPart[]).map((part, i) => {
        const key = `${m.id}-${i}`;
        if (skip.has(i)) return null;
        if (part.type === "text" && part.text) {
          const text = plain(part.text.replace(STICKER_TEXT_ALL, ""));
          return text ? (
            <p key={key} className="whitespace-pre-wrap">
              <RichText text={text} allowed={allowed} />
            </p>
          ) : null;
        }
        if (part.type === "tool-navigate" && part.state === "output-available") {
          const out = part.output as { path: string; label: string };
          return (
            <span key={key} className="inline-flex items-center gap-1 self-start rounded-full bg-violet/12 px-3 py-1 text-[14px] text-accent-text">
              Opening {out.label} <ArrowUpRight className="text-[12px]" />
            </span>
          );
        }
        if (part.type === "tool-draftMessage" && part.state === "output-available") {
          // Incomplete drafts come back as { missing }: Arcee asks for those instead.
          const out = part.output as Partial<Draft> & { missing?: string[] };
          if (out.missing || !out.name || !out.contact || !out.message) return null;
          return <DraftCard key={key} draft={out as Draft} />;
        }
        return null;
      })}
    </>
  );
}

function Masthead({ issue, mood }: { issue: number; mood: StickerMood }) {
  return (
    <header className="comic-masthead relative flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
      <div className="flex items-end gap-4 sm:gap-6">
        <Cat mood={mood} size="sm" sfx={false} />
        <div>
          <p className="font-mono text-[13px] tracking-[0.14em] text-fg-muted uppercase">Vol. 1 · The site&apos;s guide</p>
          <h1 className="comic-title mt-1 text-[clamp(48px,8vw,104px)] leading-[0.88] font-black tracking-[-0.045em] uppercase [font-variation-settings:'wdth'_75]">Ask Arcee</h1>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative grid size-[92px] shrink-0 place-items-center sm:size-[118px]" aria-hidden="true">
          <Shape name="burst" className="comic-burst absolute inset-0 size-full" />
          <span className="relative max-w-[9ch] text-center text-[12px] leading-tight font-black text-[#2a2000] uppercase sm:text-[15px]">Answers in cats!</span>
        </div>
        <p className="comic-issue rounded-[8px] border-[3px] border-fg px-3 py-2 text-center font-mono text-[12px] leading-tight tracking-wider uppercase">
          Issue
          <span className="block text-[20px] font-bold tracking-tight sm:text-[26px]" aria-label={`${issue} questions asked`}>
            No. {pad(issue)}
          </span>
        </p>
      </div>
    </header>
  );
}

/** Panel 01, the cover: Arcee introduces itself; what it knows; lines to try, as speech bubbles you can tap. */
function Splash({ ask, busy }: { ask: (q: string) => void; busy: boolean }) {
  return (
    <li className="comic-panel comic-pop p-5 sm:p-8" data-side="left" aria-labelledby="comic-splash-title">
      <span className="comic-number" aria-hidden="true">
        01
      </span>
      <h2 id="comic-splash-title" className="sr-only">
        Panel 1: Arcee introduces itself
      </h2>
      <p className="comic-caption">Meet the site&apos;s guide. It answers from what&apos;s on this site, and always with a cat.</p>
      <div className="comic-stage mt-6">
        <div className="comic-stage-cat">
          <Cat mood="hype" size="lg" />
        </div>
        <div className="comic-bubble comic-reply comic-stage-reply comic-bubble-lg">
          <p className="text-[clamp(20px,2.2vw,28px)] leading-[1.15] font-semibold tracking-[-0.02em]">Hey, I&apos;m Arcee. Ask me anything about Itesh.</p>
          <p className="mt-2 text-fg-muted">His projects, where he&apos;s worked, how to reach him. I can take a message for him too.</p>
        </div>
      </div>
      <div className="mt-9 grid gap-8 md:grid-cols-[1fr_1.3fr]">
        <div>
          <h3 className="comic-label">What I know</h3>
          <ul className="mt-3 flex flex-col gap-2">
            {KNOWS.map((k) => (
              <li key={k} className="flex gap-2.5">
                <span aria-hidden="true" className="mt-[9px] size-2 shrink-0 rotate-45 bg-violet" />
                {k}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="comic-label mb-4">Your lines, if you want them</h3>
          <ul className="flex flex-wrap gap-x-3 gap-y-4" aria-label="Questions to try">
            {[...SUGGESTIONS, ...MORE].map((q) => (
              <li key={q}>
                <button type="button" disabled={busy} onClick={() => ask(q)} className="comic-line comic-focus disabled:opacity-60">
                  {q}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="comic-caption comic-caption-foot mt-9">
        <span className="font-serif text-[18px] italic">P.S.</span> Want to leave Itesh a message? Tell me what to say. I&apos;ll draft it and show you first; nothing
        is sent until you press send.
      </p>
    </li>
  );
}

function ExchangePanel({ n, ex, pending, failed, allowed }: { n: number; ex: Exchange; pending: boolean; failed: boolean; allowed: Set<string> }) {
  const q = questionText(ex.question);
  const reply = ex.reply;
  const thinking = pending && !reply;
  const streaming = pending && !!reply;
  const empty = !pending && !failed && (!reply || isEmptyReply(reply));
  const mood: StickerMood = thinking ? "judging" : failed && !reply ? "crying" : empty ? "derp" : reply ? moodFor(q, reply) : "derp";
  // Panels alternate sides, like a strip: the cat on the left, then the right.
  const side = n % 2 === 0 ? "left" : "right";
  const titleId = `comic-panel-${ex.question.id}`;
  return (
    <li className="comic-panel comic-pop scroll-mt-28 p-5 sm:p-8" data-side={side} aria-labelledby={titleId} aria-busy={pending || undefined}>
      <span className="comic-number" aria-hidden="true">
        {pad(n)}
      </span>
      <h2 id={titleId} className="sr-only">
        Panel {n}: you asked {q}
      </h2>
      <p className="comic-caption" aria-hidden="true">
        {NARRATION[(n - 2) % NARRATION.length]}
      </p>
      <div className="comic-stage mt-5">
        <div className="comic-bubble comic-ask comic-stage-ask">
          <span className="comic-speaker" aria-hidden="true">
            You
          </span>
          <p className="font-semibold">{q}</p>
        </div>
        <div className="comic-stage-cat">
          <Cat mood={mood} thinking={thinking} />
        </div>
        {thinking ? (
          <div className="comic-thought comic-stage-reply">
            <p className="font-hand text-[28px] leading-none text-fg-muted">
              thinking<span className="comic-dots" aria-hidden="true" />
            </p>
          </div>
        ) : (
          <div className="comic-bubble comic-reply comic-stage-reply flex flex-col gap-3">
            <span className="comic-speaker comic-speaker-arcee" aria-hidden="true">
              Arcee
            </span>
            {failed && !reply ? (
              <p>Arcee tripped over a cable. Try again, or email Itesh at iteshxt@gmail.com.</p>
            ) : empty ? (
              <p className="text-fg-muted">My brain blanked on that one. Ask me again?</p>
            ) : reply ? (
              <ReplyBody m={reply} allowed={allowed} />
            ) : null}
            {streaming && <span className="comic-caret" aria-hidden="true" />}
          </div>
        )}
      </div>
    </li>
  );
}

/**
 * The /arcee page (docs/design.md §2.13): the conversation told as a comic strip. A masthead
 * (the cat changes with the conversation's mood, the issue number counts your questions), a
 * cover panel where Arcee introduces itself, then one panel per question: a narration caption,
 * your line in a speech bubble from off-panel, and Arcee as a cat (always one of his stickers,
 * matched to the reply's tone) with a sound effect and the answer in a speech bubble, or a
 * thought cloud while it thinks. Panels alternate sides. The message box is the next empty
 * panel in the page's flow; after you send, the page follows the answer so your turn stays in
 * view, until you scroll up yourself. Same conversation as the pop-up (useArceeConversation).
 */
export function ArceeComic() {
  const allowed = useMemo(() => allowedUrls(), []);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const turnRef = useRef<HTMLFormElement>(null);
  const hintId = useId();
  const { messages, error, stop, busy, ask } = useArceeConversation({ active: true, inputRef });
  const exchanges = pair(messages);
  const [turnVisible, setTurnVisible] = useState(true);

  // Follow the answer: from a send until you scroll up yourself, keep the "your turn" panel's
  // bottom just above the navigator, so you can read the reply and ask the next thing.
  const following = useRef(false);
  const lastY = useRef(0);
  const raf = useRef(0);
  function keepTurnInView() {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const el = turnRef.current;
      if (!el || !following.current) return;
      const overflow = el.getBoundingClientRect().bottom - (window.innerHeight - 104);
      if (overflow > 2) scrollToY(window.scrollY + overflow);
    });
  }
  function send(text: string) {
    if (!text.trim() || busy) return;
    following.current = true;
    lastY.current = window.scrollY;
    ask(text);
  }
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      // The page only follows downwards, so any move up is the visitor taking over.
      if (following.current && y < lastY.current - 6) following.current = false;
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf.current);
    };
  }, []);
  useEffect(() => {
    // A question handed over from the nav bar arrives on load: follow that one too.
    if (busy && !following.current && messages.length <= 2) following.current = true;
    keepTurnInView();
    if (busy) return;
    // One last nudge once the answer has settled, then stand down (a new send clears these).
    const nudge = window.setTimeout(keepTurnInView, 250);
    const done = window.setTimeout(() => (following.current = false), 900);
    return () => {
      window.clearTimeout(nudge);
      window.clearTimeout(done);
    };
  }, [messages, busy, error]);

  // "Your turn" jump sticker while the empty panel is off screen (its top below the navigator counts as off).
  useEffect(() => {
    const el = turnRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => setTurnVisible(entries[entries.length - 1].isIntersecting), { rootMargin: "0px 0px -140px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
    setInput("");
  }

  function jumpToTurn() {
    if (turnRef.current) scrollToElement(turnRef.current, -120);
    inputRef.current?.focus({ preventScroll: true });
  }

  // Screen readers hear "thinking", then the whole reply once it's done (not every streamed word).
  const last = messages[messages.length - 1];
  const announcement = busy ? "Arcee is thinking…" : error ? "Arcee couldn't answer. Try again." : last?.role === "assistant" ? `Arcee: ${replyText(last)}` : "";
  const latest = [...exchanges].reverse().find((ex) => ex.reply && !isEmptyReply(ex.reply));
  const mastheadMood: StickerMood = busy ? "judging" : latest?.reply ? moodFor(questionText(latest.question), latest.reply) : "hype";
  const turnNo = exchanges.length + 2;

  return (
    <div className="mx-auto flex w-full max-w-[880px] flex-col gap-10">
      <Masthead issue={exchanges.length} mood={mastheadMood} />

      <ol className="comic-strip flex flex-col" aria-label="Your conversation with Arcee">
        <Splash ask={send} busy={busy} />
        {exchanges.map((ex, i) => {
          const isLast = i === exchanges.length - 1;
          return <ExchangePanel key={ex.question.id} n={i + 2} ex={ex} pending={isLast && busy} failed={isLast && !!error} allowed={allowed} />;
        })}
      </ol>

      <form ref={turnRef} onSubmit={onSubmit} className="comic-panel comic-turn scroll-mt-28 p-5 sm:p-8" data-side="right" aria-label="Ask Arcee">
        <span className="comic-number" aria-hidden="true">
          {pad(turnNo)}
        </span>
        <label htmlFor="comic-input" className="comic-caption block w-fit">
          <span className="mr-2 font-mono text-[12px] tracking-[0.14em] uppercase">Panel {pad(turnNo)}</span>
          <span className="font-semibold">Your line. What do you want to know?</span>
        </label>
        <div className="mt-5 flex flex-col gap-8 sm:flex-row sm:items-end sm:gap-4">
          <div className="comic-bubble comic-ask comic-ask-input flex-1">
            <span className="comic-speaker" aria-hidden="true">
              You
            </span>
            <textarea
              id="comic-input"
              ref={inputRef}
              rows={2}
              value={input}
              maxLength={500}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                  setInput("");
                }
              }}
              placeholder="Ask about his projects, his work, or leave him a message…"
              aria-describedby={hintId}
              className="comic-input block min-h-[60px] w-full resize-none bg-transparent text-[17px] leading-snug font-semibold outline-none"
            />
          </div>
          {busy ? (
            <button type="button" onClick={() => stop()} className="btn btn-paper comic-focus shrink-0">
              Stop
            </button>
          ) : (
            <button type="submit" disabled={!input.trim()} className="btn btn-violet comic-focus shrink-0 disabled:pointer-events-none disabled:opacity-40">
              Send it
            </button>
          )}
        </div>
        <p id={hintId} className="mt-7 text-[14px] text-fg-muted sm:mt-8">
          Enter sends. Shift + Enter starts a new line.
        </p>
      </form>

      {!turnVisible && exchanges.length > 0 && (
        <button
          type="button"
          onClick={jumpToTurn}
          className="comic-jump comic-focus fixed right-4 bottom-[96px] z-30 flex items-center gap-1.5 rounded-[12px] border-[3px] border-[var(--die)] bg-sunflower px-3.5 py-2 text-[15px] font-bold text-[#2a2000] shadow-[0_10px_20px_-10px_rgb(0_0_0/0.55)] sm:right-6"
        >
          Your turn <ArrowDown className="text-[13px]" />
        </button>
      )}

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </div>
  );
}
