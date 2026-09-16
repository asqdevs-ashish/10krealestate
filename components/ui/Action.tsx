"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/format";
import { useMagnetic, useScrollToId } from "@/lib/motion";

export type ActionVariant = "primary" | "ghost" | "quartz" | "text";
export type ActionTone = "dark" | "light";

const BASE =
  "group relative inline-flex select-none items-center justify-center gap-3 whitespace-nowrap u-label transition-[background-color,border-color,color,opacity] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] disabled:cursor-not-allowed disabled:opacity-40";

/**
 * Variants are surface-driven: the colours come from `--btn-*` tokens that the
 * surrounding `[data-tone]` re-points, so a button is legible wherever it is
 * dropped — light band, dark anchor, or on top of an image.
 */
const VARIANT: Record<ActionVariant, string> = {
  primary:
    "bg-[var(--btn-solid-bg)] text-[var(--btn-solid-fg)] hover:bg-accent hover:text-paper",
  ghost:
    "border border-[var(--btn-ghost-border)] text-text/85 hover:border-accent/70 hover:text-text",
  quartz:
    "border border-accent/50 text-accent-2 hover:border-accent hover:bg-accent/10",
  text: "px-0 text-text/80 border-b border-hair-strong pb-1 hover:border-accent/70 hover:text-accent-2",
};

const SIZE = {
  sm: "h-10 px-5",
  md: "h-12 px-6",
  lg: "h-14 px-8",
} as const;

function Arrow({ tone }: { tone: ActionTone }) {
  return (
    <span
      aria-hidden
      className="relative inline-block h-2.5 w-4 overflow-hidden transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
    >
      <svg viewBox="0 0 16 10" fill="none" className="h-full w-full">
        <path
          d="M0 5h14M10 1l4 4-4 4"
          stroke="currentColor"
          strokeWidth={tone === "dark" ? 1.1 : 1.2}
        />
      </svg>
    </span>
  );
}

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  variant?: ActionVariant;
  /** Only affects the arrow's stroke weight; colour comes from the surface. */
  tone?: ActionTone;
  size?: keyof typeof SIZE;
  arrow?: boolean;
  className?: string;
  magnetic?: boolean;
  external?: boolean;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  disabled?: boolean;
  ariaLabel?: string;
};

export function Action({
  children,
  href,
  onClick,
  variant = "primary",
  tone = "light",
  size = "md",
  arrow = false,
  className,
  magnetic = false,
  external = false,
  type = "button",
  disabled = false,
  ariaLabel,
}: Props) {
  const pathname = usePathname();
  const scrollToId = useScrollToId();
  const magnetRef = useMagnetic<HTMLElement>(magnetic ? 5 : 0);

  const classes = cn(
    BASE,
    VARIANT[variant],
    variant === "text" ? "h-auto" : SIZE[size],
    className,
  );

  const inner = (
    <>
      <span>{children}</span>
      {arrow ? <Arrow tone={tone} /> : null}
    </>
  );

  // One callback ref works for every root element this component can render.
  const setMagnet = useCallback(
    (element: HTMLAnchorElement | HTMLButtonElement | null) => {
      magnetRef.current = element;
    },
    [magnetRef],
  );
  const rootRef = magnetic && !disabled ? setMagnet : undefined;

  // In-page anchors on the current route scroll instead of navigating.
  if (href && href.includes("#")) {
    const [target, hash] = href.split("#");
    const sameRoute = target === "" || target === pathname;
    if (sameRoute) {
      return (
        <a
          ref={rootRef}
          href={href}
          className={classes}
          aria-label={ariaLabel}
          onClick={(event) => {
            event.preventDefault();
            scrollToId(hash);
            onClick?.(event);
            window.history.replaceState(null, "", hash ? `#${hash}` : "");
          }}
        >
          {inner}
        </a>
      );
    }
  }

  if (href && (external || /^https?:/.test(href))) {
    return (
      <a
        ref={rootRef}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={classes}
        aria-label={ariaLabel}
        onClick={onClick}
      >
        {inner}
      </a>
    );
  }

  if (href) {
    return (
      <Link
        ref={rootRef}
        href={href}
        className={classes}
        aria-label={ariaLabel}
        onClick={onClick}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      ref={rootRef}
      type={type}
      className={classes}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
    >
      {inner}
    </button>
  );
}
