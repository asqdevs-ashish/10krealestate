import type { Metadata } from "next";
import { brand } from "@/data/brand";
import { LegalPage } from "@/components/ui/LegalPage";

export const metadata: Metadata = {
  title: "Terms",
  description: `Terms of use, illustrative content and pricing disclaimers for the ${brand.name} demonstration site.`,
};

export default function TermsPage() {
  return (
    <LegalPage
      updated="Updated 14.09.2026"
      eyebrow="Terms"
      lines={["Illustrative", "in every respect."]}
      intro="The projects, prices, floor plans and inventory on this site are demo content built for a pitch. Read this before treating any number here as an offer."
      sections={[
        {
          title: "This is not an offer",
          copy: [
            "Nothing on this site constitutes an offer, invitation to offer, or contract. Prices, areas, configurations, possession dates and availability are illustrative and can change without notice.",
            "Areas stated as super built-up are indicative. Carpet areas shown on the floor plans are derived from the drawing geometry and are rounded to the nearest square foot.",
          ],
        },
        {
          title: "Project names and inventory",
          copy: [
            "VAULT, NOIR, ARC, VERDE, THE EDITION and ALTO are demonstration projects created to show how the portfolio, project pages and inventory desk behave when connected to real data.",
            "The availability desk is generated from a demo unit sheet. Availability, reservation status and prices would come from the developer's CRM on a production launch.",
          ],
        },
        {
          title: "Imagery and drawings",
          copy: [
            "Photography is licensed stock, used to stand in for a real project shoot. Drawings, massing and the interactive architectural sequence are illustrative and not construction documents.",
          ],
        },
        {
          title: "Regulatory",
          copy: [
            "Any RERA registration number shown on a project page is a placeholder. On launch, each project's registration number, promoter details and disclosure documents must be published as required by the Real Estate (Regulation and Development) Act, 2016.",
          ],
        },
      ]}
    />
  );
}
