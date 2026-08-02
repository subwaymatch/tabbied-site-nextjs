# CLAUDE.md

Guidance for coding agents working in this repository.

## Repo layout & commands

Tabbied: generative artworks built on css-doodle. npm workspaces — the
Next.js site at the root consumes the `tabbied` package in
`packages/tabbied/` (framework-free core + React wrapper + 254 artwork
presets as JSON in `packages/tabbied/artworks/`, embedded by codegen).

```bash
npm run dev                          # site (predev builds the package)
npm run build --workspace tabbied    # codegen + tsc for the package
npm test --workspace tabbied         # package unit tests (node --test)
npm run build && npm run test:e2e    # static export + Playwright suite
npm run llms                         # regenerate public/llms*.txt + catalog
```

## Agent-facing docs — all generated, never hand-edited

Four build artifacts describe the catalog to tools that can't see the
artworks. They're gitignored and regenerated on every build, so edit the
generators, not the output:

- `packages/tabbied/catalog.json` — written by the package's
  `scripts/codegen.mjs` from the same `artworks/*.json` it compiles, exported
  as `tabbied/catalog.json`. Carries each design's description, palette,
  options, default fit, and SVG-export tier — but **not** the css-doodle
  `code`, which is what keeps it readable.
- `public/llms.txt`, `public/llms-full.txt`, `public/catalog.json` — written
  by `scripts/generate-llms.mjs` from that catalog.

Codegen re-implements `defaultFitMode()` and `supportsSvgExport()` because it
runs before tsc and has no compiled module to import. `test/catalog.test.mjs`
pins both against the real implementations — if you change the rule in
`src/core/sizing.ts` or `types.ts`, change it in codegen too or that test
fails.

## Grid snapping — invariant (full reference: docs/grid-snapping.md)

css-doodle lays its grid out as `repeat(n, 1fr)`, so a container that isn't
divisible by `n` puts every cell boundary on a sub-pixel and the browser draws
a hairline seam at each one. `fit: "grid"` therefore **oversizes its canvas**:
`applyGridSnap` sets it inline to `snapSpanToTracks(hostSpan, tracks)` (the
smallest multiple of the track count that still covers the box) and the host
clips the sub-cell overflow with `overflow: hidden`. Don't "simplify" that
back to `width: 100%`.

The snap is an inline style on the `<css-doodle>` element, *not* a change to
`@size` in the generated source — the source feeds SVG export and the 254
definitions' `${width}`/`${height}` substitution, and neither should move
because a container happened to be 1441px wide. Two traps: a CSS class can't
set the box (`resolveBoxStyle` writes width/height inline on the wrapper, so a
class loses), and css-doodle caps grids at 64×64, so a box implying more
columns than that silently rescales the cell and puts the seams back.

## SVG export — invariants (full reference: docs/svg-export.md)

The native SVG exporter (`packages/tabbied/src/core/svgExport.ts`) converts
rendered artworks to true vector SVG. Rules that must not regress:

- **Support tiers are metadata-driven.** `"svgExport": false` marks the 4
  designs SVG cannot represent (coil, spectrum, pinwheel, wedge — smooth
  conic sweeps): the editor *disables* "Download SVG" for them.
  `"svgExportNote"` on a definition (11 designs) or on a ToggleSwitch option
  (7 shadow toggles, note applies only while on) documents limitations —
  filter-based effects or ≤1px deviations. Everything else (~239) is clean.
  See docs/svg-export.md for the complete lists and reasons.
- **Limited exports must warn before downloading**: a right-aligned amber
  `TriangleAlert` on the "Download SVG" item (desktop menu + mobile panel)
  and a Base UI **`Dialog`** (not `AlertDialog` — outside-click must
  dismiss) titled "About this SVG export" listing the active notes, with
  Cancel / Download SVG. No notes → download directly, no dialog.
- **Fail loudly, never silently wrong**: unsupported CSS throws
  `SvgExportUnsupportedError`. New artworks must either stay inside the
  supported CSS subset, extend the converter, or set `svgExport: false`
  (+ note). Batches 11 and 12 are authored to be clean throughout and share
  their lints (`scripts/artwork-gen/artwork-lints.mjs`) and their two gates
  (`svg-sweep.mjs`, `render-sweep.mjs`); a batch generator owns a *bounded*
  range of gallery orders and deletes anything in range it no longer defines.
  Verify with `node scripts/svg-parity-sweep.mjs <slug>` and keep
  `e2e/svg-export.spec.ts`'s representative list + thresholds in sync.
- **Bundle contract**: the converter (~21 KB gz) is lazy-loaded by
  `exportSvg()`; `core/index.ts` re-exports only its *types*
  (`supportsSvgExport` lives in `types.ts`); `dist/core/svgExport.js` must
  keep zero runtime imports (tests inject it into pages).
- **Parity testing** compares against live element screenshots (css-doodle's
  own foreignObject export is unfaithful for conic masks) with an
  anti-aliasing-tolerant diff.
