// Batch 8 — 200 motifs (gallery orders 900+).
//
// Batches 1–7 all draw with the same four tools: a clip-path polygon written
// out by hand, a border-radius, a pseudo-element, and a repeating-linear
// gradient. That is a small corner of what css-doodle can actually do, so this
// batch is organised by *technique* rather than by subject — each section is
// one thing the library gives you that the earlier batches never used.
//
//   A. Polar curves.      @shape(points: 240; r: cos(4t)) turns a polar
//                         equation into a clip-path. Roses, cardioids,
//                         epitrochoids and cusped curves that no hand-written
//                         polygon list was ever going to reach.
//   B. Frames.            The same shape maker with `frame: n` returns the
//                         *outline* as a single closed path — an outer ring
//                         and a reversed inner ring — so the middle is a
//                         genuine hole, not a smaller shape painted on top.
//   C. Halo fields.       @m6(...) repeats a comma-separated value. On
//                         box-shadow that is six concentric rings per cell,
//                         each with its own sampled ink, and box-shadow
//                         transitions — so a reseed morphs the whole stack.
//   D. SVG masks.         mask: @svg(...) builds a mask out of inline SVG,
//                         with `rect*8 { x: @nx(1) }`-style repetition. The
//                         paint stays a plain background-color; the SVG only
//                         decides where the holes are.
//   E. Glyph fields.      content: "\@hex(@rand(9632, 9670))" prints from the
//                         Geometric Shapes block, and @unicode() from
//                         anywhere else. The ink is `color`, which is sampled
//                         and transitions like any other.
//   F. Rule-driven.       @match / @row / @col / @nth against @x, @y, @i and
//                         the @Math functions (@abs, @sin, @cos) — patterns
//                         that are computed from the cell's address instead
//                         of rolled.
//   G. Blobs.             border-radius: @repeat(4, @rand(30%, 70%)) gives
//                         four independent corner radii, and they transition.
//   H. Nested doodles.    @doodle(...) renders a whole second doodle into a
//                         background-image.
//   I. Filters.           @svg-filter(feTurbulence ...) roughens an edge the
//                         way no clip-path can.
//   J. Stripes & plots.   @stripe() writes gradient stops; @plot() returns
//                         coordinates around a circle for @m to place things
//                         on.
//   K. Placed cells.      @place-cell moves the shape inside its cell.
//
// House rules (inherited from every earlier batch, and enforced by
// generate-batch8.mjs / validate-batch8.mjs):
//
//   * exactly one @random(${shapeFrequency}) gate per design, so the frequency
//     slider always thins the field; nested @random(k) blocks inside it are
//     how a design varies itself;
//   * every design samples a *transition-able* ink per cell —
//     background-color, color, border-color or box-shadow — so a reseed
//     morphs. A design whose only variation is a background-image would snap,
//     and validate-batch8 fails it: the reseed check looks at those four
//     properties and deliberately ignores background-image. Sections H, J and
//     I therefore always pair their image with a sampled ink;
//   * a randomized custom prop read more than once goes through @var(--x);
//   * nothing paints var(--color0). A hole knocked out in the background
//     colour is a fake hole — set the background slot to transparent and it
//     stops erasing anything. Every gap here is real geometry: a `frame:`
//     outline, an SVG mask, a clip-path hole, or a gap between elements.
//     validate-batch8 re-renders the whole batch over a checkerboard with the
//     background slot set to #00000000 and requires byte-identical cells.

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

const SHADOW = '${shadow}';

// ── A/B: the shape maker ───────────────────────────────────────────────────
// `@shape()` walks a polar or parametric equation and returns a clip-path
// polygon. Adding `frame: n` returns the outline instead of the solid: css-
// doodle emits the outer ring followed by a reversed inner ring, so the middle
// is a real hole and whatever is behind the canvas shows through it. That is
// the whole reason this batch can draw rings, tracery and lace without ever
// painting the background colour over anything.
const sh = (spec) => cp(`@shape(${spec})`);

// A polar curve: `r` in terms of `t`, sampled at `points` steps.
const polar = (r, { points = 240, rotate, scale, frame, turn, move } = {}) =>
  [
    `points: ${points}`,
    `r: ${r}`,
    rotate === undefined ? null : `rotate: ${rotate}`,
    scale === undefined ? null : `scale: ${scale}`,
    frame === undefined ? null : `frame: ${frame}`,
    turn === undefined ? null : `turn: ${turn}`,
    move === undefined ? null : `move: ${move}`,
  ]
    .filter(Boolean)
    .join('; ');

// A parametric curve, x and y in terms of `t`.
const para = (x, y, { points = 240, rotate, scale, frame } = {}) =>
  [
    `points: ${points}`,
    `x: ${x}`,
    `y: ${y}`,
    rotate === undefined ? null : `rotate: ${rotate}`,
    scale === undefined ? null : `scale: ${scale}`,
    frame === undefined ? null : `frame: ${frame}`,
  ]
    .filter(Boolean)
    .join('; ');

// A regular n-gon, optionally as an outline.
const gon = (n, { rotate, scale, frame } = {}) =>
  [
    `points: ${n}`,
    rotate === undefined ? null : `rotate: ${rotate}`,
    scale === undefined ? null : `scale: ${scale}`,
    frame === undefined ? null : `frame: ${frame}`,
  ]
    .filter(Boolean)
    .join('; ');

// ── C: @m halo stacks ──────────────────────────────────────────────────────
// `@m6(...)` emits six comma-separated copies with @n counting 1..6, so one
// declaration becomes six concentric shadows. box-shadow transitions, so the
// whole stack morphs on reseed.
// A px length authored for a six-column grid, scaled down as the grid
// densifies — the idiom Terrain and Ring already use. box-shadow offsets and
// spreads take lengths only, never percentages, so halos have to be sized
// this way rather than as a fraction of the cell.
const u = (v) => `calc(${v}px * 6 / @size-col)`;

const halo = (n, step, c, blur = 0) =>
  `box-shadow: @m${n}(0 0 ${blur ? `calc(@n * ${blur}px * 6 / @size-col)` : '0'} calc(@n * ${step}px * 6 / @size-col) ${ink(c)});`;

const trail = (n, dx, dy, c) =>
  `box-shadow: @m${n}(calc(@n * ${dx}px * 6 / @size-col) calc(@n * ${dy}px * 6 / @size-col) 0 0 ${ink(c)});`;

// ── D: SVG masks ───────────────────────────────────────────────────────────
// @svg() returns a data-URI usable as a mask, so the SVG decides the holes
// while the paint stays a plain, sampled background-color.
const svgMask = (body) => msk(`@svg(${body})`);

// `n` evenly spaced bars across a 100-unit viewBox, `w` units wide, running
// along `axis`.
const barsMask = (n, w, axis = 'y') =>
  svgMask(
    `viewBox: 0 0 100 100; rect*${n} { ` +
      (axis === 'y'
        ? `x: calc(@nx(-1) * ${100 / n}); y: -1; width: ${w}; height: 102;`
        : `x: -1; y: calc(@nx(-1) * ${100 / n}); width: 102; height: ${w};`) +
      ' fill: #000 }'
  );

// ── E: glyph fields ────────────────────────────────────────────────────────
// `content: "\@hex(n)"` prints the codepoint `n`. The Geometric Shapes block
// (U+25A0–U+25FF) is almost entirely squares, triangles, diamonds and circles
// — a ready-made shape library that costs one declaration.
const glyph = (from, to, { size = '150%', extra = '' } = {}) =>
  `line-height: 1; text-align: center; font-size: ${size}; ${extra} :after { content: "\\@hex(@rand(${from}, ${to}))";${pt} }`;

const glyphPick = (...codes) =>
  `line-height: 1; text-align: center; font-size: 150%; :after { content: "\\@hex(@pick(${codes.join(', ')}))";${pt} }`;

// ── real holes, cut by hand ────────────────────────────────────────────────
const P = (pts) => pts.map(([x, y]) => `${(+x).toFixed(1)}% ${(+y).toFixed(1)}%`).join(', ');
const poly = (pts) => `polygon(${P(pts)})`;
const withHole = (inner) =>
  `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, ${P(inner)}, ${P([inner[0]])})`;
const rectHole = (x, y) => [
  [x, y],
  [x, 100 - y],
  [100 - x, 100 - y],
  [100 - x, y],
];

const ringMask = (bore) =>
  msk(`radial-gradient(circle closest-side at 50% 50%, transparent ${bore}, #000 ${bore})`);
const slotMask = (angle, on, off) =>
  msk(`repeating-linear-gradient(${angle}, #000 0 ${on}, transparent ${on} ${off})`);

// ── palette bank ───────────────────────────────────────────────────────────
// color0 = background. Palettes may repeat across designs (they are different
// artworks).
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

