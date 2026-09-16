import { planIdFor, residenceId } from "./residences";
import type { Configuration, Unit, UnitStatus } from "./types";

/**
 * Inventory.
 *
 * VAULT's unit sheet is written out in full — it is the project the pitch opens
 * with. Every other project is generated from a compact stack spec, so its
 * inventory stays internally consistent (areas and prices agree with the
 * residence list) without a thousand hand-typed rows.
 *
 * Both shapes are exactly what a CRM feed would return; replace `rows` or
 * `buildInventory` and the availability desk keeps working.
 */

type Row = [
  id: string,
  configuration: Configuration,
  floor: number,
  status: UnitStatus,
  facing: string,
  note?: string,
];

const vaultRows: Row[] = [
  // Tower A — three and four bedroom residences, levels 02 to 09
  ["A-201", "3 BHK", 2, "sold", "Aravalli Ridge"],
  ["A-202", "4 BHK", 2, "reserved", "Golf Course Road"],
  ["A-301", "3 BHK", 3, "available", "Aravalli Ridge", "Corner unit, double aspect"],
  ["A-302", "4 BHK", 3, "sold", "Golf Course Road"],
  ["A-401", "3 BHK", 4, "sold", "Aravalli Ridge"],
  ["A-402", "4 BHK", 4, "available", "Golf Course Road", "Double-height living"],
  ["A-501", "3 BHK", 5, "sold", "Aravalli Ridge"],
  ["A-502", "4 BHK", 5, "sold", "Golf Course Road"],
  ["A-601", "3 BHK", 6, "available", "Aravalli Ridge", "Corner unit, double aspect"],
  ["A-602", "4 BHK", 6, "sold", "Golf Course Road"],
  ["A-701", "3 BHK", 7, "sold", "Aravalli Ridge"],
  ["A-702", "4 BHK", 7, "available", "Golf Course Road", "Double-height living"],
  ["A-801", "3 BHK", 8, "available", "Aravalli Ridge"],
  ["A-802", "4 BHK", 8, "reserved", "Golf Course Road"],
  ["A-901", "3 BHK", 9, "sold", "Aravalli Ridge"],
  ["A-902", "4 BHK", 9, "sold", "Golf Course Road", "Top floor of the stack"],

  // Tower B — two and three bedroom residences, levels 02 to 08
  ["B-203", "2 BHK", 2, "sold", "Podium Garden"],
  ["B-204", "3 BHK", 2, "sold", "Central Courtyard"],
  ["B-303", "2 BHK", 3, "sold", "Podium Garden"],
  ["B-304", "3 BHK", 3, "available", "Central Courtyard"],
  ["B-403", "2 BHK", 4, "available", "Podium Garden", "Garden-facing balcony"],
  ["B-404", "3 BHK", 4, "sold", "Central Courtyard"],
  ["B-503", "2 BHK", 5, "reserved", "Podium Garden"],
  ["B-504", "3 BHK", 5, "sold", "Central Courtyard"],
  ["B-603", "2 BHK", 6, "reserved", "Podium Garden"],
  ["B-604", "3 BHK", 6, "sold", "Central Courtyard"],
  ["B-703", "2 BHK", 7, "sold", "Podium Garden", "Garden-facing balcony"],
  ["B-704", "3 BHK", 7, "sold", "Central Courtyard"],
  ["B-803", "2 BHK", 8, "sold", "Podium Garden"],
  ["B-804", "3 BHK", 8, "reserved", "Central Courtyard"],

  // Penthouses — levels 10 and 11, two per level
  ["PH-1001", "Penthouse", 10, "available", "Aravalli Ridge", "Three-direction terrace"],
  ["PH-1002", "Penthouse", 10, "sold", "Aravalli Ridge"],
  ["PH-1101", "Penthouse", 11, "reserved", "Aravalli Ridge"],
  ["PH-1102", "Penthouse", 11, "sold", "Aravalli Ridge"],
];

const vaultArea: Record<Configuration, number> = {
  "2 BHK": 1240,
  "3 BHK": 1980,
  "4 BHK": 2680,
  Penthouse: 3850,
};

