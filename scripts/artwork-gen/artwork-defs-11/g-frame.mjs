// G. Frame — borders, and what can be built out of them.
//
// A border is four strokes that mitre into each other at the corners, and the
// converter draws them as four paths meeting on the diagonals — exactly what
// the browser paints, which is why per-side borders come out at 0.00%. The one
// thing it will not do is a border on a *partially* rounded box: mixed radii
// turn the mitre into a progressive blend that no stroke can reproduce, and it
// throws rather than guess. So everything here is square-cornered, or a full
// circle, and never in between.
//
// Widths are px (a border takes no percentage), scaled down as the grid
// densifies so a frame keeps its proportion instead of swallowing its cell.
import { section, A, B, F, TR, ink, rot, u, R2, R4, c1 } from './shared.mjs';

const { add, all } = section('G. Frame');

/** A plain frame on the cell itself. */
const frame = (c, width) =>
  `${F} { border: ${u(width)} solid ${ink(c)}; }${TR}`;

/** A frame on an inset pseudo-element, so the cell keeps a margin. */
const insetFrame = (c, width, inset, turns = R4) =>
  `--rot: ${turns}; ${F} { ${A(`inset: ${inset}; border: ${u(width)} solid ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`;

add(
  'Mountboard',
  'A heavy frame right on the cell edge, the opening square in the middle of it.',
  (c) => ({ rule: frame(c, 7) }),
  { pal: 0, min: 26 }
);

add(
  'Matboard',
  'Two frames, one just inside the other, in different inks.',
  (c) => ({
    rule: `${F} { border: ${u(5)} solid ${c1}; ${A(`inset: 14%; border: ${u(3)} solid ${ink(c, 2)};`)} }${TR}`,
  }),
  { pal: 19, min: 30 }
);

add(
  'Sashframe',
  'A frame with one bar across it and one down, dividing the opening into four.',
  (c) => ({
    rule: `${F} { border: ${u(5)} solid ${ink(c)}; ${B(`left: 0; right: 0; top: 50%; height: ${u(4)}; margin-top: ${u(-2)}; background: ${ink(c)};`)} ${A(`top: 0; bottom: 0; left: 50%; width: ${u(4)}; margin-left: ${u(-2)}; background: ${ink(c)};`)} }${TR}`,
  }),
  { pal: 12, min: 30 }
);

add(
  'Casement',
  'A frame with a single bar across it, set below the middle.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { border: ${u(5)} solid ${ink(c)}; ${A(`left: 0; right: 0; top: 64%; height: ${u(4)}; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 27, min: 30 }
);

add(
  'Muntin',
  'A frame divided into nine panes by two bars each way.',
  (c) => ({
    // The bars are two background layers rather than pseudo-elements so the
    // ink can be rolled once and read four times — @var() caches the roll,
    // where a plain var() would re-roll at every occurrence.
    rule: `--bar: ${ink(c)}; ${F} { border: ${u(4)} solid ${ink(c)}; background-image: linear-gradient(90deg, transparent 0 32%, @var(--bar) 32% 36%, transparent 36% 64%, @var(--bar) 64% 68%, transparent 68% 100%), linear-gradient(180deg, transparent 0 32%, @var(--bar) 32% 36%, transparent 36% 64%, @var(--bar) 64% 68%, transparent 68% 100%); }${TR}`,
  }),
  { pal: 34, min: 34 }
);

add(
  'Glazingbar',
  'A frame with two upright bars in it and nothing across.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { border: ${u(4)} solid ${ink(c)}; ${B(`top: 0; bottom: 0; left: 33%; width: ${u(4)}; background: ${ink(c)};`)} ${A(`top: 0; bottom: 0; left: 67%; width: ${u(4)}; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 46, min: 30 }
);

add(
  'Doorcase',
  'A frame open on one side, so it reads as a case rather than an enclosure.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { border: ${u(6)} solid ${ink(c)}; border-bottom-width: 0; ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 55, min: 26 }
);

add(
  'Surround',
  'A frame held well in from the cell edge, with a clear margin all round it.',
  (c) => ({ rule: insetFrame(c, 5, '18%', R2) }),
  { pal: 9, min: 34 }
);

add(
  'Bolection',
  'Two frames with a wide gap between them, the outer heavier than the inner.',
  (c) => ({
    rule: `${F} { border: ${u(6)} solid ${c1}; ${A(`inset: 30%; border: ${u(3)} solid ${ink(c, 2)};`)} }${TR}`,
  }),
  { pal: 41, min: 34 }
);