// Every motif name used anywhere in the project so far, including the designs
// that were authored for batch 7 and cut before it shipped — a name should
// never come to mean two different things.
const TAKEN = new Set(
  (
    'abacus accordion acorn agate ampersand amphora analemma annulet ' +
    'annulus aperture apogee arabesque arcade argyle armilla arpeggio ' +
    'arrow arrowplay asanoha ascender ascent aster asterisk astragal ' +
    'atoll aurora awning azimuth azulejo balloon barcode bargello barline ' +
    'barrulet basalt basket baste battlement bauhaus beadrow bee bento ' +
    'berry bevel beveled bezant bezel bias billet billow blockfall bloks ' +
    'bloom blossom bobbin bokeh bolt bond boro bowl bowtie boxweave ' +
    'bracket bracketpair bract braid bramble brickwork bristle brocade ' +
    'brokenbond bubble bubbles bud bulge bunting buoy burgee bushing ' +
    'button buttonhole cadenza cairn caltrop calyx caneweave capsule ' +
    'caret carousel cartouche cascade cattail caustic cavetto celleye ' +
    'chaff chalice chamfer checkers checkmark chenille chert chevarrow ' +
    'chevrondiamond chevronel chime chip churn cinch circuit cirque ' +
    'cirrus citrus cleat clef clover cobble cog coil cointile colophon ' +
    'comb comet compass confetti constellation contour convex coral ' +
    'corbel cornerbite cornerpunch cornice corolla corona counter cove ' +
    'crank crater crazy crease crescendo crescent cresset crossbar ' +
    'crosshair crosshatch crosslet crotchet crux crystal cube cumulus ' +
    'cupola curl cusp damask damier dapple dart datum daybreak delta ' +
    'dentil diadem diadot dial diamond3d diamonddust diamondeye ' +
    'diamondframe diaper diminuendo discus disque dogtooth dome domino ' +
    'dotdash dotwave doubinset draughts drift driftleaf drizzle dropcap ' +
    'dune echo ecliptic eddy edgeband elbow ell emboss enso ermine ' +
    'estuary eyelet facade facetbox facetdiamond facetgrad fang fanleaf ' +
    'fanlight fermata fillet fin fishscale flagstone flange fleck flight ' +
    'flint flurry flutter flywheel foldout foliage folio fourpane frame ' +
    'frameblock freckle frond froth fusil fuzz gable gablet gasket gauze ' +
    'gem gemcut geode gibbous gingham girih glint glitch glyph gnomon ' +
    'grain granule grassblade graticule gravel gridline gumball gutter ' +
    'gyron hachure halfblock halfdot halfink halfmoon halfpenny halftone ' +
    'halo harlequin hashmark hatch heart herringbone hexagram hexbloom ' +
    'hexdot hexnut hextile hoop hopscotch houndstooth hourglass hurdle ' +
    'ibeam ichimatsu ikat impasto incense inkblot inset insetstep iris ' +
    'isobar isocube isopleth ivy jacquard jali jelly jewel jumble ' +
    'junction karst kasuri kerf kern keyhole keypad keystone keyway ' +
    'keywork khatam kikko kilim kintsugi kirigami kite koi kufic ladybird ' +
    'lagoon lantern lattice laundry ledger lens lentil levels ligature ' +
    'lily links lintel lobe logcabin loophole lotus louvre loxodrome ' +
    'lozenge lozengegrad lozengy lune lunette macaron madras maltese ' +
    'mandorla mascle massif matchstick matte maze meadow meander medusa ' +
    'memphis meridian merlon mesh metro mica minim mirror misprint ' +
    'mistwave miura mixtape moire monolith moonphase moraine morse ' +
    'mortise mosaicglass mosaictile mote mudcloth mullion muqarna nacre ' +
    'nadir needle neon northstar notch notchbar notchblock obelisk ' +
    'octagon octant oculus odessa offset offsetbox ogee orb orbit origami ' +
    'ostinato ovolo oxbow paisley palisade palmette papercut parallax ' +
    'parquet passepartout patina pavers pawl pebble pebbledot pediment ' +
    'pellet pendulum pennant pennantbox pennon penta pentafan penumbra ' +
    'petal picket pieslice pinhex pinhole pinion pinmark pinnacle pinnate ' +
    'pinnule pinweave pinwheel pinwheelstar pinwheeltile pinwheelweave ' +
    'pip pique piston pixel plaid plasma pleat plumb plus pod polaroid ' +
    'polka polkapair pompom pondring popsicle portal postage posy potent ' +
    'prisma prismfold prow pulsar pulsebar pylon pyramid pyramid3d pyrite ' +
    'quadrant quadrille quarterbar quarterblock quarterfall quartz quasar ' +
    'quaver quilling quilt quiltsquare quincunx quire quoit raceme radar ' +
    'radius rafter rail rainbow raindrop rake range ratchet reef regatta ' +
    'register rhomboid rhumb ribbonfold ricrac riffle rill ring ringdot ' +
    'ringlink ripple rivet rondure roundel rune rungs rustre saguaro sail ' +
    'saltire sandbar sash sashiko sawedge sayagata scale scallop ' +
    'scatterdot schist scotia scramble sebka sector seersucker seigaiha ' +
    'selvedge semibreve sepal sequin serif sextant shard shatter shelf ' +
    'shibori shield shingle shippo shoal shoji shuffle sickle sigil ' +
    'signal silo silt sine sixstar skerry skew skewblock slant slat ' +
    'sliptile sliver snowflake soffit sonata spandrel spark sparkle ' +
    'spathe spearhead spectrum spill spiralblock spire splat spline ' +
    'splinter splithz splittri spore sprig sprinkles sprocket sprout ' +
    'squall squinch staccato stackbond stamen star5 starflake starlet ' +
    'stave stella step step3d stipple stipule stitch strata sunburst ' +
    'sunken sunwheel surf swellbox switchback symmetry syzygy tag tally ' +
    'talus taper target tatami tatewaku teardrop tee tendril terrain ' +
    'tesserae tetro thistle tickmark tictac tilt tittle torsion torteau ' +
    'trace trackline transom trapeze trapezoid traverse trellis tremolo ' +
    'triad trianglet triband trigram triquetra trishard truchet tube ' +
    'tumble turret tweed twill twinkle umbel uroko vair vee veil venn ' +
    'vinyl vitrail voltage volute vortex voussoir wander waning warp wash ' +
    'washer waterbomb wavelet waypoint weave weft wheelarc whorl wicket ' +
    'windowframe windowpane wingtri wreath yagasuri zagtile zee zellige ' +
    'zenith ziggurat ziggy zigline zigzagfold zipper'
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

let order = 900;
const all = [];

// cfg:
//   grid   default "columns x rows" for the editor       (default '6x9')
//   freq   default frequency                             (default 1)
//   tg/tf  gallery-thumbnail grid / frequency            (default '5x5' / 1)
//   min    sizing.minCellPx floor, for px-scaled details
//   shadow adds the originals' Shadow toggle; the rule must use ${shadow}
const add = (name, palIdx, description, build, cfg = {}) => {
  const slug = name.toLowerCase();
  if (!/^[a-z][a-z0-9]*$/.test(slug)) throw new Error(`bad slug: ${slug}`);
  if (RESERVED.has(slug)) throw new Error(`slug is a reserved word: ${slug}`);
  if (TAKEN.has(slug)) throw new Error(`slug already taken elsewhere: ${slug}`);
  if (all.some((d) => d.slug === slug)) throw new Error(`duplicate slug in batch 8: ${slug}`);
  const palette = PAL[palIdx % PAL.length];
  const c = palette.length;
  const { vars, rule } = build(c);
  if (/var\(\s*--color0\s*\)/.test(`${vars} ${rule}`)) {
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
    gridDefault: cfg.grid ?? '6x9',
    freqDefault: cfg.freq ?? 1,
    ...(cfg.min ? { minCellPx: cfg.min } : {}),
    ...(cfg.shadow === undefined ? {} : { shadow: cfg.shadow }),
    thumb: { grid: cfg.tg ?? '5x5', frequency: cfg.tf ?? 1 },
    vars,
    rule,
  });
};

// ════════════════════════════════════════════════════════════════════════════
// A. Polar curves — @shape() walks an equation and hands back a clip-path, so
//    the outline is computed rather than typed out point by point.
// ════════════════════════════════════════════════════════════════════════════

add('Cardioid', 8, 'The cardioid, r = 1 − cos t: one round lobe drawn into a single cusp, turned to a new bearing each cell.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(polar('1 - cos(t)', { scale: 0.5 }))} ${rot(R8)} }${TR}`,
}), { tg: '5x5' });

add('Limacon', 14, 'A dimpled limaçon, r = 0.55 + 0.45 cos t — the cardioid caught just before its cusp closes.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(polar('0.55 + 0.45 * cos(t)', { scale: 0.98 }))} ${rot(R8)} }${TR}`,
}), { tg: '5x5' });

add('Nephroid', 3, 'The nephroid — the two-cusped kidney a circle traces rolling around another twice its size.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(para('3 * cos(t) - cos(3t)', '3 * sin(t) - sin(3t)', { scale: 0.25 }))} ${rot(R8)} }${TR}`,
}), { tg: '5x5' });

add('Deltoid', 21, 'The deltoid: three cusps, the curve a circle traces rolling inside one three times its width.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(para('2 * cos(t) + cos(2t)', '2 * sin(t) - sin(2t)', { scale: 0.33 }))} ${rot(R8)} }${TR}`,
}), { tg: '5x5' });

add('Astroid', 27, 'The astroid, x = cos³t, y = sin³t — a square pulled inwards on all four sides until its corners become cusps.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(para('cos(t)^3', 'sin(t)^3', { scale: 0.98 }))} ${rot(R4)} }${TR}`,
}), { tg: '5x5' });

add('Lemniscate', 46, 'The lemniscate: two lobes meeting at a point, the figure of eight laid on its side.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(polar('abs(cos(2t))^0.5', { scale: 0.98 }))} ${rot(R4)} }${TR}`,
}), { tg: '5x5' });

add('Trifolium', 16, 'Three petals from r = cos 3t, the simplest of the rose curves that comes out odd.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(polar('cos(3t)', { scale: 0.98 }))} ${rot(R8)} }${TR}`,
}), { tg: '5x5' });

add('Quadrifolium', 24, 'Four petals from r = cos 2t — an even rose always doubles its count.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(polar('cos(2t)', { scale: 0.98 }))} ${rot(R8)} }${TR}`,
}), { tg: '5x5' });

add('Bifolium', 32, 'The bifolium, r = 4 sin²t cos t: two unequal leaves springing off one stem.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(polar('4 * sin(t)^2 * cos(t)', { scale: 0.65 }))} ${rot(R8)} }${TR}`,
}), { tg: '5x5' });

add('Hexafoil', 39, 'Six petals from r = |cos 3t| — taking the absolute value folds the negative lobes back into the flower.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(polar('abs(cos(3t))', { scale: 0.98 }))} ${rot(R8)} }${TR}`,
}), { tg: '5x5' });

add('Rhodonea', 9, 'A five-petalled rhodonea, r = cos 5t, the rose curve at its most familiar.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(polar('cos(5t)', { scale: 0.98 }))} ${rot(R8)} }${TR}`,
}), { tg: '5x5' });

add('Pentafoil', 25, 'Five broad petals from r = |cos 2.5t|, cut where the half-frequency brings the curve back on itself.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(polar('abs(cos(2.5t))', { points: 300, scale: 0.98, turn: 2 }))} ${rot(R8)} }${TR}`,
}), { tg: '5x5' });

add('Heptafoil', 13, 'Seven petals from r = |cos 3.5t| — an odd count that only closes after two turns.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(polar('abs(cos(3.5t))', { points: 320, scale: 0.98, turn: 2 }))} ${rot(R8)} }${TR}`,
}), { tg: '5x5' });

add('Epitrochoid', 36, 'An epitrochoid: a pen fixed to a wheel rolling around the outside of another, looping as it goes.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(para('4 * cos(t) - 1.6 * cos(4t)', '4 * sin(t) - 1.6 * sin(4t)', { scale: 0.19 }))} ${rot(R8)} }${TR}`,
}), { tg: '5x5' });

add('Hypotrochoid', 44, 'A hypotrochoid: the same pen, but with the wheel rolling round the inside, so the loops turn inward.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(para('3 * cos(t) + 1.8 * cos(3t)', '3 * sin(t) - 1.8 * sin(3t)', { scale: 0.21 }))} ${rot(R8)} }${TR}`,
}), { tg: '5x5' });

add('Spirograph', 19, 'The toy, plotted properly: a seven-lobed hypotrochoid with the pen set well off the wheel\'s centre.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(para('5 * cos(t) + 2.2 * cos(6t)', '5 * sin(t) - 2.2 * sin(6t)', { points: 320, scale: 0.14 }))} ${rot(R8)} }${TR}`,
}), { tg: '5x5' });

add('Epicycle', 51, 'A five-cusped epicycloid — the path Ptolemy would have drawn to explain a wandering planet.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(para('6 * cos(t) - cos(6t)', '6 * sin(t) - sin(6t)', { scale: 0.14 }))} ${rot(R8)} }${TR}`,
}), { tg: '5x5' });

