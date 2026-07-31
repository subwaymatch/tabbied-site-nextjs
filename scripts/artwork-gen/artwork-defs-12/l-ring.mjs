// L. Ring — hard-stop radial bands.
//
// A radial-gradient whose stops all land on the same position is a set of
// concentric hard edges: transparent to the first radius, ink between two, and
// transparent again past the second. Used as a mask that is a real ring with a
// real hole in it — set the background slot to transparent and the sheet shows
// through the middle.
//
// The converter maps these to <radialGradient> stops one for one, which is why
// rings land at a flat 0.00% against their live render: there is no geometry
// for a vector renderer to re-derive, only stops.
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
  bandL,
  bandAt,
  ringsL,
  faded,
  c1,
  R4,
} from './shared.mjs';

const { add, all } = section('L. Ring');

const still = (c, decl) => `${F} { ${decl} }${TR}`;
const turned = (c, decl, turns = R4) =>
  `--rot: ${turns}; ${F} { ${decl} ${rot('@var(--rot)')} }${TR}`;

add(
  'Ringpair',
  'Two rings from the same centre with a gap of ground between them.',
  (c) => ({ rule: still(c, faded(c, bandL('30%', '46%'), bandL('66%', '84%'))) }),
  { pal: 6 }
);

add(
  'Ringstack',
  'A thick ring with a thinner one sitting inside it, in two inks.',
  (c) => ({
    // Both rings go on pseudo-elements: a mask on the cell clips its own
    // children, and the inner ring sits in the hole the outer one leaves.
    rule: still(
      c,
      `${B(`inset: 0; background: ${c1}; ${msk(bandL('54%', '92%'))}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${msk(bandL('20%', '38%'))}`)}`
    ),
  }),
  { pal: 29 }
);

add(
  'Hoopset',
  'Four fine hoops on an even spacing, the outermost running past the cell.',
  (c) => ({ rule: still(c, faded(c, ringsL('5%', '24%'))) }),
  { pal: 46 }
);

add(
  'Bandring',
  'One broad band, wide enough that the hole is smaller than the ink round it.',
  (c) => ({ rule: still(c, faded(c, bandL('26%', '96%'))) }),
  { pal: 64 }
);

add(
  'Targetring',
  'A solid centre with a ring standing off it, in the same ink.',
  (c) => ({
    rule: still(
      c,
      faded(
        c,
        'radial-gradient(circle closest-side at 50% 50%, #000 0 44%, transparent 44%)',
        bandL('62%', '84%')
      )
    ),
  }),
  { pal: 11 }
);

add(
  'Ringcut',
  'A ring drawn on the corner of the cell, so only a quarter of it lands inside.',
  (c) => ({ rule: turned(c, faded(c, bandAt('38%', '54%', '0% 0%'))) }),
  { pal: 37 }
);

add(
  'Discring',
  'A disc with a ring cut out of the middle of it, leaving two ink widths.',
  (c) => ({
    rule: still(
      c,
      faded(
        c,
        'radial-gradient(circle closest-side at 50% 50%, #000 0 34%, transparent 34% 56%, #000 56% 84%, transparent 84%)'
      )
    ),
  }),
  { pal: 56 }
);

add(
  'Ringgap',
  'A ring with a wedge missing from one side of it, so it reads as a C.',
  (c) => ({
    // Intersected with the sector rather than painted over: the gap has to be
    // a real hole, or it stops being one the moment the background is clear.
    rule: turned(c, `background: ${ink(c)}; ${mskI(bandL('40%', '86%'), pieL('308deg'))}`),
  }),
  { pal: 20 }
);

add(
  'Ringfield',
  'Rings on a close pitch, run from a point on one edge rather than the centre.',
  (c) => ({ rule: turned(c, faded(c, ringsL('4%', '13%', '50% 100%'))) }),
  { pal: 75 }
);

add(
  'Ringstep',
  'Three rings of increasing weight, each one further out than the last.',
  (c) => ({
    rule: still(
      c,
      faded(
        c,
        'radial-gradient(circle closest-side at 50% 50%, transparent 22%, #000 22% 27%, transparent 27% 48%, #000 48% 58%, transparent 58% 78%, #000 78% 94%, transparent 94%)'
      )
    ),
  }),
  { pal: 42 }
);

export const sectionL = { title: 'L. Ring', all };
