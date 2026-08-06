// T. Moulding — the profile drawn at line weight: arcs, beads, and members.
//
// Section A puts solid masses in the corner; this section draws with a thin
// line instead. A quarter-arc band turning through a corner, an S of two
// opposed arcs, a bar with a half-round nose — classical moulding profiles,
// each a narrow band rather than a filled shape. Radial bands do the curves,
// linear bands the fillets, and the two members that need independent boxes
// (pediment and its rule, panel and its flanks) take pseudo-elements.
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
  slotL,
  tiled,
  across,
  R2,
  R4,
} from './shared.mjs';

const { add, all } = section('T. Moulding');

const turned = (c, decls, turns = R4) =>
  `--rot: ${turns}; ${F} { ${decls} ${rot('@var(--rot)')} }${TR}`;

add(
  'Intrados',
  'One quarter-arc band turning through the corner — the underside of the arch.',
  (c) => ({ rule: turned(c, faded(c, bandFS('56%', '72%', '0% 0%'))) }),
  { pal: 60 }
);

add(
  'Extrados',
  'The arch read twice: a thin inner ring under a heavier outer one.',
  (c) => ({
    rule: turned(c, faded(c, bandFS('62%', '68%', '0% 0%'), bandFS('78%', '92%', '0% 0%'))),
  }),
  { pal: 26 }
);

add(
  'Cyma',
  'The ogee: two opposed quarter-arcs meeting in an S across the cell.',
  (c) => ({
    rule: turned(c, faded(c, bandFS('40%', '56%', '25% 0%'), bandFS('40%', '56%', '75% 100%')), R2),
  }),
  { pal: 45 }
);

add(
  'Easing',
  'Two arcs nested corner to opposite corner, easing one line into another.',
  (c) => ({
    rule: turned(c, faded(c, bandFS('52%', '66%', '0% 0%'), bandFS('52%', '66%', '100% 100%'))),
  }),
  { pal: 74 }
);

add(
  'Curtail',
  'The stair’s first step: a curl of line over the straight floor member.',
  (c) => ({
    rule: turned(c, faded(c, bandFS('50%', '66%', '0% 0%'), bandLin('180deg', '84%', '96%'))),
  }),
  { pal: 32 }
);

add(
  'Bullnose',
  'A flat member finished with a half-round nose.',
  (c) => ({
    rule: turned(c, faded(c, bandLin('180deg', '36%', '64%'), discL('14%', '82% 50%')), R2),
  }),
  { pal: 48 }
);

add(
  'Echinus',
  'The cushion under the slab: a curved band swelling to carry a flat one.',
  (c) => ({
    rule: turned(c, faded(c, slabLin('180deg', '18%'), bandFS('34%', '52%', '50% 0%'))),
  }),
  { pal: 65 }
);

add(
  'Guttae',
  'A member with its row of pegs hung underneath.',
  (c) => ({
    rule: turned(
      c,
      faded(
        c,
        bandLin('180deg', '30%', '44%'),
        discL('7%', '15% 56%'),
        discL('7%', '38% 56%'),
        discL('7%', '62% 56%'),
        discL('7%', '85% 56%')
      )
    ),
  }),
  { pal: 39 }
);

add(
  'Triglyph',
  'Three short channels grouped as one block of the frieze.',
  (c) => ({
    rule: turned(
      c,
      `${A(
        `left: 14%; right: 14%; top: 26%; bottom: 26%; background: ${ink(c)}; ${msk(
          slotL('90deg', '18%', '41%')
        )}`
      )}`,
      R2
    ),
  }),
  { pal: 7 }
);

add(
  'Metope',
  'The plain panel between triglyphs, flanked by its two thin rules.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { ${B(`inset: 24%; background: ${ink(c)};`)} ${A(
      `inset: 0; background: ${ink(c)}; ${msk(bandLin('90deg', '4%', '10%'), bandLin('90deg', '90%', '96%'))}`
    )} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 54 }
);

add(
  'Tympanum',
  'The shallow pediment triangle over its horizontal cornice.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(
      `inset: 0; background: ${ink(c)}; ${cp(poly([[8, 62], [50, 16], [92, 62]]))}`
    )} ${A(`${across('68%', '8%', ink(c), '2%')}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 16 }
);

add(
  'Entasis',
  'A column with the swell turned into its middle.',
  (c) => ({
    rule: turned(
      c,
      `background: ${ink(c)}; ${cp(poly([[40, 0], [60, 0], [66, 50], [60, 100], [40, 100], [34, 50]]))}`,
      R2
    ),
  }),
  { pal: 20 }
);

add(
  'Flute',
  'The shaft read by its flutes: a bounded column of fine channels.',
  (c) => ({
    rule: turned(
      c,
      `${A(
        `left: 28%; right: 28%; top: 0; bottom: 0; background: ${ink(c)}; ${msk(slotL('90deg', '11%', '22%'))}`
      )}`,
      R2
    ),
  }),
  { pal: 70 }
);

add(
  'Beadcourse',
  'A course of beads carried above the architrave band.',
  (c) => ({
    rule: turned(
      c,
      faded(
        c,
        bandLin('180deg', '62%', '78%'),
        tiled('radial-gradient(circle at 50% 34%, #000 13%, transparent 13%)', '25%', '100%')
      ),
      R2
    ),
  }),
  { pal: 4 }
);

add(
  'Crepidoma',
  'The temple’s stepped base: three courses, each lighter than the one below.',
  (c) => ({
    rule: turned(
      c,
      faded(c, slabLin('0deg', '14%'), bandLin('0deg', '20%', '30%'), bandLin('0deg', '36%', '42%'))
    ),
  }),
  { pal: 62 }
);

export const sectionT = { title: 'T. Moulding', all };
