// T. Radius — what `border-radius` alone can draw.
//
// One property, four corners, and a percentage each: a square, a lozenge, a
// leaf, a pill, a disc. The converter reads the resolved radii off the box and
// emits a <rect> with them, or a <path> where the corners differ, so these sit
// at a flat zero against their live render.
//
// No design here puts a border on a rounded box — the converter throws on a
// partially-rounded one, and mixed widths round a corner deviate by up to a
// pixel. The shapes are filled, and where an outline is wanted it is a second
// filled shape inside the first.
import { section, A, B, F, TR, ink, rot, msk, bandL, R2, R4, c1 } from './shared.mjs';

const { add, all } = section('T. Radius');

/** One rounded box on an otherwise empty cell. */
const round = (c, css, turns = R4) =>
  `--rot: ${turns}; ${F} { ${A(`${css} background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`;

add(
  'Roundbox',
  'A square with all four corners rounded by the same amount.',
  (c) => ({ rule: round(c, 'inset: 8%; border-radius: 22%;') }),
  { pal: 6 }
);

add(
  'Pillbox',
  'A bar rounded to a half circle at each end.',
  (c) => ({ rule: round(c, 'left: 6%; right: 6%; top: 34%; height: 32%; border-radius: 999px;') }),
  { pal: 28 }
);

add(
  'Roundcut',
  'One corner rounded hard and the other three left square — a quadrant.',
  (c) => ({ rule: round(c, 'inset: 6%; border-radius: 100% 0 0 0;') }),
  { pal: 45 }
);

add(
  'Roundpair',
  'Two opposite corners rounded, which turns the square into a leaf.',
  (c) => ({ rule: round(c, 'inset: 6%; border-radius: 76% 0 76% 0;', R2) }),
  { pal: 64 }
);

add(
  'Roundbar',
  'A rounded bar with a second, shorter one set inside it.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`left: 4%; right: 4%; top: 30%; height: 40%; border-radius: 999px; background: ${c1};`)} ${A(`left: 12%; right: 44%; top: 38%; height: 24%; border-radius: 999px; background: ${ink(c, 2)};`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 10 }
);

add(
  'Roundnotch',
  'A rounded block with a disc of ground bitten out of one side.',
  (c) => ({
    // The bite is a hole in the mask, not a disc painted in the background
    // colour: a knockout that is painted stops being one the moment the
    // background is transparent.
    rule: `--rot: ${R4}; ${F} { ${A(`inset: 10%; border-radius: 18%; background: ${ink(c)}; ${msk('radial-gradient(circle at 100% 50%, transparent 30%, #000 30%)')}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 33 }
);

add(
  'Capsulecut',
  'Two pills crossing at right angles.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { ${B(`left: 4%; right: 4%; top: 38%; height: 24%; border-radius: 999px; background: ${c1};`)} ${A(`top: 4%; bottom: 4%; left: 38%; width: 24%; border-radius: 999px; background: ${ink(c, 2)};`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 54 }
);

add(
  'Roundstep',
  'Three corners rounded by different amounts, so the shape leans.',
  (c) => ({ rule: round(c, 'inset: 7%; border-radius: 60% 12% 40% 4%;') }),
  { pal: 69 }
);

add(
  'Roundfield',
  'A disc with a ring standing off it, both cut from the same ink.',
  (c) => ({
    rule: `${F} { ${B(`inset: 30%; border-radius: 50%; background: ${ink(c)};`)} ${A(`inset: 0; background: ${ink(c)}; ${msk(bandL('58%', '78%'))}`)} }${TR}`,
  }),
  { pal: 19 }
);

add(
  'Lozengecut',
  'A rounded square turned a quarter turn, so it stands on a point.',
  (c) => ({
    rule: `${F} { ${A(`inset: 18%; border-radius: 16%; background: ${ink(c)}; ${rot('45deg')}`)} }${TR}`,
  }),
  { pal: 40 }
);

export const sectionT = { title: 'T. Radius', all };
