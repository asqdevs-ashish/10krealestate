import type { PlanInput } from "./plans";
import type { Project, Unit } from "./types";
import { amenitiesFor, galleryFor, nearbyFor, testimonials } from "./amenities";
import { buildPlans } from "./plans";
import { buildResidences, interior, type ResidenceInput } from "./residences";
import { buildInventory, units as vaultUnits } from "./units";
import { buildFaqs } from "./faqs";
import { storyFor } from "./story";
import { media } from "./media";

/**
 * The portfolio.
 *
 * VAULT is the flagship — it drives the cinematic home page. The other five are
 * full records, not stubs: each has its own architecture, residences, plans,
 * inventory, amenities, gallery and location list, so every project page is a
 * complete property rather than a renamed copy.
 *
 * Swap this module for a CMS and nothing in the UI changes.
 */

type ProjectInput = {
  slug: string;
  name: string;
  subtitle: string;
  locality: string;
  addressLine: string;
  status: Project["status"];
  statusLabel: string;
  possession: string;
  land: string;
  openSpace: string;
  statement: string;
  description: string[];
  architecture: string[];
  facts: Project["facts"];
  metrics: Project["metrics"];
  highlights: string[];
  areaRange: [number, number];
  residences: ResidenceInput[];
  plans: PlanInput[];
  /** Authored unit sheet, or a generated one. */
  units: Unit[];
  hero: Project["hero"];
  gallery: string[];
  amenities: string[];
  nearby: string[];
  testimonialIds: string[];
  /** Keys into the story chapter library — the project's editorial sequence. */
  story: string[];
  /** Keys into the FAQ library; the project-derived questions are added on top. */
  faqKeys: string[];
  isFlagship?: boolean;
};

function makeProject(input: ProjectInput): Project {
  const residences = buildResidences(input.slug, input.residences);
  const project: Project = {
    slug: input.slug,
    name: input.name,
    subtitle: input.subtitle,
    city: "Gurugram",
    locality: input.locality,
    addressLine: input.addressLine,
    status: input.status,
    statusLabel: input.statusLabel,
    possession: input.possession,
    priceFrom: Math.min(...residences.map((r) => r.priceFrom)),
    configurations: residences.map((r) => r.configuration),
    totalResidences: input.units.length,
    land: input.land,
    openSpace: input.openSpace,
    statement: input.statement,
    description: input.description,
    architecture: input.architecture,
    facts: input.facts,
    metrics: input.metrics,
    highlights: input.highlights,
    areaRange: input.areaRange,
    residences,
    units: input.units,
    plans: buildPlans(input.plans),
    hero: input.hero,
    gallery: galleryFor(input.gallery),
    amenities: amenitiesFor(input.amenities),
    nearby: nearbyFor(input.nearby),
    testimonials: input.testimonialIds
      .map((id) => testimonials.find((t) => t.id === id))
      .filter((t): t is (typeof testimonials)[number] => Boolean(t)),
    story: storyFor(input.story),
    // Filled in below — the derived questions read the record it is built from.
    faqs: [],
    isFlagship: Boolean(input.isFlagship),
  };

  return { ...project, faqs: buildFaqs(project, input.faqKeys) };
}

/* ------------------------------------------------------------------ 01 VAULT */

