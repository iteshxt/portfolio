"use client";

import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { useTransitionGo } from "@/components/transition/TransitionProvider";
import { arceeChat } from "@/lib/arcee/chat-client";
import { allowedUrls } from "@/lib/arcee/corpus";
import { splitLinks } from "@/lib/arcee/guard";
import { STICKERS, type StickerMood } from "@/lib/arcee/stickers";
import { cn } from "@/lib/cn";
import { scrollToBottom } from "@/lib/motion";
import { play } from "@/lib/sound";
import { useUI } from "@/store/ui";
import { DraftCard, type Draft } from "./DraftCard";

export const SUGGESTIONS = ["What's his best project?", "What did he do at Sutr?", "How does PatentIQ work?", "I want to leave a message"];

function Sticker({ mood }: { mood: StickerMood }) {
  const s = STICKERS[mood];
  if (!s) return null;
  return (
    <picture className="sticker-pop float-right -mt-1 mb-1 ml-2 block size-20 rotate-6 overflow-hidden rounded-[14px] border-[3px] border-[var(--die)] shadow-[0_8px_14px_-8px_rgb(0_0_0/0.5)]">
      <source srcSet={s.still} media="(prefers-reduced-motion: reduce)" />
      <img src={s.src} alt={s.alt} width={80} height={80} className="size-full object-cover" />
    </picture>
  );
}

const STICKER_TEXT = /\(\s*sticker\s*[:=]\s*([a-z]+)\s*\)/i;
const STICKER_TEXT_ALL = /\s*\(\s*sticker\s*[:=]\s*[a-z]+\s*\)/gi;

