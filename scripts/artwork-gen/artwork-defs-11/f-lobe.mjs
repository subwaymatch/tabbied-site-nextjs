// F. Lobe — everything border-radius can be talked into.
//
// One property, eight numbers: a corner radius per corner, each with its own
// horizontal and vertical component. Set them all to half the box and you have
// a circle; set two opposite pairs and you have a leaf; pull the vertical
// components away from the horizontal and the whole thing turns oval. Nothing
// else in CSS gives so many shapes for so little code, and every one of them
// interpolates into every other, so a reseed morphs rather than cuts.
//
// The converter reads the eight computed values back and emits an SVG path
// with matching elliptical arcs — the one thing to stay away from is putting a
// *border* on a partially-rounded box, which it refuses outright. Nothing in
// this section has a border; section G handles those, on square boxes.
import { section, A, B, F, TR, ink, rot, R2, R4, c1 } from './shared.mjs';

const { add, all } = section('F. Lobe');

/** A rounded solid filling the cell, turned a quarter at a time. */
const lobe = (c, radius, turns = R4) =>
  `--rot: ${turns}; ${F} { background: ${ink(c)}; border-radius: ${radius}; ${rot('@var(--rot)')} }${TR}`;

/** A rounded solid inset from the cell edge. */
const inner = (c, radius, inset, turns = R4) =>
  `--rot: ${turns}; ${F} { ${A(`inset: ${inset}; background: ${ink(c)}; border-radius: ${radius};`)} ${rot('@var(--rot)')} }${TR}`;

add(
  'Lobeform',
  'Three corners rounded and one left square: the plainest leaf there is.',
  (c) => ({ rule: lobe(c, '50% 50% 50% 0') }),
  { pal: 0 }
);

add(
  'Petalcut',
  'Two opposite corners taken all the way round and two left sharp.',
  (c) => ({ rule: lobe(c, '100% 0 100% 0', R2) }),
  { pal: 19 }
);

add(
  'Leafcut',
  'The same two-corner cut on the other diagonal, so the leaf lies the other way.',
  (c) => ({ rule: lobe(c, '0 100% 0 100%', R2) }),
  { pal: 12 }
);

add(
  'Palmate',
  'A round shape with one corner squared off, laid over a second turned against it.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`inset: 6%; background: ${c1}; border-radius: 50% 50% 50% 0;`)} ${A(`inset: 28%; background: ${ink(c, 2)}; border-radius: 0 50% 50% 50%;`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 27 }
);

add(
  'Cordate',
  'Wide and round at the top, drawn to a point at the bottom.',
  (c) => ({ rule: lobe(c, '80% 80% 12% 12%') }),
  { pal: 34 }
);

add(
  'Reniform',
  'A kidney: a rounded block with a round bite taken out of one side.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`inset: 8%; background: ${ink(c)}; border-radius: 50%;`)} ${A(`left: -22%; top: 20%; width: 60%; height: 60%; background: ${ink(c)}; border-radius: 50%;`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 46 }
);

add(
  'Obovate',
  'An egg: rounder at one end than the other, the radii pulled apart vertically.',
  (c) => ({ rule: lobe(c, '50% 50% 42% 42% / 62% 62% 38% 38%') }),
  { pal: 55 }
);

add(
  'Spatulate',
  'Square at the base and round at the head, like the end of a paddle.',
  (c) => ({ rule: lobe(c, '48% 48% 8% 8% / 60% 60% 10% 10%') }),
  { pal: 9 }
);

add(
  'Lanceolate',
  'A narrow blade: rounded along its length and pointed at both ends.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${A(`left: 30%; right: 30%; top: 4%; bottom: 4%; background: ${ink(c)}; border-radius: 50% 50% 50% 50% / 24% 24% 24% 24%;`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 41 }
);

add(
  'Auricle',
  'One corner round, its neighbour half round, the other two square.',
  (c) => ({ rule: lobe(c, '60% 24% 0 0') }),
  { pal: 21 }
);

