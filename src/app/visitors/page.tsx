import type { Metadata } from "next";
import { Suspense } from "react";
import { ArrowRight } from "@/components/icons";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { PassportBook } from "@/components/visitors/PassportBook";
import { PassportStamp, visitorNo } from "@/components/visitors/PassportStamp";
import { pageMetadata } from "@/lib/metadata";
import { cachedVisitors } from "@/lib/visitors/cached";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Visitors' passport",
    description: "Everyone who scanned the shipping manifest's barcode and got stamped in.",
    path: "/visitors",
  }),
  // Visitors' names are theirs: keep this page out of search results.
  robots: { index: false, follow: true },
};

/**
 * The visitors' passport (docs/design.md §2.18): everyone who scanned the barcode on the Work
 * page's manifest and signed the arrival card, as stamps in a passport book that opens and turns
 * as you scroll.
 */
export default function VisitorsPage() {
  return (
    <main className="faded-mat flex-1 pb-28">
      <section data-section="Visitors" className="px-gutter pt-28 pb-6">
        <div className="mx-auto grid max-w-[1180px] items-center gap-10 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <p data-animate="rise" className="font-mono text-[13px] tracking-[0.16em] text-fg-muted uppercase">
              The visitors&apos; passport
            </p>
            <h1
              data-animate="rise"
              className="mt-2 text-[clamp(44px,7vw,92px)] leading-[0.92] font-semibold tracking-[-0.045em] [font-variation-settings:'wdth'_78]"
            >
              Proof you were <span className="passport-here">here</span>.
            </h1>
            <p data-animate="rise" className="mt-5 max-w-[52ch] text-[17px] leading-relaxed text-fg-muted">
              Scan the barcode at the bottom of the shipping manifest, sign the arrival card, and you get a stamp in this book: your name, why you came, the cat
              that looks most like you, and the day and time you arrived.
            </p>
            <div data-animate="rise" className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
              <TransitionLink href="/work" transitionLabel="Work" className="btn btn-ink">
                Get your stamp
                <ArrowRight />
              </TransitionLink>
              <Suspense fallback={<span className="font-mono text-[13px] text-fg-muted">&nbsp;</span>}>
                <Tally />
              </Suspense>
            </div>
          </div>
          <Suspense fallback={null}>
            <Latest />
          </Suspense>
        </div>
      </section>
      <Suspense fallback={<div className="book-loading passport-page" aria-label="Opening the passport…" />}>
        <Book />
      </Suspense>
    </main>
  );
}

/** "11 stamps so far · newest No. 0011, Aisha" under the intro. */
async function Tally() {
  const { entries, total } = await cachedVisitors();
  const newest = entries.reduce<(typeof entries)[number] | null>((a, e) => (!a || e.n > a.n ? e : a), null);
  return (
    <p className="font-mono text-[13px] tracking-[0.08em] text-fg-muted uppercase">
      {total === 0 ? "No stamps yet. Be the first." : `${total} ${total === 1 ? "stamp" : "stamps"} so far`}
      {newest && (
        <>
          {" "}
          · newest {visitorNo(newest.n)}, <span className="normal-case">{newest.name}</span>
        </>
      )}
    </p>
  );
}

/** Beside the intro on wide screens: the newest stamp, taped on like a souvenir (a blank one before anyone signs). */
async function Latest() {
  const { entries } = await cachedVisitors();
  const newest = entries.reduce<(typeof entries)[number] | null>((a, e) => (!a || e.n > a.n ? e : a), null);
  return (
    <figure data-animate="rise" className="passport-latest passport-paper hidden lg:grid" aria-hidden="true">
      {newest ? <PassportStamp entry={{ ...newest, id: `latest-${newest.id}` }} /> : <PassportStamp entry={{ n: 1, name: "", line: "" }} draft />}
      <figcaption className="passport-latest-label">{newest ? "latest arrival" : "yours could be first"}</figcaption>
    </figure>
  );
}

async function Book() {
  const { entries, total } = await cachedVisitors();
  return <PassportBook entries={entries} total={total} />;
}
