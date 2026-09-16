"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { STATUS_LABEL } from "@/data/brand";
import { getFlagship } from "@/data";
import type { Configuration, Project, Unit, UnitStatus } from "@/data/types";
import { cn, formatArea, formatINR, pad2 } from "@/lib/format";
import { StatusDot } from "@/components/ui/Label";
import { Action } from "@/components/ui/Action";
import { buildWhatsAppMessage, whatsappUrl } from "@/lib/whatsapp";
import { ResidenceDetailModal } from "./ResidenceDetailModal";

/**
 * Availability desk.
 *
 * Everything — the configuration list, the price bands, the floor bands, the
 * counts — is derived from the unit sheet it is handed, so the same component
 * works for a 12-residence building and a 148-residence tower without a change.
 */

type SortKey = "price" | "area" | "floor";

type Band = { id: string; from: number; to: number; label: string };

function bands(min: number, max: number, count: number, format: (n: number) => string): Band[] {
  if (!Number.isFinite(min) || max <= min) return [];
  const size = (max - min + 1) / count;
  return Array.from({ length: count }, (_, i) => {
    const from = min + Math.floor(i * size);
    const to = i === count - 1 ? max : min + Math.floor((i + 1) * size) - 1;
    return { id: `${from}-${to}`, from, to, label: `${format(from)} – ${format(to)}` };
  }).filter((band) => band.from <= max);
}

const SELECT =
  "u-label appearance-none border border-hair bg-transparent py-2.5 pr-8 pl-3 text-text/75 transition-colors duration-500 hover:border-hair-strong focus:border-accent/60";

