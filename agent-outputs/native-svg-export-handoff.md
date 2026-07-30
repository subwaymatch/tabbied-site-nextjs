# Native SVG export — research findings & implementation handoff

- **Date:** 2026-07-29
- **Repo:** `subwaymatch/tabbied` (branch: `claude/artwork-svg-export-gdohv5`, based on `95127ff`)
- **Audience:** a coding agent (or developer) implementing the feature. This document contains verified facts about the current codebase and `css-doodle` 0.51.0, the full artwork-compatibility audit, the chosen design, a phased implementation plan, and a verification harness that can prove correctness per artwork.

> **Implementation addendum (2026-07-30).** The feature has been implemented
> on this branch. Four findings from implementation supersede parts of this
> document:
>
> 1. **`wedge` is NOT convertible** (Tier A, not Tier B): its two `@pick()`
>    position rolls are independent, so most cells render a *smooth*
>    conic fade (e.g. `#000 0 70deg, transparent 180deg 360deg`) rather than
>    a hard-stop wedge. It now carries `svgExport: false`, bringing the
>    unsupported set to 4: `coil`, `spectrum`, `pinwheel`, `wedge`.
>    (`spray`/`sunray`/`glyph` use literal constant positions and stay
>    supported.) The converter's conic parser rejects any nonzero span whose
>    endpoints differ in color, so misclassified designs fail loudly.
> 2. **The parity harness compares against live element screenshots**, not
>    css-doodle's foreignObject export: that export renders conic *masks*
>    measurably differently from the live page (verified with a
>    live/mine/ref triple comparison), so the screenshot is the only honest
>    ground truth. The diff treats a differing pixel as an anti-aliasing
>    artifact when its color sits channel-wise between the other image's
>    3×3-neighborhood extremes (CSS pixel-snaps edges; SVG anti-aliases
>    fractional geometry).
> 3. **The converter is a single module** (`src/core/svgExport.ts`) with
>    type-only imports, so the compiled `dist/core/svgExport.js` has zero
>    runtime imports and tests inject the exact shipped build into pages.
> 4. Notable converter subtleties, all discovered via the parity loop:
>    geometry must come from `getBoundingClientRect` with transforms
>    temporarily disabled (layout offsets are integer-rounded; the override
>    must be unwound in two steps or the artworks' 400ms transitions restart
>    and computed transforms read as identity), `filter: blur(v)`'s
>    parameter IS the Gaussian σ (shadow blur radii are 2σ), multiple
>    box-shadows need independent blur→offset→flood branches merged under
>    the source (chained feDropShadows blur each other), filter regions
>    must be absolute `userSpaceOnUse` boxes (percentage regions clip glows
>    on thin boxes), abutting conic sectors need a hair of angular overlap,
>    and nested-@doodle mask tiles use `crispEdges` to avoid AA seams. The
>    three nested-@doodle artworks (`fractal`, `matryoshka`, `subdivide`)
>    pass at a documented looser threshold because css-doodle's *live*
>    rendering shows hairline seams from rasterizing the nested mask that
>    the clean vector export intentionally does not reproduce.

---

## 0. TL;DR

Add a **"Download SVG" export that produces a true vector SVG** (real `<rect>`/`<path>`/`<circle>` elements and native gradients — **no `<foreignObject>`**), built by walking the rendered css-doodle shadow DOM and mapping computed styles to SVG primitives.

- **165 of 168 artworks are convertible.** The 3 that are not (`coil`, `spectrum`, `pinwheel` — they paint smooth conic color sweeps, which SVG cannot represent) get a new `"svgExport": false` flag in their JSON definitions, and the site disables the menu item with an explanatory tooltip.
- The exporter lives in the **`tabbied` package core** (`packages/tabbied/src/core/`), surfaced as `controller.exportSvg()` and `TabbiedArtworkHandle.exportSvg()`, so both the site and package consumers get it.
- **Do not** reuse css-doodle's built-in `element.export()` for this — it wraps live HTML+CSS in `<foreignObject>`, which only renders in browsers (blank in Figma/Illustrator/Inkscape/librsvg). Verified in css-doodle 0.51.0 source (`src/component.js`, `export()` method). The css-doodle CLI was also investigated and has **no** doodle→SVG capability (its `generate svg` subcommand only compiles the `@svg()` authoring DSL; its `render` command takes headless-browser PNG/JPEG/WebP/MP4 screenshots).
- Correctness is provable: with a fixed seed the DOM snapshot is deterministic, so a Playwright harness can rasterize the exported SVG and pixel-diff it against css-doodle's own PNG export of the identical DOM. Every supported artwork must pass this parity test.

