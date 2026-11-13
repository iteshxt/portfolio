import type { PageCopy } from "@/content/pages";
import { Headline } from "./Headline";

/** Kicker + headline for both shifts; CSS shows the one matching the current shift. */
export function ShiftHeadline({
  copy,
  cycle = false,
  as = "h1",
  heightScale,
}: {
  copy: PageCopy;
  cycle?: boolean;
  as?: "h1" | "h2";
  heightScale?: number;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-[clamp(8px,1.4vw,18px)]">
      <p className="font-serif text-[clamp(18px,1.8vw,24px)] text-fg-muted">
        <span className="day-only">{copy.kicker.day}</span>
        <span className="night-only">{copy.kicker.night}</span>
      </p>
      <div className="day-only w-full">
        <Headline lines={copy.day} cycle={cycle} as={as} heightScale={heightScale} />
      </div>
      <div className="night-only w-full">
        <Headline lines={copy.night} cycle={cycle} as={as} heightScale={heightScale} />
      </div>
    </div>
  );
}