export function AvailabilityTable({
  units,
  showFilters = true,
  showSummary = true,
  limit,
  project = getFlagship(),
}: {
  units: Unit[];
  showFilters?: boolean;
  showSummary?: boolean;
  limit?: number;
  project?: Project;
}) {
  const [configuration, setConfiguration] = useState<Configuration | "all">("all");
  const [status, setStatus] = useState<UnitStatus | "all">("available");
  const [priceBand, setPriceBand] = useState("all");
  const [floorBand, setFloorBand] = useState("all");
  const [sort, setSort] = useState<SortKey>("price");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");
  const [selected, setSelected] = useState<Unit | null>(null);

  const summary = useMemo(() => {
    const count = (value: UnitStatus) => units.filter((u) => u.status === value).length;
    return {
      total: units.length,
      available: count("available"),
      reserved: count("reserved"),
      sold: count("sold"),
    };
  }, [units]);

  const configurations = useMemo(
    () => [...new Set(units.map((u) => u.configuration))] as Configuration[],
    [units],
  );

  const prices = useMemo(() => units.map((u) => u.price), [units]);
  const priceBands = useMemo(
    () => bands(Math.min(...prices), Math.max(...prices), 3, (n) => formatINR(n)),
    [prices],
  );

  const floors = useMemo(() => units.map((u) => u.floor), [units]);
  const floorBands = useMemo(
    () =>
      bands(Math.min(...floors), Math.max(...floors), 3, (n) => pad2(Math.max(0, Math.round(n)))),
    [floors],
  );

  const rows = useMemo(() => {
    const price = priceBands.find((b) => b.id === priceBand);
    const floor = floorBands.find((b) => b.id === floorBand);
    const filtered = units.filter(
      (unit) =>
        (configuration === "all" || unit.configuration === configuration) &&
        (status === "all" || unit.status === status) &&
        (!price || (unit.price >= price.from && unit.price <= price.to)) &&
        (!floor || (unit.floor >= floor.from && unit.floor <= floor.to)),
    );
    const sorted = [...filtered].sort((a, b) => {
      const factor = direction === "asc" ? 1 : -1;
      if (sort === "price") return (a.price - b.price) * factor;
      if (sort === "area") return (a.area - b.area) * factor;
      return (a.floor - b.floor) * factor;
    });
    return limit ? sorted.slice(0, limit) : sorted;
  }, [units, configuration, status, priceBand, floorBand, priceBands, floorBands, sort, direction, limit]);

  const statusOptions: { id: UnitStatus | "all"; label: string; count: number }[] = [
    { id: "available", label: "Available", count: summary.available },
    { id: "reserved", label: "On hold", count: summary.reserved },
    { id: "sold", label: "Sold", count: summary.sold },
  ];

  const reset = () => {
    setConfiguration("all");
    setStatus("available");
    setPriceBand("all");
    setFloorBand("all");
  };

  const filtersActive =
    configuration !== "all" || status !== "available" || priceBand !== "all" || floorBand !== "all";

  return (
    <div className="flex flex-col gap-8">
      {showSummary ? (
        <div className="flex flex-col gap-5 border-t border-hair pt-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-wrap items-end gap-x-10 gap-y-4">
            <div className="flex flex-col gap-1.5">
              <span className="u-label text-faint">Available now</span>
              <span className="font-display text-[clamp(1.8rem,3vw,2.5rem)] leading-none text-text">
                {pad2(summary.available)}
                <span className="text-faint">/{summary.total}</span>
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="u-label text-faint">On hold</span>
              <span className="u-num text-sm text-text/80">{pad2(summary.reserved)}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="u-label text-faint">Sold</span>
              <span className="u-num text-sm text-text/80">{pad2(summary.sold)}</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="h-px w-full bg-hair md:w-64">
              <span
                className="block h-px bg-accent"
                style={{
                  width: `${summary.total ? (summary.available / summary.total) * 100 : 0}%`,
                }}
              />
            </div>
            <span className="u-label text-faint">
              {summary.total ? Math.round((summary.available / summary.total) * 100) : 0}% of the
              building still open
            </span>
          </div>
        </div>
      ) : null}

      {showFilters ? (
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="u-label mr-2 text-faint">Configuration</span>
            {(["all", ...configurations] as const).map((option) => {
              const isActive = configuration === option;
              const count = units.filter(
                (u) => (option === "all" || u.configuration === option) && u.status === "available",
              ).length;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setConfiguration(option)}
                  aria-pressed={isActive}
                  className={cn(
                    "u-label border px-4 py-2.5 transition-colors duration-500",
                    isActive
                      ? "border-accent/60 bg-accent/10 text-accent-2"
                      : "border-hair text-text/55 hover:border-hair-strong hover:text-text/85",
                  )}
                >
                  {option === "all" ? "All" : option}
                  <span className="ml-2 text-faint">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="u-label text-faint">Status</span>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((option) => {
                  const isActive = status === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setStatus(option.id)}
                      aria-pressed={isActive}
                      className={cn(
                        "u-label border px-3.5 py-2 transition-colors duration-500",
                        isActive
                          ? "border-accent/60 bg-accent/10 text-accent-2"
                          : "border-hair text-text/55 hover:border-hair-strong hover:text-text/85",
                      )}
                    >
                      {option.label}
                      <span className="ml-2 text-faint">{option.count}</span>
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setStatus("all")}
                  aria-pressed={status === "all"}
                  className={cn(
                    "u-label border px-3.5 py-2 transition-colors duration-500",
                    status === "all"
                      ? "border-accent/60 bg-accent/10 text-accent-2"
                      : "border-hair text-text/55 hover:border-hair-strong hover:text-text/85",
                  )}
                >
                  All
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
              {priceBands.length ? (
                <label className="flex flex-col gap-2">
                  <span className="u-label text-faint">Price</span>
                  <select
                    value={priceBand}
                    onChange={(event) => setPriceBand(event.target.value)}
                    className={SELECT}
                  >
                    <option value="all" className="bg-paper">
                      Any price
                    </option>
                    {priceBands.map((band) => (
                      <option key={band.id} value={band.id} className="bg-paper">
                        {band.label}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}

              {floorBands.length ? (
                <label className="flex flex-col gap-2">
                  <span className="u-label text-faint">Floor</span>
                  <select
                    value={floorBand}
                    onChange={(event) => setFloorBand(event.target.value)}
                    className={SELECT}
                  >
                    <option value="all" className="bg-paper">
                      Any floor
                    </option>
                    {floorBands.map((band) => (
                      <option key={band.id} value={band.id} className="bg-paper">
                        {band.label}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}

              <div className="flex items-end gap-2">
                <label className="flex flex-col gap-2">
                  <span className="u-label text-faint">Sort</span>
                  <select
                    value={sort}
                    onChange={(event) => setSort(event.target.value as SortKey)}
                    className={SELECT}
                  >
                    <option value="price" className="bg-paper">
                      Price
                    </option>
                    <option value="area" className="bg-paper">
                      Area
                    </option>
                    <option value="floor" className="bg-paper">
                      Floor
                    </option>
                  </select>
                </label>
                <button
                  type="button"
                  onClick={() => setDirection((value) => (value === "asc" ? "desc" : "asc"))}
                  className="u-label border border-hair px-3.5 py-2.5 text-text/70 transition-colors duration-500 hover:border-accent/60 hover:text-text"
                  aria-label={`Sort ${direction === "asc" ? "descending" : "ascending"}`}
                >
                  {direction === "asc" ? "↑" : "↓"}
                </button>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-5">
              <span className="u-num text-xs text-faint">
                {rows.length} {rows.length === 1 ? "residence" : "residences"}
              </span>
              {filtersActive ? (
                <button
                  type="button"
                  onClick={reset}
                  className="u-label border-b border-hair-strong pb-0.5 text-text/50 transition-colors duration-500 hover:border-accent/70 hover:text-text/85"
                >
                  Reset
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {/* header — desktop */}
      <div className="hidden border-b border-hair pb-4 md:grid md:grid-cols-[0.7fr_1fr_0.5fr_0.9fr_1fr_0.9fr_auto] md:gap-x-6">
        {["Unit", "Configuration", "Floor", "Area", "Price", "Status", ""].map((column, i) => (
          <span key={column || i} className="u-label text-faint">
            {column}
          </span>
        ))}
      </div>

      <div className="flex flex-col">
        <AnimatePresence initial={false} mode="popLayout">
          {rows.map((unit) => (
            <motion.button
              key={unit.id}
              type="button"
              layout="position"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              onClick={() => setSelected(unit)}
              className="group grid grid-cols-2 gap-y-3 border-b border-hair px-1 py-5 text-left transition-colors duration-500 hover:bg-ink/[0.03] md:grid-cols-[0.7fr_1fr_0.5fr_0.9fr_1fr_0.9fr_auto] md:items-center md:gap-x-6 md:py-4"
              aria-label={`Residence ${unit.id}, ${unit.configuration}, ${STATUS_LABEL[unit.status]}`}
            >
              <span className="flex flex-col gap-1 md:block">
                <span className="u-label text-faint md:hidden">Unit</span>
                <span className="u-num text-sm text-text transition-colors duration-500 group-hover:text-accent-2">
                  {unit.id}
                </span>
              </span>
              <span className="flex flex-col gap-1 md:block">
                <span className="u-label text-faint md:hidden">Configuration</span>
                <span className="text-sm text-text/85">{unit.configuration}</span>
              </span>
              <span className="flex flex-col gap-1 md:block">
                <span className="u-label text-faint md:hidden">Floor</span>
                <span className="u-num text-sm text-text/75">{pad2(unit.floor)}</span>
              </span>
              <span className="flex flex-col gap-1 md:block">
                <span className="u-label text-faint md:hidden">Area</span>
                <span className="u-num text-sm text-text/75">{formatArea(unit.area)}</span>
              </span>
              <span className="flex flex-col gap-1 md:block">
                <span className="u-label text-faint md:hidden">Price</span>
                <span className="u-num text-sm text-text/90">{formatINR(unit.price)}</span>
              </span>
              <span className="flex flex-col gap-1 md:block">
                <span className="u-label text-faint md:hidden">Status</span>
                <StatusDot status={unit.status} />
              </span>
              <span className="col-span-2 flex items-center justify-end gap-4 md:col-span-1">
                <span className="u-label truncate text-faint">{unit.facing}</span>
                <span
                  aria-hidden
                  className="u-label hidden text-accent-2 opacity-0 transition-opacity duration-500 group-hover:opacity-100 lg:block"
                >
                  Details →
                </span>
              </span>
            </motion.button>
          ))}
        </AnimatePresence>

        {rows.length === 0 ? (
          <div className="flex flex-col gap-6 border-b border-hair py-14">
            <p className="u-display max-w-[30ch] text-[clamp(1.4rem,2.6vw,2rem)] text-text/85">
              {filtersActive
                ? "Nothing in the inventory matches those filters."
                : "Nothing available in this configuration right now."}
            </p>
            <p className="max-w-[46ch] text-sm leading-relaxed text-dim">
              Inventory moves weekly. Register your interest and we will call you when a residence
              is released.
            </p>
            <div className="flex flex-wrap gap-4">
              <Action href="/book-a-viewing" variant="primary" arrow>
                Register interest
              </Action>
              {filtersActive ? (
                <Action variant="ghost" onClick={reset}>
                  Clear filters
                </Action>
              ) : (
                <Action
                  variant="ghost"
                  href={whatsappUrl(
                    buildWhatsAppMessage({ intent: "advisor", projectName: project.name }),
                  )}
                  external
                >
                  Speak on WhatsApp
                </Action>
              )}
            </div>
          </div>
        ) : null}
      </div>

      <ResidenceDetailModal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        unit={selected}
        project={project}
      />
    </div>
  );
}
