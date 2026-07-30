// K. Overlap — two shapes crossing, and what the crossing does.
//
// Everything here is a pair. The interest is in the third region the pair
// makes: the part where both shapes are, which reads as its own colour when
// the upper one is let down, or as a clean knockout when it is not.
//
// opacity and z-index are the two properties doing the work, and both export
// exactly — opacity becomes a group attribute, z-index reorders the paint list
// the same way CSS stacking does. What is deliberately *not* here is
// mix-blend-mode: it exports as an SVG blend style, which is the least
// portable thing the converter emits and carries a caveat in the catalogue.
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
  discL,
  bandL,
  slotL,
  R2,
  R4,
  c1,
} from './shared.mjs';

const { add, all } = section('K. Overlap');

/** A pair of shapes, the upper one let down so the crossing reads through. */
const lap = (first, second, alpha, turns = R4) =>
  `--rot: ${turns}; ${F} { ${B(first)} ${A(`${second} opacity: ${alpha};`)} ${rot('@var(--rot)')} }${TR}`;

const disc = (inkValue, inset) =>
  `inset: ${inset}; background: ${inkValue}; border-radius: 50%;`;
const block = (inkValue, inset) => `inset: ${inset}; background: ${inkValue};`;

add(
  'Overlay',
  'Two squares crossing at the corner, the upper one let down enough to read through.',
  (c) => ({ rule: lap(block(c1, '8% 40% 40% 8%'), block(ink(c, 2), '40% 8% 8% 40%'), 0.7) }),
  { pal: 0 }
);

add(
  'Underlay',
  'The same pair with the lower shape much the larger, so the smaller sits on it.',
  (c) => ({ rule: lap(block(c1, '6%'), block(ink(c, 2), '34% 14% 14% 34%'), 0.75) }),
  { pal: 19 }
);

add(
  'Superimpose',
  'Two discs of the same size, offset by half their width.',
  (c) => ({ rule: lap(disc(c1, '18% 34% 18% 6%'), disc(ink(c, 2), '18% 6% 18% 34%'), 0.68, R2) }),
  { pal: 12 }
);

add(
  'Doubleprint',
  'One shape printed twice, the second copy slipped down and across.',
  (c) => ({
    rule: lap(block(c1, '10% 26% 26% 10%'), block(ink(c, 2), '22% 14% 14% 22%'), 0.8),
  }),
  { pal: 27 }
);

add(
  'Offprint',
  'A disc and its own outline, out of register by a fifth of their width.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`inset: 14% 24% 24% 14%; background: ${c1}; border-radius: 50%;`)} ${A(`inset: 24% 14% 14% 24%; background: ${ink(c, 2)}; ${msk(bandL('36%', '48%'))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 34 }
);

add(
  'Registration',
  'A cross and a ring sharing a centre, the way a register mark is drawn.',
  (c) => ({
    rule: `${F} { ${B(`inset: 8%; background: ${c1}; ${cp(poly([[45, 0], [55, 0], [55, 45], [100, 45], [100, 55], [55, 55], [55, 100], [45, 100], [45, 55], [0, 55], [0, 45], [45, 45]]))}`)} ${A(`inset: 20%; background: ${ink(c, 2)}; ${msk(bandL('34%', '46%'))} opacity: 0.85;`)} }${TR}`,
  }),
  { pal: 46 }
);

add(
  'Misregister',
  'Three bands of the same width, each shifted a little further than the last.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`left: 10%; right: 34%; top: 12%; bottom: 40%; background: ${c1};`)} ${A(`left: 26%; right: 18%; top: 34%; bottom: 18%; background: ${ink(c, 2)}; opacity: 0.72;`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 55 }
);

add(
  'Trapping',
  'A shape with a second drawn just inside its edge, so the two overlap in a thin band.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`inset: 12%; background: ${c1}; ${cp(poly([[0, 0], [100, 0], [100, 100]]))}`)} ${A(`inset: 20%; background: ${ink(c, 2)}; ${cp(poly([[0, 0], [100, 0], [100, 100]]))} opacity: 0.8;`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 9 }
);

add(
  'Knockout',
  'The upper shape at full strength, so the crossing is a clean cut rather than a blend.',
  (c) => ({ rule: lap(disc(c1, '10%'), block(ink(c, 2), '38% 0 0 38%'), 1) }),
  { pal: 41 }
);

add(
  'Overprint',
  'A disc over a band, the disc let right down so the band shows through it.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`left: 0; right: 0; top: 36%; height: 28%; background: ${c1};`)} ${A(`${disc(ink(c, 2), '14%')} opacity: 0.62;`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 21 }
);

