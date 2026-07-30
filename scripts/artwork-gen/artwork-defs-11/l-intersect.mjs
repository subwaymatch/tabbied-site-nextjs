// L. Intersect — one shape cut by another, and only what they agree on left.
//
// `mask-composite: intersect` takes a list of mask layers and keeps the part
// every layer covers. It is the one CSS operator that makes genuinely new
// shapes out of old ones: a disc through a stripe field is a run of bars with
// round ends, a sector through a ring is an arc, a dot field through a
// triangle is a stipple that comes to a point.
//
// The converter nests one <mask> inside the next, which is the correct
// reading, so what comes out is exactly what CSS composited. mask-composite
// takes one value for the whole layer list, though, so a *union* and a *cut*
// cannot share a declaration — where a section needs both, the union goes on a
// pseudo-element and the cut on the cell holding it.
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
  star,
  rot,
  msk,
  mskI,
  discL,
  boreL,
  bandL,
  slotL,
  halfL,
  pieL,
  ringsL,
  R2,
  R4,
  R8,
  c1,
} from './shared.mjs';

const { add, all } = section('L. Intersect');

/** One ink, cut by everything the layers agree on. */
const both = (c, ...layers) => `background: ${ink(c)}; ${mskI(...layers)}`;

const dotsL = (r, pitch) =>
  `radial-gradient(circle at 50% 50%, #000 ${r}, transparent ${r}) 0 0 / ${pitch} ${pitch}`;

