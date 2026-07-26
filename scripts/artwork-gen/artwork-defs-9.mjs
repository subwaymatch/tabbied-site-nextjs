// Batch 9 — 200 motifs (gallery orders 1000+).
//
// Every batch before this one draws a *tile*: each cell is an independent
// motif, and the canvas is however many copies of it happen to fit. This batch
// works the other way round. Almost every design here reads the cell's address
// — @x, @y against @X, @Y — and uses it to place that cell inside one larger
// picture. Change the grid and you do not get more of the same motif, you get
// the same composition at a different resolution.
//
// That needs two things css-doodle gives you and the earlier batches never
// used: real maths on the cell's coordinates (@sqrt, @atan2, @sin and the rest
// of the @Math namespace, evaluated per cell), and conic gradients, which are
// the only way to sweep a value round an angle. Two more join them because
// they suit canvas-scale work: SVG *stroke* — line art rather than filled
// shapes, with dasharray and round caps — and skew ramps, which turn a flat
// grid into a receding one.
//
//   A. Radial fields      distance from the centre of the *canvas* drives the
//                         cell — @sqrt over the centred coordinates.
//   B. Angular fields     @atan2 gives every cell its bearing from the centre,
//                         so the field points, spirals or swirls as a whole.
//   C. Ramps              one parameter sweeping across the sheet: size,
//                         angle, aspect, radius, weight.
//   D. Conic              conic-gradient and repeating-conic-gradient as
//                         masks — pies, fans and twists, with real holes.
//   E. Line art           @svg with stroke, stroke-dasharray and round caps:
//                         drawn lines rather than filled shapes.
//   F. Mirrors            the canvas folded about one axis or both, so the
//                         composition has bilateral or four-fold symmetry.
//   G. Perspective        skew and scale ramps that make a flat grid recede.
//   H. Interference       two canvas-scale fields at slightly different
//                         pitches, beating against each other.
//   I. Weights            border and rule widths graded across the sheet.
//
// House rules (inherited from every earlier batch, enforced by
// generate-batch9.mjs and validate-batch9.mjs):
//
//   * exactly one @random(${shapeFrequency}) gate per design, so the frequency
//     slider always thins the field;
//   * every design samples a transition-able ink per cell —
//     background-color, color, border-color or box-shadow — so a reseed
//     morphs. background-image is deliberately excluded from the validator's
//     reseed check: a design whose only variation lived in a gradient would
//     snap instead of morphing;
//   * a randomized custom prop read more than once goes through @var(--x);
//   * nothing paints var(--color0). A hole knocked out in the background
//     colour is a fake hole — set the background slot to transparent and it
//     stops erasing anything. Every gap here is a mask, a clip-path hole, or
//     a gap between elements, and validate-batch9.mjs re-renders the whole
//     batch over a checkerboard with the background slot set to #00000000 and
//     requires byte-identical cells;
//   * every cell must still paint something at the widest end of a ramp. A
//     field that fades to nothing at one edge leaves blank cells, and the
//     validator counts them.

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
const sh = (spec) => cp(`@shape(${spec})`);
const svgMask = (body) => msk(`@svg(${body})`);

const R2 = '@pick(0deg, 90deg)';
const R4 = '@pick(0deg, 90deg, 180deg, 270deg)';
const R8 = '@pick(0deg, 45deg, 90deg, 135deg, 180deg, 225deg, 270deg, 315deg)';

// A px length authored for a six-column grid and scaled down as the grid
// densifies — the idiom Ring and Terrain already use. Border and shadow widths
// take lengths only, never percentages.
const u = (v) => `calc(${v}px * 6 / @size-col)`;

// ── canvas coordinates ─────────────────────────────────────────────────────
// @x and @y are the 1-based column and row; @X and @Y are the totals. These
// put the origin at the middle of the *canvas*, so a design written against
// them holds its composition at any grid density.
//
// One hard constraint shapes how they are written. css-doodle's @calc honours
// operator precedence, but a *bare grouping paren* does not survive it —
// `@calc(90 - 74 * (2 * @x / @X - 1))` quietly evaluates the group to zero and
// the whole field goes flat. Only a function call's own parentheses are safe,
// so every grouping below is done with @abs(), @sqrt() or @atan2() rather than
// with brackets, and anything needing a signed value times a constant is
// multiplied out by hand (see sxTimes).
//
// The same rule kills the obvious tidy-up: routing these through a cell-level
// custom property and reading it back with @var() also comes out flat, so the
// expressions are inlined at every use even though it makes the CSS long.

// Distance from the vertical / horizontal centreline: 0 in the middle of the
// canvas, about 1 at an edge.
const AX = '@abs(2 * @x / @X - 1 - 1 / @X)';
const AY = '@abs(2 * @y / @Y - 1 - 1 / @Y)';
// 0 at the centre of the canvas, 1 at the middle of an edge, ~1.41 at a corner.
const RAD = `@sqrt(${AX} * ${AX} + ${AY} * ${AY})`;
// Bearing from the centre, in degrees.
const ANG = '@atan2(2 * @y / @Y - 1 - 1 / @Y, 2 * @x / @X - 1 - 1 / @X) * 57.2958';
// A sweep across the sheet, left to right and top to bottom.
const RX = '@x / @X';
const RY = '@y / @Y';

// `k` times the signed offset from the centre, multiplied out so no grouping
// paren is needed: k * (2x - X - 1)/X === 2k*x/X - k - k/X.
const sxTimes = (k) =>
  k >= 0
    ? `@calc(${2 * k} * @x / @X - ${k} - ${k} / @X)`
    : `@calc(${-k} + ${-k} / @X - ${-2 * k} * @x / @X)`;
const syTimes = (k) =>
  k >= 0
    ? `@calc(${2 * k} * @y / @Y - ${k} - ${k} / @Y)`
    : `@calc(${-k} + ${-k} / @Y - ${-2 * k} * @y / @Y)`;

// A percentage ramping from `a` to `b` along `t`. The sign is folded into the
// operator so the expression never contains `+ -`.
const ramp = (a, b, t) =>
  `@calc(${a} ${b >= a ? '+' : '-'} ${Math.abs(b - a)} * ${t})%`;
// The same, unitless (for opacity and scale factors).
const rampN = (a, b, t) =>
  `@calc(${a} ${b >= a ? '+' : '-'} ${Math.abs(b - a)} * ${t})`;

// ── conic masks ────────────────────────────────────────────────────────────
// The only way to sweep a value round an angle. As a mask the wedges are real
// holes, so the design survives a transparent background.
const pieMask = (deg, from = '0deg') =>
  msk(`conic-gradient(from ${from} at 50% 50%, #000 0 ${deg}, transparent ${deg} 360deg)`);
const fanMask = (on, period, from = '0deg') =>
  msk(`repeating-conic-gradient(from ${from} at 50% 50%, #000 0 ${on}, transparent ${on} ${period})`);

