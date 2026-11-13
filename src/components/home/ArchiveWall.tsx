"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { ArrowUpRight } from "@/components/icons";
import { Scribble } from "@/components/motion/Scribble";
import { CATEGORY_LABELS, type Project, type ProjectCategory } from "@/content/projects";
import { cn } from "@/lib/cn";

const TONES = [
  "bg-lime text-[#2B3600]",
  "bg-surface text-fg",
  "bg-sunflower text-[#4A3A00]",
  "bg-lavender text-violet-ink",
  "bg-tomato text-[#2A0700]",
];
const TILTS = [-0.8, 0.6, -0.4, 0.8, -0.6, 0.4];
const FIRST = 8;

/**
 * Archive projects as a wall of die-cut stickers (docs/design.md §2.10): category
 * chips filter it; each sticker has its live and GitHub links, and straightens
 * and lifts on hover. First 8, then "Show all".
 */
export function ArchiveWall({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<ProjectCategory | "all">("all");
  const [all, setAll] = useState(false);

  const cats = useMemo(() => {
    const counts = new Map<ProjectCategory, number>();
    for (const p of projects) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    return [...counts.entries()];
  }, [projects]);
  const shown = projects.filter((p) => filter === "all" || p.category === filter);
  const visible = all ? shown : shown.slice(0, FIRST);

  return (
    <div className="mt-10">
      <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2.5">
        {[["all", projects.length] as const, ...cats].map(([key, count]) => (
          <button
            key={key}
            type="button"
            aria-pressed={filter === key}
            onClick={() => {
              setFilter(key);
              setAll(false);
            }}
            className={cn("filter-chip", filter === key && "is-on")}
          >
            {key === "all" ? "All" : CATEGORY_LABELS[key]} <span className="font-normal">{count}</span>
          </button>
        ))}
      </div>

      <ul className="mt-10 grid gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((p, i) => (
          <li key={`${filter}-${p.slug}`} data-animate="slap" style={{ "--d": `${(i % 4) * 60}ms` } as CSSProperties}>
            <article
              style={{ "--tilt": `${TILTS[i % TILTS.length]}deg` } as CSSProperties}
              className={cn("wall-sticker flex h-full flex-col gap-3 rounded-[22px] border-[5px] border-white p-5", TONES[i % TONES.length])}
            >
              <span className="text-[12px] font-semibold tracking-wide uppercase">
                {CATEGORY_LABELS[p.category]} · {p.year}
              </span>
              <h3 className="text-[30px] leading-none font-semibold tracking-[-0.04em] [font-variation-settings:'wdth'_82]">{p.name}</h3>
              <p className="text-[14px] leading-snug">{p.day}</p>
              <p className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-1 text-[13px] font-semibold">
                {p.links.live && (
                  <a href={p.links.live} target="_blank" rel="noreferrer" data-cursor="Live" className="inline-flex items-center gap-1">
                    <Scribble>Live</Scribble> <ArrowUpRight />
                  </a>
                )}
                {p.links.repo && (
                  <a href={p.links.repo} target="_blank" rel="noreferrer" data-cursor="Code" className="inline-flex items-center gap-1">
                    <Scribble>GitHub</Scribble> <ArrowUpRight />
                  </a>
                )}
              </p>
            </article>
          </li>
        ))}
      </ul>

      {shown.length > FIRST && (
        <button type="button" onClick={() => setAll((v) => !v)} className="btn btn-paper mt-10">
          {all ? "Show fewer" : `Show all ${shown.length}`}
        </button>
      )}
    </div>
  );
}
