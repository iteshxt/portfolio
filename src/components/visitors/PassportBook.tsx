"use client";

import { useEffect, useRef, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { STICKERS } from "@/lib/arcee/stickers";
import { cn } from "@/lib/cn";
import { prefersReducedMotion, scrollToY } from "@/lib/motion";
import { onScrollFrame } from "@/lib/scroll-frame";
import type { VisitorEntry } from "@/lib/visitors/types";
import { useUI } from "@/store/ui";
import { formatVisitDate, PassportStamp, visitorNo } from "./PassportStamp";

/** Stamps on a visa page: two to a page, four to an open spread. */
const PER_PAGE = 2;
/** Share of each step's scroll that holds the open pages still before the next page turns. */
const DWELL = 0.3;

type Page =
  | { kind: "cover" }
  | { kind: "inside" }
  | { kind: "data" }
  /** `free`: empty places after the stamps; the first one invites you to get yours. */
  | { kind: "visas"; number: number; stamps: VisitorEntry[]; free: number; invite: boolean }
  /** The inside of the back board: the last sheet's back on wide screens, never turned to. */
  | { kind: "back" };

/**
 * The book's pages in reading order: the front cover, the inside cover, the data page, then visa
 * pages filled from the first stamp like a real passport (a stamp never moves page), the next free
 * place inviting you to get yours. On wide screens each sheet carries two pages (front on the right,
 * back on the left) and the last sheet never turns, so the book ends with the back board, after a
 * page of free places if that's what it takes for the last visa page to be on view.
 */
function buildPages(entries: VisitorEntry[], wide: boolean): Page[] {
  const oldestFirst = [...entries].sort((a, b) => a.n - b.n);
  const pages: Page[] = [{ kind: "cover" }, { kind: "inside" }, { kind: "data" }];
  let number = 1;
  let invited = false;
  for (let i = 0; i < oldestFirst.length; i += PER_PAGE) {
    const stamps = oldestFirst.slice(i, i + PER_PAGE);
    const free = PER_PAGE - stamps.length;
    pages.push({ kind: "visas", number: number++, stamps, free, invite: free > 0 });
    if (free > 0) invited = true;
  }
  if (!invited) pages.push({ kind: "visas", number: number++, stamps: [], free: PER_PAGE, invite: true });
  if (wide) {
    if (pages.length % 2 === 0) pages.push({ kind: "visas", number: number++, stamps: [], free: PER_PAGE, invite: false });
    pages.push({ kind: "back" });
  }
  return pages;
}

/** The officer's scribble beside each stamp, picked by visitor number. */
const SCRIBBLES = ["welcome in", "cleared ✓", "seen, ok", "all good", "come again", "nice one", "approved", "enjoy the cats"];

/** Small, stable scatter for a stamp on its page (offset in px), from its number. */
function scatter(n: number): { x: number; y: number } {
  return { x: ((n * 37) % 27) - 13, y: ((n * 53) % 15) - 7 };
}

/** The machine-readable lines at the foot of the data page, padded with "<" like a real one. */
function mrz(total: number): [string, string] {
  const pad = (s: string) => (s + "<".repeat(44)).slice(0, 44);
  return [pad("P<ITESHXT<<VISITORS<OF<THE<MANIFEST"), pad(`${String(total).padStart(6, "0")}<<SCAN<THE<BARCODE<ON<WORK`)];
}

const pageNo = (n: number) => String(n).padStart(2, "0");

/** "17 Nov 2026, 22:14" (or just the date, for stamps from before times were kept). */
function when(entry: Pick<VisitorEntry, "d"> & { tm?: string }): string {
  const date = formatVisitDate(entry.d);
  return date && entry.tm ? `${date}, ${entry.tm}` : date;
}

/** The crest on the cover, the inside cover and (faintly) every visa page: a cat in a ring. */
function Crest({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="50" cy="50" r="46" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="40" strokeWidth="1.2" strokeDasharray="1.5 3.2" />
      <path d="M31 63 V35 l12 10 q7-4 14 0 l12-10 v28 q0 15-19 15 t-19-15 z" strokeWidth="2.6" />
      <circle cx="43" cy="57" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="57" cy="57" r="2.2" fill="currentColor" stroke="none" />
      <path d="M47.5 64 h5 l-2.5 2.6 z M26 62 l10 1.5 M26 68 l10-1.5 M74 62 l-10 1.5 M74 68 l-10-1.5" strokeWidth="1.6" />
      <path d="M50 14 l2.2 4.6 5 .7 -3.6 3.5 .9 5 -4.5-2.4 -4.5 2.4 .9-5 -3.6-3.5 5-.7 z" strokeWidth="1.4" />
    </svg>
  );
}

function Cover() {
  return (
    <div className="book-cover-front">
      <p className="book-cover-title">Visitors&apos; passport</p>
      <p className="book-cover-sub">Passport · Passeport · Pasaporte</p>
      <Crest className="book-cover-crest" />
      <p className="book-cover-site">iteshxt.me</p>
      <svg viewBox="0 0 40 26" className="book-cover-chip" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="1.5" y="1.5" width="37" height="23" rx="3" />
        <circle cx="20" cy="13" r="5.5" />
        <path d="M1.5 13 H14.5 M25.5 13 H38.5" />
      </svg>
    </div>
  );
}

function InsideCover() {
  return (
    <>
      <p className="passport-kicker">
        <span>iteshxt.me</span>
        <span>Visitors</span>
      </p>
      <div className="book-inside">
        <Crest className="book-inside-crest" />
        <div className="book-inside-text">
          <p className="book-inside-request">
            The keeper of this site requests all whom it may concern to let the bearer scroll freely, without let or hindrance, and to give them every
            assistance, snack and cat they may need.
          </p>
          <p className="book-inside-small">Not valid for travel. Valid for scrolling.</p>
        </div>
      </div>
    </>
  );
}

function DataPage({ total, latest, recent }: { total: number; latest: VisitorEntry | null; recent: VisitorEntry[] }) {
  const [mrz1, mrz2] = mrz(total);
  const latestWhen = latest ? when(latest) : "";
  return (
    <>
      <h2 id="passport-data-title" className="passport-kicker">
        <span>Passport · Passeport</span>
        <span>iteshxt.me</span>
      </h2>
      <div className="book-data">
        <div className="passport-photo" aria-hidden="true">
          <picture className="contents">
            <img src={STICKERS.hype.still} alt="" width={96} height={120} className="size-full object-cover" />
          </picture>
        </div>
        <dl className="passport-fields min-w-0 flex-1">
          <div>
            <dt>Type</dt>
            <dd>P · Visitors</dd>
          </div>
          <div>
            <dt>Holder</dt>
            <dd>Everyone who scanned the manifest</dd>
          </div>
          <div>
            <dt>Stamps</dt>
            <dd>
              {total} {total === 1 ? "visitor" : "visitors"}
            </dd>
          </div>
          {latest && (
            <div>
              <dt>Latest arrival</dt>
              <dd>
                {latest.name}
                {latestWhen && <span className="book-data-when"> · {latestWhen}</span>}
              </dd>
            </div>
          )}
        </dl>
      </div>
      <p className="passport-how">
        To get your stamp, scan the barcode at the bottom of the manifest on the{" "}
        <TransitionLink href="/work" transitionLabel="Work" className="underline decoration-dotted underline-offset-2">
          Work page
        </TransitionLink>{" "}
        with your phone, then sign the arrival card.
      </p>
      {recent.length > 0 && (
        <div className="book-recent">
          <h3 className="book-recent-title">Recent arrivals</h3>
          <ol>
            {recent.map((e) => (
              <li key={e.id}>
                <picture className="contents">
                  <img src={STICKERS[e.cat]?.still ?? STICKERS.hype.still} alt="" width={28} height={28} loading="lazy" className="book-recent-cat" />
                </picture>
                <span className="book-recent-no">{visitorNo(e.n)}</span>
                <span className="book-recent-name">{e.name}</span>
                <span className="book-recent-when">{formatVisitDate(e.d)}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
      <p className="passport-mrz" aria-hidden="true">
        <span>{mrz1}</span>
        <span>{mrz2}</span>
      </p>
    </>
  );
}

function VisaPage({ page }: { page: Extract<Page, { kind: "visas" }> }) {
  const id = `passport-visas-${page.number}`;
  return (
    <>
      <h2 id={id} className="passport-kicker">
        <span>Visas · Entries</span>
        <span>
          <span className="sr-only">page </span>
          {pageNo(page.number)}
        </span>
      </h2>
      <ol className="book-stamps">
        {page.stamps.map((entry) => {
          const { x, y } = scatter(entry.n);
          const at = when(entry);
          return (
            <li key={entry.id} data-stamp={entry.id} className="book-slot" style={{ "--x": `${x}px`, "--y": `${y}px` } as CSSProperties}>
              <span className="sr-only">
                Visitor {visitorNo(entry.n)}: {entry.name}
                {entry.line ? `, “${entry.line}”` : ""}
                {at ? `, arrived ${at}` : ""}
              </span>
              <div aria-hidden="true" className="book-entry">
                <PassportStamp entry={entry} />
                <span className="book-scribble">{SCRIBBLES[entry.n % SCRIBBLES.length]}</span>
              </div>
            </li>
          );
        })}
        {Array.from({ length: page.free }, (_, i) =>
          page.invite && i === 0 ? (
            <li key={`free-${i}`} className="book-slot">
              <TransitionLink href="/work" transitionLabel="Work" className="passport-empty">
                <span className="font-hand text-[22px] leading-tight">your stamp here</span>
                <span className="mt-1 text-[12px]">scan the manifest on the Work page →</span>
              </TransitionLink>
            </li>
          ) : (
            <li key={`free-${i}`} className="book-slot" aria-hidden="true">
              <span className="book-reserved">
                <span>Entry</span>
                <span>reserved for the next visitor</span>
              </span>
            </li>
          ),
        )}
      </ol>
      <p className="book-folio" aria-hidden="true">
        {pageNo(page.number)}
      </p>
    </>
  );
}

/** One page's face, front or back of a sheet. */
function Face({
  page,
  side,
  index,
  total,
  latest,
  recent,
}: {
  page: Page | null;
  side: "front" | "back";
  index: number;
  total: number;
  latest: VisitorEntry | null;
  recent: VisitorEntry[];
}) {
  let body: ReactNode = null;
  let label: Record<string, string> = {};
  if (page?.kind === "cover") body = <Cover />;
  else if (page?.kind === "back") body = <div className="book-cover-front" />;
  else if (page?.kind === "inside") {
    body = <InsideCover />;
    label = { "aria-label": "Inside cover" };
  } else if (page?.kind === "data") {
    body = <DataPage total={total} latest={latest} recent={recent} />;
    label = { "aria-labelledby": "passport-data-title" };
  } else if (page?.kind === "visas") {
    body = <VisaPage page={page} />;
    label = { "aria-labelledby": `passport-visas-${page.number}` };
  }
  const paper = page?.kind !== "cover" && page?.kind !== "back";
  return (
    <section
      data-page={page && page.kind !== "back" ? index : undefined}
      aria-hidden={page && page.kind !== "back" ? undefined : true}
      {...label}
      className={cn("flip-face", `flip-${side}`, paper && "passport-page", page && `flip-${page.kind}`)}
    >
      {body}
    </section>
  );
}

type Engine = { goToPage: (page: number) => void; step: (dir: 1 | -1 | "end") => void };

const wideQuery = "(min-width: 900px)";
function subscribeWide(cb: () => void) {
  const mq = window.matchMedia(wideQuery);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/**
 * The visitors' passport as a book whose pages turn as you scroll (docs/design.md §2.18). It
 * starts closed; scrolling swings the cover open onto the inside cover and the data page, then
 * turns the pages one by one on the spine, holding each open spread for a moment so the four
 * stamps on it can be read. On phones it shows one page at a time and each page turns away to
 * the left. The stage sticks to the viewport while the outer box supplies the scroll (as in the
 * pinned track); the turns run in the shared scroll loop. Reduced motion turns the same pages
 * instantly, with no animation. Someone who just signed arrives with ?you=<id>: the book opens
 * at their stamp and writes "that's you!" beside it.
 */
export function PassportBook({ entries, total }: { entries: VisitorEntry[]; total: number }) {
  const wide = useSyncExternalStore(subscribeWide, () => window.matchMedia(wideQuery).matches, () => true);
  const pages = buildPages(entries, wide);
  const sheets = wide ? Array.from({ length: pages.length / 2 }, (_, k) => [2 * k, 2 * k + 1] as const) : pages.map((_, k) => [k, -1] as const);
  const newestFirst = [...entries].sort((a, b) => b.n - a.n);
  const latest = newestFirst[0] ?? null;
  const recent = newestFirst.slice(0, 4);
  const root = useRef<HTMLElement>(null);
  const outer = useRef<HTMLDivElement>(null);
  const book = useRef<HTMLDivElement>(null);
  const status = useRef<HTMLParagraphElement>(null);
  const engine = useRef<Engine | null>(null);

  useEffect(() => {
    const r = root.current;
    const o = outer.current;
    const b = book.current;
    const s = status.current;
    if (!r || !o || !b || !s) return;
    const still = prefersReducedMotion();
    const sheetEls = [...b.querySelectorAll<HTMLElement>("[data-sheet]")];
    const turns = sheetEls.length - 1;
    let seg = 1;
    let top = 0;
    let pageW = 0;
    const last = sheetEls.map(() => "");
    let lastShift = "";
    let lastLabel = "";
    let closed: boolean | null = null;
    const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
    /** How far sheet k has turned (0 to 1) at scroll step p. */
    const turned = (k: number, p: number) => {
      const f = Math.min(1, Math.max(0, p - k));
      if (still) return f > 0.5 ? 1 : 0;
      return f <= DWELL ? 0 : ease((f - DWELL) / (1 - DWELL));
    };

    const measure = () => {
      seg = Math.max(window.innerHeight * 0.7, 380);
      pageW = sheetEls[0]?.offsetWidth ?? 0;
      // The tail holds the last spread for a moment before the page scrolls on.
      o.style.height = `${turns * seg + window.innerHeight + seg * 0.4}px`;
      last.fill("");
      lastShift = lastLabel = "";
      read();
      write();
    };
    const read = () => {
      top = o.getBoundingClientRect().top;
    };
    const write = () => {
      const p = Math.min(turns, Math.max(0, -top / seg));
      for (let k = 0; k < sheetEls.length; k++) {
        const t = k < turns ? turned(k, p) : 0;
        // Only the open spread and the page turning need drawing; the rest of the stack waits hidden.
        const near = Math.abs(k - p) < 2.2;
        const z = t > 0 && t < 1 ? sheetEls.length + 2 : t >= 1 ? k + 1 : sheetEls.length - k;
        const key = near ? `${t.toFixed(3)}|${z}` : "far";
        if (key === last[k]) continue;
        last[k] = key;
        const el = sheetEls[k];
        // Opacity, not visibility, so screen readers still read every page.
        el.style.opacity = near && !(!wide && t >= 1) ? "" : "0";
        if (!near) continue;
        el.style.transform = `rotateY(${(-180 * t).toFixed(2)}deg)`;
        el.style.zIndex = String(z);
        el.style.setProperty("--t", t.toFixed(3));
      }
      // Closed, the cover sits centred; as it opens the book slides so the open spread is centred.
      if (wide) {
        const shift = `translate3d(${(-(pageW / 2) * (1 - turned(0, p))).toFixed(1)}px, 0, 0)`;
        if (shift !== lastShift) b.style.transform = lastShift = shift;
      }
      const isClosed = turned(0, p) < 0.04;
      if (isClosed !== closed) {
        closed = isClosed;
        r.toggleAttribute("data-closed", isClosed);
      }
      const at = Math.round(p);
      const text = at === 0 ? "Cover" : `${wide ? "Spread" : "Page"} ${at} of ${turns}`;
      if (text !== lastLabel) s.textContent = lastLabel = text;
    };
    /** Scrolls the page to where step `i` rests (inside its hold). */
    const goTo = (i: number) => {
      const step = Math.max(0, Math.min(turns, i));
      const start = o.getBoundingClientRect().top + window.scrollY;
      scrollToY(step === turns ? start + turns * seg + seg * 0.15 : start + step * seg + (step === 0 ? 0 : seg * DWELL * 0.5), 1.1);
    };
    engine.current = {
      // A page is open once every sheet before it has turned (wide: backs show on the left).
      goToPage: (i) => goTo(wide ? Math.ceil(i / 2) : i),
      step: (dir) => (dir === "end" ? goTo(turns) : goTo(Math.round(Math.max(0, -o.getBoundingClientRect().top / seg)) + dir)),
    };
    // Tabbing to a link on a page that isn't open turns the book to it.
    const onFocus = (event: FocusEvent) => {
      const face = (event.target as HTMLElement).closest<HTMLElement>("[data-page]");
      if (face) engine.current?.goToPage(Number(face.dataset.page));
    };

    r.dataset.mode = "flip";
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(b);
    const off = onScrollFrame({ read, write });
    window.addEventListener("resize", measure);
    b.addEventListener("focusin", onFocus);
    return () => {
      off();
      ro.disconnect();
      window.removeEventListener("resize", measure);
      b.removeEventListener("focusin", onFocus);
      delete r.dataset.mode;
      r.removeAttribute("data-closed");
      o.style.height = "";
      b.style.transform = "";
      for (const el of sheetEls) el.removeAttribute("style");
      engine.current = null;
    };
  }, [wide, entries]);

  // ?you=<id>: once the page transition has finished (scrolling is frozen while it covers the
  // screen), open the book at their stamp, then thump it in and write "that's you!" beside it.
  const phase = useUI((st) => st.transitionPhase);
  const youDone = useRef(false);
  useEffect(() => {
    if (youDone.current || phase !== "idle") return;
    const id = new URLSearchParams(window.location.search).get("you");
    if (!id || !/^[A-Za-z0-9_-]{8,64}$/.test(id)) return;
    const slot = document.querySelector<HTMLElement>(`[data-stamp="${id}"]`);
    const face = slot?.closest<HTMLElement>("[data-page]");
    if (!slot || !face) return;
    youDone.current = true;
    const turn = window.setTimeout(() => engine.current?.goToPage(Number(face.dataset.page)), 250);
    const mark = window.setTimeout(() => (slot.dataset.you = ""), 1400);
    return () => {
      window.clearTimeout(turn);
      window.clearTimeout(mark);
    };
  }, [phase]);

  return (
    <section ref={root} className="passport-book" aria-label="The visitors' passport">
      <div ref={outer} className="book-outer">
        <div className="book-stage">
          <div ref={book} className={cn("flip-book", wide ? "flip-book-wide" : "flip-book-narrow")}>
            {sheets.map(([front, back], k) => (
              <div key={`${wide}-${k}`} data-sheet={k} className="flip-sheet" style={{ zIndex: sheets.length - k }}>
                <Face page={pages[front]} side="front" index={front} total={total} latest={latest} recent={recent} />
                <Face page={back >= 0 ? pages[back] : null} side="back" index={back} total={total} latest={latest} recent={recent} />
              </div>
            ))}
          </div>
          <div className="book-bar">
            <p ref={status} className="book-status">
              Cover
            </p>
            <p className="book-hint font-hand" aria-hidden="true">
              scroll to open it
            </p>
            <div className="book-buttons">
              <button type="button" className="book-button" aria-label="Previous page" onClick={() => engine.current?.step(-1)}>
                ←
              </button>
              <button type="button" className="book-button" aria-label="Next page" onClick={() => engine.current?.step(1)}>
                →
              </button>
              <button type="button" className="book-button book-button-wide" onClick={() => engine.current?.step("end")}>
                Newest
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
