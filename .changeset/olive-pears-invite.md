---
'tabbied': minor
---

Add 257 new generative designs and retire 15, bringing the preset catalog to 356.

**Batch 7 (orders 700+, 24 designs)** works in the idiom of the eleven artworks
Syung Hong drew by hand: one shape per cell, its outline rolled out of a short,
deliberately chosen library rather than a continuum, and a single ink sampled
per cell.

**Batch 8 (orders 900+, 10 designs)** is organised around css-doodle's own
generators — `@shape()` walking an equation into a clip-path, `mask: @svg(...)`,
CSS gradient masks, `@match` on the cell's address, and `mask: @doodle(...)`.

**Batch 9 (orders 1000+, 23 designs)** inverts the usual relationship between
cell and canvas. Every batch before it draws a tile and repeats it; these read
`@x`/`@y` against `@X`/`@Y` and use them to place the cell inside one larger
picture, so changing the grid changes the resolution of the composition rather
than the number of copies. It leans on three things no earlier batch used: real
maths on the cell coordinates (`@sqrt`, `@atan2`), conic gradients — the only
way to sweep a value round an angle — and SVG *stroke*, for line art rather than
filled shapes.

**Batch 10 (orders 1100+, 200 designs)** sits between the two: most of these
motifs are bigger than a cell and smaller than the sheet, so the grid stops
being a frame around each drawing and becomes the thing the drawing is assembled
from. It opens with thirty-six variations on the spread — one sector of a
circle, opening from a point, cut by a conic-gradient mask — moving the apex to
a corner or an edge, boring out the hub, pairing sectors up, opening them into
whole fans, and driving the angle from where the cell sits on the sheet. Then
super-tiles spanning four cells, interlocking figure and ground, counterforms
where the drawing is the hole, layered stacks, chains that run from cell to
cell, corner-built motifs, and banding run across the sheet.

Fifteen earlier designs are retired (Morse, Daybreak, Shuffle, Domino, Aster,
Aperture, Zipper, Polaroid, Carousel, Matte, Lens, Ibeam, Tictac, Crosshatch,
Sawedge); the sample sites and showcase pages that used them now use other
presets.

Every design in all four batches is background-independent: no rule paints
`var(--color0)`, so every gap is real geometry — a mask, a clip-path hole, a
`frame:` outline, or a gap between elements — and each renders identically over
any background, including a transparent one.