add(
  'Commonpart',
  'A disc and a square overlapping, and only the part inside both of them drawn.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${both(c, discL('50%'), 'linear-gradient(90deg, #000 0 62%, transparent 62% 100%)')} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 0 }
);

add(
  'Sharedpart',
  'Two discs offset from each other, only their common lens left.',
  (c) => ({
    // farthest-side, not closest-side: a circle sized to the near edge of an
    // off-centre position is too small to reach the other one, and the
    // intersection of two discs that never meet is nothing at all.
    rule: `--rot: ${R4}; ${F} { ${both(c, 'radial-gradient(circle farthest-side at 25% 50%, #000 62%, transparent 62%)', 'radial-gradient(circle farthest-side at 75% 50%, #000 62%, transparent 62%)')} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 19 }
);

add(
  'Bothways',
  'A field ruled both ways at once, so only the crossings survive.',
  (c) => ({
    rule: `${F} { ${both(c, slotL('0deg', '14%', '25%'), slotL('90deg', '14%', '25%'))} }${TR}`,
  }),
  { pal: 12 }
);

add(
  'Cutdown',
  'A ring cut back to a half, so it reads as an arch rather than a circle.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${both(c, bandL('30%', '48%'), halfL('0deg', '50%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 27 }
);

add(
  'Croppage',
  'A dot field cut to a triangle, so the stipple comes to a point.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${both(c, dotsL('32%', '20%'), 'linear-gradient(45deg, #000 0 50%, transparent 50% 100%)')} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 34 }
);

add(
  'Trimline',
  'Rules cut to a disc at one end and a straight edge at the other.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${both(c, slotL('90deg', '10%', '20%'), discL('50%'), halfL('90deg', '72%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 46 }
);

add(
  'Whittle',
  'A sector taken out of a disc and then bored, leaving a thin crescent of arc.',
  (c) => ({
    rule: `--rot: ${R8}; ${F} { ${both(c, pieL('130deg'), boreL('34%'), discL('48%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 55 }
);

add(
  'Paredown',
  'Concentric rings kept only where a wide band crosses them.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${both(c, ringsL('6%', '14%'), 'linear-gradient(0deg, transparent 0 26%, #000 26% 74%, transparent 74% 100%)')} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 9 }
);

add(
  'Cropmark',
  'A cross kept only at its four ends, the middle of it cut away.',
  (c) => ({
    rule: `${F} { background: ${ink(c)}; ${cp(poly([[45, 0], [55, 0], [55, 45], [100, 45], [100, 55], [55, 55], [55, 100], [45, 100], [45, 55], [0, 55], [0, 45], [45, 45]]))} ${msk(boreL('26%'))} }${TR}`,
  }),
  { pal: 41 }
);

add(
  'Bitepart',
  'A square with a round bite taken out of one corner and a straight cut off another.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${both(c, 'radial-gradient(circle closest-side at 0% 0%, transparent 70%, #000 70%)', 'linear-gradient(45deg, #000 0 84%, transparent 84% 100%)')} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 21 }
);

add(
  'Overlapcut',
  'A stripe field and a dot field intersected: dashes on a lattice.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { ${both(c, dotsL('38%', '16.67%'), slotL('0deg', '10%', '16.67%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 30 }
);

add(
  'Meetpart',
  'Two sectors from opposite corners, only the diamond where they meet left.',
  (c) => ({
    // Each apex only sees one quadrant of the turn: 90-180deg from the
    // top-left corner, 270-360deg from the bottom-right, and the two sectors
    // are aimed at each other so they cross in the middle.
    rule: `--rot: ${R4}; ${F} { ${both(c, pieL('62deg', { from: '98deg', at: '0% 0%' }), pieL('62deg', { from: '278deg', at: '100% 100%' }))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 62 }
);

add(
  'Coincide',
  'A hexagon and a disc, with only the part common to both inked.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { background: ${ink(c)}; ${cp(poly(ngon(6, 52, -90)))} ${msk(discL('42%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 15 }
);

add(
  'Concord',
  'A star clipped back to a ring, so only the points that reach it survive.',
  (c) => ({
    rule: `--rot: ${R8}; ${F} { background: ${ink(c)}; ${cp(poly(star(6, 50, 20)))} ${msk(bandL('24%', '50%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 24 }
);

add(
  'Twincut',
  'Two ruled fields at a shallow angle to each other, intersected into a lozenge lattice.',
  (c) => ({
    rule: `${F} { ${both(c, slotL('20deg', '13%', '26%'), slotL('-20deg', '13%', '26%'))} }${TR}`,
  }),
  { pal: 57 }
);

add(
  'Maskpair',
  'A wide band and a disc field, cut to leave a row of round-ended blocks.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${both(c, dotsL('44%', '25%'), 'linear-gradient(0deg, transparent 0 32%, #000 32% 68%, transparent 68% 100%)')} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 68 }
);

add(
  'Shearpair',
  'A triangle cut by rules running the other way from its slope.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp(poly([[0, 100], [100, 0], [100, 100]]))} ${msk(slotL('45deg', '9%', '20%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 4 }
);

add(
  'Lopcut',
  'A disc with both ends taken off square, leaving a band with round sides.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${both(c, discL('50%'), 'linear-gradient(0deg, transparent 0 22%, #000 22% 78%, transparent 78% 100%)')} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 51 }
);

add(
  'Shavecut',
  'A ring with a straight slice taken off one side of it.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${both(c, bandL('28%', '48%'), halfL('90deg', '76%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 71 }
);

add(
  'Facecut',
  'A dot field cut back to a ring, so the stipple runs round rather than across.',
  (c) => ({
    rule: `${F} { ${both(c, dotsL('40%', '16.67%'), bandL('24%', '50%'))} }${TR}`,
  }),
  { pal: 39 }
);

add(
  'Squarecut',
  'A ruled field cut to a square well inside the cell.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { ${both(c, slotL('90deg', '8%', '16%'), 'linear-gradient(0deg, transparent 0 16%, #000 16% 84%, transparent 84% 100%)', 'linear-gradient(90deg, transparent 0 16%, #000 16% 84%, transparent 84% 100%)')} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 50 }
);

add(
  'Wedgecut',
  'A sector kept only where it crosses a band of rules.',
  (c) => ({
    rule: `--rot: ${R8}; ${F} { ${both(c, pieL('96deg'), slotL('0deg', '11%', '22%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 26 }
);

add(
  'Ringcut',
  'A ring cut by radial slots into a run of separate arcs.',
  (c) => ({
    rule: `--rot: ${R8}; ${F} { ${both(c, bandL('26%', '46%'), slotL('90deg', '10%', '20%'), slotL('0deg', '10%', '20%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 65 }
);

add(
  'Starcut',
  'Two ink layers: a star cut to a disc, over a ring that runs round outside it.',
  (c) => ({
    rule: `--rot: ${R8}; ${F} { ${B(`inset: 0; background: ${c1}; ${msk(bandL('42%', '50%'))}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${cp(poly(star(5, 46, 19)))} ${msk(discL('40%'))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 43 }
);

add(
  'Latheform',
  'A dot field cut by a stripe field at right angles to it — a beaded rule.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { ${both(c, dotsL('46%', '12.5%'), slotL('90deg', '12.5%', '25%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 74 }
);

export const sectionL = { title: 'L. Intersect', all };
