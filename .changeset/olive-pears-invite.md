---
'tabbied': minor
---

Add 234 new generative designs, bringing the preset catalog to 348.

**Batch 7 (orders 700+, 24 designs)** works in the idiom of the eleven artworks
Syung Hong drew by hand: one shape per cell, its outline rolled out of a short,
deliberately chosen library rather than a continuum, and a single ink sampled
per cell.

**Batch 8 (orders 900+, 10 designs)** is organised around css-doodle's own
generators — `@shape()` walking an equation into a clip-path, `mask: @svg(...)`,
CSS gradient masks, `@match` on the cell's address, and `mask: @doodle(...)`.

**Batch 9 (orders 1000+, 200 designs)** inverts the usual relationship between
cell and canvas. Every batch before it draws a tile and repeats it; these read
`@x`/`@y` against `@X`/`@Y` and use them to place the cell inside one larger
picture, so changing the grid changes the resolution of the composition rather
than the number of copies. It leans on three things no earlier batch used: real
maths on the cell coordinates (`@sqrt`, `@atan2`, `@sin`), conic gradients — the
only way to sweep a value round an angle — and SVG *stroke*, for line art rather
than filled shapes. Nine sections: radial fields, angular fields, ramps, conic,
line art, mirrors, perspective, interference and weights.

Every design in all three batches is background-independent: no rule paints
`var(--color0)`, so every gap is real geometry — a mask, a clip-path hole, a
`frame:` outline, or a gap between elements — and each renders identically over
any background, including a transparent one.
