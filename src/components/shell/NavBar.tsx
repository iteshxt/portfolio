"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useTransitionGo } from "@/components/transition/TransitionProvider";
import { filterNav, NAV_ITEMS, NAV_PROMPT, type NavItem } from "@/content/nav";
import { cn } from "@/lib/cn";
import { isTypingTarget } from "@/lib/motion";
import { play } from "@/lib/sound";
import { useUI } from "@/store/ui";

/**
 * The "Show me ___" bar (docs/prd.md §6.2, docs/spec.md §5.5): one pill that
 * opens into sentence completions the visitor picks from. Each completion is
 * a page; anything else is handed to Arcee (a placeholder until the chatbot
 * milestone).
 */
export function NavBar() {
  const open = useUI((s) => s.navOpen);
  const setOpen = useUI((s) => s.setNavOpen);
  const go = useTransitionGo();

  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const pillRef = useRef<HTMLButtonElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const panelId = useId();

  const items = useMemo(() => filterNav(NAV_ITEMS, query), [query]);
  const activeIndex = items.length ? Math.min(active, items.length - 1) : -1;

  const openNav = useCallback(() => {
    play("open");
    useUI.getState().closeArcee();
    setOpen(true);
  }, [setOpen]);

  const closeNav = useCallback(
    (focusPill = false) => {
      if (useUI.getState().navOpen) play("close");
      setOpen(false);
      setQuery("");
      setActive(0);
      if (focusPill) pillRef.current?.focus();
    },
    [setOpen],
  );

  // "/" or ⌘K / Ctrl+K toggles the bar; Esc closes it.
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      const isOpen = useUI.getState().navOpen;
      const mod = e.metaKey || e.ctrlKey;
      if ((e.key === "/" && !isTypingTarget(e.target)) || (mod && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        if (isOpen) closeNav(true);
        else openNav();
      } else if (e.key === "Escape" && isOpen) {
        closeNav(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeNav, openNav]);

  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    const onDown = (e: PointerEvent) => {
      if (!shellRef.current?.contains(e.target as Node)) closeNav();
    };
    document.addEventListener("pointerdown", onDown);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open, closeNav]);

  function choose(item: NavItem) {
    const r = pillRef.current?.getBoundingClientRect();
    play("select");
    setOpen(false);
    setQuery("");
    setActive(0);
    go(item.href, {
      label: item.label,
      origin: r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : undefined,
    });
  }

  function onInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!items.length) return;
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((activeIndex + step + items.length) % items.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const q = query.trim();
      if (activeIndex >= 0) choose(items[activeIndex]);
      else if (["terminal", "~", "cli", "shell"].includes(q.toLowerCase())) {
        closeNav();
        useUI.getState().setTerminalOpen(true);
      } else if (q) {
        closeNav();
        useUI.getState().openArcee(q);
      }
    }
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(16px,env(safe-area-inset-bottom))]">
      <div ref={shellRef} className="pointer-events-auto flex w-full max-w-[440px] flex-col items-center gap-2">
        <div
          id={panelId}
          data-open={open}
          inert={!open}
          className="nav-panel w-full origin-bottom rounded-2xl border border-line bg-surface p-2 text-fg shadow-[0_24px_60px_-24px_rgb(0_0_0/0.45)]"
        >
          <label className="flex items-baseline gap-2 rounded-xl px-3 pt-2 pb-3">
            <span className="shrink-0 font-serif text-[22px] italic leading-none">{NAV_PROMPT}</span>
            <input
              ref={inputRef}
              role="combobox"
              aria-expanded={open}
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
              aria-label="Finish the sentence to navigate, or ask Arcee"
              placeholder="… or ask Arcee anything"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onInputKeyDown}
              autoComplete="off"
              spellCheck={false}
              className="w-full min-w-0 bg-transparent text-[16px] outline-none placeholder:text-fg-muted"
            />
          </label>

          <ul id={listId} role="listbox" aria-label="Pages" className="flex flex-col">
            {items.map((item, i) => (
              <li
                key={item.href}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === activeIndex}
                onPointerEnter={() => setActive(i)}
                onClick={() => choose(item)}
                style={{ transitionDelay: open ? `${i * 30}ms` : "0ms" }}
                className="nav-option flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-[15px] aria-selected:bg-violet/12"
              >
                <span className="font-medium">
                  <span className="day-only">{item.day}</span>
                  <span className="night-only">{item.night}</span>
                </span>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-[12px]",
                    item.kind === "star" ? "bg-violet text-white" : "bg-bg text-fg-muted",
                  )}
                >
                  {item.kind === "star" ? `star · ${item.label}` : item.label}
                </span>
              </li>
            ))}
          </ul>

          {!items.length && query.trim() && (
            <button
              type="button"
              onClick={() => {
                const q = query.trim();
                closeNav();
                useUI.getState().openArcee(q);
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[14px] hover:bg-violet/12"
            >
              <span className="rounded-full bg-violet px-2 py-0.5 text-[12px] text-white">Arcee</span>
              No page for that. Press Enter and Arcee will answer it.
            </button>
          )}
          {!query.trim() && (
            <button
              type="button"
              onClick={() => {
                closeNav();
                useUI.getState().openArcee();
              }}
              className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[14px] text-fg-muted hover:bg-violet/12 hover:text-fg"
            >
              <span className="rounded-full bg-violet px-2 py-0.5 text-[12px] text-white">Arcee</span>
              Or just ask Arcee anything about Itesh
            </button>
          )}
        </div>

        <button
          ref={pillRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => (open ? closeNav() : openNav())}
          className="group flex min-h-12 items-center gap-3 rounded-full bg-violet px-5 py-3 text-white shadow-[0_14px_34px_-14px_rgb(122_44_255/0.75)] transition-transform duration-200 ease-[var(--ease-expo-out)] hover:-translate-y-0.5 active:scale-[0.97]"
        >
          <span className="font-serif text-[22px] italic leading-none">{NAV_PROMPT}</span>
          <span aria-hidden="true" className="h-[2px] w-12 translate-y-[7px] rounded-full bg-white/70" />
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className={cn("size-5 transition-transform duration-300", open && "rotate-180")}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 14.5 12 8.5l6 6" />
          </svg>
          <span className="sr-only">{open ? "Close navigation" : "Open navigation"}</span>
        </button>
      </div>
    </div>
  );
}