add(
  'Lappet',
  'A flap: square at the top and rounded off along the bottom edge.',
  (c) => ({ rule: lobe(c, '0 0 42% 42%') }),
  { pal: 30 }
);

add(
  'Earlobe',
  'A round shape set low in the cell with one side flattened against the edge.',
  (c) => ({ rule: inner(c, '50% 50% 50% 0', '18% 10% 6% 22%') }),
  { pal: 62 }
);

add(
  'Dropform',
  'A teardrop: round on three corners, drawn to a point at the fourth.',
  (c) => ({ rule: inner(c, '50% 50% 50% 4%', '8%') }),
  { pal: 15 }
);

add(
  'Pearform',
  'Narrow at the top and full at the bottom, with the radii graded between.',
  (c) => ({ rule: lobe(c, '38% 38% 50% 50% / 32% 32% 58% 58%') }),
  { pal: 24 }
);

add(
  'Ovoid',
  'A plain oval, wider than it is tall.',
  (c) => ({ rule: inner(c, '50%', '20% 4%', R2) }),
  { pal: 57 }
);

add(
  'Bolster',
  'A capsule laid across the cell, ends fully round.',
  (c) => ({ rule: inner(c, '50% / 50%', '32% 4%', R2) }),
  { pal: 68 }
);

add(
  'Cushion',
  'A square with all four corners eased by the same generous amount.',
  (c) => ({ rule: inner(c, '28%', '8%', R2) }),
  { pal: 4 }
);

add(
  'Pillowform',
  'The horizontal radii much larger than the vertical, so the shape bulges sideways.',
  (c) => ({ rule: inner(c, '48% / 22%', '10%', R2) }),
  { pal: 51 }
);

add(
  'Roundend',
  'A stadium: straight sides, semicircular ends, standing upright.',
  (c) => ({ rule: inner(c, '50% / 26%', '4% 26%', R2) }),
  { pal: 71 }
);

add(
  'Obround',
  'A capsule with a second, smaller capsule sitting inside it in another ink.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { ${B(`inset: 6% 24%; background: ${c1}; border-radius: 50% / 22%;`)} ${A(`inset: 22% 36%; background: ${ink(c, 2)}; border-radius: 50% / 30%;`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 39 }
);

add(
  'Slotform',
  'A long thin capsule, more line than shape.',
  (c) => ({ rule: inner(c, '50% / 50%', '6% 42%', R4) }),
  { pal: 50 }
);

add(
  'Racetrack',
  'A capsule with a capsule-shaped hole down the middle of it.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { ${B(`inset: 8% 22%; background: ${ink(c)}; border-radius: 50% / 24%;`)} ${A(`inset: 22% 34%; background: ${ink(c)}; border-radius: 50% / 26%;`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 26 }
);

add(
  'Quadrifoil',
  'Four discs set on the quarters, overlapping just enough to read as one shape.',
  (c) => ({
    rule: `${F} { ${B(`left: 4%; right: 4%; top: 26%; bottom: 26%; background: ${ink(c)}; border-radius: 50%;`)} ${A(`left: 26%; right: 26%; top: 4%; bottom: 4%; background: ${ink(c)}; border-radius: 50%;`)} }${TR}`,
  }),
  { pal: 65 }
);

add(
  'Trilobe',
  'A disc with a second, smaller one riding on its shoulder.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`left: 10%; right: 34%; top: 34%; bottom: 10%; background: ${c1}; border-radius: 50%;`)} ${A(`left: 38%; right: 8%; top: 8%; bottom: 38%; background: ${ink(c, 2)}; border-radius: 50%;`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 43 }
);

add(
  'Bilobe',
  'Two discs of the same size set side by side, just touching.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { ${B(`left: 3%; width: 46%; top: 27%; height: 46%; background: ${ink(c)}; border-radius: 50%;`)} ${A(`right: 3%; width: 46%; top: 27%; height: 46%; background: ${ink(c)}; border-radius: 50%;`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 74 }
);

export const sectionF = { title: 'F. Lobe', all };