// ── stroke helpers ─────────────────────────────────────────────────────────
// @svg() as a mask, drawing with stroke rather than fill. `d` is fixed path
// data — calc() does not survive inside a path's `d`, so anything that has to
// vary per cell varies through a repeated element's own attributes instead.
const strokePath = (d, w, extra = '') =>
  svgMask(`viewBox: 0 0 100 100; path { d: ${d}; fill: none; stroke: #000; stroke-width: ${w}; stroke-linecap: round; ${extra} }`);

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
// authored for batches 7 and 8 and cut before they shipped — a name should
// never come to mean two different things.
const TAKEN = new Set(
  (
    'abacus abjad abugida accordion acorn agate airy ammann amoeba ' +
    'ampersand amphora analemma anchor annulet annulus aperiodic aperture ' +
    'apogee aquatint arabesque arcade argyle armilla arpeggio arrow ' +
    'arrowplay asanoha ascender ascent aster asterisk asterism astragal ' +
    'astroid atoll aureole aurora automaton awning azimuth azulejo ' +
    'balloon bandelet barcode bargello barline barrulet basalt basket ' +
    'baste battlement bauhaus beacon beadrow beatnote bee benchmark bento ' +
    'berry bevel beveled bezant bezel bias bifolium billet billow bleed ' +
    'blockfall bloks bloom blossom blot bobbin bokeh bolt bond boro boss ' +
    'bourdon bowl bowtie boxweave bracket bracketpair bract braid braille ' +
    'bramble brickwork brise bristle brocade brokenbond bubble bubbles ' +
    'bud bulge bunting buoy burgee burin burnish bushing button ' +
    'buttonhole cadence cadenza cairn caltrop calyx came caneweave cantor ' +
    'capsule cardioid caret carillon carousel cartouche cascade cattail ' +
    'caustic cavetto celleye chaff chalice chamfer checkers checkmark ' +
    'chenille chert chevarrow chevrondiamond chevronel chime chine chip ' +
    'chrysanth churn cinch cinquefoil circuit cirque cirrus citrus cleat ' +
    'clef clover cobble cog cogwheel coil cointile collatz collotype ' +
    'colophon comb comet compass confetti constellation contour convex ' +
    'coral corbel cornerbite cornerpunch cornerstone cornice corolla ' +
    'corona corpuscle counter cove crank crater crazy crease crescendo ' +
    'crescent cresset crossbar crosshair crosshatch crosslet crotchet ' +
    'crumble crux crystal cube cumulus cuneiform cupola curd curl cusp ' +
    'cusping cymbal dagger damask damier damping dapple dart datum ' +
    'daybreak deckle delaunay delta deltoid demotic dentil diadem diadot ' +
    'dial diamond3d diamonddust diamondeye diamondframe diaper diminuendo ' +
    'dingbat discus disque dogtooth dome domino dotdash dotwave doubinset ' +
    'dragon draughts drift driftleaf drizzle dropcap drypoint dune echo ' +
    'ecliptic eddy edgeband elbow ell emboss engrave enso epicycle ' +
    'epitrochoid ermine erode estuary evolute eyelet facade facetbox ' +
    'facetdiamond facetgrad fang fanleaf fanlight fanvault farey fermata ' +
    'fibonacci fiducial fillet fin fishscale flagstone flange fleck ' +
    'fleuron flight flint flurry flutter flywheel foldout foliage folio ' +
    'folium fourpane foxing fractal frame frameblock fray freckle fresnel ' +
    'fretwork frond froth fusil futhark fuzz gable gablet gasket gauge ' +
    'gauze gem gemcut geode gibbous gingham girih glider glint glitch ' +
    'globule glory glyph gnomon gong grain granule grassblade graticule ' +
    'gravel gravure gridline grille grisaille grit gumball gutter gyroid ' +
    'gyron hachure hairpin halation halfblock halfdot halfink halfmoon ' +
    'halfpenny halftone halo harlequin harmonic hashmark hatch heart ' +
    'helicoid helio heptafoil herringbone hexafoil hexagram hexbloom ' +
    'hexdot hexnut hextile hieratic hilbert hoop hopscotch houndstooth ' +
    'hourglass hurdle hypotrochoid ibeam ichimatsu ideogram ikat impasto ' +
    'impost incense indent inkblot inlay inset insetstep intaglio ' +
    'involute iris isobar isocube isopleth ivy jacquard jali jalousie ' +
    'jelly jewel jumble junction karst kasuri kerf kern keyhole keyline ' +
    'keypad keystone keyway keywork khatam kikko kilim kintsugi kirigami ' +
    'kite knell koch koi kufic ladybird lagoon lantern lattice laundry ' +
    'lava ledger lemniscate lens lentil levels lierne ligature lily ' +
    'limacon links linocut lintel listel litho lobe logcabin logogram ' +
    'loophole lotus louvre loxodrome lozenge lozengegrad lozengy lsystem ' +
    'lune lunette macaron macrocosm madras magma maltese mandorla margin ' +
    'marquetry mascle massif matchstick matryoshka matte maze meadow ' +
    'meander medusa memphis meridian merlon mesh meter metro mezzotint ' +
    'mica microcosm minim mirror misprint mistwave mitosis miura mixtape ' +
    'modulo moire monolith monotype moonphase moraine morse mortise ' +
    'mosaicglass mosaictile mote mouchette mudcloth mullion muqarna nacre ' +
    'nadir necking needle neon nephroid nestbox nimbus northstar notch ' +
    'notchbar notchblock obelisk obelus octagon octant oculus odessa ' +
    'offset offsetbox ogee ogham ogive ooze orb orbit organelle origami ' +
    'orphan oscillo ostinato overtone ovolo oxbow paisley palisade ' +
    'palmette papercut parallax parhelion parity parquet passepartout ' +
    'patina pavers pawl peal peano pebble pebbledot pediment pellet ' +
    'pendulum pennant pennantbox pennon penrose penta pentafan pentafoil ' +
    'penumbra petal phasor picket pictogram pieslice pilcrow pinhex ' +
    'pinhole pinion pinmark pinnacle pinnate pinnule pinweave pinwheel ' +
    'pinwheelstar pinwheeltile pinwheelweave pip pique piston pixel plaid ' +
    'plasma pleat plumb plus pod polaroid polka polkapair pompom pondring ' +
    'popsicle portal postage posy potent prisma prismfold protoplast prow ' +
    'pulp pulsar pulsebar punchcard pylon pyramid pyramid3d pyrite ' +
    'quadrant quadrifolium quadrille quadtree quake quarry quarterbar ' +
    'quarterblock quarterfall quartz quasar quasi quatrefoil quaver ' +
    'quilling quilt quiltsquare quincunx quire quoit raceme radar radius ' +
    'rafter rail rainbow raindrop rake range raster ratchet readout ' +
    'recurse reef regatta register reglet residue resonance respond ' +
    'rhodonea rhomboid rhumb ribbonfold ricrac riffle rill ring ringdot ' +
    'ringlink ripple rivet roe rondure rosace roulette roundel ruling ' +
    'rune rungs rustre saguaro sail saltire sandbar sash sashiko sawedge ' +
    'sayagata scale scallop scatterdot schist scotia scramble sebka ' +
    'sector seersucker seigaiha selvedge semaphore semibreve sepal sequin ' +
    'serif serigraph sextant shard shatter shelf shibori shield shingle ' +
    'shippo shoal shoji shuffle sickle sierpinski sigil signal silo silt ' +
    'sine sixstar skerry skew skewblock slant slat sliptile sliver ' +
    'smoulder snowflake soffit sonata soufflet spandrel spark sparkle ' +
    'spathe spawn spearhead speckle spectro spectrum spill spiralblock ' +
    'spire spirograph splat spline splinter splithz splittri spore sprig ' +
    'springer sprinkles sprocket sprout squall squinch squircle staccato ' +
    'stackbond stamen star5 starfish starflake starlet stave stella step ' +
    'step3d stipple stipule stitch strata subdivide sunburst sundog ' +
    'sunken sunwheel superellipse surf swellbox switchback syllabary ' +
    'symmetry syzygy tag tally talus taper tapioca target tatami tatewaku ' +
    'teardrop tee telegraph telemetry tendril terrain tesserae tetro ' +
    'thistle ticker tickmark tictac tierceron tilt tittle tocsin torsion ' +
    'torteau torus trace tracery trackline transom trapeze trapezoid ' +
    'traverse trefoil trellis tremolo tremor triad trianglet triband ' +
    'trifolium trigram triquetra trishard truchet tube tumble turret ' +
    'tweed twill twinkle ulam umbel uroko vacuole vair vee veil venetian ' +
    'venn vesicle vinyl vitrail voltage volute volution voronoi vortex ' +
    'voussoir wander waning warp wash washer waterbomb waveform wavefront ' +
    'wavelet waypoint weave webbing weft wheelarc whorl wicket widow ' +
    'wigwag windowframe windowpane wingtri woodcut wreath yagasuri ' +
    'zagtile zee zellige zenith ziggurat ziggy zigline zigzagfold zipper'
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

let order = 1000;
const all = [];

// cfg:
//   grid   default "columns x rows" for the editor       (default '8x12')
//   freq   default frequency                             (default 1)
//   tg/tf  gallery-thumbnail grid / frequency            (default '6x6' / 1)
//   min    sizing.minCellPx floor, for px-scaled details
const add = (name, palIdx, description, build, cfg = {}) => {
  const slug = name.toLowerCase();
  if (!/^[a-z][a-z0-9]*$/.test(slug)) throw new Error(`bad slug: ${slug}`);
  if (RESERVED.has(slug)) throw new Error(`slug is a reserved word: ${slug}`);
  if (TAKEN.has(slug)) throw new Error(`slug already taken elsewhere: ${slug}`);
  if (all.some((d) => d.slug === slug)) throw new Error(`duplicate slug in batch 9: ${slug}`);
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
    gridDefault: cfg.grid ?? '8x12',
    freqDefault: cfg.freq ?? 1,
    ...(cfg.min ? { minCellPx: cfg.min } : {}),
    thumb: { grid: cfg.tg ?? '6x6', frequency: cfg.tf ?? 1 },
    vars,
    rule,
  });
};

// ════════════════════════════════════════════════════════════════════════════
// A. Radial fields — distance from the centre of the *canvas* drives the cell.
//    RAD is 0 in the middle of the sheet, 1 at the middle of an edge and about
//    1.41 at a corner, so a design written against it holds its composition
//    whatever grid you give it.
// ════════════════════════════════════════════════════════════════════════════

add('Epicentre', 1, 'Discs at their largest in the middle of the sheet and shrinking all the way to the corners.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; width: ${ramp(94, 16, RAD)}; height: ${ramp(94, 16, RAD)}; ${xf('translate(-50%, -50%)')} border-radius: 50%; background: ${ink(c)};`)} }${TR}`,
}), { tg: '6x6' });

add('Locus', 34, 'The same field inverted: nothing much at the centre, and the corners doing all the work.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; width: ${ramp(14, 96, RAD)}; height: ${ramp(14, 96, RAD)}; ${xf('translate(-50%, -50%)')} border-radius: 50%; background: ${ink(c)};`)} }${TR}`,
}), { tg: '6x6' });

add('Pole', 18, 'Square at the pole and round at the rim: the corner radius opens out with the distance.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 6%; background: ${ink(c)}; border-radius: ${ramp(0, 50, RAD)};`)} }${TR}`,
}), { tg: '6x6' });

add('Vertex', 45, 'One polygon per cell, turning further the further it sits from the middle.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh('points: 5; scale: 0.92')} ${xf(`rotate(@calc(72 * ${RAD})deg)`)} }${TR}`,
}), { tg: '6x6' });

add('Apex', 9, 'Triangles growing out of the centre of the sheet, all of them pointing the same way.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; width: ${ramp(24, 98, RAD)}; height: ${ramp(24, 98, RAD)}; ${xf('translate(-50%, -50%)')} background: ${ink(c)}; ${cp('polygon(50% 0, 100% 100%, 0 100%)')}`)} }${TR}`,
}), { tg: '6x6' });

add('Hub', 27, 'Rings whose bore opens as they get further out, so the middle of the sheet is solid and the edge is nearly all hole.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 5%; border-radius: 50%; background: ${ink(c)}; ${msk(`radial-gradient(circle closest-side at 50% 50%, transparent ${ramp(0, 78, RAD)}, #000 0)`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Axle', 52, 'A bar in every cell, lengthening as the field runs out from the centre.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${A(`left: 50%; top: 50%; width: ${ramp(22, 98, RAD)}; height: 22%; ${xf('translate(-50%, -50%)')} border-radius: 999px; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '6x6' });

add('Pivot', 13, 'A square field given a twist that accumulates with the radius — flat in the middle, wrung out at the rim.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 12%; background: ${ink(c)}; ${xf(`rotate(@calc(60 * ${RAD})deg)`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Fulcrum', 40, 'Wedges tipping further off the horizontal the further they stand from the balance point.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(50% 8%, 100% 100%, 0 100%)')} ${xf(`rotate(@calc(-40 + 56 * ${RAD})deg)`)} }${TR}`,
}), { tg: '6x6' });

add('Centroid', 3, 'A plain grid of squares, lit from the middle: only the opacity carries the field.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; opacity: ${rampN(1, 0.22, RAD)}; }${TR}`,
}), { tg: '6x6' });

add('Barycentre', 57, 'Two bodies per cell, drifting apart as the pair moves away from the common centre.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: ${ramp(34, 2, RAD)}; top: 34%; width: 32%; height: 32%; border-radius: 50%; background: ${ink(c)};`)} ${A(`right: ${ramp(34, 2, RAD)}; top: 34%; width: 32%; height: 32%; border-radius: 50%; background: ${ink(c)};`)} }${TR}`,
}), { tg: '6x6' });