add('Superellipse', 34, 'A superellipse: the family that runs from a diamond through a circle to a square, caught at n = 1.6, where the diamond is still winning.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(polar('1 / ((abs(cos(t))^1.6 + abs(sin(t))^1.6)^0.625)', { points: 200, scale: 0.98 }))} ${rot(R4)} }${TR}`,
}), { tg: '5x5' });

add('Squircle', 63, 'The squircle — the same superellipse taken to n = 5, where the square has almost won.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(polar('1 / ((abs(cos(t))^5 + abs(sin(t))^5)^0.2)', { points: 200, scale: 0.94 }))} ${rot(R4)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Volution', 59, 'A spiral wound three full turns, r growing steadily with the angle.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(polar('0.16 * t', { points: 400, turn: 3, frame: 6, scale: 0.5 }))} ${rot(R8)} }${TR}`,
}), { tg: '5x5' });

add('Involute', 41, 'The involute of a circle — the curve the end of a string traces as it unwinds off a drum.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(para('cos(t) + t * sin(t)', 'sin(t) - t * cos(t)', { points: 300, turn: 1, scale: 0.22 }))} ${rot(R8)} }${TR}`,
}), { tg: '5x5' });

add('Evolute', 11, 'The evolute of an ellipse: an astroid stretched, so its four cusps stop being square.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(para('1.3 * cos(t)^3', '0.75 * sin(t)^3', { scale: 0.9 }))} ${rot(R2)} }${TR}`,
}), { tg: '5x5' });

add('Folium', 15, 'The folium, r = cos t (4 sin²t − 1): a small leaf tucked inside a larger one.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(polar('cos(t) * (4 * sin(t)^2 - 1)', { scale: 0.6 }))} ${rot(R8)} }${TR}`,
}), { tg: '5x5' });

add('Chrysanth', 26, 'A chrysanthemum head: r = 1 + 0.3 sin 12t, a circle given twelve shallow petals.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(polar('1 + 0.3 * sin(12t)', { points: 300, scale: 0.74 }))} ${rot(R8)} }${TR}`,
}), { tg: '5x5' });

add('Cogwheel', 22, 'A wheel with fourteen teeth, r = 1 + 0.14 cos 14t — the ripple is the tooth.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(polar('1 + 0.14 * cos(14t)', { points: 320, scale: 0.86 }))} ${rot(R8)} }${TR}`,
}), { tg: '5x5' });

add('Starfish', 45, 'Five blunt arms, r = 1 − 0.5|sin 2.5t|, splayed the way a starfish actually sits.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(polar('1 - 0.5 * abs(sin(2.5t))', { points: 300, turn: 2, scale: 0.98 }))} ${rot(R8)} }${TR}`,
}), { tg: '5x5' });

// ════════════════════════════════════════════════════════════════════════════
// B. Frames — the same shape maker with `frame: n`. css-doodle returns the
//    outline as one closed path (outer ring, then the inner ring reversed), so
//    the middle is a genuine hole: nothing is painted over, and the canvas
//    shows straight through.
// ════════════════════════════════════════════════════════════════════════════

add('Torus', 0, 'Plain rings, bored right through — the shape maker\'s outline mode at its simplest.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(polar('1', { points: 160, frame: '@pick(8, 14, 22)', scale: 0.94 }))} }${TR}`,
}), { tg: '4x4' });

add('Quatrefoil', 40, 'The quatrefoil of Gothic tracery: four lobes cut clean through the stone.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(polar('abs(cos(2t))^0.6', { points: 240, frame: 12, scale: 0.96 }))} ${rot(R4)} }${TR}`,
}), { tg: '4x4' });

add('Cinquefoil', 47, 'Five lobes to the opening instead of four, which is why the mullions never line up.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(polar('abs(cos(2.5t))^0.6', { points: 300, turn: 2, frame: 12, scale: 0.96 }))} ${rot(R8)} }${TR}`,
}), { tg: '4x4' });

add('Trefoil', 16, 'Three lobes — the trefoil, worked as an outline so the light comes through it.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(polar('abs(cos(1.5t))^0.6', { points: 300, turn: 2, frame: 13, scale: 0.96 }))} ${rot(R8)} }${TR}`,
}), { tg: '4x4' });

add('Mouchette', 57, 'The mouchette — a dagger-shaped light with one end drawn out to a curved point.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(polar('1 - 0.85 * cos(t)', { points: 240, frame: 11, scale: 0.5 }))} ${rot(R8)} }${TR}`,
}), { tg: '4x4' });

add('Soufflet', 33, 'The soufflet: the bellows-shaped light left over between three circles in curvilinear tracery.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(polar('abs(cos(1.5t))^1.4', { points: 300, turn: 2, frame: 11, scale: 0.96 }))} ${rot(R8)} }${TR}`,
}), { tg: '4x4' });

add('Lierne', 18, 'A lierne rib — a short one that ties two main ribs together and carries nothing.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(gon(6, { frame: '@pick(9, 16)', rotate: 30, scale: 0.96 }))} ${rot(R2)} }${TR}`,
}), { tg: '5x5' });

add('Tierceron', 4, 'A tierceron springing from the wall to a ridge — a rib outline with a second inside it.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${sh(gon(8, { frame: 9, scale: 0.98 }))}`)} ${A(`inset: 22%; background: ${ink(c)}; ${sh(gon(8, { frame: 14, rotate: 22.5 }))}`)} }${TR}`,
}), { tg: '4x4' });

add('Fanvault', 30, 'A fan vault seen from below: ribs radiating out of one springing point.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(polar('1 + 0.22 * cos(16t)', { points: 320, frame: 20, scale: 0.88 }))} ${rot(R8)} }${TR}`,
}), { tg: '4x4' });

add('Grisaille', 52, 'Grisaille glazing: a plain leaded grid with the colour kept out of it.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(gon(4, { frame: '@pick(7, 12, 18)', rotate: 45, scale: 0.99 }))} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Came', 19, 'The lead came itself — the H-section that holds each quarry, and nothing else.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(gon(4, { frame: 13, scale: 0.99 }))} ${A(`inset: 44% 6%; background: ${ink(c)};`)} ${rot(R2)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Quarry', 5, 'Diamond quarries, each one an outline, leaded up into a plain lattice window.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(gon(4, { frame: 10, scale: 0.99 }))} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Ogive', 37, 'The ogive: a pointed arch outlined, standing or inverted as the row alternates.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(polar('1 - 0.45 * cos(t)', { points: 240, frame: 12, rotate: -90, scale: 0.66 }))} @match(@y % 2 == 1) { ${xf('rotate(180deg)')} } }${TR}`,
}), { tg: '5x5' });

add('Tracery', 65, 'Bar tracery: a lobed outline with a smaller lobed outline set inside it.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${sh(polar('abs(cos(2t))^0.6', { frame: 10, scale: 0.98 }))}`)} ${A(`inset: 28%; background: ${ink(c)}; ${sh(polar('abs(cos(2t))^0.6', { frame: 16, rotate: 45 }))}`)} }${TR}`,
}), { tg: '4x4' });

add('Cusping', 2, 'Cusped foils: the little points left where two arcs of a tracery light meet.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(polar('1 - 0.34 * abs(cos(4t))', { points: 300, frame: 14, scale: 0.96 }))} ${rot(R8)} }${TR}`,
}), { tg: '4x4' });

add('Rosace', 58, 'A rose window: a bored hub with twelve outlined spokes standing off it.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 2%; background: ${ink(c)}; ${sh(polar('1 + 0.3 * cos(12t)', { points: 300, frame: 26, scale: 0.8 }))}`)} ${A(`inset: 34%; background: ${ink(c)}; ${sh(polar('1', { points: 120, frame: 22 }))}`)} }${TR}`,
}), { tg: '4x4' });

add('Dagger', 43, 'The dagger light — a long, narrow outline with a point at each end.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(para('0.34 * cos(t)^3', 'sin(t)', { points: 200, frame: 11, scale: 0.98 }))} ${rot(R4)} }${TR}`,
}), { tg: '5x5' });

add('Boss', 10, 'A carved boss where the ribs meet: a solid knot inside an open ring.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 2%; background: ${ink(c)}; ${sh(polar('1', { points: 160, frame: 16 }))}`)} ${A(`inset: 32%; background: ${ink(c)}; ${sh(polar('abs(cos(2t))^0.6', { points: 200 }))}`)} }${TR}`,
}), { tg: '4x4' });

add('Webbing', 55, 'The web — the thin panel between the ribs, cut away here so only the frame is left.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(gon(3, { frame: '@pick(10, 18)', rotate: '@pick(0, 180)', scale: 0.98 }))} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Respond', 20, 'A respond — the half-pier set against a wall, drawn as a half-open frame.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(gon(6, { frame: 12, rotate: 90, scale: 0.98 }))} ${cp('polygon(0 0, 100% 0, 100% 74%, 0 74%)')} ${rot(R4)} }${TR}`,
}), { tg: '5x5' });

add('Springer', 64, 'The springer: the first voussoir of the arch, where the curve leaves the vertical.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(polar('1 - 0.3 * cos(t)', { points: 200, frame: 15, scale: 0.7 }))} ${rot(R4)} }${TR}`,
}), { tg: '5x5' });

add('Impost', 12, 'The impost block, outlined — the course the arch actually sits on.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 4%; top: 10%; width: 92%; height: 46%; background: ${ink(c)}; ${sh(gon(4, { frame: 10, rotate: 45 }))}`)} ${A(`left: 14%; top: 62%; width: 72%; height: 28%; background: ${ink(c)}; ${sh(gon(4, { frame: 14, rotate: 45 }))}`)} }${TR}`,
}), { tg: '5x5' });

add('Necking', 29, 'The necking ring at the head of a shaft: two outlines, one tight inside the other.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 2%; background: ${ink(c)}; ${sh(polar('1', { points: 160, frame: 8 }))}`)} ${A(`inset: 16%; background: ${ink(c)}; ${sh(polar('1', { points: 160, frame: 10 }))}`)} }${TR}`,
}), { tg: '4x4' });

add('Listel', 49, 'A listel — the narrow flat band that separates two mouldings, run as an open square.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(gon(4, { frame: 6, rotate: 45, scale: 0.99 }))} ${A(`inset: 30%; background: ${ink(c)}; ${sh(gon(4, { frame: 12, rotate: 45 }))}`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Reglet', 6, 'A reglet: the thinnest fillet there is, so the frame is almost all hole.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(gon('@pick(3, 4, 5, 6)', { frame: 6, scale: 0.98 }))} ${rot(R4)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Bandelet', 66, 'A bandelet run round a lobed opening, doubled where the lobes meet.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(polar('1 + 0.18 * cos(6t)', { points: 260, frame: '@pick(10, 18)', scale: 0.9 }))} ${rot(R8)} }${TR}`,
}), { tg: '4x4' });

