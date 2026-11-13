"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight } from "@/components/icons";
import { CATEGORY_LABELS, type Project, type ProjectCategory } from "@/content/projects";
import { cn } from "@/lib/cn";
import { prefersReducedMotion } from "@/lib/motion";

const TONES = [
  "bg-lime text-[#2B3600]",
  "bg-sunflower text-[#4A3A00]",
  "bg-lavender text-violet-ink",
  "bg-tomato text-[#2A0700]",
  "bg-surface text-fg",
];
const FIRST = 8;

/**
 * Archive projects as an index (docs/design.md §2.10): category filter chips,
 * one row per project linking to it, and on desktop a preview sticker with the
 * one-liner that follows the cursor over the list. Phones see the one-liner inline.
 */
export function ArchiveIndex({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<ProjectCategory | "all">("all");
  const [all, setAll] = useState(false);
  const [hover, setHover] = useState(-1);
  const preview = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

  const cats = useMemo(() => {
    const counts = new Map<ProjectCategory, number>();
    for (const p of projects) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    return [...counts.entries()];
  }, [projects]);
  const shown = projects.filter((p) => filter === "all" || p.category === filter);
  const visible = all ? shown : shown.slice(0, FIRST);

  // The preview sticker trails the cursor with a little lag and tilts with its speed.
  useEffect(() => {
    const el = preview.current;
    const list = listRef.current;
    if (!el || !list || prefersReducedMotion() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const pos = { x: 0, y: 0, tx: 0, ty: 0 };
    let raf = 0;
    const loop = () => {
      const dx = pos.tx - pos.x;
      pos.x += dx * 0.18;
      pos.y += (pos.ty - pos.y) * 0.18;
      el.style.transform = `translate3d(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px, 0) rotate(${Math.max(-12, Math.min(12, dx * 0.15)).toFixed(2)}deg)`;
      raf = requestAnimationFrame(loop);
    };
    const onMove = (e: PointerEvent) => {
      pos.tx = e.clientX + 24;
      pos.ty = e.clientY - 60;
      if (!raf) {
        pos.x = pos.tx;
        pos.y = pos.ty;
        raf = requestAnimationFrame(loop);
      }
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    list.addEventListener("pointermove", onMove);
    list.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      list.removeEventListener("pointermove", onMove);
      list.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const current = hover >= 0 ? visible[hover] : undefined;

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
            {key === "all" ? "All" : CATEGORY_LABELS[key]} <span className="opacity-60">{count}</span>
          </button>
        ))}
      </div>

      <ol ref={listRef} className="mt-8 border-b border-line" onPointerLeave={() => setHover(-1)}>
        {visible.map((p, i) => {
          const href = p.links.live ?? p.links.repo;
          return (
            <li key={p.slug} className="border-t border-line">
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                onPointerEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                className="index-row group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 py-5 md:grid-cols-[3.5rem_1fr_12rem_6rem]"
              >
                <span className="font-mono text-[13px] text-fg-muted">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="index-name block text-[clamp(26px,3vw,44px)] leading-none font-semibold tracking-[-0.04em] [font-variation-settings:'wdth'_82]">
                    {p.name}
                  </span>
                  <span className="mt-2 block text-[14px] leading-snug text-fg-muted md:hidden">{p.day}</span>
                </span>
                <span className="hidden text-[14px] text-fg-muted md:block">
                  {CATEGORY_LABELS[p.category]} · {p.year}
                </span>
                <span className="inline-flex items-center justify-end gap-1 text-[14px] font-semibold">
                  {p.links.live ? "Live" : "Code"}
                  <ArrowUpRight className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </a>
            </li>
          );
        })}
      </ol>

      {shown.length > FIRST && (
        <button type="button" onClick={() => setAll((v) => !v)} className="btn btn-paper mt-8">
          {all ? "Show fewer" : `Show all ${shown.length}`}
        </button>
      )}

      <div
        ref={preview}
        aria-hidden="true"
        className={cn("index-preview pointer-events-none fixed top-0 left-0 z-30 hidden w-[300px] md:block", current && "is-on")}
      >
        {current && (
          <div className={cn("rounded-[20px] border-[5px] border-white p-5 shadow-[0_20px_40px_-18px_rgb(0_0_0/0.5)]", TONES[hover % TONES.length])}>
            <span className="text-[12px] font-semibold tracking-wide uppercase">
              {CATEGORY_LABELS[current.category]} · {current.year}
            </span>
            <span className="mt-2 block text-[30px] leading-none font-semibold tracking-[-0.04em] [font-variation-settings:'wdth'_82]">
              {current.name}
            </span>
            <span className="mt-3 block text-[14px] leading-snug">{current.day}</span>
          </div>
        )}
      </div>
    </div>
  );
}