const vault = makeProject({
  slug: "vault",
  name: "VAULT",
  subtitle: "Private Residences",
  locality: "Sector 58",
  addressLine: "Golf Course Road Extension, Sector 58, Gurugram",
  status: "now-selling",
  statusLabel: "Now selling · Phase 1",
  possession: "December 2028",
  land: "3.4 acres",
  openSpace: "1.9 acres planted",
  statement: "A quieter kind of luxury.",
  description: [
    "VAULT is thirty-four residences on a 3.4 acre site off Golf Course Road Extension. Two towers, four penthouses, and a plan that gives most of the ground back to planting.",
    "The architecture is deliberately restrained: stone fins at 1.2 m centres, deep-set balconies, and living rooms oriented to hold the north and east light through the day. Nothing is finished in a material that will not age.",
    "Every residence is planned around how it is actually used — a kitchen that vents to open air, a foyer that keeps the entry out of the living room, and terraces deep enough to sit on in July.",
  ],
  architecture: [
    "The two towers are set on a single podium, rotated eleven degrees off the site grid so the long faces take the north-east light rather than the afternoon sun. That one move does most of the work: cooler living rooms, deeper balconies, and a private side to every plan.",
    "The facade reads as stone because it is stone — 300 mm limestone fins, set at 1.2 m centres, holding a shadow line that sharpens through the day. Behind them, full-height glazing sits 900 mm back, so the building looks heavier than it is and never has to be cleaned from a cradle.",
  ],
  facts: [
    { label: "Configuration", value: "2, 3 and 4 bedroom, plus penthouses" },
    { label: "Residences", value: "34 private residences" },
    { label: "Site", value: "3.4 acres, Sector 58" },
    { label: "Possession", value: "December 2028" },
    { label: "RERA", value: "RC/REP/HARERA/GGM/2026 (demo)" },
    { label: "Structure", value: "RCC frame, external stone cladding" },
  ],
  metrics: [
    { value: "12,500", label: "SQ.FT.", sub: "Clubhouse and amenity floor plate" },
    { value: "34", label: "RESIDENCES", sub: "Across two towers" },
    { value: "04", label: "BEDROOM OPTIONS", sub: "Two, three, four and penthouse" },
    { value: "07", label: "AMENITY SPACES", sub: "Wellness, social and private" },
  ],
  highlights: [
    "34 residences, no two plans repeated",
    "Four penthouses, two per top level",
    "1.9 of 3.4 acres left planted",
  ],
  areaRange: [1240, 3850],
  residences: [
    {
      configuration: "2 BHK",
      areaSuper: 1240,
      priceFrom: 18_500_000,
      copy:
        "Compact, but nothing is taken from the essentials. Two bedrooms either side of a shared living volume, with a balcony that runs the full frontage.",
      detail:
        "Built for a first home in the city or a quiet pied-à-terre — a plan with no wasted circulation and a kitchen that vents to open air.",
      features: [
        "Balcony across the entire frontage",
        "Living and dining read as one volume",
        "Kitchen with external vent and utility core",
        "Stone flooring in every room",
      ],
      media: interior["2 BHK"],
    },
    {
      configuration: "3 BHK",
      areaSuper: 1980,
      priceFrom: 24_500_000,
      copy:
        "The plan most residents choose. Living and dining hold one continuous room, the bedrooms keep their own distance, and the balcony runs the whole north face.",
      detail:
        "Corner units hold two aspects. The foyer keeps the living room clear of the entry, and the third bedroom works as a study without losing its bathroom.",
      features: [
        "Corner or double-aspect living rooms",
        "Foyer with concealed storage",
        "Master suite with walk-in wardrobe",
        "Separate service entry and utility",
      ],
      media: interior["3 BHK"],
    },
    {
      configuration: "4 BHK",
      areaSuper: 2680,
      priceFrom: 32_500_000,
      copy:
        "A longer, quieter plan. Four bedrooms arranged so the master suite sits apart, with a formal dining room that seats eight without crowding the kitchen.",
      detail:
        "On floors 06 and above the living volume goes double height. Select floors are served by a private lift lobby that opens directly into the residence.",
      features: [
        "Private lift lobby on select floors",
        "Double-height living from floor 06",
        "Formal dining for eight",
        "Utility, staff room and store",
      ],
      media: interior["4 BHK"],
    },
    {
      configuration: "Penthouse",
      areaSuper: 3850,
      priceFrom: 59_000_000,
      copy:
        "The top two levels. An 18 ft double-height living volume, a private plunge deck, and terraces that face the ridge in three directions.",
      detail:
        "Two residences per level, four in total. Each holds its own plunge deck, lounge and a library on the upper level.",
      features: [
        "Duplex with private plunge deck",
        "18 ft double-height living volume",
        "Terraces facing the Aravalli ridge",
        "Two reserved parking bays",
      ],
      media: interior.Penthouse,
    },
  ],
  plans: [
    { slug: "vault", configuration: "2 BHK", areaSuper: 1240, level: "Levels 02 – 08 · Tower B", orientation: "North-east" },
    { slug: "vault", configuration: "3 BHK", areaSuper: 1980, level: "Levels 02 – 09 · Tower A", orientation: "North-east" },
    { slug: "vault", configuration: "4 BHK", areaSuper: 2680, level: "Levels 02 – 09 · Tower A", orientation: "North-east" },
    { slug: "vault", configuration: "Penthouse", areaSuper: 3850, level: "Levels 10 – 11 · Duplex", orientation: "North-east" },
  ],
  units: vaultUnits,
  hero: {
    scene: "tower-dusk",
    tone: "dusk",
    image: media.vaultDusk,
    index: "01",
    caption: "VAULT · Sector 58, looking east at 19:40",
    alt: "VAULT towers at dusk, warm light behind the stone facade",
  },
  gallery: ["tower", "elevation", "living", "dining", "stone", "arrival", "aerial", "library", "pool", "night"],
  amenities: ["wellness", "social", "private"],
  nearby: ["golf58", "metro54", "school", "cyberhub", "hospital", "airport", "retail"],
  testimonialIds: ["t1", "t2", "t3", "t4"],
  story: ["light", "materiality", "privacy", "landscape", "craft"],
  faqKeys: ["plans", "payment", "rera", "parking"],
  isFlagship: true,
});

/* ------------------------------------------------------------------- 02 NOIR */