// ════════════════════════════════════════════════════════════════════════════
// C. Halo fields — @m6(...) writes six comma-separated copies of a value with
//    @n counting 1..6. On box-shadow that is six shells from one declaration,
//    each with its own sampled ink, and the whole stack transitions on reseed.
// ════════════════════════════════════════════════════════════════════════════

add('Aureole', 1, 'Six rings of light standing off a small core, each one a different ink.', (c) => ({
  vars: '',
  rule: `${F} { width: 8%; height: 8%; margin: 46%; border-radius: 50%; background: ${ink(c)}; ${halo(6, 4, c)} }${TR}`,
}), { tg: '4x4', min: 30 });

add('Nimbus', 45, 'A halo built from square shells rather than round ones, stepping out to the cell edge.', (c) => ({
  vars: '',
  rule: `${F} { width: 10%; height: 10%; margin: 45%; background: ${ink(c)}; ${halo(5, 5, c)} }${TR}`,
}), { tg: '4x4', min: 30 });

add('Glory', 21, 'The glory seen from an aeroplane: soft concentric bands, each blurred a little more than the last.', (c) => ({
  vars: '',
  rule: `${F} { width: 8%; height: 8%; margin: 46%; border-radius: 50%; background: ${ink(c)}; ${halo(5, 5, c, 3)} }${TR}`,
}), { tg: '4x4', min: 30 });

add('Parhelion', 33, 'A sun dog: a bright core with its shells pushed off to one side.', (c) => ({
  vars: '',
  rule: `${F} { width: 12%; height: 12%; margin: 44%; border-radius: 50%; background: ${ink(c)}; box-shadow: @m5(${u(3)} 0 0 calc(@n * 3px * 6 / @size-col) ${ink(c)}); }${TR}`,
}), { tg: '4x4', min: 30 });

add('Sundog', 60, 'Two bright patches either side of the sun, each with its own stack of shells.', (c) => ({
  vars: '',
  rule: `${F} { width: 10%; height: 10%; margin: 45%; border-radius: 50%; background: ${ink(c)}; box-shadow: @m4(calc(@n * 5px * 6 / @size-col) 0 0 calc(@n * 2px * 6 / @size-col) ${ink(c)}), @m4(calc(@n * -5px * 6 / @size-col) 0 0 calc(@n * 2px * 6 / @size-col) ${ink(c)}); }${TR}`,
}), { tg: '4x4', min: 30 });

add('Halation', 22, 'Halation round a bright edge: shells that spread faster the further out they get.', (c) => ({
  vars: '',
  rule: `${F} { width: 14%; height: 14%; margin: 43%; border-radius: 50%; background: ${ink(c)}; box-shadow: @m5(0 0 0 calc(@n * @n * 1.4px * 6 / @size-col) ${ink(c)}); }${TR}`,
}), { tg: '4x4', min: 30 });

add('Fresnel', 3, 'A Fresnel lens in section: eight narrow concentric steps instead of one thick curve.', (c) => ({
  vars: '',
  rule: `${F} { width: 6%; height: 6%; margin: 47%; border-radius: 50%; background: ${ink(c)}; ${halo(8, 3, c)} }${TR}`,
}), { tg: '4x4', min: 34 });

add('Airy', 39, 'The Airy pattern: a bright disc with fainter rings around it, softening as they go out.', (c) => ({
  vars: '',
  rule: `${F} { width: 16%; height: 16%; margin: 42%; border-radius: 50%; background: ${ink(c)}; ${halo(4, 4, c, 1.5)} opacity: 0.92; }${TR}`,
}), { tg: '4x4', min: 30 });

add('Speckle', 28, 'Laser speckle: one grain per cell, thrown somewhere different each time, with a few shells on it.', (c) => ({
  vars: '',
  rule: `${F} { width: 8%; height: 8%; margin: @rand(26%, 60%) @rand(26%, 60%); border-radius: 50%; background: ${ink(c)}; ${halo(4, 3, c)} }${TR}`,
}), { grid: '8x12', tg: '6x6', min: 30 });

add('Wavefront', 14, 'A wavefront spreading from a point that sits somewhere different in every cell.', (c) => ({
  vars: '',
  rule: `${F} { width: 6%; height: 6%; margin: @pick(18%, 46%, 72%) @pick(18%, 46%, 72%); border-radius: 50%; background: ${ink(c)}; ${halo(3, 4, c)} }${TR}`,
}), { tg: '4x4', min: 34 });

add('Phasor', 51, 'Phasors stepping round: each shell pushed a little further along the same diagonal.', (c) => ({
  vars: '',
  rule: `${F} { width: 16%; height: 16%; margin: 42%; border-radius: 50%; background: ${ink(c)}; ${trail(6, 3, 3, c)} ${rot(R4)} }${TR}`,
}), { tg: '4x4', min: 30 });

add('Harmonic', 9, 'Shells at harmonic spacings — one, two, three, four — so the gaps between them stay even.', (c) => ({
  vars: '',
  rule: `${F} { width: 10%; height: 10%; margin: 45%; border-radius: 50%; background: ${ink(c)}; ${halo(4, 6, c)} }${TR}`,
}), { tg: '4x4', min: 30 });

add('Overtone', 36, 'The overtone series: shells that crowd together as they climb.', (c) => ({
  vars: '',
  rule: `${F} { width: 8%; height: 8%; margin: 46%; border-radius: 50%; background: ${ink(c)}; box-shadow: @m6(0 0 0 calc((26px - 24px / @n) * 6 / @size-col) ${ink(c)}); }${TR}`,
}), { tg: '4x4', min: 30 });

add('Resonance', 13, 'A resonating plate: square shells stepping out, with one ruled line inset on the plate itself.', (c) => ({
  vars: '',
  rule: `${F} { width: 18%; height: 18%; margin: 41%; background: ${ink(c)}; box-shadow: @m5(0 0 0 calc(@n * 4px * 6 / @size-col) ${ink(c)}), inset 0 0 0 2px ${ink(c)}; ${rot(R4)} }${TR}`,
}), { tg: '4x4', min: 34 });

add('Damping', 55, 'A damped echo: each shell offset a little further from the last, and a little smaller.', (c) => ({
  vars: '',
  rule: `${F} { width: 22%; height: 22%; margin: 39%; border-radius: 50%; background: ${ink(c)}; ${trail(5, 4, -3.4, c)} }${TR}`,
}), { tg: '4x4', min: 30 });

add('Gong', 41, 'A struck gong: a heavy boss with the rim still ringing round it.', (c) => ({
  vars: '',
  rule: `${F} { width: 26%; height: 26%; margin: 37%; border-radius: 50%; background: ${ink(c)}; ${halo(3, 6, c)} }${TR}`,
}), { tg: '4x4', min: 30 });

add('Cymbal', 30, 'A cymbal face on: the bell at the centre, then the lathe grooves running out to the edge.', (c) => ({
  vars: '',
  rule: `${F} { width: 10%; height: 10%; margin: 45%; border-radius: 50%; background: ${ink(c)}; ${halo(7, 3, c)} }${TR}`,
}), { tg: '4x4', min: 34 });

add('Carillon', 18, 'A carillon: bells of graded size, each with its own ring of overtones.', (c) => ({
  vars: '',
  rule: `${F} { @size: @pick(8%, 14%, 20%); margin: @pick(46%, 43%, 40%); border-radius: 50%; background: ${ink(c)}; ${halo(4, 4, c)} }${TR}`,
}), { tg: '4x4', min: 30 });

add('Tocsin', 63, 'The alarm bell: two hard shells round a dense core, nothing soft about it.', (c) => ({
  vars: '',
  rule: `${F} { width: 24%; height: 24%; margin: 38%; border-radius: 50%; background: ${ink(c)}; box-shadow: 0 0 0 ${u(4)} ${ink(c)}, 0 0 0 ${u(9)} ${ink(c)}; }${TR}`,
}), { tg: '5x5', min: 30 });

add('Knell', 27, 'A single low stroke: one core, one shell, and a lot of space around it.', (c) => ({
  vars: '',
  rule: `${F} { width: 16%; height: 16%; margin: @rand(30%, 54%); border-radius: 50%; background: ${ink(c)}; box-shadow: 0 0 0 calc(@rand(2, 7) * 1px * 6 / @size-col) ${ink(c)}; }${TR}`,
}), { grid: '8x12', tg: '6x6', min: 30 });

add('Peal', 6, 'A peal of six, each shell rung a step wider than the one before it.', (c) => ({
  vars: '',
  rule: `${F} { width: 6%; height: 6%; margin: 47%; border-radius: 50%; background: ${ink(c)}; box-shadow: @m5(0 0 0 calc((@n * 1.4px + @n * @n * 0.35px) * 6 / @size-col) ${ink(c)}); }${TR}`,
}), { tg: '4x4', min: 34 });

add('Bourdon', 44, 'The bourdon — the heaviest bell in the tower, and the slowest to stop ringing.', (c) => ({
  vars: '',
  rule: `${F} { width: 36%; height: 36%; margin: 32%; border-radius: 50%; background: ${ink(c)}; ${halo(2, 5, c)} }${TR}`,
}), { tg: '4x4', min: 30 });

add('Tremor', 50, 'A tremor felt from a point off to one side, its rings running out unevenly.', (c) => ({
  vars: '',
  rule: `${F} { width: 8%; height: 8%; margin: @pick(22%, 46%, 70%) @pick(22%, 46%, 70%); border-radius: 50%; background: ${ink(c)}; ${halo(3, 3, c, 1)} }${TR}`,
}), { tg: '4x4', min: 30 });

add('Quake', 43, 'The epicentre and its isoseismals, drawn as square shells so the whole cell reads as a map.', (c) => ({
  vars: '',
  rule: `${F} { width: 8%; height: 8%; margin: 46%; background: ${ink(c)}; ${halo(6, 3.4, c)} ${rot('@pick(0deg, 45deg)')} }${TR}`,
}), { tg: '4x4', min: 30 });

// ════════════════════════════════════════════════════════════════════════════
// D. Masks — mask: @svg(...) builds the mask out of inline SVG, with
//    `rect*8 { x: calc(@n(-1) * 12.5) }`-style repetition; CSS gradient masks
//    handle the two-dimensional grids. Either way the paint stays a plain,
//    sampled background-color and the mask only decides where the holes go.
//
//    Two things a mask does not do, both learned the hard way: a mask reads
//    *alpha*, not luminance, so a white shape is as opaque as a black one and
//    cannot be used to punch a hole — the hole has to be a real gap, or an
//    evenodd sub-path. And a mask clips the element's box-shadows along with
//    everything else, so masks and section C's halos never appear together.
// ════════════════════════════════════════════════════════════════════════════

add('Burin', 20, 'Burin lines: eight clean furrows cut across a solid ground.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${barsMask(8, 7)} ${rot(R2)} }${TR}`,
}), { tg: '5x5' });

add('Drypoint', 34, 'Drypoint: lines that thicken steadily across the plate, the way the needle digs in as it goes.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${svgMask('viewBox: 0 0 100 100; rect*6 { x: calc(@n(-1) * 16.6 + 2); y: -1; width: calc(2 + @n(-1) * 1.8); height: 102; fill: #000 }')} ${rot(R2)} }${TR}`,
}), { tg: '5x5' });

