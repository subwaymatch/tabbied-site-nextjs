# A1 — Editable templates: the `editable.json` spec

A strategy, not an implementation. The goal: every template site publishes a
machine-readable catalog of **what about it is brand, not layout** — the text,
images, colors, patterns, and fonts a user or an AI tool may change — so that
humans (the A2 web editor), coding agents (MCP + downloaded zips), and the
branding service (A3) can all edit a template without understanding its
internals, and without being able to break it.

Read together with: `site-builder-plan.md` (A2, the main consumer),
`branding-service-plan.md` (A3), `platform-auth-ai-plan.md` (A4).

---

## 1. What the codebase already tells us

Three facts found in the current system shape the whole design:

- **Two authoring models, 91% bespoke.** Of the 57 sites, only the 5
  `TemplateSite` pages (`components/template/templateData.ts` +
  `templateSections.ts`) have a declarative content model — an ordered
  `SectionKey[]` and typed content records. The other 52 are hand-written JSX
  (`app/template/<slug>/page.tsx`, 400–1000 lines) whose copy lives in
  ad-hoc module-scope `const` arrays with a different shape per site. Any
  scheme that requires migrating 52 pages onto one content schema is a
  rewrite of the template collection; the spec must work *on the pages as
  authored*.
- **The download packages are derived from the rendered export** (see
  `agent-outputs/template-packaging-plan.md` and
  `scripts/package-templates.mjs`). Anything the packager can't see in the
  DOM, it can't ship. There is already a working precedent for machine
  metadata that survives every derivation: `patternConfigToAttributes` in
  `packages/tabbied/src/core/hydrate.ts` serializes a full `PatternConfig`
  into `data-*` attributes (`data-pattern`, `data-palette`, `data-options`,
  `data-seed`, …) that flow from JSX through the export into both zips.
- **Palettes are already duplicated and unenforced.** `lib/templateSites.ts`
  mirrors hexes that each page also hardcodes as local constants and again in
  its `.module.css`. That duplication is exactly what makes color *not*
  editable today, and it will not fix itself.

So the design follows the packaging doc's doctrine: **annotate the source,
derive the catalog from the export, and verify the two agree at build time.**

## 2. The annotation layer: `data-edit-*` attributes

Editable nodes are marked in the page source with stable, dotted slot ids:

```tsx
<h1 className={s.heroTitle} data-edit="hero.title">Pencils, made entire.</h1>
<p data-edit="hero.lede">…</p>

<Figure slug="glockenhof-hall" alt="…" data-edit-image="hero.photo" />

<div data-edit-pattern="hero.field">
  <TabbiedPattern pattern={reeding} palette={['transparent', PALE, GREY]} … />
</div>
```

Why attributes and not a parallel content file:

- They survive **every** derivation for free: JSX → export → HTML package
  (attributes pass through `dehashClassNames` and friends untouched) and JSX →
  React package (the source ships as authored, so the same ids are greppable
  anchor points *in the source* — a coding agent editing the React zip finds
  the exact node for `hero.title` with one search).
- They are inert: no runtime import, so the packager's `LOCAL_IMPORTS`
  closure, the one-CSS-module invariant, and the `trimUnusedRules` safety
  argument ("no script adds classes after load") are all untouched.
- They make the spec **verifiable**: a generator can check that every
  declared slot resolves to exactly one node in the export — the same
  premise-checking style as `dropComposes` and `check:thumbnails`, guarding
  the same failure (a spec entry naming nothing rots silently; that is the
  `galleryThumbnails` lesson).

Slot kinds — a closed vocabulary, in the catalog-metadata tradition:

| kind | attribute | edit surface |
|---|---|---|
| `text` | `data-edit` | textContent (optionally per-array-item: `menu.items.2.title`) |
| `image` | `data-edit-image` | the image asset + `alt`; carries aspect ratio and, where `data/image-prompts.json` knows it, the generation prompt |
| `pattern` | `data-edit-pattern` | the full `PatternConfig`, read from the existing `data-pattern` attributes on the wrapper inside |
| `palette` | (site-level, see §3) | the brand color array, background first |
| `font` | (site-level, later phase) | the Google Fonts pair |
| `meta` | (site-level) | page `<title>`, description, brand name |

