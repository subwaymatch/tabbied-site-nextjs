# CLAUDE.md

Guidance for coding agents working in this repository.

## Repo layout & commands

Tabbied: generative artworks built on css-doodle. npm workspaces — the
Next.js site at the root consumes the `tabbied` package in
`packages/tabbied/` (framework-free core + React wrapper + 568 artwork
presets as JSON in `packages/tabbied/artworks/`, embedded by codegen).

```bash
npm run dev                          # site (predev builds the package)
npm run build --workspace tabbied    # codegen + tsc for the package
npm test --workspace tabbied         # package unit tests (node --test)
npm run build && npm run test:e2e    # static export + Playwright suite
```

## SVG export — invariants (full reference: docs/svg-export.md)

The native SVG exporter (`packages/tabbied/src/core/svgExport.ts`) converts
rendered artworks to true vector SVG. Rules that must not regress:

- **Support tiers are metadata-driven.** `"svgExport": false` marks the 4
  designs SVG cannot represent (coil, spectrum, pinwheel, wedge — smooth
  conic sweeps): the editor *disables* "Download SVG" for them.
  `"svgExportNote"` on a definition (11 designs) or on a ToggleSwitch option
  (7 shadow toggles, note applies only while on) documents limitations —
  filter-based effects or ≤1px deviations. See docs/svg-export.md for the
  complete lists and reasons.
- **Limited exports must warn before downloading**: a right-aligned amber
  `TriangleAlert` on the "Download SVG" item (desktop menu + mobile panel)
  and a Base UI **`Dialog`** (not `AlertDialog` — outside-click must
  dismiss) titled "About this SVG export" listing the active notes, with
  Cancel / Download SVG. No notes → download directly, no dialog.
- **Fail loudly, never silently wrong**: unsupported CSS throws
  `SvgExportUnsupportedError`. New artworks must either stay inside the
  supported CSS subset, extend the converter, or set `svgExport: false`
  (+ note). Verify with `node scripts/svg-parity-sweep.mjs <slug>` and keep
  `e2e/svg-export.spec.ts`'s representative list + thresholds in sync.
- **Bundle contract**: the converter (~21 KB gz) is lazy-loaded by
  `exportSvg()`; `core/index.ts` re-exports only its *types*
  (`supportsSvgExport` lives in `types.ts`); `dist/core/svgExport.js` must
  keep zero runtime imports (tests inject it into pages).
- **Parity testing** compares against live element screenshots (css-doodle's
  own foreignObject export is unfaithful for conic masks) with an
  anti-aliasing-tolerant diff.
