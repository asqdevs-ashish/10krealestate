"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { gsap, ScrollTrigger } from "@/lib/motion";

/**
 * Keeps Lenis, GSAP ScrollTrigger and the App Router in agreement.
 * Renders nothing.
 *
 * Two rules make this work:
 *
 * 1. One clock. Lenis is created with `autoRaf: false`, so GSAP's ticker is
 *    what advances it. ScrollTrigger then reads a scroll position produced in
 *    the same frame as the animation that depends on it, which is what stops
 *    pinned and scrub-linked sections from trailing the cursor.
 * 2. A new route is a new document height. The measurement is redone once the
 *    new tree has painted, so triggers are never evaluated against the
 *    previous page's dimensions.
 */
export function ScrollSync() {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    if (!lenis) return;

    const syncScrollTrigger = () => {
      ScrollTrigger.update();
    };

    lenis.on("scroll", syncScrollTrigger);

    // GSAP's ticker reports seconds; Lenis measures in milliseconds.
    const advanceLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(advanceLenis);
    // Scroll position is authoritative here — lag smoothing would interpolate
    // it and drift away from the real value during long frames.
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();

    return () => {
      lenis.off("scroll", syncScrollTrigger);
      gsap.ticker.remove(advanceLenis);
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, [lenis]);

  useEffect(() => {
    if (!lenis) return;

    const frame = requestAnimationFrame(() => {
      lenis.resize();
      ScrollTrigger.refresh();
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname, lenis]);

  return null;
}
