// L. Zigzag — the chevron as knitting knows it.
//
// Single bands, nested pairs, sawtooth skylines, and the lattice a cable
// crossing leaves — polygons where the zig must hold a crisp point, stripe
// intersections where a whole field of diamonds is wanted, and one row of
// arches for the courses of loops themselves. The knitting-frame names are
// exact: racking is the needle bed shifted sideways, a tuck is a stitch held
// flat instead of pointed.
import {
  section,
  A,
  B,
  F,
  TR,
  cp,
  ink,
  poly,
  rot,
  faded,
  both,
  msk,
  mskI,
  slotL,
  dotsL,
  archTileL,
  pieL,
  bandLin,
  across,
  R2,
  R4,
} from './shared.mjs';

const { add, all } = section('L. Zigzag');

const profile = (c, shape, turns = R4) =>
  `--rot: ${turns}; ${F} { background: ${ink(c)}; ${cp(shape)} ${rot('@var(--rot)')} }${TR}`;

const turned = (c, decls, turns = R4) =>
  `--rot: ${turns}; ${F} { ${decls} ${rot('@var(--rot)')} }${TR}`;

add(
  'Chevron',
  'One bold V-band pointing up the middle of the cell.',
  (c) => ({
    rule: profile(c, poly([[0, 34], [50, 66], [100, 34], [100, 60], [50, 92], [0, 60]])),
  }),
  { pal: 4 }
);

add(
  'Aran',
  'Two chevrons nested one above the other, as a cable panel stacks them.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(
      `inset: 0; background: ${ink(c)}; ${cp(poly([[0, 8], [50, 40], [100, 8], [100, 30], [50, 62], [0, 30]]))}`
    )} ${A(
      `inset: 0; background: ${ink(c)}; ${cp(poly([[0, 46], [50, 78], [100, 46], [100, 68], [50, 100], [0, 68]]))}`
    )} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 39 }
);

add(
  'Gansey',
  'A full zigzag band, tooth after tooth across the cell.',
  (c) => ({
    rule: profile(
      c,
      poly([
        [0, 42], [16, 22], [33, 42], [50, 22], [66, 42], [83, 22], [100, 42],
        [100, 62], [83, 42], [66, 62], [50, 42], [33, 62], [16, 42], [0, 62],
      ])
    ),
  }),
  { pal: 13 }
);

add(
  'Guernsey',
  'A sawtooth skyline filled solid to the hem.',
  (c) => ({
    rule: profile(
      c,
      poly([[0, 44], [25, 20], [50, 44], [75, 20], [100, 44], [100, 100], [0, 100]])
    ),
  }),
  { pal: 56 }
);

add(
  'Fairisle',
  'A band of small diamonds carried across the row.',
  (c) => ({
    rule: turned(
      c,
      `${A(
        `left: 0; right: 0; top: 32%; height: 36%; background: ${ink(c)}; ${mskI(
          slotL('45deg', '12%', '25%'),
          slotL('135deg', '12%', '25%')
        )}`
      )}`
    ),
  }),
  { pal: 22 }
);

add(
  'Intarsia',
  'Two big diamond blocks meeting point to point.',
  (c) => ({
    rule: profile(
      c,
      poly([[0, 50], [25, 26], [50, 50], [75, 26], [100, 50], [75, 74], [50, 50], [25, 74]]),
      R2
    ),
  }),
  { pal: 46 }
);

add(
  'Racking',
  'The same chevron knit twice with the bed shifted between passes.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(
      `inset: 0; background: ${ink(c)}; ${cp(poly([[0, 22], [36, 54], [72, 22], [72, 44], [36, 76], [0, 44]]))}`
    )} ${A(
      `inset: 0; background: ${ink(c)}; ${cp(poly([[28, 24], [64, 56], [100, 24], [100, 46], [64, 78], [28, 46]]))} opacity: 0.72;`
    )} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 34 }
);

add(
  'Tuck',
  'A chevron held flat at the point instead of peaked.',
  (c) => ({
    rule: profile(
      c,
      poly([[0, 40], [30, 16], [70, 16], [100, 40], [100, 64], [70, 40], [30, 40], [0, 64]])
    ),
  }),
  { pal: 61 }
);

add(
  'Wale',
  'Ribbing read end-on: paired ribs with a groove down each pair.',
  (c) => ({
    rule: turned(
      c,
      faded(
        c,
        'repeating-linear-gradient(90deg, #000 0 8%, transparent 8% 10%, #000 10% 18%, transparent 18% 33.33%)'
      ),
      R2
    ),
  }),
  { pal: 69 }
);

add(
  'Course',
  'Rows of loops stacked as a field of scallops.',
  (c) => ({ rule: turned(c, faded(c, archTileL('40%', '25%', '25%'))) }),
  { pal: 8 }
);

add(
  'Loom',
  'Strands crossing both ways at once: a full diagonal lattice.',
  (c) => ({
    rule: turned(c, faded(c, slotL('45deg', '10%', '33.33%'), slotL('135deg', '10%', '33.33%'))),
  }),
  { pal: 52 }
);

add(
  'Heddle',
  'Upright wires with an eye in the middle of each.',
  (c) => ({
    rule: turned(c, faded(c, slotL('90deg', '6%', '20%'), dotsL('16%', '20%')), R2),
  }),
  { pal: 75 }
);

add(
  'Shuttle',
  'The weaver’s shuttle: a pointed oval lying on its side.',
  (c) => ({
    rule: profile(c, poly([[6, 50], [38, 30], [62, 30], [94, 50], [62, 70], [38, 70]]), R2),
  }),
  { pal: 29 }
);

add(
  'Treadle',
  'Three levers fanned from a hinge low in the corner.',
  (c) => ({
    rule: turned(
      c,
      faded(
        c,
        pieL('9deg', { from: '287deg', at: '8% 92%' }),
        pieL('9deg', { from: '307deg', at: '8% 92%' }),
        pieL('9deg', { from: '327deg', at: '8% 92%' })
      )
    ),
  }),
  { pal: 43 }
);

add(
  'Sley',
  'The beater’s comb: a solid back bar with teeth hung from it.',
  (c) => ({
    rule: turned(c, faded(c, bandLin('180deg', '18%', '30%'), slotL('90deg', '6%', '14.28%'))),
  }),
  { pal: 18 }
);

export const sectionL = { title: 'L. Zigzag', all };
