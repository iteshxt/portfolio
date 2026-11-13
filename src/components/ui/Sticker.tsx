"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useFlick } from "@/lib/flick";

/** Die-cut sticker chip (docs/design.md §8): white border, slight tilt, soft shadow. Flickable. */
const TONES = {
  lime: "bg-lime text-[#2B3600]",
  sunflower: "bg-sunflower text-[#4A3A00]",
  lavender: "bg-lavender text-violet-ink",
  violet: "bg-violet text-white",
  tomato: "bg-tomato text-[#2A0700]",
  paper: "bg-paper text-ink",
} as const;

export type StickerTone = keyof typeof TONES;

const SIZES = {
  /** A label chip. */
  chip: "gap-2 rounded-full border-[3px] px-4 py-1.5 text-[15px] font-medium",
  /** A word inside running text, sized from the surrounding font. */
  word: "rounded-[0.28em] border-[0.07em] px-[0.26em] pb-[0.04em] leading-[1.05]",
} as const;

export function Sticker({
  tone = "lime",
  tilt = 0,
  size = "chip",
  className,
  children,
}: {
  tone?: StickerTone;
  tilt?: number;
  size?: keyof typeof SIZES;
  className?: string;
  children: ReactNode;
}) {
  const ref = useFlick<HTMLSpanElement>();
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center border-white shadow-[0_6px_18px_-8px_rgb(0_0_0/0.35)] transition-[scale] duration-300 ease-[var(--ease-expo-out)] will-change-transform hover:scale-105",
        SIZES[size],
        TONES[tone],
        className,
      )}
      style={{ rotate: `${tilt}deg` }}
    >
      {children}
    </span>
  );
}
