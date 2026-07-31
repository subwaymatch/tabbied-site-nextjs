// H. Softedge — shapes whose outline is a ramp rather than a line.
//
// Everywhere else a shape has a boundary: a clip path, a hard stop, the side
// of a box. Here it does not. A bar is a ramp up and a ramp back down, a block
// is two of those crossed, a disc is a radial one — the form is entirely in
// where the ink is strong, and it has no edge you could trace.
//
// This is the effect `filter: blur()` is normally reached for, and the reason
// not to reach for it: a blur exports as an `feGaussianBlur`, which is what
// puts `bokeh` in the caveated tier. Stated as stops, the same softness is an
// ordinary gradient and needs no warning at all. It is not a blur — nothing is
// sampled or spread — but for shapes this simple it is the same drawing.
import {
  section,
  A,
  F,
  TR,
  ink,
  rot,
  msk,
  midFade,
  fade,
  coreGlowL,
  softRampL,
  faded,
  both,
  R2,
  R4,
} from './shared.mjs';

const { add, all } = section('H. Softedge');

const soft = (c, layer, turns = R4) =>
  `--rot: ${turns}; ${F} { ${faded(c, layer)} ${rot('@var(--rot)')} }${TR}`;

add(
  'Softbar',
  'A bar across the middle of the cell with nothing you could call an edge.',
  (c) => ({ rule: soft(c, midFade('180deg', '20%', '36%', '64%', '80%'), R2) }),
  { pal: 1 }
);

add(
  'Softblock',
  'Two soft bars crossed at right angles, which leaves a square with no corners.',
  (c) => ({
    rule: `${F} { ${both(c, midFade('180deg', '12%', '28%', '72%', '88%'), midFade('90deg', '12%', '28%', '72%', '88%'))} }${TR}`,
  }),
  { pal: 26 }
);

add(
  'Softcircle',
  'A disc that is solid most of the way out and then simply stops being there.',
  (c) => ({ rule: `${F} { ${faded(c, coreGlowL('58%', '100%'))} }${TR}` }),
  { pal: 47 }
);

add(
  'Softslab',
  'Nearly the whole cell, softened only where it meets the two edges it reaches.',
  (c) => ({ rule: soft(c, midFade('180deg', '0%', '14%', '86%', '100%'), R2) }),
  { pal: 62 }
);

add(
  'Mistbar',
  'A narrow upright so soft it is nearer a shadow than a mark.',
  (c) => ({ rule: soft(c, midFade('90deg', '28%', '44%', '56%', '72%')) }),
  { pal: 10 }
);

add(
  'Softplate',
  'A rounded plate held inside the cell, its ink falling away down one side.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${A(`inset: 12%; border-radius: 22%; background: ${ink(c)}; ${msk(fade('135deg', '10%', '100%'))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 33 }
);

add(
  'Hazeblock',
  'Three straight edges and a fourth that is not there at all.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${A(`inset: 10%; background: ${ink(c)}; ${msk(fade('180deg', '52%', '100%'))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 51 }
);

add(
  'Blurbar',
  'Three soft bars to a cell, evenly spaced and all of them edgeless.',
  (c) => ({ rule: soft(c, softRampL('180deg', '8%', '33.34%'), R2) }),
  { pal: 65 }
);

add(
  'Softdot',
  'One small soft dot, alone in the middle of the cell.',
  (c) => ({ rule: `${F} { ${faded(c, coreGlowL('18%', '46%'))} }${TR}` }),
  { pal: 7 }
);

add(
  'Softfall',
  'A soft bar that also runs out along its own length.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { ${both(c, midFade('180deg', '24%', '36%', '64%', '76%'), fade('90deg', '0%', '100%'))} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 40 }
);

add(
  'Halflight',
  'Half a cell, with the join between the halves spread over a quarter of it.',
  (c) => ({ rule: soft(c, fade('180deg', '36%', '64%')) }),
  { pal: 75 }
);

export const sectionH = { title: 'H. Softedge', all };
