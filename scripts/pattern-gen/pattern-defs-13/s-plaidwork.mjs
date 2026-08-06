// S. Plaidwork — two hard fields intersected, named for flatweaves.
//
// `mask-composite: intersect` with both layers *periodic*: stripes against
// stripes make checks, diagonals against diagonals make diamonds, rings
// against slots make dashed arcs. The intersection is the weave — where warp
// and weft agree there is cloth, where they do not there is ground — and it
// exports as one <mask> nested in the next, exactly as CSS composited it.
import {
  section,
  F,
  TR,
  rot,
  faded,
  both,
  msk,
  slotL,
  dotsL,
  ringsL,
  bandLin,
  R2,
  R4,
} from './shared.mjs';

const { add, all } = section('S. Plaidwork');

const turned = (c, decls, turns = R4) =>
  `--rot: ${turns}; ${F} { ${decls} ${rot('@var(--rot)')} }${TR}`;

add(
  'Tattersall',
  'The thin overcheck: hairline rules crossing on a wide, open ground.',
  (c) => ({
    rule: turned(c, faded(c, slotL('0deg', '4%', '25%'), slotL('90deg', '4%', '25%'))),
  }),
  { pal: 9 }
);

add(
  'Tartan',
  'A sett of wide and narrow bands crossing in both directions.',
  (c) => ({
    rule: turned(
      c,
      faded(
        c,
        slotL('0deg', '12%', '33.4%'),
        slotL('90deg', '12%', '33.4%'),
        slotL('0deg', '3%', '16.7%'),
        slotL('90deg', '3%', '16.7%')
      )
    ),
  }),
  { pal: 15 }
);

add(
  'Dhurrie',
  'A flat cotton check: squares of cloth where the two stripe fields agree.',
  (c) => ({
    rule: turned(c, both(c, slotL('0deg', '25%', '50%'), slotL('90deg', '25%', '50%'))),
  }),
  { pal: 23 }
);

add(
  'Kersey',
  'A dense diamond lattice, the coarse diagonals crossing close.',
  (c) => ({
    rule: turned(c, both(c, slotL('45deg', '14%', '28%'), slotL('135deg', '14%', '28%'))),
  }),
  { pal: 12 }
);

add(
  'Soumak',
  'The wrapped weft read as columns of diagonal dashes.',
  (c) => ({
    rule: turned(c, both(c, slotL('45deg', '12%', '24%'), slotL('90deg', '16%', '33.4%')), R2),
  }),
  { pal: 67 }
);

add(
  'Cicim',
  'Small diamonds brocaded far apart on open ground.',
  (c) => ({
    rule: turned(c, both(c, slotL('45deg', '8%', '33%'), slotL('135deg', '8%', '33%'))),
  }),
  { pal: 50 }
);

add(
  'Zili',
  'Upright dashes ranked in courses, the float pattern of the weave.',
  (c) => ({
    rule: turned(c, both(c, slotL('90deg', '14%', '28%'), slotL('0deg', '20%', '33.4%')), R2),
  }),
  { pal: 72 }
);

add(
  'Jajim',
  'Warp stripes crossed on the bias, the band broken into steps.',
  (c) => ({
    rule: turned(c, both(c, slotL('90deg', '24%', '40%'), slotL('45deg', '20%', '40%')), R2),
  }),
  { pal: 33 }
);

add(
  'Verneh',
  'A checker turned to the diagonal: diamonds packed corner to corner.',
  (c) => ({
    rule: turned(c, both(c, slotL('45deg', '25%', '50%'), slotL('135deg', '25%', '50%'))),
  }),
  { pal: 1 }
);

add(
  'Gabbeh',
  'The coarsest check in the section: big blocks, few of them.',
  (c) => ({
    rule: turned(c, both(c, slotL('0deg', '33%', '66%'), slotL('90deg', '33%', '66%'))),
  }),
  { pal: 36 }
);

add(
  'Numdah',
  'Felt dots surviving only in the stripes of the underlying field.',
  (c) => ({
    rule: turned(c, both(c, dotsL('38%', '16.7%'), slotL('90deg', '50%', '33.4%')), R2),
  }),
  { pal: 63 }
);

add(
  'Namda',
  'The same felt worked on the bias: dots held in diagonal courses.',
  (c) => ({
    rule: turned(c, both(c, dotsL('36%', '14.3%'), slotL('45deg', '20%', '40%'))),
  }),
  { pal: 41 }
);

add(
  'Kesi',
  'Cut-silk rings woven only where the warp allows, arc by arc.',
  (c) => ({
    rule: turned(c, both(c, ringsL('6%', '15%'), slotL('90deg', '12%', '25%')), R2),
  }),
  { pal: 8 }
);

add(
  'Tiraz',
  'The inscription band: one course of cloth ruled through with fine uprights.',
  (c) => ({
    rule: turned(c, both(c, bandLin('180deg', '36%', '60%'), slotL('90deg', '7%', '14%')), R2),
  }),
  { pal: 56 }
);

add(
  'Lampas',
  'Arcs sprung from the selvedge, dashed by the warp as they rise.',
  (c) => ({
    rule: turned(c, both(c, ringsL('8%', '18%', '50% 100%'), slotL('90deg', '14%', '28%'))),
  }),
  { pal: 28 }
);

export const sectionS = { title: 'S. Plaidwork', all };
