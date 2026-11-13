"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { ArrowUpRight } from "@/components/icons";
import { Scribble } from "@/components/motion/Scribble";
import { Sticker, type StickerTone } from "@/components/ui/Sticker";
import { CATEGORY_LABELS, type Project, type ProjectCategory } from "@/content/projects";
import { cn } from "@/lib/cn";

/** Each kind of project keeps one sticker colour across the shelf. */
const KIND_TONE: Record<ProjectCategory, StickerTone> = { ai: "lavender", web: "lime", mobile: "sunflower", tool: "tomato" };

/**
 * Everything else on the work page (docs/design.md §2.10): plain paper tiles on a
 * shelf, each tagged with a sticker for its kind, with the stack and the live and
 * GitHub links. Kind chips filter it. Tiles carry ids so the manifest can jump to them.
 */
export function ProjectShelf({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<ProjectCategory | "all">("all");
  const kinds = useMemo(() => {
    const counts = new Map<ProjectCategory, number>();
    for (const p of projects) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    return [...counts.entries()];
  }, [projects]);

  return (
    <div className="mt-10">
      <div role="group" aria-label="Filter by kind" className="flex flex-wrap gap-2.5">
        {[["all", projects.length] as const, ...kinds].map(([key, count]) => (
          <button key={key} type="button" aria-pressed={filter === key} onClick={() => setFilter(key)} className={cn("filter-chip", filter === key && "is-on")}>
            {key === "all" ? "All" : CATEGORY_LABELS[key]} <span className="font-normal">{count}</span>
          </button>
        ))}
      </div>

      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <li
            key={p.slug}
            id={`p-${p.slug}`}
            hidden={filter !== "all" && p.category !== filter}
            data-animate="rise"
            style={{ "--d": `${(i % 3) * 70}ms` } as CSSProperties}
            className="shelf-item scroll-mt-28"
          >
            <article className="shelf-tile flex h-full flex-col gap-4 rounded-[22px] border-[4px] border-[var(--die)] bg-surface p-6 shadow-[0_14px_30px_-20px_rgb(0_0_0/0.35)]">
              <div className="flex items-center justify-between gap-3">
                <Sticker tone={KIND_TONE[p.category]} className="px-3 py-0.5 text-[12px] font-semibold">
                  {CATEGORY_LABELS[p.category]}
                </Sticker>
                <span className="font-mono text-[12px] text-fg-muted">{p.year}</span>
              </div>
              <h3 className="text-[30px] leading-none font-semibold tracking-[-0.04em] [font-variation-settings:'wdth'_82]">{p.name}</h3>
              <p className="text-[15px] leading-snug text-fg-muted">{p.day}</p>
              <ul className="flex flex-wrap gap-1.5" aria-label="Stack">
                {p.stack.slice(0, 5).map((s) => (
                  <li key={s} className="rounded-full bg-bg px-2.5 py-0.5 text-[12px] text-fg-muted">
                    {s}
                  </li>
                ))}
              </ul>
              <p className="mt-auto flex flex-wrap gap-x-5 gap-y-1 pt-1 text-[14px] font-semibold">
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
    </div>
  );
}
