import type { CSSProperties } from "react";
import { ArrowUpRight } from "@/components/icons";
import type { Experience } from "@/content/profile";
import { cn } from "@/lib/cn";

const BANDS = ["bg-lavender text-violet-ink", "bg-lime text-[#2B3600]", "bg-sunflower text-[#4A3A00]"];
/** Strap colours: [ribbon, stitching]. */
const STRAPS: [string, string][] = [
  ["var(--violet)", "rgb(255 255 255 / 0.55)"],
  ["#17171c", "var(--lime)"],
  ["#17171c", "var(--sunflower)"],
];

/**
 * A lanyard: two ribbons coming in from the left and right in loose curls, meeting
 * at a metal clip that holds the badge. The ribbons draw themselves in from their
 * far ends (a mask), then the badge drops onto the clip.
 */
function Lanyard({ i }: { i: number }) {
  const [ribbon, stitch] = STRAPS[i % STRAPS.length];
  const left = "M-6 6 C 60 4, 40 70, 96 74 S 150 60, 164 112 S 176 146, 180 158";
  const right = "M366 6 C 300 4, 320 70, 264 74 S 210 60, 196 112 S 184 146, 180 158";
  return (
    <span aria-hidden="true" className="lanyard pointer-events-none absolute top-0 left-1/2 block w-[360px] -translate-x-1/2">
      <svg viewBox="0 0 360 160" className="block h-auto w-full overflow-visible">
        <defs>
          <mask id={`lanyard-mask-${i}`} maskUnits="userSpaceOnUse" x="-20" y="-20" width="400" height="200">
            <path className="lanyard-draw" pathLength={1} d={left} stroke="#fff" strokeWidth="26" fill="none" />
            <path className="lanyard-draw" pathLength={1} d={right} stroke="#fff" strokeWidth="26" fill="none" />
          </mask>
        </defs>
        <g mask={`url(#lanyard-mask-${i})`} fill="none" strokeLinecap="butt">
          {[left, right].map((d) => (
            <g key={d}>
              <path d={d} stroke="rgb(0 0 0 / 0.18)" strokeWidth="18" transform="translate(2 4)" />
              <path d={d} stroke={ribbon} strokeWidth="16" />
              <path d={d} stroke={stitch} strokeWidth="1.4" strokeDasharray="3 4" />
            </g>
          ))}
        </g>
      </svg>
      <span className="lanyard-clip absolute left-1/2 -translate-x-1/2" />
    </span>
  );
}

/**
 * Where he's worked, as staff badges on lanyards (docs/design.md §2.12): as they
 * scroll in, the lanyard curls in from both sides, then the badge drops onto its
 * clip and swings to rest. "I worked for", the company, then the role, the dates
 * and what was shipped.
 */
export function GuestPasses({ items }: { items: Experience[] }) {
  return (
    <ul className="grid gap-[clamp(28px,4vw,48px)] md:grid-cols-2">
      {items.map((job, i) => (
        <li key={job.company} data-animate="lanyard" style={{ "--d": `${i * 200}ms` } as CSSProperties} className="pass-slot relative pt-[150px]">
          <Lanyard i={i} />
          <article className="pass relative flex h-full flex-col overflow-hidden rounded-[24px] border-[5px] border-[var(--die)] bg-surface shadow-[0_26px_50px_-30px_rgb(0_0_0/0.5)]">
            <div className={cn("relative px-6 pt-9 pb-5", BANDS[i % BANDS.length])}>
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