add('Nucleus', 61, 'A shell of constant size with a core that swells towards the middle of the sheet.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 8%; border-radius: 50%; background: ${ink(c)}; opacity: 0.45;`)} ${A(`left: 50%; top: 50%; width: ${ramp(70, 8, RAD)}; height: ${ramp(70, 8, RAD)}; ${xf('translate(-50%, -50%)')} border-radius: 50%; background: ${ink(c)};`)} }${TR}`,
}), { tg: '6x6' });

add('Kernel', 22, 'Diamonds packed tight at the heart of the sheet and thinning out towards its edges.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; width: ${ramp(98, 22, RAD)}; height: ${ramp(98, 22, RAD)}; ${xf('translate(-50%, -50%) rotate(45deg)')} background: ${ink(c)};`)} }${TR}`,
}), { tg: '6x6' });

add('Hearth', 8, 'A fire in the middle of the room: the glow round each mark dies away with the distance.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; width: 22%; height: 22%; ${xf('translate(-50%, -50%)')} border-radius: 50%; background: ${ink(c)}; box-shadow: 0 0 0 calc(@calc(9 - 8 * ${RAD}) * 1px * 6 / @size-col) ${ink(c)};`)} }${TR}`,
}), { tg: '6x6', min: 30 });

add('Caldera', 46, 'A crater rim: the wall thickens as the ground falls away from the vent.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 5%; border-radius: 50%; background: ${ink(c)}; ${msk(`radial-gradient(circle closest-side at 50% 50%, transparent ${ramp(78, 20, RAD)}, #000 0)`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Sinkhole', 30, 'Everything pulled towards one point: each cell drags its mark a little further in.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 24%; border-radius: 50%; background: ${ink(c)}; ${xf(`translate(${sxTimes(-26)}%, ${syTimes(-26)}%)`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Wellhead', 65, 'A square bore opening out from the middle of the sheet, cut clean through the plate.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 6%; background: ${ink(c)}; ${msk(`linear-gradient(#000 0 0) 50% 50% / ${ramp(4, 88, RAD)} ${ramp(4, 88, RAD)} no-repeat`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Wellspring', 16, 'Arcs rising out of a single source, each one wider than the last.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${A(`left: 50%; bottom: 4%; width: ${ramp(20, 98, RAD)}; height: ${ramp(20, 98, RAD)}; ${xf('translateX(-50%)')} border-radius: 999px 999px 0 0; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '6x6' });

add('Radiant', 12, 'Spokes leaving the centre of the sheet, lengthening the further out they get.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; width: 16%; height: ${ramp(24, 100, RAD)}; ${xf('translate(-50%, -50%)')} background: ${ink(c)};`)} ${rot(R4)} }${TR}`,
}), { tg: '6x6' });

add('Bullseye', 20, 'Concentric bands read off the radius: filled near the centre, outlined further out.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 8%; border-radius: 50%; border-style: solid; border-color: ${ink(c)}; border-width: calc(@calc(1 + 9 * ${RAD}) * 1px * 6 / @size-col); box-sizing: border-box;`)} }${TR}`,
}), { tg: '6x6', min: 30 });

add('Cynosure', 39, 'A guiding star: the points sharpen and the body shrinks as you move outward.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; width: ${ramp(98, 34, RAD)}; height: ${ramp(98, 34, RAD)}; ${xf('translate(-50%, -50%)')} background: ${ink(c)}; ${sh('points: 240; r: 1 - 0.55 * abs(cos(4t))')}`)} }${TR}`,
}), { tg: '6x6' });

add('Omphalos', 55, 'The navel stone: a dome that flattens as the ground runs away from it.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 6%; bottom: 6%; width: 88%; height: ${ramp(88, 22, RAD)}; background: ${ink(c)}; border-radius: 999px 999px 0 0;`)} }${TR}`,
}), { tg: '6x6' });

add('Navel', 6, 'A dimple: the inner disc pushed further off centre the further the cell is from the middle.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 8%; border-radius: 50%; background: ${ink(c)};`)} ${A(`left: ${ramp(34, 6, RAD)}; top: ${ramp(34, 6, RAD)}; width: 32%; height: 32%; border-radius: 50%; background: ${ink(c)};`)} }${TR}`,
}), { tg: '6x6' });

add('Axis', 63, 'A cross whose arms grow with the radius, so the sheet reads as one set of crosshairs.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 50%; top: 50%; width: ${ramp(26, 100, RAD)}; height: 15%; ${xf('translate(-50%, -50%)')} background: ${ink(c)};`)} ${A(`left: 50%; top: 50%; width: 15%; height: ${ramp(26, 100, RAD)}; ${xf('translate(-50%, -50%)')} background: ${ink(c)};`)} }${TR}`,
}), { tg: '6x6' });

// ════════════════════════════════════════════════════════════════════════════
// B. Angular fields — @atan2 over the centred coordinates gives every cell its
//    bearing from the middle of the sheet, so the whole canvas points, spirals
//    or swirls as one thing.
// ════════════════════════════════════════════════════════════════════════════

add('Vector', 0, 'Every mark turned to face directly away from the centre of the sheet.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 8%; top: 40%; width: 84%; height: 20%; border-radius: 999px; background: ${ink(c)}; ${xf(`rotate(@calc${ANG}deg)`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Flux', 43, 'The same field turned a quarter: every mark lies across the radius instead of along it.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 8%; top: 40%; width: 84%; height: 20%; border-radius: 999px; background: ${ink(c)}; ${xf(`rotate(@calc(${ANG} + 90)deg)`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Divergent', 24, 'Arrowheads all pointing outward, so the sheet reads as a source rather than a sink.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(100% 50%, 18% 96%, 40% 50%, 18% 4%)')} ${xf(`rotate(@calc${ANG}deg)`)} }${TR}`,
}), { tg: '6x6' });

add('Streamline', 51, 'Long strokes lying along the flow, drawn out into the corners.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: -6%; top: 44%; width: 112%; height: 12%; border-radius: 999px; background: ${ink(c)}; ${xf(`rotate(@calc${ANG}deg)`)}`)} }${TR}`,
}), { grid: '10x15', tg: '8x8' });

add('Gyre', 15, 'A slow rotation about the middle of the sheet: every mark tangent to its own circle.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 4%; top: 36%; width: 92%; height: 28%; border-radius: 999px; background: ${ink(c)}; ${xf(`rotate(@calc(${ANG} + 90)deg)`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Maelstrom', 41, 'A spiral: the bearing plus a turn that grows with the radius, so the arms wind in.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 2%; top: 38%; width: 96%; height: 24%; border-radius: 999px; background: ${ink(c)}; ${xf(`rotate(@calc(${ANG} + 70 * ${RAD})deg)`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Cyclone', 32, 'The same spiral wound the other way, and tighter.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 2%; top: 38%; width: 96%; height: 24%; border-radius: 999px; background: ${ink(c)}; ${xf(`rotate(@calc(${ANG} - 110 * ${RAD})deg)`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Swirl', 47, 'Three-lobed figures all turned by their bearing, so the field rolls round the middle.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; @shape: clover 3; ${xf(`rotate(@calc${ANG}deg)`)} }${TR}`,
}), { tg: '6x6' });

add('Torque', 58, 'A wrench applied at the centre: wedges leaning further round as the radius grows.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 30%, 100% 0, 100% 100%, 0 70%)')} ${xf(`rotate(@calc(${ANG} + 40)deg)`)} }${TR}`,
}), { tg: '6x6' });

add('Moment', 11, 'A bar and the weight on the end of it, both swung round to their own bearing.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 6%; top: 44%; width: 60%; height: 12%; background: ${ink(c)};`)} ${A(`left: 62%; top: 34%; width: 32%; height: 32%; border-radius: 50%; background: ${ink(c)};`)} ${xf(`rotate(@calc${ANG}deg)`)} }${TR}`,
}), { tg: '6x6' });

add('Spin', 29, 'Plain squares, each turned to its bearing, which is enough to set the whole sheet rotating.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 14%; background: ${ink(c)}; ${xf(`rotate(@calc${ANG}deg)`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Precession', 36, 'A slow wobble: the turn advances at half the rate of the bearing, so the pattern drifts.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 10%; background: ${ink(c)}; ${sh('points: 4; scale: 0.95')} ${xf(`rotate(@calc(${ANG} * 0.5)deg)`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Nutation', 4, 'The nod on top of the spin: the bearing with a ripple added to it.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 6%; top: 40%; width: 88%; height: 20%; border-radius: 999px; background: ${ink(c)}; ${xf(`rotate(@calc(${ANG} + 26 * @sin(6 * ${RAD}))deg)`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Gimbal', 19, 'Two rings on crossed axes, both swung to the cell\'s own bearing.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 4%; border-radius: 50%; border: ${u(3)} solid ${ink(c)}; box-sizing: border-box;`)} ${A(`left: 26%; top: 4%; width: 48%; height: 92%; border-radius: 50%; border: ${u(3)} solid ${ink(c)}; box-sizing: border-box; ${xf(`rotate(@calc${ANG}deg)`)}`)} }${TR}`,
}), { tg: '5x5', min: 34 });

add('Lodestone', 66, 'Iron filings round a magnet: the field points at a pole set off to one side.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 6%; top: 42%; width: 88%; height: 16%; border-radius: 999px; background: ${ink(c)}; ${xf(`rotate(@calc(@atan2(2 * @y / @Y - 1.4 - 1 / @Y, 2 * @x / @X - 0.6 - 1 / @X) * 57.2958)deg)`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Dipole', 10, 'Two poles instead of one, and the field between them bending from one to the other.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 6%; top: 42%; width: 88%; height: 16%; border-radius: 999px; background: ${ink(c)}; ${xf(`rotate(@calc(@atan2(2 * @y / @Y - 1 - 1 / @Y, 2 * @x / @X - 1.6 - 1 / @X) * 28.6 + @atan2(2 * @y / @Y - 1 - 1 / @Y, 2 * @x / @X - 0.4 - 1 / @X) * 28.6)deg)`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Solenoid', 53, 'A coil seen end on: the bearing quantised to eight bands so the turn steps rather than sweeps.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 4%; top: 38%; width: 92%; height: 24%; background: ${ink(c)}; ${xf(`rotate(@calc(@round(${ANG} / 45) * 45)deg)`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Curlicue', 25, 'Commas laid on the flow, each one turned to its own bearing.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 8%; background: ${ink(c)}; @shape: drop; ${xf(`rotate(@calc${ANG}deg)`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Spindrift', 33, 'Spray flung off the crest: small marks thrown outward along the bearing.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; width: 46%; height: 16%; border-radius: 999px; background: ${ink(c)}; transform-origin: 0 50%; ${xf(`rotate(@calc${ANG}deg) translateX(@calc(6 + 28 * ${RAD})%)`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Windrose', 48, 'A wind rose: a wedge at every station, all of them squared up on the compass.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(50% 50%, 100% 20%, 100% 80%)')} ${xf(`rotate(@calc${ANG}deg)`)} }${TR}`,
}), { tg: '6x6' });

