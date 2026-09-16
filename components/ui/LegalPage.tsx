import { brand } from "@/data/brand";
import { Eyebrow } from "./Label";
import { DisplayLines, Reveal } from "@/components/motion/Reveal";

/**
 * Shared shell for the legal pages. Deliberately quiet: same typographic
 * system as the rest of the site, no imagery, and short enough to actually be
 * read.
 */
export function LegalPage({
  eyebrow,
  lines,
  updated,
  intro,
  sections,
}: {
  eyebrow: string;
  lines: string[];
  updated: string;
  intro: string;
  sections: { title: string; copy: string[] }[];
}) {
  return (
    <section data-tone="light" className="bg-paper pt-32 pb-24 md:pt-44 md:pb-32">
      <div className="mx-auto w-full max-w-[110rem] px-6 md:px-10">
        <div className="grid gap-14 xl:grid-cols-12 xl:gap-16">
          <div className="xl:col-span-5">
            <Eyebrow index={updated}>{eyebrow}</Eyebrow>
            <DisplayLines
              as="h1"
              animateOnMount
              lines={lines}
              className="u-display mt-8 text-[clamp(2.2rem,5.2vw,4rem)] text-text"
            />
            <Reveal delay={0.12}>
              <p className="mt-8 max-w-[46ch] text-sm leading-relaxed text-dim md:text-base">
                {intro}
              </p>
              <p className="u-label mt-8 text-faint">
                {brand.name} · {brand.contact.siteOffice}
              </p>
            </Reveal>
          </div>

          <div className="xl:col-span-6 xl:col-start-7">
            <dl className="flex flex-col">
              {sections.map((section, i) => (
                <Reveal
                  key={section.title}
                  delay={i * 0.05}
                  className="flex flex-col gap-4 border-t border-hair py-8"
                >
                  <dt className="text-base text-text md:text-lg">{section.title}</dt>
                  {section.copy.map((paragraph) => (
                    <dd
                      key={paragraph}
                      className="max-w-[62ch] text-sm leading-relaxed text-dim"
                    >
                      {paragraph}
                    </dd>
                  ))}
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
