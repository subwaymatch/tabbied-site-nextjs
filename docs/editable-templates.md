# Editable templates

The 57 template sites are finished, hand-designed pages. This is the machinery
that lets somebody change the *brand* in one — the words, the photographs, the
colours, the pattern fields — without understanding the page, and without
being able to break its layout.

Three parties use the same contract: a person in the site builder, a coding
agent holding a downloaded zip, and the branding service. Strategy and
roadmap: `agent-outputs/editable-templates-plan.md`.

## The three pieces

| | What | Where |
|---|---|---|
| **Annotations** | `data-edit*` attributes naming the editable parts | the page source |
| **Spec** | what may change, and what it currently is | `public/editable/<slug>.json`, generated |
| **Engine** | validates an edit and applies it to a DOM | `packages/tabbied-templates` |

An **edits document** (`{specVersion, slug, edits}`) is the portable unit that
travels between them. It is what an editor autosaves, what an agent writes,
and what the branding service produces.

## Annotating a page

```tsx
<h1 data-edit="hero.title" data-edit-format="emphasis" data-edit-max="70">
  {renderTitle(site.title)}
</h1>

<ImageCard editId="hero.photo" … />          {/* emits data-edit-image */}

<div data-edit-pattern="band.field" data-edit-roles={fullRoles(site)}>
  <TabbiedPattern … />
</div>
```

| Attribute | Meaning |
|---|---|
| `data-edit="<id>"` | text slot; the element's text content is the value |
| `data-edit-format="emphasis"` | the value carries `{em}…{/em}` (see below) |
| `data-edit-max="70"` | soft length budget — warns, never blocks |
| `data-edit-multiline` | render a textarea |
| `data-edit-label="…"` | control label; defaults to a prettified id |
| `data-edit-image="<id>"` | image slot; the element is or contains the `<img>` |
| `data-edit-pattern="<id>"` | pattern slot; the element is or contains `[data-pattern]` |
| `data-edit-roles="transparent,1,3"` | how this field's palette follows the brand palette |
| `data-edit-root="<derivation>"` | the element carrying the brand custom properties |
| `data-edit-flat` | on the root: this site drops the alternating band tone |

**Attributes rather than a sidecar file**, deliberately. They survive every
derivation for free — the static export, the HTML download package, and (as
greppable anchors in the shipped source) the React package. Five sites share
one component, so a per-site sidecar would have nowhere to live for them
anyway.

**One id may appear on several elements**, and an edit reaches all of them.
That is the normal case, not an edge case: the brand name is in the masthead
and the footer, the primary call to action is in the nav and the hero. The
generator enforces the other half of the bargain — elements sharing an id must
currently say the same thing, or it fails the build.

## Colour: one edit point, not three copies

Colour enters a page **once**, as custom properties on the `data-edit-root`
element; the stylesheet only ever says `var(--…)`. Re-colouring is then a
property rewrite rather than a search-and-replace through a stylesheet.

Some of what the page needs is *derived* from the palette rather than in it —
the ink that stays legible on the page ground, the card and panel tints. Those
are functions of the palette, so a re-colour must recompute them; leaving them
behind is how a re-coloured page ends up with unreadable body copy. The
`data-edit-root` value names which derivation to use:

- **`direct`** — `--brand-0…n` and nothing else.
- **`templateSite`** — those, plus the variables the shared component works in
  (`--bg`, `--c1`, `--ink`, `--onC1`, `--card`, `--soft`, `--band`).

`derivePaletteProperties()` is the single implementation, shared by
`TemplateSite.tsx` (first render) and `applyEdits` (re-colour). They must agree
exactly, which is why the maths moved out of the component.

**Pattern fields keep literal colours** (css-doodle palettes are serialized
into `data-palette`, and the SVG exporter parses concrete colours), so a
pattern slot declares a **role map**: `data-edit-roles="transparent,1,3"` means
position 0 is the literal `transparent` and positions 1–2 follow brand roles 1
and 3. A numeric role wraps if the palette is short.

