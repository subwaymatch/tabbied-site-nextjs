---
'tabbied': minor
---

Remove the `contain` fit and the Symmetry design, and collapse the
per-pattern fit-capability model that only existed to serve them.

`contain` only ever made sense for a grid-less composition, and Symmetry was
the only one — 1 of 254 designs, and the sole pattern without a `grid` option.
For everything else, letterboxing drew the pattern's *authored* grid on the
default square canvas: a `10x15` design came out with 80 × 53 cells, visibly
oblong next to the same design under `grid` or `cover`. Adapting the render
box the way `cover` does wouldn't have fixed it either, because `grid` already
fills the box exactly with square cells and no bars — there is no version of
`contain` that beats `grid` for a tiling design.

With both gone, every design is a cell-tiled grid supporting all three
remaining fits, so `fit` is a plain choice rather than a per-pattern
negotiation.

Breaking changes:

- `fit="contain"` is gone. Use `grid`, or `cover` with an `aspectRatio` on the
  box. TypeScript rejects it; `data-fit="contain"` is ignored like any other
  unrecognized value, and the config falls back to `grid`.
- The `symmetry` preset is gone from `tabbied/patterns` and the catalog, which
  goes from 254 designs to 253.
- `resolveFitMode()`, `allowedFitModes()`, `defaultFitMode()` and
  `hasGridOption()` are gone, replaced by the exported `DEFAULT_FIT_MODE`
  constant (`'grid'`). Nothing negotiates capability anymore, so no fit
  request falls back or warns.
- `PatternSizing` loses `allowed`, `default` and `coverRender`; no design
  declared any of them once Symmetry was removed. `minCellPx`, `maxCellPx`
  and `cellMultiple` are unchanged.
- `PatternDefinition.lockAspectRatio` is gone — no design set it, and every
  design adapts to any ratio.
- `coverRender.cropTop` is gone (Symmetry's gallery card was its only user),
  along with its `data-cover-render` wire form — `800x800+0.48` no longer
  parses, `800x800` still does.
- `fitRenderToBox()` no longer takes a `mode` argument; it always covers.
- `catalog.json` designs no longer carry a `fit` object. The three modes are
  the same for every design and are documented once under `usage.fit`.
