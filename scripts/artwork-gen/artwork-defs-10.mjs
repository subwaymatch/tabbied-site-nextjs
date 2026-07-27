// Batch 10 — 200 motifs (gallery orders 1100+).
//
// Batch 9 asked what happens when the *canvas* is the unit rather than the
// cell. This one sits between the two: most of these motifs are bigger than a
// cell and smaller than the sheet. A super-tile spans four cells; a chain runs
// from one cell into the next; a wedge opens out past its own edges. The grid
// stops being a frame around each drawing and becomes the thing the drawing is
// assembled from.
//
// It opens with the family this batch was asked for. Wedge — a conic-gradient
// mask cutting one sector out of a solid cell — turned out to be the most
// liked design in batch 9, because of the way the sector *spreads*: a shape
// that starts at a point and opens. Section A is thirty-six variations on
// that: sectors from the centre, from a corner, from an edge, annular ones
// with the apex bored out, nested ones, paired ones, whole fans, and sectors
// whose angle is driven by where the cell sits on the sheet. Every one of them
// is a real hole, because a conic mask cuts rather than paints.
//
//   A. Spread            one sector, opening from a point (36 designs).
//   B. Super-tiles       a motif that spans two or three cells each way, so
//                        the drawing is larger than the cell it starts in.
//   C. Interlock         figure and ground both inked, each shape keying into
//                        the ones beside it.
//   D. Counterform       the drawing is the hole; the ink is what is left.
//   E. Stacks            layered plates, offset, reading as depth without any
//                        perspective in them.
//   F. Chains            links that run from cell to cell.
//   G. Corners           everything built off the corner of the cell rather
//                        than its middle.
//   H. Bands             mouldings and banding, run across the sheet.
//
// House rules (inherited from every earlier batch, enforced by
// generate-batch10.mjs and validate-batch10.mjs):
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
//     stops erasing anything. Every gap here is a mask, a clip-path hole or a
//     gap between elements, and validate-batch10.mjs re-renders the whole
//     batch over a checkerboard with the background slot set to #00000000 and
//     requires byte-identical cells.

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

// A px length authored for a six-column grid, scaled down as the grid
// densifies. Border and shadow widths take lengths only, never percentages.
const u = (v) => `calc(${v}px * 6 / @size-col)`;

// A sweep across the sheet, for the few designs that grade their spread.
const RX = '@x / @X';
const RY = '@y / @Y';
const ramp = (a, b, t) =>
  `@calc(${a} ${b >= a ? '+' : '-'} ${Math.abs(b - a)} * ${t})%`;
const rampDeg = (a, b, t) =>
  `@calc(${a} ${b >= a ? '+' : '-'} ${Math.abs(b - a)} * ${t})deg`;

// ── A: the spread ──────────────────────────────────────────────────────────
// One sector of a circle, opening from a point. conic-gradient is the only
// thing in CSS that sweeps a value round an angle, and used as a *mask* the
// sector is cut rather than painted — so the part that is not the wedge is a
// genuine hole and the design survives a transparent background.
//
// `at` moves the apex: 50% 50% puts it in the middle of the cell, 0% 100% in a
// corner, 50% 100% on an edge. Moving the apex is most of what separates one
// design in this section from the next.
const pie = (deg, { from = '0deg', at = '50% 50%' } = {}) =>
  msk(`conic-gradient(from ${from} at ${at}, #000 0 ${deg}, transparent ${deg} 360deg)`);

// A fan: `on` degrees of ink every `period` degrees, all the way round.
const fan = (on, period, { from = '0deg', at = '50% 50%' } = {}) =>
  msk(`repeating-conic-gradient(from ${from} at ${at}, #000 0 ${on}, transparent ${on} ${period})`);

// A sector with its apex bored out — an annular sector. Two masks intersected:
// the conic decides the angle, the radial decides the inner and outer radius.
const arcSector = (deg, bore, { from = '0deg', at = '50% 50%' } = {}) =>
  `-webkit-mask: conic-gradient(from ${from} at ${at}, #000 0 ${deg}, transparent 0), radial-gradient(circle closest-side at ${at}, transparent ${bore}, #000 0); mask: conic-gradient(from ${from} at ${at}, #000 0 ${deg}, transparent 0), radial-gradient(circle closest-side at ${at}, transparent ${bore}, #000 0); -webkit-mask-composite: source-in; mask-composite: intersect;`;

// A fan with its hub bored out.
const arcFan = (on, period, bore, { from = '0deg', at = '50% 50%' } = {}) =>
  `-webkit-mask: repeating-conic-gradient(from ${from} at ${at}, #000 0 ${on}, transparent ${on} ${period}), radial-gradient(circle closest-side at ${at}, transparent ${bore}, #000 0); mask: repeating-conic-gradient(from ${from} at ${at}, #000 0 ${on}, transparent ${on} ${period}), radial-gradient(circle closest-side at ${at}, transparent ${bore}, #000 0); -webkit-mask-composite: source-in; mask-composite: intersect;`;

// ── other masks ────────────────────────────────────────────────────────────
const ringMask = (bore) =>
  msk(`radial-gradient(circle closest-side at 50% 50%, transparent ${bore}, #000 ${bore})`);
const slotMask = (angle, on, off) =>
  msk(`repeating-linear-gradient(${angle}, #000 0 ${on}, transparent ${on} ${off})`);

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
const roundHole = (r, steps = 28) =>
  Array.from({ length: steps }, (_, i) => {
    const a = (-2 * Math.PI * i) / steps;
    return [50 + r * Math.cos(a), 50 + r * Math.sin(a)];
  });
const diamondHole = (x, y) => [
  [50, 50 - y],
  [50 - x, 50],
  [50, 50 + y],
  [50 + x, 50],
];
const ringPoly = (outer, inner) =>
  `polygon(${P(outer)}, ${P([outer[0]])}, ${P(inner)}, ${P([inner[0]])})`;
const SQUARE = [[0, 0], [100, 0], [100, 100], [0, 100]];
const DIAMOND = [[50, 0], [100, 50], [50, 100], [0, 50]];

