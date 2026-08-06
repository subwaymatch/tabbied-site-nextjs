// N. Kilnglow — smooth radial ramps, named for the glazes they behave like.
//
// The bloom section of this batch: soft pools of ink that gather, thin, and
// halo, each a smooth radial (or, twice, a smooth linear) used as a mask over
// one solid ink. A <radialGradient> carries the same stops CSS did, including
// the premultiplied-alpha subdivision for colour→transparent runs, so these
// export as faithfully as the hard-edged sections — no filter, no blur, no
// note.
import { section, F, TR, rot, faded, both, msk, discL, dotsL, midFade, R2, R4 } from './shared.mjs';

const { add, all } = section('N. Kilnglow');

const turned = (c, decls, turns = R4) =>
  `--rot: ${turns}; ${F} { ${decls} ${rot('@var(--rot)')} }${TR}`;

const glow = (at, hold, gone) =>
  `radial-gradient(circle farthest-side at ${at}, #000 0 ${hold}, transparent ${gone})`;

add(
  'Peachbloom',
  'A soft pool of colour held at the centre and thinning to nothing at the rim.',
  (c) => ({ rule: turned(c, faded(c, glow('50% 50%', '30%', '88%'))) }),
  { pal: 49 }
);

add(
  'Oxblood',
  'The glaze run heavy: colour pooled deep against the foot of the cell.',
  (c) => ({ rule: turned(c, faded(c, glow('50% 100%', '44%', '96%'))) }),
  { pal: 11 }
);

add(
  'Sangdeboeuf',
  'A dense pool with only a narrow breathing edge before the ground.',
  (c) => ({ rule: turned(c, faded(c, glow('50% 50%', '58%', '76%'))) }),
  { pal: 29 }
);

add(
  'Raku',
  'A scorch reaching in from one corner across most of the cell.',
  (c) => ({ rule: turned(c, faded(c, glow('100% 100%', '20%', '86%'))) }),
  { pal: 19 }
);

add(
  'Shino',
  'A thin glaze that never quite reaches full strength anywhere.',
  (c) => ({
    rule: turned(
      c,
      faded(c, 'radial-gradient(circle farthest-side at 50% 44%, #000000cc 0%, transparent 92%)')
    ),
  }),
  { pal: 53 }
);

add(
  'Oribe',
  'The pour caught mid-run: colour gathered hard against one side.',
  (c) => ({ rule: turned(c, faded(c, glow('16% 50%', '26%', '90%')), R2) }),
  { pal: 40 }
);

add(
  'Temmoku',
  'A soft-walled ring — the glaze thin at the well, thick at the shoulder, gone at the rim.',
  (c) => ({
    rule: turned(
      c,
      faded(
        c,
        'radial-gradient(circle farthest-side at 50% 50%, transparent 30%, #000 56% 68%, transparent 92%)'
      )
    ),
  }),
  { pal: 67 }
);

add(
  'Sancai',
  'Three colours run in three pools, allowed to find each other.',
  (c) => ({
    rule: turned(
      c,
      faded(c, glow('20% 24%', '10%', '58%'), glow('80% 34%', '10%', '58%'), glow('50% 84%', '12%', '62%'))
    ),
  }),
  { pal: 22 }
);

add(
  'Doucai',
  'A hard enamel dot inside a soft underglaze halo.',
  (c) => ({
    rule: turned(
      c,
      faded(
        c,
        discL('19%'),
        'radial-gradient(circle farthest-side at 50% 50%, transparent 26%, #00000088 42%, transparent 70%)'
      )
    ),
  }),
  { pal: 3 }
);

add(
  'Wucai',
  'Five soft touches of colour set out as a quincunx.',
  (c) => ({
    rule: turned(
      c,
      faded(
        c,
        glow('50% 50%', '8%', '34%'),
        glow('20% 20%', '6%', '28%'),
        glow('80% 20%', '6%', '28%'),
        glow('20% 80%', '6%', '28%'),
        glow('80% 80%', '6%', '28%')
      )
    ),
  }),
  { pal: 46 }
);

add(
  'Fencai',
  'A famille-rose wash: one soft band of colour lying across the cell.',
  (c) => ({ rule: turned(c, faded(c, midFade('180deg', '4%', '38%', '62%', '96%'))) }),
  { pal: 50 }
);

add(
  'Yangcai',
  'Two blooms answering each other from opposite corners.',
  (c) => ({
    rule: turned(c, faded(c, glow('0% 0%', '12%', '64%'), glow('100% 100%', '12%', '64%')), R2),
  }),
  { pal: 33 }
);

add(
  'Famillerose',
  'A ring of soft roses around a bare centre.',
  (c) => ({
    rule: turned(
      c,
      faded(
        c,
        glow('50% 14%', '5%', '26%'),
        glow('86% 50%', '5%', '26%'),
        glow('50% 86%', '5%', '26%'),
        glow('14% 50%', '5%', '26%')
      )
    ),
  }),
  { pal: 34 }
);

add(
  'Familleverte',
  'Two soft bands crossing, brightest where they agree.',
  (c) => ({
    rule: turned(
      c,
      faded(
        c,
        'linear-gradient(90deg, transparent 24%, #000000cc 44% 56%, transparent 76%)',
        'linear-gradient(180deg, transparent 24%, #000000cc 44% 56%, transparent 76%)'
      )
    ),
  }),
  { pal: 78 }
);

add(
  'Teadust',
  'A fine speckle caught in a glow, dense in the middle and starved at the edge.',
  (c) => ({
    rule: turned(c, both(c, dotsL('22%', '8.34%'), glow('50% 50%', '40%', '100%'))),
  }),
  { pal: 7 }
);

export const sectionN = { title: 'N. Kilnglow', all };
