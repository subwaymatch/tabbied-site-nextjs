// O. Lattice — ruled fields crossed with each other.
//
// One `repeating-linear-gradient` is a set of rules. Two of them at right
// angles can be combined two ways, and the two answers are opposites: added,
// the mask keeps everywhere *either* field covers, which leaves a grid of
// lines with square holes; intersected, it keeps only where they agree, which
// leaves the blocks and throws the lines away.
//
// Both export the same way — added layers become sibling mask content,
// intersected ones nest one <mask> inside the next — so the section is really
// about how much of a decision a composite operator is.
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
  faded,
  both,
  c1,
  R2,
  R4,
} from './shared.mjs';

const { add, all } = section('O. Lattice');

const still = (c, decl) => `${F} { ${decl} }${TR}`;
const turned = (c, decl, turns = R4) =>
  `--rot: ${turns}; ${F} { ${decl} ${rot('@var(--rot)')} }${TR}`;

add(
  'Gridlines',
  'Fine rules both ways, so the cell reads as ruled paper.',
  (c) => ({ rule: still(c, faded(c, slotL('0deg', '4%', '20%'), slotL('90deg', '4%', '20%'))) }),
  { pal: 0 }
);

add(
  'Meshfield',
  'The same lattice on a much closer pitch — the holes are the smaller part now.',
  (c) => ({ rule: still(c, faded(c, slotL('0deg', '5%', '10%'), slotL('90deg', '5%', '10%'))) }),
  { pal: 27 }
);

add(
  'Crossrule',
  'Rules on both diagonals rather than square to the cell.',
  (c) => ({
    rule: still(c, faded(c, slotL('45deg', '5%', '22%'), slotL('135deg', '5%', '22%'))),
  }),
  { pal: 48 }
);

add(
  'Latticecut',
  'Only what both fields agree on: the crossings left, the rules taken away.',
  (c) => ({ rule: still(c, both(c, slotL('0deg', '12%', '25%'), slotL('90deg', '12%', '25%'))) }),
  { pal: 62 }
);

add(
  'Gridcut',
  'Wide bars one way, narrow ones the other, and only the blocks where they meet.',
  (c) => ({
    rule: turned(c, both(c, slotL('0deg', '20%', '25%'), slotL('90deg', '8%', '25%')), R2),
  }),
  { pal: 13 }
);

add(
  'Weavecut',
  'Two ruled fields in two inks, laid across each other so they read as woven.',
  (c) => ({
    rule: `${F} { ${B(`inset: 0; background: ${c1}; ${msk(slotL('0deg', '12%', '24%'))}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${msk(slotL('90deg', '12%', '24%'))}`)} }${TR}`,
  }),
  { pal: 36 }
);

add(
  'Crossbars',
  'Rules on three axes sixty degrees apart, so the holes come out triangular.',
  (c) => ({
    rule: still(
      c,
      faded(
        c,
        slotL('0deg', '5%', '20%'),
        slotL('60deg', '5%', '20%'),
        slotL('120deg', '5%', '20%')
      )
    ),
  }),
  { pal: 51 }
);

add(
  'Netfield',
  'A very fine net, at the pitch where the eye stops counting and reads a tone.',
  (c) => ({ rule: still(c, faded(c, slotL('0deg', '3%', '7.7%'), slotL('90deg', '3%', '7.7%'))) }),
  { pal: 66 }
);

add(
  'Gridpair',
  'Blocks from one lattice with the lines of a finer one running over them.',
  (c) => ({
    rule: `${F} { ${B(`inset: 0; background: ${c1}; ${mskI(slotL('0deg', '16%', '33.34%'), slotL('90deg', '16%', '33.34%'))}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${msk(slotL('0deg', '3%', '11.1%'), slotL('90deg', '3%', '11.1%'))}`)} }${TR}`,
  }),
  { pal: 19 }
);

add(
  'Meshcut',
  'A lattice with the pitch different on the two axes, so the holes are oblong.',
  (c) => ({
    rule: turned(c, faded(c, slotL('0deg', '5%', '12.5%'), slotL('90deg', '5%', '25%')), R2),
  }),
  { pal: 74 }
);

export const sectionO = { title: 'O. Lattice', all };
