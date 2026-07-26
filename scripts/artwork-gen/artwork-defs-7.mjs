// Batch 7 — 200 motifs (gallery orders 700+).
//
// Where batch 6 was the *ordered* batch (nothing placed by a dice roll), batch
// 7 goes back to the hand-scattered feel of the eleven artworks Syung Hong
// drew by hand — Radius, Mixtape, Odessa, Symmetry, Veil, Blossom, Disque,
// Bloks, Terrain, Trigram and Ring (gallery orders 1–11). Those designs share
// a very particular way of working:
//
//   * one shape per cell, its outline rolled out of a small, deliberately
//     chosen library — four corner circles and a couple of triangles, not a
//     continuum;
//   * the roll is coarse. @pick over five clip paths, four rotations, three
//     heights. Nothing is sampled from a smooth range, so the field stays
//     legible as a set of *tiles* rather than dissolving into noise;
//   * the palette does the rest. A single --randomColor pick per cell, drawn
//     from the inks only, and a transition so a reseed morphs rather than
//     snaps;
//   * shapes are allowed to break their cell — Odessa's pills run two and
//     three rows tall, Ring's circles slide out from under each other — which
//     is what keeps a strict grid from reading as a grid.
//
// Section A (56 designs) is written directly against that vocabulary; each
// entry names the original it descends from. Sections B–M take the same
// machinery somewhere else: heraldry, mouldings, cloth, type, notation, the
// sky, survey drawings, minerals, botany, machined parts, folded paper and the
// tiling traditions.
//
// House rules (inherited from every earlier batch):
//   * every rule paints through exactly one @random(${shapeFrequency}) gate,
//     so the frequency slider always thins the field; nested @random(k) blocks
//     inside that gate are how a design varies itself (Blossom's trick);
//   * reseed variation rides on a transition-able, *sampled* property —
//     background-color, transform, clip-path, opacity, border — and every rule
//     ends in a transition, so a redraw morphs;
//   * a randomized custom prop read more than once goes through @var(--x)
//     (a plain var() re-rolls at every occurrence);
//   * nothing paints var(--color0). Batch 6 established that a hole knocked
//     out in the background color is a fake hole — set the background slot to
//     transparent and it stops erasing anything. Every gap here is real
//     geometry: a clip-path hole, a mask, a border, or a gap between two
//     elements. generate-batch7.mjs enforces this, and validate-batch7.mjs
//     re-renders the whole batch over a checkerboard to prove it.

const isDark = (hex) => {
  const m = /^#([0-9a-f]{6})/i.exec(hex);
  if (!m) return false;
  const n = parseInt(m[1], 16);
  return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255 < 0.5;
};

// Ink picker over color1..color(c-1) (color0 is the background — never painted).
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
const msk = (v) => `-webkit-mask: ${v}; mask: ${v};`;
const B = (css) => `:before { content: ''; position: absolute; ${css}${pt} }`;
const A = (css) => `:after { content: ''; position: absolute; ${css}${pt} }`;

const R2 = '@pick(0deg, 90deg)';
const R4 = '@pick(0deg, 90deg, 180deg, 270deg)';
const R8 = '@pick(0deg, 45deg, 90deg, 135deg, 180deg, 225deg, 270deg, 315deg)';

// The two ToggleSwitch options the originals ship (Radius/Mixtape/Bloks have a
// Shadow switch, Trigram a Rounded Corners one). A design opts in by putting
// the token in its rule and setting `shadow` / `round` in its cfg.
const SHADOW = '${shadow}';
const ROUND = '${round}';

// ── the originals' own shape library ───────────────────────────────────────
// Radius picks between four corner circles and a centred one; Mixtape adds the
// four half-square triangles. Section A draws from the same short list rather
// than inventing a new outline per cell.
const CORNER = 'circle(100% at 0 0), circle(100% at 100% 0), circle(100% at 100% 100%), circle(100% at 0 100%)';
const TRI = 'polygon(0 0, 100% 0, 100% 100%), polygon(0 0, 100% 0, 0 100%), polygon(0 0, 100% 100%, 0 100%), polygon(100% 0, 100% 100%, 0 100%)';
const HALF = 'circle(50% at 50% 100%), circle(50% at 50% 0), circle(50% at 0 50%), circle(50% at 100% 50%)';

// ── real holes, not painted-over ones ──────────────────────────────────────
// A polygon whose outer ring runs clockwise and whose inner ring runs
// counter-clockwise, joined by a zero-width slit: under the nonzero fill rule
// the inner ring is a genuine hole, so whatever sits behind the canvas shows
// through it.
const P = (pts) => pts.map(([x, y]) => `${(+x).toFixed(1)}% ${(+y).toFixed(1)}%`).join(', ');
const poly = (pts) => `polygon(${P(pts)})`;
const withHole = (inner) =>
  `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, ${P(inner)}, ${P([inner[0]])})`;

// Centred rectangular hole inset `x`% horizontally and `y`% vertically.
const rectHole = (x, y) => [
  [x, y],
  [x, 100 - y],
  [100 - x, 100 - y],
  [100 - x, y],
];

// Centred round hole of radius `r`% (counter-clockwise, so it stays a hole).
const roundHole = (r, steps = 28) =>
  Array.from({ length: steps }, (_, i) => {
    const a = (-2 * Math.PI * i) / steps;
    return [50 + r * Math.cos(a), 50 + r * Math.sin(a)];
  });

// Centred slot with semicircular ends (upright).
const stadiumHole = (x, y, steps = 10) => {
  const rx = 50 - x;
  const top = y + rx;
  const bottom = 100 - y - rx;
  const pts = [[50 - rx, top]];
  for (let i = 0; i <= steps; i++) {
    const a = Math.PI - (Math.PI * i) / steps;
    pts.push([50 + rx * Math.cos(a), bottom + rx * Math.sin(a)]);
  }
  for (let i = 0; i <= steps; i++) {
    const a = -(Math.PI * i) / steps;
    pts.push([50 + rx * Math.cos(a), top + rx * Math.sin(a)]);
  }
  return pts;
};

// Centred diamond hole, half-diagonals `x`/`y` percent of the cell.
const diamondHole = (x, y) => [
  [50, 50 - y],
  [50 - x, 50],
  [50, 50 + y],
  [50 + x, 50],
];

// Lay a hole on its side. Swapping x/y mirrors the ring, which flips its
// winding, so the point order has to be reversed to keep it a hole.
const transposeRing = (pts) => pts.map(([x, y]) => [y, x]).reverse();

// A square with a quarter-circle bite taken out of one corner. A single closed
// loop, so the winding doesn't matter and mirroring is free.
const coveBite = (r, corner = 'tl', steps = 14) => {
  const pts = [[100, 0], [100, 100], [0, 100], [0, r]];
  for (let i = 0; i <= steps; i++) {
    const a = (Math.PI / 2) * (i / steps);
    pts.push([r * Math.sin(a), r * Math.cos(a)]);
  }
  const flipX = corner === 'tr' || corner === 'br';
  const flipY = corner === 'bl' || corner === 'br';
  return poly(pts.map(([x, y]) => [flipX ? 100 - x : x, flipY ? 100 - y : y]));
};

// ── regular figures ────────────────────────────────────────────────────────
const ngon = (n, phase = -90, r = 50) =>
  poly(
    Array.from({ length: n }, (_, i) => {
      const a = ((phase + (360 * i) / n) * Math.PI) / 180;
      return [50 + r * Math.cos(a), 50 + r * Math.sin(a)];
    })
  );

const starPoly = (n, inner = 0.42, phase = -90) =>
  poly(
    Array.from({ length: 2 * n }, (_, i) => {
      const r = (i % 2 ? inner : 1) * 50;
      const a = ((phase + (180 * i) / n) * Math.PI) / 180;
      return [50 + r * Math.cos(a), 50 + r * Math.sin(a)];
    })
  );

// A cog outline: `teeth` square teeth standing off a hub of radius `hub`%.
const cogPoly = (teeth, hub = 32, tip = 48, duty = 0.5) => {
  const pts = [];
  for (let i = 0; i < teeth; i++) {
    const a0 = (2 * Math.PI * i) / teeth;
    const a1 = a0 + ((2 * Math.PI) / teeth) * duty;
    const a2 = a0 + (2 * Math.PI) / teeth;
    pts.push([50 + hub * Math.cos(a0), 50 + hub * Math.sin(a0)]);
    pts.push([50 + tip * Math.cos(a0), 50 + tip * Math.sin(a0)]);
    pts.push([50 + tip * Math.cos(a1), 50 + tip * Math.sin(a1)]);
    pts.push([50 + hub * Math.cos(a1), 50 + hub * Math.sin(a1)]);
    pts.push([50 + hub * Math.cos(a2), 50 + hub * Math.sin(a2)]);
  }
  return poly(pts);
};

// A greek cross whose arms are `t`% of the cell wide.
const crossPoly = (t) => {
  const a = 50 - t / 2;
  const b = 50 + t / 2;
  return poly([
    [a, 0], [b, 0], [b, a], [100, a], [100, b], [b, b],
    [b, 100], [a, 100], [a, b], [0, b], [0, a], [a, a],
  ]);
};

// A chevron pointing up, `t`% thick.
const chevronPoly = (t = 36) =>
  poly([[50, 0], [100, 50], [100, 50 + t], [50, t], [0, 50 + t], [0, 50]]);

// A vesica / lens: two circular arcs meeting at the top and bottom edges,
// bulging `w`% either side of the centreline.
const lensPoly = (w = 30, steps = 18) => {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = (Math.PI * i) / steps;
    pts.push([50 + w * Math.sin(t), 50 - 50 * Math.cos(t)]);
  }
  for (let i = 0; i <= steps; i++) {
    const t = (Math.PI * i) / steps;
    pts.push([50 - w * Math.sin(t), 50 + 50 * Math.cos(t)]);
  }
  return poly(pts);
};

// A band along the bottom edge whose top is `n` semicircular bumps `h`% tall.
const scallops = (n, h = 60, steps = 10) => {
  const pts = [[0, 100]];
  for (let k = 0; k < n; k++) {
    for (let i = 0; i <= steps; i++) {
      const t = (Math.PI * i) / steps;
      pts.push([((k + (1 - Math.cos(t)) / 2) * 100) / n, 100 - h * Math.sin(t)]);
    }
  }
  pts.push([100, 100]);
  return poly(pts);
};

// Slide a ring's points without changing its winding.
const shift = (pts, dx, dy) => pts.map(([x, y]) => [x + dx, y + dy]);

// A voided figure: `outer` (clockwise) with `inner` (counter-clockwise) cut
// out of it as a genuine hole.
const ringPoly = (outer, inner) =>
  `polygon(${P(outer)}, ${P([outer[0]])}, ${P(inner)}, ${P([inner[0]])})`;

const DIAMOND = [[50, 0], [100, 50], [50, 100], [0, 50]];
const SQUARE = [[0, 0], [100, 0], [100, 100], [0, 100]];

// ── masks that cut real gaps ───────────────────────────────────────────────
// A ring with a genuinely transparent bore: the fill stays a plain,
// transition-able background-color and the mask cuts the hole.
const ringMask = (bore) =>
  msk(`radial-gradient(circle closest-side at 50% 50%, transparent ${bore}, #000 ${bore})`);

// Concentric rings, `n` of them, cut out of whatever the element paints.
// Pass `at` to throw the centre off-axis (`farthest-side` then keeps the
// outermost ring covering the whole element).
const zoneMask = (n, at = null) => {
  const stops = [];
  const step = 100 / (2 * n);
  for (let i = 0; i < 2 * n; i++) {
    stops.push(`${i % 2 ? 'transparent' : '#000'} ${(i * step).toFixed(2)}% ${((i + 1) * step).toFixed(2)}%`);
  }
  const extent = at ? `farthest-side at ${at}` : 'closest-side at 50% 50%';
  return msk(`radial-gradient(circle ${extent}, ${stops.join(', ')})`);
};

// Hard-edged stripes cut out of whatever the element paints: `on` inks,
// then the strip up to `off` is cut away, repeating along `angle`.
const slotMask = (angle, on, off) =>
  msk(`repeating-linear-gradient(${angle}, #000 0 ${on}, transparent ${on} ${off})`);

