import { brand } from "@/data/brand";
import { buildWhatsAppMessage, whatsappUrl } from "@/lib/whatsapp";
import { Action } from "./Action";
import { Eyebrow } from "./Label";
import { Reveal } from "@/components/motion/Reveal";

export function CtaBand({
  eyebrow = "Next step",
  title,
  copy,
  context,
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
  context?: string;
}) {
  return (
    <section data-tone="dark" className="relative border-t border-hair bg-ink">
      <div className="mx-auto w-full max-w-[110rem] px-6 py-20 md:px-10 md:py-28">
        <Reveal className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-6">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 className="u-display max-w-[24ch] text-[clamp(1.8rem,4.2vw,3.25rem)] text-text">
              {title}
            </h2>
            {copy ? <p className="max-w-[46ch] text-sm leading-relaxed text-dim">{copy}</p> : null}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Action href="/book-a-viewing" variant="primary" size="lg" arrow magnetic>
              Schedule a Private Viewing
            </Action>
            <Action
              href={whatsappUrl(buildWhatsAppMessage({ intent: "advisor", projectName: context }))}
              external
              variant="ghost"
              size="lg"
            >
              {brand.contact.whatsapp ? "Speak on WhatsApp" : "Chat"}
            </Action>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
