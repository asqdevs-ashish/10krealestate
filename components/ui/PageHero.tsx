import type { ReactNode } from "react";
import type { MediaRef } from "@/data/types";
import { cn } from "@/lib/format";
import { Eyebrow } from "./Label";
import { DisplayLines, Reveal } from "@/components/motion/Reveal";
import { MediaPlate } from "@/components/media/MediaPlate";

export function PageHero({
  eyebrow,
  index,
  lines,
  copy,
  meta,
  media,
  actions,
  className,
}: {
  eyebrow: string;
  index?: string;
  lines: string[];
  copy?: string;
  meta?: { label: string; value: string }[];
  media?: MediaRef;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header
      data-tone="light"
      className={cn("relative w-full bg-paper pt-32 pb-16 md:pt-44 md:pb-24", className)}
    >
      <div className="mx-auto w-full max-w-[110rem] px-6 md:px-10">
        <div className="grid gap-12 xl:grid-cols-12 xl:gap-16">
          <div className="xl:col-span-7">
            <Eyebrow index={index}>{eyebrow}</Eyebrow>
            <DisplayLines
              as="h1"
              animateOnMount
              lines={lines}
              className="u-display mt-8 text-[clamp(2.3rem,6.4vw,5rem)] text-text"
            />
            {copy ? (
              <Reveal delay={0.15} className="mt-8 max-w-[52ch] text-sm leading-relaxed text-dim md:text-base">
                <p>{copy}</p>
              </Reveal>
            ) : null}
            {actions ? (
              <Reveal delay={0.22} className="mt-10 flex flex-wrap items-center gap-4">
                {actions}
              </Reveal>
            ) : null}
          </div>

          <div className="flex flex-col justify-end gap-10 xl:col-span-4 xl:col-start-9">
            {meta?.length ? (
              <dl className="grid grid-cols-2 gap-x-8 gap-y-6 border-t border-hair pt-6">
                {meta.map((item) => (
                  <div key={item.label} className="flex flex-col gap-2">
                    <dt className="u-label text-faint">{item.label}</dt>
                    <dd className="u-num text-[0.8125rem] text-text/90">{item.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </div>
      </div>

      {media ? (
        <div className="mx-auto mt-14 w-full max-w-[110rem] px-6 md:mt-20 md:px-10">
          <MediaPlate
            media={media}
            className="aspect-[16/9] w-full md:aspect-[21/9]"
            caption
            index
            overlay="soft"
          />
        </div>
      ) : null}
    </header>
  );
}
