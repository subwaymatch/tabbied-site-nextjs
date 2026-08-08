# A3 — The branding service: brand kits from Tabbied + an LLM

A strategy, not an implementation. The product in the mockups: a small-business
owner answers a few questions ("Let's shape your brand"), gets three distinct
**brand directions** (name-tagged palette + typography + pattern + a mini
website preview each), picks one, and receives a **brand kit** — colors,
type, pattern, a real website, business cards, social ads, print pieces —
with everything downloadable and everything editable.

Read together with: `platform-auth-ai-plan.md` (A4 — every LLM call here goes
through that gateway; kits persist as its `project` rows),
`editable-templates-plan.md` (A1) and `site-builder-plan.md` (A2 — the kit's
"website" *is* a template plus an edits document, and its Edit button opens
the A2 editor).

---

## 1. The stance: the LLM chooses, Tabbied renders

The single most important design rule: **the LLM never produces pixels, CSS,
or css-doodle code. It produces a small, schema-constrained JSON document
whose every field is either bounded by a vocabulary we publish or validated
by rules we already enforce elsewhere.** Tabbied's own machinery — the 295
patterns, the palette model, the templates — turns that document into
everything visible.

This is what makes the product reliable enough to ship: a direction can be
odd, but it cannot be *broken*, because nothing in it is free-form. It is
also what makes it distinctly Tabbied rather than a generic AI-branding
clone: the pattern language is the moat, and the catalog's closed metadata
vocabulary (`tags`/`mood`/`density`/`goodFor`, validated by codegen) was
built for exactly this kind of programmatic narrowing.

## 2. The brand document

The unit everything operates on, versioned like the A1 spec:

```jsonc
{
  "specVersion": 1,
  "business": { "name": "Good Realty", "kind": "Real estate company" },
  "adjectives": ["minimal", "trusted", "architectural"],
  "voice": "Minimal, architectural and quietly confident.",   // the kit tagline
  "palette": { "colors": ["#0B2545", "…"],                     // background first
                "names": ["Navy", "Teal", "Mist", "White"] },
  "typography": { "pairId": "editorial-serif" },               // curated enum
  "pattern": { "slug": "damier", "palette": [...], "options": {...},
                "seed": "gr-1", "fit": "grid" },                // a PatternConfig
  "copy": { "headline": "Homes that hold your life.",
             "subhead": "…", "primaryCta": "Find a home", "secondaryCta": "…" },
  "website": { "templateSlug": "…", "edits": { /* A1 edits document */ } },
  "assets": { /* generated asset records, §6 */ }
}
```

Three constrained vocabularies feed it:

- **Adjectives** — a curated list (the chips in the mockups: minimal, warm,
  bold, crafted, trusted, playful, …) with an authored mapping onto the
  catalog's `mood`/`density` vocabulary and onto typography/palette
  temperature. The user-facing words stay brand-shaped; the closed catalog
  words stay queryable. "Suggest for me" is a small LLM call that picks from
  the same list — never invents entries.
- **Typography pairs** — a new curated module in the `paletteLibrary.ts`
  tradition (`lib/fontPairs.ts`): ~15–20 vetted Google Fonts pairings, each
  with an id, display/body roles, the `<link>` href, and its own adjective
  tags ("Editorial serif + clean sans"). The LLM selects a `pairId`; nobody
  ships an unvetted font stack.
- **Patterns** — chosen from **server-assembled candidates**, not from the
  raw 295: the Worker maps the adjectives to catalog filters, queries the
  deployed `catalog.json` (the `search_designs` filter logic reused as a
  library function — `catalogTools` is already host-agnostic), and puts the
  candidate summaries *in the prompt*. The LLM picks and parameterizes;
  option values are validated against the catalog's per-option
  ranges. One skew to design for, measured from the current corpus: the
  combinations a brand hero wants most (`sparse`, `hero-background`) are a
  thin slice of the catalog, so candidate assembly must relax filters rather
  than AND itself into the zero-result path — the tools' own
  `filtersIndependently` zero-hit response is the ready-made repair signal.

Palettes are the one field the LLM genuinely authors (hex values), so they
get the strictest programmatic validation — the two rules already written
down in `paletteLibrary.ts`: no ink equal to its background, and at least
one ink at ~3:1 contrast against `color0`. Validated server-side with the
existing `lib/color.ts` machinery; a failing palette is repaired (nudge
lightness) or regenerated, never shipped. A user-supplied brand color
("Navy + teal") enters the prompt as a hard constraint and the validator
pins it exactly.

## 3. The flow, mapped to the mockups

**Step 1 — intake** (`/brand/new`). Business kind (free text), adjective
chips, optional color, optional logo/photo uploads (R2, via A4), optional
"existing materials". Two LLM assists behind "Suggest for me" — both small
`/api/ai/brand-suggest` calls. "Refresh my brand" (the second tab in the
mockups) — deriving the intake from uploaded existing materials with a
vision-capable model — is deliberately a later phase: same document, one
extra extraction step, no new architecture.

**Step 2 — directions.** One `/api/ai/brand-directions` call returns **three
brand documents** (minus website/assets) with distinct named stances
("Shoreline", "Modern Grid", "Warm Editorial") and a `recommended` flag with
a reason. Distinctness is asked of the schema itself (each direction
declares the axis it leans on) rather than hoped for. The cards render
**live, client-side**: swatch row, type specimen, and a mini hero — nav,
headline, CTAs, pattern band — built from the document by a small
`DirectionPreview` component. "Generate three more" re-rolls with the
previous names excluded; a picked direction can still be lightly steered
("warmer", "less dense") by a follow-up constrained call.

