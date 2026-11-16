"use client";

import type { UIMessage } from "ai";
import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react";
import { ArrowDown, ArrowUpRight } from "@/components/icons";
import { Shape } from "@/components/ui/Shape";
import { allowedUrls } from "@/lib/arcee/corpus";
import { STICKERS, type StickerMood } from "@/lib/arcee/stickers";
import { cn } from "@/lib/cn";
import { scrollToElement } from "@/lib/motion";
import { ArceeStamp, CHIP_TONES, SUGGESTIONS } from "./ArceeChat";
import { DraftCard, type Draft } from "./DraftCard";
import { isEmptyReply, replyMood, replyText, RichText, STICKER_TEXT_ALL, plain, useArceeConversation, type ToolPart } from "./reply";

const MORE = ["What's DiaLabs?", "Which project uses WebGPU?"];
const KNOWS = ["The three star projects and how they work", "Everything else he has shipped", "Where he has worked and what he did", "DiaLabs and its releases", "How to reach him, or take a message"];

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

/** The character in a panel: the cat for the reply's mood, or Arcee's ring when there's no cat. */
function Character({ mood, thinking = false, size = "md" }: { mood?: StickerMood; thinking?: boolean; size?: "md" | "lg" }) {
  const box = size === "lg" ? "size-[clamp(96px,14vw,168px)]" : "size-[clamp(72px,10vw,132px)]";
  if (!mood) return <ArceeStamp className={cn(box, "comic-character rounded-[22%] border-[4px] border-[var(--die)]")} />;
  const s = STICKERS[mood];
  return (
    <picture className={cn(box, "comic-character block overflow-hidden rounded-[22%] border-[4px] border-[var(--die)]", thinking && "arcee-thinking")}>
      <source srcSet={s.still} media="(prefers-reduced-motion: reduce)" />
      <img src={s.src} alt={thinking ? "" : s.alt} width={168} height={168} className="size-full object-cover" />
    </picture>
  );
}

