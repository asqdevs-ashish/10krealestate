import { getFlagship } from "@/data";
import { Eyebrow } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";
import { DisplayLines, Reveal } from "@/components/motion/Reveal";
import { Action } from "@/components/ui/Action";
import { AvailabilityTable } from "@/components/features/AvailabilityTable";

export function AvailabilitySection() {
  const project = getFlagship();

  return (
    <Section id="availability" tone="sand">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Eyebrow index="08">Availability</Eyebrow>
          <DisplayLines
            as="h2"
            lines={["Choose your", "residence."]}
            className="u-display mt-8 text-[clamp(2.3rem,5.6vw,4.75rem)] text-text"
          />
        </div>
        <Reveal delay={0.1} className="flex max-w-[34ch] flex-col gap-6">
          <p className="text-sm leading-relaxed text-dim">
            Live inventory across both towers and the four penthouses. Select a residence to see its
            plan, aspect and current status.
          </p>
          <Action href="/availability" variant="quartz" arrow className="self-start">
            View available residences
          </Action>
        </Reveal>
      </div>

      <div className="mt-14">
        <AvailabilityTable units={project.units} limit={7} />
      </div>
    </Section>
  );
}
