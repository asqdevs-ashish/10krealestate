/**
 * Demo media registry.
 *
 * Every photograph used on the site is referenced from here and nowhere else —
 * so replacing the demo set with the client's own shoot is a single-file job.
 * Each entry is a plain path under /public/media, which means the same value
 * works for a local file, a CDN URL, or a CMS media field.
 *
 * The imagery is a curated set of architectural and interior photographs used
 * as stand-ins for the real project shoot. Swap the paths; nothing else moves.
 *
 *   /public/media/vault-hero.mp4   ← the hero film (see HERO below)
 */

export const media = {
  /* exteriors */
  vaultDusk: "/media/vault-dusk.jpg",
  duskExterior: "/media/dusk-exterior.jpg",
  noirFacade: "/media/noir-facade.jpg",
  arcTower: "/media/arc-tower.jpg",
  verdeGarden: "/media/verde-garden.jpg",
  editionHero: "/media/edition-hero.jpg",
  altoSky: "/media/alto-sky.jpg",

  /* architecture, circulation and views */
  arrival: "/media/arrival.jpg",
  lobby: "/media/lobby.jpg",
  aerial: "/media/aerial.jpg",
  nightSkyline: "/media/night-skyline.jpg",
  courtyard: "/media/courtyard.jpg",
  rooftop: "/media/rooftop.jpg",
  terrace: "/media/terrace.jpg",

  /* interiors */
  living: "/media/living.jpg",
  livingTwo: "/media/living-2.jpg",
  dining: "/media/dining.jpg",
  kitchen: "/media/kitchen.jpg",
  bedroom: "/media/bedroom.jpg",
  bath: "/media/bath.jpg",
  library: "/media/library.jpg",

  /* amenities */
  pool: "/media/pool.jpg",
  poolDeck: "/media/pool-deck.jpg",
  gym: "/media/gym.jpg",
  spa: "/media/spa.jpg",
  spaLounge: "/media/spa-lounge.jpg",
  lounge: "/media/lounge.jpg",
  clubhouse: "/media/clubhouse.jpg",
  privateDining: "/media/private-dining.jpg",

  /* materials */
  stone: "/media/stone.jpg",
  wood: "/media/wood.jpg",
  concrete: "/media/concrete.jpg",
} as const;

export type MediaKey = keyof typeof media;

/**
 * The hero film.
 *
 * Drop the 1920 × 1080 master at /public/media/vault-hero.mp4 and it plays
 * automatically — the component checks for the file before mounting the
 * <video>, so the site degrades to the poster still (and then to the drawn
 * plate) with no console noise and no layout shift.
 */
export const HERO = {
  video: "/media/vault-hero.mp4",
  poster: media.vaultDusk,
  /** Shown in the corner of the hero while the film plays. */
  caption: "VAULT · Sector 58, Gurugram",
} as const;

/**
 * The 3D model.
 *
 * Drop the file at exactly this path — nothing else changes:
 *
 *   public/models/architecture.glb   section 04, “Architecture in motion”
 *
 * The hero is a photograph on purpose (see `components/sections/Hero.tsx`);
 * section 04 is the one place the page renders rather than photographs, and it
 * is the only consumer of a model.
 *
 * The model is optional. It is checked with a HEAD request before anything is
 * downloaded, so a file that has not been supplied yet costs one failed check
 * and nothing else: the sequence keeps showing the drawn massing. Same for a
 * device without WebGL or a visitor who asked for reduced motion.
 *
 * Keep the export light: the browser downloads the whole file, and both
 * decoders are set up in `lib/gltf.ts`, so a Draco- or meshopt-compressed GLB
 * with WebP textures loads as-is. The file that ships here went through glTF
 * Transform first — see the README section, “The 3D model”.
 */
export const MODELS = {
  architecture: "/models/architecture.glb",
} as const;
