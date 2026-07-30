// A. Split — one straight cut across the cell, with an ink either side.
//
// The simplest thing a cell can do and still be a drawing: divide. Where the
// cut lands, how it leans, whether the two parts touch or leave a gap between
// them, and whether one of them sits proud of the other is the whole of this
// section.
//
// Almost every design here lays the second ink *over* a full-bleed first
// rather than butting two clipped shapes edge to edge. One anti-aliased edge
// instead of two abutting ones is both the better drawing and the better
// export: abutting AA edges are exactly where a vector renderer and a CSS
// painter disagree.
import { section, A, B, F, TR, cp, ink, poly, rot, R2, R4, c1 } from './shared.mjs';

const { add, all } = section('A. Split');

// The overlay: a second ink laid across part of a full-bleed cell.
const over = (shape, inkValue) => A(`inset: 0; background: ${inkValue}; ${cp(shape)}`);

const TRI_TL = poly([[0, 0], [100, 0], [0, 100]]);
const TRI_BR = poly([[100, 0], [100, 100], [0, 100]]);

add(
  'Ridgeline',
  'One diagonal cut corner to corner, a different ink each side of it, and the ridge turning a quarter at a time.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${over(TRI_TL, ink(c))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 0 }
);

add(
  'Waterline',
  'A level cut halfway up the cell, the ink below it heavier than the ink above.',
  (c) => ({
    rule: `${F} { background: ${ink(c, 2)}; ${over(poly([[0, 50], [100, 50], [100, 100], [0, 100]]), c1)} }${TR}`,
  }),
  { pal: 6 }
);

add(
  'Sill',
  'The cut sits low, so the upper ink takes most of the cell and the lower reads as a shelf.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${over(poly([[0, 72], [100, 72], [100, 100], [0, 100]]), ink(c))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 11 }
);

add(
  'Highwater',
  'A high horizon: a thin band of one ink above a deep field of another.',
  (c) => ({
    rule: `${F} { background: ${ink(c, 2)}; ${over(poly([[0, 0], [100, 0], [100, 26], [0, 26]]), c1)} }${TR}`,
  }),
  { pal: 26 }
);

add(
  'Cantline',
  'The cut leans off true by a few degrees, so every cell tilts the same way without lining up.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${over(poly([[0, 38], [100, 62], [100, 100], [0, 100]]), ink(c))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 13 }
);

add(
  'Slipjoint',
  'Two halves of one diagonal, pulled a little apart so the sheet shows in the joint between them.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`inset: 0; background: ${ink(c)}; ${cp(poly([[0, 0], [96, 0], [0, 96]]))}`)} ${A(`inset: 0; background: ${ink(c)}; ${cp(poly([[100, 4], [100, 100], [4, 100]]))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 3 }
);

add(
  'Thirdstop',
  'Two cuts rather than one: three bands across the cell, the middle one the odd ink out.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { background: ${ink(c)}; ${over(poly([[0, 34], [100, 34], [100, 66], [0, 66]]), ink(c))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 19 }
);

add(
  'Overrun',
  'The upper part runs past the cut and hangs over the edge of the cell below it.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c, 2)}; ${A(`left: -6%; right: -6%; top: 44%; bottom: -8%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 22 }
);

add(
  'Shallowcut',
  'A cut at a very shallow angle, so the two inks meet along a line that is almost level.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${over(poly([[0, 46], [100, 54], [100, 100], [0, 100]]), ink(c))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 30 }
);

add(
  'Quarterturn',
  'The cell divided into two unequal parts, and the division turning through the four quarters.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${over(poly([[0, 0], [64, 0], [0, 64]]), ink(c))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 8 }
);

add(
  'Applique',
  'The second ink is inset all round rather than running to the edge, so it sits on the first like a patch.',
  (c) => ({
    rule: `${F} { background: ${c1}; ${A(`inset: 12%; background: ${ink(c, 2)}; ${cp(poly([[0, 0], [100, 0], [100, 100]]))}`)} }${TR}`,
  }),
  { pal: 20 }
);

add(
  'Swapcut',
  'One diagonal, and the ink either side of it changing places every other cell.',
  (c) => ({
    rule: `${F} { background: ${ink(c)}; ${over(TRI_TL, ink(c))} @even { ${rot('180deg')} } }${TR}`,
  }),
  { pal: 4 }
);

