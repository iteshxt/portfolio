"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Close } from "@/components/icons";
import { useTransitionGo } from "@/components/transition/TransitionProvider";
import { cn } from "@/lib/cn";
import { foundEgg } from "@/lib/eggs";
import { play } from "@/lib/sound";
import { complete, runCommand, type TermAction, type TermLine } from "@/lib/terminal";
import { useUI } from "@/store/ui";

const WELCOME: TermLine[] = [
  { text: "itesh.sh v4 (night-shift edition)", tone: "accent" },
  { text: "type `help` to look around. esc to leave.", tone: "muted" },
];

const TONE: Record<NonNullable<TermLine["tone"]>, string> = {
  accent: "text-[#CBB8FF]",
  success: "text-[#CCFF33]",
  error: "text-[#FF8F73]",
  muted: "text-[#8E88A3]",
};

type Entry = TermLine & { prompt?: boolean };

/**
 * The hidden terminal (docs/prd.md §6.5): opens with ` or ~ (or "terminal"
 * in the nav bar). Commands live in lib/terminal.ts; this is the UI.
 */
export function Terminal({ now }: { now: { repo: string; message: string } | null }) {
  const open = useUI((s) => s.terminalOpen);
  const setOpen = useUI((s) => s.setTerminalOpen);
  const go = useTransitionGo();
  const [entries, setEntries] = useState<Entry[]>(WELCOME);
  const [input, setInput] = useState("");
  const [past, setPast] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const outRef = useRef<HTMLDivElement>(null);

  // The ` / ~ shortcut lives in LazyOverlays, which mounts this on first use.
  useEffect(() => {
    if (!open) return;
    foundEgg("terminal", "Easter egg found: the terminal", "Type `help`. Some commands aren't listed.");
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, [open]);

  useEffect(() => {
    const el = outRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries]);

  function perform(action: TermAction) {
    const ui = useUI.getState();
    switch (action.type) {
      case "navigate":
        setOpen(false);
        go(action.href, { label: action.label });
        break;
      case "external":
        window.open(action.href, "_blank", "noopener,noreferrer");
        break;
      case "shift": {
        const root = document.documentElement;
        root.classList.add("shift-fade");
        play("peel");
        ui.setShift(action.value);
        window.setTimeout(() => root.classList.remove("shift-fade"), 260);
        break;
      }
      case "sound":
        ui.setMuted(action.muted);
        break;
      case "clear":
        setEntries([]);
        break;
      case "close":
        setOpen(false);
        break;
      case "print":
        setOpen(false);
        window.setTimeout(() => window.print(), 300);
        break;
      case "scuba":
        window.dispatchEvent(new Event("egg:scuba"));
        break;
    }
  }

  function submit() {
    const value = input;
    const result = runCommand(value, { shift: useUI.getState().shift, date: new Date(), now });
    setEntries((prev) => [...prev, { text: value, prompt: true }, ...result.lines]);
    if (value.trim()) setPast((p) => [...p.slice(-30), value]);
    setCursor(-1);
    setInput("");
    if (result.action) {
      const action = result.action;
      window.setTimeout(() => perform(action), result.delay ?? 0);
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const done = complete(input);
      if (done) setInput(done);
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      if (!past.length) return;
      const next = e.key === "ArrowUp" ? (cursor < 0 ? past.length - 1 : Math.max(0, cursor - 1)) : cursor < 0 ? -1 : cursor + 1;
      if (next < 0 || next >= past.length) {
        setCursor(-1);
        setInput("");
      } else {
        setCursor(next);
        setInput(past[next]);
      }
    } else if (e.key.length === 1) {
      play("key");
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Terminal"
      data-open={open}
      data-lenis-prevent=""
      inert={!open}
      onClick={() => inputRef.current?.focus()}
      className={cn(
        "fixed inset-x-0 bottom-0 z-[75] flex h-[min(62vh,560px)] flex-col overflow-hidden rounded-t-[28px] border-t border-[#2A2535] bg-[#0B0A10] font-mono text-[14px] text-[#F4F2FF] shadow-[0_-30px_80px_-30px_rgb(0_0_0/0.6)] transition-transform duration-500 ease-[var(--ease-expo-out)] sm:inset-x-6",
        open ? "translate-y-0" : "translate-y-[105%]",
      )}
    >
      <div className="flex items-center justify-between border-b border-[#2A2535] px-5 py-3">
        <span className="text-[#8E88A3]">itesh@shift: ~</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false);
          }}
          aria-label="Close terminal"
          className="flex size-9 items-center justify-center rounded-full text-[18px] text-[#8E88A3] hover:bg-white/10 hover:text-white"
        >
          <Close />
        </button>
      </div>
      <div ref={outRef} className="flex-1 overflow-y-auto px-5 py-4 leading-relaxed" aria-live="polite">
        {entries.map((entry, i) =>
          entry.prompt ? (
            <p key={i} className="whitespace-pre-wrap">
              <span className="text-[#CCFF33]">itesh@shift:~$</span> {entry.text}
            </p>
          ) : (
            <p key={i} className={cn("min-h-[1.6em] whitespace-pre-wrap", entry.tone && TONE[entry.tone])}>
              {entry.text}
            </p>
          ),
        )}
        <label className="flex items-baseline gap-2">
          <span className="shrink-0 text-[#CCFF33]">itesh@shift:~$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Terminal input"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="w-full min-w-0 bg-transparent caret-[#CCFF33] outline-none"
          />
        </label>
      </div>
    </div>
  );
}
