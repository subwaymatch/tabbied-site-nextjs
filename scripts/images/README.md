# Showcase image batch pipeline

The showcase sites (`public/samples/*` and `/showcase/*`) render every card,
alternating row and lookbook cell as a labelled placeholder holding a ready made
GPT Image 2 prompt. These four scripts take those prompts through the OpenAI
Batch API and drop finished images into `public/images/showcase/`.

Batch runs at half the synchronous price against a 24 hour completion window,
which suits a one shot job of ~175 images.

## Run it

```bash
npm run build            # refreshes out/showcase/<slug>/index.html
node samples/generate.mjs  # refreshes public/samples/<dir>/index.html

export OPENAI_API_KEY=sk-...

npm run images:extract   # 1. prompts -> .batch/prompts.json
npm run images:build     # 2. manifest -> .batch/batch-input.jsonl
npm run images:submit -- --watch   # 3. upload, open batch, poll to completion
npm run images:import    # 4. download, recompress, write public/images/showcase
```

Working files live in `scripts/images/.batch/` and are git ignored.

## 1. extract-prompts.mjs

Prompts are authored in three places (`components/showcase/showcaseContent.ts`,
`components/showcase/showcaseSections.ts`, `samples/lib/static-sections.mjs`),
but both stacks converge in the rendered HTML: every placeholder is a
`<figure class="imgph" data-image-prompt="...">` carrying the final composed
string, palette clause included. This reads the built pages so there is only one
parser to keep honest.

Each record gets an id of `<stack>__<site>__<slot>-<index>`, for example
`static__03-meridian__gallery-2`. That id is the `custom_id` sent to the API and
the output filename, so results route themselves back to slots.

Identical prompts collapse to one generation, with the extra ids recorded as
`aliases` and copied from the shared render at import time.

Slot aspects come from the layout (`4/3` cards and rows, `1/1` gallery cells,
`4/5` for every fourth one) and map to the nearest size GPT Image offers. The
layouts crop with `object-fit: cover`, so nothing is stretched to fit, the same
rule the Tabbied artworks follow.

## 2. build-batch.mjs

Writes the JSONL request file. By default it only includes prompts with no image
on disk yet, so reruns are cheap and additive.

```bash
node scripts/images/build-batch.mjs --all             # regenerate everything
node scripts/images/build-batch.mjs --only 05-sunday-press
node scripts/images/build-batch.mjs --quality medium
node scripts/images/build-batch.mjs --endpoint responses
```

`--endpoint responses` is the fallback if `/v1/images/generations` is not on the
Batch endpoint allowlist: it sends the same prompt through `/v1/responses` with
the `image_generation` tool, which returns the same base64 payload one level
deeper. The import step reads both shapes.

## 3. submit-batch.mjs

Uploads the JSONL with `purpose: "batch"`, opens a 24h batch, and records the id
in `.batch/state.json` so polling survives a closed shell.

```bash
node scripts/images/submit-batch.mjs --watch --interval 30
node scripts/images/submit-batch.mjs --check
```

Caps for one batch file are 50,000 requests and 200 MB; the builder warns before
you hit either.

## 4. import-batch.mjs

Decodes each result (GPT Image always answers base64, never a URL), resizes to
roughly 2x the widest rendered slot and writes WebP into
`public/images/showcase/`. With `output: 'export'` there is no `/_next/image`
optimizer at runtime, so this mirrors what `scripts/optimize-images.mjs` does for
the marketing images.

Individual requests can fail without failing the batch, usually a content filter
trip. Those ids are listed on stdout and in `.batch/imported.json`; rerunning
`images:build` picks up exactly the missing ones.

## Swapping placeholders for images

Not wired up yet. Two touch points when you want it:

- `components/showcase/ImageCard.tsx`: take an optional `src` and render an
  `<img>` with `object-fit: cover`, keeping the copy button as an overlay.
- `imgCard()` in `samples/generate.mjs`: the generator runs in Node, so
  `fs.existsSync()` against `public/images/showcase/<id>.webp` can pick between
  the image and today's prompt card at build time.

Both need the same id the extractor derives, so keep the slot ordering stable.

## Environment

- `OPENAI_API_KEY` is required by steps 3 and 4.
- `OPENAI_API_BASE` optionally points at a compatible gateway.
