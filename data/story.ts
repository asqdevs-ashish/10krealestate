import type { StoryChapter } from "./types";
import { media } from "./media";
import { pad2 } from "@/lib/format";

/**
 * Property story chapters.
 *
 * The editorial sequence that sits between the facts and the floor plans —
 * architecture, light, materiality, privacy, landscape and so on. Each project
 * selects the chapters that are true of it (see data/projects.ts) and
 * `storyFor()` renumbers them, so a project page always reads 01, 02, 03.
 *
 * Same shape a CMS collection would have: one record per chapter, a key list
 * per project.
 */

const CHAPTER_LIBRARY: Record<string, Omit<StoryChapter, "index">> = {
  light: {
    id: "light",
    category: "Light",
    statement: "Light enters slowly here.",
    copy: "The living rooms take the north-east face, so the sun arrives across the balcony rather than through the glass. By four in the afternoon the room is still working without a lamp on, and it never gets hot doing it.",
    meta: "North-east aspect · 11° off the site grid",
    media: {
      scene: "interior-living",
      tone: "interior",
      image: media.livingTwo,
      caption: "Living room · morning light",
      alt: "Living room with deep-set glazing holding morning light",
    },
  },

  materiality: {
    id: "materiality",
    category: "Materiality",
    statement: "Stone, and enough of it to weather.",
    copy: "The facade is 300 mm limestone, honed and left unsealed so it takes on the colour of the weather rather than fighting it. Inside, the same palette runs through without a change of mind — one stone, one oak, one metal.",
    meta: "Limestone · Oak · Bronze",
    media: {
      scene: "material-stone",
      tone: "stone",
      image: media.stone,
      caption: "Limestone fin, 300 mm",
      alt: "Close detail of honed limestone cladding with a shadow gap",
    },
  },

  privacy: {
    id: "privacy",
    category: "Privacy",
    statement: "A private side to every plan.",
    copy: "No residence looks into another. Entries are kept out of the living rooms, bedrooms sit at the quiet end of the corridor, and the service route never crosses the front door. The corner units hold two aspects, so there is always somewhere to go.",
    meta: "No shared walls · Separate service entry",
    media: {
      scene: "library",
      tone: "interior",
      image: media.library,
      caption: "Residents' library, level 02",
      alt: "Quiet residents library with tall shelving and warm lighting",
    },
  },

  landscape: {
    id: "landscape",
    category: "Landscape",
    statement: "Most of the ground is given back.",
    copy: "Existing trees were surveyed and kept before anything was drawn. The planting is specified for how it will look in fifteen years rather than at handover, and the paving is kept close to the building so the garden is not cut into paths.",
    meta: "Planted courtyards · Native species",
    media: {
      scene: "garden-terrace",
      tone: "green",
      image: media.courtyard,
      caption: "Planted court, looking north",
      alt: "Planted courtyard between two residential blocks",
    },
  },

  threshold: {
    id: "threshold",
    category: "Arrival",
    statement: "One turn, then quiet.",
    copy: "The entry is a single controlled turn off the road, under a canopy deep enough to get out of the car in the rain. From there the traffic is behind a landscape wall and out of the sound of the lobby.",
    meta: "Single entry · Staffed arrival court",
    media: {
      scene: "arrival",
      tone: "night",
      image: media.arrival,
      caption: "Arrival court, 21:05",
      alt: "Arrival court with a lit colonnade at night",
    },
  },

  proportion: {
    id: "proportion",
    category: "Proportion",
    statement: "Rooms sized to the furniture in them.",
    copy: "The structural grid is set by the rooms rather than the parking below, so a bed fits with a wardrobe beside it and a dining table of eight does not have to be walked around. Ceilings are held at a height that makes a room feel settled rather than tall.",
    meta: "Structural grid · 3.6 m",
    media: {
      scene: "interior-living",
      tone: "interior",
      image: media.living,
      caption: "Living volume, four bedroom",
      alt: "Living volume with full-height glazing and a long sightline",
    },
  },

  water: {
    id: "water",
    category: "Water",
    statement: "A pool that belongs to the garden.",
    copy: "Twenty-four metres, set level with the deck so the water reads as part of the planting rather than a facility. It is heated through the winter and lit low enough that the residents above are not looking down at a floodlight.",
    meta: "24 m · Temperature controlled",
    media: {
      scene: "pool-deck",
      tone: "dusk",
      image: media.poolDeck,
      caption: "Pool deck, level 01",
      alt: "Infinity pool deck at dusk with loungers and a landscaped edge",
    },
  },

  horizon: {
    id: "horizon",
    category: "Horizon",
    statement: "The city, held at a distance.",
    copy: "Above the treeline the terraces open out toward the ridge, and the building turns its back on the corridor. At night the view is the city grid going quiet — which is the reason the upper levels were planned as terraces rather than balconies.",
    meta: "Upper-level terraces · Ridge aspect",
    media: {
      scene: "night-skyline",
      tone: "night",
      image: media.nightSkyline,
      caption: "Upper terrace, looking south at 22:40",
      alt: "Night skyline seen from an upper residential terrace",
    },
  },

  craft: {
    id: "craft",
    category: "Craft",
    statement: "Detail that only shows up close.",
    copy: "Joinery is set with a 6 mm shadow gap instead of a bead, stone joints are aligned to the structural grid rather than the room, and every switch plate was chosen before the walls were plastered — not after.",
    meta: "6 mm shadow gap · Aligned joints",
    media: {
      scene: "material-stone",
      tone: "stone",
      image: media.wood,
      caption: "Oak joinery, shadow gap detail",
      alt: "Oak joinery detail with a fine shadow gap",
    },
  },
};

export function storyFor(keys: string[]): StoryChapter[] {
  return keys.map((key, i) => {
    const chapter = CHAPTER_LIBRARY[key];
    if (!chapter) throw new Error(`Unknown story chapter: ${key}`);
    return { ...chapter, index: pad2(i + 1) };
  });
}
