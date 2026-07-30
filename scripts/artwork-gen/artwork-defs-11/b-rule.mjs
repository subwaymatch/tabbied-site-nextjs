// B. Rule — stripe fields. Pitch, duty, angle, phase.
//
// A repeating-linear-gradient used as a mask is the cheapest real drawing in
// CSS and one of the most exact things the SVG converter does: the whole run
// becomes one gradient with spreadMethod="repeat", so a hundred stripes cost
// what two cost and land on the sub-pixel positions the browser used.
//
// The variables are few and the results are not: how wide the rule is, how
// much of the period it fills, which way it runs, where in the period it
// starts, and whether a second field is laid over the first at another phase.
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
  slot1,
  slotL,
  msk,
  mskI,
  halfL,
  discL,
  R2,
  R4,
  c1,
} from './shared.mjs';

const { add, all } = section('B. Rule');

// A striped cell: one ink, cut into rules.
const ruled = (c, angle, on, period) =>
  `background: ${ink(c)}; ${slot1(angle, on, period)}`;

add(
  'Pinstripe',
  'Fine rules with a lot of air between them, so the cell reads as a tint rather than a stripe.',
  (c) => ({ rule: `--ang: ${R2}; ${F} { ${ruled(c, '@var(--ang)', '7%', '28%')} }${TR}` }),
  { pal: 3 }
);

add(
  'Corduroy',
  'Wide ribs with a narrow channel between them — nearly solid, but not quite.',
  (c) => ({ rule: `--ang: ${R2}; ${F} { ${ruled(c, '@var(--ang)', '22%', '28%')} }${TR}` }),
  { pal: 19 }
);

add(
  'Grating',
  'Rule and gap the same width: the most even field there is.',
  (c) => ({ rule: `--ang: ${R2}; ${F} { ${ruled(c, '@var(--ang)', '12%', '24%')} }${TR}` }),
  { pal: 0 }
);

add(
  'Combline',
  'The rules run on the diagonal, crossing from one cell into the next without ever meeting.',
  (c) => ({ rule: `${F} { ${ruled(c, '45deg', '10%', '22%')} }${TR}` }),
  { pal: 12 }
);

add(
  'Coarseline',
  'Three fat rules to a cell and no more, laid either across or down.',
  (c) => ({ rule: `--ang: ${R4}; ${F} { ${ruled(c, '@var(--ang)', '18%', '36%')} }${TR}` }),
  { pal: 27 }
);

add(
  'Tramline',
  'Rules in pairs: two close together, then a wide gap, then two more.',
  (c) => ({
    rule: `--ang: ${R2}; ${F} { background: ${ink(c)}; ${msk('repeating-linear-gradient(@var(--ang), #000 0 8%, transparent 8% 14%, #000 14% 22%, transparent 22% 40%)')} }${TR}`,
  }),
  { pal: 30 }
);

add(
  'Ledgerline',
  'An even field of rules with every fourth one drawn heavy.',
  (c) => ({
    rule: `--ang: ${R2}; ${F} { background: ${ink(c)}; ${msk('repeating-linear-gradient(@var(--ang), #000 0 12%, transparent 12% 25%, #000 25% 31%, transparent 31% 50%, #000 50% 56%, transparent 56% 75%, #000 75% 81%, transparent 81% 100%)')} }${TR}`,
  }),
  { pal: 53 }
);

add(
  'Staveline',
  'A group of close rules and then a rest, the way a stave sits on a page.',
  (c) => ({
    rule: `--ang: ${R2}; ${F} { background: ${ink(c)}; ${mskI(slotL('@var(--ang)', '6%', '12%'), halfL('@var(--ang)', '62%'))} }${TR}`,
  }),
  { pal: 46 }
);

add(
  'Twophase',
  'Two rule fields in different inks, one shifted half a period off the other, so the cell fills without either doubling up.',
  (c) => ({
    rule: `${F} { background: ${c1}; ${msk(slotL('90deg', '11%', '22%'))} ${A(`inset: 0; background: ${ink(c, 2)}; ${msk('repeating-linear-gradient(90deg, transparent 0 11%, #000 11% 22%)')}`)} }${TR}`,
  }),
  { pal: 24 }
);

add(
  'Ribline',
  'The rules turn a quarter from cell to cell, so the sheet reads as woven rather than lined.',
  (c) => ({ rule: `--ang: ${R2}; ${F} { ${ruled(c, '@var(--ang)', '14%', '28%')} }${TR}` }),
  { pal: 41 }
);

