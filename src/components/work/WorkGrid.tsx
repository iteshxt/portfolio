"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight } from "@/components/icons";
import { CATEGORY_LABELS, type Project, type ProjectCategory } from "@/content/projects";
import { cn } from "@/lib/cn";

const FILTERS: Array<ProjectCategory | "all"> = ["all", "ai", "web", "mobile", "tool"];

/** Filterable archive grid (docs/prd.md §7.3). */
export function WorkGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<ProjectCategory | "all">("all");
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: projects.length };
    for (const p of projects) c[p.category] = (c[p.category] ?? 0) + 1;
    return c;
  }, [projects]);
  const shown = filter === "all" ? projects : projects.filter((p) => p.category === filter);

  return (
    <div>
      <div role="group" aria-label="Filter projects" className="mb-10 flex flex-wrap gap-2">
        {FILTERS.filter((f) => counts[f]).map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={cn(
              "min-h-11 rounded-full border px-4 text-[15px] transition-colors",
              filter === f ? "border-fg bg-fg text-bg" : "border-line hover:border-fg",
            )}
          >
            {f === "all" ? "All" : CATEGORY_LABELS[f]} <span className="opacity-60">{counts[f]}</span>
          </button>
        ))}
      </div>

      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((p) => (
          <li
            key={p.slug}
            className="group flex flex-col justify-between gap-6 rounded-[26px] border border-line bg-surface p-6 transition-transform duration-500 ease-[var(--ease-expo-out)] hover:-translate-y-1 hover:-rotate-[0.6deg]"
          >
            <div>
              <p className="text-[13px] text-fg-muted">
                {CATEGORY_LABELS[p.category]} · {p.year}
              </p>
              <h3 className="display-sans mt-3 text-[clamp(34px,3.4vw,46px)]">{p.name}</h3>
              <p className="mt-3 leading-snug">
                <span className="day-only">{p.day}</span>
                <span className="night-only">{p.night}</span>
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <ul className="flex flex-wrap gap-1.5" aria-label="Stack">
                {p.stack.map((s) => (
                  <li key={s} className="rounded-full bg-bg px-2.5 py-0.5 text-[12px] text-fg-muted">
                    {s}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-[15px]">
                {p.links.live && (
                  <a href={p.links.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline decoration-line underline-offset-4 hover:decoration-current">
                    Live <ArrowUpRight className="text-[13px]" />
                  </a>
                )}
                {p.links.repo && (
                  <a href={p.links.repo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline decoration-line underline-offset-4 hover:decoration-current">
                    Code <ArrowUpRight className="text-[13px]" />
                  </a>
                )}
                {p.links.extra?.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline decoration-line underline-offset-4 hover:decoration-current">
                    {l.label} <ArrowUpRight className="text-[13px]" />
                  </a>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
