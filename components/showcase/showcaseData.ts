// Content + theming for the twenty showcase sites. Each site is a fictional
// brand whose primary design accent is a Tabbied artwork rendered by the
// `TabbiedArtwork` React component (see ShowcaseSite.tsx). Every site is themed
// with one palette from the Tabbied library (lib/paletteLibrary.ts) and built
// around one preset artwork, so the showcase spans twenty distinct
// palette/artwork pairings.
//
// Sites 11-20 were authored here; sites 1-10 began life as self-contained
// static-HTML builds under public/samples/ and were ported into this stack once
// it was clear both were rendering the same four layouts and the same nineteen
// section types from two separate codebases.
//
// The artwork definition itself is imported by each route's page.tsx (so the
// bundler ships only the presets in use) and passed to ShowcaseSite; this file
// carries everything else.

export type ShowcaseLayout = 'spotlight' | 'split' | 'editorial' | 'boutique';

export type ShowcaseItem = {
  eyebrow: string;
  title: string;
  meta: string;
  /** Key into ShowcaseContent.images for this card's prompt. */
  seed: string;
};

export type ShowcaseSite = {
  slug: string;
  brand: string;
  topic: string;
  /** Primary artwork slug, matches the gallery thumbnail and metadata. */
  artwork: string;
  /** All artworks the site renders (primary first); each is imported by the route. */
  artworks: string[];
  /** Library palette id + name (for the gallery) and colors (background first). */
  paletteId: string;
  paletteName: string;
  colors: string[];
  layout: ShowcaseLayout;
  /** Google Fonts family names: [display, body]. Loaded via <link> in the page. */
  fonts: { href: string; display: string; body: string };
  /**
   * Optional per-site letter-spacing, added on top of every tracked rule in
   * ShowcaseSite.module.css (and inherited by the rest). Negative tightens.
   */
  tracking?: string;
  favicon: string;
  nav: string[];
  eyebrow: string;
  /** Hero title supports a single {em}...{/em} span for the accent color. */
  title: string;
  lede: string;
  primaryCta: string;
  secondaryCta: string;
  /** Small marquee / ticker phrases (spotlight + editorial). */
  ticker?: string[];
  /** Stat strip (split/spotlight). */
  stats?: { n: string; l: string }[];
  /** Optional index label above the section title. */
  sectionKicker?: string;
  sectionTitle: string;
  sectionSub: string;
  items: ShowcaseItem[];
  /** Closing band copy. */
  bandTitle: string;
  bandCta: string;
  /** split only, put the doodle panel on the left. */
  reverse?: boolean;
};

const gf = (families: string) =>
  `https://fonts.googleapis.com/css2?${families}&display=swap`;

