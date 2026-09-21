import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import type { MediaRef, MediaTone } from "@/data/types";
import { cn } from "@/lib/format";
import { SceneLayer } from "./scenes";

/**
 * Media frame.
 *
 * Renders one art-directed scene plate inside a tonal gradient, and the
 * photograph over it through the image optimizer — resized, served as AVIF or
 * WebP, and downloaded at the size the plate is actually drawn at. `sizes` is
 * what decides that last part, so it is worth passing on anything that is not a
 * half-width grid cell; the default assumes roughly that, and the full-bleed
 * plates say `100vw` explicitly.
 *
 * The drawn scene sits underneath as the loading state, so the frame is never
 * an empty box while the photograph arrives.
 */

type Tone = {
  base: string;
  glow: string;
  vars: CSSProperties;
};

const tone = (vars: Record<string, string>): CSSProperties => vars as CSSProperties;

const TONES: Record<MediaTone, Tone> = {
  dusk: {
    base: "linear-gradient(178deg,#0c0e12 0%, #16140f 32%, #2b2318 54%, #563a1e 75%, #0b0a09 100%)",
    glow: "radial-gradient(60% 44% at 63% 71%, rgba(255,177,96,0.36), transparent 72%)",
    vars: tone({
      "--s-line": "rgba(236,232,224,0.36)",
      "--s-line-soft": "rgba(236,232,224,0.15)",
      "--s-fill": "rgba(9,9,8,0.6)",
      "--s-fill-2": "rgba(17,16,15,0.74)",
      "--s-light": "rgba(255,197,131,0.5)",
      "--s-light-soft": "rgba(255,197,131,0.2)",
    }),
  },
  night: {
    base: "linear-gradient(180deg,#05060a 0%, #090c12 46%, #0d1118 72%, #050506 100%)",
    glow: "radial-gradient(50% 38% at 30% 34%, rgba(120,158,196,0.24), transparent 74%)",
    vars: tone({
      "--s-line": "rgba(226,232,240,0.3)",
      "--s-line-soft": "rgba(226,232,240,0.12)",
      "--s-fill": "rgba(4,6,9,0.7)",
      "--s-fill-2": "rgba(11,15,21,0.8)",
      "--s-light": "rgba(255,206,148,0.62)",
      "--s-light-soft": "rgba(255,206,148,0.2)",
    }),
  },
  interior: {
    base: "linear-gradient(170deg,#100d0a 0%, #1e1813 38%, #33271c 62%, #120f0c 100%)",
    glow: "radial-gradient(52% 46% at 72% 40%, rgba(255,193,124,0.3), transparent 72%)",
    vars: tone({
      "--s-line": "rgba(238,228,212,0.3)",
      "--s-line-soft": "rgba(238,228,212,0.13)",
      "--s-fill": "rgba(12,10,8,0.55)",
      "--s-fill-2": "rgba(22,18,14,0.7)",
      "--s-light": "rgba(255,205,146,0.5)",
      "--s-light-soft": "rgba(255,205,146,0.22)",
    }),
  },
  stone: {
    base: "linear-gradient(160deg,#171613 0%, #26231e 42%, #34302a 66%, #131211 100%)",
    glow: "radial-gradient(46% 40% at 26% 24%, rgba(255,240,214,0.16), transparent 74%)",
    vars: tone({
      "--s-line": "rgba(242,236,226,0.3)",
      "--s-line-soft": "rgba(242,236,226,0.14)",
      "--s-fill": "rgba(14,13,12,0.5)",
      "--s-fill-2": "rgba(30,28,25,0.66)",
      "--s-light": "rgba(255,240,214,0.34)",
      "--s-light-soft": "rgba(255,240,214,0.14)",
    }),
  },
  green: {
    base: "linear-gradient(175deg,#0a0d0a 0%, #12170f 40%, #1b2116 66%, #090a08 100%)",
    glow: "radial-gradient(54% 42% at 40% 38%, rgba(198,214,150,0.16), transparent 74%)",
    vars: tone({
      "--s-line": "rgba(230,236,220,0.28)",
      "--s-line-soft": "rgba(230,236,220,0.12)",
      "--s-fill": "rgba(8,11,8,0.62)",
      "--s-fill-2": "rgba(18,22,16,0.74)",
      "--s-light": "rgba(228,214,166,0.34)",
      "--s-light-soft": "rgba(228,214,166,0.14)",
    }),
  },
  paper: {
    base: "linear-gradient(180deg,#f1ece3 0%, #e8e2d6 55%, #ddd5c6 100%)",
    glow: "radial-gradient(60% 46% at 34% 22%, rgba(255,255,255,0.72), transparent 74%)",
    vars: tone({
      "--s-line": "rgba(28,27,24,0.34)",
      "--s-line-soft": "rgba(28,27,24,0.14)",
      "--s-fill": "rgba(28,27,24,0.1)",
      "--s-fill-2": "rgba(28,27,24,0.2)",
      "--s-light": "rgba(255,255,255,0.62)",
      "--s-light-soft": "rgba(28,27,24,0.06)",
    }),
  },
};

