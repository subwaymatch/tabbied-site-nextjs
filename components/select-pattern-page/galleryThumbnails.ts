// Per-pattern settings for the live css-doodle gallery thumbnails. Palettes
// and densities were derived from the raster thumbnails these replaced (since
// deleted); `color0` is always the background. Each
// thumbnail draws with a fresh random seed on every load, so only the look
// (palette / density / render size) is pinned here, not the placement.
import type { OptionValue } from 'tabbied';

export type ThumbnailConfig = {
  /** Palette override (color0 = background). Falls back to the pattern palette. */
  palette?: string[];
  /** Option overrides keyed by option id (grid / frequency / toggles). */
  options?: Record<string, OptionValue>;
  /**
   * Internal render size in px. The doodle is drawn at this resolution and then
   * scaled to fit the (square) card, so fixed-px features (border widths,
   * shadows) keep the proportions of the original 800px pattern. Defaults to
   * 800 x 800. `cropTop` keeps only the top fraction of the render (Symmetry
   * shows just its top half).
   */
  render?: { width: number; height: number; cropTop?: number };
};

export const galleryThumbnails: Record<string, ThumbnailConfig> = {
  radius: {
    palette: ['#3E8BFF', '#3B3F45', '#3FFFB2', '#3EECFF', '#97F4FF', '#FF3D8B'],
    // Frequency is high enough that a random seed virtually always paints
    // multiple cells (the e2e smoke test counts painted cells on this design).
    options: { grid: '4x4', frequency: 0.5 },
  },
  mixtape: {
    palette: ['#80FBB8', '#232529', '#4D8CF7', '#4D8CF7', '#3E8BFF', '#232529'],
    options: { grid: '3x3', frequency: 0.34 },
  },
  odessa: {
    palette: ['#1B4075', '#3EECFF', '#D89FFF', '#3E8BFF', '#3FFFB2'],
    options: { grid: '4x4', frequency: 0.6 },
  },
  symmetry: {
    palette: ['#97F4FF', '#97F4FF', '#00FFF3', '#00A1FF', '#FF8DFF', '#FF007E'],
    options: { circularity: 1 },
    // Crop a hair above the horizon (0.5) so the top edge of the mirrored
    // pink shapes — which sit exactly on the 50% line — stays out of frame.
    render: { width: 800, height: 1200, cropTop: 0.48 },
  },
  veil: {
    palette: ['#9EFFD8', '#3E8BFF', '#326DC9', '#1B4075', '#3EECFF', '#3E8BFF'],
    options: { grid: '8x8', frequency: 0.42 },
  },
  blossom: {
    palette: ['#367DE6', '#3EECFF', '#3FFFB2', '#FF3D8B', '#3FFFB2', '#FF3D8B'],
    options: { grid: '3x3', frequency: 0.6 },
  },
  disque: {
    palette: ['#3EECFF', '#232529', '#1B4075', '#FF3D8B', '#E9F1FF', '#367DE6'],
    options: { grid: '4x4', frequency: 0.55 },
  },
  bloks: {
    palette: ['#3FFFB2', '#ECFFEC', '#9EFFD8', '#ECFFEC', '#9EFFD8', '#FFFFFF'],
    options: { grid: '3x3', frequency: 1, shadow: true },
  },
  terrain: {
    palette: ['#232529', '#3E434B', '#3E8BFF', '#3FFFB2', '#275AA6', '#3EECFF'],
    options: { grid: '4x4', frequency: 0.85 },
    // Shape size is a fixed px formula (÷ column count); rendering smaller makes
    // the shapes read large against the card, matching the bold original.
    render: { width: 360, height: 360 },
  },
  trigram: {
    palette: ['#275AA6', '#3E8BFF', '#3EECFF', '#97F4FF', '#FFFFFF'],
    options: { grid: '4x4', frequency: 0.5, roundedCorners: true },
  },
  ring: {
    // Muted maroon rings (color1/color2) over the dark offset crescent
    // (color3) — matching the soft, tonal rings of the original.
    palette: ['#FF3D8B', '#C9447A', '#A33261', '#232529'],
    options: { grid: '3x3', frequency: 0.75 },
  },
  maze: {
    palette: ['#E9F1FF', '#232529', '#3E8BFF', '#FF3D8B', '#3FFFB2', '#3EECFF'],
    options: { grid: '7x7', frequency: 0.95, thickness: 9 },
  },
  pinwheel: {
    palette: ['#232529', '#3E8BFF', '#3EECFF', '#FF3D8B', '#3FFFB2', '#F5DD32'],
    options: { grid: '3x3', frequency: 0.9 },
  },
  confetti: {
    options: { grid: '4x4', frequency: 0.95 },
  },
  foliage: {
    palette: ['#ECFFEC', '#3FFFB2', '#3E8BFF', '#9EFFD8', '#FF3D8B', '#F5DD32'],
    options: { grid: '4x4', frequency: 0.9 },
  },
  metro: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  polka: {
    options: { grid: '4x4', frequency: 0.85 },
  },
  stitch: {
    palette: ['#9EFFD8', '#FF3D8B', '#3E8BFF', '#1B4075', '#232529', '#F5DD32'],
    options: { grid: '4x4', frequency: 0.8 },
  },
  weave: {
    options: { grid: '4x4', frequency: 0.75 },
  },
  ziggy: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  pebble: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  sparkle: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  vitrail: {
    options: { grid: '4x4', frequency: 0.92 },
  },
  tesserae: {
    options: { grid: '6x6', frequency: 0.92 },
  },
  sprinkles: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  glyph: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  wander: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  comet: {
    options: { grid: '4x4', frequency: 0.85 },
  },
  ziggurat: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  curl: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  baste: {
    options: { grid: '7x7', frequency: 0.9 },
  },
  prisma: {
    options: { grid: '6x6', frequency: 0.92 },
  },
  crescendo: {
    options: { grid: '6x6' },
  },
  echo: {
    options: { rings: 6 },
  },
  circuit: {
    options: { grid: '8x8', frequency: 0.6 },
  },
  shard: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  quilt: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  petal: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  lantern: {
    options: { grid: '4x4', frequency: 0.85 },
  },
  plasma: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  ivy: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  neon: {
    options: { grid: '5x5', frequency: 0.8 },
  },
  bokeh: {
    options: { grid: '4x4', frequency: 0.85 },
  },
  argyle: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  bauhaus: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  halftone: {
    options: { grid: '7x7', frequency: 0.95 },
  },
  elbow: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  bento: {
    options: { grid: '4x4', frequency: 0.95 },
  },
  grain: {
    options: { grid: '8x8', frequency: 0.95 },
  },
  misprint: {
    options: { grid: '4x4', frequency: 0.92 },
  },
  origami: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  gable: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  pleat: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  gingham: {
    options: { grid: '6x6', frequency: 0.9 },
  },
  trellis: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  posy: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  meadow: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  cairn: {
    options: { grid: '4x4', frequency: 0.85 },
  },
  lily: {
    options: { grid: '4x4', frequency: 0.85 },
  },
  ripple: {
    options: { grid: '4x4', frequency: 0.8 },
  },
  aurora: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  orbit: {
    options: { grid: '4x4', frequency: 0.85 },
  },
  constellation: {
    options: { grid: '6x6', frequency: 0.8 },
  },
  memphis: {
    options: { grid: '5x5', frequency: 0.5 },
  },
  glitch: {
    options: { grid: '5x5', frequency: 0.8 },
  },
  barcode: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  postage: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  kilim: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  azulejo: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  shoji: {
    options: { grid: '6x6', frequency: 0.4 },
  },
  mudcloth: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  gumball: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  jelly: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  balloon: {
    options: { grid: '4x4', frequency: 0.85 },
  },
  tetro: {
    options: { grid: '5x5', frequency: 0.8 },
  },
  notch: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  strata: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  pendulum: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  radar: {
    options: { grid: '5x5', frequency: 0.85 },
  },
  voltage: {
    options: { grid: '5x5', frequency: 0.6 },
  },
  koi: {
    options: { grid: '4x4', frequency: 0.8 },
  },
  bramble: {
    options: { grid: '5x5', frequency: 0.85 },
  },
  drizzle: {
    options: { grid: '6x6', frequency: 0.85 },
  },
  cumulus: {
    options: { grid: '4x4', frequency: 0.8 },
  },
  rainbow: {
    options: { grid: '4x4', frequency: 0.85 },
  },
  arcade: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  facade: {
    options: { grid: '6x6', frequency: 0.9 },
  },
  dial: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  levels: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  citrus: {
    options: { grid: '4x4', frequency: 0.85 },
  },
  sash: {
    options: { grid: '5x5', frequency: 0.8 },
  },
  wash: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  kintsugi: {
    options: { grid: '5x5', frequency: 0.7 },
  },
  enso: {
    options: { grid: '4x4', frequency: 0.8 },
  },
  bunting: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  sprout: {
    options: { grid: '5x5', frequency: 0.85 },
  },
  links: {
    options: { grid: '5x5', frequency: 0.85 },
  },
  regatta: {
    options: { grid: '4x4', frequency: 0.8 },
  },
  massif: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  abacus: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  hatch: {
    options: { grid: '6x6', frequency: 0.85 },
  },
  crater: {
    options: { grid: '5x5', frequency: 0.85 },
  },
  monolith: {
    options: { grid: '5x5', frequency: 0.8 },
  },
  basalt: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  cog: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  inkblot: {
    options: { grid: '4x4', frequency: 0.85 },
  },
  checkers: {
    options: { grid: '6x6', frequency: 0.5 },
  },
  hopscotch: {
    options: { grid: '5x5', frequency: 0.8 },
  },
  shibori: {
    options: { grid: '4x4', frequency: 0.85 },
  },
  button: {
    options: { grid: '5x5', frequency: 0.85 },
  },
  bowtie: {
    options: { grid: '5x5', frequency: 0.85 },
  },
  medusa: {
    options: { grid: '4x4', frequency: 0.8 },
  },
  coral: {
    options: { grid: '5x5', frequency: 0.85 },
  },
  stella: {
    options: { grid: '5x5', frequency: 0.75 },
  },
  ladybird: {
    options: { grid: '5x5', frequency: 0.7 },
  },
  flutter: {
    options: { grid: '5x5', frequency: 0.8 },
  },
  sonata: {
    options: { grid: '6x6', frequency: 0.8 },
  },
  chime: {
    options: { grid: '5x5', frequency: 0.85 },
  },
  cirrus: {
    options: { grid: '6x6', frequency: 0.85 },
  },
  meridian: {
    options: { grid: '5x5', frequency: 0.85 },
  },
  pulsar: {
    options: { grid: '5x5', frequency: 0.7 },
  },
  signal: {
    options: { grid: '5x5', frequency: 0.8 },
  },
  laundry: {
    options: { grid: '5x5', frequency: 0.85 },
  },
  amphora: {
    options: { grid: '5x5', frequency: 0.85 },
  },
  saguaro: {
    options: { grid: '5x5', frequency: 0.85 },
  },
  seigaiha: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  impasto: {
    options: { grid: '5x5', frequency: 0.85 },
  },
  patina: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  sine: {
    options: { grid: '6x6', frequency: 0.9 },
  },
  gem: {
    options: { grid: '5x5', frequency: 0.8 },
  },
  macaron: {
    options: { grid: '5x5', frequency: 0.85 },
  },
  shelf: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  rake: {
    options: { grid: '6x6', frequency: 0.95 },
  },
  matchstick: {
    options: { grid: '5x5', frequency: 0.85 },
  },
  incense: {
    options: { grid: '5x5', frequency: 0.8 },
  },
  splat: {
    options: { grid: '4x4', frequency: 0.8 },
  },
  popsicle: {
    options: { grid: '5x5', frequency: 0.8 },
  },
  paisley: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  buoy: {
    options: { grid: '5x5', frequency: 0.8 },
  },
  sigil: {
    options: { grid: '5x5', frequency: 0.75 },
  },
  bubbles: {
    options: { grid: '5x5', frequency: 0.85 },
  },
  bee: {
    options: { grid: '5x5', frequency: 0.7 },
  },
  mirror: {
    options: { grid: '5x5', frequency: 0.85 },
  },
  pompom: {
    options: { grid: '5x5', frequency: 0.85 },
  },
  windowpane: {
    options: { grid: '6x6', frequency: 0.9 },
  },
  spectrum: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  coil: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  hourglass: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  northstar: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  bracket: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  merlon: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  spiralblock: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  pennantbox: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  rungs: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  picket: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  lattice: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  caltrop: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  switchback: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  battlement: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  facetgrad: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  prismfold: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  quaver: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  bowl: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  cinch: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  loophole: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  quoit: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  lobe: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  dogtooth: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  sail: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  cleat: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  octagon: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  diadem: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  spark: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  sliver: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  ell: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  chamfer: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  notchblock: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  frond: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  wavelet: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  bobbin: {
    options: { grid: '5x5', frequency: 0.95 },
  },
  quarterfall: {
    options: { grid: '4x4', frequency: 1, shadow: false },
  },
  cornerbite: {
    options: { grid: '5x5', frequency: 1 },
  },
  chip: {
    options: { grid: '6x6', frequency: 1 },
  },
  shatter: {
    options: { grid: '5x5', frequency: 1 },
  },
  scramble: {
    options: { grid: '5x5', frequency: 1 },
  },
  cascade: {
    options: { grid: '5x5', frequency: 1 },
  },
  skewblock: {
    options: { grid: '8x8', frequency: 1 },
  },
  drift: {
    options: { grid: '8x8', frequency: 1 },
  },
  cupola: {
    options: { grid: '5x5', frequency: 1, shadow: true },
  },
  lagoon: {
    options: { grid: '4x4', frequency: 1 },
  },
  scotia: {
    options: { grid: '5x5', frequency: 1 },
  },
  spandrel: {
    options: { grid: '5x5', frequency: 1 },
  },
  mullion: {
    options: { grid: '5x5', frequency: 1 },
  },
  cavetto: {
    options: { grid: '6x6', frequency: 1 },
  },
  moire: {
    options: { grid: '4x4', frequency: 1 },
  },
  schist: {
    options: { grid: '5x5', frequency: 1 },
  },
  kern: {
    options: { grid: '5x5', frequency: 1 },
  },
  quire: {
    options: { grid: '5x5', frequency: 1 },
  },
  karst: {
    options: { grid: '5x5', frequency: 1 },
  },
  miura: {
    options: { grid: '6x6', frequency: 1 },
  },
  waterbomb: {
    options: { grid: '5x5', frequency: 1 },
  },
  crease: {
    options: { grid: '6x6', frequency: 1 },
  },
  keyway: {
    options: { grid: '4x4', frequency: 1 },
  },
  gasket: {
    options: { grid: '4x4', frequency: 1 },
  },
  evolute: {
    options: { grid: '5x5', frequency: 1 },
  },
  linocut: {
    options: { grid: '5x5', frequency: 1 },
  },
  drypoint: {
    options: { grid: '5x5', frequency: 1 },
  },
  gravure: {
    options: { grid: '5x5', frequency: 1 },
  },
  parity: {
    options: { grid: '6x6', frequency: 1 },
  },
  hilbert: {
    options: { grid: '6x6', frequency: 1 },
  },
  hairpin: {
    options: { grid: '5x5', frequency: 1 },
  },
  matryoshka: {
    options: { grid: '5x5', frequency: 1 },
  },
  fractal: {
    options: { grid: '5x5', frequency: 1 },
  },
  subdivide: {
    options: { grid: '6x6', frequency: 1 },
  },
  epicentre: {
    options: { grid: '6x6', frequency: 1 },
  },
  locus: {
    options: { grid: '6x6', frequency: 1 },
  },
  pole: {
    options: { grid: '6x6', frequency: 1 },
  },
  vertex: {
    options: { grid: '6x6', frequency: 1 },
  },
  apex: {
    options: { grid: '6x6', frequency: 1 },
  },
  hub: {
    options: { grid: '6x6', frequency: 1 },
  },
  axle: {
    options: { grid: '6x6', frequency: 1 },
  },
  pivot: {
    options: { grid: '6x6', frequency: 1 },
  },
  fulcrum: {
    options: { grid: '6x6', frequency: 1 },
  },
  centroid: {
    options: { grid: '6x6', frequency: 1 },
  },
  barycentre: {
    options: { grid: '6x6', frequency: 1 },
  },
  nucleus: {
    options: { grid: '6x6', frequency: 1 },
  },
  kernel: {
    options: { grid: '6x6', frequency: 1 },
  },
  hearth: {
    options: { grid: '6x6', frequency: 1 },
  },
  caldera: {
    options: { grid: '6x6', frequency: 1 },
  },
  sinkhole: {
    options: { grid: '6x6', frequency: 1 },
  },
  wellhead: {
    options: { grid: '6x6', frequency: 1 },
  },
  wellspring: {
    options: { grid: '6x6', frequency: 1 },
  },
  radiant: {
    options: { grid: '6x6', frequency: 1 },
  },
  bullseye: {
    options: { grid: '6x6', frequency: 1 },
  },
  cynosure: {
    options: { grid: '6x6', frequency: 1 },
  },
  omphalos: {
    options: { grid: '6x6', frequency: 1 },
  },
  navel: {
    options: { grid: '6x6', frequency: 1 },
  },
  axis: {
    options: { grid: '6x6', frequency: 1 },
  },
  vector: {
    options: { grid: '6x6', frequency: 1 },
  },
  flux: {
    options: { grid: '6x6', frequency: 1 },
  },
  divergent: {
    options: { grid: '6x6', frequency: 1 },
  },
  streamline: {
    options: { grid: '8x8', frequency: 1 },
  },
  gyre: {
    options: { grid: '6x6', frequency: 1 },
  },
  maelstrom: {
    options: { grid: '6x6', frequency: 1 },
  },
  cyclone: {
    options: { grid: '6x6', frequency: 1 },
  },
  swirl: {
    options: { grid: '6x6', frequency: 1 },
  },
  torque: {
    options: { grid: '6x6', frequency: 1 },
  },
  moment: {
    options: { grid: '6x6', frequency: 1 },
  },
  spin: {
    options: { grid: '6x6', frequency: 1 },
  },
  precession: {
    options: { grid: '6x6', frequency: 1 },
  },
  nutation: {
    options: { grid: '6x6', frequency: 1 },
  },
  gimbal: {
    options: { grid: '5x5', frequency: 1 },
  },
  lodestone: {
    options: { grid: '6x6', frequency: 1 },
  },
  dipole: {
    options: { grid: '6x6', frequency: 1 },
  },
  solenoid: {
    options: { grid: '6x6', frequency: 1 },
  },
  curlicue: {
    options: { grid: '6x6', frequency: 1 },
  },
  spindrift: {
    options: { grid: '6x6', frequency: 1 },
  },
  windrose: {
    options: { grid: '6x6', frequency: 1 },
  },
  gradation: {
    options: { grid: '6x6', frequency: 1 },
  },
  attenuate: {
    options: { grid: '6x6', frequency: 1 },
  },
  ramp: {
    options: { grid: '6x6', frequency: 1 },
  },
  slope: {
    options: { grid: '6x6', frequency: 1 },
  },
  incline: {
    options: { grid: '6x6', frequency: 1 },
  },
  grade: {
    options: { grid: '6x6', frequency: 1 },
  },
  cant: {
    options: { grid: '6x6', frequency: 1 },
  },
  camber: {
    options: { grid: '6x6', frequency: 1 },
  },
  batter: {
    options: { grid: '6x6', frequency: 1 },
  },
  splay: {
    options: { grid: '6x6', frequency: 1 },
  },
  flare: {
    options: { grid: '6x6', frequency: 1 },
  },
  diminish: {
    options: { grid: '6x6', frequency: 1 },
  },
  augment: {
    options: { grid: '6x6', frequency: 1 },
  },
  lapse: {
    options: { grid: '6x6', frequency: 1 },
  },
  decline: {
    options: { grid: '6x6', frequency: 1 },
  },
  ascendant: {
    options: { grid: '6x6', frequency: 1 },
  },
  descent: {
    options: { grid: '6x6', frequency: 1 },
  },
  graduate: {
    options: { grid: '6x6', frequency: 1 },
  },
  progress: {
    options: { grid: '6x6', frequency: 1 },
  },
  sequence: {
    options: { grid: '6x6', frequency: 1 },
  },
  interval: {
    options: { grid: '6x6', frequency: 1 },
  },
  octave: {
    options: { grid: '6x6', frequency: 1 },
  },
  tessitura: {
    options: { grid: '6x6', frequency: 1 },
  },
  ambit: {
    options: { grid: '6x6', frequency: 1 },
  },
  wedge: {
    options: { grid: '5x5', frequency: 1 },
  },
  gore: {
    options: { grid: '6x6', frequency: 1 },
  },
  gusset: {
    options: { grid: '5x5', frequency: 1 },
  },
  segment: {
    options: { grid: '5x5', frequency: 1 },
  },
  slice: {
    options: { grid: '6x6', frequency: 1 },
  },
  parasol: {
    options: { grid: '5x5', frequency: 1 },
  },
  umbrella: {
    options: { grid: '5x5', frequency: 1 },
  },
  canopy: {
    options: { grid: '5x5', frequency: 1 },
  },
  marquee: {
    options: { grid: '5x5', frequency: 1 },
  },
  pavilion: {
    options: { grid: '5x5', frequency: 1 },
  },
  turbine: {
    options: { grid: '6x6', frequency: 1 },
  },
  impeller: {
    options: { grid: '5x5', frequency: 1 },
  },
  propeller: {
    options: { grid: '5x5', frequency: 1 },
  },
  vane: {
    options: { grid: '6x6', frequency: 1 },
  },
  blade: {
    options: { grid: '5x5', frequency: 1 },
  },
  rotor: {
    options: { grid: '5x5', frequency: 1 },
  },
  stator: {
    options: { grid: '5x5', frequency: 1 },
  },
  nozzle: {
    options: { grid: '6x6', frequency: 1 },
  },
  escapement: {
    options: { grid: '5x5', frequency: 1 },
  },
  sundial: {
    options: { grid: '6x6', frequency: 1 },
  },
  chrono: {
    options: { grid: '4x4', frequency: 1 },
  },
  flabellum: {
    options: { grid: '5x5', frequency: 1 },
  },
  whirligig: {
    options: { grid: '5x5', frequency: 1 },
  },
  radial: {
    options: { grid: '5x5', frequency: 1 },
  },
  outline: {
    options: { grid: '5x5', frequency: 1 },
  },
  sketch: {
    options: { grid: '5x5', frequency: 1 },
  },
  cartoon: {
    options: { grid: '5x5', frequency: 1 },
  },
  underdraw: {
    options: { grid: '5x5', frequency: 1 },
  },
  pounce: {
    options: { grid: '5x5', frequency: 1 },
  },
  silverpoint: {
    options: { grid: '5x5', frequency: 1 },
  },
  graphite: {
    options: { grid: '5x5', frequency: 1 },
  },
  charcoal: {
    options: { grid: '5x5', frequency: 1 },
  },
  sanguine: {
    options: { grid: '5x5', frequency: 1 },
  },
  scribe: {
    options: { grid: '5x5', frequency: 1 },
  },
  stylus: {
    options: { grid: '5x5', frequency: 1 },
  },
  nib: {
    options: { grid: '5x5', frequency: 1 },
  },
  quill: {
    options: { grid: '5x5', frequency: 1 },
  },
  reedpen: {
    options: { grid: '5x5', frequency: 1 },
  },
  armature: {
    options: { grid: '5x5', frequency: 1 },
  },
  skeleton: {
    options: { grid: '5x5', frequency: 1 },
  },
  catenary: {
    options: { grid: '5x5', frequency: 1 },
  },
  parabola: {
    options: { grid: '5x5', frequency: 1 },
  },
  hyperbola: {
    options: { grid: '5x5', frequency: 1 },
  },
  serpentine: {
    options: { grid: '5x5', frequency: 1 },
  },
  sinuous: {
    options: { grid: '5x5', frequency: 1 },
  },
  filament: {
    options: { grid: '5x5', frequency: 1 },
  },
  whisker: {
    options: { grid: '5x5', frequency: 1 },
  },
  bilateral: {
    options: { grid: '6x6', frequency: 1 },
  },
  chiral: {
    options: { grid: '6x6', frequency: 1 },
  },
  enantiomer: {
    options: { grid: '6x6', frequency: 1 },
  },
  reflect: {
    options: { grid: '6x6', frequency: 1 },
  },
  specular: {
    options: { grid: '6x6', frequency: 1 },
  },
  pierglass: {
    options: { grid: '6x6', frequency: 1 },
  },
  diptych: {
    options: { grid: '6x6', frequency: 1 },
  },
  triptych: {
    options: { grid: '6x6', frequency: 1 },
  },
  polyptych: {
    options: { grid: '6x6', frequency: 1 },
  },
  hinge: {
    options: { grid: '6x6', frequency: 1 },
  },
  butterfly: {
    options: { grid: '6x6', frequency: 1 },
  },
  rorschach: {
    options: { grid: '6x6', frequency: 1 },
  },
  kaleido: {
    options: { grid: '6x6', frequency: 1 },
  },
  palindrome: {
    options: { grid: '6x6', frequency: 1 },
  },
  axial: {
    options: { grid: '6x6', frequency: 1 },
  },
  dihedral: {
    options: { grid: '6x6', frequency: 1 },
  },
  glide: {
    options: { grid: '6x6', frequency: 1 },
  },
  symmetral: {
    options: { grid: '6x6', frequency: 1 },
  },
  foldback: {
    options: { grid: '6x6', frequency: 1 },
  },
  counterpart: {
    options: { grid: '6x6', frequency: 1 },
  },
  vanish: {
    options: { grid: '6x6', frequency: 1 },
  },
  horizon: {
    options: { grid: '6x6', frequency: 1 },
  },
  foreshorten: {
    options: { grid: '6x6', frequency: 1 },
  },
  ortho: {
    options: { grid: '6x6', frequency: 1 },
  },
  isometry: {
    options: { grid: '5x5', frequency: 1 },
  },
  axonometry: {
    options: { grid: '6x6', frequency: 1 },
  },
  oblique: {
    options: { grid: '6x6', frequency: 1 },
  },
  cavalier: {
    options: { grid: '5x5', frequency: 1 },
  },
  cabinet: {
    options: { grid: '5x5', frequency: 1 },
  },
  dimetric: {
    options: { grid: '5x5', frequency: 1 },
  },
  trimetric: {
    options: { grid: '6x6', frequency: 1 },
  },
  anamorph: {
    options: { grid: '6x6', frequency: 1 },
  },
  stereo: {
    options: { grid: '6x6', frequency: 1 },
  },
  recession: {
    options: { grid: '6x6', frequency: 1 },
  },
  station: {
    options: { grid: '6x6', frequency: 1 },
  },
  pictureplane: {
    options: { grid: '6x6', frequency: 1 },
  },
  groundline: {
    options: { grid: '6x6', frequency: 1 },
  },
  frustum: {
    options: { grid: '6x6', frequency: 1 },
  },
  converge: {
    options: { grid: '6x6', frequency: 1 },
  },
  raking: {
    options: { grid: '6x6', frequency: 1 },
  },
  beat: {
    options: { grid: '4x4', frequency: 1 },
  },
  fringe: {
    options: { grid: '4x4', frequency: 1 },
  },
  nodal: {
    options: { grid: '6x6', frequency: 1 },
  },
  antinode: {
    options: { grid: '6x6', frequency: 1 },
  },
  standing: {
    options: { grid: '6x6', frequency: 1 },
  },
  superpose: {
    options: { grid: '4x4', frequency: 1 },
  },
  phaseshift: {
    options: { grid: '6x6', frequency: 1 },
  },
  alias: {
    options: { grid: '6x6', frequency: 1 },
  },
  dither: {
    options: { grid: '6x6', frequency: 1 },
  },
  bayer: {
    options: { grid: '6x6', frequency: 1 },
  },
  swell: {
    options: { grid: '6x6', frequency: 1 },
  },
  undulate: {
    options: { grid: '6x6', frequency: 1 },
  },
  oscillate: {
    options: { grid: '6x6', frequency: 1 },
  },
  pulsate: {
    options: { grid: '6x6', frequency: 1 },
  },
  throb: {
    options: { grid: '6x6', frequency: 1 },
  },
  shimmer: {
    options: { grid: '6x6', frequency: 1 },
  },
  chatter: {
    options: { grid: '6x6', frequency: 1 },
  },
  judder: {
    options: { grid: '6x6', frequency: 1 },
  },
  warble: {
    options: { grid: '6x6', frequency: 1 },
  },
  tremble: {
    options: { grid: '6x6', frequency: 1 },
  },
  hairline: {
    options: { grid: '6x6', frequency: 1 },
  },
  thickset: {
    options: { grid: '6x6', frequency: 1 },
  },
  boldface: {
    options: { grid: '6x6', frequency: 1 },
  },
  lightface: {
    options: { grid: '6x6', frequency: 1 },
  },
  demibold: {
    options: { grid: '6x6', frequency: 1 },
  },
  condensed: {
    options: { grid: '6x6', frequency: 1 },
  },
  extended: {
    options: { grid: '6x6', frequency: 1 },
  },
  expanded: {
    options: { grid: '6x6', frequency: 1 },
  },
  roman: {
    options: { grid: '6x6', frequency: 1 },
  },
  linework: {
    options: { grid: '6x6', frequency: 1 },
  },
  mount: {
    options: { grid: '6x6', frequency: 1 },
  },
  edging: {
    options: { grid: '6x6', frequency: 1 },
  },
  piping: {
    options: { grid: '6x6', frequency: 1 },
  },
  binding: {
    options: { grid: '6x6', frequency: 1 },
  },
  hem: {
    options: { grid: '6x6', frequency: 1 },
  },
  welt: {
    options: { grid: '6x6', frequency: 1 },
  },
  cord: {
    options: { grid: '6x6', frequency: 1 },
  },
  soutache: {
    options: { grid: '6x6', frequency: 1 },
  },
  galloon: {
    options: { grid: '6x6', frequency: 1 },
  },
  passement: {
    options: { grid: '6x6', frequency: 1 },
  },
  kerb: {
    options: { grid: '6x6', frequency: 1 },
  },
  skirting: {
    options: { grid: '6x6', frequency: 1 },
  },
  architrave: {
    options: { grid: '6x6', frequency: 1 },
  },
  dado: {
    options: { grid: '6x6', frequency: 1 },
  },
  sunray: {
    options: { grid: '5x5', frequency: 1 },
  },
  spray: {
    options: { grid: '5x5', frequency: 1 },
  },
  frieze: {
    options: { grid: '6x6', frequency: 1 },
  },
  plait: {
    options: { grid: '6x6', frequency: 1 },
  },
  fenestrate: {
    options: { grid: '5x5', frequency: 1 },
  },
  perforate: {
    options: { grid: '5x5', frequency: 1 },
  },
  chain: {
    options: { grid: '5x5', frequency: 1 },
  },
  staple: {
    options: { grid: '5x5', frequency: 1 },
  },
  haunch: {
    options: { grid: '5x5', frequency: 1 },
  },
  arris: {
    options: { grid: '6x6', frequency: 1 },
  },
  abutment: {
    options: { grid: '5x5', frequency: 1 },
  },
  reeding: {
    options: { grid: '5x5', frequency: 1 },
  },
  fluting: {
    options: { grid: '5x5', frequency: 1 },
  },
  ridgeline: {
    options: { grid: '5x5', frequency: 1 },
  },
  thirdstop: {
    options: { grid: '5x5', frequency: 1 },
  },
  swapcut: {
    options: { grid: '5x5', frequency: 1 },
  },
  seamband: {
    options: { grid: '5x5', frequency: 1 },
  },
  halfmast: {
    options: { grid: '5x5', frequency: 1 },
  },
  notchcut: {
    options: { grid: '5x5', frequency: 1 },
  },
  corduroy: {
    options: { grid: '5x5', frequency: 1 },
  },
  ribline: {
    options: { grid: '5x5', frequency: 1 },
  },
  blindfold: {
    options: { grid: '5x5', frequency: 1 },
  },
  beamspread: {
    options: { grid: '5x5', frequency: 1 },
  },
  protractor: {
    options: { grid: '5x5', frequency: 1 },
  },
  rimband: {
    options: { grid: '5x5', frequency: 1 },
  },
  bangle: {
    options: { grid: '5x5', frequency: 1 },
  },
  ripplering: {
    options: { grid: '5x5', frequency: 1 },
  },
  tidering: {
    options: { grid: '5x5', frequency: 1 },
  },
  cornercut: {
    options: { grid: '5x5', frequency: 1 },
  },
  clipcorner: {
    options: { grid: '5x5', frequency: 1 },
  },
  bevelset: {
    options: { grid: '5x5', frequency: 1 },
  },
  mitre: {
    options: { grid: '5x5', frequency: 1 },
  },
  skewback: {
    options: { grid: '5x5', frequency: 1 },
  },
  nosing: {
    options: { grid: '5x5', frequency: 1 },
  },
  housing: {
    options: { grid: '5x5', frequency: 1 },
  },
  halving: {
    options: { grid: '5x5', frequency: 1 },
  },
  birdsmouth: {
    options: { grid: '5x5', frequency: 1 },
  },
  chase: {
    options: { grid: '5x5', frequency: 1 },
  },
  stylobate: {
    options: { grid: '5x5', frequency: 1 },
  },
  dieblock: {
    options: { grid: '5x5', frequency: 1 },
  },
  mutule: {
    options: { grid: '5x5', frequency: 1 },
  },
  modillion: {
    options: { grid: '5x5', frequency: 1 },
  },
  lobeform: {
    options: { grid: '5x5', frequency: 1 },
  },
  petalcut: {
    options: { grid: '5x5', frequency: 1 },
  },
  doublebar: {
    options: { grid: '5x5', frequency: 1 },
  },
  slashbar: {
    options: { grid: '5x5', frequency: 1 },
  },
  gnomonwedge: {
    options: { grid: '5x5', frequency: 1 },
  },
  quoinwedge: {
    options: { grid: '5x5', frequency: 1 },
  },
  speckfield: {
    options: { grid: '5x5', frequency: 1 },
  },
  dotfield: {
    options: { grid: '5x5', frequency: 1 },
  },
  pindot: {
    options: { grid: '5x5', frequency: 1 },
  },
  polkadot: {
    options: { grid: '5x5', frequency: 1 },
  },
  grainfield: {
    options: { grid: '5x5', frequency: 1 },
  },
  sandfield: {
    options: { grid: '5x5', frequency: 1 },
  },
  dotmatrix: {
    options: { grid: '5x5', frequency: 1 },
  },
  fanned: {
    options: { grid: '5x5', frequency: 1 },
  },
  bothways: {
    options: { grid: '5x5', frequency: 1 },
  },
  meetpart: {
    options: { grid: '5x5', frequency: 1 },
  },
  shearpair: {
    options: { grid: '5x5', frequency: 1 },
  },
  softedge: {
    options: { grid: '5x5', frequency: 1 },
  },
  falloff: {
    options: { grid: '5x5', frequency: 1 },
  },
  dimmer: {
    options: { grid: '5x5', frequency: 1 },
  },
  fadein: {
    options: { grid: '5x5', frequency: 1 },
  },
  tinting: {
    options: { grid: '5x5', frequency: 1 },
  },
  shading: {
    options: { grid: '5x5', frequency: 1 },
  },
  toning: {
    options: { grid: '5x5', frequency: 1 },
  },
  glazing: {
    options: { grid: '5x5', frequency: 1 },
  },
  scumble: {
    options: { grid: '5x5', frequency: 1 },
  },
  gloaming: {
    options: { grid: '5x5', frequency: 1 },
  },
  rolloff: {
    options: { grid: '5x5', frequency: 1 },
  },
  decay: {
    options: { grid: '5x5', frequency: 1 },
  },
  subside: {
    options: { grid: '5x5', frequency: 1 },
  },
  tailoff: {
    options: { grid: '5x5', frequency: 1 },
  },
  stipplefade: {
    options: { grid: '5x5', frequency: 1 },
  },
  dotfade: {
    options: { grid: '5x5', frequency: 1 },
  },
  grainfall: {
    options: { grid: '5x5', frequency: 1 },
  },
  spraydown: {
    options: { grid: '5x5', frequency: 1 },
  },
  dustfall: {
    options: { grid: '5x5', frequency: 1 },
  },
  dotdrift: {
    options: { grid: '5x5', frequency: 1 },
  },
  peppering: {
    options: { grid: '5x5', frequency: 1 },
  },
  dotwash: {
    options: { grid: '5x5', frequency: 1 },
  },
  drybrush: {
    options: { grid: '5x5', frequency: 1 },
  },
  streaking: {
    options: { grid: '5x5', frequency: 1 },
  },
  radiance: {
    options: { grid: '5x5', frequency: 1 },
  },
  fadedwedge: {
    options: { grid: '5x5', frequency: 1 },
  },
  fadedbar: {
    options: { grid: '5x5', frequency: 1 },
  },
  stepramp: {
    options: { grid: '5x5', frequency: 1 },
  },
  twohalf: {
    options: { grid: '5x5', frequency: 1 },
  },
  sheared: {
    options: { grid: '5x5', frequency: 1 },
  },
  snipcorner: {
    options: { grid: '5x5', frequency: 1 },
  },
  angleoff: {
    options: { grid: '5x5', frequency: 1 },
  },
  cornerchip: {
    options: { grid: '5x5', frequency: 1 },
  },
  ringfield: {
    options: { grid: '5x5', frequency: 1 },
  },
  dotset: {
    options: { grid: '5x5', frequency: 1 },
  },
  gritfield: {
    options: { grid: '5x5', frequency: 1 },
  },
  overbar: {
    options: { grid: '5x5', frequency: 1 },
  },
  bothcut: {
    options: { grid: '5x5', frequency: 1 },
  },
  roundcut: {
    options: { grid: '5x5', frequency: 1 },
  },
  roundpair: {
    options: { grid: '5x5', frequency: 1 },
  },
  roundstep: {
    options: { grid: '5x5', frequency: 1 },
  },
};
