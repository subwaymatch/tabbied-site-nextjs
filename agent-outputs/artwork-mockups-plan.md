# Proposal: product & environment mockups that embed real Tabbied artworks

Status: **plan only — nothing in this document has been run yet.** It extends
the pipeline in `docs/image-pipeline.md` to a new kind of image: a mockup
where a Tabbied pattern appears *inside* the photograph — a Swiss-style poster
on a gallery wall, a pressed-powder compact with the pattern on its lid, a
tote, a mug, wrapping paper, a book jacket.

The existing pipeline asks GPT Image 2 to imagine scenes *near* our palettes.
Mockups are different: the pattern in the image must be **our actual
artwork**, not the model's impression of one. That changes the workflow in
one fundamental way — every mockup starts from a deterministic render of the
real design, and the generation step becomes an **image-to-image edit**, not
a text-to-image generation.

## Fidelity tiers — choose per mockup, cheapest exact option first

| Tier | Technique | Pattern fidelity | Use for |
|---|---|---|---|
| 0 | DOM/CSS composite (what the showcase pages already do) | exact, live | screens, UI, flat panels on the page itself |
| 1 | Generate a scene with a **blank frontal surface**, then composite the real render onto it with `sharp` | exact, pixel-true | straight-on posters, framed prints, flat packaging faces, phone/monitor screens inside photos |
| 2 | GPT Image 2 **edits endpoint** with the real render as an input image | approximate (model redraws it) | perspective and wrapped surfaces: an angled wall poster, a compact lid, fabric, a mug, a box seen in three-quarter |

Tier 1 exists because it is both cheaper and *better* wherever it applies: a
prompt that asks for "a blank white poster in a thin oak frame, photographed
perfectly straight on, the poster face an undistorted rectangle, soft even
gallery light" gives us a flat rectangle we can locate (fixed aspect, centre
of frame) and fill with the true render — no fidelity loss at all. Reach for
tier 2 only when the surface bends, tilts, or wraps.

## Step 1 — deterministic artwork renders

New script, `scripts/render-artwork.mjs`: given `{design, palette, seed,
options, fit, pixels}`, produce `generated-images/refs/<id>-ref.png`
(gitignored, like all candidates).

- **Preferred path: native SVG export.** `doodleToSvg` from
  `tabbied/svg-export` converts the rendered doodle to true vector SVG;
  rasterise it with `sharp` at 2048 px so the edit model sees crisp geometry.
  Caveats inherited from the exporter: the four `svgExport: false` designs
  (coil, spectrum, pinwheel, wedge) can't take this path, and filter-based
  effects (blur/glow) degrade — prefer clean-SVG designs for mockups.
- **Fallback: element screenshot.** For excluded designs, render the live
  element and screenshot it with Playwright — `scripts/svg-parity-sweep.mjs`
  already does exactly this and is the pattern to copy.
- Bold, larger-scale geometry survives the tier-2 redraw; fine stipple,
  moiré and grain fields will mush. Keep a shortlist of mockup-friendly
  designs (strong shapes, ≤6 colours) and render them at a cell density that
  keeps individual features > ~20 px in the reference.

## Step 2 — authoring: same JSON, one new field

Mockup prompts live in `data/image-prompts.json` like every other image, in a
project whose style fits the output ("interior photograph", "product
photograph"), plus one addition on the prompt (or set):

```jsonc
{
  "id": "poster-cascade-gallery",
  "project": "artwork-mockups",
  "slot": "poster",
  "artwork": { "design": "cascade", "palette": ["#F0EAD6", "#264653", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51"], "seed": "mk1", "pixels": 2048 },
  "subject": "a large framed poster hanging on a white gallery wall, seen at a slight angle, morning side light, a wooden bench below"
}
```

The presence of `artwork` routes the prompt through the edits flow; the
palette is the same array the pattern uses everywhere else (one copy, as
always). `cutout` keeps working unchanged — a compact generated on a neutral
seamless can be cut out and placed back on the *live* version of the same
pattern on a page, which is the strongest demo this whole system can make.

## Step 3 — generation via the images *edits* endpoint

`POST /v1/images/edits`, **multipart form** (not JSON): `model=gpt-image-2`,
`image` = the reference PNG, `prompt`, `size`, `quality`. Response carries
base64 like the generations endpoint.

Planned prompt shape — the instruction that does the work is the fidelity
clause:

> A product photograph of a round pressed-powder compact with a polished
> enamel lid, three-quarter view. **The lid is printed with exactly the
> provided pattern, reproduced faithfully — same colours, same geometry —
> wrapped naturally over the lid's curve with its lighting.** The compact
> stands alone on a plain neutral light-grey seamless backdrop, evenly lit,
> with no cast shadow and nothing else in frame. No text, letters, numbers,
> or logos.

Operational differences from the batch flow, to build into the script:

- **Not batchable.** The Batch API takes JSONL bodies; edits is multipart.
  So mockups run through a `sync`-style path with bounded concurrency
  (3–4), which is fine at mockup volumes (a handful per project). Same
  retry policy: retries on idempotent GETs only, never on the paid POST.
- **Confirm on the first run** (parameters the docs will pin down once
  exercised): whether `gpt-image-2` edits accepts `input_fidelity: "high"`
  (worth sending if accepted — it biases the model toward preserving input
  detail), the exact per-image input-token cost, and whether `quality: low`
  holds enough pattern structure or mockups want `medium` (at edit volumes
  the difference is still cents).
- Expectation to hold: tier 2 output is a *faithful impression*, not a pixel
  match — palette can drift a shade. That is acceptable precisely because
  every page also shows the exact pattern (live css-doodle or tier 0/1
  composites) right next to it.

## Step 4 — tier-1 composites (`scripts/composite-mockups.mjs`)

For frontal surfaces: generate the blank-surface scene through the normal
pipeline (it is just a prompt with a "blank poster/box face, photographed
perfectly straight on" subject), then composite:

1. Locate the blank rectangle — by construction it is axis-aligned; author
   the crop box in the prompt entry (`"surface": {left, top, width, height}`
   as fractions) after eyeballing the candidate once.
2. `sharp(scene).composite([{ input: renderResizedToBox }])`, with a soft
   multiply of the scene's own shading if the surface isn't evenly lit
   (start without; add only if flat-looking).
3. The result enters the normal promote → manifest → `<Figure>` path.
   Regenerating the scene re-runs one composite; the render input is
   deterministic, so diffs stay one WebP + one manifest line.

## Worked examples

**Swiss-design poster on a wall** — two variants:
- *Straight-on (tier 1)*: blank-poster scene + exact composite. The poster's
  generous margins and title line are added in the DOM if the page needs
  them (text never gets baked).
- *Angled gallery shot (tier 2)*: `cascade` or `ziggurat` render as input;
  prompt an interior photograph with the fidelity clause and a slight
  viewing angle; scene palette anchored to the artwork's own hexes so wall,
  bench and light agree with the pattern.

**Makeup product (tier 2 + cutout)**: `fluting` or `ogee` render as input;
compact lid carries the pattern; `cutout: true` with the standard neutral
backdrop; the page then seats the cut-out on the live pattern. A companion
scene shot (compact open on marble beside a brush) stays `cutout: false`.

## Review gate

Before promoting any mockup, view it beside the true render (same palette,
same seed): check geometry (did the model invent cells?), palette drift, and
scale (pattern features neither ant-sized nor billboard-sized for the
object). Reroll tier 2 failures — at these volumes a reroll costs less than a
cent — and demote to tier 1 any surface that keeps failing.
