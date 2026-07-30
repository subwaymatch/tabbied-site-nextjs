// H. Bar — marks assembled from plain rectangles.
//
// No clip path, no mask, no gradient: an absolutely-positioned pseudo-element
// with four offsets is a rectangle, and two of them are a cross, a tee, an
// ell, a pair of rails. It is the least expressive tool in the batch and the
// most exact — a rectangle exports as a <rect> with the same four numbers, so
// everything in this section sits at a flat zero against its live render.
//
// The section is about *placed* marks rather than fields: where a bar starts
// and stops, what it meets, and what is left between them. Section B has the
// repeating fields.
import { section, A, B, F, TR, ink, rot, msk, slotL, discL, R2, R4, c1 } from './shared.mjs';

const { add, all } = section('H. Bar');

/** Two bars, one from each pseudo-element, on a cell that is otherwise empty. */
const bars = (first, second, turns = R4) =>
  `--rot: ${turns}; ${F} { ${B(first)} ${A(second)} ${rot('@var(--rot)')} }${TR}`;

const across = (top, height, inkValue, from = '0', to = '0') =>
  `left: ${from}; right: ${to}; top: ${top}; height: ${height}; background: ${inkValue};`;
const down = (left, width, inkValue, from = '0', to = '0') =>
  `top: ${from}; bottom: ${to}; left: ${left}; width: ${width}; background: ${inkValue};`;

add(
  'Teebar',
  'A bar across the top and a stem down from the middle of it.',
  (c) => ({ rule: bars(across('16%', '15%', c1), down('42%', '16%', ink(c, 2), '16%', '14%')) }),
  { pal: 0 }
);

add(
  'Ellbar',
  'Two bars meeting at a right angle, one long and one short.',
  (c) => ({ rule: bars(down('22%', '15%', ink(c), '14%', '14%'), across('71%', '15%', ink(c), '22%', '20%')) }),
  { pal: 19 }
);

