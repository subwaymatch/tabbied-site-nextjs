// Per-site composition + new-section content for the static sample sites,
// keyed by directory. generate.mjs merges this onto each site so the ten pages
// pick different visual kits, different section orders, and mix in manifestos,
// alternating illustrated rows, icon grids, FAQs, big quotes, logo clouds, and
// galleries, the same section library the React sites use.

const IMG =
  'Soft natural light, shallow depth of field, high detail, no text or logos.';

export const STATIC_SECTIONS = {
  '01-aurora-sound': {
    kit: 'brutal',
    sections: ['logos', 'iconFeatures', 'items', 'specs', 'gallery', 'altRows', 'bigQuote', 'process', 'faq', 'band', 'newsletter'],
    specs: {
      kicker: 'The pressing',
      title: 'How the records are made',
      sub: 'Everything we cut, and everything we will not.',
      rows: [
        { k: 'Cut', v: 'Half-speed lacquers in London, then plated and pressed in the Czech Republic.' },
        { k: 'Weight', v: '180 gram black vinyl as standard. Colour variants only when the artist asks for one.' },
        { k: 'Run size', v: 'Between 300 and 1,000 copies. We would rather sell out than pulp a warehouse.' },
        { k: 'Mastering', v: 'Separate masters for vinyl and digital. The loud one is not the good one.' },
        { k: 'Sleeves', v: 'Uncoated board, vegetable inks, and no shrink wrap on anything we make.' },
        { k: 'Splits', v: 'Fifty-fifty after costs, paid quarterly, with the spreadsheet attached.' },
      ],
    },
    process: {
      kicker: 'Signing',
      title: 'From demo to shelf',
      sub: 'Roughly nine months, and we tell you at every stage where it actually is.',
      steps: [
        { title: 'Send it', body: 'Two tracks and no biography. We listen to everything that lands, in the order it arrives.' },
        { title: 'A room', body: 'If it moves us, you get studio time and a month with no deadline attached to it.' },
        { title: 'Cut it', body: 'Mastered for vinyl, test pressings to you, and nothing proceeds until you sign off.' },
        { title: 'Out', body: 'Six weeks of press, one launch night, and the catalogue keeps it in print.' },
      ],
    },
    logos: ['RESIDENT ADVISOR', 'PITCHFORK', 'BOILER ROOM', 'MIXMAG', 'BANDCAMP', 'NTS'],
    iconFeatures: [
      { icon: 'Radio', title: 'Weekly radio', body: 'A two-hour show mining the catalogue and the crates.' },
      { icon: 'Disc3', title: 'Coloured wax', body: 'Short-run vinyl, cut and sleeved by hand.' },
      { icon: 'Headphones', title: 'Mastered twice', body: 'Once for the club, once for the couch.' },
      { icon: 'CalendarDays', title: 'Label nights', body: 'Residencies in three cities and counting.' },
    ],
    gallery: [
      `A glowing liquid light-wave album cover in vivid neon, abstract and futuristic. ${IMG}`,
      `A dark club dancefloor lit by teal and pink lasers, atmospheric. ${IMG}`,
      `A close-up of a colored vinyl record catching neon light. ${IMG}`,
      `A neon-lit DJ booth at night, glowing knobs and faders. ${IMG}`,
    ],
    altRows: [
      { eyebrow: 'The label', title: 'We press what we would play', body: 'Every release is a record we would drop ourselves at 2am. If it does not move the floor, it does not get a catalogue number.', image: `A DJ playing a glowing neon-lit set in a dark club, cinematic. ${IMG}` },
      { eyebrow: 'The artists', title: 'First on every split', body: 'Artists keep the lion’s share and the masters. We are here to press it, push it, and get out of the way.', image: `A music producer at a glowing studio console at night, neon accents. ${IMG}` },
    ],
    bigQuote: { quote: 'The only label whose whole catalogue I buy on sight.', name: 'DJ Verre', role: 'Resident, Basement FM' },
    faq: [
      { q: 'Do you take demos?', a: 'Always. Send a private link, not an attachment, and give us two weeks.' },
      { q: 'Is everything on vinyl?', a: 'Most releases, in short coloured runs, plus lossless digital.' },
      { q: 'Do you book the label nights?', a: 'We do. Join the list for dates and guest slots.' },
      { q: 'Where do you ship?', a: 'Worldwide, from the plant nearest you.' },
    ],
  },

  '02-terra-ceramics': {
    kit: 'soft',
    sections: ['stats', 'about', 'altRows', 'items', 'process', 'iconFeatures', 'gallery', 'pricing', 'testimonials', 'faq', 'band', 'newsletter'],
    process: {
      kicker: 'In the studio',
      title: 'How a pot happens',
      sub: 'Five weeks from wet clay to your table, and most of that is spent waiting.',
      steps: [
        { title: 'Throw', body: 'Stoneware from a quarry in Devon, thrown wet, one at a time, on a kick wheel.' },
        { title: 'Dry slow', body: 'Two weeks under plastic. Rush this and it cracks, so we do not rush it.' },
        { title: 'Bisque', body: 'A first firing to 1,000 degrees, which is where about a tenth of them fail.' },
        { title: 'Glaze and fire', body: 'Dipped by hand, then a long firing to 1,280 with a slow cool for the colour.' },
      ],
    },
    pricing: {
      kicker: 'Classes',
      title: 'Come and make something',
      sub: 'Six wheels, so six people, which is why they book out in a morning.',
      tiers: [
        { name: 'One evening', price: '75 GBP', unit: 'per person', body: 'Three hours, one wheel, everything fired and posted to you afterwards.', includes: ['All clay and glazes', 'Two pieces fired', 'Wine, obviously'], cta: 'Book an evening' },
        { name: 'Six weeks', price: '390 GBP', unit: 'per course', body: 'The proper introduction, from centring to a glazed set you actually use.', includes: ['Six sessions of three hours', 'Ten kilos of clay', 'Open studio on Sundays'], cta: 'Book a course', featured: true },
        { name: 'Studio member', price: '180 GBP', unit: 'per month', body: 'A shelf, a key, and the run of the place outside class hours.', includes: ['Access around the clock', 'Firing at cost', 'Your own shelf and locker'], cta: 'Ask about space' },
      ],
    },
    altRows: [
      { eyebrow: 'On the wheel', title: 'Thrown, trimmed, and glazed by hand', body: 'Every piece is thrown one day and trimmed the next, then dipped by hand in glaze we mix ourselves. The little marks are the maker saying hello.', image: `A potter's hands shaping wet clay on a spinning wheel, warm studio light. ${IMG}` },
      { eyebrow: 'In the kiln', title: 'A slow fire sets the colour', body: 'A long stoneware firing pulls the glaze into its final tone, so the batch shifts gently with the season and the kiln.', image: `Glazed ceramic pieces glowing inside a hot kiln, warm amber light. ${IMG}` },
    ],
    iconFeatures: [
      { icon: 'Palette', title: 'Mixed in-house', body: 'Glazes blended from local mineral oxides.' },
      { icon: 'Flame', title: 'Stoneware fired', body: 'A slow high firing that makes it last.' },
      { icon: 'ShieldCheck', title: 'Food-safe', body: 'Lead-free, dishwasher-friendly glazes.' },
    ],
    gallery: [
      `A ripple bowl in warm terracotta glaze on linen, artisanal ceramics. ${IMG}`,
      `A row of hand-thrown mugs drying on a studio shelf. ${IMG}`,
      `A potter trimming a bowl on the wheel, close-up, warm light. ${IMG}`,
      `A matte dune-toned vase with a single dried stem. ${IMG}`,
    ],
    faq: [
      { q: 'Are the pieces dishwasher safe?', a: 'Yes, though hand-washing keeps the glaze its best.' },
      { q: 'Why does my piece look slightly different?', a: 'Each is thrown and glazed by hand, so no two match exactly.' },
      { q: 'Do you take custom orders?', a: 'For sets of six or more, with a few weeks’ notice.' },
      { q: 'Do you run classes?', a: 'Weekly beginner wheel classes, spots open each season.' },
    ],
  },

  '03-meridian': {
    kit: 'bordered',
    sections: ['logos', 'stats', 'about', 'iconFeatures', 'items', 'specs', 'altRows', 'bigQuote', 'pricing', 'faq', 'band', 'newsletter'],
    specs: {
      kicker: 'The platform',
      title: 'What you are building on',
      sub: 'Figures from the last four quarters, republished on the status page every month.',
      rows: [
        { k: 'Uptime', v: '99.995 percent across twelve months, measured from outside our own network.' },
        { k: 'Latency', v: 'p50 of 41ms and p99 of 210ms, authorisation to response, in every region.' },
        { k: 'Regions', v: 'Nine, active-active. A region can go dark without your traffic noticing.' },
        { k: 'Settlement', v: 'Next business day as standard, same day on request above a threshold.' },
        { k: 'Compliance', v: 'PCI DSS Level 1 and SOC 2 Type II, audited annually by someone we do not pick.' },
        { k: 'Support', v: 'Engineers on the other end, not a script. Median first reply is eleven minutes.' },
      ],
    },
    pricing: {
      kicker: 'Pricing',
      title: 'One rate, on the page',
      sub: 'No enterprise tier hidden behind a sales call. This is the price.',
      tiers: [
        { name: 'Standard', price: '2.4%', unit: 'plus 20p', body: 'Everything switched on from the first transaction.', includes: ['All payment methods', 'Full API and dashboard', 'Next day settlement'], cta: 'Start building' },
        { name: 'Scale', price: '1.9%', unit: 'plus 15p', body: 'From one million a month, applied automatically, no renegotiation.', includes: ['Everything in Standard', 'Same day settlement', 'A named engineer'], cta: 'Talk to us', featured: true },
        { name: 'Platform', price: 'Custom', unit: 'interchange plus', body: 'For marketplaces moving money on behalf of other people.', includes: ['Split payments and payouts', 'Onboarding APIs', 'Dedicated infrastructure'], cta: 'Contact sales' },
      ],
    },
    logos: ['NORTHWIND', 'LUMEN', 'CASCADE', 'OBERON', 'FLEETLY', 'HARBOR'],
    iconFeatures: [
      { icon: 'Code', title: 'One API', body: 'Cards, transfers, and payouts behind a single key.' },
      { icon: 'ShieldCheck', title: 'Compliant', body: 'SOC 2 and PCI handled so you do not have to.' },
      { icon: 'Zap', title: 'Instant payouts', body: 'Move money in forty currencies in seconds.' },
      { icon: 'Layers', title: 'Real ledger', body: 'Double-entry underneath every primitive.' },
    ],
    altRows: [
      { eyebrow: 'The ledger', title: 'Correct by construction', body: 'We start with a double-entry ledger and expose payments on top, so your balances reconcile in real time and an audit is a query.', image: `A clean isometric render of a glowing financial ledger graph, cobalt blue fintech. ${IMG}` },
      { eyebrow: 'The routing', title: 'Every cent takes the best path', body: 'Adaptive routing sends each transaction down the rail most likely to succeed, and retries the smart way when it does not.', image: `An abstract network routing diagram with cyan nodes on deep navy. ${IMG}` },
    ],
    bigQuote: { quote: 'We replaced three vendors and a spreadsheet with one API.', name: 'Priya S.', role: 'CTO, Cascade' },
    faq: [
      { q: 'How long to integrate?', a: 'Sandbox in a minute, production after one review call.' },
      { q: 'What does it cost?', a: 'Usage-based, with volume pricing and no minimums.' },
      { q: 'Is there a real ledger?', a: 'Yes, double-entry, queryable, and correct in real time.' },
      { q: 'Which regions?', a: 'Forty-plus currencies across North America, EU, and APAC.' },
    ],
  },

  '04-verdant': {
    kit: 'soft',
    sections: ['stats', 'about', 'altRows', 'items', 'specs', 'iconFeatures', 'gallery', 'process', 'testimonials', 'band', 'newsletter'],
    specs: {
      kicker: 'Care',
      title: 'What each plant actually needs',
      sub: 'The honest version, rather than a tag that says easy care on everything.',
      rows: [
        { k: 'Light', v: 'Bright indirect means within two metres of a window it can see sky from.' },
        { k: 'Water', v: 'When the top five centimetres are dry. Not Sundays. Plants cannot read a calendar.' },
        { k: 'Humidity', v: 'Most of these want about 50 percent. A grouped shelf beats any amount of misting.' },
        { k: 'Repotting', v: 'Every second spring, one size up. Bigger is not kinder, it just holds water.' },
        { k: 'Feeding', v: 'Half strength, fortnightly, March to September. Nothing at all over winter.' },
        { k: 'If it dies', v: 'Send us a photo within thirty days and we replace it, with no argument.' },
      ],
    },
    process: {
      kicker: 'Delivery',
      title: 'How it reaches you alive',
      sub: 'The part most plant shops would rather not talk about.',
      steps: [
        { title: 'Picked wet', body: 'Watered the night before, so it travels damp rather than soaked, and never dry.' },
        { title: 'Braced', body: 'Root ball bagged, stem cradled in moulded pulp, nothing loose rattling around.' },
        { title: 'Sent Monday', body: 'Only at the start of the week, so nothing sits in a depot over a weekend.' },
        { title: 'Two weeks off', body: 'Leave it somewhere bright and do nothing. Repotting on day one is what kills them.' },
      ],
    },
    altRows: [
      { eyebrow: 'Matched to you', title: 'The right plant for your light', body: 'Tell us which way your windows face and how much sun you get, and we point you to plants that will actually be happy there.', image: `A sunlit windowsill lined with healthy green houseplants, bright and airy. ${IMG}` },
      { eyebrow: 'Delivered thriving', title: 'Potted, watered, ready', body: 'Every plant arrives in peat-free soil, watered and boxed to stand up straight, with a care card in the leaves.', image: `A hand unboxing a potted plant delivered in a cardboard box, fresh green. ${IMG}` },
    ],
    iconFeatures: [
      { icon: 'Leaf', title: 'Light-matched', body: 'A quick quiz points you to plants that suit your space.' },
      { icon: 'Truck', title: 'Next-day local', body: 'Potted and delivered across the city.' },
      { icon: 'MessagesSquare', title: 'Text a botanist', body: 'Real care advice whenever a leaf looks unsure.' },
      { icon: 'Recycle', title: 'Peat-free', body: 'Kinder soil, sturdier roots.' },
    ],
    gallery: [
      `A ZZ plant with glossy leaves in a matte pot, bright airy interior. ${IMG}`,
      `A tall fiddle-leaf fig in a woven basket by a window. ${IMG}`,
      `A cluster of small potted succulents on a shelf. ${IMG}`,
      `A dramatic bird-of-paradise against a pale wall. ${IMG}`,
    ],
    faq: [
      { q: 'What if my plant struggles?', a: 'Our 30-day thrive promise replaces it, no receipt needed.' },
      { q: 'Do you deliver everywhere?', a: 'Next-day within the city, standard shipping nationwide.' },
      { q: 'Are the plants pet-safe?', a: 'Each listing flags pet-safe options clearly.' },
      { q: 'Can I gift a plant?', a: 'Yes, with a hand-written note and gift wrap.' },
    ],
  },

  '05-sunday-press': {
    kit: 'editorial',
    sections: ['logos', 'about', 'items', 'altRows', 'testimonials', 'team', 'gallery', 'pricing', 'faq', 'band', 'newsletter'],
    team: {
      kicker: 'Masthead',
      title: 'Who makes it',
      sub: 'Four of us full time, and about thirty contributors across a year.',
      people: [
        { name: 'Ines Baptista', role: 'Editor', bio: 'Commissions the whole issue and then argues with every word of it.' },
        { name: 'Owen Clarke', role: 'Art director', bio: 'Responsible for the grid, the covers, and the typeface nobody else uses.' },
        { name: 'Halima Sesay', role: 'Features', bio: 'Writes the long one in the middle, usually after three months of reporting.' },
        { name: 'Piet Vos', role: 'Production', bio: 'Gets it to the printer on a Tuesday and to your door on a Sunday.' },
      ],
    },
    pricing: {
      kicker: 'Subscribe',
      title: 'Four issues a year',
      sub: 'No advertising in any of them, which is exactly why it costs what it costs.',
      tiers: [
        { name: 'Digital', price: '24 GBP', unit: 'per year', body: 'The full archive, and each issue the day it goes to press.', includes: ['Every issue since 2019', 'Reader app with no tracking', 'Cancel any time'], cta: 'Subscribe' },
        { name: 'Print', price: '68 GBP', unit: 'per year', body: 'Four issues, posted flat, on paper worth keeping on a shelf.', includes: ['Four printed issues', 'Digital archive included', 'Free postage worldwide'], cta: 'Subscribe', featured: true },
        { name: 'Patron', price: '180 GBP', unit: 'per year', body: 'Funds one commission a year from a writer nobody has published yet.', includes: ['Everything in Print', 'Your name in the back', 'An invitation to the launch'], cta: 'Become a patron' },
      ],
    },
    logos: ['THE VERGE', 'KOTTKE', 'DESIGN MILK', 'IT’S NICE THAT', 'AIGA', 'DENSE DISCOVERY'],
    altRows: [
      { eyebrow: 'The craft', title: 'Long reads, clean type', body: 'We publish one considered issue a month, set in type we actually care about, with nothing between you and the writing.', image: `An elegant editorial magazine spread with bold modernist typography, primary colors. ${IMG}` },
      { eyebrow: 'The model', title: 'Readers, not advertisers', body: 'No ads, no chum, no tracking. Subscriptions keep us independent and the whole archive open forever.', image: `A stack of printed independent magazines on a warm paper desk. ${IMG}` },
    ],
    gallery: [
      `A bold Bauhaus-style poster in red, blue, and yellow geometric shapes. ${IMG}`,
      `A clean flat-lay of a laptop and notebook on a warm desk. ${IMG}`,
      `A geometric paper collage in primary colors. ${IMG}`,
      `An open magazine showing a striking editorial layout. ${IMG}`,
    ],
    faq: [
      { q: 'How often do you publish?', a: 'One full issue a month, plus a short weekly note.' },
      { q: 'Is there a free tier?', a: 'The weekly note is free. Members get the full issue.' },
      { q: 'Do you pay writers?', a: 'Fairly, and we edit generously.' },
      { q: 'Can I read old issues?', a: 'The entire archive is open to everyone.' },
    ],
  },

  '06-zest': {
    kit: 'soft',
    sections: ['stats', 'manifesto', 'iconFeatures', 'items', 'process', 'altRows', 'gallery', 'pricing', 'testimonials', 'faq', 'band', 'newsletter'],
    process: {
      kicker: 'The method',
      title: 'Every recipe, the same shape',
      sub: 'Because the thing that stops you cooking is not skill, it is the deciding.',
      steps: [
        { title: 'Read it once', body: 'One page, no story about a holiday, nothing to scroll past to reach the list.' },
        { title: 'Ten minutes prep', body: 'Everything chopped before anything is hot. It is the only rule that really matters.' },
        { title: 'One pan, high heat', body: 'Most of these are twelve minutes on the hob, and none of them need a thermometer.' },
        { title: 'Acid at the end', body: 'Lemon, vinegar, or pickle liquid. That is the whole trick, and it costs nothing.' },
      ],
    },
    pricing: {
      kicker: 'Membership',
      title: 'Or just cook for free',
      sub: 'Half of everything we publish stays open, permanently, with no wall on it.',
      tiers: [
        { name: 'Free', price: '0 GBP', unit: 'forever', body: 'Two new recipes a week and the whole basics section.', includes: ['Two recipes weekly', 'Every technique guide', 'No account needed'], cta: 'Start cooking' },
        { name: 'Member', price: '5 GBP', unit: 'per month', body: 'Everything, plus the shopping list that actually adds up.', includes: ['The full archive', 'Shopping lists built for you', 'Seasonal meal plans'], cta: 'Join', featured: true },
        { name: 'Household', price: '40 GBP', unit: 'per year', body: 'Up to five people, one bill, lists shared across everyone phones.', includes: ['Everything in Member', 'Five accounts', 'One shared weekly plan'], cta: 'Join' },
      ],
    },
    manifesto: { kicker: 'The Zest rule', text: 'If a tired person cannot cook it on a Tuesday, it does not go in the box. Short lists, big flavour, every time.' },
    iconFeatures: [
      { icon: 'Timer', title: '30 minutes', body: 'Most recipes, start to plate, in half an hour.' },
      { icon: 'Flame', title: 'One pan', body: 'Less washing up, more eating.' },
      { icon: 'Salad', title: 'Ten ingredients', body: 'Things you can actually find, nothing obscure.' },
    ],
    altRows: [
      { eyebrow: 'Tested', title: 'Cooked until a beginner can nail it', body: 'Every recipe gets made again and again until the steps are foolproof and the timing is honest.', image: `A bright overhead shot of a colorful fresh weeknight dinner in a bowl. ${IMG}` },
      { eyebrow: 'Fast', title: 'Built for a real weeknight', body: 'Short ingredient lists, short cook times, and a timer baked into every step so nothing burns.', image: `A skillet of vibrant vegetables sizzling on a stovetop, bright and fresh. ${IMG}` },
    ],
    gallery: [
      `A vibrant chili-lime corn bowl, appetizing overhead food photo. ${IMG}`,
      `A skillet of blistered tomato orzo with basil. ${IMG}`,
      `A bowl of glossy sesame crunch noodles with scallions. ${IMG}`,
      `Charred broccoli tacos on a bright plate. ${IMG}`,
    ],
    faq: [
      { q: 'How does the box work?', a: 'A recipe lands in your inbox every weekday afternoon.' },
      { q: 'Can I filter for diet?', a: 'Yes, vegetarian, vegan, and quick filters on everything.' },
      { q: 'Do I need special equipment?', a: 'A pan, a pot, and a knife. That is the whole kit.' },
      { q: 'Is it free?', a: 'The weekday recipe is free. Members get the full archive.' },
    ],
  },

  '07-nocturne': {
    kit: 'minimal',
    sections: ['manifesto', 'about', 'items', 'specs', 'altRows', 'bigQuote', 'iconFeatures', 'process', 'gallery', 'faq', 'band', 'newsletter'],
    specs: {
      kicker: 'Composition',
      title: 'What is in the bottle',
      sub: 'The full pyramid and the concentration, printed on every carton.',
      rows: [
        { k: 'Concentration', v: 'Extrait at 24 percent. It lasts because of the oil load, not because of a fixative.' },
        { k: 'Top', v: 'Bergamot, pink pepper, and a green note lifted from crushed fig leaf.' },
        { k: 'Heart', v: 'Orris butter, jasmine absolute, and a small amount of leather underneath.' },
        { k: 'Base', v: 'Sandalwood, ambrette seed, and vetiver from a single farm in Haiti.' },
        { k: 'Naturals', v: 'Eighty-two percent by weight. The rest is there because nature cannot do it safely.' },
        { k: 'Maceration', v: 'Six weeks in steel before bottling. Nothing ships the week it was mixed.' },
      ],
    },
    process: {
      kicker: 'The making',
      title: 'One perfumer, four years',
      sub: 'Not a brief sent out to a fragrance house. It was made in the room next door.',
      steps: [
        { title: 'The idea', body: 'A city at two in the morning, and the specific kind of quiet that comes with it.' },
        { title: 'Four hundred trials', body: 'Numbered, dated, and kept. Trial 61 and trial 388 are both in the final.' },
        { title: 'Live with it', body: 'Six months of wearing the shortlist before anything was called finished.' },
        { title: 'Bottle small', body: 'Batches of nine hundred, poured and labelled by hand, every one numbered.' },
      ],
    },
    manifesto: { kicker: 'The house', text: 'A perfume should change as the night does. We compose in a few notes, held in balance, that unfold for hours.' },
    altRows: [
      { eyebrow: 'The composition', title: 'Built around one accord', body: 'Each scent begins with a single idea and a few materials, layered so it opens, turns, and settles like a piece of music.', image: `A dark still life of a faceted perfume bottle among night flowers, deep violet. ${IMG}` },
      { eyebrow: 'The maturation', title: 'Rested before it is bottled', body: 'Every batch sits for weeks so the materials marry, then it is decanted into refillable glass by hand.', image: `A perfumer's dim atelier with amber bottles and a single lamp, moody violet. ${IMG}` },
    ],
    bigQuote: { quote: 'It smells like a memory I have not made yet.', name: 'Iris N.', role: 'Client' },
    iconFeatures: [
      { icon: 'Moon', title: 'Composed for night', body: 'Deeper materials that speak after dark.' },
      { icon: 'FlaskConical', title: 'Extrait strength', body: 'High concentration, long on the skin.' },
      { icon: 'Recycle', title: 'Refillable glass', body: 'Bring the bottle back, we fill it again.' },
    ],
    gallery: [
      `A faceted perfume bottle glowing amethyst on black velvet, luxurious. ${IMG}`,
      `A dark arrangement of night-blooming flowers, deep purple. ${IMG}`,
      `A minimalist flacon backlit in soft violet haze. ${IMG}`,
      `A close-up of perfume being sprayed, a fine violet mist. ${IMG}`,
    ],
    faq: [
      { q: 'How long does it last?', a: 'Our extraits sit close to the skin for eight hours or more.' },
      { q: 'Can I try before buying?', a: 'The discovery set holds three, redeemable against a bottle.' },
      { q: 'Do you refill?', a: 'Bring any Nocturne bottle back for a refill at a lower price.' },
      { q: 'Are they vegan?', a: 'Fully vegan and never tested on animals.' },
    ],
  },

  '08-shoreline': {
    kit: 'minimal',
    sections: ['stats', 'about', 'items', 'process', 'altRows', 'iconFeatures', 'bigQuote', 'gallery', 'team', 'faq', 'band', 'newsletter'],
    process: {
      kicker: 'Working together',
      title: 'How a house gets built',
      sub: 'Two to three years, and we are there for the whole of it.',
      steps: [
        { title: 'The site', body: 'A day on the land in every weather we can catch, before a single line is drawn.' },
        { title: 'Sketch', body: 'Card models at 1:100. Cheap to change now, extremely expensive to change later.' },
        { title: 'Consent', body: 'We take the planning fight so you do not have to. Coastal sites are never simple.' },
        { title: 'On site', body: 'Weekly visits through the build, and we snag it ourselves before you ever see it.' },
      ],
    },
    team: {
      kicker: 'The practice',
      title: 'Who you will work with',
      sub: 'Nine people, and the person who draws it is the person you meet.',
      people: [
        { name: 'Elin Vasser', role: 'Founding partner', bio: 'Twenty years of coastal work and a stubborn dislike of the word seamless.' },
        { name: 'Rhys Ostrander', role: 'Partner', bio: 'Runs the technical side and knows what salt air does to every fixing we specify.' },
        { name: 'Aoife Brennan', role: 'Associate', bio: 'Leads the housing work and the practice research into coastal erosion.' },
        { name: 'Sam Iwu', role: 'Project architect', bio: 'On site more than in the studio, which is how the details survive the build.' },
      ],
    },
    altRows: [
      { eyebrow: 'The site', title: 'We walk the land first', body: 'Every project starts on the ground at different tides and times of day. The building follows the light and the weather, not the other way round.', image: `An architect walking a windswept coastal site at golden hour, wide and calm. ${IMG}` },
      { eyebrow: 'The materials', title: 'Chosen to grey gracefully', body: 'Timber, stone, and lime that weather into the coast instead of fighting it, and ask little of the years.', image: `A close-up of weathered timber cladding on a coastal house, soft grey light. ${IMG}` },
    ],
    iconFeatures: [
      { icon: 'Wind', title: 'Built for weather', body: 'Low, sheltering forms that hold the wind.' },
      { icon: 'Sun', title: 'Planned for light', body: 'Rooms placed where the light lands.' },
      { icon: 'Compass', title: 'Site-led', body: 'Every design begins on the land.' },
      { icon: 'Ruler', title: 'Low-energy', body: 'Fabric-first, quiet on running costs.' },
    ],
    bigQuote: { quote: 'They gave us a house that feels like the coast itself.', name: 'The Aldous family', role: 'Salt House' },
    gallery: [
      `A low-slung timber coastal house against a grey sky, calm architecture. ${IMG}`,
      `A minimalist dune pavilion with glass facing the sea. ${IMG}`,
      `A stone harbourside building at dusk with deep window reveals. ${IMG}`,
      `An interior with a large window framing the ocean, soft light. ${IMG}`,
    ],
    faq: [
      { q: 'Where do you work?', a: 'Coastlines, mostly. We travel for the right project.' },
      { q: 'Do you do renovations?', a: 'Yes, alongside new-builds and civic work.' },
      { q: 'How do fees work?', a: 'A percentage of build cost, staged by RIBA work stage.' },
      { q: 'How long does a house take?', a: 'Typically eighteen months from first sketch to keys.' },
    ],
  },

  '09-pixel-playhouse': {
    kit: 'brutal',
    sections: ['stats', 'iconFeatures', 'items', 'specs', 'gallery', 'altRows', 'bigQuote', 'team', 'faq', 'band', 'newsletter'],
    specs: {
      kicker: 'The game',
      title: 'What you are buying',
      sub: 'Everything on this page is what ships. No roadmap, no season pass, no later.',
      rows: [
        { k: 'Length', v: 'Twelve to fifteen hours, plus a post-game that is genuinely optional.' },
        { k: 'Platforms', v: 'PC, Mac, Linux, and Switch, all on the same day, with cross save across them.' },
        { k: 'Price', v: 'Twenty dollars, once. No microtransactions, and we will not be adding any.' },
        { k: 'Offline', v: 'The whole game runs with no connection, and no account is required to play it.' },
        { k: 'Accessibility', v: 'Full remapping, colourblind palettes, and a mode with no fail state at all.' },
        { k: 'Mod tools', v: 'The level editor we built it in ships with the game, free, on day one.' },
      ],
    },
    team: {
      kicker: 'The studio',
      title: 'All six of us',
      sub: 'No publisher, nothing outsourced, and everyone here shipped this thing.',
      people: [
        { name: 'Bex Nowak', role: 'Director', bio: 'Designed the levels and wrote most of the dialogue, then rewrote all of it.' },
        { name: 'Tunde Alabi', role: 'Engine', bio: 'Built the renderer that makes 32 by 32 sprites look the way they do.' },
        { name: 'Ivy Chen', role: 'Art', bio: 'Every sprite, every tile, and every frame of the animation.' },
        { name: 'Marek Dolny', role: 'Audio', bio: 'Composed the score on hardware older than most of the team.' },
      ],
    },
    stats: [{ n: '3', l: 'Friends' }, { n: '4', l: 'Games shipped' }, { n: '0', l: 'Crunch weeks' }],
    iconFeatures: [
      { icon: 'Gamepad2', title: 'Cozy by design', body: 'Short sessions that respect your evening.' },
      { icon: 'Heart', title: 'Demo first', body: 'Every game ships a demo before it asks for a cent.' },
      { icon: 'Music', title: 'Free soundtracks', body: 'Every score up on Bandcamp, name your price.' },
      { icon: 'Sparkles', title: 'Built in the open', body: 'Devlogs every Friday, no exceptions.' },
    ],
    gallery: [
      `A cozy pixel-art town at dusk with glowing streetlights, warm vaporwave pinks. ${IMG}`,
      `A neon rooftop delivery scene in pixel art, night city with pink and blue glow. ${IMG}`,
      `A colorful pixel-art coral reef aquarium scene, pastel vaporwave. ${IMG}`,
      `A retro falling-blocks arcade game screen in vivid neon. ${IMG}`,
    ],
    altRows: [
      { eyebrow: 'The studio', title: 'Three friends, no publisher', body: 'We make the games we want to come home to. Warm, weird, and never in a hurry, funded by the players who love them.', image: `A cozy indie game studio room with pixel-art posters and warm lamps, night. ${IMG}` },
      { eyebrow: 'The vibe', title: 'No crunch, just vibes', body: 'We ship when it is ready and rest when it is not. Turns out you can make good games and sleep too.', image: `A relaxed desk with a handheld console and a warm mug at night, cozy glow. ${IMG}` },
    ],
    bigQuote: { quote: 'The comfort food of video games. I adore it.', name: 'pixelfox', role: 'Player' },
    faq: [
      { q: 'What platforms?', a: 'PC and Mac now, Switch for the next one.' },
      { q: 'Is there a demo?', a: 'Always, on the store page before you buy.' },
      { q: 'Where is the soundtrack?', a: 'On Bandcamp, name your price, all of it to the composer.' },
      { q: 'Can I follow development?', a: 'Devlogs land every Friday, join the list.' },
    ],
  },

  '10-roast-and-co': {
    kit: 'bordered',
    sections: ['stats', 'about', 'altRows', 'items', 'specs', 'iconFeatures', 'gallery', 'pricing', 'testimonials', 'faq', 'band', 'newsletter'],
    specs: {
      kicker: 'The roast',
      title: 'What is on the bag',
      sub: 'If a roaster will not print this, there is usually a reason for it.',
      rows: [
        { k: 'Roast date', v: 'Printed, not a best before. Everything ships within four days of roasting.' },
        { k: 'Price paid', v: 'The farmgate price per kilo, on every bag. It averages 2.7 times the fair trade floor.' },
        { k: 'Producer', v: 'Named farm or co-op, altitude, and varietal. No blends sold as single origins.' },
        { k: 'Roast level', v: 'A measured number rather than the word medium. Most of ours sit between 58 and 72.' },
        { k: 'Process', v: 'Washed, natural, or honey, stated plainly, with fermentation time where we know it.' },
        { k: 'Packaging', v: 'Home compostable, with a valve that composts too, which was the hard part.' },
      ],
    },
    pricing: {
      kicker: 'Subscriptions',
      title: 'Coffee that turns up',
      sub: 'Change the grind, skip a week, or stop entirely from the email itself.',
      tiers: [
        { name: 'One bag', price: '13 GBP', unit: 'every two weeks', body: 'A 250 gram bag of whatever we are most excited about that week.', includes: ['Roasted to order', 'Free postage', 'Skip or pause any time'], cta: 'Start a subscription' },
        { name: 'Two bags', price: '24 GBP', unit: 'every two weeks', body: 'One for filter and one for espresso, or two of the same.', includes: ['Two 250 gram bags', 'Choose your grind', 'First pick of the micro lots'], cta: 'Start a subscription', featured: true },
        { name: 'Office', price: '90 GBP', unit: 'per week', body: 'Two kilos a week, and we come and dial in your grinder.', includes: ['Two kilos weekly', 'Grinder setup and servicing', 'Barista training for the team'], cta: 'Talk to us' },
      ],
    },
    altRows: [
      { eyebrow: 'At the source', title: 'Bought from farms we visit', body: 'We buy small lots direct from growers we know by name, and pay above the fair-trade floor because a good coffee starts long before the roast.', image: `A coffee farmer holding fresh red coffee cherries on a highland farm, warm light. ${IMG}` },
      { eyebrow: 'At the roastery', title: 'Roasted the day before it ships', body: 'Small batches, dialled in for each lot, roasted the day before dispatch so it reaches your kitchen at its peak.', image: `Coffee beans tumbling in a drum roaster with warm glow, cozy roastery. ${IMG}` },
    ],
    iconFeatures: [
      { icon: 'Coffee', title: 'Roasted to order', body: 'Every bag leaves within 24 hours.' },
      { icon: 'MapPin', title: 'Traceable lots', body: 'Farm, altitude, and process on every bag.' },
      { icon: 'Truck', title: 'Direct trade', body: 'Long relationships, prices above the floor.' },
    ],
    gallery: [
      `A bag of single-origin beans spilling onto burlap, warm espresso tones. ${IMG}`,
      `A pour-over setup with rich crema in soft window light. ${IMG}`,
      `Glossy roasted coffee beans piled close-up with warm highlights. ${IMG}`,
      `A barista weighing beans on a scale at a wooden counter. ${IMG}`,
    ],
    faq: [
      { q: 'How fresh is it?', a: 'Roasted to order and shipped within a day of roasting.' },
      { q: 'How does a subscription work?', a: 'Pick a cadence and a roast style, pause any time.' },
      { q: 'Whole bean or ground?', a: 'Either, ground to your brew method if you like.' },
      { q: 'Do you do wholesale?', a: 'Yes, for cafes and offices, get in touch.' },
    ],
  },
};
