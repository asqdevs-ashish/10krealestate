import type { ColumnSpec, Configuration, PlanSpec } from "./types";
import { slugify } from "@/lib/format";
import { layoutPlan } from "@/lib/plan";

/**
 * Floor plans.
 *
 * A plan is authored once as a small grid — full-width front / rear strips plus
 * vertical columns, each holding stacked rows of rooms — for each
 * configuration. Projects then supply their own areas, levels and orientation,
 * and the drawing scale is solved so the plan's carpet area always equals the
 * area the project publishes. Nothing is typed in twice.
 *
 * A CMS can supply this same shape, or a real DWG/SVG export, later, without
 * touching the viewer.
 */

type Geometry = Pick<PlanSpec, "front" | "back" | "columns" | "notes">;

const SHARED_NOTES = [
  "Dimensions are structural and exclusive of plaster finish.",
  "Furniture layout is indicative and not part of the offering.",
];

/** Drawn carpet as a share of super built-up area. */
const COVERAGE = 0.74;

const GEOMETRY: Record<Configuration, Geometry> = {
  "2 BHK": {
    front: { name: "Balcony", kind: "outdoor", depth: 90 },
    columns: [
      {
        width: 1.15,
        rows: [
          { weight: 1.65, rooms: [{ name: "Living", kind: "living", size: 1, note: "Flows into the dining volume" }] },
          { weight: 1.45, rooms: [{ name: "Master Bedroom", kind: "sleep", size: 1 }] },
        ],
      },
      {
        width: 1,
        rows: [
          { weight: 1.15, rooms: [{ name: "Dining", kind: "living", size: 1 }] },
          { weight: 1.3, rooms: [{ name: "Bedroom 02", kind: "sleep", size: 1, note: "Faces the courtyard" }] },
          { weight: 0.42, rooms: [{ name: "Foyer", kind: "living", size: 1 }] },
        ],
      },
      {
        width: 0.9,
        rows: [
          { weight: 1, rooms: [{ name: "Kitchen", kind: "service", size: 1 }] },
          {
            weight: 0.55,
            rooms: [
              { name: "Master Bath", kind: "wet", size: 0.55 },
              { name: "Bath 02", kind: "wet", size: 0.45 },
            ],
          },
        ],
      },
    ],
    notes: SHARED_NOTES,
  },

  "3 BHK": {
    front: { name: "Balcony", kind: "outdoor", depth: 80 },
    back: { name: "Terrace", kind: "outdoor", depth: 60 },
    columns: [
      {
        width: 1.22,
        rows: [
          { weight: 1.45, rooms: [{ name: "Living", kind: "living", size: 1, note: "Full-width opening to the balcony" }] },
          { weight: 1.35, rooms: [{ name: "Master Bedroom", kind: "sleep", size: 1 }] },
          {
            weight: 0.5,
            rooms: [
              { name: "Master Bath", kind: "wet", size: 0.55 },
              { name: "Walk-in", kind: "service", size: 0.45 },
            ],
          },
        ],
      },
      {
        width: 0.95,
        rows: [
          { weight: 1.15, rooms: [{ name: "Dining", kind: "living", size: 1 }] },
          { weight: 1.3, rooms: [{ name: "Bedroom 02", kind: "sleep", size: 1 }] },
          {
            weight: 0.5,
            rooms: [
              { name: "Foyer", kind: "living", size: 0.55 },
              { name: "Bath 02", kind: "wet", size: 0.45 },
            ],
          },
        ],
      },
      {
        width: 0.88,
        rows: [
          { weight: 1.15, rooms: [{ name: "Kitchen", kind: "service", size: 1 }] },
          { weight: 1.3, rooms: [{ name: "Bedroom 03", kind: "sleep", size: 1, note: "Doubles as a study" }] },
          { weight: 0.45, rooms: [{ name: "Utility", kind: "service", size: 1 }] },
        ],
      },
    ],
    notes: SHARED_NOTES,
  },

  "4 BHK": {
    front: { name: "Balcony", kind: "outdoor", depth: 90 },
    back: { name: "Terrace", kind: "outdoor", depth: 70 },
    columns: [
      {
        width: 1,
        rows: [
          { weight: 1.35, rooms: [{ name: "Living", kind: "living", size: 1, note: "Double height on the upper floors" }] },
          { weight: 1.3, rooms: [{ name: "Master Bedroom", kind: "sleep", size: 1 }] },
        ],
      },
      {
        width: 1,
        rows: [
          { weight: 1.1, rooms: [{ name: "Dining", kind: "living", size: 1, note: "Seats eight" }] },
          { weight: 1.2, rooms: [{ name: "Bedroom 02", kind: "sleep", size: 1 }] },
          {
            weight: 0.5,
            rooms: [
              { name: "Utility", kind: "service", size: 0.55 },
              { name: "Powder", kind: "wet", size: 0.45 },
            ],
          },
        ],
      },
      {
        width: 1,
        rows: [
          { weight: 1, rooms: [{ name: "Kitchen", kind: "service", size: 1 }] },
          { weight: 1.15, rooms: [{ name: "Bedroom 03", kind: "sleep", size: 1 }] },
          {
            weight: 0.5,
            rooms: [
              { name: "Master Bath", kind: "wet", size: 0.55 },
              { name: "Walk-in", kind: "service", size: 0.45 },
            ],
          },
        ],
      },
      {
        width: 0.95,
        rows: [
          { weight: 0.5, rooms: [{ name: "Foyer", kind: "living", size: 1, note: "Private lift lobby" }] },
          { weight: 1.4, rooms: [{ name: "Bedroom 04", kind: "sleep", size: 1 }] },
          { weight: 0.55, rooms: [{ name: "Bath 03", kind: "wet", size: 1 }] },
        ],
      },
    ],
    notes: SHARED_NOTES,
  },

  Penthouse: {
    front: { name: "Terrace", kind: "outdoor", depth: 100 },
    back: { name: "Plunge Deck", kind: "outdoor", depth: 80 },
    columns: [
      {
        width: 1.05,
        rows: [
          { weight: 1.3, rooms: [{ name: "Living", kind: "living", size: 1, note: "Double-height volume" }] },
          { weight: 1.35, rooms: [{ name: "Master Bedroom", kind: "sleep", size: 1 }] },
        ],
      },
      {
        width: 1,
        rows: [
          { weight: 1.15, rooms: [{ name: "Dining", kind: "living", size: 1 }] },
          { weight: 1.25, rooms: [{ name: "Bedroom 02", kind: "sleep", size: 1 }] },
          {
            weight: 0.45,
            rooms: [
              { name: "Pantry", kind: "service", size: 0.55 },
              { name: "Powder", kind: "wet", size: 0.45 },
            ],
          },
        ],
      },
      {
        width: 0.95,
        rows: [
          { weight: 1.05, rooms: [{ name: "Kitchen", kind: "service", size: 1 }] },
          { weight: 1.2, rooms: [{ name: "Bedroom 03", kind: "sleep", size: 1 }] },
          {
            weight: 0.55,
            rooms: [
              { name: "Master Bath", kind: "wet", size: 0.55 },
              { name: "Walk-in", kind: "service", size: 0.45 },
            ],
          },
        ],
      },
      {
        width: 0.9,
        rows: [
          { weight: 1.05, rooms: [{ name: "Library", kind: "living", size: 1 }] },
          { weight: 1.2, rooms: [{ name: "Bedroom 04", kind: "sleep", size: 1 }] },
          { weight: 0.5, rooms: [{ name: "Bath 04", kind: "wet", size: 1 }] },
        ],
      },
    ],
    notes: [...SHARED_NOTES, "Upper level holds the plunge deck, lounge and second terrace."],
  },
};

