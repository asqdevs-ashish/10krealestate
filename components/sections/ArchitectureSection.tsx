"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/format";
import { useMediaQuery, useScrollProgress } from "@/lib/motion";
import { silenceThreeClockNotice } from "@/lib/quiet";
import { media } from "@/data/media";
import { Eyebrow } from "@/components/ui/Label";
import { MediaPlate } from "@/components/media/MediaPlate";
import type { MediaRef } from "@/data/types";

const ArchitectureCanvas = dynamic(() => import("@/components/features/ArchitectureCanvas"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#0a0b07]" />,
});

const STAGES: { key: string; title: string; copy: string; meta: string; media: MediaRef }[] = [
  {
    key: "exterior",
    title: "Exterior",
    copy: "Two towers, held back from the road.",
    meta: "Stone fins · 1.2 m centres",
    media: {
      scene: "tower-dusk",
      tone: "dusk",
      image: media.vaultDusk,
      caption: "Exterior · looking east",
      alt: "VAULT towers seen from the street at dusk",
    },
  },
  {
    key: "arrival",
    title: "Arrival",
    copy: "One turn, then quiet.",
    meta: "Canopy · drop-off court",
    media: {
      scene: "arrival",
      tone: "night",
      image: media.arrival,
      caption: "Arrival court",
      alt: "Arrival court with a lit colonnade",
    },
  },
  {
    key: "lobby",
    title: "Lobby",
    copy: "A single height, no mezzanine.",
    meta: "4.2 m ceiling · stone floor",
    media: {
      scene: "lobby",
      tone: "interior",
      image: media.lobby,
      caption: "Residents' lobby",
      alt: "Double-height residents lobby in warm light",
    },
  },
  {
    key: "residence",
    title: "Residence",
    copy: "Light held for the length of the day.",
    meta: "North-east living rooms",
    media: {
      scene: "interior-living",
      tone: "interior",
      image: media.livingTwo,
      caption: "Living room · 4 BHK",
      alt: "Living room of a four bedroom residence",
    },
  },
  {
    key: "rooftop",
    title: "Rooftop",
    copy: "The city, thirty-one minutes from the airport.",
    meta: "Private terraces · plunge deck",
    media: {
      scene: "night-skyline",
      tone: "night",
      image: media.rooftop,
      caption: "Terrace · level 11",
      alt: "Night view from a penthouse terrace",
    },
  },
];

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
}

export function ArchitectureSection() {
  const outer = useRef<HTMLDivElement>(null);
  const sky = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [stage, setStage] = useState(0);
  const [inView, setInView] = useState(false);
  const [mode, setMode] = useState<"loading" | "3d" | "plates">("loading");
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isMobile = useMediaQuery("(max-width: 767px)");

  // Choose the renderer. The canvas mounts in the commit *after* this effect,
  // so the filter below is already in place by the time three is constructed.
  useEffect(() => {
    if (reduce || !supportsWebGL()) {
      setMode("plates");
      return undefined;
    }
    const restore = silenceThreeClockNotice();
    setMode("3d");
    return restore;
  }, [reduce]);

  useEffect(() => {
    const element = outer.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => setInView(entries[0]?.isIntersecting ?? false),
      { rootMargin: "10% 0px 10% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useScrollProgress(
    outer,
    (p) => {
      progress.current = p;
      const next = Math.min(STAGES.length - 1, Math.floor(p * STAGES.length + 0.0001));
      setStage((current) => (current === next ? current : next));
      if (sky.current) {
        sky.current.style.setProperty("--sky-p", p.toFixed(4));
      }
    },
    { enabled: mode !== "loading" },
  );

  const showPlates = mode === "plates";

  return (
    <section
      id="experience"
      ref={outer}
      data-tone="dark"
      className="relative h-[420vh] bg-void text-text"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* sky */}
        <div ref={sky} className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 80% at 72% 78%, rgba(255,161,88,0.34) 0%, rgba(70,48,32,0.22) 38%, transparent 72%), linear-gradient(180deg,#0a0d13 0%, #12161d 52%, #1b1a18 100%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-700"
            style={{
              opacity: "var(--sky-p, 0)",
              background:
                "radial-gradient(90% 70% at 30% 82%, rgba(96,132,180,0.22) 0%, transparent 70%), linear-gradient(180deg,#04060a 0%, #070a10 60%, #0b0c0e 100%)",
            }}
          />
        </div>

        {mode === "3d" ? (
          <div className="absolute inset-0">
            <ArchitectureCanvas
              progress={progress}
              quality={isMobile ? "low" : "high"}
              frameloop={inView ? "always" : "never"}
            />
          </div>
        ) : null}

        {showPlates ? (
          <div className="absolute inset-0">
            <AnimatePresence initial={false}>
              <motion.div
                key={STAGES[stage].key}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              >
                <MediaPlate media={STAGES[stage].media} className="h-full w-full" overlay="strong" decorative />
              </motion.div>
            </AnimatePresence>
          </div>
        ) : null}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0a0b07] via-transparent to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0a0b07] to-transparent"
        />

        {/* overlay content */}
        <div className="relative z-10 mx-auto flex h-full w-full max-w-[110rem] flex-col justify-between px-6 pt-28 pb-10 md:px-10 md:pt-40 md:pb-14">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <Eyebrow index="04">Architecture in motion</Eyebrow>
            <p className="u-label max-w-[30ch] text-faint">
              Scroll to move through the building
            </p>
          </div>

          <div className="grid gap-10 xl:grid-cols-12 lg:items-end">
            <div className="xl:col-span-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={STAGES[stage].key}
                  initial={reduce ? undefined : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -18 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col gap-4"
                >
                  <span className="u-label text-accent">
                    {`0${stage + 1}`} / {`0${STAGES.length}`} — {STAGES[stage].title}
                  </span>
                  <h2 className="u-display max-w-[16ch] text-[clamp(1.9rem,4.4vw,3.4rem)] text-text">
                    {STAGES[stage].copy}
                  </h2>
                  <p className="u-label text-faint">{STAGES[stage].meta}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="xl:col-span-6 xl:col-start-7">
              <ol className="flex flex-col">
                {STAGES.map((item, i) => (
                  <li
                    key={item.key}
                    className={cn(
                      "flex items-center gap-4 border-t border-hair py-3 transition-colors duration-500",
                      i === stage ? "text-text" : "text-faint",
                    )}
                  >
                    <span className="u-label w-8">{`0${i + 1}`}</span>
                    <span className="u-label">{item.title}</span>
                    <span
                      aria-hidden
                      className={cn(
                        "ml-auto h-px transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        i === stage ? "w-16 bg-accent" : "w-4 bg-hair",
                      )}
                    />
                  </li>
                ))}
              </ol>
              <p className="u-label mt-6 text-faint">
                {mode === "3d"
                  ? "Real-time architectural model · demo massing"
                  : "Illustrative sequence · static media"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
