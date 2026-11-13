"use client";

import { usePathname } from "next/navigation";
import { ArrowUpRight, Close } from "@/components/icons";
import { useTransitionGo } from "@/components/transition/TransitionProvider";
import { cn } from "@/lib/cn";
import { useUI } from "@/store/ui";
import { ArceeChat, ArceeStamp } from "./ArceeChat";

/**
 * The floating Arcee panel above the nav bar (docs/prd.md §6.4): a sticker panel
 * with Arcee's own dark header and its animated ring. "Open full page" moves the
 * same conversation to /arcee. Not shown on /arcee itself.
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
      className={cn(
        "fixed bottom-[84px] left-1/2 z-[55] flex h-[min(68vh,600px)] w-[min(460px,calc(100vw-24px))] -translate-x-1/2 flex-col overflow-hidden rounded-[28px] border-[4px] border-white bg-surface text-fg shadow-[0_30px_80px_-30px_rgb(0_0_0/0.55)] transition-[opacity,translate] duration-300 ease-[var(--ease-expo-out)]",
        open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <header className="flex items-center gap-3 bg-arcee-deep px-4 py-3 text-paper">
        <ArceeStamp className="size-11 rounded-full border-2 border-arcee/60" />
        <div className="min-w-0 flex-1">
          <p className="text-[17px] leading-tight font-semibold tracking-[-0.01em] text-arcee">Arcee</p>
          <p className="truncate text-[13px] text-paper/80">The site&apos;s guide. Ask about Itesh&apos;s work.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            close();
            go("/arcee", { label: "Arcee" });
          }}
          aria-label="Open Arcee full page"
          data-cursor="Full page"
          className="flex size-9 items-center justify-center rounded-full text-[17px] text-paper/80 hover:bg-white/10 hover:text-paper"
        >
          <ArrowUpRight />
        </button>
        <button type="button" onClick={close} aria-label="Close chat" className="flex size-9 items-center justify-center rounded-full text-[18px] text-paper/80 hover:bg-white/10 hover:text-paper">
          <Close />
        </button>
      </header>
      <ArceeChat variant="panel" active={open} />
    </div>
  );
}