// ════════════════════════════════════════════════════════════════════════════
// C. Ramps — one parameter sweeping across the whole sheet, left to right or
//    top to bottom. Nothing is rolled except the ink.
// ════════════════════════════════════════════════════════════════════════════

add('Gradation', 17, 'A plain field with only its opacity graded, edge to edge.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; opacity: ${rampN(0.2, 1, RX)}; }${TR}`,
}), { tg: '6x6' });

add('Attenuate', 5, 'Discs at full size on one side of the sheet and pinheads on the other.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; width: ${ramp(96, 14, RX)}; height: ${ramp(96, 14, RX)}; ${xf('translate(-50%, -50%)')} border-radius: 50%; background: ${ink(c)};`)} }${TR}`,
}), { tg: '6x6' });

add('Ramp', 44, 'Bars standing on a common baseline, each row taller than the one above it.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 12%; bottom: 0; width: 76%; height: ${ramp(14, 100, RY)}; background: ${ink(c)};`)} }${TR}`,
}), { tg: '6x6' });

add('Slope', 21, 'One tilt per column, from level on the left to a quarter-turn on the right.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 16%; background: ${ink(c)}; ${xf(`rotate(@calc(90 * ${RX})deg)`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Incline', 60, 'A shear that builds across the sheet, so the squares lean further the further you read.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 8%; background: ${ink(c)}; ${xf(`skewX(@calc(-34 + 68 * ${RX})deg)`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Grade', 7, 'Square at one edge and circular at the other, with every stage in between.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 7%; background: ${ink(c)}; border-radius: ${ramp(0, 50, RX)};`)} }${TR}`,
}), { tg: '6x6' });

add('Cant', 37, 'The aspect ratio graded: tall and narrow on one side, low and wide on the other.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; width: ${ramp(18, 94, RX)}; height: ${ramp(94, 18, RX)}; ${xf('translate(-50%, -50%)')} background: ${ink(c)};`)} }${TR}`,
}), { tg: '6x6' });

add('Camber', 28, 'A road crowned in the middle: the arch flattens as it runs down the sheet.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 2%; bottom: 6%; width: 96%; height: ${ramp(92, 20, RY)}; background: ${ink(c)}; border-radius: 999px 999px 0 0;`)} }${TR}`,
}), { tg: '6x6' });

add('Batter', 49, 'A wall built with a batter: each course leans in a little further than the last.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 5%; background: ${ink(c)}; ${cp(`polygon(@calc(3 + 34 * ${RY})% 0, @calc(97 - 34 * ${RY})% 0, 100% 100%, 0 100%)`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Splay', 14, 'A fan opening across the sheet: the pair of blades spreading column by column.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 42%; top: 6%; width: 16%; height: 88%; background: ${ink(c)}; transform-origin: 50% 100%; ${xf(`rotate(@calc(-4 - 40 * ${RX})deg)`)}`)} ${A(`left: 42%; top: 6%; width: 16%; height: 88%; background: ${ink(c)}; transform-origin: 50% 100%; ${xf(`rotate(@calc(4 + 40 * ${RX})deg)`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Flare', 64, 'A cone widening down the sheet, from a stem at the top to a mouth at the bottom.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 4%; width: ${ramp(20, 98, RY)}; height: 92%; ${xf('translateX(-50%)')} background: ${ink(c)}; ${cp('polygon(40% 0, 60% 0, 100% 100%, 0 100%)')}`)} }${TR}`,
}), { tg: '6x6' });

add('Diminish', 2, 'Dots getting smaller row by row until they are almost nothing.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; width: ${ramp(88, 10, RY)}; height: ${ramp(88, 10, RY)}; ${xf('translate(-50%, -50%)')} border-radius: 50%; background: ${ink(c)};`)} }${TR}`,
}), { tg: '6x6' });

add('Augment', 56, 'The bore of a ring opening steadily down the page.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 5%; border-radius: 50%; background: ${ink(c)}; ${msk(`radial-gradient(circle closest-side at 50% 50%, transparent ${ramp(6, 82, RY)}, #000 0)`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Lapse', 31, 'A dashed rule whose dashes lengthen across the sheet until the line is solid.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 0; top: 38%; width: 100%; height: 24%; background: ${ink(c)}; ${msk(`repeating-linear-gradient(90deg, #000 0 ${ramp(12, 100, RX)}, transparent 0 100%)`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Decline', 23, 'Columns falling away down the sheet, each one shorter than the row above.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 20%; top: 0; width: 60%; height: ${ramp(100, 16, RY)}; background: ${ink(c)};`)} }${TR}`,
}), { tg: '6x6' });

add('Ascendant', 42, 'The same run read upward: short at the top, full height at the foot.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 20%; bottom: 0; width: 60%; height: ${ramp(16, 100, RY)}; background: ${ink(c)}; border-radius: 999px 999px 0 0;`)} }${TR}`,
}), { tg: '6x6' });

add('Descent', 54, 'A staircase whose treads shorten as it goes down, so the flight steepens.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp(`polygon(0 100%, 0 @calc(70 - 60 * ${RY})%, 50% @calc(70 - 60 * ${RY})%, 50% @calc(85 - 30 * ${RY})%, 100% @calc(85 - 30 * ${RY})%, 100% 100%)`)} }${TR}`,
}), { tg: '6x6' });

add('Graduate', 62, 'A polygon gaining a side every few columns — triangle at one edge, near-circle at the other.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${sh(`points: @calc(3 + 9 * ${RX}); scale: 0.94`)} }${TR}`,
}), { tg: '6x6' });

add('Progress', 26, 'A bar filling across the sheet: the same track, further along in every column.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 4%; top: 38%; width: 92%; height: 24%; background: ${ink(c)}; opacity: 0.35;`)} ${A(`left: 4%; top: 38%; width: ${ramp(8, 92, RX)}; height: 24%; background: ${ink(c)};`)} }${TR}`,
}), { tg: '6x6' });

add('Sequence', 38, 'Five marks in strict order, cycling across the sheet with a size ramp on top.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; width: ${ramp(40, 92, RX)}; height: ${ramp(40, 92, RX)}; ${xf('translate(-50%, -50%)')} background: ${ink(c)}; ${sh('points: @pn(3, 4, 5, 6, 8); scale: 0.96')}`)} }${TR}`,
}), { tg: '6x6' });

add('Interval', 50, 'The gap between two marks opening steadily across the sheet.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: ${ramp(28, 2, RX)}; top: 30%; width: 40%; height: 40%; background: ${ink(c)};`)} ${A(`right: ${ramp(28, 2, RX)}; top: 30%; width: 40%; height: 40%; background: ${ink(c)};`)} }${TR}`,
}), { tg: '6x6' });

add('Octave', 35, 'The pitch of a ruling doubling across the sheet, an octave from edge to edge.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${msk(`repeating-linear-gradient(0deg, #000 0 ${ramp(20, 5, RX)}, transparent 0 ${ramp(40, 10, RX)})`)} }${TR}`,
}), { tg: '6x6' });

add('Tessitura', 59, 'A voice sitting higher as the line goes on: the mark rides further up its cell each column.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 18%; top: ${ramp(70, 2, RX)}; width: 64%; height: 28%; border-radius: 999px; background: ${ink(c)};`)} }${TR}`,
}), { tg: '6x6' });

add('Ambit', 68, 'The margin widening across the sheet, so the marks retreat from their own cells.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: ${ramp(1, 38, RX)}; background: ${ink(c)};`)} }${TR}`,
}), { tg: '6x6' });

// ════════════════════════════════════════════════════════════════════════════
// D. Conic — conic-gradient is the only thing in CSS that sweeps a value round
//    an angle, and as a mask its wedges are real holes, so these survive a
//    transparent background like everything else here.
// ════════════════════════════════════════════════════════════════════════════

add('Wedge', 2, 'A single wedge cut out of each cell, its angle rolled from a short list.', (c) => ({
  vars: '',
  rule: `--from: ${R8}; ${F} { background: ${ink(c)}; ${pieMask('@pick(70deg, 120deg, 180deg, 250deg)', '@var(--from)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Gore', 29, 'Narrow gores, the panels a globe is covered with, each swung to its own bearing.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${pieMask('42deg', `@calc(${ANG})deg`)} }${TR}`,
}), { tg: '6x6' });