add(
  'Screenlap',
  'A ruled field laid over a solid one, both in the same ink, so the overlap doubles.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { ${B(`inset: 16% 8%; background: ${ink(c)}; opacity: 0.55;`)} ${A(`inset: 8% 16%; background: ${ink(c)}; ${msk(slotL('90deg', '10%', '20%'))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 30 }
);

add(
  'Layerpair',
  'Two rectangles at right angles, the crossing squared off in the middle.',
  (c) => ({
    rule: lap(block(c1, '34% 4%'), block(ink(c, 2), '4% 34%'), 0.7, R2),
  }),
  { pal: 62 }
);

add(
  'Cardstack',
  'Two cards laid down at slight angles, one over the other.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`inset: 14%; background: ${c1}; ${rot('-9deg')}`)} ${A(`inset: 14%; background: ${ink(c, 2)}; ${rot('11deg')} opacity: 0.82;`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 15 }
);

add(
  'Fanned',
  'Two long shapes fanned from a common corner.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`left: 12%; right: 46%; top: 8%; bottom: 8%; background: ${c1}; ${rot('-22deg')}`)} ${A(`left: 46%; right: 12%; top: 8%; bottom: 8%; background: ${ink(c, 2)}; ${rot('22deg')} opacity: 0.78;`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 24 }
);

add(
  'Overhang',
  'The upper shape runs off the edge of the cell while the lower stays inside it.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`inset: 16%; background: ${c1};`)} ${A(`left: 44%; right: -18%; top: 30%; bottom: 30%; background: ${ink(c, 2)}; opacity: 0.85;`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 57 }
);

add(
  'Eclipse',
  'One disc passing across another, just off centre.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(disc(c1, '14%'))} ${A(`${disc(ink(c, 2), '26% 6% 26% 46%')} opacity: 0.9;`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 68 }
);

add(
  'Occultation',
  'A large disc almost covered by a square, only a crescent of it left.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(disc(c1, '8%'))} ${A(`inset: 0 0 0 26%; background: ${ink(c, 2)};`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 4 }
);

add(
  'Transit',
  'A small disc crossing a band, drawn at full strength so it reads as a hole in it.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { ${B(`left: 0; right: 0; top: 32%; height: 36%; background: ${c1};`)} ${A(`${disc(ink(c, 2), '34% 22% 34% 46%')}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 51 }
);

add(
  'Conjunction',
  'Two discs just touching, the overlap no more than a sliver.',
  (c) => ({
    rule: lap(disc(c1, '24% 46% 24% 4%'), disc(ink(c, 2), '24% 4% 24% 46%'), 0.75, R2),
  }),
  { pal: 71 }
);

add(
  'Ghosting',
  'The same shape three times, each fainter and further along than the last.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`left: 8%; width: 40%; top: 26%; height: 48%; background: ${c1};`)} ${A(`left: 34%; width: 40%; top: 26%; height: 48%; background: ${ink(c, 2)}; opacity: 0.5;`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 39 }
);

add(
  'Mirrorpair',
  'A shape and its mirror image, overlapping down the axis between them.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`inset: 10%; background: ${c1}; ${cp(poly([[0, 0], [86, 50], [0, 100]]))}`)} ${A(`inset: 10%; background: ${ink(c, 2)}; ${cp(poly([[100, 0], [14, 50], [100, 100]]))} opacity: 0.72;`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 50 }
);

add(
  'Scalepair',
  'One shape inside a larger copy of itself, both at the same angle.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`inset: 6%; background: ${c1}; ${cp(poly([[50, 0], [100, 50], [50, 100], [0, 50]]))}`)} ${A(`inset: 26%; background: ${ink(c, 2)}; ${cp(poly([[50, 0], [100, 50], [50, 100], [0, 50]]))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 26 }
);

add(
  'Nestpair',
  'A ring with a disc inside it, the disc just wide enough to touch the bore.',
  (c) => ({
    rule: `${F} { ${B(`inset: 4%; background: ${c1}; ${msk(bandL('30%', '48%'))}`)} ${A(`inset: 4%; background: ${ink(c, 2)}; ${msk(discL('31%'))} opacity: 0.88;`)} }${TR}`,
  }),
  { pal: 65 }
);

add(
  'Boxinbox',
  'Three squares nested, each turned a little further than the one outside it.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`inset: 10%; background: ${c1}; ${rot('12deg')}`)} ${A(`inset: 28%; background: ${ink(c, 2)}; ${rot('-14deg')}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 43 }
);

add(
  'Barinbar',
  'A bar with a shorter, narrower bar laid along the middle of it.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`left: 4%; right: 4%; top: 34%; height: 32%; background: ${c1};`)} ${A(`left: 22%; right: 22%; top: 42%; height: 16%; background: ${ink(c, 2)};`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 74 }
);

export const sectionK = { title: 'K. Overlap', all };