// A square grid of holes — the mask keeps ink everywhere except the dots.
const perforate = (r, period) =>
  msk(`radial-gradient(circle at 50% 50%, transparent ${r}, #000 ${r}) 0 0 / ${period} ${period}`);

// ── palette bank ───────────────────────────────────────────────────────────
// color0 = background. Spans neon, jewel, earth, pastel, mono, retro and
// forest families so the gallery stays varied; palettes may repeat across
// designs (they are different artworks).
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
  // Twenty new colorways mixed in for this batch.
  ['#101820', '#FEE715', '#F2F2F2', '#8A8D91', '#00A6A6', '#FF6B35'],
  ['#FDF0D5', '#003049', '#C1121F', '#780000', '#669BBC', '#8D99AE'],
  ['#1A1A2E', '#16213E', '#0F3460', '#E94560', '#F5F5F5', '#53BF9D'],
  ['#F7F7FF', '#2D3142', '#4F5D75', '#BFC0C0', '#EF8354', '#3D5A80'],
  ['#221E22', '#EFD9CE', '#DEC0F1', '#B79CED', '#957FEF', '#7161EF'],
  ['#FFF3B0', '#335C67', '#E09F3E', '#9E2A2B', '#540B0E', '#2E4057'],
  ['#0B132B', '#1C2541', '#3A506B', '#5BC0BE', '#6FFFE9', '#F2F4F3'],
  ['#F6F4D2', '#3E5622', '#F19C79', '#A44A3F', '#8FA96B', '#CBDFBD'],
  ['#2C061F', '#DF57BC', '#F7B5CA', '#F9F9F9', '#FFBF69', '#8E44AD'],
  ['#EAE0CC', '#1B1B1E', '#C6AC8F', '#5E503F', '#A9927D', '#EB5E28'],
  ['#04030F', '#3D0E61', '#7B2CBF', '#C77DFF', '#E0AAFF', '#FAF0FF'],
  ['#FFFFFC', '#BEB7A4', '#FF7F11', '#FF3F00', '#1B1B1E', '#3A7CA5'],
  ['#0F1A20', '#F4D35E', '#EE964B', '#F95738', '#EFE6DD', '#4C8FBD'],
  ['#F3F9D2', '#274001', '#8AA624', '#547326', '#BDD358', '#C9A227'],
  ['#181818', '#EC4E20', '#FF9505', '#016FB9', '#FFFFFF', '#C2E7DA'],
  ['#FAEFE0', '#E56399', '#7F96FF', '#5FA8B5', '#320A28', '#DE6B48'],
  ['#01161E', '#124559', '#598392', '#AEC3B0', '#EFF6E0', '#F4B860'],
  ['#FFF8E7', '#D62828', '#F77F00', '#FCBF49', '#003049', '#3E8FB0'],
  ['#191D32', '#282F44', '#8A5B78', '#B3679B', '#E5D0CC', '#F2C9E1'],
  ['#F5F3F4', '#0B090A', '#BA181B', '#E5383B', '#660708', '#A4161A'],
];

// Every motif name used anywhere in the project so far — the shipped artworks,
// the gallery thumbnail table and batches 1–6's definition files (including
// entries that were trimmed before shipping). add() refuses to reuse one.
const TAKEN = new Set(
  (
    'abacus acorn amphora annulus aperture arcade argyle arrow arrowplay ' +
    'ascent aster asterisk aurora awning azulejo balloon barcode bargello ' +
    'barline basalt basket baste battlement bauhaus beadrow bee bento berry ' +
    'bevel beveled bezel bias billow bloks bloom blossom bobbin bokeh bolt ' +
    'bond bowl bowtie boxweave bracket bracketpair bramble brickwork ' +
    'brokenbond bubble bubbles bud bulge bunting buoy burgee button ' +
    'buttonhole cairn caltrop caneweave capsule caret carousel cartouche ' +
    'cattail caustic celleye chaff chalice chamfer checkers checkmark ' +
    'chevarrow chevrondiamond chime cinch circuit cirrus citrus cleat clover ' +
    'cog coil cointile comb comet compass confetti constellation convex coral ' +
    'cornerpunch cove crater crazy crescendo crescent cresset crossbar ' +
    'crosshair crosshatch crosslet crux crystal cube cumulus curl cusp damier ' +
    'dapple dart daybreak delta diadem diadot dial diamond3d diamonddust ' +
    'diamondeye diamondframe diaper diminuendo discus disque dogtooth dome ' +
    'domino dotdash dotwave doubinset draughts driftleaf drizzle dune echo ' +
    'edgeband elbow ell emboss enso eyelet facade facetbox facetdiamond ' +
    'facetgrad fang fanlight fin fishscale flagstone flight flutter foliage ' +
    'fourpane frame frameblock freckle frond fuzz gable gablet gem gemcut ' +
    'gibbous gingham glint glitch glyph grain granule grassblade gridline ' +
    'gumball gutter halfblock halfdot halfink halfpenny halftone halo ' +
    'harlequin hashmark hatch heart herringbone hexagram hexbloom hexdot ' +
    'hexnut hextile hoop hopscotch hourglass hurdle ibeam impasto incense ' +
    'inkblot inset insetstep iris isocube ivy jelly jewel junction kasuri ' +
    'kerf keyhole keypad keywork kilim kintsugi kite koi ladybird lantern ' +
    'lattice laundry ledger lens levels lily links lintel lobe logcabin ' +
    'loophole lotus louvre lozenge lozengegrad lune lunette macaron maltese ' +
    'mandorla massif matchstick matte maze meadow medusa memphis meridian ' +
    'merlon mesh metro mirror misprint mistwave mixtape monolith moonphase ' +
    'morse mortise mosaicglass mosaictile mote mudcloth needle neon northstar ' +
    'notch notchbar notchblock octagon octant odessa offset offsetbox ogee ' +
    'orb orbit origami ovolo paisley palmette parquet passepartout patina ' +
    'pavers pebble pebbledot pediment pellet pendulum pennant pennantbox ' +
    'pennon penta pentafan petal picket pinhex pinhole pinion pinmark ' +
    'pinnacle pinnate pinweave pinwheel pinwheelstar pinwheeltile ' +
    'pinwheelweave pip pixel plaid plasma pleat plumb plus pod polaroid polka ' +
    'polkapair pompom pondring popsicle portal postage posy prisma prismfold ' +
    'prow pulsar pulsebar pyramid pyramid3d quadrant quadrille quarterbar ' +
    'quarterblock quartz quasar quaver quilt quiltsquare quincunx quoit radar ' +
    'radius rafter rail rainbow raindrop rake range regatta rhomboid ' +
    'ribbonfold ricrac ring ringdot ringlink ripple rondure roundel rune ' +
    'rungs saguaro sail saltire sash sawedge scale scallop scatterdot sector ' +
    'seigaiha sequin sextant shard shelf shibori shield shoji shuffle sigil ' +
    'signal sine sixstar skew slant slat sliver snowflake sonata spark ' +
    'sparkle spearhead spectrum spiralblock spire splat splithz splittri ' +
    'spore sprig sprinkles sprocket sprout stackbond star5 starflake starlet ' +
    'stave stella step step3d stipple stitch strata sunburst sunken sunwheel ' +
    'swellbox switchback symmetry tag tally taper target tatami tee tendril ' +
    'terrain tesserae tetro thistle tickmark tictac tilt torsion trace ' +
    'trackline trapeze trapezoid trellis trianglet triband trigram triquetra ' +
    'trishard truchet tube tumble tweed twill twinkle vee veil venn vinyl ' +
    'vitrail voltage wander warp wash wavelet weave weft wheelarc wicket ' +
    'windowframe windowpane wingtri zagtile zee ziggurat ziggy zigline ' +
    'zigzagfold zipper'
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

let order = 700;
const all = [];

// cfg:
//   grid   default "columns x rows" for the editor       (default '8x12')
//   freq   default frequency                             (default 1)
//   tg/tf  gallery-thumbnail grid / frequency            (default '5x5' / 1)
//   min    sizing.minCellPx floor, for px-scaled details
//   shadow adds the originals' Shadow toggle; the rule must use ${shadow}
//   round  adds the originals' Rounded Corners toggle; rule must use ${round}
const add = (name, palIdx, description, build, cfg = {}) => {
  const slug = name.toLowerCase();
  if (!/^[a-z][a-z0-9]*$/.test(slug)) throw new Error(`bad slug: ${slug}`);
  if (RESERVED.has(slug)) throw new Error(`slug is a reserved word: ${slug}`);
  if (TAKEN.has(slug)) throw new Error(`slug already taken elsewhere: ${slug}`);
  if (all.some((d) => d.slug === slug)) throw new Error(`duplicate slug in batch 7: ${slug}`);
  const palette = PAL[palIdx % PAL.length];
  const c = palette.length;
  const { vars, rule } = build(c);
  const code = `${vars} ${rule}`;
  if (/var\(\s*--color0\s*\)/.test(code)) {
    throw new Error(
      `${slug}: painting var(--color0) breaks on a transparent background — cut the shape instead`
    );
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
    ...(cfg.min ? { minCellPx: cfg.min } : {}),
    ...(cfg.shadow === undefined ? {} : { shadow: cfg.shadow }),
    ...(cfg.round === undefined ? {} : { round: cfg.round }),
    thumb: { grid: cfg.tg ?? '5x5', frequency: cfg.tf ?? 1 },
    vars,
    rule,
  });
};

// ════════════════════════════════════════════════════════════════════════════
// A. The human line — 56 designs written against the vocabulary of the eleven
//    hand-drawn originals. Each block names the artwork it descends from and
//    keeps that artwork's way of working: a coarse @pick over a short shape
//    library, one ink sampled per cell, and a transition so a reseed morphs.
// ════════════════════════════════════════════════════════════════════════════

// ── after Radius — four corner circles and a centred one, rolled per cell ───

add('Quarterfall', 3, 'Radius hollowed out: the same rolled quarter-discs, but half of them keep only their outer band, so filled corners and open ones fall through the grid together.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('circle(100% at 0 0)')} ${rot('@var(--rot)')} @random(0.5) { ${msk('radial-gradient(circle farthest-side at 0% 0%, transparent 54%, #000 54%)')} } ${SHADOW} }${TR}`,
}), { grid: '6x9', tg: '4x4', shadow: false });

