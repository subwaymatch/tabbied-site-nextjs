// Batch 6 — 100 *ordered* motifs (gallery orders 620+).
//
// Where earlier batches leaned on scatter (Confetti, Shard, Sprinkles roll a
// fresh position, size and angle for every cell), this batch is deliberately
// predictable: nothing is placed at random. Every shape sits on the cell grid,
// and whatever varies from cell to cell varies by *rule* — `@match` on the
// cell's column/row/index, `@pn()` cycling a value in order, or `@calc()`
// ramping a size, angle or opacity across the canvas. Redraws re-ink the
// pattern (colors are still sampled per cell) but never rearrange it, so a
// reseed reads as a new colorway of the same design.
//
// House rules (matching every earlier batch):
//   * NO `@rand()` anywhere — position, size and rotation come from the grid;
//   * reseed variation rides on a transition-able, *sampled* property —
//     background-color, border-color or opacity — so recolors morph;
//   * a randomized custom prop used more than once is read via @var(--x);
//   * every rule paints through @random(${shapeFrequency}) — including the
//     @match branches, so the frequency slider still thins the field — and
//     ends in a transition.

const isDark = (hex) => {
  const m = /^#([0-9a-f]{6})/i.exec(hex);
  if (!m) return false;
  const n = parseInt(m[1], 16);
  return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255 < 0.5;
};

// Ink picker over color1..color(c-1) (color0 is the background).
const ink = (c, s = 1) => {
  const a = [];
  for (let i = s; i <= c - 1; i++) a.push(`var(--color${i})`);
  return `@p(${a.join(', ')})`;
};

// ── shared snippets ────────────────────────────────────────────────────────
const F = '@random(${shapeFrequency})';
const TR = ' -webkit-transition: ease 450ms; transition: ease 450ms;';
const pt = ' -webkit-transition: ease 450ms; transition: ease 450ms;';
const cp = (p) => `-webkit-clip-path: ${p}; clip-path: ${p};`;
const rot = (v) => `-webkit-transform: rotate(${v}); transform: rotate(${v});`;
const xf = (v) => `-webkit-transform: ${v}; transform: ${v};`;
const B = (css) => `:before { content: ''; position: absolute; ${css}${pt} }`;
const A = (css) => `:after { content: ''; position: absolute; ${css}${pt} }`;
// Strokes authored in px are divided by the row count so they hold their
// proportions as the grid gets denser.
const px = (n) => `calc(${n}px / @Y)`;

// Palette bank (color0 = background). Spans neon, jewel, earth, pastel, mono,
// retro and forest families so the gallery stays varied; palettes may repeat.
const PAL = [
  ['#0B1F3A', '#3E8BFF', '#3EECFF', '#97F4FF', '#9EFFD8', '#FFFFFF'],
  ['#101A2E', '#3E8BFF', '#3EECFF', '#FF3D8B', '#3FFFB2', '#F5DD32'],
  ['#0E2438', '#275AA6', '#3E8BFF', '#3EECFF', '#97F4FF', '#E9F1FF'],
  ['#0B2540', '#1B4075', '#3E8BFF', '#3EECFF', '#9EFFD8', '#ECFFEC'],
  ['#E9F1FF', '#1B4075', '#3E8BFF', '#3EECFF', '#FF3D8B', '#3FFFB2'],
  ['#FFFFFF', '#3E8BFF', '#1B4075', '#3EECFF', '#FF3D8B', '#3FFFB2'],
  ['#ECFFEC', '#3FFFB2', '#3E8BFF', '#9EFFD8', '#FF3D8B', '#F5DD32'],
  ['#2B1B3D', '#FF8A5C', '#FFC15E', '#FF5E78', '#FFD27D', '#FFF1D6'],
  ['#241024', '#E84393', '#B388EB', '#FF8FB8', '#F5C542', '#FFF1F6'],
  ['#1A0E12', '#FF6B6B', '#FFD93D', '#4ECDC4', '#FF8A5C', '#FFF1D6'],
  ['#FBF3E4', '#D96C47', '#E3A92E', '#7FA886', '#2F4156', '#F4E3C8'],
  ['#2B1E1A', '#E2543E', '#E3A92E', '#88A872', '#F3EBDB', '#7FA886'],
  ['#F4EFE4', '#7A1F3D', '#2F4156', '#C9A86A', '#88A872', '#D98E5A'],
  ['#141233', '#6C4AB6', '#3EECFF', '#FF3D8B', '#F5DD32', '#3FFFB2'],
  ['#0F2027', '#3FFFB2', '#3EECFF', '#2BB3A3', '#D89FFF', '#E9FFF9'],
  ['#0F2A1E', '#2F6B3C', '#4F9D5D', '#8CC084', '#C8E6C0', '#ECFFEC'],
  ['#F2F7EE', '#2F6B3C', '#4F9D5D', '#8CC084', '#C8E6C0', '#1F4D2A'],
  ['#0E1230', '#3E8BFF', '#7AA7FF', '#B9D0FF', '#E9F1FF', '#FFFFFF'],
  ['#FCFBFF', '#60569E', '#9B8FD4', '#C9BFF2', '#3E8BFF', '#E6437D'],
  ['#FAF7F0', '#232529', '#E63329', '#1D3D8F', '#F0C02E', '#3EECFF'],
  ['#10303A', '#2BB3A3', '#3EECFF', '#FF6B6B', '#FFD93D', '#F3EBDB'],
  ['#FBF7EE', '#FF4D6D', '#2E86AB', '#F5B82E', '#7E4A8C', '#2BB3A3'],
  ['#1D1F24', '#E8E6E1', '#F5B82E', '#3EECFF', '#FF4D6D', '#2E86AB'],
  ['#15171C', '#E8E6E1', '#F5B82E', '#3EECFF', '#FF3D8B', '#9EFFD8'],
  ['#FFF8F2', '#FF7E9D', '#FFB35C', '#9D89F2', '#54C6B8', '#FF3D8B'],
  ['#FFF9F5', '#FF8FB8', '#FFC2D4', '#FF8A5C', '#D89FFF', '#F5C542'],
  ['#0B2540', '#3E8BFF', '#3EECFF', '#9EFFD8', '#ECFFEC', '#FFFFFF'],
  ['#161616', '#F5F5F0', '#9A9A9A', '#5A5A5A', '#C8C8C8', '#3A3A3A'],
  ['#F5F5F0', '#161616', '#5A5A5A', '#9A9A9A', '#3A3A3A', '#C8C8C8'],
  ['#11151A', '#FF5252', '#FFB300', '#26C6DA', '#66BB6A', '#EEEEEE'],
  ['#FDF6E3', '#073642', '#268BD2', '#D33682', '#859900', '#CB4B16'],
  ['#1B2A4A', '#F7C548', '#F25F5C', '#247BA0', '#70C1B3', '#FFFFFF'],
  ['#2D132C', '#801336', '#C72C41', '#EE4540', '#F0C419', '#FFE9C7'],
  ['#0D1B2A', '#1B98E0', '#E0FBFC', '#FF7B00', '#FFD23F', '#EAEAEA'],
  ['#F0EAD6', '#264653', '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51'],
  ['#1E1B18', '#C99E10', '#7D6608', '#E8C547', '#F5EFD6', '#9C7A2B'],
  ['#FFF4E6', '#3D348B', '#7678ED', '#F7B801', '#F18701', '#F35B04'],
  ['#08141E', '#0F8B8D', '#143642', '#EC9A29', '#A8201A', '#EFE6DD'],
  ['#231942', '#5E548E', '#9F86C0', '#BE95C4', '#E0B1CB', '#F7ECFF'],
  ['#FDFCFB', '#E2D1F9', '#C9B6E4', '#A06CD5', '#6247AA', '#102B3F'],
  ['#0A0908', '#49111C', '#A9927D', '#F2F4F3', '#5E503F', '#C6AC8F'],
  ['#022B3A', '#1F7A8C', '#BFDBF7', '#E1E5F2', '#FF8C42', '#FFF8F0'],
  ['#FFFCF2', '#252422', '#403D39', '#CCC5B9', '#EB5E28', '#A8763E'],
  ['#12100E', '#D62246', '#F06449', '#EDE6E3', '#36C9C6', '#F4D35E'],
  ['#001219', '#005F73', '#0A9396', '#94D2BD', '#EE9B00', '#CA6702'],
  ['#FEFAE0', '#606C38', '#283618', '#DDA15E', '#BC6C25', '#A3B18A'],
  ['#10002B', '#5A189A', '#9D4EDD', '#C77DFF', '#E0AAFF', '#FFD6FF'],
  ['#FFFFFF', '#06AED5', '#086788', '#F0C808', '#FFF1D0', '#DD1C1A'],
];

