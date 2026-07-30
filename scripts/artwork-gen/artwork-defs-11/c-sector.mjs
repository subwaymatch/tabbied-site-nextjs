// C. Sector — hard-stop conic pies.
//
// conic-gradient is the only thing in CSS that sweeps a value round an angle,
// and it is also the one gradient SVG has no primitive for. The distinction
// that matters is *hard stop* versus sweep: a span whose two ends are the same
// colour is a sector, and the converter emits it as a path; a span whose ends
// differ is a smooth angular blend, and the converter refuses it. Four designs
// in the catalogue are marked "no SVG export" for exactly that reason.
//
// Every conic here is a hard stop, used as a mask, so the part that is not the
// sector is a genuine hole rather than a fill in the background colour. What
// separates one design from the next is where the apex sits, how wide the
// sector opens, how many of them there are, and whether the middle is bored
// out.
//
// One CSS constraint shapes the code: mask-composite takes one value for the
// whole layer list, so a *union* of sectors and a *cut* through them cannot
// live in one declaration. The union goes on a pseudo-element and the cut on
// the cell that holds it — which is also what the converter does internally,
// nesting one <mask> inside another.
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
  pie1,
  pieL,
  arcSector,
  discL,
  boreL,
  bandL,
  R4,
  R8,
  c1,
} from './shared.mjs';

const { add, all } = section('C. Sector');

/** `n` sectors of `deg`, evenly spaced round the circle. */
const fanLayers = (n, deg, { at = '50% 50%', from = 0 } = {}) =>
  Array.from({ length: n }, (_, i) =>
    pieL(`${deg}deg`, { from: `${from + (360 * i) / n}deg`, at })
  );

/** A union of mask layers, then cut by one more shape a level up. */
const fanCut = (c, layers, cut) =>
  `${msk(cut)} ${A(`inset: 0; background: ${ink(c)}; ${msk(...layers)}`)}`;

