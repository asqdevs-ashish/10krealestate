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
 * Bone paper, ink type, and the photograph set into a single framed plate
 * rather than bled across the viewport — the page opens like a spread, not a
 * billboard. The still is the plate: the photograph sits above the drawn scene,
 * and the optional film (`public/media/vault-hero.mp4`) fades in over the still
 * only once it is actually decoding, so the frame is never empty whatever the
 * network or codec does.
 *
 * This plate is deliberately flat. The one place the page renders rather than
 * photographs is section 04, where the architecture is the subject. */
export function Hero() {
  const project = getFlagship();
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const depth = useRef<HTMLDivElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [delay, setDelay] = useState(0.15);
  const [filmReady, setFilmReady] = useState(false);
  const [filmVisible, setFilmVisible] = useState(false);

  usePointerDepth(depth, 10);

  // The reveal no longer waits for the intro transition. Holding it back meant
  // the hero — and therefore the LCP element — stayed unpainted for as long as
  // the preloader was on screen, which is what the intro cost in the first place.
  // The hero now animates immediately on mount and the (short) intro plays over
  // the top of it, so the paint that decides the LCP is never deferred.

  // The film is 1.5 MB. Rather than racing the LCP image for bandwidth the
  // moment the page loads, it waits for the browser's window `load` — by which
  // point the critical path (LCP image, fonts) is done — and only then starts
  // downloading.
  useEffect(() => {
    if (reduce) return;
    if (document.readyState === "complete") {
      setFilmReady(true);
      return;
    }
    const onLoad = () => setFilmReady(true);
    window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, [reduce]);

  // A second gate: the film is on screen, so it never downloads or decodes for a
  // visitor who is already reading the section below (a deep link, or a jump
  // straight to `#residences`).
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFilmVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const showFilm = filmReady && filmVisible && !reduce;

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
  }, [showFilm]);

  // The plate settles as the page scrolls away — the only continuous motion.
  useEffect(() => {
    if (reduce || !root.current) return;
    const ctx = gsap.context(() => {
      /*
       * The scroll-scrubbed drift stays. The scale-in on the media itself does
       * not, and it is not a style preference — it was actively costing LCP.
       *
       * Scaling the element that contains the hero photograph changes the size
       * the browser thinks the image is drawn at, after it has already chosen a
       * `srcset` candidate. The result was a second, larger download starting
       * once the tween began: first paint used one file and the layout pass
       * fetched another. It re-selected on every scale change while the tween
       * ran, which is why the mismatched pair changed (640/750, then 384/1080)
       * but never disappeared.
       *
       * A 3.2s zoom on the one element that decides the LCP is not a trade worth
       * making. The plate's entrance is carried by the transform keyframe on the
       * column instead (see `hero-plate-in`), which moves the whole plate without
       * changing the size of the image inside it.
       */
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
  }, [reduce]);

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
        {/* Two columns from `lg`, so a laptop at 1024–1279 shows the statement
            and the model side by side rather than stacking the plate below the
            fold — the render is the point of the hero. */}
        <div className="grid gap-12 py-12 lg:grid-cols-12 lg:items-end lg:py-16 xl:gap-16">
          <div className="lg:col-span-5">
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

          {/*
           * This column holds the LCP image, so it is deliberately NOT faded in
           * from `opacity: 0`.
           *
           * An element at zero opacity is not an LCP candidate — the browser
           * waits until it is actually visible before it will count the paint.
           * Fading the photograph in meant the LCP clock did not start until the
           * animation ran (0.3s delay + 1.4s), which is time the image had
           * already spent loaded and sitting invisible.
           *
           * Only the transform is animated now, and the inset settle below gives
           * the same "the plate opens" feel without ever hiding the paint.
           */}
          <div
            className="lg:col-span-7"
            style={{
              animation: reduce ? undefined : "hero-plate-in 1.4s cubic-bezier(0.16,1,0.3,1) both",
            }}
          >
            <div ref={depth} className="relative">
              <div
                ref={plate}
                data-hero-plate
                className="relative aspect-[16/11] w-full overflow-hidden bg-paper-3"
                style={{
                  transform:
                    "translate3d(calc(var(--depth-x, 0) * -1px), calc(var(--depth-y, 0) * -1px), 0)",
                }}
              >
                <div data-hero-media className="absolute inset-0">
                  {/*
                   * `sizes` has to describe the box this photograph is actually
                   * drawn in. The browser picks which `srcset` candidate to
                   *preload* from it before layout runs, so a value that
                   * overstates the width preloads one candidate and then
                   * downloads a larger one at layout — two fetches of the same
                   * photograph, the second of which paints the LCP.
                   *
                   * The plate is not full-bleed. Below `lg` the grid is a single
                   * column inside the page gutter, so the real width is
                   * `viewport - 48px`, not the `100vw` that was declared before.
                   *
                   * These are plain `vw` values rather than `calc(100vw - 3rem)`,
                   * because `calc()` is not valid in a `sizes` attribute — the
                   * parser rejects the whole source size and falls back to `0`,
                   * which silently picks the *smallest* candidate to preload and
                   * guarantees the layout-time re-fetch this is meant to avoid.
                   *
                   * `94vw` is `viewport - 3rem` at 412px (padding is a fixed
                   * 48px, so it is a slightly smaller fraction on wider phones —
                   * under-declaring is safe here, it only costs a few pixels of
                   * resolution, where over-declaring costs a second download).
                   * `90vw` is `viewport - 5rem` at the `md` gutter. The last two
                   * are the 7-of-12 column of the `max-w-[110rem]` grid.
                   */}
                  <MediaPlate
                    media={project.hero}
                    decorative
                    overlay="none"
                    preload
                    sizes="(max-width: 767px) 94vw, (max-width: 1023px) 90vw, (max-width: 1279px) 58vw, 50vw"
                    className="h-full w-full"
                  />
                  {showFilm ? (
                    <video
                      ref={video}
                      className="absolute inset-0 h-full w-full object-cover"
                      src={HERO.video}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="none"
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
          </div>
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