add(
  'Beadframe',
  'The lightest frame that still reads as one: a single thin rule round the cell.',
  (c) => ({ rule: frame(c, 2) }),
  { pal: 21, min: 22 }
);

add(
  'Doubleframe',
  'Two thin frames close together, so the edge reads as a pair of lines.',
  (c) => ({
    rule: `${F} { border: ${u(2)} solid ${ink(c)}; ${A(`inset: 10%; border: ${u(2)} solid ${ink(c)};`)} }${TR}`,
  }),
  { pal: 30, min: 30 }
);

add(
  'Innerframe',
  'Only the inner frame, drawn well inside a cell that is otherwise empty.',
  (c) => ({ rule: insetFrame(c, 4, '30%', R2) }),
  { pal: 62, min: 34 }
);

add(
  'Outerframe',
  'A frame with an opening so small the cell reads as nearly solid.',
  (c) => ({ rule: insetFrame(c, 14, '2%', R2) }),
  { pal: 15, min: 40 }
);

add(
  'Hairlineframe',
  'A frame drawn as fine as the grid allows, with a second one inside it.',
  (c) => ({
    rule: `${F} { border: ${u(1.5)} solid ${c1}; ${A(`inset: 22%; border: ${u(1.5)} solid ${ink(c, 2)};`)} }${TR}`,
  }),
  { pal: 24, min: 40 }
);

add(
  'Thickline',
  'A frame so heavy the opening is barely there.',
  (c) => ({ rule: frame(c, 16) }),
  { pal: 57, min: 44 }
);

add(
  'Sideborder',
  'A rule down one side of the cell only, turning from cell to cell.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { border-left: ${u(8)} solid ${ink(c)}; ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 68, min: 26 }
);

add(
  'Halfborder',
  'Two adjacent sides ruled and two left open — a corner rather than a frame.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { border-left: ${u(7)} solid ${ink(c)}; border-top: ${u(7)} solid ${ink(c)}; ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 4, min: 26 }
);

add(
  'Cornerbrace',
  'Two short bars meeting at a corner, stopping well short of the others.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`left: 6%; top: 6%; width: 46%; height: ${u(5)}; background: ${ink(c)};`)} ${A(`left: 6%; top: 6%; width: ${u(5)}; height: 46%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 51, min: 26 }
);

add(
  'Bracketframe',
  'Corner brackets at opposite corners, the middle of the cell left entirely open.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { ${B(`left: 8%; top: 8%; width: 34%; height: 34%; border-left: ${u(5)} solid ${ink(c)}; border-top: ${u(5)} solid ${ink(c)};`)} ${A(`right: 8%; bottom: 8%; width: 34%; height: 34%; border-right: ${u(5)} solid ${ink(c)}; border-bottom: ${u(5)} solid ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 71, min: 30 }
);

add(
  'Angleiron',
  'A single L of two heavy strokes, set square in the cell.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${A(`inset: 16%; border-left: ${u(9)} solid ${ink(c)}; border-bottom: ${u(9)} solid ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 39, min: 30 }
);

add(
  'Tiebar',
  'A frame with one diagonal tie run across the opening.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { border: ${u(4)} solid ${c1}; ${A(`left: -20%; right: -20%; top: 50%; height: ${u(4)}; background: ${ink(c, 2)}; ${rot('45deg')}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 50, min: 30 }
);

add(
  'Escutcheon',
  'A round frame instead of a square one — the only rounded box a border may sit on.',
  (c) => ({
    rule: `${F} { ${A(`inset: 6%; border: ${u(7)} solid ${ink(c)}; border-radius: 50%;`)} }${TR}`,
  }),
  { pal: 26, min: 30 }
);

add(
  'Shieldframe',
  'A square frame with a round one held inside it.',
  (c) => ({
    rule: `${F} { border: ${u(4)} solid ${c1}; ${A(`inset: 18%; border: ${u(5)} solid ${ink(c, 2)}; border-radius: 50%;`)} }${TR}`,
  }),
  { pal: 65, min: 34 }
);

add(
  'Panelframe',
  'A frame with the middle filled in, so the opening becomes a panel.',
  (c) => ({
    rule: `${F} { border: ${u(6)} solid ${c1}; ${A(`inset: 26%; background: ${ink(c, 2)};`)} }${TR}`,
  }),
  { pal: 43, min: 30 }
);

add(
  'Wainscot',
  'A frame with a band across its foot, like panelling meeting a rail.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { border: ${u(4)} solid ${c1}; ${A(`left: 0; right: 0; bottom: 0; height: 28%; background: ${ink(c, 2)};`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 74, min: 30 }
);

export const sectionG = { title: 'G. Frame', all };
