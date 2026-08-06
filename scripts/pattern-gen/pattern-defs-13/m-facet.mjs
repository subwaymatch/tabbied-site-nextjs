// M. Facet — lozenges, kites, and cut stones, named for pigment minerals.
//
// The diamond family done as single polygons: regular, tall, squat, leaning,
// faceted like a cut gem, or split into shards. Two designs step off the
// polygon — malachite's banding is concentric rings run off centre, and the
// soft lozenge is a rotated rounded box, which the converter reads as a
// <rect> with its resolved radii.
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
  msk,
  ringsL,
  R2,
  R4,
} from './shared.mjs';

const { add, all } = section('M. Facet');

const profile = (c, shape, turns = R4) =>
  `--rot: ${turns}; ${F} { background: ${ink(c)}; ${cp(shape)} ${rot('@var(--rot)')} }${TR}`;

const turned = (c, decls, turns = R4) =>
  `--rot: ${turns}; ${F} { ${decls} ${rot('@var(--rot)')} }${TR}`;

add(
  'Rhomb',
  'The plain lozenge, point up, filling most of its cell.',
  (c) => ({ rule: profile(c, poly([[50, 8], [86, 50], [50, 92], [14, 50]]), R2) }),
  { pal: 3 }
);

add(
  'Azurite',
  'A regular hexagon, flat-topped and heavy.',
  (c) => ({
    rule: profile(c, poly([[28, 10], [72, 10], [94, 50], [72, 90], [28, 90], [6, 50]])),
  }),
  { pal: 0 }
);

add(
  'Malachite',
  'The stone’s banding: rings grown off centre, ring on ring.',
  (c) => ({ rule: turned(c, faded(c, ringsL('8%', '20%', '32% 40%'))) }),
  { pal: 40 }
);

add(
  'Cinnabar',
  'A sharp kite, its point driven down.',
  (c) => ({ rule: profile(c, poly([[50, 4], [78, 56], [50, 96], [22, 56]])) }),
  { pal: 29 }
);

add(
  'Carmine',
  'A tall slim lozenge, more needle than diamond.',
  (c) => ({ rule: profile(c, poly([[50, 4], [66, 50], [50, 96], [34, 50]]), R2) }),
  { pal: 75 }
);

add(
  'Vermilion',
  'The squat counterpart: a lozenge wider than it is tall.',
  (c) => ({ rule: profile(c, poly([[50, 26], [92, 50], [50, 74], [8, 50]]), R2) }),
  { pal: 55 }
);

add(
  'Ochre',
  'A raw nugget: five unequal sides and no symmetry.',
  (c) => ({ rule: profile(c, poly([[30, 12], [76, 18], [90, 62], [54, 90], [14, 58]])) }),
  { pal: 19 }
);

add(
  'Umber',
  'A heavy octagon, the corners knocked off a square.',
  (c) => ({
    rule: profile(
      c,
      poly([[32, 8], [68, 8], [92, 32], [92, 68], [68, 92], [32, 92], [8, 68], [8, 32]])
    ),
  }),
  { pal: 64 }
);

add(
  'Sienna',
  'Two shards struck off the same stone, lying almost parallel.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(
      `inset: 0; background: ${ink(c)}; ${cp(poly([[16, 88], [38, 10], [56, 60]]))}`
    )} ${A(
      `inset: 0; background: ${ink(c)}; ${cp(poly([[52, 86], [74, 18], [88, 72]]))}`
    )} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 44 }
);

add(
  'Madder',
  'A lozenge with a round drop of lake colour at its heart.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(
      `inset: 0; background: ${ink(c)}; ${cp(poly([[50, 6], [88, 50], [50, 94], [12, 50]]))}`
    )} ${A(
      `left: 41%; top: 41%; width: 18%; height: 18%; border-radius: 50%; background: ${ink(c)};`
    )} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 76 }
);

add(
  'Woad',
  'A lozenge leaning hard off its axis.',
  (c) => ({ rule: profile(c, poly([[38, 6], [84, 34], [62, 94], [16, 66]])) }),
  { pal: 14 }
);

add(
  'Smalt',
  'A cut stone in profile: table, girdle, and pavilion to a point.',
  (c) => ({
    rule: profile(c, poly([[30, 14], [70, 14], [88, 42], [50, 90], [12, 42]])),
  }),
  { pal: 6 }
);

add(
  'Ultramarine',
  'A long six-sided shard leaning across the cell.',
  (c) => ({
    rule: profile(c, poly([[20, 86], [36, 28], [62, 10], [80, 16], [64, 74], [38, 92]])),
  }),
  { pal: 23 }
);

add(
  'Celadon',
  'The soft lozenge: a rounded square stood on its corner.',
  (c) => ({
    rule: turned(
      c,
      `${A(
        `left: 22%; top: 22%; width: 56%; height: 56%; border-radius: 24%; background: ${ink(c)}; -webkit-transform: rotate(45deg); transform: rotate(45deg);`
      )}`
    ),
  }),
  { pal: 41 }
);

add(
  'Verdigris',
  'A weathered plate pitted right through with round holes.',
  (c) => ({
    rule: turned(
      c,
      `${A(
        `inset: 12%; background: ${ink(c)}; ${msk(
          'radial-gradient(circle at 50% 50%, transparent 26%, #000 26%) 0 0 / 25% 25%'
        )}`
      )}`
    ),
  }),
  { pal: 37 }
);

export const sectionM = { title: 'M. Facet', all };
