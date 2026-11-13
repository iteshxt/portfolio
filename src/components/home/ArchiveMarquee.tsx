import { ArrowUpRight } from "@/components/icons";
import type { Project } from "@/content/projects";
import { CATEGORY_LABELS } from "@/content/projects";
import { cn } from "@/lib/cn";

const TONES = [
  "bg-lime text-[#2B3600]",
  "bg-paper text-ink",
  "bg-sunflower text-[#4A3A00]",
  "bg-lavender text-violet-ink",
  "bg-tomato text-[#2A0700]",
];

/**
 * Archive projects as a drifting row of die-cut stickers, each linking to the
 * live project (or its code when there's no live version). The list is doubled
 * for a seamless loop; the copy is hidden from screen readers and the tab
 * order. It pauses on hover or keyboard focus and stands still for reduced motion.
 */
export function ArchiveMarquee({ projects }: { projects: Project[] }) {
  const row = [...projects, ...projects];
  return (
    <div className="marquee group relative -mx-[clamp(16px,4vw,48px)] overflow-hidden py-10">
      <ul className="marquee-track flex w-max gap-5 group-focus-within:[animation-play-state:paused] group-hover:[animation-play-state:paused]">
        {row.map((p, i) => {
          const copy = i >= projects.length;
          const href = p.links.live ?? p.links.repo;
          return (
            <li key={`${p.slug}-${i}`} aria-hidden={copy || undefined} className="shrink-0" style={{ rotate: `${[-3, 2, -1.5, 3, -2.5][i % 5]}deg` }}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                tabIndex={copy ? -1 : undefined}
                className={cn(
                  "group/card flex h-full w-[min(78vw,300px)] flex-col gap-3 rounded-[22px] border-[5px] border-white p-5 shadow-[0_14px_34px_-18px_rgb(0_0_0/0.45)] transition-transform duration-300 ease-[var(--ease-expo-out)] hover:-translate-y-1.5 hover:scale-[1.02] focus-visible:-translate-y-1.5",
                  TONES[i % TONES.length],
                )}
              >
                <span className="text-[12px] font-semibold tracking-wide uppercase">
                  {CATEGORY_LABELS[p.category]} · {p.year}
                </span>
                <span className="display-sans text-[38px]">{p.name}</span>
                <span className="text-[14px] leading-snug">
                  <span className="day-only">{p.day}</span>
                  <span className="night-only">{p.night}</span>
                </span>
                <span className="mt-auto inline-flex items-center gap-1 pt-1 text-[13px] font-semibold">
                  {p.links.live ? "Live" : "Code"}
                  <ArrowUpRight className="transition-transform duration-300 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