add('Cornerbite', 51, 'Full squares with a quarter-circle bitten out of one corner — a deep bite on most, a shallow nick on the rest, the corner rolling a quarter turn at a time.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp(coveBite(66, 'tl'))} ${rot('@var(--rot)')} @random(0.35) { ${cp(coveBite(30, 'tl'))} } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Fanleaf', 24, 'A quarter-fan with a second, smaller fan struck from the same corner, so each cell reads as two nested sweeps of the compass.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`inset: 0; background: ${ink(c)}; ${cp('circle(100% at 0 100%)')}`)} ${A(`inset: 0; background: ${ink(c)}; ${cp('circle(58% at 0 100%)')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '4x4' });

add('Pieslice', 9, 'Discs cut into quarters, halves and three-quarters, each slice spun to one of eight bearings.', (c) => ({
  vars: '',
  rule: `--rot: ${R8}; ${F} { width: 88%; height: 88%; margin: 6%; border-radius: 50%; background: ${ink(c)}; ${cp('@pick(polygon(50% 50%, 50% 0, 100% 0, 100% 50%), polygon(50% 50%, 50% 0, 100% 0, 100% 100%, 50% 100%), polygon(50% 50%, 50% 0, 100% 0, 100% 100%, 0 100%, 0 50%), polygon(0 0, 100% 0, 100% 100%, 0 100%))')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '4x4' });

add('Waning', 40, 'Full moons losing their light: a disc with a second disc swung across it, the shadow landing on a different quarter each cell.', (c) => ({
  vars: '',
  rule: `${F} { width: 86%; height: 86%; margin: 7%; border-radius: 50%; background: ${ink(c)}; ${msk('radial-gradient(circle farthest-side at @pick(84%, 16%, 50%, 50%) @pick(50%, 50%, 84%, 16%), transparent 52%, #000 52%)')} }${TR}`,
}), { grid: '6x9', tg: '4x4' });

add('Lentil', 18, 'Vesicas — the almond where two circles overlap — standing upright or lying flat, a few of them squeezed to a sliver.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp(lensPoly(32))} ${rot('@var(--rot)')} @random(0.3) { ${cp(lensPoly(14))} } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Fleck', 29, 'Radius shrunk to confetti: small discs parked on one of nine positions in the cell, at three sizes, so the field speckles instead of tiling.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`@size: @pick(30%, 46%, 62%); left: @pick(6%, 30%, 54%); top: @pick(6%, 30%, 54%); border-radius: 50%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Chip', 12, 'Squares with two opposite corners knocked off, a few left whole — the chamfer turning a quarter at a time.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(34% 0, 100% 0, 100% 66%, 66% 100%, 0 100%, 0 34%)')} ${rot('@var(--rot)')} @random(0.35) { ${cp('polygon(0 0, 100% 0, 100% 100%, 0 100%)')} } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

// ── after Mixtape — a wider shape library, plus a struck-through minority ───

add('Shatter', 33, "Mixtape's whole library at once — corner circles, half-square triangles, a centred disc — and one cell in five raked through with cut slots.", (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp(`@pick(${CORNER}, ${TRI}, circle(50% at 50% 50%))`)} @random(0.2) { ${slotMask('45deg', '7%', '17%')} } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Splinter', 44, 'Long, off-centre triangles — the same half-square idea pushed until the shapes read as shards rather than tiles.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('@pick(polygon(0 0, 100% 0, 50% 100%), polygon(0 0, 32% 0, 100% 100%), polygon(68% 0, 100% 0, 0 100%), polygon(0 0, 100% 0, 0 100%))')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Jumble', 8, 'Squares, discs and triangles thrown together at three sizes and four turns — the loosest reading of the grid in the batch.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; @size: @pick(48%, 72%, 96%); ${xf(`translate(-50%, -50%) rotate(${R4})`)} background: ${ink(c)}; ${cp('@pick(circle(50% at 50% 50%), polygon(0 0, 100% 0, 100% 100%, 0 100%), polygon(50% 0, 100% 100%, 0 100%))')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Scramble', 19, 'Each square gives up one of its four quadrants, so the field reads as a wall of L-shapes turning every which way.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('@pick(polygon(0 0, 50% 0, 50% 50%, 100% 50%, 100% 100%, 0 100%), polygon(0 0, 100% 0, 100% 50%, 50% 50%, 50% 100%, 0 100%), polygon(50% 0, 100% 0, 100% 100%, 0 100%, 0 50%, 50% 50%), polygon(0 0, 100% 0, 100% 100%, 50% 100%, 50% 50%, 0 50%))')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Riffle', 55, 'Two cards springing apart in opposite directions, caught mid-shuffle.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 8%; top: 14%; width: 46%; height: 72%; background: ${ink(c)}; ${rot('@pick(-16deg, -7deg)')}`)} ${A(`left: 46%; top: 14%; width: 46%; height: 72%; background: ${ink(c)}; ${rot('@pick(16deg, 7deg)')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Cascade', 34, 'A three-tread staircase cut from every square, the flight turning to face a new quarter each cell.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(0 0, 34% 0, 34% 34%, 67% 34%, 67% 67%, 100% 67%, 100% 100%, 0 100%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

// ── after Veil — half-square triangles, dense, with the cell as the unit ────

add('Sliptile', 1, "Veil's triangles knocked a step out of true: most sit in their cell, the rest slide a fixed fraction off it, so the seams break.", (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp(`@pick(${TRI})`)} ${xf('translate(@pick(0%, 0%, 14%, -14%), @pick(0%, 0%, 14%, -14%))')} }${TR}`,
}), { grid: '10x15', tg: '8x8' });

add('Skewblock', 22, 'Parallelograms leaning one way or the other, packing into a field that shears as you read across it.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(26% 0, 101% 0, 75% 101%, 0 101%)')} ${xf('scaleX(@pick(1, -1))')} }${TR}`,
}), { grid: '10x15', tg: '8x8' });

add('Blockfall', 47, 'Halves and quarters of the cell, dropped into one corner or spread full width — a rough mosaic that never quite lines up.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`width: @pick(101%, 50%); height: @pick(101%, 50%); left: @pick(0%, 50%); top: @pick(0%, 50%); background: ${ink(c)};`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Drift', 26, 'Triangles all leaning the same way within a row and flipping on the next, with the odd contrary tile drifting through.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 101% 0, 0 101%)')} @match(@y % 2 == 1) { ${cp('polygon(101% 0, 101% 101%, 0 101%)')} } @random(0.28) { ${cp('polygon(0 0, 101% 0, 101% 101%)')} } }${TR}`,
}), { grid: '10x15', tg: '8x8' });

add('Flurry', 13, 'A snow of small triangles at three sizes, each tipped to a different quarter and parked off-centre.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`@size: @pick(40%, 62%, 88%); left: @pick(4%, 26%); top: @pick(4%, 26%); background: ${ink(c)}; ${cp('polygon(50% 0, 100% 100%, 0 100%)')} ${rot(R4)}`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

// ── after Odessa — pills that run one, two or three cells long ──────────────

add('Pylon', 32, 'Flat-topped towers standing one to four cells tall, overlapping into a skyline.', (c) => ({
  vars: '',
  rule: `${F} { width: 56%; margin-left: 22%; height: @pick(100%, 200%, 300%, 400%); background: ${ink(c)}; }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Obelisk', 45, 'Tapered shafts of one, two or three cells, each narrowing to a flat top.', (c) => ({
  vars: '',
  rule: `${F} { width: 74%; margin-left: 13%; height: @pick(100%, 200%, 300%); background: ${ink(c)}; ${cp('polygon(32% 0, 68% 0, 100% 100%, 0 100%)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Silo', 16, 'Round-topped columns of varying height, packed shoulder to shoulder.', (c) => ({
  vars: '',
  rule: `${F} { width: 78%; margin-left: 11%; height: @pick(100%, 200%, 300%); background: ${ink(c)}; border-radius: 999px 999px 0 0; }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Squall', 21, "Odessa's pills laid on their side: capsules running one, two or three cells across, stacking into gusts.", (c) => ({
  vars: '',
  rule: `${F} { height: 62%; margin-top: 19%; width: @pick(100%, 200%, 300%); background: ${ink(c)}; border-radius: 999px; }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Spill', 53, 'Tall capsules chopped into segments by clean cut gaps, so a three-cell run reads as a run of beads.', (c) => ({
  vars: '',
  rule: `${F} { width: 62%; margin-left: 19%; height: @pick(100%, 200%, 300%); background: ${ink(c)}; border-radius: 999px; ${slotMask('0deg', '26%', '32%')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

// ── after Blossom — petals and lobed figures, varied by nested rolls ────────

add('Corolla', 25, 'Five-lobed flower heads with the odd three-lobed one among them, each turned a quarter at a time.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; @shape: clover 5; @random(0.35) { @shape: clover 3; } ${rot(R4)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Wreath', 39, 'Scalloped rings — a lobed outer edge with the middle bored clean out.', (c) => ({
  vars: '',
  rule: `${F} { width: 92%; height: 92%; margin: 4%; background: ${ink(c)}; @shape: bud 8; ${ringMask('54%')} ${rot(R8)} }${TR}`,
}), { grid: '6x9', tg: '4x4' });

add('Froth', 6, 'Bubbles crowding each other two to a cell, each pair a different size and offset.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`@size: @pick(52%, 68%); left: @pick(2%, 14%); top: @pick(6%, 26%); border-radius: 50%; background: ${ink(c)};`)} ${A(`@size: @pick(38%, 54%); right: @pick(4%, 18%); bottom: @pick(4%, 20%); border-radius: 50%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Eddy', 14, "Blossom's hypocycloids — three-, four- and five-cusped curves — spun to eight bearings.", (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; @shape: hypocycloid 3; @random(0.5) { @shape: hypocycloid 4; } @random(0.25) { @shape: hypocycloid 5; } ${rot(R8)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Vortex', 30, 'Windmill blades curling out of every cell, half of them mirrored so the field turns both ways at once.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; --flip: @pick(1, -1); ${F} { background: ${ink(c)}; @shape: windmill; ${xf('rotate(@var(--rot)) scaleX(@var(--flip))')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Churn', 43, 'A trefoil inside a trefoil, the inner one rotated off the outer so the lobes never agree.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`inset: 3%; background: ${ink(c)}; @shape: clover 3;`)} ${A(`inset: 27%; background: ${ink(c)}; @shape: clover 3; ${rot('60deg')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

// ── after Disque — half-discs pinned to a rolled edge ───────────────────────

add('Halfmoon', 7, 'Half-discs pinned to one of the four edges, with the occasional full moon among them.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 0; background: ${ink(c)}; ${cp(`@pick(${HALF})`)}`)} @random(0.22) { :after { ${cp('circle(46% at 50% 50%)')} } } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Sickle', 32, 'Crescents cut by swinging a second disc through a half-moon, leaving a blade of colour on the rim.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${A(`inset: 0; background: ${ink(c)}; ${cp('circle(50% at 50% 100%)')} ${msk('radial-gradient(circle farthest-side at 50% 130%, transparent 47%, #000 47%)')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Teardrop', 10, 'Drops falling in every direction, each one a circle drawn to a point.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; @shape: drop; ${rot(R8)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Surf', 42, 'Half-discs nested inside half-discs, breaking against a rolled edge.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`inset: 0; background: ${ink(c)}; ${cp('circle(50% at 50% 100%)')}`)} ${A(`inset: 0; background: ${ink(c)}; ${cp('circle(27% at 50% 100%)')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Shoal', 20, 'Rows of scallops shoaling along one edge, three or five bumps to the cell.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${A(`inset: 0; background: ${ink(c)}; ${cp(scallops(2, 58))}`)} @random(0.4) { :after { ${cp(scallops(4, 34))} } } ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

// ── after Bloks — turned blocks and domes, under the Shadow switch ──────────

add('Cupola', 17, 'Domed blocks turning to face all four quarters, lifted off the ground by a soft shadow.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; border-radius: 100% 100% 0 0; ${rot('@var(--rot)')} ${SHADOW} }${TR}`,
}), { grid: '6x9', tg: '5x5', shadow: true });

add('Turret', 4, 'Crenellated blocks — three merlons cut clean out of the top edge — rotating a quarter turn at a time.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${A(`inset: 6%; background: ${ink(c)}; ${cp('polygon(0 34%, 22% 34%, 22% 0, 39% 0, 39% 34%, 61% 34%, 61% 0, 78% 0, 78% 34%, 100% 34%, 100% 100%, 0 100%)')} ${SHADOW}`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', shadow: false });

add('Cobble', 41, 'Rounded setts at three sizes, each one shadowed so the paving reads as laid rather than printed.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; @size: @pick(60%, 80%, 96%); ${xf('translate(-50%, -50%)')} border-radius: 28%; background: ${ink(c)}; ${SHADOW}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5', shadow: true });

add('Gravel', 28, 'Small squares tipped to a handful of angles and sizes, packed close like screened stone.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; @size: @pick(34%, 50%, 66%); ${xf('translate(-50%, -50%) rotate(@pick(0deg, 24deg, 48deg, 72deg))')} background: ${ink(c)};`)} }${TR}`,
}), { grid: '10x15', tg: '8x8' });

add('Shingle', 35, 'Round-bottomed tiles hung in overlapping courses, each course stepped half a tile across.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: @pick(-26%, 26%); top: 0; width: 100%; height: 100%; border-radius: 0 0 46% 46%; background: ${ink(c)}; ${SHADOW}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5', shadow: true });

// ── after Terrain — small marks over a ruled ground ─────────────────────────

add('Talus', 46, 'Scree: triangles and diamonds of scattered size tumbling over a faintly ruled slope.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; @size: calc(@rand(10px, 34px) * 6 / @size-col); ${xf('translate(-50%, -50%) rotate(@pick(0deg, 45deg))')} background: ${ink(c)}; ${cp('@pick(polygon(50% 0, 100% 100%, 0 100%), polygon(50% 0, 100% 50%, 50% 100%, 0 50%))')}`)} @random(0.45) { -webkit-box-shadow: 0 -1px 0 ${ink(c)}; box-shadow: 0 -1px 0 ${ink(c)}; } }${TR}`,
}), { grid: '6x9', tg: '5x5', min: 36 });

add('Silt', 11, 'The finest grade: pinhead dots settling over a ground ruled in both directions.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; @size: calc(@rand(4px, 16px) * 6 / @size-col); ${xf('translate(-50%, -50%)')} border-radius: 50%; background: ${ink(c)};`)} @random(0.5) { -webkit-box-shadow: -1px 0 0 ${ink(c)}; box-shadow: -1px 0 0 ${ink(c)}; } }${TR}`,
}), { grid: '10x15', tg: '8x8', min: 30 });