const TAKEN = new Set(
  (
    // Every motif name used anywhere in the project so far: the shipped
    // artworks, the gallery thumbnail table, and batches 1–5's definition
    // files (including entries that were trimmed before shipping).
    'abacus acorn amphora aperture arcade argyle arrow arrowplay ascent aster ' +
    'asterisk aurora awning azulejo balloon barcode bargello barline basalt ' +
    'basket baste battlement bauhaus beadrow bee bento berry bevel beveled ' +
    'bezel billow bloks bloom blossom bobbin bokeh bolt bond bowl bowtie ' +
    'boxweave bracket bracketpair bramble brickwork brokenbond bubble bubbles ' +
    'bud bulge bunting buoy burgee button cairn caltrop caneweave capsule ' +
    'caret carousel cartouche cattail caustic celleye chaff chalice chamfer ' +
    'checkers checkmark chevarrow chevrondiamond chime cinch circuit cirrus ' +
    'citrus cleat clover cog coil cointile comb comet compass confetti ' +
    'constellation convex coral cornerpunch crater crazy crescendo crescent ' +
    'cresset crossbar crosshair crosshatch crosslet crux crystal cube cumulus ' +
    'curl cusp dapple dart daybreak delta diadem diadot dial diamond3d ' +
    'diamonddust diamondeye diamondframe diaper discus disque dogtooth dome ' +
    'domino dotdash dotwave doubinset draughts driftleaf drizzle dune echo ' +
    'edgeband elbow ell emboss enso eyelet facade facetbox facetdiamond ' +
    'facetgrad fang fanlight fin fishscale flagstone flight flutter foliage ' +
    'fourpane frame frameblock freckle frond fuzz gable gablet gem gemcut ' +
    'gibbous gingham glint glitch glyph grain granule grassblade gridline ' +
    'gumball halfblock halfdot halfink halfpenny halftone halo harlequin ' +
    'hashmark hatch heart herringbone hexagram hexbloom hexdot hexnut hextile ' +
    'hoop hopscotch hourglass ibeam impasto incense inkblot inset insetstep ' +
    'iris ivy jelly jewel junction kasuri keyhole keypad keywork kilim ' +
    'kintsugi kite koi ladybird lantern lattice laundry ledger lens levels ' +
    'lily links lobe logcabin loophole lotus lozenge lozengegrad lune macaron ' +
    'maltese mandorla massif matchstick matte maze meadow medusa memphis ' +
    'meridian merlon mesh metro mirror misprint mistwave mixtape monolith ' +
    'moonphase morse mosaicglass mosaictile mote mudcloth needle neon ' +
    'northstar notch notchbar notchblock octagon octant odessa offset ' +
    'offsetbox orb orbit origami paisley palmette parquet passepartout patina ' +
    'pavers pebble pebbledot pediment pellet pendulum pennant pennantbox ' +
    'pennon penta pentafan petal picket pinhex pinhole pinion pinmark ' +
    'pinnacle pinnate pinweave pinwheel pinwheelstar pinwheeltile ' +
    'pinwheelweave pip pixel plaid plasma pleat plumb plus pod polaroid polka ' +
    'polkapair pompom pondring popsicle portal postage posy prisma prismfold ' +
    'prow pulsar pulsebar pyramid pyramid3d quadrant quadrille quarterbar ' +
    'quarterblock quartz quasar quaver quilt quiltsquare quincunx quoit radar ' +
    'radius rail rainbow raindrop rake range regatta rhomboid ribbonfold ' +
    'ricrac ring ringdot ringlink ripple rondure roundel rune rungs saguaro ' +
    'sail saltire sash sawedge scale scallop scatterdot sector seigaiha ' +
    'sequin sextant shard shelf shibori shield shoji shuffle sigil signal ' +
    'sine sixstar skew slant slat sliver snowflake sonata spark sparkle ' +
    'spearhead spectrum spiralblock spire splat splithz splittri spore sprig ' +
    'sprinkles sprocket sprout stackbond star5 starflake starlet stave stella ' +
    'step step3d stipple stitch strata sunburst sunken sunwheel swellbox ' +
    'switchback symmetry tag tally target tatami tee tendril terrain tesserae ' +
    'tetro thistle tickmark tictac tilt trace trackline trapeze trapezoid ' +
    'trellis trianglet triband trigram triquetra trishard truchet tube tumble ' +
    'tweed twill twinkle vee veil venn vinyl vitrail voltage wander warp wash ' +
    'wavelet weave weft wheelarc wicket windowframe windowpane wingtri ' +
    'zagtile zee ziggurat ziggy zigline zigzagfold zipper'
  )
    .split(/\s+/)
    .filter(Boolean)
);

