import type { ReactNode } from "react";
import { HeroBackdrop } from "@/components/home/HeroBackdrop";
import { ReactiveHeadline, type HeadlinePart } from "@/components/type/ReactiveHeadline";

/**
 * The top of an inner page, on the same lifted sheet as the home hero
 * (docs/design.md §2.4): a serif kicker, one statement with word stickers whose
 * letters swell towards the cursor, a short lead and optional actions. The sheet's
 * corner curls further as you scroll, and the content peels away with it.
 */
export function PageIntro({
  section,
  kicker,
  title,
  lead,
  children,
}: {
  /** Name shown in the status pill. */
  section: string;
  kicker: string;
  title: HeadlinePart[];
  lead?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section
      data-section={section}
      data-curl=""
      className="hero-peel px-gutter relative isolate flex min-h-[86svh] flex-col items-center justify-center pt-28 pb-32 text-center md:min-h-[80svh] md:pt-32 md:pb-28"
    >
      <HeroBackdrop />
      <div data-parallax="0.24" data-parallax-fade="" className="flex flex-col items-center">
        <p className="font-serif text-[clamp(20px,1.9vw,28px)] text-fg-muted italic">{kicker}</p>
        <ReactiveHeadline
          className="mt-4 max-w-[18ch] text-[clamp(38px,5vw,76px)] leading-[1.16] font-semibold tracking-[-0.04em] text-balance [font-variation-settings:'wdth'_82]"
          parts={title}
        />
        {lead && (
          <p className="mt-[clamp(20px,3vh,36px)] max-w-[52ch] text-[clamp(16px,1.3vw,19px)] leading-[1.55] text-balance text-fg-muted">
            {lead}
          </p>
        )}
        {children && <div className="mt-7 flex flex-wrap items-center justify-center gap-3">{children}</div>}
      </div>
    </section>
  );
}
