// D. Drybrush — a ruled field with a ramp laid over it.
//
// The same intersection as section C with a stripe field in place of the dot
// field, and it behaves like a loaded brush running out: the rules stay the
// same width all the way across, but less and less of them survives, until the
// far end of the stroke is bare ground.
//
// Which way the ramp runs against the rules is the whole variety of the
// section. Along them and the stroke shortens; across them and the field thins
// from one side; radially and the rules gather into a patch. A few use
// soft-edged rules — a repeating ramp rather than repeating hard stops — so
// there is no crisp line anywhere in the cell.
import {
  section,
  A,
  F,
  TR,
  ink,
  rot,
  mskI,
  slotL,
  fade,
  rise,
  midFade,
  softRampL,
  glowL,
  vignetteL,
  both,
  c1,
  R2,
  R4,
} from './shared.mjs';

const { add, all } = section('D. Drybrush');

/** A ruled field thinned by a ramp, turned a quarter at a time. */
const dragged = (c, rules, ramp, turns = R4) =>
  `--rot: ${turns}; ${F} { ${both(c, rules, ramp)} ${rot('@var(--rot)')} }${TR}`;

add(
  'Drybrush',
  'Rules dragged across the cell, thinning as they go until the ground shows through.',
  (c) => ({ rule: dragged(c, slotL('0deg', '12%', '22%'), fade('90deg', '4%', '100%')) }),
  { pal: 57 }
);

add(
  'Brushdrag',
  'A close ruled field fading along the length of its own lines.',
  (c) => ({ rule: dragged(c, slotL('90deg', '8%', '16%'), fade('180deg', '0%', '100%')) }),
  { pal: 6 }
);

add(
  'Dragline',
  'Thin lines on a wide pitch, so what fades out is mostly ground already.',
  (c) => ({ rule: dragged(c, slotL('0deg', '6%', '30%'), fade('90deg', '0%', '100%')) }),
  { pal: 27 }
);

add(
  'Streaking',
  'The rules lean at forty-five degrees and the fall runs square across them.',
  (c) => ({
    rule: dragged(c, slotL('45deg', '10%', '20%'), fade('135deg', '0%', '100%'), R2),
  }),
  { pal: 43 }
);

add(
  'Combfade',
  'A fine comb gathered into the middle of the cell and gone by the corners.',
  (c) => ({ rule: dragged(c, slotL('90deg', '5%', '10%'), glowL('100%'), R2) }),
  { pal: 16 }
);

add(
  'Rulefade',
  'The stroke starting at nothing and arriving at full weight, rather than the other way round.',
  (c) => ({ rule: dragged(c, slotL('0deg', '14%', '28%'), rise('90deg', '6%', '100%')) }),
  { pal: 71 }
);

add(
  'Hachurefade',
  'Fine hatching with the ramp running along the lines instead of across them.',
  (c) => ({
    rule: dragged(c, slotL('45deg', '5%', '14%'), fade('45deg', '0%', '100%'), R2),
  }),
  { pal: 34 }
);

add(
  'Rakefade',
  'Broad bars with narrow channels, strongest down the middle of the cell.',
  (c) => ({
    rule: dragged(c, slotL('90deg', '18%', '26%'), midFade('90deg', '0%', '30%', '70%', '100%')),
  }),
  { pal: 9 }
);

add(
  'Brushout',
  'Rules with no hard edge of their own, thinning across the cell.',
  (c) => ({
    rule: dragged(c, softRampL('0deg', '5%', '18%'), fade('90deg', '0%', '100%')),
  }),
  { pal: 61 }
);

add(
  'Drylines',
  'A flat ink underneath, and a second one ruled and dragged over the top of it.',
  (c) => ({
    rule: `--rot: ${R4}; ${F} { background: ${c1}; ${A(`inset: 0; background: ${ink(c, 2)}; ${mskI(slotL('0deg', '10%', '20%'), fade('90deg', '0%', '100%'))}`)} ${rot('@var(--rot)')} }${TR}`,
  }),
  { pal: 48 }
);

add(
  'Wearline',
  'Soft rules worn through in the middle of the cell and left standing round the edges.',
  (c) => ({ rule: dragged(c, softRampL('90deg', '6%', '14%'), vignetteL('30%'), R2) }),
  { pal: 22 }
);

export const sectionD = { title: 'D. Drybrush', all };
