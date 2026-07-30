// O. Mark — assembled marks: things that read as signs rather than patterns.
//
// The rest of the batch fills the cell with a field or a single figure. This
// section builds a *mark*: two or three elements in fixed relation to each
// other, drawn small enough that the cell is mostly clear, so the sheet reads
// as a page of stamps rather than a texture.
//
// The vocabulary is deliberately the same as everywhere else — a bar, a disc,
// an arc, a wedge — because the point is the arrangement rather than the
// primitive. Everything is a solid or a hard-stop mask, so every mark exports
// as a handful of paths.
import {
  section,
  A,
  B,
  F,
  TR,
  cp,
  ink,
  poly,
  ngon,
  star,
  rot,
  msk,
  mskI,
  discL,
  bandL,
  pieL,
  boreL,
  slotL,
  R2,
  R4,
  R8,
  c1,
} from './shared.mjs';

const { add, all } = section('O. Mark');

// A stamp edge: eight square bites out of the top, drawn as one outline.
const PERFORATED = [[0.0, 6], [6.2, 6], [6.2, 0], [12.5, 0], [12.5, 6], [18.8, 6], [18.8, 0], [25.0, 0], [25.0, 6], [31.2, 6], [31.2, 0], [37.5, 0], [37.5, 6], [43.8, 6], [43.8, 0], [50.0, 0], [50.0, 6], [56.2, 6], [56.2, 0], [62.5, 0], [62.5, 6], [68.8, 6], [68.8, 0], [75.0, 0], [75.0, 6], [81.2, 6], [81.2, 0], [87.5, 0], [87.5, 6], [93.8, 6], [93.8, 0], [100.0, 0], [100, 100], [0, 100]];

/** Two elements making one mark, held clear of the cell edge. */
const mark = (first, second, turns = R4) =>
  `--rot: ${turns}; ${F} { ${B(first)} ${A(second)} ${rot('@var(--rot)')} }${TR}`;

add(
  'Glyphmark',
  'An upright with a disc set against its head.',
  (c) => ({
    rule: mark(
      `left: 30%; width: 11%; top: 16%; bottom: 16%; background: ${c1};`,
      `left: 44%; width: 30%; top: 20%; height: 30%; background: ${ink(c, 2)}; border-radius: 50%;`
    ),
  }),
  { pal: 0 }
);

add(
  'Runemark',
  'A stem with two short strokes coming off it at an angle.',
  (c) => ({
    rule: mark(
      `left: 42%; width: 10%; top: 12%; bottom: 12%; background: ${ink(c)};`,
      `left: 22%; right: 22%; top: 30%; height: 34%; background: ${ink(c)}; ${cp(poly([[100, 0], [100, 16], [0, 50], [0, 34]]))}`
    ),
  }),
  { pal: 19 }
);

add(
  'Sigilmark',
  'A ring with a bar struck through it.',
  (c) => ({
    rule: mark(
      `inset: 16%; background: ${c1}; ${msk(bandL('34%', '48%'))}`,
      `left: 8%; right: 8%; top: 45%; height: 10%; background: ${ink(c, 2)};`
    ),
  }),
  { pal: 12 }
);

add(
  'Cipherform',
  'Two short bars and a disc, none of them touching.',
  (c) => ({
    rule: mark(
      `left: 18%; width: 26%; top: 22%; height: 10%; background: ${c1};`,
      `left: 52%; width: 30%; top: 52%; height: 30%; background: ${ink(c, 2)}; border-radius: 50%;`
    ),
  }),
  { pal: 27 }
);

add(
  'Notation',
  'A filled head on a stem, the way a note sits on a stave.',
  (c) => ({
    rule: mark(
      `left: 22%; width: 34%; top: 56%; height: 26%; background: ${c1}; border-radius: 50%; ${rot('-20deg')}`,
      `left: 52%; width: 8%; top: 14%; height: 54%; background: ${ink(c, 2)};`
    ),
  }),
  { pal: 34 }
);

add(
  'Monogram',
  'Two discs of different sizes overlapping, with the smaller cut out of the larger.',
  (c) => ({
    rule: mark(
      `left: 12%; width: 50%; top: 22%; height: 50%; background: ${c1}; ${msk(bandL('34%', '50%'))}`,
      `left: 40%; width: 44%; top: 32%; height: 44%; background: ${ink(c, 2)}; ${msk(bandL('34%', '50%'))}`
    ),
  }),
  { pal: 46 }
);