const noir = makeProject({
  slug: "noir",
  name: "NOIR",
  subtitle: "The Residences",
  locality: "Sector 43",
  addressLine: "Golf Course Road, Sector 43, Gurugram",
  status: "now-selling",
  statusLabel: "Now selling · Twelve residences left",
  possession: "June 2029",
  land: "1.8 acres",
  openSpace: "0.9 acres planted",
  statement: "Dark stone, and very little of it.",
  description: [
    "NOIR is twenty-four residences on Golf Course Road, on a plot wide enough for one building and a garden — and nothing else.",
    "The palette is dark stone, bronze and glass, held against a planted court so the building never reads as heavy. Interiors stay quiet: one material per room, run through without a change of mind.",
    "The address does the commuting for you. Cyber Hub is twelve minutes out, and the metro is closer than the parking is.",
  ],
  architecture: [
    "A single tower, twelve levels, set back 22 m from the road so the garden sits between the traffic and the windows. The mass steps in twice on the way up, which gives the upper floors terraces rather than balconies.",
    "Dark basalt cladding, honed and left unsealed so it weathers. Bronze reveals at every opening, and a recessed ground floor that reads as a shadow line from across the road.",
  ],
  facts: [
    { label: "Configuration", value: "3 and 4 bedroom, plus penthouses" },
    { label: "Residences", value: "24 private residences" },
    { label: "Site", value: "1.8 acres, Sector 43" },
    { label: "Possession", value: "June 2029" },
    { label: "Frontage", value: "22 m setback from Golf Course Road" },
    { label: "Structure", value: "RCC frame, basalt and bronze facade" },
  ],
  metrics: [
    { value: "24", label: "RESIDENCES", sub: "Single tower, twelve levels" },
    { value: "12", label: "LEVELS", sub: "Stepped massing above level 07" },
    { value: "9,600", label: "SQ.FT.", sub: "Clubhouse and wellness floor" },
    { value: "24", label: "METRE POOL", sub: "On the garden level, west facing" },
  ],
  highlights: [
    "One building, 22 m off the road",
    "Terraces instead of balconies above level 07",
    "Bronze and basalt, left to weather",
  ],
  areaRange: [2150, 4200],
  residences: [
    {
      configuration: "3 BHK",
      areaSuper: 2150,
      priceFrom: 31_000_000,
      copy:
        "The garden-facing plan. Living opens the full width of the balcony, and the master sits at the quiet end of the corridor.",
      detail:
        "Every three bedroom residence holds two aspects. Kitchens vent externally and the service entry stays separate from the front door.",
      features: [
        "Two aspects in every residence",
        "Garden-facing balcony, 9 ft deep",
        "Bronze-framed glazing throughout",
        "Separate service entry",
      ],
      media: interior["3 BHK"],
    },
    {
      configuration: "4 BHK",
      areaSuper: 3050,
      priceFrom: 44_000_000,
      copy:
        "Four bedrooms arranged around a central living volume, with a dining room that seats ten and a study that can close.",
      detail:
        "Above level 07 the living room gains a 14 ft ceiling and a terrace in place of the balcony. Floor plates hold two residences only.",
      features: [
        "14 ft ceiling above level 07",
        "Terrace in place of balcony",
        "Study with acoustic separation",
        "Two parking bays per residence",
      ],
      media: interior["4 BHK"],
    },
    {
      configuration: "Penthouse",
      areaSuper: 4200,
      priceFrom: 72_000_000,
      copy:
        "The top two levels, with a 40 ft terrace facing the golf course and a private lift lobby that opens into the residence.",
      detail:
        "Four penthouses in total. Each holds an upper-level lounge, a plunge pool and a second terrace on the west face.",
      features: [
        "Private lift lobby",
        "40 ft west terrace",
        "Plunge pool on the upper level",
        "Three parking bays",
      ],
      media: interior.Penthouse,
    },
  ],
  plans: [
    { slug: "noir", configuration: "3 BHK", areaSuper: 2150, level: "Levels 03 – 12 · Tower A", orientation: "West and north", notes: ["Setback from Golf Course Road is 22 m."] },
    { slug: "noir", configuration: "4 BHK", areaSuper: 3050, level: "Levels 08 – 12 · Terrace levels", orientation: "West and north" },
    { slug: "noir", configuration: "Penthouse", areaSuper: 4200, level: "Levels 13 – 14 · Duplex", orientation: "West and north" },
  ],
  units: buildInventory({
    slug: "noir",
    available: 6,
    reserved: 4,
    seed: 11,
    towers: [
      {
        code: "N",
        stacks: [
          { configuration: "3 BHK", area: 2150, base: 31_000_000, from: 3, to: 12, perFloor: 1, facing: "Golf Course Road", aspectPremium: 400_000, floorStep: 110_000, note: "Garden aspect" },
          { configuration: "4 BHK", area: 3050, base: 44_000_000, from: 3, to: 12, perFloor: 1, facing: "Aravalli Ridge", aspectPremium: 250_000, floorStep: 150_000, note: "West terrace above level 07" },
          { configuration: "Penthouse", area: 4200, base: 72_000_000, from: 13, to: 14, perFloor: 2, facing: "Golf Course Road", aspectPremium: 0, floorStep: 0, note: "Private lift lobby" },
        ],
      },
    ],
  }),
  hero: {
    scene: "facade",
    tone: "night",
    image: media.noirFacade,
    index: "01",
    caption: "NOIR · Golf Course Road, 20:10",
    alt: "NOIR's dark stone facade lit against the evening",
  },
  gallery: [
    "noir",
    "lobby",
    "living",
    "bath",
    "lounge",
    "spa",
    "night",
    "stone",
    "dining",
    "elevation",
  ],
  amenities: ["wellness", "social", "private"],
  nearby: ["golf58", "expressway", "cyberhub", "hospital", "retail", "airport"],
  testimonialIds: ["t2", "t4", "t1"],
  story: ["threshold", "materiality", "light", "privacy", "horizon"],
  faqKeys: ["plans", "payment", "finance"],
});

