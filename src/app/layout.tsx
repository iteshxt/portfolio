import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Caveat, Instrument_Serif, JetBrains_Mono, Mona_Sans } from "next/font/google";
import { QuietEggs } from "@/components/eggs/QuietEggs";
import { Toaster } from "@/components/eggs/Toaster";
import { LazyOverlays } from "@/components/shell/LazyOverlays";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { PrintResume } from "@/components/print/PrintResume";
import { Footer } from "@/components/shell/Footer";
import { NavBar } from "@/components/shell/NavBar";
import { PeelCorner } from "@/components/shell/PeelCorner";
import { TopBar } from "@/components/shell/TopBar";
import { IntroScreen } from "@/components/transition/IntroScreen";
import { TransitionProvider } from "@/components/transition/TransitionProvider";
import { SITE } from "@/content/site";
import { getNowBuilding } from "@/lib/github";
import { shiftBootstrapScript } from "@/lib/shift";
import "./globals.css";

const monaSans = Mona_Sans({
  variable: "--font-mona",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

// Only the home page's "peel here" hint uses it; not preloaded, so it downloads when the hint shows.
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: "600",
  display: "swap",
  preload: false,
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://iteshxt.me";
const DESCRIPTION =
  "Itesh Singh Tomar builds agents, fine-tunes models and ships real products. By day: what he builds. By night: how it works.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Itesh Singh Tomar · ML engineer & full-stack developer",
    template: "%s · Itesh Singh Tomar",
  },
  description: DESCRIPTION,
  applicationName: "iteshxt.me",
  authors: [{ name: SITE.name, url: SITE_URL }],
  creator: SITE.name,
  keywords: ["Itesh Singh Tomar", "iteshxt", "ML engineer", "full-stack developer", "AI agents", "LLM fine-tuning", "Next.js", "DiaLabs"],
  openGraph: { type: "website", siteName: "iteshxt.me", locale: "en_IN", description: DESCRIPTION },
  twitter: { card: "summary_large_image", creator: "@iteshxt" },
};

/** Structured data: who the site is about (docs/spec.md §11). */
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: SITE.name,
      url: SITE_URL,
      jobTitle: SITE.role,
      email: `mailto:${SITE.email}`,
      alumniOf: { "@type": "CollegeOrUniversity", name: "Lovely Professional University" },
      sameAs: [SITE.socials.github, SITE.socials.linkedin, SITE.socials.x],
      knowsAbout: ["Machine learning", "LLM fine-tuning", "AI agents", "Full-stack web development", "Next.js", "PyTorch"],
    },
    { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: "iteshxt.me", author: { "@id": `${SITE_URL}/#person` } },
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f4" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0a10" },
  ],
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const now = await getNowBuilding();
  return (
    <html
      lang="en"
      data-shift="day"
      suppressHydrationWarning
      className={`${monaSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} ${caveat.variable} h-full`}
    >
      <head>
        {/* Picks the day/night shift before first paint (docs/spec.md §3.2). */}
        <script dangerouslySetInnerHTML={{ __html: shiftBootstrapScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <TransitionProvider intro={<IntroScreen />}>
          <SmoothScroll />
          <TopBar />
          {children}
          <Footer />
          <NavBar />
          <LazyOverlays now={now ? { repo: now.repo, message: now.message } : null} />
          <QuietEggs />
          <Toaster />
        </TransitionProvider>
        <PeelCorner />
        <PrintResume />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c") }} />
        {/* Their scripts only exist on Vercel deployments. */}
        {process.env.VERCEL && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}
