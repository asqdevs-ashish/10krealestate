import { brand } from "@/data/brand";
import { cn } from "@/lib/format";

/**
 * The mark: the name set in the display serif, a hairline, then the
 * descriptor in tracked caps. Colour comes from the surface tokens, so the
 * same mark works on bone paper and on the dark anchors.
 */
export function Wordmark({
  className,
  size = "md",
}: {
  /** Kept for API compatibility; colour is surface-driven. */
  tone?: "dark" | "light";
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const scale = {
    sm: { mark: "text-[1.15rem]", sub: "text-[0.5rem]" },
    md: { mark: "text-[1.4rem]", sub: "text-[0.5625rem]" },
    lg: { mark: "text-[2.1rem]", sub: "text-[0.6875rem]" },
  }[size];

  return (
    <span className={cn("inline-flex items-baseline gap-2.5 leading-none", className)}>
      <span className={cn("font-display tracking-[-0.02em] text-text", scale.mark)}>
        {brand.wordmark.primary}
      </span>
      <span aria-hidden className="mb-[0.3em] inline-block h-px w-3 bg-hair-strong" />
      <span className={cn("u-label text-text/65", scale.sub)}>{brand.wordmark.secondary}</span>
    </span>
  );
}
