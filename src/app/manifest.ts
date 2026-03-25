import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MultiRotter",
    short_name: "MultiRotter",
    description: "Breaking news scoops in real-time — retro forum PWA",
    start_url: "/",
    display: "standalone",
    orientation: "any",
    theme_color: "#71B7E6",
    background_color: "#FFFFFF",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
