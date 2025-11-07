import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { Footer } from "@/components/layout/Footer";
import ClickSpark from "@/components/common/ClickSpark";
import { Background } from "@/components/background/Background";
import Script from "next/script";
import { generatePersonSchema, generateWebsiteSchema, generateOrganizationSchema } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Itesh Tomar",
  description: "Software Developer specializing in Next.js, React, Node.js, and AI/ML. Building beautiful, functional web experiences with cutting-edge technologies. Explore my projects, experience, and blog.",
  keywords: [
    "Itesh Tomar",
    "iteshxt",
    "Itesh Singh Tomar",
    "Software Engineer",
    "Itesh Tomar LPU",
    "Itesh Noida",
    "Itesh CSE",
    "Itesh Tomar Portfolio",
    "Itesh Tomar Projects",
    "Itesh Tomar Blog",
    "Itesh Tomar Experience",
    "Itesh Tomar AI",
    "Itesh Tomar Machine Learning",
    "Itesh Tomar Next.js",
    "Itesh Tomar React",
    "Itesh Tomar Node.js",
    "Itesh Tomar TypeScript",
    "Itesh Singh Tomar Portfolio",
    "Itesh Singh Tomar Projects",
    "Itesh Singh Tomar Blog",
    "Itesh Singh Tomar Experience",
    "Itesh Singh Tomar AI",
    "Itesh Singh Tomar Machine Learning",
    "Itesh Singh Tomar Next.js",
    "Itesh Singh Tomar React",
    "Itesh Singh Tomar Node.js",
    "Itesh Singh Tomar TypeScript", 
    "Itesh linkedin",
    "Itesh github",
    "Itesh twitter",
    "Itesh developer",
    "Itesh programmer",
    "Itesh web developer",
    "Itesh full-stack developer",
    "Itesh AI engineer",
    "Itesh ML engineer",
    "Itesh software developer",
    "Itesh tech blog",
    "Itesh coding",
    "Itesh open source",
    "Itesh freelance developer",
    "Itesh portfolio website",
    "Itesh personal website",
    "iteshxt portfolio",
    "iteshxt projects",
    "iteshxt blog",
    "iteshxt experience",
    "iteshxt AI",
    "iteshxt github",
    "iteshxt linkedin",
    "iteshxt twitter"
    
  ],
  authors: [
    { name: "Itesh Tomar", url: "https://iteshxt.me" }
  ],
  creator: "Itesh Tomar",
  publisher: "Itesh Tomar",
  metadataBase: new URL("https://iteshxt.me"),
  alternates: {
    canonical: "https://iteshxt.me",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://iteshxt.me",
    siteName: "Itesh Tomar's Portfolio",
    title: "Itesh Tomar - Full-Stack Developer & AI Engineer",
    description: "Full-stack developer crafting interactive web experiences with AI/ML expertise",
    images: [
      {
        url: "https://iteshxt.me/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Itesh Tomar Portfolio",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@iteshxt",
    creator: "@iteshxt",
    title: "Itesh Tomar - Full-Stack Developer & AI Engineer",
    description: "Full-stack developer crafting interactive web experiences with AI/ML expertise",
    images: ["https://iteshxt.me/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Replace with your actual code
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Itesh Tomar",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personSchema = generatePersonSchema();
  const websiteSchema = generateWebsiteSchema();
  const organizationSchema = generateOrganizationSchema();

  return (
    <html lang="en" className="dark">
      <head>
        {/* Structured Data - JSON-LD */}
        <Script
          id="person-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema),
          }}
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'YOUR_GA_ID');
          `}
        </Script>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://github.com" />
        <link rel="dns-prefetch" href="https://linkedin.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground transition-colors duration-500`}
      >
        <Background theme="dark" />
        <Navigation audioSrc="/audio/background-loop.mp3" />
        <SocialLinks />
        <ClickSpark
          sparkColor="#a78bfa"
          sparkSize={8}
          sparkRadius={20}
          sparkCount={12}
          duration={500}
          easing="ease-out"
        >
          <main className="pt-12 flex flex-col min-h-screen">
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </main>
        </ClickSpark>
      </body>
    </html>
  );
}