export const SHOWCASE_SITES: ShowcaseSite[] = [
  // 11, Solstice · wellness / yoga retreat · Sunset · lobe
  {
    slug: 'solstice',
    brand: 'Solstice',
    topic: 'Yoga & wellness retreat',
    artwork: 'lobe',
    artworks: ['lobe', 'blossom', 'spark', 'frond'],
    paletteId: 'lib-sunset',
    paletteName: 'Sunset',
    colors: ['#2b1d3a', '#ff6b6b', '#ffd23e', '#ff3d8b', '#7048e8'],
    layout: 'split',
    fonts: {
      href: gf('family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Jost:wght@300;400;500'),
      display: "'Fraunces', Georgia, serif",
      body: "'Jost', system-ui, sans-serif",
    },
    favicon: '🌅',
    nav: ['Retreats', 'Classes', 'Teachers', 'Journal'],
    eyebrow: 'Coastal retreats · Small groups',
    title: 'Come back to {em}yourself{/em}.',
    lede: 'Seven-day yoga and breath-work retreats on the edge of the Pacific, unhurried mornings, long horizons, and nothing to be but here.',
    primaryCta: 'See 2026 dates',
    secondaryCta: 'How it works',
    stats: [
      { n: '7 days', l: 'Per retreat' },
      { n: '12', l: 'Guests max' },
      { n: '2:1', l: 'Guest to teacher' },
    ],
    sectionTitle: 'Upcoming retreats',
    sectionSub: 'Seasons on the coast, each with its own rhythm.',
    items: [
      { eyebrow: 'Spring', title: 'Tidewater Reset', meta: 'Big Sur · Apr 12–19', seed: 'sol1' },
      { eyebrow: 'Summer', title: 'Long Light', meta: 'Mendocino · Jun 20–27', seed: 'sol2' },
      { eyebrow: 'Autumn', title: 'Amber Hours', meta: 'Sonoma · Sep 14–21', seed: 'sol3' },
    ],
    bandTitle: 'Your quietest week of the year is waiting.',
    bandCta: 'Reserve your mat',
  },

  // 12, Harbor & Vine · natural wine bar · Cranberry · quilt
// 13, Lumen · design conference · Arcade · spectrum
  {
    slug: 'lumen',
    brand: 'Lumen',
    topic: 'Design & technology conference',
    artwork: 'spectrum',
    artworks: ['spectrum', 'prisma', 'bokeh', 'spark'],
    paletteId: 'lib-arcade',
    paletteName: 'Arcade',
    colors: ['#12002e', '#ff2079', '#00e5ff', '#f9f871', '#7a04eb'],
    layout: 'spotlight',
    fonts: {
      href: gf('family=Space+Grotesk:wght@400;500;700&family=Sora:wght@600;800'),
      display: "'Sora', system-ui, sans-serif",
      body: "'Space Grotesk', system-ui, sans-serif",
    },
    favicon: '✷',
    nav: ['Program', 'Speakers', 'Venue', 'Tickets'],
    eyebrow: 'June 4–6, 2026 · Lisbon',
    title: 'Where design meets {em}what’s next{/em}.',
    lede: 'Three days on the edges of design, code, and craft, 60 speakers, one waterfront, and the whole industry in one room.',
    primaryCta: 'Get tickets',
    secondaryCta: 'View program',
    ticker: ['60 SPEAKERS', '3 STAGES', '2 WORKSHOPS DAYS', 'ONE WATERFRONT', 'LISBON 2026'],
    stats: [{ n: '60', l: 'Speakers' }, { n: '3', l: 'Stages' }, { n: '2', l: 'Workshop days' }],
    sectionTitle: 'Featured speakers',
    sectionSub: 'A first look at the 2026 lineup.',
    items: [
      { eyebrow: 'Keynote', title: 'Generative Systems', meta: 'Ana Reis · Stage A', seed: 'lum1' },
      { eyebrow: 'Talk', title: 'Designing for Doubt', meta: 'Kwame Bell · Stage B', seed: 'lum2' },
      { eyebrow: 'Workshop', title: 'Color at Scale', meta: 'Mei Tan · Lab 2', seed: 'lum3' },
    ],
    bandTitle: 'Early-bird tickets are nearly gone.',
    bandCta: 'Claim your pass',
  },

  // 14, Fathom · ocean research nonprofit · Lagoon · lattice
  {
    slug: 'fathom',
    brand: 'Fathom',
    topic: 'Ocean research nonprofit',
    artwork: 'lattice',
    artworks: ['lattice', 'wavelet', 'ring', 'quoit'],
    paletteId: 'lib-lagoon',
    paletteName: 'Lagoon',
    colors: ['#04252b', '#0d9488', '#5eead4', '#fef9c3'],
    layout: 'split',
    fonts: {
      href: gf('family=Spectral:wght@300;400;600&family=Outfit:wght@300;400;500;600'),
      display: "'Spectral', Georgia, serif",
      body: "'Outfit', system-ui, sans-serif",
    },
    favicon: '🌊',
    nav: ['Research', 'Expeditions', 'Data', 'Support'],
    eyebrow: 'Marine science · Nonprofit',
    title: 'Mapping the ocean, {em}one fathom{/em} at a time.',
    lede: 'We fund open expeditions and publish every reading, turning the deep sea into data anyone can build on.',
    primaryCta: 'Explore the data',
    secondaryCta: 'Our expeditions',
    stats: [
      { n: '1.2M', l: 'Readings published' },
      { n: '34', l: 'Expeditions funded' },
      { n: '100%', l: 'Open access' },
    ],
    sectionTitle: 'Current expeditions',
    sectionSub: 'Live science, from surface to seabed.',
    items: [
      { eyebrow: 'Pacific', title: 'Twilight Zone Survey', meta: '200–1000m · ongoing', seed: 'fat1' },
      { eyebrow: 'Atlantic', title: 'Coral Census', meta: 'Reef health · Q2', seed: 'fat2' },
      { eyebrow: 'Arctic', title: 'Ice-Edge Drift', meta: 'Cold currents · Q3', seed: 'fat3' },
    ],
    bandTitle: 'Open science needs open funding.',
    bandCta: 'Become a member',
    reverse: true,
  },

  // 15, Ember & Oak · wood-fire restaurant · Ember · windowpane
  {
    slug: 'ember-and-oak',
    brand: 'Ember & Oak',
    topic: 'Wood-fire restaurant',
    artwork: 'windowpane',
    artworks: ['windowpane', 'chamfer', 'fluting', 'merlon'],
    paletteId: 'lib-ember',
    paletteName: 'Ember',
    colors: ['#1a0f0a', '#e0511f', '#ff9f1c', '#ffe8c7'],
    layout: 'boutique',
    fonts: {
      href: gf('family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Jost:wght@300;400;500'),
      display: "'Cormorant Garamond', Georgia, serif",
      body: "'Jost', system-ui, sans-serif",
    },
    favicon: '🔥',
    nav: ['Menu', 'Reservations', 'Private Dining', 'About'],
    eyebrow: 'Live fire · Seasonal',
    title: 'Everything touched by {em}flame{/em}.',
    lede: 'A single wood-fired hearth, a menu that changes with the market, and a room built around the glow of the coals.',
    primaryCta: 'Reserve a table',
    secondaryCta: 'View the menu',
    sectionTitle: 'From the hearth',
    sectionSub: 'Tonight’s fire, plated three ways.',
    items: [
      { eyebrow: 'To start', title: 'Charred Leek', meta: 'ember cream · hazelnut', seed: 'emb1' },
      { eyebrow: 'The main', title: 'Oak-Fired Rib', meta: '45-day · bone marrow', seed: 'emb2' },
      { eyebrow: 'To finish', title: 'Smoked Pear', meta: 'honey · burnt cream', seed: 'emb3' },
    ],
    bandTitle: 'The best seat in the house faces the fire.',
    bandCta: 'Book your evening',
  },

  // 16, Petal & Post · florist + stationery · Blush · frond
  {
    slug: 'petal-and-post',
    brand: 'Petal & Post',
    topic: 'Florist & stationery studio',
    artwork: 'frond',
    artworks: ['frond', 'foliage', 'blossom', 'ivy'],
    paletteId: 'lib-blush',
    paletteName: 'Blush',
    colors: ['#fff0f3', '#ff8fab', '#c9184a', '#590d22'],
    layout: 'split',
    fonts: {
      href: gf('family=DM+Serif+Display&family=DM+Sans:wght@400;500;700'),
      display: "'DM Serif Display', Georgia, serif",
      body: "'DM Sans', system-ui, sans-serif",
    },
    favicon: '🌸',
    nav: ['Bouquets', 'Weddings', 'Stationery', 'Subscriptions'],
    eyebrow: 'Seasonal stems · Hand-printed',
    title: 'Flowers & paper, {em}sent with love{/em}.',
    lede: 'A neighbourhood studio arranging seasonal blooms and letterpress cards, the whole gesture, wrapped and delivered.',
    primaryCta: 'Shop bouquets',
    secondaryCta: 'Wedding enquiries',
    stats: [
      { n: 'Daily', l: 'Market-fresh stems' },
      { n: '48 hr', l: 'Local delivery' },
      { n: 'Hand', l: 'Letterpressed' },
    ],
    sectionTitle: 'This week’s blooms',
    sectionSub: 'Cut this morning, arranged to order.',
    items: [
      { eyebrow: 'Signature', title: 'Blush Garden', meta: 'ranunculus · sweet pea', seed: 'pet1' },
      { eyebrow: 'Bright', title: 'Coral Market', meta: 'dahlia · cosmos', seed: 'pet2' },
      { eyebrow: 'Soft', title: 'First Light', meta: 'peony · astilbe', seed: 'pet3' },
    ],
    bandTitle: 'Fresh flowers on the table, every other week.',
    bandCta: 'Start a subscription',
  },

  // 17, Northwind · outdoor apparel · Forest · maze
  {
    slug: 'northwind',
    brand: 'Northwind',
    topic: 'Outdoor apparel brand',
    artwork: 'maze',
    artworks: ['maze', 'switchback', 'elbow', 'lattice'],
    paletteId: 'lib-forest',
    paletteName: 'Forest',
    colors: ['#1e2d24', '#6ca31c', '#e7fce3', '#c9a227'],
    layout: 'spotlight',
    fonts: {
      href: gf('family=Archivo:wght@500;700;900&family=Work+Sans:wght@400;500;600'),
      display: "'Archivo', system-ui, sans-serif",
      body: "'Work Sans', system-ui, sans-serif",
    },
    favicon: '🧭',
    nav: ['Men', 'Women', 'Gear', 'Field Notes'],
    eyebrow: 'Built for the backcountry',
    title: 'Made to be {em}worn out{/em}.',
    lede: 'Hard-wearing layers for long days above the treeline, overbuilt, weather-beaten, and guaranteed for life.',
    primaryCta: 'Shop the range',
    secondaryCta: 'Our guarantee',
    ticker: ['LIFETIME GUARANTEE', 'RECYCLED SHELLS', 'FIELD-TESTED', 'CARBON NEUTRAL', 'SINCE 1998'],
    stats: [{ n: 'Lifetime', l: 'Guarantee' }, { n: '100%', l: 'Recycled shells' }, { n: '1998', l: 'Established' }],
    sectionTitle: 'New in the range',
    sectionSub: 'Layers that earn their place in the pack.',
    items: [
      { eyebrow: 'Shell', title: 'Ridgeline Jacket', meta: '3-layer · $340', seed: 'nor1' },
      { eyebrow: 'Insulation', title: 'Cirrus Down', meta: '800-fill · $260', seed: 'nor2' },
      { eyebrow: 'Base', title: 'Merino Crew', meta: '190gsm · $95', seed: 'nor3' },
    ],
    bandTitle: 'Wherever the trail ends, we’ll repair it for free.',
    bandCta: 'Read the guarantee',
  },

  // 18, Honeycomb · kids learning app · Honey · bokeh
  {
    slug: 'honeycomb',
    brand: 'Honeycomb',
    topic: "Kids' learning app",
    artwork: 'bokeh',
    artworks: ['bokeh', 'pinwheel', 'northstar', 'maelstrom'],
    paletteId: 'lib-honey',
    paletteName: 'Honey',
    colors: ['#fff9e6', '#f6c343', '#b8860b', '#3a2f0b'],
    layout: 'split',
    fonts: {
      href: gf('family=Plus+Jakarta+Sans:wght@500;600;800&family=Lexend:wght@400;500;600'),
      display: "'Plus Jakarta Sans', system-ui, sans-serif",
      body: "'Lexend', system-ui, sans-serif",
    },
    favicon: '🐝',
    nav: ['How it works', 'Ages', 'For schools', 'Pricing'],
    eyebrow: 'Ages 4–9 · Screen-time worth having',
    title: 'Little lessons that {em}feel like play{/em}.',
    lede: 'Bite-size reading and number games that adapt to your child, five joyful minutes at a time, no ads, ever.',
    primaryCta: 'Start free trial',
    secondaryCta: 'See a lesson',
    stats: [
      { n: '5 min', l: 'Per lesson' },
      { n: '900+', l: 'Adaptive games' },
      { n: '0', l: 'Ads, always' },
    ],
    sectionTitle: 'What kids play',
    sectionSub: 'Worlds that grow with every right answer.',
    items: [
      { eyebrow: 'Reading', title: 'Word Meadow', meta: 'phonics · ages 4–6', seed: 'hon1' },
      { eyebrow: 'Numbers', title: 'Count Hive', meta: 'early math · ages 5–7', seed: 'hon2' },
      { eyebrow: 'Logic', title: 'Puzzle Grove', meta: 'patterns · ages 6–9', seed: 'hon3' },
    ],
    bandTitle: 'Two weeks free. Cancel in one tap.',
    bandCta: 'Try Honeycomb',
    reverse: true,
  },

  // 19, Facet · fine jewelry · Jewel · prisma
  {
    slug: 'facet',
    brand: 'Facet',
    topic: 'Fine jewelry brand',
    artwork: 'prisma',
    artworks: ['prisma', 'diadem', 'chamfer', 'vitrail'],
    paletteId: 'lib-jewel',
    paletteName: 'Jewel',
    colors: ['#0b1021', '#5b2a86', '#2176ae', '#57b8ff', '#fbb13c'],
    layout: 'boutique',
    fonts: {
      href: gf('family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Jost:wght@300;400;500'),
      display: "'Cormorant Garamond', Georgia, serif",
      body: "'Jost', system-ui, sans-serif",
    },
    favicon: '💎',
    nav: ['Collections', 'Bespoke', 'Our Stones', 'Appointments'],
    eyebrow: 'Ethically sourced · Made to order',
    title: 'Light, {em}cut to keep{/em}.',
    lede: 'Fine jewelry built around a single remarkable stone, traceable, hand-set, and made to outlast every trend.',
    primaryCta: 'View collections',
    secondaryCta: 'Book an appointment',
    sectionTitle: 'The Prism collection',
    sectionSub: 'Colour, held to the light.',
    items: [
      { eyebrow: 'N° 01', title: 'Aurora Ring', meta: 'sapphire · 18k', seed: 'fac1' },
      { eyebrow: 'N° 02', title: 'Spectra Drop', meta: 'tourmaline · platinum', seed: 'fac2' },
      { eyebrow: 'N° 03', title: 'Facet Band', meta: 'diamond · rose gold', seed: 'fac3' },
    ],
    bandTitle: 'Bring us a stone, or start with a spark.',
    bandCta: 'Design something bespoke',
  },

  // 20, Seabright · coastal skincare · Seaglass · metro
  {
    slug: 'seabright',
    brand: 'Seabright',
    topic: 'Coastal skincare line',
    artwork: 'metro',
    artworks: ['metro', 'wavelet', 'ring', 'quoit'],
    paletteId: 'lib-seaglass',
    paletteName: 'Seaglass',
    colors: ['#f2fbf7', '#9ad1c9', '#5f9ea0', '#33576b'],
    layout: 'split',
    fonts: {
      href: gf('family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Outfit:wght@300;400;500;600'),
      display: "'Fraunces', Georgia, serif",
      body: "'Outfit', system-ui, sans-serif",
    },
    favicon: '🧴',
    nav: ['Shop', 'Ingredients', 'Ritual', 'About'],
    eyebrow: 'Reef-safe · Fragrance-free',
    title: 'Skincare with a {em}clear conscience{/em}.',
    lede: 'Mineral-rich, reef-safe formulas made in small batches on the coast, kind to sensitive skin and the water it runs into.',
    primaryCta: 'Shop the range',
    secondaryCta: 'Our ingredients',
    stats: [
      { n: '9', l: 'Ingredients or fewer' },
      { n: '0', l: 'Synthetic fragrance' },
      { n: '100%', l: 'Reef-safe' },
    ],
    sectionTitle: 'The daily ritual',
    sectionSub: 'Three steps, morning and night.',
    items: [
      { eyebrow: 'Cleanse', title: 'Tide Gel', meta: 'sea kelp · 150ml', seed: 'sea1' },
      { eyebrow: 'Treat', title: 'Mineral Serum', meta: 'zinc · magnesium', seed: 'sea2' },
      { eyebrow: 'Protect', title: 'Day Fluid SPF30', meta: 'non-nano · 50ml', seed: 'sea3' },
    ],
    bandTitle: 'Your skin, and the sea, will thank you.',
    bandCta: 'Build your ritual',
    reverse: true,
  },

  // ---- Ported from the static-HTML samples (sites 1-10) ----
  {
    slug: 'aurora-sound',
    brand: 'Aurora Sound',
    topic: 'Electronic music label',
    artwork: 'neon',
    artworks: ['neon', 'spectrum', 'prisma', 'bokeh'],
    paletteId: 'lib-neon',
    paletteName: 'Neon',
    colors: ['#0d0d12', '#3fffb2', '#3eecff', '#ff3d8b'],
    layout: 'spotlight',
    fonts: {
      href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Sora:wght@600;800&display=swap',
      display: "'Sora', system-ui, sans-serif",
      body: "'Space Grotesk', system-ui, sans-serif",
    },
    favicon: '🎧',
    nav: ['Releases', 'Artists', 'Events', 'About'],
    eyebrow: 'Independent · Est. 2019',
    title: 'Sound for the {em}small hours{/em}.',
    lede: 'An independent label for forward-looking club, ambient, and everything that glows in between. Pressed with love, mixed for midnight.',
    primaryCta: 'Latest releases',
    secondaryCta: 'Listen live',
    ticker: ['NEW SIGNINGS', 'WAX & DIGITAL', 'DEEP CUTS', 'AFTER HOURS'],
    sectionTitle: 'Recent releases',
    sectionSub: 'Twelve inches and twelve bits, mastered for the floor and the headphones.',
    items: [
      { eyebrow: 'LP', title: 'Neon Tides', meta: 'KAORU · 2026', seed: 'r1' },
      { eyebrow: 'EP', title: 'Halcyon', meta: 'Vela & Mor · 2026', seed: 'r2' },
      { eyebrow: 'Single', title: 'Afterglow', meta: 'S U N J A · 2025', seed: 'r3' },
    ],
    bandTitle: 'Turn it up. The next one lands Friday.',
    bandCta: 'Pre-save the release',
  },

{
    slug: 'meridian',
    brand: 'Meridian',
    topic: 'Payments infrastructure',
    artwork: 'circuit',
    artworks: ['circuit', 'lattice', 'metro', 'windowpane'],
    paletteId: 'lib-cobalt',
    paletteName: 'Cobalt',
    colors: ['#0a1a3f', '#1e4fd6', '#3eecff', '#eef4ff'],
    layout: 'split',
    fonts: {
      href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;800&display=swap',
      display: "'Manrope', system-ui, sans-serif",
      body: "'Manrope', system-ui, sans-serif",
    },
    favicon: '⬡',
    nav: ['Products', 'Developers', 'Pricing', 'Docs'],
    eyebrow: 'Money movement · API-first',
    title: 'Payments {em}infrastructure{/em} for software that moves money.',
    lede: 'One API for cards, transfers, and ledgers. Ship compliant money movement in days, not quarters.',
    primaryCta: 'Start building',
    secondaryCta: 'Book a demo',
    stats: [{ n: '40+', l: 'Currencies' }, { n: '99.99%', l: 'Uptime' }, { n: '3 lines', l: 'To first charge' }],
    sectionTitle: 'Built for the whole lifecycle',
    sectionSub: 'From the first authorization to reconciliation.',
    items: [
      { eyebrow: 'Ledger', title: 'Unified Ledger', meta: 'Real-time, double-entry', seed: 'm1' },
      { eyebrow: 'Routing', title: 'Adaptive Routing', meta: 'Highest-converting path', seed: 'm2' },
      { eyebrow: 'Risk', title: 'Fraud Signals', meta: 'Scoring on every event', seed: 'm3' },
    ],
    bandTitle: 'Go live this quarter.',
    bandCta: 'Create an account',
  },

  {
    slug: 'verdant',
    brand: 'Verdant',
    topic: 'Indoor plant shop',
    artwork: 'foliage',
    artworks: ['foliage', 'frond', 'ivy', 'blossom'],
    paletteId: 'lib-fern',
    paletteName: 'Fern',
    colors: ['#f4faf0', '#2d6a4f', '#95d5b2', '#1b4332'],
    layout: 'split',
    fonts: {
      href: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;700&display=swap',
      display: "'DM Serif Display', Georgia, serif",
      body: "'DM Sans', system-ui, sans-serif",
    },
    favicon: '🌿',
    nav: ['Shop', 'Care Guides', 'Gifts', 'Studio'],
    eyebrow: 'Hand-picked · Delivered potted',
    title: 'Green, made {em}easy{/em}.',
    lede: 'Hand-picked houseplants matched to your light, delivered to your door with everything they need to thrive.',
    primaryCta: 'Find your plant',
    secondaryCta: 'Care quiz',
    stats: [{ n: 'Next-day', l: 'Local delivery' }, { n: '30-day', l: 'Thrive promise' }, { n: '120+', l: 'Varieties' }],
    sectionTitle: 'Easy-care favourites',
    sectionSub: 'Cut this morning, potted and ready to go.',
    items: [
      { eyebrow: 'Low light', title: 'ZZ Plant', meta: '$32', seed: 'v1' },
      { eyebrow: 'Bright indirect', title: 'Fiddle Fig', meta: '$68', seed: 'v2' },
      { eyebrow: 'Statement', title: 'Bird of Paradise', meta: '$95', seed: 'v3' },
    ],
    bandTitle: 'Your greenest room is one box away.',
    bandCta: 'Start the quiz',
    reverse: true,
  },

{
    slug: 'nocturne',
    brand: 'Nocturne',
    topic: 'Fragrance for the small hours',
    artwork: 'veil',
    artworks: ['veil', 'bokeh', 'lunette', 'prisma'],
    paletteId: 'lib-amethyst',
    paletteName: 'Amethyst',
    colors: ['#12071f', '#5a189a', '#9d4edd', '#e0aaff'],
    layout: 'boutique',
    fonts: {
      href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Jost:wght@300;400;500&display=swap',
      display: "'Cormorant Garamond', Georgia, serif",
      body: "'Jost', system-ui, sans-serif",
    },
    favicon: '🌙',
    nav: ['Collection', 'The House', 'Discovery Set'],
    eyebrow: 'Eau de Parfum · Extrait',
    title: 'After{em}dark{/em}',
    lede: 'Fragrance composed for the small hours, when the city quiets and scent speaks loudest.',
    primaryCta: 'Discover the collection',
    secondaryCta: 'Book a consultation',
    sectionTitle: 'The Maison collection',
    sectionSub: 'Seven hours of night, bottled.',
    items: [
      { eyebrow: 'N° 01', title: 'Velvet Hour', meta: 'iris · suede · black plum', seed: 'n1' },
      { eyebrow: 'N° 02', title: 'Midnight Bloom', meta: 'tuberose · incense · amber', seed: 'n2' },
      { eyebrow: 'N° 03', title: 'Last Train', meta: 'vetiver · smoke · bergamot', seed: 'n3' },
    ],
    bandTitle: 'A perfume is a memory you can wear before it happens.',
    bandCta: 'Order a discovery set',
  },

  {
    slug: 'shoreline',
    brand: 'Shoreline',
    topic: 'Coastal architecture studio',
    artwork: 'louvre',
    artworks: ['louvre', 'picket', 'sail', 'lattice'],
    paletteId: 'lib-ocean',
    paletteName: 'Ocean',
    colors: ['#0b2545', '#8da9c4', '#eef4ed', '#13a8a8'],
    layout: 'split',
    fonts: {
      href: 'https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,600;1,400&family=Outfit:wght@300;400;500;600&display=swap',
      display: "'Spectral', Georgia, serif",
      body: "'Outfit', system-ui, sans-serif",
    },
    favicon: '⛵',
    nav: ['Work', 'Studio', 'Approach', 'Contact'],
    eyebrow: 'Architecture · Est. 2008',
    title: 'Houses that hold the weather and {em}let in the light{/em}.',
    lede: 'We design durable, low-slung homes for the coast. Buildings that weather beautifully and sit lightly on the land.',
    primaryCta: 'Start a project',
    secondaryCta: 'See our work',
    stats: [{ n: '60+', l: 'Completed homes' }, { n: '3', l: 'RIBA awards' }, { n: '18 yrs', l: 'On the coast' }],
    sectionTitle: 'Selected work',
    sectionSub: 'A decade of coastline, from cabins to civic rooms.',
    items: [
      { eyebrow: 'Whitstable, UK', title: 'Salt House', meta: '2024', seed: 'w1' },
      { eyebrow: 'Cape Cod, US', title: 'Dune Pavilion', meta: '2023', seed: 'w2' },
      { eyebrow: 'Sagres, PT', title: 'Harbour Rooms', meta: '2022', seed: 'w3' },
    ],
    bandTitle: 'Building something by the water?',
    bandCta: 'Start a conversation',
  },

  {
    slug: 'pixel-playhouse',
    brand: 'Pixel Playhouse',
    topic: 'Indie game studio',
    artwork: 'tetro',
    artworks: ['tetro', 'maze', 'bloks', 'notchblock'],
    paletteId: 'lib-vaporwave',
    paletteName: 'Vaporwave',
    colors: ['#2d0a45', '#ff6ad5', '#c774e8', '#94d0ff', '#ad8cff'],
    layout: 'spotlight',
    fonts: {
      href: 'https://fonts.googleapis.com/css2?family=Chivo:wght@400;700;900&family=Space+Grotesk:wght@400;500;700&display=swap',
      display: "'Chivo', system-ui, sans-serif",
      body: "'Space Grotesk', system-ui, sans-serif",
    },
    favicon: '🕹️',
    nav: ['Games', 'Studio', 'Devlog'],
    eyebrow: '▶ Now in early access',
    title: 'Cozy games about {em}small worlds{/em}.',
    lede: 'A tiny studio making colourful, low-stress games you can lose an evening to. No crunch, just vibes.',
    primaryCta: 'Play the demo',
    secondaryCta: 'See our games',
    ticker: ['MADE BY 3 FRIENDS', 'NO CRUNCH', 'SOUNDTRACK ON BANDCAMP', 'PLAYHOUSE ARCADE'],
    stats: [{ n: '3', l: 'Friends' }, { n: '4', l: 'Games shipped' }, { n: '0', l: 'Crunch weeks' }],
    sectionTitle: 'Our games',
    sectionSub: 'Little worlds, made with care.',
    items: [
      { eyebrow: 'Out now', title: 'Sunset Suburbia', meta: 'Dusk-only life sim', seed: 'g1' },
      { eyebrow: 'Demo', title: 'Neon Courier', meta: 'Rooftop delivery roguelite', seed: 'g2' },
      { eyebrow: '2027', title: 'Tidepool', meta: 'Build a reef, one creature at a time', seed: 'g3' },
    ],
    bandTitle: 'Come lose an evening in a small world.',
    bandCta: 'Play the demo',
  },

];
