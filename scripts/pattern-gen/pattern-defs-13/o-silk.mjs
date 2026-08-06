// O. Silk — linear ramps as sheen: where the light lies on the cloth.
//
// Batch 12's falloff section asked where the ink stops; this one asks where
// the *light* sits. The answers are bands of sheen (soft-edged midFades),
// double fades intersected into folds and lenses, and bars whose ends feather
// out instead of stopping. Smooth linear only — every layer is a mask over a
// solid ink, so a reseed morphs and the faded cloth stays see-through at its
// thinnest.
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
  fade,
  rise,
  midFade,
  bandLin,
  slotL,
  across,
  R2,
  R4,
} from './shared.mjs';

const { add, all } = section('O. Silk');

const turned = (c, decls, turns = R4) =>
  `--rot: ${turns}; ${F} { ${decls} ${rot('@var(--rot)')} }${TR}`;

add(
  'Veiling',
  'Two opposed fades intersected, so the cloth is fullest along one seam.',
  (c) => ({
    rule: turned(c, both(c, fade('180deg', '12%', '92%'), fade('0deg', '12%', '92%')), R2),
  }),
  { pal: 62 }
);

add(
  'Charmeuse',
  'One diagonal band of sheen with soft edges both sides.',
  (c) => ({
    rule: turned(c, faded(c, midFade('135deg', '20%', '44%', '56%', '80%')), R2),
  }),
  { pal: 8 }
);

add(
  'Sateen',
  'The light lying broad and high across the weave.',
  (c) => ({
    rule: turned(c, faded(c, midFade('180deg', '0%', '22%', '40%', '80%'))),
  }),
  { pal: 72 }
);

add(
  'Taffeta',
  'Two parallel bands of sheen, the shot colour changing between them.',
  (c) => ({
    rule: turned(
      c,
      faded(c, midFade('90deg', '4%', '18%', '26%', '40%'), midFade('90deg', '52%', '66%', '74%', '88%')),
      R2
    ),
  }),
  { pal: 26 }
);

add(
  'Faille',
  'One hard rib and one soft one, ridge and shadow of the same cord.',
  (c) => ({
    rule: turned(
      c,
      faded(c, bandLin('180deg', '20%', '38%'), midFade('180deg', '50%', '66%', '70%', '86%')),
      R2
    ),
  }),
  { pal: 36 }
);

add(
  'Grosgrain',
  'A wide ribbon whose ends feather out instead of stopping.',
  (c) => ({
    rule: turned(
      c,
      `${B(`${across('30%', '40%', ink(c))} ${msk(midFade('90deg', '0%', '16%', '84%', '100%'))}`)}`,
      R2
    ),
  }),
  { pal: 15 }
);

add(
  'Bengaline',
  'Two ribbons fading in opposite directions, warp against weft.',
  (c) => ({
    rule: turned(
      c,
      `${B(`${across('16%', '26%', ink(c))} ${msk(fade('90deg', '0%', '100%'))}`)} ${A(
        `${across('58%', '26%', ink(c))} ${msk(fade('270deg', '0%', '100%'))}`
      )}`,
      R2
    ),
  }),
  { pal: 45 }
);

add(
  'Habotai',
  'The lightest veil in the section: a ramp that never quite empties.',
  (c) => ({
    rule: turned(c, faded(c, 'linear-gradient(180deg, #000 0%, #00000055 100%)')),
  }),
  { pal: 65 }
);

add(
  'Pongee',
  'Three columns of plain weave, all thinning together toward the head.',
  (c) => ({
    rule: turned(
      c,
      `${B(`inset: 0; background: ${ink(c)}; ${mskI(slotL('90deg', '12%', '33.4%'), fade('0deg', '6%', '94%'))}`)}`
    ),
  }),
  { pal: 30 }
);

add(
  'Shantung',
  'Two diagonal fades crossed into a soft lens.',
  (c) => ({
    rule: turned(c, both(c, fade('135deg', '0%', '85%'), fade('315deg', '0%', '85%')), R2),
  }),
  { pal: 1 }
);

add(
  'Cendal',
  'A sash cut on the bias, fading along its own length.',
  (c) => ({
    rule: turned(
      c,
      `background: ${ink(c)}; ${cp(poly([[0, 78], [78, 0], [100, 0], [100, 22], [22, 100], [0, 100]]))} ${msk(
        fade('45deg', '10%', '96%')
      )}`
    ),
  }),
  { pal: 57 }
);

add(
  'Sarcenet',
  'A soft square of light: two gentle bands agreeing only in the middle.',
  (c) => ({
    rule: turned(
      c,
      both(c, midFade('90deg', '8%', '40%', '60%', '92%'), midFade('180deg', '8%', '40%', '60%', '92%'))
    ),
  }),
  { pal: 16 }
);

add(
  'Samite',
  'A soft central column flanked by two hard gold hairlines.',
  (c) => ({
    rule: turned(
      c,
      faded(
        c,
        midFade('90deg', '30%', '44%', '56%', '70%'),
        bandLin('90deg', '16%', '19%'),
        bandLin('90deg', '81%', '84%')
      ),
      R2
    ),
  }),
  { pal: 59 }
);

add(
  'Dupioni',
  'Both selvedges holding full colour and the middle worn thin.',
  (c) => ({
    rule: turned(c, faded(c, fade('90deg', '0%', '58%'), rise('90deg', '42%', '100%')), R2),
  }),
  { pal: 21 }
);

add(
  'Tussah',
  'Wild silk: a slub line breaking an otherwise even fall.',
  (c) => ({
    rule: turned(
      c,
      faded(
        c,
        'linear-gradient(180deg, #000 0 34%, transparent 34% 42%, #000 42% 46%, #00000088 46% 72%, transparent 96%)'
      )
    ),
  }),
  { pal: 69 }
);

export const sectionO = { title: 'O. Silk', all };
