"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { LaidOutPlan, PlacedRoom } from "@/data/types";
import { cn } from "@/lib/format";
import { PLAN_BOX, ftIn, metres } from "@/lib/plan";

/**
 * Technical plan drawing.
 *
 * Renders a laid-out plan as an architectural drawing: structural walls, room
 * fills by kind, hatched outdoor areas, dimension lines and a north arrow.
 *
 * The drawing is pointer-driven and hidden from assistive tech on purpose —
 * the room index beside it (see FloorPlanViewer) is the accessible surface.
 */

const PALETTE = {
  light: {
    line: "rgba(28,27,24,0.5)",
    lineSoft: "rgba(28,27,24,0.22)",
    grid: "rgba(28,27,24,0.07)",
    fill: "rgba(28,27,24,0.035)",
    outdoor: "rgba(28,27,24,0.1)",
    wet: "rgba(28,27,24,0.06)",
    service: "rgba(28,27,24,0.05)",
    active: "rgba(176,143,95,0.22)",
    activeLine: "#a5824f",
    text: "rgba(28,27,24,0.72)",
    textSoft: "rgba(28,27,24,0.45)",
  },
  dark: {
    line: "rgba(233,229,221,0.45)",
    lineSoft: "rgba(233,229,221,0.18)",
    grid: "rgba(233,229,221,0.06)",
    fill: "rgba(233,229,221,0.035)",
    outdoor: "rgba(233,229,221,0.09)",
    wet: "rgba(233,229,221,0.05)",
    service: "rgba(233,229,221,0.04)",
    active: "rgba(201,172,133,0.2)",
    activeLine: "#c9ac85",
    text: "rgba(233,229,221,0.75)",
    textSoft: "rgba(233,229,221,0.45)",
  },
} as const;

function roomFill(room: PlacedRoom, tone: "light" | "dark") {
  const p = PALETTE[tone];
  if (room.kind === "outdoor") return p.outdoor;
  if (room.kind === "wet") return p.wet;
  if (room.kind === "service") return p.service;
  return p.fill;
}