add('Gusset', 44, 'A wedge with the point taken off it — the gusset let into a seam.', (c) => ({
  vars: '',
  rule: `--from: ${R8}; ${F} { background: ${ink(c)}; -webkit-mask: conic-gradient(from @var(--from) at 50% 50%, #000 0 100deg, transparent 0), radial-gradient(circle closest-side at 50% 50%, transparent 34%, #000 0); mask: conic-gradient(from @var(--from) at 50% 50%, #000 0 100deg, transparent 0), radial-gradient(circle closest-side at 50% 50%, transparent 34%, #000 0); -webkit-mask-composite: source-in; mask-composite: intersect; }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Segment', 11, 'A circular segment: the pie cut, then trimmed square across the chord.', (c) => ({
  vars: '',
  rule: `--from: ${R4}; ${F} { ${A(`inset: 4%; border-radius: 50%; background: ${ink(c)}; ${pieMask('150deg', '@var(--from)')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Slice', 60, 'The slice widening across the sheet, from a splinter on one edge to almost the whole pie on the other.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 4%; border-radius: 50%; background: ${ink(c)}; ${pieMask(`@calc(30 + 300 * ${RX})deg`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Parasol', 25, 'Eight ribs radiating from the centre of every cell, with the cloth cut away between them.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 3%; border-radius: 50%; background: ${ink(c)}; ${fanMask('26deg', '45deg')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Umbrella', 7, 'Twelve ribs and a rim: the same fan with a band left solid round the edge.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 3%; border-radius: 50%; background: ${ink(c)}; ${fanMask('18deg', '30deg')}`)} ${A(`inset: 3%; border-radius: 50%; background: ${ink(c)}; ${msk('radial-gradient(circle closest-side at 50% 50%, transparent 84%, #000 0)')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Canopy', 38, 'A fan of unequal ribs — wide, narrow, wide — repeating round the circle.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 3%; border-radius: 50%; background: ${ink(c)}; ${msk('repeating-conic-gradient(from 0deg at 50% 50%, #000 0 24deg, transparent 24deg 40deg, #000 40deg 48deg, transparent 48deg 60deg)')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Marquee', 53, 'Half a fan, hung from one edge like the awning over a doorway.', (c) => ({
  vars: '',
  rule: `--from: ${R4}; ${F} { ${A(`left: 0; top: 0; width: 100%; height: 100%; background: ${ink(c)}; -webkit-mask: repeating-conic-gradient(from 180deg at 50% 0%, #000 0 14deg, transparent 14deg 26deg); mask: repeating-conic-gradient(from 180deg at 50% 0%, #000 0 14deg, transparent 14deg 26deg);`)} ${rot('@var(--from)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Pavilion', 16, 'A fan with the finial left in place at its centre.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 3%; border-radius: 50%; background: ${ink(c)}; ${fanMask('20deg', '36deg')}`)} ${A(`inset: 36%; border-radius: 50%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Turbine', 33, 'Blades all set to the same pitch, and the whole rotor turned to the cell\'s bearing.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 3%; border-radius: 50%; background: ${ink(c)}; ${fanMask('30deg', '60deg')} ${xf(`rotate(@calc(${ANG})deg)`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Impeller', 49, 'An impeller: six vanes with the eye of the pump bored out of the middle.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 3%; border-radius: 50%; background: ${ink(c)}; -webkit-mask: repeating-conic-gradient(from 0deg at 50% 50%, #000 0 34deg, transparent 34deg 60deg), radial-gradient(circle closest-side at 50% 50%, transparent 26%, #000 0); mask: repeating-conic-gradient(from 0deg at 50% 50%, #000 0 34deg, transparent 34deg 60deg), radial-gradient(circle closest-side at 50% 50%, transparent 26%, #000 0); -webkit-mask-composite: source-in; mask-composite: intersect;`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Propeller', 22, 'Three blades, evenly spaced, spun to a new angle in every cell.', (c) => ({
  vars: '',
  rule: `--from: ${R8}; ${F} { ${A(`inset: 3%; border-radius: 50%; background: ${ink(c)}; ${fanMask('40deg', '120deg', '@var(--from)')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Vane', 5, 'One vane on its own, the angle stepping round the sheet.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 4%; border-radius: 50%; background: ${ink(c)}; ${pieMask('54deg', `@calc(${ANG})deg`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Blade', 63, 'A narrow blade with a rounded back — the pie cut against a ring.', (c) => ({
  vars: '',
  rule: `--from: ${R8}; ${F} { ${A(`inset: 2%; border-radius: 50%; background: ${ink(c)}; -webkit-mask: conic-gradient(from @var(--from) at 50% 50%, #000 0 96deg, transparent 0), radial-gradient(circle closest-side at 50% 50%, transparent 28%, #000 0); mask: conic-gradient(from @var(--from) at 50% 50%, #000 0 96deg, transparent 0), radial-gradient(circle closest-side at 50% 50%, transparent 28%, #000 0); -webkit-mask-composite: source-in; mask-composite: intersect;`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Rotor', 41, 'Four blades at right angles, the whole assembly canted a little in each cell.', (c) => ({
  vars: '',
  rule: `--from: @pick(0deg, 12deg, 24deg, 36deg); ${F} { ${A(`inset: 3%; border-radius: 50%; background: ${ink(c)}; ${fanMask('40deg', '90deg', '@var(--from)')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Stator', 18, 'The stationary half: twenty-four thin ribs, none of them moving.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 2%; border-radius: 50%; background: ${ink(c)}; ${fanMask('7deg', '15deg')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Nozzle', 56, 'A throat opening down the sheet: the cone angle widening row by row.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 2%; background: ${ink(c)}; ${pieMask(`@calc(20 + 130 * ${RY})deg`, '@calc(90 - 10 * @y)deg')}`)} }${TR}`,
}), { tg: '6x6' });

add('Escapement', 31, 'Escape-wheel teeth: a fan with every second gap left wide for the pallet.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 3%; border-radius: 50%; background: ${ink(c)}; ${msk('repeating-conic-gradient(from 0deg at 50% 50%, #000 0 10deg, transparent 10deg 30deg)')}`)} ${B(`inset: 32%; border-radius: 50%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Sundial', 12, 'A dial plate with the style laid across it, both turned by the cell\'s bearing.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 4%; border-radius: 50%; background: ${ink(c)}; ${fanMask('6deg', '30deg')}`)} ${A(`left: 48%; top: 10%; width: 5%; height: 40%; background: ${ink(c)}; transform-origin: 50% 100%; ${xf(`rotate(@calc(${ANG})deg)`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Chrono', 47, 'A chronograph: an outer fan of minute marks and an inner ring left plain.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 2%; border-radius: 50%; background: ${ink(c)}; -webkit-mask: repeating-conic-gradient(from 0deg at 50% 50%, #000 0 5deg, transparent 5deg 15deg), radial-gradient(circle closest-side at 50% 50%, transparent 62%, #000 0); mask: repeating-conic-gradient(from 0deg at 50% 50%, #000 0 5deg, transparent 5deg 15deg), radial-gradient(circle closest-side at 50% 50%, transparent 62%, #000 0); -webkit-mask-composite: source-in; mask-composite: intersect;`)} ${A(`inset: 34%; border-radius: 50%; background: ${ink(c)}; ${msk('radial-gradient(circle closest-side at 50% 50%, transparent 68%, #000 0)')}`)} }${TR}`,
}), { grid: '4x6', tg: '4x4' });

add('Flabellum', 26, 'A folded fan: the pleats read as alternating light and dark because each rib is its own ink.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 3%; border-radius: 50%; background: ${ink(c)}; ${fanMask('15deg', '30deg')}`)} ${A(`inset: 3%; border-radius: 50%; background: ${ink(c)}; ${fanMask('15deg', '30deg', '15deg')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Whirligig', 9, 'A paper windmill, the pitch of the blades advancing one step per cell.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 3%; border-radius: 50%; background: ${ink(c)}; ${fanMask('44deg', '90deg', '@calc(@i % 6 * 15)deg')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Radial', 66, 'The plainest statement of the idea: a fine even fan, and nothing else.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${fanMask('9deg', '20deg')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

// ════════════════════════════════════════════════════════════════════════════
// E. Line art — @svg used as a mask, drawing with stroke rather than fill, so
//    the cell reads as a drawn line. dasharray and round caps do the rest.
// ════════════════════════════════════════════════════════════════════════════

add('Outline', 0, 'The square, drawn rather than filled: a stroked box with an open middle.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${strokePath('M12 12 H88 V88 H12 Z', 9)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Sketch', 51, 'Two passes of the same box, the second not quite over the first.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${strokePath('M14 10 H86 V84 H14 Z', 7)}`)} ${A(`inset: 0; background: ${ink(c)}; ${strokePath('M18 16 H92 V90 H18 Z', 7)} opacity: 0.75;`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Cartoon', 24, 'A drawn circle with a drawn dot inside it — outline and accent, nothing filled.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${strokePath('M50 12 A38 38 0 1 1 49.9 12', 8)}`)} ${A(`inset: 0; background: ${ink(c)}; ${strokePath('M50 44 A6 6 0 1 1 49.9 44', 11)}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Underdraw', 37, 'The construction lines left in: a dashed box under a solid corner.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${strokePath('M10 10 H90 V90 H10 Z', 6, 'stroke-dasharray: 9 7;')}`)} ${A(`inset: 0; background: ${ink(c)}; ${strokePath('M10 40 V10 H40', 9)}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Pounce', 8, 'Pounced dots: the drawing pricked through as a line of points rather than a stroke.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${strokePath('M10 50 H90', 16, 'stroke-dasharray: 0 20;')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Silverpoint', 39, 'Silverpoint: a line so fine it barely marks the ground, laid in parallel.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${svgMask('viewBox: 0 0 100 100; path*4 { d: M0 130 L130 0; fill: none; stroke: #000; stroke-width: 3; transform: translate(calc(@n(-1) * 34 - 68) 0) }')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Graphite', 15, 'A pencil block: close parallel strokes, all leaning the same way.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${svgMask('viewBox: 0 0 100 100; path*7 { d: M-20 100 L80 -20; fill: none; stroke: #000; stroke-width: 8; transform: translate(calc(@n(-1) * 20) 0) }')} ${rot(R2)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Charcoal', 43, 'Charcoal: broad, blunt strokes that almost close the paper up.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${svgMask('viewBox: 0 0 100 100; path*3 { d: M-10 90 L90 -10; fill: none; stroke: #000; stroke-width: 22; stroke-linecap: round; transform: translate(calc(@n(-1) * 36) 0) }')} ${rot(R2)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Sanguine', 21, 'Red chalk: one long curved stroke, thickening where the hand pressed.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${strokePath('M8 88 Q50 -10 92 88', 13)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Scribe', 55, 'Scribed lines: a cross cut with a hard point, both strokes running off the edge.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${strokePath('M-5 50 H105 M50 -5 V105', 7)} ${rot('@pick(0deg, 30deg, 45deg, 60deg)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Stylus', 3, 'One line and the point it started from.', (c) => ({
  vars: '',
  rule: `--rot: ${R8}; ${F} { ${B(`inset: 0; background: ${ink(c)}; ${strokePath('M18 82 L82 18', 8)}`)} ${A(`inset: 0; background: ${ink(c)}; ${strokePath('M18 82 A2 2 0 1 1 17.9 82', 16)}`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Nib', 30, 'A broad-nib stroke: two parallel lines held a fixed distance apart.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${strokePath('M14 20 L86 20 M14 34 L86 34', 9)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Quill', 46, 'A quill flourish: one S drawn in a single movement.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${strokePath('M14 86 C14 46 86 54 86 14', 11)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Reedpen', 62, 'A reed pen: three strokes of the same length, laid down side by side.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { background: ${ink(c)}; ${strokePath('M20 14 V86 M50 14 V86 M80 14 V86', 10)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Wireframe', 34, 'A box drawn in wire: the front face, the back face, and the four edges joining them.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${strokePath('M10 30 H70 V90 H10 Z M30 10 H90 V70 H30 Z M10 30 L30 10 M70 30 L90 10 M70 90 L90 70 M10 90 L30 70', 5)} }${TR}`,
}), { grid: '4x6', tg: '4x4' });

add('Armature', 58, 'The armature under a figure: a spine, a crossbar and two legs.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${strokePath('M50 8 V56 M18 30 H82 M50 56 L24 92 M50 56 L76 92', 8)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Skeleton', 13, 'A spine with its ribs: one long stroke and a run of short ones off it.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${B(`inset: 0; background: ${ink(c)}; ${strokePath('M50 6 V94', 8)}`)} ${A(`inset: 0; background: ${ink(c)}; ${strokePath('M22 22 H78 M22 42 H78 M22 62 H78 M22 82 H78', 6)}`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Catenary', 42, 'The curve a chain hangs in, drawn once per cell and inverted on alternate rows.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${strokePath('M6 16 Q50 104 94 16', 10)} @match(@y % 2 == 1) { ${xf('rotate(180deg)')} } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Parabola', 19, 'A parabola with its axis marked, both drawn as strokes.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${strokePath('M6 92 Q50 -18 94 92', 9)}`)} ${A(`inset: 0; background: ${ink(c)}; ${strokePath('M50 20 V96', 5, 'stroke-dasharray: 7 6;')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Hyperbola', 6, 'Two branches curving away from each other, with the asymptote between them.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${strokePath('M6 6 Q42 50 6 94 M94 6 Q58 50 94 94', 9)}`)} ${A(`inset: 0; background: ${ink(c)}; ${strokePath('M8 8 L92 92', 4, 'stroke-dasharray: 6 7;')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Serpentine', 50, 'One wave of a serpentine line, joining edge to edge so the rows run continuous.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${strokePath('M0 50 C25 0 75 100 100 50', 12)} @match(@y % 2 == 1) { ${xf('scaleY(-1)')} } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Sinuous', 27, 'Two waves to a cell instead of one, so the line runs twice as fast.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${strokePath('M0 50 C12 8 26 92 50 50 C74 8 88 92 100 50', 9)} ${rot(R2)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Filament', 65, 'A single hair-thin line wandering from corner to corner.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${strokePath('M2 98 C34 62 22 34 50 26 C78 18 70 -8 98 2', 5)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Whisker', 32, 'Short arcs springing from one corner, the way whiskers leave a muzzle.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${strokePath('M4 96 Q40 76 96 68 M4 96 Q44 56 92 34 M4 96 Q30 48 66 6', 7)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

// ════════════════════════════════════════════════════════════════════════════
// F. Mirrors — @match on the cell's own column and row folds the canvas about
//    one axis or both, so the composition has bilateral or four-fold symmetry
//    however many cells you give it.
// ════════════════════════════════════════════════════════════════════════════

add('Bilateral', 1, 'The sheet folded down its middle: everything past the centreline is the mirror of what came before it.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 62% 100%, 0 100%)')} @match(@x > @X / 2) { ${xf('scaleX(-1)')} } }${TR}`,
}), { tg: '6x6' });

add('Chiral', 45, 'Left-handed on one side of the fold and right-handed on the other, and never the same as its own reflection.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 70% 0, 100% 44%, 40% 100%, 0 70%)')} @match(@x > @X / 2) { ${xf('scaleX(-1)')} } @match(@y > @Y / 2) { ${xf('scaleY(-1)')} } }${TR}`,
}), { tg: '6x6' });

add('Enantiomer', 20, 'A shape and its mirror image, alternating so neither ever wins.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 56% 0, 56% 56%, 100% 56%, 100% 100%, 0 100%)')} @match(@x % 2 == 0) { ${xf('scaleX(-1)')} } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Reflect', 57, 'A single reflection about the vertical, with the two halves in different inks.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 6%; background: ${ink(c)}; ${cp('polygon(0 100%, 100% 0, 100% 100%)')}`)} @match(@x > @X / 2) { ${xf('scaleX(-1)')} } }${TR}`,
}), { tg: '6x6' });

add('Specular', 10, 'A mirrored field with the reflection dimmed, the way a real one loses light.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 44% 100%)')} @match(@y > @Y / 2) { ${xf('scaleY(-1)')} opacity: 0.55; } }${TR}`,
}), { tg: '6x6' });

add('Pierglass', 36, 'A tall mirror in a frame: the glass mirrored, the frame the same all round.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 4%; background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 92%, 92% 92%, 92% 8%, 0 8%)')}`)} ${A(`inset: 18%; background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 40% 100%)')}`)} @match(@x > @X / 2) { ${xf('scaleX(-1)')} } }${TR}`,
}), { tg: '6x6' });

add('Diptych', 48, 'Two panels hinged in the middle, each one mirrored inside itself.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 74% 0, 100% 100%, 0 100%)')} @match(@x % 4 > 1) { ${xf('scaleX(-1)')} } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Triptych', 4, 'Three panels: the outer two mirror each other and the middle one stands square.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 100% 66%, 34% 100%, 0 100%)')} @match(@x % 3 == 0) { ${xf('scaleX(-1)')} } @match(@x % 3 == 2) { ${cp('polygon(0 0, 100% 0, 100% 100%, 0 100%)')} } }${TR}`,
}), { grid: '6x9', tg: '6x6' });

