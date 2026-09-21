"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { getFlagship } from "@/data";
import { siteMarkerFor } from "@/data/amenities";
import { cn } from "@/lib/format";
import { useMediaQuery } from "@/lib/motion";
import { Eyebrow } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";
import { DisplayLines, Reveal } from "@/components/motion/Reveal";
// The map is a decorative, non-crawlable canvas that draws nothing useful until
// it is scrolled to, so it is fetched in the background after the page is
// interactive rather than in the initial bundle.
const LocationMap = dynamic(
  () => import("@/components/features/LocationMap").then((m) => m.LocationMap),
  {
    ssr: false,
    loading: () => <div className="aspect-[4/3] w-full bg-paper-3" />,
  },
);

/**
 * Destinations advance on their own until the visitor takes over — the section
 * stays alive without demanding input.
 */
export function LocationSection() {
  const project = getFlagship();
  const places = project.nearby;
  const site = siteMarkerFor(project.name, project.locality);
  const [activeId, setActiveId] = useState(places[0].id);
  const [auto, setAuto] = useState(true);
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const counter = useRef(0);

  useEffect(() => {
    if (!auto || reduce) return;
    const timer = window.setInterval(() => {
      counter.current = (counter.current + 1) % places.length;
      setActiveId(places[counter.current].id);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [auto, reduce, places]);

  const select = (id: string) => {
    setAuto(false);
    counter.current = places.findIndex((p) => p.id === id);
    setActiveId(id);
  };

  return (
    <Section id="location" tone="sand">
      <div className="grid gap-10 xl:grid-cols-12 xl:gap-16">
        <div className="xl:col-span-6">
          <Eyebrow index="05">Location</Eyebrow>
          <DisplayLines
            as="h2"
            lines={["Everything", "within reach."]}
            className="u-display mt-8 text-[clamp(2.3rem,5.6vw,4.75rem)] text-text"
          />
        </div>
        <Reveal delay={0.1} className="flex flex-col justify-end gap-6 xl:col-span-6">
          <p className="max-w-[46ch] text-sm leading-relaxed text-dim md:text-base">
            {project.locality} sits between the golf course and the expressway. The airport is one
            uninterrupted run south; the metro is eight minutes west.
          </p>
          <div className="flex flex-wrap gap-x-10 gap-y-3 border-t border-hair pt-5">
            <span className="u-label text-faint">Golf Course Road corridor</span>
            <span className="u-label text-faint">Rapid Metro · 8 min</span>
            <span className="u-label text-faint">IGI T3 · 18 min</span>
          </div>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-10 xl:grid-cols-12 lg:gap-14">
        <div className="xl:col-span-5">
          <ul className="flex flex-col">
            {places.map((place) => {
              const isActive = place.id === activeId;
              return (
                <li key={place.id} className="border-t border-hair">
                  <button
                    type="button"
                    onPointerEnter={() => select(place.id)}
                    onFocus={() => select(place.id)}
                    onClick={() => select(place.id)}
                    aria-pressed={isActive}
                    className={cn(
                      "group relative flex w-full items-baseline gap-5 py-5 text-left transition-colors duration-500",
                      isActive ? "text-text" : "text-faint hover:text-text/75",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "absolute top-0 left-0 h-px bg-accent transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        isActive ? "w-full" : "w-0 group-hover:w-1/4",
                      )}
                    />
                    <span className="u-num w-14 shrink-0 text-[1.05rem] text-accent/85">
                      {place.minutes.toString().padStart(2, "0")}
                    </span>
                    <span className="flex flex-col gap-1.5">
                      <span className="text-base md:text-lg">{place.name}</span>
                      <span className="u-label text-faint">
                        {place.category} · {place.km.toFixed(1)} km
                      </span>
                    </span>
                    <motion.span
                      aria-hidden
                      className="ml-auto h-px bg-accent"
                      animate={{ width: isActive ? 28 : 0, opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    />
                    <span className="sr-only">minutes</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-6 max-w-[42ch] text-xs leading-relaxed text-faint">
            Drive times are indicative, measured from the site office outside peak hours.
          </p>
        </div>

        <div className="xl:col-span-7">
          <Reveal>
            <LocationMap
              places={places}
              site={site}
              activeId={activeId}
              onSelect={select}
              className="aspect-[4/3]"
            />
          </Reveal>
        </div>
      </div>

      <Reveal className="mt-20 border-t border-hair pt-10">
        <p className="u-display max-w-[34ch] text-[clamp(1.5rem,3vw,2.4rem)] text-text/90">
          The location is part of the product.
        </p>
      </Reveal>
    </Section>
  );
}