export function PlanDrawing({
  plan,
  activeId,
  onRoomHover,
  onRoomSelect,
  tone = "light",
  showLabels = true,
  showDimensions = true,
  className,
}: {
  plan: LaidOutPlan;
  activeId?: string | null;
  onRoomHover?: (id: string | null) => void;
  onRoomSelect?: (id: string) => void;
  tone?: "light" | "dark";
  showLabels?: boolean;
  showDimensions?: boolean;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const p = PALETTE[tone];
  const { rooms, extent } = plan;

  const minX = Math.min(...rooms.map((r) => r.x));
  const minY = Math.min(...rooms.map((r) => r.y));
  const maxX = Math.max(...rooms.map((r) => r.x + r.w));
  const maxY = Math.max(...rooms.map((r) => r.y + r.h));

  const dimTop = 34;
  const dimLeft = 34;

  return (
    <svg
      viewBox={`0 0 ${PLAN_BOX.w} ${PLAN_BOX.h}`}
      className={cn("h-auto w-full", className)}
      aria-hidden
      role="presentation"
    >
      <defs>
        <pattern id={`${uid}-grid`} width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" fill="none" stroke={p.grid} strokeWidth="1" />
        </pattern>
        <pattern
          id={`${uid}-hatch`}
          width="14"
          height="14"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line x1="0" y1="0" x2="0" y2="14" stroke={p.lineSoft} strokeWidth="1.4" />
        </pattern>
      </defs>

      <rect x="0" y="0" width={PLAN_BOX.w} height={PLAN_BOX.h} fill={`url(#${uid}-grid)`} />

      {/* structure */}
      <rect
        x={minX - 10}
        y={minY - 10}
        width={maxX - minX + 20}
        height={maxY - minY + 20}
        fill="none"
        stroke={p.line}
        strokeWidth="5"
      />

      {/* rooms */}
      {rooms.map((room) => {
        const isActive = activeId === room.id;
        const labelFits = showLabels && room.w > 118 && room.h > 74;
        const areaFits = showLabels && room.w > 118 && room.h > 104;
        return (
          <g
            key={room.id}
            onPointerEnter={() => onRoomHover?.(room.id)}
            onPointerLeave={() => onRoomHover?.(null)}
            onClick={() => onRoomSelect?.(room.id)}
            style={{ cursor: onRoomSelect ? "pointer" : "default" }}
          >
            <motion.rect
              x={room.x}
              y={room.y}
              width={room.w}
              height={room.h}
              fill={isActive ? p.active : roomFill(room, tone)}
              stroke={isActive ? p.activeLine : p.lineSoft}
              strokeWidth={isActive ? 2.5 : 1.5}
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            />
            {room.kind === "outdoor" ? (
              <rect
                x={room.x}
                y={room.y}
                width={room.w}
                height={room.h}
                fill={`url(#${uid}-hatch)`}
                opacity={0.5}
              />
            ) : null}

            {labelFits ? (
              <g pointerEvents="none">
                <text
                  x={room.x + room.w / 2}
                  y={room.y + room.h / 2 - (areaFits ? 4 : 0) + 6}
                  textAnchor="middle"
                  fill={isActive ? p.activeLine : p.text}
                  fontFamily="var(--font-plex-mono), monospace"
                  fontSize={17}
                  letterSpacing="0.14em"
                >
                  {room.name.toUpperCase()}
                </text>
                {areaFits ? (
                  <text
                    x={room.x + room.w / 2}
                    y={room.y + room.h / 2 + 22}
                    textAnchor="middle"
                    fill={p.textSoft}
                    fontFamily="var(--font-plex-mono), monospace"
                    fontSize={13}
                    letterSpacing="0.1em"
                  >
                    {room.area} SQ.FT.
                  </text>
                ) : null}
              </g>
            ) : null}
          </g>
        );
      })}

      {showDimensions ? (
        <>
          {/* overall dimensions */}
          <g stroke={p.lineSoft} strokeWidth="1.5" fill="none">
            <line x1={minX} y1={dimTop} x2={maxX} y2={dimTop} />
            <line x1={minX} y1={dimTop - 7} x2={minX} y2={dimTop + 7} />
            <line x1={maxX} y1={dimTop - 7} x2={maxX} y2={dimTop + 7} />
            <line x1={dimLeft} y1={minY} x2={dimLeft} y2={maxY} />
            <line x1={dimLeft - 7} y1={minY} x2={dimLeft + 7} y2={minY} />
            <line x1={dimLeft - 7} y1={maxY} x2={dimLeft + 7} y2={maxY} />
          </g>
          <text
            x={(minX + maxX) / 2}
            y={dimTop - 10}
            textAnchor="middle"
            fill={p.textSoft}
            fontFamily="var(--font-plex-mono), monospace"
            fontSize={14}
            letterSpacing="0.12em"
          >
            {`${ftIn(extent.w)} · ${metres(extent.w)}`}
          </text>
          <text
            x={8}
            y={(minY + maxY) / 2}
            fill={p.textSoft}
            fontFamily="var(--font-plex-mono), monospace"
            fontSize={14}
            letterSpacing="0.12em"
            transform={`rotate(-90 12 ${(minY + maxY) / 2})`}
          >
            {`${ftIn(extent.h)} · ${metres(extent.h)}`}
          </text>

          {/* north arrow */}
          <g transform={`translate(${maxX - 4} ${minY + 26})`} opacity={0.75}>
            <line x1="0" y1="0" x2="0" y2="46" stroke={p.line} strokeWidth="1.5" />
            <path d="M-7 12 L0 -6 L7 12 Z" fill={p.textSoft} />
            <text
              x={0}
              y={62}
              textAnchor="middle"
              fill={p.textSoft}
              fontFamily="var(--font-plex-mono), monospace"
              fontSize={14}
            >
              N
            </text>
          </g>

          {/* scale bar — 5 m, drawn to the plan's own scale */}
          <g transform={`translate(${minX} ${maxY + 34})`} opacity={0.8}>
            <rect x="0" y="0" width={(5 / 0.3048) * plan.spec.pxPerFt * 0.5} height="6" fill={p.lineSoft} />
            <rect
              x={(5 / 0.3048) * plan.spec.pxPerFt * 0.5}
              y="0"
              width={(5 / 0.3048) * plan.spec.pxPerFt * 0.5}
              height="6"
              fill="none"
              stroke={p.lineSoft}
              strokeWidth="1"
            />
            <text
              x="0"
              y="24"
              fill={p.textSoft}
              fontFamily="var(--font-plex-mono), monospace"
              fontSize={13}
              letterSpacing="0.1em"
            >
              0 — 5 M
            </text>
          </g>
        </>
      ) : null}
    </svg>
  );
}
