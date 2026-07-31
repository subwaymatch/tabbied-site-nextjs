// S. Intersect — one shape cut by another, and only what they agree on left.
//
// `mask-composite: intersect` takes a list of mask layers and keeps the part
// every layer covers. It is the one CSS operator that makes genuinely new
// shapes out of old ones: a disc crossed with a stripe field leaves a barred
// circle, two sectors aimed at each other leave the diamond where they meet, a
// ring crossed with a wedge leaves an arc.
//
// The converter nests one <mask> inside the next, which is the correct
// reading, so what comes out is exactly what CSS composited — including the
// holes, which stay holes on a transparent background.
import {
  section,
  A,
  F,
  TR,
  cp,
  ink,
  poly,
  rot,
  msk,
  slotL,
  pieL,
  bandL,
  ringsL,
  dotsL,
  both,
  R2,
  R4,
} from './shared.mjs';

const { add, all } = section('S. Intersect');

const still = (c, ...layers) => `${F} { ${both(c, ...layers)} }${TR}`;
const turned = (c, layers, turns = R4) =>
  `--rot: ${turns}; ${F} { ${both(c, ...layers)} ${rot('@var(--rot)')} }${TR}`;

add(
  'Cutinto',
  'A disc with a ruled field taken out of it, so it comes out barred.',
  (c) => ({
    rule: still(
      c,
      'radial-gradient(circle closest-side at 50% 50%, #000 0 88%, transparent 88%)',
      slotL('0deg', '9%', '18%')
    ),
  }),
  { pal: 5 }
);

add(
  'Crosscut',
  'Two ruled fields at forty-five degrees to each other, leaving diamonds.',
  (c) => ({ rule: still(c, slotL('45deg', '14%', '26%'), slotL('135deg', '14%', '26%')) }),
  { pal: 23 }
);

add(
  'Maskcut',
  'A ring crossed with a wedge, so only an arc of it survives.',
  (c) => ({ rule: turned(c, [bandL('42%', '88%'), pieL('124deg', { from: '198deg' })]) }),
  { pal: 46 }
);

add(
  'Bothcut',
  'Two sectors from opposite corners, only the lens where they cross left.',
  (c) => ({
    rule: turned(c, [
      pieL('58deg', { from: '100deg', at: '0% 0%' }),
      pieL('58deg', { from: '280deg', at: '100% 100%' }),
    ]),
  }),
  { pal: 61 }
);

add(
  'Agreecut',
  'Concentric rings crossed with a dot field, which leaves beads on the rings.',
  (c) => ({ rule: still(c, ringsL('9%', '24%'), dotsL('44%', '16.67%')) }),
  { pal: 24 }
);

add(
  'Cutpair',
  'A triangle cut by rules running the other way from its slope.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp(poly([[0, 100], [100, 0], [100, 100]]))} ${msk(slotL('45deg', '8%', '19%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 32 }
);

add(
  'Intercut',
  'A dot field crossed with a wide ruled one — every other row of dots gone.',
  (c) => ({ rule: turned(c, [dotsL('40%', '12.5%'), slotL('0deg', '12.5%', '25%')], R2) }),
  { pal: 58 }
);

add(
  'Cutfield',
  'A block of ruled ground, crossed with a second field on a much wider pitch.',
  (c) => ({
    rule: turned(c, [slotL('90deg', '6%', '11%'), slotL('90deg', '26%', '38%')], R2),
  }),
  { pal: 77 }
);

export const sectionS = { title: 'S. Intersect', all };
