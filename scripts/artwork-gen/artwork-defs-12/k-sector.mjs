// K. Sector — hard-stop conic pies and fans.
//
// A conic-gradient is the one gradient this batch may not use smoothly: SVG
// has no angular primitive, and a span between two different colours is a
// smooth sweep the converter refuses outright. Written as hard stops — every
// colour change with both stops at the same angle — it is a set of pie sectors
// instead, and those export as ordinary paths.
//
// So the whole section is sectors: one, two, a fan of them, with the apex bored
// out or left solid, centred or hung off a corner. Abutting sector paths get a
// hair of angular overlap in the converter, because adjacent anti-aliased edges
// otherwise leave seams CSS does not have.
import {
  section,
  A,
  B,
  F,
  TR,
  ink,
  rot,
  msk,
  mskI,
  pieL,
  arcSector,
  bandL,
  faded,
  c1,
  R2,
  R4,
} from './shared.mjs';

const { add, all } = section('K. Sector');

const sector = (c, decl, turns = R4) =>
  `--rot: ${turns}; ${F} { ${decl} ${rot('@var(--rot)')} }${TR}`;

add(
  'Piecut',
  'A single sector of a full circle, a little under a third of the turn.',
  (c) => ({ rule: sector(c, faded(c, pieL('104deg'))) }),
  { pal: 5 }
);

add(
  'Fanslice',
  'Three narrow blades from the middle, evenly spaced round the turn.',
  (c) => ({
    rule: sector(
      c,
      faded(
        c,
        'conic-gradient(from 0deg at 50% 50%, #000 0 34deg, transparent 34deg 120deg, #000 120deg 154deg, transparent 154deg 240deg, #000 240deg 274deg, transparent 274deg 360deg)'
      )
    ),
  }),
  { pal: 28 }
);

add(
  'Sectorpair',
  'Two sectors facing each other across the centre, in two inks.',
  (c) => ({
    // Both sectors go on pseudo-elements: a mask on the cell clips its own
    // children, and the second sector — which does not overlap the first —
    // would be masked away to nothing.
    rule: sector(
      c,
      `${B(`inset: 0; background: ${c1}; ${msk(pieL('82deg', { from: '318deg' }))}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${msk(pieL('82deg', { from: '138deg' }))}`)}`
    ),
  }),
  { pal: 49 }
);

add(
  'Quartercut',
  'A quarter of the circle exactly, so the two straight sides run with the cell.',
  (c) => ({ rule: sector(c, faded(c, pieL('90deg'))) }),
  { pal: 79 }
);

add(
  'Arcfan',
  'A wide sector with its apex bored out — an arc band rather than a pie.',
  (c) => ({ rule: sector(c, `background: ${ink(c)}; ${arcSector('136deg', '42%')}`) }),
  { pal: 8 }
);

add(
  'Slicecut',
  'A thin blade, narrow enough to read as a line drawn from the centre.',
  (c) => ({ rule: sector(c, faded(c, pieL('26deg', { from: '345deg' }))) }),
  { pal: 31 }
);

add(
  'Pieband',
  'A half turn taken out of a ring, so what is left is a band bent round.',
  (c) => ({
    rule: sector(c, `background: ${ink(c)}; ${mskI(bandL('34%', '92%'), pieL('180deg'))}`),
  }),
  { pal: 55 }
);

add(
  'Fanstack',
  'Six blades round the turn, close enough that the gaps read as the drawing.',
  (c) => ({
    rule: sector(
      c,
      faded(
        c,
        'conic-gradient(from 0deg at 50% 50%, #000 0 22deg, transparent 22deg 60deg, #000 60deg 82deg, transparent 82deg 120deg, #000 120deg 142deg, transparent 142deg 180deg, #000 180deg 202deg, transparent 202deg 240deg, #000 240deg 262deg, transparent 262deg 300deg, #000 300deg 322deg, transparent 322deg 360deg)'
      ),
      R2
    ),
  }),
  { pal: 72 }
);

add(
  'Piepair',
  'Two sectors of different sizes sharing an apex on the corner of the cell.',
  (c) => ({
    // An apex on the top-left corner only sees a quarter of the turn — 90deg
    // is due right and 180deg due down — so both sectors are measured from
    // there. The upper one starts two degrees inside the lower rather than
    // butted against it: two abutting anti-aliased edges are the one place CSS
    // and a vector renderer disagree, and overlapping them puts a single edge
    // over solid ink instead.
    rule: sector(
      c,
      `${B(`inset: 0; background: ${c1}; ${msk(pieL('62deg', { from: '90deg', at: '0% 0%' }))}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${msk(pieL('30deg', { from: '150deg', at: '0% 0%' }))}`)}`
    ),
  }),
  { pal: 17 }
);

add(
  'Arcpair',
  'Two arc bands at different radii, aimed opposite ways.',
  (c) => ({
    rule: sector(
      c,
      `${B(`inset: 0; background: ${c1}; ${arcSector('120deg', '30%', { from: '30deg' })}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${mskI(pieL('120deg', { from: '210deg' }), bandL('54%', '86%'))}`)}`
    ),
  }),
  { pal: 41 }
);

export const sectionK = { title: 'K. Sector', all };