add('Sandbar', 49, 'Low bars of drifted sand banking up against one edge or the other, over a ruled shoal.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: @pick(0%, 30%); top: 34%; width: @pick(40%, 70%, 100%); height: 32%; border-radius: 999px; background: ${ink(c)};`)} @random(0.4) { -webkit-box-shadow: 0 -1px 0 ${ink(c)}; box-shadow: 0 -1px 0 ${ink(c)}; } }${TR}`,
}), { grid: '6x9', tg: '5x5', min: 30 });

add('Reef', 15, 'Two marks to a cell — a bar and a disc — building up like coral against a ruled ground.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 12%; top: @pick(10%, 54%); width: 76%; height: 18%; border-radius: 999px; background: ${ink(c)};`)} ${A(`left: @pick(14%, 52%); top: @pick(50%, 12%); @size: 34%; border-radius: 50%; background: ${ink(c)};`)} @random(0.35) { -webkit-box-shadow: -1px -1px 0 ${ink(c)}; box-shadow: -1px -1px 0 ${ink(c)}; } }${TR}`,
}), { grid: '6x9', tg: '5x5', min: 36 });

add('Skerry', 52, 'A hard ruled lattice with the occasional rock breaking the surface inside it.', (c) => ({
  vars: '',
  rule: `${F} { -webkit-box-shadow: inset 1px 1px 0 ${ink(c)}; box-shadow: inset 1px 1px 0 ${ink(c)}; @random(0.7) { ${A(`left: 50%; top: 50%; @size: @pick(38%, 58%); ${xf('translate(-50%, -50%) rotate(45deg)')} background: ${ink(c)};`)} } }${TR}`,
}), { grid: '8x12', tg: '6x6', min: 30 });

// ── after Trigram — clusters of parallel bars, turned as a unit ─────────────

add('Triad', 2, 'Three parallel strokes turned as one group, set at any of four bearings — sometimes with the middle one missing.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 45deg, 90deg, 135deg); ${F} { width: 12%; height: 56%; margin-left: 44%; margin-top: 22%; background: ${ink(c)}; ${ROUND} ${rot('@var(--rot)')} :before { content: ''; position: absolute; width: 100%; height: 100%; left: 200%; background: ${ink(c)}; ${ROUND}${pt} } :after { content: ''; position: absolute; width: 100%; height: 100%; right: 200%; background: ${ink(c)}; ${ROUND}${pt} } @random(0.25) { background: transparent; } }${TR}`,
}), { grid: '6x9', tg: '5x5', round: true });

add('Palisade', 48, 'Close-set uprights cut from a solid block, the fence running full height in most cells and cropped short in the rest.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${A(`left: 0; top: 0; width: 100%; height: @pick(100%, 72%, 46%); background: ${ink(c)}; ${slotMask('90deg', '11%', '20%')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Bristle', 23, 'A fine comb of lines, the whole comb turned to one of four bearings per cell.', (c) => ({
  vars: '',
  rule: `--ang: @pick(0deg, 45deg, 90deg, 135deg); ${F} { background: ${ink(c)}; -webkit-mask: repeating-linear-gradient(@var(--ang), #000 0 7%, transparent 7% 17%); mask: repeating-linear-gradient(@var(--ang), #000 0 7%, transparent 7% 17%); }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Rill', 37, 'Twin channels running side by side with a clean bank between them, swinging from upright to flat.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 45deg, 90deg, 135deg); ${F} { ${B(`left: 22%; top: 6%; width: 15%; height: 88%; background: ${ink(c)}; ${ROUND}`)} ${A(`left: 63%; top: 6%; width: 15%; height: 88%; background: ${ink(c)}; ${ROUND}`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5', round: false });

add('Braid', 31, 'Pairs of bars crossing over and under by turns, plaiting the grid into a running braid.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 8%; top: 34%; width: 84%; height: 30%; background: ${ink(c)}; ${ROUND}`)} ${A(`left: 34%; top: 8%; width: 30%; height: 84%; background: ${ink(c)}; ${ROUND}`)} @even { :before { z-index: 2; } } @odd { :after { z-index: 2; } } }${TR}`,
}), { grid: '6x9', tg: '5x5', round: true });

// ── after Ring — offset concentric rings drawn in border ────────────────────

add('Cirque', 0, 'Two rings drawn from the same centre and then knocked off it, so the gap between them opens on one side and closes on the other.', (c) => ({
  vars: '',
  rule: `--rot: ${R8}; ${F} { width: 66%; height: 66%; margin: 17%; border-radius: 50%; ${rot('@var(--rot)')} :before { content: ''; position: absolute; width: 100%; height: 100%; left: @rand(-18%, 18%); top: @rand(-18%, 18%); border-radius: 50%; border: calc(40px / @size-row) solid ${ink(c)}; box-sizing: border-box;${pt} } :after { content: ''; position: absolute; width: 100%; height: 100%; border-radius: 50%; border: calc(40px / @size-row) solid ${ink(c)}; box-sizing: border-box;${pt} } }${TR}`,
}), { grid: '4x6', tg: '4x4', min: 36 });

add('Atoll', 50, 'A ring with a solid island sitting off-centre inside it.', (c) => ({
  vars: '',
  rule: `${F} { width: 72%; height: 72%; margin: 14%; border-radius: 50%; border: calc(40px / @size-row) solid ${ink(c)}; box-sizing: border-box; ${A(`@size: 46%; left: @rand(6%, 40%); top: @rand(6%, 40%); border-radius: 50%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '4x6', tg: '4x4', min: 36 });

add('Lagoon', 38, 'Thick rings breached on one side, the gap swinging round the rim from cell to cell.', (c) => ({
  vars: '',
  rule: `--rot: ${R8}; ${F} { width: 82%; height: 82%; margin: 9%; border-radius: 50%; background: ${ink(c)}; ${ringMask('56%')} ${cp('polygon(0 0, 100% 0, 100% 42%, 56% 42%, 56% 100%, 0 100%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '4x4' });

add('Meander', 54, 'Square rings sliding out from under each other, the way Ring\'s circles do.', (c) => ({
  vars: '',
  rule: `${F} { width: 70%; height: 70%; margin: 15%; :before { content: ''; position: absolute; width: 100%; height: 100%; left: @rand(-20%, 20%); top: @rand(-20%, 20%); border: calc(36px / @size-row) solid ${ink(c)}; box-sizing: border-box;${pt} } :after { content: ''; position: absolute; width: 100%; height: 100%; border: calc(36px / @size-row) solid ${ink(c)}; box-sizing: border-box;${pt} } }${TR}`,
}), { grid: '4x6', tg: '4x4', min: 36 });

add('Oxbow', 56, 'Rings with one quarter of their wall missing, the break turning to a new bearing each cell.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { width: 78%; height: 78%; margin: 11%; border-radius: 50%; border: calc(44px / @size-row) solid ${ink(c)}; border-top-color: transparent; box-sizing: border-box; ${rot('@var(--rot)')} }${TR}`,
}), { grid: '4x6', tg: '4x4', min: 36 });

add('Estuary', 57, 'Three rings nested inside one another, each drawn a little off the last.', (c) => ({
  vars: '',
  rule: `${F} { width: 88%; height: 88%; margin: 6%; border-radius: 50%; border: calc(30px / @size-row) solid ${ink(c)}; box-sizing: border-box; :before { content: ''; position: absolute; width: 68%; height: 68%; left: @rand(4%, 26%); top: @rand(4%, 26%); border-radius: 50%; border: calc(30px / @size-row) solid ${ink(c)}; box-sizing: border-box;${pt} } :after { content: ''; position: absolute; width: 38%; height: 38%; left: @rand(18%, 42%); top: @rand(18%, 42%); border-radius: 50%; background: ${ink(c)};${pt} } }${TR}`,
}), { grid: '4x6', tg: '4x4', min: 36 });

// ════════════════════════════════════════════════════════════════════════════
// B. Heraldry — the ordinaries and charges, which are geometry with a
//    thousand-year head start on us.
// ════════════════════════════════════════════════════════════════════════════

add('Bezant', 36, 'A field strewn with gold coins, three sizes of roundel scattered semé across the shield.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; @size: @pick(44%, 64%, 86%); ${xf('translate(-50%, -50%)')} border-radius: 50%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Torteau', 20, 'Roundels with a raised centre, each coin struck in two tinctures.', (c) => ({
  vars: '',
  rule: `${F} { width: 86%; height: 86%; margin: 7%; border-radius: 50%; background: ${ink(c)}; ${A(`inset: 26%; border-radius: 50%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '4x4' });

add('Annulet', 58, 'Plain rings, bored right through, with a pip dropped into some of them.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 7%; border-radius: 50%; background: ${ink(c)}; ${ringMask('62%')}`)} @random(0.4) { ${A(`inset: 37%; border-radius: 50%; background: ${ink(c)};`)} } }${TR}`,
}), { grid: '6x9', tg: '4x4' });

add('Lozengy', 5, 'The lozengy field: diamonds set point to point, half of them carrying a smaller diamond inside.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp(poly(DIAMOND))} @random(0.5) { ${A(`inset: 0; background: ${ink(c)}; ${cp('polygon(50% 26%, 74% 50%, 50% 74%, 26% 50%)')}`)} } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Vair', 3, 'The vair fur — rows of little bells, every other row inverted so they nest.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 100% 60%, 75% 100%, 50% 60%, 25% 100%, 0 60%)')} @match(@y % 2 == 1) { ${xf('rotate(180deg)')} } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Ermine', 28, 'The ermine spot: a black tail pinned above three dots, dropped at random across a plain field.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 0deg, 0deg, 180deg); ${F} { ${B(`left: 30%; top: 32%; width: 40%; height: 56%; background: ${ink(c)}; ${cp('polygon(50% 0, 82% 100%, 50% 74%, 18% 100%)')}`)} ${A(`left: 36%; top: 8%; width: 28%; height: 20%; border-radius: 50%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Potent', 61, 'Interlocking crutch-heads — the potent fur, a T-tile turned end for end.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 180deg); ${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 100% 34%, 67% 34%, 67% 100%, 33% 100%, 33% 34%, 0 34%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Chevronel', 8, 'Narrow chevrons stacked point up and point down, the way a chevronny field runs.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp(chevronPoly(30))} @match(@y % 2 == 1) { ${xf('rotate(180deg)')} } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Barrulet', 18, 'Bars borne in pairs — the barrulet, always doubled, never touching.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${B(`left: 0; top: 18%; width: 100%; height: 15%; background: ${ink(c)};`)} ${A(`left: 0; top: 52%; width: 100%; height: 15%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Mascle', 13, 'Voided lozenges — diamonds with a diamond cut clean out of the middle.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp(ringPoly(DIAMOND, diamondHole(26, 26)))} @random(0.3) { ${cp(ringPoly(DIAMOND, diamondHole(14, 14)))} } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Rustre', 62, 'Lozenges pierced round: a diamond with a circular hole punched at its heart.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp(ringPoly(DIAMOND, roundHole(19)))} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Billet', 42, 'Upright oblongs strewn semé, a few of them laid on their side.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 30%; top: 12%; width: 40%; height: 76%; background: ${ink(c)};`)} @random(0.32) { :after { ${rot('90deg')} } } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Fusil', 9, 'The fusil: a lozenge drawn narrow and tall, standing or lying as the field turns.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(50% 0, 79% 50%, 50% 100%, 21% 50%)')} ${rot(R2)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Gyron', 31, 'Gyronny: wedges issuing from the centre of every square, two to a cell, spun to eight bearings.', (c) => ({
  vars: '',
  rule: `--rot: ${R8}; ${F} { ${B(`inset: 0; background: ${ink(c)}; ${cp('polygon(50% 50%, 0 0, 50% 0)')}`)} ${A(`inset: 0; background: ${ink(c)}; ${cp('polygon(50% 50%, 100% 100%, 50% 100%)')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

// ════════════════════════════════════════════════════════════════════════════
// C. Mouldings & openings — the profiles a mason cuts, and the holes a wall
//    is built around.
// ════════════════════════════════════════════════════════════════════════════

add('Cornice', 46, 'A stepped cornice: three courses of moulding, each oversailing the one below.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 0; top: 8%; width: 100%; height: 22%; background: ${ink(c)};`)} ${A(`left: 10%; top: 40%; width: 80%; height: 46%; background: ${ink(c)}; ${slotMask('0deg', '40%', '58%')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Dentil', 63, 'A dentil course — square teeth cut out of a band, with a plain fillet running under it.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 0; top: 12%; width: 100%; height: 46%; background: ${ink(c)}; ${slotMask('90deg', '9%', '18%')}`)} ${A(`left: 0; top: 68%; width: 100%; height: 16%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Volute', 39, 'Scrolled capitals: two rings drawn off-centre from one another so the gap winds like a spiral.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`inset: 4%; border-radius: 50%; background: ${ink(c)}; ${ringMask('58%')}`)} ${A(`left: 30%; top: 30%; width: 48%; height: 48%; border-radius: 50%; background: ${ink(c)}; ${ringMask('46%')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '4x4' });

add('Scotia', 11, 'The scotia — a deep concave hollow scooped out of the face of the moulding.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp(coveBite(96, 'tl'))} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Fillet', 27, 'A wide plane, a narrow fillet, another plane: the plainest moulding there is, run in bands.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${B(`left: 0; top: 4%; width: 100%; height: 38%; background: ${ink(c)};`)} ${A(`left: 0; top: 50%; width: 100%; height: 12%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Astragal', 34, 'Bead and reel: a round bead, then a spool, then a bead again, along the length of the moulding.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${B(`left: 4%; top: 30%; width: 40%; height: 40%; border-radius: 50%; background: ${ink(c)};`)} ${A(`left: 52%; top: 38%; width: 44%; height: 24%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Soffit', 40, 'A coffered soffit: sunk square panels seen from underneath, each one a frame inside a frame.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${cp(ringPoly(SQUARE, rectHole(12, 12)))}`)} ${A(`inset: 24%; background: ${ink(c)}; ${cp(ringPoly(SQUARE, rectHole(20, 20)))}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Spandrel', 6, 'The spandrel — the triangle of wall left over where an arch meets its square frame.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 100% 100%, 0 100%)')} ${msk('radial-gradient(circle farthest-side at 50% 100%, transparent 74%, #000 74%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Voussoir', 44, 'Wedge stones fanning out of an arch, each one a tapered block leaning off true.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(28% 0, 72% 0, 100% 100%, 0 100%)')} ${rot('@pick(-24deg, -12deg, 0deg, 12deg, 24deg)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Keystone', 22, 'The keystone alone: the tapered block that locks an arch, dropped into every cell.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${A(`inset: 6% 14%; background: ${ink(c)}; ${cp('polygon(22% 0, 78% 0, 100% 100%, 0 100%)')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Corbel', 59, 'Stepped corbels stacked out from the wall, each course projecting past the last.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 100% 32%, 68% 32%, 68% 66%, 34% 66%, 34% 100%, 0 100%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Squinch', 15, 'A little arch thrown across a corner, the trick that carries a dome on a square room.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${A(`inset: 0; background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 0 100%)')} ${msk('radial-gradient(circle farthest-side at 0% 0%, transparent 62%, #000 62%)')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Oculus', 1, 'Round windows with their glazing bars left open, so the light comes through the gaps and not the paint.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 6%; border-radius: 50%; background: ${ink(c)}; ${ringMask('72%')}`)} ${A(`inset: 6%; border-radius: 50%; background: ${ink(c)}; -webkit-mask: radial-gradient(circle closest-side at 50% 50%, #000 70%, transparent 70%), repeating-linear-gradient(@pick(0deg, 45deg), #000 0 6%, transparent 6% 50%); mask: radial-gradient(circle closest-side at 50% 50%, #000 70%, transparent 70%), repeating-linear-gradient(@pick(0deg, 45deg), #000 0 6%, transparent 6% 50%); -webkit-mask-composite: source-in; mask-composite: intersect;`)} }${TR}`,
}), { grid: '6x9', tg: '4x4' });

add('Transom', 51, 'A transom light: one horizontal bar across an opening, the panes above and below it left clear.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 8%; top: 8%; width: 84%; height: 34%; background: ${ink(c)};`)} ${A(`left: 8%; top: 50%; width: 84%; height: 42%; background: ${ink(c)}; ${slotMask('90deg', '46%', '54%')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Mullion', 4, 'Tall lights divided by mullions — three panes to an opening, the divisions cut, not drawn.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${A(`inset: 6%; background: ${ink(c)}; ${slotMask('90deg', '28%', '34%')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Cavetto', 55, 'A hollow quarter-round run along the edge of every block, turning corner by corner.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; border-radius: 0 0 0 100%; ${rot('@var(--rot)')} @random(0.3) { border-radius: 0 0 100% 100%; } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

// ════════════════════════════════════════════════════════════════════════════
// D. Cloth — what a loom, a needle or a dye bath does to a grid.
// ════════════════════════════════════════════════════════════════════════════

add('Houndstooth', 28, 'The broken check, tooth by tooth — a stepped tile that mirrors on the checker so the points interlock.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 50% 0, 50% 25%, 75% 25%, 75% 50%, 100% 50%, 100% 100%, 50% 100%, 50% 75%, 25% 75%, 25% 50%, 0 50%)')} @even { ${xf('scaleX(-1)')} } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Madras', 21, 'Bands crossing at right angles and letting each other show through, the way a madras check builds its colour.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 0; top: @pick(4%, 34%, 62%); width: 100%; height: 32%; background: ${ink(c)}; opacity: 0.9;`)} ${A(`left: @pick(4%, 34%, 62%); top: 0; width: 32%; height: 100%; background: ${ink(c)}; opacity: 0.6;`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Ikat', 32, 'Warp-dyed stripes with the feathered edges ikat is known for — the pattern blurs where the yarn shifted in the dye.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { background: ${ink(c)}; ${cp('polygon(26% 0, 74% 0, 66% 12%, 80% 25%, 62% 38%, 78% 50%, 62% 62%, 80% 75%, 66% 88%, 74% 100%, 26% 100%, 34% 88%, 20% 75%, 38% 62%, 22% 50%, 38% 38%, 20% 25%, 34% 12%)')} ${rot('@var(--rot)')} @random(0.4) { ${xf('scaleX(1.6)')} } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Sashiko', 3, 'Running stitch worked in both directions — short dashes on a grid, exactly as the needle leaves them.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 0; top: 30%; width: 100%; height: 10%; background: ${ink(c)}; ${slotMask('90deg', '14%', '22%')}`)} ${A(`left: 30%; top: 0; width: 10%; height: 100%; background: ${ink(c)}; ${slotMask('0deg', '14%', '22%')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Boro', 43, 'Patch laid over patch, each one tacked down with a line of stitching along its edge.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: @pick(2%, 16%); top: @pick(2%, 16%); width: 76%; height: 76%; background: ${ink(c)};`)} ${A(`left: @pick(24%, 38%); top: @pick(24%, 38%); width: 58%; height: 8%; background: ${ink(c)}; ${slotMask('90deg', '12%', '20%')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Damask', 39, 'A foliate damask motif — a four-lobed figure set in a diamond, reversing with the weave.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 4%; background: ${ink(c)}; ${cp(poly(DIAMOND))}`)} ${A(`inset: 18%; background: ${ink(c)}; @shape: clover 4;`)} @even { ${xf('rotate(45deg)')} } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Brocade', 35, 'Raised metal thread: a small figure lifted off the ground, catching a shadow on one side.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 20%; background: ${ink(c)}; ${cp(starPoly(4, 0.34))} ${SHADOW}`)} ${B(`inset: 6%; background: ${ink(c)}; ${cp(ringPoly(DIAMOND, diamondHole(38, 38)))}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5', shadow: true });

