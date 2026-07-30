// E. Chamfer — what is taken off the cell rather than what is put on it.
//
// Every design here starts from the full square and removes: a corner, an
// edge, a notch, a step. clip-path: polygon() is the whole toolkit, and the
// converter turns it into an SVG <clipPath> with the same points, so a
// twenty-vertex profile costs nothing and lands exactly where CSS put it.
//
// A polygon can also carry its own hole — run the outline back on itself and
// the slit is zero-width in both renderings — which is how the openings in
// this section stay real holes on a transparent background.
import {
  section,
  A,
  B,
  F,
  TR,
  cp,
  ink,
  poly,
  ngon,
  rot,
  withHole,
  rectHole,
  R2,
  R4,
  c1,
} from './shared.mjs';

const { add, all } = section('E. Chamfer');

/** A solid cell cut to a profile, turned a quarter at a time. */
const cut = (c, shape, turns = R4) =>
  `--rot: ${turns}; ${F} { background: ${ink(c)}; ${cp(shape)} ${rot('@var(--rot)')} }${TR}`;

add(
  'Cornercut',
  'One corner taken off square, and the cut turning round the cell from one to the next.',
  (c) => ({ rule: cut(c, poly([[0, 0], [62, 0], [100, 38], [100, 100], [0, 100]])) }),
  { pal: 0 }
);

add(
  'Clipcorner',
  'Two opposite corners cut, so the cell reads as a long lozenge.',
  (c) => ({
    rule: cut(c, poly([[36, 0], [100, 0], [100, 64], [64, 100], [0, 100], [0, 36]]), R2),
  }),
  { pal: 19 }
);

add(
  'Bevelset',
  'All four corners cut equally: a regular octagon held inside its square.',
  (c) => ({
    rule: cut(
      c,
      poly([[30, 0], [70, 0], [100, 30], [100, 70], [70, 100], [30, 100], [0, 70], [0, 30]]),
      R2
    ),
  }),
  { pal: 12 }
);

add(
  'Mitre',
  'A single deep cut running most of the way across, leaving a broad triangle.',
  (c) => ({ rule: cut(c, poly([[0, 0], [100, 0], [100, 24], [0, 88]])) }),
  { pal: 27 }
);

add(
  'Skewback',
  'The cut leans the other way from the corner it starts at, so the profile reads as sprung.',
  (c) => ({ rule: cut(c, poly([[0, 26], [58, 0], [100, 0], [100, 100], [0, 100]])) }),
  { pal: 34 }
);

add(
  'Nosing',
  'One edge stepped forward twice, like the nose of a tread.',
  (c) => ({
    rule: cut(c, poly([[0, 0], [100, 0], [100, 62], [70, 62], [70, 80], [36, 80], [36, 100], [0, 100]])),
  }),
  { pal: 46 }
);

add(
  'Bullnose',
  'One end rounded right off, drawn as a many-sided profile rather than a curve.',
  (c) => ({
    rule: cut(
      c,
      poly([
        [0, 0],
        [56, 0],
        [78, 6],
        [93, 22],
        [100, 50],
        [93, 78],
        [78, 94],
        [56, 100],
        [0, 100],
      ])
    ),
  }),
  { pal: 55 }
);

add(
  'Rebate',
  'A square bite taken out of the middle of one edge.',
  (c) => ({
    rule: cut(c, poly([[0, 0], [100, 0], [100, 100], [68, 100], [68, 62], [32, 62], [32, 100], [0, 100]])),
  }),
  { pal: 9 }
);

add(
  'Rabbet',
  'A rectangular step cut out of one corner, the way two boards are lapped.',
  (c) => ({
    rule: cut(c, poly([[0, 0], [100, 0], [100, 58], [58, 58], [58, 100], [0, 100]])),
  }),
  { pal: 41 }
);

add(
  'Housing',
  'A slot let into one edge and stopped short of the far side.',
  (c) => ({
    rule: cut(c, poly([[0, 0], [100, 0], [100, 100], [0, 100], [0, 66], [64, 66], [64, 34], [0, 34]])),
  }),
  { pal: 21 }
);

add(
  'Halving',
  'Two opposite notches of the same size, so the cell would key into a copy of itself.',
  (c) => ({
    rule: cut(
      c,
      poly([
        [0, 0],
        [36, 0],
        [36, 26],
        [64, 26],
        [64, 0],
        [100, 0],
        [100, 100],
        [64, 100],
        [64, 74],
        [36, 74],
        [36, 100],
        [0, 100],
      ]),
      R2
    ),
  }),
  { pal: 30 }
);

add(
  'Birdsmouth',
  'A V cut into one edge, deep enough to reach the middle of the cell.',
  (c) => ({
    rule: cut(c, poly([[0, 0], [100, 0], [100, 100], [50, 46], [0, 100]])),
  }),
  { pal: 62 }
);

