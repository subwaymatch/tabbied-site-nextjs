// H. Sheer — the dotted grounds of net and lace.
//
// Tiled radial fields: dots, feathered dots, and eyelets, at the pitches the
// sheer fabrics set them. The converter turns each tiled layer into an SVG
// <pattern> holding one tile, so a field of four hundred dots costs one
// gradient however dense the net gets. Where a design wants texture rather
// than a count, two fields at different pitches are simply added and let
// interfere.
import {
  section,
  F,
  TR,
  rot,
  faded,
  both,
  msk,
  dotsL,
  softDotsL,
  eyeletL,
  tiled,
  slotL,
  R2,
  R4,
} from './shared.mjs';

const { add, all } = section('H. Sheer');

const turned = (c, decls, turns = R4) =>
  `--rot: ${turns}; ${F} { ${decls} ${rot('@var(--rot)')} }${TR}`;

add(
  'Bobbinet',
  'A fine, even net of eyelets — the ground a bobbin lace is worked on.',
  (c) => ({ rule: turned(c, faded(c, eyeletL('16%', '28%', '25%'))) }),
  { pal: 51, tg: '3x3' }
);

add(
  'Tulle',
  'The smallest dot on the closest pitch: a veil that reads as a tint.',
  (c) => ({ rule: turned(c, faded(c, dotsL('28%', '12.5%'))) }),
  { pal: 14, tg: '3x3' }
);

add(
  'Marquisette',
  'An open leno grid with a dot caught in every window.',
  (c) => ({
    rule: turned(
      c,
      faded(c, slotL('0deg', '2%', '20%'), slotL('90deg', '2%', '20%'), dotsL('14%', '20%'))
    ),
  }),
  { pal: 9 }
);

add(
  'Maline',
  'Small dots with feathered edges, soft as pressed net.',
  (c) => ({ rule: turned(c, faded(c, softDotsL('8%', '30%', '12.5%'))) }),
  { pal: 44 }
);

add(
  'Ninon',
  'Sparse pin dots on a wide open ground.',
  (c) => ({ rule: turned(c, faded(c, dotsL('10%', '14.3%'))) }),
  { pal: 27 }
);

add(
  'Voile',
  'A soft fine field, every dot melting at the rim.',
  (c) => ({ rule: turned(c, faded(c, softDotsL('10%', '36%', '10%'))) }),
  { pal: 65 }
);

add(
  'Organza',
  'Crisp micro-dots, stiff and exact.',
  (c) => ({ rule: turned(c, faded(c, dotsL('14%', '11.1%'))) }),
  { pal: 18 }
);

add(
  'Chiffon',
  'A looser hand: medium dots feathered wide on a generous pitch.',
  (c) => ({ rule: turned(c, faded(c, softDotsL('12%', '44%', '16.67%'))) }),
  { pal: 36 }
);

add(
  'Georgette',
  'Two dot fields at different pitches laid over each other, so the surface crinkles.',
  (c) => ({
    rule: turned(c, faded(c, dotsL('20%', '25%'), dotsL('8%', '12.5%'))),
  }),
  { pal: 5 }
);

add(
  'Crepeline',
  'Fine eyelets on a close pitch — a gauze of little rings.',
  (c) => ({ rule: turned(c, faded(c, eyeletL('20%', '30%', '12.5%'))) }),
  { pal: 68 }
);

add(
  'Birdseye',
  'A dot set in an eyelet, tile for tile across the field.',
  (c) => ({
    rule: turned(c, faded(c, dotsL('10%', '20%'), eyeletL('18%', '26%', '20%'))),
  }),
  { pal: 49 }
);

add(
  'Nep',
  'Flecks caught in the yarn: dots on a wide, squat pitch, twice as far apart one way as the other.',
  (c) => ({
    rule: turned(
      c,
      faded(c, tiled('radial-gradient(circle at 50% 50%, #000 30%, transparent 30%)', '25%', '12.5%')),
      R2
    ),
  }),
  { pal: 21 }
);

add(
  'Slub',
  'Thick threads broken into dashes where the yarn swells.',
  (c) => ({
    rule: turned(c, both(c, slotL('0deg', '6%', '12.5%'), slotL('90deg', '18%', '25%')), R2),
  }),
  { pal: 74 }
);

add(
  'Noil',
  'Two coarse dot fields out of register, the waste silk showing as moire.',
  (c) => ({
    rule: turned(c, faded(c, dotsL('24%', '20%'), dotsL('12%', '33.34%'))),
  }),
  { pal: 31 }
);

add(
  'Boucle',
  'Coarse loops: big open eyelets on a wide pitch.',
  (c) => ({ rule: turned(c, faded(c, eyeletL('22%', '34%', '25%'))) }),
  { pal: 59 }
);

export const sectionH = { title: 'H. Sheer', all };
