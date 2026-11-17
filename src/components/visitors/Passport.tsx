import type { CSSProperties } from "react";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { STICKERS } from "@/lib/arcee/stickers";
import type { VisitorEntry } from "@/lib/visitors/types";
import { PassportStamp, visitorNo } from "./PassportStamp";
import { YouMarker } from "./YouMarker";

const PER_PAGE = 6;

/** Small, stable scatter for a stamp on its page (offset in px), from its number. */
function scatter(n: number): { x: number; y: number } {
  const a = (n * 37) % 23;
  const b = (n * 53) % 19;
  return { x: a - 11, y: b - 9 };
}

/** The machine-readable lines at the foot of the data page, padded with "<" like a real one. */
function mrz(total: number): [string, string] {
  const pad = (s: string) => (s + "<".repeat(44)).slice(0, 44);
  return [pad("P<ITESHXT<<VISITORS<OF<THE<MANIFEST"), pad(`${String(total).padStart(6, "0")}<<SCAN<IT<ON<THE<WORK<PAGE`)];
}

/**
 * The visitors' passport (docs/design.md §2.18). A data page first (the holder is everyone
 * who scanned the manifest), then visa pages of rubber stamps, newest first, six to a page,
 * loosely scattered and tilted like real entry stamps. Server-rendered; only the "that's you"
 * marker for someone who just signed runs on the client.
 */
export function Passport({ entries, total }: { entries: VisitorEntry[]; total: number }) {
  // Pages fill from the first stamp, like a real passport (so a stamp never moves page); they're
  // shown newest first, which puts the page that still has room on top.
  const oldestFirst = [...entries].sort((a, b) => a.n - b.n);
  const pages: VisitorEntry[][] = [];
  for (let i = 0; i < oldestFirst.length; i += PER_PAGE) pages.push(oldestFirst.slice(i, i + PER_PAGE));
  const pageCount = Math.max(1, pages.length);
  const newestFirst = pages.map((page, i) => ({ number: i + 1, stamps: [...page].reverse() })).reverse();
  const [mrz1, mrz2] = mrz(total);

  return (
    <div className="passport">
      {/* The data page. */}
      <section className="passport-page passport-data" aria-labelledby="passport-data-title">
        <h2 id="passport-data-title" className="passport-kicker">
          <span>Passport · Passeport</span>
          <span>iteshxt.me</span>
        </h2>
        <div className="mt-6 flex gap-5">
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
            <div>
              <dt>Issued by</dt>
              <dd>The Work page&apos;s shipping manifest</dd>
            </div>
          </dl>
        </div>
        <p className="passport-how">
          To get your stamp, scan the QR code at the bottom of the manifest on the{" "}
          <TransitionLink href="/work" transitionLabel="Work" className="underline decoration-dotted underline-offset-2">
            Work page
          </TransitionLink>{" "}
          with your phone, then sign the arrival card.
        </p>
        <p className="passport-mrz" aria-hidden="true">
          <span>{mrz1}</span>
          <span>{mrz2}</span>
        </p>
      </section>

      {/* The visa pages. */}
      {pages.length === 0 ? (
        <section className="passport-page" aria-labelledby="passport-visas-1">
          <h2 id="passport-visas-1" className="passport-kicker">
            <span>Visas</span>
            <span>
              <span className="sr-only">page </span>01
            </span>
          </h2>
          <TransitionLink href="/work" transitionLabel="Work" className="passport-empty">
            <span className="font-hand text-[24px] leading-tight">your stamp here</span>
            <span className="mt-1 text-[13px]">scan the manifest on the Work page →</span>
          </TransitionLink>
        </section>
      ) : (
        newestFirst.map(({ number, stamps }) => (
          <section key={number} className="passport-page" aria-labelledby={`passport-visas-${number}`}>
            <h2 id={`passport-visas-${number}`} className="passport-kicker">
              <span>Visas</span>
              <span>
                <span className="sr-only">page </span>
                {String(number).padStart(2, "0")}
              </span>
            </h2>
            <ol className="passport-stamps">
              {stamps.map((entry) => {
                const { x, y } = scatter(entry.n);
                return (
                  <li key={entry.id} data-stamp={entry.id} className="passport-slot" style={{ "--x": `${x}px`, "--y": `${y}px` } as CSSProperties}>
                    <span className="sr-only">
                      Visitor {visitorNo(entry.n)}: {entry.name}
                      {entry.line ? `, “${entry.line}”` : ""}
                    </span>
                    <div aria-hidden="true">
                      <PassportStamp entry={entry} />
                    </div>
                  </li>
                );
              })}
            </ol>
            {number === pageCount && stamps.length < PER_PAGE && (
              <TransitionLink href="/work" transitionLabel="Work" className="passport-empty passport-empty-slot">
                <span className="font-hand text-[22px] leading-tight">your stamp here</span>
                <span className="mt-1 text-[12px]">scan the manifest on the Work page →</span>
              </TransitionLink>
            )}
          </section>
        ))
      )}
      <YouMarker />
    </div>
  );
}
