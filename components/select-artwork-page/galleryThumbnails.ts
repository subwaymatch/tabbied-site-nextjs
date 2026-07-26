// Per-artwork settings for the live css-doodle gallery thumbnails. Palettes
// and densities were derived from the original raster thumbnails
// (public/images/thumb_*.png); `color0` is always the background. Each
// thumbnail draws with a fresh random seed on every load, so only the look
// (palette / density / render size) is pinned here, not the placement.
import type { OptionValue } from 'tabbied';

export type ThumbnailConfig = {
  /** Palette override (color0 = background). Falls back to the artwork palette. */
  palette?: string[];
  /** Option overrides keyed by option id (grid / frequency / toggles). */
  options?: Record<string, OptionValue>;
  /**
   * Internal render size in px. The doodle is drawn at this resolution and then
   * scaled to fit the (square) card, so fixed-px features (border widths,
   * shadows) keep the proportions of the original 800px artwork. Defaults to
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
  morse: {
    options: { grid: '5x5', frequency: 0.9 },
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
  daybreak: {
    options: { rays: 48 },
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
  domino: {
    options: { grid: '5x5', frequency: 0.95 },
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
  shuffle: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  aster: {
    options: { grid: '5x5', frequency: 0.9 },
  },
  aperture: {
    options: { grid: '5x5', frequency: 0.92 },
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
  zipper: {
    options: { grid: '6x6', frequency: 0.95 },
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
  awning: {
    options: { grid: '6x6', frequency: 0.95 },
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
  polaroid: {
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
  carousel: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  windowpane: {
    options: { grid: '6x6', frequency: 0.9 },
  },
  matte: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  spectrum: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  coil: {
    options: { grid: '4x4', frequency: 0.9 },
  },
  lens: {
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
  ibeam: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  spiralblock: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  tictac: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  pennantbox: {
    options: { grid: '5x5', frequency: 0.92 },
  },
  crosshatch: {
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
  sawedge: {
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
  cardioid: {
    options: { grid: '5x5', frequency: 1 },
  },
  limacon: {
    options: { grid: '5x5', frequency: 1 },
  },
  nephroid: {
    options: { grid: '5x5', frequency: 1 },
  },
  deltoid: {
    options: { grid: '5x5', frequency: 1 },
  },
  astroid: {
    options: { grid: '5x5', frequency: 1 },
  },
  lemniscate: {
    options: { grid: '5x5', frequency: 1 },
  },
  trifolium: {
    options: { grid: '5x5', frequency: 1 },
  },
  quadrifolium: {
    options: { grid: '5x5', frequency: 1 },
  },
  bifolium: {
    options: { grid: '5x5', frequency: 1 },
  },
  hexafoil: {
    options: { grid: '5x5', frequency: 1 },
  },
  rhodonea: {
    options: { grid: '5x5', frequency: 1 },
  },
  pentafoil: {
    options: { grid: '5x5', frequency: 1 },
  },
  heptafoil: {
    options: { grid: '5x5', frequency: 1 },
  },
  epitrochoid: {
    options: { grid: '5x5', frequency: 1 },
  },
  hypotrochoid: {
    options: { grid: '5x5', frequency: 1 },
  },
  spirograph: {
    options: { grid: '5x5', frequency: 1 },
  },
  epicycle: {
    options: { grid: '5x5', frequency: 1 },
  },
  superellipse: {
    options: { grid: '5x5', frequency: 1 },
  },
  squircle: {
    options: { grid: '6x6', frequency: 1 },
  },
  volution: {
    options: { grid: '5x5', frequency: 1 },
  },
  involute: {
    options: { grid: '5x5', frequency: 1 },
  },
  evolute: {
    options: { grid: '5x5', frequency: 1 },
  },
  folium: {
    options: { grid: '5x5', frequency: 1 },
  },
  chrysanth: {
    options: { grid: '5x5', frequency: 1 },
  },
  cogwheel: {
    options: { grid: '5x5', frequency: 1 },
  },
  starfish: {
    options: { grid: '5x5', frequency: 1 },
  },
  torus: {
    options: { grid: '4x4', frequency: 1 },
  },
  quatrefoil: {
    options: { grid: '4x4', frequency: 1 },
  },
  cinquefoil: {
    options: { grid: '4x4', frequency: 1 },
  },
  trefoil: {
    options: { grid: '4x4', frequency: 1 },
  },
  mouchette: {
    options: { grid: '4x4', frequency: 1 },
  },
  soufflet: {
    options: { grid: '4x4', frequency: 1 },
  },
  lierne: {
    options: { grid: '5x5', frequency: 1 },
  },
  tierceron: {
    options: { grid: '4x4', frequency: 1 },
  },
  fanvault: {
    options: { grid: '4x4', frequency: 1 },
  },
  grisaille: {
    options: { grid: '6x6', frequency: 1 },
  },
  came: {
    options: { grid: '6x6', frequency: 1 },
  },
  quarry: {
    options: { grid: '6x6', frequency: 1 },
  },
  ogive: {
    options: { grid: '5x5', frequency: 1 },
  },
  tracery: {
    options: { grid: '4x4', frequency: 1 },
  },
  cusping: {
    options: { grid: '4x4', frequency: 1 },
  },
  rosace: {
    options: { grid: '4x4', frequency: 1 },
  },
  dagger: {
    options: { grid: '5x5', frequency: 1 },
  },
  boss: {
    options: { grid: '4x4', frequency: 1 },
  },
  webbing: {
    options: { grid: '6x6', frequency: 1 },
  },
  respond: {
    options: { grid: '5x5', frequency: 1 },
  },
  springer: {
    options: { grid: '5x5', frequency: 1 },
  },
  impost: {
    options: { grid: '5x5', frequency: 1 },
  },
  necking: {
    options: { grid: '4x4', frequency: 1 },
  },
  listel: {
    options: { grid: '6x6', frequency: 1 },
  },
  reglet: {
    options: { grid: '6x6', frequency: 1 },
  },
  bandelet: {
    options: { grid: '4x4', frequency: 1 },
  },
  aureole: {
    options: { grid: '4x4', frequency: 1 },
  },
  nimbus: {
    options: { grid: '4x4', frequency: 1 },
  },
  glory: {
    options: { grid: '4x4', frequency: 1 },
  },
  parhelion: {
    options: { grid: '4x4', frequency: 1 },
  },
  sundog: {
    options: { grid: '4x4', frequency: 1 },
  },
  halation: {
    options: { grid: '4x4', frequency: 1 },
  },
  fresnel: {
    options: { grid: '4x4', frequency: 1 },
  },
  airy: {
    options: { grid: '4x4', frequency: 1 },
  },
  speckle: {
    options: { grid: '6x6', frequency: 1 },
  },
  wavefront: {
    options: { grid: '4x4', frequency: 1 },
  },
  phasor: {
    options: { grid: '4x4', frequency: 1 },
  },
  harmonic: {
    options: { grid: '4x4', frequency: 1 },
  },
  overtone: {
    options: { grid: '4x4', frequency: 1 },
  },
  resonance: {
    options: { grid: '4x4', frequency: 1 },
  },
  damping: {
    options: { grid: '4x4', frequency: 1 },
  },
  gong: {
    options: { grid: '4x4', frequency: 1 },
  },
  cymbal: {
    options: { grid: '4x4', frequency: 1 },
  },
  carillon: {
    options: { grid: '4x4', frequency: 1 },
  },
  tocsin: {
    options: { grid: '5x5', frequency: 1 },
  },
  knell: {
    options: { grid: '6x6', frequency: 1 },
  },
  peal: {
    options: { grid: '4x4', frequency: 1 },
  },
  bourdon: {
    options: { grid: '4x4', frequency: 1 },
  },
  tremor: {
    options: { grid: '4x4', frequency: 1 },
  },
  quake: {
    options: { grid: '4x4', frequency: 1 },
  },
  burin: {
    options: { grid: '5x5', frequency: 1 },
  },
  drypoint: {
    options: { grid: '5x5', frequency: 1 },
  },
  aquatint: {
    options: { grid: '5x5', frequency: 1 },
  },
  mezzotint: {
    options: { grid: '5x5', frequency: 1 },
  },
  intaglio: {
    options: { grid: '5x5', frequency: 1 },
  },
  linocut: {
    options: { grid: '5x5', frequency: 1 },
  },
  woodcut: {
    options: { grid: '5x5', frequency: 1 },
  },
  engrave: {
    options: { grid: '5x5', frequency: 1 },
  },
  roulette: {
    options: { grid: '5x5', frequency: 1 },
  },
  burnish: {
    options: { grid: '5x5', frequency: 1 },
  },
  serigraph: {
    options: { grid: '5x5', frequency: 1 },
  },
  collotype: {
    options: { grid: '5x5', frequency: 1 },
  },
  gravure: {
    options: { grid: '5x5', frequency: 1 },
  },
  litho: {
    options: { grid: '5x5', frequency: 1 },
  },
  monotype: {
    options: { grid: '5x5', frequency: 1 },
  },
  chine: {
    options: { grid: '5x5', frequency: 1 },
  },
  jalousie: {
    options: { grid: '5x5', frequency: 1 },
  },
  brise: {
    options: { grid: '5x5', frequency: 1 },
  },
  grille: {
    options: { grid: '5x5', frequency: 1 },
  },
  fretwork: {
    options: { grid: '5x5', frequency: 1 },
  },
  venetian: {
    options: { grid: '5x5', frequency: 1 },
  },
  ruling: {
    options: { grid: '5x5', frequency: 1 },
  },
  raster: {
    options: { grid: '5x5', frequency: 1 },
  },
  beatnote: {
    options: { grid: '4x4', frequency: 1 },
  },
  ogham: {
    options: { grid: '5x5', frequency: 1 },
  },
  futhark: {
    options: { grid: '5x5', frequency: 1 },
  },
  cuneiform: {
    options: { grid: '5x5', frequency: 1 },
  },
  hieratic: {
    options: { grid: '5x5', frequency: 1 },
  },
  demotic: {
    options: { grid: '6x6', frequency: 1 },
  },
  pictogram: {
    options: { grid: '5x5', frequency: 1 },
  },
  ideogram: {
    options: { grid: '5x5', frequency: 1 },
  },
  logogram: {
    options: { grid: '5x5', frequency: 1 },
  },
  syllabary: {
    options: { grid: '5x5', frequency: 1 },
  },
  abjad: {
    options: { grid: '5x5', frequency: 1 },
  },
  abugida: {
    options: { grid: '5x5', frequency: 1 },
  },
  semaphore: {
    options: { grid: '5x5', frequency: 1 },
  },
  wigwag: {
    options: { grid: '5x5', frequency: 1 },
  },
  helio: {
    options: { grid: '6x6', frequency: 1 },
  },
  braille: {
    options: { grid: '5x5', frequency: 1 },
  },
  punchcard: {
    options: { grid: '5x5', frequency: 1 },
  },
  telegraph: {
    options: { grid: '5x5', frequency: 1 },
  },
  dingbat: {
    options: { grid: '5x5', frequency: 1 },
  },
  fleuron: {
    options: { grid: '5x5', frequency: 1 },
  },
  pilcrow: {
    options: { grid: '5x5', frequency: 1 },
  },
  obelus: {
    options: { grid: '5x5', frequency: 1 },
  },
  asterism: {
    options: { grid: '5x5', frequency: 1 },
  },
  sierpinski: {
    options: { grid: '8x8', frequency: 1 },
  },
  modulo: {
    options: { grid: '6x6', frequency: 1 },
  },
  residue: {
    options: { grid: '6x6', frequency: 1 },
  },
  parity: {
    options: { grid: '6x6', frequency: 1 },
  },
  collatz: {
    options: { grid: '6x6', frequency: 1 },
  },
  fibonacci: {
    options: { grid: '6x6', frequency: 1 },
  },
  farey: {
    options: { grid: '6x6', frequency: 1 },
  },
  gyroid: {
    options: { grid: '6x6', frequency: 1 },
  },
  helicoid: {
    options: { grid: '6x6', frequency: 1 },
  },
  automaton: {
    options: { grid: '6x6', frequency: 1 },
  },
  glider: {
    options: { grid: '6x6', frequency: 1 },
  },
  dragon: {
    options: { grid: '6x6', frequency: 1 },
  },
  lsystem: {
    options: { grid: '6x6', frequency: 1 },
  },
  cantor: {
    options: { grid: '5x5', frequency: 1 },
  },
  koch: {
    options: { grid: '6x6', frequency: 1 },
  },
  hilbert: {
    options: { grid: '6x6', frequency: 1 },
  },
  peano: {
    options: { grid: '5x5', frequency: 1 },
  },
  ulam: {
    options: { grid: '6x6', frequency: 1 },
  },
  penrose: {
    options: { grid: '6x6', frequency: 1 },
  },
  ammann: {
    options: { grid: '6x6', frequency: 1 },
  },
  aperiodic: {
    options: { grid: '6x6', frequency: 1 },
  },
  quasi: {
    options: { grid: '5x5', frequency: 1 },
  },
  voronoi: {
    options: { grid: '5x5', frequency: 1 },
  },
  delaunay: {
    options: { grid: '6x6', frequency: 1 },
  },
  amoeba: {
    options: { grid: '5x5', frequency: 1 },
  },
  blot: {
    options: { grid: '6x6', frequency: 1 },
  },
  ooze: {
    options: { grid: '5x5', frequency: 1 },
  },
  globule: {
    options: { grid: '6x6', frequency: 1 },
  },
  vesicle: {
    options: { grid: '5x5', frequency: 1 },
  },
  corpuscle: {
    options: { grid: '5x5', frequency: 1 },
  },
  protoplast: {
    options: { grid: '5x5', frequency: 1 },
  },
  vacuole: {
    options: { grid: '5x5', frequency: 1 },
  },
  organelle: {
    options: { grid: '5x5', frequency: 1 },
  },
  mitosis: {
    options: { grid: '5x5', frequency: 1 },
  },
  spawn: {
    options: { grid: '6x6', frequency: 1 },
  },
  roe: {
    options: { grid: '8x8', frequency: 1 },
  },
  tapioca: {
    options: { grid: '6x6', frequency: 1 },
  },
  lava: {
    options: { grid: '5x5', frequency: 1 },
  },
  magma: {
    options: { grid: '6x6', frequency: 1 },
  },
  curd: {
    options: { grid: '6x6', frequency: 1 },
  },
  matryoshka: {
    options: { grid: '5x5', frequency: 1 },
  },
  recurse: {
    options: { grid: '5x5', frequency: 1 },
  },
  fractal: {
    options: { grid: '5x5', frequency: 1 },
  },
  subdivide: {
    options: { grid: '6x6', frequency: 1 },
  },
  quadtree: {
    options: { grid: '5x5', frequency: 1 },
  },
  microcosm: {
    options: { grid: '5x5', frequency: 1 },
  },
  macrocosm: {
    options: { grid: '5x5', frequency: 1 },
  },
  nestbox: {
    options: { grid: '5x5', frequency: 1 },
  },
  inlay: {
    options: { grid: '6x6', frequency: 1 },
  },
  marquetry: {
    options: { grid: '5x5', frequency: 1 },
  },
  deckle: {
    options: { grid: '5x5', frequency: 1 },
  },
  foxing: {
    options: { grid: '6x6', frequency: 1 },
  },
  pulp: {
    options: { grid: '5x5', frequency: 1 },
  },
  fray: {
    options: { grid: '5x5', frequency: 1 },
  },
  erode: {
    options: { grid: '4x4', frequency: 1 },
  },
  crumble: {
    options: { grid: '5x5', frequency: 1 },
  },
  grit: {
    options: { grid: '6x6', frequency: 1 },
  },
  smoulder: {
    options: { grid: '5x5', frequency: 1 },
  },
  ticker: {
    options: { grid: '5x5', frequency: 1 },
  },
  spectro: {
    options: { grid: '6x6', frequency: 1 },
  },
  waveform: {
    options: { grid: '6x6', frequency: 1 },
  },
  oscillo: {
    options: { grid: '5x5', frequency: 1 },
  },
  readout: {
    options: { grid: '5x5', frequency: 1 },
  },
  gauge: {
    options: { grid: '4x4', frequency: 1 },
  },
  meter: {
    options: { grid: '5x5', frequency: 1 },
  },
  telemetry: {
    options: { grid: '5x5', frequency: 1 },
  },
  cadence: {
    options: { grid: '5x5', frequency: 1 },
  },
  beacon: {
    options: { grid: '5x5', frequency: 1 },
  },
  fiducial: {
    options: { grid: '4x4', frequency: 1 },
  },
  anchor: {
    options: { grid: '4x4', frequency: 1 },
  },
  benchmark: {
    options: { grid: '4x4', frequency: 1 },
  },
  cornerstone: {
    options: { grid: '4x4', frequency: 1 },
  },
  keyline: {
    options: { grid: '4x4', frequency: 1 },
  },
  bleed: {
    options: { grid: '4x4', frequency: 1 },
  },
  margin: {
    options: { grid: '4x4', frequency: 1 },
  },
  indent: {
    options: { grid: '4x4', frequency: 1 },
  },
  orphan: {
    options: { grid: '4x4', frequency: 1 },
  },
  widow: {
    options: { grid: '4x4', frequency: 1 },
  },
};
