// Q. Wedge — triangles.
//
// The simplest polygon and the one that most changes what a grid looks like:
// three points and a quarter turn, and a field of identical cells stops
// reading as a grid at all. clip-path exports as a <clipPath> with the same
// points, so a triangle is exact wherever it lands.
import { section, A, B, F, TR, cp, ink, poly, rot, R4, c1 } from './shared.mjs';

const { add, all } = section('Q. Wedge');

/** One clipped shape on an otherwise empty cell. */
const shape = (c, points, turns = R4) =>
  `--rot: ${turns}; ${F} { ${A(`inset: 0; background: ${ink(c)}; ${cp(poly(points))}`)} ${rot('@var(--rot)')} }${TR}`;

add(
  'Wedgepair',
  'Two triangles point to point, meeting at the middle of the cell.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`inset: 0; background: ${c1}; ${cp(poly([[0, 0], [0, 100], [46, 50]]))}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${cp(poly([[100, 0], [100, 100], [54, 50]]))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 3 }
);

add(
  'Trislice',
  'A tall narrow triangle standing on the base of the cell.',
  (c) => ({ rule: shape(c, [[50, 4], [78, 96], [22, 96]]) }),
  { pal: 26 }
);

add(
  'Wedgecut',
  'A right triangle filling half the cell, cut on the diagonal.',
  (c) => ({ rule: shape(c, [[0, 0], [100, 100], [0, 100]]) }),
  { pal: 47 }
);

add(
  'Tristack',
  'Three triangles of decreasing size, stacked up one edge.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`inset: 0; background: ${c1}; ${cp(poly([[0, 100], [100, 100], [50, 44]]))}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${cp(poly([[16, 44], [84, 44], [50, 4]]))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 63 }
);

add(
  'Wedgeband',
  'A triangle with its point cut off square — a trapezoid on one edge.',
  (c) => ({ rule: shape(c, [[0, 100], [100, 100], [72, 26], [28, 26]]) }),
  { pal: 8 }
);

add(
  'Trifield',
  'Four triangles from the corners, leaving a diamond of ground in the middle.',
  (c) => ({
    rule: `${F} { ${B(`inset: 0; background: ${c1}; ${cp(poly([[0, 0], [44, 0], [0, 44]]))}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${cp(poly([[100, 100], [56, 100], [100, 56]]))}`)} @even { ${rot('90deg')} } }${TR}`,
  }),
  { pal: 39 }
);

add(
  'Wedgerow',
  'A row of small triangles standing on a common line, all facing the same way.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`left: 0; right: 0; top: 68%; height: 8%; background: ${c1};`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${cp('polygon(6% 68%, 27% 22%, 48% 68%, 52% 68%, 73% 22%, 94% 68%)')}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 55 }
);

export const sectionQ = { title: 'Q. Wedge', all };