add('Jacquard', 12, 'Two cloths woven into one: a block figure on the face with the reverse showing through where it lifts.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${cp('polygon(0 0, 60% 0, 60% 60%, 0 60%)')}`)} ${A(`inset: 0; background: ${ink(c)}; ${cp('polygon(40% 40%, 100% 40%, 100% 100%, 40% 100%)')}`)} ${rot(R4)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Moire', 23, 'Two rulings laid over each other a few degrees apart, so the beat between them draws its own pattern.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${slotMask('0deg', '5%', '11%')}`)} ${A(`inset: 0; background: ${ink(c)}; ${slotMask('@pick(6deg, 84deg, 96deg)', '5%', '11%')} opacity: 0.75;`)} }${TR}`,
}), { grid: '4x6', tg: '4x4' });

add('Pique', 17, 'Waffle piqué: raised squares with a channel sunk between them on every side.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${cp(ringPoly(SQUARE, rectHole(16, 16)))}`)} ${A(`inset: 32%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Seersucker', 52, 'Puckered stripes running beside flat ones — the slack bands crimp, the tight ones lie still.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${B(`left: 4%; top: 0; width: 40%; height: 100%; background: ${ink(c)}; ${slotMask('0deg', '9%', '15%')}`)} ${A(`left: 54%; top: 0; width: 40%; height: 100%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Gauze', 60, 'An open weave — a few threads each way and a lot of daylight between them.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${slotMask('90deg', '6%', '34%')}`)} ${A(`inset: 0; background: ${ink(c)}; ${slotMask('0deg', '6%', '34%')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Selvedge', 19, 'The finished edge of the cloth: a solid band with the fringe running off it.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`left: 0; top: 0; width: 100%; height: 42%; background: ${ink(c)};`)} ${A(`left: 0; top: 42%; width: 100%; height: 46%; background: ${ink(c)}; ${slotMask('90deg', '7%', '17%')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Chenille', 9, 'Caterpillar cord — a run of pile beads threaded along a core.', (c) => ({
  vars: '',
  rule: `--rot: @pick(0deg, 45deg, 90deg, 135deg); ${F} { ${B(`left: 0; top: 44%; width: 100%; height: 12%; background: ${ink(c)};`)} ${A(`left: 0; top: 28%; width: 100%; height: 44%; background: ${ink(c)}; ${msk('radial-gradient(circle closest-side at 50% 50%, #000 92%, transparent 92%) 0 0 / 25% 100%')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

// ════════════════════════════════════════════════════════════════════════════
// E. Type & print — the shapes a compositor thinks in.
// ════════════════════════════════════════════════════════════════════════════

add('Serif', 29, 'A slab-serif stem: one upright with a foot and a head, turned to whichever way the line runs.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(10% 0, 90% 0, 90% 18%, 62% 18%, 62% 82%, 90% 82%, 90% 100%, 10% 100%, 10% 82%, 38% 82%, 38% 18%, 10% 18%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Kern', 45, 'Two letters tucked into each other\'s space until the gap between them reads even.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${cp('polygon(0 0, 54% 0, 6% 100%, 0 100%)')}`)} ${A(`inset: 0; background: ${ink(c)}; ${cp('polygon(58% 0, 100% 0, 100% 100%, 46% 100%)')}`)} ${xf('scaleX(@pick(1, -1))')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Ligature', 14, 'Two stems sharing one crossbar, joined the way an ff or an fi is cut.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${B(`left: 22%; top: 8%; width: 14%; height: 84%; background: ${ink(c)}; :after { content: ''; } `)} ${A(`left: 22%; top: 34%; width: 56%; height: 13%; background: ${ink(c)}; box-shadow: 0.75em 0 0 -0.42em ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Colophon', 37, 'The printer\'s device at the end of the book: a mark set over a rule.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 26%; top: 8%; width: 48%; height: 48%; background: ${ink(c)}; ${cp(poly(DIAMOND))}`)} ${A(`left: 12%; top: 68%; width: 76%; height: 11%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Folio', 47, 'A page with its number in the corner — a big frame and one small block, the corner rotating through the spread.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`inset: 8%; background: ${ink(c)}; ${cp(ringPoly(SQUARE, rectHole(9, 9)))}`)} ${A(`left: 24%; top: 24%; width: 52%; height: 52%; background: ${ink(c)}; ${slotMask('0deg', '15%', '30%')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Quire', 56, 'Folded sheets nested inside one another, the way a gathering is made up before it is sewn.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`inset: 4%; background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 100% 22%, 22% 22%, 22% 100%, 0 100%)')}`)} ${A(`inset: 32%; background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 100% 30%, 30% 30%, 30% 100%, 0 100%)')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Dropcap', 10, 'A capital dropped three lines deep with the text wrapping beside it.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 8%; top: 12%; width: 44%; height: 76%; background: ${ink(c)};`)} ${A(`left: 58%; top: 12%; width: 34%; height: 76%; background: ${ink(c)}; ${slotMask('0deg', '16%', '30%')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Ampersand', 26, 'Two bowls and a stroke — the ligature of et, reduced to the geometry it was built from.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 16%; top: 10%; width: 44%; height: 44%; border-radius: 50%; background: ${ink(c)}; ${ringMask('54%')}`)} ${A(`left: 30%; top: 44%; width: 56%; height: 50%; border-radius: 50%; background: ${ink(c)}; ${ringMask('50%')}`)} ${xf('scaleX(@pick(1, -1))')} }${TR}`,
}), { grid: '6x9', tg: '4x4' });

