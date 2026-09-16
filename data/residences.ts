import type { Configuration, MediaRef, ResidenceConfig } from "./types";
import { slugify } from "@/lib/format";
import { media } from "./media";

/**
 * Residence configurations.
 *
 * Prices, areas and copy are per project (see data/projects.ts); this module
 * holds the shared conventions — what "3 BHK" means, and how a project's
 * residence list becomes a set of ids that the plans and inventory agree with.
 */

export const CONFIG_META: Record<Configuration, { label: string; bedrooms: number; bathrooms: number }> = {
  "2 BHK": { label: "Two bedroom", bedrooms: 2, bathrooms: 2 },
  "3 BHK": { label: "Three bedroom", bedrooms: 3, bathrooms: 3 },
  "4 BHK": { label: "Four bedroom", bedrooms: 4, bathrooms: 4 },
  Penthouse: { label: "Penthouse", bedrooms: 4, bathrooms: 5 },
};

/** Lowest price per configuration, INR. Used as the portfolio's entry point. */
export const basePrice: Record<Configuration, number> = {
  "2 BHK": 18_500_000, // ₹1.85 Cr
  "3 BHK": 24_500_000, // ₹2.45 Cr
  "4 BHK": 32_500_000, // ₹3.25 Cr
  Penthouse: 59_000_000, // ₹5.90 Cr
};

export const residenceId = (projectSlug: string, configuration: Configuration) =>
  `${projectSlug}-${slugify(configuration)}`;

export const planIdFor = (projectSlug: string, configuration: Configuration) =>
  `${projectSlug}-plan-${slugify(configuration)}`;

export type ResidenceInput = {
  configuration: Configuration;
  areaSuper: number;
  priceFrom: number;
  copy: string;
  detail: string;
  features: string[];
  media: MediaRef;
};

export function buildResidences(projectSlug: string, inputs: ResidenceInput[]): ResidenceConfig[] {
  return inputs.map((input) => ({
    id: residenceId(projectSlug, input.configuration),
    configuration: input.configuration,
    label: CONFIG_META[input.configuration].label,
    bedrooms: CONFIG_META[input.configuration].bedrooms,
    bathrooms: CONFIG_META[input.configuration].bathrooms,
    planId: planIdFor(projectSlug, input.configuration),
    areaSuper: input.areaSuper,
    priceFrom: input.priceFrom,
    copy: input.copy,
    detail: input.detail,
    features: input.features,
    media: input.media,
  }));
}

/** Shared interior imagery, so every project's residence cards look finished. */
export const interior: Record<Configuration, MediaRef> = {
  "2 BHK": {
    scene: "interior-dining",
    tone: "interior",
    index: "01",
    image: media.dining,
    caption: "Two bedroom · living and dining as one volume",
    alt: "Combined living and dining room in a two bedroom residence",
  },
  "3 BHK": {
    scene: "interior-living",
    tone: "interior",
    index: "02",
    image: media.living,
    caption: "Three bedroom · living room at 17:20",
    alt: "Living room of a three bedroom residence in warm late afternoon light",
  },
  "4 BHK": {
    scene: "library",
    tone: "interior",
    index: "03",
    image: media.livingTwo,
    caption: "Four bedroom · the long living volume",
    alt: "Long double-height living volume of a four bedroom residence",
  },
  Penthouse: {
    scene: "garden-terrace",
    tone: "dusk",
    index: "04",
    image: media.terrace,
    caption: "Penthouse · private terrace",
    alt: "Private penthouse terrace at dusk",
  },
};
