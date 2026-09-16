"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { getFlagship } from "@/data";
import type { Project } from "@/data/types";
import { cn, pad2 } from "@/lib/format";
import { buildWhatsAppMessage, whatsappUrl } from "@/lib/whatsapp";
import { Eyebrow } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";
import { DisplayLines, EASE_LUXE, Reveal } from "@/components/motion/Reveal";
import { Action } from "@/components/ui/Action";

/**
 * Project questions.
 *
 * A single-open accordion over `project.faqs` — the derived facts first, then
 * the developer's own answers. Panels unmount when closed, so collapsed copy is
 * never in the accessibility tree, and the summary line is a real button with
 * `aria-expanded` / `aria-controls` rather than a div with a click handler.
 */
export function FaqSection({
  project = getFlagship(),
  eyebrowIndex = "12",
}: {
  project?: Project;
  eyebrowIndex?: string;
}) {
  const [open, setOpen] = useState(0);
  const reduce = useReducedMotion();
  const faqs = project.faqs;

  if (!faqs.length) return null;

  const wa = whatsappUrl(buildWhatsAppMessage({ intent: "advisor", projectName: project.name }));

  return (
    <Section id="faq" tone="sand">
      <div className="grid gap-14 xl:grid-cols-12 xl:gap-16">
        <div className="xl:col-span-4">
          <Eyebrow index={eyebrowIndex}>Questions</Eyebrow>
          <DisplayLines
            as="h2"
            lines={["Asked, and", "answered plainly."]}
            className="u-display mt-8 text-[clamp(2rem,4.6vw,3.5rem)] text-text"
          />
          <Reveal delay={0.08} className="mt-10 flex flex-col gap-8">
            <p className="max-w-[38ch] text-sm leading-relaxed text-dim md:text-base">
              What the sales desk is asked most, answered without the brochure. Anything else, ask
              directly — you will reach a person rather than a form.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <Action href={wa} external variant="ghost">
                Speak on WhatsApp
              </Action>
              <Action href="/book-a-viewing" variant="text" arrow>
                Schedule a private viewing
              </Action>
            </div>
          </Reveal>
        </div>

        <div className="xl:col-span-7 xl:col-start-6">
          <ul className="flex flex-col">
            {faqs.map((faq, i) => {
              const isOpen = open === i;
              const buttonId = `faq-${project.slug}-${faq.id}`;
              const panelId = `faq-panel-${project.slug}-${faq.id}`;

              const body = (
                <div className="grid grid-cols-[2.5rem_1fr] gap-4 pb-7">
                  <span aria-hidden />
                  <p className="max-w-[56ch] text-sm leading-relaxed text-dim md:text-base">
                    {faq.answer}
                  </p>
                </div>
              );

              return (
                <li key={faq.id} className="border-t border-hair last:border-b">
                  <h3>
                    <button
                      type="button"
                      id={buttonId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      className="group grid w-full grid-cols-[2.5rem_1fr_1.25rem] items-start gap-4 py-6 text-left focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-accent"
                    >
                      <span className="u-label pt-1 text-accent/70">{pad2(i + 1)}</span>
                      <span className="u-display max-w-[34ch] text-[clamp(1.05rem,1.6vw,1.4rem)] leading-snug text-text/85 transition-colors duration-500 group-hover:text-text">
                        {faq.question}
                      </span>
                      <span aria-hidden className="relative mt-2 h-3 w-3 justify-self-end">
                        <span className="absolute top-1/2 left-0 h-px w-3 -translate-y-1/2 bg-text/55 transition-colors duration-500 group-hover:bg-accent" />
                        <span
                          className={cn(
                            "absolute top-1/2 left-0 h-px w-3 -translate-y-1/2 bg-text/55 transition-[transform,background-color] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-accent",
                            isOpen ? "rotate-0" : "rotate-90",
                          )}
                        />
                      </span>
                    </button>
                  </h3>

                  {reduce ? (
                    isOpen ? (
                      <div id={panelId} role="region" aria-labelledby={buttonId}>
                        {body}
                      </div>
                    ) : null
                  ) : (
                    <AnimatePresence initial={false}>
                      {isOpen ? (
                        <motion.div
                          key="panel"
                          id={panelId}
                          role="region"
                          aria-labelledby={buttonId}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.6, ease: EASE_LUXE }}
                          className="overflow-hidden"
                        >
                          {body}
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Section>
  );
}
