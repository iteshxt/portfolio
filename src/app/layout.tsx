import type { Metadata, Viewport } from "next";
import { Instrument_Serif, JetBrains_Mono, Mona_Sans } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://iteshxt.me"),
  title: {
    default: "Itesh Singh Tomar · ML engineer & full-stack developer",
    template: "%s · Itesh Singh Tomar",
  },
  description:
    "Itesh builds agents, fine-tunes models and ships real products. By day: what he builds. By night: how it works.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f4" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0a10" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-shift="day"
      suppressHydrationWarning
      className={`${monaSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} h-full`}
    >
      <head>
        {/* Picks the day/night shift before first paint (docs/spec.md §3.2). */}
        <script dangerouslySetInnerHTML={{ __html: shiftBootstrapScript }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