add('Polyptych', 61, 'Folded about both axes at once, so all four quarters answer each other.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 84% 0, 0 84%)')} @match(@x > @X / 2) { ${xf('scaleX(-1)')} } @match(@y > @Y / 2) { ${xf('scaleY(-1)')} } }${TR}`,
}), { tg: '6x6' });

add('Hinge', 23, 'Two leaves meeting exactly at the fold, so the join reads as a single figure.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 0; background: ${ink(c)}; ${cp('polygon(100% 8%, 100% 92%, 20% 50%)')}`)} @match(@x > @X / 2) { ${xf('scaleX(-1)')} } }${TR}`,
}), { tg: '6x6' });

add('Butterfly', 52, 'Wings: the same mark on both sides of the body, and a bar down the middle.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; @shape: clover 3;`)} ${A(`left: 46%; top: 0; width: 8%; height: 100%; background: ${ink(c)};`)} @match(@x > @X / 2) { ${xf('scaleX(-1)')} } }${TR}`,
}), { tg: '6x6' });

add('Rorschach', 14, 'An ink blot folded while wet: irregular on one side, and exactly the same on the other.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 6%; background: ${ink(c)}; border-radius: @repeat(4, @rand(24%, 76%)) / @repeat(4, @rand(24%, 76%));`)} @match(@x > @X / 2) { ${xf('scaleX(-1)')} } }${TR}`,
}), { tg: '6x6' });

add('Kaleido', 28, 'Four-fold: the quarter nearest each corner is the same drawing, turned to face out.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 0 100%)')} ${A(`inset: 12%; background: ${ink(c)}; ${cp('polygon(0 0, 62% 0, 0 62%)')}`)} @match(@x > @X / 2) { ${xf('scaleX(-1)')} } @match(@y > @Y / 2) { ${xf('scaleY(-1)')} } }${TR}`,
}), { tg: '6x6' });

add('Palindrome', 59, 'Bar lengths that read the same from either end of the row.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 10%; top: 50%; width: 80%; height: ${ramp(84, 14, AX)}; ${xf('translateY(-50%)')} background: ${ink(c)};`)} }${TR}`,
}), { tg: '6x6' });

add('Axial', 40, 'A single fold about the horizontal, with the shape running off both edges.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 101% 0, 101% 46%, 40% 101%, 0 101%)')} @match(@y > @Y / 2) { ${xf('scaleY(-1)')} } }${TR}`,
}), { tg: '6x6' });

add('Dihedral', 67, 'Mirror and quarter-turn together — the symmetry a square actually has.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 60% 40%, 0 100%)')} @match(@x > @X / 2) { ${xf('rotate(90deg)')} } @match(@y > @Y / 2) { ${xf('rotate(-90deg)')} } }${TR}`,
}), { tg: '6x6' });

add('Glide', 17, 'A glide reflection: mirrored, and shifted half a step along at the same time.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 12%, 74% 12%, 74% 88%, 0 88%)')} @match(@y % 2 == 1) { ${xf('scaleX(-1) translateX(-26%)')} } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Symmetral', 35, 'Triangles folded about the centre so their hypotenuses always meet.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 100%, 0 100%)')} @match(@x > @X / 2) { ${xf('scaleX(-1)')} } @match(@y > @Y / 2) { ${xf('scaleY(-1)')} } }${TR}`,
}), { tg: '6x6' });

add('Foldback', 54, 'Arcs folded back on themselves at the centreline of the sheet.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 0; background: ${ink(c)}; border-radius: 0 100% 0 0;`)} @match(@x > @X / 2) { ${xf('scaleX(-1)')} } @match(@y > @Y / 2) { ${xf('scaleY(-1)')} } }${TR}`,
}), { tg: '6x6' });

add('Counterpart', 68, 'Every mark answered by its opposite number across the fold, in a different ink.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 4% 50% 4% 4%; background: ${ink(c)}; border-radius: 999px 0 0 999px;`)} ${A(`inset: 4% 4% 4% 50%; background: ${ink(c)}; border-radius: 0 999px 999px 0;`)} @match(@x > @X / 2) { ${xf('scaleX(-1)')} } }${TR}`,
}), { tg: '6x6' });

// ════════════════════════════════════════════════════════════════════════════
// G. Perspective — a skew or a scale that builds across the sheet turns a flat
//    grid into a receding one. All of it is a ramp on @x or @y; none of it is
//    a real projection, which is exactly how a draughtsman fakes it too.
// ════════════════════════════════════════════════════════════════════════════

add('Vanish', 3, 'Everything shrinking towards the top of the sheet, as if the plane ran away from you.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; width: ${ramp(14, 96, RY)}; height: ${ramp(14, 96, RY)}; ${xf('translate(-50%, -50%)')} background: ${ink(c)};`)} }${TR}`,
}), { tg: '6x6' });

add('Horizon', 22, 'Rows crowding together as they approach the horizon and opening out below it.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 4%; top: 50%; width: 92%; height: ${ramp(10, 92, AY)}; ${xf('translateY(-50%)')} background: ${ink(c)};`)} }${TR}`,
}), { tg: '6x6' });

add('Foreshorten', 47, 'Squares squashed flat at the far edge and standing full height at the near one.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 4%; background: ${ink(c)}; ${xf(`scaleY(${rampN(0.12, 1, RY)})`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Ortho', 29, 'No perspective at all — the same square everywhere, and only the weight of the line changing.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 6%; border-style: solid; border-color: ${ink(c)}; border-width: calc(@calc(1 + 7 * ${RY}) * 1px * 6 / @size-col); box-sizing: border-box;`)} }${TR}`,
}), { tg: '6x6', min: 30 });