add('Aquatint', 26, 'Aquatint grain: a fine, even dot screen bitten into the plate.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${msk('radial-gradient(circle closest-side at 50% 50%, #000 78%, transparent 78%) 0 0 / 16.6% 16.6%')} }${TR}`,
}), { tg: '5x5' });

add('Mezzotint', 40, 'Mezzotint: the plate rocked all over, then burnished back until the grain opens up.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${msk('radial-gradient(circle closest-side at 50% 50%, #000 92%, transparent 92%) 0 0 / 12.5% 12.5%, radial-gradient(circle closest-side at 50% 50%, #000 55%, transparent 55%) 6.25% 6.25% / 12.5% 12.5%')} ${rot(R4)} }${TR}`,
}), { tg: '5x5' });

add('Intaglio', 8, 'Intaglio hatching: one set of lines laid over another at right angles.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${barsMask(7, 6)}`)} ${A(`inset: 0; background: ${ink(c)}; ${barsMask(7, 6, 'x')}`)} }${TR}`,
}), { tg: '5x5' });

add('Linocut', 32, 'Linocut gouges: broad chisel strokes with rounded ends.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${svgMask('viewBox: 0 0 100 100; rect*4 { x: calc(@n(-1) * 25 + 5); y: 6; width: 14; height: 88; rx: 7; fill: #000 }')} ${rot(R2)} }${TR}`,
}), { tg: '5x5' });

add('Woodcut', 12, 'Woodcut: the block cut away in wedges, so the marks widen as they run down.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${svgMask('viewBox: 0 0 100 100; polygon { points: 2 0 14 0 8 100 5 100; fill: #000 } polygon { points: 26 0 40 0 32 100 28 100; fill: #000 } polygon { points: 52 0 68 0 58 100 53 100; fill: #000 } polygon { points: 78 0 96 0 84 100 78 100; fill: #000 }')} ${rot(R4)} }${TR}`,
}), { tg: '5x5' });

add('Engrave', 47, 'Engraved shading: strokes that swell in the middle and taper away at both ends.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${svgMask('viewBox: 0 0 100 100; ellipse*6 { cx: calc(@n(-1) * 16.6 + 8.3); cy: 50; rx: 4; ry: 46; fill: #000 }')} ${rot(R2)} }${TR}`,
}), { tg: '5x5' });

add('Roulette', 57, 'A roulette wheel run across the plate: two rows of short ticks, the second offset by half a step.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${svgMask('viewBox: 0 0 100 100; rect*6 { x: calc(@n(-1) * 16.6 + 3); y: 12; width: 9; height: 24; fill: #000 } rect*6 { x: calc(@n(-1) * 16.6 + 11); y: 62; width: 9; height: 24; fill: #000 }')} }${TR}`,
}), { tg: '5x5' });

add('Burnish', 4, 'Burnished back to light: arcs opening out of one corner of every cell.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${svgMask('viewBox: 0 0 100 100; circle*5 { cx: 0; cy: 100; r: calc(@n(-1) * 22 + 14); fill: none; stroke: #000; stroke-width: 9 }')} ${rot(R4)} }${TR}`,
}), { tg: '5x5' });

add('Serigraph', 29, 'A screen print with the mesh left showing: two rulings crossing at right angles.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${msk('repeating-linear-gradient(0deg, #000 0 6%, transparent 6% 14%), repeating-linear-gradient(90deg, #000 0 6%, transparent 6% 14%)')} }${TR}`,
}), { tg: '5x5' });

add('Collotype', 65, 'Collotype reticulation: two dot screens of different pitch, so the web never settles into a grid.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${msk('radial-gradient(circle closest-side at 50% 50%, #000 72%, transparent 72%) 0 0 / 21% 21%, radial-gradient(circle closest-side at 50% 50%, #000 62%, transparent 62%) 7% 11% / 17% 17%')} }${TR}`,
}), { tg: '5x5' });

add('Gravure', 19, 'Photogravure cells: a grid of square wells with the walls left standing between them.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${msk('repeating-linear-gradient(0deg, #000 0 15%, transparent 15% 20%), repeating-linear-gradient(90deg, #000 0 15%, transparent 15% 20%)')} -webkit-mask-composite: source-in; mask-composite: intersect; }${TR}`,
}), { tg: '5x5' });

add('Litho', 53, 'Lithographic crayon: the grain of the stone showing as broken diagonal strokes.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${svgMask('viewBox: 0 0 100 100; rect*6 { x: calc(@n(-1) * 17 - 4); y: -20; width: 9; height: 140; transform: rotate(-24 50 50); fill: #000 }')} }${TR}`,
}), { tg: '5x5' });

add('Monotype', 61, 'A monotype pull: broad, uneven wipes that never repeat exactly.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${svgMask('viewBox: 0 0 100 100; rect*4 { x: -2; y: calc(@n(-1) * 25 + 3); width: 104; height: calc(8 + @n(-1) * 2.6); rx: 5; fill: #000 }')} ${rot(R2)} }${TR}`,
}), { tg: '5x5' });

add('Chine', 37, 'Chine collé: a second sheet laid on the first, its edge left standing proud of it.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${svgMask('viewBox: 0 0 100 100; path { d: M4 4 H96 V96 H4 Z M18 18 H82 V82 H18 Z; fill-rule: evenodd; fill: #000 }')} ${A(`inset: 32%; background: ${ink(c)};`)} ${rot(R4)} }${TR}`,
}), { tg: '5x5' });

add('Jalousie', 2, 'Jalousie slats: angled louvres with daylight between every pair.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${svgMask('viewBox: 0 0 100 100; rect*6 { x: -30; y: calc(@n(-1) * 16.6 + 2); width: 160; height: 10; transform: rotate(-12 50 50); fill: #000 }')} }${TR}`,
}), { tg: '5x5' });

add('Brise', 48, 'Brise-soleil: deep vertical fins with one horizontal walkway crossing them.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${svgMask('viewBox: 0 0 100 100; rect*4 { x: calc(@n(-1) * 25 + 4); y: -1; width: 9; height: 102; fill: #000 } rect { x: -1; y: 44; width: 102; height: 11; fill: #000 }')} }${TR}`,
}), { tg: '5x5' });

add('Grille', 66, 'A cast grille: round holes punched on a square pitch, with the web left solid between them.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${msk('radial-gradient(circle closest-side at 50% 50%, transparent 62%, #000 62%) 0 0 / 33.4% 33.4%')} }${TR}`,
}), { tg: '5x5' });

add('Fretwork', 23, 'Pierced fretwork: a key pattern cut clean out of the panel, so the light does the drawing.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${svgMask('viewBox: 0 0 100 100; path { d: M0 0 H100 V100 H0 Z M18 18 H64 V30 H18 Z M52 18 H64 V64 H52 Z M30 52 H64 V64 H30 Z; fill-rule: evenodd; fill: #000 }')} ${rot(R4)} }${TR}`,
}), { tg: '5x5' });

add('Venetian', 15, 'Venetian blind: broad horizontal slats, tilted a few degrees off flat.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${svgMask('viewBox: 0 0 100 100; rect*5 { x: -1; y: calc(@n(-1) * 20 + 1); width: 102; height: 14; rx: 4; fill: #000 }')} ${rot('@pick(-7deg, 0deg, 7deg)')} }${TR}`,
}), { tg: '5x5' });

add('Ruling', 56, 'A ruling pen at three settings — coarse, medium and fine, one setting to a cell.', (c) => ({
  vars: '',
  rule: `--gap: @pick(12%, 18%, 26%); ${F} { background: ${ink(c)}; -webkit-mask: repeating-linear-gradient(0deg, #000 0 5%, transparent 5% @var(--gap)); mask: repeating-linear-gradient(0deg, #000 0 5%, transparent 5% @var(--gap)); ${rot(R2)} }${TR}`,
}), { tg: '5x5' });

add('Raster', 31, 'A raster that thickens steadily from the top of the cell to the bottom.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${svgMask('viewBox: 0 0 100 100; rect*7 { x: -1; y: calc(@n(-1) * 14.3); width: 102; height: calc(1.5 + @n(-1) * 1.7); fill: #000 }')} ${rot(R4)} }${TR}`,
}), { tg: '5x5' });

add('Beatnote', 10, 'Two rulings a hair apart in pitch, so the beat between them draws a third pattern of its own.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${msk('repeating-linear-gradient(0deg, #000 0 4%, transparent 4% 9%)')}`)} ${A(`inset: 0; background: ${ink(c)}; ${msk('repeating-linear-gradient(0deg, #000 0 4%, transparent 4% 10.6%)')} opacity: 0.8;`)} ${rot(R2)} }${TR}`,
}), { grid: '4x6', tg: '4x4' });

// ════════════════════════════════════════════════════════════════════════════
// E. Glyph fields — content: "\@hex(n)" prints a codepoint. The Geometric
//    Shapes block is a ready-made library of squares, triangles, diamonds and
//    circles; the ink is `color`, which samples and transitions like any other.
// ════════════════════════════════════════════════════════════════════════════

add('Ogham', 17, 'Strokes cut across a stemline, the way ogham is scored down the edge of a stone.', (c) => ({
  vars: '',
  rule: `${F} { color: ${ink(c)}; ${glyph(9585, 9587, { size: '190%' })} ${B(`left: 46%; top: 0; width: 8%; height: 100%; background: ${ink(c)};`)} }${TR}`,
}), { tg: '5x5' });

add('Futhark', 42, 'Angular marks of the kind a runic alphabet is built from — all straight cuts, no curves.', (c) => ({
  vars: '',
  rule: `${F} { color: ${ink(c)}; ${glyph(9698, 9701, { size: '210%' })} ${rot(R4)} }${TR}`,
}), { tg: '5x5' });

add('Cuneiform', 11, 'Wedges pressed into clay, each one turned to a different quarter.', (c) => ({
  vars: '',
  rule: `${F} { color: ${ink(c)}; ${glyphPick(9666, 9656, 9650, 9660)} ${rot('@pick(0deg, 20deg, -20deg)')} }${TR}`,
}), { tg: '5x5' });

add('Hieratic', 54, 'A running hand: filled and open forms alternating down the column.', (c) => ({
  vars: '',
  rule: `${F} { color: ${ink(c)}; ${glyph(9670, 9683, { size: '175%' })} }${TR}`,
}), { tg: '5x5' });

