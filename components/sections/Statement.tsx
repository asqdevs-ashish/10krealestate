import { getFlagship } from "@/data";
import { media } from "@/data/media";
import { Eyebrow } from "@/components/ui/Label";
import { ClipReveal, DisplayLines, DrawnRule, Parallax, Reveal } from "@/components/motion/Reveal";
import { MediaPlate } from "@/components/media/MediaPlate";
import { Section } from "@/components/ui/Section";
import { Action } from "@/components/ui/Action";

export function Statement() {
  const project = getFlagship();

  return (
    <Section id="statement" tone="light">
      <div className="grid gap-16 xl:grid-cols-12 lg:gap-20">
        <div className="xl:col-span-5">
          <ClipReveal className="relative">
            <Parallax amount={30} className="aspect-[4/5] w-full lg:aspect-[3/4]">
              <MediaPlate
                media={{
                  scene: "facade",
                  tone: "stone",
                  image: media.stone,
                  index: "01",
                  caption: "North facade · 300 mm stone fins",
                  alt: "Close view of the stone fin facade of the VAULT towers",
                }}
                caption
                index
                className="h-full w-full"
              />
            </Parallax>
          </ClipReveal>

          <Reveal delay={0.2} className="mt-8 flex flex-wrap items-baseline gap-x-10 gap-y-3">
            <span className="u-label text-faint">Architecture</span>
            <span className="u-label text-text/70">Stone, glass, warm timber</span>
            <span className="u-label text-faint">Orientation</span>
            <span className="u-label text-text/70">North-east light</span>
          </Reveal>
        </div>

        <div className="xl:col-span-7 xl:pl-10">
          <Eyebrow index="01">The project</Eyebrow>

          <DisplayLines
            as="h2"
            lines={["Designed to feel", "as good as it looks."]}
            className="u-display mt-10 text-[clamp(2.4rem,6.2vw,5.25rem)] text-text"
          />

          <div className="mt-12 grid gap-10 md:grid-cols-2">
            <Reveal className="flex flex-col gap-6 text-sm leading-relaxed text-dim md:text-base">
              <p>{project.description[0]}</p>
              <p className="text-text/80">{project.description[1]}</p>
            </Reveal>
            <Reveal delay={0.12} className="flex flex-col justify-between gap-8">
              <p className="text-sm leading-relaxed text-dim md:text-base">{project.description[2]}</p>
              <div className="flex flex-col gap-4">
                <DrawnRule />
                <Action href={`/projects/${project.slug}`} variant="text" arrow>
                  Read the architecture notes
                </Action>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="mt-24 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-32 lg:grid-cols-4">
        {project.metrics.map((metric, i) => (
          <Reveal
            key={metric.label}
            delay={i * 0.08}
            className="border-t border-hair pt-6"
          >
            <div className="flex items-baseline gap-3">
              <span className="font-display text-[clamp(2.5rem,5.4vw,4.5rem)] leading-[0.9] text-text">
                {metric.value}
              </span>
              <span className="u-label text-accent">{metric.label}</span>
            </div>
            <p className="mt-5 max-w-[24ch] text-xs leading-relaxed text-dim">{metric.sub}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
