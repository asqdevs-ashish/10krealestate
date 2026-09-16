import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import { hashPassword } from "../lib/password";

/**
 * Demo data for local development.
 *
 * Idempotent — every row is upserted on its natural key (slug, email,
 * reference), so running it twice leaves the database unchanged.
 *
 *   npm run db:seed
 *
 * Image dimensions are placeholders: the real values come from the CMS
 * uploader once it exists.
 */

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Copy .env.example to .env first.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

/** Demo CMS credentials. Never ship these. */
const DEMO_PASSWORD = "asquare-demo-2026";

type SeedImage = { url: string; alt: string };

type SeedProperty = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  priceInr: number;
  bedrooms: number;
  bathrooms: number;
  balconies: number;
  areaSqft: number;
  carpetSqft: number;
  floor: number;
  totalFloors: number;
  locality: string;
  address: string;
  latitude: number;
  longitude: number;
  isFeatured: boolean;
  featuredRank: number | null;
  amenities: string[];
  features: string[];
  images: SeedImage[];
};

const SHARED_AMENITIES = [
  "concierge",
  "valet-parking",
  "private-lift",
  "clubhouse",
  "spa",
  "pool",
  "gym",
  "landscaped-gardens",
];

const PROPERTIES: SeedProperty[] = [
  {
    slug: "vault-58-sky-residence",
    title: "Sky Residence, VAULT 58",
    tagline: "A full-floor home in the tower's eastern light.",
    description:
      "A full-floor residence with eleven-foot ceilings and a continuous east-facing glazed run from the living room to the primary suite. Stone floors throughout, brass details, a kitchen built around a single slab.",
    priceInr: 42500000,
    bedrooms: 4,
    bathrooms: 5,
    balconies: 3,
    areaSqft: 4850,
    carpetSqft: 3720,
    floor: 21,
    totalFloors: 24,
    locality: "Sector 58",
    address: "VAULT, Golf Course Road Extension, Sector 58, Gurugram 122011",
    latitude: 28.4212,
    longitude: 77.0953,
    isFeatured: true,
    featuredRank: 1,
    amenities: [...SHARED_AMENITIES, "rooftop-terrace", "library"],
    features: [
      "Full-floor plate",
      "Eleven-foot ceilings",
      "Private lift lobby",
    ],
    images: [
      { url: "/media/living.jpg", alt: "Living room with east glazing" },
      { url: "/media/kitchen.jpg", alt: "Kitchen with stone island" },
      { url: "/media/bedroom.jpg", alt: "Primary bedroom at dawn" },
      { url: "/media/terrace.jpg", alt: "Private terrace" },
    ],
  },
  {
    slug: "vault-58-garden-villa",
    title: "Garden Villa, VAULT 58",
    tagline: "Four bedrooms set into the podium gardens.",
    description:
      "The lowest two levels of the tower, given a private garden on two sides. Deep planting, a shaded court between the bedrooms, and a long gallery that reads as a single room.",
    priceInr: 31500000,
    bedrooms: 3,
    bathrooms: 4,
    balconies: 2,
    areaSqft: 3260,
    carpetSqft: 2480,
    floor: 2,
    totalFloors: 24,
    locality: "Sector 58",
    address: "VAULT, Golf Course Road Extension, Sector 58, Gurugram 122011",
    latitude: 28.4208,
    longitude: 77.0948,
    isFeatured: true,
    featuredRank: 2,
    amenities: [...SHARED_AMENITIES, "private-garden", "courtyard"],
    features: [
      "Private garden on two sides",
      "Shaded internal court",
      "Dedicated staff entry",
    ],
    images: [
      { url: "/media/courtyard.jpg", alt: "Shaded internal courtyard" },
      { url: "/media/living-2.jpg", alt: "Gallery living space" },
      { url: "/media/dining.jpg", alt: "Dining gallery" },
      { url: "/media/verde-garden.jpg", alt: "Planted garden edge" },
    ],
  },
  {
    slug: "vault-58-penthouse-four",
    title: "Penthouse Four",
    tagline: "The terrace penthouse — one of four.",
    description:
      "Four bedrooms, a double-height living room and a terrace that runs the full length of the western facade. Sunset on one side, the skyline on the other.",
    priceInr: 89000000,
    bedrooms: 4,
    bathrooms: 6,
    balconies: 4,
    areaSqft: 7120,
    carpetSqft: 5460,
    floor: 24,
    totalFloors: 24,
    locality: "Sector 58",
    address: "VAULT, Golf Course Road Extension, Sector 58, Gurugram 122011",
    latitude: 28.4215,
    longitude: 77.0955,
    isFeatured: true,
    featuredRank: 3,
    amenities: [
      ...SHARED_AMENITIES,
      "rooftop-terrace",
      "private-pool",
      "cigar-lounge",
      "library",
    ],
    features: [
      "Double-height living room",
      "Full-length west terrace",
      "Private plunge pool",
    ],
    images: [
      { url: "/media/rooftop.jpg", alt: "Rooftop terrace at dusk" },
      { url: "/media/pool-deck.jpg", alt: "Plunge pool and deck" },
      { url: "/media/lounge.jpg", alt: "Lounge at double height" },
      { url: "/media/dusk-exterior.jpg", alt: "Tower facade at dusk" },
    ],
  },
];