add('Demotic', 7, 'Demotic shorthand: the same marks again, smaller and set closer together.', (c) => ({
  vars: '',
  rule: `${F} { color: ${ink(c)}; ${glyph(9642, 9649, { size: '190%' })} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Pictogram', 24, 'A picture alphabet of squares — filled, hollow, halved and quartered.', (c) => ({
  vars: '',
  rule: `${F} { color: ${ink(c)}; ${glyph(9632, 9641, { size: '210%' })} }${TR}`,
}), { tg: '5x5' });

add('Ideogram', 38, 'Circles in every state the block offers: whole, half, quartered, ringed.', (c) => ({
  vars: '',
  rule: `${F} { color: ${ink(c)}; ${glyph(9673, 9683, { size: '200%' })} }${TR}`,
}), { tg: '5x5' });

add('Logogram', 62, 'One mark, one meaning: triangles pointing all four ways.', (c) => ({
  vars: '',
  rule: `${F} { color: ${ink(c)}; ${glyph(9650, 9663, { size: '200%' })} }${TR}`,
}), { tg: '5x5' });

add('Syllabary', 5, 'A syllabary: a fixed set of signs, each one used as often as the next.', (c) => ({
  vars: '',
  rule: `${F} { color: ${ink(c)}; ${glyph(9700, 9727, { size: '210%' })} }${TR}`,
}), { tg: '5x5' });

add('Abjad', 46, 'Consonants only: the heavy strokes kept, the light ones left out.', (c) => ({
  vars: '',
  rule: `${F} { color: ${ink(c)}; ${glyphPick(9632, 9635, 9644, 9646, 9724)} ${rot(R4)} }${TR}`,
}), { tg: '5x5' });

add('Abugida', 25, 'Base signs with their marks attached: a glyph above, a bar beneath.', (c) => ({
  vars: '',
  rule: `${F} { color: ${ink(c)}; ${glyph(9664, 9671, { size: '160%' })} ${B(`left: 22%; top: 76%; width: 56%; height: 7%; background: ${ink(c)};`)} }${TR}`,
}), { tg: '5x5' });

add('Semaphore', 1, 'Semaphore: two arms held at two of eight angles, spelling one letter per cell.', (c) => ({
  vars: '',
  rule: `--rot: ${R8}; ${F} { ${B(`left: 47%; top: 6%; width: 6%; height: 44%; background: ${ink(c)}; ${xf('rotate(@pick(-45deg, 0deg, 45deg, 90deg))')} transform-origin: 50% 100%;`)} ${A(`left: 47%; top: 50%; width: 6%; height: 44%; background: ${ink(c)}; ${xf('rotate(@pick(-90deg, -45deg, 0deg, 45deg))')} transform-origin: 50% 0;`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Wigwag', 35, 'Wigwag flag signalling: a flag on a staff, waved left or right for dot and dash.', (c) => ({
  vars: '',
  rule: `--flip: @pick(1, -1); ${F} { ${B(`left: 20%; top: 4%; width: 6%; height: 92%; background: ${ink(c)};`)} ${A(`left: 26%; top: @pick(8%, 34%); width: 52%; height: 34%; background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 100% 100%, 0 100%, 22% 50%)')}`)} ${xf('scaleX(@var(--flip))')} }${TR}`,
}), { tg: '5x5' });

add('Helio', 49, 'A heliograph shutter: open, half open, shut — the whole vocabulary of a mirror.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('@pick(polygon(0 0, 100% 0, 100% 100%, 0 100%), polygon(0 0, 100% 0, 100% 46%, 0 46%), polygon(0 54%, 100% 54%, 100% 100%, 0 100%))')} ${rot(R2)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Braille', 58, 'A braille cell: six positions, and only some of them raised.', (c) => ({
  vars: '',
  rule: `${F} { color: ${ink(c)}; line-height: 1; text-align: center; font-size: 230%; :after { content: "\\@hex(@rand(10241, 10495))";${pt} } }${TR}`,
}), { tg: '5x5' });

add('Punchcard', 64, 'A punched card: rows of rectangular holes with the unpunched positions left blank.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${svgMask('viewBox: 0 0 100 100; path { d: M0 0 H100 V100 H0 Z M12 16 H26 V38 H12 Z M40 16 H54 V38 H40 Z M68 16 H82 V38 H68 Z M12 60 H26 V82 H12 Z M40 60 H54 V82 H40 Z M68 60 H82 V82 H68 Z; fill-rule: evenodd; fill: #000 }')} }${TR}`,
}), { tg: '5x5' });

add('Telegraph', 0, 'Dots and dashes on a paper tape, the tape running through every cell.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 0; top: 40%; width: 100%; height: 20%; background: ${ink(c)}; ${msk('repeating-linear-gradient(90deg, #000 0 @pick(8%, 22%), transparent @pick(8%, 22%) @pick(20%, 34%))')}`)} ${A(`left: 0; top: 8%; width: 100%; height: 5%; background: ${ink(c)};`)} ${rot(R2)} }${TR}`,
}), { tg: '5x5' });

add('Dingbat', 52, 'A tray of printer\'s dingbats — stars, lozenges and bullets, set at random.', (c) => ({
  vars: '',
  rule: `${F} { color: ${ink(c)}; ${glyph(10022, 10059, { size: '185%' })} }${TR}`,
}), { tg: '5x5' });

add('Fleuron', 59, 'Fleurons: the leaf ornaments a compositor uses to fill out a line.', (c) => ({
  vars: '',
  rule: `${F} { color: ${ink(c)}; ${glyphPick(10047, 10048, 10052, 10057, 10059)} ${rot(R4)} }${TR}`,
}), { tg: '5x5' });

add('Pilcrow', 16, 'Paragraph marks set in a block, each one turned a quarter from its neighbour.', (c) => ({
  vars: '',
  rule: `${F} { color: ${ink(c)}; ${glyphPick(9670, 9671, 9672, 9673)} ${rot(R4)} }${TR}`,
}), { tg: '5x5' });

add('Obelus', 67, 'The obelus and its cousins: marks a scribe used to flag a doubtful line.', (c) => ({
  vars: '',
  rule: `${F} { color: ${ink(c)}; ${glyph(9724, 9737, { size: '175%' })} }${TR}`,
}), { tg: '5x5' });

add('Asterism', 3, 'Three marks set in a triangle — the asterism, used to break a chapter.', (c) => ({
  vars: '',
  rule: `${F} { color: ${ink(c)}; line-height: 1; text-align: center; font-size: 120%; :after { content: "\\@hex(@rand(9670, 9679))";${pt} } ${B(`left: 18%; top: 12%; width: 64%; height: 34%; background: ${ink(c)}; ${cp('polygon(50% 0, 100% 100%, 0 100%)')}`)} }${TR}`,
}), { tg: '5x5' });

// ════════════════════════════════════════════════════════════════════════════
// F. Rule-driven fields — @match against @x, @y and @i, with the @Math
//    functions and the bitwise operators, so the pattern is *computed* from
//    the cell's address rather than rolled for it. The ink is still sampled,
//    which is what keeps a reseed interesting.
// ════════════════════════════════════════════════════════════════════════════

add('Sierpinski', 27, "Sierpinski's triangle, from the one-line rule that generates it: a cell is filled when its column AND its row leave the row unchanged.", (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 26%; background: ${ink(c)};`)} @match((@x - 1) & (@y - 1) == @y - 1) { background: ${ink(c)}; :after { inset: 8%; } } }${TR}`,
}), { grid: '8x12', tg: '8x8' });

add('Modulo', 5, 'Cell index modulo four, and nothing else: four shapes cycling in strict order across the field.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(`points: 4; rotate: calc(@i % 4 * 22)`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Residue', 30, 'Every seventh cell keeps its full square; the rest are cut back to a diamond.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(gon(4, { rotate: 45, scale: 0.9 }))} @match(@i % 7 == 0) { ${sh(gon(4, { scale: 0.99 }))} } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Parity', 12, 'A checker that keeps changing its mind: the parity of the column decides the shape, the parity of the row decides the turn.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 0 100%)')} @match(@x % 2 == 0) { ${cp('polygon(100% 0, 100% 100%, 0 100%)')} } @match(@y % 2 == 0) { ${xf('scaleY(-1)')} } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Collatz', 43, 'Halve it if it is even, treble it and add one if it is odd — the cell size follows the rule.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; width: @calc(28 + 58 * @abs(@i % 2))%; height: @calc(28 + 58 * @abs(@i % 2))%; ${xf('translate(-50%, -50%)')} background: ${ink(c)}; border-radius: @calc(@i % 2 * 50)%;`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Fibonacci', 35, 'Sizes stepping through a Fibonacci-like run and starting over — 1, 1, 2, 3, 5, and back.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; @size: @pn(20%, 28%, 40%, 58%, 84%); ${xf('translate(-50%, -50%)')} background: ${ink(c)}; border-radius: 50%;`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Farey', 1, 'Opacity set by how far the cell sits from the leading diagonal — a smooth ramp with no dithering in it.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; opacity: @calc(0.28 + 0.72 * @abs(@x - @y) / @X); }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Gyroid', 15, 'A sine surface sampled on the grid: the shape swells and shrinks along a wave that runs both ways at once.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; width: @calc(22 + 64 * @abs(@sin(@x * 0.8 + @y * 0.5)))%; height: @calc(22 + 64 * @abs(@sin(@x * 0.8 + @y * 0.5)))%; ${xf('translate(-50%, -50%)')} border-radius: 50%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Helicoid', 47, 'A quarter-turn twist accumulating along both axes, so the field screws round as you read across it.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 12%; background: ${ink(c)}; ${xf('rotate(@calc(6 * @x + 9 * @y)deg)')}`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Automaton', 22, 'One elementary-automaton rule run over the grid: a cell is on when exactly one of its coordinates is.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 30%; background: ${ink(c)};`)} @match((@x + @y) % 3 == 0) { background: ${ink(c)}; :after { inset: 12%; } } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Glider', 58, 'The glider, stamped every fifth cell and drifting one step per row.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 34%; background: ${ink(c)};`)} @match((@x + @y * 2) % 5 == 0) { background: ${ink(c)}; } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Dragon', 9, 'The dragon curve\'s fold rule, read off the bits of the cell index.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 100% 50%, 50% 50%, 50% 100%, 0 100%)')} @match(@i & 1 == 1) { ${xf('rotate(90deg)')} } @match(@i & 2 == 2) { ${xf('rotate(180deg)')} } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Lsystem', 62, 'A branching rule: the stem always draws, the branch only where the row divides evenly.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 46%; top: 0; width: 8%; height: 100%; background: ${ink(c)};`)} @match(@y % 2 == 0) { ${A(`left: 46%; top: 30%; width: 48%; height: 8%; background: ${ink(c)};`)} } @match(@y % 2 == 1) { ${A(`left: 6%; top: 62%; width: 48%; height: 8%; background: ${ink(c)};`)} } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Cantor', 0, 'The Cantor set: the middle third taken out, and taken out again from what is left.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${msk('repeating-linear-gradient(90deg, #000 0 33.4%, transparent 33.4% 66.7%, #000 66.7% 100%), repeating-linear-gradient(90deg, #000 0 11.2%, transparent 11.2% 22.3%, #000 22.3% 33.4%)')} -webkit-mask-composite: source-in; mask-composite: intersect; ${rot(R2)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Koch', 24, 'The Koch bump, applied once per cell and flipped on alternate rows so the edges meet.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 100%, 33% 100%, 50% 40%, 67% 100%, 100% 100%, 100% 101%, 0 101%)')} @match(@y % 2 == 1) { ${xf('rotate(180deg)')} } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Hilbert', 51, 'The Hilbert curve\'s four orientations, cycling by cell index so the path always joins up.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(14% 14%, 34% 14%, 34% 66%, 66% 66%, 66% 14%, 86% 14%, 86% 86%, 14% 86%)')} ${xf('rotate(@calc(@i % 4 * 90)deg)')} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Peano', 39, 'A Peano-style S, turning a quarter with every column.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(10% 10%, 90% 10%, 90% 46%, 34% 46%, 34% 56%, 90% 56%, 90% 90%, 10% 90%, 10% 56%, 66% 56%, 66% 46%, 10% 46%)')} ${xf('rotate(@calc(@x % 4 * 90)deg)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Ulam', 44, 'The Ulam spiral: cells lit where the index falls on one of the diagonals primes like to sit on.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 36%; border-radius: 50%; background: ${ink(c)};`)} @match(@i % 6 == 1) { ${A(`inset: 14%; border-radius: 50%; background: ${ink(c)};`)} } @match(@i % 6 == 5) { ${A(`inset: 22%; border-radius: 50%; background: ${ink(c)};`)} } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Penrose', 40, 'Two rhombs, fat and thin, chosen by a rule on the cell index rather than by a dice roll.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(50% 0, 96% 50%, 50% 100%, 4% 50%)')} @match(@i % 5 < 2) { ${cp('polygon(50% 0, 74% 50%, 50% 100%, 26% 50%)')} } ${xf('rotate(@calc(@i % 5 * 36)deg)')} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Ammann', 6, 'Ammann bars: a line whose width steps through a short, non-repeating run.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: @calc(10 + @i % 3 * 8)%; top: 0; width: @pn(9%, 15%, 24%, 15%, 9%); height: 100%; background: ${ink(c)};`)} ${rot(R2)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Aperiodic', 53, 'A pattern that never quite repeats: the turn is driven by a five-step cycle across a six-wide grid.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 100% 62%, 62% 62%, 62% 100%, 0 100%)')} ${xf('rotate(@calc(@i % 5 * 72)deg)')} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Quasi', 66, 'Quasicrystal symmetry: every cell turned a twelfth of a circle further than the one before.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(gon(10, { scale: 0.94 }))} ${xf('rotate(@calc(@i * 30)deg)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Voronoi', 34, 'Cells growing from a seed that sits at a different corner in each one, so the boundaries never line up.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('@pick(polygon(0 0, 100% 0, 72% 100%, 0 68%), polygon(0 0, 100% 0, 100% 74%, 26% 100%), polygon(28% 0, 100% 0, 100% 100%, 0 100%, 0 22%), polygon(0 0, 76% 0, 100% 30%, 100% 100%, 0 100%))')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Delaunay', 20, 'The triangulation that goes with it: two triangles to a cell, their shared edge flipping with the checker.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 0 100%)')}`)} ${A(`inset: 0; background: ${ink(c)}; ${cp('polygon(100% 0, 100% 100%, 0 100%)')}`)} @match((@x + @y) % 2 == 0) { ${xf('rotate(90deg)')} } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

