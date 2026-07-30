// D. Annulus — rings, cut with hard-stop radial gradients.
//
// A radial-gradient whose stops all land on the same position is a set of
// concentric hard edges: transparent to the first radius, ink between two
// radii, transparent again past the second. Used as a mask that is a real
// ring, with a real hole in the middle — set the background slot to
// transparent and you can see the sheet through it.
//
// The converter maps these to <radialGradient> stops one for one, which is why
// every design in this section lands at a flat 0.00% against its live render:
// there is no geometry for a vector renderer to re-derive, only stops.
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
  msk,
  mskI,
  discL,
  bandL,
  bandAt,
  ringsL,
  slotL,
  pieL,
  R4,
  R8,
  c1,
} from './shared.mjs';

const { add, all } = section('D. Annulus');

add(
  'Grommet',
  'One heavy ring with a wide bore, the way a grommet sits in a sheet.',
  (c) => ({ rule: `${F} { background: ${ink(c)}; ${msk(bandL('26%', '48%'))} }${TR}` }),
  { pal: 0 }
);

add(
  'Ferrule',
  'A narrow band right out at the rim, leaving the middle of the cell entirely open.',
  (c) => ({ rule: `${F} { background: ${ink(c)}; ${msk(bandL('42%', '50%'))} }${TR}` }),
  { pal: 22 }
);

add(
  'Collar',
  'A disc with a ring round it in a second ink, held clear by a gap.',
  (c) => ({
    rule: `${F} { ${B(`inset: 0; background: ${c1}; ${msk(discL('26%'))}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${msk(bandL('36%', '48%'))}`)} }${TR}`,
  }),
  { pal: 6 }
);

add(
  'Bandring',
  'A single thin ring, drawn small enough that the cell is mostly air.',
  (c) => ({ rule: `${F} { background: ${ink(c)}; ${msk(bandL('30%', '35%'))} }${TR}` }),
  { pal: 30 }
);

add(
  'Rimband',
  'The ring runs right to the edge of the cell, so it meets its neighbours.',
  (c) => ({ rule: `${F} { background: ${ink(c)}; ${msk(bandL('40%', '100%'))} }${TR}` }),
  { pal: 13 }
);

add(
  'Discring',
  'A full disc and a ring outside it, both in the same ink, with a clear channel between.',
  (c) => ({
    rule: `${F} { background: ${ink(c)}; ${msk(discL('22%'), bandL('34%', '46%'))} }${TR}`,
  }),
  { pal: 41 }
);

add(
  'Areola',
  'Two rings of different weight, close enough together to read as one thick edge.',
  (c) => ({
    rule: `${F} { background: ${ink(c)}; ${msk(bandL('20%', '30%'), bandL('36%', '48%'))} }${TR}`,
  }),
  { pal: 55 }
);

add(
  'Limbus',
  'A ring offset from the middle of the cell, so it crowds one corner.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${msk(bandAt('26%', '38%', '34% 64%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 9 }
);

add(
  'Pupil',
  'A small solid disc sitting inside a wide ring, the two never touching.',
  (c) => ({
    rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${msk(discL('16%'))}`)} ${A(`inset: 0; background: ${ink(c)}; ${msk(bandL('34%', '50%'))}`)} }${TR}`,
  }),
  { pal: 27 }
);

add(
  'Retina',
  'Concentric rings all the way out, evenly spaced, the field never resolving to a centre.',
  (c) => ({ rule: `${F} { background: ${ink(c)}; ${msk(ringsL('7%', '16%'))} }${TR}` }),
  { pal: 20 }
);

add(
  'Circlet',
  'A single hairline ring — the least ink a round shape can be drawn with.',
  (c) => ({ rule: `${F} { background: ${ink(c)}; ${msk(bandL('40%', '45%'))} }${TR}` }),
  { pal: 63 }
);

