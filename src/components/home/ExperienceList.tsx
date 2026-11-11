import { Reveal } from "@/components/motion/Reveal";
import type { Experience } from "@/content/profile";
import { cn } from "@/lib/cn";

/** Experience rows: company, role, period, and day (what) / night (how) notes. */
export function ExperienceList({ items, detailed = false }: { items: Experience[]; detailed?: boolean }) {
  return (
    <ol className="border-b border-line">
      {items.map((job, i) => (
        <Reveal as="li" key={job.company} delay={i * 80} className="grid gap-4 border-t border-line py-8 md:grid-cols-[1fr_1.4fr] md:gap-10">
          <div>
            <h3 className="display-sans text-[clamp(34px,4.6vw,64px)]">{job.company}</h3>
            <p className="mt-2 text-fg-muted">
              {job.role} · {job.period}
            </p>
          </div>
          <ul className={cn("flex flex-col gap-2 text-[clamp(16px,1.3vw,19px)] leading-snug md:pt-2", !detailed && "max-w-xl")}>
            {(detailed ? job.day : job.day.slice(0, 1)).map((line) => (
              <li key={line} className="day-only">
                {line}
              </li>
            ))}
            {(detailed ? job.night : job.night.slice(0, 1)).map((line) => (
              <li key={line} className="night-only">
                {line}
              </li>
            ))}
          </ul>
        </Reveal>
      ))}
    </ol>
  );
}