// ════════════════════════════════════════════════════════════════════════════
// G. Blobs — border-radius: @repeat(4, @rand(28%, 72%)) writes four
//    independent corner radii, and a second @repeat after the slash gives the
//    vertical half of each, so every corner is its own ellipse. It all
//    transitions, so a reseed makes the whole field breathe.
// ════════════════════════════════════════════════════════════════════════════

const blob = (lo, hi) =>
  `border-radius: @repeat(4, @rand(${lo}, ${hi})) / @repeat(4, @rand(${lo}, ${hi}));`;

add('Amoeba', 16, 'Single-celled and never the same shape twice: eight independent corner radii per cell.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 6%; background: ${ink(c)}; ${blob('26%', '74%')}`)} }${TR}`,
}), { tg: '5x5' });

add('Blot', 28, 'An ink blot: mostly round, but pulled out of true on one or two sides.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 10%; background: ${ink(c)}; ${blob('34%', '66%')}`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Ooze', 10, 'Two blobs to a cell, the smaller one running out from under the larger.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 4% 4% 30% 30%; background: ${ink(c)}; ${blob('24%', '76%')}`)} ${A(`inset: 34% 30% 6% 8%; background: ${ink(c)}; ${blob('24%', '76%')}`)} }${TR}`,
}), { tg: '5x5' });

add('Globule', 45, 'Globules at three sizes, each one nearly round and none of them quite.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; @size: @pick(44%, 66%, 90%); ${xf('translate(-50%, -50%)')} background: ${ink(c)}; ${blob('38%', '62%')}`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Vesicle', 3, 'A membrane with nothing inside it: the blob outlined by a border, and bored through.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 8%; border: ${u(3)} solid ${ink(c)}; box-sizing: border-box; ${blob('30%', '70%')}`)} }${TR}`,
}), { tg: '5x5', min: 30 });

add('Corpuscle', 55, 'Red-cell shapes: round outside, dished in the middle.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 8%; background: ${ink(c)}; ${blob('40%', '60%')}`)} ${A(`inset: 32%; background: ${ink(c)}; ${blob('34%', '66%')}`)} }${TR}`,
}), { tg: '5x5' });

add('Protoplast', 32, 'A cell wall gone, leaving the protoplast to take whatever shape it likes.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: @rand(4%, 18%); background: ${ink(c)}; ${blob('20%', '80%')}`)} }${TR}`,
}), { tg: '5x5' });

add('Vacuole', 41, 'A large clear space with the cytoplasm squeezed round the edge of it.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 5%; border: ${u(5)} solid ${ink(c)}; box-sizing: border-box; ${blob('36%', '64%')}`)} }${TR}`,
}), { tg: '5x5', min: 30 });

add('Organelle', 61, 'Two organelles to a cell, one round, one long, both a little irregular.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 8%; top: 14%; width: 40%; height: 72%; background: ${ink(c)}; ${blob('30%', '70%')}`)} ${A(`left: 54%; top: 26%; width: 38%; height: 48%; background: ${ink(c)}; ${blob('30%', '70%')}`)} }${TR}`,
}), { tg: '5x5' });

add('Mitosis', 25, 'A cell in the middle of dividing: two lobes still joined at the waist.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`left: 4%; top: 20%; width: 54%; height: 60%; background: ${ink(c)}; ${blob('40%', '60%')}`)} ${A(`left: 42%; top: 20%; width: 54%; height: 60%; background: ${ink(c)}; ${blob('40%', '60%')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Spawn', 8, 'Frogspawn: a soft outer jelly with a hard dark centre.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 6%; background: ${ink(c)}; ${blob('36%', '64%')} opacity: 0.8;`)} ${A(`inset: 34%; border-radius: 50%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Roe', 64, 'Roe packed tight: small, nearly-round grains that never sit quite flush.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: @rand(2%, 10%); background: ${ink(c)}; ${blob('42%', '58%')}`)} }${TR}`,
}), { grid: '10x15', tg: '8x8' });

add('Tapioca', 57, 'Pearls in suspension: round grains at two sizes, jostled off centre.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: @rand(4%, 34%); top: @rand(4%, 34%); @size: @pick(50%, 66%); background: ${ink(c)}; ${blob('40%', '60%')}`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Lava', 43, 'A lava lamp: one blob rising, another sinking, both slack-sided.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 12%; top: @rand(2%, 22%); width: 52%; height: 44%; background: ${ink(c)}; ${blob('30%', '70%')}`)} ${A(`left: 38%; top: @rand(54%, 74%); width: 46%; height: 40%; background: ${ink(c)}; ${blob('30%', '70%')}`)} }${TR}`,
}), { tg: '5x5' });

add('Magma', 29, 'Magma seen from above: a crusted plate with a soft-edged vent open in it.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${A(`inset: @rand(18%, 34%); background: ${ink(c)}; ${blob('24%', '76%')}`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Curd', 11, 'Set curd broken with a knife: soft-cornered lumps of every proportion.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: @rand(2%, 8%); background: ${ink(c)}; border-radius: @repeat(4, @rand(6%, 40%));`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

// ════════════════════════════════════════════════════════════════════════════
// H. Nested doodles — @doodle(...) renders a whole second css-doodle into the
//    cell. Used as a mask it is pure structure, and the cell's own sampled
//    background-color stays the ink, so the reseed still morphs.
// ════════════════════════════════════════════════════════════════════════════

const inner = (grid, body) => `@doodle(@grid: ${grid} / 100%; ${body})`;
const innerMask = (grid, body) => {
  const d = inner(grid, body);
  return `-webkit-mask: ${d}; mask: ${d}; -webkit-mask-size: 100% 100%; mask-size: 100% 100%;`;
};

add('Matryoshka', 18, 'A doodle inside a doodle: each cell holds a whole second grid, and only some of its cells are open.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${innerMask('4', 'background: @p(#000, #000, #0000);')} }${TR}`,
}), { tg: '5x5' });

add('Recurse', 36, 'The same trick at two depths: a coarse inner grid with a finer one masked out of it.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${innerMask('3', 'background: @p(#000, #0000);')}`)} ${A(`inset: 20%; background: ${ink(c)}; ${innerMask('6', 'background: @p(#000, #0000, #0000);')}`)} }${TR}`,
}), { tg: '5x5' });

add('Fractal', 50, 'Self-similar all the way down: the inner grid uses the same open-or-shut rule as the outer one.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${innerMask('3', 'background: #000; @nth(5) { background: #0000; }')} }${TR}`,
}), { tg: '5x5' });

add('Subdivide', 7, 'Quartered, then quartered again: a mask that keeps three of every four squares.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${innerMask('2', 'background: @p(#000, #000, #000, #0000);')} ${rot(R4)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Quadtree', 23, 'A quadtree, split unevenly: some cells stay whole, others break into four.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${innerMask('4', 'background: @p(#000, #0000); @even { background: #000; }')} }${TR}`,
}), { tg: '5x5' });

add('Microcosm', 42, 'The whole pattern again, small enough to fit inside one square of itself.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${innerMask('5', 'background: #0000; @random(0.45) { background: #000; }')} }${TR}`,
}), { tg: '5x5' });

add('Macrocosm', 13, 'The same grid at low density, so the inner doodle reads as a constellation rather than a texture.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${innerMask('6', 'background: #0000; @random(0.28) { background: #000; border-radius: 50%; }')} }${TR}`,
}), { tg: '5x5' });

add('Nestbox', 60, 'Boxes inside boxes: an inner grid of frames, each with its middle cut out.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${innerMask('3', 'background: #0000; box-shadow: inset 0 0 0 7px #000;')} }${TR}`,
}), { tg: '5x5' });