`transparent` in colour 0 is the one that matters: it is what leaves real
negative space so a field reads *over* a photograph. It is a literal precisely
so that re-colouring can never fill it in.

## The `{em}` accent

The template sites mark one span of a headline as an accent. If a headline slot
were plain text, the first person to edit it would silently lose the accent the
design was built around — so the *value* keeps the markers
(`Come back to {em}yourself{/em}.`) and both renderers parse them: the React
component building elements, and `applyEdits` building DOM nodes on a page with
no React.

`applyEdits` builds text nodes, never `innerHTML`, so there is no markup path
into the page from user or model input at all. It reads the accent's class off
the element it is replacing, because that class differs by context: the export
has the hashed CSS-module name, the download package has the de-hashed `em`.

## Generating the spec

`npm run editable` reads `out/template/<slug>/index.html` and writes
`public/editable/<slug>.json` plus the aggregate `public/editable-catalog.json`.
It runs inside `npm run build`, between the two `next build` passes, so the
second pass exports it like any other static asset — the same shape, and for
the same reason, as the template packager.

Everything in a spec is **derived from the export**: current text, image
sources and prompts, pattern configuration, and the brand palette (read back
off the root's inline `--brand-*`). Nothing is hand-written, so a spec cannot
describe a page that no longer exists. Option ranges are copied in from
`packages/tabbied/catalog.json`, which is what lets the engine validate a
slider value and an editor build a typed control without loading 295 pattern
definitions.

**The generator is also the build gate.** An annotation that resolves to
nothing — an image slot with no `<img>`, two elements sharing an id while
saying different things — exits non-zero. That failure is otherwise completely
silent: the spec looks fine and the editor's control just does nothing. This
repo has been there before, with 278 gallery thumbnail configs naming designs
that no longer existed.

**A site with no annotations is not a failure.** Coverage is deliberately
incremental — the five shared-component sites first, the 52 bespoke pages in
batches — so an unannotated page is just one the editor cannot open yet. The
generator reports the count.

## The engine

`packages/tabbied-templates` is framework-free and dependency-free, because it
runs in the browser (the builder's live preview and its client-side export),
in Node (the generator and its gate), and in tests.

- `planEdits(spec, document)` → `{operations, problems}`. Pure: every judgement
  lives here — validation, palette resolution, option ranges, attribute
  serialization — so it is covered by `node --test` with no browser.
- `applyEdits(root, spec, document)` executes that plan against a DOM. Short
  and dull by construction.

Problems and operations come back together: a document with one bad slot id
still applies the rest, which is what makes a partially-stale saved project (or
a partially-wrong LLM response) recoverable rather than a wall. Errors are
errors — an out-of-range slider is never quietly clamped, because clamping
hides the mistake from a pipeline that could otherwise correct itself.

**The engine never touches classes.** It sets text, attributes, and inline
custom properties, nothing else. The HTML download ships a stylesheet trimmed
to the classes its markup actually uses (`trimUnusedRules` in
`scripts/package-templates.mjs`), and that trim is only safe because nothing
adds a class after load. An editor that added one would silently ship a
download with the matching rule missing.

## Testing

- `npm test --workspace tabbied-templates` — the planner, extraction, and
  palette derivation, exhaustively and without a browser.
- `e2e/editable.spec.ts` — the real engine against the real packaged download:
  annotations survived the export and the packager, ids still find their
  elements, a re-colour reaches both the custom properties and the pattern
  fields.

## Adding a site

1. Annotate it. Ids are dotted and stable; index repeated structures
   (`items.2.title`).
2. `npm run build` (or `next build && npm run editable`) and read the gate.
3. Check the generated spec says what the page says.

Ids are **append-only within a `specVersion`**: renaming one orphans saved
edits documents that reference it.
