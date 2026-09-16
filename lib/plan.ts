import type { LaidOutPlan, PlacedRoom, PlanSpec, RoomKind, RoomSpec } from "@/data/types";
import { slugify } from "./format";

/**
 * Floor-plan maths.
 *
 * A plan is authored as strips + columns + rows (see data/plans.ts). This
 * module turns that grid into placed rectangles and derives every area and
 * dimension from the drawing, so the numbers shown in the viewer can never
 * drift from the geometry.
 */

export const PLAN_BOX = { w: 1200, h: 900 };
const MARGIN = 60;
const WALL = 20; // gap between rooms — drawn as structure

export function ftIn(feet: number): string {
  const inches = Math.round(feet * 12);
  const f = Math.floor(inches / 12);
  const i = inches % 12;
  return `${f}' ${i}"`;
}

export function metres(feet: number): string {
  return `${(feet * 0.3048).toFixed(1)} m`;
}

function place(
  room: RoomSpec,
  x: number,
  y: number,
  w: number,
  h: number,
  pxPerFt: number,
): PlacedRoom {
  const ftW = w / pxPerFt;
  const ftH = h / pxPerFt;
  return {
    id: slugify(room.name),
    name: room.name,
    kind: room.kind as RoomKind,
    note: room.note,
    x: Math.round(x),
    y: Math.round(y),
    w: Math.round(w),
    h: Math.round(h),
    area: Math.round(ftW * ftH),
    dims: `${ftIn(ftW)} × ${ftIn(ftH)}`,
  };
}

export function layoutPlan(spec: PlanSpec): LaidOutPlan {
  const rooms: PlacedRoom[] = [];
  const W = PLAN_BOX.w - MARGIN * 2;
  const H = PLAN_BOX.h - MARGIN * 2;

  const frontH = spec.front?.depth ?? 0;
  const backH = spec.back?.depth ?? 0;
  const stripGaps = (spec.front ? WALL : 0) + (spec.back ? WALL : 0);
  const columnH = H - frontH - backH - stripGaps;

  let cursorY = MARGIN;
  if (spec.front) {
    rooms.push(
      place(
        { name: spec.front.name, kind: spec.front.kind, size: 1 },
        MARGIN,
        cursorY,
        W,
        frontH,
        spec.pxPerFt,
      ),
    );
    cursorY += frontH + WALL;
  }

  const columns = spec.columns;
  const availableW = W - WALL * (columns.length - 1);
  const shareTotal = columns.reduce((sum, c) => sum + c.width, 0);

  let cx = MARGIN;
  for (const column of columns) {
    const columnW = (availableW * column.width) / shareTotal;
    const rows = column.rows;
    const rowsTotal = rows.reduce((sum, r) => sum + r.weight, 0);
    const availableH = columnH - WALL * (rows.length - 1);

    let ry = cursorY;
    for (const row of rows) {
      const rowH = (availableH * row.weight) / rowsTotal;
      const rowW = columnW - WALL * (row.rooms.length - 1);
      const sizeTotal = row.rooms.reduce((sum, r) => sum + r.size, 0);

      let rx = cx;
      for (const room of row.rooms) {
        const roomW = (rowW * room.size) / sizeTotal;
        rooms.push(place(room, rx, ry, roomW, rowH, spec.pxPerFt));
        rx += roomW + WALL;
      }
      ry += rowH + WALL;
    }
    cx += columnW + WALL;
  }

  if (spec.back) {
    rooms.push(
      place(
        { name: spec.back.name, kind: spec.back.kind, size: 1 },
        MARGIN,
        cursorY + columnH + WALL,
        W,
        backH,
        spec.pxPerFt,
      ),
    );
  }

  return {
    spec,
    rooms,
    carpet: rooms.reduce((sum, r) => sum + r.area, 0),
    extent: { w: Math.round(W / spec.pxPerFt), h: Math.round(H / spec.pxPerFt) },
    viewBox: PLAN_BOX,
  };
}

export const KIND_LABEL: Record<RoomKind, string> = {
  living: "Living",
  sleep: "Sleeping",
  wet: "Bath / wet",
  service: "Service",
  outdoor: "Outdoor",
};