add('Isometry', 12, 'The isometric grid: everything skewed thirty degrees, one way or the other.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 8%; background: ${ink(c)}; ${xf('skewY(@pick(-30deg, 30deg))')}`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Axonometry', 55, 'A skew that changes column by column, so the projection turns as you read across.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 8%; background: ${ink(c)}; ${xf(`skewY(@calc(-30 + 60 * ${RX})deg)`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Oblique', 41, 'Oblique projection: a constant lean, with the depth falling off across the sheet.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 6%; top: 6%; width: ${ramp(88, 26, RX)}; height: 88%; background: ${ink(c)}; ${xf('skewX(-24deg)')}`)} }${TR}`,
}), { tg: '6x6' });

add('Cavalier', 7, 'Cavalier projection: forty-five degrees, and the depth drawn at full length.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 4%; top: 26%; width: 62%; height: 62%; background: ${ink(c)};`)} ${A(`left: 4%; top: 26%; width: 62%; height: 62%; background: ${ink(c)}; ${xf('translate(32%, -32%)')} opacity: 0.7;`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Cabinet', 64, 'Cabinet projection: the same angle, but the depth halved so the box stops looking stretched.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 6%; top: 30%; width: 62%; height: 62%; background: ${ink(c)};`)} ${A(`left: 6%; top: 30%; width: 62%; height: 62%; background: ${ink(c)}; ${xf('translate(16%, -16%)')} opacity: 0.7;`)} }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Dimetric', 18, 'Two of the three axes foreshortened equally, which is what dimetric means.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 10%; background: ${ink(c)}; ${xf('skewY(-20deg) scaleX(1.1)')}`)} @match(@x % 2 == 1) { :after { ${xf('skewY(20deg) scaleX(1.1)')} } } }${TR}`,
}), { grid: '6x9', tg: '5x5' });

add('Trimetric', 33, 'All three axes at different rates, so nothing in the drawing is measurable.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 8%; background: ${ink(c)}; ${xf(`skewY(@calc(-24 + 40 * ${RX})deg) scaleY(${rampN(0.55, 1, RY)})`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Anamorph', 49, 'An anamorphic stretch: the distortion grows across the sheet until the shape is unreadable.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 6%; background: ${ink(c)}; border-radius: 50%; ${xf(`scaleX(${rampN(0.2, 1.5, RX)}) skewX(@calc(30 - 60 * ${RX})deg)`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Stereo', 60, 'Two views the eyes apart, and the offset widening as the subject comes closer.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 12%; background: ${ink(c)}; ${xf(`translateX(${ramp(-2, -18, RY)})`)} opacity: 0.8;`)} ${A(`inset: 12%; background: ${ink(c)}; ${xf(`translateX(${ramp(2, 18, RY)})`)} opacity: 0.8;`)} }${TR}`,
}), { tg: '6x6' });

add('Recession', 25, 'Marks receding into the distance: smaller, fainter and closer together as they go.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; width: ${ramp(12, 92, RY)}; height: ${ramp(12, 92, RY)}; ${xf('translate(-50%, -50%)')} border-radius: 50%; background: ${ink(c)}; opacity: ${rampN(0.35, 1, RY)};`)} }${TR}`,
}), { tg: '6x6' });

add('Station', 5, 'Lines converging on the station point: every bar tilted a little further than the last.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 42%; top: 0; width: 16%; height: 100%; background: ${ink(c)}; transform-origin: 50% 0; ${xf(`rotate(@calc(-38 + 76 * ${RX})deg)`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Pictureplane', 44, 'The picture plane itself: a grid of frames, each one smaller than the row before it.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; width: ${ramp(20, 94, RY)}; height: ${ramp(20, 94, RY)}; ${xf('translate(-50%, -50%)')} border-style: solid; border-color: ${ink(c)}; border-width: ${u(3)}; box-sizing: border-box;`)} }${TR}`,
}), { tg: '6x6', min: 30 });

add('Groundline', 31, 'Posts standing on a ground line, each row of them taller than the last.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 0; bottom: 0; width: 100%; height: 6%; background: ${ink(c)};`)} ${A(`left: 32%; bottom: 6%; width: 36%; height: ${ramp(10, 88, RY)}; background: ${ink(c)};`)} }${TR}`,
}), { tg: '6x6' });

add('Frustum', 16, 'A frustum per cell: a trapezoid whose taper deepens as the sheet recedes.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 5%; background: ${ink(c)}; ${cp(`polygon(@calc(4 + 34 * ${RY})% 0, @calc(96 - 34 * ${RY})% 0, 100% 100%, 0 100%)`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Converge', 51, 'Two rails running to a point off the top of the sheet.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 12%; top: 0; width: 12%; height: 100%; background: ${ink(c)}; ${xf(`skewX(@calc(28 - 20 * ${RY})deg)`)}`)} ${A(`right: 12%; top: 0; width: 12%; height: 100%; background: ${ink(c)}; ${xf(`skewX(@calc(-28 + 20 * ${RY})deg)`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Raking', 38, 'A raking light: parallel bars whose lean builds steadily down the sheet.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 26%; top: -20%; width: 48%; height: 140%; background: ${ink(c)}; ${xf(`skewX(@calc(-42 + 84 * ${RY})deg)`)}`)} }${TR}`,
}), { tg: '6x6' });

// ════════════════════════════════════════════════════════════════════════════
// H. Interference — two canvas-scale fields at slightly different pitches. The
//    pattern you see is the beat between them, which belongs to neither.
// ════════════════════════════════════════════════════════════════════════════

add('Beat', 0, 'Two rulings a hair apart in pitch: where they line up the cell goes solid, where they fight it opens.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${msk('repeating-linear-gradient(0deg, #000 0 5%, transparent 5% 11%)')}`)} ${A(`inset: 0; background: ${ink(c)}; ${msk('repeating-linear-gradient(0deg, #000 0 5%, transparent 5% 12.4%)')} opacity: 0.85;`)} }${TR}`,
}), { grid: '4x6', tg: '4x4' });

add('Fringe', 26, 'Interference fringes: two fans a couple of degrees out of step with each other.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; border-radius: 50%; background: ${ink(c)}; ${fanMask('9deg', '18deg')}`)} ${A(`inset: 0; border-radius: 50%; background: ${ink(c)}; ${fanMask('9deg', '19.5deg')} opacity: 0.8;`)} }${TR}`,
}), { grid: '4x6', tg: '4x4' });

add('Nodal', 43, 'A standing wave in two directions at once: the cell is biggest where both crests meet.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; width: @calc(14 + 80 * @abs(@sin(1.1 * @x) * @sin(0.9 * @y)))%; height: @calc(14 + 80 * @abs(@sin(1.1 * @x) * @sin(0.9 * @y)))%; ${xf('translate(-50%, -50%)')} border-radius: 50%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Antinode', 9, 'The same field read the other way round: largest where the two waves cancel.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; width: @calc(94 - 78 * @abs(@sin(1.1 * @x) * @sin(0.9 * @y)))%; height: @calc(94 - 78 * @abs(@sin(1.1 * @x) * @sin(0.9 * @y)))%; ${xf('translate(-50%, -50%)')} background: ${ink(c)};`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Standing', 34, 'One standing wave, running along the rows only.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 4%; top: 50%; width: 92%; height: @calc(10 + 82 * @abs(@sin(0.8 * @x))) %; ${xf('translateY(-50%)')} border-radius: 999px; background: ${ink(c)};`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Superpose', 57, 'Two hatchings laid over each other at a small angle, so a third pattern appears.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${msk('repeating-linear-gradient(24deg, #000 0 6%, transparent 6% 13%)')}`)} ${A(`inset: 0; background: ${ink(c)}; ${msk('repeating-linear-gradient(-24deg, #000 0 6%, transparent 6% 13%)')} opacity: 0.85;`)} }${TR}`,
}), { grid: '4x6', tg: '4x4' });

add('Phaseshift', 13, 'One ruling whose phase slides across the sheet, so the bands walk sideways as you read.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${msk(`repeating-linear-gradient(0deg, transparent 0 @calc(2 + 9 * ${RX})%, #000 0 @calc(9 + 9 * ${RX})%, transparent 0 18%)`)} }${TR}`,
}), { tg: '6x6' });

add('Alias', 21, 'A ruling pitched close enough to the grid itself that the two start to argue.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${msk('repeating-linear-gradient(0deg, #000 0 24%, transparent 24% 51%)')} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Dither', 46, 'An ordered dither: the threshold walks with the cell index, so the tone builds without noise.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; width: @calc(20 + 68 * @abs(@i % 5 / 5))%; height: @calc(20 + 68 * @abs(@i % 5 / 5))%; ${xf('translate(-50%, -50%)')} background: ${ink(c)};`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Bayer', 62, 'The Bayer matrix: a four-by-four threshold pattern, tiled and read off the cell index.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; width: @calc(18 + 72 * @abs(@sin(2.1 * @i)))%; height: @calc(18 + 72 * @abs(@sin(2.1 * @i)))%; ${xf('translate(-50%, -50%)')} background: ${ink(c)};`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Swell', 15, 'A swell running out from the middle of the sheet, the marks rising and falling with it.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; width: @calc(18 + 74 * @abs(@sin(4 * ${RAD})))%; height: @calc(18 + 74 * @abs(@sin(4 * ${RAD})))%; ${xf('translate(-50%, -50%)')} border-radius: 50%; background: ${ink(c)};`)} }${TR}`,
}), { tg: '6x6' });