Repeated structures (menu items, spec tables, team lists) get indexed ids
derived from their array position; the generator enforces global uniqueness
per site. Element identity is the id, not the DOM path, so a layout tweak
doesn't invalidate saved edits.

## 3. Color: one edit point instead of three copies

Editing a palette must not mean regexing hexes through a stylesheet. The
5 `TemplateSite` pages already show the right shape: colors enter the page
**once**, as CSS custom properties on the root element (`--bg --c1 --ink …`),
and the stylesheet only ever says `var(--…)`.

The bespoke pages adopt the same idiom, mechanically:

- Each page's root element gets `style={{ '--brand-0': BG, '--brand-1': INK, … }}`
  from its existing constants — background first, matching the palette shape
  used everywhere else (`BrandPalette`, `LibraryPalette`, `PatternConfig.palette`).
- A codemod rewrites each `.module.css`: every hex that equals a brand
  constant becomes `var(--brand-k)`. This is tractable precisely because the
  palettes are already duplicated — the page constants say exactly which
  hexes are brand colors.
- Pattern fields keep taking literal hexes (css-doodle palettes are
  serialized into `data-palette`, and the SVG exporter parses concrete
  colors), so each `pattern` slot's spec entry declares a **role map** —
  e.g. `paletteRoles: ["transparent", 1, 3]` — saying which brand roles feed
  which palette positions. Applying a palette edit is then deterministic:
  rewrite the root's inline `--brand-*` block, and rewrite each pattern's
  `data-palette` through its role map.
- A build check closes the loop: after the codemod, no raw brand hex may
  appear in a template `.module.css` outside comments — so a new site can't
  quietly reintroduce a third copy of its colors. `lib/templateSites.ts`
  stops being a hand-mirrored duplicate and is derived from the same
  constants.

This is the only part of A1 that touches all 52 bespoke pages, and it is
batchable (the sites were authored in visually coherent sets) and verifiable
per batch (the pixel-diff-against-live-page technique from the packaging
work applies unchanged: a pure `hex → var()` rewrite must render
identically).

## 4. The derived catalog

A new generator (`scripts/generate-editable.mjs`, running inside the
packaging step, which already reads the export) walks
`out/template/<slug>/index.html` and emits, per site:

```jsonc
// editable.json, one per site — shipped in both zips and served with the site
{
  "specVersion": 1,
  "site": { "slug": "grafit", "name": "Grafit", "topic": "Pencil works" },
  "palette": { "roles": 5, "colors": ["#EEEDE7", "#131313", "#E5A000", "…"] },
  "fonts": { "display": "…", "body": "…", "href": "…" },
  "slots": [
    { "id": "hero.title", "kind": "text", "value": "Pencils, made entire.",
      "maxChars": 60 },
    { "id": "hero.photo", "kind": "image", "src": "images/….webp",
      "alt": "…", "width": 1600, "height": 1067, "prompt": "…" },
    { "id": "hero.field", "kind": "pattern",
      "config": { "pattern": "reeding", "palette": ["transparent", "…"],
                   "options": { "…": "…" }, "seed": "bold-gf", "fit": "grid" },
      "paletteRoles": ["transparent", 3, 2] }
  ]
}
```

Current values (`value`, `src`, `config`) are **extracted from the export**,
never hand-written — the spec can't disagree with the page because the page
is where it came from. Authored metadata that can't be derived (labels,
`maxChars`, role maps, tone hints for A3) lives in a small per-site sidecar
(`app/template/<slug>/editable.ts`), with defaults so a slot with nothing
special about it needs no entry at all.

