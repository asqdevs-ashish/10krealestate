"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { getFlagship } from "@/data";
import type { Project } from "@/data/types";
import { cn, formatArea } from "@/lib/format";
import { KIND_LABEL, layoutPlan } from "@/lib/plan";
import { useMediaQuery } from "@/lib/motion";
import { onSelectPlan } from "@/lib/events";
import { Eyebrow } from "@/components/ui/Label";
import { Action } from "@/components/ui/Action";
import { Modal } from "@/components/ui/Modal";
import { Section } from "@/components/ui/Section";
import { DisplayLines, Reveal } from "@/components/motion/Reveal";
import { PlanDrawing } from "@/components/features/PlanDrawing";

/**
 * Floor plan experience.
 *
 * Hover on pointer devices, tap on touch. Either way the room index beside the
 * drawing is the keyboard- and screen-reader-accessible control surface.
 */
export function FloorPlanSection({
  project = getFlagship(),
  eyebrowIndex = "03",
}: {
  project?: Project;
  eyebrowIndex?: string;
}) {
  const [configIndex, setConfigIndex] = useState(Math.min(1, Math.max(0, project.plans.length - 1)));
  const plan = useMemo(() => layoutPlan(project.plans[configIndex]), [project.plans, configIndex]);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string>(plan.rooms[0].id);
  const [detailed, setDetailed] = useState(false);
  // Room labels only fit once the drawing is wide enough to read them.
  const roomLabels = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    setHovered(null);
    setSelected(plan.rooms[0].id);
  }, [plan]);

  // A project switch (CMS navigation, deep link) must not leave a stale index.
  useEffect(() => {
    setConfigIndex((index) => Math.min(index, Math.max(0, project.plans.length - 1)));
  }, [project.plans.length]);

  // Another section can open a specific configuration here.
  useEffect(
    () =>
      onSelectPlan((configuration) => {
        const next = project.plans.findIndex((spec) => spec.configuration === configuration);
        if (next >= 0) setConfigIndex(next);
      }),
    [project.plans],
  );

  const activeId = hovered ?? selected;
  const shown = plan.rooms.find((room) => room.id === activeId) ?? plan.rooms[0];
  // Plans and residences are generated from the same list, but resolve by
  // configuration so the two can never drift apart.
  const residence = project.residences.find(
    (r) => r.configuration === plan.spec.configuration,
  );
  const residenceQuery = residence ? `?residence=${residence.id}` : "";

  return (
    <Section id="floor-plan" tone="light">
      <div className="grid gap-10 xl:grid-cols-12 xl:gap-16">
        <div className="xl:col-span-6">
          <Eyebrow index={eyebrowIndex} tone="light">
            Plans
          </Eyebrow>
          <DisplayLines
            as="h2"
            lines={["Space designed", "around how you live."]}
            className="u-display mt-8 text-[clamp(2.2rem,5.4vw,4.5rem)] text-text"
          />
        </div>
        <Reveal delay={0.1} className="flex flex-col justify-end gap-6 xl:col-span-6">
          <p className="max-w-[46ch] text-sm leading-relaxed text-dim md:text-base">
            Every residence here is planned twice — once for the drawing, once for the furniture.
            Hover or tap any room to see the area it holds and the dimensions on the drawing.
          </p>
          <div className="flex flex-wrap gap-x-10 gap-y-3 border-t border-hair pt-5">
            <span className="u-label text-dim">{plan.spec.level}</span>
            <span className="u-label text-dim">Facing {plan.spec.orientation}</span>
            <span className="u-label text-dim">{plan.rooms.length} rooms</span>
          </div>
        </Reveal>
      </div>

      {/* configuration selector */}
      <div
        role="group"
        aria-label="Floor plan configurations"
        className="mt-14 flex flex-wrap gap-8 border-t border-hair pt-6"
      >
        {project.plans.map((spec, i) => {
          const isActive = i === configIndex;
          return (
            <button
              key={spec.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setConfigIndex(i)}
              className={cn(
                "group relative pb-1 transition-colors duration-500",
                isActive ? "text-text" : "text-dim hover:text-text",
              )}
            >
              <span className="u-label">{spec.configuration}</span>
              <span
                aria-hidden
                className={cn(
                  "absolute bottom-0 left-0 h-px bg-accent transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  isActive ? "w-full" : "w-0 group-hover:w-full",
                )}
              />
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid gap-12 xl:grid-cols-12 xl:gap-16">
        <div className="xl:col-span-8">
          <div className="relative border border-hair bg-paper-2 p-4 md:p-8">
            <PlanDrawing
              plan={plan}
              activeId={activeId}
              onRoomHover={setHovered}
              onRoomSelect={(id) => setSelected(id)}
              tone="light"
              showLabels={roomLabels}
            />
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <p className="u-label text-dim">
              {plan.spec.configuration} · {formatArea(plan.spec.areaSuper)} super built-up ·{" "}
              {formatArea(plan.carpet)} drawn
            </p>
            <p className="u-label text-dim">All dimensions in feet and inches</p>
          </div>
        </div>

        <div className="flex flex-col gap-8 xl:col-span-4">
          <motion.div
            key={shown.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            data-tone="dark"
            className="border border-hair bg-ink p-6 text-paper"
          >
            <span className="u-label text-accent">{KIND_LABEL[shown.kind]}</span>
            <h3 className="u-display mt-4 text-[1.75rem] leading-none">{shown.name}</h3>
            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-[2.75rem] leading-none">{shown.area}</span>
              <span className="u-label text-accent">SQ.FT.</span>
            </div>
            <p className="u-num mt-4 text-xs text-paper/60">{shown.dims}</p>
            {shown.note ? (
              <p className="mt-5 max-w-[30ch] text-xs leading-relaxed text-paper/70">
                {shown.note}
              </p>
            ) : null}
          </motion.div>

          <div>
            <p className="u-label text-dim">Room index</p>
            <ul className="mt-5 flex flex-col">
              {plan.rooms.map((room) => {
                const isActive = room.id === activeId;
                return (
                  <li key={room.id}>
                    <button
                      type="button"
                      onPointerEnter={() => setHovered(room.id)}
                      onPointerLeave={() => setHovered(null)}
                      onFocus={() => setHovered(room.id)}
                      onBlur={() => setHovered(null)}
                      onClick={() => setSelected(room.id)}
                      aria-pressed={room.id === selected}
                      className={cn(
                        "flex w-full items-baseline justify-between border-b border-hair py-3 text-left transition-colors duration-400",
                        isActive ? "text-text" : "text-dim hover:text-text",
                      )}
                    >
                      <span className="flex items-baseline gap-3">
                        <span
                          aria-hidden
                          className={cn(
                            "h-1 w-1 rounded-full transition-colors duration-400",
                            isActive ? "bg-accent" : "bg-transparent",
                          )}
                        />
                        <span className="text-sm">{room.name}</span>
                      </span>
                      <span className="u-num text-xs">{room.area}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex flex-wrap gap-4">
            <Action tone="light" variant="ghost" arrow onClick={() => setDetailed(true)}>
              View Detailed Plan
            </Action>
            <Action tone="light" variant="text" href={`/book-a-viewing${residenceQuery}`} arrow>
              Request Residence Details
            </Action>
          </div>
        </div>
      </div>

      <Modal
        open={detailed}
        onClose={() => setDetailed(false)}
        label={`${plan.spec.configuration} detailed plan`}
        tone="light"
      >
        <div className="flex flex-col gap-8 p-7 md:p-12">
          <div className="flex flex-col gap-4">
            <Eyebrow index={plan.spec.configuration} tone="light">
              Detailed plan · {plan.spec.level}
            </Eyebrow>
            <h2 className="u-display text-[clamp(1.8rem,3.4vw,2.6rem)] text-text">
              {plan.spec.configuration} — {formatArea(plan.spec.areaSuper)}
            </h2>
          </div>
          <div className="border border-hair bg-paper-2 p-4 md:p-8">
            <PlanDrawing plan={plan} tone="light" />
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <dl className="flex flex-col gap-4">
              {[
                { label: "Super built-up", value: formatArea(plan.spec.areaSuper) },
                { label: "Drawn carpet", value: formatArea(plan.carpet) },
                { label: "Level", value: plan.spec.level },
                { label: "Orientation", value: plan.spec.orientation },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between border-b border-hair pb-3">
                  <dt className="u-label text-dim">{row.label}</dt>
                  <dd className="u-num text-xs text-text">{row.value}</dd>
                </div>
              ))}
            </dl>
            <ul className="flex flex-col gap-3">
              {plan.spec.notes.map((note) => (
                <li key={note} className="flex items-start gap-3 text-xs leading-relaxed text-dim">
                  <span aria-hidden className="mt-1.5 h-px w-4 shrink-0 bg-accent" />
                  {note}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-4">
            <Action
              tone="light"
              variant="primary"
              href={`/book-a-viewing${residenceQuery}`}
              arrow
              onClick={() => setDetailed(false)}
            >
              Request Residence Details
            </Action>
          </div>
        </div>
      </Modal>
    </Section>
  );
}