add(
  'Listing',
  'The overlay is set a few degrees off the cut it follows, so the two edges never quite agree.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${A(`inset: 0; background: ${ink(c)}; ${cp(TRI_BR)} ${rot('6deg')}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 45 }
);

add(
  'Crossquarter',
  'Both diagonals drawn, so the cell reads as four triangles with two of them inked.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${B(`inset: 0; background: ${ink(c)}; ${cp(poly([[0, 0], [50, 50], [100, 0]]))}`)} ${A(`inset: 0; background: ${ink(c)}; ${cp(poly([[0, 100], [50, 50], [100, 100]]))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 24 }
);

add(
  'Steppedcut',
  'The cut goes down in three steps instead of running straight.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${over(poly([[0, 34], [34, 34], [34, 56], [68, 56], [68, 78], [100, 78], [100, 100], [0, 100]]), ink(c))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 12 }
);

add(
  'Sawcut',
  'A zigzag seam: the two inks interlock along a row of teeth.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${over(poly([[0, 50], [16, 34], [33, 50], [50, 34], [66, 50], [83, 34], [100, 50], [100, 100], [0, 100]]), ink(c))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 55 }
);

add(
  'Bowcut',
  'The seam bows: a circle bites into one ink and the other fills the bite.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${A(`inset: 0; background: ${ink(c)}; ${cp('circle(58% at 50% 118%)')}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 40 }
);

add(
  'Goldenline',
  'The cut lands on the golden section rather than the middle, which is why it never looks halved.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${over(poly([[0, 61.8], [100, 61.8], [100, 100], [0, 100]]), ink(c))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 58 }
);

add(
  'Seamband',
  'A third ink laid in a narrow band right on the seam, so the join is drawn rather than implied.',
  (c) => ({
    // The upper block runs on *under* the band rather than stopping at it: a
    // clip-path edge butted against a plain box edge is the one abutment CSS
    // and SVG round differently, so the band covers the join instead.
    rule: `--rot: ${R2}; ${F} { background: ${ink(c, 3)}; ${B(`left: 0; right: 0; top: 0; height: 54%; background: ${c1};`)} ${A(`top: 46%; left: 0; right: 0; height: 8%; background: var(--color2);`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 16 }
);

add(
  'Halfmast',
  'A vertical cut, and each half masked back to half its height so the two never sit level.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`left: 0; width: 50%; top: 0; height: 62%; background: ${ink(c)};`)} ${A(`right: 0; width: 50%; bottom: 0; height: 62%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 35 }
);

add(
  'Floatcut',
  'Both parts pulled in from the edges, so the split floats clear of the cell that holds it.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`inset: 10%; background: ${ink(c)}; ${cp(poly([[0, 0], [100, 0], [0, 100]]))}`)} ${A(`inset: 10%; background: ${ink(c)}; ${cp(poly([[100, 8], [100, 100], [8, 100]]))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 63 }
);

add(
  'Notchcut',
  'A straight cut with one square notch taken out of the middle of it.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${over(poly([[0, 44], [38, 44], [38, 60], [62, 60], [62, 44], [100, 44], [100, 100], [0, 100]]), ink(c))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 71 }
);

add(
  'Fivebar',
  'Five upright bands, alternating ink, so the cut repeats instead of happening once.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { background: ${ink(c)}; ${B(`inset: 0; background: ${ink(c)}; ${cp(poly([[20, 0], [40, 0], [40, 100], [20, 100]]))}`)} ${A(`inset: 0; background: ${ink(c)}; ${cp(poly([[60, 0], [80, 0], [80, 100], [60, 100]]))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 47 }
);

add(
  'Slantband',
  'A single slanted band right across the cell, edge to edge, at a fixed lean.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${over(poly([[0, 20], [100, 0], [100, 46], [0, 66]]), ink(c))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 66 }
);

add(
  'Chordcut',
  'The cut is a chord across a disc: the cell rounds off and then divides.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('circle(50%)')} ${over(poly([[0, 58], [100, 58], [100, 100], [0, 100]]), ink(c))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 74 }
);

export const sectionA = { title: 'A. Split', all };
