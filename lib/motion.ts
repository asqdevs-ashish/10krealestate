"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { easeLuxe } from "@/lib/easing";

if (typeof window !== "undefined") {
  // Hand scroll restoration to the app, before ScrollTrigger is registered.
  // The order matters: ScrollTrigger records `history.scrollRestoration` once,
  // when it initialises, and writes that recorded value back on every refresh —
  // so a value set after it has started is clobbered back to “auto”, and a
  // reload reopens the page halfway down the narrative instead of on the hero.
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/** House easing — slow, precise, architectural. No bounce, ever. */
export const EASE = "expo.out";
export const EASE_IN_OUT = "power3.inOut";
export const DUR = { fast: 0.5, base: 0.9, slow: 1.4 } as const;

/**
 * Marks a subtree whose scrolling Lenis must not consume — dialogs, sheets and
 * any panel with its own scrollbar. Read by components/providers/LenisProvider.
 */
export const LENIS_PREVENT_ATTRIBUTE = "data-lenis-prevent";

/** Clearance kept under the sticky header when scrolling to a section. */
const SCROLL_HEADER_OFFSET = 72;

/** Duration of a programmatic scroll, in seconds. */
const SCROLL_DURATION = 1.15;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);
  return matches;
}

export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** Locks body scroll while a menu, modal or sheet is open. */
export function useLockBodyScroll(locked: boolean) {
  const lenis = useLenis();

  useEffect(() => {
    if (!locked) return;
    const previous = document.body.style.overflow;
    const padding = document.documentElement.style.scrollbarGutter;
    document.body.style.overflow = "hidden";
    document.documentElement.style.scrollbarGutter = "stable";
    // Hiding body overflow does not hold Lenis back — it scrolls the window
    // itself — so the instance is stopped for as long as the overlay is open.
    lenis?.stop();
    return () => {
      document.body.style.overflow = previous;
      document.documentElement.style.scrollbarGutter = padding;
      lenis?.start();
    };
  }, [locked, lenis]);
}

/** Scroll-linked progress (0 → 1) across an element, via GSAP ScrollTrigger. */
export function useScrollProgress<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  onProgress: (progress: number) => void,
  options: { start?: string; end?: string; enabled?: boolean } = {},
) {
  const { start = "top top", end = "bottom bottom", enabled = true } = options;
  const callback = useRef(onProgress);
  callback.current = onProgress;

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;
    // This is a listener, not an animation — reduced motion is handled by the
    // consumer, which either animates subtly or swaps to static media.
    const trigger = ScrollTrigger.create({
      trigger: element,
      start,
      end,
      onUpdate: (self) => callback.current(self.progress),
      onRefresh: (self) => callback.current(self.progress),
    });
    return () => trigger.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, start, end, enabled]);
}

/** Pointer-driven depth offset, damped with a rAF loop. */
export function usePointerDepth<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  strength = 1,
) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (prefersReducedMotion()) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;

    // Measured once and re-measured on resize. Calling `getBoundingClientRect()`
    // inside `pointermove` reads layout on every event — a forced synchronous
    // reflow at up to 120 Hz, which is one of the "forced reflow" diagnostics
    // PageSpeed reports. The element does not move between resizes, so the
    // measurement is cached instead.
    let rect = element.getBoundingClientRect();
    const measure = () => {
      rect = element.getBoundingClientRect();
    };
    window.addEventListener("resize", measure, { passive: true });

    // The loop exists only to settle the offset behind the pointer, so it stops
    // as soon as it has settled and starts again on the next movement. Leaving
    // it running would keep a frame callback alive for the life of the page,
    // competing with the scroll and the 3D canvases for the same frame — and the
    // hero is idle most of the time a visitor is reading it.
    const REST = 0.0004;
    const move = () => {
      if (frame) return;
      frame = requestAnimationFrame(loop);
    };
    const loop = () => {
      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;
      element.style.setProperty("--depth-x", (current.x * strength).toFixed(4));
      element.style.setProperty("--depth-y", (current.y * strength).toFixed(4));
      const settled =
        Math.abs(target.x - current.x) < REST && Math.abs(target.y - current.y) < REST;
      frame = settled ? 0 : requestAnimationFrame(loop);
    };

    const onMove = (event: PointerEvent) => {
      target.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      target.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      move();
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
      move();
    };

    // `passive` so the listener can never be asked to block the scroll.
    element.addEventListener("pointermove", onMove, { passive: true });
    element.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("resize", measure);
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref, strength]);
}

/** Eased number animation for metrics, prices and calculators. */
export function useCountUp(value: number, duration = 0.9) {
  const [display, setDisplay] = useState(value);
  const from = useRef(value);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      from.current = value;
      setDisplay(value);
      return;
    }
    const startValue = from.current;
    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 4);
      setDisplay(startValue + (value - startValue) * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
      else from.current = value;
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      from.current = value;
    };
  }, [value, duration, reduced]);

  return display;
}

/** Tallies a value once it scrolls into view. */
export function useCountUpInView(value: number, duration = 1.2) {
  const ref = useRef<HTMLSpanElement>(null);
  const [armed, setArmed] = useState(false);
  const display = useCountUp(armed ? value : 0, duration);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setArmed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-10% 0px -10% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, display };
}

/** Smooth in-page scrolling with the sticky header offset applied. */
export function useScrollToId() {
  const lenis = useLenis();

  return useCallback(
    (id: string, behavior: ScrollBehavior = "smooth") => {
      const element = document.getElementById(id);
      if (!element) return false;

      const top =
        element.getBoundingClientRect().top +
        window.scrollY -
        SCROLL_HEADER_OFFSET;

      // Lenis owns the scroll curve whenever it is mounted, so an anchor jump
      // decelerates on the same curve as every other scroll on the site.
      // Reduced motion is respected inside Lenis (scrolls become instant).
      if (lenis && behavior === "smooth") {
        lenis.scrollTo(top, { duration: SCROLL_DURATION, easing: easeLuxe });
        return true;
      }

      window.scrollTo({
        top,
        behavior: prefersReducedMotion() ? "auto" : behavior,
      });
      return true;
    },
    [lenis],
  );
}

/** Magnetic hover for primary actions. */
export function useMagnetic<T extends HTMLElement>(strength = 6) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (prefersReducedMotion()) return;

    // Same reasoning as usePointerDepth: the rect is cached rather than read on
    // every pointer event, and re-measured only on resize.
    let rect = element.getBoundingClientRect();
    const measure = () => {
      rect = element.getBoundingClientRect();
    };
    window.addEventListener("resize", measure, { passive: true });

    const onMove = (event: PointerEvent) => {
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      gsap.to(element, {
        x: x * strength,
        y: y * strength * 0.6,
        duration: 0.6,
        ease: "power3.out",
      });
    };
    const onLeave = () => {
      gsap.to(element, { x: 0, y: 0, duration: 0.7, ease: "expo.out" });
    };
    element.addEventListener("pointermove", onMove, { passive: true });
    element.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("resize", measure);
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerleave", onLeave);
    };
  }, [strength]);
  return ref;
}
