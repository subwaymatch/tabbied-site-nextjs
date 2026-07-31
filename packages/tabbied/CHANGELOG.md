# tabbied

## 0.2.0

### Minor Changes

- [#44](https://github.com/subwaymatch/tabbied/pull/44) [`ef1bad4`](https://github.com/subwaymatch/tabbied/commit/ef1bad49dcaf7117df081e6d8bed7ab09ca325aa) Thanks [@subwaymatch](https://github.com/subwaymatch)! - Add 55 artworks (gallery orders 1200+) that export as native SVG with no
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

- [#45](https://github.com/subwaymatch/tabbied/pull/45) [`5106c19`](https://github.com/subwaymatch/tabbied/commit/5106c19a8297d46ca2035c6cea94b85c518d875f) Thanks [@subwaymatch](https://github.com/subwaymatch)! - Add the 19 curated batch-5 artwork presets (gallery orders 414-604). They
  landed in the catalogue shortly after `0.1.0` was published and never carried a
  changeset of their own, so this is the first release note to mention them:
  Bobbin, Bowl, Chamfer, Cinch, Cleat, Diadem, Dogtooth, Ell, Frond, Lobe,
  Loophole, Notchblock, Octagon, Quaver, Quoit, Sail, Sliver, Spark and Wavelet.

  Each draws one shape per cell from a hand-picked outline — a chamfered square,
  a quarter-disc, a squared ring, an eight-point spark — and reseeding re-rolls
  the orientation or the ink rather than scattering position and angle. Every one
  takes the catalogue's two standard controls, `grid` (columns and rows) and
  `frequency`.

  None of them is an SVG-export exception: no `svgExport: false` and no
  `svgExportNote`, so all 19 offer an unqualified "Download SVG".

- [#43](https://github.com/subwaymatch/tabbied/pull/43) [`12ddf44`](https://github.com/subwaymatch/tabbied/commit/12ddf44adf1359676d66465f6c042d0a19591e14) Thanks [@subwaymatch](https://github.com/subwaymatch)! - Add native SVG export. `controller.exportSvg()` and the React handle's
  `exportSvg()` convert the rendered artwork into a true vector SVG — real
  shapes, gradients, clips and masks, no `<foreignObject>` — so exports open in
  design tools and scale to any resolution. Pass `{ download: true }` to save a
  `.svg` file directly. Designs that paint smooth conic-gradient sweeps (which
  SVG cannot represent) opt out via the new `svgExport: false` definition flag;
  check `supportsSvgExport(artwork)` before offering the option. Blur, glow
  shadows and blend modes export as SVG filter effects and are reported in the
  result's `warnings` (they render correctly in browsers but may degrade when
  imported into some design tools).

  The converter (~21 KB gzipped) stays out of the main bundle: `exportSvg()`
  loads it on demand through a dynamic import, and direct use is available via
  the new `tabbied/svg-export` subpath (`import { doodleToSvg } from
'tabbied/svg-export'`).

  Designs with known export limitations (filter-based effects, documented
  sub-pixel deviations) describe them in the new `svgExportNote` fields on the
  definition and on toggle options, for export UIs to surface before
  downloading.

- [#31](https://github.com/subwaymatch/tabbied/pull/31) [`b57bb03`](https://github.com/subwaymatch/tabbied/commit/b57bb03029f1f9a3321197915da312430108d1b8) Thanks [@subwaymatch](https://github.com/subwaymatch)! - Sizing correctness, off-screen perf, and packaging fixes.

  **Fit modes**

  - `fit="cover"` no longer cuts grid-driven artworks off mid-cell: the render
    box now follows the host's aspect ratio and re-derives its grid, tiling the
    box edge-to-edge with whole, near-square cells. Special layouts (artworks
    without a `grid` option, e.g. Symmetry, or renders with an explicit
    `cropTop`) keep the previous scale-and-crop behavior.
  - `fit="grid"` no longer produces visibly stretched cells: cols/rows are now
    chosen jointly (scored by cell squareness) instead of rounding each axis
    independently, and a cell floor above the box's short edge no longer forces
    a distorted 1×N grid.

  **Performance**

  - `redrawInterval` now skips ticks while the element is outside the viewport
    (built-in IntersectionObserver), so off-screen animated artworks cost
    nothing. `paused` remains as an external gate on top.
  - The unsupported-`fit` console warning fires once per artwork+fit pair
    instead of on every render/resize tick.

  **Fixes**

  - `destroy()` (and fit changes away from cover/contain) restore the host's
    inline `position`/`overflow` styles instead of leaving them mutated.
  - Palette colors and option values are sanitized before being substituted
    into the generated stylesheet, closing a CSS-injection vector via untrusted
    values (e.g. URL-driven palettes).
  - ToggleSwitch options no longer inject the literal string `true` into the
    doodle half of custom definitions.

  **Packaging (breaking)**

  - The core `tabbied` entry no longer re-exports the full preset catalog —
    import presets from `tabbied/artworks` instead. This keeps `createArtwork`
    consumers from carrying all 100+ designs in unshaken environments.
  - Added `default` export conditions, top-level `main`/`types` fallbacks, and
    a `./package.json` export for older resolvers; the raw `artworks/*.json`
    files (unreachable through the exports map) are no longer shipped; source
    maps now inline their sources.

- [#42](https://github.com/subwaymatch/tabbied/pull/42) [`95127ff`](https://github.com/subwaymatch/tabbied/commit/95127ff3b0a15b91b43ae66b393a364a90483bee) Thanks [@subwaymatch](https://github.com/subwaymatch)! - Removed the `awning` artwork.

  `import { awning } from 'tabbied/artworks'` no longer resolves, and `awning` is
  gone from the `artworks` record and from `ArtworkSlug`. There is no drop-in
  replacement — the design is retired rather than renamed. The showcase sites that
  used it now use `louvre` (angled slats) and `fluting`, which sit in the same
  architectural family if you need somewhere to land.

- [#41](https://github.com/subwaymatch/tabbied/pull/41) [`f5eed7c`](https://github.com/subwaymatch/tabbied/commit/f5eed7cc491f847941c1d5d514087737ee71241a) Thanks [@subwaymatch](https://github.com/subwaymatch)! - Add 70 new generative designs and retire 15, bringing the preset catalog to 169.

  **Batch 7 (orders 700+, 24 designs)** works in the idiom of the eleven artworks
  Syung Hong drew by hand: one shape per cell, its outline rolled out of a short,
  deliberately chosen library rather than a continuum, and a single ink sampled
  per cell.

  **Batch 8 (orders 900+, 10 designs)** is organised around css-doodle's own
  generators — `@shape()` walking an equation into a clip-path, `mask: @svg(...)`,
  CSS gradient masks, `@match` on the cell's address, and `mask: @doodle(...)`.

  **Batch 9 (orders 1000+, 23 designs)** inverts the usual relationship between
  cell and canvas. Every batch before it draws a tile and repeats it; these read
  `@x`/`@y` against `@X`/`@Y` and use them to place the cell inside one larger
  picture, so changing the grid changes the resolution of the composition rather
  than the number of copies. It leans on three things no earlier batch used: real
  maths on the cell coordinates (`@sqrt`, `@atan2`), conic gradients — the only
  way to sweep a value round an angle — and SVG _stroke_, for line art rather than
  filled shapes.

  **Batch 10 (orders 1100+, 13 designs)** sits between the two: these motifs are
  bigger than a cell and smaller than the sheet, so the grid stops being a frame
  around each drawing and becomes what the drawing is assembled from. `Sunray` and
  `Spray` cut a conic sector out of the cell so the shape opens from a point;
  `Plait`, `Chain` and `Staple` run a motif from one cell into the next;
  `Fenestrate` and `Perforate` make the drawing the hole; `Arris`, `Haunch` and
  `Abutment` build off the corner rather than the middle; `Frieze`, `Reeding` and
  `Fluting` band across the sheet.

  Fifteen earlier designs are retired (Morse, Daybreak, Shuffle, Domino, Aster,
  Aperture, Zipper, Polaroid, Carousel, Matte, Lens, Ibeam, Tictac, Crosshatch,
  Sawedge); the sample sites and showcase pages that used them now use other
  presets.

  Every design in all four batches is background-independent: no rule paints
  `var(--color0)`, so every gap is real geometry — a mask, a clip-path hole, a
  `frame:` outline, or a gap between elements — and each renders identically over
  any background, including a transparent one.

- [#40](https://github.com/subwaymatch/tabbied/pull/40) [`6c5977b`](https://github.com/subwaymatch/tabbied/commit/6c5977b8b2fc3c18c7f682bda510cd859e759987) Thanks [@subwaymatch](https://github.com/subwaymatch)! - Add 19 ordered, background-independent artwork presets (batch 6).

  Two properties set this batch apart.

  **Ordered.** Where the earlier batches lean on scatter — Confetti, Shard and
  Sprinkles roll a fresh position, size and angle for every cell — nothing here
  is placed at random. Every shape sits on the cell grid, and what varies from
  cell to cell varies by rule: `@match` on the cell's column/row/index, `@pn()`
  cycling a value in order, or `@calc()` ramping a size, angle or bore across the
  canvas. No `@rand()` anywhere. Reseeding re-inks a design without rearranging
  it, so a redraw reads as a new colorway of the same pattern.

  **Background-independent.** A design that knocks holes out of its shapes by
  painting `var(--color0)` only looks right while the background is opaque —
  set the background slot to transparent and those "holes" stop erasing
  anything. So every gap in this batch is real geometry (a clip-path hole, a
  mask, or a gap between shapes) and no rule paints the background color. Each
  design renders identically over any background, including none, which makes
  them usable as overlays and transparent PNG exports.

  The designs: Louvre, Kerf, Damier, Bias, Hurdle, Isocube, Lintel, Lunette,
  Annulus, Ovolo, Cove, Mortise, Rafter, Ogee, Buttonhole, Gutter, Diminuendo,
  Taper and Torsion.

- [#42](https://github.com/subwaymatch/tabbied/pull/42) [`95127ff`](https://github.com/subwaymatch/tabbied/commit/95127ff3b0a15b91b43ae66b393a364a90483bee) Thanks [@subwaymatch](https://github.com/subwaymatch)! - Artworks are never distorted to fit, and the box they render into is now part of
  the API.

  **`fit="stretch"` is removed (breaking).** It was the one strategy that scaled an
  artwork by a different factor horizontally than vertically — keeping the authored
  grid and letting cells deform with the container. Nothing does that any more:
  `grid` re-derives the cell grid so cells stay near-square at any box shape,
  `cover`/`contain` scale a render uniformly, and `fixed` draws at an explicit
  canvas size. Passing `"stretch"` now falls back to the artwork's default fit and
  logs what to use instead.

  **Box props.** An artwork has no intrinsic size, and until now the wrapper had no
  size either — `<TabbiedArtwork artwork={radius} />` rendered a zero-height box
  unless you also passed `style`. The box is now addressable directly, and **fills
  its container by default**:

  ```tsx
  // .panel is 100% wide and 400px tall; the artwork fills it.
  <div className="panel">
    <TabbiedArtwork artwork={radius} />
  </div>

  // Or bound it, with no sized parent involved.
  <TabbiedArtwork artwork={radius} maxWidth={960} aspectRatio={3 / 2} />
  <TabbiedArtwork artwork={radius} height="40vh" maxHeight={520} />

  // Or hand sizing back to CSS.
  <TabbiedArtwork artwork={radius} fill={false} className="hero-art" />
  ```

  - New props: `fill` (default `true`), `maxWidth`, `maxHeight`, `aspectRatio`.
  - `width`/`height` now accept a CSS length as well as a px number, and size the
    box under every fit. Under `fit="fixed"` the numeric form still sets the canvas
    resolution, so existing `fixed` usage is unchanged.
  - They resolve to inline styles on the wrapper, server render included, so the
    box is correct before the artwork mounts — no layout shift.
  - The core API gets the same thing as a pure helper: `resolveBoxStyle(size)`
    returns the CSS to assign to your own host element.

### Patch Changes

- [#39](https://github.com/subwaymatch/tabbied/pull/39) [`b96bf3c`](https://github.com/subwaymatch/tabbied/commit/b96bf3ced44286ed87c955a973496ac40ebf6c6b) Thanks [@subwaymatch](https://github.com/subwaymatch)! - No transition animation on an artwork's first draw.

  Artwork rules carry their own `transition`, which is what makes `redraw()` morph
  one arrangement into the next. On the very first paint there is nothing to morph
  from, so every cell was animating in from its unstyled state: the drawing
  visibly assembled itself over ~400ms, and a page holding many artworks paid for
  thousands of simultaneous transitions while it was still loading.

  `createArtwork` now mutes transitions inside the css-doodle shadow root for the
  first two frames of a newly mounted element, then removes the override. First
  paint lands finished; `redraw()` and every later update animate exactly as
  authored. No API change.