// JS reserved words can't be emitted as `export const <slug>` by the package
// codegen, so they're banned as slugs.
const RESERVED = new Set(
  ('do if in for let new try var case else enum eval null this true void with ' +
    'await break catch class const false super throw while yield delete export ' +
    'import public return static switch typeof default extends finally package ' +
    'private continue debugger function arguments interface protected implements ' +
    'instanceof').split(/\s+/)
);

let order = 620;
const all = [];
const add = (name, palIdx, description, build, cfg = {}) => {
  const slug = name.toLowerCase();
  if (!/^[a-z][a-z0-9]*$/.test(slug)) throw new Error(`bad slug: ${slug}`);
  if (RESERVED.has(slug)) throw new Error(`slug is a reserved word: ${slug}`);
  if (TAKEN.has(slug)) throw new Error(`slug already taken elsewhere: ${slug}`);
  if (all.some((d) => d.slug === slug)) throw new Error(`duplicate slug in batch 6: ${slug}`);
  const palette = PAL[palIdx % PAL.length];
  const c = palette.length;
  const { vars, rule } = build(c);
  if (/@rand\b|@rand\(/.test(rule) || /@rand\b|@rand\(/.test(vars)) {
    throw new Error(`${slug}: batch 6 is the ordered batch — @rand() is not allowed`);
  }
  all.push({
    name,
    slug,
    order: order++,
    ...(isDark(palette[0]) ? { white: true } : {}),
    description,
    palette,
    colors: { min: 2, max: c, default: c },
    gridDefault: cfg.grid ?? '8x12',
    freqDefault: cfg.freq ?? 1,
    thumb: { grid: cfg.tg ?? '5x5', frequency: cfg.tf ?? 1 },
    ...(cfg.sizing ? { sizing: cfg.sizing } : {}),
    vars,
    rule,
  });
};

// ════════════════════════════════════════════════════════════════════════════
// A. Rules, ribs & bands
// ════════════════════════════════════════════════════════════════════════════

add('Corduroy', 0, 'Vertical ribs running the full height of the canvas, every other wale pinched narrow — the weave holds, the colours re-dye on redraw.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 28%; top: 0; width: 44%; height: 100%; background: ${ink(c)};`)} @match(@x % 2 == 0) { :after { left: 39%; width: 22%; } } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Pinstripe', 22, 'Suiting stripes: a solid ground ruled by one hairline per column, with a bolder chalk stripe every third pass.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${A(`left: 0; top: 0; width: 9%; height: 100%; background: var(--color0);`)} @match(@x % 3 == 0) { :after { width: 22%; } } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Fascia', 11, 'Horizontal bands stacked in a fixed cadence — deep, hairline, medium — so the canvas reads as ruled sign-writing.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 0; top: 30%; width: 100%; height: 40%; background: ${ink(c)};`)} @match(@y % 3 == 0) { :after { top: 12%; height: 76%; } } @match(@y % 3 == 1) { :after { top: 42%; height: 16%; } } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Reeded', 34, 'Reeded glass: three upright reeds per cell parted by two clean grooves, the panes re-tinting on every redraw.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${B(`left: 26%; top: 0; width: 9%; height: 100%; background: var(--color0);`)} ${A(`left: 65%; top: 0; width: 9%; height: 100%; background: var(--color0);`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Louvre', 3, 'Angled shutter slats set at one constant tilt, so the whole canvas rakes the same way and only the finish changes.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 22%, 100% 0, 100% 78%, 0 100%)')} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Sleeper', 43, 'Railway sleepers: a heavy cross-tie in every cell with the spike shifting a fixed step on alternate columns.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 0; top: 38%; width: 100%; height: 24%; background: ${ink(c)};`)} ${A(`left: 42%; top: 0; width: 16%; height: 100%; background: ${ink(c)};`)} @match(@x % 2 == 0) { :after { left: 14%; } } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Furrow', 45, 'Two rounded ridges per cell ploughed into even rows — a tilled field seen from directly above.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 4%; top: 14%; width: 92%; height: 22%; border-radius: 999px; background: ${ink(c)};`)} ${A(`left: 4%; top: 62%; width: 92%; height: 22%; border-radius: 999px; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Gridiron', 18, 'A crossed bar in every cell, locking edge to edge into one continuous iron grid.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 0; top: 40%; width: 100%; height: 20%; background: ${ink(c)};`)} ${A(`left: 40%; top: 0; width: 20%; height: 100%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Ticker', 29, 'Tape-machine dashes: a long mark over a short one, swapping order column by column down the whole strip.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 8%; top: 24%; width: 84%; height: 14%; background: ${ink(c)};`)} ${A(`left: 8%; top: 62%; width: 40%; height: 14%; background: ${ink(c)};`)} @match(@x % 2 == 0) { :before { width: 40%; } :after { width: 84%; } } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Palisade', 16, 'A fence of round-topped stakes, every third post planted slimmer than its neighbours.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 22%; top: 0; width: 56%; height: 100%; border-radius: 999px 999px 0 0; background: ${ink(c)};`)} @match(@x % 3 == 0) { :after { left: 33%; width: 34%; } } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Kerf', 23, 'Saw slots cut into solid blocks, the kerf biting from the top on one row and the bottom on the next.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 44% 0, 44% 58%, 56% 58%, 56% 0, 100% 0, 100% 100%, 0 100%)')} @match(@y % 2 == 1) { ${cp('polygon(0 0, 100% 0, 100% 100%, 56% 100%, 56% 42%, 44% 42%, 44% 100%, 0 100%)')} } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Baseline', 30, 'A typesetter’s baseline with a riser marking every fourth column — a ruled measure across the sheet.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 0; top: 82%; width: 100%; height: 9%; background: ${ink(c)};`)} ${A(`left: 46%; top: 56%; width: 8%; height: 26%; background: ${ink(c)};`)} @match(@x % 4 == 1) { :after { top: 20%; height: 62%; } } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

