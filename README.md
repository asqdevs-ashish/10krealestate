# A Square Devs — Gurugram residential portfolio

A client-pitch demo for a luxury residential developer: six projects, a full inventory desk and a
real lead funnel that ends in a prefilled WhatsApp handoff.

Bone-and-ink art direction, a photographic opening, and one shared component set doing the work for
every project page.

Everything on screen is driven by structured data. Swapping the demo records for a CMS or a
property database does not require touching a component.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4 with a documented design-token layer |
| Motion | Framer Motion (components, menus, forms) · GSAP + ScrollTrigger (cinematic scroll, reveals) |
| 3D | Three.js via React Three Fiber, client-side only, with a static fallback |
| Fonts | Instrument Sans · Instrument Serif · IBM Plex Mono (self-hosted by `next/font`) |

## Art direction — “Bone & Ink”

Light is the default surface: warm bone paper, ink type, and a deep forest accent. Dark is
**reserved** for four cinematic anchors — the hero film plate, the 3D architecture sequence, the
gallery, and the closing call. That contrast is what gives the page its rhythm; it is not decoration.

| | |
|---|---|
| Surfaces | `--paper` bone (page) · `--paper-2` sand (band) · `--paper-3` inset · `--ink` / `--void` (anchors) |
| Accent | `--accent` deep forest on light, muted sage on dark — used for rules, active states and hover only |
| Type | Instrument Serif for statements · Instrument Sans for body and tracked caps labels · IBM Plex Mono for figures only |

The important part is that **the type, hairline, accent and button tokens are semantic and
re-pointed per surface** by `[data-tone]`. `<Section tone="light|sand|dark|black">`, `<Modal>` and
every overlay set the tone, and every token-based class inside resolves against that surface — so a
component never has to know where it landed. Palette changes are one file: `app/globals.css`.

Text tokens are contrast-checked against their own surface: `--text` 16.4:1, `--text-dim` 6.3:1 and
`--text-faint` 4.6:1 on bone; 15.4 / 6.9 / 4.6:1 on ink.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build + type check
npm run start      # serve the production build
```

## Routes

| Route | Purpose |
|---|---|
| `/` | The VAULT narrative: hero → statement → residence explorer → 3D architecture sequence → floor plan → location → lifestyle → gallery → availability → residents → developer → qualification funnel → contact |
| `/projects` | Editorial portfolio: a featured flagship, then five projects in alternating compositions |
| `/projects/[slug]` | Project detail — overview, architecture, property story, residences, interactive plans, live inventory, amenities, gallery, location, questions |
| `/availability` | Inventory desk across all six projects, with configuration, status, price and floor filters |
| `/book-a-viewing` | Six-step qualification and viewing flow, project-aware via `?project=` / `?residence=` |
| `/legal/privacy` · `/legal/terms` | Demo content, data handling and pricing disclaimers |
| `POST /api/enquiry` | Demo lead endpoint (logs the lead, returns a reference) |

All routes are statically prerendered; only the enquiry endpoint is dynamic.

## The portfolio

| Project | Type | Locality | Residences |
|---|---|---|---|
| VAULT | Private Residences | Sector 58 | 34 |
| NOIR | The Residences | Sector 43 | 24 |
| ARC | Urban Residences | Sector 65 | 48 |
| VERDE | Garden Residences | Sector 79, New Gurgaon | 28 |
| THE EDITION | Signature Residences | Sector 63A | 12 |
| ALTO | Sky Residences | Sector 32 | 36 |

Each one has its own architecture notes, residences, floor plans, inventory, amenities, gallery and
location list — no project page is a renamed copy of another.

## Structure

```
app/                    routes, layout shell, design tokens (globals.css)
components/
  layout/               nav, footer, route curtain, sticky mobile CTA, desktop advisor dock, preloader
  sections/             one component per homepage section
  features/             the interactive pieces — explorer, plan viewer, map, gallery, calculator,
                        inventory desk + table, residence modal, qualification funnel, 3D scene
  media/                the scene-plate drawing library + the media frame
  motion/               shared motion primitives (reveal, mask lines, clip reveal, parallax, counters)
  ui/                   Action, Label, Section, Modal, PageHero, CtaBand, LegalPage, Wordmark
data/                   the entire content model (see below)
lib/                    plan maths, INR/area formatting, WhatsApp composition, lead matching,
                        enquiry client, motion hooks, GSAP setup, GLB loader setup
public/media/           demo photography + the hero film
public/models/          the 3D model for section 04 (see below)
public/draco/           the Draco decoder, served locally rather than from a CDN
```

## The 3D model

The hero is a photograph. Section 04, “Architecture in motion”, is the one place the page renders
rather than photographs, and it reads `public/models/architecture.glb`.

The file is optional. It is HEAD-checked before anything downloads it, and the section keeps its
fallback — the drawn massing — if the file is missing, fails to load, or the device cannot run it.
Fitted size, tint and quality live at the top of `components/features/ArchitectureCanvas.tsx`,
along with the palette and the stage curve for the sequence.

**Export it small.** A GLB is downloaded whole, and a raw Sketchfab export of a furnished site runs
to tens of megabytes. The file in the repo was put through [glTF Transform](https://gltf.pmnd.rs) —
meshopt geometry, WebP textures, `.glb` only:

```bash
# a spec-gloss export (three.js does not support the extension) → metal-rough
npx @gltf-transform/cli metalrough in.glb arch.glb
npx @gltf-transform/cli optimize arch.glb public/models/architecture.glb \
  --compress meshopt --texture-compress webp --texture-size 2048
