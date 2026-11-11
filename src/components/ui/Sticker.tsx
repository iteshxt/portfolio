import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Die-cut sticker chip (docs/design.md §8): white border, slight tilt, soft shadow. */
const TONES = {
  lime: "bg-lime text-[#2B3600]",
  sunflower: "bg-sunflower text-[#4A3A00]",
  lavender: "bg-lavender text-violet-ink",
  violet: "bg-violet text-white",
  tomato: "bg-tomato text-[#2A0700]",
  paper: "bg-paper text-ink",
} as const;

export type StickerTone = keyof typeof TONES;

export function Sticker({
  tone = "lime",
  tilt = 0,
  className,
  children,
}: {
  tone?: StickerTone;
  tilt?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border-[3px] border-white px-4 py-1.5 text-[15px] font-medium shadow-[0_6px_18px_-8px_rgb(0_0_0/0.35)] transition-transform duration-300 ease-[var(--ease-expo-out)] hover:scale-105 hover:rotate-0",
        TONES[tone],
        className,
      )}
      style={{ rotate: `${tilt}deg` }}
    >
      {children}
    </span>
  );
}
