// I. Wedge — triangles, points and tapers.
//
// A triangle is three numbers in a clip path and the only primitive here that
// has a direction: everything in this section points somewhere. Straight
// tapers, barbed heads, concave darts, rows of teeth, and the profiles that
// come from cutting a square down to a point.
//
// clip-path: polygon() maps to an SVG <clipPath> vertex for vertex, so a
// twenty-sided profile is as cheap and as exact as a three-sided one.
import { section, A, B, F, TR, cp, ink, poly, rot, R2, R4, c1 } from './shared.mjs';

const { add, all } = section('I. Wedge');

/** A solid cut to a profile and turned a quarter at a time. */
const cut = (c, shape, turns = R4) =>
  `--rot: ${turns}; ${F} { background: ${ink(c)}; ${cp(shape)} ${rot('@var(--rot)')} }${TR}`;

/** Two profiles in two inks, laid one over the other. */
const pair = (c, a, b, turns = R4) =>
  `--rot: ${turns}; ${F} { ${B(`inset: 0; background: ${c1}; ${cp(a)}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${cp(b)}`)} ${rot('@var(--rot)')} }${TR}`;

add(
  'Gnomonwedge',
  'A right triangle filling half the cell, the hypotenuse running corner to corner.',
  (c) => ({ rule: cut(c, poly([[0, 0], [100, 100], [0, 100]])) }),
  { pal: 0 }
);

add(
  'Sailwedge',
  'A tall narrow triangle leaning off the upright, like a sail full of wind.',
  (c) => ({ rule: cut(c, poly([[64, 0], [92, 100], [8, 100]])) }),
  { pal: 19 }
);

add(
  'Finform',
  'A fin: a straight trailing edge and a swept leading one.',
  (c) => ({ rule: cut(c, poly([[18, 100], [18, 34], [58, 4], [86, 100]])) }),
  { pal: 12 }
);

add(
  'Prowform',
  'A blunt point with parallel sides behind it.',
  (c) => ({ rule: cut(c, poly([[50, 6], [86, 40], [86, 96], [14, 96], [14, 40]])) }),
  { pal: 27 }
);

add(
  'Keelform',
  'Wide at the top and drawn to a line along the bottom.',
  (c) => ({ rule: cut(c, poly([[6, 8], [94, 8], [62, 96], [38, 96]])) }),
  { pal: 34 }
);

add(
  'Rudderwedge',
  'A tapered blade set off to one side of the cell, with a straight post at its back.',
  (c) => ({
    rule: pair(c, poly([[30, 4], [40, 4], [40, 96], [30, 96]]), poly([[40, 12], [88, 34], [88, 74], [40, 92]])),
  }),
  { pal: 46 }
);

add(
  'Arrowset',
  'A head and a shaft: two shapes reading as one arrow.',
  (c) => ({
    rule: pair(c, poly([[50, 4], [92, 46], [8, 46]]), poly([[38, 46], [62, 46], [62, 96], [38, 96]])),
  }),
  { pal: 55 }
);

add(
  'Barbform',
  'An arrowhead with the barbs swept back past the shaft.',
  (c) => ({
    rule: cut(c, poly([[50, 4], [96, 84], [50, 60], [4, 84]])),
  }),
  { pal: 9 }
);

add(
  'Fletching',
  'Three chevrons stacked, each one narrower than the one below.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`inset: 0; background: ${c1}; ${cp(poly([[50, 6], [88, 34], [88, 50], [50, 22], [12, 50], [12, 34]]))}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${cp(poly([[50, 44], [88, 72], [88, 88], [50, 60], [12, 88], [12, 72]]))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 41 }
);

add(
  'Nockform',
  'A blunt wedge with a V cut into its back.',
  (c) => ({
    rule: cut(c, poly([[50, 4], [88, 96], [50, 66], [12, 96]])),
  }),
  { pal: 21 }
);

add(
  'Dartform',
  'A long point with concave flanks, so the sides curve in rather than out.',
  (c) => ({
    rule: cut(
      c,
      poly([[50, 2], [64, 40], [90, 96], [50, 72], [10, 96], [36, 40]])
    ),
  }),
  { pal: 30 }
);

