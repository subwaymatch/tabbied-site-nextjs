// M. Bar — marks assembled from plain rectangles.
//
// No clip path, no mask, no gradient: an absolutely-positioned pseudo-element
// with four offsets is a rectangle, and two of them are a cross, a tee, an
// ell, a pair of rails. It is the least expressive tool in the batch and the
// most exact — a rectangle exports as a <rect> with the same four numbers, so
// everything here sits at a flat zero against its live render.
//
// The section is about *placed* marks: where a bar starts and stops, what it
// meets, and what is left between them.
import { section, A, B, F, TR, ink, rot, across, down, R2, R4, c1 } from './shared.mjs';

const { add, all } = section('M. Bar');

/** Two bars, one from each pseudo-element, on a cell that is otherwise empty. */
const bars = (first, second, turns = R4) =>
  `--rot: ${turns}; ${F} { ${B(first)} ${A(second)} ${rot('@var(--rot)')} }${TR}`;

add(
  'Barset',
  'A full-bleed ink with two rails banded across it, one thin and one heavy.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { background: ${ink(c)}; ${B(`${across('0', '8%', c1)}`)} ${A(`${across('40%', '20%', 'var(--color2)')}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 7 }
);

add(
  'Barpair',
  'Two bars of the same weight crossing at right angles.',
  (c) => ({ rule: bars(across('42%', '16%', ink(c)), down('42%', '16%', ink(c)), R2) }),
  { pal: 32 }
);

add(
  'Stackbar',
  'Two bars banked against one edge, and the pair changing ends every other cell.',
  (c) => ({
    rule: `${F} { ${B(across('6%', '10%', ink(c)))} ${A(across('30%', '10%', ink(c)))} @even { ${rot('180deg')} } }${TR}`,
  }),
  { pal: 50 }
);

add(
  'Barfield',
  'One long bar right across the cell, and a shorter one standing on it.',
  (c) => ({
    rule: bars(
      across('58%', '12%', ink(c)),
      `left: 42%; width: 14%; top: 12%; bottom: 42%; background: ${ink(c)};`
    ),
  }),
  { pal: 67 }
);

add(
  'Barcut',
  'A heavy bar with a narrow one of another ink laid across its middle.',
  (c) => ({
    rule: bars(across('30%', '40%', c1, '10%'), down('44%', '8%', ink(c, 2))),
  }),
  { pal: 14 }
);

add(
  'Barstep',
  'Two bars offset from each other, meeting only at their ends.',
  (c) => ({
    rule: bars(across('24%', '14%', ink(c), '8%'), across('58%', '14%', ink(c), '8%')),
  }),
  { pal: 39 }
);

add(
  'Barslide',
  'One bar leaning at forty-five degrees, kept inside its cell.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { ${A(`left: 10%; right: 10%; top: 42%; height: 16%; background: ${ink(c)}; ${rot('45deg')}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 58 }
);

add(
  'Longbar',
  'A single bar the full width of the cell, sitting off centre.',
  (c) => ({ rule: `--rot: ${R4}; ${F} { ${A(across('62%', '22%', ink(c)))} ${rot('@var(--rot)')} }${TR}` }),
  { pal: 73 }
);

add(
  'Barpad',
  'A bar set into a block of another ink, with an even margin all round it.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { background: ${c1}; ${A(`inset: 18%; background: ${ink(c, 2)};`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 23 }
);

add(
  'Barrow',
  'A short upright standing on a line that runs the full width of the cell.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`${across('76%', '10%', ink(c))}`)} ${A(`left: 14%; width: 12%; top: 30%; height: 46%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 44 }
);

export const sectionM = { title: 'M. Bar', all };
