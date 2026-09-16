import { brand } from "@/data/brand";
import { getFlagship } from "@/data";
import { media } from "@/data/media";
import { mailtoHref, telHref, whatsappUrl, buildWhatsAppMessage } from "@/lib/whatsapp";
import { MediaPlate } from "@/components/media/MediaPlate";
import { Eyebrow } from "@/components/ui/Label";
import { DisplayLines, Reveal } from "@/components/motion/Reveal";
import { Action } from "@/components/ui/Action";

export function FinalCta() {
  const project = getFlagship();
  const wa = whatsappUrl(buildWhatsAppMessage({ intent: "advisor", projectName: project.name }));

  return (
    <section
      id="contact"
      data-tone="dark"
      className="relative isolate min-h-[92svh] overflow-hidden bg-void text-text"
    >
      <MediaPlate
        media={{
          scene: "night-skyline",
          tone: "night",
          image: media.nightSkyline,
          index: "13",
          caption: `${project.locality}, looking south at 22:10`,
          alt: `Night view over Gurugram from the upper levels of ${project.name}`,
        }}
        decorative
        overlay="strong"
        className="absolute inset-0 h-full w-full"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-ink/55" />

      <div className="relative mx-auto flex min-h-[92svh] w-full max-w-[110rem] flex-col justify-between px-6 py-24 md:px-10 md:py-32">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <Eyebrow index="14">Contact</Eyebrow>
          <p className="u-label max-w-[30ch] text-faint">
            Experience centre open {brand.contact.hours}
          </p>
        </div>

        <div className="grid gap-14 xl:grid-cols-12 lg:items-end">
          <div className="xl:col-span-7">
            <DisplayLines
              as="h2"
              lines={["Your next address", "starts here."]}
              className="u-display text-[clamp(2.4rem,6.4vw,5.75rem)] text-text"
            />
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Action href="/book-a-viewing" variant="primary" size="lg" arrow magnetic>
                Schedule a Private Viewing
              </Action>
              <Action href={wa} external variant="ghost" size="lg">
                WhatsApp a Property Advisor
              </Action>
            </div>
          </div>

          <Reveal delay={0.1} className="xl:col-span-4 xl:col-start-9">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <span className="u-label text-faint">Call</span>
                <a
                  href={telHref(brand.contact.phoneHref)}
                  className="u-num text-lg text-text transition-colors duration-500 hover:text-accent-2"
                >
                  {brand.contact.phone}
                </a>
                <a
                  href={telHref(brand.contact.altPhoneHref)}
                  className="u-num text-sm text-text/60 transition-colors duration-500 hover:text-accent-2"
                >
                  {brand.contact.altPhone}
                </a>
              </div>
              <div className="flex flex-col gap-2">
                <span className="u-label text-faint">Email</span>
                <a
                  href={mailtoHref(
                    `${project.name} — residence enquiry`,
                    `Hello, I would like to know more about ${project.name}.`,
                  )}
                  className="text-sm text-text transition-colors duration-500 hover:text-accent-2"
                >
                  {brand.contact.email}
                </a>
              </div>
              <div className="flex flex-col gap-2">
                <span className="u-label text-faint">Visit</span>
                <p className="max-w-[30ch] text-sm leading-relaxed text-text/75">
                  {brand.contact.siteOffice}
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-hair pt-6 md:flex-row md:items-center md:justify-between">
          <p className="u-label text-faint">
            {project.name} · {project.locality}, {project.city} · {project.statusLabel}
          </p>
          <p className="u-label text-faint">{project.facts[4]?.value ?? project.possession}</p>
        </div>
      </div>
    </section>
  );
}
