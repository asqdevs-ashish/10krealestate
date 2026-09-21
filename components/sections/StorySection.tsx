import { getFlagship } from "@/data";
import type { Project } from "@/data/types";
import { cn } from "@/lib/format";
import { Eyebrow } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";
import { ClipReveal, DisplayLines, Parallax, Reveal } from "@/components/motion/Reveal";
import { MediaPlate } from "@/components/media/MediaPlate";

/**
 * Property story.
 *
 * The editorial sequence between the facts and the drawings: one chapter per
 * idea, each a large image against a short paragraph. The composition
 * alternates side to side and the frames alternate landscape to portrait, so
 * the sequence has a rhythm instead of reading as a list of cards.
 */
export function StorySection({
  project = getFlagship(),
  eyebrowIndex = "03",
}: {
  project?: Project;
  eyebrowIndex?: string;
}) {
  const chapters = project.story;
  if (!chapters.length) return null;

  return (
    <Section id="story" tone="dark">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow index={eyebrowIndex}>The story</Eyebrow>
          <DisplayLines
            as="h2"
            lines={["What decides", "how it feels."]}
            className="u-display mt-8 text-[clamp(2.1rem,5.2vw,4.25rem)] text-text"
          />
        </div>
        <p className="u-label max-w-[32ch] text-faint">
          {chapters.map((chapter) => chapter.category).join(" · ")}
        </p>
      </div>

      <div className="mt-20 flex flex-col gap-24 lg:mt-28 lg:gap-36">
        {chapters.map((chapter, i) => {
          const imageRight = i % 2 === 1;

          return (
            <article
              key={chapter.id}
              className="grid items-center gap-10 lg:gap-14 xl:grid-cols-12"
            >
              <ClipReveal
                direction={imageRight ? "left" : "up"}
                className={cn(
                  "xl:col-span-7",
                  imageRight && "xl:col-start-6 xl:row-start-1",
                )}
              >
                <Parallax
                  amount={20}
                  className={cn(
                    "w-full",
                    i % 2 === 0 ? "aspect-[16/11]" : "aspect-[4/5] xl:aspect-[3/4]",
                  )}
                >
                  <MediaPlate
                    media={chapter.media}
                    sizes="(max-width: 1279px) 92vw, 55vw"
                    className="h-full w-full"
                    caption
                    index
                  />
                </Parallax>
              </ClipReveal>

              <Reveal
                delay={0.1}
                className={cn(
                  "xl:col-span-4",
                  imageRight ? "xl:col-start-1 xl:row-start-1" : "xl:col-start-9",
                )}
              >
                <div className="flex items-center gap-5">
                  <span className="u-label text-accent/80">{chapter.index}</span>
                  <span aria-hidden className="h-px w-8 bg-hair-strong" />
                  <span className="u-label text-faint">{chapter.category}</span>
                </div>

                <h3 className="u-display mt-8 max-w-[18ch] text-[clamp(1.7rem,3.8vw,2.75rem)] text-text">
                  {chapter.statement}
                </h3>

                <p className="mt-6 max-w-[46ch] text-sm leading-relaxed text-dim md:text-base">
                  {chapter.copy}
                </p>

                <p className="mt-8 border-t border-hair pt-5 u-label text-faint">{chapter.meta}</p>
              </Reveal>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
