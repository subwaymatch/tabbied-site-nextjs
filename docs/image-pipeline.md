# Showcase imagery: GPT Image 2 (low) → Kie/Recraft cut-outs → committed WebP

How the imagery on the `/showcase/…` sites is produced, reviewed, and
committed. This documents the pipeline as implemented in this repo; the
scripts live at the repo root under `scripts/`, and are independent of the
older `scripts/images/` pipeline that feeds the `/samples` sites.

```
  data/image-prompts.json        ← 1. author the PROJECT (palette + style), then its prompts
            │
            ▼  scripts/generate-images.mjs      (OpenAI Batch API, gpt-image-2, quality: low)
  generated-images/<id>.png      ← 2. candidates, gitignored, local scratch
            │
            ├──────────────── cutout: false ───────────────┐   (a scene: hero photo,
            │                                              │    interior, landscape)
            ▼  scripts/remove-background.mjs               │
  generated-images/<id>-cutout.png  ← 3. only for cutout: true
            │    (an object: product, portrait, prop)      │
            ▼                                              ▼
            └──────────► scripts/promote-images.mjs  (sharp → WebP q92)
  public/images/sites/<id>[-cutout].webp ← 4. COMMITTED. This file IS what browsers download.
  lib/generated/images.js                ←    manifest: slug → {hash, width, height}
            │
            ▼
  <Figure slug="…" />               ← 5. components/Figure.tsx, composited over a Tabbied pattern
```

Two properties define the pipeline:

- **An image is encoded exactly once and exists in git exactly once.** The
  promoted WebP is the served byte stream — no build-time re-encode, no source
  copy, no second lossy pass.
- **Background removal is per-image, not global.** Whether an image gets a
  cut-out is a property of the *prompt*, declared in the JSON, and it drives
  every downstream step: selection for removal, which variant gets promoted,
  and the error when a cut-out is missing.

## Prerequisites

| Variable | Used by | Where to get it |
|---|---|---|
| `OPENAI_API_KEY` | generation | platform.openai.com |
| `KIE_API_KEY` | background removal | kie.ai |

`generated-images/` is gitignored — only the promoted
`public/images/sites/*.webp` and the manifest are committed.

## Authoring prompts (`data/image-prompts.json`)

Every field resolves through a cascade — **prompt → set → project →
`meta.defaults`**, first hit wins — so shared decisions are written once:

- A **project** is one showcase site: its `style` (one per project), its
  `palette` (+ `paletteMode`), its default `quality`/`size`/`cutout`.
  The palette hexes are the same ones the site passes to `TabbiedArtwork`,
  so pattern and imagery stay in one family.
- A **set** groups images that must read as one series — a team-portrait grid,
  a product line — by pinning the shared sentences (crop, light, backdrop,
  lens) and re-anchoring the palette for that medium. Generate a whole set in
  one batch; six independently-written portraits will never grid together.
- A **prompt** carries only what is specific to one image: `id`, `project`,
  optional `set`/`slot`/`size`, and the `subject`.

Two palette modes:

- `hex` — flat graphic styles (risograph, flat vector, isometric, gouache):
  the palette is rendered as a literal ink list, "use these colours and no
  others".
- `scene` — photographic styles: each hex is anchored to a **material**
  ("golden baked crust", "shell jackets and rope accents"), because a bare hex
  has nothing to attach to in a photograph. When a set changes medium
  (portraits inside a photo project), it re-anchors the same hexes with new
  `as` notes — never new colours.

Rules that keep the results usable:

- `cutout: true` for an **object** (product, portrait, prop) — something with
  a silhouette that will sit *on* a Tabbied pattern. `cutout: false` for a
  **scene** — cut out a scene and you get ragged edges or a ghost.
- Every cut-out prompt inherits a `backdrop` sentence: plain, **neutral**
  light-grey seamless, evenly lit, nothing else in frame. Never a palette
  colour (matting leaves a fringe of backdrop in the edge pixels — neutral
  grey reads as a soft edge, a saturated colour reads as an outline), and
  **never a drop shadow** (it gets stripped or survives as a grey blob — the
  shadow is CSS at composite time).
- `"No text, letters, numbers, or logos."` is appended to every prompt by
  default (`noText`). The model bakes garbled lettering otherwise; brand
  names, labels and headlines belong in the DOM, over the image.
- One subject per cut-out image. Concrete nouns beat adjectives. For
  photographs, name the shot ("three-quarter view", "from directly above").

## Quality: `low`, deliberately

This collection is generated at `quality: "low"` throughout (the
`meta.defaults`). At 1536×1024 that is 158 output tokens ≈ **$0.0024/image**
on Batch pricing — the full 159-image collection cost ~$0.42 and generated in
about six minutes, with zero failed requests. `low` is visibly fine for
graphic styles and for photos placed at card size; if a specific hero or
portrait ever needs more, set `quality: "medium"` on that project or set (it
is ~9× the cost, still cents) rather than globally.

Accepted sizes: `1536x1024` (hero/landscape), `1024x1536` (portrait/tall
product), `1024x1024` (square product/detail). Never `auto`.