add('Tittle', 64, 'The dot over the i, floating clear of its stem.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`left: 38%; top: 40%; width: 24%; height: 52%; background: ${ink(c)};`)} ${A(`left: 36%; top: 8%; width: 28%; height: 22%; border-radius: 50%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Ascender', 2, 'Stems of three heights standing on one baseline, the tall ones running up past the x-height.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 24%; bottom: 8%; width: 52%; height: @pick(38%, 62%, 88%); background: ${ink(c)};`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Counter', 48, 'The enclosed white of a letter, taken on its own: a ring broken where the stroke opens.', (c) => ({
  vars: '',
  rule: `--rot: ${R8}; ${F} { width: 82%; height: 82%; margin: 9%; border-radius: 50%; border: calc(46px / @size-row) solid ${ink(c)}; border-right-color: transparent; box-sizing: border-box; ${rot('@var(--rot)')} }${TR}`,
}), { grid: '4x6', tg: '4x4', min: 36 });

add('Register', 33, 'Registration marks: a ring with the crosshairs running out past it, one per plate.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 22%; border-radius: 50%; background: ${ink(c)}; ${ringMask('62%')}`)} ${A(`inset: 0; background: ${ink(c)}; ${cp(crossPoly(7))}`)} }${TR}`,
}), { grid: '6x9', tg: '4x4' });

// ════════════════════════════════════════════════════════════════════════════
// F. Notation — marks that tell a player what to do.
// ════════════════════════════════════════════════════════════════════════════

add('Clef', 30, 'A clef sitting astride its stave: a bold curl over four ruled lines.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 0; top: 16%; width: 100%; height: 68%; background: ${ink(c)}; ${slotMask('0deg', '8%', '22%')}`)} ${A(`left: 26%; top: 6%; width: 48%; height: 88%; background: ${ink(c)}; @shape: clover 3; ${rot(R4)}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Staccato', 57, 'Detached notes: a dot under every head, nothing joined to anything.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 22%; top: 18%; width: 56%; height: 40%; border-radius: 50%; background: ${ink(c)};`)} ${A(`left: 42%; top: 70%; width: 16%; height: 16%; border-radius: 50%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Fermata', 41, 'Hold: an arc with a dot beneath it, told to last as long as it likes.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`left: 6%; top: 20%; width: 88%; height: 88%; border-radius: 50%; background: ${ink(c)}; ${ringMask('68%')} ${cp('polygon(0 0, 100% 0, 100% 50%, 0 50%)')}`)} ${A(`left: 44%; top: 40%; width: 12%; height: 12%; border-radius: 50%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Crotchet', 24, 'Quarter notes: a filled head with the stem up or down as the line requires.', (c) => ({
  vars: '',
  rule: `--flip: @pick(1, -1); ${F} { ${B(`left: 14%; top: 54%; width: 50%; height: 34%; border-radius: 50%; background: ${ink(c)}; ${rot('-20deg')}`)} ${A(`left: 58%; top: 10%; width: 10%; height: 56%; background: ${ink(c)};`)} ${xf('scale(@var(--flip))')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Minim', 53, 'Half notes — the head left open, the stem standing clear.', (c) => ({
  vars: '',
  rule: `--flip: @pick(1, -1); ${F} { ${B(`left: 12%; top: 52%; width: 54%; height: 36%; border-radius: 50%; background: ${ink(c)}; ${ringMask('54%')}`)} ${A(`left: 60%; top: 10%; width: 10%; height: 58%; background: ${ink(c)};`)} ${xf('scale(@var(--flip))')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Semibreve', 65, 'Whole notes: a bare open oval, no stem, held for the length of the bar.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 10%; top: 26%; width: 80%; height: 48%; border-radius: 50%; background: ${ink(c)}; ${ringMask('52%')} ${rot('@pick(-18deg, 0deg, 18deg)')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Tremolo', 7, 'Tremolo strokes: two or three slashes across the stem, telling the player to shake it.', (c) => ({
  vars: '',
  rule: `--rot: @pick(-32deg, 32deg); ${F} { ${A(`inset: 6%; background: ${ink(c)}; ${slotMask('0deg', '13%', '30%')} ${rot('@var(--rot)')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Arpeggio', 49, 'A broken chord: the same figure stepped up or down the stave, one note at a time.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 18%; top: @pick(6%, 30%, 54%); width: 64%; height: 34%; border-radius: 50%; background: ${ink(c)}; ${rot('-16deg')}`)} ${B(`left: 8%; top: 4%; width: 8%; height: 92%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Ostinato', 61, 'A figure that will not let go: the identical bar, repeated, with only the colour moving.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 6%; top: 22%; width: 26%; height: 56%; background: ${ink(c)};`)} ${A(`left: 40%; top: 22%; width: 54%; height: 56%; background: ${ink(c)}; ${slotMask('90deg', '30%', '52%')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Cadenza', 16, 'The soloist off the leash: a cascade of heads running clean off the top of the stave.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: @pick(4%, 24%, 44%, 64%); top: @pick(4%, 24%, 44%, 64%); width: 32%; height: 32%; border-radius: 50%; background: ${ink(c)};`)} ${B(`left: 0; top: 82%; width: 100%; height: 7%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

// ════════════════════════════════════════════════════════════════════════════
// G. Sky & optics — the geometry of things that are far away.
// ════════════════════════════════════════════════════════════════════════════

add('Apogee', 0, 'The far point of an orbit: a small body at the wide end of a long ellipse.', (c) => ({
  vars: '',
  rule: `--rot: ${R8}; ${F} { ${B(`inset: 12% 2%; border-radius: 50%; background: ${ink(c)}; ${ringMask('88%')}`)} ${A(`left: 6%; top: 42%; width: 18%; height: 18%; border-radius: 50%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '4x4' });

add('Zenith', 66, 'Straight overhead: rings drawn tight around a point directly above.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 2%; border-radius: 50%; background: ${ink(c)}; ${zoneMask(3)}`)} }${TR}`,
}), { grid: '6x9', tg: '4x4' });

add('Nadir', 67, 'The point underfoot: the same rings, opened out, with the centre bored away.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 2%; border-radius: 50%; background: ${ink(c)}; ${zoneMask(3, '@pick(28% 28%, 72% 28%, 72% 72%, 28% 72%)')}`)} }${TR}`,
}), { grid: '6x9', tg: '4x4' });

add('Azimuth', 38, 'Bearings taken from a common centre: a bar swung to one of eight compass points.', (c) => ({
  vars: '',
  rule: `--rot: ${R8}; ${F} { ${B(`left: 44%; top: 4%; width: 12%; height: 92%; background: ${ink(c)};`)} ${A(`left: 34%; top: 34%; width: 32%; height: 32%; border-radius: 50%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Gnomon', 11, 'The shadow-caster of a sundial: a right triangle standing on a plate, its shadow falling with the hour.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`inset: 0; background: ${ink(c)}; ${cp('polygon(12% 88%, 12% 18%, 84% 88%)')}`)} ${A(`left: 8%; top: 88%; width: 84%; height: 8%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Ecliptic', 18, 'The apparent path of the sun, drawn as a band tilted off the equator with the disc riding it.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: -12%; top: 40%; width: 124%; height: 20%; background: ${ink(c)}; ${rot('@pick(-23deg, 23deg)')}`)} ${A(`left: @pick(12%, 44%, 66%); top: 34%; width: 30%; height: 30%; border-radius: 50%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Syzygy', 47, 'Three bodies falling into a line — two discs and the shadow between them.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`left: 4%; top: 30%; width: 40%; height: 40%; border-radius: 50%; background: ${ink(c)};`)} ${A(`left: 50%; top: 24%; width: 52%; height: 52%; border-radius: 50%; background: ${ink(c)}; ${ringMask('56%')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Penumbra', 50, 'The soft edge of a shadow: a disc with a second, larger one fading round it in bands.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 4%; border-radius: 50%; background: ${ink(c)}; opacity: 0.45;`)} ${A(`inset: 26%; border-radius: 50%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Corona', 25, 'The crown seen only at totality: spikes standing off a dark disc.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${cp(starPoly(12, 0.5))}`)} ${A(`inset: 30%; border-radius: 50%; background: ${ink(c)};`)} ${rot(R8)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Parallax', 58, 'The same object plotted from two stations: one shape, twice, a fixed step apart.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`left: 8%; top: 8%; width: 60%; height: 60%; background: ${ink(c)}; ${cp(ngon(6, 0))} opacity: 0.85;`)} ${A(`left: 30%; top: 30%; width: 60%; height: 60%; background: ${ink(c)}; ${cp(ngon(6, 0))} opacity: 0.85;`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Analemma', 13, 'The figure the sun traces over a year, drawn as a lopsided eight.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 22%; top: 4%; width: 52%; height: 52%; border-radius: 50%; background: ${ink(c)}; ${ringMask('62%')}`)} ${A(`left: 30%; top: 46%; width: 40%; height: 50%; border-radius: 50%; background: ${ink(c)}; ${ringMask('58%')}`)} ${xf('scaleX(@pick(1, -1))')} }${TR}`,
}), { grid: '6x9', tg: '4x4' });

add('Armilla', 54, 'An armillary sphere flattened onto the page: two rings crossing at a pole.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 4%; border-radius: 50%; background: ${ink(c)}; ${ringMask('80%')}`)} ${A(`left: 32%; top: 4%; width: 36%; height: 92%; border-radius: 50%; background: ${ink(c)}; ${ringMask('68%')} ${rot('@pick(-24deg, 0deg, 24deg)')}`)} }${TR}`,
}), { grid: '6x9', tg: '4x4' });

// ════════════════════════════════════════════════════════════════════════════
// H. Survey drawings — the conventions of a map sheet.
// ════════════════════════════════════════════════════════════════════════════

add('Isobar', 42, 'Lines of equal pressure closing round a centre, packing tighter where the gradient steepens.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 0; border-radius: 50%; background: ${ink(c)}; ${zoneMask(4)} ${xf('scale(@pick(1, 1.3)) rotate(@pick(0deg, 40deg))')}`)} }${TR}`,
}), { grid: '6x9', tg: '4x4' });

add('Isopleth', 5, 'Nested closed curves stepped in from the edge of the cell, each one a level further in.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 0; background: ${ink(c)}; border-radius: @pick(8%, 30%, 50%); ${zoneMask(3)}`)} }${TR}`,
}), { grid: '6x9', tg: '4x4' });

add('Contour', 46, 'Contour lines crossing the sheet in parallel, bending where the ground rises.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 0; background: ${ink(c)}; ${slotMask('@pick(0deg, 22deg, 45deg, 68deg, 90deg)', '5%', '15%')}`)} }${TR}`,
}), { grid: '6x9', tg: '4x4' });

add('Hachure', 31, 'Hachures: short strokes run straight downhill, close together where the slope is steep.', (c) => ({
  vars: '',
  rule: `--rot: ${R8}; ${F} { ${A(`inset: 8%; background: ${ink(c)}; ${slotMask('90deg', '7%', '@pick(14%, 22%, 34%)')} ${rot('@var(--rot)')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Graticule', 18, 'The lat-long net: two rulings crossing at right angles with a tick at every intersection.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${slotMask('0deg', '5%', '48%')}`)} ${A(`inset: 0; background: ${ink(c)}; ${slotMask('90deg', '5%', '48%')}`)} }${TR}`,
}), { grid: '4x6', tg: '4x4' });

add('Rhumb', 34, 'A wind rose: lines of constant bearing radiating from a single node.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${cp(crossPoly(9))}`)} ${A(`inset: 0; background: ${ink(c)}; ${cp(crossPoly(9))} ${rot('45deg')}`)} ${rot('@pick(0deg, 22deg)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Loxodrome', 22, 'A spiral course that cuts every meridian at the same angle, wound tighter towards the pole.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 4%; border-radius: 50%; background: ${ink(c)}; ${zoneMask(3)} ${cp('polygon(50% 50%, 100% 0, 100% 100%)')}`)} ${A(`inset: 4%; border-radius: 50%; background: ${ink(c)}; ${zoneMask(3)} ${cp('polygon(50% 50%, 0 100%, 0 0)')}`)} ${rot(R8)} }${TR}`,
}), { grid: '6x9', tg: '4x4' });

