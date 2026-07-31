// J. Chamfer — what is taken off the square rather than what is put on it.
//
// Every design starts from the full cell and removes: a corner, a notch, a
// step, a channel. clip-path: polygon() is the whole toolkit and it exports as
// an SVG <clipPath> with the same points, so a twenty-vertex profile costs
// nothing and lands exactly where CSS put it. Nothing is filled back in, so
// the notches stay real holes on a transparent background — the shape simply
// stops.
import { section, A, F, TR, cp, ink, poly, rot, R2, R4, c1 } from './shared.mjs';

const { add, all } = section('J. Chamfer');

/** A solid cell cut to a profile, turned a quarter at a time. */
const cut = (c, shape, turns = R4) =>
  `--rot: ${turns}; ${F} { background: ${ink(c)}; ${cp(shape)} ${rot('@var(--rot)')} }${TR}`;

add(
  'Snipcorner',
  'One corner taken off at a shallow angle, so the cut is longer than it is deep.',
  (c) => ({ rule: cut(c, poly([[0, 0], [100, 0], [100, 76], [0, 100]])) }),
  { pal: 3 }
);

add(
  'Bevelcut',
  'All four corners cut unequally — a lopsided octagon that never sits square.',
  (c) => ({
    rule: cut(
      c,
      poly([[18, 0], [82, 0], [100, 34], [100, 72], [66, 100], [22, 100], [0, 78], [0, 26]])
    ),
  }),
  { pal: 24 }
);

add(
  'Cutbox',
  'A square inside the square, with the same corner off both of them.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${c1}; ${cp(poly([[0, 0], [70, 0], [100, 30], [100, 100], [0, 100]]))} ${A(`inset: 22%; background: ${ink(c, 2)}; ${cp(poly([[0, 0], [70, 0], [100, 30], [100, 100], [0, 100]]))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 45 }
);

add(
  'Angleoff',
  'A single deep cut running most of the way across, leaving a long triangle.',
  (c) => ({ rule: cut(c, poly([[0, 0], [100, 0], [100, 16], [0, 92]])) }),
  { pal: 61 }
);

add(
  'Cornerstep',
  'One corner taken off in three steps rather than one straight cut.',
  (c) => ({
    rule: cut(
      c,
      poly([[0, 0], [100, 0], [100, 44], [78, 44], [78, 66], [56, 66], [56, 88], [34, 88], [34, 100], [0, 100]])
    ),
  }),
  { pal: 12 }
);

add(
  'Nickbox',
  'Four small nicks, one out of the middle of each edge.',
  (c) => ({
    rule: cut(
      c,
      poly([
        [0, 0], [40, 0], [50, 12], [60, 0], [100, 0], [100, 40], [88, 50],
        [100, 60], [100, 100], [60, 100], [50, 88], [40, 100], [0, 100],
        [0, 60], [12, 50], [0, 40],
      ]),
      R2
    ),
  }),
  { pal: 34 }
);

add(
  'Cornerchip',
  'Two opposite corners chipped off deeply, so the cell reads as a long lozenge.',
  (c) => ({
    rule: cut(c, poly([[44, 0], [100, 0], [100, 56], [56, 100], [0, 100], [0, 44]]), R2),
  }),
  { pal: 52 }
);

add(
  'Stepcut',
  'One edge stepped in twice, like the side of a stair.',
  (c) => ({
    rule: cut(c, poly([[0, 0], [64, 0], [64, 34], [86, 34], [86, 68], [100, 68], [100, 100], [0, 100]])),
  }),
  { pal: 70 }
);

add(
  'Cutstep',
  'A channel let into one edge, turned back on itself and stopped short.',
  (c) => ({
    rule: cut(
      c,
      poly([[0, 0], [100, 0], [100, 100], [0, 100], [0, 76], [72, 76], [72, 52], [26, 52], [26, 28], [0, 28]])
    ),
  }),
  { pal: 18 }
);

add(
  'Chamferpair',
  'Two cuts on the same corner, one behind the other, in two inks.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${c1}; ${cp(poly([[0, 0], [100, 0], [100, 62], [62, 100], [0, 100]]))} ${A(`inset: 0; background: ${ink(c, 2)}; ${cp(poly([[0, 0], [100, 0], [100, 34], [34, 100], [0, 100]]))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 38 }
);

export const sectionJ = { title: 'J. Chamfer', all };
