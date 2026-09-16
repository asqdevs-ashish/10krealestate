"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { cn } from "@/lib/format";
import { useCountUpInView } from "@/lib/motion";

/** House motion — slow, precise, never bouncy. */
export const EASE_LUXE = [0.16, 1, 0.3, 1] as const;

const viewport = { once: true, margin: "-12% 0px -10% 0px" } as const;

/* ------------------------------------------------------------------- reveal */

export function Reveal({
  children,
  className,
  delay = 0,
  y = 22,
  duration = 1.1,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration, delay, ease: EASE_LUXE }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------- masked line reveal */

type HeadingTag = "h1" | "h2" | "h3" | "p" | "div";

function Heading({
  as,
  className,
  children,
}: {
  as: HeadingTag;
  className?: string;
  children: ReactNode;
}) {
  switch (as) {
    case "h1":
      return <h1 className={className}>{children}</h1>;
    case "h3":
      return <h3 className={className}>{children}</h3>;
    case "p":
      return <p className={className}>{children}</p>;
    case "div":
      return <div className={className}>{children}</div>;
    default:
      return <h2 className={className}>{children}</h2>;
  }
}

export function DisplayLines({
  lines,
  className,
  lineClassName,
  as = "h2",
  delay = 0,
  stagger = 0.09,
  duration = 1.3,
  animateOnMount = false,
}: {
  lines: (string | ReactNode)[];
  className?: string;
  lineClassName?: string;
  as?: HeadingTag;
  delay?: number;
  stagger?: number;
  duration?: number;
  /** Use for above-the-fold statements that should play on load. */
  animateOnMount?: boolean;
}) {
  const reduce = useReducedMotion();
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const line: Variants = {
    hidden: { y: "110%" },
    show: { y: "0%", transition: { duration, ease: EASE_LUXE } },
  };

  if (reduce) {
    return (
      <Heading as={as} className={className}>
        {lines.map((l, i) => (
          <span key={i} className={cn("u-mask", lineClassName)}>
            <span>{l}</span>
          </span>
        ))}
      </Heading>
    );
  }

  return (
    <Heading as={as} className={className}>
      <motion.span
        className="block"
        variants={container}
        initial="hidden"
        {...(animateOnMount
          ? { animate: "show" }
          : { whileInView: "show", viewport })}
      >
        {lines.map((l, i) => (
          <span key={i} className={cn("u-mask", lineClassName)}>
            <motion.span className="block" variants={line}>
              {l}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Heading>
  );
}

/* -------------------------------------------------------------- media reveal */

export function ClipReveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left";
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  const from = direction === "up" ? "inset(14% 0% 0% 0%)" : "inset(0% 14% 0% 0%)";

  return (
    <motion.div
      className={cn("overflow-hidden", className)}
      initial={{ clipPath: from, opacity: 0.4 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
      viewport={{ once: true, margin: "-8% 0px -8% 0px" }}
      transition={{ duration: 1.5, delay, ease: EASE_LUXE }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ parallax */

export function Parallax({
  children,
  className,
  amount = 48,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------- rule */

export function DrawnRule({
  className,
  delay = 0,
  dark = false,
}: {
  className?: string;
  delay?: number;
  dark?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      aria-hidden
      className={cn("block h-px w-full origin-left", dark ? "bg-hair" : "bg-hair", className)}
      initial={reduce ? undefined : { scaleX: 0 }}
      whileInView={reduce ? undefined : { scaleX: 1 }}
      viewport={viewport}
      transition={{ duration: 1.4, delay, ease: EASE_LUXE }}
    />
  );
}

/* ------------------------------------------------------------------ counter */

export function Counter({
  value,
  format,
  className,
}: {
  value: number;
  format: (value: number) => string;
  className?: string;
}) {
  const { ref, display } = useCountUpInView(value);
  return (
    <span ref={ref} className={className}>
      {format(display)}
    </span>
  );
}
