# CLAUDE.md

Guidance for coding agents working in this repository.

## Repo layout & commands

Tabbied: generative patterns built on css-doodle. npm workspaces — the
Next.js site at the root consumes the `tabbied` package in
`packages/tabbied/` (framework-free core + React wrapper + 254 pattern
presets as JSON in `packages/tabbied/patterns/`, embedded by codegen).

```bash
npm run dev                          # site (predev builds the package)
npm run build --workspace tabbied    # codegen + tsc for the package
npm test --workspace tabbied         # package unit tests (node --test)
npm run build && npm run test:e2e    # static export + Playwright suite
npm run llms                         # regenerate public/llms*.txt + catalog
npm run templates [slug]             # repackage template site(s) by hand
```

## Downloadable templates — derived from the export, never hand-ported

`npm run templates` writes two downloads per site into `out/downloads/`:
`<slug>-html.zip` and `<slug>-react.zip`. It runs **after** `npm run build`,
never before — it reads the export, and `next build` wipes `out/` — which is
why it is wired as `postbuild` rather than left to be remembered. That is not
a convenience: the zips are gitignored (~106 MB), so the deploy's own build is
the only thing that ever produces the `/downloads/*.zip` the site links to.
Run it by hand to repackage one site without rebuilding, and pass a slug to do
just that one. The `/templates` gallery links to both formats from every card,
so a dead button means the packager skipped that site. `out` is in tsconfig's
`exclude` because the React packages contain their own `vite.config.ts`, which
the site's typecheck would otherwise try to compile.

Writing to `out/` is enough everywhere except the host we deploy to. Vercel's
Next.js builder patches the config ("Applying modifyConfig from Vercel" in the
build log) and seals the deployment's static root *during* `next build`, so a
postbuild step writing into `out/` is already too late: the packager ran green
on Vercel and all 114 buttons still 404ed. `mirrorIntoVercelOutput` therefore
copies the finished folder into the Build Output API's static root, guarded by
that directory existing — a no-op locally, in CI, and on any other host, where
the export is uploaded after the build command finishes.

The two formats are built in opposite directions, and that is the point:

- **HTML is derived from the export**, because there is no framework-free
  source to copy — hand-porting is the trap the strategy doc rejects (see
  `agent-outputs/template-packaging-plan.md`).
- **React is a copy of the page**, because a template page already *is* a plain
  React component. The only Next.js API any of the 57 uses is `export const
  metadata`; there is no next/image, next/link, `'use client'` or
  `generateStaticParams` anywhere. So `page.tsx` ships as authored and only the
  frame changes: metadata lifted into `index.html`, workspace imports pointed
  at copied neighbours, plus a Vite scaffold. Vite resolves `.module.css`
  natively, so the React package needs **no CSS transform at all** — only the
  bundler-less HTML package needs `composes:`/`:global()` flattened.

Two things it does *not* do, deliberately. It doesn't de-hash and un-minify
the built CSS: the authored `.module.css` is already the clean, commented
stylesheet a person should edit, so that ships and only the class names in the
*HTML* are rewritten back to plain ones. And it doesn't hand-write the mount
code: the placeholders already carry their config as `data-*` attributes
(`TabbiedPattern` serializes it via `patternConfigToAttributes`), so one
`hydratePatterns()` call revives the whole page.

A site fails loudly rather than shipping broken: more than one CSS module on a
page, or two hashed names collapsing onto one plain name. All 57 sites
package, so `KNOWN_UNSUPPORTED` is empty — anything that throws is a new
problem and exits non-zero.

`composes:` needs no flattening, which is easy to get backwards. CSS Modules
resolves a local `composes` in the **markup**: `.h2Light { composes: h2 }`
compiles to `class="…__h2Light …__h2"` and both rules are already in the
sheet, so the declaration is inert — just not valid CSS outside the pipeline.
`dropComposes` removes it, having first checked the build really did add the
composed class (a premise about build output, so it is verified, not assumed).
A cross-file `composes … from` would introduce a second module and is caught
by the one-module check before that runs.

