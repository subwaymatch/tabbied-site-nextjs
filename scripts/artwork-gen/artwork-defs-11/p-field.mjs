// P. Field — the cell's place on the sheet decides what it draws.
//
// Everywhere else in this batch a cell is independent: it rolls its ink, picks
// its quarter turn, and knows nothing about its neighbours. Here one parameter
// is a function of @x/@X or @y/@Y instead, so the sheet grades — a disc that
// swells across the page, a sector that opens as it descends, a lattice that
// tightens toward one corner. The frequency slider still thins the field, and
// the ink is still rolled per cell, so what grades is one thing only and
// everything else stays loose.
//
// @calc() resolves at compile time, so what reaches the browser is a plain
// number per cell — no calc() left in the computed style, and nothing extra
// for the converter to evaluate.
import {
  section,
  A,
  B,
  F,
  TR,
  cp,
  ink,
  rot,
  xf,
  msk,
  mskI,
  discL,
  bandL,
  slotL,
  pieL,
  halfL,
  ramp,
  rampDeg,
  rampNum,
  RX,
  RY,
  RD,
  R2,
  R4,
  c1,
} from './shared.mjs';

const { add, all } = section('P. Field');

add(
  'Swellfield',
  'A disc in every cell, growing from a dot on one side of the sheet to a full circle on the other.',
  (c) => ({
    rule: `${F} { background: ${ink(c)}; ${msk(discL(ramp(8, 50, RX)))} }${TR}`,
  }),
  { pal: 0 }
);

add(
  'Openfan',
  'A sector that opens as it goes down the sheet, from a sliver to nearly the whole turn.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${msk(pieL(rampDeg(20, 330, RY)))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 19 }
);

add(
  'Tightening',
  'Rules at an even weight but a closing pitch, so the field densifies downward.',
  (c) => ({
    rule: `${F} { background: ${ink(c)}; ${msk(slotL('90deg', ramp(6, 3, RY), ramp(34, 8, RY)))} }${TR}`,
  }),
  { pal: 12 }
);

add(
  'Leanfield',
  'One ruled field whose angle turns a quarter between one side of the sheet and the other.',
  (c) => ({
    rule: `${F} { background: ${ink(c)}; ${msk(slotL(rampDeg(0, 90, RX), '11%', '24%'))} }${TR}`,
  }),
  { pal: 27 }
);

add(
  'Growring',
  'A ring with a constant outer edge and a bore that opens across the sheet.',
  (c) => ({
    rule: `${F} { background: ${ink(c)}; ${msk(bandL(ramp(4, 42, RX), '48%'))} }${TR}`,
  }),
  { pal: 34 }
);

add(
  'Turnfield',
  'The same wedge in every cell, turning a little further with each step down the sheet.',
  (c) => ({
    rule: `${F} { background: ${ink(c)}; ${cp('polygon(50% 0%, 100% 100%, 0% 100%)')} ${rot(rampDeg(0, 340, RD))} }${TR}`,
  }),
  { pal: 46 }
);

add(
  'Shrinkbox',
  'A square in every cell, held further and further in from the edge as the sheet goes on.',
  (c) => ({
    rule: `${F} { ${A(`inset: ${ramp(2, 40, RD)}; background: ${ink(c)};`)} }${TR}`,
  }),
  { pal: 55 }
);

add(
  'Roundfield',
  'Square at one corner of the sheet and circular at the other, by way of everything between.',
  (c) => ({
    rule: `${F} { ${A(`inset: 8%; background: ${ink(c)}; border-radius: ${ramp(0, 50, RD)};`)} }${TR}`,
  }),
  { pal: 9 }
);

add(
  'Weightfield',
  'One bar per cell, thickening from a hairline to a block across the sheet.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { ${A(`left: 0; right: 0; top: ${ramp(48, 20, RX)}; height: ${ramp(4, 60, RX)}; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 41 }
);

add(
  'Tiltfield',
  'A block in every cell, leaning further off true the further down the sheet it sits.',
  (c) => ({
    rule: `${F} { ${A(`inset: 16%; background: ${ink(c)}; ${xf(`skewX(${rampDeg(0, 36, RY)})`)}`)} }${TR}`,
  }),
  { pal: 21 }
);

