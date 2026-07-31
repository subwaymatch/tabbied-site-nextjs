// P. Frame — a border drawn as a shape, and what it encloses.
//
// A frame is not a `border` here. `border` would be the obvious tool and it is
// the wrong one: the converter throws on a border round a partially-rounded
// box, mixed widths junction within a pixel of where CSS puts them, and a
// border in `%` is not even valid CSS. Four mask layers added together do the
// job exactly — one per side — and their union is the frame, with a real hole
// in the middle of it.
//
// Because the layers are *added*, each side is independent: drop one and the
// frame opens, thicken one and the box reads as seen at an angle. What the
// hole is for is the rest of the section — another frame inside it, a disc, a
// ring, a block, nothing at all.
import {
  section,
  A,
  B,
  F,
  TR,
  ink,
  rot,
  msk,
  bandL,
  faded,
  c1,
  R2,
  R4,
} from './shared.mjs';

const { add, all } = section('P. Frame');

/**
 * One side of a frame, `t`% thick. The gradient angle picks the side: 90deg
 * ramps left-to-right so the ink lands on the left, 270deg on the right, and
 * so on.
 */
const side = (angle, t) => `linear-gradient(${angle}, #000 0 ${t}%, transparent ${t}%)`;
const LEFT = '90deg';
const RIGHT = '270deg';
const TOP = '180deg';
const BOTTOM = '0deg';

/** All four sides at one thickness: a plain frame. */
const frameL = (t) => [side(LEFT, t), side(RIGHT, t), side(TOP, t), side(BOTTOM, t)];

const still = (c, decl) => `${F} { ${decl} }${TR}`;
const turned = (c, decl, turns = R4) =>
  `--rot: ${turns}; ${F} { ${decl} ${rot('@var(--rot)')} }${TR}`;

add(
  'Framecut',
  'A plain frame with the middle of the cell taken clean out.',
  (c) => ({ rule: still(c, faded(c, ...frameL(19))) }),
  { pal: 2 }
);

add(
  'Boxframe',
  'A heavy frame, thick enough that the opening is the smaller part.',
  (c) => ({ rule: still(c, faded(c, ...frameL(32))) }),
  { pal: 22 }
);

add(
  'Framering',
  'A frame with a disc standing in the opening, in a second ink.',
  (c) => ({
    rule: still(
      c,
      `${B(`inset: 0; background: ${c1}; ${msk(...frameL(12))}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${msk('radial-gradient(circle closest-side at 50% 50%, #000 0 62%, transparent 62%)')}`)}`
    ),
  }),
  { pal: 44 }
);

add(
  'Innerframe',
  'Two frames, one inside the other, with ground showing between them.',
  (c) => ({
    rule: still(
      c,
      `${B(`inset: 0; background: ${c1}; ${msk(...frameL(9))}`)} ${A(`inset: 22%; background: ${ink(c, 2)}; ${msk(...frameL(14))}`)}`
    ),
  }),
  { pal: 57 }
);

add(
  'Framegap',
  'A frame with one side missing, so it stops being a closed shape.',
  (c) => ({
    // Three sides rather than four. Cutting the fourth away afterwards is not
    // an option: the frame is the *union* of its sides, and intersecting a
    // union with anything would leave the corners rather than the frame.
    rule: turned(c, faded(c, side(LEFT, 13), side(RIGHT, 13), side(TOP, 13))),
  }),
  { pal: 11 }
);

add(
  'Framepair',
  'Two frames of the same weight, offset from each other on the diagonal.',
  (c) => ({
    rule: turned(
      c,
      `${B(`left: 0; right: 24%; top: 0; bottom: 24%; background: ${c1}; ${msk(...frameL(10))}`)} ${A(`left: 24%; right: 0; top: 24%; bottom: 0; background: ${ink(c, 2)}; ${msk(...frameL(10))}`)}`
    ),
  }),
  { pal: 34 }
);

add(
  'Boxinset',
  'A frame with a solid block set into the middle of it, not touching.',
  (c) => ({
    rule: still(
      c,
      `${B(`inset: 0; background: ${c1}; ${msk(...frameL(11))}`)} ${A(`inset: 32%; background: ${ink(c, 2)};`)}`
    ),
  }),
  { pal: 53 }
);

add(
  'Framecorner',
  'Only two sides of the frame — an ell wrapped round one corner.',
  (c) => ({
    rule: turned(
      c,
      `${B(`left: 0; right: 0; top: 0; height: 15%; background: ${ink(c)};`)} ${A(`left: 0; width: 15%; top: 15%; bottom: 0; background: ${ink(c)};`)}`
    ),
  }),
  { pal: 68 }
);

add(
  'Frameband',
  'A frame with a ring set inside it, the two nearly the same weight.',
  (c) => ({
    rule: still(
      c,
      `${B(`inset: 0; background: ${c1}; ${msk(...frameL(10))}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${msk(bandL('44%', '62%'))}`)}`
    ),
  }),
  { pal: 78 }
);

add(
  'Framestack',
  'A frame with each side a different weight, so the box reads as seen at an angle.',
  (c) => ({
    rule: turned(
      c,
      faded(c, side(LEFT, 6), side(RIGHT, 16), side(TOP, 9), side(BOTTOM, 22)),
      R2
    ),
  }),
  { pal: 30 }
);

export const sectionP = { title: 'P. Frame', all };
