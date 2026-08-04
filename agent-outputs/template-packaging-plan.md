# Packaging the template sites as downloadable templates

A strategy, not an implementation. The question is how to ship the 36 template
sites as free starter templates in several formats without the templates
rotting the moment somebody edits a page here.

---

## 1. The decision that shapes everything else

There are two ways to produce a Svelte (or Vue, or plain-HTML) version of a
page that exists as a React component, and only one of them survives contact
with a second edit.

**Hand-porting is a trap.** Twenty sites times four formats is eighty
artefacts. Change a headline on Werkraum and you have four files to update,
three of which nobody will remember. Within two months the downloads and the
live site disagree, and the download is the one strangers see first.

**Generating from one source is the only maintainable option.** The site as
built here is already the source of truth, and it is already static: the
Next.js export produces complete HTML for every page. Everything downstream
should be derived from that export at build time, so a template can never be
staler than the page it came from.

The consequence: **plain HTML is the primary artefact and the framework
packages are wrappers around it**, not independent ports. That is a real
limitation and it should be stated on the download page rather than hidden —
see §6.

---

## 2. What actually needs to be in a package

Each site depends on five things:

| Dependency | Where it lives now | In the package |
|---|---|---|
| Markup | `app/template/<slug>/page.tsx` | Rendered HTML from the export |
| Styles | `<slug>.module.css` | The compiled CSS, class names de-hashed |
| Patterns | `tabbied` + `css-doodle` | npm dep, or a pinned CDN script |
| Photography | `public/images/sites/*.webp` | Copied, only the ones the page uses |
| Fonts | Google Fonts `<link>` | Left as a link, with a note on self-hosting |

Two of these need real work. The CSS module class names are hashed
(`werkraum-module__aB3x__heroTitle`), which is unreadable in a template and
must be rewritten to plain names. And the image set must be *per site* — the
manifest knows which slugs a page references, so the packager can copy only
those rather than all 130.

---

## 3. Proposed pipeline

```
  npm run build                        (existing static export → out/)
        │
        ▼
  scripts/package-templates.mjs        (new)
        │
        ├─ 1. read out/template/<slug>/index.html
        ├─ 2. strip the Next runtime: __next_f payload, /_next/static scripts,
        │     RSC flight data, the hydration wrapper. Keep <head> links.
        ├─ 3. collect the page's CSS from out/_next/static/css/*.css,
        │     keep only rules whose selectors the page actually uses
        ├─ 4. de-hash class names  (module__HASH__heroTitle → heroTitle)
        ├─ 5. rewrite /images/sites/x.webp?v=… → ./images/x.webp, copy those files
        ├─ 6. replace the <css-doodle> hydration point with the chosen
        │     format's mount code (see §4)
        └─ 7. zip per format
        │
        ▼
  public/templates/<slug>/<slug>-html.zip
                          <slug>-react.zip
                          <slug>-svelte.zip
                          <slug>-astro.zip
```

Steps 2 to 5 are shared. Only step 6 differs per format, which is what keeps
this from becoming four codebases.

---

## 4. The four formats, and what step 6 does for each

### HTML (the primary one)

```
werkraum-html/
  index.html          ← the stripped export, plain class names
  styles.css
  images/             ← only this page's images
  README.md
```

Patterns mount with the framework-free core, which is what `tabbied` exports
for exactly this case:

```html
<script type="module">
  import 'https://esm.sh/css-doodle';
  import { createPattern } from 'https://esm.sh/tabbied';
  import { ortho } from 'https://esm.sh/tabbied/patterns';

  createPattern(document.querySelector('[data-field="hero"]'), {
    pattern: ortho,
    palette: ['transparent', '#C9C8C1', '#8E8E88'],
    fit: 'grid', cellSize: 132, redrawInterval: 5200,
  });
</script>
```

No build step, opens from the filesystem. This is the version most people
will actually use.

### React

Wrap the HTML in a component and swap the mount calls back to
`<TabbiedPattern>`, which is a mechanical transform because the packager
already knows every field's props (it emitted them for the HTML version).
Ship as a Vite app rather than Next, so it runs with `npm i && npm run dev`
and carries no framework opinions.

```
werkraum-react/
  src/App.jsx  src/styles.css  public/images/  package.json  vite.config.js
```

`package.json` depends on `tabbied` and `css-doodle` at pinned versions.

### Svelte

Same shape, Vite again. `<css-doodle>` is a custom element, so Svelte needs
no wrapper at all — mount in `onMount` with the same `createPattern` call the
HTML version uses. The markup converts cleanly because the source is plain
HTML: `class=` stays `class=`, which is one fewer transform than React needs.

### Astro

Worth including because it is the closest match to what these pages are:
static content with one island of interactivity. The pattern mount becomes a
`client:visible` island, which also gives correct behaviour for the redraw
timer without any extra work.

---

## 5. Two problems to solve before writing code

**De-hashing class names is the fiddly part.** Two sites may both define
`.hero`, and within one page a hashed name is unique but a plain one may not
be. Scope per package (one site per zip) and it is safe — but the packager
must verify no collision inside a single page and fail loudly if there is
one, rather than silently merging two rules.

**Deciding what CSS to include.** The export bundles all pages' CSS into
shared files. Including everything makes a 40 KB template out of a 6 KB page.
Extracting per page needs the selectors actually present in that page's HTML,
which is a solved problem (`purgecss` or a small hand-rolled pass over the
parsed AST), but it must run *before* de-hashing or the matching breaks.

---

## 6. What to tell the user on the download page

Three things, plainly:

- The HTML package is the real one; React, Svelte and Astro are the same
  markup wrapped for that toolchain. Somebody expecting idiomatic Svelte
  components with props and slots will be disappointed, and should be told so
  before downloading rather than after.
- The photography is AI-generated and shipped with the template. State the
  licence explicitly. This is the single most likely thing to cause somebody
  a problem downstream.
- The patterns are live `css-doodle`, not images. That is the point of the
  template, and it is also the thing that will look broken if someone strips
  the script tag.

---

## 7. Suggested order of work

1. `package-templates.mjs` producing **HTML only**, for **one** site. Get the
   de-hashing and CSS extraction right on a single page.
2. Roll to all 36, add a smoke test that opens each zip's `index.html` in
   Playwright and asserts a `<css-doodle>` rendered and no console errors.
3. Add React, then Astro, then Svelte, each as a step-6 emitter.
4. A `/templates` page listing them, and a download link on each template
   site's own footer.

Step 2's smoke test is the part that makes this maintainable: it is what
catches a template that stopped working because a page changed.

---

## 8. Cost and scale

At 36 sites × 4 formats the output is ~144 zips. Images dominate the size:
a typical site carries 4 to 6 WebP files totalling 0.5 to 1.3 MB, so the full
set is roughly 150 to 250 MB. That is too much to commit.

Generate them in CI on release and attach to a GitHub Release, or write them
to `out/templates/` during the static build so they ship with the deploy and
never enter git. The second is simpler and keeps the download URL stable.