// ── super-tiles ────────────────────────────────────────────────────────────
// A motif spread over an n x n block of cells: each cell draws its own quarter
// (or ninth) of the drawing, chosen by where it sits in the block. `q(n)` is
// the cell's position within the block, counting from zero.
const qx = (n) => `@x % ${n}`;
const qy = (n) => `@y % ${n}`;

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
    'abacus abjad abugida accordion acorn agate airy alias ambit ammann ' +
    'amoeba ampersand amphora analemma anamorph anchor annulet annulus ' +
    'antinode aperiodic aperture apex apogee aquatint arabesque arcade ' +
    'architrave argyle armature armilla arpeggio arrow arrowplay asanoha ' +
    'ascendant ascender ascent aster asterisk asterism astragal astroid ' +
    'atoll attenuate augment aureole aurora automaton awning axial axis ' +
    'axle axonometry azimuth azulejo balloon bandelet barcode bargello ' +
    'barline barrulet barycentre basalt basket baste batter battlement ' +
    'bauhaus bayer beacon beadrow beat beatnote bee benchmark bento berry ' +
    'bevel beveled bezant bezel bias bifolium bilateral billet billow ' +
    'binding blade bleed blockfall bloks bloom blossom blot bobbin bokeh ' +
    'boldface bolt bond boro boss bourdon bowl bowtie boxweave bracket ' +
    'bracketpair bract braid braille bramble brickwork brise bristle ' +
    'brocade brokenbond bubble bubbles bud bulge bullseye bunting buoy ' +
    'burgee burin burnish bushing butterfly button buttonhole cabinet ' +
    'cadence cadenza cairn caldera caltrop calyx camber came caneweave ' +
    'canopy cant cantor capsule cardioid caret carillon carousel cartoon ' +
    'cartouche cascade catenary cattail caustic cavalier cavetto celleye ' +
    'centroid chaff chalice chamfer charcoal chatter checkers checkmark ' +
    'chenille chert chevarrow chevrondiamond chevronel chime chine chip ' +
    'chiral chrono chrysanth churn cinch cinquefoil circuit cirque cirrus ' +
    'citrus cleat clef clover cobble cog cogwheel coil cointile collatz ' +
    'collotype colophon comb comet compass condensed confetti ' +
    'constellation contour converge convex coral corbel cord cornerbite ' +
    'cornerpunch cornerstone cornice corolla corona corpuscle counter ' +
    'counterpart cove crank crater crazy crease crescendo crescent ' +
    'cresset crossbar crosshair crosshatch crosslet crotchet crumble crux ' +
    'crystal cube cumulus cuneiform cupola curd curl curlicue cusp ' +
    'cusping cyclone cymbal cynosure dado dagger damask damier damping ' +
    'dapple dart datum daybreak deckle decline delaunay delta deltoid ' +
    'demibold demotic dentil descent diadem diadot dial diamond3d ' +
    'diamonddust diamondeye diamondframe diaper dihedral dimetric ' +
    'diminish diminuendo dingbat dipole diptych discus disque dither ' +
    'divergent dogtooth dome domino dotdash dotwave doubinset dragon ' +
    'draughts drift driftleaf drizzle dropcap drypoint dune echo ecliptic ' +
    'eddy edgeband edging elbow ell emboss enantiomer engrave enso ' +
    'epicentre epicycle epitrochoid ermine erode escapement estuary ' +
    'evolute expanded extended eyelet facade facetbox facetdiamond ' +
    'facetgrad fang fanleaf fanlight fanvault farey fermata fibonacci ' +
    'fiducial filament fillet fin fishscale flabellum flagstone flange ' +
    'flare fleck fleuron flight flint flurry flutter flux flywheel ' +
    'foldback foldout foliage folio folium foreshorten fourpane foxing ' +
    'fractal frame frameblock fray freckle fresnel fretwork fringe frond ' +
    'froth frustum fulcrum fusil futhark fuzz gable gablet galloon gasket ' +
    'gauge gauze gem gemcut geode gibbous gimbal gingham girih glide ' +
    'glider glint glitch globule glory glyph gnomon gong gore gradation ' +
    'grade graduate grain granule graphite grassblade graticule gravel ' +
    'gravure gridline grille grisaille grit groundline gumball gusset ' +
    'gutter gyre gyroid gyron hachure hairline hairpin halation halfblock ' +
    'halfdot halfink halfmoon halfpenny halftone halo harlequin harmonic ' +
    'hashmark hatch heart hearth helicoid helio hem heptafoil herringbone ' +
    'hexafoil hexagram hexbloom hexdot hexnut hextile hieratic hilbert ' +
    'hinge hoop hopscotch horizon houndstooth hourglass hub hurdle ' +
    'hyperbola hypotrochoid ibeam ichimatsu ideogram ikat impasto ' +
    'impeller impost incense incline indent inkblot inlay inset insetstep ' +
    'intaglio interval involute iris isobar isocube isometry isopleth ivy ' +
    'jacquard jali jalousie jelly jewel judder jumble junction kaleido ' +
    'karst kasuri kerb kerf kern kernel keyhole keyline keypad keystone ' +
    'keyway keywork khatam kikko kilim kintsugi kirigami kite knell koch ' +
    'koi kufic ladybird lagoon lantern lapse lattice laundry lava ledger ' +
    'lemniscate lens lentil levels lierne ligature lightface lily limacon ' +
    'linework links linocut lintel listel litho lobe locus lodestone ' +
    'logcabin logogram loophole lotus louvre loxodrome lozenge ' +
    'lozengegrad lozengy lsystem lune lunette macaron macrocosm madras ' +
    'maelstrom magma maltese mandorla margin marquee marquetry mascle ' +
    'massif matchstick matryoshka matte maze meadow meander medusa ' +
    'memphis meridian merlon mesh meter metro mezzotint mica microcosm ' +
    'minim mirror misprint mistwave mitosis miura mixtape modulo moire ' +
    'moment monolith monotype moonphase moraine morse mortise mosaicglass ' +
    'mosaictile mote mouchette mount mudcloth mullion muqarna nacre nadir ' +
    'navel necking needle neon nephroid nestbox nib nimbus nodal ' +
    'northstar notch notchbar notchblock nozzle nucleus nutation obelisk ' +
    'obelus oblique octagon octant octave oculus odessa offset offsetbox ' +
    'ogee ogham ogive omphalos ooze orb orbit organelle origami orphan ' +
    'ortho oscillate oscillo ostinato outline overtone ovolo oxbow ' +
    'paisley palindrome palisade palmette papercut parabola parallax ' +
    'parasol parhelion parity parquet passement passepartout patina ' +
    'pavers pavilion pawl peal peano pebble pebbledot pediment pellet ' +
    'pendulum pennant pennantbox pennon penrose penta pentafan pentafoil ' +
    'penumbra petal phaseshift phasor picket pictogram pictureplane ' +
    'pierglass pieslice pilcrow pinhex pinhole pinion pinmark pinnacle ' +
    'pinnate pinnule pinweave pinwheel pinwheelstar pinwheeltile ' +
    'pinwheelweave pip piping pique piston pivot pixel plaid plasma pleat ' +
    'plumb plus pod polaroid pole polka polkapair polyptych pompom ' +
    'pondring popsicle portal postage posy potent pounce precession ' +
    'prisma prismfold progress propeller protoplast prow pulp pulsar ' +
    'pulsate pulsebar punchcard pylon pyramid pyramid3d pyrite quadrant ' +
    'quadrifolium quadrille quadtree quake quarry quarterbar quarterblock ' +
    'quarterfall quartz quasar quasi quatrefoil quaver quill quilling ' +
    'quilt quiltsquare quincunx quire quoit raceme radar radial radiant ' +
    'radius rafter rail rainbow raindrop rake raking ramp range raster ' +
    'ratchet readout recession recurse reedpen reef reflect regatta ' +
    'register reglet residue resonance respond rhodonea rhomboid rhumb ' +
    'ribbonfold ricrac riffle rill ring ringdot ringlink ripple rivet roe ' +
    'roman rondure rorschach rosace rotor roulette roundel ruling rune ' +
    'rungs rustre saguaro sail saltire sandbar sanguine sash sashiko ' +
    'sawedge sayagata scale scallop scatterdot schist scotia scramble ' +
    'scribe sebka sector seersucker segment seigaiha selvedge semaphore ' +
    'semibreve sepal sequence sequin serif serigraph serpentine sextant ' +
    'shard shatter shelf shibori shield shimmer shingle shippo shoal ' +
    'shoji shuffle sickle sierpinski sigil signal silo silt silverpoint ' +
    'sine sinkhole sinuous sixstar skeleton skerry sketch skew skewblock ' +
    'skirting slant slat slice sliptile sliver slope smoulder snowflake ' +
    'soffit solenoid sonata soufflet soutache spandrel spark sparkle ' +
    'spathe spawn spearhead speckle spectro spectrum specular spill spin ' +
    'spindrift spiralblock spire spirograph splat splay spline splinter ' +
    'splithz splittri spore sprig springer sprinkles sprocket sprout ' +
    'squall squinch squircle staccato stackbond stamen standing star5 ' +
    'starfish starflake starlet station stator stave stella step step3d ' +
    'stereo stipple stipule stitch strata streamline stylus subdivide ' +
    'sunburst sundial sundog sunken sunwheel superellipse superpose surf ' +
    'swell swellbox swirl switchback syllabary symmetral symmetry syzygy ' +
    'tag tally talus taper tapioca target tatami tatewaku teardrop tee ' +
    'telegraph telemetry tendril terrain tesserae tessitura tetro ' +
    'thickset thistle throb ticker tickmark tictac tierceron tilt tittle ' +
    'tocsin torque torsion torteau torus trace tracery trackline transom ' +
    'trapeze trapezoid traverse trefoil trellis tremble tremolo tremor ' +
    'triad trianglet triband trifolium trigram trimetric triptych ' +
    'triquetra trishard truchet tube tumble turbine turret tweed twill ' +
    'twinkle ulam umbel umbrella underdraw undulate uroko vacuole vair ' +
    'vane vanish vector vee veil venetian venn vertex vesicle vinyl ' +
    'vitrail voltage volute volution voronoi vortex voussoir wander ' +
    'waning warble warp wash washer waterbomb waveform wavefront wavelet ' +
    'waypoint weave webbing wedge weft wellhead wellspring welt wheelarc ' +
    'whirligig whisker whorl wicket widow wigwag windowframe windowpane ' +
    'windrose wingtri wireframe woodcut wreath yagasuri zagtile zee ' +
    'zellige zenith ziggurat ziggy zigline zigzagfold zipper'
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

let order = 1100;
const all = [];

// cfg:
//   grid   default "columns x rows" for the editor       (default '6x9')
//   freq   default frequency                             (default 1)
//   tg/tf  gallery-thumbnail grid / frequency            (default '5x5' / 1)
//   min    sizing.minCellPx floor, for px-scaled details
const add = (name, palIdx, description, build, cfg = {}) => {
  const slug = name.toLowerCase();
  if (!/^[a-z][a-z0-9]*$/.test(slug)) throw new Error(`bad slug: ${slug}`);
  if (RESERVED.has(slug)) throw new Error(`slug is a reserved word: ${slug}`);
  if (TAKEN.has(slug)) throw new Error(`slug already taken elsewhere: ${slug}`);
  if (all.some((d) => d.slug === slug)) throw new Error(`duplicate slug in batch 10: ${slug}`);
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
    thumb: { grid: cfg.tg ?? '5x5', frequency: cfg.tf ?? 1 },
    vars,
    rule,
  });
};


// ════════════════════════════════════════════════════════════════════════════
// A. Spread — one sector of a circle, opening from a point. Thirty-six ways to
//    move the apex, change the angle, bore out the middle, pair the sectors up
//    or open them into a whole fan.
// ════════════════════════════════════════════════════════════════════════════

add('Ray', 2, 'A single narrow ray leaving the middle of the cell, its bearing rolled each time.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${pie('34deg', { from: R8 })} }${TR}`,
}), { tg: '5x5' });

add('Sunray', 33, 'A broad sector opening from one corner, so the light comes in across the whole cell.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${pie('42deg', { from: '20deg', at: '0% 100%' })} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Spoke', 18, 'Two opposed sectors from the same hub, so the cell reads as a spoke rather than a wedge.', (c) => ({
  vars: '',
  rule: `--fd: @pick(0, 45, 90, 135, 180, 225, 270, 315); ${F} { ${B(`inset: 0; background: ${ink(c)}; ${pie('26deg', { from: '@calc(@var(--fd))deg' })}`)} ${A(`inset: 0; background: ${ink(c)}; ${pie('26deg', { from: '@calc(@var(--fd) + 180)deg' })}`)} }${TR}`,
}), { tg: '5x5' });

add('Fanout', 45, 'A quarter-fan opening from the corner: four blades, spreading as they go.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${fan('14deg', '24deg', { at: '0% 100%' })} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Plume', 9, 'A plume: the sector bored out at the quill so the feather starts clear of its own root.', (c) => ({
  vars: '',
  rule: `--from: ${R8}; ${F} { background: ${ink(c)}; ${arcSector('56deg', '22%', { from: '@var(--from)' })} }${TR}`,
}), { tg: '5x5' });

add('Spray', 32, 'A wide spray thrown from one edge, the cone opening to nearly a half-circle.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${pie('96deg', { from: '312deg', at: '50% 100%' })} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Sheaf', 51, 'A sheaf of five stalks tied at the foot and opening at the head.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { background: ${ink(c)}; ${fan('9deg', '22deg', { from: '206deg', at: '50% 100%' })} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Fascicle', 14, 'A bundle: a tight fan from the corner with the hub cut away.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${arcFan('8deg', '18deg', '16%', { at: '0% 100%' })} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Bouquet', 25, 'Three sectors of different widths springing from one point, the way a posy is gathered.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`inset: 0; background: ${ink(c)}; ${pie('30deg', { from: '304deg', at: '50% 100%' })}`)} ${A(`inset: 0; background: ${ink(c)}; ${pie('54deg', { from: '346deg', at: '50% 100%' })}`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Quiver', 60, 'Arrows in a quiver: a narrow fan leaning off the vertical.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${fan('7deg', '15deg', { from: '218deg', at: '50% 100%' })} ${rot('@pick(-14deg, 0deg, 14deg)')} }${TR}`,
}), { tg: '5x5' });

add('Starburst', 41, 'Twelve sectors from a common centre, every one the same width.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${fan('14deg', '30deg')} }${TR}`,
}), { tg: '5x5' });