const OVERLAY: Record<string, string> = {
  none: "",
  soft: "bg-gradient-to-t from-ink/72 via-ink/10 to-transparent",
  strong: "bg-gradient-to-t from-ink/85 via-ink/35 to-ink/25",
  flat: "bg-ink/40",
};

type Props = {
  media: MediaRef;
  className?: string;
  /** Extra space for an overlaid composition. */
  children?: ReactNode;
  overlay?: keyof typeof OVERLAY;
  caption?: boolean;
  index?: boolean;
  /** Decorative plates are hidden from assistive tech; content plates are described. */
  decorative?: boolean;
  /** Above-the-fold plates preload, so the LCP image is never discovered late. */
  preload?: boolean;
  /**
   * Rendered width per breakpoint — what the generated `srcset` is chosen from.
   *
   * This must describe the space the plate actually occupies, because Next emits
   * it verbatim into the preload link and the browser picks its preload candidate
   * from it *before* layout. A value that overstates the width preloads one
   * candidate and then downloads a larger one at layout — two fetches of the same
   * photograph, the second of which is the one that paints the LCP.
   */
  sizes?: string;
  /** 82 for the editorial plates, 68–75 for inset and thumbnail frames. */
  quality?: number;
};

export function MediaPlate({
  media,
  className,
  children,
  overlay = "soft",
  caption = false,
  index = false,
  decorative = false,
  preload = false,
  sizes = "(max-width: 767px) 100vw, 55vw",
  quality = 82,
}: Props) {
  const preset = TONES[media.tone];

  return (
    <div
      className={cn("u-grain relative overflow-hidden bg-ink-3", className)}
      style={{ ...preset.vars }}
    >
      <div aria-hidden className="absolute inset-0" style={{ background: preset.base }} />
      <div aria-hidden className="absolute inset-0" style={{ background: preset.glow }} />

      <svg
        aria-hidden
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <SceneLayer scene={media.scene} />
      </svg>

      {media.image ? (
        <Image
          src={media.image}
          alt={decorative ? "" : media.alt}
          fill
          sizes={sizes}
          quality={quality}
          preload={preload}
          className="object-cover"
        />
      ) : null}


      {decorative ? null : <span className="sr-only">{media.alt}</span>}

      <div aria-hidden className={cn("pointer-events-none absolute inset-0", OVERLAY[overlay])} />

      {index && media.index ? (
        <span className="u-label pointer-events-none absolute top-4 right-4 text-faint">
          {media.index}
        </span>
      ) : null}

      {caption && media.caption ? (
        <figcaption className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-3 pr-8">
          <span aria-hidden className="h-px w-6 bg-accent/70" />
          <span className="u-label text-text/70">{media.caption}</span>
        </figcaption>
      ) : null}

      {children}
    </div>
  );
}
