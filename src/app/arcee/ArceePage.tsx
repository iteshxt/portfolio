"use client";

import { ArceeChat, ArceeStamp } from "@/components/arcee/ArceeChat";

/**
 * The full-page Arcee (docs/design.md §2.13): the page itself is the
 * conversation (the same one as the floating panel), with the message box
 * docked at the bottom. What Arcee knows and what to try live in its opening postcard.
 */
export function ArceePage() {
  return (
    <div className="mx-auto flex w-full max-w-[760px] flex-col gap-8">
      <div data-animate="rise" className="flex items-center gap-4">
        <ArceeStamp className="size-14 rounded-full border-[3px] border-white shadow-[0_8px_18px_-10px_rgb(0_0_0/0.5)]" />
        <div>
          <h1 className="text-[clamp(30px,3.6vw,48px)] leading-none font-semibold tracking-[-0.04em] [font-variation-settings:'wdth'_82]">
            Ask Arcee
          </h1>
          <p className="mt-1.5 text-fg-muted">The site&apos;s guide. It answers from what&apos;s on this site.</p>
        </div>
      </div>
      <ArceeChat variant="page" active />
    </div>
  );
}