add('Radiance', 6, 'The same burst with the middle bored out, so the light seems to come from behind.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${arcFan('11deg', '24deg', '26%')} }${TR}`,
}), { tg: '5x5' });

add('Effulgent', 37, 'Alternating wide and narrow rays, which is how a burst reads when it is drawn rather than measured.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${msk('repeating-conic-gradient(from 0deg at 50% 50%, #000 0 20deg, transparent 20deg 36deg, #000 36deg 42deg, transparent 42deg 60deg)')} }${TR}`,
}), { tg: '5x5' });

add('Beam', 22, 'One straight-sided beam, widening as it crosses the cell.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${pie('22deg', { from: '@pick(20deg, 50deg, 80deg, 110deg, 140deg)', at: '0% 50%' })} }${TR}`,
}), { tg: '5x5' });

add('Shaft', 55, 'A shaft of light through a gap: two narrow beams from the same slot in the wall.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${fan('16deg', '38deg', { from: '336deg', at: '0% 50%' })} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Searchlight', 12, 'A searchlight beam, swept to a different bearing in every cell and bored at the lamp.', (c) => ({
  vars: '',
  rule: `--from: @pick(290deg, 315deg, 340deg, 5deg, 30deg); ${F} { background: ${ink(c)}; ${arcSector('40deg', '10%', { from: '@var(--from)', at: '50% 100%' })} }${TR}`,
}), { tg: '5x5' });

add('Floodlight', 64, 'A flood rather than a spot: the cone opened right out to a hundred and sixty degrees.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${pie('104deg', { from: '218deg', at: '50% 100%' })} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Lamplight', 30, 'Light falling from a lamp overhead: a cone from the top edge with a disc at the source.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${pie('80deg', { from: '50deg', at: '50% 0%' })}`)} ${A(`left: 40%; top: -8%; width: 20%; height: 20%; border-radius: 50%; background: ${ink(c)};`)} }${TR}`,
}), { tg: '5x5' });

add('Gleam', 3, 'A thin gleam off an edge: a narrow sector with the apex just outside the cell.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${pie('20deg', { from: '80deg', at: '-10% 50%' })} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Flash', 47, 'A four-armed flash: two crossed sectors meeting at the centre.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${fan('24deg', '90deg', { from: '348deg' })} ${rot('@pick(0deg, 22deg, 45deg)')} }${TR}`,
}), { tg: '5x5' });

add('Scintilla', 19, 'A spark: eight very narrow rays, and nothing else.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${fan('5deg', '45deg')} ${rot(R8)} }${TR}`,
}), { tg: '5x5' });

add('Coruscate', 58, 'Two bursts at different pitches laid over each other, so the rays never quite agree.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${fan('9deg', '40deg')}`)} ${A(`inset: 18%; background: ${ink(c)}; ${fan('7deg', '30deg', { from: '15deg' })}`)} }${TR}`,
}), { tg: '5x5' });

add('Emanate', 43, 'Concentric sectors: the same wedge at three radii, each ring separated from the next.', (c) => ({
  vars: '',
  rule: `--from: ${R8}; ${F} { background: ${ink(c)}; -webkit-mask: conic-gradient(from @var(--from) at 50% 50%, #000 0 110deg, transparent 0), repeating-radial-gradient(circle closest-side at 50% 50%, #000 0 34%, transparent 34% 50%); mask: conic-gradient(from @var(--from) at 50% 50%, #000 0 110deg, transparent 0), repeating-radial-gradient(circle closest-side at 50% 50%, #000 0 34%, transparent 34% 50%); -webkit-mask-composite: source-in; mask-composite: intersect; }${TR}`,
}), { tg: '5x5' });

add('Irradiate', 16, 'A full circle of rays with a solid core, the sign a physicist would draw.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${arcFan('30deg', '120deg', '30%')}`)} ${A(`inset: 38%; border-radius: 50%; background: ${ink(c)};`)} }${TR}`,
}), { tg: '5x5' });

add('Disperse', 66, 'The sector widening as it crosses the sheet: a splinter on one side, half a circle on the other.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${pie(rampDeg(16, 190, RX), { from: '250deg', at: '50% 100%' })} }${TR}`,
}), { tg: '6x6' });

add('Diffuse', 8, 'The apex sliding down the sheet, so the spread starts inside the cell and ends outside it.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${pie('76deg', { from: '322deg', at: `50% ${ramp(60, 150, RY)}` })} }${TR}`,
}), { tg: '6x6' });

add('Broadcast', 52, 'Sown broadside: a wide cone from the corner with a scatter of grains inside it.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`inset: 0; background: ${ink(c)}; ${pie('88deg', { at: '0% 100%' })}`)} ${A(`inset: 0; background: ${ink(c)}; ${pie('88deg', { at: '0% 100%' })} ${msk('radial-gradient(circle closest-side at 50% 50%, #000 60%, transparent 60%) 0 0 / 25% 25%')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Punkah', 39, 'A punkah: one broad blade swung from the top edge, with a narrower one behind it.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${pie('60deg', { from: '150deg', at: '50% 0%' })}`)} ${A(`inset: 0; background: ${ink(c)}; ${pie('26deg', { from: '167deg', at: '50% 0%' })}`)} }${TR}`,
}), { tg: '5x5' });

add('Winnow', 5, 'Chaff thrown into the wind: a cone from the corner, thinned by a ruling across it.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; -webkit-mask: conic-gradient(from 0deg at 0% 100%, #000 0 90deg, transparent 0), repeating-linear-gradient(52deg, #000 0 6%, transparent 6% 15%); mask: conic-gradient(from 0deg at 0% 100%, #000 0 90deg, transparent 0), repeating-linear-gradient(52deg, #000 0 6%, transparent 6% 15%); -webkit-mask-composite: source-in; mask-composite: intersect; ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Flourish', 24, 'A flourish: a sector with a rounded outer edge, so the spread ends in a curve rather than a rim.', (c) => ({
  vars: '',
  rule: `--rot: ${R8}; ${F} { ${A(`inset: 4%; border-radius: 50%; background: ${ink(c)}; ${pie('104deg')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Garland', 61, 'A garland hung between two points: an annular sector with a wide bore and a shallow angle.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${arcSector('150deg', '62%', { from: '105deg', at: '50% 50%' })} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Festoon', 34, 'Two swags side by side, each one a shallow arc slung from its own pair of points.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: -2%; top: 0; width: 52%; height: 100%; background: ${ink(c)}; ${arcSector('140deg', '58%', { from: '200deg', at: '50% 14%' })}`)} ${A(`left: 50%; top: 0; width: 52%; height: 100%; background: ${ink(c)}; ${arcSector('140deg', '58%', { from: '200deg', at: '50% 14%' })}`)} }${TR}`,
}), { tg: '5x5' });

add('Swag', 11, 'A single deep swag, the sector bored out to leave only the drape.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${arcSector('120deg', '54%', { from: '210deg', at: '50% 8%' })} }${TR}`,
}), { tg: '5x5' });

add('Sluice', 49, 'Water leaving a sluice: a narrow throat opening into a wide fan.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 42%; top: 0; width: 16%; height: 42%; background: ${ink(c)};`)} ${A(`inset: 0; background: ${ink(c)}; ${arcSector('96deg', '40%', { from: '222deg', at: '50% 0%' })}`)} }${TR}`,
}), { tg: '5x5' });

add('Fountain', 29, 'A fountain: jets leaving one point at the foot and falling away either side.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${arcFan('10deg', '26deg', '10%', { from: '200deg', at: '50% 100%' })} }${TR}`,
}), { tg: '5x5' });

add('Aureate', 57, 'A gilded burst: a fine fan of rays inside a plain rim, the two of them separated by a gap.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 6%; border-radius: 50%; background: ${ink(c)}; ${arcFan('6deg', '18deg', '18%')}`)} ${A(`inset: 0; border-radius: 50%; background: ${ink(c)}; ${ringMask('88%')}`)} }${TR}`,
}), { tg: '5x5' });

// ════════════════════════════════════════════════════════════════════════════
// B. Super-tiles — the motif spans a two-by-two block of cells. Each cell
//    draws the same quarter and the flips assemble it, so what you see is one
//    drawing four cells wide rather than four copies of a small one.
//
//    The flips have to be done as four separate @match branches, each setting
//    the whole transform, because two branches that each set `transform`
//    would overwrite one another. `@x % 2 + @y % 2 == 0` is how the both-even
//    corner is reached without needing a && in the expression.
// ════════════════════════════════════════════════════════════════════════════

const quad = `${xf('scale(1, 1)')} @match(@x % 2 == 0) { ${xf('scale(-1, 1)')} } @match(@y % 2 == 0) { ${xf('scale(1, -1)')} } @match(@x % 2 + @y % 2 == 0) { ${xf('scale(-1, -1)')} }`;

