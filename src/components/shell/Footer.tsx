import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ArrowUpRight } from "@/components/icons";
import { Sticker, type StickerTone } from "@/components/ui/Sticker";
import { SITE } from "@/content/site";
import { BackToTop } from "./BackToTop";
import { NowBuilding } from "./NowBuilding";

async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

const LINKS: { label: string; href: string; tone: StickerTone; tilt: number }[] = [
  { label: "Email", href: `mailto:${SITE.email}`, tone: "lime", tilt: -3 },
  { label: "LinkedIn", href: SITE.socials.linkedin, tone: "lavender", tilt: 2.5 },
  { label: "GitHub", href: SITE.socials.github, tone: "sunflower", tilt: -1.5 },
  { label: "X", href: SITE.socials.x, tone: "tomato", tilt: 3 },
];

/**
 * The footer as a sticker sheet on a cutting mat (docs/design.md §2.12): the
 * wordmark as a big die-cut sticker, the links as flickable stickers, the
 * latest push printed as a receipt, and a peel tab back to the top.
 */
export async function Footer() {
  const year = await currentYear();

  return (
    <footer className="cutting-mat px-gutter mt-auto border-t border-line pt-[clamp(56px,8vw,100px)] pb-32">
      <div className="mx-auto grid max-w-[1440px] items-start gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="flex flex-col items-start gap-5">
          <p className="wordmark-sticker inline-block rounded-[28px] border-[6px] border-white bg-violet px-8 pt-3 pb-5 font-serif text-[clamp(64px,8vw,120px)] leading-none text-white italic">
            itesh
          </p>
          <p className="max-w-xs text-fg-muted">{SITE.role}.</p>
        </div>

        <nav aria-label="Elsewhere">
          <ul className="flex flex-wrap gap-3">
            {LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                >
                  <Sticker tone={link.tone} tilt={link.tilt} className="text-[16px] font-semibold">
                    {link.label} <ArrowUpRight className="text-[13px]" />
                  </Sticker>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* The shadow sits on a wrapper: the receipt's torn-edge mask would clip it. */}
        <div className="w-full max-w-[320px] rotate-[1.5deg] drop-shadow-[0_12px_18px_rgb(0_0_0/0.18)]">
          <div className="receipt bg-surface px-5 pt-5 pb-8">
            <Suspense fallback={<p className="font-mono text-[13px] text-fg-muted">Fetching the latest push…</p>}>
              <NowBuilding />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-[1440px] items-center justify-between gap-6">
        <p className="text-[13px] text-fg-muted">
          © {year} {SITE.name}
        </p>
        <BackToTop />
      </div>
    </footer>
  );
}
