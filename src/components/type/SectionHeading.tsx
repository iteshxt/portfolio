import { cn } from "@/lib/cn";

type Line = { sans: string; serif: string };

/**
 * Section heading in the headline style: bold sans + serif, with an optional
 * kicker. Pass `night` for a different line by night (day = what, night = how).
 */
export function SectionHeading({
  kicker,
  day,
  night,
  className,
  tone = "default",
}: {
  kicker?: { day: string; night?: string };
  day: Line;
  night?: Line;
  className?: string;
  tone?: "default" | "inverse";
}) {
  const n = night ?? day;
  return (
    <header className={cn("flex flex-col gap-3", className)}>
      {kicker && (
        <p className={cn("font-serif text-[clamp(17px,1.6vw,22px)]", tone === "inverse" ? "" : "text-fg-muted")}>
          <span className="day-only">{kicker.day}</span>
          <span className="night-only">{kicker.night ?? kicker.day}</span>
        </p>
      )}
      <h2 className="flex flex-col">
        <span className="display-sans text-[clamp(48px,8.5vw,136px)]">
          <span className="day-only">{day.sans}</span>
          <span className="night-only">{n.sans}</span>
        </span>
        <span className={cn("display-serif text-[clamp(42px,7.4vw,118px)]", tone === "default" && "text-accent-text")}>
          <span className="day-only">{day.serif}</span>
          <span className="night-only">{n.serif}</span>
        </span>
      </h2>
    </header>
  );
}
