"use client";

import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { useEffect, useRef, type RefObject } from "react";
import { useTransitionGo } from "@/components/transition/TransitionProvider";
import { arceeChat } from "@/lib/arcee/chat-client";
import { splitLinks } from "@/lib/arcee/guard";
import { STICKERS, type StickerMood } from "@/lib/arcee/stickers";
import { play } from "@/lib/sound";
import { useUI } from "@/store/ui";

/** Shared by the pop-up (ArceeChat) and the /arcee comic (ArceeComic). */

export type ToolPart = { type: string; state?: string; toolCallId?: string; output?: unknown; text?: string; data?: unknown };

export const STICKER_TEXT = /\(\s*sticker\s*[:=]\s*([a-z]+)\s*\)/i;
export const STICKER_TEXT_ALL = /\s*\(\s*sticker\s*[:=]\s*[a-z]+\s*\)/gi;

/** The model is told to write plain text; this cleans up the markdown it sometimes slips in anyway. */
export function plain(text: string): string {
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

export function RichText({ text, allowed }: { text: string; allowed: Set<string> }) {
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

/** The cat a reply came with: a sticker tool call, a streamed sticker, or one the model wrote as text. Last one wins. */
export function replyMood(m: UIMessage): StickerMood | undefined {
  let mood: StickerMood | undefined;
  for (const p of m.parts as ToolPart[]) {
    if (p.type === "tool-sticker" && p.state === "output-available") mood = (p.output as { mood: StickerMood }).mood;
    else if (p.type === "data-sticker") mood = (p.data as { mood: StickerMood }).mood;
    else if (p.type === "text" && p.text) {
      const written = p.text.match(STICKER_TEXT)?.[1]?.toLowerCase() as StickerMood | undefined;
      if (written) mood = written;
    }
  }
  return mood && mood in STICKERS ? mood : undefined;
}

/** A reply with nothing to show (the model occasionally returns nothing). */
export function isEmptyReply(m: UIMessage): boolean {
  return (
    m.role === "assistant" &&
    !(m.parts as ToolPart[]).some((p) => (p.type === "text" && p.text?.trim()) || p.type.startsWith("tool-") || p.type === "data-sticker")
  );
}

/** A reply's text, without written sticker markers or markdown. */
export function replyText(m: UIMessage): string {
  return (m.parts as ToolPart[])
    .filter((p) => p.type === "text" && p.text)
    .map((p) => plain((p.text ?? "").replace(STICKER_TEXT_ALL, "")))
    .filter(Boolean)
    .join("\n\n");
}

/**
 * The shared conversation (one chat instance for the pop-up and the page): asking,
 * the hand-over seed from the nav bar or "Ask Arcee" buttons while `active`, and
 * running navigate tool results once.
 */
export function useArceeConversation({ active, inputRef }: { active: boolean; inputRef: RefObject<HTMLTextAreaElement | null> }) {
  const go = useTransitionGo();
  const handled = useRef(new Set<string>());
  const arceeOpen = useUI((s) => s.arceeOpen);
  const chat = useChat({ chat: arceeChat });
  const { messages, sendMessage, status, clearError } = chat;
  const busy = status === "submitted" || status === "streaming";

  function ask(text: string) {
    const t = text.trim();
    if (!t || busy) return;
    clearError();
    play("key");
    void sendMessage({ text: t });
  }

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

  return { ...chat, busy, ask };
}
