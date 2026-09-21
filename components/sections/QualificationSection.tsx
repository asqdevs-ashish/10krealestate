import dynamic from "next/dynamic";
import { Eyebrow } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";
import { DisplayLines, Reveal } from "@/components/motion/Reveal";

// The multi-step form is the heaviest interactive component on the page and sits
// near the bottom of a very long document, so it is fetched after the shell is
// interactive. The placeholder reserves the same height, so nothing shifts.
const QualificationForm = dynamic(
  () =>
    import("@/components/features/QualificationForm").then((m) => m.QualificationForm),
  { loading: () => <div className="min-h-[28rem] w-full" /> },
);

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