## Running it

```bash
# 1. cost + prompt review (no API calls) — read the rendered prompts
node scripts/generate-images.mjs dry-run --project neve-gelato

# 2. generate via the Batch API (~50% cheaper). Three separate invocations —
#    never one long-lived process; batch ids persist in generated-images/last-batch.json
node scripts/generate-images.mjs submit --project neve-gelato
node scripts/generate-images.mjs status          # repeat until "completed"
node scripts/generate-images.mjs download

# 3. background removal — reads the JSON, processes ONLY resolved cutout:true
node scripts/remove-background.mjs --project neve-gelato --concurrency 8

# 4. REVIEW cut-outs over a real pattern at full size (fringing and value
#    collapse are invisible at thumbnail size), then promote:
node scripts/promote-images.mjs --project neve-gelato

# 5. verify + commit images and manifest TOGETHER
npm run build:images        # must be a true no-op on a clean tree
git add public/images/sites lib/generated/images.js data/image-prompts.json
```

Regenerating one image reuses its slug — edit the prompt's `subject`, then
`submit/status/download --only <id> --force`, re-run removal (if a cut-out)
and promote `--only <id>`. The commit is one WebP plus one manifest line, and
the manifest hash doubles as the cache-buster (`?v=<hash8>`), so returning
visitors get the new bytes despite immutable caching.

## Background removal specifics (Kie.ai → `recraft/remove-background`)

Selection is data-driven: the script reads `data/image-prompts.json` and
processes only prompts whose resolved `cutout` is `true` and whose original
PNG is on disk. Four API details the script encapsulates (each learned the
hard way):

1. The model accepts a **public URL only** — each PNG is first pushed through
   Kie's own upload endpoint (free, auto-deleted after 24 h).
2. Both Kie hosts sit behind Cloudflare and reject any request without a
   browser `User-Agent` — a bare `403 error code: 1010` that reads exactly
   like an auth failure and is not.
3. The account rate limit is **20 new generation requests per 10 s**, and the
   excess is rejected with 429 *without being queued*. A shared
   sliding-window limiter admits `createTask` at 18/10 s, so `--concurrency`
   can be raised freely; a 429 waits out a full window.
4. `resultJson` in the status response is a JSON **string**, not an object.

Each removal costs ~1 Kie credit and ~3 s. Every download/status GET is
wrapped in transient-failure retries; the POSTs that create work are never
blanket-retried (a silent re-send doubles the bill).

## Promotion and serving

- `sharp(...).webp({ quality: 92, alphaQuality: 100, effort: 6 })` — q92
  because this file *is* the artifact, `alphaQuality: 100` because every
  cut-out lands on a busy pattern where a lossy alpha edge shows. PNG→WebP
  runs ~14× smaller (~130 kB for a 1536×1024).
- Promotion follows the flag: `cutout: false` → `<id>.webp`; `cutout: true` →
  `<id>-cutout.webp` only (`--keep-original` opts the opaque original in).
  A `cutout: true` prompt with no cut-out on disk is an **error**, not a
  skip — that combination is what silently leaves a stale committed image
  after a regeneration.
- `scripts/build-image-manifest.mjs` writes `lib/generated/images.js`
  (committed): slug → `{hash, width, height, formats}`. It is incremental and
  a true no-op on a clean tree, so it is safe in `prebuild`/`predev`
  (`npm run build:images`).
- `components/Figure.tsx` renders a plain `<img>` (never `next/image` — the
  bytes are final; a request-time re-encode would be a second lossy pass)
  with intrinsic `width`/`height` from the manifest (no CLS) and the hash
  cache-buster. Pass `cutout` for cut-outs and seat them with a CSS
  `drop-shadow` in the page's own stylesheet.

## Composition rules (how the images meet the patterns)

The composite is the whole point: **the Tabbied pattern is the surface, and a
cut-out object sits on it.** Scenes stay full-bleed with the pattern living
*next to* them (a split hero, a section band, a card back) — never layered
under a scene, which fights it for the same job. Portrait grids over pattern
tiles are the strongest use of the pipeline; keep every portrait in one `set`.

## Gotcha checklist

1. `gpt-image-2` **cannot emit transparency** — `background: "transparent"`
   is a 400, and asking in the prompt paints a fake checkerboard. Removal is
   always a separate model call.
2. Batch output files embed base64 images and run to gigabytes — the scripts
   stream them line by line; don't "simplify" that away.
3. Expensive failures happen on the **retrieval** side, after the paid work.
   Keep the retry wrappers on every GET.
4. A palette-coloured backdrop or a baked drop shadow ruins a cut-out (§ above).
5. Faces are where `low` shows first; portraits are the first candidates for a
   per-set `quality: "medium"`.
6. Two copies of a palette drift — the JSON project palette and the page's
   `TabbiedArtwork` palette must stay byte-identical hexes.
7. Filter by `--project`, not by id-prefix regex.
8. The manifest is one generated file; two branches adding projects conflict
   there — take either side and re-run `npm run build:images`.
