---
'tabbied': minor
---

Add 55 artworks (gallery orders 1200+) that export as native SVG with no
caveat: no `svgExport: false`, no `svgExportNote`, and no converter warning.
They come from twelve families — splits, stripe fields, hard-stop conic
sectors, rings, chamfers, border-radius forms, bars, wedges, dot fields,
overlaps, mask intersections and smooth fades. Every one is verified against
its live render pixel-by-pixel by
`scripts/artwork-gen/validate-svg-batch11.mjs`, which fails on a throw, on any
warning, or on a pixel diff above a budget tighter than the shipped one.

Fix two SVG-export geometry bugs that only showed on elements with a border,
where the border box and the padding box differ:

- an absolutely-positioned `::before`/`::after` resolved its offsets against
  its host's border box instead of the padding box (and a static one was
  centred in the border box rather than the content box), so pseudo-elements
  inside a bordered box exported displaced by the border width;
- a `background-image` layer used the border box as its positioning area
  instead of the origin box (`background-origin`, padding-box by default), so
  percentage stops and tile sizes on a bordered box resolved against the wrong
  size.

Both are no-ops for borderless elements, which is every artwork in the
catalogue.

Retire the `Wireframe` artwork (batch 9). Its slug stays reserved so the name
is never reused, and the batch-9 designs that followed it shift down one
gallery position.

Stop the artwork generators from silently dropping SVG-export metadata. The
tiers introduced with native export were written straight into the generated
JSON, but every batch generator rewrites the files it owns from its
definitions — so regenerating a batch erased them, turning a design that
cannot be exported into one that offers a broken download. The tier now lives
in each batch's definitions and is emitted by its generator, and the three
tier lists are pinned by a unit test so any future loss fails the build.

Two related generator hazards fixed at the same time: `generate-batch10.mjs`
claimed every gallery order above 1100 and so deleted all of batch 11, and
`generate-batch4.mjs` read the pre-monorepo artworks path and could not run at
all. `generate-artworks.mjs` (batches 1-3) now refuses to run — its
definitions predate 105 retirements and an unrelated redesign of `tetro`.
