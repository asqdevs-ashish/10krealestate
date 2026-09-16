"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { brand } from "@/data/brand";

/**
 * Page transition.
 *
 * Any internal link click raises a curtain over the viewport; the new route
 * mounts behind it and the curtain lifts. Hash links and modified clicks are
 * left alone so in-page navigation stays instant.
 */

type Phase = "idle" | "cover" | "exit";

export function RouteCurtain() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const covering = useRef(false);
  const mounted = useRef(false);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const anchor = (event.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      const target = anchor.getAttribute("target");
      if (target && target !== "_self") return;
      if (!href.startsWith("/") || href.includes("#")) return;
      if (href === pathname) return;
      covering.current = true;
      setPhase("cover");
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname]);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (!covering.current) {
      // Arrived from the browser or a hash-free push — a short cover still
      // keeps the transition consistent.
      setPhase("cover");
    }
    const toExit = window.setTimeout(() => setPhase("exit"), 360);
    const toIdle = window.setTimeout(() => {
      setPhase("idle");
      covering.current = false;
    }, 1200);
    return () => {
      window.clearTimeout(toExit);
      window.clearTimeout(toIdle);
    };
  }, [pathname]);

  const y = phase === "idle" ? "100%" : phase === "cover" ? "0%" : "-100%";

  return (
    <motion.div
      aria-hidden
      data-tone="dark"
      className="pointer-events-none fixed inset-0 z-[90] flex items-end justify-between bg-ink px-6 pb-8 md:px-10"
      initial={false}
      animate={{ y }}
      transition={{
        duration: phase === "exit" ? 0.7 : 0.55,
        ease: [0.76, 0, 0.24, 1],
      }}
      style={{ visibility: phase === "idle" ? "hidden" : "visible" }}
    >
      <span className="u-label text-faint">{brand.name}</span>
      <span className="u-label text-faint">Loading</span>
    </motion.div>
  );
}
