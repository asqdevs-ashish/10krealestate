"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { brand } from "@/data/brand";
import { prefersReducedMotion, useLockBodyScroll } from "@/lib/motion";

/**
 * First-visit loading transition. Runs once per session, never on route
 * changes, and is skipped entirely when reduced motion is requested.
 */
export function Preloader() {
  const [stage, setStage] = useState<"in" | "out" | "gone">("gone");

  // The intro owns the viewport while it plays. Going through the shared lock
  // stops Lenis as well, not just the body's overflow.
  useLockBodyScroll(stage !== "gone");

  useEffect(() => {
    let seen = false;
    try {
      seen = Boolean(window.sessionStorage.getItem("asd-intro"));
    } catch {
      seen = false;
    }
    if (seen || prefersReducedMotion()) return;

    setStage("in");
    const out = window.setTimeout(() => setStage("out"), 1050);
    const done = window.setTimeout(() => {
      setStage("gone");
      try {
        window.sessionStorage.setItem("asd-intro", "1");
      } catch {
        /* ignore */
      }
    }, 1950);
    return () => {
      window.clearTimeout(out);
      window.clearTimeout(done);
    };
  }, []);

  if (stage === "gone") return null;

  return (
    <motion.div
      aria-hidden
      data-tone="dark"
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink px-6 py-8 md:px-10"
      initial={{ y: 0 }}
      animate={{ y: stage === "out" ? "-100%" : 0 }}
      transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="flex items-start justify-between">
        <span className="font-display text-xl text-text">
          {brand.wordmark.primary}
        </span>
        <span className="u-label text-faint">Est. {brand.established}</span>
      </div>

      <div className="flex flex-col gap-6">
        <p className="u-label text-text/50">{brand.name} · Gurugram</p>
        <div className="h-px w-full overflow-hidden bg-hair">
          <motion.span
            className="block h-px origin-left bg-accent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>
    </motion.div>
  );
}
