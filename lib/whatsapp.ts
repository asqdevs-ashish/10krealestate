import { brand } from "@/data/brand";
import type { QualificationAnswers, Unit } from "@/data/types";
import { formatINR, pad2 } from "./format";

/**
 * WhatsApp handoff.
 *
 * Messages are composed from whatever the visitor has told us — residence,
 * unit, budget, purpose, timeline, contact preference. Nothing is hardcoded to
 * a single message; every CTA on the site funnels through here.
 */

export function whatsappUrl(message: string, phone: string = brand.contact.whatsapp): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

type Context = {
  projectName?: string;
  answers?: QualificationAnswers;
  unit?: Pick<Unit, "id" | "configuration" | "area" | "price" | "floor">;
  residenceLabel?: string;
  intent?: "viewing" | "details" | "advisor" | "shortlist";
};

const INTENT_LINE: Record<NonNullable<Context["intent"]>, string> = {
  viewing: "I'd like to schedule a private viewing.",
  details: "Could you send me the residence details and floor plan?",
  advisor: "I'd like to speak with a property advisor.",
  shortlist: "I'd like to schedule a private viewing and go through the two options.",
};

/** An ISO day from the booking funnel reads better as "Tue 15 Sep". */
function readableDay(value: string): string {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

export function buildWhatsAppMessage(context: Context = {}): string {
  const {
    projectName = brand.name,
    answers = {},
    unit,
    residenceLabel,
    intent = "viewing",
  } = context;

  const subject = residenceLabel ?? answers.configuration ?? unit?.configuration;
  const lines: string[] = [];

  if (unit) {
    lines.push(`Hi, I'm interested in residence ${unit.id} at ${projectName}.`);
  } else if (subject) {
    lines.push(`Hi, I'm interested in a ${subject} residence at ${projectName}.`);
  } else {
    lines.push(`Hi, I'm interested in a residence at ${projectName}.`);
  }

  const details: string[] = [];
  if (unit) {
    details.push(`Unit: ${unit.id} · ${unit.configuration} · Floor ${pad2(unit.floor)}`);
    details.push(`Area: ${unit.area.toLocaleString("en-IN")} sq.ft.`);
    details.push(`Price: ${formatINR(unit.price)}`);
  }
  if (answers.budget) details.push(`Budget: ${answers.budget}`);
  if (answers.purpose) details.push(`Purpose: ${answers.purpose}`);
  if (answers.timeline) details.push(`Timeline: ${answers.timeline}`);
  if (answers.viewingDay) {
    const slot = answers.viewingSlot ? `, ${answers.viewingSlot}` : "";
    details.push(`Preferred viewing: ${readableDay(answers.viewingDay)}${slot}`);
  }

  if (details.length) {
    lines.push("");
    lines.push(...details);
  }

  lines.push("");
  lines.push(INTENT_LINE[intent]);

  if (answers.name) {
    lines.push("");
    lines.push(`Name: ${answers.name}`);
    if (answers.contactMethod) lines.push(`Preferred contact: ${answers.contactMethod}`);
  }
  if (answers.notes) {
    lines.push("");
    lines.push(`Note: ${answers.notes}`);
  }

  return lines.join("\n");
}

export function telHref(phone: string = brand.contact.phoneHref): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function mailtoHref(
  subject: string,
  body: string,
  email: string = brand.contact.email,
): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