/* -------------------------------------------------------------------- 03 ARC */

const arc = makeProject({
  slug: "arc",
  name: "ARC",
  subtitle: "Urban Residences",
  locality: "Sector 65",
  addressLine: "Golf Course Road, Sector 65, Gurugram",
  status: "under-construction",
  statusLabel: "Under construction · Possession 2029",
  possession: "March 2029",
  land: "1.6 acres",
  openSpace: "Podium landscape, level 03",
  statement: "Built for people who travel for work.",
  description: [
    "ARC is forty-eight residences on Golf Course Road with hotel-grade service: housekeeping on request, a managed rental programme, and a lobby that stays staffed at three in the morning.",
    "Plans are compact and efficient — the audience here is out four nights a week and does not need a formal dining room it will use twice a year.",
    "The podium sits at level 03. Below it, parking and services; above it, a planted deck with the pool and the workroom.",
  ],
  architecture: [
    "One tower, sixteen levels, with a banded facade that reads as horizontal. Every residence holds the same 3.6 m structural grid, which is why the interiors feel larger than their plans.",
    "The lower three levels are clad in stone; above that the building becomes glass and aluminium, so the mass visually lifts off the podium.",
  ],
  facts: [
    { label: "Configuration", value: "2 and 3 bedroom" },
    { label: "Residences", value: "48 serviced residences" },
    { label: "Site", value: "1.6 acres, Sector 65" },
    { label: "Possession", value: "March 2029" },
    { label: "Service", value: "Housekeeping, rental programme, 24 hour desk" },
    { label: "Structure", value: "RCC frame, stone podium, glazed tower" },
  ],
  metrics: [
    { value: "48", label: "RESIDENCES", sub: "Sixteen levels, one tower" },
    { value: "16", label: "LEVELS", sub: "Podium landscape at level 03" },
    { value: "1,180", label: "SQ.FT.", sub: "Starting area, two bedroom" },
    { value: "24", label: "HOUR DESK", sub: "Concierge, housekeeping, valet" },
  ],
  highlights: [
    "Serviced, with a managed rental programme",
    "Podium landscape above the parking",
    "Six minutes to the expressway",
  ],
  areaRange: [1180, 1720],
  residences: [
    {
      configuration: "2 BHK",
      areaSuper: 1180,
      priceFrom: 16_500_000,
      copy:
        "A compact two bedroom with a plan built for one person or two — no corridor, no formal dining room, and a balcony that fits a table.",
      detail:
        "Designed to be rented out without being lived in by a landlord. Finishes are specified for durability: porcelain, engineered stone, powder-coated aluminium.",
      features: [
        "Balcony sized for a table",
        "Kitchen and living open to one another",
        "Built-in wardrobe in both bedrooms",
        "Housekeeping on request",
      ],
      media: interior["2 BHK"],
    },
    {
      configuration: "3 BHK",
      areaSuper: 1720,
      priceFrom: 23_000_000,
      copy:
        "Three bedrooms on the corner, with two aspects and a study alcove off the living room that does not need a door.",
      detail:
        "Corner residences sit on levels 05 and above. The third bedroom is planned so it works as a study for most of the year and a bedroom when family visits.",
      features: [
        "Corner aspect above level 05",
        "Study alcove off the living room",
        "Two bathrooms, both with external vent",
        "Fibre and dedicated workspace power",
      ],
      media: interior["3 BHK"],
    },
  ],
  plans: [
    { slug: "arc", configuration: "2 BHK", areaSuper: 1180, level: "Levels 04 – 16 · Tower A", orientation: "South-west", notes: ["Podium landscape sits at level 03."] },
    { slug: "arc", configuration: "3 BHK", areaSuper: 1720, level: "Levels 05 – 16 · Corner stack", orientation: "South-west and north" },
  ],
  units: buildInventory({
    slug: "arc",
    available: 14,
    reserved: 6,
    seed: 23,
    towers: [
      {
        code: "A",
        stacks: [
          { configuration: "2 BHK", area: 1180, base: 16_500_000, from: 4, to: 16, perFloor: 2, facing: "Podium Garden", aspectPremium: 150_000, floorStep: 55_000, note: "Podium aspect" },
          { configuration: "3 BHK", area: 1720, base: 23_000_000, from: 4, to: 16, perFloor: 1, facing: "Golf Course Road", aspectPremium: 300_000, floorStep: 70_000, note: "Corner aspect" },
          { configuration: "3 BHK", area: 1720, base: 22_400_000, from: 5, to: 13, perFloor: 1, facing: "Central Courtyard", aspectPremium: 0, floorStep: 70_000 },
        ],
      },
    ],
  }),
  hero: {
    scene: "night-skyline",
    tone: "night",
    image: media.arcTower,
    index: "01",
    caption: "ARC · the tower from the podium",
    alt: "ARC tower rising above its podium landscape",
  },
  gallery: [
    "arc",
    "lobby",
    "livingLong",
    "kitchen",
    "gym",
    "clubhouse",
    "dusk",
    "night",
    "aerial",
    "bedroom",
  ],
  amenities: ["social", "work", "wellness"],
  nearby: ["metro54", "expressway", "cyberhub", "airport", "business", "dining"],
  testimonialIds: ["t2", "t3"],
  story: ["threshold", "proportion", "horizon", "privacy", "craft"],
  faqKeys: ["plans", "finance", "rera"],
});

