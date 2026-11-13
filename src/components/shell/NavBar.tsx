"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { useTransitionGo } from "@/components/transition/TransitionProvider";
import { filterNav, NAV_ITEMS, type NavItem } from "@/content/nav";
import { cn } from "@/lib/cn";
import { isTypingTarget } from "@/lib/motion";
import { play } from "@/lib/sound";
import { preloadArcee } from "./LazyOverlays";
import { useUI } from "@/store/ui";
import { StarVisual } from "@/components/home/StarVisual";
import { Scribble } from "@/components/motion/Scribble";

const STAR_SLUGS = new Set(["/work/arcee", "/work/patentiq", "/work/diachat"]);
const STAR_FILL: Record<string, string> = {
  "/work/arcee": "bg-arcee-deep",
  "/work/patentiq": "bg-patentiq",
  "/work/diachat": "bg-diachat",
};

/** A small dot of each page's colour; the stickers themselves stay plain and straight. */
const DOT: Record<string, string> = {
  Arcee: "bg-arcee",
  PatentIQ: "bg-patentiq",
  DiaChat: "bg-diachat",
  Work: "bg-lime",
  DiaLabs: "bg-violet",
  About: "bg-lavender",
  Chat: "bg-arcee",
  Contact: "bg-tomato",
  Home: "bg-fg-muted",
};

/**
 * The "Where to?" navigator (docs/design.md §2.8, docs/spec.md §5.5): a pill with
 * a tiny sticker stack that fans out a sheet of plain die-cut page stickers
 * (a dot of each page's colour) over a search field. Typing filters; anything that isn't a
 * page goes to Arcee ("terminal" opens the hidden terminal).
 */
