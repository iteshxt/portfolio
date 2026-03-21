import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { generatePersonSchema, generateWebsiteSchema, generateOrganizationSchema } from "@/lib/seo";
import { ExperienceProvider } from "@/context/ExperienceContext";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Itesh Tomar - Software Developer",
  description: "Full-stack developer from Noida, India. Building scalable web applications with React, Next.js, Node.js, and Python.",
  keywords: [
    "Itesh Tomar", "Itesh Singh Tomar", "Itesh Singh", "iteshxt", "iteshxt.me",
    "Hitesh Tomar", "Nitesh Tomar", "Ritesh Tomar",
    "Itesh Tomar Noida", "Itesh Tomar Madhya Pradesh", "Itesh Tomar India",
    "Itesh developer", "Itesh developer Noida", "Itesh Singh developer",
    "Itesh LPU", "Itesh Lovely Professional University",
    "software developer Noida", "software engineer India", "full stack developer Noida",
    "web developer Madhya Pradesh", "developer Noida", "developer India",
    "React developer Noida", "Next.js developer India", "Node.js developer Noida",
    "TypeScript developer India", "Python developer Noida",
    "frontend developer India", "backend developer Noida",
    "full stack engineer India", "software engineer Noida",
    "freelance developer India", "hire developer Noida", "remote developer India",
    "developer for hire Noida", "software developer for hire India",
    "web development services Noida", "custom web development India",
    "React", "Next.js", "Node.js", "TypeScript", "JavaScript", "Python",
    "React.js developer", "Next.js developer", "MERN stack", "MEAN stack",
    "Itesh portfolio", "portfolio Itesh", "Itesh work", "Itesh projects",
    "developer portfolio", "portfolio website", "developer portfolio Noida",
    "Itesh GitHub", "Itesh LinkedIn", "iteshxt social",
    "contact developer Noida", "message developer", "reach out developer",
    "web developer", "software developer", "developer",
    "hire freelancer", "find developer", "tech portfolio",
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
    title: "Itesh Tomar - Software Developer",
    description: "Software Developer crafting interactive web experiences with AI/ML expertise",
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
    google: "your-google-verification-code",
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
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ExperienceProvider>
          {/* Fractal Grid Background */}
          <div className="fractal-grid" aria-hidden="true" />
          
          {/* Main Content */}
          <main className="relative z-10">
            {children}
          </main>
        </ExperienceProvider>
      </body>
    </html>
  );
}
