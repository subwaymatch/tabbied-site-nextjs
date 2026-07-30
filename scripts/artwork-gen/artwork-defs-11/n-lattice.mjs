// N. Lattice — two directions at once.
//
// Section B ruled the cell one way. This one rules it two, and the whole
// section turns on which operator joins them. Add the two fields and the
// crossings double up into a plaid; intersect them and only the crossings
// survive, leaving a field of squares; put one field in front of another in a
// different ink and the sheet reads as woven.
//
// All three are the same two repeating-linear-gradients, so a lattice costs
// two gradients no matter how many bars it appears to have — and the converter
// emits exactly two, with spreadMethod="repeat".
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
  slotL,
  discL,
  bandL,
  halfL,
  R2,
  R4,
  c1,
} from './shared.mjs';

const { add, all } = section('N. Lattice');

/** Both directions inked: a plaid, the crossings twice covered. */
const plaid = (c, a, b) => `background: ${ink(c)}; ${msk(a, b)}`;

/** Only the crossings: a field of blocks. */
const mesh = (c, a, b) => `background: ${ink(c)}; ${mskI(a, b)}`;

/** Two fields in two inks, one over the other. */
const woven = (c, a, b, extra = '') =>
  `${B(`inset: 0; background: ${c1}; ${msk(a)}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${msk(b)} ${extra}`)}`;

add(
  'Plaidwork',
  'Both directions ruled at the same pitch, so the crossings read heaviest.',
  (c) => ({ rule: `${F} { ${plaid(c, slotL('0deg', '12%', '25%'), slotL('90deg', '12%', '25%'))} }${TR}` }),
  { pal: 0 }
);

add(
  'Tartanset',
  'Two pitches each way, a wide bar and a narrow one, in the tartan manner.',
  (c) => ({
    rule: `${F} { ${plaid(c, 'repeating-linear-gradient(0deg, #000 0 14%, transparent 14% 30%, #000 30% 36%, transparent 36% 50%)', 'repeating-linear-gradient(90deg, #000 0 14%, transparent 14% 30%, #000 30% 36%, transparent 36% 50%)')} }${TR}`,
  }),
  { pal: 19 }
);

add(
  'Ginghamweave',
  'One ink ruled across and a second ruled down, laid over each other.',
  (c) => ({
    rule: `${F} { ${woven(c, slotL('0deg', '16%', '33.34%'), slotL('90deg', '16%', '33.34%'))} }${TR}`,
  }),
  { pal: 12 }
);

add(
  'Chequerweave',
  'Only where both directions agree: a field of separate blocks.',
  (c) => ({ rule: `${F} { ${mesh(c, slotL('0deg', '16%', '33.34%'), slotL('90deg', '16%', '33.34%'))} }${TR}` }),
  { pal: 27 }
);

add(
  'Basketwork',
  'Bars in pairs each way, so the field reads as woven strips rather than a grid.',
  (c) => ({
    rule: `${F} { ${woven(c, 'repeating-linear-gradient(0deg, #000 0 9%, transparent 9% 13%, #000 13% 22%, transparent 22% 40%)', 'repeating-linear-gradient(90deg, #000 0 9%, transparent 9% 13%, #000 13% 22%, transparent 22% 40%)')} }${TR}`,
  }),
  { pal: 34 }
);

add(
  'Canework',
  'A square lattice with a second one over it at forty-five degrees.',
  (c) => ({
    rule: `${F} { ${woven(c, slotL('0deg', '9%', '25%'), slotL('45deg', '9%', '25%'))} }${TR}`,
  }),
  { pal: 46 }
);

add(
  'Netting',
  'A fine mesh: thin bars both ways with wide openings between them.',
  (c) => ({ rule: `${F} { ${plaid(c, slotL('0deg', '6%', '20%'), slotL('90deg', '6%', '20%'))} }${TR}` }),
  { pal: 55 }
);

add(
  'Meshwork',
  'The same mesh drawn heavy, so the openings become the pattern.',
  (c) => ({ rule: `${F} { ${plaid(c, slotL('0deg', '15%', '20%'), slotL('90deg', '15%', '20%'))} }${TR}` }),
  { pal: 9 }
);

add(
  'Grillework',
  'Close bars one way and widely spaced ones the other.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { ${plaid(c, slotL('0deg', '7%', '14%'), slotL('90deg', '10%', '50%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 41 }
);

add(
  'Cagework',
  'A lattice cut to a disc, so it reads as a cage rather than a field.',
  (c) => ({
    rule: `${F} { background: ${ink(c)}; ${mskI(discL('48%'), 'repeating-linear-gradient(0deg, #000 0 8%, transparent 8% 22%)')} }${TR}`,
  }),
  { pal: 21 }
);

