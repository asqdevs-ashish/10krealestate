import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, listProjects, projectAvailability } from "@/data";
import { formatArea, formatINR, pad2 } from "@/lib/format";
import { buildWhatsAppMessage, whatsappUrl } from "@/lib/whatsapp";
import { PageHero } from "@/components/ui/PageHero";
import { CtaBand } from "@/components/ui/CtaBand";
import { Eyebrow } from "@/components/ui/Label";
import { Action } from "@/components/ui/Action";
import { MediaPlate } from "@/components/media/MediaPlate";
import { ClipReveal, DisplayLines, Parallax, Reveal } from "@/components/motion/Reveal";
import { AvailabilityTable } from "@/components/features/AvailabilityTable";
import { FaqSection } from "@/components/sections/FaqSection";
import { FloorPlanSection } from "@/components/sections/FloorPlanSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { InvestmentSection } from "@/components/sections/InvestmentSection";
import { StorySection } from "@/components/sections/StorySection";

export function generateStaticParams() {
  return listProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(props: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: `${project.name} — ${project.subtitle}`,
    description: project.description[0],
  };
}

export default async function ProjectPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) notFound();

  const others = listProjects().filter((p) => p.slug !== project.slug);
  const stock = projectAvailability(project);
  const wa = whatsappUrl(buildWhatsAppMessage({ intent: "details", projectName: project.name }));
  const architectureMedia = project.gallery[1]?.media ?? project.hero;

  return (
    <>
      <PageHero
        index="Project"
        eyebrow={`${project.locality}, ${project.city}`}
        lines={[project.name, project.subtitle]}
        copy={project.statement}
        meta={[
          { label: "Status", value: project.statusLabel },
          { label: "From", value: formatINR(project.priceFrom) },
          { label: "Available", value: `${pad2(stock.available)} of ${project.totalResidences}` },
          { label: "Possession", value: project.possession },
        ]}
        media={project.hero}
        actions={
          <>
            <Action
              href={`/book-a-viewing?project=${project.slug}`}
              variant="primary"
              size="lg"
              arrow
              magnetic
            >
              Schedule a Private Viewing
            </Action>
            <Action href={wa} external variant="ghost" size="lg">
              Request Residence Details
            </Action>
          </>
        }
      />

      {/* 01 — overview */}
      <section data-tone="light" className="bg-paper py-20 md:py-28">
        <div className="mx-auto w-full max-w-[110rem] px-6 md:px-10">
          <div className="grid gap-14 xl:grid-cols-12 xl:gap-16">
            <div className="xl:col-span-6">
              <Eyebrow index="01">Overview</Eyebrow>
              <DisplayLines
                as="h2"
                lines={["The facts,", "before the adjectives."]}
                className="u-display mt-8 text-[clamp(1.9rem,4.4vw,3.25rem)] text-text"
              />
              <div className="mt-10 flex flex-col gap-6">
                {project.description.map((paragraph) => (
                  <Reveal
                    key={paragraph}
                    className="max-w-[58ch] text-sm leading-relaxed text-dim md:text-base"
                  >
                    <p>{paragraph}</p>
                  </Reveal>
                ))}
              </div>
            </div>

            <div className="xl:col-span-5 xl:col-start-8">
              <dl className="flex flex-col">
                {project.facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="flex items-baseline justify-between gap-8 border-t border-hair py-5"
                  >
                    <dt className="u-label text-faint">{fact.label}</dt>
                    <dd className="max-w-[28ch] text-right text-sm text-text/85">{fact.value}</dd>
                  </div>
                ))}
                <div className="flex items-baseline justify-between gap-8 border-t border-hair py-5">
                  <dt className="u-label text-faint">Land</dt>
                  <dd className="text-right text-sm text-text/85">
                    {project.land} · {project.openSpace}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-8 border-t border-hair py-5">
                  <dt className="u-label text-faint">Areas</dt>
                  <dd className="u-num text-xs text-text/85">
                    {formatArea(project.areaRange[0])} – {formatArea(project.areaRange[1])}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-20 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {project.metrics.map((metric, i) => (
              <Reveal key={metric.label} delay={i * 0.07} className="border-t border-hair pt-6">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-[clamp(2.2rem,4.6vw,3.75rem)] leading-none text-text">
                    {metric.value}
                  </span>
                  <span className="u-label text-accent">{metric.label}</span>
                </div>
                <p className="mt-5 max-w-[24ch] text-xs leading-relaxed text-dim">{metric.sub}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 02 — architecture */}
      <section data-tone="light" className="border-t border-hair bg-paper-2 py-20 md:py-28">
        <div className="mx-auto w-full max-w-[110rem] px-6 md:px-10">
          <div className="grid gap-14 xl:grid-cols-12 xl:gap-16">
            <div className="xl:col-span-5">
              <Eyebrow index="02">Architecture</Eyebrow>
              <DisplayLines
                as="h2"
                lines={[project.statement]}
                className="u-display mt-8 max-w-[18ch] text-[clamp(1.9rem,4.4vw,3.25rem)] text-text"
              />
              <div className="mt-10 flex flex-col gap-6">
                {project.architecture.map((paragraph) => (
                  <Reveal
                    key={paragraph}
                    className="max-w-[54ch] text-sm leading-relaxed text-dim md:text-base"
                  >
                    <p>{paragraph}</p>
                  </Reveal>
                ))}
              </div>

              <ul className="mt-10 flex flex-col">
                {project.highlights.map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-3 border-t border-hair py-4 text-xs leading-relaxed text-text/70"
                  >
                    <span aria-hidden className="mt-1.5 h-px w-3 shrink-0 bg-accent/70" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            <Reveal className="xl:col-span-7">
              <Parallax amount={24} className="h-[clamp(320px,52vw,620px)] w-full">
                <MediaPlate media={architectureMedia} className="h-full w-full" caption index />
              </Parallax>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 03 — the story */}
      <StorySection project={project} eyebrowIndex="03" />

      {/* 04 — residences */}
      <section data-tone="light" className="border-t border-hair bg-paper py-20 md:py-28">
        <div className="mx-auto w-full max-w-[110rem] px-6 md:px-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow index="04">Residences</Eyebrow>
              <h2 className="u-display mt-8 max-w-[20ch] text-[clamp(1.9rem,4.4vw,3.25rem)] text-text">
                {`${project.residences.length} ways to live in the building.`}
              </h2>
            </div>
            <p className="u-label max-w-[28ch] text-faint">
              Prices exclude taxes, parking and statutory charges
            </p>
          </div>

          <ul className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-14">
            {project.residences.map((residence, i) => (
              <li key={residence.id} className="flex flex-col gap-6 border-t border-hair pt-8">
                <div className="flex items-baseline justify-between gap-6">
                  <span className="u-label text-accent/80">{pad2(i + 1)}</span>
                  <span className="u-num text-xs text-faint">
                    {formatArea(residence.areaSuper)}
                  </span>
                </div>

                <ClipReveal className="h-[clamp(200px,26vw,320px)] w-full">
                  <MediaPlate media={residence.media} className="h-full w-full" />
                </ClipReveal>

                <h3 className="u-display text-[clamp(1.6rem,3.2vw,2.25rem)] text-text">
                  {residence.configuration}
                </h3>
                <p className="max-w-[46ch] text-sm leading-relaxed text-dim">{residence.copy}</p>
                <p className="max-w-[46ch] text-xs leading-relaxed text-text/50">
                  {residence.detail}
                </p>

                <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {residence.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-xs leading-relaxed text-text/65"
                    >
                      <span aria-hidden className="mt-1.5 h-px w-3 shrink-0 bg-accent/70" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-wrap items-center gap-8 border-t border-hair pt-6">
                  <span className="font-display text-[1.75rem] leading-none text-text">
                    {formatINR(residence.priceFrom)}
                  </span>
                  <Action href={`/book-a-viewing?residence=${residence.id}`} variant="text" arrow>
                    Request the details
                  </Action>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 05 — plans */}
      {project.plans.length ? <FloorPlanSection project={project} eyebrowIndex="05" /> : null}

      {/* 06 — availability */}
      <section data-tone="light" className="border-t border-hair bg-paper py-20 md:py-28">
        <div className="mx-auto w-full max-w-[110rem] px-6 md:px-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow index="06">Availability</Eyebrow>
              <h2 className="u-display mt-8 max-w-[20ch] text-[clamp(1.9rem,4.4vw,3.25rem)] text-text">
                Live inventory.
              </h2>
            </div>
            <Action href="/availability" variant="text" arrow>
              Open the portfolio availability desk
            </Action>
          </div>

          <div className="mt-12">
            <AvailabilityTable units={project.units} project={project} />
          </div>
        </div>
      </section>

      {/* 07 — amenities */}
      {project.amenities.length ? (
        <section data-tone="light" className="border-t border-hair bg-paper-2 py-20 md:py-28">
          <div className="mx-auto w-full max-w-[110rem] px-6 md:px-10">
            <Eyebrow index="07">Experience</Eyebrow>
            <div className="mt-10 flex flex-col gap-14">
              {project.amenities.map((cluster, i) => (
                <div
                  key={cluster.id}
                  className="grid gap-10 border-t border-hair pt-10 xl:grid-cols-12 lg:gap-14"
                >
                  <div className={i % 2 === 0 ? "xl:col-span-5" : "xl:col-span-5 xl:col-start-8"}>
                    <div className="flex items-center gap-5">
                      <span className="u-label text-accent/80">{cluster.index}</span>
                      <span className="u-label text-faint">{cluster.category}</span>
                    </div>
                    <h3 className="u-display mt-6 max-w-[16ch] text-[clamp(1.5rem,3.2vw,2.25rem)] text-text">
                      {cluster.statement}
                    </h3>
                    <p className="mt-6 max-w-[46ch] text-sm leading-relaxed text-dim">
                      {cluster.copy}
                    </p>
                    <ul className="mt-8 flex flex-col">
                      {cluster.items.map((item) => (
                        <li
                          key={item.name}
                          className="flex items-baseline justify-between gap-6 border-b border-hair py-3"
                        >
                          <span className="text-sm text-text/85">{item.name}</span>
                          {item.note ? (
                            <span className="u-label text-right text-faint">{item.note}</span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div
                    className={
                      i % 2 === 0
                        ? "xl:col-span-7"
                        : "xl:col-span-6 xl:col-start-1 xl:row-start-1"
                    }
                  >
                    <ClipReveal className="h-[clamp(240px,34vw,460px)] w-full">
                      <MediaPlate media={cluster.media} className="h-full w-full" caption index />
                    </ClipReveal>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* 08 — gallery */}
      {project.gallery.length ? (
        <div className="border-t border-hair">
          <GallerySection project={project} eyebrowIndex="08" />
        </div>
      ) : null}

      {/* 09 — location */}
      <section data-tone="light" className="border-t border-hair bg-paper py-20 md:py-28">
        <div className="mx-auto w-full max-w-[110rem] px-6 md:px-10">
          <div className="grid gap-12 xl:grid-cols-12 xl:gap-16">
            <div className="xl:col-span-5">
              <Eyebrow index="09">Location</Eyebrow>
              <h2 className="u-display mt-8 max-w-[18ch] text-[clamp(1.8rem,4vw,2.75rem)] text-text">
                {project.addressLine}
              </h2>
              <p className="mt-6 max-w-[44ch] text-sm leading-relaxed text-dim">
                Drive times are measured from the site outside peak hours.
              </p>
              <div className="mt-10">
                <Parallax amount={18} className="h-[clamp(260px,34vw,420px)] w-full">
                  <MediaPlate
                    media={{
                      scene: "arrival",
                      tone: "night",
                      image: project.gallery[0]?.media.image,
                      caption: `Approach to ${project.name}`,
                      alt: `${project.name} approach road`,
                    }}
                    className="h-full w-full"
                    caption
                  />
                </Parallax>
              </div>
            </div>

            <div className="xl:col-span-6 xl:col-start-7">
              <ul className="flex flex-col">
                {project.nearby.map((place) => (
                  <li key={place.id} className="flex items-baseline gap-6 border-t border-hair py-4">
                    <span className="u-num w-12 text-accent/80">{pad2(place.minutes)}</span>
                    <span className="flex flex-col gap-1">
                      <span className="text-sm text-text/85">{place.name}</span>
                      <span className="u-label text-faint">{place.category}</span>
                    </span>
                    <span className="u-num ml-auto text-xs text-faint">
                      {place.km.toFixed(1)} km
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <Action href="/#location" variant="text" arrow>
                  See the interactive location map
                </Action>
                <span className="u-label text-faint">Minutes, off-peak</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10 — investment */}
      <div className="border-t border-hair">
        <InvestmentSection project={project} eyebrowIndex="10" />
      </div>

      {/* 11 — questions */}
      <FaqSection project={project} eyebrowIndex="11" />

      {/* other projects */}
      <section data-tone="light" className="border-t border-hair bg-paper-2 py-16 md:py-20">
        <div className="mx-auto flex w-full max-w-[110rem] flex-col gap-8 px-6 md:px-10">
          <Eyebrow>Also from A Square Devs</Eyebrow>
          <div className="grid gap-8 md:grid-cols-3">
            {others.slice(0, 3).map((other) => (
              <Link
                key={other.slug}
                href={`/projects/${other.slug}`}
                className="group flex flex-col gap-4 border-t border-hair pt-6"
              >
                <span className="u-label text-faint">{other.statusLabel}</span>
                <span className="font-display text-[1.6rem] leading-none text-text transition-colors duration-500 group-hover:text-accent-2">
                  {other.name}
                </span>
                <span className="u-label text-faint">
                  {other.locality} · from {formatINR(other.priceFrom)}
                </span>
                <span className="u-label text-faint transition-colors duration-500 group-hover:text-accent-2">
                  Explore Project →
                </span>
              </Link>
            ))}
          </div>
          <Action href="/projects" variant="text" arrow className="self-start">
            See all six projects
          </Action>
        </div>
      </section>

      <CtaBand
        title={`See ${project.name} in person.`}
        copy="Viewings are private, run for about forty minutes, and can be arranged outside office hours on request."
        context={project.name}
      />
    </>
  );
}
