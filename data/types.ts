/**
 * Content model for the A Square Devs / VAULT experience.
 *
 * These types are deliberately CMS-shaped: every section of the site reads
 * from these structures, so a headless CMS, property database or CRM can
 * replace `data/*` later without touching presentation code.
 */

/* ---------------------------------- media --------------------------------- */

/** Art-directed scene plates. Real photography can be injected via `image`. */
export type MediaScene =
  | "tower-dusk"
  | "facade"
  | "arrival"
  | "lobby"
  | "interior-living"
  | "material-stone"
  | "pool-deck"
  | "garden-terrace"
  | "library"
  | "aerial"
  | "night-skyline"
  | "interior-dining";

export type MediaTone = "dusk" | "night" | "interior" | "stone" | "green" | "paper";

export type MediaRef = {
  scene: MediaScene;
  tone: MediaTone;
  /** Short editorial caption, e.g. "North facade, 19:40" */
  caption?: string;
  /** Index shown in mono type, e.g. "03" */
  index?: string;
  /** Optional real asset. When present the plate renders behind it. */
  image?: string;
  alt: string;
};

/* ------------------------------- residences ------------------------------- */

export type Configuration = "2 BHK" | "3 BHK" | "4 BHK" | "Penthouse";

export type ResidenceConfig = {
  id: string;
  configuration: Configuration;
  /** Short eyebrow, e.g. "Two bedroom" */
  label: string;
  bedrooms: number;
  bathrooms: number;
  /** Super built-up area in sq.ft. */
  areaSuper: number;
  /** Lowest current price in INR paise-free rupees. */
  priceFrom: number;
  copy: string;
  detail: string;
  features: string[];
  planId: string;
  media: MediaRef;
};

/* ---------------------------------- units --------------------------------- */

export type UnitStatus = "available" | "reserved" | "sold";

/** Aspect of a residence. Free text — every project names its own orientations. */
export type Facing = string;

export type Unit = {
  id: string;
  tower: string;
  configuration: Configuration;
  floor: number;
  area: number;
  price: number;
  status: UnitStatus;
  facing: Facing;
  planId: string;
  residenceId: string;
  /** e.g. "Corner unit, double aspect" */
  note?: string;
};

/* -------------------------------- floor plans ------------------------------ */

export type RoomKind = "living" | "sleep" | "wet" | "service" | "outdoor";

export type RoomSpec = {
  name: string;
  kind: RoomKind;
  /** Relative size along the row's axis. */
  size: number;
  note?: string;
};

/** A horizontal group of rooms inside a column. */
export type RowSpec = {
  /** Relative height of the row. */
  weight: number;
  rooms: RoomSpec[];
};

export type ColumnSpec = {
  /** Relative width of the column. */
  width: number;
  rows: RowSpec[];
};

export type PlanSpec = {
  id: string;
  configuration: Configuration;
  /** Level range this plan appears on. */
  level: string;
  areaSuper: number;
  /** Drawing scale: pixels per foot. Drives all derived dimensions. */
  pxPerFt: number;
  orientation: string;
  front?: { name: string; kind: RoomKind; depth: number };
  back?: { name: string; kind: RoomKind; depth: number };
  columns: ColumnSpec[];
  notes: string[];
};

/** A room after layout maths, ready to render. */
export type PlacedRoom = {
  id: string;
  name: string;
  kind: RoomKind;
  note?: string;
  /** Pixel box inside the 1200 × 900 plan viewBox. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Derived from `pxPerFt`. */
  area: number;
  dims: string;
};

export type LaidOutPlan = {
  spec: PlanSpec;
  rooms: PlacedRoom[];
  /** Total carpet area of all drawn rooms, sq.ft. */
  carpet: number;
  /** Physical extent of the drawn unit, in feet. */
  extent: { w: number; h: number };
  viewBox: { w: number; h: number };
};

/* -------------------------------- amenities ------------------------------- */

export type AmenityCluster = {
  id: string;
  index: string;
  category: string;
  statement: string;
  copy: string;
  items: { name: string; note?: string }[];
  media: MediaRef;
};

