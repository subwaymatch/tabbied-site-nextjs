# Grid snapping — why `fit: "grid"` oversizes its canvas

Short version: css-doodle lays its grid out as `repeat(n, 1fr)`. A container
that isn't divisible by `n` puts every cell boundary on a sub-pixel, and the
browser draws a hairline seam at each one. `createArtwork` rounds the canvas
up to a whole number of tracks and lets the host clip the difference.

## The failure it fixes

`fit: "grid"` is the default, and the common way to use it is a field that
fills a section:

```jsx
<TabbiedArtwork artwork={quire} fit="grid" cellSize={120}
                style={{ position: 'absolute', inset: 0 }} />
```

`deriveGridForBox` measures the host and picks `cols`/`rows`. The canvas was
then sized `100% × 100%`, so the tracks came out `hostWidth / cols` — which a
fluid container almost never makes an integer. A 1440px band at 11 columns
gives **130.906px** tracks, and every one of the 10 interior boundaries lands
mid-pixel.

The result is a faint grid of hairlines over the artwork, in the artwork's own
colours or the page background, depending on which way the boundary rounds.
It reads as a rendering bug, not a design.

This was not rare. A sweep of the 36 showcase pages — reading
`getComputedStyle(cssd-grid).gridTemplateColumns` out of each doodle's shadow
root — found **164 fractional grids** before the fix, nearly all of them
full-section background fields.

## The fix

`applyGridSnap` in `core/createArtwork.ts` sets the canvas inline to
`snapSpanToTracks(hostSpan, tracks)` on each axis — the smallest multiple of
the track count that still covers the box:

```ts
Math.ceil(span / tracks) * tracks
```

Three properties matter, and `test/sizing.test.mjs` pins all three:

- every track is a whole pixel (`snapped % tracks === 0`);
- the canvas still **covers** the host (`snapped >= span`), so no strip of the
  container shows through;
- the overflow is under one cell (`snapped - span < tracks`), which the host
  clips via `overflow: hidden`.

Rounding *down* would satisfy the first property too, but would leave up to a
full cell of the container uncovered — far more visible on a background field
than a sub-cell crop.

## Things that are easy to get wrong

**The doodle source still says `100%`.** The snap is an inline style on the
`<css-doodle>` element, not a change to `@size` in the generated source. That
is deliberate: the source feeds SVG export and the 254 artwork definitions'
`${width}`/`${height}` substitution, and neither should move because a
container happened to be 1441px wide.

**A CSS class cannot set the box.** `resolveBoxStyle` writes `width`/`height`
inline on the wrapper, so `.myField { width: 2640px }` silently loses. Callers
that need a specific box must pass `style`, not a class name.

**64 is a hard cap.** css-doodle's `parse_grid` caps grids at 64×64
(`MAX_GRID_EDGE`). Asking for a box that implies more columns than that — say
2640px at `cellSize={40}`, which wants 66 — clamps to 64 and silently rescales
the cell to 41.25px, putting the seams straight back. Pin to a multiple that
lands at or under the cap.

**Resize runs the snap, not a re-render.** `applyGridSnap` is arithmetic, so
`handleResize` calls it on every tick; only a changed `cols`/`rows` triggers
the debounced re-render. Without that, the canvas would hold its old pixel
size through a drag and either gap or over-cover the host.

## What this does not cover

- **`fit: "cover"` / `"contain"`** derive a render box and then *scale* it with
  a transform. Fractional device-pixel boundaries reappear after scaling, so
  snapping the render box would not fix them. A short full-width band that
  shows seams under `cover` is usually better served by `grid`.
- **`fit: "fixed"`** sizes the canvas to an explicit width/height that the
  caller chose; the editor's 364×546 preview at a 6×9 grid gives 60.66px cells
  by construction. `docs/svg-export.md` ("Cell boundaries: integer vs
  fractional") covers what that means for export fidelity.

## Verification

```bash
npm test --workspace tabbied      # snapSpanToTracks properties
npm run build && npm run test:e2e # e2e/package.spec.ts asserts whole tracks
```

The e2e `fit="grid"` test asserts the canvas covers the host, overflows by
less than one cell, that the host clips, and that every laid-out track is
within 0.01px of an integer.
