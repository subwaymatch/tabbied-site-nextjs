// N. Speck — hard-edged dot fields.
//
// The same tiled radial-gradient section C fades, left alone: every dot the
// same weight, all the way across. Change the tile and the pitch changes;
// change the stop and the dot grows or shrinks — from a tint with texture in
// it up to a field so dense the gaps become the drawing.
//
// The converter turns a tiled layer into an SVG <pattern> holding one dot, so
// a field of four hundred costs one gradient and lands on the browser's own
// tile origin. Everything here is a mask, so the gaps are real holes.
import {
  section,
  A,
  B,
  F,
  TR,
  ink,
  rot,
  msk,
  mskI,
  dotsL,
  bandL,
  faded,
  both,
  c1,
  R2,
  R4,
} from './shared.mjs';

const { add, all } = section('N. Speck');

const field = (c, ...layers) => `${F} { ${faded(c, ...layers)} }${TR}`;

add(
  'Specks',
  'Dots small enough and far enough apart that the ground is the subject.',
  (c) => ({ rule: field(c, dotsL('18%', '22%')) }),
  { pal: 1 }
);

add(
  'Dotset',
  'Nine dots to a cell, each a third of its own tile.',
  (c) => ({ rule: field(c, dotsL('33%', '33.34%')) }),
  { pal: 25 }
);

add(
  'Dotgrid',
  'A close even field, the dot and its gap the same width.',
  (c) => ({ rule: field(c, dotsL('30%', '14.3%')) }),
  { pal: 47 }
);

add(
  'Dotpair',
  'Two fields of different pitches in two inks, one over the other.',
  (c) => ({
    // Both fields go on pseudo-elements: a mask on the cell would clip its own
    // children, and the two dot fields would come out intersected rather than
    // stacked.
    rule: `${F} { ${B(`inset: 0; background: ${c1}; ${msk(dotsL('30%', '33.34%'))}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${msk(dotsL('16%', '11.1%'))}`)} }${TR}`,
  }),
  { pal: 60 }
);

add(
  'Dotstack',
  'Dense dots, close enough that the ink joins up and the gaps become the drawing.',
  (c) => ({ rule: field(c, dotsL('46%', '14.3%')) }),
  { pal: 10 }
);

add(
  'Dotcut',
  'A dot field with a broad band of it cut clean out.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { ${both(c, dotsL('30%', '16.67%'), 'linear-gradient(180deg, #000 0 38%, transparent 38% 62%, #000 62%)')} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 35 }
);

add(
  'Gritfield',
  'The finest field in the section — a texture rather than a pattern.',
  (c) => ({ rule: field(c, dotsL('28%', '9%')) }),
  { pal: 54 }
);

add(
  'Dotband',
  'Dots confined to a band across the middle of the cell.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${both(c, dotsL('34%', '16.67%'), 'linear-gradient(180deg, transparent 0 34%, #000 34% 66%, transparent 66%)')} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 69 }
);

add(
  'Dotrow',
  'A single row of dots, sitting on a rule that runs the width of the cell.',
  (c) => ({
    // The band picks out exactly one tile row (tiles are 16.67% tall, so the
    // third runs 33.34%-50%), which is what keeps the dots whole rather than
    // sliced.
    rule: `--rot: ${R4}; ${F} { ${B(`inset: 0; background: ${ink(c, 2)}; ${mskI(dotsL('40%', '16.67%'), 'linear-gradient(180deg, transparent 0 33.34%, #000 33.34% 50%, transparent 50%)')}`)} ${A(`left: 0; right: 0; top: 52%; height: 6%; background: ${c1};`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 16 }
);

add(
  'Dotring',
  'A dot field cut to a ring, so the field itself is the shape.',
  (c) => ({
    rule: `${F} { ${both(c, dotsL('36%', '12.5%'), bandL('26%', '92%'))} }${TR}`,
  }),
  { pal: 40 }
);

export const sectionN = { title: 'N. Speck', all };
