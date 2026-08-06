// E. Shirting — the stripe as woven cloth knows it.
//
// One repeating-linear-gradient per design, used as a mask over one ink, and
// the whole vocabulary is a weaver's: how wide the stripe, how wide the gap,
// whether the rhythm is even or paired, and whether the edge is crisp or
// brushed soft. A repeating gradient exports as a tiled <linearGradient>, so
// the count of stripes on screen is the count in the file.
//
// The one design with two layers is the open gauze, where warp and weft both
// have to show.
import { section, F, TR, rot, faded, slotL, msk, dotsL, R2, R4 } from './shared.mjs';

const { add, all } = section('E. Shirting');

const turned = (c, decls, turns = R4) =>
  `--rot: ${turns}; ${F} { ${decls} ${rot('@var(--rot)')} }${TR}`;

const rep = (angle, stops) => `repeating-linear-gradient(${angle}, ${stops})`;

add(
  'Serge',
  'The fine, even diagonal a twill weave throws across the cloth.',
  (c) => ({ rule: turned(c, faded(c, slotL('45deg', '6%', '14%')), R2) }),
  { pal: 14 }
);

add(
  'Gabardine',
  'A steeper twill: the same fine rib, raked harder off the vertical.',
  (c) => ({ rule: turned(c, faded(c, slotL('64deg', '5%', '12%')), R2) }),
  { pal: 51 }
);

add(
  'Chambray',
  'Fine threads on a close, even set — a tint with a grain in it.',
  (c) => ({ rule: turned(c, faded(c, slotL('90deg', '4%', '9%')), R2) }),
  { pal: 42 }
);

add(
  'Percale',
  'A crisp, even stripe, ink and ground given equal measure.',
  (c) => ({ rule: turned(c, faded(c, slotL('90deg', '10%', '20%')), R2) }),
  { pal: 9 }
);

add(
  'Muslin',
  'A loose gauze: hairline warp and weft crossing on an open set.',
  (c) => ({
    rule: turned(c, faded(c, slotL('0deg', '3%', '16%'), slotL('90deg', '3%', '16%'))),
  }),
  { pal: 18 }
);

add(
  'Calico',
  'A plain stripe with a sprig of dots dropped into every gap.',
  (c) => ({
    rule: turned(c, faded(c, slotL('90deg', '8%', '25%'), dotsL('12%', '25%')), R2),
  }),
  { pal: 36 }
);

add(
  'Batiste',
  'Hairlines spaced far apart on an airy ground.',
  (c) => ({ rule: turned(c, faded(c, slotL('90deg', '2%', '20%')), R2) }),
  { pal: 48 }
);

add(
  'Cambric',
  'The same hairline laid the other way, on a tighter set.',
  (c) => ({ rule: turned(c, faded(c, slotL('0deg', '2.5%', '14%')), R2) }),
  { pal: 73 }
);

add(
  'Broadcloth',
  'Broad, weighty bands with narrow ground held between them.',
  (c) => ({ rule: turned(c, faded(c, slotL('90deg', '16%', '30%')), R2) }),
  { pal: 25 }
);

add(
  'Drabbet',
  'A coarse paired rhythm: two stripes close together, then a long rest.',
  (c) => ({
    rule: turned(
      c,
      faded(c, rep('90deg', '#000 0 12%, transparent 12% 18%, #000 18% 24%, transparent 24% 40%')),
      R2
    ),
  }),
  { pal: 69 }
);

add(
  'Nankeen',
  'Ticking: a fine pair of rules, then a wide field of ground.',
  (c) => ({
    rule: turned(
      c,
      faded(c, rep('0deg', '#000 0 4%, transparent 4% 8%, #000 8% 12%, transparent 12% 30%')),
      R2
    ),
  }),
  { pal: 79 }
);

add(
  'Fustian',
  'A dense, hard-wearing rib — more ink than ground.',
  (c) => ({ rule: turned(c, faded(c, slotL('90deg', '14%', '22%')), R2) }),
  { pal: 57 }
);

add(
  'Moleskin',
  'Cloth nearly solid, with only a pinstripe of ground surviving the shear.',
  (c) => ({ rule: turned(c, faded(c, slotL('90deg', '21%', '25%')), R2) }),
  { pal: 61 }
);

add(
  'Dungaree',
  'A wide workwear stripe run on the diagonal.',
  (c) => ({ rule: turned(c, faded(c, slotL('45deg', '18%', '36%')), R2) }),
  { pal: 28 }
);

add(
  'Flannelette',
  'A stripe brushed until one edge of it turns soft.',
  (c) => ({
    rule: turned(c, faded(c, rep('90deg', '#000 0 10%, transparent 22% 28%')), R2),
  }),
  { pal: 32 }
);

export const sectionE = { title: 'E. Shirting', all };
