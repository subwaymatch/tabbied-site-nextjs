---
'tabbied': minor
---

Make the catalog agent-usable: closed-vocabulary metadata, preview images, a
`tabbied` CLI, and agent docs in the tarball.

- **Every design now carries `tags`, `mood`, `density`, and `goodFor`** —
  closed-vocabulary enums (see `scripts/catalog-vocabulary.mjs`) authored by
  looking at each rendered design, validated by codegen at build time, and
  published in `catalog.json`. The catalog is now queryable ("sparse designs
  that suit a hero background") instead of merely readable. The fields are
  catalog-only: the runtime bundle and `PatternDefinition` are unchanged.
- **Every design has a stable preview image** at
  `https://tabbied.com/previews/<slug>.webp` (authored palette, default
  options, fixed seed), listed as `preview` in its catalog entry — so a
  multimodal tool can look at a shortlist before committing to a slug.
- **New `tabbied` CLI** (`npx tabbied …`): `render <slug>` to SVG or PNG at
  any size/seed/palette, `--frames N --reseed-every M` for deterministic
  video-ready PNG sequences, and `list`/`info` to query the catalog from a
  shell. Rendering uses whatever Playwright the project already has; no
  browser is downloaded on install.
- **The tarball now ships `llms.txt` and `AGENTS.md`** — the complete
  agent-facing reference (entry points, sizing gotchas, recipes for hero
  backgrounds / video frames / static HTML, the editor share-URL scheme, and
  a one-line entry per design). Generation moved into the package build, so
  a publish can't ship without them; the site serves the same texts at
  /llms.txt and /llms-full.txt.