add(
  'Barwork',
  'Bars one way over a solid field of a second ink, with a cross bar over both.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { ${woven(c, slotL('90deg', '10%', '22%'), slotL('0deg', '10%', '44%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 30 }
);

add(
  'Gridwork',
  'An even grid of thin rules, both directions the same weight.',
  (c) => ({ rule: `${F} { ${plaid(c, slotL('0deg', '5%', '25%'), slotL('90deg', '5%', '25%'))} }${TR}` }),
  { pal: 62 }
);

add(
  'Reticule',
  'A grid with one rule each way drawn heavier than the rest.',
  (c) => ({
    rule: `${F} { ${woven(c, 'repeating-linear-gradient(0deg, #000 0 5%, transparent 5% 20%)', 'linear-gradient(0deg, transparent 0 46%, #000 46% 54%, transparent 54% 100%)')} }${TR}`,
  }),
  { pal: 15 }
);

add(
  'Reticle',
  'A fine grid confined to a disc, with a ring drawn round it.',
  (c) => ({
    rule: `${F} { ${B(`inset: 0; background: ${c1}; ${msk(bandL('42%', '50%'))}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${mskI(discL('42%'), 'repeating-linear-gradient(0deg, #000 0 4%, transparent 4% 16%)')}`)} }${TR}`,
  }),
  { pal: 24 }
);

add(
  'Hatchwork',
  'Two hatchings at opposite leans, crossing to a lozenge lattice.',
  (c) => ({ rule: `${F} { ${plaid(c, slotL('34deg', '10%', '24%'), slotL('-34deg', '10%', '24%'))} }${TR}` }),
  { pal: 57 }
);

add(
  'Wickerwork',
  'Wide strips one way and narrow ones the other, in two inks.',
  (c) => ({
    rule: `${F} { ${woven(c, slotL('0deg', '20%', '33.34%'), slotL('90deg', '8%', '16.67%'))} }${TR}`,
  }),
  { pal: 68 }
);

add(
  'Lathwork',
  'Bars one way with a lighter grid showing through the gaps.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { ${woven(c, slotL('90deg', '5%', '12.5%'), slotL('0deg', '18%', '33.34%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 4 }
);

add(
  'Trelliswork',
  'A diagonal lattice, both leans in the same ink so the crossings double.',
  (c) => ({ rule: `${F} { ${plaid(c, slotL('45deg', '9%', '26%'), slotL('-45deg', '9%', '26%'))} }${TR}` }),
  { pal: 51 }
);

add(
  'Latticework',
  'A diagonal lattice in two inks, one lean in front of the other.',
  (c) => ({
    rule: `${F} { ${woven(c, slotL('45deg', '11%', '28%'), slotL('-45deg', '11%', '28%'))} }${TR}`,
  }),
  { pal: 71 }
);

add(
  'Screenwork',
  'A lattice on one half of the cell and nothing on the other.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${mskI('repeating-linear-gradient(0deg, #000 0 7%, transparent 7% 18%)', halfL('90deg', '58%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 39 }
);

add(
  'Jaliwork',
  'A grid of square openings with a round hole cut at each crossing.',
  (c) => ({
    rule: `${F} { background: ${ink(c)}; ${mskI('repeating-linear-gradient(0deg, #000 0 6%, transparent 6% 25%)', 'radial-gradient(circle at 50% 50%, transparent 26%, #000 26%) 0 0 / 25% 25%')} }${TR}`,
  }),
  { pal: 50 }
);

add(
  'Grillage',
  'Heavy bars one way, light the other, and the whole thing set on a lean.',
  (c) => ({
    rule: `${F} { ${woven(c, slotL('20deg', '16%', '30%'), slotL('110deg', '6%', '30%'))} }${TR}`,
  }),
  { pal: 26 }
);

add(
  'Quarrel',
  'Diamond panes: a diagonal lattice with the openings much larger than the bars.',
  (c) => ({ rule: `${F} { ${plaid(c, slotL('45deg', '5%', '30%'), slotL('-45deg', '5%', '30%'))} }${TR}` }),
  { pal: 65 }
);

add(
  'Leadwork',
  'A diagonal lattice with a solid disc set in the middle of it.',
  (c) => ({
    rule: `${F} { ${B(`inset: 0; background: ${c1}; ${msk(slotL('45deg', '7%', '24%'), slotL('-45deg', '7%', '24%'))}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${msk(discL('22%'))}`)} }${TR}`,
  }),
  { pal: 43 }
);

add(
  'Tabbyweave',
  'The plainest weave there is: one over, one under, both inks the same width.',
  (c) => ({
    rule: `${F} { ${woven(c, slotL('0deg', '12.5%', '25%'), slotL('90deg', '12.5%', '25%'))} }${TR}`,
  }),
  { pal: 74 }
);

export const sectionN = { title: 'N. Lattice', all };
