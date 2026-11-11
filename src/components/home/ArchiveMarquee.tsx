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
 * Archive projects as a drifting row of die-cut stickers. The list is doubled
 * for a seamless loop; it pauses on hover and stands still for reduced motion.
 */
export function ArchiveMarquee({ projects }: { projects: Project[] }) {
  const row = [...projects, ...projects];
  return (
    <div className="marquee group relative -mx-[clamp(16px,4vw,48px)] overflow-hidden py-10">
      <ul className="marquee-track flex w-max gap-5 group-hover:[animation-play-state:paused]">
        {row.map((p, i) => (
          <li
            key={`${p.slug}-${i}`}
            aria-hidden={i >= projects.length}
            className={cn(
              "flex w-[min(78vw,300px)] shrink-0 flex-col gap-3 rounded-[22px] border-[5px] border-white p-5 shadow-[0_14px_34px_-18px_rgb(0_0_0/0.45)]",
              TONES[i % TONES.length],
            )}
            style={{ rotate: `${[-3, 2, -1.5, 3, -2.5][i % 5]}deg` }}
          >
            <span className="text-[12px] font-semibold tracking-wide uppercase">
              {CATEGORY_LABELS[p.category]} · {p.year}
            </span>
            <span className="display-sans text-[38px]">{p.name}</span>
            <span className="text-[14px] leading-snug">
              <span className="day-only">{p.day}</span>
              <span className="night-only">{p.night}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
