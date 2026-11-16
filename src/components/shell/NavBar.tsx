"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { useTransitionGo } from "@/components/transition/TransitionProvider";
import { filterNav, NAV_ITEMS, type NavItem } from "@/content/nav";
import { ArrowRight } from "@/components/icons";
import { cn } from "@/lib/cn";
import { isTypingTarget } from "@/lib/motion";
import { play } from "@/lib/sound";
import { preloadArcee } from "./LazyOverlays";
import { useUI } from "@/store/ui";

/** Each page as a word sticker in the hero's colours; the star projects wear their own app's colours. */
const TONE: Record<string, string> = {
  Arcee: "bg-arcee-deep text-arcee",
  PatentIQ: "bg-patentiq text-patentiq-ink",
  DiaChat: "bg-diachat text-diachat-ink",
  Work: "bg-lime text-[#2B3600]",
  DiaLabs: "bg-violet text-white",
  About: "bg-lavender text-violet-ink",
  Chat: "bg-sunflower text-[#4A3A00]",
  Contact: "bg-tomato text-[#2A0700]",
  Home: "bg-paper text-ink",
};

/** The two rings around the pill: star projects close in, the other pages further out. */
const RINGS = { star: { radius: 118, step: 55, span: 110 }, page: { radius: 215, step: 30, span: 150 } };

function placeOnRings(items: NavItem[]) {
  const counts = { star: 0, page: 0 };
  for (const item of items) counts[item.kind]++;
  const seen = { star: 0, page: 0 };
  return items.map((item) => {
    const ring = RINGS[item.kind];
    const n = counts[item.kind];
    const k = seen[item.kind]++;
    const span = Math.min(ring.span, ring.step * (n - 1));
    return { angle: n < 2 ? 0 : -span / 2 + (span * k) / (n - 1), radius: ring.radius, order: k + (item.kind === "page" ? 1 : 0) };
  });
}

/**
 * The "Where to?" navigator (docs/design.md §2.8, docs/spec.md §5.5): a pill with
 * a tiny sticker stack. Opening it fans the pages out as word stickers on two
 * semicircles around it, and the pill itself becomes the search field. Typing
 * filters; anything that isn't a page goes to Arcee ("terminal" opens the hidden terminal).
 */