add('Datum', 59, 'A benchmark: the arrow and bar cut into a wall to fix a height.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`left: 20%; top: 16%; width: 60%; height: 52%; background: ${ink(c)}; ${cp('polygon(50% 100%, 0 0, 100% 0)')}`)} ${A(`left: 14%; top: 72%; width: 72%; height: 10%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Traverse', 8, 'A survey traverse: legs of different length turning at each station, with the station marked.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`left: 10%; top: 44%; width: @pick(50%, 80%); height: 10%; background: ${ink(c)};`)} ${A(`left: 44%; top: 10%; width: 10%; height: @pick(50%, 80%); background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Waypoint', 63, 'Plotted points: a ring with a bar dropped from it, the way a fix is marked on the chart.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 24%; top: 8%; width: 52%; height: 52%; border-radius: 50%; background: ${ink(c)}; ${ringMask('54%')}`)} ${A(`left: 46%; top: 58%; width: 8%; height: 34%; background: ${ink(c)};`)} ${rot(R4)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

// ════════════════════════════════════════════════════════════════════════════
// I. Stone — what a rock looks like when you cut it open.
// ════════════════════════════════════════════════════════════════════════════

add('Geode', 40, 'A geode split open: bands of rind round a crystal-lined cavity.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 2%; border-radius: 50%; background: ${ink(c)}; ${zoneMask(3)}`)} ${A(`inset: 34%; border-radius: 50%; background: ${ink(c)}; ${cp(starPoly(9, 0.46))}`)} }${TR}`,
}), { grid: '6x9', tg: '4x4' });

add('Agate', 13, 'Agate banding: concentric layers that follow the shape of the cavity they filled.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 0; background: ${ink(c)}; border-radius: @pick(20%, 40%, 50%) @pick(40%, 50%, 20%); ${zoneMask(4)} ${rot(R4)}`)} }${TR}`,
}), { grid: '6x9', tg: '4x4' });

add('Nacre', 51, 'Mother-of-pearl: overlapping plates of aragonite, each one a shade off the last.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: -14%; top: 0; width: 76%; height: 100%; background: ${ink(c)}; border-radius: 0 999px 999px 0;`)} ${A(`left: 38%; top: 0; width: 76%; height: 100%; background: ${ink(c)}; border-radius: 0 999px 999px 0; opacity: 0.85;`)} @even { ${xf('scaleX(-1)')} } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Chert', 43, 'Nodular chert: hard blunt lumps set in a softer bed, each one faceted where it broke.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: @pick(4%, 16%); background: ${ink(c)}; ${cp(ngon(7, -70))} ${rot(R8)}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Flint', 27, 'Knapped flint: a conchoidal flake with the bulb of percussion still on it.', (c) => ({
  vars: '',
  rule: `--rot: ${R8}; ${F} { background: ${ink(c)}; ${cp('polygon(50% 2%, 78% 22%, 94% 56%, 66% 96%, 30% 92%, 8% 60%, 18% 24%)')} ${A(`inset: 30% 34% 26% 22%; background: ${ink(c)}; border-radius: 50%;`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Schist', 12, 'Schistosity: parallel planes of mica that split the rock into sheets.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 0; background: ${ink(c)}; ${slotMask('@pick(4deg, 8deg, 172deg, 176deg)', '9%', '21%')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Mica', 66, 'Mica flakes: thin hexagonal plates lying every which way and catching the light.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; @size: @pick(46%, 68%, 92%); ${xf(`translate(-50%, -50%) rotate(${R8})`)} background: ${ink(c)}; ${cp(ngon(6, 0))} opacity: 0.9;`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Pyrite', 23, 'Fool\'s gold: cubes of pyrite grown into each other at right angles.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 6%; top: 14%; width: 56%; height: 56%; background: ${ink(c)}; ${cp(ngon(6, -90))}`)} ${A(`left: 36%; top: 32%; width: 56%; height: 56%; background: ${ink(c)}; ${cp(ngon(6, -90))}`)} @even { ${xf('scaleX(-1)')} } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Moraine', 45, 'Glacial till: blocks of every size dumped in a ridge where the ice stopped.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: @rand(2%, 30%); top: @rand(2%, 30%); @size: @rand(38%, 68%); background: ${ink(c)}; border-radius: @pick(0, 18%, 50%); ${rot('@pick(0deg, 18deg, 36deg)')}`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Karst', 60, 'Limestone pavement: solid clints with the grikes weathered clean through between them.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('@pick(polygon(0 0, 88% 0, 100% 88%, 12% 100%), polygon(10% 0, 100% 6%, 92% 100%, 0 90%), polygon(0 8%, 90% 0, 100% 92%, 8% 100%))')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

// ════════════════════════════════════════════════════════════════════════════
// J. Botany — the parts of a flower, drawn as diagram rather than picture.
// ════════════════════════════════════════════════════════════════════════════

add('Calyx', 16, 'The calyx: a ring of sepals cupping the bud they were built to protect.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 2%; background: ${ink(c)}; ${cp(starPoly(5, 0.44))}`)} ${A(`inset: 34%; border-radius: 50%; background: ${ink(c)};`)} ${rot(R4)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Sepal', 15, 'A single sepal — a pointed leaf with one vein down the middle.', (c) => ({
  vars: '',
  rule: `--rot: ${R8}; ${F} { ${B(`inset: 4%; background: ${ink(c)}; ${cp(lensPoly(36))}`)} ${A(`left: 47%; top: 12%; width: 6%; height: 76%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Stamen', 26, 'Stamens: a filament with the anther swelling at its tip.', (c) => ({
  vars: '',
  rule: `--rot: ${R8}; ${F} { ${B(`left: 46%; top: 30%; width: 8%; height: 64%; background: ${ink(c)};`)} ${A(`left: 32%; top: 8%; width: 36%; height: 28%; border-radius: 50%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Bract', 51, 'Bracts: modified leaves shingling round a head, each one overlapping the next.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 2%; top: 16%; width: 50%; height: 68%; border-radius: 0 999px 999px 0; background: ${ink(c)};`)} ${A(`left: 48%; top: 16%; width: 50%; height: 68%; border-radius: 999px 0 0 999px; background: ${ink(c)};`)} ${rot(R4)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Whorl', 37, 'Leaves set in a whorl — three or five to a node, spaced evenly round the stem.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; @shape: clover 3; @random(0.45) { @shape: clover 5; } ${A(`inset: 38%; border-radius: 50%; background: ${ink(c)};`)} ${rot(R8)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Umbel', 55, 'An umbel: every stalk springing from one point and reaching the same height.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${cp('polygon(46% 100%, 54% 100%, 96% 14%, 88% 10%, 50% 78%, 12% 10%, 4% 14%)')}`)} ${A(`left: 34%; top: 2%; width: 32%; height: 22%; border-radius: 50%; background: ${ink(c)};`)} ${rot('@pick(0deg, 180deg)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Raceme', 17, 'A raceme: flowers borne singly up one axis, the oldest at the bottom.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`left: 46%; top: 0; width: 8%; height: 100%; background: ${ink(c)};`)} ${A(`left: 14%; top: 12%; width: 72%; height: 76%; background: ${ink(c)}; ${msk('radial-gradient(circle closest-side at 50% 50%, #000 88%, transparent 88%) 0 0 / 50% 33.4%')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Spathe', 24, 'A spathe wrapped round its spadix: one broad hood and one upright column.', (c) => ({
  vars: '',
  rule: `--flip: @pick(1, -1); ${F} { ${B(`inset: 4%; background: ${ink(c)}; ${cp('polygon(50% 0, 96% 44%, 72% 100%, 26% 100%, 4% 44%)')} border-radius: 50% 50% 0 0;`)} ${A(`left: 42%; top: 22%; width: 16%; height: 62%; border-radius: 999px; background: ${ink(c)};`)} ${xf('scaleX(@var(--flip))')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Stipule', 6, 'Stipules: the small paired appendages where a leaf meets the stem.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`left: 4%; top: 34%; width: 34%; height: 34%; border-radius: 100% 0 100% 0; background: ${ink(c)};`)} ${A(`left: 62%; top: 34%; width: 34%; height: 34%; border-radius: 0 100% 0 100%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Pinnule', 65, 'The smallest division of a fern frond: a run of leaflets either side of one rib.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`left: 46%; top: 4%; width: 8%; height: 92%; background: ${ink(c)};`)} ${A(`left: 6%; top: 6%; width: 88%; height: 88%; background: ${ink(c)}; ${msk('radial-gradient(closest-side at 50% 50%, #000 88%, transparent 88%) 0 0 / 50% 20%')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

// ════════════════════════════════════════════════════════════════════════════
// K. Machined parts — the drawings in a fitter's handbook.
// ════════════════════════════════════════════════════════════════════════════

add('Ratchet', 49, 'A ratchet wheel: saw teeth that will only turn one way.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 4%; background: ${ink(c)}; ${cp(starPoly(10, 0.62, -90))} border-radius: 50%; ${rot(R8)}`)} }${TR}`,
}), { grid: '6x9', tg: '4x4' });

add('Pawl', 30, 'The pawl that drops into the tooth: a pivoted arm with its nose against the wheel.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`left: 8%; top: 38%; width: 76%; height: 24%; background: ${ink(c)}; ${cp('polygon(0 0, 78% 0, 100% 50%, 78% 100%, 0 100%)')}`)} ${A(`left: 2%; top: 34%; width: 32%; height: 32%; border-radius: 50%; background: ${ink(c)}; ${ringMask('50%')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Flywheel', 41, 'A flywheel: a heavy rim carried on spokes, with the bore cut through the hub.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 2%; border-radius: 50%; background: ${ink(c)}; ${ringMask('80%')}`)} ${A(`inset: 2%; background: ${ink(c)}; ${cp(crossPoly(11))} ${rot('@pick(0deg, 30deg, 45deg)')}`)} }${TR}`,
}), { grid: '6x9', tg: '4x4' });

add('Piston', 57, 'A piston in section: the crown, two ring grooves cut into the skirt, and the pin boss.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`left: 16%; top: 6%; width: 68%; height: 60%; background: ${ink(c)}; ${slotMask('0deg', '22%', '30%')}`)} ${A(`left: 30%; top: 68%; width: 40%; height: 26%; border-radius: 50%; background: ${ink(c)}; ${ringMask('52%')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Crank', 44, 'A crank throw: two journals joined by a web, set over at whatever angle the engine wants.', (c) => ({
  vars: '',
  rule: `--rot: ${R8}; ${F} { ${B(`left: 22%; top: 30%; width: 56%; height: 40%; background: ${ink(c)}; border-radius: 999px;`)} ${A(`left: 62%; top: 34%; width: 32%; height: 32%; border-radius: 50%; background: ${ink(c)}; ${ringMask('46%')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Bushing', 20, 'A flanged bushing seen end-on: two diameters and a bore straight through.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 6%; border-radius: 50%; background: ${ink(c)}; ${ringMask('72%')}`)} ${A(`inset: 24%; border-radius: 50%; background: ${ink(c)}; ${ringMask('56%')}`)} }${TR}`,
}), { grid: '6x9', tg: '4x4' });

add('Gasket', 33, 'A gasket blank: the sealing face with its bore and a ring of bolt holes punched round it.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 4%; border-radius: 50%; background: ${ink(c)}; ${ringMask('42%')} ${msk('radial-gradient(circle closest-side at 50% 50%, transparent 42%, #000 42%), radial-gradient(circle at 50% 50%, transparent 12%, #000 12%) 0 0 / 25% 25%')} -webkit-mask-composite: source-in; mask-composite: intersect;`)} }${TR}`,
}), { grid: '6x9', tg: '4x4' });

add('Flange', 4, 'A pipe flange: the raised face, the bolt circle, and the bore they are all arranged around.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 2%; background: ${ink(c)}; ${cp(ngon(8, -112.5))} ${ringMask('58%')}`)} ${A(`inset: 30%; border-radius: 50%; background: ${ink(c)}; ${ringMask('44%')}`)} }${TR}`,
}), { grid: '6x9', tg: '4x4' });

