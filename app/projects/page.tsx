import type { Metadata } from "next";
import Link from "next/link";
import { getUpcoming, listProjects, portfolioSummary, projectAvailability } from "@/data";
import { cn, formatArea, formatINR, pad2 } from "@/lib/format";
import { buildWhatsAppMessage, whatsappUrl } from "@/lib/whatsapp";
import { PageHero } from "@/components/ui/PageHero";
import { CtaBand } from "@/components/ui/CtaBand";
import { Eyebrow } from "@/components/ui/Label";
import { Action } from "@/components/ui/Action";
import { MediaPlate } from "@/components/media/MediaPlate";
import { ClipReveal, DisplayLines, Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Six addresses in Gurugram — VAULT, NOIR, ARC, VERDE, THE EDITION and ALTO. Private residences, garden residences and sky residences from A Square Devs.",
};

/** Three row layouts, cycled so no two consecutive projects read the same. */
const LAYOUTS = ["image-right", "image-left", "wide"] as const;

export default function ProjectsPage() {
  const [flagship, ...rest] = listProjects();
  const upcoming = getUpcoming();
  const summary = portfolioSummary();
  const flagshipStock = projectAvailability(flagship);

  return (
    <>
      <PageHero
        index="01"
        eyebrow="Projects"
        lines={["Six addresses,", "one way of building."]}
        copy="We keep the portfolio deliberately small. Every project is planned for the long term — the plan, the planting and the materials are chosen for how they will hold up in fifteen years, not how they photograph in the first."
        meta={[
          { label: "In the portfolio", value: `${summary.projects} projects` },
          { label: "Residences", value: `${summary.residences} in total` },
          { label: "Available now", value: `${summary.available} residences` },
          { label: "Delivered", value: summary.delivered },
        ]}
        media={{
          scene: "aerial",
          tone: "dusk",
          image: flagship.hero.image,
          index: "01",
          caption: "Portfolio · the Golf Course Road corridor",
          alt: "Aerial view of the Golf Course Road corridor in Gurugram",
        }}
      />

      {/* Featured */}
      <section data-tone="light" className="bg-paper py-16 md:py-20">
        <div className="mx-auto w-full max-w-[110rem] px-6 md:px-10">
          <Link href={`/projects/${flagship.slug}`} className="group block">
            <div className="grid gap-10 xl:grid-cols-12 lg:items-end lg:gap-12">
              <div className="xl:col-span-8">
                <ClipReveal>
                  <MediaPlate
                    media={flagship.hero}
                    sizes="(max-width: 1279px) 92vw, 62vw"
                    className="h-[clamp(300px,52vw,660px)] w-full transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.015]"
                    caption
                    index
                  />
                </ClipReveal>
              </div>

              <div className="xl:col-span-4">
                <Eyebrow index="01">Flagship</Eyebrow>
                <h2 className="u-display mt-6 text-[clamp(2.4rem,5.6vw,4rem)] text-text transition-colors duration-500 group-hover:text-accent-2">
                  {flagship.name}
                </h2>
                <p className="u-label mt-3 text-faint">
                  {flagship.subtitle} · {flagship.locality}, {flagship.city}
                </p>
                <p className="mt-6 max-w-[40ch] text-sm leading-relaxed text-dim">
                  {flagship.description[0]}
                </p>

                <ul className="mt-8 flex flex-col">
                  {flagship.highlights.map((line) => (
                    <li
                      key={line}
                      className="flex items-start gap-3 border-t border-hair py-3 text-xs leading-relaxed text-text/70"
                    >
                      <span aria-hidden className="mt-1.5 h-px w-3 shrink-0 bg-accent/70" />
                      {line}
                    </li>
                  ))}
                </ul>

                <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5">
                  <div className="flex flex-col gap-1.5">
                    <dt className="u-label text-faint">From</dt>
                    <dd className="u-num text-xs text-text/90">{formatINR(flagship.priceFrom)}</dd>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <dt className="u-label text-faint">Available</dt>
                    <dd className="u-num text-xs text-text/90">
                      {pad2(flagshipStock.available)} residences
                    </dd>
                  </div>
                </dl>

                <span className="u-label mt-8 inline-flex items-center gap-3 text-text/60 transition-colors duration-500 group-hover:text-accent-2">
                  Explore Project
                  <span
                    aria-hidden
                    className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* The rest of the portfolio */}
      <section data-tone="light" className="border-t border-hair bg-paper pb-24 md:pb-32">
        <div className="mx-auto w-full max-w-[110rem] px-6 md:px-10">
          <Reveal className="flex flex-col gap-6 py-14 md:flex-row md:items-end md:justify-between">
            <DisplayLines
              as="h2"
              lines={["The rest of", "the portfolio."]}
              className="u-display text-[clamp(1.8rem,4vw,3rem)] text-text"
            />
            <p className="u-label max-w-[30ch] text-faint">
              Reserved inventory is released to registered buyers first
            </p>
          </Reveal>

          <ul className="flex flex-col">
            {rest.map((project, i) => {
              const layout = LAYOUTS[i % LAYOUTS.length];
              const stock = projectAvailability(project);
              const wide = layout === "wide";

              const details = (
                <div className="xl:col-span-5">
                  <div className="flex items-center gap-5">
                    <span className="u-label text-accent/80">{pad2(i + 2)}</span>
                    <span className="u-label text-faint">{project.statusLabel}</span>
                  </div>

                  <h3 className="u-display mt-6 text-[clamp(2rem,4.6vw,3.4rem)] text-text transition-colors duration-500 group-hover:text-accent-2">
                    {project.name}
                  </h3>
                  <p className="u-label mt-3 text-faint">
                    {project.subtitle} · {project.locality}, {project.city}
                  </p>

                  <p className="mt-6 max-w-[46ch] text-sm leading-relaxed text-dim">
                    {project.description[0]}
                  </p>

                  <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-5">
                    <div className="flex flex-col gap-1.5">
                      <dt className="u-label text-faint">Configuration</dt>
                      <dd className="u-num text-xs text-text/85">
                        {project.configurations.join(" · ")}
                      </dd>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <dt className="u-label text-faint">Area</dt>
                      <dd className="u-num text-xs text-text/85">
                        {formatArea(project.areaRange[0])} – {formatArea(project.areaRange[1])}
                      </dd>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <dt className="u-label text-faint">From</dt>
                      <dd className="u-num text-xs text-text/85">{formatINR(project.priceFrom)}</dd>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <dt className="u-label text-faint">Available</dt>
                      <dd className="u-num text-xs text-text/85">
                        {pad2(stock.available)} of {project.totalResidences}
                      </dd>
                    </div>
                  </dl>

                  <span className="u-label mt-8 inline-flex items-center gap-3 text-text/60 transition-colors duration-500 group-hover:text-accent-2">
                    Explore Project
                    <span
                      aria-hidden
                      className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </div>
              );

              const media = (
                <ClipReveal delay={0.06}>
                  <MediaPlate
                    media={project.hero}
                    sizes="(max-width: 1279px) 92vw, 55vw"
                    className={cn(
                      "w-full transition-transform duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]",
                      wide ? "h-[clamp(240px,34vw,440px)]" : "h-[clamp(280px,42vw,560px)]",
                    )}
                    caption
                    index
                  />
                </ClipReveal>
              );

              return (
                <li key={project.slug} className="border-t border-hair">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group grid gap-8 py-12 xl:grid-cols-12 lg:items-center lg:gap-12 lg:py-16"
                  >
                    {layout === "image-left" ? (
                      <>
                        <div className="xl:col-span-6">{media}</div>
                        <div className="xl:col-span-1" aria-hidden />
                        {details}
                      </>
                    ) : layout === "wide" ? (
                      <>
                        {details}
                        <div className="xl:col-span-7">{media}</div>
                      </>
                    ) : (
                      <>
                        {details}
                        <div className="xl:col-span-6 xl:col-start-7">{media}</div>
                      </>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Land in preparation */}
      <section data-tone="light" className="border-t border-hair bg-paper-2 py-20 md:py-24">
        <div className="mx-auto grid w-full max-w-[110rem] gap-10 px-6 md:px-10 xl:grid-cols-12 lg:items-end">
          <Reveal className="xl:col-span-6">
            <Eyebrow>In preparation</Eyebrow>
            <h2 className="u-display mt-6 max-w-[20ch] text-[clamp(1.7rem,3.8vw,2.75rem)] text-text">
              {upcoming.name} — {upcoming.note}
            </h2>
            <p className="mt-6 max-w-[46ch] text-sm leading-relaxed text-dim">{upcoming.detail}</p>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-wrap gap-4 xl:col-span-5 xl:col-start-8">
            <Action
              href={whatsappUrl(
                buildWhatsAppMessage({ intent: "advisor", projectName: upcoming.name }),
              )}
              external
              variant="quartz"
              arrow
            >
              Register interest
            </Action>
            <Action href="/book-a-viewing" variant="text" arrow>
              Talk to the land desk
            </Action>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Visit the site before you shortlist anything."
        copy="The experience centre is at the Sector 58 site. Viewings run Monday to Saturday, and take about forty minutes."
        context="A Square Devs"
      />
    </>
  );
}
