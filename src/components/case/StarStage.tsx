import { StarVisual } from "@/components/home/StarVisual";
import { cn } from "@/lib/cn";

/**
 * The case-study hero stage: the project's real artwork, animated (docs/design.md §7),
 * the same piece the card shows, so the card-to-stage flight lands on it exactly.
 */
export function StarStage({ slug, className }: { slug: string; className?: string }) {
  return (
    <div data-fly-target={slug} className={cn("relative flex items-center justify-center overflow-hidden", className)}>
      <StarVisual slug={slug} />
    </div>
  );
}
