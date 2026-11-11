import type { ReactNode } from "react";
import type { PageCopy } from "@/content/pages";
import { ShiftHeadline } from "@/components/type/ShiftHeadline";

/** Hero-only page frame used while the real pages are being built. */
export function PageShell({ copy, cycle, children }: { copy: PageCopy; cycle?: boolean; children?: ReactNode }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-[clamp(16px,4vw,48px)] pt-28 pb-40 text-center">
      <ShiftHeadline copy={copy} cycle={cycle} />
      {children && <div className="max-w-md text-fg-muted">{children}</div>}
    </main>
  );
}
