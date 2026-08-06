// I. Rigging — spars and lines: bars crossing, leaning, and beaded.
//
// A mast is a vertical band, a yard is a horizontal one, a stay is a thin
// band run at an angle, and a block is a disc let into the line — all layers
// in one mask, so a union of members reads as a single dark rig against open
// sky. The one fan of lines (the lazyjacks) is three hairline sectors from a
// point, which is the conic gradient earning its keep at a line weight.
import {
  section,
  F,
  TR,
  rot,
  faded,
  msk,
  discL,
  bandFS,
  bandLin,
  slabLin,
  pieL,
  R2,
  R4,
} from './shared.mjs';

const { add, all } = section('I. Rigging');

const turned = (c, decls, turns = R4) =>
  `--rot: ${turns}; ${F} { ${decls} ${rot('@var(--rot)')} }${TR}`;

add(
  'Yardarm',
  'A mast crossed high by one wide yard.',
  (c) => ({
    rule: turned(c, faded(c, bandLin('90deg', '44%', '56%'), bandLin('180deg', '18%', '30%'))),
  }),
  { pal: 1 }
);

add(
  'Crosstree',
  'The same mast with two spreaders, one close above the other.',
  (c) => ({
    rule: turned(
      c,
      faded(
        c,
        bandLin('90deg', '44%', '56%'),
        bandLin('180deg', '20%', '28%'),
        bandLin('180deg', '38%', '46%')
      )
    ),
  }),
  { pal: 40 }
);

add(
  'Masthead',
  'A bare pole with the truck capping it.',
  (c) => ({
    rule: turned(c, faded(c, bandLin('90deg', '45%', '55%'), discL('13%', '50% 12%'))),
  }),
  { pal: 17 }
);

add(
  'Bowsprit',
  'A spar run out on the diagonal over the hull below.',
  (c) => ({
    rule: turned(c, faded(c, slabLin('0deg', '16%'), bandLin('45deg', '58%', '72%'))),
  }),
  { pal: 23 }
);

add(
  'Jibboom',
  'Two spars run out parallel on the same diagonal.',
  (c) => ({
    rule: turned(c, faded(c, bandLin('45deg', '46%', '56%'), bandLin('45deg', '66%', '76%')), R2),
  }),
  { pal: 62 }
);

add(
  'Halyard',
  'A stout pole with one thin line falling away from it.',
  (c) => ({
    rule: turned(c, faded(c, bandLin('90deg', '30%', '40%'), bandLin('135deg', '58%', '64%'))),
  }),
  { pal: 70 }
);

add(
  'Lanyard',
  'Two deadeyes set apart, with the line drawn taut between them.',
  (c) => ({
    rule: turned(
      c,
      faded(c, discL('14%', '28% 24%'), discL('14%', '72% 76%'), bandLin('135deg', '47%', '53%'))
    ),
  }),
  { pal: 46 }
);

add(
  'Forestay',
  'One clean line run at a lean across the whole cell, and nothing else.',
  (c) => ({ rule: turned(c, faded(c, bandLin('56deg', '46%', '52%'))) }),
  { pal: 77 }
);

add(
  'Backstay',
  'A pair of lines leaning together toward the head.',
  (c) => ({
    rule: turned(c, faded(c, bandLin('45deg', '70%', '76%'), bandLin('135deg', '70%', '76%'))),
  }),
  { pal: 13 }
);

add(
  'Bobstay',
  'A curved line holding a straight one down to the corner.',
  (c) => ({
    rule: turned(c, faded(c, bandFS('66%', '78%', '0% 0%'), bandLin('45deg', '60%', '68%'))),
  }),
  { pal: 35 }
);

add(
  'Martingale',
  'Two lines meeting in a shallow V low in the cell.',
  (c) => ({
    rule: turned(c, faded(c, bandLin('45deg', '26%', '34%'), bandLin('135deg', '26%', '34%'))),
  }),
  { pal: 53 }
);

add(
  'Jackstay',
  'A taut rail with beads seized along its length.',
  (c) => ({
    rule: turned(
      c,
      faded(
        c,
        bandLin('180deg', '47%', '53%'),
        discL('8%', '25% 50%'),
        discL('8%', '50% 50%'),
        discL('8%', '75% 50%')
      ),
      R2
    ),
  }),
  { pal: 28 }
);

add(
  'Lazyjack',
  'Three hairlines falling from one point to the boom below.',
  (c) => ({
    rule: turned(
      c,
      faded(
        c,
        pieL('6deg', { from: '157deg', at: '50% 8%' }),
        pieL('6deg', { from: '177deg', at: '50% 8%' }),
        pieL('6deg', { from: '197deg', at: '50% 8%' }),
        bandLin('0deg', '8%', '18%')
      )
    ),
  }),
  { pal: 67 }
);

add(
  'Outhaul',
  'A line hauled out to a block at its end.',
  (c) => ({
    rule: turned(c, faded(c, bandLin('180deg', '46%', '54%'), discL('15%', '84% 50%')), R2),
  }),
  { pal: 3 }
);

add(
  'Downhaul',
  'The same tackle turned to work downward, block at the foot.',
  (c) => ({
    rule: turned(c, faded(c, bandLin('90deg', '47%', '53%'), discL('15%', '50% 82%'))),
  }),
  { pal: 57 }
);

export const sectionI = { title: 'I. Rigging', all };
