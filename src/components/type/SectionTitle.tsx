import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Section heading in the home hero's voice (docs/design.md §2.5): a small serif
 * italic kicker over one sentence-case line, usually with a word sticker in it.
 * `inverse` for coloured blocks (keeps the kicker at full contrast).
 */
export function SectionTitle({
  kicker,
  children,
  inverse = false,
  className,
}: {
  kicker?: string;
  children: ReactNode;
  inverse?: boolean;
  className?: string;
}) {
  return (
    <header className={cn("flex flex-col gap-3", className)}>
      {kicker && (
        <p data-animate="rise" className={cn("font-serif text-[clamp(18px,1.7vw,24px)] italic", !inverse && "text-fg-muted")}>
          {kicker}
        </p>
      )}
      <h2 data-animate="rise" style={{ "--d": "90ms" } as CSSProperties} className="max-w-[20ch] text-[clamp(34px,4.6vw,68px)] leading-[1.14] font-semibold tracking-[-0.04em] text-balance [font-variation-settings:'wdth'_82]">
        {children}
      </h2>
    </header>
  );
}