add('Mural', 4, 'One disc spread over four cells: each cell holds a quarter of it, and the quarters meet at the block\'s centre.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('circle(100% at 0 0)')} ${quad} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Fresco', 21, 'A quatrefoil four cells across, drawn a lobe at a time.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('circle(84% at 0 0)')} ${A(`inset: 0; background: ${ink(c)}; ${cp('circle(40% at 0 0)')}`)} ${quad} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Panorama', 38, 'A wide arch spanning the block, the springing points two cells apart.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 100%, 0 100%)')} ${quad} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Frieze', 12, 'A running frieze two cells deep: the upper half of the motif in one row, the lower in the next.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 22%, 100% 0, 100% 78%, 0 100%)')} ${quad} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Tapestry', 46, 'A four-cell rosette woven out of quarter-arcs.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${msk('radial-gradient(circle farthest-side at 0% 0%, #000 0 46%, transparent 46% 68%, #000 68%)')} ${quad} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Arras', 57, 'A hanging cloth: the block reads as one panel with a border round all four sides.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 82%, 82% 82%, 82% 0)')} ${quad} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Hanging', 29, 'A four-cell diamond, each cell carrying one of its corners.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(100% 0, 100% 100%, 0 100%)')} ${A(`inset: 0; background: ${ink(c)}; ${cp('polygon(100% 44%, 100% 100%, 44% 100%)')}`)} ${quad} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Banner', 60, 'A banner hung across the block, its swallowtail cut into the two lower cells.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 100% 62%, 50% 40%, 0 62%)')} ${quad} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Standard', 8, 'A standard: a solid field with a bordure, four cells to the whole thing.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${cp('polygon(0 0, 88% 0, 88% 88%, 0 88%)')}`)} ${A(`inset: 0; background: ${ink(c)}; ${cp('polygon(0 0, 54% 0, 54% 54%, 0 54%)')}`)} ${quad} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Ensign', 33, 'A canton in the corner of a larger field, the field itself four cells across.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 100% 92%, 0 92%)')}`)} ${A(`left: 0; top: 0; width: 46%; height: 46%; background: ${ink(c)};`)} ${quad} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Gonfalon', 62, 'A gonfalon: a hanging with a scalloped foot, assembled from four quarter-panels.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 100% 74%, 0 74%)')} ${A(`left: 0; top: 56%; width: 100%; height: 44%; border-radius: 0 0 999px 0; background: ${ink(c)};`)} ${quad} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Oriflamme', 50, 'A flame-shaped pennon four cells long, its points meeting at the block centre.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 62% 46%, 100% 84%, 0 100%)')} ${quad} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Vexillum', 2, 'A square vexillum with a crossbar, the bar running the full width of the block.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${cp('polygon(0 0, 90% 0, 90% 90%, 0 90%)')}`)} ${A(`left: 0; top: 70%; width: 100%; height: 20%; background: ${ink(c)};`)} ${quad} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Labarum', 65, 'A labarum: a staff and a crossbar meeting at the centre of the block.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 78%; top: 0; width: 22%; height: 100%; background: ${ink(c)};`)} ${A(`left: 0; top: 78%; width: 100%; height: 22%; background: ${ink(c)};`)} ${quad} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Streamer', 41, 'A long streamer tapering across the block, drawn a quarter at a time.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 30%, 100% 6%, 100% 94%, 0 70%)')} ${quad} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Drape', 25, 'Cloth falling in four folds, the folds deepening towards the middle of the block.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 100% 100%, 62% 76%, 24% 92%, 0 74%)')} ${quad} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Curtain', 54, 'A curtain drawn back to the corners: two great arcs meeting at the middle of the block.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${msk('radial-gradient(circle farthest-side at 100% 100%, transparent 62%, #000 62%)')} ${quad} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Valance', 13, 'A valance with a scalloped hem, four cells wide and two deep.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 100% 58%, 0 58%)')} ${A(`left: 0; top: 40%; width: 100%; height: 46%; border-radius: 0 0 100% 0; background: ${ink(c)};`)} ${quad} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Pelmet', 36, 'A pelmet board: a plain box with a stepped lower edge, assembled across the block.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 100% 46%, 66% 46%, 66% 74%, 0 74%)')} ${quad} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Lambrequin', 48, 'A lambrequin: a pointed hanging with a bead at each point.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 100% 52%, 50% 80%, 0 52%)')}`)} ${A(`left: 34%; top: 68%; width: 32%; height: 32%; border-radius: 50%; background: ${ink(c)};`)} ${quad} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Wainscot', 11, 'Panelling: a raised field inside a stile-and-rail frame, the panel four cells across.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${cp('polygon(0 0, 92% 0, 92% 92%, 0 92%)')}`)} ${A(`inset: 0; background: ${ink(c)}; ${cp('polygon(18% 18%, 74% 18%, 74% 74%, 18% 74%)')}`)} ${quad} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Panelling', 63, 'Fielded panels: the bevel round the raised centre reads as a second frame.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 94% 0, 76% 76%, 0 94%)')} ${quad} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Boiserie', 40, 'Carved boiserie: a lobed panel with a moulding following its outline.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${msk('radial-gradient(circle farthest-side at 0% 0%, #000 0 40%, transparent 40% 54%, #000 54% 86%, transparent 86%)')} ${quad} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Marquise', 44, 'A marquise: a pointed oval four cells across, meeting at both ends.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('circle(120% at 0 100%)')} ${A(`inset: 0; background: ${ink(c)}; ${cp('circle(70% at 0 100%)')}`)} ${quad} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Baldachin', 6, 'A canopy over four cells: a dome with a valance hanging from its rim.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${cp('circle(92% at 100% 100%)')}`)} ${A(`left: 0; top: 0; width: 100%; height: 18%; background: ${ink(c)};`)} ${quad} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Tester', 32, 'The flat tester above a bed: a coffered square four cells wide.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp(ringPoly(SQUARE, rectHole(12, 12)))} ${A(`inset: 26%; background: ${ink(c)}; ${cp(ringPoly(SQUARE, rectHole(24, 24)))}`)} ${quad} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Celure', 19, 'A celure: the painted ceiling panel above an altar, laid out as one four-cell star.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 0, 68% 0, 100% 100%, 0 68%)')} ${quad} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Predella', 52, 'The predella under an altarpiece: a low band of panels, two cells deep.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${cp('polygon(0 42%, 100% 42%, 100% 100%, 0 100%)')}`)} ${A(`left: 8%; top: 56%; width: 84%; height: 30%; background: ${ink(c)};`)} ${quad} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

// ════════════════════════════════════════════════════════════════════════════
// C. Interlock — figure and ground both inked, so no background shows through
//    at all and each shape keys into the ones beside it.
// ════════════════════════════════════════════════════════════════════════════

const both = (c, a, b) => `${B(`inset: 0; background: ${ink(c)}; ${cp(a)}`)} ${A(`inset: 0; background: ${ink(c)}; ${cp(b)}`)}`;

add('Tessellate', 5, 'Two halves of the cell, both inked, the seam stepping so neighbouring tiles lock.', (c) => ({
  vars: '',
  rule: `${F} { ${both(c, 'polygon(0 0, 100% 0, 100% 34%, 50% 34%, 50% 66%, 0 66%)', 'polygon(100% 34%, 100% 100%, 0 100%, 0 66%, 50% 66%, 50% 34%)')} }${TR}`,
}), { tg: '5x5' });

add('Interlock', 30, 'A tab on one side and a socket on the other, so the row cannot come apart.', (c) => ({
  vars: '',
  rule: `${F} { ${both(c, 'polygon(0 0, 62% 0, 62% 38%, 84% 50%, 62% 62%, 62% 100%, 0 100%)', 'polygon(62% 0, 100% 0, 100% 100%, 62% 100%, 62% 62%, 84% 50%, 62% 38%)')} }${TR}`,
}), { tg: '5x5' });

add('Dovetail', 43, 'A dovetail joint: the pin widening as it goes, so it cannot be pulled out.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${both(c, 'polygon(0 0, 100% 0, 100% 30%, 66% 42%, 66% 58%, 100% 70%, 100% 100%, 0 100%)', 'polygon(100% 30%, 100% 70%, 66% 58%, 66% 42%)')} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Tenon', 58, 'A tenon standing proud of its shoulder, and the mortice that takes it.', (c) => ({
  vars: '',
  rule: `${F} { ${both(c, 'polygon(0 0, 56% 0, 56% 26%, 88% 26%, 88% 74%, 56% 74%, 56% 100%, 0 100%)', 'polygon(56% 0, 100% 0, 100% 100%, 56% 100%, 56% 74%, 88% 74%, 88% 26%, 56% 26%)')} }${TR}`,
}), { tg: '5x5' });

add('Rebate', 16, 'A rebate: a step cut along one edge so the next board sits into it.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${both(c, 'polygon(0 0, 100% 0, 100% 40%, 40% 40%, 40% 100%, 0 100%)', 'polygon(100% 40%, 100% 100%, 40% 100%, 40% 40%)')} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Halving', 22, 'A halving joint: two members each cut back to half their depth where they cross.', (c) => ({
  vars: '',
  rule: `${F} { ${both(c, 'polygon(0 30%, 100% 30%, 100% 70%, 0 70%)', 'polygon(30% 0, 70% 0, 70% 100%, 30% 100%)')} @even { :after { z-index: 2; } } }${TR}`,
}), { tg: '5x5' });

add('Scarf', 61, 'A scarf joint: a long shallow taper where two lengths are spliced.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${both(c, 'polygon(0 0, 100% 0, 0 100%)', 'polygon(100% 0, 100% 100%, 0 100%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Birdsmouth', 9, 'A birdsmouth: the notch cut into a rafter where it lands on the plate.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${both(c, 'polygon(0 0, 100% 0, 100% 100%, 44% 100%, 44% 56%, 0 56%)', 'polygon(0 56%, 44% 56%, 44% 100%, 0 100%)')} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Crenel', 37, 'The crenel and the merlon it sits between, both inked so the wall reads solid.', (c) => ({
  vars: '',
  rule: `${F} { ${both(c, 'polygon(0 0, 34% 0, 34% 50%, 66% 50%, 66% 0, 100% 0, 100% 100%, 0 100%)', 'polygon(34% 0, 66% 0, 66% 50%, 34% 50%)')} }${TR}`,
}), { tg: '5x5' });

add('Jigsaw', 51, 'A jigsaw cut: a round tab and the socket it drops into.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`inset: 0; background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 100% 100%, 0 100%)')} ${msk('radial-gradient(circle closest-side at 100% 50%, transparent 34%, #000 34%)')}`)} ${A(`left: 66%; top: 34%; width: 34%; height: 32%; border-radius: 50%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Puzzle', 3, 'Four pieces to a cell, each keyed to the next by a small square lug.', (c) => ({
  vars: '',
  rule: `${F} { ${both(c, 'polygon(0 0, 100% 0, 100% 42%, 58% 42%, 58% 100%, 0 100%)', 'polygon(100% 42%, 100% 100%, 58% 100%, 58% 42%)')} @odd { ${xf('rotate(90deg)')} } }${TR}`,
}), { tg: '5x5' });

add('Tangram', 66, 'The seven tangram pieces reduced to the two that matter: a big triangle and the rest.', (c) => ({
  vars: '',
  rule: `${F} { ${both(c, 'polygon(0 0, 100% 0, 50% 50%)', 'polygon(100% 0, 100% 100%, 0 100%, 0 0, 50% 50%)')} ${rot(R4)} }${TR}`,
}), { tg: '5x5' });

