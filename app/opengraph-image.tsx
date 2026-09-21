import { getFlagship } from "@/data";
import { formatINR } from "@/lib/format";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og";

/**
 * The site-wide share card. Built from the flagship record, so a price change
 * is a price change everywhere — including here.
 */
export const alt = "VAULT — private residences in Sector 58, Gurugram";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const project = getFlagship();

  return ogCard({
    eyebrow: `${project.locality}, ${project.city}`,
    lines: ["A quieter", "kind of luxury."],
    summary: `${project.totalResidences} private residences · ${project.configurations.join(" · ")}`,
    facts: [
      { label: "From", value: formatINR(project.priceFrom) },
      { label: "Possession", value: project.possession },
      { label: "Site", value: project.land },
    ],
    image: project.hero.image,
  });
}
