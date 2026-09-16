import type { ReactNode } from "react";
import { cn } from "@/lib/format";

/**
 * Section shell.
 *
 * Sections deliberately vary in composition; this only carries the shared
 * rhythm (measure, padding, surface tone) so the page reads as one document
 * rather than a stack of cards.
 *
 * `data-tone` is the important part: it re-points the semantic tokens
 * (type, hairlines, accent, buttons) for everything inside, so a component
 * never has to know which surface it landed on.
 */
export function Section({
  id,
  tone = "light",
  children,
  className,
  inset = true,
  grid = false,
}: {
  id?: string;
  /**
   * `light` = bone, `sand` = warmer band, `dark` / `black` = cinematic anchor,
   * `night` = obsidian with brushed-gold accents.
   */
  tone?: "light" | "sand" | "dark" | "black" | "night";
  children: ReactNode;
  className?: string;
  inset?: boolean;
  grid?: boolean;
}) {
  const isDark = tone === "dark" || tone === "black" || tone === "night";

  return (
    <section
      id={id}
      data-tone={tone}
      className={cn(
        "relative w-full overflow-hidden",
        tone === "light" && "bg-paper text-text",
        tone === "sand" && "bg-paper-2 text-text",
        tone === "dark" && "bg-ink text-text",
        tone === "black" && "bg-void text-text",
        tone === "night" && "bg-obsidian text-text",
        className,
      )}
    >
      {grid ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-100 u-grid-lines"
        />
      ) : null}
      <div
        className={cn(
          "relative mx-auto w-full max-w-[110rem]",
          inset && "px-6 py-24 md:px-10 md:py-32 lg:py-40",
        )}
      >
        {children}
      </div>
      {/* A hairline between surfaces keeps the stacked bands from blurring. */}
      {isDark ? null : (
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 block h-px bg-hair"
        />
      )}
    </section>
  );
}
