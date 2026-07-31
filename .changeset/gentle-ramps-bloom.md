---
'tabbied': minor
---

Add 200 artworks (gallery orders 1400-1599) that export as native SVG with no
caveat: no `svgExport: false`, no `svgExportNote`, and no converter warning.
The catalogue goes from 222 designs to 422.

88 of the 200 are built on **smooth gradients**, which is the part of the
supported CSS subset the catalogue had barely used. Eight families: straight
fades over a solid ink, two inks handing over through a blend, dot fields and
ruled fields thinned by a ramp, radial glows and vignettes, ramps shut inside
a cut shape, repeating and posterized ramps, and shapes whose outline is a
ramp rather than a line. Every one is a mask over an ordinary
`background-color`, so a reseed morphs through the colour instead of snapping
to it, and the faded end is a real hole — set the background slot to
transparent and the sheet shows through a soft edge exactly as it does
through a hard one.

That is also the tier-4 way to draw effects that otherwise land in the
caveated tier: a glow written as radial-gradient stops exports as a
`<radialGradient>`, where `filter: blur()` or `box-shadow` exports as an SVG
filter (which is why `bokeh`, `neon`, `lantern` and `terrain` carry notes).

The other 112 work in the hard-edged vocabulary — splits, chamfers, hard-stop
conic sectors, rings, bars, dot fields, lattices, frames, wedges, overlaps,
mask intersections and border-radius forms.

Every design is verified against its live render pixel-by-pixel by
`scripts/artwork-gen/validate-svg-batch12.mjs`, which fails on a throw, on any
warning, or on a pixel diff above a budget tighter than the shipped one.

Supporting changes to the artwork tooling, all no-ops for the shipped
catalogue:

- The authoring lints batch 11 introduced now live in
  `scripts/artwork-gen/artwork-lints.mjs`, and the two browser gates in
  `svg-sweep.mjs` / `render-sweep.mjs`, shared by both batches instead of
  copied. Regenerating batch 11 produces byte-identical files.
- `generate-batch11.mjs` claimed every gallery order from 1200 upwards, so it
  would have deleted all of batch 12 — the same hazard `generate-batch10.mjs`
  had for batch 11. It is now bounded to 1200-1399, and batch 12 bounds itself
  to 1400-1999.
- The rendering gate sampled computed styles after a fixed timeout, so on a
  loaded machine it could read one of its two passes mid-transition and report
  whole pages of designs as painting with `color0`. It now waits for the
  reading to stop changing.