**Step 3 — the kit** (`/brand/<id>`). The chosen direction is expanded once
into the full document: the website (§5), the asset set (§6), named colors,
and the voice line. Everything on the kit page is a live render of the
document — there are no stored images of things Tabbied can draw. The page
is the mockups' layout: summary strip (colors / typography / pattern),
website card with Preview and Edit, asset grids, "Review & customize",
"Download complete kit" (§7).

## 4. Where the LLM is used — and where it is not

| Task | Endpoint | Model needs |
|---|---|---|
| Suggest adjectives / complementary colors | `brand-suggest` | small, cheap |
| Generate 3 directions (names, palettes, type pick, pattern pick + params, copy, voice) | `brand-directions` | the main call; structured output, catalog enums in schema |
| Fill website text slots from the brand | `brand-site-copy` (A2's `site-copy` with brand context) | mid |
| "Refresh my brand" extraction | later phase | vision |
| Space/interior concepts | image generation, §6 | image API |

Not LLM tasks, ever: palette contrast repair (deterministic), pattern
rendering, template filling mechanics, asset layout, zip assembly. Each of
those is existing, tested machinery — the service's job is to feed it.

All calls go through the A4 gateway: authenticated, quota-metered, structured
outputs validated twice, streamed where the UI shows progress (directions
generation is the long one, and the mockups' step 2 wants progressive
reveal).

## 5. The website: the A1/A2 bridge

The kit's website is not a screenshot — it is a **template site plus an edits
document**:

1. pick a template: an authored `brandable` shortlist in the template
   catalog (topic affinity + how prominently the pattern carries the design),
   filtered by direction adjectives;
2. generate the edits document: palette roles from the brand palette, the
   pattern slot from `pattern`, text slots via `brand-site-copy` honoring
   each slot's `maxChars`, fonts from the pair;
3. render it in the A2 preview machinery; **Edit** opens `/create/<slug>`
   with the edits document loaded — from here it *is* an A2 project, and
   Download uses A2's client-side export unchanged.

This is the integration that makes the three plans one product: A3 produces
in seconds what A2 lets you refine by hand, in the same format, in the same
editor.

## 6. The other assets

**Composed assets — cards, social ads, signage, printable art.** Each is an
**asset template**: a fixed-dimension, parameterized composition (SVG-first)
taking the brand document — pattern field via the existing native SVG
exporter (`exportSvg`), text and layout as SVG text with the pair's
webfonts. Client-rendered live in the kit grids; exported as SVG (print) and
PNG (raster via canvas from the same SVG). A handful of layouts per category
× palette/pattern variation covers the mockups' "6 designs" honestly.
The SVG export tiers gate print assets: a direction whose pattern is one of
the 4 `svgExport: false` designs (or carries an `svgExportNote`) either
swaps to a raster-only asset path or is steered at candidate-assembly time —
candidate assembly for brand use simply prefers `svgExport.supported`,
which 239 of 295 designs satisfy cleanly.

**Generated imagery — space concepts, lifestyle shots.** The mockups' office
interiors and coffee-shop scenes are image-generation output, not
composition. The repo already has exactly this pipeline offline
(`docs/pattern-mockups.md`, `data/mockup-prompts.json`, `scripts/images/*`)
— the plan reuses its *prompt craft*, but as a runtime call to the
OpenAI-compatible images endpoint through the A4 gateway, brand-conditioned
(palette hexes, materials, mood) and quota-gated separately (image calls
cost real money). This is **phase 3 and degradable**: the kit is complete
and shippable without it; when absent, those grid slots show composed
pattern-mockup frames instead (the `ImageCard` placeholder idiom, but
branded).

## 7. Persistence and the download

A kit is an A4 `project` row (`kind: 'brand-kit'`, the brand document as its
JSON). "Download complete kit" is client-side zip assembly (`fflate`, the
house zip engine): `brand.json`, `colors` (CSS custom properties + `.json`),
pattern exports (SVG + PNG at useful sizes via `exportSvg`/`exportImage`),
each asset in its formats, the website as the A2 export zip, uploaded logo
files, and a generated `BRAND.md` (the guidelines one-pager: voice line,
color roles, type usage, pattern do/don'ts). A designed PDF guidelines
document is a later nicety; `BRAND.md` is the honest v1.

## 8. Sequencing

1. **Brand document + vocabularies** — schema in a shared package
   (`tabbied-brand` or a module inside `tabbied-templates`), `fontPairs.ts`,
   adjective→catalog mapping, palette validator/repair. Testable without any
   LLM.
2. **Directions end to end** — intake UI, `brand-suggest` +
   `brand-directions` on the A4 gateway (A4 step 4), `DirectionPreview`.
   Ships as a compelling standalone toy even before kits exist.
3. **The kit page + website bridge** — needs A1 coverage on the shortlisted
   templates and A2's editor core.
4. **Composed assets** — asset templates, SVG/PNG export paths.
5. **Image-gen concepts + "Refresh my brand" + PDF** — each independent,
   each degradable.

## 9. Risks worth naming

- **Quality variance in the main call.** Mitigations are structural (schema
  + vocabularies + candidate lists shrink the failure space) and iterative:
  keep a fixture set of intakes, snapshot generated directions in review,
  and tune the prompt/mapping tables — the closed vocabulary makes such
  evals cheap to assert against.
- **Font pairing legal/quality drift** — solved by curation (Google Fonts
  only, vetted list), the same reasoning as the palette library.
- **Image-gen cost and latency** — separately quoted, separately quota'd,
  and the kit must read as complete without it (hence degradable slots).
- **The "three more" treadmill** — regeneration is the most abusable loop;
  it shares the directions budget in A4's ledger, and the UI leans on
  steering-a-direction over infinite rerolls.