add(
  'Rayset',
  'Three broad rays from the middle of the cell, evenly spaced round the turn.',
  (c) => ({
    rule: `--rot: ${R8}; ${F} { background: ${ink(c)}; ${msk(...fanLayers(3, 44))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 0 }
);

add(
  'Beamspread',
  'One wide beam thrown from the middle of an edge, opening to nearly a half-circle.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${pie1('104deg', { from: '308deg', at: '50% 100%' })} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 20 }
);

add(
  'Searchlight',
  'A narrow cone from one corner, reaching all the way across the cell.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${pie1('26deg', { from: '22deg', at: '0% 100%' })} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 56 }
);

add(
  'Coneset',
  'Two cones opening from the same point in opposite directions, so the cell reads as an hourglass.',
  (c) => ({
    rule: `--rot: ${R8}; ${F} { background: ${ink(c)}; ${msk(pieL('50deg', { from: '335deg' }), pieL('50deg', { from: '155deg' }))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 4 }
);

add(
  'Slicepair',
  'Two sectors of unequal width, each in its own ink, sharing an apex.',
  (c) => ({
    rule: `--rot: ${R8}; ${F} { ${B(`inset: 0; background: ${c1}; ${pie1('74deg', { from: '0deg' })}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${pie1('38deg', { from: '140deg' })}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 12 }
);

add(
  'Doublefan',
  'Four sectors at the quarters, wide enough that the gaps between them read as a cross.',
  (c) => ({
    rule: `--rot: ${R8}; ${F} { background: ${ink(c)}; ${msk(...fanLayers(4, 58, { from: 16 }))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 33 }
);

add(
  'Sunspoke',
  'Six spokes from the centre, each about a third of its own segment.',
  (c) => ({
    rule: `--rot: ${R8}; ${F} { background: ${ink(c)}; ${msk(...fanLayers(6, 22))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 57 }
);

add(
  'Spokeset',
  'Eight fine spokes, close enough to read as a wheel rather than as separate rays.',
  (c) => ({
    rule: `--rot: ${R8}; ${F} { background: ${ink(c)}; ${msk(...fanLayers(8, 14))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 21 }
);

add(
  'Fanblade',
  'A single sector with its apex bored out, so the blade starts away from the hub.',
  (c) => ({
    rule: `--rot: ${R8}; ${F} { background: ${ink(c)}; ${arcSector('72deg', '22%')} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 39 }
);

add(
  'Bladeset',
  'Three blades round a bored hub, each one an annular sector.',
  (c) => ({
    rule: `--rot: ${R8}; ${F} { ${fanCut(c, fanLayers(3, 54), boreL('26%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 62 }
);

add(
  'Vaneset',
  'Vanes round a hub, cut off short of the rim so the wheel keeps a clear edge.',
  (c) => ({
    rule: `--rot: ${R8}; ${F} { ${fanCut(c, fanLayers(5, 34), bandL('20%', '48%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 48 }
);

add(
  'Turbinate',
  'The apex is off the centre, so the sectors are all the same angle but none of them the same size.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${msk(...fanLayers(4, 40, { at: '32% 68%' }))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 9 }
);

add(
  'Shutterfan',
  'A fan cut to a disc: the rays stop at the rim rather than running out to the corners.',
  (c) => ({
    rule: `--rot: ${R8}; ${F} { ${fanCut(c, fanLayers(6, 30), discL('48%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 25 }
);

add(
  'Irisfan',
  'Five broad blades round a small bore, the way an iris looks when it is nearly shut.',
  (c) => ({
    rule: `--rot: ${R8}; ${F} { ${fanCut(c, fanLayers(5, 58), bandL('12%', '46%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 15 }
);

add(
  'Clockface',
  'Twelve marks round a bored centre, one for every hour.',
  (c) => ({
    rule: `${F} { ${fanCut(c, fanLayers(12, 7), bandL('34%', '48%'))} }${TR}`,
  }),
  { pal: 51 }
);

add(
  'Sweephand',
  'One very narrow sector, long enough to read as a hand rather than a wedge.',
  (c) => ({
    rule: `--rot: ${R8}; ${F} { background: ${ink(c)}; ${mskI(pieL('9deg'), boreL('8%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 47 }
);

add(
  'Dialface',
  'A ring with one sector filled inside it, so the ring reads as a scale and the sector as a reading.',
  (c) => ({
    rule: `--rot: ${R8}; ${F} { ${B(`inset: 0; background: ${c1}; ${msk(bandL('40%', '50%'))}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${mskI(pieL('96deg'), discL('34%'))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 44 }
);

add(
  'Protractor',
  'A half circle with the middle bored out — a sector taken all the way to 180 degrees.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${arcSector('180deg', '36%')} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 59 }
);

add(
  'Compassrose',
  'Four long points at the cardinals and four short ones between them.',
  (c) => ({
    rule: `${F} { ${B(`inset: 0; background: ${c1}; ${msk(...fanLayers(4, 16, { from: -8 }))}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${msk(discL('30%'))}`)} }${TR}`,
  }),
  { pal: 11 }
);

add(
  'Sectorpair',
  'One sector inside another: a narrow ray of one ink sitting in a broad fan of the next.',
  (c) => ({
    rule: `--rot: ${R8}; ${F} { ${B(`inset: 0; background: ${c1}; ${pie1('88deg', { from: '0deg' })}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${pie1('30deg', { from: '29deg' })}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 28 }
);

add(
  'Pieface',
  'A whole disc with one sector taken out of it.',
  (c) => ({
    rule: `--rot: ${R8}; ${F} { background: ${ink(c)}; ${mskI(discL('47%'), pieL('286deg'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 36 }
);

add(
  'Cakecut',
  'A sector with a straight channel run through it, so it comes away in two pieces.',
  (c) => ({
    rule: `--rot: ${R8}; ${F} { background: ${ink(c)}; ${mskI(pieL('120deg', { from: '330deg' }), 'linear-gradient(90deg, #000 0 44%, transparent 44% 56%, #000 56% 100%)')} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 66 }
);

add(
  'Wedgepair',
  'Two sectors opening from adjacent corners, meeting somewhere near the middle.',
  (c) => ({
    // `from` is measured clockwise from twelve o'clock, so a sector with its
    // apex in a corner only lands in the cell over one quadrant of the turn:
    // 90-180deg from the top-left, 180-270deg from the top-right.
    rule: `--rot: ${R4}; ${F} { ${B(`inset: 0; background: ${c1}; ${pie1('54deg', { from: '96deg', at: '0% 0%' })}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${pie1('54deg', { from: '186deg', at: '100% 0%' })}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 74 }
);

add(
  'Cornerfan',
  'Three rays from one corner, fanning across the cell like a folded card opening.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${msk(pieL('16deg', { from: '2deg', at: '0% 100%' }), pieL('16deg', { from: '37deg', at: '0% 100%' }), pieL('16deg', { from: '72deg', at: '0% 100%' }))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 18 }
);

add(
  'Apexfan',
  'The apex sits on the top edge and the fan opens downward, held clear of the bottom of the cell.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${fanCut(c, fanLayers(5, 20, { at: '50% 0%', from: 20 }), 'linear-gradient(180deg, #000 0 84%, transparent 84% 100%)')} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 69 }
);

export const sectionC = { title: 'C. Sector', all };
