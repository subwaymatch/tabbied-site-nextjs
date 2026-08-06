// J. Casement — frames, openings, and what surrounds a hole in a wall.
//
// The frame is a union of four edge slabs in one mask; an opening is the
// *complement* — a union of two "everything but this band" layers, which
// leaves a rectangular hole where the bands cross. Both directions keep the
// void real: on a transparent background the sheet shows through every
// window. Where a storey needs two independent parts (wall and window row),
// the design takes a pseudo-element per part, each with its own mask.
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
  both,
  msk,
  mskI,
  discL,
  bandFS,
  boreFS,
  bandLin,
  slabLin,
  slotL,
  archTileL,
  across,
  R2,
  R4,
} from './shared.mjs';

const { add, all } = section('J. Casement');

const turned = (c, decls, turns = R4) =>
  `--rot: ${turns}; ${F} { ${decls} ${rot('@var(--rot)')} }${TR}`;

/** Everything except the strip between `from` and `to` — a wall with a slot. */
const gapLin = (angle, from, to) =>
  `linear-gradient(${angle}, #000 0 ${from}, transparent ${from} ${to}, #000 ${to})`;

add(
  'Casing',
  'A plain frame of even width around an open middle.',
  (c) => ({
    rule: turned(
      c,
      faded(
        c,
        slabLin('0deg', '14%'),
        slabLin('90deg', '14%'),
        slabLin('180deg', '14%'),
        slabLin('270deg', '14%')
      )
    ),
  }),
  { pal: 73 }
);

add(
  'Alcove',
  'The same frame with one side left open.',
  (c) => ({
    rule: turned(
      c,
      faded(c, slabLin('0deg', '14%'), slabLin('90deg', '14%'), slabLin('270deg', '14%'))
    ),
  }),
  { pal: 19 }
);

add(
  'Niche',
  'A round-headed slot sunk through the wall between two piers.',
  (c) => ({
    rule: turned(c, both(c, boreFS('30%', '50% 40%'), gapLin('90deg', '35%', '65%'))),
  }),
  { pal: 42 }
);

add(
  'Apse',
  'A rectangular body with a half-round end swelling off it.',
  (c) => ({
    rule: turned(c, faded(c, slabLin('90deg', '55%'), discL('28%', '55% 50%')), R2),
  }),
  { pal: 60 }
);

add(
  'Clerestory',
  'A solid wall below and a run of window lights punched high above it.',
  (c) => ({
    rule: turned(
      c,
      `${B(across('44%', '56%', ink(c)))} ${A(
        `left: 0; right: 0; top: 10%; height: 24%; background: ${ink(c)}; ${msk(slotL('90deg', '15%', '25%'))}`
      )}`
    ),
  }),
  { pal: 12 }
);

add(
  'Triforium',
  'A gallery of arches carried on the solid storey beneath.',
  (c) => ({
    rule: turned(
      c,
      `${B(across('58%', '42%', ink(c)))} ${A(
        `left: 0; right: 0; top: 14%; height: 36%; background: ${ink(c)}; ${msk(archTileL('44%', '25%', '100%'))}`
      )}`
    ),
  }),
  { pal: 7 }
);

add(
  'Arcading',
  'A row of arches standing on their own thin plinth.',
  (c) => ({
    rule: turned(c, faded(c, archTileL('46%', '25%', '100%'), slabLin('0deg', '10%'))),
  }),
  { pal: 66 }
);

add(
  'Blindstory',
  'A framed wall with a course of blind panels let into it.',
  (c) => ({
    rule: turned(
      c,
      `${B(
        `inset: 0; background: ${ink(c)}; ${msk(
          slabLin('0deg', '12%'),
          slabLin('90deg', '12%'),
          slabLin('180deg', '12%'),
          slabLin('270deg', '12%')
        )}`
      )} ${A(
        `left: 22%; right: 22%; top: 44%; height: 12%; background: ${ink(c)}; ${msk(slotL('90deg', '12%', '22%'))}`
      )}`
    ),
  }),
  { pal: 27 }
);

add(
  'Garret',
  'The gable-end wall with one small light under the peak.',
  (c) => ({
    rule: turned(
      c,
      `background: ${ink(c)}; ${cp(poly([[0, 100], [0, 36], [50, 6], [100, 36], [100, 100]]))} ${msk(
        gapLin('90deg', '40%', '60%'),
        gapLin('180deg', '48%', '72%')
      )}`
    ),
  }),
  { pal: 37 }
);

add(
  'Lucarne',
  'A long roof slope with a small dormer void cut into it.',
  (c) => ({
    rule: turned(
      c,
      `background: ${ink(c)}; ${cp(poly([[0, 100], [0, 55], [100, 10], [100, 100]]))} ${msk(
        gapLin('90deg', '42%', '58%'),
        gapLin('180deg', '48%', '70%')
      )}`
    ),
  }),
  { pal: 49 }
);

add(
  'Belvedere',
  'An open pavilion: two columns, a roof over them, a floor beneath.',
  (c) => ({
    rule: turned(
      c,
      faded(
        c,
        bandLin('90deg', '16%', '28%'),
        bandLin('90deg', '72%', '84%'),
        bandLin('180deg', '10%', '24%'),
        bandLin('0deg', '0%', '12%')
      )
    ),
  }),
  { pal: 31 }
);

add(
  'Plinth',
  'A pedestal built up in three centred steps.',
  (c) => ({
    rule: turned(
      c,
      `background: ${ink(c)}; ${cp(
        poly([
          [0, 100], [0, 86], [12, 86], [12, 68], [28, 68], [28, 48],
          [72, 48], [72, 68], [88, 68], [88, 86], [100, 86], [100, 100],
        ])
      )}`
    ),
  }),
  { pal: 54 }
);

add(
  'Baluster',
  'A knob, a shaft, and the base it stands on.',
  (c) => ({
    rule: turned(
      c,
      faded(c, discL('12%', '50% 20%'), bandLin('90deg', '44%', '56%'), slabLin('0deg', '14%'))
    ),
  }),
  { pal: 25 }
);

add(
  'Handrail',
  'A rail run along the top of its pickets.',
  (c) => ({
    rule: turned(c, faded(c, bandLin('180deg', '12%', '24%'), slotL('90deg', '8%', '25%'))),
  }),
  { pal: 78 }
);

add(
  'Chimney',
  'An offset stack with its cap oversailing the brickwork.',
  (c) => ({
    rule: turned(
      c,
      `${B(`left: 58%; width: 20%; top: 16%; bottom: 0; background: ${ink(c)};`)} ${A(
        `left: 52%; width: 32%; top: 6%; height: 10%; background: ${ink(c)};`
      )}`
    ),
  }),
  { pal: 15 }
);

export const sectionJ = { title: 'J. Casement', all };
