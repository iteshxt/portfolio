import { ArrowRight } from "@/components/icons";
import { StarVisual } from "@/components/home/StarVisual";
import { Reveal } from "@/components/motion/Reveal";
import { TransitionLink } from "@/components/transition/TransitionLink";
import type { Project } from "@/content/projects";
import { brandOf } from "@/lib/brand";
import { cn } from "@/lib/cn";

/** Compact framed cards for the three star projects (work page). */
export function StarCards({ projects }: { projects: Project[] }) {
  return (
    <ul className="grid gap-6 md:grid-cols-3">
      {projects.map((p, i) => (
        <Reveal as="li" key={p.slug} delay={i * 90}>
          <TransitionLink
            href={`/work/${p.slug}`}
            transitionLabel={p.name}
            data-fly-card=""
            className={cn("group block border-[10px] transition-transform duration-500 ease-[var(--ease-expo-out)] hover:-translate-y-1.5", brandOf(p).frame, brandOf(p).fill)}
            style={{ rotate: `${[-1.2, 0.8, -0.6][i % 3]}deg` }}
          >
            <div data-fly-source={p.slug} className="flex aspect-[4/3] items-center justify-center">
              <StarVisual slug={p.slug} />
            </div>
            <div className="bg-surface p-5">
              <p className="font-mono text-[12px] text-fg-muted">
                0{p.order} · {p.year}
              </p>
              <h3 className="display-sans mt-2 text-[clamp(38px,3.6vw,52px)]">{p.name}</h3>
              <p className="mt-2 leading-snug text-fg-muted">
                <span className="day-only">{p.day}</span>
                <span className="night-only">{p.night}</span>
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-[15px] font-medium">
                Case study <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </TransitionLink>
        </Reveal>
      ))}
    </ul>
  );
}
