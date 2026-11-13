import { cacheLife } from "next/cache";
import { Suspense, type CSSProperties } from "react";
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

const LINKS: { label: string; href: string; tone: StickerTone }[] = [
  { label: "Email", href: `mailto:${SITE.email}`, tone: "lime" },
  { label: "LinkedIn", href: SITE.socials.linkedin, tone: "lavender" },
  { label: "GitHub", href: SITE.socials.github, tone: "sunflower" },
  { label: "X", href: SITE.socials.x, tone: "tomato" },
];

/**
 * The footer as a sticker sheet on a cutting mat (docs/design.md §2.12): the
 * wordmark as a big die-cut sticker, the links as flickable stickers, the
 * latest push printed as a receipt, and a peel tab back to the top.
 */
export async function Footer() {
  const year = await currentYear();

  return (
    <footer className="cutting-mat px-gutter mt-auto border-t border-line pt-[clamp(32px,4vw,48px)] pb-[88px]">
      <div className="mx-auto grid max-w-[1440px] items-center gap-8 md:grid-cols-[auto_1fr_auto] md:gap-12">
        <div className="flex items-center gap-5">
          <p data-animate="slap" className="wordmark-sticker inline-block rounded-[20px] border-[5px] border-white bg-violet px-5 pt-1.5 pb-3 font-serif text-[clamp(42px,4.4vw,64px)] leading-none text-white italic">
            itesh
          </p>
          <p className="max-w-[16ch] text-[15px] leading-snug text-fg-muted">{SITE.role}.</p>
        </div>

        <nav aria-label="Elsewhere">
          <ul className="flex flex-wrap gap-3 md:justify-center">
            {LINKS.map((link, i) => (
              <li key={link.label} data-animate="slap" style={{ "--d": `${120 + i * 80}ms` } as CSSProperties}>
                <a
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                >
                  <Sticker tone={link.tone} className="text-[16px] font-semibold">
                    {link.label} <ArrowUpRight className="text-[13px]" />
                  </Sticker>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* The shadow sits on a wrapper: the receipt's torn-edge mask would clip it. */}
        <div className="w-full max-w-[300px] drop-shadow-[0_12px_18px_rgb(0_0_0/0.18)]">
          <div className="receipt bg-surface px-4 pt-4 pb-7">
            <Suspense fallback={<p className="font-mono text-[13px] text-fg-muted">Fetching the latest push…</p>}>
              <NowBuilding />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 flex max-w-[1440px] items-center justify-between gap-6 border-t border-line pt-4">
        <p className="text-[13px] text-fg-muted">
          © {year} iteshxt
        </p>
        <BackToTop />
      </div>
    </footer>
  );
}
