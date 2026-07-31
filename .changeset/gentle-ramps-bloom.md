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
- The SVG sweep drew every design in a 300px box, so a square grid gave cells
  at an exact integer size — and integer cell boundaries hide the deviation
  that dense hard edges show at fractional ones, which is what the editor
  actually renders (60.66px cells at the default 6x9 grid). `SVG_CELL` and
  `SVG_GRID` now let the sweep reproduce that condition. Under it the whole
  shipped catalogue moves into a 0.5-1.8% band wherever a design draws many
  hard edges per cell, batch 11 included; `docs/svg-export.md` records the
  numbers and what the 0.4% batch budget does and does not claim.

That check found one real defect class in this batch: repeating *smooth* ramps
alias badly once their period falls to a few pixels. `softbands` measured 4.8%
and `rampband` 6.0% at a 12% period on a small cell. Widening the periods so a
cell holds a few repeats rather than a dozen took them to 0.15% and 0.14%, and
made the designs more legible at small sizes into the bargain.

`stepramp` and `framecut` keep documented per-artwork headroom in the e2e for
the same reason `glyph` already does — several full-width hard edges per cell,
landing mid-device-pixel at the editor's default grid.
