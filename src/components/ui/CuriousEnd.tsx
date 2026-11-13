import type { ReactNode } from "react";
import { OpenArceeButton } from "@/components/arcee/OpenArceeButton";
import { ArrowRight, Spark } from "@/components/icons";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { SectionTitle } from "@/components/type/SectionTitle";

/**
 * The end of a work page or case file (docs/design.md §2.10): below a dashed
 * tear line, a nudge to ask Arcee (the site's own AI) about the work, or to
 * meet the person behind it. Not a contact block; that belongs to the home page.
 */
export function CuriousEnd({ kicker, title, seed, className }: { kicker: string; title: ReactNode; seed: string; className?: string }) {
  return (
    <section data-section={kicker} className={className ?? "px-gutter pt-[clamp(24px,4vw,48px)] pb-[clamp(110px,12vw,170px)]"}>
      <div className="mx-auto flex max-w-[1320px] flex-col items-start gap-8 border-t-2 border-dashed border-line pt-[clamp(40px,6vw,80px)] md:flex-row md:items-end md:justify-between">
        <SectionTitle kicker={kicker}>{title}</SectionTitle>
        <div className="flex flex-wrap gap-3">
          <OpenArceeButton seed={seed} className="btn btn-lime">
            <Spark />
            Ask Arcee about it
          </OpenArceeButton>
          <TransitionLink href="/about" transitionLabel="About" className="btn btn-paper">
            The person behind it
            <ArrowRight />
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}
