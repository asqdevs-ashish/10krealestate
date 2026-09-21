import { ImageResponse } from "next/og";

/**
 * The installable icon set.
 *
 * The favicon is an SVG (crisp at any tab size); a home-screen icon has to be a
 * PNG, so it is drawn here at build time from the same mark — an ink square,
 * the champagne hairline, the A. Nothing to keep in step with a redesign, and
 * no binary in the repository.
 *
 * Both sizes are generated once at build time and served as static files.
 */
export async function generateStaticParams() {
  return [{ size: "192" }, { size: "512" }];
}

export async function GET(_request: Request, { params }: { params: Promise<{ size: string }> }) {
  const { size } = await params;
  const pixels = size === "192" ? 192 : 512;

  // Drawn at 4× and scaled by the renderer, so the hairline stays a hairline.
  const unit = pixels / 64;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a09",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: 44 * unit,
            height: 44 * unit,
            border: `${Math.max(1, unit)}px solid rgba(201, 172, 133, 0.45)`,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 30 * unit,
              lineHeight: 1,
              color: "#c9ac85",
            }}
          >
            A
          </div>
          <div
            style={{
              display: "flex",
              width: 20 * unit,
              height: Math.max(1, unit),
              marginTop: 3 * unit,
              background: "rgba(201, 172, 133, 0.6)",
            }}
          />
        </div>
      </div>
    ),
    { width: pixels, height: pixels },
  );
}
