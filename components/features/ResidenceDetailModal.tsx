"use client";

import { useMemo } from "react";
import { getFlagship } from "@/data";
import type { Project, ResidenceConfig, Unit } from "@/data/types";
import { formatArea, formatINR, pad2 } from "@/lib/format";
import { layoutPlan } from "@/lib/plan";
import { buildWhatsAppMessage, whatsappUrl } from "@/lib/whatsapp";
import { Modal } from "@/components/ui/Modal";
import { Action } from "@/components/ui/Action";
import { Eyebrow, StatusDot } from "@/components/ui/Label";
import { MediaPlate } from "@/components/media/MediaPlate";
import { PlanDrawing } from "./PlanDrawing";

export function ResidenceDetailModal({
  open,
  onClose,
  residence,
  unit,
  project = getFlagship(),
}: {
  open: boolean;
  onClose: () => void;
  residence?: ResidenceConfig | null;
  unit?: Unit | null;
  /** The project these residences belong to — never assumed. */
  project?: Project;
}) {
  const config = residence ?? project.residences.find((r) => r.id === unit?.residenceId) ?? null;
  const plan = useMemo(
    () => (config ? layoutPlan(project.plans.find((p) => p.id === config.planId) ?? project.plans[0]) : null),
    [config, project.plans],
  );

  if (!config) return null;

  const message = buildWhatsAppMessage({
    projectName: project.name,
    unit: unit ?? undefined,
    residenceLabel: config.configuration,
    intent: "details",
  });
  const eyebrow = unit ? `Unit ${unit.id}` : `${project.name} · ${config.label}`;

  return (
    <Modal open={open} onClose={onClose} label={`${config.configuration} residence details`}>
      <div className="grid gap-0 md:grid-cols-[1.05fr_1fr]">
        <div className="relative min-h-[16rem]">
          <MediaPlate
            media={config.media}
            className="h-full min-h-[16rem] w-full"
            overlay="soft"
            caption
            index
          />
        </div>

        <div className="flex flex-col gap-8 p-7 md:p-10">
          <div className="flex flex-col gap-4">
            <Eyebrow index={eyebrow}>
              {unit ? `${config.configuration} · Floor ${pad2(unit.floor)}` : "Residence"}
            </Eyebrow>
            <h2 className="u-display text-[clamp(1.9rem,3.4vw,2.6rem)] text-text">
              {config.bedrooms} bedroom{config.bedrooms > 1 ? "s" : ""}, {config.bathrooms} bath
            </h2>
            <p className="max-w-[46ch] text-sm leading-relaxed text-dim">{config.copy}</p>
          </div>

          <dl className="grid grid-cols-2 gap-x-8 gap-y-5 border-t border-hair pt-6">
            <div className="flex flex-col gap-1.5">
              <dt className="u-label text-faint">Super built-up</dt>
              <dd className="u-num text-sm text-text/90">{formatArea(config.areaSuper)}</dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <dt className="u-label text-faint">{unit ? "Price" : "Price from"}</dt>
              <dd className="u-num text-sm text-text/90">
                {formatINR(unit ? unit.price : config.priceFrom)}
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <dt className="u-label text-faint">{unit ? "Facing" : "Carpet (planned)"}</dt>
              <dd className="u-num text-sm text-text/90">
                {unit ? unit.facing : plan ? formatArea(plan.carpet) : "—"}
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <dt className="u-label text-faint">Status</dt>
              <dd>
                {unit ? (
                  <StatusDot status={unit.status} />
                ) : (
                  <span className="u-label text-text/75">{project.statusLabel}</span>
                )}
              </dd>
            </div>
          </dl>

          {plan ? (
            <div className="border-t border-hair pt-6">
              <PlanDrawing plan={plan} tone="dark" showDimensions={false} showLabels={false} />
            </div>
          ) : null}

          <ul className="flex flex-col gap-3 border-t border-hair pt-6">
            {config.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm text-text/80">
                <span aria-hidden className="mt-2 h-px w-4 shrink-0 bg-accent/70" />
                {feature}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-4 border-t border-hair pt-6">
            <Action
              href={`/book-a-viewing?residence=${config.id}`}
              variant="primary"
              arrow
              onClick={onClose}
            >
              Request Residence Details
            </Action>
            <Action href={whatsappUrl(message)} external variant="ghost">
              Speak on WhatsApp
            </Action>
          </div>
        </div>
      </div>
    </Modal>
  );
}
