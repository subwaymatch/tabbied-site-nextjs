// B. Crossfade — two inks handing over to each other.
//
// A solid ink underneath and a second one above it, let down by a ramp: where
// the upper one is solid you see it, where the ramp has spent it you see the
// lower, and in between the two mix. It is the closest this vocabulary gets to
// a two-colour gradient, and it is deliberately built the long way round —
// both inks stay ordinary background-colors, so a reseed morphs both of them
// through the blend rather than snapping the whole cell to a new image.
//
// The base is always the fixed first ink and the overlay always picks from the
// rest, so the pair reads as a hand-over rather than as one colour twice.
import {
  section,
  A,
  B,
  F,
  TR,
  ink,
  rot,
  msk,
  fade,
  rise,
  midFade,
  sheet,
  c1,
  R2,
  R4,
} from './shared.mjs';

const { add, all } = section('B. Crossfade');

/** Base ink, and one ramped ink over it. */
const over = (c, layer, turns = R4) =>
  `--rot: ${turns}; ${F} { background: ${c1}; ${sheet(A, ink(c, 2), msk(layer))} ${rot('@var(--rot)')} }${TR}`;

add(
  'Crossfade',
  'One ink solid at one edge, the other solid at the opposite edge, and the whole cell between them.',
  (c) => ({ rule: over(c, fade('180deg', '0%', '100%')) }),
  { pal: 1 }
);

add(
  'Blendpair',
  'The second ink strongest down the middle and gone by both edges.',
  (c) => ({ rule: over(c, midFade('180deg', '0%', '50%', '50%', '100%'), R2) }),
  { pal: 22 }
);

add(
  'Meetline',
  'A hard edge across the cell with a soft one climbing to meet it from the other side.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`left: 0; right: 0; top: 0; height: 55%; background: ${c1};`)} ${sheet(A, ink(c, 2), msk(fade('0deg', '0%', '62%')))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 40 }
);

add(
  'Mingle',
  'Three inks: one flat, and two more coming in from edges at right angles to each other.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${c1}; ${sheet(B, 'var(--color2)', msk(fade('90deg', '0%', '86%')))} ${sheet(A, ink(c, 3), msk(fade('180deg', '0%', '86%')))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 13 }
);

add(
  'Seep',
  'The second ink pooled in one corner and thinning outwards from it.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${c1}; ${sheet(A, ink(c, 2), msk('radial-gradient(circle at 0% 0%, #000 0%, transparent 88%)'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 33 }
);

add(
  'Bleedline',
  'A broad stripe of the second ink with no edge to it at all — it just thickens and thins.',
  (c) => ({ rule: over(c, midFade('180deg', '18%', '40%', '60%', '82%'), R2) }),
  { pal: 54 }
);

add(
  'Interfade',
  'Two inks entering from facing edges, each spent before it reaches the other.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { background: ${c1}; ${sheet(B, 'var(--color2)', msk(fade('90deg', '0%', '70%')))} ${sheet(A, ink(c, 3), msk(fade('270deg', '0%', '70%')))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 63 }
);

add(
  'Twotone',
  'Nothing for the first half of the cell, then the second ink coming up over the rest.',
  (c) => ({ rule: over(c, rise('180deg', '48%', '100%')) }),
  { pal: 8 }
);

add(
  'Crossover',
  'The hand-over runs on the diagonal, one ink strong at each opposite corner.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { background: ${c1}; ${sheet(B, 'var(--color2)', msk(fade('135deg', '0%', '78%')))} ${sheet(A, ink(c, 3), msk(fade('315deg', '0%', '78%')))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 26 }
);

add(
  'Softseam',
  'Two inks butted hard against each other, and a third laid softly over the join.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { background: ${c1}; ${B(`right: 0; width: 50%; top: 0; bottom: 0; background: var(--color2);`)} ${sheet(A, ink(c, 3), msk(midFade('90deg', '32%', '46%', '54%', '68%')))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 47 }
);

add(
  'Meld',
  'The same hand-over in every cell, running the other way in every other one.',
  (c) => ({
    rule: `${F} { background: ${c1}; ${sheet(A, ink(c, 2), msk(fade('180deg', '0%', '100%')))} @even { ${rot('180deg')} } }${TR}`,
  }),
  { pal: 70 }
);

export const sectionB = { title: 'B. Crossfade', all };
