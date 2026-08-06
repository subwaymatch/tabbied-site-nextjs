// A. Shore — solid round masses anchored to the cell's corners and edges.
//
// The whole section is coastline: a quarter-disc seated in a corner, a dome
// standing off an edge, a slab of land with water cut into it. Everything is a
// hard-stop radial or linear layer used as a mask over one ink, so the water
// is a real hole — set the background slot to transparent and the sheet shows
// through every inlet.
//
// `farthest-side` radials are what keep the geometry honest at the edge: a
// stop at 100% means "one cell side" wherever the centre sits, where the
// default `farthest-corner` would quietly rescale as the centre moved.
import {
  section,
  F,
  TR,
  rot,
  faded,
  both,
  msk,
  mskI,
  discL,
  bandFS,
  boreFS,
  bandLin,
  slabLin,
  pieL,
  R2,
  R4,
} from './shared.mjs';

const { add, all } = section('A. Shore');

/** One ink cut by the layers, turned a quarter at a time. */
const turned = (c, decls, turns = R4) =>
  `--rot: ${turns}; ${F} { ${decls} ${rot('@var(--rot)')} }${TR}`;

/** Ink from one edge up to `to` — a slab of land against that edge. */
const gapLin = (angle, from, to) =>
  `linear-gradient(${angle}, #000 0 ${from}, transparent ${from} ${to}, #000 ${to})`;

add(
  'Headland',
  'One great quarter-disc of land put out from a corner, open water across the rest of the cell.',
  (c) => ({ rule: turned(c, faded(c, discL('86%', '0% 0%'))) }),
  { pal: 6 }
);

add(
  'Islet',
  'A single round mass standing just off one edge, clear water all around it.',
  (c) => ({ rule: turned(c, faded(c, discL('30%', '50% 64%'))) }),
  { pal: 27 }
);

add(
  'Cay',
  'A quarter-disc in the corner and one small outlier along its diagonal.',
  (c) => ({
    rule: turned(c, faded(c, discL('40%', '0% 0%'), discL('11%', '62% 62%'))),
  }),
  { pal: 17 }
);

add(
  'Bight',
  'A slab of shore with one round bay bitten out of its seaward edge.',
  (c) => ({
    rule: turned(
      c,
      both(c, slabLin('180deg', '62%'), boreFS('28%', '50% 62%'))
    ),
  }),
  { pal: 7 }
);

add(
  'Firth',
  'The shore parted by a broad arm of water reaching in from one side.',
  (c) => ({
    rule: turned(
      c,
      both(c, slabLin('180deg', '58%'), gapLin('90deg', '38%', '62%')),
      R2
    ),
  }),
  { pal: 66 }
);

add(
  'Fjord',
  'A deep shore split by one narrow channel running almost the whole way through.',
  (c) => ({
    rule: turned(c, both(c, slabLin('180deg', '80%'), gapLin('90deg', '45%', '55%'))),
  }),
  { pal: 0 }
);

add(
  'Kyle',
  'Two round masses put out from opposite edges, with a narrow strait held open between them.',
  (c) => ({
    rule: turned(c, faded(c, discL('44%', '0% 50%'), discL('44%', '100% 50%')), R2),
  }),
  { pal: 40 }
);

add(
  'Holm',
  'A small island ringed by open water, with the mainland sheet beyond.',
  (c) => ({
    rule: turned(c, faded(c, discL('18%'), boreFS('34%'))),
  }),
  { pal: 26 }
);

add(
  'Motu',
  'A reef ring with one pass broken through it.',
  (c) => ({
    rule: turned(c, both(c, bandFS('52%', '80%'), pieL('302deg', { from: '24deg' }))),
  }),
  { pal: 39 }
);

add(
  'Atollet',
  'A thick ring of reef around a still lagoon, one islet in the middle of it.',
  (c) => ({
    rule: turned(c, faded(c, bandFS('34%', '58%'), discL('11%'))),
  }),
  { pal: 45 }
);

add(
  'Eyot',
  'A river islet held between two straight banks.',
  (c) => ({
    rule: turned(
      c,
      faded(c, slabLin('90deg', '18%'), slabLin('270deg', '18%'), discL('20%')),
      R2
    ),
  }),
  { pal: 58 }
);

add(
  'Strand',
  'The beach as a slab against one edge, with a sandbar lying offshore of it.',
  (c) => ({
    rule: turned(c, faded(c, slabLin('180deg', '30%'), bandLin('180deg', '46%', '58%'))),
  }),
  { pal: 23 }
);

add(
  'Sound',
  'Two facing shores and the wide water held between them.',
  (c) => ({
    rule: turned(c, faded(c, slabLin('90deg', '24%'), slabLin('270deg', '24%')), R2),
  }),
  { pal: 62 }
);

add(
  'Spit',
  'A bar of land curving out from the shore across the water.',
  (c) => ({
    rule: turned(c, faded(c, slabLin('90deg', '20%'), bandFS('58%', '80%', '0% 100%'))),
  }),
  { pal: 76 }
);

add(
  'Tombolo',
  'An island tied back to the mainland by one narrow causeway.',
  (c) => ({
    rule: turned(
      c,
      faded(c, slabLin('180deg', '22%'), bandLin('90deg', '45%', '55%'), discL('19%', '50% 74%'))
    ),
  }),
  { pal: 33 }
);

export const sectionA = { title: 'A. Shore', all };
