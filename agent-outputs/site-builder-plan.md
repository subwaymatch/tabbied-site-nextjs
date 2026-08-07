# A2 — Building a site with Tabbied: agents and a web interface

A strategy, not an implementation. The premise: someone who wants a site
should be able to start from the 57 templates and make it *theirs* — whether
"someone" is a person in a browser or a coding agent working for them. The
MCP server was the first step; this plan finishes both lanes.

Read together with: `editable-templates-plan.md` (A1 — both lanes stand on
the `editable.json` spec and the `applyEdits` engine; nothing here works
without it), `platform-auth-ai-plan.md` (A4 — save/resume and AI assists),
`branding-service-plan.md` (A3 — which reuses this editor's guts).

---

## 1. Two lanes, one contract

The thing both lanes share is the A1 contract: a template is a package of
files plus an `editable.json` describing what may change, and an **edits
document** (`{specVersion, slug, edits}`) is the portable unit of
customization. The web editor produces edits documents interactively; an
agent produces them (or applies the same ids directly to source); the A3
branding service produces them from a brand. One format, three producers.

That shared contract is what keeps this from becoming two products. The
editor is not a page builder with its own model — it is a UI over the same
spec an agent reads.

## 2. The agent lane

An agent building a customer site today can already discover *patterns*
(`search_designs` → `preview_design` → `get_design`). What it cannot discover
is the *templates*. Three additions, all in `packages/tabbied-mcp`:

- **`list_templates`** — the aggregate `editable-catalog.json`: slug, name,
  topic, palette, pattern slugs, editable coverage, zip URLs. Small enough to
  return whole; 57 entries needs no query language yet.
- **`get_template`** — one site's full `editable.json` plus its package file
  listing and download URLs, and a `usage` block (like `get_design`'s) that
  spells out the workflow: download the zip, edit by `data-edit` id, the
  HTML package hydrates via `hydratePatterns`, the React package is Vite.
- **`preview_template`** — the template's committed preview image, so the
  narrow-then-look flow works for sites the way it does for designs.

Mechanically these follow the existing seams exactly: plain JSON Schema
inputs, host-injected data via `ToolContext` growing three optional fetchers
(`fetchTemplateCatalog`, `fetchTemplate`, `fetchTemplatePreview`) that gate
the tools the way `fetchPreview` gates `preview_design` today. The Worker
supplies them by reading `/editable-catalog.json` and
`/downloads/<slug>/editable.json` through `env.ASSETS` — the same
"describe exactly the bytes this deployment serves" property as the catalog,
with the same isolate-level memoization. The stdio bin reads the installed
package / falls back to the site, as `node/resources.ts` already does.

The remaining agent surface is documentation: `llms.txt` grows a templates
section (the generator already has the data), and both zip READMEs explain
the `data-edit` anchors — for the React package, grepping the id *is* the
integration, which is why A1 puts the ids in source rather than in a
sidecar only.

Nothing here needs auth or the AI gateway; the agent lane ships as soon as
A1's pilot batch exists.

## 3. The web lane: `/create`

### Shape

A `/create` gallery (the `/templates` cards, plus editable-coverage badges)
leading to `/create/<slug>` — the editor. The editor is a static-exported
client page, like everything else on the site:

- **Preview: an iframe of the real template page** (`/template/<slug>/`),
  same-origin, so the editor holds a live document it can mutate directly.
  Edits apply through `applyEdits` from `tabbied-templates` against the
  iframe's DOM — the *same function* the packager and tests run, so what the
  user watches is what the export will do. Hover outlines and
  click-to-select come from the `data-edit` attributes already in the DOM;
  selecting a slot focuses its control in the panel.
- **Panel: generated from `editable.json`**, not hand-built per site. Text
  slots → inputs with the spec's constraints; image slots → upload/replace
  (object URLs locally; R2 once signed in); the palette section → the
  existing palette components (`ColorSwatch`, the `LibraryPalette` picker,
  the user's saved `BrandPalette`s — the localStorage palettes finally get a
  second consumer); pattern slots → a compact version of the `/patterns`
  editor controls (`ButtonSelectGroup`, `ValueSlider`, `ToggleSwitch`,
  shuffle-seed), bounded by the catalog's option ranges, plus "swap design"
  via a `search_designs`-style picker filtered to the slot's fit.
- **State: an edits document**, autosaved to localStorage keyed by slug
  (anonymous) and to `/api/projects` (signed in, A4 step 5). Undo/redo is a
  cursor over edit operations. No server round-trip is on the critical path
  of any keystroke.

### Export

"Download your site" runs entirely in the browser:

1. fetch the HTML package's files — the packager already exports the
   *unzipped* folders under `/downloads/<slug>/`, so the files are
   individually addressable; the packager additionally emits a `files.json`
   manifest per package so the editor doesn't guess paths;
2. parse `index.html` (DOMParser), run `applyEdits` with the user's edits
   document — identical output to the live preview by construction;
3. swap in any replaced images, drop unused ones;
4. zip with `fflate` (already the packager's zip engine, and it runs in the
   browser) and hand the user `<brand>-site.zip`.

No server renders anything, which means the whole editor + export path works
for anonymous users before A4 lands — accounts add *saving*, not
*capability*. The React package stays download-as-authored (its README and
the spec make it agent-editable; generating modified `.tsx` in the browser
is deliberately out of scope).

### AI assists (after A4)

Two task endpoints, both optional garnish rather than architecture:
`/api/ai/site-copy` (rewrite the text slots for a described business — input
is the spec's text slots + constraints, output validated against them) and
palette suggestions via `/api/ai/brand-suggest`. Both produce ordinary edits
documents the user reviews before applying; the AI never touches the DOM
directly.

## 4. Publishing: staged deliberately

- **v1 — download.** The zip is the product. It is real, it works offline,
  and it exercises every invariant the e2e suite already guards.
- **v2 — push to GitHub.** "Create a repo with your customized site" via the
  user's own GitHub OAuth (an A4 social login with `repo` scope requested
  only at push time). The repo gets the HTML package plus the edits document
  — which makes the repo itself re-editable by any coding agent, closing the
  loop with the agent lane.
- **v3 — hosted sites (`<name>.tabbied.site`), explicitly deferred.** It is
  a different product: per-user storage of built sites (R2), a serving
  Worker, custom domains, takedown policy, abuse surface. The edits-document
  architecture doesn't prejudge it — a hosted site is just the export step
  running server-side — but nothing in v1/v2 should be built *for* it yet.

## 5. What this deliberately does not do

- **No layout editing.** Section reorder/add/remove is only meaningful for
  the 5 `TemplateSite` sites (which have `sections: SectionKey[]`); shipping
  it for 5 of 57 templates is a confusing product. Revisit if the
  `TemplateSite` model grows to more sites.
- **No arbitrary-DOM editing.** The spec is the boundary; "make everything
  clickable" turns the guarantee ("you cannot break the template") into a
  page builder, which is a different, worse product.
- **No server-side rendering of previews.** The browser already runs the
  real renderer; a Worker cannot (no browser — the `render_design` lesson).

## 6. Verification

- The editor's correctness claim is "preview equals export." That is
  testable literally: an e2e spec applies a fixture edits document in the
  editor, downloads the export, serves it (trailing-slash lesson from
  `e2e/templates.spec.ts` applies), and pixel-diffs exported page against
  the edited iframe.
- MCP additions get cases in the `tabbied-mcp` test suite (toolset with and
  without the new fetchers, both protocol eras), and `npm run preview`
  remains the way to drive the remote tools against real bytes.
- Editor panel generation gets a unit-level guarantee: every slot kind in
  the closed vocabulary has a control, so `check:editable` passing implies
  the panel can render every annotated site.

## 7. Sequencing

1. **MCP template tools + docs** — rides A1's pilot batch (5 sites); ships
   the agent lane end to end while annotation batches continue.
2. **Editor core** — iframe + `applyEdits` + generated panel + localStorage
   autosave + zip export, over whatever sites are annotated. Text, palette,
   pattern slots first; images second (upload UX is its own chunk).
3. **Accounts integration** — projects save/resume, R2 image uploads
   (A4 step 5).
4. **AI assists** — after A4's gateway exists.
5. **GitHub push** — v2 publishing.

## 8. Risks worth naming

- **Iframe editing has sharp edges** (focus management, scroll-into-view on
  slot select, the `redrawInterval` timers running while editing). Mitigate
  by pausing patterns during drag-interactions via the controllers'
  `data-paused` / `update({paused})` path — the API already exists.
- **Spec coverage becomes the product bottleneck.** The editor is only as
  good as annotation coverage; that is why the gallery shows coverage
  honestly and why A1 orders annotation batches by what `/create` features.
- **Scope creep toward page-builder.** The §5 boundaries are the defense;
  every "can I also move this section" request routes to the roadmap, not
  the spec.
