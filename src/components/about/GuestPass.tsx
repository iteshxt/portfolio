import type { CSSProperties } from "react";
import { ArrowUpRight } from "@/components/icons";
import type { Experience } from "@/content/profile";
import { cn } from "@/lib/cn";

const BANDS = ["bg-lavender text-violet-ink", "bg-lime text-[#2B3600]", "bg-sunflower text-[#4A3A00]"];
const STRAPS = ["bg-violet text-white", "bg-ink text-lime", "bg-ink text-sunflower"];

/**
 * Where he's worked, as die-cut badges on lanyards (docs/design.md §2.12):
 * as they scroll in, the strap drops in first, then the pass falls onto its clip
 * and swings to rest. A coloured band with the company, then the role, the
 * dates and what was shipped.
 */
export function GuestPasses({ items }: { items: Experience[] }) {
  return (
    <ul className="grid gap-[clamp(28px,4vw,48px)] md:grid-cols-2">
      {items.map((job, i) => (
        <li key={job.company} data-animate="lanyard" style={{ "--d": `${i * 180}ms` } as CSSProperties} className="pass-slot relative pt-[calc(clamp(96px,9.6vw,134px)+14px)]">
          {/* The lanyard: a printed strap from above, ending in a metal clip on the pass. */}
          <span aria-hidden="true" className="lanyard pointer-events-none absolute top-0 left-1/2 flex -translate-x-1/2 flex-col items-center">
            <span className={cn("lanyard-strap flex h-[clamp(96px,9.6vw,134px)] w-[26px] justify-center overflow-hidden rounded-b-[4px]", STRAPS[i % STRAPS.length])}>
              <span className="font-mono text-[10px] leading-none font-semibold tracking-[0.25em] whitespace-nowrap uppercase [writing-mode:vertical-rl]">
                {`${job.company} · `.repeat(3)}
              </span>
            </span>
            <span className="lanyard-clip" />
          </span>
          <article className="pass relative flex h-full flex-col overflow-hidden rounded-[24px] border-[5px] border-[var(--die)] bg-surface shadow-[0_26px_50px_-30px_rgb(0_0_0/0.5)]">
            <div className={cn("relative px-6 pt-10 pb-5", BANDS[i % BANDS.length])}>
              <span aria-hidden="true" className="pass-hole absolute top-4 left-1/2 h-3.5 w-16 -translate-x-1/2 rounded-full" />
              <p className="font-serif text-[clamp(18px,1.6vw,22px)] italic opacity-85">I worked for</p>
              <h3 className="mt-1 text-[clamp(34px,3.6vw,52px)] leading-[0.95] font-semibold tracking-[-0.045em] [font-variation-settings:'wdth'_80]">{job.company}</h3>
            </div>
            <div className="flex flex-1 flex-col gap-5 p-6">
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="font-mono text-[11px] tracking-wider text-fg-muted uppercase">As</dt>
                  <dd className="mt-0.5 text-[16px] font-medium leading-snug">{job.role}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] tracking-wider text-fg-muted uppercase">When</dt>
                  <dd className="mt-0.5 text-[16px] font-medium leading-snug">{job.period}</dd>
                </div>
              </dl>
              <ul className="flex flex-col gap-2.5 border-t border-dashed border-line pt-5 text-[15px] leading-snug text-fg-muted">
                {[...job.day, ...job.night].map((line) => (
                  <li key={line} className="flex gap-2.5">
                    <span aria-hidden="true" className="mt-[7px] size-1.5 shrink-0 rounded-full bg-violet" />
                    {line}
                  </li>
                ))}
              </ul>
              {job.link && (
                <a href={job.link} target="_blank" rel="noreferrer" className="mt-auto inline-flex w-fit items-center gap-1 text-[15px] font-semibold">
                  {job.link.replace(/^https?:\/\//, "")} <ArrowUpRight className="text-[13px]" />
                </a>
              )}
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