// ════════════════════════════════════════════════════════════════════════════
// B. Checkers, bonds & tilings
// ════════════════════════════════════════════════════════════════════════════

add('Damier', 19, 'A strict checkerboard — dark squares and light ones keyed to their neighbours, re-dyed on each redraw.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; @even { background: var(--color0); ${A(`inset: 30%; background: ${ink(c)};`)} } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Stretcher', 42, 'Running-bond brickwork: full stretchers coursed edge to edge, every other row stepped half a brick along.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('inset(8% 4%)')} @match(@y % 2 == 1) { ${xf('translateX(50%)')} } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Marquetry', 12, 'Inlaid veneer squares, each holding a smaller panel that turns on point wherever the checker flips.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${A(`inset: 26%; background: ${ink(c)};`)} @even { :after { ${rot('45deg')} } } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Bias', 5, 'Every square cut corner to corner, the seam flipping with the checker so the field reads as one running diagonal.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${A(`inset: 0; background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 0 100%)')}`)} @even { :after { ${cp('polygon(100% 0, 100% 100%, 0 100%)')} } } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Hurdle', 46, 'Woven hurdle fencing: flat laths lying across the grain on one square and along it on the next.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 2%; top: 22%; width: 96%; height: 56%; background: ${ink(c)};`)} @even { :after { left: 22%; top: 2%; width: 56%; height: 96%; } } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Waffle', 25, 'Waffle weave — a raised pad inside a grooved tile, three levels deep and perfectly repeating.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${B(`inset: 10%; background: var(--color0);`)} ${A(`inset: 20%; border-radius: 10%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Pinboard', 1, 'Pins set at every grid vertex, alternating large and small in a strict quincunx.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 0; top: 0; width: 36%; height: 36%; margin: -18% 0 0 -18%; border-radius: 50%; background: ${ink(c)};`)} @even { :after { width: 20%; height: 20%; margin: -10% 0 0 -10%; } } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Cobble', 40, 'Rounded setts laid in courses, each row nudged half a stone across the way a paved street is bedded.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('inset(6% 5% round 26%)')} @match(@y % 2 == 1) { ${xf('translateX(50%)')} } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Ashlar', 13, 'Coursed ashlar masonry — long dressed blocks with every third column split into two shallow stones.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('inset(7% 4%)')} @match(@x % 3 == 0) { background: var(--color0); ${B(`left: 4%; top: 7%; width: 92%; height: 40%; background: ${ink(c)};`)} ${A(`left: 4%; top: 53%; width: 92%; height: 40%; background: ${ink(c)};`)} } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Sashiko', 4, 'Sashiko running stitch: even dashes lying flat along one row and upright on the next, quilting a grid.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 8%; top: 46%; width: 36%; height: 8%; background: ${ink(c)};`)} ${A(`left: 56%; top: 46%; width: 36%; height: 8%; background: ${ink(c)};`)} @match(@y % 2 == 1) { :before { left: 46%; top: 8%; width: 8%; height: 36%; } :after { left: 46%; top: 56%; width: 8%; height: 36%; } } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Isocube', 39, 'Tumbling blocks: one hexagon per cell shaded as a lit top and two falling sides, stacking into an isometric wall.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)')} ${B(`inset: 0; background: ${ink(c)}; ${cp('polygon(50% 0, 100% 25%, 50% 50%, 0 25%)')}`)} ${A(`inset: 0; background: ${ink(c)}; ${cp('polygon(50% 50%, 100% 25%, 100% 75%, 50% 100%)')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Grout', 28, 'Square tiles held apart by an even grout line, the glaze re-firing on each redraw.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${B(`left: 0; top: 45%; width: 100%; height: 10%; background: var(--color0);`)} ${A(`left: 45%; top: 0; width: 10%; height: 100%; background: var(--color0);`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

// ════════════════════════════════════════════════════════════════════════════
// C. Frames, panels & architecture
// ════════════════════════════════════════════════════════════════════════════

add('Coffer', 37, 'A coffered ceiling seen straight on: square panels recessed twice, each sinking to its own tone.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${B(`inset: 12%; background: var(--color0);`)} ${A(`inset: 24%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Casement', 17, 'Round-headed casement windows in even ranks, each sash set back inside its reveal.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; border-radius: 46% 46% 6% 6%; ${A(`inset: 16%; border-radius: 44% 44% 4% 4%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Transom', 8, 'A shallow transom light above a tall panel — the same opening repeated storey after storey.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 8%; top: 8%; width: 84%; height: 22%; background: ${ink(c)};`)} ${A(`left: 8%; top: 36%; width: 84%; height: 56%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Lancet', 38, 'Pointed lancet windows nested one inside another, ranked like a cathedral clerestory.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(50% 0, 100% 38%, 100% 100%, 0 100%, 0 38%)')} ${A(`left: 22%; top: 18%; width: 56%; height: 82%; background: ${ink(c)}; ${cp('polygon(50% 0, 100% 32%, 100% 100%, 0 100%, 0 32%)')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Lintel', 20, 'A post-and-lintel opening cut from every block, the doorways lining up into a colonnaded wall.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 100% 100%, 72% 100%, 72% 28%, 28% 28%, 28% 100%, 0 100%)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Plinth', 35, 'Stepped pedestals, each moulding a fixed number of courses wide — a base course repeated without variation.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(22% 0, 78% 0, 78% 60%, 90% 60%, 90% 80%, 100% 80%, 100% 100%, 0 100%, 0 80%, 10% 80%, 10% 60%, 22% 60%)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Dentil', 47, 'Dentil moulding: a continuous top rail with one square tooth hanging below each cell.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 0; top: 6%; width: 100%; height: 26%; background: ${ink(c)};`)} ${A(`left: 26%; top: 38%; width: 48%; height: 34%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Frieze', 32, 'A running frieze whose notch alternates up and down the band, a Greek key held to strict measure.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 0; top: 26%; width: 100%; height: 48%; background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 100% 100%, 66% 100%, 66% 46%, 34% 46%, 34% 100%, 0 100%)')}`)} @match(@x % 2 == 1) { :after { ${cp('polygon(0 0, 34% 0, 34% 54%, 66% 54%, 66% 0, 100% 0, 100% 100%, 0 100%)')} } } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Quoin', 26, 'Quoin stones alternating long and short up the corner of a building, coursed dead level.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('inset(6% 4%)')} @match(@x % 2 == 0) { ${cp('inset(6% 4% 6% 36%)')} } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Corbel', 10, 'Corbelled steps climbing out of each block in three even stages, stacking into a staircase wall.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 100% 32%, 66% 32%, 66% 64%, 33% 64%, 33% 100%, 0 100%)')} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Colonnade', 21, 'Columns with capital and base repeated bay after bay, every shaft the same width as the last.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(8% 0, 92% 0, 92% 14%, 70% 14%, 70% 86%, 92% 86%, 92% 100%, 8% 100%, 8% 86%, 30% 86%, 30% 14%, 8% 14%)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Archway', 41, 'Arched openings punched through a solid wall in even bays, the arch springing from the same height every time.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${A(`left: 22%; top: 26%; width: 56%; height: 74%; border-radius: 999px 999px 0 0; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