/* ------------------------------------------------------------------ 04 VERDE */

const verde = makeProject({
  slug: "verde",
  name: "VERDE",
  subtitle: "Garden Residences",
  locality: "Sector 79",
  addressLine: "Southern Peripheral Road, Sector 79, New Gurgaon",
  status: "under-construction",
  statusLabel: "Under construction · Possession 2027",
  possession: "December 2027",
  land: "4.2 acres",
  openSpace: "3.1 acres planted",
  statement: "Four acres, and twenty-eight homes.",
  description: [
    "VERDE is twenty-eight residences in four low blocks arranged around a shared garden. Nothing rises above four levels.",
    "The blocks step back as they go up, so every residence keeps a planted edge and looks across the garden rather than into a neighbour's balcony.",
    "The masterplan started with the trees already on the site. Three-quarters of the plot is planting, and the walking loop runs through all of it.",
  ],
  architecture: [
    "Four blocks, stepped massing, four levels maximum. Each upper block is set back 1.8 m from the one below, which plants a terrace on every level and keeps the ground plane almost entirely open.",
    "The material palette is the quietest in the portfolio: lime plaster, timber screens and a lot of planting. The buildings are meant to read as a backdrop to the garden rather than as objects in it.",
  ],
  facts: [
    { label: "Configuration", value: "3 and 4 bedroom" },
    { label: "Residences", value: "28 garden residences" },
    { label: "Site", value: "4.2 acres, Sector 79" },
    { label: "Possession", value: "December 2027" },
    { label: "Density", value: "6.7 residences per acre" },
    { label: "Structure", value: "RCC frame, lime plaster, timber screens" },
  ],
  metrics: [
    { value: "28", label: "RESIDENCES", sub: "Four low blocks" },
    { value: "04", label: "LEVELS MAXIMUM", sub: "Stepped and planted" },
    { value: "3.1", label: "ACRES PLANTED", sub: "Of a 4.2 acre site" },
    { value: "640", label: "METRE LOOP", sub: "Through the planting" },
  ],
  highlights: [
    "Nothing above four levels",
    "3.1 of 4.2 acres planted",
    "Every residence keeps a planted edge",
  ],
  areaRange: [2050, 2950],
  residences: [
    {
      configuration: "3 BHK",
      areaSuper: 2050,
      priceFrom: 26_000_000,
      copy:
        "A ground-floor or first-floor plan with a garden terrace, planned so the living room opens on two sides.",
      detail:
        "Lower residences take the garden directly. Upper residences get a planted terrace formed by the setback of the block above.",
      features: [
        "Garden terrace or planted balcony",
        "Living room open on two sides",
        "Timber screens to every bedroom",
        "Pantry and utility in the service core",
      ],
      media: interior["3 BHK"],
    },
    {
      configuration: "4 BHK",
      areaSuper: 2950,
      priceFrom: 37_000_000,
      copy:
        "Four bedrooms across a single quiet level, with the living volume at the end holding the garden view and a terrace off the kitchen.",
      detail:
        "Four bedroom residences sit only on the top two levels of each block, where the setback is deepest and the outlook is clearest.",
      features: [
        "Single-level plan, no internal stairs",
        "Kitchen terrace for daily use",
        "Two covered parking bays",
        "Study or fourth bedroom",
      ],
      media: interior["4 BHK"],
    },
  ],
  plans: [
    { slug: "verde", configuration: "3 BHK", areaSuper: 2050, level: "Levels 01 – 02 · All four blocks", orientation: "North and east", notes: ["Block massing steps back 1.8 m per level."] },
    { slug: "verde", configuration: "4 BHK", areaSuper: 2950, level: "Levels 03 – 04 · Upper levels only", orientation: "North and east" },
  ],
  units: buildInventory({
    slug: "verde",
    available: 7,
    reserved: 3,
    seed: 31,
    towers: [
      {
        code: "A",
        stacks: [
          { configuration: "3 BHK", area: 2050, base: 26_000_000, from: 1, to: 3, perFloor: 2, facing: "Central Courtyard", aspectPremium: 0, floorStep: 70_000, note: "Garden terrace" },
          { configuration: "4 BHK", area: 2950, base: 37_000_000, from: 4, to: 4, perFloor: 1, facing: "Aravalli Ridge", aspectPremium: 400_000, floorStep: 0, note: "Top level, deepest setback" },
        ],
      },
      {
        code: "B",
        stacks: [
          { configuration: "3 BHK", area: 2050, base: 26_200_000, from: 1, to: 3, perFloor: 2, facing: "Podium Garden", aspectPremium: 100_000, floorStep: 70_000 },
          { configuration: "4 BHK", area: 2950, base: 37_200_000, from: 4, to: 4, perFloor: 1, facing: "Aravalli Ridge", aspectPremium: 400_000, floorStep: 0 },
        ],
      },
      {
        code: "C",
        stacks: [
          { configuration: "3 BHK", area: 2050, base: 26_100_000, from: 1, to: 3, perFloor: 2, facing: "Central Courtyard", aspectPremium: 0, floorStep: 70_000 },
          { configuration: "4 BHK", area: 2950, base: 37_100_000, from: 4, to: 4, perFloor: 1, facing: "Aravalli Ridge", aspectPremium: 400_000, floorStep: 0 },
        ],
      },
      {
        code: "D",
        stacks: [
          { configuration: "3 BHK", area: 2050, base: 26_300_000, from: 1, to: 3, perFloor: 2, facing: "Podium Garden", aspectPremium: 100_000, floorStep: 70_000 },
          { configuration: "4 BHK", area: 2950, base: 37_300_000, from: 4, to: 4, perFloor: 1, facing: "Aravalli Ridge", aspectPremium: 400_000, floorStep: 0 },
        ],
      },
    ],
  }),
  hero: {
    scene: "garden-terrace",
    tone: "green",
    image: media.verdeGarden,
    index: "01",
    caption: "VERDE · the garden front, October",
    alt: "VERDE's low blocks fronting the central garden",
  },
  gallery: [
    "verde",
    "garden",
    "courtyard",
    "living",
    "wood",
    "bedroom",
    "poolDeck",
    "dusk",
    "kitchen",
    "lobby",
  ],
  amenities: ["outdoor", "private", "wellness"],
  nearby: ["expressway", "school", "hospital", "park", "retail", "faridabad"],
  testimonialIds: ["t3", "t1"],
  story: ["landscape", "light", "materiality", "water", "privacy"],
  faqKeys: ["plans", "payment", "maintenance"],
});

