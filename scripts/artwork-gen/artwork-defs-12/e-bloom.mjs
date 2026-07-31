// E. Bloom — the ramp run outwards from a point instead of across the cell.
//
// A radial-gradient mask is a glow with none of the machinery of one: no
// blur, no shadow, no filter — just stops on a circle. That matters here more
// than anywhere else in the batch, because a glow is exactly the effect the
// catalogue already had four caveated designs for (`bokeh`, `neon`, `lantern`,
// `terrain` all reach for box-shadow or blur and all carry an svgExportNote).
// Written as stops it exports as a <radialGradient> and needs no note at all.
//
// The section runs from a solid disc that only softens at its rim, through
// haloes and vignettes, to fields of concentric soft rings.
import {
  section,
  A,
  F,
  TR,
  ink,
  rot,
  msk,
  glowL,
  coreGlowL,
  vignetteL,
  softBandL,
  ovalGlowL,
  softRingsL,
  faded,
  c1,
  R2,
  R4,
} from './shared.mjs';

const { add, all } = section('E. Bloom');

/** A glow that does not need turning: it is symmetrical about its centre. */
const still = (c, ...layers) => `${F} { ${faded(c, ...layers)} }${TR}`;

/** One that does — anything anchored off the middle of the cell. */
const turned = (c, layer, turns = R4) =>
  `--rot: ${turns}; ${F} { ${faded(c, layer)} ${rot('@var(--rot)')} }${TR}`;

add(
  'Glowdisc',
  'Ink at its strongest in the middle of the cell and gone by the sides.',
  (c) => ({ rule: still(c, glowL('100%')) }),
  { pal: 0 }
);

add(
  'Softglow',
  'A solid core with the falloff starting a third of the way out.',
  (c) => ({ rule: still(c, coreGlowL('34%', '100%')) }),
  { pal: 20 }
);

add(
  'Radiance',
  'The light comes from one corner of the cell rather than the centre of it.',
  (c) => ({
    rule: turned(c, 'radial-gradient(circle at 0% 100%, #000 0%, transparent 82%)'),
  }),
  { pal: 45 }
);

add(
  'Vignette',
  'The inverse: a clear middle, closing in towards the corners.',
  (c) => ({ rule: still(c, vignetteL('42%')) }),
  { pal: 11 }
);

add(
  'Aureola',
  'A ring with no edges — it thickens out of nothing and thins back into it.',
  (c) => ({ rule: still(c, softBandL('28%', '52%', '62%', '92%')) }),
  { pal: 31 }
);

add(
  'Softorb',
  'A flat ink with a softer one blooming out of the middle of it.',
  (c) => ({
    rule: `${F} { background: ${c1}; ${A(`inset: 0; background: ${ink(c, 2)}; ${msk(glowL('100%'))}`)} }${TR}`,
  }),
  { pal: 55 }
);

add(
  'Hazedisc',
  'The glow squashed into an ellipse, so the cell reads as lit from the side.',
  (c) => ({ rule: turned(c, ovalGlowL('82%', '40%'), R2) }),
  { pal: 44 }
);

add(
  'Lampglow',
  'The source sits on one edge and only half of it lands in the cell.',
  // Not `closest-side`: a circle sized to the nearest edge collapses to zero
  // radius the moment its centre reaches one, and the cell renders empty. Off
  // the middle, the ramp has to be sized from the corners instead.
  (c) => ({
    rule: turned(c, 'radial-gradient(circle at 50% 0%, #000 0%, transparent 76%)'),
  }),
  { pal: 25 }
);

add(
  'Sunspot',
  'A hard disc with a soft one around it, the two reading as core and corona.',
  (c) => ({
    rule: still(
      c,
      'radial-gradient(circle closest-side at 50% 50%, #000 0 26%, transparent 26%)',
      softBandL('26%', '42%', '42%', '90%')
    ),
  }),
  { pal: 39 }
);

add(
  'Softring',
  'A narrow ring, soft on both sides but sharper than the halo it comes from.',
  (c) => ({ rule: still(c, softBandL('36%', '48%', '56%', '70%')) }),
  { pal: 52 }
);

add(
  'Ringglow',
  'Concentric ripples with no line anywhere in them, running out past the cell.',
  (c) => ({ rule: still(c, softRingsL('5%', '14%')) }),
  { pal: 73 }
);

export const sectionE = { title: 'E. Bloom', all };