async function seedUsers() {
  const passwordHash = await hashPassword(DEMO_PASSWORD);

  const admin = await prisma.user.upsert({
    where: { email: "admin@asquareddevs.com" },
    update: {},
    create: {
      email: "admin@asquareddevs.com",
      name: "A Square Devs Admin",
      role: "ADMIN",
      title: "Sales Director",
      phone: "+91 98100 45600",
      passwordHash,
    },
  });

  const agent = await prisma.user.upsert({
    where: { email: "agent@asquareddevs.com" },
    update: {},
    create: {
      email: "agent@asquareddevs.com",
      name: "Residence Advisor",
      role: "AGENT",
      title: "Property Advisor",
      phone: "+91 98100 45601",
      passwordHash,
    },
  });

  return { admin, agent };
}

async function seedProperties(managerId: string) {
  const today = new Date();
  const slugs: string[] = [];

  for (const item of PROPERTIES) {
    const { images, ...fields } = item;
    slugs.push(item.slug);

    const property = await prisma.property.upsert({
      where: { slug: item.slug },
      update: { ...fields, amenityKeys: item.amenities },
      create: {
        ...fields,
        amenityKeys: item.amenities,
        status: "PUBLISHED",
        publishedAt: today,
        managerId,
      },
    });

    // Images are replaced wholesale: position is unique per property, so a
    // partial update could collide with an existing row.
    await prisma.image.deleteMany({ where: { propertyId: property.id } });
    await prisma.image.createMany({
      data: images.map((image, index) => ({
        propertyId: property.id,
        url: image.url,
        alt: image.alt,
        width: 1600,
        height: 1067,
        position: index,
        isCover: index === 0,
      })),
    });
  }

  return slugs;
}

async function seedLeads(propertySlugs: string[], ownerId: string) {
  const leads = [
    {
      reference: "VAUL-20260901",
      name: "R. Menon",
      email: "r.menon@example.com",
      phone: "+91 98200 11223",
      message:
        "Interested in the sky residence. Prefer a weekday evening viewing.",
      source: "VIEWING_REQUEST" as const,
      status: "VIEWING_BOOKED" as const,
      budgetInr: 45000000,
      preferredTime: "18:30",
      slug: propertySlugs[0],
    },
    {
      reference: "VAUL-20260904",
      name: "S. Kapoor",
      email: "s.kapoor@example.com",
      phone: "+91 98110 44556",
      message: "Comparing the penthouses across two projects.",
      source: "AD_CAMPAIGN" as const,
      status: "QUALIFIED" as const,
      budgetInr: 90000000,
      preferredTime: "11:00",
      slug: propertySlugs[2],
    },
  ];

  for (const lead of leads) {
    const property = await prisma.property.findUnique({
      where: { slug: lead.slug },
      select: { id: true },
    });

    await prisma.lead.upsert({
      where: { reference: lead.reference },
      update: { status: lead.status },
      create: {
        reference: lead.reference,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        message: lead.message,
        source: lead.source,
        status: lead.status,
        budgetInr: lead.budgetInr,
        preferredTime: lead.preferredTime,
        propertyId: property?.id ?? null,
        ownerId,
        utmSource: lead.source === "AD_CAMPAIGN" ? "meta" : null,
        utmCampaign: lead.source === "AD_CAMPAIGN" ? "penthouses-q3" : null,
      },
    });
  }

  return leads.length;
}

async function main() {
  const { admin } = await seedUsers();
  const slugs = await seedProperties(admin.id);
  const leadCount = await seedLeads(slugs, admin.id);

