import { getFlagship } from "@/data";
import { Eyebrow } from "@/components/ui/Label";
import { Parallax, Reveal } from "@/components/motion/Reveal";
import { MediaPlate } from "@/components/media/MediaPlate";
import { Section } from "@/components/ui/Section";
import type { AmenityCluster } from "@/data/types";

function AmenityList({ items, columns = 2 }: { items: AmenityCluster["items"]; columns?: 1 | 2 }) {
  return (
    <ul className={columns === 2 ? "grid gap-x-10 sm:grid-cols-2" : "flex flex-col"}>
      {items.map((item) => (
        <li key={item.name} className="flex flex-col gap-1.5 border-t border-hair py-4">
          <span className="text-sm text-text/90">{item.name}</span>
          {item.note ? <span className="u-label text-faint">{item.note}</span> : null}
        </li>
      ))}
    </ul>
  );
}

export function LifestyleSection() {
  const project = getFlagship();
  const [wellness, social, priv] = project.amenities;

  return (
    <Section id="lifestyle" tone="light">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow index="06">Life around you</Eyebrow>
          <h2 className="u-display mt-8 max-w-[18ch] text-[clamp(2.3rem,5.6vw,4.75rem)] text-text">
            Amenity, in three registers.
          </h2>
        </div>
        <p className="u-label max-w-[26ch] text-faint">
          Wellness, social and private — kept apart on purpose
        </p>
      </div>

      {/* 01 — image left, text right */}
      <div className="mt-20 grid gap-12 lg:mt-28 xl:grid-cols-12 xl:gap-16">
        <div className="xl:col-span-5">
          <Parallax amount={26} className="aspect-[3/4] w-full">
            <MediaPlate
              media={wellness.media}
              sizes="(max-width: 1279px) 92vw, 38vw"
              className="h-full w-full"
              caption
              index
            />
          </Parallax>
        </div>
        <div className="flex flex-col justify-center xl:col-span-6 xl:col-start-7">
          <span className="font-display text-[clamp(3rem,7vw,6rem)] leading-none text-accent/25">
            {wellness.index}
          </span>
          <Eyebrow className="mt-4">{wellness.category}</Eyebrow>
          <h3 className="u-display mt-6 max-w-[16ch] text-[clamp(1.9rem,4.2vw,3.1rem)] text-text">
            {wellness.statement}
          </h3>
          <p className="mt-6 max-w-[46ch] text-sm leading-relaxed text-dim md:text-base">
            {wellness.copy}
          </p>
          <div className="mt-10">
            <AmenityList items={wellness.items} />
          </div>
        </div>
      </div>

      {/* 02 — text left, wide image right, numeral breaking the column */}
      <div className="relative mt-24 grid gap-12 lg:mt-36 xl:grid-cols-12 lg:gap-10">
        <div className="flex flex-col justify-center xl:col-span-5">
          <span className="font-display text-[clamp(3rem,7vw,6rem)] leading-none text-accent/25">
            {social.index}
          </span>
          <Eyebrow className="mt-4">{social.category}</Eyebrow>
          <h3 className="u-display mt-6 max-w-[16ch] text-[clamp(1.9rem,4.2vw,3.1rem)] text-text">
            {social.statement}
          </h3>
          <p className="mt-6 max-w-[46ch] text-sm leading-relaxed text-dim md:text-base">
            {social.copy}
          </p>
          <div className="mt-10">
            <AmenityList items={social.items} />
          </div>
        </div>
        <div className="xl:col-span-7">
          <Parallax amount={30} className="aspect-[4/3] w-full">
            <MediaPlate
              media={social.media}
              sizes="(max-width: 1279px) 92vw, 55vw"
              className="h-full w-full"
              caption
              index
            />
          </Parallax>
        </div>
      </div>

      {/* 03 — full-bleed image, text beneath in two registers */}
      <div className="mt-24 lg:mt-36">
        <Parallax amount={34}>
          <MediaPlate
            media={priv.media}
            sizes="(max-width: 767px) 92vw, 94vw"
            className="aspect-[16/9] w-full md:aspect-[21/9]"
            overlay="strong"
            caption
            index
          >
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-12">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="flex items-start gap-6">
                  <span className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none text-accent/70">
                    {priv.index}
                  </span>
                  <div className="flex flex-col gap-3">
                    <Eyebrow>{priv.category}</Eyebrow>
                    <h3 className="u-display max-w-[18ch] text-[clamp(1.7rem,3.6vw,2.7rem)] text-text">
                      {priv.statement}
                    </h3>
                  </div>
                </div>
                <p className="max-w-[34ch] text-sm leading-relaxed text-text/70">{priv.copy}</p>
              </div>
            </div>
          </MediaPlate>
        </Parallax>
        <Reveal className="mt-10">
          <AmenityList items={priv.items} columns={2} />
        </Reveal>
      </div>
    </Section>
  );
}