---

## 1. Verified facts about the current system

### 1.1 Rendering pipeline

- Artwork presets are JSON files in `packages/tabbied/artworks/*.json` (168 files). `packages/tabbied/scripts/codegen.mjs` embeds each JSON **verbatim** as a named export in `src/artworks.generated.ts` (so a new JSON field flows through automatically; only the `ArtworkDefinition` type needs updating).
- `packages/tabbied/src/core/doodleSource.ts` builds the css-doodle source string (option substitution, palette → `--color0..N` custom properties). `createArtwork.ts` mounts a `<css-doodle>` element and returns an `ArtworkController`.
- The React wrapper `packages/tabbied/src/react/TabbiedArtwork.tsx` exposes an imperative handle: `redraw()`, `exportImage()` (PNG via css-doodle), and `element` (the raw `<css-doodle>`).
- The site's editor (`components/edit-artwork-page/EditArtwork.tsx`) calls `exportImage({ scale: ceil(3000/max(w,h)), download: true })` from `exportArtwork()` (~line 642). Export UI lives in two places: the desktop dropdown in `EditArtworkHeader.tsx` (~line 164, Base UI `Menu`) and the mobile export panel in `EditArtwork.tsx` (`renderExportPanel`, ~line 906).

### 1.2 css-doodle DOM structure (v0.51.0, verified in package source)

`<css-doodle>` attaches an **open** shadow root containing:

```
#shadow-root (open)
  <style>            ← generated CSS (grid layout, per-cell rules, custom props)
  <cssd-grid part="grid">
    <cssd-cell id="c-…" part="cell">…</cssd-cell>   ← one per grid cell; nested for depth grids
    …
  </cssd-grid>
  <b></b>            ← only when a @backdrop is defined (none of our artworks use it)
```

- Cells are laid out with CSS grid; per-cell rules style backgrounds, pseudo-elements (`::before`/`::after`), transforms, clip-paths, masks, etc.
- The shadow root is open: `element.shadowRoot` is walkable, and `getComputedStyle(cell)` / `getComputedStyle(cell, '::after')` return fully resolved values (custom properties already substituted, colors in `rgb()`/`oklch()` resolved form, transforms as matrices).
- Because seeds are deterministic, the DOM is a faithful snapshot of exactly what the user sees. **The exporter must snapshot the live DOM, not re-render** — that guarantees the SVG matches the on-screen variation.

### 1.3 What css-doodle's own export gives us (and why we're not using it)

`element.export()` (css-doodle `src/component.js`) serializes `shadowRoot.innerHTML` into `<svg><foreignObject>…</foreignObject></svg>` and (for PNG) rasterizes that through an `<img>` + canvas. The `foreignObject` SVG renders **only** in full HTML engines. It is however still useful to us as the **reference renderer in tests** (see §6): its PNG output is pixel-ground-truth for the same DOM snapshot.

### 1.4 css-doodle CLI (`@css-doodle/cli` 1.12.1) — investigated, not usable

- `css-doodle render` → headless-browser **screenshot** (png/jpeg/webp/mp4). No SVG output (`lib/render/screenshot.js`).
- `css-doodle generate svg` → compiler for the `@svg()` authoring DSL only; rejects any input not starting with `svg {` (`lib/handler.js` → `generateSVG`). It cannot convert a doodle grid to SVG.
- Relevant nugget: the same `svg()` generator from `css-doodle/generator` powers the `@svg(...)` backgrounds inside 5 artworks (`charcoal`, `drypoint`, `linocut`, `reedpen`, `wireframe`) — those backgrounds are already real SVG data-URIs at runtime, so the exporter gets them nearly for free (§4.7).

---

## 2. Artwork compatibility audit (all 168 presets)

Audited by scanning every JSON's generated CSS and reading the actual gradient declarations of every flagged artwork. Screenshots of all 19 flagged artworks: `agent-outputs/native-svg-export-audit.png`.

### Tier A — NOT convertible: disable SVG export (3)