add(
  'Scarf',
  'A long shallow taper, the joint you would cut to lengthen a beam.',
  (c) => ({
    rule: cut(c, poly([[0, 0], [100, 0], [100, 42], [0, 74]])),
  }),
  { pal: 15 }
);

add(
  'Chase',
  'A straight channel run right across the cell, ends open.',
  (c) => ({
    rule: cut(
      c,
      poly([[0, 0], [100, 0], [100, 42], [0, 42], [0, 58], [100, 58], [100, 100], [0, 100]]),
      R2
    ),
  }),
  { pal: 24 }
);

add(
  'Plinth',
  'A wide base with a narrower block set on it — two rectangles cut as one shape.',
  (c) => ({
    rule: cut(c, poly([[22, 0], [78, 0], [78, 70], [100, 70], [100, 100], [0, 100], [0, 70], [22, 70]])),
  }),
  { pal: 57 }
);

add(
  'Stylobate',
  'Three steps down from one corner to the opposite edge.',
  (c) => ({
    rule: cut(
      c,
      poly([[0, 0], [34, 0], [34, 34], [67, 34], [67, 67], [100, 67], [100, 100], [0, 100]])
    ),
  }),
  { pal: 68 }
);

add(
  'Dieblock',
  'Every corner squared off with a step rather than a straight cut.',
  (c) => ({
    rule: cut(
      c,
      poly([
        [22, 0],
        [78, 0],
        [78, 22],
        [100, 22],
        [100, 78],
        [78, 78],
        [78, 100],
        [22, 100],
        [22, 78],
        [0, 78],
        [0, 22],
        [22, 22],
      ]),
      R2
    ),
  }),
  { pal: 4 }
);

add(
  'Guttae',
  'A row of small square teeth left standing along one edge.',
  (c) => ({
    rule: cut(
      c,
      poly([
        [0, 0],
        [100, 0],
        [100, 66],
        [86, 66],
        [86, 100],
        [72, 100],
        [72, 66],
        [58, 66],
        [58, 100],
        [44, 100],
        [44, 66],
        [30, 66],
        [30, 100],
        [16, 100],
        [16, 66],
        [0, 66],
      ])
    ),
  }),
  { pal: 51 }
);

add(
  'Mutule',
  'A block projecting from one edge, wider than it is deep.',
  (c) => ({
    rule: cut(c, poly([[0, 0], [100, 0], [100, 70], [76, 70], [76, 100], [24, 100], [24, 70], [0, 70]])),
  }),
  { pal: 71 }
);

add(
  'Modillion',
  'A bracket profile: a straight back, a stepped front and an angled underside.',
  (c) => ({
    rule: cut(c, poly([[0, 0], [100, 0], [100, 28], [58, 28], [58, 52], [82, 52], [40, 100], [0, 100]])),
  }),
  { pal: 39 }
);

add(
  'Cymatium',
  'A moulding drawn as a run of short straight facets: an S profile without any curve in it.',
  (c) => ({
    rule: cut(
      c,
      poly([
        [0, 0],
        [100, 0],
        [100, 100],
        [72, 100],
        [72, 82],
        [56, 74],
        [44, 60],
        [40, 42],
        [28, 30],
        [0, 24],
      ])
    ),
  }),
  { pal: 74 }
);

add(
  'Antefix',
  'A fan of facets standing up from one edge, cut from the block rather than added to it.',
  (c) => ({
    rule: cut(
      c,
      poly([
        [0, 100],
        [0, 62],
        [14, 40],
        [32, 26],
        [50, 20],
        [68, 26],
        [86, 40],
        [100, 62],
        [100, 100],
      ])
    ),
  }),
  { pal: 26 }
);

add(
  'Acroterion',
  'A corner ornament: the cell keeps its square back and comes to a point at the front.',
  (c) => ({
    rule: cut(c, poly([[0, 0], [40, 0], [64, 22], [100, 34], [70, 58], [76, 100], [0, 100]])),
  }),
  { pal: 65 }
);

add(
  'Trochilus',
  'A hollow: two facets cut in from one edge and meeting in a shallow trough.',
  (c) => ({
    rule: cut(c, poly([[0, 0], [100, 0], [100, 100], [72, 100], [50, 58], [28, 100], [0, 100]])),
  }),
  { pal: 47 }
);

add(
  'Openframe',
  'The whole corner treatment turned inside out: an octagon with a square hole cut through it.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { ${B(`inset: 0; background: ${c1}; ${cp(poly(ngon(8, 50, -67.5)))}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${cp(withHole(rectHole(34, 34)))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 43 }
);

export const sectionE = { title: 'E. Chamfer', all };
