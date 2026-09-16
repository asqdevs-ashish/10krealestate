import type { AmenityCluster, GalleryItem, NearbyPlace, Testimonial } from "./types";
import { media } from "./media";
import { pad2 } from "@/lib/format";

/**
 * Shared content libraries.
 *
 * Amenity clusters, gallery plates, nearby places and testimonials live here;
 * each project selects the ones that belong to it (see data/projects.ts) and
 * the selectors below renumber the editorial indices so a project's page always
 * reads 01, 02, 03 — whatever subset it uses.
 */

/* ------------------------------------------------------------------ amenities */

const AMENITY_LIBRARY: Record<string, Omit<AmenityCluster, "index">> = {
  wellness: {
    id: "wellness",
    category: "Wellness",
    statement: "A slower start to the day.",
    copy: "The lower level is given to water, light and quiet. A 24 m pool that catches the morning, a gym you can use before the city wakes, and a spa that stays warm through winter.",
    items: [
      { name: "Infinity Pool", note: "24 m, temperature controlled" },
      { name: "Private Gym", note: "Strength, cardio, movement studio" },
      { name: "Spa & Steam Lounge", note: "Three treatment rooms" },
      { name: "Yoga Deck", note: "East facing, timber lined" },
    ],
    media: {
      scene: "pool-deck",
      tone: "dusk",
      image: media.pool,
      caption: "Pool deck, level 01",
      alt: "Infinity pool deck at dusk with loungers and a landscaped edge",
    },
  },

  social: {
    id: "social",
    category: "Social",
    statement: "Spaces made for people.",
    copy: "One clubhouse, deliberately under-scaled. Long tables, a residents' bar, and rooms that can be booked for eight or eighty — never a lobby nobody sits in.",
    items: [
      { name: "Residents Lounge", note: "Library bar and long table" },
      { name: "Private Dining", note: "Seats twenty, resident chef on call" },
      { name: "Clubhouse & Bar", note: "Level 01, opening to the deck" },
      { name: "Screening Room", note: "Twelve seats, 4K laser" },
    ],
    media: {
      scene: "interior-dining",
      tone: "interior",
      image: media.privateDining,
      caption: "Residents' private dining room",
      alt: "Warm private dining room with a long table and pendant lighting",
    },
  },

  private: {
    id: "private",
    category: "Private",
    statement: "Your own quiet corner of the city.",
    copy: "Most of the site is left alone. Deep terraces, gardens that took three years to plant, and a concierge desk that knows your car and stops asking your name.",
    items: [
      { name: "Private Terraces", note: "Every residence, minimum 8 ft deep" },
      { name: "Landscaped Gardens", note: "Planted courtyards throughout" },
      { name: "Residents Library", note: "Level 02, members only" },
      { name: "Concierge & Valet", note: "24 hour, single point of contact" },
    ],
    media: {
      scene: "garden-terrace",
      tone: "green",
      image: media.courtyard,
      caption: "Planted courtyard, looking north",
      alt: "Landscaped garden courtyard with mature planting and paving",
    },
  },

  outdoor: {
    id: "outdoor",
    category: "Outdoor",
    statement: "Four acres, mostly left to grow.",
    copy: "The masterplan starts with the existing trees and works back from them. Walking loops, a kitchen garden the residents actually plant, and no boundary planting pretending to be a forest.",
    items: [
      { name: "Walking Loop", note: "640 m through the planting" },
      { name: "Kitchen Garden", note: "Resident-run, twelve beds" },
      { name: "Reflecting Court", note: "Water, shaded seating" },
      { name: "Children's Green", note: "Natural play, no equipment" },
    ],
    media: {
      scene: "garden-terrace",
      tone: "green",
      image: media.terrace,
      caption: "The central garden in October",
      alt: "Landscaped garden terrace with mature planting at golden hour",
    },
  },

  work: {
    id: "work",
    category: "Work",
    statement: "Rooms that work on a Tuesday.",
    copy: "Built for residents who take calls from home. Acoustic rooms, a real connection, and light that does not put you to sleep at three in the afternoon.",
    items: [
      { name: "Residents' Workroom", note: "Six acoustic booths" },
      { name: "Meeting Room", note: "Seats ten, bookable hourly" },
      { name: "High-Speed Backbone", note: "Fibre to every residence" },
      { name: "Business Concierge", note: "Print, courier, guest passes" },
    ],
    media: {
      scene: "library",
      tone: "stone",
      image: media.lounge,
      caption: "Residents' workroom, level 02",
      alt: "Quiet residents workroom with timber shelving and natural light",
    },
  },
};