const vaultBase: Record<Configuration, number> = {
  "2 BHK": 18_500_000,
  "3 BHK": 24_500_000,
  "4 BHK": 32_500_000,
  Penthouse: 59_000_000,
};

const vaultFloorStep: Record<Configuration, number> = {
  "2 BHK": 60_000,
  "3 BHK": 90_000,
  "4 BHK": 120_000,
  Penthouse: 0,
};

const vaultAspect: Record<string, number> = {
  "Aravalli Ridge": 300_000,
  "Golf Course Road": 250_000,
  "Podium Garden": 100_000,
  "Central Courtyard": 0,
};

function priceFor(
  base: number,
  floorStep: number,
  floor: number,
  firstFloor: number,
  aspect: number,
): number {
  return base + Math.max(0, floor - firstFloor) * floorStep + aspect;
}

export const units: Unit[] = vaultRows.map(([id, configuration, floor, status, facing, note]) => ({
  id,
  tower: id.split("-")[0],
  configuration,
  floor,
  area: vaultArea[configuration],
  price: priceFor(
    vaultBase[configuration],
    vaultFloorStep[configuration],
    floor,
    2,
    vaultAspect[facing] ?? 0,
  ),
  status,
  facing,
  planId: planIdFor("vault", configuration),
  residenceId: residenceId("vault", configuration),
  note,
}));

/* -------------------------------------------------------------- other projects */

export type InventoryStack = {
  configuration: Configuration;
  area: number;
  base: number;
  /** Inclusive floor range. */
  from: number;
  to: number;
  /** Residences of this stack per floor. */
  perFloor: number;
  facing: string;
  aspectPremium?: number;
  floorStep?: number;
  note?: string;
};

export type InventorySpec = {
  slug: string;
  towers: { code: string; stacks: InventoryStack[] }[];
  /** Exact number of residences left available / on hold. */
  available: number;
  reserved: number;
  seed?: number;
};

/** Deterministic hash so a build always produces the same unit sheet. */
function hash(index: number, seed: number): number {
  let h = Math.imul(index + 1, 2654435761) + Math.imul(seed + 7, 40503);
  h = (h ^ (h >>> 13)) >>> 0;
  return ((h >>> 7) % 1000) / 1000;
}

export function buildInventory(spec: InventorySpec): Unit[] {
  const seed = spec.seed ?? spec.slug.length;
  type Draft = Omit<Unit, "status">;
  const drafts: Draft[] = [];

  for (const tower of spec.towers) {
    let unitNumber = 1;
    for (const stack of tower.stacks) {
      for (let floor = stack.from; floor <= stack.to; floor += 1) {
        for (let k = 0; k < stack.perFloor; k += 1) {
          const number = unitNumber + k;
          drafts.push({
            id: `${tower.code}-${floor * 100 + number}`,
            tower: tower.code,
            configuration: stack.configuration,
            floor,
            area: stack.area,
            price:
              stack.base +
              Math.max(0, floor - stack.from) * (stack.floorStep ?? 90_000) +
              (stack.aspectPremium ?? 0),
            facing: stack.facing,
            planId: planIdFor(spec.slug, stack.configuration),
            residenceId: residenceId(spec.slug, stack.configuration),
            note: stack.note,
          });
        }
      }
      unitNumber += stack.perFloor;
    }
  }

  // Scatter availability through the building the way a real unit sheet reads:
  // determined by a stable hash, not by position.
  const order = drafts
    .map((_, index) => index)
    .sort((a, b) => hash(a, seed) - hash(b, seed));

  const status: UnitStatus[] = drafts.map(() => "sold");
  order.forEach((unitIndex, rank) => {
    if (rank < spec.available) status[unitIndex] = "available";
    else if (rank < spec.available + spec.reserved) status[unitIndex] = "reserved";
  });

  return drafts
    .map((draft, index) => ({ ...draft, status: status[index] }))
    .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
}

export const inventoryUpdated = "14 September 2026, 09:00 IST";