export function NavBar() {
  const open = useUI((s) => s.navOpen);
  const setOpen = useUI((s) => s.setNavOpen);
  const go = useTransitionGo();

  const [query, setQuery] = useState("");
  // Two layouts to compare: the hand of cards, or a full-screen sheet (remembered).
  const [layout, setLayout] = useState<"cards" | "sheet">("cards");
  function switchLayout(next: "cards" | "sheet") {
    setLayout(next);
    try {
      localStorage.setItem("nav-layout", next);
    } catch {}
    requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
  }
  const [active, setActive] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const pillRef = useRef<HTMLButtonElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const panelId = useId();

  const items = useMemo(() => filterNav(NAV_ITEMS, query), [query]);
  const activeIndex = items.length ? Math.min(active, items.length - 1) : -1;

  const openNav = useCallback(() => {
    // The saved layout choice is read on open (no effect needed, no hydration mismatch).
    try {
      setLayout(localStorage.getItem("nav-layout") === "sheet" ? "sheet" : "cards");
    } catch {}
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

  const toggle = (
      <button
        type="button"
        onClick={() => switchLayout(layout === "cards" ? "sheet" : "cards")}
        className="self-center text-[13px] font-medium text-fg-muted hover:text-fg"
      >
        <Scribble>{layout === "cards" ? "Try the full sheet" : "Try the cards"}</Scribble>
      </button>
  );

  const searchField = (
<label className="nav-sticker nav-search flex items-center gap-3 rounded-full border-[3px] border-white bg-surface px-4 py-2.5 text-fg" style={{ "--r": "0deg" } as CSSProperties}>
  <span aria-hidden="true" className="font-serif text-[20px] whitespace-nowrap italic leading-none text-fg-muted">
    Go to
  </span>
  <input
    ref={inputRef}
    role="combobox"
    aria-expanded={open}
    aria-controls={listId}
    aria-autocomplete="list"
    aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
    aria-label="Type a page to go to, or ask Arcee"
    placeholder="a page, or ask Arcee anything"
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
  <button
    type="button"
    onClick={() => {
      const q = query.trim();
      closeNav();
      useUI.getState().openArcee(q || undefined);
    }}
    className="shrink-0 rounded-full bg-violet px-3 py-1 text-[12px] font-semibold text-white"
  >
    {query.trim() && !items.length ? "Ask Arcee ↵" : "Arcee"}
  </button>
</label>
  );

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(16px,env(safe-area-inset-bottom))]">
      {/* Clicks pass through the column; only the open panel and the pill take them. */}
      <div ref={shellRef} className="flex w-full max-w-[560px] flex-col items-center gap-3">
        {layout === "cards" && (
          <div id={panelId} data-open={open} inert={!open} className="nav-panel pointer-events-auto flex w-full flex-col gap-3">
            <ul id={listId} role="listbox" aria-label="Pages" className="nav-hand grid grid-cols-2 gap-x-3 gap-y-3 px-1">
              {items.map((item, i) => (
                <li
                  key={item.href}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === activeIndex}
                  onPointerEnter={() => setActive(i)}
                  onClick={() => choose(item)}
                  style={
                    {
                      "--r": "0deg",
                      // Fanned like a hand of cards from tablet width up (globals.css .nav-hand).
                      "--o": i - (items.length - 1) / 2,
                      "--from-x": `${(i % 2 ? -1 : 1) * 40}%`,
                      transitionDelay: open ? `${Math.abs(i - (items.length - 1) / 2) * 40}ms` : "0ms",
                    } as CSSProperties
                  }
                  className="nav-sticker flex min-h-[64px] cursor-pointer flex-col justify-center rounded-[18px] border-[3px] border-white bg-surface px-4 py-2.5 text-fg"
                >
                  <span className="flex items-center gap-2 text-[18px] leading-tight font-semibold tracking-[-0.02em]">
                    <span aria-hidden="true" className={cn("size-2.5 shrink-0 rounded-full", DOT[item.label] ?? "bg-violet")} />
                    {item.label}
                  </span>
                  <span className="text-[13px] leading-snug text-fg-muted">{item.day}</span>
                </li>
              ))}
            </ul>
            {searchField}
            {toggle}
          </div>
        )}
        {layout === "sheet" && (
          <div id={panelId} data-open={open} inert={!open} className="nav-sheet pointer-events-auto fixed inset-x-2 top-2 bottom-2 z-[60] flex flex-col overflow-hidden rounded-[32px] border-[4px] border-white bg-surface text-fg sm:inset-x-4 sm:top-4 sm:bottom-4">
            <div className="faded-mat flex min-h-0 flex-1 flex-col px-[clamp(20px,4vw,56px)] pt-[clamp(20px,3vw,36px)] pb-5">
              <div className="flex items-center justify-between gap-4">
                <p className="font-serif text-[clamp(22px,2.2vw,30px)] italic">Where to?</p>
                <div className="flex items-center gap-4">
                  {toggle}
                  <button type="button" onClick={() => closeNav(true)} className="btn btn-paper" aria-label="Close navigation">
                    Close
                  </button>
                </div>
              </div>
              <div className="mt-6 grid min-h-0 flex-1 gap-8 overflow-y-auto lg:grid-cols-[1.3fr_1fr] lg:overflow-visible">
                <ul id={listId} role="listbox" aria-label="Pages" className="flex flex-col">
                  {items.map((item, i) => (
                    <li
                      key={item.href}
                      id={`${listId}-${i}`}
                      role="option"
                      aria-selected={i === activeIndex}
                      onPointerEnter={() => setActive(i)}
                      onClick={() => choose(item)}
                      style={{ "--d": `${i * 40}ms` } as CSSProperties}
                      className="sheet-row group flex cursor-pointer items-baseline gap-4 border-b border-line py-2.5"
                    >
                      <span aria-hidden="true" className={cn("size-3 shrink-0 translate-y-[-0.35em] rounded-full", DOT[item.label] ?? "bg-violet")} />
                      <span className="sheet-name text-[clamp(32px,4.4vw,68px)] leading-none font-semibold tracking-[-0.045em] [font-variation-settings:'wdth'_80]">
                        {item.label}
                      </span>
                      <span className="ml-auto hidden text-[15px] text-fg-muted sm:block">{item.day}</span>
                    </li>
                  ))}
                </ul>
                {/* A preview of the page you're on; the star projects show their real artwork. */}
                <div className="hidden lg:flex lg:items-start">
                  {items[activeIndex] && (
                    <div key={items[activeIndex].href} className="sheet-preview w-full overflow-hidden rounded-[26px] border-[4px] border-white bg-bg shadow-[0_24px_50px_-26px_rgb(0_0_0/0.5)]">
                      {STAR_SLUGS.has(items[activeIndex].href) ? (
                        <div className={cn("flex h-64 items-center justify-center", STAR_FILL[items[activeIndex].href])}>
                          <StarVisual slug={items[activeIndex].href.split("/").pop() ?? ""} />
                        </div>
                      ) : (
                        <div className="flex h-64 items-center justify-center">
                          <span className={cn("size-24 rounded-[28px] border-[4px] border-white shadow-[0_14px_30px_-16px_rgb(0_0_0/0.5)]", DOT[items[activeIndex].label] ?? "bg-violet")} />
                        </div>
                      )}
                      <div className="p-6">
                        <p className="text-[34px] leading-none font-semibold tracking-[-0.04em] [font-variation-settings:'wdth'_80]">{items[activeIndex].label}</p>
                        <p className="mt-2 text-fg-muted">{items[activeIndex].day}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-5">{searchField}</div>
            </div>
          </div>
        )}
        <button
          ref={pillRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={panelId}
          data-open={open}
          onClick={() => (open ? closeNav() : openNav())}
          className="nav-pill group pointer-events-auto flex min-h-12 items-center gap-3 rounded-full border-[3px] border-white bg-violet py-2.5 pr-5 pl-3 text-white shadow-[0_14px_34px_-14px_rgb(122_44_255/0.75)]"
        >
          {/* A tiny stack of stickers that fans out on hover and when open. */}
          <span aria-hidden="true" className="relative h-6 w-8">
            <span className="nav-mini absolute inset-y-0 left-1 w-5 rounded-[6px] border-2 border-white bg-sunflower" style={{ "--m": "-14deg", "--mx": "-5px" } as CSSProperties} />
            <span className="nav-mini absolute inset-y-0 left-1 w-5 rounded-[6px] border-2 border-white bg-lime" style={{ "--m": "12deg", "--mx": "5px" } as CSSProperties} />
            <span className="nav-mini absolute inset-y-0 left-1 w-5 rounded-[6px] border-2 border-white bg-lavender" style={{ "--m": "0deg", "--mx": "0px" } as CSSProperties} />
          </span>
          <span className="font-serif text-[22px] italic leading-none">Where to?</span>
          <span className="sr-only">{open ? "Close navigation" : "Open navigation"}</span>
        </button>
      </div>
    </div>
  );
}
