import type { Metadata } from "next";
import { Suspense } from "react";
import { Passport } from "@/components/visitors/Passport";
import { pageMetadata } from "@/lib/metadata";
import { cachedVisitors } from "@/lib/visitors/cached";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Visitors' passport",
    description: "Everyone who scanned the shipping manifest and got stamped in.",
    path: "/visitors",
  }),
  // Visitors' names are theirs: keep this page out of search results.
  robots: { index: false, follow: true },
};

/**
 * The visitors' passport (docs/design.md §2.18): everyone who scanned the manifest's QR
 * code on the Work page and signed the arrival card, as stamps in a passport.
 */
export default function VisitorsPage() {
  return (
    <main className="faded-mat flex-1">
      <section data-section="Visitors" className="px-gutter pt-28 pb-36">
        <div className="mx-auto max-w-[1040px]">
          <p data-animate="rise" className="font-mono text-[13px] tracking-[0.16em] text-fg-muted uppercase">
            The visitors&apos; passport
          </p>
          <h1 data-animate="rise" className="mt-2 max-w-[16ch] text-[clamp(40px,6vw,76px)] leading-[0.92] font-semibold tracking-[-0.045em] [font-variation-settings:'wdth'_78]">
            Stamped in, one scan at a time.
          </h1>
          <p data-animate="rise" className="mt-4 max-w-[46ch] text-fg-muted">
            Everyone who scanned the QR code on the shipping manifest and signed the arrival card. Each stamp is a name, a reason for visit and the cat they picked.
          </p>
          <div className="mt-12">
            <Suspense fallback={<div className="passport-page passport-loading" aria-label="Opening the passport…" />}>
              <PassportBook />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}

async function PassportBook() {
  const { entries, total } = await cachedVisitors();
  return <Passport entries={entries} total={total} />;
}
