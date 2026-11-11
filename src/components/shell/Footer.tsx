import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ArrowUpRight } from "@/components/icons";
import { SITE } from "@/content/site";
import { NowBuilding } from "./NowBuilding";

async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

const LINKS = [
  { label: "Email", href: `mailto:${SITE.email}` },
  { label: "LinkedIn", href: SITE.socials.linkedin },
  { label: "GitHub", href: SITE.socials.github },
  { label: "X", href: SITE.socials.x },
];

export async function Footer() {
  const year = await currentYear();

  return (
    <footer className="px-gutter mt-auto border-t border-line pt-14 pb-32">
      <div className="mx-auto grid max-w-[1440px] gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <p className="font-serif text-[clamp(44px,6vw,88px)] italic leading-[0.9]">itesh</p>
          <p className="mt-3 max-w-xs text-fg-muted">{SITE.role}, based in {SITE.location.split(",")[0]}.</p>
        </div>

        <nav aria-label="Elsewhere">
          <ul className="flex flex-col gap-2">
            {LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                  className="group inline-flex items-center gap-1.5 text-[18px] hover:text-accent-text"
                >
                  {link.label}
                  <ArrowUpRight className="text-[15px] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <Suspense fallback={null}>
          <NowBuilding />
        </Suspense>
      </div>

      <div className="mx-auto mt-14 flex max-w-[1440px] flex-wrap justify-between gap-3 text-[13px] text-fg-muted">
        <p>© {year} {SITE.name}</p>
        <p>Built by hand with Next.js. Peel the corner for the night shift.</p>
      </div>
    </footer>
  );
}