add('Pentomino', 24, 'A pentomino and its complement, filling the cell between them.', (c) => ({
  vars: '',
  rule: `${F} { ${both(c, 'polygon(0 0, 60% 0, 60% 20%, 20% 20%, 20% 60%, 60% 60%, 60% 100%, 0 100%)', 'polygon(60% 0, 100% 0, 100% 100%, 60% 100%, 60% 60%, 20% 60%, 20% 20%, 60% 20%)')} ${rot(R4)} }${TR}`,
}), { tg: '5x5' });

add('Polyomino', 47, 'A staircase of squares and the staircase left behind it.', (c) => ({
  vars: '',
  rule: `${F} { ${both(c, 'polygon(0 0, 33% 0, 33% 33%, 67% 33%, 67% 67%, 100% 67%, 100% 100%, 0 100%)', 'polygon(33% 0, 100% 0, 100% 67%, 67% 67%, 67% 33%, 33% 33%)')} ${rot(R4)} }${TR}`,
}), { tg: '5x5' });

add('Tromino', 14, 'Three squares in an L, with the fourth square the other ink.', (c) => ({
  vars: '',
  rule: `${F} { ${both(c, 'polygon(0 0, 50% 0, 50% 50%, 100% 50%, 100% 100%, 0 100%)', 'polygon(50% 0, 100% 0, 100% 50%, 50% 50%)')} ${rot(R4)} }${TR}`,
}), { tg: '5x5' });

add('Tiler', 40, 'A tiler\'s cut: the diagonal seam flipping with the checker so the courses break joint.', (c) => ({
  vars: '',
  rule: `${F} { ${both(c, 'polygon(0 0, 100% 0, 0 100%)', 'polygon(100% 0, 100% 100%, 0 100%)')} @even { ${xf('scaleX(-1)')} } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Nest', 55, 'Shapes nested inside one another, each one a different ink and none of them loose.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${B(`inset: 16%; background: ${ink(c)}; ${cp(poly(DIAMOND))}`)} ${A(`inset: 36%; background: ${ink(c)};`)} }${TR}`,
}), { tg: '5x5' });

add('Pack', 7, 'Circles packed as tight as they go, with the interstices inked too.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${A(`inset: 0; border-radius: 50%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Stow', 34, 'Two rectangles stowed to fill the cell exactly, one upright and one flat.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${both(c, 'polygon(0 0, 100% 0, 100% 38%, 0 38%)', 'polygon(0 38%, 100% 38%, 100% 100%, 0 100%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Enmesh', 62, 'Two combs pushed into each other until the teeth of one fill the gaps of the other.', (c) => ({
  vars: '',
  rule: `${F} { ${both(c, 'polygon(0 0, 100% 0, 100% 22%, 25% 22%, 25% 50%, 100% 50%, 100% 72%, 0 72%)', 'polygon(100% 22%, 100% 50%, 25% 50%, 25% 22%)')} ${rot(R2)} }${TR}`,
}), { tg: '5x5' });

add('Knit', 20, 'A knit stitch and a purl, alternating, both of them yarn.', (c) => ({
  vars: '',
  rule: `${F} { ${both(c, 'polygon(0 0, 50% 0, 50% 100%, 0 100%)', 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)')} border-radius: 40% 40% 0 0; @even { border-radius: 0 0 40% 40%; } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Plait', 49, 'Three strands plaited, the one on top changing every row.', (c) => ({
  vars: '',
  rule: `${F} { ${both(c, 'polygon(0 0, 100% 60%, 100% 100%, 0 40%)', 'polygon(0 60%, 100% 0, 100% 40%, 0 100%)')} @even { :before { z-index: 2; } } }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Splice', 28, 'A splice: two tapers running past each other so the join carries the load.', (c) => ({
  vars: '',
  rule: `${F} { ${both(c, 'polygon(0 0, 100% 0, 70% 50%, 100% 100%, 0 100%, 30% 50%)', 'polygon(100% 0, 100% 100%, 70% 50%)')} ${rot(R2)} }${TR}`,
}), { tg: '5x5' });

add('Keyed', 42, 'A key set into both members, which is what stops them turning.', (c) => ({
  vars: '',
  rule: `${F} { ${both(c, 'polygon(0 0, 100% 0, 100% 40%, 60% 40%, 60% 60%, 100% 60%, 100% 100%, 0 100%)', 'polygon(60% 40%, 100% 40%, 100% 60%, 60% 60%)')} ${rot(R4)} }${TR}`,
}), { tg: '5x5' });

// ════════════════════════════════════════════════════════════════════════════
// D. Counterform — the drawing is the hole. The cell is solid and the motif is
//    cut out of it, so what you read is the shape of what is missing.
// ════════════════════════════════════════════════════════════════════════════

add('Voided', 0, 'A voided square: the middle taken clean out, leaving only the margin.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp(withHole(rectHole('@pick(16, 26, 34)', '@pick(16, 26, 34)')))} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Pierced', 45, 'Pierced with a round hole, the bore rolled from three sizes.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${msk('radial-gradient(circle closest-side at 50% 50%, transparent @pick(20%, 34%, 46%), #000 0)')} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Fenestrate', 18, 'Windowed: four small openings cut where the panes would be.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${msk('radial-gradient(circle closest-side at 50% 50%, transparent 60%, #000 60%) 0 0 / 50% 50%')} }${TR}`,
}), { tg: '5x5' });

add('Perforate', 31, 'A field of small perforations on a square pitch.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${msk('radial-gradient(circle closest-side at 50% 50%, transparent 48%, #000 48%) 0 0 / 25% 25%')} }${TR}`,
}), { tg: '5x5' });

add('Punched', 56, 'Punched with a diamond die, the hole turned a quarter in some cells.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { background: ${ink(c)}; ${cp(withHole(diamondHole(32, 32)))} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Stencil', 10, 'A stencil: the letter-shaped opening, with the bridges left in so it holds together.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${msk('radial-gradient(circle closest-side at 50% 50%, transparent 52%, #000 52%), repeating-linear-gradient(0deg, #000 0 8%, transparent 8% 46%)')} -webkit-mask-composite: source-over; }${TR}`,
}), { tg: '5x5' });

add('Cutout', 39, 'A shape cut right out of the sheet, its edges square and its middle gone.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp(withHole(roundHole('@pick(18, 28, 38)')))} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Openwork', 23, 'Openwork: so much taken out that the ink is down to a lattice.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${msk('repeating-linear-gradient(0deg, #000 0 12%, transparent 12% 50%), repeating-linear-gradient(90deg, #000 0 12%, transparent 12% 50%)')} }${TR}`,
}), { tg: '5x5' });

add('Ajoure', 64, 'Ajouré metalwork: a ring of small holes punched round a larger one.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; -webkit-mask: radial-gradient(circle closest-side at 50% 50%, transparent 26%, #000 26%), repeating-conic-gradient(from 0deg at 50% 50%, #000 0 20deg, transparent 20deg 40deg); mask: radial-gradient(circle closest-side at 50% 50%, transparent 26%, #000 26%), repeating-conic-gradient(from 0deg at 50% 50%, #000 0 20deg, transparent 20deg 40deg); -webkit-mask-composite: source-in; mask-composite: intersect; }${TR}`,
}), { tg: '5x5' });

add('Reticule', 1, 'A reticule: a net of openings with the mesh left just wide enough to hold.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp(ringPoly(SQUARE, diamondHole(42, 42)))} ${A(`inset: 42%; background: ${ink(c)};`)} }${TR}`,
}), { tg: '5x5' });

add('Crib', 53, 'A cribbed panel: a row of upright slots cut through the board.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { background: ${ink(c)}; ${msk('repeating-linear-gradient(90deg, #000 0 9%, transparent 9% 22%)')} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Lacuna', 44, 'A gap in the text: one large opening with the margin still square around it.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp(withHole(rectHole(10, 24)))} }${TR}`,
}), { tg: '5x5' });

add('Interstice', 35, 'The space between: four discs of ink with the interstice open between them.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${msk('radial-gradient(circle closest-side at 50% 50%, #000 78%, transparent 78%) 0 0 / 50% 50%')} }${TR}`,
}), { tg: '5x5' });

add('Vacancy', 59, 'A vacancy in the block: the opening off-centre, so the margin is uneven.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${msk('radial-gradient(circle closest-side at 34% 34%, transparent 42%, #000 42%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Absence', 12, 'The shape is entirely missing: only the corners of the cell are still inked.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${msk('radial-gradient(circle closest-side at 50% 50%, transparent 72%, #000 72%)')} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Hollow', 48, 'Hollowed out: a thick wall with nothing inside it.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp(ringPoly(SQUARE, roundHole(34)))} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Cavity', 5, 'A cavity opening down the sheet: the same hole, larger in every row.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${msk(`radial-gradient(circle closest-side at 50% 50%, transparent ${ramp(10, 74, RY)}, #000 0)`)} }${TR}`,
}), { tg: '6x6' });

add('Recess', 29, 'A recess with a square shoulder: two steps down into the block.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${cp(ringPoly(SQUARE, rectHole(20, 20)))}`)} ${A(`inset: 20%; background: ${ink(c)}; ${cp(ringPoly(SQUARE, rectHole(24, 24)))}`)} }${TR}`,
}), { tg: '5x5' });

add('Alcove', 67, 'An alcove: an arched opening cut into a solid wall.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 100% 100%, 72% 100%, 72% 40%, 28% 40%, 28% 100%, 0 100%)')} ${msk('radial-gradient(circle closest-side at 50% 40%, transparent 24%, #000 24%)')} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Niche', 15, 'A niche with a shell head: a round-topped opening in a plain field.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; -webkit-mask: linear-gradient(#000 0 0), radial-gradient(circle closest-side at 50% 46%, #000 40%, transparent 40%); mask: linear-gradient(#000 0 0), radial-gradient(circle closest-side at 50% 46%, #000 40%, transparent 40%); -webkit-mask-composite: xor; mask-composite: exclude; }${TR}`,
}), { tg: '5x5' });

// ════════════════════════════════════════════════════════════════════════════
// E. Stacks — layered plates, offset from one another. No projection and no
//    shading: the depth comes from nothing but the offset and the order the
//    plates are painted in.
// ════════════════════════════════════════════════════════════════════════════

const plates = (c, dx, dy, w = 66) =>
  `${B(`left: 6%; top: 6%; width: ${w}%; height: ${w}%; background: ${ink(c)};`)} ${A(`left: ${6 + dx}%; top: ${6 + dy}%; width: ${w}%; height: ${w}%; background: ${ink(c)};`)}`;

