import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TareaX",
    short_name: "TareaX",
    description: "your daily tasks simplified.",
    start_url: "/",
    display: "standalone",
    background_color: "#F9FAFB",
    theme_color: "#2563EB",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
