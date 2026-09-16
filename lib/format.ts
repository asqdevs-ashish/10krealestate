/** INR, area and metadata formatting helpers (Indian numbering). */

const CR = 10_000_000;
const L = 100_000;

const num = new Intl.NumberFormat("en-IN");

function trim(value: number): string {
  return value.toFixed(2).replace(/\.?0+$/, "");
}

/** ₹2.45 Cr · ₹85 L · ₹2,45,00,000 */
export function formatINR(value: number, opts: { full?: boolean } = {}): string {
  if (opts.full) return `₹${num.format(Math.round(value))}`;
  if (value >= CR) return `₹${trim(value / CR)} Cr`;
  if (value >= L) return `₹${trim(value / L)} L`;
  return `₹${num.format(Math.round(value))}`;
}

/** 1,240 sq.ft. */
export function formatArea(value: number, unit = "sq.ft."): string {
  return `${num.format(Math.round(value))} ${unit}`;
}

/** 05 → "05", used for the map and metadata blocks. */
export function pad2(value: number): string {
  return value.toString().padStart(2, "0");
}

export function cn(...values: (string | false | null | undefined)[]): string {
  return values.filter(Boolean).join(" ");
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Short reference used in enquiry payloads and WhatsApp handoffs. */
export function makeReference(parts: (string | undefined)[]): string {
  const stamp = new Date();
  const date = `${stamp.getFullYear()}${pad2(stamp.getMonth() + 1)}${pad2(stamp.getDate())}`;
  const code = parts
    .filter(Boolean)
    .map((p) => p!.replace(/[^A-Za-z0-9]/g, "").slice(0, 4).toUpperCase())
    .join("-");
  return `${code || "VAULT"}-${date}`;
}