```

Draco and meshopt decoders are both wired up in `lib/gltf.ts`, so either compression loads as-is;
neither decoder is fetched unless the file needs it.

## The data seam

`data/` is the whole content model, typed in `data/types.ts`:

| File | Holds |
|---|---|
| `brand.ts` | Brand, **contact numbers**, navigation, status labels, conversion copy |
| `media.ts` | Every photograph used on the site, and the hero film — the only place asset paths live |
| `projects.ts` | The six project records |
| `residences.ts` | Configuration conventions plus the per-project residence builder |
| `plans.ts` | Plan geometry per configuration plus a scale-solving builder |
| `units.ts` | VAULT's unit sheet, plus a deterministic inventory generator for the others |
| `amenities.ts` | Amenity, gallery, nearby-place and testimonial libraries, and the selectors that renumber a project's subset |
| `story.ts` | The property-story chapters (light, materiality, privacy, landscape…) and the selector that numbers a project's sequence |
| `faqs.ts` | The FAQ library, plus `projectFaqs()` — the questions whose answers are derived from the project record, so price and stock can never drift |

`data/index.ts` is the access seam — components read through `getProject()`, `listUnits()`,
`availableCount()`, `projectAvailability()` and friends. Replace those bodies with a `fetch()` and
the UI keeps working.

Floor-plan areas and dimensions are **computed from the drawing geometry** (`lib/plan.ts`), and each
project's drawing scale is solved so its carpet area matches the area it publishes. Inventory
counts, residence prices and the homepage's availability line all derive from the same records —
nothing is typed twice.

## Media and the hero film

All photography lives in `public/media/` and is referenced only from `data/media.ts`. The set ships
as licensed stock standing in for the real shoot.

The hero film is **`public/media/vault-hero.mp4`** (1920 × 1080, H.264, no audio). It ships with a
ten-second placeholder generated from the hero still. To use the production master, overwrite that
file — no code changes. The hero layers film → poster still → drawn plate, so it is never empty: if
the file is missing or the codec is unsupported, `onError` drops the film and the poster shows. The
film only plays while the hero is on screen, and never when reduced motion is requested.

## Replacing demo content before launch

- `data/brand.ts` → the real sales line, WhatsApp number, email and experience-centre address.
  Social entries with an empty `href` are not rendered, so adding the client's URLs is all it takes.
- `data/media.ts` → point each key at the client's own imagery (local path or CDN URL).
- `data/projects.ts` → RERA numbers (currently placeholders), possession dates, price lists.
- `public/media/vault-hero.mp4` → the real hero film.
- `public/models/architecture.glb` → the final export, re-run through glTF Transform first (see
  **The 3D model** above). Drop it in and nothing else changes.
- `lib/enquiry.ts` + `app/api/enquiry/route.ts` → the CRM/email integration point.
- `data/amenities.ts` → replace the labelled demo testimonials with verified buyer quotes.
- `data/story.ts` / `data/faqs.ts` → the property-story chapters and the developer-level FAQ answers. The
  configuration, price, location, stock and viewing questions are generated from the project record, so
  they need no editing when a price list changes.

## WhatsApp

Every WhatsApp CTA composes its message at runtime from whatever the visitor has told us — project,
residence, specific unit, budget, purpose, timeline, viewing slot, contact preference. See
`lib/whatsapp.ts`: `buildWhatsAppMessage()` + `whatsappUrl()`. Nothing is hardcoded to a single
message, and the qualification funnel shows the exact message it will send before you send it.

## Motion and accessibility

- House easing is `cubic-bezier(0.16, 1, 0.3, 1)`; durations run 0.5–1.5 s. No bounce, no confetti.
- `prefers-reduced-motion` is respected: the 3D scene and scrub-linked motion fall back to static
  media, the preloader is skipped, and reveals resolve immediately.
- Native radio groups drive the funnel, the room index is the accessible surface for the plan
  drawing, tabs use proper tab semantics, modals trap focus and restore it, dialogs close on Escape,
  and there is a skip link plus visible focus rings.
- Body copy and metadata use the `--text-dim` / `--text-faint` tokens, which clear 4.5:1 on the ink
  surface. Interactive targets are ≥ 44 px on touch; the mobile conversion bar respects safe-area
  insets and steps aside on the booking page.

## Performance

- The 3D scene is client-only, code-split, and pauses its render loop when off-screen; a device
  without WebGL gets the plate sequence instead. On a phone it renders at a lower resolution, drops
  multisampling, and the supplied model is loaded with the expensive material features
  (transmission, clearcoat) simplified away.
- The model ships compressed — meshopt geometry and WebP textures, a 46 MB source export reduced to
  10 MB — and nothing is fetched until a HEAD check says the file is actually there.
- Above-the-fold imagery loads eagerly; everything else is lazy with explicit aspect boxes, so no
  section reflows as the page fills in.
- Images are pre-optimised to 1500 px (≈5.7 MB for the full set); the hero film is 1.6 MB.
- Scroll work is rAF-throttled and driven by refs — no per-frame React re-renders, and the hero's
  pointer-depth loop stops as soon as the offset has settled instead of running for the life of the
  page.
- The hero is a still image above the fold (`priority`, so it is the LCP), with the film only mounted
  once it is decoding and only played while it is on screen.

## Demo disclosure

Inventory, prices, testimonials, RERA numbers and contact details are illustrative demo content and
are labelled as such in the UI where it matters. The footer carries a demo disclaimer.