| Slug | Blocking feature |
|---|---|
| `coil` | smooth conic-gradient color sweep |
| `spectrum` | smooth conic-gradient color sweep |
| `pinwheel` | conic-gradient that *looks* hard-stop in source, but css-doodle re-rolls each `var()` occurrence independently (per-occurrence `@p()` rolls), so adjacent stops get different colors and the quarters blend smoothly — confirmed by the artwork's own code comment ("the quarters blend like a color wheel — intentional") and by rendering |

SVG has no conic/angular gradient primitive (neither SVG 1.1 nor SVG 2 as implemented). Faithful conversion is impossible; approximations (dense wedge fans, embedded raster) are explicitly out of scope. **These three get `"svgExport": false`.**

### Tier B — convertible with special conic handling (4)

`glyph`, `spray`, `sunray`, `wedge` use conic-gradients with **hard stops** (e.g. `#000 0 96deg, transparent 96deg 360deg`), i.e. solid pie sectors. `glyph` uses two-position stops (`… 0 90deg, … 90deg 180deg`) so each quadrant is a solid color even with per-occurrence color rolls. `spray`/`sunray`/`wedge` use them as **masks** to cut shapes into sectors. Convert to `<path>` arc sectors (§4.6).

### Tier C — convertible only with SVG filter effects (5 always, 7 conditionally)

Valid, native SVG that renders correctly in browsers; may degrade when imported into Figma/Illustrator (their SVG-filter import is poor). Export stays **enabled** for these.

- Always: `bokeh` (`filter: blur` → `feGaussianBlur`), `misprint` (`mix-blend-mode` → group style), `lantern`/`neon`/`terrain` (`box-shadow` glows → `feDropShadow`/`feGaussianBlur`).
- Only when the user turns the optional "shadow" toggle on (a `ToggleSwitch` option whose `code` injects `box-shadow`): `bloks`, `cupola` (toggle default **on**), `foliage`, `mixtape`, `odessa`, `quarterfall`, `radius` (default off).

### Tier D — fully convertible with core features (149)

Everything else. Property usage across all 168 (whole-file scan): transforms 108, clip-path 80, pseudo-elements 67, border-radius 54, masks 28, repeating-linear-gradient 12, radial-gradient 12, linear-gradient 19, borders 5, z-index 7, `@svg()` backgrounds 5, `@shape` (compiles to clip-path polygons) 3. **Zero** artworks use text content, web fonts, shaders, `paint()`, `backdrop-filter`, or `outline` — none of those need handling.

---

## 3. Design

### 3.1 Placement & API (package core, framework-free)

New module: `packages/tabbied/src/core/svgExport/` (folder module — `index.ts`, `walk.ts`, `shapes.ts`, `gradients.ts`, `masks.ts`, `filters.ts`, `serialize.ts`).

```ts
// Pure function: snapshot a live <css-doodle> into an SVG string.
export type SvgExportOptions = {
  /** Round coordinates to this many decimals (default 3). */
  precision?: number;
};
export type SvgExportResult = {
  svg: string;          // '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 W H">…'
  width: number;        // CSS px of the snapshot (viewBox size)
  height: number;
  warnings: string[];   // non-fatal degradations, e.g. "box-shadow approximated with feDropShadow"
};
export function doodleToSvg(element: CssDoodleElement, options?: SvgExportOptions): SvgExportResult;

// Convenience predicate used by UIs to gate the menu item.
export function supportsSvgExport(artwork: ArtworkDefinition): boolean; // === artwork.svgExport !== false
```

Wire-through (mirrors the existing `exportImage` plumbing exactly):

