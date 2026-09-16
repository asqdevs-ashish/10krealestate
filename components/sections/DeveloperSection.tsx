import { brand } from "@/data/brand";
import { media } from "@/data/media";
import { getFlagship, listProjects, portfolioSummary } from "@/data";
import { Eyebrow } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";
import { ClipReveal, DisplayLines, Parallax, Reveal } from "@/components/motion/Reveal";
import { MediaPlate } from "@/components/media/MediaPlate";
import { Action } from "@/components/ui/Action";
import { Wordmark } from "@/components/ui/Wordmark";

export function DeveloperSection() {
  const project = getFlagship();
  const others = listProjects().filter((p) => !p.isFlagship);
  const summary = portfolioSummary();

  const stats = [
    { value: "12+", label: "Years building" },
    { value: "24", label: "Projects delivered" },
    { value: "8.2M+", label: "Sq.ft. developed" },
    { value: `${summary.projects}`, label: "In the portfolio now" },
  ];

  return (
    <Section id="developer" tone="dark">
      <div className="grid gap-14 xl:grid-cols-12 xl:gap-16">
        <div className="xl:col-span-7">
          <Eyebrow index="11">The developer</Eyebrow>
          <DisplayLines
            as="h2"
            lines={["We build places", "people want to", "come back to."]}
            className="u-display mt-8 text-[clamp(2.1rem,5.2vw,4.25rem)] text-text"
          />
        </div>

        <div className="flex flex-col justify-end gap-10 xl:col-span-4 xl:col-start-9">
          <p className="text-sm leading-relaxed text-dim md:text-base">
            {brand.name} has spent twelve years building in Gurugram — houses, low-rise blocks and
            now {project.name}. We keep project teams small, work with the same architects, and stay
            involved long after handover.
          </p>
          <dl className="flex flex-col">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-baseline justify-between border-t border-hair py-4"
              >
                <dt className="u-label text-faint">{stat.label}</dt>
                <dd className="font-display text-[clamp(1.5rem,2.6vw,2.1rem)] leading-none text-text">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-20 grid gap-8 xl:grid-cols-12">
        <ClipReveal className="xl:col-span-8">
          <Parallax amount={26} className="aspect-[16/9] w-full">
            <MediaPlate
              media={{
                scene: "material-stone",
                tone: "stone",
                image: media.concrete,
                index: "11",
                caption: "Site studio · material selection",
                alt: "Material selection on the studio floor",
              }}
              caption
              index
              className="h-full w-full"
            />
          </Parallax>
        </ClipReveal>

        <Reveal delay={0.12} className="flex flex-col justify-between gap-8 xl:col-span-4">
          <Wordmark size="lg" />
          <div className="flex flex-col gap-4">
            {others.map((other) => (
              <Action key={other.slug} href={`/projects/${other.slug}`} variant="text" arrow>
                {other.name}
                <span className="sr-only"> — {other.statusLabel}</span>
              </Action>
            ))}
          </div>
          <p className="max-w-[32ch] text-xs leading-relaxed text-faint">
            {project.name} is phase one of a longer plan for the {project.locality} corridor.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