/* ------------------------------------------------------------ 05 THE EDITION */

const edition = makeProject({
  slug: "the-edition",
  name: "THE EDITION",
  subtitle: "Signature Residences",
  locality: "Sector 63A",
  addressLine: "Golf Course Extension Road, Sector 63A, Gurugram",
  status: "completing-soon",
  statusLabel: "Completing 2026 · Three residences left",
  possession: "November 2026",
  land: "0.9 acres",
  openSpace: "Podium garden",
  statement: "Twelve homes, one per floor.",
  description: [
    "THE EDITION is a single block of twelve residences, one to a floor, each with a private lift lobby and a full-floor terrace.",
    "There is no shared corridor and no shared wall. Your floor is your residence, and the lift opens into it.",
    "Nine of the twelve are sold. Three remain, and the building completes in November.",
  ],
  architecture: [
    "One residence per level, twelve levels, with a structural core placed off-centre so the floor plate stays uninterrupted from the lift lobby to the corner window.",
    "Glass on three sides, bronze mullions, and a projecting slab at every level that shades the glazing and gives each residence its terrace. The building is almost entirely perimeter.",
  ],
  facts: [
    { label: "Configuration", value: "4 bedroom and penthouse" },
    { label: "Residences", value: "12 private residences" },
    { label: "Site", value: "0.9 acres, Sector 63A" },
    { label: "Possession", value: "November 2026" },
    { label: "Available", value: "Three residences remaining" },
    { label: "Structure", value: "RCC frame, bronze and glass facade" },
  ],
  metrics: [
    { value: "12", label: "RESIDENCES", sub: "One residence per floor" },
    { value: "03", label: "REMAINING", sub: "Available at time of print" },
    { value: "4,400", label: "SQ.FT. AVERAGE", sub: "Plus full-floor terrace" },
    { value: "12", label: "PRIVATE LIFTS", sub: "One opening into each residence" },
  ],
  highlights: [
    "One residence per floor, no shared corridor",
    "Full-floor terrace with every residence",
    "Completing November 2026",
  ],
  areaRange: [4400, 6200],
  residences: [
    {
      configuration: "4 BHK",
      areaSuper: 4400,
      priceFrom: 64_000_000,
      copy:
        "A full floor. The lift opens into a private lobby, and the residence runs the entire perimeter — glass on three sides with no shared wall.",
      detail:
        "Two of the twelve remain on the lower levels. Each holds a 60 ft terrace off the living room and a separate service lift.",
      features: [
        "Private lift lobby per residence",
        "Glass on three sides",
        "60 ft full-floor terrace",
        "Separate service lift and entry",
      ],
      media: interior["4 BHK"],
    },
    {
      configuration: "Penthouse",
      areaSuper: 6200,
      priceFrom: 98_000_000,
      copy:
        "The top two levels and the roof. A double-height living volume, a plunge deck facing the ridge, and a roof terrace the full size of the floor plate.",
      detail:
        "One penthouse remains. The upper level holds a lounge, library and the roof terrace, with the plunge deck on the west corner.",
      features: [
        "Duplex with full roof terrace",
        "Double-height living volume",
        "Plunge deck on the west corner",
        "Four parking bays",
      ],
      media: interior.Penthouse,
    },
  ],
  plans: [
    { slug: "the-edition", configuration: "4 BHK", areaSuper: 4400, level: "Levels 02 – 09 · One residence per floor", orientation: "Three aspects", notes: ["No shared walls between residences."] },
    { slug: "the-edition", configuration: "Penthouse", areaSuper: 6200, level: "Levels 10 – 13 · Duplex with roof terrace", orientation: "Three aspects" },
  ],
  units: buildInventory({
    slug: "the-edition",
    available: 3,
    reserved: 2,
    seed: 41,
    towers: [
      {
        code: "E",
        stacks: [
          { configuration: "4 BHK", area: 4400, base: 64_000_000, from: 2, to: 9, perFloor: 1, facing: "Aravalli Ridge", aspectPremium: 0, floorStep: 900_000, note: "Private lift lobby, 60 ft terrace" },
          { configuration: "Penthouse", area: 6200, base: 98_000_000, from: 10, to: 13, perFloor: 1, facing: "Aravalli Ridge", aspectPremium: 0, floorStep: 1_800_000, note: "Duplex with roof terrace" },
        ],
      },
    ],
  }),
  hero: {
    scene: "arrival",
    tone: "dusk",
    image: media.editionHero,
    index: "01",
    caption: "THE EDITION · the approach, 18:50",
    alt: "The approach to THE EDITION at golden hour",
  },
  gallery: [
    "edition",
    "lobby",
    "livingLong",
    "privateDining",
    "bath",
    "bedroom",
    "rooftop",
    "stone",
    "arrival",
    "elevation",
  ],
  amenities: ["private", "social"],
  nearby: ["golf58", "expressway", "school", "dining", "airport", "hotel"],
  testimonialIds: ["t4", "t1"],
  story: ["privacy", "proportion", "craft", "horizon", "materiality"],
  faqKeys: ["customisation", "nri", "handover"],
});

