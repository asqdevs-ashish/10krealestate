import { getFlagship } from "@/data";
import { Eyebrow } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";

export function TestimonialSection() {
  const [lead, ...rest] = getFlagship().testimonials;
  if (!lead) return null;

  return (
    <Section id="residents" tone="light">
      <div className="flex flex-col gap-6 md:flex-row md:items-baseline md:justify-between">
        <Eyebrow index="10">Residents</Eyebrow>
        <p className="u-label max-w-[34ch] text-faint">
          Buyer quotes are illustrative until verified copies are supplied
        </p>
      </div>

      <div className="mt-14 grid gap-16 lg:mt-20 xl:grid-cols-12 xl:gap-16">
        <Reveal className="xl:col-span-7">
          <blockquote className="flex flex-col gap-8">
            <p className="u-display max-w-[26ch] text-[clamp(1.6rem,3.6vw,2.85rem)] text-text">
              “{lead.quote}”
            </p>
            <footer className="flex flex-col gap-2 border-t border-hair pt-6">
              <span className="u-label text-text/70">{lead.person}</span>
              <span className="u-label text-faint">{lead.context}</span>
            </footer>
          </blockquote>
        </Reveal>

        <div className="flex flex-col gap-12 xl:col-span-4 xl:col-start-9">
          {rest.map((item, i) => (
            <Reveal key={item.id} delay={0.08 * (i + 1)}>
              <blockquote className="flex flex-col gap-6">
                <p className="max-w-[40ch] text-sm leading-relaxed text-text/80 md:text-base">
                  “{item.quote}”
                </p>
                <footer className="flex flex-col gap-2 border-t border-hair pt-5">
                  <span className="u-label text-text/70">{item.person}</span>
                  <span className="u-label text-faint">{item.context}</span>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
