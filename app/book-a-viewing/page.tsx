import type { Metadata } from "next";
import { brand } from "@/data/brand";
import { getFlagship } from "@/data";
import { telHref, whatsappUrl, buildWhatsAppMessage } from "@/lib/whatsapp";
import { Action } from "@/components/ui/Action";
import { Eyebrow } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";
import { DisplayLines, Reveal } from "@/components/motion/Reveal";
import { MediaPlate } from "@/components/media/MediaPlate";
import { QualificationForm } from "@/components/features/QualificationForm";

export const metadata: Metadata = {
  title: "Schedule a private viewing",
  description:
    "Tell us what you are looking for and we will shortlist the residences that fit, then arrange a private viewing at the Sector 58 experience centre.",
};

const EXPECT = [
  {
    index: "01",
    title: "Forty minutes, one advisor",
    copy: "No rotating sales team. The same advisor meets you at the experience centre, shows the plan, the materials and the site.",
  },
  {
    index: "02",
    title: "The plans come with you",
    copy: "You leave with the floor plans, the price list for the residences we discussed, and the payment schedule in writing.",
  },
  {
    index: "03",
    title: "No pressure on the day",
    copy: "Nothing is signed at the viewing. Inventory can be held for eight weeks after you have decided.",
  },
];

export default function BookAViewingPage() {
  const project = getFlagship();

  return (
    <>
      <section data-tone="light" className="relative bg-paper pt-32 pb-16 md:pt-44 md:pb-20">
        <div className="mx-auto w-full max-w-[110rem] px-6 md:px-10">
        {/* The intro sits above the form until there is genuinely room for two
            columns — a squeezed form is worse than a stacked one. */}
        <div className="grid gap-14 2xl:grid-cols-12 2xl:gap-16">
          <div className="2xl:col-span-5">
              <Eyebrow index="Viewing">Private viewing</Eyebrow>
              <DisplayLines
                as="h1"
                animateOnMount
                lines={["Schedule a", "private viewing."]}
                className="u-display mt-8 text-[clamp(2.2rem,5.6vw,4.25rem)] text-text"
              />
              <Reveal delay={0.12} className="mt-8 flex flex-col gap-6">
                <p className="max-w-[46ch] text-sm leading-relaxed text-dim md:text-base">
                  Six short questions, then a viewing slot. We only ask for your details after we
                  know which residence suits you — and we never pass them on.
                </p>

                <div className="flex flex-wrap gap-6">
                  <a
                    href={telHref(brand.contact.phoneHref)}
                    className="u-label text-text/70 transition-colors duration-500 hover:text-accent-2"
                  >
                    Call {brand.contact.phone}
                  </a>
                  <a
                    href={whatsappUrl(buildWhatsAppMessage({ intent: "viewing", projectName: project.name }))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="u-label text-text/70 transition-colors duration-500 hover:text-accent-2"
                  >
                    WhatsApp instead
                  </a>
                </div>
              </Reveal>

              <Reveal delay={0.18} className="mt-12">
                <MediaPlate
                  media={{
                    scene: "arrival",
                    tone: "night",
                    index: "01",
                    caption: "Experience centre · Sector 58",
                    alt: "The arrival court at the VAULT experience centre",
                  }}
                  className="aspect-[4/3] w-full"
                  caption
                  index
                />
              </Reveal>

              <Reveal delay={0.24} className="mt-10 flex flex-col gap-6">
                {EXPECT.map((item) => (
                  <div key={item.index} className="grid gap-3 border-t border-hair pt-6 md:grid-cols-[3rem_1fr]">
                    <span className="u-label text-accent/80">{item.index}</span>
                    <div className="flex flex-col gap-2">
                      <h2 className="text-base text-text">{item.title}</h2>
                      <p className="max-w-[46ch] text-sm leading-relaxed text-dim">{item.copy}</p>
                    </div>
                  </div>
                ))}
              </Reveal>

              <Reveal delay={0.3} className="mt-10">
                <dl className="grid gap-6 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <dt className="u-label text-faint">Experience centre</dt>
                    <dd className="text-sm leading-relaxed text-text/80">
                      {brand.contact.siteOffice}
                    </dd>
                  </div>
                  <div className="flex flex-col gap-2">
                    <dt className="u-label text-faint">Hours</dt>
                    <dd className="text-sm leading-relaxed text-text/80">
                      {brand.contact.hours}
                    </dd>
                  </div>
                </dl>
              </Reveal>
            </div>

            <div className="2xl:col-span-7">
              <div className="border border-hair bg-paper p-6 text-text md:p-10">
                <QualificationForm variant="page" tone="light" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section tone="dark" className="border-t border-hair">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h2 className="u-display max-w-[24ch] text-[clamp(1.6rem,3.4vw,2.5rem)] text-text">
            Rather see the numbers first?
          </h2>
          <div className="flex flex-wrap gap-4">
            <Action href="/availability" variant="quartz" arrow>
              View availability
            </Action>
            <Action href="/#investment" variant="text" arrow>
              Open the investment calculator
            </Action>
          </div>
        </div>
      </Section>
    </>
  );
}
