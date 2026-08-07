# CLAUDE.md

Guidance for coding agents working in this repository.

## Repo layout & commands

Tabbied: generative patterns built on css-doodle. npm workspaces — the
Next.js site at the root consumes the `tabbied` package in
`packages/tabbied/` (framework-free core + React wrapper + 295 pattern
presets as JSON in `packages/tabbied/patterns/`, embedded by codegen) and the
`tabbied-mcp` package in `packages/tabbied-mcp/` (the MCP server, shared by
the site's `/mcp` endpoint and a `tabbied-mcp` stdio bin).

```bash
npm run dev                          # site (predev builds both packages)
npm run build:packages               # codegen + tsc for tabbied, then tabbied-mcp
npm test --workspace tabbied         # package unit tests (node --test)
npm test --workspace tabbied-mcp     # MCP toolset + both protocol eras
npm run build && npm run test:e2e    # static export + Playwright suite
npm run preview                      # run the real Worker over out/ (wrangler dev)
npm run deploy                       # build, then wrangler deploy
npm run typecheck:worker             # worker/ is excluded from the site tsconfig
npm run llms                         # regenerate public/llms*.txt + catalog
npm run templates [slug]             # repackage template site(s) by hand
npm run check:thumbnails             # gallery configs all name a real design
```

`galleryThumbnails.ts` is the one pattern-keyed file nothing regenerates —
its palettes and densities were tuned by eye. The gallery reads it as
`galleryThumbnails[item.slug]`, so a config whose slug names nothing is never
read and rots silently; 278 accumulated that way when the catalog moved from
`artworks/` to `patterns/`. `check:thumbnails` runs on `prebuild`/`predev` and
fails on one. A design with *no* entry is fine — it falls back to its own
palette and option defaults, which is how 19 of the catalog renders.

## Hosting — Cloudflare Workers static assets

The site is a static export served by Workers static assets. `wrangler.jsonc`
points `assets.directory` at `out/`; Cloudflare serves anything that matches a
file there **without invoking the Worker**, so `worker/index.ts` runs for
exactly two paths (`/mcp`, `/health`) and hands everything else to
`env.ASSETS`.

Three things that are explicit here and were implicit or automatic on Vercel:

- **`not_found_handling: "404-page"`.** Workers does not infer a custom 404
  from the presence of `out/404.html` the way Pages did. Without this line a
  miss returns a bare `404 Not Found` and `app/not-found.tsx` is never seen.
- **Headers live in `public/_headers`**, not in `next.config.mjs` (an export
  has no server to attach them to) and no longer in `vercel.json`. Next copies
  `public/` verbatim, so the file lands at `out/_headers` where wrangler reads
  it — and wrangler *consumes* it rather than serving it. `wrangler dev` prints
  `Parsed N valid header rules` on boot, which is the cheapest way to catch a
  typo. Limits: 100 rules, 2,000 characters per line.
- **`run_worker_first: ["/mcp", "/mcp/*", "/health"]`.** `/mcp` is not a file,
  so it would reach the Worker anyway — but only after the asset router looked
  at it, and with `trailingSlash: true` the default `html_handling` answers a
  POST to `/mcp` with a 308 to `/mcp/`. Redirecting an MCP client's POST breaks
  it. Do not drop these patterns.

The export is comfortably inside the platform limits — roughly 4,300 files
against a 20,000 free-plan ceiling, largest file 2.8 MB against 25 MiB — but
both are counted per Worker *version*. Don't treat that file count as stable:
most of it is per-route RSC payloads, and a Next minor can move it a lot (16.3
cut ~1,400 files off 16.2's output without changing a page). What is stable is
`public/downloads/`, a flat 1,711 files, so a batch of new template sites is
the thing most likely to actually threaten the ceiling. `wrangler deploy`
prints the count it uploaded.

`vercel.json` and `scripts/vercel-ignore-build.sh` are gone. The ignore-build
script's job — don't redeploy when only `agent-outputs/` changed — has no
in-repo equivalent on Cloudflare; it is a **build watch path** configured on
the Workers Builds project (exclude `agent-outputs/*`), so it lives in the
dashboard rather than in git.

## The MCP server — one implementation, two transports

`packages/tabbied-mcp/` exposes the catalog to agents over the Model Context
Protocol. Full reference: `docs/mcp-server.md`.

The protocol comes from `@modelcontextprotocol/server` (MCP SDK v2). We own
the tools; the SDK owns the wire.

- `src/tools.ts` — the four catalog tools, with no runtime imports at all. The
  host injects what differs (preview bytes, docs text) through `ToolContext`.
- `src/server.ts` — registers those tools onto an `McpServer`. The seam.
- `src/stdio.ts`, `src/node/` — the bin, the local catalog reader, and
  `render_design`. Node only, never reached from the Worker.

Both transports are the SDK's: the Worker wraps the factory in
`createMcpHandler`, the bin hands it to `serveStdio`. So the remote endpoint
and the local bin answer `tools/list` identically. **A tool that needs a
browser cannot be remote**: `render_design` exists only over stdio, because
rendering a css-doodle pattern needs a real browser and a Worker has none.

Four things worth not re-litigating:

- **`buildServer` is a factory, and must stay one.** MCP v2 is stateless — the
  SDK builds a server per request (per connection on stdio). Capturing
  per-request state in it would work locally and break under concurrency.
- **Tool schemas stay plain JSON Schema, adapted with `fromJsonSchema`,** not
  authored as Zod. `search_designs`'s enums are derived from the catalog being
  served, so static Zod could not express them without drifting from what is
  actually queryable. Registering the schema is also what buys argument
  validation — the SDK rejects an out-of-vocabulary tag before our handler runs.
- **`createMcpHandler` comes from the SDK, not from `agents/mcp/server`.**
  Cloudflare's is a re-export of the same function (it graduated upstream), but
  taking it from `agents` drags partyserver, esbuild, and babel into a Worker
  that needs none of them. The SDK's own deps are `zod` and
  `@modelcontextprotocol/core`; the bundle is ~122 KB gzipped.
- **The Worker reads the catalog through `env.ASSETS`, not from its bundle.**
  The tools then describe exactly the bytes that deployment serves — a design
  added in the same commit cannot be missing from the catalog an agent queries
  — and 384 KB of JSON stays out of the Worker.

`legacy: 'stateless'` is spelled out at the call site even though it is the
default: it is what keeps 2025-era clients working, and every shipping client
still opens with `initialize`. Dropping it to `'reject'` would strand them.

## Downloadable templates — derived from the export, never hand-ported

`npm run templates` writes two downloads per site — `<slug>-html.zip` and
`<slug>-react.zip` — plus the folders they were zipped from. The `/templates`
gallery links to both formats from every card, so a dead button means the
packager skipped that site. Both `out` and `public/downloads` are in
tsconfig's `exclude` because the React packages contain their own
`vite.config.ts`, which the site's typecheck would otherwise try to compile —
and in `public/downloads` that isn't hypothetical: it fails the second pass.

**`npm run build` is two `next build` passes with the packager between them**,
and that shape is forced by both ends of the problem:

- The packager *reads* the export, so it can only run after a build. It has no
  framework-free source to copy from — deriving from the export is the whole
  strategy (see `agent-outputs/template-packaging-plan.md`).
- The deploy has to *ship* what it writes, and the host decides when it stops
  looking. This shape was forced by Vercel, where writing into `out/` after the
  build was too late: the Next.js builder patched the config ("Applying
  modifyConfig from Vercel" in the build log) and captured the export during
  `next build`, so a `postbuild` step packaged all 57 sites green and all 114
  buttons still 404ed — the files existed on the build machine and were never
  uploaded.

So the packager writes into `public/downloads/`, and the second pass exports
that folder like any other static asset. Nothing about the host is assumed;
it is just Next copying `public/`. The zips are gitignored (~106 MB), so the
deploy's own build is the only thing that ever produces the `/downloads/*.zip`
the site links to — which is why this is wired into `build` rather than left
to be remembered.

**Cloudflare would tolerate a cheaper shape, and it is deliberately not used.**
`wrangler deploy` uploads `out/` from disk after the build command has already
exited, so a single pass plus a `postbuild` packaging step into `out/downloads/`
would work here and would save a whole `next build`. The two-pass version is
kept because it depends on nothing but Next copying `public/`, and the failure
it guards against is silent and total — 114 dead buttons on a green build. If
you do collapse it, prove it by fetching a `/downloads/*.zip` from a real
deployment, not from a local `out/`.

Run `npm run templates [slug]` by hand to repackage into `out/downloads/`
without rebuilding (that is where the e2e suite looks). Packaging everything
wipes the target folder first, so a retired site can't linger in the deploy;
naming a slug repackages just that one in place.

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

**The two formats also lay their images out differently, and must.** The HTML
package flattens everything into `images/`, which it can only do because it
rewrites the markup on the way past — `rewriteImagePaths` points every `src` at
the flat copy. The React package ships the *source*, which asks for its images
by the URL it was authored with, so it copies them under the sub-paths they
have on the site (`public/images/sites/…`, `public/images/template/…`). Two
mechanisms depend on that: `Figure` builds its `src` from the manifest's `base`
(`/images/sites`), and `ImageCard` hardcodes `/images/template/<id>.webp`.
Flattening breaks the hardcoded kind — and breaks it *silently*, because Vite's
dev server answers a miss under `public/` with `index.html` and a 200, so
nothing 404s and the images just render blank. It emptied all five
`TemplateSite` pages under `vite dev` while the HTML zip looked fine.
`e2e/templates.spec.ts` guards this by taking the exported page as ground truth
for what gets requested and asserting the React package serves every one.

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

Five build artifacts describe the catalog to tools that can't see the
patterns. They're gitignored and regenerated on every build, so edit the
generators, not the output:

- `packages/tabbied/catalog.json` — written by the package's
  `scripts/codegen.mjs` from the same `patterns/*.json` it compiles, exported
  as `tabbied/catalog.json`. Carries each design's description, its
  closed-vocabulary metadata (`tags`/`mood`/`density`/`goodFor` — see below),
  its `preview` image URL, palette, options, and SVG-export tier — but
  **not** the css-doodle `code`, which is what keeps it readable.
- `packages/tabbied/llms.txt` — the full agent reference, written by the
  package's `scripts/generate-llms.mjs` during its build (so a publish can't
  ship without it; it's in the tarball `files` along with the hand-written
  `AGENTS.md`).
- `public/llms.txt`, `public/llms-full.txt`, `public/catalog.json` — the
  site's copies, written by the root `scripts/generate-llms.mjs`, a thin
  wrapper over the package generator. One template, two consumers.

Codegen re-implements `supportsSvgExport()` because it runs before tsc and
has no compiled module to import. `test/catalog.test.mjs` pins it against the
real implementation — if you change the rule in `types.ts`, change it in
codegen too or that test fails.

**Catalog metadata is a closed vocabulary.** Every `patterns/*.json` carries
`tags` (visible motifs), `mood`, `density`, and `goodFor`, validated by
codegen against `packages/tabbied/scripts/catalog-vocabulary.mjs` — an
out-of-vocabulary value or a missing field fails the build. The values were
authored by *looking at each rendered preview* (not the description), so when
adding a design, look at it before tagging it; when adding a vocabulary term,
remember published catalogs query these exact strings. The metadata is
catalog-only: codegen strips it from the runtime bundle, and a test pins that.

**Every design ships a committed preview** at `public/previews/<slug>.webp`
(authored palette, default options, seed `preview1`, rendered @2x — at @1x
the finest stipples vanish). `check:previews` (prebuild/predev) fails on a
missing or orphaned file; regenerate with `npm run previews [slug]`. The
catalog points agents at these URLs, which is why they're committed rather
than rebuilt per deploy — a headless browser isn't available on the deploy
build, and stable URLs shouldn't re-render anyway.

The package also ships a `tabbied` bin (`src/cli.ts`): `render` (SVG/PNG,
`--frames` for deterministic PNG sequences) and `list`/`info` over the
catalog. It acquires a browser from whichever Playwright is installed —
never add a hard Playwright dependency to the package.

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
snapped cells on both axes. Well over a hundred designs rotate a cell by a quarter
turn, which swaps an oblong's axes and leaves a strip uncovered (a 120×124
cell paints 124×120 rotated). Cobalt Works' coda seamed on exactly that.

The snap is an inline style on the `<css-doodle>` element, *not* a change to
`@size` in the generated source — the source feeds SVG export and the
definitions' `${width}`/`${height}` substitution, and neither should move
because a container happened to be 1441px wide. Two traps: a CSS class can't
set the box (`resolveBoxStyle` writes width/height inline on the wrapper, so a
class loses), and css-doodle caps grids at 64×64, so a box implying more
columns than that silently rescales the cell and puts the seams back.

`cover` scales its render box with a transform, so snapping alone does nothing
there — measured: 6 interior seams with integral tracks under a fractional
scale, 0 once `fitRenderToBox` quantised the scale so `cell × scale` is whole
(rounded up, translate rounded). Both halves are required; the render-box snap
only exists to give the quantiser a whole cell.

## Reduced motion — invariant

A pattern moves two ways, and `prefers-reduced-motion` has to stop both. The
`redrawInterval` timer is the obvious one. The other is that **all 295 designs
declare a ~400ms `transition`** — the thing that makes a redraw morph rather
than cut — and it fires on any re-render, including ones nobody asked for:
`grid` and `cover` re-derive their cell grid on resize, so turning a phone
would otherwise animate every cell on the page.

`createPattern` mutes them by injecting `transition: none !important` into the
shadow root (the generated cell styles live there; a light-DOM rule can't
reach them). The same override suppresses the first paint for two frames —
under reduced motion it simply never lifts.

Two things that look redundant and are not:

- **`ensureMuted()` after every `element.update()`.** css-doodle regenerates
  the shadow root when the grid changes, which takes the injected `<style>`
  with it. Without the re-assert the mute holds at mount and is gone after the
  first resize-driven re-render — i.e. it fails in exactly the case it exists
  for. `e2e/package.spec.ts` covers this by resizing and asserting the cell
  transition-duration is still 0ms.
- **The `change` listener on the media query.** The preference is observed,
  not read once: `syncRedrawTimer` only re-checks on a config change, so a
  toggle mid-session would otherwise leave a running timer ticking.

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