add(
  'Rebus',
  'A square, a triangle and nothing else — read it how you like.',
  (c) => ({
    rule: mark(
      `left: 14%; width: 32%; top: 18%; height: 32%; background: ${c1};`,
      `left: 48%; width: 38%; top: 46%; height: 38%; background: ${ink(c, 2)}; ${cp(poly([[50, 0], [100, 100], [0, 100]]))}`
    ),
  }),
  { pal: 55 }
);

add(
  'Emblemform',
  'A shield outline with a bar across its top third.',
  (c) => ({
    rule: mark(
      `inset: 12% 20%; background: ${c1}; ${cp(poly([[0, 0], [100, 0], [100, 56], [50, 100], [0, 56]]))}`,
      `left: 20%; right: 20%; top: 30%; height: 12%; background: ${ink(c, 2)};`
    ),
  }),
  { pal: 9 }
);

add(
  'Blazon',
  'A shield divided on the diagonal, one half a second ink.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { ${B(`inset: 10% 18%; background: ${c1}; ${cp(poly([[0, 0], [100, 0], [100, 52], [50, 100], [0, 52]]))}`)} ${A(`inset: 10% 18%; background: ${ink(c, 2)}; ${cp(poly([[0, 0], [100, 0], [50, 100]]))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 41 }
);

add(
  'Hallmark',
  'A small mark in a lozenge surround, the way silver is punched.',
  (c) => ({
    rule: mark(
      `inset: 14%; background: ${c1}; ${cp(poly([[50, 0], [100, 50], [50, 100], [0, 50]]))}`,
      `inset: 36%; background: ${ink(c, 2)}; ${cp(poly(ngon(6, 50, -90)))}`
    ),
  }),
  { pal: 21 }
);

add(
  'Touchmark',
  'A disc with a wedge cut out and a bar beneath it.',
  (c) => ({
    rule: mark(
      `left: 22%; right: 22%; top: 12%; height: 52%; background: ${c1}; ${mskI(discL('48%'), pieL('280deg', { from: '40deg' }))}`,
      `left: 22%; right: 22%; top: 72%; height: 12%; background: ${ink(c, 2)};`
    ),
  }),
  { pal: 30 }
);

