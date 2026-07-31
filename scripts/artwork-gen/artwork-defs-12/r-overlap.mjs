// R. Overlap — two shapes crossing, and what the crossing does.
//
// A pair of shapes, and the interest is in the third region they make: the
// part where both of them are, which reads as its own colour because the upper
// one is let down rather than opaque.
//
// `opacity` is the property doing the work, and it exports exactly — it becomes
// a group attribute. What is deliberately *not* here is mix-blend-mode: it
// exports as an SVG blend style, the least portable thing the converter emits,
// and it carries a caveat in the catalogue.
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
  msk,
  bandL,
  R2,
  R4,
  c1,
} from './shared.mjs';

const { add, all } = section('R. Overlap');

/** Two shapes, the second let down so the crossing reads as a third colour. */
const pair = (first, second, turns = R4, alpha = '0.72') =>
  `--rot: ${turns}; ${F} { ${B(first)} ${A(`${second} opacity: ${alpha};`)} ${rot('@var(--rot)')} }${TR}`;

add(
  'Crossbox',
  'Two squares offset on the diagonal, overlapping across their corners.',
  (c) => ({
    rule: pair(
      `left: 4%; width: 58%; top: 4%; height: 58%; background: ${c1};`,
      `right: 4%; width: 58%; bottom: 4%; height: 58%; background: ${ink(c, 2)};`,
      R2
    ),
  }),
  { pal: 4 }
);

add(
  'Twoshape',
  'A disc and a square, sharing a corner of the cell.',
  (c) => ({
    rule: pair(
      `left: 6%; width: 56%; top: 20%; height: 56%; background: ${c1};`,
      `right: 6%; width: 60%; top: 18%; height: 60%; border-radius: 50%; background: ${ink(c, 2)};`
    ),
  }),
  { pal: 29 }
);

add(
  'Overcut',
  'Two triangles from opposite corners, crossing through the middle.',
  (c) => ({
    rule: pair(
      `inset: 0; background: ${c1}; ${cp(poly([[0, 0], [86, 0], [0, 86]]))}`,
      `inset: 0; background: ${ink(c, 2)}; ${cp(poly([[100, 100], [14, 100], [100, 14]]))}`
    ),
  }),
  { pal: 50 }
);

add(
  'Overpair',
  'Two bars at right angles, the upper one let down where it crosses.',
  (c) => ({
    rule: pair(
      `left: 0; right: 0; top: 38%; height: 24%; background: ${c1};`,
      `top: 0; bottom: 0; left: 38%; width: 24%; background: ${ink(c, 2)};`,
      R2,
      '0.66'
    ),
  }),
  { pal: 65 }
);

add(
  'Crossdisc',
  'Two discs of the same size, overlapping by about a third.',
  (c) => ({
    rule: pair(
      `left: 2%; width: 62%; top: 19%; height: 62%; border-radius: 50%; background: ${c1};`,
      `right: 2%; width: 62%; top: 19%; height: 62%; border-radius: 50%; background: ${ink(c, 2)};`,
      R2
    ),
  }),
  { pal: 12 }
);

add(
  'Overshape',
  'A hexagon with a bar run across it at an angle.',
  (c) => ({
    rule: pair(
      `inset: 0; background: ${c1}; ${cp(poly([[25, 6], [75, 6], [100, 50], [75, 94], [25, 94], [0, 50]]))}`,
      `left: -6%; right: -6%; top: 44%; height: 18%; background: ${ink(c, 2)}; ${rot('-24deg')}`
    ),
  }),
  { pal: 37 }
);

add(
  'Overring',
  'A ring with a solid disc pushed through one side of it.',
  (c) => ({
    rule: pair(
      `inset: 0; background: ${c1}; ${msk(bandL('40%', '78%'))}`,
      `right: 8%; width: 44%; top: 28%; height: 44%; border-radius: 50%; background: ${ink(c, 2)};`
    ),
  }),
  { pal: 59 }
);

add(
  'Overbar',
  'Two long bars fanned from a common corner, the upper one let down over it.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`left: 10%; right: 44%; top: 10%; bottom: 10%; background: ${c1}; ${rot('-18deg')}`)} ${A(`left: 44%; right: 10%; top: 10%; bottom: 10%; background: ${ink(c, 2)}; ${rot('18deg')} opacity: 0.74;`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 71 }
);

export const sectionR = { title: 'R. Overlap', all };
