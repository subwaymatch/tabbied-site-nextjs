// F. Cutfade — a ramp shut inside a cut shape.
//
// clip-path decides the silhouette and the mask decides how much of it is
// there. They are separate steps in the Filter Effects model — children, then
// filter, then clip, then mask — and the converter emits them in that order,
// so a faded triangle is a <clipPath> and a <mask> on the same group rather
// than one shape approximating both.
//
// Drawn as a family this reads as a set of hard-edged marks that are only
// half printed: the profile stays exact wherever the ink reaches, and where it
// does not, the outline stops with it.
import {
  section,
  A,
  F,
  TR,
  cp,
  ink,
  poly,
  rot,
  msk,
  mskI,
  pieL,
  fade,
  rise,
  midFade,
  glowL,
  c1,
  R2,
  R4,
} from './shared.mjs';

const { add, all } = section('F. Cutfade');

/** A cut shape in one ink, faded by a ramp, turned a quarter at a time. */
const cutFade = (c, shape, ramp, turns = R4) =>
  `--rot: ${turns}; ${F} { background: ${ink(c)}; ${cp(shape)} ${msk(ramp)} ${rot('@var(--rot)')} }${TR}`;

add(
  'Fadedwedge',
  'A corner-to-corner triangle, solid at its base and spent by its point.',
  (c) => ({
    rule: cutFade(c, poly([[0, 100], [100, 100], [0, 0]]), fade('0deg', '0%', '100%')),
  }),
  { pal: 2 }
);

add(
  'Softtri',
  'The same triangle with the ramp running square across it instead of along it.',
  (c) => ({
    rule: cutFade(c, poly([[50, 6], [96, 94], [4, 94]]), fade('90deg', '0%', '100%'), R2),
  }),
  { pal: 23 }
);

add(
  'Fadedbar',
  'A bar cut on the slant, thinning towards one end.',
  (c) => ({
    rule: cutFade(
      c,
      poly([[10, 68], [72, 12], [90, 32], [28, 88]]),
      fade('45deg', '0%', '100%')
    ),
  }),
  { pal: 42 }
);

add(
  'Fadedbox',
  'A square held inside the cell with the fall running across its corners.',
  (c) => ({
    rule: cutFade(
      c,
      poly([[16, 16], [84, 16], [84, 84], [16, 84]]),
      fade('135deg', '0%', '100%'),
      R2
    ),
  }),
  { pal: 60 }
);

add(
  'Ghostpoly',
  'A sixteen-sided profile, present only where the ramp has not taken it.',
  (c) => ({
    rule: cutFade(
      c,
      poly([
        [50, 2], [72, 14], [86, 14], [86, 28], [98, 50], [86, 72],
        [86, 86], [72, 86], [50, 98], [28, 86], [14, 86], [14, 72],
        [2, 50], [14, 28], [14, 14], [28, 14],
      ]),
      glowL('100%'),
      R2
    ),
  }),
  { pal: 14 }
);

add(
  'Fadedarc',
  'A sector of a circle, strongest at the rim and gone by the apex.',
  (c) => ({
    // The sector gives the two straight sides; the radial gives the arc and
    // the fade at once — a smooth climb from the apex, then a hard stop at the
    // rim so the fan is cut rather than trailing off into the corners.
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${mskI(pieL('118deg', { from: '211deg' }), 'radial-gradient(circle closest-side at 50% 50%, transparent 10%, #000 88%, transparent 88%)')} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 35 }
);

add(
  'Softchamfer',
  'An octagon, its ink banked against one flat and thinning to the one opposite.',
  (c) => ({
    rule: cutFade(
      c,
      poly([[30, 0], [70, 0], [100, 30], [100, 70], [70, 100], [30, 100], [0, 70], [0, 30]]),
      fade('180deg', '10%', '96%'),
      R2
    ),
  }),
  { pal: 50 }
);

add(
  'Fadedhex',
  'A hexagon lit from its middle, so the flats fade out before the points do.',
  (c) => ({
    rule: cutFade(
      c,
      poly([[25, 3], [75, 3], [100, 50], [75, 97], [25, 97], [0, 50]]),
      glowL('100%'),
      R2
    ),
  }),
  { pal: 64 }
);

add(
  'Fadedkite',
  'A rhombus with the ramp on its long axis.',
  (c) => ({
    rule: cutFade(
      c,
      poly([[50, 0], [88, 50], [50, 100], [12, 50]]),
      midFade('180deg', '0%', '46%', '54%', '100%'),
      R2
    ),
  }),
  { pal: 77 }
);

add(
  'Softnotch',
  'A square with a bite out of one edge, coming up out of nothing.',
  (c) => ({
    rule: cutFade(
      c,
      poly([[8, 8], [92, 8], [92, 92], [62, 92], [62, 60], [38, 60], [38, 92], [8, 92]]),
      rise('0deg', '4%', '92%')
    ),
  }),
  { pal: 17 }
);

add(
  'Blendcut',
  'A flat ink cut across the diagonal, with the upper half fading rather than stopping.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${c1}; ${A(`inset: 0; background: ${ink(c, 2)}; ${cp(poly([[0, 0], [100, 0], [0, 100]]))} ${msk(fade('135deg', '0%', '100%'))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 29 }
);

export const sectionF = { title: 'F. Cutfade', all };