add('Rivet', 61, 'Rivet heads in rows, the domed ones proud of the plate and the countersunk ones flush.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; @size: @pick(44%, 62%); ${xf('translate(-50%, -50%)')} border-radius: 50%; background: ${ink(c)}; ${SHADOW}`)} @random(0.35) { :after { ${ringMask('46%')} } } }${TR}`,
}), { grid: '8x12', tg: '6x6', shadow: false, min: 30 });

add('Washer', 68, 'Plain washers: an outside diameter, an inside diameter, and nothing else to say about them.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: @pick(4%, 14%); border-radius: 50%; background: ${ink(c)}; ${ringMask('@pick(50%, 66%)')}`)} }${TR}`,
}), { grid: '6x9', tg: '4x4' });

add('Keyway', 50, 'A shaft with its keyway cut: a bore with one square notch broached out of the wall.', (c) => ({
  vars: '',
  rule: `--rot: ${R8}; ${F} { ${A(`inset: 4%; border-radius: 50%; background: ${ink(c)}; ${ringMask('62%')} ${cp(withHole(rectHole(42, 4)))} ${rot('@var(--rot)')}`)} }${TR}`,
}), { grid: '6x9', tg: '4x4' });

add('Spline', 36, 'A splined shaft in section: straight-sided teeth cut all the way round.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 4%; background: ${ink(c)}; ${cp(cogPoly(12, 34, 50, 0.5))} ${ringMask('40%')} ${rot(R8)}`)} }${TR}`,
}), { grid: '6x9', tg: '4x4' });

// ════════════════════════════════════════════════════════════════════════════
// L. Folded paper — what a single sheet can be made to do.
// ════════════════════════════════════════════════════════════════════════════

add('Kirigami', 19, 'Cut-and-fold: slits opened out of a folded sheet so the paper itself becomes the pattern.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${A(`inset: 6%; background: ${ink(c)}; ${cp(withHole(rectHole(38, 14)))} ${slotMask('90deg', '18%', '26%')} ${rot('@var(--rot)')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Crease', 53, 'A crease pattern: the mountain and valley lines drawn before anything is folded.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 0 100%)')}`)} ${A(`inset: 0; background: ${ink(c)}; ${cp('polygon(100% 0, 100% 100%, 0 100%)')} opacity: 0.7;`)} ${rot(R4)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Miura', 58, 'The Miura fold: a tessellation of parallelograms that opens and closes in one pull.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(18% 0, 101% 0, 83% 101%, 0 101%)')} @match(@y % 2 == 1) { ${cp('polygon(0 0, 83% 0, 101% 101%, 18% 101%)')} } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Waterbomb', 32, 'The waterbomb base: a square creased on both diagonals and collapsed to a triangle.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 50% 50%)')}`)} ${A(`inset: 0; background: ${ink(c)}; ${cp('polygon(0 100%, 100% 100%, 50% 50%)')}`)} ${rot(R4)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Accordion', 21, 'Concertina pleats: alternate faces catching the light, the fold running one way per cell.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${B(`inset: 0; background: ${ink(c)}; ${slotMask('90deg', '12%', '25%')}`)} ${A(`inset: 0; background: ${ink(c)}; ${slotMask('90deg', '12%', '25%')} ${xf('translateX(12.5%)')} opacity: 0.6;`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Quilling', 25, 'Quilled paper: narrow strips rolled into coils and pinched into teardrops.', (c) => ({
  vars: '',
  rule: `--rot: ${R8}; ${F} { ${B(`inset: 6%; background: ${ink(c)}; @shape: drop; ${ringMask('56%')}`)} ${A(`inset: 34%; border-radius: 50%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Papercut', 3, 'Papercutting: the design is the hole, so every shape here is genuinely absent.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('@pick(' + withHole(roundHole(30)) + ', ' + withHole(diamondHole(38, 38)) + ', ' + withHole(rectHole(28, 28)) + ')')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Foldout', 67, 'A gatefold opening: two leaves swinging back off a centre panel.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${B(`left: 2%; top: 8%; width: 44%; height: 84%; background: ${ink(c)}; ${cp('polygon(0 12%, 100% 0, 100% 100%, 0 88%)')}`)} ${A(`left: 54%; top: 8%; width: 44%; height: 84%; background: ${ink(c)}; ${cp('polygon(0 0, 100% 12%, 100% 88%, 0 100%)')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

// ════════════════════════════════════════════════════════════════════════════
// M. Tiling traditions — girih, zellige and the Japanese komon patterns, which
//    have been solving this exact problem for centuries.
// ════════════════════════════════════════════════════════════════════════════

add('Girih', 38, 'Girih strapwork: a ten-pointed rosette with the strap left open where it passes under.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 2%; background: ${ink(c)}; ${cp(starPoly(10, 0.56))} ${ringMask('62%')}`)} ${A(`inset: 34%; background: ${ink(c)}; ${cp(ngon(10, -90))} ${ringMask('58%')}`)} }${TR}`,
}), { grid: '6x9', tg: '4x4' });

add('Zellige', 22, 'Zellige: hand-cut tiles of a few standard shapes fitted edge to edge with no waste.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp(`@pick(${poly(DIAMOND)}, ${ngon(8, -112.5)}, polygon(0 0, 100% 0, 50% 50%), polygon(0 50%, 50% 0, 100% 50%, 50% 100%))`)} ${rot(R4)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Muqarna', 9, 'Muqarnas: tiers of little niches stepping out from the wall as the vault turns a corner.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 4%; top: 4%; width: 92%; height: 52%; background: ${ink(c)}; border-radius: 999px 999px 0 0; ${slotMask('90deg', '28%', '34%')}`)} ${A(`left: 4%; top: 58%; width: 92%; height: 38%; background: ${ink(c)}; border-radius: 999px 999px 0 0; ${slotMask('90deg', '20%', '24%')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Arabesque', 14, 'Arabesque: a scrolling vine reduced to the two lobes and the stem it turns on.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`left: 6%; top: 6%; width: 54%; height: 54%; border-radius: 100% 0 100% 0; background: ${ink(c)};`)} ${A(`left: 40%; top: 40%; width: 54%; height: 54%; border-radius: 0 100% 0 100%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Khatam', 62, 'Khatam inlay: an eight-pointed star built from two squares, with a smaller one at its centre.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 2%; background: ${ink(c)}; ${cp(starPoly(8, 0.58, -90))}`)} ${A(`inset: 30%; background: ${ink(c)}; ${cp(starPoly(8, 0.58, -67.5))}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Kufic', 1, 'Square kufic: letters squared off onto the grid until writing and brickwork are the same thing.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('@pick(polygon(0 0, 100% 0, 100% 34%, 34% 34%, 34% 100%, 0 100%), polygon(0 0, 34% 0, 34% 66%, 100% 66%, 100% 100%, 0 100%), polygon(0 0, 100% 0, 100% 100%, 66% 100%, 66% 34%, 0 34%), polygon(33% 0, 67% 0, 67% 100%, 33% 100%), polygon(0 33%, 100% 33%, 100% 67%, 0 67%))')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Jali', 54, 'A jali screen: the stone is what is left after the openings are cut, so the light does the drawing.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${cp(ringPoly(SQUARE, diamondHole(34, 34)))}`)} ${A(`inset: 38%; background: ${ink(c)}; ${cp(poly(DIAMOND))}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Sebka', 47, 'Sebka netting: a lattice of interlocking lobed diamonds run across the whole wall.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp(poly([[50, -1], [101, 50], [50, 101], [-1, 50]]))} ${A(`inset: 0; background: ${ink(c)}; ${cp(poly([[50, 18], [82, 50], [50, 82], [18, 50]]))} ${ringMask('44%')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Asanoha', 29, 'Asanoha, the hemp leaf: six spokes from a point, repeated until the whole cloth is stars.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${cp(starPoly(6, 0.14))}`)} ${A(`inset: 0; background: ${ink(c)}; ${cp(ngon(6, -90))} ${ringMask('88%')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Kikko', 35, 'Kikko, the tortoiseshell: hexagons packed tight, some of them carrying a smaller shell inside.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp(ngon(6, 0))} @random(0.45) { ${A(`inset: 0; background: ${ink(c)}; ${cp(ngon(6, 0, 26))}`)} } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Shippo', 7, 'Shippo, the seven treasures: circles overlapping four ways so the field reads as both rings and petals.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: -25%; border-radius: 50%; background: ${ink(c)}; ${ringMask('86%')}`)} ${A(`inset: 25%; border-radius: 50%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Yagasuri', 48, 'Yagasuri, the arrow feather: fletching marks all running the same way down the bolt of cloth.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 50% 18%, 100% 0, 100% 78%, 50% 96%, 0 78%)')} @match(@x % 2 == 1) { ${xf('rotate(180deg)')} } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Sayagata', 56, 'Sayagata: interlocking manji keys drawn as one continuous fret across the cloth.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${cp('polygon(0 40%, 60% 40%, 60% 0, 78% 0, 78% 58%, 0 58%)')}`)} ${A(`inset: 0; background: ${ink(c)}; ${cp('polygon(100% 42%, 40% 42%, 40% 100%, 22% 100%, 22% 24%, 100% 24%)')}`)} ${rot(R4)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Ichimatsu', 64, 'Ichimatsu: the plain two-colour check, with the odd square dropped out to keep the eye moving.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; @even { ${A(`inset: 0; background: ${ink(c)};`)} } @random(0.15) { background: transparent; ${A(`inset: 26%; background: ${ink(c)};`)} } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Uroko', 2, 'Uroko, the fish scale: triangles alternating point up and point down until the field armours over.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(50% 0, 101% 101%, -1% 101%)')} @even { ${cp('polygon(50% 101%, 101% 0, -1% 0)')} } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Tatewaku', 11, 'Tatewaku, rising steam: paired curves bulging apart and drawing back together up the cloth.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${B(`left: -34%; top: -8%; width: 84%; height: 116%; border-radius: 50%; background: ${ink(c)}; ${ringMask('84%')}`)} ${A(`left: 50%; top: -8%; width: 84%; height: 116%; border-radius: 50%; background: ${ink(c)}; ${ringMask('84%')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

if (all.length !== 200) {
  throw new Error(`batch 7 must hold exactly 200 designs, found ${all.length}`);
}

export const batch7 = all;