add(
  'Scoreline',
  'The rules only reach halfway in: a scored edge against a clear field.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${mskI(slotL('90deg', '9%', '18%'), halfL('180deg', '54%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 7 }
);

add(
  'Pitchline',
  'Every cell picks its own pitch, so the sheet grades from open to dense with no order to it.',
  (c) => ({
    rule: `${F} { background: ${ink(c)}; ${slot1('90deg', '@pick(6%, 9%, 13%, 18%)', '@pick(14%, 22%, 30%, 40%)')} }${TR}`,
  }),
  { pal: 57 }
);

add(
  'Slatting',
  'Slats laid across the cell and tipped a few degrees, the way a blind sits when it is not quite shut.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${slot1('12deg', '15%', '26%')} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 61 }
);

add(
  'Blindfold',
  'Half the cells rule across and half rule down, and nothing says which is which.',
  (c) => ({ rule: `--ang: ${R2}; ${F} { ${ruled(c, '@var(--ang)', '10%', '20%')} }${TR}` }),
  { pal: 15 }
);

add(
  'Bandsaw',
  'A diagonal band of rules crossing an otherwise plain cell.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp(poly([[0, 22], [100, 0], [100, 52], [0, 74]]))} ${slot1('90deg', '8%', '16%')} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 34 }
);

add(
  'Striation',
  'Two inks ruled at right angles and laid over each other, so the crossings read as a third.',
  (c) => ({
    rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${msk(slotL('0deg', '10%', '24%'))}`)} ${A(`inset: 0; background: ${ink(c)}; ${msk(slotL('90deg', '10%', '24%'))}`)} }${TR}`,
  }),
  { pal: 38 }
);

add(
  'Cannelure',
  'Rules of two widths alternating — a wide flute, a narrow one, and so on across the cell.',
  (c) => ({
    rule: `--ang: ${R2}; ${F} { background: ${ink(c)}; ${msk('repeating-linear-gradient(@var(--ang), #000 0 16%, transparent 16% 26%, #000 26% 32%, transparent 32% 44%)')} }${TR}`,
  }),
  { pal: 5 }
);

add(
  'Grainline',
  'Rules leaning barely off the vertical, like grain in a sawn board.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${slot1('84deg', '9%', '19%')} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 65 }
);

add(
  'Rasp',
  'A dense, near-solid field: much more ink than gap, the gaps only just readable.',
  (c) => ({ rule: `--ang: ${R2}; ${F} { ${ruled(c, '@var(--ang)', '17%', '20%')} }${TR}` }),
  { pal: 49 }
);

add(
  'Serration',
  'The rules are cut to a triangle, so the field comes to a point.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp(poly([[50, 0], [100, 100], [0, 100]]))} ${slot1('0deg', '9%', '18%')} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 68 }
);

add(
  'Picketline',
  'Uprights with their heads cut off at an angle, standing in a row.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp(poly([[0, 18], [50, 0], [100, 18], [100, 100], [0, 100]]))} ${slot1('90deg', '11%', '22%')} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 11 }
);

add(
  'Railset',
  'Two rule fields at opposite leans, one behind the other, each in its own ink.',
  (c) => ({
    rule: `${F} { ${B(`inset: 0; background: ${c1}; ${msk(slotL('30deg', '9%', '26%'))}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${msk(slotL('-30deg', '9%', '26%'))}`)} }${TR}`,
  }),
  { pal: 21 }
);

add(
  'Sleeperline',
  'Rules across the middle of the cell with a plain margin held clear at each end.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { background: ${ink(c)}; ${mskI(slotL('0deg', '10%', '20%'), 'linear-gradient(90deg, transparent 0 14%, #000 14% 86%, transparent 86% 100%)')} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 72 }
);

add(
  'Roundrule',
  'The rules are cut to a disc, so the field is round and the lines run straight across it.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${mskI(slotL('0deg', '11%', '22%'), discL('50%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 43 }
);

add(
  'Tuckline',
  'Rules laid over a full field of a second ink, so the gaps show colour instead of sheet.',
  (c) => ({
    rule: `${F} { background: ${c1}; ${A(`inset: 0; background: ${ink(c, 2)}; ${msk(slotL('90deg', '13%', '26%'))}`)} }${TR}`,
  }),
  { pal: 29 }
);

export const sectionB = { title: 'B. Rule', all };
