// C. Roofline — the profiles a pitched roof can take.
//
// One solid mass clipped to a silhouette, the way batch 12's chamfers were —
// but where a chamfer takes a corner off a square, these take a whole skyline
// off the top of it: gable, gambrel, mansard, saltbox, crow steps. clip-path:
// polygon() is the toolkit and it exports as an SVG <clipPath> with the same
// points, so the profile lands exactly where CSS put it.
//
// Two designs step outside the polygon: the arched hood-moulds, which are the
// one profile a polygon cannot draw, and take a hard-stop radial band instead.
import {
  section,
  F,
  TR,
  cp,
  ink,
  poly,
  rot,
  faded,
  msk,
  bandFS,
  discL,
  R2,
  R4,
} from './shared.mjs';

const { add, all } = section('C. Roofline');

/** A solid mass clipped to a profile, turned a quarter at a time. */
const profile = (c, shape, turns = R4) =>
  `--rot: ${turns}; ${F} { background: ${ink(c)}; ${cp(shape)} ${rot('@var(--rot)')} }${TR}`;

const turned = (c, decls, turns = R4) =>
  `--rot: ${turns}; ${F} { ${decls} ${rot('@var(--rot)')} }${TR}`;

add(
  'Monopitch',
  'One unbroken slope from the high side of the cell down to the low one.',
  (c) => ({ rule: profile(c, poly([[0, 100], [100, 100], [100, 58], [0, 18]])) }),
  { pal: 3 }
);

add(
  'Saltbox',
  'A gable with one short pitch and one long one that runs nearly to the ground.',
  (c) => ({
    rule: profile(c, poly([[0, 100], [100, 100], [100, 52], [58, 14], [0, 46]])),
  }),
  { pal: 21 }
);

add(
  'Gambrel',
  'The barn profile: each side of the ridge broken into a shallow pitch and a steep one.',
  (c) => ({
    rule: profile(
      c,
      poly([[0, 100], [100, 100], [100, 58], [82, 26], [50, 12], [18, 26], [0, 58]])
    ),
  }),
  { pal: 8 }
);

add(
  'Mansard',
  'Steep flanks carried up to a flat top, so the mass reads almost as a full storey.',
  (c) => ({
    rule: profile(c, poly([[0, 100], [100, 100], [86, 22], [14, 22]])),
  }),
  { pal: 60 }
);

add(
  'Jerkinhead',
  'A gable with its peak clipped back, leaving a short flat instead of a point.',
  (c) => ({
    rule: profile(
      c,
      poly([[0, 100], [100, 100], [100, 46], [72, 14], [28, 14], [0, 46]])
    ),
  }),
  { pal: 47 }
);

add(
  'Catslide',
  'One pitch swept far past the eaves line, almost to the ground on its own side.',
  (c) => ({
    rule: profile(c, poly([[0, 100], [100, 100], [100, 40], [64, 12], [0, 84]])),
  }),
  { pal: 15 }
);

add(
  'Eaves',
  'A gable carried out well past the walls it sits on.',
  (c) => ({
    rule: profile(
      c,
      poly([[0, 52], [50, 10], [100, 52], [86, 52], [86, 100], [14, 100], [14, 52]])
    ),
  }),
  { pal: 53 }
);

add(
  'Ridgeboard',
  'A single tall, narrow gable — more ridge than roof.',
  (c) => ({ rule: profile(c, poly([[10, 100], [50, 4], [90, 100]])) }),
  { pal: 29 }
);

add(
  'Bargeboard',
  'Only the verge of the gable: an inverted-V band with the roof itself left out.',
  (c) => ({
    rule: profile(
      c,
      poly([[0, 54], [50, 6], [100, 54], [100, 76], [50, 28], [0, 76]])
    ),
  }),
  { pal: 10 }
);

add(
  'Kneeler',
  'A crow-stepped gable, climbing to the ridge one square shoulder at a time.',
  (c) => ({
    rule: profile(
      c,
      poly([
        [0, 100], [0, 62], [18, 62], [18, 42], [36, 42], [36, 22],
        [64, 22], [64, 42], [82, 42], [82, 62], [100, 62], [100, 100],
      ])
    ),
  }),
  { pal: 5 }
);

add(
  'Crocket',
  'One hooked finial leaning off the vertical.',
  (c) => ({
    rule: profile(c, poly([[6, 100], [40, 100], [78, 10], [38, 26]])),
  }),
  { pal: 34 }
);

add(
  'Hoodmould',
  'The arched band thrown over an opening, and nothing else of the wall.',
  (c) => ({
    rule: turned(c, faded(c, bandFS('44%', '62%', '50% 100%'))),
  }),
  { pal: 56 }
);

add(
  'Dripstone',
  'The same arch with a drip stopped at the foot of each side.',
  (c) => ({
    rule: turned(
      c,
      faded(c, bandFS('44%', '60%', '50% 100%'), discL('8%', '10% 84%'), discL('8%', '90% 84%'))
    ),
  }),
  { pal: 70 }
);

add(
  'Larmier',
  'A projecting course: a flat band with its underside bevelled back to the wall.',
  (c) => ({
    rule: profile(
      c,
      poly([[0, 30], [100, 30], [100, 52], [84, 68], [16, 68], [0, 52]]),
      R2
    ),
  }),
  { pal: 44 }
);

add(
  'Cresting',
  'A run of points standing along the ridge line.',
  (c) => ({
    rule: profile(
      c,
      poly([
        [0, 62], [0, 42], [16, 20], [32, 42], [48, 20], [64, 42],
        [80, 20], [96, 42], [100, 42], [100, 62],
      ])
    ),
  }),
  { pal: 24 }
);

export const sectionC = { title: 'C. Roofline', all };
