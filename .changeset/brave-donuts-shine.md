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
