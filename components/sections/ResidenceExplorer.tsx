"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { availableCount, getFlagship, projectAvailability } from "@/data";
import type { ResidenceConfig } from "@/data/types";
import { cn, formatArea, formatINR } from "@/lib/format";
import { useCountUp } from "@/lib/motion";
import { selectPlan } from "@/lib/events";
import { EASE_LUXE } from "@/components/motion/Reveal";
import { MediaPlate } from "@/components/media/MediaPlate";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Label";
import { Action } from "@/components/ui/Action";
import { ResidenceDetailModal } from "@/components/features/ResidenceDetailModal";

const FEATURES_NOTE = "Furniture and styling for representation only.";

export function ResidenceExplorer() {
  const project = getFlagship();
  const residences = project.residences;
  const [index, setIndex] = useState(1);
  const [detailOpen, setDetailOpen] = useState(false);
  const reduce = useReducedMotion();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const active: ResidenceConfig = residences[index];
  const open = availableCount(active.configuration);
  const summary = projectAvailability(project);

  const area = useCountUp(active.areaSuper, 0.8);
  const price = useCountUp(active.priceFrom, 0.8);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const last = residences.length - 1;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      const next = index === last ? 0 : index + 1;
      setIndex(next);
      tabs.current[next]?.focus();
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      const next = index === 0 ? last : index - 1;
      setIndex(next);
      tabs.current[next]?.focus();
    }
  };

  return (
    <Section id="residences" tone="sand">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow index="02">Residences</Eyebrow>
          <h2 className="u-display mt-8 text-[clamp(2.4rem,6vw,5rem)] text-text">
            Find your residence.
          </h2>
        </div>
        <motion.div
          className="flex items-center gap-3"
          initial={reduce ? undefined : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE_LUXE }}
        >
          <span aria-hidden className="relative flex h-1.5 w-1.5">
            <span className="u-pulse-ring absolute inset-0 rounded-full bg-accent" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          <span className="u-label text-text/70">
            {summary.available} residences currently available
          </span>
        </motion.div>
      </div>

      <div className="mt-16 grid gap-12 lg:mt-20 xl:grid-cols-12 xl:gap-16">
        <div
          role="tablist"
          aria-label="Residence configurations"
          aria-orientation="vertical"
          className="flex flex-col xl:col-span-4"
          onKeyDown={onKeyDown}
        >
          {residences.map((residence, i) => {
            const isActive = i === index;
            const count = availableCount(residence.configuration);
            return (
              <button
                key={residence.id}
                ref={(node) => {
                  tabs.current[i] = node;
                }}
                role="tab"
                id={`residence-tab-${residence.id}`}
                aria-selected={isActive}
                aria-controls={`residence-panel-${residence.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setIndex(i)}
                className={cn(
                  "group relative flex items-baseline justify-between border-t border-hair py-6 text-left transition-colors duration-500",
                  isActive ? "text-text" : "text-faint hover:text-text/75",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-0 left-0 h-px bg-accent transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    isActive ? "w-full" : "w-0 group-hover:w-1/3",
                  )}
                />
                <span className="flex items-baseline gap-4">
                  <span className="u-label text-accent/80">{`0${i + 1}`}</span>
                  <span className="font-display text-[clamp(1.5rem,2.6vw,2.15rem)] leading-none">
                    {residence.configuration}
                  </span>
                </span>
                <span className="u-num text-xs text-text/50">
                  {formatArea(residence.areaSuper).replace(" sq.ft.", "")}
                </span>
                <span className="sr-only">
                  {residence.bedrooms} bedrooms, {count} available
                </span>
              </button>
            );
          })}
          <div className="border-t border-hair pt-8">
            <p className="max-w-[34ch] text-sm leading-relaxed text-dim">
              Every plan is drawn around the light it receives. Orientation, level and depth of
              balcony vary by stack.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-6">
              <Action href="/availability" variant="text" arrow>
                View available residences
              </Action>
            </div>
          </div>
        </div>

        <div className="xl:col-span-8">
          <div
            id={`residence-panel-${active.id}`}
            role="tabpanel"
            aria-labelledby={`residence-tab-${active.id}`}
            className="relative"
          >
            <div className="relative aspect-[16/11] w-full overflow-hidden bg-paper-3">
              <AnimatePresence initial={false}>
                <motion.div
                  key={active.id}
                  className="absolute inset-0"
                  initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 1.045 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.01 }}
                  transition={{ duration: 1.1, ease: EASE_LUXE }}
                >
                  <MediaPlate
                    media={active.media}
                    sizes="(max-width: 1279px) 92vw, 62vw"
                    className="h-full w-full"
                    overlay="soft"
                    caption
                    index
                    decorative
                  />
                </motion.div>
              </AnimatePresence>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-6 md:p-8">
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-[clamp(2.4rem,5vw,4rem)] leading-none text-text">
                    {Math.round(area).toLocaleString("en-IN")}
                  </span>
                  <span className="u-label text-accent">SQ.FT. SUPER BUILT-UP</span>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-8 border-t border-hair pt-8 md:grid-cols-[1fr_1.1fr] md:gap-14">
              <div className="flex flex-col gap-6">
                <div className="flex items-baseline gap-4">
                  <span className="u-label text-faint">From</span>
                  <motion.span
                    key={active.id}
                    initial={reduce ? undefined : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: EASE_LUXE }}
                    className="font-display text-[clamp(1.8rem,3.2vw,2.6rem)] leading-none text-text"
                  >
                    {formatINR(price)}
                  </motion.span>
                  <span className="u-label text-faint">+ taxes</span>
                </div>

                <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
                  <div className="flex flex-col gap-1.5">
                    <dt className="u-label text-faint">Available</dt>
                    <dd className="u-num text-sm text-text/90">
                      {open === 1 ? "1 residence" : `${open} residences`}
                    </dd>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <dt className="u-label text-faint">Bedrooms</dt>
                    <dd className="u-num text-sm text-text/90">
                      {active.bedrooms} bed · {active.bathrooms} bath
                    </dd>
                  </div>
                </dl>

                <div className="flex flex-wrap gap-4">
                  <Action
                    href="/#floor-plan"
                    variant="quartz"
                    arrow
                    onClick={() => selectPlan(active.configuration)}
                  >
                    View Floor Plan
                  </Action>
                  <Action variant="text" onClick={() => setDetailOpen(true)} arrow>
                    Request Details
                  </Action>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <p className="text-sm leading-relaxed text-text/80 md:text-base">{active.copy}</p>
                <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {active.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-xs leading-relaxed text-dim">
                      <span aria-hidden className="mt-1.5 h-px w-3 shrink-0 bg-accent/70" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <p className="u-label text-faint">{FEATURES_NOTE}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ResidenceDetailModal open={detailOpen} onClose={() => setDetailOpen(false)} residence={active} />
    </Section>
  );
}
