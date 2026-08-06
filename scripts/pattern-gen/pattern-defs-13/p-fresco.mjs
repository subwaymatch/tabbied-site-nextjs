// P. Fresco — the fall of ink quantised into counted levels.
//
// stepFade() writes a linear fall as flat translucent levels; stepGlow() does
// the same on a circle. Both are hard-stop gradients that read as ramps — the
// levels come from the alpha, not from interpolation — and the section works
// them the way a fresco is worked: a day's plaster at a time. Where a field
// (dots, rules, rings) is intersected with a stepped ramp, the thinning
// happens in visible stages rather than sliding.
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
  dotsL,
  slotL,
  ringsL,
  stepFade,
  stepGlow,
  R2,
  R4,
} from './shared.mjs';

const { add, all } = section('P. Fresco');

const turned = (c, decls, turns = R4) =>
  `--rot: ${turns}; ${F} { ${decls} ${rot('@var(--rot)')} }${TR}`;

add(
  'Giornata',
  'A diagonal fall worked in four flat stages — one day’s plaster each.',
  (c) => ({ rule: turned(c, faded(c, stepFade('135deg', 4)), R2) }),
  { pal: 5 }
);

add(
  'Gesso',
  'Six fine levels, close enough to read almost as a smooth ground.',
  (c) => ({ rule: turned(c, faded(c, stepFade('180deg', 6))) }),
  { pal: 73 }
);

add(
  'Secco',
  'Three broad levels stopped short of the far edge, the last coat left off.',
  (c) => ({ rule: turned(c, faded(c, stepFade('90deg', 3, 85)), R2) }),
  { pal: 24 }
);

add(
  'Intonaco',
  'The fresh coat spread from the middle out, thinning in five counted rings.',
  (c) => ({ rule: turned(c, faded(c, stepGlow('50% 50%', 5))) }),
  { pal: 61 }
);

add(
  'Arriccio',
  'The rough coat thrown from a corner, its reach stepped rather than smooth.',
  (c) => ({ rule: turned(c, faded(c, stepGlow('0% 100%', 5))) }),
  { pal: 38 }
);

add(
  'Sinopia',
  'The underdrawing’s red earth, pooled at the foot in four stages.',
  (c) => ({ rule: turned(c, faded(c, stepGlow('50% 100%', 4, 90))) }),
  { pal: 11 }
);

add(
  'Spolvero',
  'Pounce dots thinned across the wall in counted steps.',
  (c) => ({ rule: turned(c, both(c, dotsL('26%', '10%'), stepFade('180deg', 4))) }),
  { pal: 51 }
);

add(
  'Pouncing',
  'The same dots worked outward from the centre, ring by ring.',
  (c) => ({ rule: turned(c, both(c, dotsL('24%', '12.5%'), stepGlow('50% 50%', 4))) }),
  { pal: 2 }
);

add(
  'Sgraffito',
  'Horizontal scratches through a slip laid on in five levels.',
  (c) => ({
    rule: turned(c, both(c, slotL('0deg', '6%', '14%'), stepFade('90deg', 5)), R2),
  }),
  { pal: 20 }
);

add(
  'Mishima',
  'Inlaid rings, their line thinning away in four stages.',
  (c) => ({ rule: turned(c, both(c, ringsL('5%', '14%'), stepFade('90deg', 4))) }),
  { pal: 66 }
);

add(
  'Slipware',
  'Two stepped falls crossed, so the corner shading is counted both ways.',
  (c) => ({ rule: turned(c, both(c, stepFade('90deg', 4), stepFade('180deg', 4))) }),
  { pal: 47 }
);

add(
  'Japanning',
  'A hard lacquer disc inside a halo that dims by steps.',
  (c) => ({
    rule: turned(
      c,
      faded(
        c,
        discL('16%'),
        'radial-gradient(circle farthest-side at 50% 50%, transparent 0 24%, #000000bf 24% 40%, #00000080 40% 56%, #00000040 56% 72%, transparent 72%)'
      )
    ),
  }),
  { pal: 4 }
);

add(
  'Shellac',
  'One deep coat and two quick ones — a fall with a long first level.',
  (c) => ({ rule: turned(c, faded(c, stepFade('180deg', 3, 70))) }),
  { pal: 32 }
);

add(
  'Varnish',
  'Both edges sealed in stepped coats, the middle left bare.',
  (c) => ({
    rule: turned(c, faded(c, stepFade('90deg', 3, 60), stepFade('270deg', 3, 60)), R2),
  }),
  { pal: 70 }
);

add(
  'Basse',
  'Wide columns rising through counted levels of translucent enamel.',
  (c) => ({
    rule: turned(c, both(c, slotL('90deg', '16%', '25%'), stepFade('0deg', 4)), R2),
  }),
  { pal: 43 }
);

export const sectionP = { title: 'P. Fresco', all };