add('Stack', 3, 'Two plates, the upper one set back and to the side, so the pair reads as a stack.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${plates(c, 22, 22)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Ply', 41, 'Three plies with the grain of each one at right angles to the last.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 6%; background: ${ink(c)}; ${slotMask('0deg', '9%', '18%')}`)} ${A(`inset: 22%; background: ${ink(c)}; ${slotMask('90deg', '9%', '18%')}`)} }${TR}`,
}), { tg: '5x5' });

add('Laminate', 65, 'A laminate seen edge on: bands of different thickness pressed together.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { background: ${ink(c)}; ${msk('repeating-linear-gradient(0deg, #000 0 14%, transparent 14% 18%, #000 18% 36%, transparent 36% 40%)')} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Veneer', 56, 'A thin veneer laid over a thicker ground, its edge just visible.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 4%; background: ${ink(c)};`)} ${A(`inset: 12% 12% 20% 20%; background: ${ink(c)};`)} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Bedding', 24, 'Bedding planes: horizontal courses of unequal depth, the way sediment actually lies.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${msk('repeating-linear-gradient(0deg, #000 0 7%, transparent 7% 11%, #000 11% 26%, transparent 26% 30%, #000 30% 38%, transparent 38% 44%)')} }${TR}`,
}), { tg: '5x5' });

add('Course', 50, 'Courses of brick with the perpends staggered, each course its own ink.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 2%; top: 6%; width: 96%; height: 40%; background: ${ink(c)};`)} ${A(`left: 2%; top: 54%; width: 96%; height: 40%; background: ${ink(c)}; ${xf('translateX(26%)')}`)} }${TR}`,
}), { tg: '5x5' });

add('Tier', 8, 'Three tiers, each one stepped back from the one below.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`left: 0; bottom: 0; width: 100%; height: 34%; background: ${ink(c)};`)} ${A(`left: 14%; bottom: 34%; width: 72%; height: 34%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Layer', 33, 'Two layers, the top one turned a few degrees off the bottom.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 10%; background: ${ink(c)};`)} ${A(`inset: 10%; background: ${ink(c)}; ${rot('@pick(-16deg, -8deg, 8deg, 16deg)')} opacity: 0.85;`)} }${TR}`,
}), { tg: '5x5' });

add('Overlay', 62, 'An overlay that runs off the cell, so the layer above is bigger than the one below.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`inset: 22%; background: ${ink(c)};`)} ${A(`left: 34%; top: 34%; width: 76%; height: 76%; background: ${ink(c)}; opacity: 0.9;`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Underlay', 11, 'The layer underneath showing at one corner only, the way a badly aligned print does.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`inset: 4% 20% 20% 4%; background: ${ink(c)};`)} ${A(`inset: 18% 6% 6% 18%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Sandwich', 44, 'A sandwich: two skins with a core between them, the core the odd one out.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${B(`left: 0; top: 8%; width: 100%; height: 22%; background: ${ink(c)}; box-shadow: 0 ${u(22)} 0 ${ink(c)};`)} ${A(`left: 0; top: 40%; width: 100%; height: 20%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5', min: 30 });

add('Wafer', 29, 'Wafer-thin layers: many of them, and all the same.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { background: ${ink(c)}; ${msk('repeating-linear-gradient(0deg, #000 0 5%, transparent 5% 9%)')} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Shim', 65, 'A shim: a thin packing piece driven in at one edge.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`inset: 12% 6% 30% 6%; background: ${ink(c)};`)} ${A(`inset: 0; background: ${ink(c)}; ${cp('polygon(4% 76%, 96% 84%, 96% 92%, 4% 92%)')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Spacer', 20, 'Spacers between two plates, so the gap is deliberate rather than a mistake.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 4%; top: 8%; width: 92%; height: 26%; background: ${ink(c)}; box-shadow: 0 ${u(30)} 0 ${ink(c)};`)} ${A(`left: 16%; top: 40%; width: 14%; height: 22%; background: ${ink(c)}; box-shadow: ${u(34)} 0 0 ${ink(c)};`)} }${TR}`,
}), { tg: '5x5', min: 30 });

add('Packing', 46, 'Packing pieces of graded thickness, stacked up until the space is filled.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${msk('repeating-linear-gradient(0deg, #000 0 4%, transparent 4% 8%, #000 8% 16%, transparent 16% 21%, #000 21% 34%, transparent 34% 40%)')} }${TR}`,
}), { tg: '5x5' });

add('Stratify', 2, 'Strata tilted a few degrees, so the layers run out of the cell rather than across it.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`inset: -14%; background: ${ink(c)}; ${msk('repeating-linear-gradient(8deg, #000 0 8%, transparent 8% 16%)')}`)} }${TR}`,
}), { tg: '5x5' });

add('Deposit', 37, 'Deposits laid down thickest at the bottom and thinning as they build.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${msk('repeating-linear-gradient(180deg, #000 0 4%, transparent 4% 7%, #000 7% 16%, transparent 16% 21%, #000 21% 38%, transparent 38% 46%)')} }${TR}`,
}), { tg: '5x5' });

add('Accrete', 59, 'Accretion round a nucleus: a core with two shells grown on it.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 4%; border-radius: 50%; background: ${ink(c)}; ${ringMask('76%')}`)} ${A(`inset: 26%; border-radius: 50%; background: ${ink(c)}; ${ringMask('56%')}`)} }${TR}`,
}), { tg: '5x5' });

add('Sediment', 13, 'Fine layers settling out, closer together the further down they go.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${msk('repeating-linear-gradient(0deg, #000 0 3%, transparent 3% 6%, #000 6% 12%, transparent 12% 18%, #000 18% 30%, transparent 30% 42%)')} }${TR}`,
}), { tg: '5x5' });

add('Varve', 54, 'Varves: paired light and dark layers, one pair for each year.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${msk('repeating-linear-gradient(0deg, #000 0 6%, transparent 6% 20%)')}`)} ${A(`inset: 0; background: ${ink(c)}; ${msk('repeating-linear-gradient(0deg, transparent 0 10%, #000 10% 15%, transparent 15% 20%)')}`)} }${TR}`,
}), { tg: '5x5' });

// ════════════════════════════════════════════════════════════════════════════
// F. Chains — links that run out of one cell and into the next, so the row is
//    continuous rather than a set of separate marks.
// ════════════════════════════════════════════════════════════════════════════

