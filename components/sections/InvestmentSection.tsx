"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { getFlagship } from "@/data";
import type { Project } from "@/data/types";
import { formatINR } from "@/lib/format";
import { useCountUp } from "@/lib/motion";
import { Eyebrow } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";
import { DisplayLines, Reveal } from "@/components/motion/Reveal";
import { Action } from "@/components/ui/Action";

type Field = {
  key: "value" | "down" | "appreciation" | "years";
  label: string;
  min: number;
  max: number;
  step: number;
  format: (value: number) => string;
  hint: string;
};

export function InvestmentSection({
  project = getFlagship(),
  eyebrowIndex = "08",
}: {
  project?: Project;
  eyebrowIndex?: string;
}) {
  // The calculator opens on this project's own price list, and its sliders are
  // bounded by the same numbers — never a generic ₹3 Cr.
  const prices = project.residences.map((r) => r.priceFrom);
  const priceFloor = Math.floor(Math.min(...prices) / 500_000) * 500_000;
  const priceCeil = Math.ceil((Math.max(...prices) * 1.15) / 500_000) * 500_000;
  const opening = Math.min(
    Math.max(project.residences[Math.min(1, project.residences.length - 1)].priceFrom, priceFloor),
    priceCeil,
  );

  const [value, setValue] = useState(opening);
  const [downPct, setDownPct] = useState(25);
  const [appreciation, setAppreciation] = useState(8);
  const [years, setYears] = useState(5);

  const result = useMemo(() => {
    const projected = value * Math.pow(1 + appreciation / 100, years);
    const gain = projected - value;
    const down = (value * downPct) / 100;
    return {
      projected,
      gain,
      down,
      loan: value - down,
      multiple: projected / value,
    };
  }, [value, downPct, appreciation, years]);

  const projected = useCountUp(result.projected, 0.6);
  const gain = useCountUp(result.gain, 0.6);
  const multiple = useCountUp(result.multiple, 0.6);

  const fields: Field[] = [
    {
      key: "value",
      label: "Property value",
      min: priceFloor,
      max: priceCeil,
      step: 500_000,
      format: (v) => formatINR(v),
      hint: "At today's price list",
    },
    {
      key: "down",
      label: "Down payment",
      min: 10,
      max: 100,
      step: 5,
      format: (v) => `${v}% · ${formatINR((value * v) / 100)}`,
      hint: "Share of the price paid up front",
    },
    {
      key: "appreciation",
      label: "Expected annual appreciation",
      min: 3,
      max: 15,
      step: 0.5,
      format: (v) => `${v}% per year`,
      hint: "Historical corridor average",
    },
    {
      key: "years",
      label: "Holding period",
      min: 1,
      max: 10,
      step: 1,
      format: (v) => `${v} ${v === 1 ? "year" : "years"}`,
      hint: "Assumes no interim sale",
    },
  ];

  const values: Record<Field["key"], number> = {
    value,
    down: downPct,
    appreciation,
    years,
  };

  const setters: Record<Field["key"], (value: number) => void> = {
    value: setValue,
    down: setDownPct,
    appreciation: setAppreciation,
    years: setYears,
  };

  const bars = Array.from({ length: years }, (_, i) => {
    const year = i + 1;
    const amount = value * Math.pow(1 + appreciation / 100, year);
    return { year, amount, ratio: amount / result.projected };
  });

  return (
    <Section id="investment" tone="light">
      <div className="grid gap-12 xl:grid-cols-12 xl:gap-16">
        <div className="xl:col-span-5">
          <Eyebrow index={eyebrowIndex} tone="light">
            Investment outlook
          </Eyebrow>
          <DisplayLines
            as="h2"
            lines={["What could this", "residence become?"]}
            className="u-display mt-8 text-[clamp(2.1rem,5vw,4rem)] text-text"
          />
          <Reveal delay={0.08} className="mt-8 flex flex-col gap-6">
            <p className="max-w-[42ch] text-sm leading-relaxed text-dim md:text-base">
              Move the four numbers below to see how a residence at {project.name} could compound.
              These are the same assumptions the sales desk uses in conversation.
            </p>
            <div className="border-t border-hair pt-6">
              <p className="max-w-[40ch] text-xs leading-relaxed text-dim">
                Illustrative estimate only. Actual returns may vary, and nothing here is
                investment advice. Appreciation is not guaranteed on any residence.
              </p>
            </div>
            <Action
              tone="light"
              variant="text"
              href="/book-a-viewing"
              arrow
              className="self-start"
            >
              Speak with an advisor about the numbers
            </Action>
          </Reveal>
        </div>

        <div className="xl:col-span-7">
          <div className="grid gap-10 border border-hair bg-paper-2 p-6 md:p-10">
            <div className="grid gap-8 sm:grid-cols-2">
              {fields.map((field) => (
                <div key={field.key} className="flex flex-col gap-3">
                  <label htmlFor={`calc-${field.key}`} className="u-label text-dim">
                    {field.label}
                  </label>
                  <span className="u-num text-sm text-text">
                    {field.format(values[field.key])}
                  </span>
                  <input
                    id={`calc-${field.key}`}
                    type="range"
                    className="u-range"
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    value={values[field.key]}
                    onChange={(event) => setters[field.key](Number(event.target.value))}
                    aria-describedby={`calc-${field.key}-hint`}
                  />
                  <span id={`calc-${field.key}-hint`} className="u-label text-dim">
                    {field.hint}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-8 border-t border-hair pt-8">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="flex flex-col gap-3">
                  <span className="u-label text-dim">Projected value</span>
                  <span className="font-display text-[clamp(2.6rem,6vw,4.25rem)] leading-none text-text">
                    {formatINR(projected)}
                  </span>
                  <span className="u-num text-xs text-dim">
                    {formatINR(value, { full: true })} → {formatINR(result.projected, { full: true })}
                  </span>
                </div>
                <dl className="grid grid-cols-2 gap-x-10 gap-y-4 sm:grid-cols-3">
                  <div className="flex flex-col gap-1.5">
                    <dt className="u-label text-dim">Estimated gain</dt>
                    <dd className="u-num text-sm text-text">{formatINR(gain)}</dd>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <dt className="u-label text-dim">Multiple</dt>
                    <dd className="u-num text-sm text-text">{multiple.toFixed(2)}×</dd>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <dt className="u-label text-dim">Upfront</dt>
                    <dd className="u-num text-sm text-text">{formatINR(result.down)}</dd>
                  </div>
                </dl>
              </div>

              {/* growth, drawn quietly */}
              <div className="flex h-32 items-end gap-2 md:h-40">
                {bars.map((bar) => (
                  <div key={bar.year} className="flex flex-1 flex-col items-center gap-2">
                    <motion.div
                      className="w-full bg-ink"
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(6, bar.ratio * 100)}%` }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      style={{ alignSelf: "flex-end" }}
                    />
                    <span className="u-num text-[0.625rem] text-dim">
                      {`Y${bar.year}`}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span aria-hidden className="h-px w-8 bg-accent" />
                <span className="u-label text-dim">
                  Compounded at {appreciation}% for {years} {years === 1 ? "year" : "years"}
                </span>
              </div>
            </div>
          </div>

          <p className="mt-6 u-label text-dim">
            Illustrative estimate only · Actual returns may vary · {project.name}, {project.locality}
          </p>
        </div>
      </div>
    </Section>
  );
}