// ════════════════════════════════════════════════════════════════════════════
// D. Rounds, arcs & radial
// ════════════════════════════════════════════════════════════════════════════

add('Rosette', 24, 'Four petals struck from two crossed ellipses, one rosette centred in every cell.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 0; top: 27%; width: 100%; height: 46%; border-radius: 50%; background: ${ink(c)};`)} ${A(`left: 27%; top: 0; width: 46%; height: 100%; border-radius: 50%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Cartwheel', 33, 'Spoked wheels on a fixed axle — rim, hub bar and cross-spoke, all struck to the same measure.', (c) => ({
  vars: '',
  rule: `${F} { width: 92%; height: 92%; margin: 4%; box-sizing: border-box; border-radius: 50%; border: ${px(16)} solid ${ink(c)}; ${B(`left: 44%; top: 4%; width: 12%; height: 92%; background: ${ink(c)};`)} ${A(`left: 4%; top: 44%; width: 92%; height: 12%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '4x4', sizing: { minCellPx: 32 } });

add('Grommet', 2, 'Three concentric rings punched clean through — flange, washer and eyelet, centred to the cell.', (c) => ({
  vars: '',
  rule: `${F} { width: 96%; height: 96%; margin: 2%; border-radius: 50%; background: ${ink(c)}; ${B(`inset: 14%; border-radius: 50%; background: ${ink(c)};`)} ${A(`inset: 36%; border-radius: 50%; background: var(--color0);`)} }${TR}`,
}), { grid: '6x9', tg: '4x4' });

add('Lunette', 15, 'Half-round lunette windows, each split down the middle by a single upright glazing bar.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 6%; top: 20%; width: 88%; height: 76%; border-radius: 999px 999px 0 0; background: ${ink(c)};`)} ${A(`left: 46%; top: 30%; width: 8%; height: 66%; background: var(--color0);`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Voussoir', 44, 'Arch stones fanning out: each wedge leans a fixed step further than the column before it, so a row closes like an arch.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(26% 4%, 74% 4%, 96% 96%, 4% 96%)')} ${rot('@calc((@x - (@X + 1) / 2) * 30 / @X)deg')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Annulus', 27, 'Rings that thicken row by row down the canvas — the same circle, walked through its whole range.', (c) => ({
  vars: '',
  rule: `${F} { width: 90%; height: 90%; margin: 5%; border-radius: 50%; background: ${ink(c)}; ${A(`inset: @calc(10 + 30 * @y / @Y)%; border-radius: 50%; background: var(--color0);`)} }${TR}`,
}), { grid: '6x9', tg: '4x4' });

