import { Eyebrow } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";
import { DisplayLines, Reveal } from "@/components/motion/Reveal";
import { QualificationForm } from "@/components/features/QualificationForm";

export function QualificationSection() {
  return (
    <Section id="enquire" tone="light">
      <div className="grid gap-10 xl:grid-cols-12 xl:gap-16">
        <div className="xl:col-span-6">
          <Eyebrow index="12" tone="light">
            Private enquiry
          </Eyebrow>
          <DisplayLines
            as="h2"
            lines={["Let's find the", "right residence", "for you."]}
            className="u-display mt-8 text-[clamp(2.1rem,5.2vw,4.25rem)] text-text"
          />
        </div>
        <Reveal delay={0.1} className="flex flex-col justify-end gap-6 xl:col-span-5 xl:col-start-8">
          <p className="max-w-[44ch] text-sm leading-relaxed text-dim md:text-base">
            A few short questions, and we will shortlist the residences that actually fit — then you
            can take it straight to WhatsApp or book a private viewing.
          </p>
          <p className="u-label text-dim">
            Demo funnel · data stays on this device and the demo API
          </p>
        </Reveal>
      </div>

      <div className="mt-16 lg:mt-24">
        <QualificationForm />
      </div>
    </Section>
  );
}