**Two stylesheet paths, and they fail differently.** A site with its own
`<slug>.module.css` ships it byte-for-byte. The five built on the shared
`TemplateSite` component have no per-page sheet, so the component's is shipped
trimmed by `trimUnusedRules` to the rules the page can actually match (~45% of
it is other sites' layout kits). The trim is conservative — a rule goes only
when it names a class the page doesn't have, and a selector with no class at
all is always kept — and it is safe only because the packaged page has no
framework left to add a class after load.

Two traps that trimmer already fell into, both silent:

- **Comments containing braces.** This codebase documents its CSS heavily and
  one comment contains a literal `{ color: inherit }` as an example. Counted
  naively that desynchronises brace depth for the rest of the file, so the
  walker skips comments when scanning. Do not "simplify" it back to
  `indexOf('{')`.
- **Comments containing class names**, which poison the selector parsed out of
  the prelude. The selector is taken with comments stripped; they are put back
  on the way out so the shipped sheet stays documented.

`e2e/templates.spec.ts` covers one site of each of the three kinds and
asserts every class the markup uses survives into the stylesheet. Note it navigates to
`/downloads/<slug>/` **with the trailing slash**: `serve` rewrites
`<dir>/index.html` to an extensionless `<dir>`, and every relative asset then
resolves a level too high and 404s — which once had this spec passing against
a completely unstyled page. What actually proves a template is the pixel diff
against its live page (see the packaging commit); the spec is the cheap guard
that runs every time.

## Agent-facing docs — all generated, never hand-edited

Four build artifacts describe the catalog to tools that can't see the
patterns. They're gitignored and regenerated on every build, so edit the
generators, not the output:

- `packages/tabbied/catalog.json` — written by the package's
  `scripts/codegen.mjs` from the same `patterns/*.json` it compiles, exported
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

The cell is snapped to a whole multiple of `sizing.cellMultiple` (default 2),
not merely to a whole pixel: a design that subdivides its cell seams at
`cell / n` if the cell doesn't divide, however exact the outer track is. Only
`subdivide` (2), `fractal` (3) and `matryoshka` (4) — the three that mask with
a nested `@doodle` — declare their own.

The cell is also **squared** — `applyGridSnap` uses the larger of the two
snapped cells on both axes. 146 of the 254 designs rotate a cell by a quarter
turn, which swaps an oblong's axes and leaves a strip uncovered (a 120×124
cell paints 124×120 rotated). Cobalt Works' coda seamed on exactly that.

The snap is an inline style on the `<css-doodle>` element, *not* a change to
`@size` in the generated source — the source feeds SVG export and the 254
definitions' `${width}`/`${height}` substitution, and neither should move
because a container happened to be 1441px wide. Two traps: a CSS class can't
set the box (`resolveBoxStyle` writes width/height inline on the wrapper, so a
class loses), and css-doodle caps grids at 64×64, so a box implying more
columns than that silently rescales the cell and puts the seams back.

`cover`/`contain` scale their render box with a transform, so snapping alone
does nothing there — measured: 6 interior seams with integral tracks under a
fractional scale, 0 once `fitRenderToBox` quantised the scale so
`cell × scale` is whole (up for cover, down for contain, translate rounded).
Both halves are required; the render-box snap only exists to give the
quantiser a whole cell.

## SVG export — invariants (full reference: docs/svg-export.md)

The native SVG exporter (`packages/tabbied/src/core/svgExport.ts`) converts
rendered patterns to true vector SVG. Rules that must not regress:

- **Support tiers are metadata-driven.** `"svgExport": false` marks the 4
  designs SVG cannot represent (coil, spectrum, pinwheel, wedge — smooth
  conic sweeps): the editor *disables* "Download SVG" for them.
  `"svgExportNote"` on a definition (11 designs) documents limitations —
  filter-based effects or ≤1px deviations. The option-level form still works
  but no design uses it: the Shadow toggle that was its only user was removed
  rather than left as an export trap. Everything else (239) is clean.
  See docs/svg-export.md for the complete lists and reasons.
- **Limited exports must warn before downloading**: a right-aligned amber
  `TriangleAlert` on the "Download SVG" item (desktop menu + mobile panel)
  and a Base UI **`Dialog`** (not `AlertDialog` — outside-click must
  dismiss) titled "About this SVG export" listing the active notes, with
  Cancel / Download SVG. No notes → download directly, no dialog.
- **Fail loudly, never silently wrong**: unsupported CSS throws
  `SvgExportUnsupportedError`. New patterns must either stay inside the
  supported CSS subset, extend the converter, or set `svgExport: false`
  (+ note). Batches 11 and 12 are authored to be clean throughout and share
  their lints (`scripts/pattern-gen/pattern-lints.mjs`) and their two gates
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
