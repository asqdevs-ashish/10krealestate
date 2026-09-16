"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { NearbyPlace } from "@/data/types";
import { cn } from "@/lib/format";

/**
 * Location intelligence.
 *
 * Rather than an embedded map, this is a drawn diagram of the corridor: the
 * artery, the metro line, the park, and the six destinations that matter. The
 * active route draws itself in; everything else stays recessive.
 */

const VIEW = { w: 1000, h: 700 };

const ROADS = [
  "M-40 540 C 220 440 520 372 1040 286",
  "M-40 648 C 260 632 640 606 1040 566",
  "M344 -20 C 356 220 380 470 404 720",
  "M840 -20 C 852 240 872 470 900 720",
];

function labelAnchor(x: number) {
  if (x < 240) return "start";
  if (x > 760) return "end";
  return "middle";
}

function labelOffset(x: number) {
  if (x < 240) return 18;
  if (x > 760) return -18;
  return 0;
}

export function LocationMap({
  places,
  site,
  activeId,
  onSelect,
  className,
}: {
  places: NearbyPlace[];
  site: { x: number; y: number; label: string };
  activeId: string;
  onSelect: (id: string) => void;
  className?: string;
}) {
  const active = places.find((p) => p.id === activeId) ?? places[0];

  return (
    <div data-tone="dark"
    className={cn("relative w-full overflow-hidden border border-hair bg-void", className)}>
      <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} className="h-full w-full">
        <defs>
          <pattern id="map-grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M50 0H0V50" fill="none" stroke="rgba(233,229,221,0.05)" strokeWidth="1" />
          </pattern>
          <radialGradient id="map-glow" cx="50%" cy="57%" r="45%">
            <stop offset="0%" stopColor="rgba(169,198,176,0.16)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        <rect width={VIEW.w} height={VIEW.h} fill="url(#map-grid)" />
        <rect width={VIEW.w} height={VIEW.h} fill="url(#map-glow)" />

        {/* landscape mass */}
        <path
          d="M-20 250 C 120 190 300 210 420 150 C 540 92 700 96 860 40 L 1040 60 L1040 -20 L-20 -20 Z"
          fill="rgba(30,42,26,0.5)"
        />
        <path
          d="M-20 700 C 160 660 340 690 520 640 C 700 590 860 610 1040 570 L1040 720 L-20 720 Z"
          fill="rgba(22,26,30,0.6)"
        />

        {/* blocks */}
        {[
          [120, 300, 150, 90],
          [300, 250, 120, 70],
          [520, 200, 180, 80],
          [700, 300, 140, 90],
          [180, 440, 130, 80],
          [620, 430, 160, 90],
          [420, 500, 120, 70],
          [820, 420, 110, 70],
        ].map(([x, y, w, h], i) => (
          <rect
            key={i}
            x={x}
            y={y}
            width={w}
            height={h}
            fill="rgba(233,229,221,0.035)"
            stroke="rgba(233,229,221,0.06)"
          />
        ))}

        {/* roads */}
        <g fill="none" strokeLinecap="round">
          {ROADS.map((d, i) => (
            <path key={`casing-${i}`} d={d} stroke="rgba(233,229,221,0.07)" strokeWidth={i < 2 ? 26 : 18} />
          ))}
          {ROADS.map((d, i) => (
            <path key={i} d={d} stroke="rgba(233,229,221,0.22)" strokeWidth={i < 2 ? 2 : 1.4} />
          ))}
        </g>

        {/* metro line */}
        <path
          d="M60 150 C 300 122 620 108 980 58"
          fill="none"
          stroke="rgba(169,198,176,0.55)"
          strokeWidth="2"
          strokeDasharray="10 8"
        />
        {[190, 420, 640, 850].map((x, i) => (
          <circle key={i} cx={x} cy={i === 0 ? 138 : i === 1 ? 115 : i === 2 ? 101 : 78} r="3.5" fill="#a9c6b0" />
        ))}

        {/* inactive routes */}
        <g fill="none" stroke="rgba(233,229,221,0.1)" strokeWidth="1.5" strokeDasharray="3 6">
          {places
            .filter((p) => p.id !== activeId)
            .map((p) => (
              <path key={p.id} d={p.route} />
            ))}
        </g>

        {/* active route */}
        <AnimatePresence mode="wait">
          <motion.path
            key={active.id}
            d={active.route}
            fill="none"
            stroke="#a9c6b0"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          />
        </AnimatePresence>

        {/* site marker */}
        <g>
          <circle cx={site.x} cy={site.y} r="7" fill="#a9c6b0" />
          <circle cx={site.x} cy={site.y} r="7" fill="none" stroke="#a9c6b0" strokeWidth="1.5" opacity="0.6">
            <animate attributeName="r" values="7;26" dur="3.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0" dur="3.6s" repeatCount="indefinite" />
          </circle>
          <text
            x={site.x}
            y={site.y + 30}
            textAnchor="middle"
            fill="rgba(233,229,221,0.9)"
            fontFamily="var(--font-plex-mono), monospace"
            fontSize="16"
            letterSpacing="0.16em"
          >
            {site.label.toUpperCase()}
          </text>
        </g>

        {/* destinations */}
        {places.map((place) => {
          const isActive = place.id === activeId;
          const anchor = labelAnchor(place.x);
          const offset = labelOffset(place.x);
          return (
            <g
              key={place.id}
              onClick={() => onSelect(place.id)}
              className="cursor-pointer"
              role="presentation"
            >
              <circle
                cx={place.x}
                cy={place.y}
                r={isActive ? 20 : 14}
                fill="transparent"
              />
              <circle
                cx={place.x}
                cy={place.y}
                r={isActive ? 6 : 4}
                fill={isActive ? "#efeae1" : "rgba(233,229,221,0.5)"}
                stroke={isActive ? "#a9c6b0" : "none"}
                strokeWidth="2"
              />
              <text
                x={place.x + (offset || 0)}
                y={place.y + 26}
                textAnchor={anchor}
                fill={isActive ? "rgba(233,229,221,0.92)" : "rgba(233,229,221,0.45)"}
                fontFamily="var(--font-plex-mono), monospace"
                fontSize="15"
                letterSpacing="0.12em"
              >
                {place.name.toUpperCase()}
              </text>
              <text
                x={place.x + (offset || 0)}
                y={place.y + 44}
                textAnchor={anchor}
                fill={isActive ? "#a9c6b0" : "rgba(233,229,221,0.3)"}
                fontFamily="var(--font-plex-mono), monospace"
                fontSize="13"
                letterSpacing="0.14em"
              >
                {`${place.minutes
                  .toString()
                  .padStart(2, "0")} MIN · ${place.km.toFixed(1)} KM`}
              </text>
            </g>
          );
        })}

        {/* compass + scale */}
        <g transform="translate(930 620)" opacity="0.55">
          <line x1="0" y1="-26" x2="0" y2="26" stroke="rgba(233,229,221,0.4)" strokeWidth="1.2" />
          <path d="M-6 -12 L0 -28 L6 -12 Z" fill="rgba(233,229,221,0.5)" />
          <text
            x="0"
            y="42"
            textAnchor="middle"
            fill="rgba(233,229,221,0.5)"
            fontFamily="var(--font-plex-mono), monospace"
            fontSize="11"
          >
            N
          </text>
        </g>
        <g transform="translate(52 656)" opacity="0.5">
          <rect x="0" y="0" width="60" height="4" fill="rgba(233,229,221,0.4)" />
          <text
            x="70"
            y="5"
            fill="rgba(233,229,221,0.5)"
            fontFamily="var(--font-plex-mono), monospace"
            fontSize="11"
            letterSpacing="0.1em"
          >
            2 KM
          </text>
        </g>
      </svg>

      {/* active destination readout */}
      <div className="pointer-events-none absolute top-5 left-5 flex flex-col gap-2">
        <span className="u-label text-accent">{`0${active.minutes}`.slice(-2)} MIN</span>
        <span className="u-label text-text/70">{active.name}</span>
        <span className="u-label text-faint">
          {active.category} · {active.km.toFixed(1)} km from site
        </span>
      </div>
    </div>
  );
}
