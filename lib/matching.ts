import { availableCount, getFlagship, listProjects, listUnits } from "@/data";
import type { BudgetAnswer, Configuration, Project, QualificationAnswers, Unit } from "@/data/types";
import { formatArea, formatINR } from "./format";

export type BudgetBand = {
  label: BudgetAnswer;
  configuration: Configuration;
  range: [number, number];
};

export const BUDGET_BANDS: BudgetBand[] = [
  { label: "₹1–2 Cr", configuration: "2 BHK", range: [10_000_000, 20_000_000] },
  { label: "₹2–3 Cr", configuration: "3 BHK", range: [20_000_000, 30_000_000] },
  { label: "₹3–5 Cr", configuration: "4 BHK", range: [30_000_000, 50_000_000] },
  { label: "₹5 Cr+", configuration: "Penthouse", range: [50_000_000, 200_000_000] },
];

export function configurationForBudget(budget?: BudgetAnswer): Configuration | undefined {
  return BUDGET_BANDS.find((b) => b.label === budget)?.configuration;
}

export type Match = {
  configuration: Configuration;
  rationale: string;
  fromPrice: number;
  units: Unit[];
  available: number;
  area: number;
  intent: string;
};

/**
 * Shortlists residences from the qualification answers, against a named
 * project. Everything is derived from that project's inventory — swap the data
 * source and the shortlist keeps working.
 */
export function matchResidences(
  answers: QualificationAnswers,
  project: Project = getFlagship(),
): Match {
  const requested = answers.configuration ?? configurationForBudget(answers.budget);
  // Fall back to the cheapest configuration the project actually offers.
  const config =
    project.residences.find((r) => r.configuration === requested) ?? project.residences[0];
  const configuration = config.configuration;

  const open = listUnits({ configuration, status: "available", project });
  const remaining = listUnits({ configuration, project }).filter((u) => u.status === "reserved");
  const units = [...open, ...remaining].slice(0, 3);

  const count = availableCount(configuration, project);
  const parts: string[] = [
    `${config.bedrooms} bedrooms, ${formatArea(config.areaSuper)}`,
    count > 0
      ? `${count} ${count === 1 ? "residence" : "residences"} currently available from ${formatINR(config.priceFrom)}.`
      : "Discuss current availability with an advisor.",
  ];

  if (answers.purpose === "Investment") {
    parts.push(`${project.locality} holds rental demand from the Golf Course Road corridor.`);
  } else if (answers.purpose === "End Use") {
    parts.push(`Move-in planned around the ${project.possession} handover.`);
  }
  if (answers.timeline === "Immediately") {
    parts.push("Early inventory can be held for eight weeks.");
  } else if (answers.timeline === "Just Exploring") {
    parts.push("We will keep this shortlist open for you.");
  }

  return {
    configuration,
    rationale: parts.join(" "),
    fromPrice: config.priceFrom,
    units,
    available: count,
    area: config.areaSuper,
    intent: answers.purpose === "Investment" ? "Investment shortlist" : "Residence shortlist",
  };
}

/**
 * Resolve a `?residence=` deep link to the project that owns it, so a link from
 * a project page opens the funnel already pointed at that project.
 */
export function resolveResidence(residenceId: string | null) {
  if (!residenceId) return undefined;
  for (const project of listProjects()) {
    const residence = project.residences.find((r) => r.id === residenceId);
    if (residence) return { project, residence };
  }
  return undefined;
}
