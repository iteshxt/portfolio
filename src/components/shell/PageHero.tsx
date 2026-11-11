import type { ReactNode } from "react";
import type { PageCopy } from "@/content/pages";
import { ShiftHeadline } from "@/components/type/ShiftHeadline";

/** Top of an inner page: the two-line headline, centred, with optional lead text. */
export function PageHero({ copy, children }: { copy: PageCopy; children?: ReactNode }) {
  return (
    <section className="px-gutter flex min-h-[72svh] flex-col items-center justify-center gap-8 pt-28 pb-16 text-center">
      <ShiftHeadline copy={copy} />
      {children && <div className="max-w-xl text-[clamp(17px,1.5vw,21px)] text-fg-muted">{children}</div>}
    </section>
  );
}