add(
  'Pointset',
  'Three separate points of different sizes, all facing the same way.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`inset: 0; background: ${c1}; ${cp(poly([[26, 6], [50, 52], [2, 52]]))}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${cp(poly([[72, 16], [98, 66], [46, 66], [58, 66], [72, 96], [86, 66]]))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 62 }
);

add(
  'Beakform',
  'A hooked point: straight along the top and curving down to the tip.',
  (c) => ({
    rule: cut(c, poly([[6, 18], [94, 18], [78, 44], [56, 62], [34, 88], [26, 60], [6, 42]])),
  }),
  { pal: 15 }
);

add(
  'Talonform',
  'A curved claw, drawn as a run of short straight facets.',
  (c) => ({
    rule: cut(
      c,
      poly([[10, 4], [34, 10], [56, 26], [72, 50], [80, 82], [64, 92], [56, 62], [40, 40], [20, 26], [8, 20]])
    ),
  }),
  { pal: 24 }
);

add(
  'Fangform',
  'Two points hanging from one edge, the gap between them as wide as they are.',
  (c) => ({
    rule: cut(c, poly([[10, 4], [90, 4], [90, 30], [72, 92], [58, 30], [42, 30], [28, 92], [10, 30]])),
  }),
  { pal: 57 }
);

add(
  'Toothset',
  'A row of teeth cut along one edge of the cell.',
  (c) => ({
    rule: cut(
      c,
      poly([
        [0, 0],
        [100, 0],
        [100, 56],
        [83, 96],
        [67, 56],
        [50, 96],
        [33, 56],
        [17, 96],
        [0, 56],
      ])
    ),
  }),
  { pal: 68 }
);

add(
  'Ploughshare',
  'A blade with a straight back and a long swept edge coming to a point.',
  (c) => ({
    rule: cut(c, poly([[8, 6], [26, 6], [78, 58], [92, 94], [50, 82], [8, 46]])),
  }),
  { pal: 4 }
);

add(
  'Chiselform',
  'A square shank taken down to a bevelled edge at one end.',
  (c) => ({
    rule: cut(c, poly([[30, 4], [70, 4], [70, 62], [88, 96], [12, 96], [30, 62]])),
  }),
  { pal: 51 }
);

add(
  'Wedgeblock',
  'A plain trapezoid: wide at the base, narrow at the top, both ends flat.',
  (c) => ({ rule: cut(c, poly([[28, 8], [72, 8], [94, 92], [6, 92]])) }),
  { pal: 71 }
);

add(
  'Splitwedge',
  'One triangle split down the middle, the two halves drawn a little apart.',
  (c) => ({
    rule: pair(c, poly([[46, 6], [46, 94], [4, 94]]), poly([[54, 6], [96, 94], [54, 94]])),
  }),
  { pal: 39 }
);

add(
  'Quoinwedge',
  'A wedge set into a corner, its point running to the far edge.',
  (c) => ({ rule: cut(c, poly([[0, 0], [100, 0], [100, 34], [0, 100]])) }),
  { pal: 50 }
);

add(
  'Featheredge',
  'A very shallow taper: nearly a rectangle, but thinning all the way across.',
  (c) => ({ rule: cut(c, poly([[0, 24], [100, 44], [100, 56], [0, 76]]), R2) }),
  { pal: 26 }
);

add(
  'Taperblock',
  'Two tapers meeting back to back, one heavier than the other.',
  (c) => ({
    rule: pair(c, poly([[4, 30], [50, 8], [50, 92], [4, 70]]), poly([[50, 22], [96, 42], [96, 58], [50, 78]])),
  }),
  { pal: 65 }
);

add(
  'Rampform',
  'A slope up from one corner with a flat run along the top.',
  (c) => ({
    rule: cut(c, poly([[0, 96], [56, 26], [96, 26], [96, 96]])),
  }),
  { pal: 43 }
);

add(
  'Demilune',
  'A wedge with its point cut off square, so it reads as a bastion rather than an arrow.',
  (c) => ({
    rule: cut(c, poly([[36, 6], [64, 6], [96, 62], [82, 94], [18, 94], [4, 62]])),
  }),
  { pal: 74 }
);

export const sectionI = { title: 'I. Wedge', all };