- `ArtworkController.exportSvg(options?: { download?: boolean; name?: string } & SvgExportOptions): Promise<SvgExportResult>` in `createArtwork.ts` — waits for render/transition settle (§3.4), calls `doodleToSvg`, and when `download: true` builds a `Blob('image/svg+xml')` + anchor click named `<slug>.svg` (follow `get_png_name`'s timestamped naming convention if trivial, else `<slug>.svg`).
- `TabbiedArtworkHandle.exportSvg(...)` in `TabbiedArtwork.tsx`, rejecting before mount like `exportImage` does.
- Re-export everything from `core/index.ts`. Keep zero dependencies (the package currently has none — preserve that).

### 3.2 Gating unsupported artworks

- Add to `ArtworkDefinition` in `packages/tabbied/src/core/types.ts`:
  ```ts
  /** False disables native SVG export (design uses effects SVG cannot represent). Default true. */
  svgExport?: boolean;
  ```
- Add `"svgExport": false` to `coil.json`, `spectrum.json`, `pinwheel.json`. Codegen passes it through automatically; run `npm run build --workspace tabbied` to regenerate.
- Site UI: in `EditArtworkHeader.tsx`, add a "Download SVG" `Menu.Item` under "Download PNG", `disabled` when `!supportsSvgExport(artwork)` with a tooltip/`title` — copy: **"This design uses effects SVG can't represent."** Same treatment in the mobile export panel (`renderExportPanel` in `EditArtwork.tsx`). Match existing row styling (`styles.exportRow`, `styles.menuItem`) and add a disabled style to the two module.css files. Toasts: "SVG downloaded" / "Could not export the SVG" via the existing `toaster`.

### 3.3 Conversion strategy: computed-style DOM walk (not CSS-text parsing)

Two candidate strategies were considered:

1. **Parse the generated CSS text** and re-evaluate selectors/values → rejected: reimplements the browser's cascade, `@p()`/var resolution, and selector matching; enormous surface for divergence.
2. **Walk the live shadow DOM and read `getComputedStyle`** → chosen: the browser has already resolved the cascade, custom properties, colors, and transforms; per-occurrence var rolls (the thing that makes `pinwheel` smooth) are already baked into computed values; and the snapshot inherently matches the visible seed.

Consequences the implementer must internalize:

- Geometry: use the **untransformed layout box** (`offsetLeft`/`offsetTop`/`offsetWidth`/`offsetHeight` relative to the grid) — *not* `getBoundingClientRect()`, which is post-transform. Apply the computed `transform` matrix separately (§4.2).
- Computed `background-image` values come back with resolved colors and explicit stop syntax — write one robust parser for the computed serialization (comma-split at paren depth 0), not for authored CSS.
- Pseudo-elements are real paint layers here (67 artworks): read `getComputedStyle(el, '::before'|'::after')`; a pseudo exists iff `content` computes to something other than `none`. Its box derives from the computed `inset`/`left`/`top`/`width`/`height`/`position` against the parent box (all absolute-positioned in our artworks; `content` is always `''` — verified, no text anywhere).

### 3.4 Snapshot timing (transitions)

Many artworks declare `transition: ease 400ms`; a mid-transition computed read would capture intermediate values. Before walking, settle: collect `shadowRoot.querySelectorAll('*')`, gather `el.getAnimations()`, and `await Promise.allSettled(animations.map(a => a.finished))` with a ~1s timeout guard. (The editor's export runs from an idle UI, so this is a rare edge, but it's cheap insurance and keeps the API safe for package consumers who export right after `redraw()`.)

### 3.5 Output format rules

- Root: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 W H">` where W×H is the host's CSS-px size. **No `width`/`height` attributes** — the file scales freely (the whole point of the feature).
- First paint: host background — the artwork's `--color0` (read the host's computed `background-color`; fully transparent when the editor's transparent-background toggle is on — SVG preserves that naturally).
- No `<foreignObject>`, no `<style>` blocks with selectors (inline presentation attributes / `style` attrs only), gradients/clips/masks/filters in `<defs>` with deterministic sequential ids (`g0`, `c1`, …) so same-seed exports are byte-identical (needed for the determinism test).
- Round all coordinates to `precision` decimals; skip fully-transparent/zero-size layers.
- Unknown feature encountered (e.g. a future artwork with an unhandled `background-image` kind): **fail loudly** — throw `SvgExportUnsupportedError` naming the property/value. Silent wrong output is the failure mode to avoid; the site catches and shows the error toast.

---

## 4. Feature → SVG mapping spec

Walk order per cell (this is CSS paint order for these artworks): element background layers → `::before` → child cells (depth grids) → `::after`. Cells paint in DOM order; 7 artworks use `z-index` — sort siblings by (z-index, DOM order) before emitting.

### 4.1 Boxes & shapes (`shapes.ts`)

| CSS | SVG |
|---|---|
| solid `background-color` on plain box | `<rect x y width height fill>` |
| `border-radius` uniform, ≥ half box on square | `<circle>` / `<ellipse>` |
| `border-radius` general (per-corner, elliptical — computed value gives `h1 h2 h3 h4 / v1 v2 v3 v4`) | rounded-rect `<path>` (four lines + four elliptical arcs), radii clamped pairwise like CSS does |
| `border` (5 artworks, always solid) | `<rect>`/`<path>` with `stroke` + `stroke-width`, geometry **inset by half the border width** (CSS borders paint inside the box; SVG strokes center on the outline). Background box shrinks by the full border on each side when both are present. |
| `opacity` | `opacity` on the element's `<g>` |

### 4.2 Transforms

Computed `transform` is a resolved `matrix(a,b,c,d,e,f)` (108 artworks; some `matrix3d` — reject non-affine-in-2D ones loudly, none exist today). SVG output: bake `transform-origin` into the matrix — `translate(ox,oy) · matrix · translate(-ox,-oy)` — and emit a single `transform="matrix(…)"` on the cell's `<g>`. Do **not** rely on SVG `transform-origin` (poor design-tool support). Note `transform-box` computes to `view-box`-relative differences vs CSS `border-box` — since we bake origins ourselves this is moot, but the implementer should read origins from computed `transform-origin` (px-resolved) relative to the layout box.

### 4.3 `clip-path` (80 artworks, incl. the 3 `@shape` ones which compile to `polygon(...)`)

Computed values here: `polygon(…)`, `inset(…)`, `circle(…)`, `ellipse(…)`, `path(…)`. Emit `<clipPath clipPathUnits="userSpaceOnUse">` in defs containing the equivalent path (percentages resolve against the element's layout box; computed style may retain percentages — resolve numerically during conversion), apply via `clip-path="url(#cN)"` on the group. Optimization (optional, later): when the clipped layer is a solid fill covering the whole box, emit the clip shape *as* the filled shape directly — smaller files, friendlier to design tools.

### 4.4 Gradients (`gradients.ts`)

- `linear-gradient` (19): `<linearGradient gradientUnits="userSpaceOnUse">` — convert the CSS angle (bearing, 0° = up) and the CSS gradient-line geometry (line length = `|w·sin θ| + |h·cos θ|`, centered) into `x1 y1 x2 y2`; map stops (computed values give explicit resolved positions; handle double-position stops by emitting two stops).
- `repeating-linear-gradient` (12): same, with the gradient line spanning **one period** (first stop → last stop run) and `spreadMethod="repeat"`.
- `radial-gradient` (12): `<radialGradient>` with `cx cy r` from the computed position/size (the artworks use simple circle/ellipse forms; ellipse via `gradientTransform="scale"` trick or `rx/ry`-emulating transform). `repeating-radial-gradient`: `spreadMethod="repeat"`.
- Hard-stop **conic** gradients (Tier B only): not emitted as gradients at all — decomposed into sector paths (§4.6).
- Multiple `background-image` layers (1 artwork + any background + gradient combos): CSS lists layers **top-first**; emit in reverse so the first layer paints last. Respect `background-size`/`background-position`/`background-repeat` for gradient layers (computed, px-resolved): a sized+repeated gradient layer maps to a `<pattern>` containing the gradient-filled rect.

### 4.5 Masks (`masks.ts`, 28 artworks)

CSS `mask`/`-webkit-mask` with gradient images, default `mask-mode` = alpha-for-gradients. SVG `<mask>` defaults to **luminance** — so rebuild every mask gradient with **white stops carrying the source stops' alpha** as `stop-opacity` (white luminance ≡ alpha then). Set `maskUnits="userSpaceOnUse"`. Multiple mask layers compose intersect-style (`mask-composite` computed default) — emit nested groups, one mask each. Hard-stop conic masks (spray/sunray/wedge) become clip sector paths instead (§4.6) — clipping beats masking for design-tool fidelity when edges are hard.

### 4.6 Hard-stop conic → sector paths (Tier B)

A conic-gradient whose stops are all hard transitions (every adjacent pair shares a position) at center `(cx, cy)` from angle `θ₀` is a fan of solid pie sectors. For each colored sector spanning `[α, β]`: `M cx cy L (cx + R·sin α) (cy − R·cos α) A R R 0 (β−α > 180°) 1 (…end point…) Z` with R = a radius that provably covers the box (e.g. half the box diagonal + 1), then clipped to the layer box. Used as background (glyph — four solid quadrants) or as mask (spray/sunray/wedge — emit the black sectors as a `<clipPath>` over the layer content, dropping the transparent remainder). CSS conic angles are bearings (0° = up, clockwise) — mind the sin/cos mapping above.

### 4.7 `@svg()` data-URI backgrounds (5 artworks)

Computed `background-image` is `url("data:image/svg+xml;…")`. Phase 1: emit `<image href="data:…" x y width height>` — stays vector in browsers, zero id-collision risk. Phase 2 (stretch goal): decode and inline the nested SVG (namespacing its ids) for maximum design-tool fidelity.

### 4.8 Filter tier (Tier C)

- `filter: blur(Npx)` → `<filter><feGaussianBlur stdDeviation="N/2 pre-scaled"/></filter>` (CSS blur radius ≈ 2·stdDeviation; verify visually in the parity test) with generous `x/y/width/height` filter region (−50%/200%).
- `box-shadow: 0 0 Bpx color` (always this glow form in our artworks — offsets are 0) → `feDropShadow dx=0 dy=0 stdDeviation=B/2 flood-color` on the shape's group; multiple shadows → chained primitives.
- `mix-blend-mode` → `style="mix-blend-mode:…"` on the group + `isolation:isolate` on the root; browser-correct, design-tool-degrading — push `"mix-blend-mode approximated…"` onto `warnings`.

All Tier C conversions append a warning string; the site UI ignores warnings for now (they're for tests/debugging), but keep them in the result type.

---

## 5. Site integration checklist

1. `EditArtwork.tsx`: add `exportSvgArtwork()` beside `exportArtwork()` calling `doodleRef.current?.exportSvg({ download: true })`, with success/error toasts.
2. `EditArtworkHeader.tsx`: new props `onExportSvg`, `svgExportDisabled`; new `Menu.Item` "Download SVG" (icon suggestion: `FileCode` or `ImageDown` variant from lucide) directly under "Download PNG"; `disabled` + `title` tooltip when unsupported.
3. Mobile export panel in `EditArtwork.tsx`: same row, same disabled treatment.
4. CSS modules: disabled styles for `menuItem`/`exportRow` (reduced opacity, `cursor: not-allowed`, keep focus-visible rules coherent).
5. Docs: mention `exportSvg()` + the `svgExport` flag in `packages/tabbied/README.md` and the react docs page (`app/docs/react/page.tsx` — it already demos `exportImage()` via `ReseedExportDemo.tsx`).
6. Release: this repo uses **changesets** — add one (`minor` for the `tabbied` package: new API + new JSON field).

---

## 6. Verification harness (build this in Phase 1, not last)

The decisive advantage of the DOM-walk design is that correctness is **provable per artwork**:

1. **Pixel-parity e2e** (`e2e/svg-export.spec.ts`): for each supported artwork — load the editor at a **fixed seed** (seed is encoded in the shareable URL; verify the param name in `EditArtwork.tsx`'s share-link/seed-restore logic and reuse it), then in-page via `page.evaluate`:
   - grab the `<css-doodle>` element (`div[data-artwork="<slug>"] css-doodle`, `TabbiedArtwork` renders the `data-artwork` attr),
   - `doodleToSvg(el)` → rasterize the SVG string to a canvas (`new Image` + `drawImage`) at, say, 2×,
   - `el.export({ scale: 2 })` → css-doodle's own foreignObject-PNG of the **same DOM snapshot** → second canvas,
   - pixel-diff. Pass = ≥ 99% of pixels within a per-channel tolerance of ~10/255 (tune once; anti-aliasing along shape edges is the expected noise; Tier C blur/shadow artworks may need a looser threshold or SSIM-style comparison).
   - On failure, attach both PNGs + the SVG as Playwright artifacts.
   - CI strategy: a representative ~20-artwork matrix (every feature category) in the default `npm run test:e2e`; the **full 165-artwork sweep** behind a tag/env (`npm run test:e2e -- --grep @svg-full`) run before release.
2. **Determinism test**: two `doodleToSvg` calls on the same mounted element → byte-identical strings.
3. **Validity test**: `DOMParser` parses with no `parsererror`; document contains **zero** `foreignObject` elements; root has proper `xmlns` and `viewBox`.
4. **Gating test**: `coil`/`spectrum`/`pinwheel` menu item disabled with tooltip; a supported artwork's item enabled and produces a download.
5. **Unit tests** for the pure helpers (gradient-line math, rounded-rect path builder, sector path builder, computed-value parsers) with `node --test` inside `packages/tabbied` (no new test framework; matches the repo's zero-dep stance). Wire as `npm test --workspace tabbied`.

Existing infra notes: Playwright config serves the **static export** (`npm start` → `serve out`), so `npm run build` must precede e2e runs; Chromium-only project; `e2e/smoke.spec.ts` shows the house style for waiting on css-doodle mounts (poll `shadowRoot.innerHTML.length`).

---

## 7. Phased plan (each phase lands green on its own)

**Phase 0 — plumbing & gating (small, unblocks UI review early)**
`svgExport` type field + 3 JSON flags + `supportsSvgExport` + disabled "Download SVG" menu/panel items wired to a stub that throws. Acceptance: gating e2e (§6.4) passes; catalog builds; changeset added.

**Phase 1 — walker core + harness**
`doodleToSvg` covering: walk/settle, host background, solid fills, border-radius shapes, borders, opacity, transforms, clip-path, z-order, pseudo-elements; serializer; download plumbing through controller + React handle; parity harness (§6.1–6.3) running a starter set of ~10 Tier D artworks (suggest: `damier`, `bauhaus`, `bias`, `chip`, `cornerbite`, `battlement`, `bracket`, `caltrop`, `chamfer`, `cove` — all simple-geometry designs). Acceptance: starter set passes parity; determinism + validity green.

**Phase 2 — gradients, masks, `@svg` images**
§4.4, §4.5, §4.7 (`<image>` form). Acceptance: all Tier D artworks (149) pass parity.

**Phase 3 — conic sectors (Tier B)**
§4.6. Acceptance: `glyph`, `spray`, `sunray`, `wedge` pass parity.

**Phase 4 — filter tier (Tier C)**
§4.8. Acceptance: `bokeh`, `misprint`, `lantern`, `neon`, `terrain` pass (looser threshold documented in the spec file); shadow-toggle artworks pass **with the toggle on** (add one parameterized case).

**Phase 5 — polish & release**
Full-catalog sweep green; docs (§5.5); optional file-size pass (defs de-dup, `<use>` for repeated cells — only if trivial); changeset finalized.

---

## 8. File-by-file change map

| File | Change |
|---|---|
| `packages/tabbied/src/core/svgExport/*` | new module (walker, shapes, gradients, masks, filters, serialize, errors) |
| `packages/tabbied/src/core/types.ts` | `svgExport?: boolean` on `ArtworkDefinition` |
| `packages/tabbied/src/core/createArtwork.ts` | `exportSvg()` on controller (+ types for its options) |
| `packages/tabbied/src/core/index.ts` | re-exports |
| `packages/tabbied/src/react/TabbiedArtwork.tsx` | `exportSvg` on handle (mirror `exportImage` incl. pre-mount rejection) |
| `packages/tabbied/artworks/{coil,spectrum,pinwheel}.json` | `"svgExport": false` |
| `packages/tabbied/package.json` | `test` script (`node --test`) |
| `packages/tabbied/test/*` | unit tests for pure helpers |
| `components/edit-artwork-page/EditArtwork.tsx` | `exportSvgArtwork()`, mobile panel row, disabled gating |
| `components/edit-artwork-page/EditArtworkHeader.tsx` (+ both `.module.css`) | menu item, disabled style + tooltip |
| `e2e/svg-export.spec.ts` | parity/determinism/validity/gating specs |
| `packages/tabbied/README.md`, `app/docs/react/page.tsx` | document `exportSvg` + flag |
| `.changeset/*` | minor release note |

---

## 9. Risks & judgment calls (decided; revisit only with evidence)

- **Parity thresholds**: anti-aliasing differences between the browser's HTML rasterization and its SVG rasterization are expected; tune once on the starter set, then freeze. If a specific artwork can't reach threshold, that's a converter bug until proven otherwise.
- **File size**: 64×64 grids ⇒ up to ~4k cells ⇒ SVGs of a few hundred KB. Acceptable; de-dup via `<defs>`/`<use>` is an optional Phase 5 nicety, not a requirement.
- **`getComputedStyle` color spaces**: modern Chromium may serialize colors as `color(srgb …)`/`oklch(…)`. Emit them verbatim only if the validity+parity tests pass in Playwright's Chromium; otherwise normalize to `rgb()` via a canvas round-trip helper. (Design tools prefer plain rgb/hex — prefer normalizing.)
- **Future artworks**: the fail-loud rule (§3.5) plus the full-catalog sweep make regressions visible; document in the artwork-authoring notes that new presets must either stick to the supported CSS subset or set `"svgExport": false`.
- **Explicit non-goals**: approximating smooth conic sweeps; inlining `@svg` data-URIs (phase-2+ stretch); SVG animation; exporting at fixed pixel sizes (viewBox-only is the feature).