/* ------------------------------------------------------------------- 06 ALTO */

const alto = makeProject({
  slug: "alto",
  name: "ALTO",
  subtitle: "Sky Residences",
  locality: "Sector 32",
  addressLine: "Sector 32, Central Gurugram",
  status: "coming-soon",
  statusLabel: "Launching Q1 2027",
  possession: "December 2030",
  land: "1.2 acres",
  openSpace: "Podium garden, level 08",
  statement: "Above the city, but not of it.",
  description: [
    "ALTO is thirty-six residences from level 05 to level 28, on one of the last unbuilt plots in central Gurugram.",
    "The lower eight levels are podium and parking. The residences start above them, which puts every home above the surrounding roofline and keeps the noise below.",
    "Registration of interest is open now. Prices are released at launch.",
  ],
  architecture: [
    "One tower, twenty-eight levels, with the residential stack beginning at level 05 and sky decks every third floor — shared, planted, and open to the residents rather than the public.",
    "The facade is banded: floor-to-ceiling glazing set behind a deep horizontal fin at every level, which shades the glass and gives the tower a strong horizontal read from a distance.",
  ],
  facts: [
    { label: "Configuration", value: "3 and 4 bedroom, plus penthouses" },
    { label: "Residences", value: "36 sky residences" },
    { label: "Site", value: "1.2 acres, Sector 32" },
    { label: "Possession", value: "December 2030" },
    { label: "Launch", value: "Q1 2027 · registrations open" },
    { label: "Structure", value: "RCC frame, banded glazed facade" },
  ],
  metrics: [
    { value: "36", label: "RESIDENCES", sub: "Levels 05 to 28" },
    { value: "28", label: "LEVELS", sub: "Residential stack above level 05" },
    { value: "08", label: "SKY DECKS", sub: "Shared, one every third floor" },
    { value: "1,900", label: "SQ.FT.", sub: "Starting area, three bedroom" },
  ],
  highlights: [
    "Residences start above the roofline",
    "Eight shared sky decks",
    "Registrations open for Q1 2027",
  ],
  areaRange: [1900, 3600],
  residences: [
    {
      configuration: "3 BHK",
      areaSuper: 1900,
      priceFrom: 29_000_000,
      copy:
        "A three bedroom from level 05, with the living room turned to the city and a service core that keeps the kitchen out of sight from the entry.",
      detail:
        "Every three bedroom residence opens onto a sky deck every third floor, and holds a balcony the full width of the living room.",
      features: [
        "Full-width living balcony",
        "Access to a shared sky deck",
        "Kitchen concealed from the entry",
        "Two parking bays",
      ],
      media: interior["3 BHK"],
    },
    {
      configuration: "4 BHK",
      areaSuper: 2600,
      priceFrom: 39_500_000,
      copy:
        "Corner four bedroom above level 18, with two aspects, a separate study and a dining room that opens to the balcony.",
      detail:
        "Corner residences hold the widest outlook in the building — the city on one side and the ridge on the other.",
      features: [
        "Corner aspect above level 18",
        "Study with a door",
        "Dining opening to the balcony",
        "Three parking bays",
      ],
      media: interior["4 BHK"],
    },
    {
      configuration: "Penthouse",
      areaSuper: 3600,
      priceFrom: 65_000_000,
      copy:
        "The top three levels, with a private deck, a double-height living room and an outlook that runs to the Aravalli ridge on a clear day.",
      detail:
        "Six penthouses, two per level. Each holds a private deck, an upper-level lounge and a lift lobby that opens into the residence.",
      features: [
        "Private deck and upper lounge",
        "Double-height living volume",
        "Private lift lobby",
        "Four parking bays",
      ],
      media: interior.Penthouse,
    },
  ],
  plans: [
    { slug: "alto", configuration: "3 BHK", areaSuper: 1900, level: "Levels 05 – 25 · Tower A", orientation: "East and north", notes: ["Residential stack begins at level 05."] },
    { slug: "alto", configuration: "4 BHK", areaSuper: 2600, level: "Levels 05 – 16 · Corner stack", orientation: "East and north" },
    { slug: "alto", configuration: "Penthouse", areaSuper: 3600, level: "Levels 26 – 28 · Duplex", orientation: "East and north" },
  ],
  units: buildInventory({
    slug: "alto",
    available: 11,
    reserved: 5,
    seed: 53,
    towers: [
      {
        code: "A",
        stacks: [
          { configuration: "3 BHK", area: 1900, base: 29_000_000, from: 5, to: 16, perFloor: 1, facing: "Central Courtyard", aspectPremium: 0, floorStep: 95_000, note: "Sky deck every third floor" },
          { configuration: "4 BHK", area: 2600, base: 39_500_000, from: 5, to: 16, perFloor: 1, facing: "Aravalli Ridge", aspectPremium: 450_000, floorStep: 130_000, note: "Corner aspect, two sides" },
          { configuration: "3 BHK", area: 1900, base: 30_800_000, from: 17, to: 25, perFloor: 1, facing: "Central Courtyard", aspectPremium: 0, floorStep: 95_000 },
          { configuration: "Penthouse", area: 3600, base: 65_000_000, from: 26, to: 28, perFloor: 1, facing: "Aravalli Ridge", aspectPremium: 0, floorStep: 0, note: "Private deck" },
        ],
      },
    ],
  }),
  hero: {
    scene: "night-skyline",
    tone: "night",
    image: media.altoSky,
    index: "01",
    caption: "ALTO · the outlook from level 24",
    alt: "City view at dusk from a high floor of ALTO",
  },
  gallery: [
    "alto",
    "night",
    "lounge",
    "living",
    "dining",
    "spaLounge",
    "gym",
    "aerial",
    "rooftop",
    "lobby",
  ],
  amenities: ["work", "wellness", "social"],
  nearby: ["metro54", "huda", "cyberhub", "business", "hospital", "dining"],
  testimonialIds: ["t1", "t2"],
  story: ["horizon", "light", "proportion", "threshold", "water"],
  faqKeys: ["plans", "nri", "finance"],
});

/* ------------------------------------------------------------------------------ */

export const projects: Project[] = [vault, noir, arc, verde, edition, alto];

/** Editorial teaser for land we hold but have not launched. */
export const upcoming = {
  name: "Sector 71",
  note: "Approvals in progress",
  detail:
    "2.6 acres on the Southern Peripheral Road. Registration of interest opens Q2 2027, and the land desk is happy to talk through the masterplan before then.",
};

export const flagship = vault;
