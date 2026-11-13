import type { CSSProperties } from "react";
import { StarPoster } from "@/components/home/StarPoster";
import type { Project } from "@/content/projects";

/**
 * The star projects on the work page as a pile of posters (docs/design.md §2.7):
 * each poster sticks near the top as you scroll and the next one slides up over
 * it, a little lower, like stickers stacked on a sheet.
 */
export function CaseStack({ projects }: { projects: Project[] }) {
  return (
    <ol className="flex flex-col gap-[clamp(28px,6vh,64px)]">
      {projects.map((p, i) => (
        <li
          key={p.slug}
          className="case-stack-item sticky"
          style={{ "--i": i, top: `calc(84px + ${i} * 18px)` } as CSSProperties}
        >
          <StarPoster p={p} total={projects.length} />
        </li>
      ))}
    </ol>
  );
}
