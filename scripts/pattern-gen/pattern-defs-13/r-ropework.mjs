// R. Ropework — two members crossing, and the lay where they do.
//
// The overlap section: a pair of pseudo-elements, the upper one let down with
// `opacity` so the crossing reads as a third colour. Opacity exports exactly
// (it becomes a group attribute), which is why it is here and mix-blend-mode
// is not. The pairs are rigger's work — a seizing wrapped over a standing
// part, a splice crossing two strands, a parrel ring with the mast through it.
import {
  section,
  A,
  B,
  F,
  TR,
  cp,
  ink,
  c1,
  poly,
  rot,
  msk,
  boreFS,
  dotsL,
  slotL,
  tiled,
  across,
  down,
  R2,
  R4,
} from './shared.mjs';

const { add, all } = section('R. Ropework');

const paired = (first, second, turns = R4) =>
  `--rot: ${turns}; ${F} { ${B(first)} ${A(second)} ${rot('@var(--rot)')} }${TR}`;

const lean = (deg) => `-webkit-transform: rotate(${deg}); transform: rotate(${deg});`;

add(
  'Splice',
  'Two stout strands crossed, the upper one let down where they marry.',
  (c) => ({
    rule: paired(
      `left: 6%; right: 6%; top: 40%; bottom: 40%; background: ${c1}; ${lean('-24deg')}`,
      `left: 6%; right: 6%; top: 40%; bottom: 40%; background: ${ink(c, 2)}; ${lean('24deg')} opacity: 0.72;`
    ),
  }),
  { pal: 25 }
);

add(
  'Seizing',
  'A standing part with the lashing turned square across it.',
  (c) => ({
    rule: paired(
      down('40%', '20%', c1),
      `${across('40%', '20%', ink(c, 2))} opacity: 0.74;`
    ),
  }),
  { pal: 0 }
);

add(
  'Whipping',
  'A post with three tight turns of twine over its end.',
  (c) => ({
    rule: paired(
      down('38%', '24%', c1),
      `left: 26%; right: 26%; top: 28%; height: 44%; background: ${ink(c, 2)}; ${msk(
        slotL('0deg', '20%', '38%')
      )} opacity: 0.8;`
    ),
  }),
  { pal: 44 }
);

add(
  'Worming',
  'A small strand laid along the score of a big one.',
  (c) => ({
    rule: paired(
      `left: 10%; right: 10%; top: 38%; bottom: 38%; background: ${c1}; ${lean('-30deg')}`,
      `left: 10%; right: 10%; top: 24%; bottom: 62%; background: ${ink(c, 2)}; ${lean('-30deg')} opacity: 0.78;`
    ),
  }),
  { pal: 58 }
);

add(
  'Marline',
  'Two thin lines crossed — the light duty version of the splice.',
  (c) => ({
    rule: paired(
      `left: 4%; right: 4%; top: 46%; bottom: 46%; background: ${c1}; ${lean('-32deg')}`,
      `left: 4%; right: 4%; top: 46%; bottom: 46%; background: ${ink(c, 2)}; ${lean('32deg')} opacity: 0.75;`
    ),
  }),
  { pal: 31 }
);

add(
  'Spunyarn',
  'Two loose yarns twisted nearly parallel, crossing only at a shallow angle.',
  (c) => ({
    rule: paired(
      `left: 8%; right: 8%; top: 42%; bottom: 42%; background: ${c1}; ${lean('-12deg')}`,
      `left: 8%; right: 8%; top: 42%; bottom: 42%; background: ${ink(c, 2)}; ${lean('12deg')} opacity: 0.72;`
    ),
    // Distinct from the splice by angle alone: these barely cross.
  }),
  { pal: 76 }
);

add(
  'Oakum',
  'Two picked lumps of fibre pressed into one another.',
  (c) => ({
    rule: paired(
      `left: 12%; top: 22%; width: 44%; height: 44%; border-radius: 50%; background: ${c1};`,
      `left: 42%; top: 36%; width: 44%; height: 44%; border-radius: 50%; background: ${ink(c, 2)}; opacity: 0.74;`
    ),
  }),
  { pal: 38 }
);

add(
  'Baggywrinkle',
  'A stay with its anti-chafe fluff wrapped shaggy along it.',
  (c) => ({
    rule: paired(
      across('42%', '16%', c1),
      `inset: 0; background: ${ink(c, 2)}; ${msk(dotsL('32%', '16.67%'))} opacity: 0.7;`,
      R2
    ),
  }),
  { pal: 10 }
);

add(
  'Chafe',
  'A strand worn through where the patch now sits.',
  (c) => ({
    rule: paired(
      `inset: 0; background: ${c1}; ${cp(poly([[8, 76], [76, 8], [92, 24], [24, 92]]))}`,
      `left: 36%; top: 36%; width: 28%; height: 28%; border-radius: 50%; background: ${ink(c, 2)}; opacity: 0.78;`
    ),
  }),
  { pal: 47 }
);

add(
  'Furl',
  'A boom with the sail gathered along it in bundles.',
  (c) => ({
    rule: paired(
      across('44%', '12%', c1),
      `left: 6%; right: 6%; top: 30%; height: 40%; background: ${ink(c, 2)}; ${msk(
        tiled('radial-gradient(circle at 50% 50%, #000 40%, transparent 40%)', '33.4%', '100%')
      )} opacity: 0.78;`,
      R2
    ),
  }),
  { pal: 64 }
);

add(
  'Brail',
  'An upright leech with the brailing line hauled across it.',
  (c) => ({
    rule: paired(
      down('44%', '12%', c1),
      `left: 2%; right: 2%; top: 58%; height: 8%; background: ${ink(c, 2)}; ${lean('-18deg')} opacity: 0.8;`
    ),
  }),
  { pal: 17 }
);

add(
  'Snotter',
  'A short sprit set against its mast at a working angle.',
  (c) => ({
    rule: paired(
      down('30%', '18%', c1, '8%'),
      `left: 34%; right: 8%; top: 42%; bottom: 42%; background: ${ink(c, 2)}; ${lean('-36deg')} opacity: 0.76;`
    ),
  }),
  { pal: 53 }
);

add(
  'Parrel',
  'The mast run through its parrel ring.',
  (c) => ({
    rule: paired(
      `inset: 14%; border-radius: 50%; background: ${c1}; ${msk(boreFS('58%'))}`,
      `${down('42%', '16%', ink(c, 2))} opacity: 0.78;`
    ),
  }),
  { pal: 5 }
);

add(
  'Earing',
  'The corner cringle with its line made off across it.',
  (c) => ({
    rule: paired(
      `left: 4%; top: 4%; width: 36%; height: 36%; border-radius: 50%; background: ${c1};`,
      `left: 0%; right: 30%; top: 32%; bottom: 46%; background: ${ink(c, 2)}; ${lean('45deg')} opacity: 0.78;`
    ),
  }),
  { pal: 71 }
);

add(
  'Parcelling',
  'Tarred strips wound over the strand before the serving goes on.',
  (c) => ({
    rule: paired(
      `left: 8%; right: 8%; top: 36%; bottom: 36%; background: ${c1}; ${lean('-30deg')}`,
      `left: 8%; right: 8%; top: 36%; bottom: 36%; background: ${ink(c, 2)}; ${lean('-30deg')} ${msk(
        slotL('90deg', '10%', '22%')
      )} opacity: 0.8;`
    ),
  }),
  { pal: 22 }
);

export const sectionR = { title: 'R. Ropework', all };