/** What Arcee says in the bubble: text with safe links, page hand-offs and message drafts. Cats are the character, not inline. */
function ReplyBody({ m, allowed }: { m: UIMessage; allowed: Set<string> }) {
  return (
    <>
      {(m.parts as ToolPart[]).map((part, i) => {
        const key = `${m.id}-${i}`;
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

function Chips({ list, ask, disabled }: { list: string[]; ask: (q: string) => void; disabled: boolean }) {
  return (
    <ul className="flex flex-wrap gap-2.5" aria-label="Questions to try">
      {list.map((q, i) => (
        <li key={q}>
          <button
            type="button"
            disabled={disabled}
            onClick={() => ask(q)}
            style={{ rotate: `${[-1.5, 1, -0.5, 1.5, -1, 0.5][i % 6]}deg` }}
            className={cn("arcee-chip comic-focus rounded-[12px] border-[3px] border-[var(--die)] px-3.5 py-2 text-left text-[15px] font-semibold shadow-[0_6px_14px_-8px_rgb(0_0_0/0.4)] disabled:opacity-60", CHIP_TONES[i % CHIP_TONES.length])}
          >
            {q}
          </button>
        </li>
      ))}
    </ul>
  );
}

function Masthead({ issue }: { issue: number }) {
  return (
    <header className="comic-masthead relative flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
      <div className="flex items-end gap-4 sm:gap-5">
        <ArceeStamp className="size-[clamp(56px,6vw,76px)] rounded-[22%] border-[4px] border-[var(--die)] shadow-[0_10px_20px_-12px_rgb(0_0_0/0.6)]" />
        <div>
          <p className="font-mono text-[13px] tracking-[0.14em] text-fg-muted uppercase">The site&apos;s guide · a comic in progress</p>
          <h1 className="comic-title mt-1 text-[clamp(48px,8vw,104px)] leading-[0.88] font-black tracking-[-0.045em] uppercase [font-variation-settings:'wdth'_75]">Ask Arcee</h1>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative grid size-[118px] shrink-0 place-items-center" aria-hidden="true">
          <Shape name="burst" className="comic-burst absolute inset-0 size-full" />
          <span className="relative max-w-[9ch] text-center text-[15px] leading-tight font-black text-[#2a2000] uppercase">Answers in cats!</span>
        </div>
        <p className="comic-issue rounded-[8px] border-[3px] border-fg px-3 py-2 text-center font-mono text-[12px] leading-tight tracking-wider uppercase">
          Issue
          <span className="block text-[26px] font-bold tracking-tight" aria-label={`${issue} questions asked`}>
            No. {pad(issue)}
          </span>
        </p>
      </div>
    </header>
  );
}

/** Panel 01: Arcee introduces itself, what it knows, what to ask. */
function Splash({ ask, busy }: { ask: (q: string) => void; busy: boolean }) {
  return (
    <li className="comic-panel comic-pop p-5 sm:p-8" aria-labelledby="comic-splash-title">
      <span className="comic-number" aria-hidden="true">
        01
      </span>
      <h2 id="comic-splash-title" className="sr-only">
        Panel 1: Arcee introduces itself
      </h2>
      <p className="comic-caption">Meet the site&apos;s guide. It answers from what&apos;s on this site, usually with a cat.</p>
      <div className="mt-5 flex flex-col items-start gap-4 sm:mt-6 sm:grid sm:grid-cols-[auto_1fr] sm:items-end sm:gap-6">
        <Character mood="hype" size="lg" />
        <div className="comic-bubble comic-bubble-lg">
          <p className="text-[clamp(20px,2.2vw,28px)] leading-[1.15] font-semibold tracking-[-0.02em]">Hey, I&apos;m Arcee. Ask me anything about Itesh.</p>
          <p className="mt-2 text-fg-muted">His projects, where he&apos;s worked, how to reach him. I can take a message for him too.</p>
        </div>
      </div>
      <div className="mt-8 grid gap-7 md:grid-cols-[1fr_1.25fr]">
        <div>
          <h3 className="font-mono text-[13px] tracking-[0.14em] text-fg-muted uppercase">What I know</h3>
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
          <h3 className="mb-3 font-mono text-[13px] tracking-[0.14em] text-fg-muted uppercase">Try asking</h3>
          <Chips list={[...SUGGESTIONS, ...MORE]} ask={ask} disabled={busy} />
        </div>
      </div>
      <p className="comic-footnote mt-8">
        <span className="font-serif text-[18px] italic">P.S.</span> Want to leave Itesh a message? Tell me what to say. I&apos;ll draft it and show you first;
        nothing is sent until you press send.
      </p>
    </li>
  );
}

function ExchangePanel({
  n,
  ex,
  pending,
  failed,
  allowed,
  panelRef,
}: {
  n: number;
  ex: Exchange;
  pending: boolean;
  failed: boolean;
  allowed: Set<string>;
  panelRef: (el: HTMLLIElement | null) => void;
}) {
  const q = questionText(ex.question);
  const reply = ex.reply;
  const streaming = pending && !!reply;
  const thinking = pending && !reply;
  const empty = !pending && (!reply || isEmptyReply(reply));
  const mood = thinking ? "judging" : failed ? "crying" : reply ? replyMood(reply) : undefined;
  const titleId = `comic-panel-${ex.question.id}`;
  return (
    <li ref={panelRef} className="comic-panel comic-pop scroll-mt-28 p-5 sm:p-8" aria-labelledby={titleId} aria-busy={pending || undefined}>
      <span className="comic-number" aria-hidden="true">
        {pad(n)}
      </span>
      <h2 id={titleId} className="sr-only">
        Panel {n}: you asked {q}
      </h2>
      <p className="comic-caption">
        <span className="mr-2 font-mono text-[12px] tracking-[0.14em] uppercase">You asked</span>
        <span className="font-semibold">{q}</span>
      </p>
      <div className="mt-5 flex flex-col items-start gap-4 sm:mt-6 sm:grid sm:grid-cols-[auto_1fr] sm:items-end sm:gap-6">
        <Character mood={mood} thinking={thinking} />
        <div className="comic-bubble flex flex-col gap-3">
          {thinking ? (
            <p className="font-hand text-[26px] leading-none text-fg-muted">
              thinking<span className="comic-dots" aria-hidden="true" />
            </p>
          ) : failed && !reply ? (
            <p>Arcee tripped over a cable. Try again, or email Itesh at iteshxt@gmail.com.</p>
          ) : empty ? (
            <p className="text-fg-muted">My brain blanked on that one. Ask me again?</p>
          ) : reply ? (
            <ReplyBody m={reply} allowed={allowed} />
          ) : null}
          {streaming && <span className="comic-caret" aria-hidden="true" />}
        </div>
      </div>
    </li>
  );
}

/**
 * The /arcee page (docs/design.md §2.13): the conversation told as a comic strip. A
 * masthead with an issue number that counts your questions, a splash panel where Arcee
 * introduces itself, then one panel per question (your question as the caption, Arcee
 * as the character: the cat for that reply's mood, with the answer in a speech bubble).
 * The message box is the next empty panel, in the page's flow, so nothing sits on top of
 * the conversation; sending brings the new panel's top into view and never yanks you down
 * while the answer streams. The same conversation as the pop-up (useArceeConversation).
 */
export function ArceeComic() {
  const allowed = useMemo(() => allowedUrls(), []);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const turnRef = useRef<HTMLFormElement>(null);
  const panels = useRef(new Map<string, HTMLLIElement>());
  const hintId = useId();
  const { messages, error, stop, busy, ask } = useArceeConversation({ active: true, inputRef });
  const exchanges = pair(messages);
  const [turnVisible, setTurnVisible] = useState(true);

  // A new question: bring its panel's top into view (only if it isn't already), once.
  const lastQuestion = exchanges[exchanges.length - 1]?.question.id;
  const shown = useRef(lastQuestion);
  useEffect(() => {
    if (!lastQuestion || lastQuestion === shown.current) return;
    shown.current = lastQuestion;
    const raf = requestAnimationFrame(() => {
      const el = panels.current.get(lastQuestion);
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.top < 80 || r.top > window.innerHeight * 0.55) scrollToElement(el, -104);
    });
    return () => cancelAnimationFrame(raf);
  }, [lastQuestion]);

  // "Your turn" jump sticker while the empty panel is off screen (its top below the navigator counts as off).
  useEffect(() => {
    const el = turnRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setTurnVisible(e.isIntersecting), { rootMargin: "0px 0px -140px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    ask(input);
    setInput("");
  }

  function jumpToTurn() {
    if (turnRef.current) scrollToElement(turnRef.current, -120);
    inputRef.current?.focus({ preventScroll: true });
  }

  // Screen readers hear "thinking", then the whole reply once it's done (not every streamed word).
  const last = messages[messages.length - 1];
  const announcement = busy ? "Arcee is thinking…" : error ? "Arcee couldn't answer. Try again." : last?.role === "assistant" ? `Arcee: ${replyText(last)}` : "";
  const turnNo = exchanges.length + 2;

  return (
    <div className="mx-auto flex w-full max-w-[860px] flex-col gap-10">
      <Masthead issue={exchanges.length} />

      <ol className="flex flex-col gap-8" aria-label="Your conversation with Arcee">
        <Splash ask={ask} busy={busy} />
        {exchanges.map((ex, i) => {
          const isLast = i === exchanges.length - 1;
          return (
            <ExchangePanel
              key={ex.question.id}
              n={i + 2}
              ex={ex}
              pending={isLast && busy}
              failed={isLast && !!error}
              allowed={allowed}
              panelRef={(el) => {
                if (el) panels.current.set(ex.question.id, el);
                else panels.current.delete(ex.question.id);
              }}
            />
          );
        })}
      </ol>

      <form ref={turnRef} onSubmit={onSubmit} className="comic-panel comic-turn scroll-mt-28 p-5 sm:p-8" aria-label="Ask Arcee">
        <span className="comic-number" aria-hidden="true">
          {pad(turnNo)}
        </span>
        <label htmlFor="comic-input" className="comic-caption comic-caption-turn block">
          <span className="mr-2 font-mono text-[12px] tracking-[0.14em] uppercase">Panel {pad(turnNo)}</span>
          <span className="font-semibold">Your turn. What do you want to know?</span>
        </label>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
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
                ask(input);
                setInput("");
              }
            }}
            placeholder="Ask about his projects, his work, or leave him a message…"
            aria-describedby={hintId}
            className="comic-input comic-focus min-h-[64px] flex-1 resize-none px-4 py-3 text-[17px] leading-snug outline-none placeholder:text-fg-muted"
          />
          {busy ? (
            <button type="button" onClick={() => stop()} className="btn btn-paper comic-focus shrink-0">
              Stop
            </button>
          ) : (
            <button type="submit" disabled={!input.trim()} className="btn btn-violet comic-focus shrink-0 disabled:pointer-events-none disabled:opacity-40">
              Send
            </button>
          )}
        </div>
        <p id={hintId} className="mt-3 text-[14px] text-fg-muted">
          Enter sends. Shift + Enter starts a new line.
        </p>
      </form>

      {!turnVisible && exchanges.length > 0 && (
        <button type="button" onClick={jumpToTurn} className="comic-jump comic-focus fixed right-4 bottom-[96px] sm:right-6 z-30 flex items-center gap-1.5 rounded-[12px] border-[3px] border-[var(--die)] bg-sunflower px-3.5 py-2 text-[15px] font-bold text-[#2a2000] shadow-[0_10px_20px_-10px_rgb(0_0_0/0.55)]">
          Your turn <ArrowDown className="text-[13px]" />
        </button>
      )}

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </div>
  );
}
