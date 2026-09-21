import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { brand } from "@/data/brand";

/**
 * The share card.
 *
 * What appears when a link is pasted into WhatsApp is the whole first
 * impression of the site — and for a residence, that is where most links are
 * read. So the card is composed rather than auto-generated: the ink panel, the
 * project's own line, the price, and the photograph behind a gradient, all from
 * the same records the page renders from.
 *
 * The photograph is inlined as a data URI: a generated image is rendered during
 * the build, when nothing is listening on the site's own URL, so a relative
 * `/media/...` path would not resolve.
 */
export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

/** Reading a photograph per request would re-hit the disk; the build reuses it. */
const cache = new Map<string, Promise<string>>();

async function photoDataUri(path: string): Promise<string | null> {
  if (!path.startsWith("/media/")) return null;
  const cached = cache.get(path);
  if (cached) return cached;

  const pending = readFile(join(process.cwd(), "public", path))
    .then((file) => `data:image/jpeg;base64,${file.toString("base64")}`)
    .catch(() => null);

  cache.set(path, pending);
  return pending;
}

type Card = {
  /** Small caps line above the headline — the locality, usually. */
  eyebrow: string;
  /** The headline, on as many lines as it needs. */
  lines: string[];
  /** The one-line summary under the rule. */
  summary: string;
  /** Right-hand figures: label over value. */
  facts: { label: string; value: string }[];
  /** A photograph from /public, or null for a type-only card. */
  image: string | null;
};

export async function ogCard({ eyebrow, lines, summary, facts, image }: Card) {
  const photo = image ? await photoDataUri(image) : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#14150f",
          position: "relative",
        }}
      >
        {photo ? (
          <img
            src={photo}
            alt=""
            width={OG_SIZE.width}
            height={OG_SIZE.height}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.62,
            }}
          />
        ) : null}

        {/* Ink from the left, so the type always sits on a readable field. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            backgroundImage:
              "linear-gradient(90deg, rgba(20,21,15,0.97) 0%, rgba(20,21,15,0.92) 46%, rgba(20,21,15,0.42) 76%, rgba(20,21,15,0.22) 100%)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 68px",
            width: "100%",
            height: "100%",
          }}
        >
          {/* masthead */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", fontSize: 30, color: "#efe9df", letterSpacing: -0.4 }}>
              {brand.wordmark.primary}
            </div>
            <div style={{ display: "flex", width: 34, height: 1, background: "rgba(201,172,133,0.6)" }} />
            <div
              style={{
                display: "flex",
                fontSize: 16,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: "#c9ac85",
              }}
            >
              {brand.wordmark.secondary}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", maxWidth: 780 }}>
            <div
              style={{
                display: "flex",
                fontSize: 17,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: "#c9ac85",
                marginBottom: 22,
              }}
            >
              {eyebrow}
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {lines.map((line) => (
                <div
                  key={line}
                  style={{
                    display: "flex",
                    fontSize: lines.length > 2 ? 62 : 72,
                    lineHeight: 1.04,
                    letterSpacing: -2,
                    color: "#efe9df",
                  }}
                >
                  {line}
                </div>
              ))}
            </div>

            <div style={{ display: "flex", width: 120, height: 1, background: "#c9ac85", margin: "30px 0 24px" }} />

            <div style={{ display: "flex", fontSize: 22, color: "#a49e92" }}>{summary}</div>
          </div>

          {/* figures */}
          <div style={{ display: "flex", gap: 56 }}>
            {facts.map((fact) => (
              <div key={fact.label} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div
                  style={{
                    display: "flex",
                    fontSize: 13,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    color: "#857e73",
                  }}
                >
                  {fact.label}
                </div>
                <div style={{ display: "flex", fontSize: 26, color: "#efe9df" }}>{fact.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