/* --------------------------------- gallery -------------------------------- */

export type GalleryItem = {
  id: string;
  media: MediaRef;
  caption: string;
  meta: string;
  /** Editorial layout weight. */
  span: "full" | "wide" | "tall" | "std";
};

/* --------------------------------- nearby --------------------------------- */

export type NearbyPlace = {
  id: string;
  name: string;
  category:
    | "Leisure"
    | "Connectivity"
    | "Education"
    | "Retail"
    | "Healthcare"
    | "Hospitality"
    | "Business"
    | "Dining";
  minutes: number;
  km: number;
  /** Position on the stylised map, percentages of the map box. */
  x: number;
  y: number;
  /** Animated route path in the map's 1000 × 700 viewBox. */
  route: string;
};

/* ---------------------------------- story --------------------------------- */

/**
 * One chapter of the property story — the editorial sequence that runs
 * between the facts and the floor plans.
 */
export type StoryChapter = {
  id: string;
  /** Position in the sequence, e.g. "01". */
  index: string;
  /** Short label, e.g. "Light". */
  category: string;
  /** The large statement, e.g. "Light enters slowly here." */
  statement: string;
  /** A short paragraph. Deliberately one, not three. */
  copy: string;
  /** Small uppercase metadata line. */
  meta: string;
  media: MediaRef;
};

/* ----------------------------------- faq ---------------------------------- */

export type Faq = {
  id: string;
  question: string;
  answer: string;
};

/* ------------------------------ testimonials ------------------------------ */

export type Testimonial = {
  id: string;
  quote: string;
  person: string;
  context: string;
  /** `demo` content is clearly labelled in the UI. */
  source: "demo" | "verified";
};

/* --------------------------------- project -------------------------------- */

export type ProjectStatus = "now-selling" | "under-construction" | "completing-soon" | "coming-soon";

export type Project = {
  slug: string;
  name: string;
  subtitle: string;
  city: string;
  locality: string;
  addressLine: string;
  status: ProjectStatus;
  statusLabel: string;
  possession: string;
  priceFrom: number;
  configurations: Configuration[];
  totalResidences: number;
  land: string;
  openSpace: string;
  /** Large editorial statement used on the project page. */
  statement: string;
  description: string[];
  facts: { label: string; value: string }[];
  metrics: { value: string; label: string; sub: string }[];
  residences: ResidenceConfig[];
  units: Unit[];
  plans: PlanSpec[];
  hero: MediaRef;
  gallery: GalleryItem[];
  amenities: AmenityCluster[];
  nearby: NearbyPlace[];
  testimonials: Testimonial[];
  /** Two or three lines of architectural intent, shown as the story block. */
  architecture: string[];
  /** Short editorial highlights used on the collection page. */
  highlights: string[];
  /** The editorial property story, in running order. */
  story: StoryChapter[];
  /** Project questions, derived facts first, then the developer's own. */
  faqs: Faq[];
  /** Area range across configurations, sq.ft. */
  areaRange: [number, number];
  /** Flagship project gets the full cinematic homepage narrative. */
  isFlagship: boolean;
};

/* ----------------------------------- lead --------------------------------- */

export type PurposeAnswer = "End Use" | "Investment";
export type TimelineAnswer = "Immediately" | "1–3 Months" | "3–6 Months" | "Just Exploring";
export type ContactMethod = "WhatsApp" | "Call" | "Email";
export type BudgetAnswer = "₹1–2 Cr" | "₹2–3 Cr" | "₹3–5 Cr" | "₹5 Cr+";

export type QualificationAnswers = {
  configuration?: Configuration;
  budget?: BudgetAnswer;
  purpose?: PurposeAnswer;
  timeline?: TimelineAnswer;
  name?: string;
  phone?: string;
  email?: string;
  contactMethod?: ContactMethod;
  viewingDay?: string;
  viewingSlot?: string;
  notes?: string;
};

export type Enquiry = QualificationAnswers & {
  source: string;
  projectSlug: string;
  createdAt: string;
};
