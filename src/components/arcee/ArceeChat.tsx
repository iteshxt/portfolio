"use client";

import type { UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { allowedUrls } from "@/lib/arcee/corpus";
import { STICKERS, type StickerMood } from "@/lib/arcee/stickers";
import { cn } from "@/lib/cn";
import { useUI } from "@/store/ui";
import { DraftCard, type Draft } from "./DraftCard";
import { isEmptyReply, plain, repeatedParts, RichText, STICKER_TEXT, STICKER_TEXT_ALL, useArceeConversation, type ToolPart } from "./reply";

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

export const CHIP_TONES = ["bg-lime text-[#2B3600]", "bg-lavender text-violet-ink", "bg-sunflower text-[#4A3A00]", "bg-surface text-fg"];

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
 * The pop-up conversation with Arcee (docs/prd.md §6.4). The /arcee page tells the same
 * conversation as a comic (ArceeComic); both share `useArceeConversation`. Replies stream
 * from /api/arcee; tool results become actions: navigate runs the page transition, sticker
 * shows a cat, draftMessage shows a card the visitor must confirm before anything is sent.
 * While `active`, a question handed over from elsewhere (nav bar, buttons) is asked.
 */
export function ArceeChat({ active }: { active: boolean }) {
  const allowed = useMemo(() => allowedUrls(), []);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { messages, status, error, stop, busy, ask } = useArceeConversation({ active, inputRef });

  // Follow new messages inside the panel's list.
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, status]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    ask(input);
    setInput("");
  }

  function renderPart(m: UIMessage, part: ToolPart, i: number, skip: Set<number>) {
    const key = `${m.id}-${i}`;
    if (part.type === "text" && part.text) {
      if (skip.has(i)) return null;
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

  return (
    <>
      <div
        ref={listRef}
        data-lenis-prevent=""
        className="cutting-mat flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4 text-[15px] leading-snug"
        aria-live="polite"
      >
        <PanelWelcome ask={ask} />
        {messages.map((m, idx) => {
          // The model occasionally returns nothing; say so instead of showing an empty bubble.
          const empty = isEmptyReply(m);
          const skip = m.role === "assistant" ? repeatedParts(m) : new Set<number>();
          if (empty && (busy && idx === messages.length - 1)) return null;
          return (
            <div
              key={m.id}
              className={cn(
                "max-w-[88%] rounded-[18px] border-[3px] border-white px-4 py-2.5",
                m.role === "user" ? "self-end rounded-br-md bg-violet text-white" : "self-start rounded-bl-md bg-surface shadow-[0_6px_14px_-10px_rgb(0_0_0/0.4)]",
              )}
            >
              {empty ? <p className="text-fg-muted">My brain blanked on that one. Ask me again?</p> : m.parts.map((p, i) => renderPart(m, p as ToolPart, i, skip))}
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
            Arcee tripped over a cable. Try again, or email Itesh at mail.iteshxt@gmail.com.
          </div>
        )}
      </div>

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
    </>
  );
}