add('Chain', 1, 'Oval links running edge to edge, each one overlapping its neighbours.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${A(`left: -20%; top: 22%; width: 140%; height: 56%; border-radius: 999px; background: ${ink(c)}; ${ringMask('72%')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Link', 34, 'A single link with its two neighbours cut by the cell edge.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${B(`left: 4%; top: 18%; width: 92%; height: 64%; border-radius: 999px; background: ${ink(c)}; ${ringMask('66%')}`)} ${A(`left: -46%; top: 18%; width: 92%; height: 64%; border-radius: 999px; background: ${ink(c)}; ${ringMask('66%')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Shackle', 19, 'A shackle: a U of steel closed by a pin across the mouth.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`inset: 8% 14% 24% 14%; border-radius: 999px 999px 0 0; background: ${ink(c)}; ${ringMask('66%')}`)} ${A(`left: 10%; top: 72%; width: 80%; height: 12%; border-radius: 999px; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Swivel', 52, 'A swivel: two eyes on a common axis, one able to turn against the other.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`left: 4%; top: 26%; width: 46%; height: 48%; border-radius: 50%; background: ${ink(c)}; ${ringMask('58%')}`)} ${A(`left: 46%; top: 20%; width: 50%; height: 60%; border-radius: 50%; background: ${ink(c)}; ${ringMask('62%')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Carabiner', 7, 'A carabiner: a closed loop with a gate across one side of it.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`inset: 6%; border-radius: 40%; background: ${ink(c)}; ${ringMask('68%')}`)} ${A(`left: 6%; top: 44%; width: 88%; height: 10%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Hasp', 40, 'A hasp: a slotted plate dropped over a staple.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`left: 6%; top: 30%; width: 62%; height: 40%; border-radius: 999px 0 0 999px; background: ${ink(c)}; ${cp(withHole(rectHole(30, 34)))}`)} ${A(`left: 58%; top: 22%; width: 36%; height: 56%; border-radius: 0 999px 999px 0; background: ${ink(c)}; ${ringMask('54%')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Staple', 53, 'A staple driven into the board, both legs showing.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(14% 16%, 86% 16%, 86% 88%, 68% 88%, 68% 36%, 32% 36%, 32% 88%, 14% 88%)')} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Eyebolt', 61, 'An eyebolt: a ring forged on the end of a shank.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`left: 24%; top: 4%; width: 52%; height: 52%; border-radius: 50%; background: ${ink(c)}; ${ringMask('58%')}`)} ${A(`left: 42%; top: 48%; width: 16%; height: 48%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Clevis', 48, 'A clevis: a forked end with the pin through both cheeks.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`inset: 0; background: ${ink(c)}; ${cp('polygon(10% 12%, 90% 12%, 90% 34%, 44% 34%, 44% 66%, 90% 66%, 90% 88%, 10% 88%)')}`)} ${A(`left: 62%; top: 38%; width: 24%; height: 24%; border-radius: 50%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Turnbuckle', 31, 'A turnbuckle: a barrel with a threaded eye at each end.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${B(`left: 22%; top: 30%; width: 56%; height: 40%; border-radius: 24%; background: ${ink(c)}; ${cp(withHole(rectHole(24, 26)))}`)} ${A(`left: 0; top: 40%; width: 100%; height: 20%; background: ${ink(c)}; ${msk('linear-gradient(90deg, #000 0 22%, transparent 22% 78%, #000 78%)')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Sprag', 30, 'A sprag: the wedge dropped in to stop a wheel turning back.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`inset: 8%; border-radius: 50%; background: ${ink(c)}; ${ringMask('72%')}`)} ${A(`left: 44%; top: 0; width: 20%; height: 56%; background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 60% 100%, 40% 100%)')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Coupling', 57, 'A coupling: two collars butted together with a flange between them.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${B(`left: 4%; top: 24%; width: 92%; height: 52%; background: ${ink(c)}; ${msk('linear-gradient(90deg, #000 0 42%, transparent 42% 58%, #000 58%)')}`)} ${A(`left: 40%; top: 10%; width: 20%; height: 80%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Knuckle', 4, 'The knuckle of a hinge: three interleaved barrels on one pin.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${B(`left: 6%; top: 34%; width: 88%; height: 32%; border-radius: 999px; background: ${ink(c)}; ${msk('repeating-linear-gradient(90deg, #000 0 26%, transparent 26% 34%)')}`)} ${A(`left: 0; top: 44%; width: 100%; height: 12%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Pintle', 43, 'A pintle: the pin the gudgeon turns on, drawn with its collar.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`left: 42%; top: 6%; width: 16%; height: 88%; background: ${ink(c)};`)} ${A(`left: 26%; top: 38%; width: 48%; height: 18%; border-radius: 999px; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Gudgeon', 21, 'The gudgeon that takes it: a strap with an eye at one end.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`left: 30%; top: 30%; width: 66%; height: 40%; background: ${ink(c)};`)} ${A(`left: 4%; top: 24%; width: 52%; height: 52%; border-radius: 50%; background: ${ink(c)}; ${ringMask('52%')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Bight', 63, 'A bight: the loop in the middle of a rope, neither end involved.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`left: 18%; top: 6%; width: 64%; height: 64%; border-radius: 50%; background: ${ink(c)}; ${ringMask('64%')}`)} ${A(`left: 18%; top: 54%; width: 64%; height: 46%; background: ${ink(c)}; ${msk('linear-gradient(90deg, #000 0 22%, transparent 22% 78%, #000 78%)')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Hitch', 9, 'A hitch: the standing part with two turns taken round it.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${B(`left: 0; top: 40%; width: 100%; height: 20%; background: ${ink(c)};`)} ${A(`left: 24%; top: 10%; width: 52%; height: 80%; border-radius: 999px; background: ${ink(c)}; ${ringMask('62%')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Lashing', 36, 'A lashing: turns of cord binding two spars where they cross.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${cp('polygon(0 40%, 100% 40%, 100% 60%, 0 60%)')}`)} ${A(`left: 26%; top: 26%; width: 48%; height: 48%; background: ${ink(c)}; ${msk('repeating-linear-gradient(90deg, #000 0 22%, transparent 22% 34%)')}`)} @even { :before { ${cp('polygon(40% 0, 60% 0, 60% 100%, 40% 100%)')} } } }${TR}`,
}), { tg: '5x5' });

add('Seizing', 51, 'A seizing: a tight binding round two parts of the same rope.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${B(`left: 0; top: 28%; width: 100%; height: 16%; background: ${ink(c)}; box-shadow: 0 ${u(18)} 0 ${ink(c)};`)} ${A(`left: 32%; top: 16%; width: 36%; height: 68%; background: ${ink(c)}; ${msk('repeating-linear-gradient(0deg, #000 0 18%, transparent 18% 30%)')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5', min: 30 });

add('Whipping', 25, 'A whipping on the end of a rope, the turns laid touching.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`left: 34%; top: 0; width: 32%; height: 100%; background: ${ink(c)};`)} ${A(`left: 22%; top: 34%; width: 56%; height: 44%; background: ${ink(c)}; ${msk('repeating-linear-gradient(0deg, #000 0 22%, transparent 22% 34%)')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

// ════════════════════════════════════════════════════════════════════════════
// G. Corners — everything anchored at a corner of the cell rather than in the
//    middle of it, so the drawing happens where four cells meet.
// ════════════════════════════════════════════════════════════════════════════

add('Quoin', 50, 'Quoins: the dressed stones that turn the corner of a building, alternating long and short.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`left: 0; top: 0; width: 62%; height: 30%; background: ${ink(c)};`)} ${A(`left: 0; top: 30%; width: 34%; height: 30%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Angle', 45, 'An angle iron seen end on: two legs meeting square at the corner.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 100% 26%, 26% 26%, 26% 100%, 0 100%)')} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Knee', 22, 'A knee brace: the corner stiffened by a piece across the angle.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`inset: 0; background: ${ink(c)}; ${cp('polygon(0 0, 22% 0, 22% 78%, 100% 78%, 100% 100%, 0 100%)')}`)} ${A(`inset: 0; background: ${ink(c)}; ${cp('polygon(22% 42%, 62% 78%, 22% 78%)')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Haunch', 58, 'The haunch of an arch: the corner filled with a curve rather than a bracket.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 100% 100%, 0 100%)')} ${msk('radial-gradient(circle farthest-side at 100% 100%, transparent 74%, #000 74%)')} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Mitre', 12, 'A mitred corner: both members cut at forty-five degrees so the joint is invisible.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`inset: 0; background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 74% 26%, 26% 26%, 26% 100%, 0 100%)')}`)} ${A(`inset: 0; background: ${ink(c)}; ${cp('polygon(74% 26%, 100% 0, 100% 22%)')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Bullnose', 39, 'A bullnose: the corner rounded right off to a half-round.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; border-radius: 100% 0 0 0; ${A(`left: 0; top: 0; width: 34%; height: 34%; border-radius: 100% 0 0 0; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Arris', 66, 'The arris: the sharp edge where two faces meet, taken off with a small chamfer.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(26% 0, 100% 0, 100% 100%, 0 100%, 0 26%)')} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Nosing', 6, 'A stair nosing: the rounded lip that projects past the riser.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`left: 0; top: 30%; width: 100%; height: 70%; background: ${ink(c)};`)} ${A(`left: 0; top: 22%; width: 88%; height: 22%; border-radius: 0 999px 999px 0; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Reveal', 31, 'The reveal of an opening: the corner set back so the depth of the wall shows.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`inset: 0; background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 100% 20%, 20% 20%, 20% 100%, 0 100%)')}`)} ${A(`left: 20%; top: 20%; width: 26%; height: 26%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Intrados', 53, 'The intrados: the inner face of an arch, drawn as a quarter of its curve.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${msk('radial-gradient(circle farthest-side at 0% 100%, transparent 56%, #000 56% 92%, transparent 92%)')} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Extrados', 18, 'The extrados: the outer face, drawn as the wider curve outside it.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${msk('radial-gradient(circle farthest-side at 0% 100%, #000 0 40%, transparent 40% 64%, #000 64%)')} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Springing', 47, 'The springing point: where the curve leaves the vertical, marked by a block.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`inset: 0; background: ${ink(c)}; ${msk('radial-gradient(circle farthest-side at 0% 100%, transparent 62%, #000 62% 88%, transparent 88%)')}`)} ${A(`left: 0; top: 62%; width: 40%; height: 18%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Abutment', 27, 'An abutment: the mass at the end of the arch that takes the thrust.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(0 0, 46% 0, 68% 44%, 100% 100%, 0 100%)')} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Pier', 60, 'A pier standing at the corner, with a cap and a base to it.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`left: 22%; top: 12%; width: 56%; height: 76%; background: ${ink(c)};`)} ${A(`left: 8%; top: 0; width: 84%; height: 16%; background: ${ink(c)}; box-shadow: 0 ${u(46)} 0 ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5', min: 30 });

add('Buttress', 14, 'A buttress: a stepped mass leaning against the wall it holds up.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { background: ${ink(c)}; ${cp('polygon(0 0, 30% 0, 30% 34%, 56% 34%, 56% 66%, 82% 66%, 82% 100%, 0 100%)')} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Pilaster', 42, 'A pilaster: a flat column set against the corner, fluted down its face.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`left: 8%; top: 0; width: 34%; height: 100%; background: ${ink(c)}; ${slotMask('90deg', '18%', '30%')}`)} ${A(`left: 0; top: 0; width: 50%; height: 12%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Antae', 55, 'Antae: the thickened ends of a wall, treated as if they were columns.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${B(`left: 0; top: 8%; width: 22%; height: 84%; background: ${ink(c)}; box-shadow: ${u(52)} 0 0 ${ink(c)};`)} ${A(`left: 0; top: 8%; width: 100%; height: 14%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5', min: 30 });

add('Console', 8, 'A console bracket: a scrolled corner support with a plate on top of it.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`left: 0; top: 0; width: 100%; height: 18%; background: ${ink(c)};`)} ${A(`left: 12%; top: 18%; width: 52%; height: 62%; border-radius: 0 0 999px 0; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Modillion', 35, 'Modillions: small brackets repeating under a cornice, one to a cell.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 0; top: 0; width: 100%; height: 22%; background: ${ink(c)};`)} ${A(`left: 30%; top: 22%; width: 40%; height: 44%; background: ${ink(c)}; ${cp('polygon(0 0, 100% 0, 70% 100%, 30% 100%)')}`)} }${TR}`,
}), { tg: '5x5' });

add('Cantilever', 49, 'A cantilever: a beam carried at one end only, with nothing under its tip.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`left: 0; top: 0; width: 22%; height: 100%; background: ${ink(c)};`)} ${A(`left: 0; top: 32%; width: 96%; height: 20%; background: ${ink(c)}; ${cp('polygon(0 0, 100% 24%, 100% 76%, 0 100%)')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Truss', 23, 'A truss: a top chord, a bottom chord and the diagonal between them.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${B(`left: 0; top: 8%; width: 100%; height: 12%; background: ${ink(c)}; box-shadow: 0 ${u(46)} 0 ${ink(c)};`)} ${A(`inset: 0; background: ${ink(c)}; ${cp('polygon(4% 20%, 20% 20%, 96% 80%, 80% 80%)')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5', min: 30 });

add('Strut', 64, 'A strut in compression, jammed between two faces of the corner.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`inset: 0; background: ${ink(c)}; ${cp('polygon(0 0, 18% 0, 18% 82%, 100% 82%, 100% 100%, 0 100%)')}`)} ${A(`inset: 0; background: ${ink(c)}; ${cp('polygon(18% 34%, 32% 22%, 88% 82%, 70% 82%)')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Brace', 10, 'A pair of braces crossing at the corner, each one taking the load one way.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`inset: 0; background: ${ink(c)}; ${cp('polygon(0 8%, 14% 0, 100% 84%, 86% 100%)')}`)} ${A(`inset: 0; background: ${ink(c)}; ${cp('polygon(0 84%, 14% 100%, 100% 16%, 86% 0)')} opacity: 0.85;`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Purlin', 32, 'Purlins running across the rafters, notched where they cross.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 0; top: 30%; width: 100%; height: 16%; background: ${ink(c)}; box-shadow: 0 ${u(26)} 0 ${ink(c)};`)} ${A(`left: 36%; top: 0; width: 20%; height: 100%; background: ${ink(c)};`)} }${TR}`,
}), { tg: '5x5', min: 30 });

