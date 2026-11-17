import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { type ReactNode, Suspense } from "react";
import { STICKERS } from "@/lib/arcee/stickers";
import { verifyHideToken } from "@/lib/visitors/hide-token";
import { getVisitor } from "@/lib/visitors/store";
import { visitorNo } from "@/lib/visitors/types";

export const metadata: Metadata = {
  title: "Hide a stamp",
  description: "Take a stamp off the visitors' passport.",
  robots: { index: false, follow: false },
  // The link carries the hide token: don't hand it to anyone through the Referer header.
  referrer: "no-referrer",
};

/** Request-time only (it reads the link's id and token), like /s/[code]. */
export const instant = false;

/**
 * Where the new-stamp email's hide link lands (docs/design.md §2.18). Opening it hides
 * nothing (mail scanners pre-fetch links): it shows the stamp and asks, and only the
 * button, a POST to /api/visitors/hide, takes it off the passport.
 */
export default function HideStampPage({ searchParams }: PageProps<"/visitors/hide">) {
  return (
    <Suspense fallback={<main className="flex-1" />}>
      <HideBody searchParams={searchParams} />
    </Suspense>
  );
}

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

async function HideBody({ searchParams }: { searchParams: PageProps<"/visitors/hide">["searchParams"] }) {
  const sp = await searchParams;
  if (one(sp.done) === "1") {
    return (
      <Shell title="Hidden. It's gone from the passport.">
        <Link href="/visitors" className="btn btn-ink mt-8">
          Back to the passport
        </Link>
      </Shell>
    );
  }

  const id = one(sp.id);
  const t = one(sp.t);
  if (!id || !t || !verifyHideToken(id, t)) {
    return <Shell title="This hide link doesn't work." note="It may be incomplete, or the signing key has changed." />;
  }
  const entry = await getVisitor(id).catch(() => null);
  if (!entry) return <Shell title="That stamp is already off the passport." />;

  return (
    <Shell title="Hide this stamp?" note="It comes off the passport for everyone. It's kept aside, not deleted.">
      <figure className="mt-8 flex w-full max-w-[420px] items-center gap-4 rounded-[22px] border border-line bg-surface p-5 text-left">
        <Image src={STICKERS[entry.cat].still} alt={STICKERS[entry.cat].alt} width={72} height={72} className="size-[72px] shrink-0 rounded-[14px] object-cover" />
        <figcaption className="min-w-0">
          <p className="font-mono text-[11px] tracking-[0.18em] text-fg-muted uppercase">Visitor No. {visitorNo(entry.n)}</p>
          <p className="mt-1 text-[22px] leading-tight font-semibold tracking-[-0.03em] break-words">{entry.name}</p>
          {entry.line ? <p className="mt-1 text-[15px] break-words text-fg-muted">{entry.line}</p> : null}
        </figcaption>
      </figure>
      <form method="post" action="/api/visitors/hide" className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <input type="hidden" name="id" value={entry.id} />
        <input type="hidden" name="t" value={t} />
        <button type="submit" className="btn btn-ink">
          Hide this stamp
        </button>
        <Link href="/visitors" className="btn btn-paper">
          Keep it
        </Link>
      </form>
    </Shell>
  );
}

function Shell({ title, note, children }: { title: string; note?: string; children?: ReactNode }) {
  return (
    <main className="faded-mat px-gutter flex flex-1 flex-col items-center justify-center pt-24 pb-32 text-center">
      <p className="font-serif text-[clamp(20px,1.9vw,28px)] text-fg-muted italic">The visitors&rsquo; passport</p>
      <h1 className="mt-2 max-w-[20ch] text-[clamp(32px,4vw,56px)] leading-[1.05] font-semibold tracking-[-0.045em] text-balance">{title}</h1>
      {note ? <p className="mt-4 max-w-[44ch] text-fg-muted">{note}</p> : null}
      {children}
    </main>
  );
}
