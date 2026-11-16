"use client";

import { usePathname } from "next/navigation";
import { ArrowUpRight, Close } from "@/components/icons";
import { useTransitionGo } from "@/components/transition/TransitionProvider";
import { useUI } from "@/store/ui";
import { ArceeChat, ArceeStamp } from "./ArceeChat";

/**
 * The floating Arcee chat (docs/design.md §2.8): a die-cut sheet that slaps up out
 * of the "Where to?" pill. A paper header with Arcee's ring as a postage stamp,
 * the conversation on a cutting mat, and an ink composer like the navigator's
 * field. "Open full page" moves the same conversation to /arcee (not shown there).
 */
export function ArceePanel() {
  const open = useUI((s) => s.arceeOpen);
  const close = useUI((s) => s.closeArcee);
  const go = useTransitionGo();
  const pathname = usePathname();
  if (pathname === "/arcee") return null;

  return (
    <div
      role="dialog"
      aria-label="Chat with Arcee"
      aria-modal="false"
      data-open={open}
      data-lenis-prevent=""
      inert={!open}
      className="arcee-panel fixed bottom-[86px] left-1/2 z-[55] flex h-[min(70vh,620px)] w-[min(440px,calc(100vw-24px))] flex-col overflow-hidden rounded-[30px] border-[5px] border-[var(--die)] bg-bg text-fg"
    >
      <header className="relative flex items-center gap-3.5 border-b-2 border-dashed border-line bg-surface px-4 pt-4 pb-3.5">
        <ArceeStamp className="size-12" />
        <div className="min-w-0 flex-1">
          <p className="text-[24px] leading-none font-semibold tracking-[-0.04em] [font-variation-settings:'wdth'_80]">Arcee</p>
          <p className="mt-1 flex items-center gap-1.5 truncate text-[13px] text-fg-muted">
            <span className="relative flex size-2 shrink-0">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime opacity-70 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-[#7bd600]" />
            </span>
            The site&rsquo;s guide · answers in cats
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            close();
            go("/arcee", { label: "Arcee" });
          }}
          aria-label="Open Arcee full page"
          data-cursor="Full page"
          className="arcee-panel-btn"
        >
          <ArrowUpRight />
        </button>
        <button type="button" onClick={close} aria-label="Close chat" data-cursor="Close" className="arcee-panel-btn">
          <Close />
        </button>
      </header>
      <ArceeChat active={open} />
    </div>
  );
}