export type PlanInput = {
  /** Project slug — used to build a stable, CMS-friendly plan id. */
  slug: string;
  configuration: Configuration;
  areaSuper: number;
  level: string;
  orientation: string;
  /** Extra notes appended to the standard drawing notes. */
  notes?: string[];
};

/** Total drawn area (px²) of a geometry, independent of scale. */
function drawnArea(columns: ColumnSpec[], front?: Geometry["front"], back?: Geometry["back"]) {
  const probe: PlanSpec = {
    id: "probe",
    configuration: "3 BHK",
    level: "",
    areaSuper: 1,
    pxPerFt: 1,
    orientation: "",
    front,
    back,
    columns,
    notes: [],
  };
  return layoutPlan(probe).rooms.reduce((sum, room) => sum + room.w * room.h, 0);
}

export function buildPlan(input: PlanInput): PlanSpec {
  const geometry = GEOMETRY[input.configuration];
  const square = drawnArea(geometry.columns, geometry.front, geometry.back);
  // Solve the drawing scale so carpet = COVERAGE × published super built-up area.
  const pxPerFt = Math.sqrt(square / (input.areaSuper * COVERAGE));

  return {
    id: `${input.slug}-plan-${slugify(input.configuration)}`,
    configuration: input.configuration,
    level: input.level,
    areaSuper: input.areaSuper,
    pxPerFt: Math.round(pxPerFt * 10) / 10,
    orientation: input.orientation,
    front: geometry.front,
    back: geometry.back,
    columns: geometry.columns,
    notes: [...geometry.notes, ...(input.notes ?? [])],
  };
}

export function buildPlans(inputs: PlanInput[]): PlanSpec[] {
  return inputs.map(buildPlan);
}
