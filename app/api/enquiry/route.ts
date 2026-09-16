import { NextResponse } from "next/server";
import { makeReference } from "@/lib/format";
import type { Enquiry } from "@/data/types";

/**
 * Demo enquiry endpoint.
 *
 * Replace the body with your CRM / email provider call (Salesforce, HubSpot,
 * Zoho, a webhook to the sales desk). The client contract — POST with an
 * `Enquiry` body, `{ ok, reference }` back — is all the UI depends on.
 */
export async function POST(request: Request) {
  let enquiry: Partial<Enquiry> = {};
  try {
    enquiry = (await request.json()) as Partial<Enquiry>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const reference = makeReference([
    enquiry.configuration ?? "VAULT",
    enquiry.name?.split(" ")[0],
  ]);

  // Demo: log the lead so it is visible in the server console.
  console.info("[enquiry]", {
    reference,
    project: enquiry.projectSlug,
    configuration: enquiry.configuration,
    budget: enquiry.budget,
    purpose: enquiry.purpose,
    timeline: enquiry.timeline,
    contactMethod: enquiry.contactMethod,
    source: enquiry.source,
  });

  return NextResponse.json({ ok: true, reference });
}