/** The model is told to write plain text; this cleans up the markdown it sometimes slips in anyway. */
function plain(text: string): string {
  // gpt-oss's built-in refusal is flat and out of character; say it Arcee's way.
  if (/^\s*I[’']m sorry,?( but)? I can[’']t (help|assist) with that\.?\s*$/i.test(text)) {
    return "That one's off my map. Ask me about his projects, where he's worked or how to reach him.";
  }
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/^\s*-{3,}\s*$/gm, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function RichText({ text, allowed }: { text: string; allowed: Set<string> }) {
  return (
    <>
      {splitLinks(text, allowed).map((part, i) =>
        part.href ? (
          <a key={i} href={part.href} target="_blank" rel="noreferrer" className="underline decoration-violet underline-offset-2">
            {part.text}
          </a>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </>
  );
}

const MORE_SUGGESTIONS = ["What's DiaLabs?", "Which project uses WebGPU?"];
const KNOWS = ["The three star projects and how they work", "Everything else he has shipped", "Where he has worked and what he did", "DiaLabs and its releases", "How to reach him, or take a message"];

const CHIP_TONES = ["bg-lime text-[#2B3600]", "bg-lavender text-violet-ink", "bg-sunflower text-[#4A3A00]", "bg-surface text-fg"];

/** The pop-up's opening: a short greeting and questions to try, as stickers. */
function PanelWelcome({ ask }: { ask: (q: string) => void }) {
  return (
    <div className="flex flex-col gap-3 pt-1 pb-2">
      <p className="font-serif text-[18px] text-fg-muted italic">Hey, I&rsquo;m Arcee.</p>
      <p className="max-w-[16ch] text-[30px] leading-[1.02] font-semibold tracking-[-0.045em] [font-variation-settings:'wdth'_80]">Ask me anything about Itesh.</p>
      <p className="max-w-[34ch] text-[14px] text-fg-muted">His projects, where he&rsquo;s worked, how to reach him. I can take a message for him too.</p>
      <div className="mt-1 flex flex-wrap gap-2">
        {SUGGESTIONS.map((q, i) => (
          <button
            key={q}
            type="button"
            onClick={() => ask(q)}
            style={{ rotate: `${[-1.5, 1, -0.5, 1.5][i % 4]}deg` }}
            className={cn("arcee-chip rounded-[12px] border-[3px] border-[var(--die)] px-3 py-1.5 text-left text-[13px] font-semibold shadow-[0_6px_14px_-8px_rgb(0_0_0/0.4)]", CHIP_TONES[i % CHIP_TONES.length])}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Arcee's opening message, a postcard. On the full page it also lists what Arcee knows and what to try. */
function Welcome({ page, ask }: { page: boolean; ask: (q: string) => void }) {
  const chips = (list: string[]): ReactNode => (
    <div className="flex flex-wrap gap-2">
      {list.map((s) => (
        <button key={s} type="button" onClick={() => ask(s)} className="filter-chip text-[13px]">
          {s}
        </button>
      ))}
    </div>
  );
  return (
    <div className={cn("postcard self-start", page ? "w-full p-6" : "max-w-[92%]")}>
      <div className="flex items-start gap-4">
        <p className={cn("flex-1", page && "text-[clamp(18px,1.6vw,22px)] leading-snug")}>
          Hey, I&apos;m Arcee. Ask me anything about Itesh: projects, experience, or how to reach him.
        </p>
        <ArceeStamp className={page ? "size-16" : "size-11"} />
      </div>
      {page && (
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="font-mono text-[12px] tracking-wide text-fg-muted uppercase">What I know</p>
            <ul className="mt-2 flex flex-col gap-1.5 text-[15px]">
              {KNOWS.map((k) => (
                <li key={k} className="flex gap-2">
                  <span aria-hidden="true" className="mt-[7px] size-1.5 shrink-0 rounded-full bg-violet" />
                  {k}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 font-mono text-[12px] tracking-wide text-fg-muted uppercase">Try asking</p>
            {chips([...SUGGESTIONS, ...MORE_SUGGESTIONS])}
          </div>
        </div>
      )}
      <p className="mt-5 border-t border-dashed border-line pt-3 text-[14px] text-fg-muted">
        <span className="font-serif text-[16px] text-fg italic">P.S.</span> Want to leave Itesh a message? Tell me what to say. I&apos;ll draft it and show
        you first; nothing is sent until you press send.
      </p>
      {!page && <div className="mt-4">{chips(SUGGESTIONS)}</div>}
    </div>
  );
}

type ToolPart = { type: string; state?: string; toolCallId?: string; output?: unknown };

/** Arcee's animated ring as an icon or a little postage stamp. */
export function ArceeStamp({ className }: { className?: string }) {
  return (
    <picture className={cn("arcee-stamp block shrink-0 overflow-hidden bg-ink", className)}>
      <source srcSet="/projects/arcee-wave-still.webp" media="(prefers-reduced-motion: reduce)" />
      <img src="/projects/arcee-wave.webp" alt="" width={64} height={64} className="size-full scale-[1.35] object-cover" />
    </picture>
  );
}

/**
 * The conversation with Arcee (docs/prd.md §6.4), shared by the floating panel
 * and the /arcee page (`variant`). Replies stream from /api/arcee; tool results
 * become actions: navigate runs the page transition, sticker shows a cat,
 * draftMessage shows a card the visitor must confirm before anything is sent.
 * While `active`, a question handed over from elsewhere (nav bar, buttons) is asked.
 */
export function ArceeChat({ variant, active, ask: askRef }: { variant: "panel" | "page"; active: boolean; ask?: (fn: (q: string) => void) => void }) {
  const go = useTransitionGo();
  const allowed = useMemo(() => allowedUrls(), []);
  const [input, setInput] = useState("");
  const handled = useRef(new Set<string>());
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const arceeOpen = useUI((s) => s.arceeOpen);

  const { messages, sendMessage, status, error, stop, clearError } = useChat({ chat: arceeChat });
  const busy = status === "submitted" || status === "streaming";

  function ask(text: string) {
    const t = text.trim();
    if (!t || busy) return;
    clearError();
    play("key");
    void sendMessage({ text: t });
  }
  askRef?.(ask);

  // A question handed over (nav bar, "Ask Arcee" buttons) is asked once this view is active.
  useEffect(() => {
    if (!active) return;
    const seed = useUI.getState().takeArceeSeed();
    if (seed) ask(seed);
    const raf = requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run when the view becomes active or a new hand-over arrives
  }, [active, arceeOpen]);

  // Act on navigate tool results once.
  useEffect(() => {
    for (const m of messages) {
      for (const part of m.parts as ToolPart[]) {
        if (part.type !== "tool-navigate" || part.state !== "output-available" || !part.toolCallId) continue;
        if (handled.current.has(part.toolCallId)) continue;
        handled.current.add(part.toolCallId);
        const out = part.output as { path: string; label: string };
        window.setTimeout(() => go(out.path, { label: out.label }), 500);
      }
    }
  }, [messages, go]);

  // Follow new messages: inside the panel's list, or down the page on /arcee (not on first load).
  const seen = useRef(messages.length);
  useEffect(() => {
    if (variant === "page") {
      if (messages.length !== seen.current || status === "submitted") scrollToBottom();
      seen.current = messages.length;
      return;
    }
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, status, variant]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    ask(input);
    setInput("");
  }

  function renderPart(m: UIMessage, part: ToolPart & { text?: string; data?: unknown }, i: number) {
    const key = `${m.id}-${i}`;
    if (part.type === "text" && part.text) {
      if (m.role !== "assistant") {
        return (
          <p key={key} className="whitespace-pre-wrap">
            {part.text}
          </p>
        );
      }
      // The model sometimes writes "(sticker:shush)" instead of calling the tool: show the real sticker.
      const written = part.text.match(STICKER_TEXT);
      const mood = written?.[1]?.toLowerCase() as StickerMood | undefined;
      const text = plain(part.text.replace(STICKER_TEXT_ALL, ""));
      return (
        <div key={key}>
          {mood && mood in STICKERS && <Sticker mood={mood} />}
          {text && (
            <p className="whitespace-pre-wrap">
              <RichText text={text} allowed={allowed} />
            </p>
          )}
        </div>
      );
    }
    if (part.type === "tool-sticker" && part.state === "output-available") {
      return <Sticker key={key} mood={(part.output as { mood: StickerMood }).mood} />;
    }
    if (part.type === "data-sticker") {
      return <Sticker key={key} mood={(part.data as { mood: StickerMood }).mood} />;
    }
    if (part.type === "tool-navigate" && part.state === "output-available") {
      const out = part.output as { path: string; label: string };
      return (
        <span key={key} className="mt-2 inline-flex items-center gap-1 rounded-full bg-violet/12 px-3 py-1 text-[13px] text-accent-text">
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
  }

  const page = variant === "page";
  return (
    <>
      <div
        ref={listRef}
        data-lenis-prevent={page ? undefined : ""}
        className={cn("flex flex-col gap-3 leading-snug", page ? "pb-6 text-[16px]" : "cutting-mat flex-1 overflow-y-auto px-4 py-4 text-[15px]")}
        aria-live="polite"
      >
        {page ? <Welcome page ask={ask} /> : <PanelWelcome ask={ask} />}
        {messages.map((m, idx) => {
          // The model occasionally returns nothing; say so instead of showing an empty bubble.
          const empty =
            m.role === "assistant" &&
            !(m.parts as ToolPart[]).some((p) => (p.type === "text" && (p as { text?: string }).text?.trim()) || p.type.startsWith("tool-") || p.type === "data-sticker");
          if (empty && (busy && idx === messages.length - 1)) return null;
          return (
            <div
              key={m.id}
              className={cn(
                "max-w-[88%] rounded-[18px] border-[3px] border-white px-4 py-2.5",
                m.role === "user" ? "self-end rounded-br-md bg-violet text-white" : "self-start rounded-bl-md bg-surface shadow-[0_6px_14px_-10px_rgb(0_0_0/0.4)]",
              )}
            >
              {empty ? <p className="text-fg-muted">My brain blanked on that one. Ask me again?</p> : m.parts.map((p, i) => renderPart(m, p as ToolPart & { text?: string; data?: unknown }, i))}
            </div>
          );
        })}
        {!busy && !error && messages.length > 0 && messages[messages.length - 1].role === "user" && (
          <div className="self-start rounded-[18px] rounded-bl-md border-[3px] border-white bg-surface px-4 py-2.5 text-fg-muted shadow-[0_6px_14px_-10px_rgb(0_0_0/0.4)]">
            My brain blanked on that one. Ask me again?
          </div>
        )}
        {status === "submitted" && (
          <div className="flex items-center gap-2 self-start" aria-label="Arcee is thinking">
            <picture className="arcee-thinking block size-14 overflow-hidden rounded-[12px] border-[3px] border-[var(--die)] shadow-[0_6px_12px_-8px_rgb(0_0_0/0.5)]">
              <source srcSet={STICKERS.judging.still} media="(prefers-reduced-motion: reduce)" />
              <img src={STICKERS.judging.src} alt="" width={56} height={56} className="size-full object-cover" />
            </picture>
            <span className="font-hand text-[22px] text-fg-muted">thinking…</span>
          </div>
        )}
        {error && (
          <div className="self-start rounded-[18px] bg-tomato/15 px-4 py-2.5 text-[14px]">
            Arcee tripped over a cable. Try again, or email Itesh at iteshxt@gmail.com.
          </div>
        )}
      </div>

      {!page && (
        <form onSubmit={onSubmit} className="border-t-2 border-dashed border-line bg-surface p-3">
          <div className="flex items-end gap-2 rounded-[26px] border-[3px] border-[var(--die)] bg-fg py-1.5 pr-1.5 pl-4 text-bg shadow-[0_12px_24px_-14px_rgb(0_0_0/0.6)]">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              maxLength={500}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  ask(input);
                  setInput("");
                } else if (e.key === "Escape") {
                  useUI.getState().closeArcee();
                }
              }}
              placeholder="Ask about Itesh…"
              aria-label="Message Arcee"
              className="max-h-28 min-h-10 flex-1 resize-none bg-transparent py-2 text-[15px] outline-none placeholder:text-bg/60"
            />
            {busy ? (
              <button type="button" onClick={() => stop()} aria-label="Stop" className="grid size-10 shrink-0 place-items-center rounded-full bg-surface text-fg">
                <span className="size-3 rounded-[3px] bg-current" />
              </button>
            ) : (
              <button type="submit" disabled={!input.trim()} aria-label="Send" className="grid size-10 shrink-0 place-items-center rounded-full bg-lime text-[18px] text-[#2B3600] transition-transform duration-200 hover:scale-105 disabled:opacity-40">
                <ArrowRight />
              </button>
            )}
          </div>
        </form>
      )}

      {page && (
      <form
        onSubmit={onSubmit}
        className="sticky bottom-[88px] z-30 flex items-end gap-2 rounded-[26px] border-[4px] border-white bg-surface p-2.5 shadow-[0_18px_40px_-20px_rgb(0_0_0/0.5)]"
      >
        <textarea
          ref={inputRef}
          rows={1}
          value={input}
          maxLength={500}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              ask(input);
              setInput("");
            } else if (e.key === "Escape" && !page) {
              useUI.getState().closeArcee();
            }
          }}
          placeholder="Ask about Itesh…"
          aria-label="Message Arcee"
          className="max-h-28 min-h-11 flex-1 resize-none rounded-[20px] border-[3px] border-white bg-bg px-4 py-2 text-[15px] shadow-[inset_0_0_0_1.5px_var(--line)] outline-none placeholder:text-fg-muted"
        />
        {busy ? (
          <button type="button" onClick={() => stop()} className="btn btn-paper">
            Stop
          </button>
        ) : (
          <button type="submit" disabled={!input.trim()} className="btn btn-violet disabled:pointer-events-none disabled:opacity-40">
            Send
          </button>
        )}
      </form>
      )}
    </>
  );
}
