// B. Fell — domes and mounds rising off an edge.
//
// Section A anchors its masses to corners; this one stands them on an edge
// and asks what the skyline does: a low swell, a flat-topped butte, a stack of
// boulders, two summits with a saddle worn between them. A `farthest-side`
// radial seated on the edge is the hill, an intersecting slab truncates it,
// and a bore cuts the hollows — all hard stops, all masks, so the sky stays a
// real hole.
import {
  section,
  F,
  TR,
  rot,
  faded,
  both,
  discL,
  boreFS,
  bandLin,
  slabLin,
  dotsL,
  R2,
  R4,
} from './shared.mjs';

const { add, all } = section('B. Fell');

const turned = (c, decls, turns = R4) =>
  `--rot: ${turns}; ${F} { ${decls} ${rot('@var(--rot)')} }${TR}`;

add(
  'Drumlin',
  'One low, wide swell of ground rising off the edge of the cell.',
  (c) => ({ rule: turned(c, faded(c, discL('58%', '50% 100%'))) }),
  { pal: 41 }
);

add(
  'Butte',
  'A steep dome sheared flat across the top.',
  (c) => ({
    rule: turned(c, both(c, discL('64%', '50% 100%'), slabLin('0deg', '76%'))),
  }),
  { pal: 19 }
);

add(
  'Mesa',
  'A broader mass with a wider tabletop, most of its curve cut away.',
  (c) => ({
    rule: turned(c, both(c, discL('78%', '50% 100%'), slabLin('0deg', '54%'))),
  }),
  { pal: 65 }
);

add(
  'Tor',
  'A rounded hill with one loose boulder perched on its crown.',
  (c) => ({
    rule: turned(c, faded(c, discL('44%', '50% 100%'), discL('20%', '50% 52%'))),
  }),
  { pal: 68 }
);

add(
  'Bluff',
  'A half-round face standing straight off one side of the cell.',
  (c) => ({ rule: turned(c, faded(c, discL('66%', '0% 50%')), R2) }),
  { pal: 12 }
);

add(
  'Crag',
  'The summit thrown off centre, so one flank falls steeply and the other runs long.',
  (c) => ({ rule: turned(c, faded(c, discL('70%', '30% 100%'))) }),
  { pal: 30 }
);

add(
  'Cuesta',
  'A wide tilted mass cut flat: a long dip slope on one side, a short scarp on the other.',
  (c) => ({
    rule: turned(c, both(c, discL('86%', '22% 100%'), slabLin('0deg', '62%'))),
  }),
  { pal: 74 }
);

add(
  'Esker',
  'A single long, low ridge lying across the cell near its foot.',
  (c) => ({ rule: turned(c, faded(c, bandLin('180deg', '76%', '90%'))) }),
  { pal: 20 }
);

add(
  'Kame',
  'A small steep mound standing alone on a thin strip of ground.',
  (c) => ({
    rule: turned(c, faded(c, discL('32%', '50% 100%'), slabLin('0deg', '12%'))),
  }),
  { pal: 55 }
);

add(
  'Kettle',
  'A slab of ground with one round hollow melted out of its surface.',
  (c) => ({
    rule: turned(c, both(c, slabLin('0deg', '46%'), boreFS('26%', '50% 100%'))),
  }),
  { pal: 4 }
);

add(
  'Tarn',
  'Two shoulders of fell from opposite corners, a strip of water lying between them.',
  (c) => ({
    rule: turned(
      c,
      faded(c, discL('46%', '0% 100%'), discL('46%', '100% 100%'), bandLin('0deg', '0%', '10%'))
    ),
  }),
  { pal: 16 }
);

add(
  'Scarp',
  'Ground stepped once: a low bench in front of a higher face behind.',
  (c) => ({
    rule: turned(c, faded(c, slabLin('0deg', '28%'), slabLin('90deg', '40%'))),
  }),
  { pal: 71 }
);

add(
  'Scree',
  'A slope of loose stones banked against the foot of the cell.',
  (c) => ({
    rule: turned(c, both(c, dotsL('32%', '12.5%'), slabLin('0deg', '38%'))),
  }),
  { pal: 63 }
);

add(
  'Nunatak',
  'A dark summit breaking through the top of an ice sheet.',
  (c) => ({
    rule: turned(c, faded(c, slabLin('0deg', '40%'), discL('24%', '50% 60%'))),
  }),
  { pal: 2 }
);

add(
  'Saddleback',
  'Two matched summits with the saddle worn down between them.',
  (c) => ({
    rule: turned(c, faded(c, discL('44%', '18% 100%'), discL('44%', '82% 100%'))),
  }),
  { pal: 37 }
);

export const sectionB = { title: 'B. Fell', all };
