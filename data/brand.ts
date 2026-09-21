import type { UnitStatus } from "./types";

/**
 * DEMO CONTENT — brand, contact and packaging.
 * Replace `contact` values with the client's live sales line before launch.
 */

export const brand = {
  name: "A Square Devs",
  wordmark: { primary: "A Square", secondary: "DEVS" },
  established: "2013",
  positioning: "Development, architecture and the long view.",
  contact: {
    /**
     * One line for the whole site. `phone` is what a visitor reads, `phoneHref`
     * is what `tel:` dials and `whatsapp` is the same number in the digits-only
     * form `wa.me` expects — so a call and a WhatsApp from any CTA on the site
     * reach the same desk. Keep all three in step.
     */
    phone: "+91 74042 96309",
    phoneHref: "+917404296309",
    /** The landline, if the sales desk publishes one — the same line by default. */
    altPhone: "+91 74042 96309",
    altPhoneHref: "+917404296309",
    /** Digits only, no +, for wa.me links. */
    whatsapp: "917404296309",
    email: "residences@asquareddevs.com",
    siteOffice: "Site Experience Centre, Golf Course Road Extn., Sector 58, Gurugram 122011",
    hours: "Monday – Saturday, 10:00 – 19:00 IST",
  },
  /**
   * Social profiles. An entry with an empty `href` is not rendered, so the
   * demo never ships a dead link — add the client's URLs and they appear.
   */
  social: [
    { label: "Instagram", href: "" },
    { label: "LinkedIn", href: "" },
  ] as { label: string; href: string }[],
  legal: [
    { label: "Privacy", href: "/legal/privacy" },
    { label: "Terms", href: "/legal/terms" },
  ] as { label: string; href: string }[],
} as const;

export const nav = [
  { label: "Projects", href: "/projects" },
  { label: "Residences", href: "/#residences" },
  { label: "Experience", href: "/#experience" },
  { label: "Location", href: "/#location" },
] as const;

export const STATUS_LABEL: Record<UnitStatus, string> = {
  available: "Available",
  reserved: "On hold",
  sold: "Sold",
};

export const STATUS_COLOR: Record<UnitStatus, string> = {
  available: "var(--status-available)",
  reserved: "var(--status-reserved)",
  sold: "var(--status-sold)",
};

/**
 * Demo conversion config. WhatsApp copy is composed at runtime from the
 * qualification answers — see lib/whatsapp.ts.
 */
export const conversion = {
  primaryCta: "Schedule a Private Viewing",
  primaryCtaShort: "Schedule Viewing",
  secondaryCta: "Explore Residences",
  whatsappCta: "Speak on WhatsApp",
  callCta: "Speak with a Property Advisor",
  disclaimer: "Illustrative site, demo content and imagery. Not a legal offer or contract.",
} as const;
