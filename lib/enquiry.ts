import type { Enquiry, QualificationAnswers } from "@/data/types";
import { makeReference } from "./format";

export type EnquiryResult = {
  ok: boolean;
  reference: string;
  /** Where the payload ended up — useful while the API is still a demo. */
  transport: "api" | "local";
};

/**
 * Submits a qualification enquiry.
 *
 * Posts to `/api/enquiry`, which is a demo endpoint. Wire `transport: "api"`
 * to your CRM / email provider and this function stays as the single
 * integration point for every CTA on the site.
 */
export async function submitEnquiry(
  answers: QualificationAnswers,
  options: { source: string; projectSlug?: string } = { source: "website" },
): Promise<EnquiryResult> {
  const payload: Enquiry = {
    ...answers,
    source: options.source,
    projectSlug: options.projectSlug ?? "vault",
    createdAt: new Date().toISOString(),
  };

  const reference = makeReference([
    payload.configuration ?? "VAULT",
    payload.name?.split(" ")[0],
  ]);

  try {
    const response = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`Enquiry failed: ${response.status}`);
    const data = (await response.json()) as { reference?: string };
    return { ok: true, reference: data.reference ?? reference, transport: "api" };
  } catch {
    // Demo fallback — never lose a lead because the endpoint is offline.
    try {
      const queue = JSON.parse(window.localStorage.getItem("asq-enquiries") ?? "[]") as Enquiry[];
      queue.push({ ...payload, reference } as Enquiry);
      window.localStorage.setItem("asq-enquiries", JSON.stringify(queue));
    } catch {
      /* storage unavailable — the reference is still returned to the visitor */
    }
    return { ok: true, reference, transport: "local" };
  }
}
