// Q. Woolwork — a field crossed with a smooth ramp, named for wool finishing.
//
// Batch 12's stipple section thinned dot fields with straight fades. This one
// widens both halves of the intersection: the field can be dots, rules,
// rings, eyelets, or arches, and the ramp can be radial — a glow, a vignette,
// a sheen — or a fade run at a new angle. `mask-composite: intersect`
// multiplies them, the field setting where wool can be and the ramp how much
// of it survives the finishing.
import {
  section,
  F,
  TR,
  rot,
  both,
  fade,
  rise,
  midFade,
  dotsL,
  softDotsL,
  slotL,
  ringsL,
  eyeletL,
  archTileL,
  R2,
  R4,
} from './shared.mjs';

const { add, all } = section('Q. Woolwork');

const turned = (c, decls, turns = R4) =>
  `--rot: ${turns}; ${F} { ${decls} ${rot('@var(--rot)')} }${TR}`;

const glow = (at, hold, gone) =>
  `radial-gradient(circle farthest-side at ${at}, #000 0 ${hold}, transparent ${gone})`;

add(
  'Carded',
  'Straight rules lit from the middle, combed thin toward every edge.',
  (c) => ({
    rule: turned(c, both(c, slotL('90deg', '7%', '14%'), glow('50% 50%', '28%', '96%')), R2),
  }),
  { pal: 9 }
);

add(
  'Combed',
  'Fine rules surviving only in a band across the middle.',
  (c) => ({
    rule: turned(c, both(c, slotL('90deg', '5%', '10%'), midFade('180deg', '10%', '40%', '60%', '90%')), R2),
  }),
  { pal: 52 }
);

add(
  'Worsted',
  'A hard diagonal twist thinning out from the centre of the cell.',
  (c) => ({
    rule: turned(c, both(c, slotL('45deg', '8%', '16%'), glow('50% 50%', '34%', '94%')), R2),
  }),
  { pal: 13 }
);

add(
  'Woollen',
  'A soft-spun field caught in the light of one corner.',
  (c) => ({
    rule: turned(c, both(c, softDotsL('8%', '40%', '12.5%'), glow('0% 0%', '0%', '96%'))),
  }),
  { pal: 35 }
);

add(
  'Felting',
  'Dots pressed into a diagonal lens: two fades and the field all agreeing.',
  (c) => ({
    rule: turned(c, both(c, dotsL('30%', '12.5%'), fade('135deg', '0%', '88%'), fade('315deg', '0%', '88%')), R2),
  }),
  { pal: 28 }
);

add(
  'Fulling',
  'The cloth beaten dense at the edges, worn open in the middle.',
  (c) => ({
    rule: turned(
      c,
      both(c, dotsL('30%', '10%'), 'radial-gradient(circle farthest-side at 50% 50%, transparent 0 28%, #000 78%)')
    ),
  }),
  { pal: 60 }
);

add(
  'Waulking',
  'Rings wrung out across their own width, full one side and spent the other.',
  (c) => ({
    rule: turned(c, both(c, ringsL('6%', '15%'), fade('90deg', '0%', '100%')), R2),
  }),
  { pal: 77 }
);

add(
  'Napping',
  'An eyelet net raised soft, fading down the length of the cloth.',
  (c) => ({
    rule: turned(c, both(c, eyeletL('18%', '30%', '20%'), fade('180deg', '0%', '100%'))),
  }),
  { pal: 42, tg: '3x3' }
);

add(
  'Teasel',
  'Rows of scallops brushed up from nothing to full pile.',
  (c) => ({
    rule: turned(c, both(c, archTileL('42%', '20%', '20%'), rise('180deg', '0%', '100%'))),
  }),
  { pal: 18 }
);

add(
  'Tentering',
  'The web stretched on its frame, full in the middle and strained thin at both selvedges.',
  (c) => ({
    rule: turned(c, both(c, slotL('90deg', '10%', '20%'), midFade('90deg', '0%', '30%', '70%', '100%')), R2),
  }),
  { pal: 68 }
);

add(
  'Singeing',
  'The nap burned back from one corner, the flame’s reach still visible.',
  (c) => ({
    rule: turned(c, both(c, dotsL('26%', '10%'), fade('45deg', '0%', '62%'))),
  }),
  { pal: 74 }
);

add(
  'Beetling',
  'Flat rules hammered to a sheen that sits in one soft pool.',
  (c) => ({
    rule: turned(c, both(c, slotL('0deg', '9%', '18%'), glow('50% 40%', '20%', '92%')), R2),
  }),
  { pal: 6 }
);

add(
  'Mercerising',
  'Dots given a lustre band on the bias.',
  (c) => ({
    rule: turned(c, both(c, dotsL('26%', '12.5%'), midFade('135deg', '15%', '42%', '58%', '85%')), R2),
  }),
  { pal: 55 }
);

add(
  'Calendering',
  'Hairline rules pressed brighter and brighter toward one edge.',
  (c) => ({
    rule: turned(c, both(c, slotL('0deg', '4%', '9%'), rise('0deg', '10%', '95%'))),
  }),
  { pal: 79 }
);

add(
  'Hank',
  'A wound coil seen off centre, its turns fading across the cell.',
  (c) => ({
    rule: turned(c, both(c, ringsL('7%', '16%', '24% 50%'), fade('90deg', '5%', '100%')), R2),
  }),
  { pal: 27 }
);

export const sectionQ = { title: 'Q. Woolwork', all };
