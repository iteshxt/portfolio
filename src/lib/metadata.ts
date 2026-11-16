import type { Metadata } from "next";
import { SITE } from "@/content/site";

/** Per-page metadata: title, description, canonical URL and matching share-card text. */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const full = `${title} · ${SITE.display}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: full, description, url: path },
    // Page-level twitter metadata replaces the layout's, so restate the card type.
    twitter: { card: "summary_large_image", creator: "@iteshxt", title: full, description },
  };
}
