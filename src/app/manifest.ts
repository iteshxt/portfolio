import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Itesh Tomar",
    short_name: "iteshxt",
    description: "Itesh Tomar ships agents, models and the products around them, mostly on time.",
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
