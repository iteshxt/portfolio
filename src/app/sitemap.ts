import type { MetadataRoute } from "next";
import { STAR_SLUGS } from "@/content/pages";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://iteshxt.me";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/work", ...STAR_SLUGS.map((s) => `/work/${s}`), "/dialabs", "/about", "/contact"];
  return pages.map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/work/") ? 0.8 : 0.6,
  }));
}