export function NavBar() {
  const open = useUI((s) => s.navOpen);
  const setOpen = useUI((s) => s.setNavOpen);
  const go = useTransitionGo();

  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  // Opened with "/" or ⌘K: there's a keyboard, so the field can take focus even on a tablet.
  const viaShortcut = useRef(false);
  const pillRef = useRef<HTMLButtonElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const panelId = useId();

  const items = useMemo(() => filterNav(NAV_ITEMS, query), [query]);
  const spots = useMemo(() => placeOnRings(items), [items]);
  const activeIndex = items.length ? Math.min(active, items.length - 1) : -1;

  const openNav = useCallback(() => {
    play("open");
    useUI.getState().closeArcee();
    preloadArcee();
    setOpen(true);
  }, [setOpen]);

  const closeNav = useCallback(
    (focusPill = false) => {
      if (useUI.getState().navOpen) play("close");
      setOpen(false);
      setQuery("");
      setActive(0);
      // The pill is shown again on the next render.
      if (focusPill) requestAnimationFrame(() => pillRef.current?.focus());
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
        else {
          viaShortcut.current = true;
          openNav();
        }
      } else if (e.key === "Escape" && isOpen) {
        closeNav(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeNav, openNav]);

  useEffect(() => {
    if (!open) return;
    // Phones and tablets: don't pop the on-screen keyboard just for opening the navigator;
    // focus moves into it (the close button) and the keyboard comes up when the field is tapped.
    const typing = viaShortcut.current || window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    viaShortcut.current = false;
    const raf = requestAnimationFrame(() => (typing ? inputRef.current : closeRef.current)?.focus({ preventScroll: true }));
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

  const miniStack = (
    <span aria-hidden="true" className="relative h-6 w-8 shrink-0">
      <span className="nav-mini absolute inset-y-0 left-1 w-5 rounded-[6px] border-2 border-white bg-sunflower" style={{ "--m": "-14deg", "--mx": "-5px" } as CSSProperties} />
      <span className="nav-mini absolute inset-y-0 left-1 w-5 rounded-[6px] border-2 border-white bg-lime" style={{ "--m": "12deg", "--mx": "5px" } as CSSProperties} />
      <span className="nav-mini absolute inset-y-0 left-1 w-5 rounded-[6px] border-2 border-white bg-lavender" style={{ "--m": "0deg", "--mx": "0px" } as CSSProperties} />
    </span>
  );
  const askArcee = query.trim() !== "" && !items.length;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(16px,env(safe-area-inset-bottom))]">
      {/* Clicks pass through the column; only the open panel and the pill take them. */}
      {/* The page softly blurs behind the open navigator; a tap on it closes the navigator. */}
      <div aria-hidden="true" data-open={open} className="nav-scrim pointer-events-auto fixed inset-0" />
      <div ref={shellRef} className="relative flex w-full max-w-[560px] flex-col items-center gap-3">
        <div id={panelId} data-open={open} inert={!open} className="nav-panel pointer-events-auto relative w-full">
          {/* A handwritten nudge, like "peel here": the stickers are links. */}
          <p aria-hidden="true" className="nav-note pointer-events-none flex items-end justify-center gap-1 text-accent-text">
            <span className="-rotate-[6deg] font-hand text-[24px] leading-none whitespace-nowrap">pick a page</span>
            <svg viewBox="0 0 60 48" className="nav-note-arrow w-[46px] overflow-visible">
              <path className="nav-note-stroke" pathLength={1} d="M4 6 C 20 4, 34 10, 38 22 C 41 31, 36 38, 30 34 C 24 30, 34 22, 44 30 C 50 35, 53 40, 55 44" />
              <path className="nav-note-stroke nav-note-head" pathLength={1} d="M46 41 L 56 45 L 58 34" />
            </svg>
          </p>
          <ul id={listId} role="listbox" aria-label="Pages" className="nav-hand flex flex-wrap justify-center gap-2.5">
            {items.map((item, i) => (
              <li
                key={item.href}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === activeIndex}
                aria-label={`${item.label}: ${item.day}`}
                // A one-line hint by the custom cursor.
                data-cursor={item.day}
                onPointerEnter={() => setActive(i)}
                onClick={() => choose(item)}
                style={
                  {
                    "--r": "0deg",
                    // Their place on the rings from tablet width up (globals.css .nav-hand).
                    "--a": `${spots[i].angle}deg`,
                    "--R": `${spots[i].radius}px`,
                    "--from-x": `${(i % 2 ? -1 : 1) * 40}%`,
                    transitionDelay: open ? `${spots[i].order * 35}ms` : "0ms",
                  } as CSSProperties
                }
                className={cn(
                  "nav-sticker nav-word cursor-pointer rounded-[12px] border-[3px] border-white px-3.5 pt-1 pb-1.5 text-[20px] leading-tight font-semibold tracking-[-0.03em] whitespace-nowrap [font-variation-settings:'wdth'_82]",
                  TONE[item.label] ?? "bg-paper text-ink",
                )}
              >
                <span aria-hidden="true" className="flex items-center gap-1.5">
                  {item.label}
                  <ArrowRight className="nav-word-arrow text-[0.7em] opacity-70" />
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Closed: the "Where to?" pill. Open: the same pill as the search field. */}
        <button
          ref={pillRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={panelId}
          data-open={open}
          hidden={open}
          onClick={openNav}
          className="nav-pill group pointer-events-auto flex min-h-12 items-center gap-3 rounded-full border-[3px] border-[var(--die)] bg-fg py-2.5 pr-5 pl-3 text-bg shadow-[0_12px_26px_-12px_rgb(0_0_0/0.55)]"
        >
          {miniStack}
          <span className="text-[16px] leading-none font-semibold">Where to?</span>
          <span className="sr-only">Open navigation</span>
        </button>
        <div
          hidden={!open}
          data-open={open}
          className="nav-pill nav-field pointer-events-auto flex min-h-12 w-[min(440px,100%)] items-center gap-2.5 rounded-full border-[3px] border-[var(--die)] bg-fg py-1 pr-1 pl-3 text-bg shadow-[0_12px_26px_-12px_rgb(0_0_0/0.55)]"
        >
          <button ref={closeRef} type="button" onClick={() => closeNav(true)} aria-label="Close navigation" className="flex items-center">
            {miniStack}
          </button>
          <input
            ref={inputRef}
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
            aria-label="Type a page to go to, or ask Arcee"
            placeholder="Where to? Or ask me anything…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKeyDown}
            autoComplete="off"
            spellCheck={false}
            className="w-full min-w-0 bg-transparent text-[16px] leading-none outline-none placeholder:text-bg/65"
          />
          {/* Arcee answers anything that isn't a page. */}
          <button
            type="button"
            onClick={() => {
              const q = query.trim();
              closeNav();
              useUI.getState().openArcee(q || undefined);
            }}
            aria-label="Ask Arcee"
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full border-2 border-[var(--die)] bg-ink text-[13px] font-semibold text-white transition-[padding] duration-300",
              askArcee ? "py-0.5 pr-3 pl-0.5" : "p-0",
            )}
          >
            <picture className="block size-8 overflow-hidden rounded-full">
              <source srcSet="/projects/arcee-wave-still.webp" media="(prefers-reduced-motion: reduce)" />
              <img src="/projects/arcee-wave.webp" alt="" width={32} height={32} className="size-full scale-[1.35] object-cover" />
            </picture>
            {askArcee && <span aria-hidden="true">Ask ↵</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
