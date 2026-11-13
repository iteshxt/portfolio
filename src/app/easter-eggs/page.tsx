import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { EggCarton } from "@/components/eggs/EggCarton";
import { NowBuilding } from "@/components/shell/NowBuilding";
import { Sticker } from "@/components/ui/Sticker";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...pageMetadata({ title: "Easter eggs", description: "Every secret hidden on iteshxt.me, in one carton.", path: "/easter-eggs" }),
  // Hidden on purpose: reached from a whisper in the footer, not from search.
  robots: { index: false, follow: true },
};

export default function EasterEggsPage() {
  return (
    <main data-section="Easter eggs" className="faded-mat px-gutter flex-1 pt-28 pb-[clamp(110px,12vw,170px)] md:pt-36">
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-[clamp(40px,6vw,72px)] flex flex-col items-center text-center">
          <p data-animate="rise" className="font-hand text-[clamp(24px,2.4vw,32px)] text-accent-text">
            psst… you made it
          </p>
          <h1
            data-animate="rise"
            style={{ "--d": "80ms" } as CSSProperties}
            className="mt-2 text-[clamp(44px,6.4vw,100px)] leading-[1.02] font-semibold tracking-[-0.045em] [font-variation-settings:'wdth'_80]"
          >
            The secret{" "}
            <Sticker size="word" tone="sunflower" tilt={-3}>
              eggs
            </Sticker>
            .
          </h1>
          <p data-animate="rise" style={{ "--d": "160ms" } as CSSProperties} className="mt-5 max-w-[46ch] text-[clamp(16px,1.3vw,19px)] leading-[1.55] text-fg-muted">
            Eight things hidden around this site. Couldn&rsquo;t find them all? Crack one open and try it right here.
          </p>
        </div>
        <EggCarton
          nowSlot={
            <Suspense fallback={<span className="font-mono text-[13px] text-fg-muted">Fetching the latest push…</span>}>
              <NowBuilding compact />
            </Suspense>
          }
        />
      </div>
    </main>
  );
}
