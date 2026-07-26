---
'tabbied': minor
---

Add 224 new generative designs, bringing the preset catalog to 338.

**Batch 7 (gallery orders 700+, 24 designs)** works in the idiom of the eleven
artworks Syung Hong drew by hand — Radius, Mixtape, Odessa, Symmetry, Veil,
Blossom, Disque, Bloks, Terrain, Trigram and Ring: one shape per cell, its
outline rolled out of a short, deliberately chosen library rather than a
continuum, and a single ink sampled per cell.

**Batch 8 (gallery orders 900+, 200 designs)** is organised by technique rather
than by subject, and each section is one thing css-doodle can do that the
earlier batches never used: `@shape()` walking a polar or parametric equation
into a clip-path; the same shape maker's `frame:` mode, which returns an
outline as one closed path so the middle is a genuine hole; `@m6(...)` writing
six comma-separated box-shadows from one declaration; `mask: @svg(...)` and
`mask: @doodle(...)`, where the structure is an inline SVG or a whole nested
doodle and the paint stays a plain sampled colour; `content: "\@hex(...)"`
printing from the Geometric Shapes and Braille blocks; `@match` against `@x`,
`@y`, `@i` and the `@Math` functions; `@repeat(4, @rand(...))` for eight
independent corner radii; `@svg-filter(feTurbulence ...)`; `@stripe()`; and
`@plot()` feeding coordinates to `@m()`.

Every design in both batches is background-independent: no rule paints
`var(--color0)`, so every gap is real geometry — a `frame:` outline, a mask, a
clip-path hole, or a gap between elements — and the design renders identically
over any background, including a transparent one.