add('Undulate', 39, 'A row of marks riding up and down on a wave that runs the width of the sheet.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 18%; top: @calc(38 + 34 * @sin(0.9 * @x))%; width: 64%; height: 30%; border-radius: 999px; background: ${ink(c)};`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Oscillate', 50, 'The tilt of every bar taken from a sine wave running across the sheet.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 4%; top: 36%; width: 92%; height: 28%; background: ${ink(c)}; ${xf('rotate(@calc(50 * @sin(0.7 * @x))deg)')}`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Pulsate', 6, 'A pulse travelling along the index, so the wave crosses the rows as well as the columns.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; width: @calc(16 + 76 * @abs(@sin(0.55 * @i)))%; height: @calc(16 + 76 * @abs(@sin(0.55 * @i)))%; ${xf('translate(-50%, -50%)')} border-radius: 50%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Throb', 32, 'Only the opacity beats: the shapes never move.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; opacity: @calc(0.22 + 0.78 * @abs(@sin(0.8 * @x + 0.6 * @y))); }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Shimmer', 54, 'Two layers beating out of step, one in opacity and one in size.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 8%; background: ${ink(c)}; opacity: @calc(0.2 + 0.8 * @abs(@sin(0.9 * @x)));`)} ${A(`left: 50%; top: 50%; width: @calc(18 + 46 * @abs(@sin(0.7 * @y)))%; height: @calc(18 + 46 * @abs(@sin(0.7 * @y)))%; ${xf('translate(-50%, -50%)')} border-radius: 50%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Chatter', 19, 'A high-frequency wobble: the offset changes sign almost every cell.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 16%; background: ${ink(c)}; ${xf('translate(@calc(22 * @sin(2.7 * @i))%, @calc(22 * @sin(1.9 * @i))%)')}`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Judder', 65, 'Stepped offsets rather than smooth ones, so the field jerks instead of sliding.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 14%; background: ${ink(c)}; ${xf('translateY(@calc(@round(@sin(1.3 * @i) * 2) * 14)%)')}`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Warble', 28, 'A ruling whose pitch is itself modulated, so the bands bunch and spread.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${msk('repeating-linear-gradient(0deg, #000 0 @calc(6 + 4 * @sin(0.9 * @x))%, transparent 0 @calc(15 + 6 * @sin(0.9 * @x))%)')} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Tremble', 58, 'The smallest of the family: a shiver of a degree or two, taken from a fast wave.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 10%; background: ${ink(c)}; ${xf('rotate(@calc(16 * @sin(2.3 * @i))deg)')}`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

// ════════════════════════════════════════════════════════════════════════════
// I. Weights — border and rule widths graded across the sheet. Nothing moves
//    and nothing changes shape; the whole composition is carried by how heavy
//    the line is. Widths are px scaled off @size-col, because a border-width
//    cannot be a percentage.
// ════════════════════════════════════════════════════════════════════════════

// A border width authored for a six-column grid, ramping from `a` to `b`.
const wRamp = (a, b, t) =>
  `calc(@calc(${a} ${b >= a ? '+' : '-'} ${Math.abs(b - a)} * ${t}) * 1px * 6 / @size-col)`;

add('Hairline', 27, 'A hairline at one edge of the sheet and a heavy rule at the other, with nothing else changing.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 5%; border-style: solid; border-color: ${ink(c)}; border-width: ${wRamp(0.6, 9, RX)}; box-sizing: border-box;`)} }${TR}`,
}), { tg: '6x6', min: 30 });

add('Thickset', 2, 'Heavy throughout, and heavier still as it goes: frames that all but close up.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 2%; border-style: solid; border-color: ${ink(c)}; border-width: ${wRamp(4, 15, RY)}; box-sizing: border-box;`)} }${TR}`,
}), { tg: '6x6', min: 34 });

add('Boldface', 48, 'Bold rules laid across the sheet, thickening column by column.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${A(`left: 0; top: 50%; width: 100%; height: ${ramp(10, 72, RX)}; ${xf('translateY(-50%)')} background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '6x6' });

add('Lightface', 11, 'The same run kept light, so the sheet reads as a ruled page rather than a pattern.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 0; top: 50%; width: 100%; height: ${ramp(3, 22, RX)}; ${xf('translateY(-50%)')} background: ${ink(c)};`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Demibold', 36, 'Halfway between the two, with the weight running the other way.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 0; width: ${ramp(46, 8, RX)}; height: 100%; ${xf('translateX(-50%)')} background: ${ink(c)};`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Condensed', 63, 'Narrow and getting narrower, the whole sheet squeezed towards one edge.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 4%; width: ${ramp(72, 10, RX)}; height: 92%; ${xf('translateX(-50%)')} background: ${ink(c)};`)} }${TR}`,
}), { tg: '6x6' });

add('Extended', 20, 'Wide and getting wider, until the marks touch and the field closes.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 22%; width: ${ramp(14, 100, RX)}; height: 56%; ${xf('translateX(-50%)')} background: ${ink(c)};`)} }${TR}`,
}), { tg: '6x6' });

add('Expanded', 42, 'Expanded in both directions at once, so the marks grow into their own cells.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; width: ${ramp(16, 98, RX)}; height: ${ramp(16, 98, RY)}; ${xf('translate(-50%, -50%)')} background: ${ink(c)};`)} }${TR}`,
}), { tg: '6x6' });

add('Roman', 8, 'Upright frames of even weight, with only their size on the ramp.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 50%; top: 50%; width: ${ramp(26, 96, RX)}; height: ${ramp(26, 96, RX)}; ${xf('translate(-50%, -50%)')} border-style: solid; border-color: ${ink(c)}; border-width: ${u(3)}; box-sizing: border-box;`)} }${TR}`,
}), { tg: '6x6', min: 30 });

add('Linework', 53, 'Two rules per cell, one gaining weight as the other loses it.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 0; top: 24%; width: 100%; height: ${ramp(4, 34, RX)}; background: ${ink(c)};`)} ${A(`left: 0; top: 64%; width: 100%; height: ${ramp(34, 4, RX)}; background: ${ink(c)};`)} }${TR}`,
}), { tg: '6x6' });

add('Mount', 17, 'A mount cut with two openings, the inner one closing as the sheet runs on.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 4%; border-style: solid; border-color: ${ink(c)}; border-width: ${u(2)}; box-sizing: border-box;`)} ${A(`inset: ${ramp(14, 40, RX)}; border-style: solid; border-color: ${ink(c)}; border-width: ${u(4)}; box-sizing: border-box;`)} }${TR}`,
}), { tg: '6x6', min: 30 });

add('Edging', 30, 'One edge banded, and the band thickening across the sheet.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${A(`left: 0; top: 0; width: 100%; height: ${ramp(8, 62, RX)}; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '6x6' });

add('Piping', 4, 'Rounded piping run round the edge of every panel, growing heavier as it goes.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 6%; border-radius: 999px; border-style: solid; border-color: ${ink(c)}; border-width: ${wRamp(1, 10, RY)}; box-sizing: border-box;`)} }${TR}`,
}), { tg: '6x6', min: 30 });

add('Binding', 59, 'Bound on two sides only, the binding widening down the sheet.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 5%; border-style: solid; border-color: ${ink(c)}; border-width: ${wRamp(1, 11, RY)} 0 ${wRamp(1, 11, RY)} 0; box-sizing: border-box;`)} }${TR}`,
}), { tg: '6x6', min: 30 });

add('Hem', 24, 'A hem along the foot of each cell, deepening as the rows go down.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 0; bottom: 0; width: 100%; height: ${ramp(6, 58, RY)}; background: ${ink(c)};`)} }${TR}`,
}), { tg: '6x6' });

add('Welt', 45, 'A welted seam: two rules with a constant gap, both gaining weight together.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${B(`left: 0; top: 22%; width: 100%; height: ${ramp(4, 26, RY)}; background: ${ink(c)};`)} ${A(`left: 0; top: 58%; width: 100%; height: ${ramp(4, 26, RY)}; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '6x6' });

add('Cord', 66, 'Round-ended cord laid in rows, thickening across the sheet.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 2%; top: 50%; width: 96%; height: ${ramp(8, 64, RX)}; ${xf('translateY(-50%)')} border-radius: 999px; background: ${ink(c)};`)} }${TR}`,
}), { tg: '6x6' });

add('Soutache', 1, 'Narrow braid: two cords side by side, the pair opening out as it runs.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${B(`left: 0; top: ${ramp(40, 16, RX)}; width: 100%; height: 16%; border-radius: 999px; background: ${ink(c)};`)} ${A(`left: 0; bottom: ${ramp(40, 16, RX)}; width: 100%; height: 16%; border-radius: 999px; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '6x6' });

add('Galloon', 40, 'A broad decorative band with a rule either side of it, all three on the same ramp.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 0; top: 50%; width: 100%; height: ${ramp(20, 72, RY)}; ${xf('translateY(-50%)')} background: ${ink(c)};`)} ${A(`left: 0; top: 50%; width: 100%; height: ${ramp(6, 24, RY)}; ${xf('translateY(-50%)')} background: ${ink(c)};`)} }${TR}`,
}), { tg: '6x6' });

add('Passement', 56, 'Passementerie: a band with a row of holes punched along it, the holes growing with the band.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 0; top: 50%; width: 100%; height: ${ramp(24, 82, RY)}; ${xf('translateY(-50%)')} background: ${ink(c)}; ${msk(`radial-gradient(circle closest-side at 50% 50%, transparent ${ramp(20, 58, RY)}, #000 0) 0 0 / 25% 100%`)}`)} }${TR}`,
}), { tg: '6x6' });

add('Kerb', 14, 'An L of kerbing turning the corner of every cell, heavier the further it runs.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${A(`inset: 5%; border-style: solid; border-color: ${ink(c)}; border-width: 0 0 ${wRamp(1.5, 12, RX)} ${wRamp(1.5, 12, RX)}; box-sizing: border-box;`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '6x6', min: 30 });

add('Skirting', 37, 'A skirting board: a deep band at the foot with a thin moulding above it.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 0; bottom: 0; width: 100%; height: ${ramp(14, 54, RY)}; background: ${ink(c)};`)} ${A(`left: 0; bottom: ${ramp(18, 58, RY)}; width: 100%; height: 7%; background: ${ink(c)};`)} }${TR}`,
}), { tg: '6x6' });

add('Architrave', 52, 'An architrave: a frame whose moulding thickens on the way round the sheet.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: 4%; border-style: solid; border-color: ${ink(c)}; border-width: ${wRamp(1, 6, RY)} ${wRamp(6, 1, RX)}; box-sizing: border-box;`)} }${TR}`,
}), { tg: '6x6', min: 30 });

add('Dado', 61, 'A dado rail set across the sheet, dropping down the wall as the rows go on.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 0; top: ${ramp(18, 72, RY)}; width: 100%; height: 12%; background: ${ink(c)};`)} ${A(`left: 0; top: ${ramp(34, 88, RY)}; width: 100%; height: 5%; background: ${ink(c)};`)} }${TR}`,
}), { tg: '6x6' });

if (all.length !== 200) {
  throw new Error(`batch 9 must hold exactly 200 designs, found ${all.length}`);
}

export const batch9 = all;
