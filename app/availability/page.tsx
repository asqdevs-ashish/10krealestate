import type { Metadata } from "next";
import { getFlagship, listProjects, portfolioSummary } from "@/data";
import { media } from "@/data/media";
import { pad2 } from "@/lib/format";
import { Eyebrow } from "@/components/ui/Label";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHero } from "@/components/ui/PageHero";
import { Action } from "@/components/ui/Action";
import { Reveal } from "@/components/motion/Reveal";
import { AvailabilityDesk } from "@/components/features/AvailabilityDesk";

export const metadata: Metadata = {
  title: "Availability",
  description:
    "Live inventory across six A Square Devs projects in Gurugram — residence numbers, configuration, floor, area, price and status, with filters by price and floor.",
};

const HOLD_STEPS = [
  {
    index: "01",
    title: "Expression of interest",
    copy: "Tell us the residence and configuration. We confirm current price, charges and payment schedule in writing.",
  },
  {
    index: "02",
    title: "Reservation",
    copy: "A booking amount holds the residence for up to eight weeks while the agreement is prepared. It is refundable until allotment.",
  },
  {
    index: "03",
    title: "Allotment",
    copy: "Allotment letter, agreement to sell and construction-linked payment plan. Registration follows on completion.",
  },
];

export default function AvailabilityPage() {
  const project = getFlagship();
  const summary = portfolioSummary();
  const launched = listProjects().filter((item) => item.units.length > 0).length;

  return (
    <>
      <PageHero
        index="Availability"
        eyebrow="Live inventory"
        lines={["What's left,", "and what's on hold."]}
        copy="Inventory moves weekly. Prices shown are the current price list excluding taxes, parking, and statutory charges. Filter by configuration, status, price or floor, then select any residence to see its plan, aspect and status."
        meta={[
          { label: "Available", value: `${pad2(summary.available)} residences` },
          { label: "Projects", value: `${launched} now selling` },
          { label: "Residences", value: `${summary.residences} in total` },
          { label: "Updated", value: "14 September 2026" },
        ]}
        media={{
          scene: "tower-dusk",
          tone: "dusk",
          image: media.duskExterior,
          index: "01",
          caption: "Both towers · the west elevation at 19:20",
          alt: "The two VAULT towers seen from the west at dusk",
        }}
        actions={
          <Action href="/book-a-viewing" variant="primary" size="lg" arrow magnetic>
            Schedule a Private Viewing
          </Action>
        }
      />

      <section data-tone="light" className="bg-paper pb-24 md:pb-32">
        <div className="mx-auto w-full max-w-[110rem] px-6 md:px-10">
          <AvailabilityDesk />
        </div>
      </section>

      <section data-tone="light" className="border-t border-hair bg-paper-2 py-20 md:py-28">
        <div className="mx-auto w-full max-w-[110rem] px-6 md:px-10">
          <div className="grid gap-12 xl:grid-cols-12 xl:gap-16">
            <div className="xl:col-span-4">
              <Eyebrow>How a residence is held</Eyebrow>
              <h2 className="u-display mt-8 max-w-[18ch] text-[clamp(1.8rem,4vw,2.75rem)] text-text">
                Three steps, no surprises.
              </h2>
              <p className="mt-6 max-w-[40ch] text-sm leading-relaxed text-dim">
                The sales desk works on a written price list. Nothing is agreed verbally, and
                nothing is held without a receipt.
              </p>
            </div>
            <div className="xl:col-span-7 xl:col-start-6">
              <ol className="flex flex-col">
                {HOLD_STEPS.map((step, i) => (
                  <Reveal
                    key={step.index}
                    delay={i * 0.08}
                    className="grid gap-4 border-t border-hair py-8 md:grid-cols-[4rem_1fr_1.4fr]"
                  >
                    <span className="u-label text-accent/80">{step.index}</span>
                    <h3 className="text-base text-text md:text-lg">{step.title}</h3>
                    <p className="max-w-[46ch] text-sm leading-relaxed text-dim">{step.copy}</p>
                  </Reveal>
                ))}
              </ol>
              <p className="u-label mt-8 text-faint">
                Demo inventory · replace with the live CRM feed before launch
              </p>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Reserve a residence, or see it first."
        copy="We hold inventory for eight weeks on a booking amount. If you would rather walk the site before deciding, book a private viewing."
        context={project.name}
      />
    </>
  );
}
