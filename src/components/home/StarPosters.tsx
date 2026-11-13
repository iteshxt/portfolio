import { PinnedTrack } from "@/components/motion/PinnedTrack";
import type { Project } from "@/content/projects";
import { StarPoster } from "./StarPoster";

/**
 * Star projects as posters (docs/design.md §2.9): each one a big die-cut sticker
 * in its app's colours, artwork large, name huge, and "how it works" under a
 * peelable sticker. They slide sideways through a pinned section as you scroll.
 */
export function StarPosters({
  projects,
  header,
}: {
  projects: Project[];
  header: React.ReactNode;
}) {
  return (
    <PinnedTrack header={header}>
      {projects.map((p) => (
        <StarPoster
          key={p.slug}
          p={p}
          total={projects.length}
          className="w-[84vw] shrink-0 snap-center md:w-[min(82vw,1120px)]"
        />
      ))}
    </PinnedTrack>
  );
}
