// M. Fade — the one section with smooth gradients in it.
//
// Everywhere else in this batch a gradient is a set of hard stops standing in
// for a shape. Here the blend is the point. Linear and radial gradients export
// faithfully — <linearGradient>/<radialGradient> with the same stops — and
// where a run goes from a colour to transparent the converter subdivides it,
// because CSS interpolates premultiplied alpha and SVG does not. Only *conic*
// blends are impossible, and there are none here.
//
// Every fade is a mask over a solid ink rather than a two-colour gradient in
// the background. That keeps the ink an ordinary background-color — so a
// reseed morphs through the colour rather than snapping to it — and it makes
// the faded part a real hole: set the background slot to transparent and the
// sheet shows through the soft end exactly as it does through the hard one.
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
  discL,
  bandL,
  slotL,
  pieL,
  R2,
  R4,
  R8,
  c1,
} from './shared.mjs';

const { add, all } = section('M. Fade');

/** A straight fade: full ink at `from`, gone by `to`. */
const fade = (angle, from, to) =>
  `linear-gradient(${angle}, #000 ${from}, transparent ${to})`;

/** A round fade, out from the centre or in from the rim. */
const glow = (from, to, at = '50% 50%') =>
  `radial-gradient(circle closest-side at ${at}, #000 ${from}, transparent ${to})`;
const sink = (from, to, at = '50% 50%') =>
  `radial-gradient(circle closest-side at ${at}, transparent ${from}, #000 ${to})`;

/** One ink, faded. */
const faded = (c, layer) => `background: ${ink(c)}; ${msk(layer)}`;

add(
  'Softedge',
  'Solid at one edge of the cell and gone by the other.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${faded(c, fade('180deg', '0%', '100%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 0 }
);

add(
  'Vignette',
  'Full ink in the middle, falling away to nothing before it reaches the corners.',
  (c) => ({ rule: `${F} { ${faded(c, glow('10%', '86%'))} }${TR}` }),
  { pal: 19 }
);

add(
  'Falloff',
  'The fade runs from one corner to the one opposite.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${faded(c, fade('135deg', '0%', '100%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 12 }
);

add(
  'Rolloff',
  'Solid for most of the cell, then rolling off over the last third of it.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${faded(c, fade('180deg', '62%', '100%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 27 }
);

add(
  'Dimmer',
  'A solid ink with a second fading away across it.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${c1}; ${A(`inset: 0; background: ${ink(c, 2)}; ${msk(fade('180deg', '0%', '100%'))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 34 }
);

add(
  'Douse',
  'The reverse vignette: clear in the middle, full ink out at the rim.',
  (c) => ({ rule: `${F} { ${faded(c, sink('16%', '92%'))} }${TR}` }),
  { pal: 46 }
);

add(
  'Fadeout',
  'A band solid down the middle and fading to nothing at both edges.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${faded(c, 'linear-gradient(90deg, transparent 0%, #000 40%, #000 60%, transparent 100%)')} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 55 }
);

add(
  'Fadein',
  'Nothing for the first half of the cell, then the ink coming up over the second.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${faded(c, 'linear-gradient(180deg, transparent 0% 46%, #000 100%)')} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 9 }
);

add(
  'Blushform',
  'A soft round bloom set off to one side rather than in the middle.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${faded(c, glow('0%', '96%', '32% 34%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 41 }
);

add(
  'Flush',
  'A hard-edged band with a soft one fading away from it.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`left: 0; right: 0; top: 30%; height: 12%; background: ${c1};`)} ${A(`left: 0; right: 0; top: 42%; bottom: 0; background: ${ink(c, 2)}; ${msk(fade('180deg', '0%', '100%'))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 21 }
);

add(
  'Tinting',
  'A ruled field that fades out as it crosses the cell.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${c1}; ${A(`inset: 0; background: ${ink(c, 2)}; ${mskI(slotL('90deg', '9%', '18%'), fade('90deg', '0%', '100%'))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 30 }
);

add(
  'Shading',
  'A fade running on the diagonal, over a cell that is otherwise plain.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { ${faded(c, fade('45deg', '10%', '90%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 62 }
);

add(
  'Toning',
  'Two inks fading past each other in opposite directions.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`inset: 0; background: ${c1}; ${msk(fade('180deg', '0%', '90%'))}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${msk(fade('0deg', '0%', '90%'))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 15 }
);

add(
  'Glazing',
  'A dot field with a fade laid over it, so the stipple thins out across the cell.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${mskI('radial-gradient(circle at 50% 50%, #000 34%, transparent 34%) 0 0 / 16.67% 16.67%', fade('180deg', '0%', '100%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 24 }
);

add(
  'Scumble',
  'Rules that fade as they go, dragged across the cell like a dry brush.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${mskI(slotL('0deg', '11%', '20%'), fade('90deg', '6%', '100%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 57 }
);

add(
  'Sfumato',
  'Two soft blooms in different inks, each fading before it reaches the other.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${B(`inset: 0; background: ${c1}; ${msk(glow('0%', '80%', '28% 30%'))}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${msk(glow('0%', '80%', '72% 70%'))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 68 }
);

add(
  'Airbrush',
  'A disc with no edge at all: solid at the middle, gone by the rim.',
  (c) => ({ rule: `${F} { ${faded(c, glow('0%', '54%'))} }${TR}` }),
  { pal: 4 }
);

add(
  'Mistform',
  'Bands that fade into each other rather than meeting at a line.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { ${faded(c, 'repeating-linear-gradient(180deg, #000 0 6%, transparent 22% 33.34%)')} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 51 }
);

add(
  'Hazeform',
  'A hard edge on one side and a fade on the other, so the band has a front and a back.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${faded(c, 'linear-gradient(180deg, transparent 0 34%, #000 34% 42%, transparent 100%)')} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 71 }
);

add(
  'Dusklight',
  'Solid at the top and bottom of the cell and thinnest across the middle.',
  (c) => ({
    rule: `--rot: ${R2}; ${F} { ${faded(c, 'linear-gradient(180deg, #000 0%, transparent 48%, transparent 52%, #000 100%)')} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 39 }
);

add(
  'Gloaming',
  'A ring that fades round its own circumference.',
  (c) => ({
    rule: `--rot: ${R8}; ${F} { background: ${ink(c)}; ${mskI(bandL('30%', '48%'), fade('180deg', '0%', '100%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 50 }
);

add(
  'Umbra',
  'A hard-edged disc with a second, softer one fading out behind it.',
  (c) => ({
    rule: `${F} { ${B(`inset: 0; background: ${c1}; ${msk(glow('4%', '96%'))}`)} ${A(`inset: 0; background: ${ink(c, 2)}; ${msk(discL('26%'))}`)} }${TR}`,
  }),
  { pal: 26 }
);

add(
  'Softwedge',
  'A sector that fades along its length, so it has no outer edge.',
  (c) => ({
    rule: `--rot: ${R8}; ${F} { background: ${ink(c)}; ${mskI(pieL('72deg'), glow('0%', '92%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 65 }
);

add(
  'Softsplit',
  'A straight split with the join blurred out over a third of the cell.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${c1}; ${A(`inset: 0; background: ${ink(c, 2)}; ${msk('linear-gradient(180deg, #000 0 34%, transparent 66% 100%)')}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 43 }
);

add(
  'Meltband',
  'A solid band whose lower edge runs out into nothing.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${faded(c, 'linear-gradient(180deg, transparent 0 14%, #000 14% 46%, transparent 96%)')} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 74 }
);

export const sectionM = { title: 'M. Fade', all };
