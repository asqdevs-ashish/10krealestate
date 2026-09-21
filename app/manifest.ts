import type { MetadataRoute } from "next";
import { brand } from "@/data/brand";
import { site } from "@/lib/site";

/**
 * The web app manifest.
 *
 * A residence is browsed on a phone, and the site is one people come back to
 * while comparing options — so it installs: the mark on the home screen, the
 * paper colour as the splash, and the two screens a buyer actually returns to
 * as shortcuts.
 *
 * The icons are generated in `app/icons/[size]/route.tsx` from the same mark as
 * the favicon, so there is no PNG set to keep in step with a redesign.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${brand.name} — ${brand.positioning}`,
    short_name: brand.wordmark.primary,
    description:
      "Private residences in Sector 58, Gurugram — floor plans, live availability and private viewings.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f7f4ee",
    theme_color: "#f7f4ee",
    lang: "en-IN",
    dir: "ltr",
    categories: ["business", "lifestyle", "shopping"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icons/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Availability", short_name: "Availability", url: "/availability" },
      { name: "Book a viewing", short_name: "Viewing", url: "/book-a-viewing" },
    ],
    id: site.name,
  };
}