add(
  'Ladderbar',
  'Two rails with rungs between them, the rungs cut from a ruled field.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { ${B(`inset: 12% 26%; background: ${c1}; ${msk('linear-gradient(90deg, #000 0 18%, transparent 18% 82%, #000 82% 100%)')}`)} ${A(`inset: 12% 26%; background: ${ink(c, 2)}; ${msk(slotL('0deg', '9%', '24%'))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 12 }
);

add(
  'Rungbar',
  'Three short bars stacked with wide gaps, the rails left out.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${A(`inset: 14% 24%; background: ${ink(c)}; ${msk(slotL('0deg', '13%', '43%'))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 27 }
);

add(
  'Batten',
  'One broad bar laid across the middle of the cell, nothing else.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${A(across('38%', '24%', ink(c)))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 34 }
);

add(
  'Cleatbar',
  'Two short bars set apart, both stopping well short of the edges.',
  (c) => ({
    rule: bars(across('24%', '14%', ink(c), '18%', '46%'), across('62%', '14%', ink(c), '46%', '18%')),
  }),
  { pal: 46 }
);

add(
  'Strapbar',
  'A single bar run corner to corner, so it leaves the cell at both ends.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${A(`left: -30%; right: -30%; top: 42%; height: 16%; background: ${ink(c)}; ${rot('45deg')}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 55 }
);

add(
  'Bandbar',
  'A band deep enough to be a field rather than a line, with a thin rule beside it.',
  (c) => ({
    rule: bars(across('8%', '42%', c1), across('60%', '7%', ink(c, 2))),
  }),
  { pal: 9 }
);

add(
  'Tickbar',
  'A rule with short ticks hanging off it at regular intervals.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(across('44%', '9%', c1))} ${A(`left: 0; right: 0; top: 53%; height: 20%; background: ${ink(c, 2)}; ${msk(slotL('90deg', '7%', '20%'))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 41 }
);

add(
  'Stopbar',
  'A long bar with a short cap standing across one end.',
  (c) => ({
    rule: bars(across('44%', '12%', ink(c), '10%', '20%'), down('76%', '12%', ink(c), '26%', '26%')),
  }),
  { pal: 21 }
);

add(
  'Endstop',
  'A bar capped at both ends, so it reads as a beam rather than a line.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(across('44%', '12%', ink(c), '14%', '14%'))} ${A(`left: 0; right: 0; top: 26%; height: 48%; background: ${ink(c)}; ${msk('linear-gradient(90deg, #000 0 14%, transparent 14% 86%, #000 86% 100%)')}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 30 }
);

add(
  'Runbar',
  'The bar runs past both edges of its cell and carries on into the next.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { ${A(`left: -20%; right: -20%; top: 36%; height: 28%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 62 }
);

add(
  'Gapbar',
  'One bar with a clear break in the middle of it.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${A(`left: 0; right: 0; top: 40%; height: 20%; background: ${ink(c)}; ${msk('linear-gradient(90deg, #000 0 36%, transparent 36% 64%, #000 64% 100%)')}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 15 }
);

add(
  'Doublebar',
  'Two parallel bars of equal weight with a wide channel between them.',
  (c) => ({
    rule: bars(across('22%', '18%', ink(c)), across('60%', '18%', ink(c)), R2),
  }),
  { pal: 24 }
);

add(
  'Triplebar',
  'Three bars: two thin ones and one heavy, unevenly spaced.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(across('14%', '8%', c1))} ${A(`left: 0; right: 0; top: 34%; height: 52%; background: ${ink(c, 2)}; ${msk('linear-gradient(180deg, #000 0 34%, transparent 34% 78%, #000 78% 100%)')}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 57 }
);

add(
  'Offsetbar',
  'Two bars on the same line, one high and one low, overlapping in the middle.',
  (c) => ({
    rule: bars(across('30%', '16%', c1, '0', '38%'), across('54%', '16%', ink(c, 2), '38%', '0')),
  }),
  { pal: 68 }
);

add(
  'Crossnought',
  'A cross of two heavy bars meeting at the middle of the cell.',
  (c) => ({
    rule: `${F} { ${B(across('40%', '20%', ink(c)))} ${A(down('40%', '20%', ink(c)))} }${TR}`,
  }),
  { pal: 4 }
);

add(
  'Plusmark',
  'The same cross drawn thin, and held clear of the cell edge.',
  (c) => ({
    rule: `${F} { ${B(across('46%', '8%', ink(c), '16%', '16%'))} ${A(down('46%', '8%', ink(c), '16%', '16%'))} }${TR}`,
  }),
  { pal: 51 }
);

add(
  'Minusmark',
  'A single short dash, centred, and nothing else in the cell.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { ${A(across('45%', '10%', ink(c), '26%', '26%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 71 }
);

add(
  'Gridmark',
  'Two bars each way, crossing to leave nine openings.',
  (c) => ({
    rule: `${F} { ${B(`inset: 0; background: ${c1}; ${msk(slotL('0deg', '11%', '33%'))}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${msk(slotL('90deg', '11%', '33%'))}`)} }${TR}`,
  }),
  { pal: 39 }
);

add(
  'Tallymark',
  'Four uprights with a fifth struck across them.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { ${B(`inset: 14% 12%; background: ${c1}; ${msk(slotL('90deg', '9%', '26%'))}`)} ${A(`left: 6%; right: 6%; top: 44%; height: 10%; background: ${ink(c, 2)}; ${rot('-18deg')}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 50 }
);

add(
  'Slashbar',
  'One bar leaning at forty-five degrees, kept inside its cell.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { ${A(`left: 14%; right: 14%; top: 44%; height: 13%; background: ${ink(c)}; ${rot('-45deg')}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 26 }
);

add(
  'Backslashbar',
  'Two leaning bars crossing, one over the other.',
  (c) => ({
    rule: `${F} { ${B(`left: 8%; right: 8%; top: 44%; height: 12%; background: ${c1}; ${rot('45deg')}`)} ${A(`left: 8%; right: 8%; top: 44%; height: 12%; background: ${ink(c, 2)}; ${rot('-45deg')}`)} }${TR}`,
  }),
  { pal: 65 }
);

add(
  'Verticalbar',
  'A single upright, off to one side of the cell rather than down the middle.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${A(down('22%', '18%', ink(c)))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 43 }
);

add(
  'Signalbar',
  'A bar with a disc at one end of it, like an arm with a lamp.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(across('45%', '10%', c1, '12%', '34%'))} ${A(`right: 12%; top: 30%; width: 40%; height: 40%; background: ${ink(c, 2)}; ${msk(discL('46%'))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 74 }
);

export const sectionH = { title: 'H. Bar', all };