add(
  'Sinkfield',
  'A disc of one size, sitting higher in the cell at the top of the sheet and lower at the foot.',
  (c) => ({
    rule: `${F} { background: ${ink(c)}; ${msk(`radial-gradient(circle closest-side at 50% ${ramp(16, 84, RY)}, #000 34%, transparent 34%)`)} }${TR}`,
  }),
  { pal: 30 }
);

add(
  'Fadefield',
  'The same mark throughout, coming up in strength from one corner to the other.',
  (c) => ({
    rule: `${F} { ${A(`inset: 10%; background: ${ink(c)}; border-radius: 50%; opacity: ${rampNum(0.15, 1, RD)};`)} }${TR}`,
  }),
  { pal: 62 }
);

add(
  'Spreadfield',
  'A dot field at a fixed pitch, the dots swelling until they close up.',
  (c) => ({
    rule: `${F} { background: ${ink(c)}; ${msk(`radial-gradient(circle at 50% 50%, #000 ${ramp(8, 50, RY)}, transparent 0) 0 0 / 20% 20%`)} }${TR}`,
  }),
  { pal: 15 }
);

add(
  'Cornerfield',
  'One corner cut off every cell, the cut deepening across the sheet.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp(`polygon(0% 0%, 100% 0%, 100% 100%, ${ramp(0, 96, RX)} 100%)`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 24 }
);

add(
  'Depthfield',
  'A ring whose band thickens as the sheet goes down, from a line to a disc.',
  (c) => ({
    rule: `${F} { background: ${ink(c)}; ${msk(bandL(ramp(44, 0, RY), '50%'))} }${TR}`,
  }),
  { pal: 57 }
);

add(
  'Slantfield',
  'A parallelogram that shears further from upright the further across it sits.',
  (c) => ({
    rule: `${F} { background: ${ink(c)}; ${cp(`polygon(${ramp(0, 52, RX)} 0%, 100% 0%, ${ramp(100, 48, RX)} 100%, 0% 100%)`)} }${TR}`,
  }),
  { pal: 68 }
);

add(
  'Riserfield',
  'A bar rising out of the foot of each cell, taller with every row.',
  (c) => ({
    rule: `${F} { ${A(`left: 18%; right: 18%; bottom: 6%; height: ${ramp(8, 88, RY)}; background: ${ink(c)};`)} }${TR}`,
  }),
  { pal: 4 }
);

add(
  'Widthfield',
  'An upright in every cell, widening column by column until it fills the cell.',
  (c) => ({
    rule: `${F} { ${A(`left: 50%; top: 6%; bottom: 6%; width: ${ramp(6, 90, RX)}; margin-left: ${ramp(-3, -45, RX)}; background: ${ink(c)};`)} }${TR}`,
  }),
  { pal: 51 }
);

add(
  'Diagfield',
  'Two inks: a solid one behind, and a wedge over it that grows along the diagonal.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${c1}; ${A(`inset: 0; background: ${ink(c, 2)}; ${cp(`polygon(0% 0%, ${ramp(4, 100, RD)} 0%, 0% ${ramp(4, 100, RD)})`)}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 71 }
);

add(
  'Splitfield',
  'A straight split in every cell, sliding from one edge to the other across the sheet.',
  (c) => ({
    rule: `${F} { background: ${c1}; ${A(`inset: 0; background: ${ink(c, 2)}; ${msk(halfL('180deg', ramp(6, 94, RX)))}`)} }${TR}`,
  }),
  { pal: 39 }
);

add(
  'Wedgefield',
  'A sector of fixed angle whose apex travels down the cell as the sheet descends.',
  (c) => ({
    rule: `${F} { background: ${ink(c)}; ${msk(pieL('60deg', { from: '240deg', at: `50% ${ramp(4, 96, RY)}` }))} }${TR}`,
  }),
  { pal: 50 }
);

add(
  'Bandfield',
  'A band of constant depth, sitting lower in the cell with every row.',
  (c) => ({
    rule: `${F} { ${A(`left: 0; right: 0; top: ${ramp(2, 74, RY)}; height: 24%; background: ${ink(c)};`)} }${TR}`,
  }),
  { pal: 26 }
);

add(
  'Gridfield',
  'A lattice whose pitch closes up toward one corner of the sheet.',
  (c) => ({
    rule: `${F} { background: ${ink(c)}; ${msk(slotL('0deg', ramp(8, 3, RD), ramp(40, 11, RD)), slotL('90deg', ramp(8, 3, RD), ramp(40, 11, RD)))} }${TR}`,
  }),
  { pal: 65 }
);

add(
  'Arcfield',
  'An arc of fixed thickness that lengthens round its ring as the sheet goes on.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${mskI(bandL('30%', '48%'), pieL(rampDeg(30, 350, RD)))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 43 }
);

add(
  'Scalefield',
  'One shape, scaled from almost nothing to overflowing its cell across the sheet.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${A(`inset: 12%; background: ${ink(c)}; ${cp('polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)')} ${xf(`scale(${rampNum(0.2, 1.5, RX)})`)}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 74 }
);

export const sectionP = { title: 'P. Field', all };
