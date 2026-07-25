---
'tabbied': minor
---

Add 19 ordered, background-independent artwork presets (batch 6).

Two properties set this batch apart.

**Ordered.** Where the earlier batches lean on scatter — Confetti, Shard and
Sprinkles roll a fresh position, size and angle for every cell — nothing here
is placed at random. Every shape sits on the cell grid, and what varies from
cell to cell varies by rule: `@match` on the cell's column/row/index, `@pn()`
cycling a value in order, or `@calc()` ramping a size, angle or bore across the
canvas. No `@rand()` anywhere. Reseeding re-inks a design without rearranging
it, so a redraw reads as a new colorway of the same pattern.

**Background-independent.** A design that knocks holes out of its shapes by
painting `var(--color0)` only looks right while the background is opaque —
set the background slot to transparent and those "holes" stop erasing
anything. So every gap in this batch is real geometry (a clip-path hole, a
mask, or a gap between shapes) and no rule paints the background color. Each
design renders identically over any background, including none, which makes
them usable as overlays and transparent PNG exports.

The designs: Louvre, Kerf, Damier, Bias, Hurdle, Isocube, Lintel, Lunette,
Annulus, Ovolo, Cove, Mortise, Rafter, Ogee, Buttonhole, Gutter, Diminuendo,
Taper and Torsion.