Alongside the per-site files, one aggregate `public/editable-catalog.json`
(slug, name, topic, palette, pattern slugs, slot counts, zip URLs) gives
agents and the A2 gallery a single index — the template-side sibling of
`public/catalog.json`. All of it is gitignored and regenerated; edit the
generators, not the output. The ~58 new files are noise against the
asset-count ceiling (4,300 of 20,000).

## 5. The apply engine: one implementation, every consumer

A new workspace package, **`packages/tabbied-templates`**, framework-free in
the manner of `tabbied`'s core:

- the spec types + published JSON Schema (`specVersion`d);
- `validateEdits(spec, edits)` — bounds, kinds, unknown ids, palette shape;
- `applyEdits(root, spec, edits)` — DOM-level, deterministic: set text at
  `[data-edit]` nodes, swap `src`/`alt` at image slots, rewrite the root's
  `--brand-*` inline block, rewrite `data-*` pattern attributes through the
  role maps. It sets text, attributes, and inline styles — **never classes**,
  which is what keeps the packaged-CSS trimming premise true.

Because it is DOM-based and dependency-free it runs in three places
unchanged: the browser (A2's live preview, and client-side re-zip of a
customized HTML package with `fflate`, already a dependency), Node (packager
and tests), and inside the downloaded package itself if we later want an
"edit in place" script. An *edits document* (`{specVersion, slug, edits}`) is
the unit that gets saved as an A4 `project`, produced by A3, or handed to a
coding agent.

The React zip gets the spec file too, but `applyEdits` targets the HTML
package; editing `page.tsx` source is a job for a coding agent following the
`data-edit` anchors, and `README.md` in the zip says exactly that.

## 6. Verification, in the house style

- **`check:editable`** joins `prebuild`/`predev`: every sidecar entry
  resolves to exactly one exported node; every id unique; every role map
  index inside the palette; every image slot's asset on disk; vocabulary
  closed. One orphan fails the build.
- **Coverage report, not coverage gate**: sites annotate incrementally
  (the 5 `TemplateSite` pages come almost free — annotations go into the
  shared components once). The aggregate catalog records per-site coverage
  so the A2 gallery can show which templates are fully editable, without a
  half-annotated batch failing anyone's build.
- **e2e** (`e2e/templates.spec.ts` grows a case): load a packaged site,
  apply a fixture edits document (text + palette + pattern), assert the DOM
  text changed, the custom-property block changed, the pattern re-hydrated
  with the new palette, and — the trap the suite already knows — every class
  the markup uses still survives in the stylesheet.

## 7. Sequencing

1. **Spec + engine** — `tabbied-templates` package: types, schema,
   `applyEdits`, unit tests against fixture HTML.
2. **Pilot on the 5 `TemplateSite` sites** — annotate the shared components,
   wire `generate-editable.mjs` into packaging, land `check:editable`.
   Everything after this is repetition, not design.
3. **Palette refactor, in batches** — the §3 codemod over the bespoke sets,
   pixel-diffed per batch.
4. **Bespoke annotation, in batches** — `data-edit`/`data-edit-image`/
   `data-edit-pattern` + sidecars across the 52, starting with the sets A2
   wants first.
5. **Aggregate catalog + zips** — `editable-catalog.json`, spec files into
   both zip layouts, README notes for agents.

## 8. Risks worth naming

- **The codemod is the risky step** — it touches 52 stylesheets. Mitigated by
  doing nothing clever: exact-hex substitution only, one batch at a time,
  pixel diff against the live page as the gate (a pure `hex → var()` rewrite
  has no legitimate visual delta).
- **Slot id churn.** Renaming a slot orphans saved edits documents. Rule:
  ids are append-only per `specVersion`; a rename is a version bump plus a
  migration entry, and `check:editable` diffs against the previous committed
  catalog summary to catch accidental renames.
- **Spec sprawl.** The temptation is to make everything editable (layout,
  section order, spacing). Resist it: A1's contract is *brand-level* edits
  that cannot break layout. Section add/remove/reorder is A2+ territory and
  only meaningful for the `TemplateSite` model, which already has
  `sections: SectionKey[]` as its natural next step.
