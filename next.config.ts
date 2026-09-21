import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * AVIF first, WebP behind it. Both are decided per request from the
     * browser's `Accept` header, so a device that cannot decode AVIF still gets
     * a modern format rather than the original JPEG.
     */
    formats: ["image/avif", "image/webp"],

    /**
     * Next 16 requires this allowlist — without it only `75` is permitted and
     * anything else is silently coerced. The scale the site actually uses: 82
     * for the large editorial plates, 75 for standard cards, 68 for the small
     * inset and thumbnail plates.
     */
    qualities: [68, 75, 82],

    /**
     * Photography is replaced by a shoot, not by an edit, so an optimised
     * variant stays valid for a month. Raising the TTL keeps repeat visitors
     * off the optimizer entirely.
     */
    minimumCacheTTL: 2678400,

    /**
     * Only the media library is allowed through the optimizer. Everything the
     * site renders from `/public` lives there, so an arbitrary local path can
     * never be handed to it.
     */
    localPatterns: [{ pathname: "/media/**" }],
  },
};

export default nextConfig;
