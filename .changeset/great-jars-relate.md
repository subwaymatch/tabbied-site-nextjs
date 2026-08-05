---
'tabbied': minor
---

Remove the `contain` fit and the Symmetry design, so every pattern in the
catalog is a cell-tiled grid.

`contain` only ever made sense for a grid-less composition, and Symmetry was
the only one — 1 of 254 designs, and the sole pattern without a `grid` option.
For everything else, letterboxing drew the pattern's *authored* grid on the
default square canvas: a `10x15` design came out with 80 × 53 cells, visibly
oblong next to the same design under `grid` or `cover`. Adapting the render
box the way `cover` does wouldn't have fixed it either, because `grid` already
fills the box exactly with square cells and no bars — there is no version of
`contain` that beats `grid` for a tiling design.

Breaking changes:

- `fit="contain"` now falls back to the pattern's default with a console
  warning explaining the migration. Use `grid`, or `cover` with an
  `aspectRatio` on the box to letterbox at a ratio you choose.
- The `symmetry` preset is gone from `tabbied/patterns` and the catalog, which
  goes from 254 designs to 253.
- `coverRender.cropTop` is gone (Symmetry's gallery card was its only user),
  along with its `data-cover-render` wire form — `800x800+0.48` no longer
  parses, `800x800` still does.
- `fitRenderToBox()` no longer takes a `mode` argument; it always covers.
