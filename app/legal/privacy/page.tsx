import type { Metadata } from "next";
import { brand } from "@/data/brand";
import { LegalPage } from "@/components/ui/LegalPage";

export const metadata: Metadata = {
  title: "Privacy",
  description: `How ${brand.name} handles enquiry details, cookies and site analytics.`,
};

export default function PrivacyPage() {
  return (
    <LegalPage
      updated="Updated 14.09.2026"
      eyebrow="Privacy"
      lines={["What we keep,", "and for how long."]}
      intro="This is a demonstration site. It is built to show how an enquiry is captured and routed — so it is worth being explicit about what it does with your details."
      sections={[
        {
          title: "What the enquiry form collects",
          copy: [
            "Your name, phone number, email address if you give one, and the answers you select — the residence you are looking for, budget band, purpose, timeline and preferred contact method.",
            "Nothing else is required, and no field is passed to a third party from this site.",
          ],
        },
        {
          title: "Where it goes",
          copy: [
            "On submission the details are posted to this site's enquiry endpoint, which returns a reference number and writes the enquiry to the server log. That endpoint is a demo; a production launch would forward the same payload to the developer's CRM and sales inbox.",
            "If the endpoint cannot be reached — for example while running the demo offline — the enquiry is kept in your own browser's local storage so the funnel still completes. Clearing site data removes it.",
          ],
        },
        {
          title: "Messaging",
          copy: [
            "The WhatsApp and email buttons compose a message on your device and hand it to WhatsApp or your mail client. Nothing is sent until you press send in that app, and the conversation is then covered by that provider's privacy terms as well as ours.",
            "Phone numbers reach us only if you call, message, or enter them in the enquiry form.",
          ],
        },
        {
          title: "Cookies and analytics",
          copy: [
            "This demo sets no advertising cookies and runs no third-party trackers. One session-storage flag records that you have already seen the opening transition, so it does not replay on every route change.",
          ],
        },
        {
          title: "Your choices",
          copy: [
            `Ask us to delete an enquiry at any time by writing to ${brand.contact.email} quoting the reference number shown when you submitted it.`,
          ],
        },
      ]}
    />
  );
}
