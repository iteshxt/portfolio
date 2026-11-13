"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Close } from "@/components/icons";
import { useTransitionGo } from "@/components/transition/TransitionProvider";
import { allowedUrls } from "@/lib/arcee/corpus";
import { splitLinks } from "@/lib/arcee/guard";
import { STICKERS, type StickerMood } from "@/lib/arcee/stickers";
import { cn } from "@/lib/cn";
import { play } from "@/lib/sound";
import { useUI } from "@/store/ui";
import { DraftCard, type Draft } from "./DraftCard";

const SUGGESTIONS = ["What's his best project?", "What did he do at Sutr?", "How does PatentIQ work?", "I want to leave a message"];

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

/**
 * Arcee, the site's chatbot (docs/prd.md §6.4): a panel above the nav bar.
 * Replies stream from /api/arcee; tool results become actions here:
 * navigate runs the page transition, sticker shows a cat, draftMessage
 * shows a card the visitor must confirm before anything is sent.
 */
export function ArceePanel() {
  const open = useUI((s) => s.arceeOpen);
  const close = useUI((s) => s.closeArcee);
  const go = useTransitionGo();
  const allowed = useMemo(() => allowedUrls(), []);
  const [input, setInput] = useState("");
  const handled = useRef(new Set<string>());
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status, error, stop, clearError } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/arcee",
      prepareSendMessagesRequest: ({ messages: msgs }) => ({ body: { messages: msgs, shift: useUI.getState().shift } }),
    }),
    onFinish: () => play("select"),
  });

  const busy = status === "submitted" || status === "streaming";

  function ask(text: string) {
    const t = text.trim();
    if (!t || busy) return;
    clearError();
    play("key");
    void sendMessage({ text: t });
  }

  // A question typed into the nav bar opens Arcee with it.
  useEffect(() => {
    if (!open) return;
    const seed = useUI.getState().takeArceeSeed();
    if (seed) ask(seed);
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run when the panel opens
  }, [open]);

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

  return (
    <div
      role="dialog"
      aria-label="Chat with Arcee"
      aria-modal="false"
      data-open={open}
      data-lenis-prevent=""
      inert={!open}
      className={cn(
        "fixed bottom-[84px] left-1/2 z-[55] flex h-[min(68vh,600px)] w-[min(460px,calc(100vw-24px))] -translate-x-1/2 flex-col overflow-hidden rounded-[28px] border-[4px] border-white bg-surface text-fg shadow-[0_30px_80px_-30px_rgb(0_0_0/0.55)] transition-[opacity,translate] duration-300 ease-[var(--ease-expo-out)]",
        open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      {/* Arcee's own colours and its real particle-ring animation. */}
      <header className="flex items-center gap-3 bg-arcee-deep px-4 py-3 text-paper">
        <picture className="block size-11 shrink-0 overflow-hidden rounded-full border-2 border-arcee/60 bg-black">
          <source srcSet="/projects/arcee-wave-still.webp" media="(prefers-reduced-motion: reduce)" />
          <img src="/projects/arcee-wave.webp" alt="" width={44} height={44} className="size-full scale-[1.35] object-cover" />
        </picture>
        <div className="min-w-0 flex-1">
          <p className="text-[17px] leading-tight font-semibold tracking-[-0.01em] text-arcee">Arcee</p>
          <p className="truncate text-[13px] text-paper/80">The site&apos;s guide. Ask about Itesh&apos;s work.</p>
        </div>
        <button type="button" onClick={close} aria-label="Close chat" className="flex size-9 items-center justify-center rounded-full text-[18px] text-paper/80 hover:bg-white/10 hover:text-paper">
          <Close />
        </button>
      </header>

      <div ref={listRef} className="cutting-mat flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4 text-[15px] leading-snug" aria-live="polite">
        <div className="max-w-[88%] self-start rounded-[18px] rounded-bl-md border-[3px] border-white bg-surface px-4 py-2.5 shadow-[0_6px_14px_-10px_rgb(0_0_0/0.4)]">
          Hey, I&apos;m Arcee. Ask me anything about Itesh: projects, experience, or how to reach him.
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
              "max-w-[88%] rounded-[18px] px-4 py-2.5",
              m.role === "user" ? "self-end rounded-br-md border-[3px] border-white bg-violet text-white" : "self-start rounded-bl-md border-[3px] border-white bg-surface shadow-[0_6px_14px_-10px_rgb(0_0_0/0.4)]",
            )}
          >
            {m.parts.map((p, i) => renderPart(m, p as ToolPart & { text?: string; data?: unknown }, i))}
          </div>
        ))}
        {status === "submitted" && (
          <div className="self-start rounded-[18px] rounded-bl-md bg-bg px-4 py-3" aria-label="Arcee is typing">
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
            } else if (e.key === "Escape") {
              close();
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
    </div>
  );
}
