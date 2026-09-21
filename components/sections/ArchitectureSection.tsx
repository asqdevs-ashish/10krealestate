"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/format";
import { useMediaQuery, useScrollProgress } from "@/lib/motion";
import { supportsWebGL, useAssetState } from "@/lib/model";
import { silenceThreeClockNotice } from "@/lib/quiet";
import { MODELS, media } from "@/data/media";
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

export function ArchitectureSection() {
  const outer = useRef<HTMLDivElement>(null);
  const sky = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [stage, setStage] = useState(0);
  const [inView, setInView] = useState(false);
  const [mode, setMode] = useState<"loading" | "3d" | "plates">("loading");
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isWide = useMediaQuery("(min-width: 1024px)");

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

  // The supplied model is optional and is checked before the canvas asks for
  // it, so the sequence cannot fail on a file that is not there yet.
  const model = useAssetState(MODELS.architecture, mode === "3d");

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
          // The copy owns the left of the frame, so once there is room for two
          // columns the render is nudged right rather than centred — the two
          // then sit beside each other instead of on top of one another.
          <div className="absolute inset-0 lg:left-[10%] lg:-right-[4%] xl:left-[13%] xl:-right-[5%]">
            <ArchitectureCanvas
              progress={progress}
              quality={isMobile ? "low" : "high"}
              frameloop={inView ? "always" : "never"}
              model={model === "available" ? MODELS.architecture : null}
              // Below the two-column layout the frame is tall and the copy sits
              // under the building, so the camera pulls back to keep the whole
              // massing in view — furthest on a phone.
              zoom={isMobile ? 1.3 : isWide ? 1 : 1.18}
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
                <MediaPlate
                  media={STAGES[stage].media}
                  sizes="100vw"
                  className="h-full w-full"
                  overlay="strong"
                  decorative
                />
              </motion.div>
            </AnimatePresence>
          </div>
        ) : null}

        {/* Scrims. The model is lit for dusk and the copy is bone, so wherever
            type sits the frame is darkened — steeply under the headline, more
            gently under the stage list — and left almost alone in between, so
            the building still reads. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(10,11,7,0.94) 0%, rgba(10,11,7,0.8) 26%, rgba(10,11,7,0.34) 52%, rgba(10,11,7,0) 78%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-52 md:h-64"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,11,7,0.88) 0%, rgba(10,11,7,0.42) 56%, rgba(10,11,7,0) 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] md:h-[52%]"
          style={{
            background:
              "linear-gradient(0deg, rgba(10,11,7,0.96) 0%, rgba(10,11,7,0.8) 42%, rgba(10,11,7,0) 100%)",
          }}
        />

        {/* overlay content */}
        <div className="relative z-10 mx-auto flex h-full w-full max-w-[110rem] flex-col justify-between px-6 pt-24 pb-24 md:px-10 md:pt-40 md:pb-14">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <Eyebrow index="04">Architecture in motion</Eyebrow>
            <p className="u-label max-w-[30ch] text-text/70">
              Scroll to move through the building
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-5">
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
                  <p className="u-label text-text/70">{STAGES[stage].meta}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Padding at `lg` keeps the stage list clear of the advisor dock,
                which is fixed to the bottom-right from that width up. */}
            <div className="lg:col-span-6 lg:col-start-7 lg:pr-40 xl:pr-0">
              <ol className="flex flex-col">
                {STAGES.map((item, i) => (
                  <li
                    key={item.key}
                    className={cn(
                      "flex items-center gap-4 border-t border-hair py-3 transition-colors duration-500",
                      i === stage ? "text-text" : "text-text/55",
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
              <p className="u-label mt-6 text-text/60">
                {mode !== "3d"
                  ? "Illustrative sequence · static media"
                  : model === "available"
                    ? "Real-time architectural model · supplied 3D"
                    : "Real-time architectural model · demo massing"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