add(
  'Makersmark',
  'Three bars of different lengths, stacked and ranged left.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`left: 18%; right: 24%; top: 26%; height: 11%; background: ${c1};`)} ${A(`left: 18%; right: 18%; top: 46%; height: 30%; background: ${ink(c, 2)}; ${msk('linear-gradient(180deg, #000 0 33%, transparent 33% 62%, #000 62% 100%)')}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 62 }
);

add(
  'Assaymark',
  'A ring with a dot in the middle and a tick outside it.',
  (c) => ({
    rule: mark(
      `inset: 18%; background: ${c1}; ${msk(bandL('36%', '48%'), discL('16%'))}`,
      `left: 66%; width: 22%; top: 12%; height: 8%; background: ${ink(c, 2)}; ${rot('-40deg')}`
    ),
  }),
  { pal: 15 }
);

add(
  'Brandmark',
  'Two arcs facing each other across a gap.',
  (c) => ({
    // The arcs are cut with a clip path rather than a second conic mask
    // layer: compositing a conic against a ring leaves a faint hairline in
    // the *live* render where the sector edge crosses the cell, which the
    // vector export correctly does not reproduce.
    rule: mark(
      `inset: 12%; background: ${c1}; ${msk(bandL('26%', '48%'))} ${cp(poly([[0, 0], [42, 0], [42, 100], [0, 100]]))}`,
      `inset: 12%; background: ${ink(c, 2)}; ${msk(bandL('26%', '48%'))} ${cp(poly([[58, 0], [100, 0], [100, 100], [58, 100]]))}`,
      R8
    ),
  }),
  { pal: 24 }
);

add(
  'Stampform',
  'A block with a row of square perforations bitten out of one edge.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${A(`inset: 12%; background: ${ink(c)}; ${cp(poly(PERFORATED))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 57 }
);

add(
  'Sealform',
  'A disc with a band of radial notches round its edge.',
  (c) => ({
    rule: mark(
      `inset: 14%; background: ${c1}; ${msk(discL('34%'))}`,
      `inset: 8%; background: ${ink(c, 2)}; ${mskI(bandL('40%', '50%'), slotL('90deg', '6%', '12%'))}`,
      R8
    ),
  }),
  { pal: 68 }
);

add(
  'Signet',
  'A lozenge inside a ring, the way a signet cuts.',
  (c) => ({
    rule: mark(
      `inset: 10%; background: ${c1}; ${msk(bandL('38%', '50%'))}`,
      `inset: 30%; background: ${ink(c, 2)}; ${cp(poly([[50, 0], [100, 50], [50, 100], [0, 50]]))}`
    ),
  }),
  { pal: 4 }
);

add(
  'Chopmark',
  'A square outline with a second square set on the diagonal inside it.',
  (c) => ({
    rule: mark(
      `inset: 12%; background: ${c1}; ${msk('linear-gradient(90deg, #000 0 12%, transparent 12% 88%, #000 88% 100%)', 'linear-gradient(180deg, #000 0 12%, transparent 12% 88%, #000 88% 100%)')}`,
      `inset: 30%; background: ${ink(c, 2)}; ${rot('45deg')}`,
      R2
    ),
  }),
  { pal: 51 }
);

add(
  'Printersmark',
  'A cross with a ring at its centre and short ticks at the ends.',
  (c) => ({
    rule: `${F} { ${B(`inset: 6%; background: ${c1}; ${cp(poly([[46, 0], [54, 0], [54, 46], [100, 46], [100, 54], [54, 54], [54, 100], [46, 100], [46, 54], [0, 54], [0, 46], [46, 46]]))}`)} ${A(`inset: 26%; background: ${ink(c, 2)}; ${msk(bandL('34%', '48%'))}`)} }${TR}`,
  }),
  { pal: 71 }
);

add(
  'Watermark',
  'A large faint shape with a small solid one over it.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`inset: 8%; background: ${c1}; ${cp(poly(star(5, 50, 21)))} opacity: 0.4;`)} ${A(`left: 40%; width: 20%; top: 40%; height: 20%; background: ${ink(c, 2)}; border-radius: 50%;`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 39 }
);

add(
  'Countermark',
  'Two marks side by side, one the negative of the other.',
  (c) => ({
    rule: mark(
      `left: 8%; width: 38%; top: 26%; height: 38%; background: ${c1}; ${msk(bandL('30%', '50%'))}`,
      `left: 54%; width: 38%; top: 36%; height: 38%; background: ${ink(c, 2)}; ${msk(discL('30%'))}`,
      R2
    ),
  }),
  { pal: 50 }
);

add(
  'Mintmark',
  'A small letterlike figure: a stem, a bowl and a foot.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`left: 26%; width: 10%; top: 16%; bottom: 16%; background: ${c1};`)} ${A(`left: 30%; right: 20%; top: 20%; height: 34%; background: ${ink(c, 2)}; ${msk(bandL('30%', '50%'))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 26 }
);

add(
  'Tallyglyph',
  'A bracket and a dot: two strokes meeting a point.',
  (c) => ({
    rule: mark(
      `left: 24%; width: 34%; top: 18%; bottom: 18%; background: ${c1}; ${msk('linear-gradient(90deg, #000 0 26%, transparent 26% 100%)', 'linear-gradient(180deg, #000 0 16%, transparent 16% 84%, #000 84% 100%)')}`,
      `left: 66%; width: 18%; top: 41%; height: 18%; background: ${ink(c, 2)}; border-radius: 50%;`
    ),
  }),
  { pal: 65 }
);

add(
  'Wardmark',
  'A rectangle with a slot cut in one edge and a bar across the slot.',
  (c) => ({
    rule: mark(
      `inset: 18% 26%; background: ${c1}; ${cp(poly([[0, 0], [100, 0], [100, 100], [66, 100], [66, 46], [34, 46], [34, 100], [0, 100]]))}`,
      `left: 14%; right: 14%; top: 62%; height: 11%; background: ${ink(c, 2)};`
    ),
  }),
  { pal: 43 }
);

add(
  'Punchmark',
  'A bored disc with a straight bite taken out of one side of it.',
  (c) => ({
    // The bite is a clip path, not a third mask layer — a mask edge that
    // crosses the whole cell shows as a hairline in the live render even
    // where nothing is painted.
    rule: `--rot: ${R8}; ${F} { ${A(`inset: 14%; background: ${ink(c)}; ${cp(poly([[18, 0], [100, 0], [100, 100], [18, 100]]))} ${msk(bandL('16%', '50%'))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 74 }
);

export const sectionO = { title: 'O. Mark', all };
