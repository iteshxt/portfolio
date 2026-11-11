"use client";

import Link from "next/link";
import { useEffect } from "react";

/** Runtime error boundary for pages: on-brand, with a way to try again. */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="px-gutter flex flex-1 flex-col items-center justify-center gap-6 pt-28 pb-40 text-center">
      <p className="font-serif text-[clamp(18px,1.8vw,24px)] text-fg-muted">Something broke</p>
      <h1 className="flex flex-col items-center">
        <span className="display-sans text-[clamp(56px,12vw,180px)]">Well,</span>
        <span className="display-serif text-[clamp(44px,9vw,140px)] text-accent-text">that wasn&apos;t planned</span>
      </h1>
      <p className="max-w-md text-fg-muted">The night shift has been notified (it&apos;s just Itesh). Try again, or head home.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="min-h-11 rounded-full bg-violet px-5 font-medium text-white">
          Try again
        </button>
        <Link href="/" className="flex min-h-11 items-center rounded-full border border-fg px-5 font-medium">
          Go home
        </Link>
      </div>
    </main>
  );
}
