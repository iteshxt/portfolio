import type { Metadata } from "next";

/** Per-page metadata: title, description, canonical URL and matching share-card text. */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const full = `${title} · Itesh Singh Tomar`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: full, description, url: path },
    twitter: { title: full, description },
  };
}