// ════════════════════════════════════════════════════════════════════════════
// H. Bands — mouldings and banding run across the sheet. The whole vocabulary
//    of a moulded edge, one profile per design.
// ════════════════════════════════════════════════════════════════════════════

const bandOf = (c, tops) =>
  tops.map(([t, h], i) => (i === 0
    ? B(`left: 0; top: ${t}%; width: 100%; height: ${h}%; background: ${ink(c)};`)
    : A(`left: 0; top: ${t}%; width: 100%; height: ${h}%; background: ${ink(c)};`))).join(' ');

add('Band', 2, 'One plain band across the cell, its position rolled from three heights.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${A(`left: 0; top: @pick(12%, 40%, 68%); width: 100%; height: 22%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Stripe', 38, 'Two stripes of unequal width, the narrow one always below the wide.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${bandOf(c, [[10, 30], [56, 12]])} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Ribbon', 16, 'A ribbon with a fold in it: the band steps to a new height halfway across.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { background: ${ink(c)}; ${cp('polygon(0 22%, 50% 22%, 50% 52%, 100% 52%, 100% 78%, 50% 78%, 50% 48%, 0 48%)')} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Tape', 51, 'Tape laid across the cell with the end torn square.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${A(`left: 0; top: 34%; width: @pick(62%, 82%, 100%); height: 30%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Strap', 29, 'A strap with a keeper round it, the keeper narrower than the strap.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${B(`left: 0; top: 32%; width: 100%; height: 34%; background: ${ink(c)};`)} ${A(`left: 60%; top: 22%; width: 16%; height: 54%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Belt', 44, 'A belt and its buckle, the buckle a plain open square.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${B(`left: 0; top: 38%; width: 100%; height: 24%; background: ${ink(c)};`)} ${A(`left: 24%; top: 26%; width: 34%; height: 48%; background: ${ink(c)}; ${cp(withHole(rectHole(26, 22)))}`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Girdle', 5, 'A girdle: a wide band with a narrow one riding on top of it.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${bandOf(c, [[30, 40], [40, 12]])} ${rot('@var(--rot)')} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Cincture', 61, 'A cincture: the small fillet that separates a shaft from its capital.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${bandOf(c, [[14, 8], [26, 60]])} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Baldric', 20, 'A baldric worn across the body: one broad diagonal band.', (c) => ({
  vars: '',
  rule: `${F} { background: ${ink(c)}; ${cp('polygon(0 22%, 40% 0, 100% 62%, 60% 100%)')} @even { ${xf('scaleX(-1)')} } }${TR}`,
}), { tg: '5x5' });

add('Bandolier', 46, 'A bandolier: the same diagonal, with the loops for the cartridges on it.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`inset: 0; background: ${ink(c)}; ${cp('polygon(0 26%, 34% 0, 100% 58%, 66% 100%)')}`)} ${A(`inset: 0; background: ${ink(c)}; ${cp('polygon(0 26%, 34% 0, 100% 58%, 66% 100%)')} ${msk('repeating-linear-gradient(48deg, #000 0 8%, transparent 8% 20%)')}`)} }${TR}`,
}), { tg: '5x5' });

add('Cummerbund', 11, 'A cummerbund: a deep pleated band round the middle of the cell.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${A(`left: 0; top: 24%; width: 100%; height: 52%; background: ${ink(c)}; ${msk('repeating-linear-gradient(0deg, #000 0 9%, transparent 9% 12%)')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Waistband', 34, 'A waistband with a topstitched edge above and below.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${B(`left: 0; top: 30%; width: 100%; height: 40%; background: ${ink(c)};`)} ${A(`left: 0; top: 34%; width: 100%; height: 32%; background: ${ink(c)}; ${msk('repeating-linear-gradient(90deg, #000 0 8%, transparent 8% 16%), linear-gradient(0deg, #000 0 12%, transparent 12% 88%, #000 88%)')} -webkit-mask-composite: source-in; mask-composite: intersect;`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Reeding', 57, 'Reeding: convex half-rounds run side by side, the opposite of fluting.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${A(`inset: 0; background: ${ink(c)}; ${msk('repeating-linear-gradient(90deg, #000 0 16%, transparent 16% 20%)')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Fluting', 25, 'Fluting: concave channels cut into the face, with a fillet between each pair.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { background: ${ink(c)}; ${msk('repeating-linear-gradient(90deg, #000 0 9%, transparent 9% 18%)')} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Gadroon', 40, 'Gadrooning: a band of short convex lobes, leaning off the vertical.', (c) => ({
  vars: '',
  rule: `${F} { ${A(`left: 0; top: 24%; width: 100%; height: 52%; background: ${ink(c)}; ${msk('repeating-radial-gradient(circle closest-side at 50% 50%, #000 0 46%, transparent 46% 50%) 0 0 / 16.6% 100%')} ${rot('@pick(-12deg, 0deg, 12deg)')}`)} }${TR}`,
}), { tg: '5x5' });

add('Bead', 56, 'A bead moulding: a row of half-round beads run along the edge.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${A(`left: 0; top: 62%; width: 100%; height: 30%; background: ${ink(c)}; ${msk('radial-gradient(circle closest-side at 50% 50%, #000 92%, transparent 92%) 0 0 / 20% 100%')}`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Cyma', 52, 'A cyma: the double curve, concave above and convex below.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${B(`left: 0; top: 8%; width: 100%; height: 44%; background: ${ink(c)}; border-radius: 0 0 100% 0;`)} ${A(`left: 0; top: 52%; width: 100%; height: 40%; background: ${ink(c)}; border-radius: 100% 0 0 0;`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Talon', 18, 'The talon, or ogee reversed: convex above and concave below.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${B(`left: 0; top: 8%; width: 100%; height: 44%; background: ${ink(c)}; border-radius: 0 100% 0 0;`)} ${A(`left: 0; top: 52%; width: 100%; height: 40%; background: ${ink(c)}; border-radius: 0 0 0 100%;`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Conge', 63, 'A congé: the small hollow that runs a shaft out into its base.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`left: 20%; top: 0; width: 60%; height: 68%; background: ${ink(c)};`)} ${A(`left: 8%; top: 56%; width: 84%; height: 36%; background: ${ink(c)}; border-radius: 100% 100% 0 0;`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Apophyge', 30, 'An apophyge: the flare where the shaft leaves the fillet, taken both ways.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${B(`left: 26%; top: 0; width: 48%; height: 100%; background: ${ink(c)};`)} ${A(`left: 4%; top: 34%; width: 92%; height: 32%; background: ${ink(c)}; border-radius: 100%;`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Echinus', 7, 'The echinus: the cushion under the abacus, drawn as a flattened quarter-round.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`left: 0; top: 8%; width: 100%; height: 16%; background: ${ink(c)};`)} ${A(`left: 10%; top: 24%; width: 80%; height: 42%; background: ${ink(c)}; border-radius: 100% 100% 0 0;`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Tondino', 43, 'A tondino: a small disc set on a band, repeating along it.', (c) => ({
  vars: '',
  rule: `--rot: ${R2}; ${F} { ${B(`left: 0; top: 40%; width: 100%; height: 20%; background: ${ink(c)};`)} ${A(`left: 30%; top: 26%; width: 40%; height: 48%; border-radius: 50%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Ledge', 59, 'A ledge with a drip beneath it, so the water leaves the wall.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 0; top: 26%; width: 100%; height: 26%; background: ${ink(c)};`)} ${A(`left: 8%; top: 58%; width: 84%; height: 10%; background: ${ink(c)};`)} }${TR}`,
}), { tg: '5x5' });

add('Stringcourse', 13, 'A stringcourse: a projecting band run right across the elevation.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 0; top: 34%; width: 100%; height: 18%; background: ${ink(c)};`)} ${A(`left: 0; top: 52%; width: 100%; height: 8%; background: ${ink(c)}; ${msk('repeating-linear-gradient(90deg, #000 0 40%, transparent 40% 50%)')}`)} }${TR}`,
}), { tg: '5x5' });

add('Socle', 36, 'A socle: the plain block a column or a statue stands on.', (c) => ({
  vars: '',
  rule: `--rot: ${R4}; ${F} { ${B(`left: 6%; bottom: 6%; width: 88%; height: 30%; background: ${ink(c)};`)} ${A(`left: 22%; bottom: 36%; width: 56%; height: 50%; background: ${ink(c)};`)} ${rot('@var(--rot)')} }${TR}`,
}), { tg: '5x5' });

add('Orlo', 48, 'An orlo: the plinth band under a column, with a fillet on top of it.', (c) => ({
  vars: '',
  rule: `${F} { ${bandOf(c, [[62, 26], [52, 8]])} }${TR}`,
}), { grid: '8x12', tg: '6x6' });

add('Zocalo', 21, 'A zócalo: the tiled dado round the foot of a wall, banded top and bottom.', (c) => ({
  vars: '',
  rule: `${F} { ${B(`left: 0; top: 40%; width: 100%; height: 46%; background: ${ink(c)}; ${msk('repeating-linear-gradient(90deg, #000 0 16%, transparent 16% 20%)')}`)} ${A(`left: 0; top: 30%; width: 100%; height: 8%; background: ${ink(c)}; box-shadow: 0 ${u(48)} 0 ${ink(c)};`)} }${TR}`,
}), { tg: '5x5', min: 30 });

add('Surbase', 54, 'A surbase: the moulding at the head of a dado, drawn as three graded bands.', (c) => ({
  vars: '',
  rule: `${F} { ${bandOf(c, [[24, 10], [40, 22]])} ${A(`box-shadow: 0 ${u(30)} 0 ${ink(c)};`)} }${TR}`,
}), { tg: '5x5', min: 30 });

const EXPECTED = Number(process.env.BATCH10_EXPECTED ?? 200);
if (all.length !== EXPECTED) {
  throw new Error(`batch 10 must hold exactly ${EXPECTED} designs, found ${all.length}`);
}

export const batch10 = all;
