"use client";

import type { ReactNode } from "react";
import type { LenisOptions } from "lenis";
import { ReactLenis } from "lenis/react";
import { LENIS_PREVENT_ATTRIBUTE } from "@/lib/motion";
import { ScrollSync } from "./ScrollSync";

/**
 * Smooth scrolling for the whole document.
 *
 * `root` mode means Lenis drives the real window scroll position rather than
 * translating a wrapper element. That keeps native scrollbars, `position:
 * sticky`, `window.scrollY` reads, GSAP ScrollTrigger and Next's own scroll
 * restoration all working — only the input-to-scroll curve changes.
 *
 * Reduced motion is handled by Lenis itself (`respectReducedMotion`): the
 * smoothing is bypassed and scrolls become instant, so the instance can stay
 * mounted and the frame loop stays identical in both modes.
 */

/** Panels that scroll internally opt out, so the wheel event is not consumed. */
function preventSmoothScroll(node: HTMLElement): boolean {
  return node.closest(`[${LENIS_PREVENT_ATTRIBUTE}]`) !== null;
}

const LENIS_OPTIONS: LenisOptions = {
  // Driven by the GSAP ticker in ScrollSync — one clock for scroll and
  // animation, so ScrollTrigger never reads a stale position.
  autoRaf: false,

  // The house feel: a long, damped glide with no overshoot. Lower is slower.
  lerp: 0.085,
  wheelMultiplier: 0.9,
  touchMultiplier: 1.25,
  gestureOrientation: "vertical",

  // The wheel is interpolated; touch keeps the platform's own momentum, which
  // is what makes a phone feel native instead of rubbery.
  smoothWheel: true,
  syncTouch: false,

  autoResize: true,
  respectReducedMotion: true,
  stopInertiaOnNavigate: true,
  prevent: preventSmoothScroll,

  // Anchors are handled in-app (lib/motion.ts `useScrollToId`) so the header
  // offset and the house easing are applied consistently. Enabling Lenis's own
  // anchor handling would double up on that.
};

export function LenisProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={LENIS_OPTIONS}>
      <ScrollSync />
      {children}
    </ReactLenis>
  );
}
