"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { getFlagship } from "@/data";
import { HERO } from "@/data/media";
import { conversion } from "@/data/brand";
import { formatINR } from "@/lib/format";
import { gsap, usePointerDepth } from "@/lib/motion";
import { MediaPlate } from "@/components/media/MediaPlate";
import { DisplayLines, EASE_LUXE } from "@/components/motion/Reveal";
import { Action } from "@/components/ui/Action";

/**
 * Editorial hero.
 *
 * Bone paper, ink type, and the film set into a single framed plate rather than
 * bled across the viewport — the page opens like a spread, not a billboard.
 * The film sits above the poster still, which sits above the drawn plate, so
 * the frame is never empty if the file is missing or the codec is unsupported.
 */
export function Hero() {
  const project = getFlagship();
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const depth = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [delay, setDelay] = useState(0.15);
  const [filmReady, setFilmReady] = useState(false);

  usePointerDepth(depth, 10);

  // Hold the hero reveal until the first-visit transition has cleared.
  useEffect(() => {
    let seen = true;
    try {
      seen = Boolean(window.sessionStorage.getItem("asd-intro"));
    } catch {
      seen = true;
    }
    if (!seen && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDelay(1.2);
    }
  }, []);

  useEffect(() => {
    if (reduce) return;
    setFilmReady(true);
  }, [reduce]);

  // Only decode the film while it is on screen, and never in a hidden tab.
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !document.hidden) void element.play().catch(() => {});
        else element.pause();
      },
      { threshold: 0.05 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [filmReady]);

  // The plate settles as the page scrolls away — the only continuous motion.
  useEffect(() => {
    if (reduce || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-hero-media]",
        { scale: 1.1 },
        { scale: 1, duration: 3.2, ease: "expo.out", delay },
      );
      gsap.to("[data-hero-plate]", {
        yPercent: 6,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, root);
    return () => ctx.revert();
  }, [reduce, delay]);

  const facts = [
    { label: "Residences", value: `${project.totalResidences} private residences` },
    { label: "Configuration", value: project.configurations.join(" · ") },
    { label: "From", value: formatINR(project.priceFrom) },
    { label: "Possession", value: project.possession },
  ];

  return (
    <div ref={root} id="hero" data-tone="light" className="relative w-full bg-paper">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[110rem] flex-col justify-between px-6 pt-32 pb-10 md:px-10 md:pt-40 md:pb-14">
        {/* masthead */}
        <motion.div
          className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between"
          initial={reduce ? undefined : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay, ease: EASE_LUXE }}
        >
          <div className="flex items-center gap-3">
            <span aria-hidden className="h-px w-7 bg-accent" />
            <span className="u-label text-dim">
              {project.city} / {project.locality}
            </span>
          </div>
          <p className="u-label text-faint">
            {project.name} — {project.subtitle} · {project.statusLabel.toLowerCase()} ·{" "}
            {project.land} site
          </p>
        </motion.div>

        {/* statement + plate */}
        <div className="grid gap-12 py-12 xl:grid-cols-12 xl:items-end xl:gap-16 lg:py-16">
          <div className="xl:col-span-5">
            <DisplayLines
              as="h1"
              animateOnMount
              delay={delay + 0.12}
              stagger={0.1}
              lines={["A quieter", "kind of luxury."]}
              className="u-display text-[clamp(2.5rem,5.6vw,5.25rem)] text-text"
            />

            <motion.p
              className="mt-7 max-w-[38ch] text-base leading-relaxed text-dim md:text-lg"
              initial={reduce ? undefined : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: delay + 0.5, ease: EASE_LUXE }}
            >
              Private residences shaped around light, space and the way you live.
            </motion.p>

            <motion.div
              className="mt-9 flex flex-wrap items-center gap-4"
              initial={reduce ? undefined : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: delay + 0.62, ease: EASE_LUXE }}
            >
              <Action href="/#residences" variant="primary" size="lg" arrow magnetic>
                {conversion.secondaryCta}
              </Action>
              <Action href="/book-a-viewing" variant="text" arrow>
                {conversion.primaryCta}
              </Action>
            </motion.div>
          </div>

          <motion.div
            className="xl:col-span-7"
            initial={reduce ? undefined : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: delay + 0.3, ease: EASE_LUXE }}
          >
            <div ref={depth} className="relative">
              <div
                data-hero-plate
                className="relative aspect-[16/11] w-full overflow-hidden bg-paper-3"
                style={{
                  transform:
                    "translate3d(calc(var(--depth-x, 0) * -1px), calc(var(--depth-y, 0) * -1px), 0)",
                }}
              >
                <div data-hero-media className="absolute inset-0">
                  <MediaPlate
                    media={project.hero}
                    decorative
                    overlay="none"
                    priority
                    className="h-full w-full"
                  />
                  {filmReady ? (
                    <video
                      ref={video}
                      className="absolute inset-0 h-full w-full object-cover"
                      src={HERO.video}
                      poster={HERO.poster}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      disablePictureInPicture
                      tabIndex={-1}
                      aria-hidden
                      onError={() => setFilmReady(false)}
                    />
                  ) : null}
                </div>

                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent"
                />

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-5 md:p-7">
                  <span className="u-label text-paper/85">{HERO.caption}</span>
                  <span className="u-label hidden text-paper/60 sm:block">
                    {project.totalResidences} residences · {project.openSpace}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* facts + scroll cue */}
        <motion.div
          className="flex items-end justify-between gap-8"
          initial={reduce ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.3, delay: delay + 0.8, ease: EASE_LUXE }}
        >
          <dl className="grid w-full grid-cols-2 gap-x-8 gap-y-6 border-t border-hair pt-6 lg:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.label} className="flex flex-col gap-2">
                <dt className="u-label text-faint">{fact.label}</dt>
                <dd className="u-num text-[0.8125rem] text-text">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <a
            href="#statement"
            className="group hidden shrink-0 items-center gap-3 pb-1 lg:flex"
            aria-label="Scroll to the project statement"
          >
            <span className="u-label text-faint transition-colors duration-500 group-hover:text-text">
              Scroll
            </span>
            <span className="relative block h-10 w-px bg-hair">
              <span className="u-scroll-hint absolute inset-0 block bg-accent" />
            </span>
          </a>
        </motion.div>
      </div>
    </div>
  );
}
