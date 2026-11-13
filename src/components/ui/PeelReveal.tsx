"use client";

import { useId, useState, type ReactNode } from "react";
import { Scribble } from "@/components/motion/Scribble";
import { cn } from "@/lib/cn";

/**
 * A sticker covering hidden details (docs/design.md §2.6): click or tap it and it
 * peels off to show what's underneath ("how it works" on star cards); "Stick it
 * back" covers it again. The details stay out of the accessibility tree until revealed.
 */
export function PeelReveal({
  label,
  eyebrow = "Hidden",
  cover,
  children,
  className,
}: {
  label: string;
  /** Small line above the label on the sticker. */
  eyebrow?: string;
  /** Colour classes for the sticker (background + text). */
  cover: string;
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className={cn("relative", className)}>
      <div id={id} inert={!open} aria-hidden={!open} className="rounded-2xl border border-line p-5">
        {children}
      </div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        tabIndex={open ? -1 : 0}
        onClick={() => setOpen(true)}
        data-cursor="Peel"
        className={cn("peel-cover absolute inset-0 flex flex-col justify-between rounded-2xl border-4 border-white p-5 text-left", cover, open && "is-peeled")}
      >
        <span className="font-mono text-[12px] tracking-wide uppercase opacity-80">{eyebrow}</span>
        <span className="text-[clamp(20px,1.8vw,26px)] leading-tight font-semibold tracking-[-0.02em]">{label}</span>
      </button>
      {open && (
        <button type="button" onClick={() => setOpen(false)} className="mt-3 text-[13px] font-medium opacity-80 hover:opacity-100">
          <Scribble>Stick it back</Scribble>
        </button>
      )}
    </div>
  );
}
