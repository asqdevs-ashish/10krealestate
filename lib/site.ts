import { brand } from "@/data/brand";

/**
 * Where the site lives.
 *
 * Everything that has to be absolute — canonical links, `og:url`, the sitemap,
 * structured data — reads from here, so there is one place to change it.
 *
 * On Vercel the project's own production URL is injected at build time, which
 * means a preview or production deploy is correct without any configuration at
 * all. `NEXT_PUBLIC_SITE_URL` overrides it, which is what a custom domain sets.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() || process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/+$/, "")}`;

  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();

/** Absolute URL for a path within the site. */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export const site = {
  name: brand.name,
  /** The wordmark as one string, for metadata rather than layout. */
  title: `${brand.wordmark.primary} ${brand.wordmark.secondary}`,
  locale: "en_IN",
} as const;