add('Inlay', 46, 'Inlaid work: a fine chequer of open and closed squares set into a solid ground.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${innerMask('4', 'background: #000; @odd { background: #0000; }')} ${rot(R2)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Marquetry', 31, 'Veneer cut and fitted: an inner grid of diagonals, half of them removed.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${innerMask('3', 'background: #000; clip-path: polygon(0 0, 100% 0, 0 100%); @even { clip-path: polygon(100% 0, 100% 100%, 0 100%); }')} }${TR}`,
}), { tg: '5x5' });

// ════════════════════════════════════════════════════════════════════════════
// I. Filters — @svg-filter() writes an inline SVG filter, so feTurbulence can
//    roughen an edge in a way no clip-path will. The paint underneath is still
//    a sampled background-color.
// ════════════════════════════════════════════════════════════════════════════

const rough = (freq, scale, seed) =>
  `filter: @svg-filter(feTurbulence { type: fractalNoise; baseFrequency: ${freq}; numOctaves: 2; seed: ${seed} } feDisplacementMap { in: SourceGraphic; scale: ${scale} });`;

add('Deckle', 12, 'A deckle edge: the torn margin a sheet of handmade paper is left with.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 8%; background: ${ink(c)}; ${rough('0.04', 12, 3)}`)} }${TR}`,
}), { tg: '5x5' });

add('Foxing', 21, 'Foxing: the rust-coloured blooms that come up through old paper.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; @size: @pick(38%, 58%, 78%); ${xf('translate(-50%, -50%)')} border-radius: 50%; background: ${ink(c)}; ${rough('0.07', 16, 7)}`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Pulp', 56, 'Pulp still in the vat: fibres pulling the edge of every shape out of line.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(gon(6, { scale: 0.92 }))} ${rough('0.05', 14, 11)} }${TR}`,
}), { tg: '5x5' });

add('Fray', 38, 'A frayed strip: the weave letting go along both selvedges.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 16%; top: 0; width: 68%; height: 100%; background: ${ink(c)}; ${rough('0.02 0.3', 10, 5)}`)} ${rot(R2)} }${TR}`,
}), { tg: '5x5' });

add('Erode', 49, 'A ring eaten into by weather until the line of it is no longer certain.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 8%; border-radius: 50%; background: ${ink(c)}; ${ringMask('62%')} ${rough('0.06', 10, 2)}`)} }${TR}`,
}), { tg: '4x4' });

add('Crumble', 2, 'A block crumbling at the corners, the noise coarse enough to take chunks out.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 10%; background: ${ink(c)}; ${rough('0.03', 20, 13)}`)} }${TR}`,
}), { tg: '5x5' });

add('Grit', 33, 'Grit on the plate: a fine, high-frequency roughness that only shows at the edge.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 12%; background: ${ink(c)}; ${blob('34%', '66%')} ${rough('0.14', 6, 17)}`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Smoulder', 54, 'A shape half burnt away: the noise stretched along one axis so the damage runs with the grain.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 8%; background: ${ink(c)}; ${sh(polar('1 + 0.2 * cos(5t)', { scale: 0.9 }))} ${rough('0.4 0.02', 12, 23)}`)} }${TR}`,
}), { tg: '5x5' });

// ════════════════════════════════════════════════════════════════════════════
// J. Stripes — @stripe() writes an evenly-spaced set of gradient stops from a
//    plain colour list. The gradient carries the banding, and a sampled
//    background-color sits behind it so the reseed still has something that
//    transitions.
// ════════════════════════════════════════════════════════════════════════════

const stripes = (c, ...extra) =>
  `background-image: linear-gradient(@pick(0deg, 90deg, 45deg, 135deg), @stripe(${extra.join(', ')}));`;

add('Ticker', 19, 'A ticker tape: even bands of colour running the length of the strip.', (c) => ({
  vars: '',
  rule: `${F} { background-color: ${ink(c)}; background-image: linear-gradient(@pick(0deg, 90deg), @stripe(#0000 40%, ${ink(c)}, #0000)); }${TR}`,
}), { tg: '5x5' });

add('Spectro', 26, 'A spectrogram column: bands stacked from one ink to the next with no blend between them.', (c) => ({
  vars: '',
  rule: `${F} { background-color: ${ink(c)}; background-image: linear-gradient(0deg, @stripe(${ink(c)}, #0000, ${ink(c)}, #0000)); }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Waveform', 4, 'A waveform drawn as a bar per sample, its height taken from the cell index.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 20%; bottom: 6%; width: 60%; height: @calc(16 + 76 * @abs(@sin(@i * 1.1)))%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Oscillo', 48, 'An oscilloscope trace: a bright line on a ruled graticule.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${msk('repeating-linear-gradient(0deg, #000 0 3%, transparent 3% 25%), repeating-linear-gradient(90deg, #000 0 3%, transparent 3% 25%)')}`)} ${A(`left: 0; top: @calc(20 + 56 * @abs(@sin(@x * 1.3)))%; width: 100%; height: 10%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Readout', 59, 'A seven-segment readout: three bars, and only some of them lit.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 18%; top: 12%; width: 64%; height: 12%; background: ${ink(c)};`)} ${A(`left: 18%; top: 44%; width: 64%; height: 44%; background: ${ink(c)}; ${slotMask('0deg', '27%', '73%')}`)} }${TR}`,
}), { tg: '5x5' });

add('Gauge', 65, 'A gauge face: a scale of ticks with one needle laid across it.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 6%; background: ${ink(c)}; ${msk('repeating-conic-gradient(from 0deg at 50% 50%, #000 0 4deg, transparent 4deg 30deg)')} border-radius: 50%;`)} ${A(`left: 48%; top: 12%; width: 4%; height: 40%; background: ${ink(c)}; transform-origin: 50% 100%; ${rot(R8)}`)} }${TR}`,
}), { tg: '4x4' });

add('Meter', 14, 'A bar meter: a scale filled to a different mark in every cell.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 8%; top: 40%; width: 84%; height: 20%; background: ${ink(c)}; opacity: 0.4;`)} ${A(`left: 8%; top: 40%; width: @pick(24%, 44%, 62%, 84%); height: 20%; background: ${ink(c)};`)} ${rot(R2)} }${TR}`,
}), { tg: '5x5' });

add('Telemetry', 37, 'A telemetry strip: a dense band of readings with the frame rules top and bottom.', (c) => ({
  vars: '',
  rule: `${F} { background-color: ${ink(c)}; background-image: linear-gradient(90deg, @stripe(#0000, ${ink(c)} 20%, #0000 40%, ${ink(c)} 70%, #0000)); ${B(`left: 0; top: 4%; width: 100%; height: 6%; background: ${ink(c)};`)} }${TR}`,
}), { tg: '5x5' });

add('Cadence', 52, 'A cadence mark: wide, even bands, with the pattern turned a quarter in some cells.', (c) => ({
  vars: '',
  rule: `${F} { background-color: ${ink(c)}; background-image: linear-gradient(@pick(0deg, 90deg), @stripe(${ink(c)} 30%, #0000, ${ink(c)}, #0000 90%)); }${TR}`,
}), { tg: '5x5' });

add('Beacon', 1, 'A beacon sweeping: a wedge of light against a banded ground.', (c) => ({
  vars: '',
  rule: `${F} { background-color: ${ink(c)}; background-image: linear-gradient(@pick(45deg, 135deg), @stripe(#0000 20%, ${ink(c)}, #0000 80%)); ${A(`inset: 0; background: ${ink(c)}; ${cp('polygon(50% 50%, 100% 18%, 100% 82%)')} ${rot(R8)}`)} }${TR}`,
}), { tg: '5x5' });

// ════════════════════════════════════════════════════════════════════════════
// K. Plotted rings — @plot() returns a set of coordinates around a circle, and
//    @m() repeats a value once per coordinate. Together they place n marks on
//    a ring in one declaration; as a mask, the marks are the only thing left.
// ════════════════════════════════════════════════════════════════════════════

const ringOf = (n, r, size) => {
  const g = `radial-gradient(circle closest-side, #000 96%, #0000 96%) @plot(r: ${r}; move: 0.5 0.5) / ${size} ${size} no-repeat`;
  return `-webkit-mask: @m${n}(${g}); mask: @m${n}(${g});`;
};

add('Fiducial', 0, 'Fiducial marks: eight dots on a ring, the pattern a machine looks for to find the sheet.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${ringOf(8, 0.62, '22%')} }${TR}`,
}), { tg: '4x4' });

add('Anchor', 47, 'Anchor points on a ring, with the centre of the cell held down as well.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${ringOf(6, 0.6, '24%')}`)} ${A(`inset: 40%; border-radius: 50%; background: ${ink(c)};`)} }${TR}`,
}), { tg: '4x4' });

add('Benchmark', 24, 'A ring of twelve marks — a bench mark cut at every hour of the dial.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${ringOf(12, 0.66, '15%')} }${TR}`,
}), { tg: '4x4' });

add('Cornerstone', 58, 'Four marks squared up on a ring, plus the stone they are set into.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${ringOf(4, 0.56, '28%')}`)} ${A(`inset: 36%; background: ${ink(c)}; ${rot('45deg')}`)} }${TR}`,
}), { tg: '4x4' });

add('Keyline', 9, 'A keyline of five dots, turned a fifth of a circle in some cells so the ring reads as loose.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${ringOf(5, 0.62, '24%')} ${rot('@pick(0deg, 36deg, 72deg)')} }${TR}`,
}), { tg: '4x4' });

add('Bleed', 63, 'Bleed marks: a tight inner ring of dots with the trim edge running behind them.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${ringOf(10, 0.5, '16%')}`)} ${A(`inset: 6%; border: ${u(2)} solid ${ink(c)}; box-sizing: border-box;`)} }${TR}`,
}), { tg: '4x4', min: 34 });

add('Margin', 17, 'Two rings, an inner of four and an outer of eight, the way a margin is measured twice.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${ringOf(8, 0.68, '16%')}`)} ${A(`inset: 0; background: ${ink(c)}; ${ringOf(4, 0.3, '18%')}`)} }${TR}`,
}), { tg: '4x4' });

add('Indent', 35, 'A ring stepped in from the cell edge, with one mark left out of it.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${ringOf(7, 0.58, '20%')} ${rot(R8)} }${TR}`,
}), { tg: '4x4' });

add('Orphan', 5, 'One mark left on its own inside a full ring of them.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${ringOf(9, 0.66, '16%')}`)} ${A(`left: @pick(22%, 50%, 66%); top: @pick(34%, 50%, 62%); @size: 13%; border-radius: 50%; background: ${ink(c)};`)} }${TR}`,
}), { tg: '4x4' });

add('Widow', 44, 'A short ring of three, with a rule underneath it holding the line.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${ringOf(3, 0.52, '26%')}`)} ${A(`left: 10%; top: 86%; width: 80%; height: 6%; background: ${ink(c)};`)} ${rot('@pick(0deg, 120deg, 240deg)')} }${TR}`,
}), { tg: '4x4' });

if (all.length !== 200) {
  throw new Error(`batch 8 must hold exactly 200 designs, found ${all.length}`);
}

export const batch8 = all;
