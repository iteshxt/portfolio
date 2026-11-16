import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Itesh Singh Tomar",
    short_name: "iteshxt",
    description: "ML engineer & full-stack developer: agents, models and the products around them.",
    start_url: "/",
    display: "browser",
    background_color: "#F5F5F4",
    theme_color: "#7A2CFF",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icon-mono.svg", sizes: "any", type: "image/svg+xml", purpose: "monochrome" },
    ],
  };
}