export function amenitiesFor(keys: string[]): AmenityCluster[] {
  return keys.map((key, i) => {
    const cluster = AMENITY_LIBRARY[key];
    if (!cluster) throw new Error(`Unknown amenity cluster: ${key}`);
    return { ...cluster, index: pad2(i + 1) };
  });
}

/* -------------------------------------------------------------------- gallery */

const GALLERY_LIBRARY: Record<string, Omit<GalleryItem, "media"> & { media: GalleryItem["media"] }> = {
  tower: {
    id: "tower",
    media: {
      scene: "tower-dusk",
      tone: "dusk",
      image: media.vaultDusk,
      caption: "The tower at 19:40",
      alt: "Dark stone residential tower at dusk with warm interior light",
    },
    caption: "Two towers, thirty-four residences, one planted podium.",
    meta: "Exterior · North-east",
    span: "full",
  },
  elevation: {
    id: "elevation",
    media: {
      scene: "facade",
      tone: "stone",
      image: media.concrete,
      caption: "Elevation study — 300 mm stone fins",
      alt: "Close view of a concrete and stone fin facade",
    },
    caption: "300 mm stone fins, set at 1.2 m centres.",
    meta: "Detail · Facade",
    span: "tall",
  },
  living: {
    id: "living",
    media: {
      scene: "interior-living",
      tone: "interior",
      image: media.living,
      caption: "Living room, 17:20",
      alt: "Living room interior with a low sofa and a full height window",
    },
    caption: "Living room, double-height above the sixth floor.",
    meta: "Interior · Living",
    span: "std",
  },
  livingLong: {
    id: "livingLong",
    media: {
      scene: "interior-living",
      tone: "interior",
      image: media.livingTwo,
      caption: "The long living volume",
      alt: "Long living room with stone flooring and open shelving",
    },
    caption: "A single room, 26 ft deep, that never feels like a corridor.",
    meta: "Interior · Living",
    span: "wide",
  },
  dining: {
    id: "dining",
    media: {
      scene: "interior-dining",
      tone: "interior",
      image: media.dining,
      caption: "Dining, seats eight",
      alt: "Dining room with a long table and low pendant lighting",
    },
    caption: "Dining for eight, without crowding the kitchen.",
    meta: "Interior · Dining",
    span: "std",
  },
  kitchen: {
    id: "kitchen",
    media: {
      scene: "interior-dining",
      tone: "interior",
      image: media.kitchen,
      caption: "Kitchen with external vent",
      alt: "Kitchen with stone counters and a window over the sink",
    },
    caption: "Every kitchen vents to open air.",
    meta: "Interior · Kitchen",
    span: "std",
  },
  bedroom: {
    id: "bedroom",
    media: {
      scene: "interior-living",
      tone: "interior",
      image: media.bedroom,
      caption: "Master bedroom, morning",
      alt: "Master bedroom with a low bed and morning light",
    },
    caption: "Bedrooms hold the quiet side of the plan.",
    meta: "Interior · Bedroom",
    span: "std",
  },
  bath: {
    id: "bath",
    media: {
      scene: "material-stone",
      tone: "stone",
      image: media.bath,
      caption: "Master bath, honed stone",
      alt: "Bathroom finished in honed stone with a framed window",
    },
    caption: "Stone throughout, including the wet walls.",
    meta: "Interior · Bath",
    span: "std",
  },
  library: {
    id: "library",
    media: {
      scene: "library",
      tone: "interior",
      image: media.library,
      caption: "Residents' library, level 02",
      alt: "Residents library with tall shelving and warm lighting",
    },
    caption: "The library opens only to residents.",
    meta: "Amenity · Library",
    span: "tall",
  },
  lobby: {
    id: "lobby",
    media: {
      scene: "lobby",
      tone: "interior",
      image: media.lobby,
      caption: "Lobby, staffed around the clock",
      alt: "Double-height residential lobby with stone cladding",
    },
    caption: "A lobby that is staffed at 3 a.m.",
    meta: "Interior · Lobby",
    span: "wide",
  },
  arrival: {
    id: "arrival",
    media: {
      scene: "arrival",
      tone: "night",
      image: media.arrival,
      caption: "Arrival court, 21:05",
      alt: "Arrival court with a lit colonnade at night",
    },
    caption: "A single turn off the main road, then quiet.",
    meta: "Exterior · Arrival",
    span: "std",
  },
  courtyard: {
    id: "courtyard",
    media: {
      scene: "garden-terrace",
      tone: "green",
      image: media.courtyard,
      caption: "The planted court",
      alt: "Landscaped courtyard between residential blocks",
    },
    caption: "Existing trees kept, everything else planted around them.",
    meta: "Landscape · Courtyard",
    span: "std",
  },
  garden: {
    id: "garden",
    media: {
      scene: "garden-terrace",
      tone: "green",
      image: media.terrace,
      caption: "Central garden, October",
      alt: "Landscaped garden with mature planting and paved walkway",
    },
    caption: "Planted for how it will look in fifteen years.",
    meta: "Landscape · Garden",
    span: "wide",
  },
  pool: {
    id: "pool",
    media: {
      scene: "pool-deck",
      tone: "dusk",
      image: media.pool,
      caption: "Pool, early morning",
      alt: "Swimming pool with loungers and a landscaped edge",
    },
    caption: "Twenty-four metres, and warm from October.",
    meta: "Amenity · Pool",
    span: "wide",
  },
  poolDeck: {
    id: "poolDeck",
    media: {
      scene: "pool-deck",
      tone: "dusk",
      image: media.poolDeck,
      caption: "Deck, level 01",
      alt: "Pool deck with loungers and planting at dusk",
    },
    caption: "The deck is the quietest place on the site at 7 a.m.",
    meta: "Amenity · Pool deck",
    span: "std",
  },
  gym: {
    id: "gym",
    media: {
      scene: "interior-living",
      tone: "stone",
      image: media.gym,
      caption: "Gym, level 01",
      alt: "Residents gym with strength and cardio equipment",
    },
    caption: "Open from 5 a.m., no booking.",
    meta: "Amenity · Gym",
    span: "std",
  },
  spa: {
    id: "spa",
    media: {
      scene: "material-stone",
      tone: "stone",
      image: media.spa,
      caption: "Spa, treatment room 02",
      alt: "Spa treatment room in stone and timber",
    },
    caption: "Three treatment rooms, warm through winter.",
    meta: "Amenity · Spa",
    span: "std",
  },
  spaLounge: {
    id: "spaLounge",
    media: {
      scene: "material-stone",
      tone: "stone",
      image: media.spaLounge,
      caption: "Steam lounge",
      alt: "Steam lounge finished in stone with soft lighting",
    },
    caption: "Stone, steam and almost no light.",
    meta: "Amenity · Spa",
    span: "std",
  },
  lounge: {
    id: "lounge",
    media: {
      scene: "interior-living",
      tone: "interior",
      image: media.lounge,
      caption: "Residents lounge",
      alt: "Residents lounge with deep seating and warm lighting",
    },
    caption: "Bookable for eight, or open to everyone by default.",
    meta: "Amenity · Lounge",
    span: "wide",
  },
  clubhouse: {
    id: "clubhouse",
    media: {
      scene: "lobby",
      tone: "night",
      image: media.clubhouse,
      caption: "Clubhouse bar",
      alt: "Clubhouse bar with dark timber and low lighting",
    },
    caption: "One bar, staffed when residents are in.",
    meta: "Amenity · Clubhouse",
    span: "std",
  },
  privateDining: {
    id: "privateDining",
    media: {
      scene: "interior-dining",
      tone: "interior",
      image: media.privateDining,
      caption: "Private dining, seats twenty",
      alt: "Private dining room with a long table under pendant lighting",
    },
    caption: "Resident chef on call, two days' notice.",
    meta: "Amenity · Dining",
    span: "std",
  },
  rooftop: {
    id: "rooftop",
    media: {
      scene: "night-skyline",
      tone: "night",
      image: media.rooftop,
      caption: "Roof terrace, 20:15",
      alt: "Roof terrace with seating and a city view at dusk",
    },
    caption: "Reserved for residents and their guests.",
    meta: "Exterior · Rooftop",
    span: "full",
  },
  aerial: {
    id: "aerial",
    media: {
      scene: "aerial",
      tone: "dusk",
      image: media.aerial,
      caption: "Site plan, looking north",
      alt: "Aerial view of the development and surrounding landscape",
    },
    caption: "One podium, two towers, and the landscape between them.",
    meta: "Aerial · Site",
    span: "full",
  },
  night: {
    id: "night",
    media: {
      scene: "night-skyline",
      tone: "night",
      image: media.nightSkyline,
      caption: "Skyline from the terrace",
      alt: "Night view of the city skyline from a residential terrace",
    },
    caption: "Close enough to the city to use it, far enough to sleep.",
    meta: "Exterior · Night",
    span: "wide",
  },
  dusk: {
    id: "dusk",
    media: {
      scene: "tower-dusk",
      tone: "dusk",
      image: media.duskExterior,
      caption: "Golden hour, west elevation",
      alt: "Residential building in warm golden hour light",
    },
    caption: "The west elevation takes the last of the light.",
    meta: "Exterior · Dusk",
    span: "std",
  },
  stone: {
    id: "stone",
    media: {
      scene: "material-stone",
      tone: "stone",
      image: media.stone,
      caption: "Material study — limestone, honed",
      alt: "Honed limestone surface detail",
    },
    caption: "Honed limestone, 20 mm joint shadow.",
    meta: "Material · Stone",
    span: "std",
  },
  wood: {
    id: "wood",
    media: {
      scene: "material-stone",
      tone: "interior",
      image: media.wood,
      caption: "Material study — oak, brushed",
      alt: "Brushed oak joinery detail",
    },
    caption: "Oak joinery, brushed rather than lacquered.",
    meta: "Material · Timber",
    span: "std",
  },
  noir: {
    id: "noir",
    media: {
      scene: "facade",
      tone: "night",
      image: media.noirFacade,
      caption: "Garden elevation",
      alt: "Dark stone residential facade with planting",
    },
    caption: "Dark stone, and very little of it.",
    meta: "Exterior · Facade",
    span: "full",
  },
  arc: {
    id: "arc",
    media: {
      scene: "night-skyline",
      tone: "night",
      image: media.arcTower,
      caption: "The tower",
      alt: "Modern residential tower against an evening sky",
    },
    caption: "One tower, sixteen levels, a staffed lobby.",
    meta: "Exterior · Tower",
    span: "full",
  },
  verde: {
    id: "verde",
    media: {
      scene: "garden-terrace",
      tone: "green",
      image: media.verdeGarden,
      caption: "The garden front",
      alt: "Low residential building fronting a garden",
    },
    caption: "Low enough that you can hear the garden from the lobby.",
    meta: "Exterior · Garden",
    span: "full",
  },
  edition: {
    id: "edition",
    media: {
      scene: "arrival",
      tone: "dusk",
      image: media.editionHero,
      caption: "The approach",
      alt: "Approach to a low modern residential building at golden hour",
    },
    caption: "Twelve homes, one per floor.",
    meta: "Exterior · Approach",
    span: "full",
  },
  alto: {
    id: "alto",
    media: {
      scene: "night-skyline",
      tone: "night",
      image: media.altoSky,
      caption: "From the twenty-eighth floor",
      alt: "City view at dusk from a high residential floor",
    },
    caption: "High enough that the city reads as a plan.",
    meta: "Exterior · View",
    span: "full",
  },
};

