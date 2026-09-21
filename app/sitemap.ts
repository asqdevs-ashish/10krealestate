import type { MetadataRoute } from "next";
import { listProjects } from "@/data";
import { absoluteUrl } from "@/lib/site";

/**
 * The sitemap.
 *
 * Projects come from the data seam rather than a hand-written list, so adding
 * one to `data/projects.ts` is enough for it to be crawled. `lastModified` is
 * the build time: the content is bundled, so the build *is* the last change.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const projects = listProjects();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/projects"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/availability"), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/book-a-viewing"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/legal/privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/legal/terms"), changeFrequency: "yearly", priority: 0.2 },
  ].map((route) => ({ ...route, lastModified }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: absoluteUrl(`/projects/${project.slug}`),
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
    images: project.gallery.slice(0, 4).map((item) => absoluteUrl(item.media.image)),
  }));

  return [...staticRoutes, ...projectRoutes];
}
