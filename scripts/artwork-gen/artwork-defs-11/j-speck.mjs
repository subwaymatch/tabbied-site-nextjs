// J. Speck — dot fields and halftones.
//
// A radial-gradient with a hard stop is one dot; give it a background-size
// smaller than the box and it tiles into a field. Change the tile and the
// pitch changes; change the stop and the dot grows or shrinks; offset a second
// field by half a tile and the lattice turns from square to staggered.
//
// The converter turns a tiled layer into an SVG <pattern> holding one dot, so
// a field of four hundred costs one gradient and lands on the browser's own
// tile origin. Every design here is a mask, so the gaps are real holes.
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
  discL,
  slotL,
  halfL,
  R2,
  R4,
  c1,
} from './shared.mjs';

const { add, all } = section('J. Speck');

/** A tiled dot field: `r` of each `pitch`-sized tile is inked. */
const dots = (r, pitch, offset = '0 0') =>
  `radial-gradient(circle at 50% 50%, #000 ${r}, transparent ${r}) ${offset} / ${pitch} ${pitch}`;

/** The plainest dot design: one ink, cut into a field of dots. */
const dotted = (c, r, pitch) => `background: ${ink(c)}; ${msk(dots(r, pitch))}`;

add(
  'Speckfield',
  'Small dots on a wide pitch, so the cell reads as a tint with texture in it.',
  (c) => ({ rule: `${F} { ${dotted(c, '16%', '25%')} }${TR}` }),
  { pal: 0 }
);

add(
  'Dotfield',
  'A plain even field: the dot half the width of its tile.',
  (c) => ({ rule: `${F} { ${dotted(c, '25%', '20%')} }${TR}` }),
  { pal: 19 }
);

add(
  'Pindot',
  'The smallest dot that still reads, on a close pitch.',
  (c) => ({ rule: `${F} { ${dotted(c, '17%', '12.5%')} }${TR}` }),
  { pal: 12 }
);

add(
  'Polkadot',
  'Big dots on a wide pitch — four or five to a cell and no more.',
  (c) => ({ rule: `${F} { ${dotted(c, '32%', '33.34%')} }${TR}` }),
  { pal: 27 }
);

add(
  'Grainfield',
  'Dots dense enough that the ink joins up and the gaps become the drawing.',
  (c) => ({ rule: `${F} { ${dotted(c, '44%', '16.67%')} }${TR}` }),
  { pal: 34 }
);

add(
  'Sandfield',
  'A fine close field, nearer a texture than a pattern.',
  (c) => ({ rule: `${F} { ${dotted(c, '22%', '14.3%')} }${TR}` }),
  { pal: 46 }
);

add(
  'Peppering',
  'Two dot fields at different pitches laid over each other in different inks.',
  (c) => ({
    rule: `${F} { ${B(`inset: 0; background: ${c1}; ${msk(dots('22%', '25%'))}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${msk(dots('14%', '16.67%'))}`)} }${TR}`,
  }),
  { pal: 55 }
);

add(
  'Mottle',
  'A staggered field: the second row offset half a tile from the first.',
  (c) => ({
    rule: `${F} { background: ${ink(c)}; ${msk(dots('26%', '25%'), dots('26%', '25%', '12.5% 12.5%'))} }${TR}`,
  }),
  { pal: 9 }
);

add(
  'Spotting',
  'Dots with a second, larger dot set among them at a wider pitch.',
  (c) => ({
    rule: `${F} { background: ${ink(c)}; ${msk(dots('18%', '16.67%'), dots('34%', '50%', '25% 25%'))} }${TR}`,
  }),
  { pal: 41 }
);

add(
  'Beadfield',
  'A field of dots cut to a disc, so it reads as one round shape made of many.',
  (c) => ({
    rule: `${F} { background: ${ink(c)}; ${mskI(dots('28%', '20%'), discL('48%'))} }${TR}`,
  }),
  { pal: 21 }
);

add(
  'Pearlfield',
  'Dots in rows with a wide gap between the rows, so the field reads as banded.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { background: ${ink(c)}; ${mskI(dots('30%', '16.67%'), slotL('0deg', '17%', '33%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 30 }
);

add(
  'Caviar',
  'A dense staggered field of small dots, packed almost to touching.',
  (c) => ({
    rule: `${F} { background: ${ink(c)}; ${msk(dots('30%', '12.5%'), dots('30%', '12.5%', '6.25% 6.25%'))} }${TR}`,
  }),
  { pal: 62 }
);

