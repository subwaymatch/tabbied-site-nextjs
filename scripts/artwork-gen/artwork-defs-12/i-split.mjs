// I. Split — one cut across the cell, with an ink either side of it.
//
// Where section A softens a boundary until it stops being one, this section
// keeps it: a straight edge, and the two inks it separates. The variety is in
// where the cut lands, how far it leans, and whether the two parts meet, miss,
// or leave a third thing between them.
//
// Most of these lay the second ink *over* a full-bleed first rather than
// butting two clipped shapes edge to edge. One anti-aliased edge instead of
// two abutting ones is both the better drawing and the better export:
// abutting AA edges are exactly where a vector renderer and a CSS painter
// disagree.
import { section, A, B, F, TR, cp, ink, poly, rot, R2, R4, c1 } from './shared.mjs';

const { add, all } = section('I. Split');

/** A second ink laid across part of a full-bleed cell. */
const over = (shape, inkValue) => A(`inset: 0; background: ${inkValue}; ${cp(shape)}`);

/** The standard shape of the section: full bleed, one cut, a quarter turn. */
const split = (c, shape, turns = R4) =>
  `--rot: ${turns}; ${F} { background: ${ink(c)}; ${over(shape, ink(c))} ${rot('@var(--rot)')} }${TR}`;

add(
  'Cleave',
  'A straight cut a little off centre, so the two parts are never the same size.',
  (c) => ({ rule: split(c, poly([[0, 0], [42, 0], [42, 100], [0, 100]])) }),
  { pal: 2 }
);

add(
  'Offcut',
  'A shallow cut running most of the way down one side of the cell.',
  (c) => ({ rule: split(c, poly([[0, 0], [100, 0], [100, 18], [0, 46]])) }),
  { pal: 21 }
);

add(
  'Twohalf',
  'Two blocks with a channel of ground left open between them.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { ${B(`left: 0; width: 44%; top: 0; bottom: 0; background: ${ink(c)};`)} ${A(`right: 0; width: 44%; top: 0; bottom: 0; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 43 }
);

add(
  'Splitline',
  'A cut with a narrow line of a third ink laid along it, so the join is drawn.',
  (c) => ({
    // The lower block runs on under the line rather than stopping at it: a
    // clip-path edge butted against a plain box edge is the one abutment CSS
    // and SVG round differently, so the line covers the join instead.
    rule: `--rot: ${R2}; ${F} { background: ${ink(c, 3)}; ${B(`left: 0; right: 0; top: 0; height: 46%; background: ${c1};`)} ${A(`top: 44%; left: 0; right: 0; height: 5%; background: var(--color2);`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 59 }
);

add(
  'Cutaway',
  'A cut from one corner to the middle of the far side, taking most of the cell with it.',
  (c) => ({ rule: split(c, poly([[0, 0], [100, 0], [0, 62]])) }),
  { pal: 15 }
);

add(
  'Sheared',
  'A parallelogram leaning across the cell, with ground either side of it.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { ${A(`inset: 0; background: ${ink(c)}; ${cp(poly([[6, 0], [64, 0], [94, 100], [36, 100]]))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 30 }
);

add(
  'Bisect',
  'A diagonal cut with the two triangles pulled apart from each other.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`inset: 0; background: ${c1}; ${cp(poly([[0, 0], [92, 0], [0, 92]]))}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${cp(poly([[100, 8], [100, 100], [8, 100]]))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 68 }
);

add(
  'Partline',
  'Two cuts rather than one, and the middle band the odd ink out.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { background: ${ink(c)}; ${over(poly([[0, 30], [100, 30], [100, 52], [0, 52]]), ink(c))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 9 }
);

add(
  'Cleft',
  'A wedge driven into one edge and stopped before it comes out the other.',
  (c) => ({
    rule: split(c, poly([[0, 0], [100, 0], [100, 100], [56, 100], [50, 34], [44, 100], [0, 100]])),
  }),
  { pal: 76 }
);

export const sectionI = { title: 'I. Split', all };