export function galleryFor(keys: string[]): GalleryItem[] {
  return keys.map((key, i) => {
    const item = GALLERY_LIBRARY[key];
    if (!item) throw new Error(`Unknown gallery item: ${key}`);
    return {
      ...item,
      media: { ...item.media, index: pad2(i + 1) },
    };
  });
}

/* --------------------------------------------------------------------- nearby */

const PLACE_LIBRARY: Record<string, NearbyPlace> = {
  golf58: {
    id: "golf58",
    name: "Golf Course, Sector 58",
    category: "Leisure",
    minutes: 5,
    km: 2.1,
    x: 735,
    y: 205,
    route: "M500 400 C 570 360 650 280 735 205",
  },
  metro54: {
    id: "metro54",
    name: "Rapid Metro, Sector 54",
    category: "Connectivity",
    minutes: 8,
    km: 3.4,
    x: 310,
    y: 175,
    route: "M500 400 C 440 350 370 250 310 175",
  },
  school: {
    id: "school",
    name: "International School, Sector 57",
    category: "Education",
    minutes: 10,
    km: 4.2,
    x: 185,
    y: 470,
    route: "M500 400 C 420 420 270 440 185 470",
  },
  cyberhub: {
    id: "cyberhub",
    name: "Cyber Hub, DLF Phase 2",
    category: "Business",
    minutes: 12,
    km: 6.8,
    x: 790,
    y: 480,
    route: "M500 400 C 610 420 700 450 790 480",
  },
  hospital: {
    id: "hospital",
    name: "Medanta, Sector 38",
    category: "Healthcare",
    minutes: 14,
    km: 7.6,
    x: 640,
    y: 640,
    route: "M500 400 C 540 480 600 560 640 640",
  },
  airport: {
    id: "airport",
    name: "IGI Airport, Terminal 3",
    category: "Connectivity",
    minutes: 18,
    km: 14.0,
    x: 95,
    y: 585,
    route: "M500 400 C 400 430 200 520 95 585",
  },
  retail: {
    id: "retail",
    name: "Shopping district, Sector 29",
    category: "Retail",
    minutes: 9,
    km: 5.1,
    x: 855,
    y: 300,
    route: "M500 400 C 620 370 750 330 855 300",
  },
  expressway: {
    id: "expressway",
    name: "Golf Course Extension Road",
    category: "Connectivity",
    minutes: 3,
    km: 1.2,
    x: 620,
    y: 165,
    route: "M500 400 C 545 340 585 240 620 165",
  },
  huda: {
    id: "huda",
    name: "HUDA City Centre Metro",
    category: "Connectivity",
    minutes: 11,
    km: 6.2,
    x: 405,
    y: 122,
    route: "M500 400 C 470 320 440 210 405 122",
  },
  aravali: {
    id: "aravali",
    name: "Aravalli Biodiversity Park",
    category: "Leisure",
    minutes: 13,
    km: 7.1,
    x: 245,
    y: 300,
    route: "M500 400 C 410 370 320 330 245 300",
  },
  dining: {
    id: "dining",
    name: "Sector 29 dining district",
    category: "Dining",
    minutes: 10,
    km: 4.6,
    x: 700,
    y: 560,
    route: "M500 400 C 570 450 640 510 700 560",
  },
  hotel: {
    id: "hotel",
    name: "Trident, Udyog Vihar",
    category: "Hospitality",
    minutes: 16,
    km: 9.3,
    x: 880,
    y: 585,
    route: "M500 400 C 640 460 790 530 880 585",
  },
  fortis: {
    id: "fortis",
    name: "Fortis Memorial, Sector 44",
    category: "Healthcare",
    minutes: 12,
    km: 6.4,
    x: 455,
    y: 610,
    route: "M500 400 C 480 480 470 550 455 610",
  },
  park: {
    id: "park",
    name: "Leisure Valley Park",
    category: "Leisure",
    minutes: 12,
    km: 6.5,
    x: 330,
    y: 530,
    route: "M500 400 C 440 440 380 490 330 530",
  },
  faridabad: {
    id: "faridabad",
    name: "Faridabad Road corridor",
    category: "Connectivity",
    minutes: 7,
    km: 3.9,
    x: 205,
    y: 210,
    route: "M500 400 C 400 330 290 260 205 210",
  },
  business: {
    id: "business",
    name: "Udyog Vihar business district",
    category: "Business",
    minutes: 15,
    km: 8.4,
    x: 810,
    y: 165,
    route: "M500 400 C 620 330 730 230 810 165",
  },
};

