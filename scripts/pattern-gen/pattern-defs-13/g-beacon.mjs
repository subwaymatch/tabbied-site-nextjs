// G. Beacon — hard-stop conic sectors read as thrown light.
//
// A lighthouse keeper's section: beams, flashes, and the characters lights
// are named by. Every sector is a hard-stop conic — SVG has no angular
// gradient, so a smooth sweep is banned, but a sector whose colour changes
// only where two stops share an angle maps exactly. The lints and the sweep
// both hold the section to that.
import {
  section,
  F,
  TR,
  rot,
  faded,
  both,
  msk,
  mskI,
  discL,
  bandFS,
  bandLin,
  slabLin,
  pieL,
  ringsL,
  R2,
  R4,
} from './shared.mjs';

const { add, all } = section('G. Beacon');

const turned = (c, decls, turns = R4) =>
  `--rot: ${turns}; ${F} { ${decls} ${rot('@var(--rot)')} }${TR}`;

add(
  'Pharos',
  'One narrow beam swept out from a bright source at the centre.',
  (c) => ({
    rule: turned(c, faded(c, discL('13%'), pieL('26deg', { from: '337deg' }))),
  }),
  { pal: 0 }
);

add(
  'Lightship',
  'A low lamp riding near the foot of the cell, its beam thrown upward.',
  (c) => ({
    rule: turned(
      c,
      faded(c, discL('10%', '50% 78%'), pieL('40deg', { from: '250deg', at: '50% 78%' }))
    ),
  }),
  { pal: 6 }
);

add(
  'Isophase',
  'Equal light and dark: two matched sectors facing away from each other.',
  (c) => ({
    rule: turned(c, faded(c, pieL('70deg', { from: '10deg' }), pieL('70deg', { from: '190deg' }))),
  }),
  { pal: 30 }
);

add(
  'Occulting',
  'A steady beam interrupted by dark rings — light cut into counted dashes.',
  (c) => ({
    rule: turned(c, both(c, pieL('70deg', { from: '325deg' }), ringsL('9%', '18%'))),
  }),
  { pal: 2 }
);

add(
  'Fixedlight',
  'One wide, steady fan standing up from the sill of the cell.',
  (c) => ({
    rule: turned(c, faded(c, pieL('120deg', { from: '300deg', at: '50% 100%' }))),
  }),
  { pal: 55 }
);

add(
  'Glimmer',
  'A four-point glint: narrow sectors flashing out on both axes.',
  (c) => ({
    rule: turned(
      c,
      faded(
        c,
        pieL('12deg', { from: '354deg' }),
        pieL('12deg', { from: '84deg' }),
        pieL('12deg', { from: '174deg' }),
        pieL('12deg', { from: '264deg' })
      )
    ),
  }),
  { pal: 47 }
);

add(
  'Flicker',
  'An unequal pair: a broad flash one way and a thin stab back the other.',
  (c) => ({
    rule: turned(c, faded(c, pieL('30deg', { from: '340deg' }), pieL('14deg', { from: '152deg' }))),
  }),
  { pal: 34 }
);

add(
  'Luster',
  'A single sheen sector inside a polished outer rim.',
  (c) => ({
    rule: turned(c, faded(c, pieL('64deg', { from: '298deg' }), bandFS('66%', '78%'))),
  }),
  { pal: 63 }
);

add(
  'Gilt',
  'One bright blade fanned out of the corner, stopped short of the far edge.',
  (c) => ({
    rule: turned(c, both(c, pieL('45deg', { from: '92deg', at: '0% 0%' }), discL('88%', '0% 0%'))),
  }),
  { pal: 22 }
);

add(
  'Gilding',
  'Three rays laid out of the corner across the whole cell.',
  (c) => ({
    rule: turned(
      c,
      faded(
        c,
        pieL('16deg', { from: '94deg', at: '0% 0%' }),
        pieL('16deg', { from: '128deg', at: '0% 0%' }),
        pieL('16deg', { from: '162deg', at: '0% 0%' })
      )
    ),
  }),
  { pal: 58 }
);

add(
  'Flambeau',
  'A torch: the flame as a cone of light over its straight staff.',
  (c) => ({
    rule: turned(
      c,
      faded(c, pieL('42deg', { from: '339deg', at: '50% 62%' }), bandLin('90deg', '46%', '54%'))
    ),
  }),
  { pal: 24 }
);

add(
  'Sconce',
  'A half-fan of light thrown up the wall from a bracket on the sill.',
  (c) => ({
    rule: turned(
      c,
      faded(c, pieL('140deg', { from: '290deg', at: '50% 100%' }), slabLin('0deg', '10%'))
    ),
  }),
  { pal: 71 }
);

add(
  'Luminaire',
  'A ring of lamp with four beams let out through it.',
  (c) => ({
    rule: turned(
      c,
      faded(
        c,
        bandFS('26%', '40%'),
        pieL('14deg', { from: '353deg' }),
        pieL('14deg', { from: '83deg' }),
        pieL('14deg', { from: '173deg' }),
        pieL('14deg', { from: '263deg' })
      )
    ),
  }),
  { pal: 10 }
);

add(
  'Clairdelune',
  'A small moon carrying two thin halos.',
  (c) => ({
    rule: turned(
      c,
      faded(
        c,
        discL('15%', '50% 42%'),
        bandFS('24%', '28%', '50% 42%'),
        bandFS('36%', '39%', '50% 42%')
      )
    ),
  }),
  { pal: 8 }
);

add(
  'Mirrorblack',
  'Two fans facing each other from opposite edges, almost meeting.',
  (c) => ({
    rule: turned(
      c,
      faded(
        c,
        pieL('60deg', { from: '60deg', at: '0% 50%' }),
        pieL('60deg', { from: '240deg', at: '100% 50%' })
      ),
      R2
    ),
  }),
  { pal: 4 }
);

export const sectionG = { title: 'G. Beacon', all };