add('Chaplet', 9, 'A large bead and a small one threaded in every cell, the pairs telling off in even rows.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 18%; top: 6%; width: 64%; height: 64%; border-radius: 50%; background: ${ink(c)};`)} ${A(`left: 38%; top: 70%; width: 24%; height: 24%; border-radius: 50%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Ovolo', 31, 'Quarter-round mouldings turning one corner clockwise per cell, so the field marches through all four faces.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; border-radius: 100% 0 0 0; ${rot('@pn(0deg, 90deg, 180deg, 270deg)')} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Cove', 36, 'A deep circular scoop taken out of every block, the cove shifting to the opposite side on alternate rows.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; overflow: hidden; ${A(`left: -55%; top: -55%; width: 120%; height: 120%; border-radius: 50%; background: var(--color0);`)} @match(@y % 2 == 1) { :after { left: 35%; } } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Halfround', 7, 'Half-discs facing up in one column and down in the next, meeting edge to edge across the canvas.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 2%; top: 20%; width: 96%; height: 60%; border-radius: 999px 999px 0 0; background: ${ink(c)};`)} @match(@x % 2 == 1) { :after { border-radius: 0 0 999px 999px; } } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Porthole', 14, 'Bolted portholes in a rounded plate — glass, frame and one fixing at top dead centre.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; border-radius: 26%; ${B(`inset: 16%; border-radius: 50%; background: ${ink(c)};`)} ${A(`left: 45%; top: 3%; width: 10%; height: 10%; border-radius: 50%; background: var(--color0);`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Trefoil', 6, 'Three equal lobes meeting at the centre of every cell, set out like tracery in a stone window.', (c) => ({
  vars: '',
  rule: `${F} { width: 46%; height: 46%; margin: 46% 27% 8% 27%; border-radius: 50%; background: ${ink(c)}; ${B(`left: -52%; top: -78%; width: 100%; height: 100%; border-radius: 50%; background: ${ink(c)};`)} ${A(`left: 52%; top: -78%; width: 100%; height: 100%; border-radius: 50%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '4x4' });

// ════════════════════════════════════════════════════════════════════════════
// E. Joinery, plates & angles
// ════════════════════════════════════════════════════════════════════════════

add('Foldout', 0, 'A sheet folded along one crease per cell, the fold tipping the other way with every row.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${A(`inset: 0; background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 100% 46%, 0 100%)')}`)} @match(@y % 2 == 1) { :after { ${cp('polygon(0 54%, 100% 0, 100% 100%, 0 100%)')} } } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Miter', 47, 'Mitred frame corners turning a quarter-turn per cell, so four cells complete a picture frame.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 100% 26%, 26% 26%, 26% 100%, 0 100%)')} ${rot('@pn(0deg, 90deg, 270deg, 180deg)')} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Dovetail', 12, 'Dovetail pins and tails alternating row by row, cut to interlock exactly across the joint.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 78% 100%, 22% 100%)')} @match(@y % 2 == 1) { ${cp('polygon(22% 0, 78% 0, 100% 100%, 0 100%)')} } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Halflap', 29, 'Half-lap joints: two flat bars stepping past one another by exactly half their length.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 0; top: 24%; width: 70%; height: 24%; background: ${ink(c)};`)} ${A(`left: 30%; top: 52%; width: 70%; height: 24%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Mortise', 3, 'A mortise cut square through each block, standing upright in one column and lying flat in the next.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${A(`left: 34%; top: 18%; width: 32%; height: 64%; background: var(--color0);`)} @match(@x % 2 == 1) { :after { left: 18%; top: 34%; width: 64%; height: 32%; } } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Tenon', 22, 'Tenons standing proud on all four faces, so each block keys straight into its neighbours.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 22%, 34% 22%, 34% 0, 66% 0, 66% 22%, 100% 22%, 100% 78%, 66% 78%, 66% 100%, 34% 100%, 34% 78%, 0 78%)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Gusset', 43, 'Triangular gusset plates with two rivets set on the same centres in every bay.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 0 100%)')} ${B(`left: 12%; top: 12%; width: 15%; height: 15%; border-radius: 50%; background: var(--color0);`)} ${A(`left: 44%; top: 12%; width: 15%; height: 15%; border-radius: 50%; background: var(--color0);`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Rafter', 18, 'One diagonal member per cell, meeting end to end into unbroken raking stripes.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 58%, 58% 0, 100% 0, 100% 42%, 42% 100%, 0 100%)')} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Truss', 34, 'A top chord with a triangulated web below it — the same truss bay repeated the length of the span.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 0; top: 8%; width: 100%; height: 11%; background: ${ink(c)};`)} ${A(`left: 0; top: 19%; width: 100%; height: 73%; background: ${ink(c)}; ${cp('polygon(0 100%, 44% 0, 56% 0, 100% 100%, 76% 100%, 50% 34%, 24% 100%)')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Splice', 39, 'Butt-jointed bars held by a fishplate at every joint, the splice landing on the same centre each time.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 0; top: 40%; width: 100%; height: 20%; background: ${ink(c)};`)} ${A(`left: 30%; top: 22%; width: 40%; height: 56%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Ratchet', 30, 'A ratchet rack: square teeth rising on the same pitch across the whole row.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 100%, 0 44%, 25% 44%, 25% 20%, 50% 20%, 50% 44%, 75% 44%, 75% 20%, 100% 20%, 100% 100%)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Keyway', 45, 'Keyholes slotted into solid plate, hanging from the top edge on one column and the bottom on the next.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${A(`left: 38%; top: 0; width: 24%; height: 58%; border-radius: 0 0 999px 999px; background: var(--color0);`)} @match(@x % 2 == 1) { :after { top: 42%; border-radius: 999px 999px 0 0; } } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

// ════════════════════════════════════════════════════════════════════════════
// F. Cloth & weave
// ════════════════════════════════════════════════════════════════════════════

add('Sateen', 23, 'A satin float landing every fifth cell along a fixed diagonal — the classic five-shaft sateen tie-up, laid over a ground that steps through the palette in order.', (c) => {
  const cycle = [];
  for (let i = 1; i <= c - 1; i++) cycle.push(`var(--color${i})`);
  return {
    vars: '',
    rule: `${F} { background: @pn(${cycle.join(', ')}); @match((@x + 2 * @y) % 5 == 0) { ${A(`inset: 24%; border-radius: 18%; background: ${ink(c)};`)} } }${TR}`,
  };
}, { grid: '8x12', tg: '6x6' });

add('Seersucker', 25, 'Seersucker stripes: flat bands and puckered bands alternating column by column, exactly as the loom sets them.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; @match(@x % 2 == 0) { ${A(`inset: 0; border-radius: 50% / 22%; background: ${ink(c)};`)} } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Grosgrain', 8, 'Grosgrain ribbon: broad horizontal ribs crossed by one fine warp thread, repeated without deviation.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${B(`left: 0; top: 26%; width: 100%; height: 48%; opacity: 0.55; background: ${ink(c)};`)} ${A(`left: 47%; top: 0; width: 6%; height: 100%; background: var(--color0);`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Ogee', 19, 'An ogee lattice — every tile rounded on one pair of opposite corners, flipping with the checker to draw the onion curve.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; border-radius: 100% 0 100% 0; @even { border-radius: 0 100% 0 100%; } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Brocade', 13, 'A brocade sprig: a small diamond pierced by an upright bar, set out on the strictest of repeats.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 14%; background: ${ink(c)}; ${cp('polygon(50% 0, 100% 50%, 50% 100%, 0 50%)')}`)} ${A(`left: 46%; top: 20%; width: 8%; height: 60%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Chambray', 4, 'Warp over weft: a coloured half laid across a tinted half, the two crossing in the corner of every cell.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${B(`left: 0; top: 0; width: 50%; height: 100%; background: ${ink(c)};`)} ${A(`left: 0; top: 50%; width: 100%; height: 50%; opacity: 0.62; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Purl', 26, 'Knit stitches: two rounded loops side by side in every cell, marching in even courses.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 3%; top: 8%; width: 45%; height: 84%; border-radius: 50% 50% 40% 40%; background: ${ink(c)};`)} ${A(`left: 52%; top: 8%; width: 45%; height: 84%; border-radius: 50% 50% 40% 40%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Cable', 16, 'Cable knit: two cords crossing at a fixed lean that reverses on every row.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 4%; top: 4%; width: 58%; height: 92%; border-radius: 999px; background: ${ink(c)}; ${rot('20deg')}`)} ${A(`left: 38%; top: 4%; width: 58%; height: 92%; border-radius: 999px; background: ${ink(c)}; ${rot('-20deg')}`)} @match(@y % 2 == 1) { :before { ${rot('-20deg')} } :after { ${rot('20deg')} } } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Piping', 11, 'Corded piping run along one edge of each panel, switching from hem to head with every row.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${A(`left: 0; top: 76%; width: 100%; height: 24%; border-radius: 999px; background: var(--color0);`)} @match(@y % 2 == 1) { :after { top: 0; } } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Buttonhole', 41, 'Worked buttonholes cut upright in one column and crosswise in the next, evenly spaced down the placket.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${A(`left: 30%; top: 14%; width: 40%; height: 72%; border-radius: 999px; background: var(--color0);`)} @match(@x % 2 == 1) { :after { left: 14%; top: 30%; width: 72%; height: 40%; } } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Tartan', 32, 'Tartan sett: a broad band across and a broad band down, overlapping into a darker square where they cross.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${B(`left: 0; top: 0; width: 100%; height: 46%; opacity: 0.78; background: ${ink(c)};`)} ${A(`left: 0; top: 0; width: 46%; height: 100%; opacity: 0.78; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Madras', 21, 'A light madras check — one narrow warp stripe and one narrow weft stripe per repeat, printed over each other.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${B(`left: 22%; top: 0; width: 15%; height: 100%; background: ${ink(c)};`)} ${A(`left: 0; top: 58%; width: 100%; height: 15%; mix-blend-mode: multiply; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

// ════════════════════════════════════════════════════════════════════════════
// G. Print, marks & measures
// ════════════════════════════════════════════════════════════════════════════

add('Gutter', 28, 'Two text columns with a clean gutter between them, the page grid repeated spread after spread.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 6%; top: 8%; width: 38%; height: 84%; background: ${ink(c)};`)} ${A(`left: 56%; top: 8%; width: 38%; height: 84%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Folio', 42, 'A page block ruled at the head with the folio number blocked in at the foot — the same furniture on every leaf.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${B(`left: 12%; top: 12%; width: 76%; height: 8%; background: var(--color0);`)} ${A(`left: 72%; top: 76%; width: 16%; height: 12%; background: var(--color0);`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Colophon', 37, 'A printer’s device centred on its rule: lozenge over line, struck once per cell.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 0; top: 46%; width: 100%; height: 8%; background: ${ink(c)};`)} ${A(`left: 38%; top: 26%; width: 24%; height: 48%; background: ${ink(c)}; ${cp('polygon(50% 0, 100% 50%, 50% 100%, 0 50%)')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Bullet', 5, 'A bulleted list set solid: dot, rule, and a short last line closing every third item.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 8%; top: 40%; width: 20%; height: 20%; border-radius: 50%; background: ${ink(c)};`)} ${A(`left: 36%; top: 44%; width: 56%; height: 12%; background: ${ink(c)};`)} @match(@x % 3 == 2) { :after { width: 32%; } } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Emdash', 27, 'Em rules and en rules alternating on a fixed count, set out like a line of dashes in cold type.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 8%; top: 44%; width: 84%; height: 12%; background: ${ink(c)};`)} @match(@x % 3 == 0) { :after { left: 32%; width: 36%; } } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Register', 20, 'Printer’s registration marks — a ring crossed by hairlines, dropped on every intersection of the sheet.', (c) => ({
  vars: '',
  rule: `${F} { width: 58%; height: 58%; margin: 21%; box-sizing: border-box; border-radius: 50%; border: ${px(14)} solid ${ink(c)}; ${B(`left: 46%; top: -34%; width: 8%; height: 168%; background: ${ink(c)};`)} ${A(`left: -34%; top: 46%; width: 168%; height: 8%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '4x4', sizing: { minCellPx: 32 } });

add('Overprint', 22, 'Two plates printed slightly out of register, the overlap darkening where the inks multiply.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 6%; top: 6%; width: 62%; height: 62%; background: ${ink(c)};`)} ${A(`left: 32%; top: 32%; width: 62%; height: 62%; mix-blend-mode: multiply; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Gauge', 15, 'Gauge tubes filling further with every row down the canvas — a whole scale read at a glance.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 26%; top: 6%; width: 48%; height: 88%; box-sizing: border-box; border: ${px(10)} solid ${ink(c)};`)} ${A(`left: 32%; top: @calc(88 - 78 * @y / @Y)%; width: 36%; height: @calc(78 * @y / @Y)%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '4x4', sizing: { minCellPx: 30 } });

add('Timecode', 29, 'Tick marks with a long one every fifth frame, running like a timecode strip along the edge of film.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 44%; top: 32%; width: 12%; height: 36%; background: ${ink(c)};`)} @match(@x % 5 == 1) { :after { top: 8%; height: 84%; } } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Punchcard', 31, 'Punched cards read in diagonal runs: every third position along the diagonal is struck through.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${A(`left: 24%; top: 34%; width: 52%; height: 32%; background: var(--color0);`)} @match((@x + @y) % 3 == 0) { :after { background: ${ink(c)}; } } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Docket', 46, 'Ruled docket lines — a full measure over a short one, the short line lengthening on alternate rows.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 10%; top: 26%; width: 80%; height: 10%; background: ${ink(c)};`)} ${A(`left: 10%; top: 54%; width: 48%; height: 10%; background: ${ink(c)};`)} @match(@y % 2 == 1) { :after { width: 68%; } } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Stub', 9, 'Ticket stubs with the perforation always in the same place, torn off along a straight line.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('inset(7% 3% round 12%)')} ${A(`left: 66%; top: 0; width: 6%; height: 100%; background: var(--color0);`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

// ════════════════════════════════════════════════════════════════════════════
// H. Ordered nature
// ════════════════════════════════════════════════════════════════════════════

add('Wheatear', 35, 'Ears of wheat: paired chevrons climbing a straight stem, one ear to a cell.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 46%; top: 0; width: 8%; height: 100%; background: ${ink(c)};`)} ${A(`left: 14%; top: 20%; width: 72%; height: 56%; background: ${ink(c)}; ${cp('polygon(0 0, 50% 40%, 100% 0, 100% 26%, 50% 66%, 0 26%)')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Cypress', 16, 'A planted avenue of cypress trees, tall and narrow in one column, low and broad in the next.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(50% 0, 76% 100%, 24% 100%)')} @match(@x % 2 == 1) { ${cp('polygon(50% 16%, 90% 100%, 10% 100%)')} } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Hedgerow', 17, 'A clipped hedge in even bays, each bay trimmed to one of two heights and no more.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 1%; top: 24%; width: 98%; height: 76%; border-radius: 60% 60% 0 0; background: ${ink(c)};`)} @match(@x % 2 == 1) { :after { top: 46%; border-radius: 50% 50% 0 0; } } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Imbricate', 14, 'Overlapping scales laid like roof tiles, every course stepped half a scale across.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 0; top: 0; width: 100%; height: 100%; border-radius: 0 0 50% 50%; background: ${ink(c)};`)} @match(@y % 2 == 1) { ${xf('translateX(50%)')} } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Papyrus', 36, 'Papyrus umbels: a straight stem opening into a fixed fan of rays, repeated the length of the bank.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 46%; top: 44%; width: 8%; height: 56%; background: ${ink(c)};`)} ${A(`left: 8%; top: 4%; width: 84%; height: 48%; background: ${ink(c)}; ${cp('polygon(50% 100%, 2% 6%, 16% 2%, 50% 62%, 84% 2%, 98% 6%)')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Sheaf', 44, 'Two stems leaning into each other at a fixed angle, bound into sheaves across the field.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 28%; top: 4%; width: 13%; height: 92%; background: ${ink(c)}; ${rot('-16deg')}`)} ${A(`left: 59%; top: 4%; width: 13%; height: 92%; background: ${ink(c)}; ${rot('16deg')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Tulip', 24, 'A bed of tulips set out in rows — one bloom, one stem, planted on the same spacing throughout.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 18%; top: 8%; width: 64%; height: 48%; border-radius: 50% 50% 42% 42%; background: ${ink(c)};`)} ${A(`left: 46%; top: 52%; width: 8%; height: 44%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Espalier', 7, 'Fruit trees trained flat against a wall: one horizontal wire, one upright limb, alternating side to side.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 0; top: 46%; width: 100%; height: 8%; background: ${ink(c)};`)} ${A(`left: 24%; top: 8%; width: 8%; height: 84%; background: ${ink(c)};`)} @match(@x % 2 == 1) { :after { left: 68%; } } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

