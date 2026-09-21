import { getProject, listProjects } from "@/data";
import { formatINR } from "@/lib/format";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og";

/**
 * A share card per project.
 *
 * Every project gets one from its own record — name, locality, price from and
 * its own photograph — so a link to NOIR never previews as VAULT.
 */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return listProjects().map((project) => ({ slug: project.slug }));
}

export async function generateImageMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  return [{ id: "card", alt: `${project?.name ?? "Project"} — private residences`, size, contentType }];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return ogCard({
      eyebrow: "A Square Devs",
      lines: ["Private", "residences."],
      summary: "Gurugram, India",
      facts: [],
      image: null,
    });
  }

  return ogCard({
    eyebrow: `${project.locality}, ${project.city}`,
    lines: [project.name, project.subtitle],
    summary: `${project.totalResidences} residences · ${project.configurations.join(" · ")} · ${project.statusLabel}`,
    facts: [
      { label: "From", value: formatINR(project.priceFrom) },
      { label: "Possession", value: project.possession },
      { label: "Site", value: project.land },
    ],
    image: project.hero.image ?? null,
  });
}