add(
  'Torc',
  'A ring with a section taken out of it, the two ends left open.',
  (c) => ({
    rule: `--rot: ${R8}; ${F} { background: ${ink(c)}; ${mskI(bandL('28%', '46%'), pieL('292deg'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 46 }
);

add(
  'Bangle',
  'The ring is drawn on the corner rather than the centre, so only an arc of it lands in the cell.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${msk(bandAt('44%', '58%', '0% 0%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 34 }
);

add(
  'Oring',
  'One ring per cell, but the bore changes from cell to cell, so the weight never settles.',
  (c) => ({
    rule: `--bore: @pick(12%, 22%, 32%); ${F} { background: ${ink(c)}; ${msk(bandL('@var(--bore)', '48%'))} }${TR}`,
  }),
  { pal: 52 }
);

add(
  'Bezelring',
  'A ring with notches cut through it at regular intervals, like the knurl on a bezel.',
  (c) => ({
    rule: `--rot: ${R8}; ${F} { background: ${ink(c)}; ${mskI(bandL('32%', '48%'), slotL('90deg', '7%', '14%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 15 }
);

add(
  'Wheelrim',
  'A rim with a cross of spokes reaching out to meet it.',
  (c) => ({
    // The spokes are a clip path rather than four conic layers: mask-composite
    // takes one value for the whole list, so a union of sectors cannot also be
    // cut to a disc in the same declaration.
    rule: `--rot: ${R8}; ${F} { ${B(`inset: 0; background: ${c1}; ${msk(bandL('38%', '48%'))}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${cp(poly([[45, 0], [55, 0], [55, 45], [100, 45], [100, 55], [55, 55], [55, 100], [45, 100], [45, 55], [0, 55], [0, 45], [45, 45]]))} ${msk(discL('44%'))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 39 }
);

add(
  'Tyre',
  'A thick ring with a tread of radial notches cut into its outer half.',
  (c) => ({
    rule: `${F} { ${B(`inset: 0; background: ${c1}; ${msk(bandL('24%', '38%'))}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${mskI(bandL('38%', '50%'), slotL('45deg', '8%', '16%'))}`)} }${TR}`,
  }),
  { pal: 50 }
);

add(
  'Tread',
  'A ring cut by slots at a lean, so the band breaks into a run of blocks.',
  (c) => ({
    rule: `--rot: ${R8}; ${F} { background: ${ink(c)}; ${mskI(bandL('26%', '48%'), slotL('30deg', '9%', '18%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 68 }
);

add(
  'Diskband',
  'A solid disc with a ring lifted out of the middle of it.',
  (c) => ({
    rule: `${F} { background: ${ink(c)}; ${msk(discL('18%'), bandL('28%', '46%'))} }${TR}`,
  }),
  { pal: 4 }
);

add(
  'Platter',
  'A broad disc with a ring drawn just inside its edge in a second ink.',
  (c) => ({
    rule: `${F} { ${B(`inset: 0; background: ${c1}; ${msk(discL('46%'))}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${msk(bandL('32%', '38%'))}`)} }${TR}`,
  }),
  { pal: 58 }
);

add(
  'Coaster',
  'A disc with two rings cut through it, both in the ink of the disc itself.',
  (c) => ({
    rule: `${F} { background: ${ink(c)}; ${mskI(discL('47%'), 'radial-gradient(circle closest-side at 50% 50%, #000 0 20%, transparent 20% 27%, #000 27% 36%, transparent 36% 43%, #000 43%)')} }${TR}`,
  }),
  { pal: 71 }
);

add(
  'Ripplering',
  'Many fine concentric rings, close enough that the eye reads the spacing before the shape.',
  (c) => ({ rule: `${F} { background: ${ink(c)}; ${msk(ringsL('4%', '9%'))} }${TR}` }),
  { pal: 42 }
);

add(
  'Poolring',
  'Three rings expanding outward, each one thinner than the last.',
  (c) => ({
    rule: `${F} { background: ${ink(c)}; ${msk(bandL('12%', '22%'), bandL('29%', '36%'), bandL('43%', '48%'))} }${TR}`,
  }),
  { pal: 26 }
);

add(
  'Tidering',
  'The rings are centred on the bottom edge, so each cell shows a run of arcs rather than circles.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${msk(ringsL('6%', '15%', '50% 100%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 65 }
);

add(
  'Wellring',
  'Rings that crowd together as they go in, so the middle reads as deeper than the edge.',
  (c) => ({
    rule: `${F} { background: ${ink(c)}; ${msk(bandL('8%', '13%'), bandL('19%', '25%'), bandL('32%', '39%'), bandL('46%', '54%'))} }${TR}`,
  }),
  { pal: 76 }
);

export const sectionD = { title: 'D. Annulus', all };