add(
  'Semolina',
  'A fine field with a coarse one over it, both in the same ink.',
  (c) => ({
    rule: `${F} { background: ${ink(c)}; ${msk(dots('16%', '10%'), dots('26%', '33.34%'))} }${TR}`,
  }),
  { pal: 15 }
);

add(
  'Shotfield',
  'Dots only in half the cell, the rest left clear.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${mskI(dots('28%', '20%'), halfL('180deg', '52%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 24 }
);

add(
  'Buckshot',
  'Large dots on a coarse pitch, cut to a triangle.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${mskI(dots('36%', '25%'), 'linear-gradient(135deg, #000 0 50%, transparent 50% 100%)')} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 57 }
);

add(
  'Birdseye',
  'One dot per tile with a smaller one nested inside it in a second ink.',
  (c) => ({
    rule: `${F} { ${B(`inset: 0; background: ${c1}; ${msk(dots('34%', '25%'))}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${msk(dots('15%', '25%'))}`)} }${TR}`,
  }),
  { pal: 68 }
);

add(
  'Fisheye',
  'Rings rather than dots: each tile carries an annulus.',
  (c) => ({
    rule: `${F} { background: ${ink(c)}; ${msk('radial-gradient(circle at 50% 50%, transparent 22%, #000 22% 38%, transparent 38%) 0 0 / 25% 25%')} }${TR}`,
  }),
  { pal: 4 }
);

add(
  'Dotscreen',
  'A halftone screen set on the diagonal, the way a printer would angle it.',
  (c) => ({
    rule: `${F} { background: ${ink(c)}; ${msk(dots('30%', '20%'))} ${rot('45deg')} }${TR}`,
  }),
  { pal: 51 }
);

add(
  'Rosette',
  'Two screens at different angles, each in its own ink, the way process colours overlap.',
  (c) => ({
    rule: `${F} { ${B(`inset: -20%; background: ${c1}; ${msk(dots('30%', '18%'))} ${rot('15deg')}`)} ${A(`inset: -20%; background: ${ink(c, 2)}; ${msk(dots('30%', '18%'))} ${rot('-30deg')}`)} }${TR}`,
  }),
  { pal: 71 }
);

add(
  'Moirefield',
  'Two fields at nearly the same pitch, so where they agree and disagree becomes the pattern.',
  (c) => ({
    rule: `${F} { ${B(`inset: 0; background: ${c1}; ${msk(dots('30%', '14.3%'))}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${msk(dots('30%', '15.4%'))}`)} }${TR}`,
  }),
  { pal: 39 }
);

add(
  'Duotone',
  'One dot field over a solid field of a second ink.',
  (c) => ({
    rule: `${F} { background: ${c1}; ${A(`inset: 0; background: ${ink(c, 2)}; ${msk(dots('32%', '20%'))}`)} }${TR}`,
  }),
  { pal: 50 }
);

add(
  'Coarsescreen',
  'A screen so coarse there are only a handful of dots to a cell.',
  (c) => ({ rule: `${F} { ${dotted(c, '38%', '50%')} }${TR}` }),
  { pal: 26 }
);

add(
  'Dotmatrix',
  'A field of squares instead of dots — the same lattice, cut with straight edges.',
  (c) => ({
    rule: `${F} { background: ${ink(c)}; ${mskI(slotL('90deg', '11%', '20%'), slotL('0deg', '11%', '20%'))} }${TR}`,
  }),
  { pal: 65 }
);

add(
  'Perforation',
  'Holes rather than dots: the field is solid and the lattice is what is taken out.',
  (c) => ({
    rule: `${F} { background: ${ink(c)}; ${msk('radial-gradient(circle at 50% 50%, transparent 30%, #000 30%) 0 0 / 20% 20%')} }${TR}`,
  }),
  { pal: 43 }
);

add(
  'Studfield',
  'Dots on a wide pitch with a ring drawn round each one.',
  (c) => ({
    rule: `${F} { ${B(`inset: 0; background: ${c1}; ${msk(dots('16%', '25%'))}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${msk('radial-gradient(circle at 50% 50%, transparent 28%, #000 28% 38%, transparent 38%) 0 0 / 25% 25%')}`)} }${TR}`,
  }),
  { pal: 74 }
);

export const sectionJ = { title: 'J. Speck', all };
