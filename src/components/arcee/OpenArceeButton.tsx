"use client";

import type { ReactNode } from "react";
import { useUI } from "@/store/ui";

/** Opens the Arcee chat, optionally asking a first question. */
export function OpenArceeButton({ seed, className, children }: { seed?: string; className?: string; children: ReactNode }) {
  return (
    <button type="button" onClick={() => useUI.getState().openArcee(seed)} className={className}>
      {children}
    </button>
  );
}
