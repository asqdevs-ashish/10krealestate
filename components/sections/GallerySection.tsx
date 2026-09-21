"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { getFlagship } from "@/data";
import type { GalleryItem, Project } from "@/data/types";
import { cn, pad2 } from "@/lib/format";
import { Eyebrow } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";
import { ClipReveal, DisplayLines, Reveal } from "@/components/motion/Reveal";
import { MediaPlate } from "@/components/media/MediaPlate";
// Only fetched once a visitor opens a photograph. The modal mounts nothing
// visible until then, so keeping it out of the initial bundle costs nothing.
const Modal = dynamic(() => import("@/components/ui/Modal").then((m) => m.Modal), {
  ssr: false,
});

/**
 * Editorial gallery.
 *
 * The grid derives its own rhythm from the order of the items rather than from
 * a fixed span on each record, so any selection a CMS returns tiles cleanly:
 * a full-bleed opener, paired plates through the middle, a full-bleed closer.
 * Row heights are explicit rather than aspect-driven, which keeps the bottom
 * edges aligned whatever the column split.
 */

type Rhythm = GalleryItem["span"];

function spanFor(index: number, total: number): Rhythm {
  if (index === total - 1) return "full";
  // A leading full-width plate only works if the remaining pairs divide evenly.
  const leading = total >= 4 && (total - 2) % 2 === 0;
  if (leading && index === 0) return "full";
  const pairIndex = leading ? index - 1 : index;
  return pairIndex % 2 === 0 ? "wide" : "std";
}

const SPAN: Record<Rhythm, string> = {
  full: "xl:col-span-12",
  wide: "xl:col-span-7",
  tall: "xl:col-span-7",
  std: "xl:col-span-5",
};

const HEIGHT: Record<Rhythm, string> = {
  full: "h-[clamp(260px,52vw,620px)]",
  wide: "h-[clamp(240px,34vw,470px)]",
  tall: "h-[clamp(240px,34vw,470px)]",
  std: "h-[clamp(240px,34vw,470px)]",
};

/** Grid entries are 5 or 7 columns of a 12-column grid, or the full width. */
const SIZES: Record<Rhythm, string> = {
  full: "100vw",
  wide: "(max-width: 1279px) 92vw, 56vw",
  tall: "(max-width: 1279px) 92vw, 56vw",
  std: "(max-width: 1279px) 92vw, 40vw",
};

export function GallerySection({
  project = getFlagship(),
  eyebrowIndex = "07",
}: {
  project?: Project;
  eyebrowIndex?: string;
}) {
  const items = project.gallery;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const touchStart = useRef<number | null>(null);
  const isOpen = openIndex !== null;
  const current = openIndex !== null ? items[openIndex] : null;

  const step = useCallback(
    (direction: 1 | -1) => {
      setOpenIndex((index) => {
        if (index === null) return index;
        return (index + direction + items.length) % items.length;
      });
    },
    [items.length],
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, step]);

  return (
    <Section id="gallery" tone="dark">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Eyebrow index={eyebrowIndex}>Gallery</Eyebrow>
          <DisplayLines
            as="h2"
            lines={["Twenty minutes", "before the light goes."]}
            className="u-display mt-8 text-[clamp(2.2rem,5.4vw,4.5rem)] text-text"
          />
        </div>
        <p className="max-w-[36ch] text-sm leading-relaxed text-dim">
          Photography of {project.name} — the buildings, the residences as they will be handed
          over, and the materials they are built from.
        </p>
      </div>

      <div className="mt-16 grid gap-6 xl:grid-cols-12 lg:gap-8">
        {items.map((item, i) => {
          const span = spanFor(i, items.length);
          return (
            <Reveal key={item.id} delay={(i % 3) * 0.06} className={cn(SPAN[span])}>
              <figure className="group flex flex-col gap-4">
                <ClipReveal className={cn("w-full", HEIGHT[span])}>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(i)}
                    className="block h-full w-full cursor-zoom-in"
                    aria-label={`Open image: ${item.caption}`}
                  >
                    <MediaPlate
                      media={item.media}
                      decorative
                      overlay="soft"
                      sizes={SIZES[span]}
                      className="h-full w-full transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035]"
                    />
                  </button>
                </ClipReveal>
                <figcaption className="flex items-baseline justify-between gap-6">
                  <span className="u-label text-faint">{item.meta}</span>
                  <span className="max-w-[38ch] text-right text-xs leading-relaxed text-text/65">
                    {item.caption}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          );
        })}
      </div>

      <Modal
        open={isOpen}
        onClose={() => setOpenIndex(null)}
        label={`${project.name} gallery`}
        className="md:max-w-6xl"
      >
        {current ? (
          <div
            className="flex flex-col"
            onTouchStart={(event) => {
              touchStart.current = event.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(event) => {
              const start = touchStart.current;
              touchStart.current = null;
              const end = event.changedTouches[0]?.clientX;
              if (start === null || end === undefined) return;
              const delta = end - start;
              if (Math.abs(delta) < 48) return;
              step(delta < 0 ? 1 : -1);
            }}
          >
            <motion.div
              key={current.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <MediaPlate
                media={current.media}
                decorative
                overlay="soft"
                sizes="(max-width: 767px) 92vw, 70vw"
                className="h-[clamp(240px,52vw,620px)] w-full"
              />
            </motion.div>

            <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
              <div className="flex flex-col gap-2">
                <span className="u-label text-faint">{current.meta}</span>
                <p className="max-w-[46ch] text-sm leading-relaxed text-text/80">
                  {current.caption}
                </p>
              </div>
              <div className="flex items-center justify-between gap-6 md:justify-end">
                <span className="u-num text-xs text-faint">
                  {pad2((openIndex ?? 0) + 1)} / {pad2(items.length)}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    className="u-label border border-hair-strong px-4 py-2 text-text/70 transition-colors duration-500 hover:border-accent/60 hover:text-text"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    className="u-label border border-hair-strong px-4 py-2 text-text/70 transition-colors duration-500 hover:border-accent/60 hover:text-text"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </Section>
  );
}
