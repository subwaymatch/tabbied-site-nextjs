// D. Scantling — sawn timber: beams, planks, and the joints cut into them.
//
// Bars drawn as hard linear bands composed in a mask, plus the odd clipped
// plank where an end is cut on the skew. The interest is carpentry's: how many
// members, how heavy, and what is notched out where two of them would meet.
// Everything is a mask over one ink except the two designs that need a second
// independent box, which take a pseudo-element each.
import {
  section,
  A,
  B,
  F,
  TR,
  cp,
  ink,
  poly,
  rot,
  faded,
  msk,
  discL,
  bandFS,
  bandLin,
  slabLin,
  down,
  R2,
  R4,
} from './shared.mjs';

const { add, all } = section('D. Scantling');

const turned = (c, decls, turns = R4) =>
  `--rot: ${turns}; ${F} { ${decls} ${rot('@var(--rot)')} }${TR}`;

add(
  'Joist',
  'Three even members set on a common spacing, seen end-on.',
  (c) => ({
    rule: turned(
      c,
      faded(
        c,
        bandLin('90deg', '8%', '24%'),
        bandLin('90deg', '42%', '58%'),
        bandLin('90deg', '76%', '92%')
      ),
      R2
    ),
  }),
  { pal: 13 }
);

add(
  'Purlin',
  'One heavy member carried between two light ones.',
  (c) => ({
    rule: turned(
      c,
      faded(
        c,
        bandLin('180deg', '10%', '18%'),
        bandLin('180deg', '44%', '56%'),
        bandLin('180deg', '82%', '90%')
      ),
      R2
    ),
  }),
  { pal: 67 }
);

add(
  'Scantling',
  'A single stout length leaning across the cell, sawn square at both ends.',
  (c) => ({
    rule: turned(c, `background: ${ink(c)}; ${cp(poly([[10, 88], [68, 8], [92, 24], [34, 100]]))}`),
  }),
  { pal: 38 }
);

add(
  'Skewcut',
  'A plank lying across the cell with both ends cut off the square.',
  (c) => ({
    rule: turned(c, `background: ${ink(c)}; ${cp(poly([[0, 36], [86, 26], [100, 62], [14, 72]]))}`, R2),
  }),
  { pal: 50 }
);

add(
  'Rabbet',
  'A block with a step ploughed out of one corner, ready to take its neighbour.',
  (c) => ({
    rule: turned(
      c,
      `background: ${ink(c)}; ${cp(poly([[16, 16], [52, 16], [52, 52], [84, 52], [84, 84], [16, 84]]))}`
    ),
  }),
  { pal: 31 }
);

add(
  'Rebate',
  'The other half of that joint: a block with the notch taken out of its edge.',
  (c) => ({
    rule: turned(
      c,
      `background: ${ink(c)}; ${cp(poly([[14, 14], [86, 14], [86, 86], [62, 86], [62, 56], [14, 56]]))}`
    ),
  }),
  { pal: 72 }
);

add(
  'Wallplate',
  'A plate run along one edge with two studs dropped from it.',
  (c) => ({
    rule: turned(
      c,
      faded(c, slabLin('180deg', '18%'), bandLin('90deg', '20%', '32%'), bandLin('90deg', '68%', '80%'))
    ),
  }),
  { pal: 22 }
);

add(
  'Treenail',
  'A plank with a wooden peg driven through either side of it.',
  (c) => ({
    rule: turned(
      c,
      faded(c, bandLin('180deg', '40%', '60%'), discL('8%', '30% 20%'), discL('8%', '70% 80%')),
      R2
    ),
  }),
  { pal: 46 }
);

add(
  'Futtock',
  'One curved rib rising from the flat of the keel.',
  (c) => ({
    rule: turned(c, faded(c, bandFS('58%', '76%', '0% 100%'), slabLin('0deg', '14%'))),
  }),
  { pal: 6 }
);

add(
  'Keelson',
  'The spine of the frame with two floors crossing it.',
  (c) => ({
    rule: turned(
      c,
      faded(
        c,
        bandLin('90deg', '44%', '56%'),
        bandLin('180deg', '38%', '48%'),
        bandLin('180deg', '64%', '74%')
      )
    ),
  }),
  { pal: 59 }
);

add(
  'Garboard',
  'The first plank laid against the keel: a slab along the bottom and the spine standing off it.',
  (c) => ({
    rule: turned(c, faded(c, slabLin('0deg', '24%'), bandLin('90deg', '46%', '54%'))),
  }),
  { pal: 1 }
);

add(
  'Doubling',
  'Two uprights side by side, the second trimmed back from both ends.',
  (c) => ({
    rule: turned(
      c,
      `${B(down('24%', '22%', ink(c)))} ${A(down('54%', '22%', ink(c), '14%'))}`,
      R2
    ),
  }),
  { pal: 35 }
);

add(
  'Partners',
  'The framed opening that steadies a mast, with the mast in the middle of it.',
  (c) => ({
    rule: turned(
      c,
      faded(
        c,
        bandLin('90deg', '28%', '36%'),
        bandLin('90deg', '64%', '72%'),
        bandLin('180deg', '28%', '36%'),
        bandLin('180deg', '64%', '72%'),
        discL('11%')
      )
    ),
  }),
  { pal: 11 }
);

add(
  'Shaft',
  'Three close-set flutes reading together as one column.',
  (c) => ({
    rule: turned(
      c,
      faded(
        c,
        bandLin('90deg', '34%', '42%'),
        bandLin('90deg', '46%', '54%'),
        bandLin('90deg', '58%', '66%')
      ),
      R2
    ),
  }),
  { pal: 76 }
);

add(
  'Quoin',
  'Dressed corner blocks stepping down the angle of the wall.',
  (c) => ({
    rule: turned(
      c,
      `background: ${ink(c)}; ${cp(poly([[0, 0], [46, 0], [46, 24], [24, 24], [24, 46], [0, 46]]))}`
    ),
  }),
  { pal: 64 }
);

export const sectionD = { title: 'D. Scantling', all };
