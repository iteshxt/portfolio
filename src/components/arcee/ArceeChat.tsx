"use client";

import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight } from "@/components/icons";
import { useTransitionGo } from "@/components/transition/TransitionProvider";
import { arceeChat } from "@/lib/arcee/chat-client";
import { allowedUrls } from "@/lib/arcee/corpus";
import { splitLinks } from "@/lib/arcee/guard";
import { STICKERS, type StickerMood } from "@/lib/arcee/stickers";
import { cn } from "@/lib/cn";
import { play } from "@/lib/sound";
import { useUI } from "@/store/ui";
import { DraftCard, type Draft } from "./DraftCard";

export const SUGGESTIONS = ["What's his best project?", "What did he do at Sutr?", "How does PatentIQ work?", "I want to leave a message"];

function Sticker({ mood }: { mood: StickerMood }) {
  const s = STICKERS[mood];
  if (!s) return null;
  // eslint-disable-next-line @next/next/no-img-element -- tiny local SVG stickers; next/image adds nothing here
  return <img src={s.src} alt={s.alt} width={96} height={96} className="sticker-pop mt-2 size-24 -rotate-6" />;
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

type ToolPart = { type: string; state?: string; toolCallId?: string; output?: unknown };

/** Arcee's ring as a little postage stamp. */
export function ArceeStamp({ className }: { className?: string }) {
  return (
    <picture className={cn("arcee-stamp block shrink-0 overflow-hidden bg-arcee-deep", className)}>
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
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
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

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, status]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    ask(input);
    setInput("");
  }

  function renderPart(m: UIMessage, part: ToolPart & { text?: string; data?: unknown }, i: number) {
    const key = `${m.id}-${i}`;
    if (part.type === "text" && part.text) {
      return (
        <p key={key} className="whitespace-pre-wrap">
          {m.role === "assistant" ? <RichText text={part.text} allowed={allowed} /> : part.text}
        </p>
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
      return <DraftCard key={key} draft={part.output as Draft} />;
    }
    return null;
  }

  const page = variant === "page";
  return (
    <>
      <div
        ref={listRef}
        data-lenis-prevent=""
        className={cn("cutting-mat flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4 leading-snug", page ? "px-6 py-6 text-[16px]" : "text-[15px]")}
        aria-live="polite"
      >
        {/* Arcee's greeting arrives as a postcard. */}
        <div className="postcard max-w-[92%] self-start">
          <div className="flex items-start gap-3">
            <p className="flex-1">Hey, I&apos;m Arcee. Ask me anything about Itesh: projects, experience, or how to reach him.</p>
            <ArceeStamp className={page ? "size-14" : "size-11"} />
          </div>
          <p className="mt-3 border-t border-dashed border-line pt-2 font-serif text-[15px] text-fg-muted italic">From Arcee, the site&apos;s guide</p>
        </div>
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} type="button" onClick={() => ask(s)} className="filter-chip text-[13px]">
                {s}
              </button>
            ))}
          </div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "max-w-[88%] rounded-[18px] border-[3px] border-white px-4 py-2.5",
              m.role === "user" ? "self-end rounded-br-md bg-violet text-white" : "self-start rounded-bl-md bg-surface shadow-[0_6px_14px_-10px_rgb(0_0_0/0.4)]",
            )}
          >
            {m.parts.map((p, i) => renderPart(m, p as ToolPart & { text?: string; data?: unknown }, i))}
          </div>
        ))}
        {status === "submitted" && (
          <div className="self-start rounded-[18px] rounded-bl-md border-[3px] border-white bg-surface px-4 py-3" aria-label="Arcee is typing">
            <span className="typing-dots flex gap-1">
              <span />
              <span />
              <span />
            </span>
          </div>
        )}
        {error && (
          <div className="self-start rounded-[18px] bg-tomato/15 px-4 py-2.5 text-[14px]">
            Arcee tripped over a cable. Try again, or email Itesh at iteshxt@gmail.com.
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="flex items-end gap-2 border-t border-line bg-surface p-3">
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
    </>
  );
}