// ════════════════════════════════════════════════════════════════════════════
// I. Ramps, weaves & optical order
// ════════════════════════════════════════════════════════════════════════════

add('Diminuendo', 18, 'A field of squares fading out row by row on a straight ramp, top to bottom, without a single step out of place.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 8%; opacity: @calc(0.14 + 0.86 * @y / @Y); background: ${ink(c)};`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Taper', 33, 'Squares growing steadily from left to right, each column exactly one step larger than the last.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; width: @calc(14 + 72 * @x / @X)%; height: @calc(14 + 72 * @x / @X)%; ${xf('translate(-50%, -50%)')} background: ${ink(c)};`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Torsion', 38, 'One square per cell, each turned a fixed fraction further than its neighbour, so the grid twists a full quarter-turn corner to corner.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 12%; background: ${ink(c)}; ${rot('@calc(90 * (@x + @y) / (@X + @Y))deg')}`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Cascade', 2, 'Blocks dropping in a four-step stair that resets every fourth column — a falling rhythm you can count.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 6%; top: 6%; width: 88%; height: 88%; background: ${ink(c)}; ${xf('translateY(@calc((@x % 4) * 14)%)')}`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Interlace', 10, 'A woven lattice where the crossing strand passes over on one square and under on the next.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 0; top: 34%; width: 100%; height: 32%; background: ${ink(c)};`)} ${A(`left: 34%; top: 0; width: 32%; height: 100%; background: ${ink(c)};`)} @even { :after { z-index: -1; } } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Shadowbox', 6, 'Flat squares each throwing the same hard offset shadow, so the whole field floats at one height.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 12%; top: 12%; width: 62%; height: 62%; background: ${ink(c)}; box-shadow: ${px(22)} ${px(22)} 0 ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '5x5', sizing: { minCellPx: 30 } });

add('Relief', 1, 'Tiles bevelled to catch the light the same way every time — a bright top edge, a shaded lower one.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${B(`inset: 0; opacity: 0.88; background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 82% 18%, 18% 18%, 18% 82%, 0 100%)')}`)} ${A(`inset: 0; opacity: 0.55; background: ${ink(c)}; ${cp('polygon(100% 0, 100% 100%, 0 100%, 18% 82%, 82% 82%, 82% 18%)')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Moire', 27, 'Two combs of fine bars leaning apart by a degree more in every column, beating into moiré across the canvas.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 22%; top: -20%; width: 11%; height: 140%; background: ${ink(c)}; ${rot('@calc(@x * 5)deg')}`)} ${A(`left: 62%; top: -20%; width: 11%; height: 140%; background: ${ink(c)}; ${rot('@calc(@x * -5)deg')}`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

export const batch6 = all;
