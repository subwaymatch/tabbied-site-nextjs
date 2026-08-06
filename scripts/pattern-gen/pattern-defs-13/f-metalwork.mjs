// F. Metalwork — turned and spun rounds: rings, lobes, crescents, knurling.
//
// The lathe's vocabulary. Concentric hard-stop radials do the turning,
// intersections cut the knurl and the barber twist into a band, and the
// crescent is a disc with an offset bore taken out of it — every one a mask
// over a single ink, so the waste metal is a real hole.
import {
  section,
  F,
  TR,
  rot,
  faded,
  both,
  msk,
  discL,
  bandFS,
  boreFS,
  bandLin,
  slabLin,
  slotL,
  ringsL,
  dotsL,
  archTileL,
  R2,
  R4,
} from './shared.mjs';

const { add, all } = section('F. Metalwork');

const turned = (c, decls, turns = R4) =>
  `--rot: ${turns}; ${F} { ${decls} ${rot('@var(--rot)')} }${TR}`;

add(
  'Grommet',
  'One bold ring, heavy in the shoulder, punched clean through the middle.',
  (c) => ({ rule: turned(c, faded(c, bandFS('34%', '58%'))) }),
  { pal: 52 }
);

add(
  'Thimble',
  'A solid dome with a thin halo band standing off its crown.',
  (c) => ({
    rule: turned(c, faded(c, discL('44%', '50% 100%'), bandFS('54%', '64%', '50% 100%'))),
  }),
  { pal: 43 }
);

add(
  'Cringle',
  'A stout eye worked into the corner of the cell.',
  (c) => ({ rule: turned(c, faded(c, bandFS('30%', '54%', '0% 0%'))) }),
  { pal: 75 }
);

add(
  'Spool',
  'Two flanges and the barrel wound between them.',
  (c) => ({
    rule: turned(
      c,
      faded(
        c,
        bandLin('180deg', '8%', '20%'),
        bandLin('180deg', '80%', '92%'),
        bandLin('90deg', '42%', '58%')
      ),
      R2
    ),
  }),
  { pal: 7 }
);

add(
  'Skein',
  'Rings wound off centre, each turn a little farther from the last.',
  (c) => ({ rule: turned(c, faded(c, ringsL('5%', '16%', '30% 32%'))) }),
  { pal: 26 }
);

add(
  'Knurl',
  'A broad ring with a fine diagonal grip cut across it.',
  (c) => ({
    rule: turned(c, both(c, bandFS('38%', '70%'), slotL('45deg', '8%', '16%'))),
  }),
  { pal: 0 }
);

add(
  'Capstan',
  'Fine concentric beads turned all the way out from the centre.',
  (c) => ({ rule: turned(c, faded(c, ringsL('4%', '12%'))) }),
  { pal: 54 }
);

add(
  'Gadroon',
  'One row of cast lobes standing along the bottom edge.',
  (c) => ({
    rule: turned(c, both(c, archTileL('48%', '25%', '50%'), slabLin('0deg', '50%'))),
  }),
  { pal: 62 }
);

add(
  'Godron',
  'A barber twist: a straight band with the spiral read as diagonal cuts.',
  (c) => ({
    rule: turned(c, both(c, bandLin('180deg', '34%', '66%'), slotL('45deg', '11%', '22%')), R2),
  }),
  { pal: 16 }
);

add(
  'Lobing',
  'Three lobes beaten up out of one edge.',
  (c) => ({
    rule: turned(
      c,
      faded(c, discL('26%', '16% 100%'), discL('26%', '50% 100%'), discL('26%', '84% 100%'))
    ),
  }),
  { pal: 45 }
);

add(
  'Wrythen',
  'A ring twisted as it was drawn, the spiral cut leaning the other way.',
  (c) => ({
    rule: turned(c, both(c, bandFS('36%', '68%'), slotL('135deg', '12%', '24%'))),
  }),
  { pal: 39 }
);

add(
  'Ormolu',
  'A mounted ring with a gilt stud at each corner of its setting.',
  (c) => ({
    rule: turned(
      c,
      faded(
        c,
        bandFS('30%', '48%'),
        discL('10%', '10% 10%'),
        discL('10%', '90% 10%'),
        discL('10%', '10% 90%'),
        discL('10%', '90% 90%')
      )
    ),
  }),
  { pal: 78 }
);

add(
  'Vermeil',
  'A crescent: one disc with another bored out of it off centre.',
  (c) => ({
    rule: turned(c, both(c, discL('44%', '44% 50%'), boreFS('40%', '64% 50%'))),
  }),
  { pal: 20 }
);

add(
  'Girandole',
  'A centre boss with four drops hung around it.',
  (c) => ({
    rule: turned(
      c,
      faded(
        c,
        discL('18%'),
        discL('9%', '50% 12%'),
        discL('9%', '88% 50%'),
        discL('9%', '50% 88%'),
        discL('9%', '12% 50%')
      )
    ),
  }),
  { pal: 33 }
);

add(
  'Bobble',
  'Four fat studs filling the cell almost shoulder to shoulder.',
  (c) => ({ rule: turned(c, faded(c, dotsL('44%', '50%'))) }),
  { pal: 66 }
);

export const sectionF = { title: 'F. Metalwork', all };