export function nearbyFor(keys: string[]): NearbyPlace[] {
  return keys.map((key) => {
    const place = PLACE_LIBRARY[key];
    if (!place) throw new Error(`Unknown nearby place: ${key}`);
    return place;
  });
}

/** Position of the project itself on the stylised map. */
export function siteMarkerFor(projectName: string, locality: string) {
  return { x: 500, y: 400, label: `${projectName} · ${locality}` };
}

/* --------------------------------------------------------------- testimonials */

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "The first time we walked through the residence, the scale and light completely changed our expectations. We had been looking at larger flats that felt smaller.",
    person: "End-use buyer",
    context: "4 BHK · Demo testimonial",
    source: "demo",
  },
  {
    id: "t2",
    quote:
      "They were specific about materials — down to how the stone would weather. That is unusual, and it is the reason we bought here rather than next door.",
    person: "Investor, second purchase",
    context: "3 BHK · Demo testimonial",
    source: "demo",
  },
  {
    id: "t3",
    quote:
      "We measured the balcony against our old living room. It is deeper than the sofa, which sounds trivial until you live in it.",
    person: "Family of four",
    context: "3 BHK · Demo testimonial",
    source: "demo",
  },
  {
    id: "t4",
    quote:
      "We bought at Ridge House and came back for a second residence. The handover did what the drawings said it would, which is not the usual experience.",
    person: "Returning buyer",
    context: "2 BHK · Demo testimonial",
    source: "demo",
  },
];
