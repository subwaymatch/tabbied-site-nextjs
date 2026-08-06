// K. Terrace — stepped and notched ground, all clip-path.
//
// Solid land with a profile cut into it: stairs climbing, benches cut into a
// slope, and the family of notches a river can wear — gully, ravine, gorge,
// canyon. Each is one polygon (two flanks take a pseudo-element each where a
// single outline would have to trace its own boundary twice), and the void is
// cut, never painted, so it stays open on a transparent background.
import { section, A, B, F, TR, cp, ink, poly, rot, R2, R4 } from './shared.mjs';

const { add, all } = section('K. Terrace');

const profile = (c, shape, turns = R4) =>
  `--rot: ${turns}; ${F} { background: ${ink(c)}; ${cp(shape)} ${rot('@var(--rot)')} }${TR}`;

add(
  'Stair',
  'Four even treads climbing corner to corner.',
  (c) => ({
    rule: profile(
      c,
      poly([
        [0, 100], [0, 75], [25, 75], [25, 50], [50, 50], [50, 25],
        [75, 25], [75, 0], [100, 0], [100, 100],
      ])
    ),
  }),
  { pal: 20 }
);

add(
  'Bench',
  'One deep step cut into an otherwise sheer face.',
  (c) => ({
    rule: profile(c, poly([[0, 100], [0, 58], [46, 58], [46, 26], [100, 26], [100, 100]])),
  }),
  { pal: 45 }
);

add(
  'Terrace',
  'Three shallow benches worked down the slope.',
  (c) => ({
    rule: profile(
      c,
      poly([
        [0, 100], [0, 72], [33, 72], [33, 50], [66, 50], [66, 28],
        [100, 28], [100, 100],
      ])
    ),
  }),
  { pal: 5 }
);

add(
  'Berm',
  'A low flat-topped bank thrown up from level ground.',
  (c) => ({ rule: profile(c, poly([[0, 100], [16, 58], [84, 58], [100, 100]])) }),
  { pal: 41 }
);

add(
  'Swale',
  'A shallow channel dished out of a low bank.',
  (c) => ({
    rule: profile(
      c,
      poly([[0, 100], [0, 62], [34, 62], [50, 84], [66, 62], [100, 62], [100, 100]])
    ),
  }),
  { pal: 17 }
);

add(
  'Col',
  'High shoulders either side of a worn crossing point.',
  (c) => ({
    rule: profile(
      c,
      poly([[0, 100], [0, 20], [16, 20], [40, 58], [60, 58], [84, 20], [100, 20], [100, 100]])
    ),
  }),
  { pal: 2 }
);

add(
  'Arete',
  'One sharp asymmetric summit, all edge.',
  (c) => ({ rule: profile(c, poly([[0, 100], [42, 8], [58, 30], [100, 100]])) }),
  { pal: 16 }
);

add(
  'Couloir',
  'Two rock flanks with a narrow chute falling between them.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(
      `inset: 0; background: ${ink(c)}; ${cp(poly([[0, 100], [0, 30], [42, 30], [42, 100]]))}`
    )} ${A(
      `inset: 0; background: ${ink(c)}; ${cp(poly([[58, 100], [58, 12], [100, 12], [100, 100]]))}`
    )} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 30 }
);

add(
  'Gully',
  'A V worn up into the sheet from its lower edge.',
  (c) => ({
    rule: profile(
      c,
      poly([[0, 0], [100, 0], [100, 100], [58, 100], [50, 40], [42, 100], [0, 100]])
    ),
  }),
  { pal: 63 }
);

add(
  'Ravine',
  'A deeper, narrower cut, walls drawing in as it falls.',
  (c) => ({
    rule: profile(
      c,
      poly([[0, 0], [40, 0], [48, 86], [56, 0], [100, 0], [100, 100], [0, 100]])
    ),
  }),
  { pal: 71 }
);

add(
  'Gorge',
  'A slot with near-vertical walls, cut almost to the floor.',
  (c) => ({
    rule: profile(
      c,
      poly([[0, 0], [42, 0], [46, 88], [54, 88], [58, 0], [100, 0], [100, 100], [0, 100]])
    ),
  }),
  { pal: 11 }
);

add(
  'Canyon',
  'The walls step back as they rise, bench above bench.',
  (c) => ({
    rule: profile(
      c,
      poly([
        [0, 0], [36, 0], [36, 40], [44, 40], [44, 80], [56, 80],
        [56, 40], [64, 40], [64, 0], [100, 0], [100, 100], [0, 100],
      ])
    ),
  }),
  { pal: 59 }
);

add(
  'Ledge',
  'A sheer face broken by one shelf partway down.',
  (c) => ({
    rule: profile(c, poly([[0, 100], [0, 0], [54, 0], [54, 44], [78, 44], [78, 100]])),
  }),
  { pal: 35 }
);

add(
  'Spur',
  'A blade of high ground running out from one side.',
  (c) => ({ rule: profile(c, poly([[0, 0], [26, 0], [100, 50], [26, 100], [0, 100]]), R2) }),
  { pal: 48 }
);

add(
  'Ridge',
  'A long broken skyline: two summits and the saddle their slopes share.',
  (c) => ({
    rule: profile(c, poly([[0, 100], [22, 44], [46, 64], [72, 18], [100, 100]])),
  }),
  { pal: 26 }
);

export const sectionK = { title: 'K. Terrace', all };
