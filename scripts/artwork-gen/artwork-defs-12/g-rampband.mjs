// G. Rampband — ramps that repeat, and ramps cut into steps.
//
// `repeating-linear-gradient` is one ramp stated once and tiled, which is how
// a whole field of soft bands costs the same as a single fade. The converter
// maps it to `spreadMethod="repeat"` over the first→last stop run, so the tile
// is the browser's own rather than a copy of it drawn N times.
//
// The other half of the section posterizes instead: `stepFade()` writes a fall
// as a handful of flat translucent levels, every stop pair sitting at the same
// position. It is a hard-stop gradient that reads as a ramp, and it is the one
// place in the batch where the *amount* of ink is quantised rather than the
// geometry.
import {
  section,
  A,
  B,
  F,
  TR,
  ink,
  rot,
  msk,
  rampL,
  softRampL,
  stepFade,
  fade,
  faded,
  both,
  c1,
  R2,
  R4,
} from './shared.mjs';

const { add, all } = section('G. Rampband');

const banded = (c, layer, turns = R4) =>
  `--rot: ${turns}; ${F} { ${faded(c, layer)} ${rot('@var(--rot)')} }${TR}`;

add(
  'Rampband',
  'Bands that start hard and fall away, one after another all the way down.',
  (c) => ({ rule: banded(c, rampL('180deg', '4%', '12%')) }),
  { pal: 4 }
);

add(
  'Stepramp',
  'A single fall cut into six flat levels, so the fade is counted rather than smooth.',
  (c) => ({ rule: banded(c, stepFade('180deg', 6)) }),
  { pal: 28 }
);

add(
  'Rampfield',
  'The same band on a wide pitch: a broad stripe, a long fall, bare ground, repeat.',
  (c) => ({ rule: banded(c, rampL('90deg', '8%', '26%'), R2) }),
  { pal: 46 }
);

add(
  'Triramp',
  'Three inks, each let down by its own ramp running a different way.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${c1}; ${B(`inset: 0; background: var(--color2); ${msk(rampL('90deg', '5%', '20%'))}`)} ${A(`inset: 0; background: ${ink(c, 3)}; ${msk(rampL('180deg', '5%', '20%'))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 13 }
);

add(
  'Longramp',
  'Two long falls to a cell, each taking half of it.',
  (c) => ({ rule: banded(c, rampL('180deg', '6%', '50%')) }),
  { pal: 58 }
);

add(
  'Softbands',
  'Bands with no hard edge at either end — they swell and go, and swell again.',
  (c) => ({ rule: banded(c, softRampL('180deg', '6%', '12%')) }),
  { pal: 72 }
);

add(
  'Rampstack',
  'A stack of falling bands, the stack itself falling away across the cell.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${both(c, rampL('180deg', '4%', '14%'), fade('90deg', '0%', '100%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 37 }
);

add(
  'Gradband',
  'Soft uprights on a wide pitch, more shadow than stripe.',
  (c) => ({ rule: banded(c, softRampL('90deg', '9%', '20%'), R2) }),
  { pal: 19 }
);

add(
  'Rampweave',
  'Soft bands both ways at once, so the cell reads as woven where they cross.',
  (c) => ({
    rule: `${F} { ${both(c, softRampL('0deg', '6%', '16%'), softRampL('90deg', '6%', '16%'))} }${TR}`,
  }),
  { pal: 53 }
);

add(
  'Gradpair',
  'Two inks banded on the same pitch, each one falling into the gap the other leaves.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { background: ${c1}; ${B(`inset: 0; background: var(--color2); ${msk(rampL('180deg', '4%', '18%'))}`)} ${A(`inset: 0; background: ${ink(c, 3)}; ${msk('repeating-linear-gradient(180deg, transparent 0 9%, #000 9% 13%, transparent 18%)')}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 69 }
);

add(
  'Blendline',
  'Soft rules on the diagonal, stepped down in weight as they cross the cell.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { ${both(c, softRampL('45deg', '5%', '15%'), stepFade('135deg', 5))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 32 }
);

export const sectionG = { title: 'G. Rampband', all };
