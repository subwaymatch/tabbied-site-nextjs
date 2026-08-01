// Extra content for the React showcase sites, so each reads as a full,
// well-structured single-page website rather than a single hero. Kept in its
// own module (keyed by slug) so showcaseData.ts stays focused on identity and
// theming. `images` maps each item's seed to a text-to-image prompt: the cards
// render an image placeholder that shows the prompt, ready to generate a raster
// image to drop in (see https://developers.openai.com/api/docs/models/gpt-image-2).

export type ShowcaseContent = {
  about: {
    eyebrow: string;
    title: string;
    body: string[];
    points: string[];
  };
  features: { title: string; body: string }[];
  testimonials: { quote: string; name: string; role: string }[];
  newsletter: { title: string; body: string; cta: string; placeholder: string };
  /** item.seed -> text-to-image prompt for that card's placeholder image. */
  images: Record<string, string>;
  /**
   * The about section's art panel. Without it the panel falls back to the
   * site's artwork, which reads as decoration next to copy that is making a
   * specific claim — an image that answers the copy does more work.
   */
  aboutImage?: string;
};

const IMG =
  'Square product photograph, soft natural studio light, shallow depth of field, high detail, no text. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.';

export const SHOWCASE_CONTENT: Record<string, ShowcaseContent> = {
  solstice: {
    about: {
      eyebrow: 'The Solstice way',
      title: 'A week built around slowing down',
      body: [
        'Every retreat follows the light. Mornings open with breath and movement on the deck, afternoons are yours for the trail or the tide, and evenings close with a long, quiet practice as the sun goes down.',
        'Groups stay small on purpose. With twelve guests and two teachers, nobody is a face in a crowd, and every practice can bend to the room in front of it.',
      ],
      points: [
        'Two daily practices, all levels welcome',
        'Chef-cooked plant-forward meals',
        'Ocean-view rooms, no shared bunks',
      ],
    },
    features: [
      { title: 'Arrive', body: 'A slow first evening: settle in, meet your teachers, unclench.' },
      { title: 'Unwind', body: 'Five days of movement, breath, sea air, and nowhere to be.' },
      { title: 'Carry it home', body: 'A simple practice you can keep long after the drive back.' },
    ],
    testimonials: [
      { quote: 'I came back a different person. Slower, in the best way.', name: 'Priya N.', role: 'Spring 2025 guest' },
      { quote: 'The smallest group I have ever practiced with, and the warmest.', name: 'Daniel R.', role: 'Autumn 2025 guest' },
    ],
    newsletter: {
      title: 'Dates before anyone else',
      body: 'Join the list for 2026 openings and the occasional day-retreat near you.',
      cta: 'Keep me posted',
      placeholder: 'you@email.com',
    },
    images: {
      sol1: `A serene coastal yoga deck at sunrise overlooking the Pacific, a single rolled mat, warm dawn light. ${IMG}`,
      sol2: `A misty redwood clearing with soft golden light through the trees, calm and meditative. ${IMG}`,
      sol3: `An amber-lit evening meditation space with floor cushions and low candles, warm dusk tones. ${IMG}`,
    },
  },

lumen: {
    about: {
      eyebrow: 'Why Lumen',
      title: 'Three days at the edge of the field',
      body: [
        'Lumen is where designers, engineers, and artists compare notes on what is actually next. Two stages of talks, a day of hands-on labs, and a whole waterfront to keep talking after hours.',
        'No filler keynotes and no sales pitches from the stage. Just people who make things, showing the room how and why.',
      ],
      points: [
        'Sixty speakers across two stages',
        'A full day of small-group labs',
        'One pass, every session and workshop',
      ],
    },
    features: [
      { title: 'Talks', body: 'Sharp, twenty-minute sessions with no wasted slide.' },
      { title: 'Labs', body: 'Build something real in a room of twenty, not two thousand.' },
      { title: 'After hours', body: 'The hallway track, moved to a rooftop over the harbour.' },
    ],
    testimonials: [
      { quote: 'The rare conference where the hallway is as good as the stage.', name: 'Ana R.', role: '2025 speaker' },
      { quote: 'I left with three collaborators and a full notebook.', name: 'Kwame B.', role: '2025 attendee' },
    ],
    newsletter: {
      title: 'Program drops first here',
      body: 'Get speaker announcements and the schedule before the general reveal.',
      cta: 'Notify me',
      placeholder: 'you@email.com',
    },
    images: {
      lum1: `A designer on a dark conference stage lit by vivid magenta and cyan light, bold and cinematic. ${IMG}`,
      lum2: `An attentive audience in a modern auditorium bathed in electric blue stage light. ${IMG}`,
      lum3: `A design workshop table with open laptops, colour swatch fans and sticky notes under bright neon accent lighting. ${IMG}`,
    },
  },

  fathom: {
    about: {
      eyebrow: 'How we work',
      title: 'Open science, from surface to seabed',
      body: [
        'Fathom funds expeditions and publishes every reading the moment it is verified. No paywall, no embargo, just open data anyone can build on.',
        'We are a small nonprofit that partners with research vessels and coastal universities, turning ship time into datasets the whole field can use.',
      ],
      points: [
        'Every reading published under an open license',
        'Grants that put students on the water',
        'Tools and datasets free to reuse',
      ],
    },
    features: [
      { title: 'Fund', body: 'Members and grants put working scientists on real expeditions.' },
      { title: 'Measure', body: 'Standardised sensors from the surface down to a thousand metres.' },
      { title: 'Publish', body: 'Clean, documented datasets, open to anyone the day they land.' },
    ],
    testimonials: [
      { quote: 'Their open data saved my lab a year of fieldwork.', name: 'Dr. Lena S.', role: 'Marine biologist' },
      { quote: 'Rigorous science, and generous with every byte of it.', name: 'Prof. Idris M.', role: 'Oceanography' },
    ],
    newsletter: {
      title: 'Field notes from the deep',
      body: 'A monthly dispatch on new datasets, expeditions, and what we are finding.',
      cta: 'Subscribe',
      placeholder: 'you@email.com',
    },
    images: {
      fat1: `Bioluminescent creatures in the deep ocean twilight zone, teal and gold on near-black water. ${IMG}`,
      fat2: `A vivid coral reef survey with a diver's slate, bright teal water and yellow tape measure. ${IMG}`,
      fat3: `The edge of Arctic sea ice meeting dark cold water, pale mint and deep navy, stark and clean. ${IMG}`,
    },
  },

  'ember-and-oak': {
    aboutImage:
      'A wood-fired hearth burning low in a restaurant kitchen, split oak stacked beside it, glowing coals and warm firelight on stone. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
    about: {
      eyebrow: 'The hearth',
      title: 'One fire, and a menu that follows it',
      body: [
        'Everything at Ember & Oak meets the flame. A single wood-fired hearth anchors the room, and the menu changes with whatever the fire and the market give us that week.',
        'Sit close and watch the coals, or take the far banquette and let the smoke find you. Either way, dinner starts at the fire.',
      ],
      points: [
        'Live-fire kitchen, oak and fruitwood only',
        'A menu rewritten with the seasons',
        'Counter seats facing the hearth',
      ],
    },
    features: [
      { title: 'Wood', body: 'Oak for heat, fruitwood for the finish, nothing from a bottle.' },
      { title: 'Season', body: 'We cook what the market has this morning, not what a printer set last month.' },
      { title: 'The counter', body: 'Eight seats at the pass, the best show in the house.' },
    ],
    testimonials: [
      { quote: 'You taste the smoke in everything, and you never want it to stop.', name: 'Sofia D.', role: 'Diner' },
      { quote: 'The rib alone is worth the reservation scramble.', name: 'Marcus T.', role: 'Food critic' },
    ],
    newsletter: {
      title: 'This week at the hearth',
      body: 'Tonight-only specials and the odd last-minute counter seat, straight to your inbox.',
      cta: 'Pull up a chair',
      placeholder: 'you@email.com',
    },
    images: {
      emb1: `A charred whole leek plated with ember cream and hazelnut, dark moody restaurant lighting. ${IMG}`,
      emb2: `A wood-fired dry-aged rib chop resting over glowing coals, deep amber firelight. ${IMG}`,
      emb3: `A smoked pear dessert with burnt honey cream on dark ceramic, warm low light. ${IMG}`,
    },
  },

  'petal-and-post': {
    aboutImage:
      'A florist and letterpress workbench from above, fresh cut stems, brown paper and a stack of pressed cards in soft pinks. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
    about: {
      eyebrow: 'In the studio',
      title: 'Flowers and paper, made by hand',
      body: [
        'We arrange with whatever is best at the market that morning and press our cards one sheet at a time on a hundred-year-old letterpress. The whole gesture, wrapped and ready to send.',
        'Half florist, half print shop, entirely a two-person studio that answers its own emails.',
      ],
      points: [
        'Market-fresh stems, cut that morning',
        'Letterpress cards printed in-house',
        'Same-day delivery across the city',
      ],
    },
    features: [
      { title: 'Choose', body: 'Pick a bouquet by feeling, we handle the flowers in season.' },
      { title: 'Pair it', body: 'Add a hand-pressed card, blank or with a line from you.' },
      { title: 'Send', body: 'We wrap it and cycle it over, often the very same day.' },
    ],
    testimonials: [
      { quote: 'The card was as beautiful as the flowers. Nobody does both this well.', name: 'Grace H.', role: 'Customer' },
      { quote: 'My go-to for every apology and every celebration.', name: 'Owen P.', role: 'Regular' },
    ],
    newsletter: {
      title: 'What is blooming',
      body: 'A little Friday note on the week ahead: new stems, new cards, seasonal boxes.',
      cta: 'Join the list',
      placeholder: 'you@email.com',
    },
    images: {
      pet1: `A soft blush bouquet of ranunculus and sweet pea wrapped in kraft paper, bright airy studio. ${IMG}`,
      pet2: `A bright coral arrangement of dahlias and cosmos in a ceramic vase, cheerful daylight. ${IMG}`,
      pet3: `A pale pastel bunch of peonies and astilbe beside a letterpress card, gentle morning light. ${IMG}`,
    },
  },

  northwind: {
    aboutImage:
      'A tall rack of technical outdoor jackets in a workshop, taped seams and spare hardware laid out on the bench beside it. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
    about: {
      eyebrow: 'Built to last',
      title: 'Overbuilt on purpose',
      body: [
        'We make fewer things and make them tougher. Every layer is field-tested above the treeline and backed for life, because the best gear is the gear you never have to replace.',
        'When something does wear out, we fix it. Send it in, we patch it and send it back, no receipt required.',
      ],
      points: [
        'Guaranteed for life, repairs included',
        'Recycled and bluesign shells',
        'Tested by the people who design it',
      ],
    },
    features: [
      { title: 'Shells', body: 'Three-layer waterproofs that shrug off a full day of weather.' },
      { title: 'Insulation', body: 'Responsibly sourced down that packs to nothing and holds heat.' },
      { title: 'Repairs', body: 'Free patches for life, so a jacket outlives a decade of trips.' },
    ],
    testimonials: [
      { quote: 'Six winters in and it looks better than my newer jackets.', name: 'Rowan A.', role: 'Alpinist' },
      { quote: 'They repaired a tear for free, ten years after I bought it.', name: 'Kai M.', role: 'Guide' },
    ],
    newsletter: {
      title: 'Field notes',
      body: 'New gear, restocks, and repair tips, about one email a month.',
      cta: 'Sign me up',
      placeholder: 'you@email.com',
    },
    images: {
      nor1: `A three-layer hardshell mountaineering jacket on a rocky alpine ridge, dramatic overcast light. ${IMG}`,
      nor2: `A packable green down jacket compressed beside a summit backdrop, crisp cold daylight. ${IMG}`,
      nor3: `A folded merino base layer on weathered wood, soft even studio light, earthy tones. ${IMG}`,
    },
  },

  honeycomb: {
    about: {
      eyebrow: 'For grown-ups',
      title: 'Screen time you can feel good about',
      body: [
        'Honeycomb teaches reading and early math in five-minute bursts that adapt to your child. Every game gets a little harder as they get a little better, so it always feels like play, never a worksheet.',
        'No ads, no chat, no surprise purchases. Just a friendly little world that grows with them.',
      ],
      points: [
        'Adapts to each child automatically',
        'Five-minute lessons, easy to stop',
        'No ads and nothing to buy inside',
      ],
    },
    features: [
      { title: 'Play', body: 'Bright games that sneak the learning in behind the fun.' },
      { title: 'Adapt', body: 'Every right answer nudges the next question just far enough.' },
      { title: 'Track', body: 'A simple weekly note for parents, no dashboards to decode.' },
    ],
    testimonials: [
      { quote: 'My daughter asks to do her lesson. I still cannot believe it.', name: 'Nadia F.', role: 'Parent of two' },
      { quote: 'Finally an app I do not have to police for junk.', name: 'Sam O.', role: 'Dad' },
    ],
    newsletter: {
      title: 'Little wins, in your inbox',
      body: 'Parenting-friendly tips and new activity packs, roughly monthly.',
      cta: 'Start learning',
      placeholder: 'you@email.com',
    },
    images: {
      hon1: `A cheerful cartoon meadow scene with friendly bees among rounded honeycomb tiles, warm honey-gold palette. Absolutely no text, letters, words, numbers or logos appear anywhere in the image — no lettering on any object, sign, page or screen. ${IMG}`,
      hon2: `A playful counting game with a honeycomb and cartoon bees, bright sunny yellows. ${IMG}`,
      hon3: `A colorful pattern-matching puzzle grove for kids, rounded shapes, warm gold tones. ${IMG}`,
    },
  },

  facet: {
    aboutImage:
      'A jeweller\'s bench in low warm light, loupe, gravers and a single gold ring on a leather pad. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
    about: {
      eyebrow: 'The house',
      title: 'One remarkable stone at a time',
      body: [
        'Every Facet piece is built around a single stone we can trace to the mine that cut it. We set it by hand, in gold or platinum, to be worn for decades and handed down after that.',
        'Come with a stone of your own or start with a spark of an idea, and we will design the rest together.',
      ],
      points: [
        'Ethically sourced, fully traceable stones',
        'Hand-set in solid gold and platinum',
        'Bespoke commissions welcome',
      ],
    },
    features: [
      { title: 'Source', body: 'Stones with a name and an origin, never a mystery lot.' },
      { title: 'Design', body: 'A setting drawn around your stone, not pulled from a tray.' },
      { title: 'Keep', body: 'Made to outlast trends, and us, with lifetime care.' },
    ],
    testimonials: [
      { quote: 'They turned my grandmother’s stone into something I will never take off.', name: 'Eleanor V.', role: 'Bespoke client' },
      { quote: 'Quietly the finest setting work I have seen.', name: 'Jonas W.', role: 'Collector' },
    ],
    newsletter: {
      title: 'First look at new pieces',
      body: 'Occasional previews of new collections and one-of-a-kind stones.',
      cta: 'Request an invite',
      placeholder: 'you@email.com',
    },
    images: {
      fac1: `A sapphire solitaire ring in 18k gold on black velvet, jewel-toned reflections, macro detail. ${IMG}`,
      fac2: `A tourmaline drop pendant on platinum against deep midnight blue, sparkling facets. ${IMG}`,
      fac3: `A diamond band in rose gold catching prismatic light on dark stone, elegant macro. ${IMG}`,
    },
  },

  seabright: {
    aboutImage:
      'A row of pale skincare bottles on wet coastal stone, sea mist and soft grey daylight behind them. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
    about: {
      eyebrow: 'Our promise',
      title: 'Kind to your skin and the water',
      body: [
        'Seabright formulas are short, mineral-rich, and reef-safe. We leave out synthetic fragrance and anything that should not wash into the sea, and make each batch on the coast we are trying to protect.',
        'Fewer ingredients, chosen carefully, so sensitive skin and the shoreline both come out ahead.',
      ],
      points: [
        'Nine ingredients or fewer per formula',
        'No synthetic fragrance, ever',
        'Reef-safe and cruelty-free',
      ],
    },
    features: [
      { title: 'Cleanse', body: 'A gentle sea-kelp gel that never leaves skin tight.' },
      { title: 'Treat', body: 'Mineral serum with the actives and none of the filler.' },
      { title: 'Protect', body: 'A non-nano mineral SPF that the reef can live with.' },
    ],
    testimonials: [
      { quote: 'The first routine my reactive skin has ever actually liked.', name: 'Amara J.', role: 'Customer' },
      { quote: 'Clean in the way that word should have always meant.', name: 'Nils E.', role: 'Customer' },
    ],
    newsletter: {
      title: 'The tide guide',
      body: 'Simple skincare notes and restock alerts, a couple of times a month.',
      cta: 'Join in',
      placeholder: 'you@email.com',
    },
    images: {
      sea1: `A frosted glass bottle of sea-kelp cleansing gel on wet stone, pale seaglass green, coastal light. ${IMG}`,
      sea2: `A dropper of mineral serum over a tide pool background, cool teal and slate tones. ${IMG}`,
      sea3: `A tube of mineral SPF on smooth beach pebbles, soft overcast coastal daylight, muted greens. ${IMG}`,
    },
  },

  // ---- Ported from the static-HTML samples (sites 1-10) ----
  'aurora-sound': {
    about: {
      eyebrow: 'The label',
      title: 'Records made to glow in the dark',
      body: [
        'Aurora Sound is a small crew of producers, cutters, and DJs who care as much about the sleeve as the mix. Every release is mastered twice, once for the club and once for the couch.',
        'We press short runs on coloured wax, ship worldwide, and put the artist first on every split.',
      ],
      points: ['Vinyl and lossless digital', 'Artist-first splits', 'Mastered for club and headphones'],
    },
    features: [
      { title: 'Sign', body: 'We chase sounds, not follower counts, and give new artists room to grow.' },
      { title: 'Press', body: 'Short-run coloured vinyl, cut and sleeved by people who love it.' },
      { title: 'Play', body: 'Label nights and a weekly radio show that keeps the catalogue alive.' },
    ],
    testimonials: [
      { quote: 'The only label whose whole catalogue I buy on sight.', name: 'DJ Verre', role: 'Resident, Basement FM' },
      { quote: 'They treated my first EP like it mattered. It did.', name: 'S U N J A', role: 'Artist' },
    ],
    newsletter: {
      title: 'Never miss a drop',
      body: 'New releases, label nights, and the odd unreleased edit, straight to your inbox.',
      cta: 'Join the list',
      placeholder: 'you@email.com',
    },
    images: {
      r1: 'A moody album cover render of glowing liquid light waves in vivid neon, abstract and futuristic. Soft natural studio light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      r2: 'An abstract electronic album cover of soft glowing gradients and grain, calm and dreamy. Soft natural studio light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      r3: 'A neon-lit album cover of a single glowing orb over dark water, cinematic and atmospheric. Soft natural studio light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
    },
  },

meridian: {
    aboutImage:
      'An abstract 3D render of layered translucent panels and fine connecting lines over deep navy, cool and technical, no interface or screen anywhere. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
    about: {
      eyebrow: 'Why Meridian',
      title: 'A real ledger under every primitive',
      body: [
        'Most stacks bolt accounting on at the end. Meridian starts with a correct, double-entry ledger and exposes cards, transfers, and payouts on top of it.',
        'That means your balances reconcile in real time, and an audit is a query, not a project.',
      ],
      points: ['Double-entry by default', 'Programmable payouts', 'SOC 2 and PCI ready'],
    },
    features: [
      { title: 'Integrate', body: 'Sandbox keys in a minute, production access after one review call.' },
      { title: 'Route', body: 'Send each transaction down the path most likely to succeed.' },
      { title: 'Reconcile', body: 'Every movement lands in a ledger you can actually query.' },
    ],
    testimonials: [
      { quote: 'We replaced three vendors and a spreadsheet with one API.', name: 'Priya S.', role: 'CTO, Cascade' },
      { quote: 'The ledger alone is worth the switch.', name: 'Owen D.', role: 'Eng lead, Harbor' },
    ],
    newsletter: {
      title: 'Ship this quarter',
      body: 'Product updates and the occasional deep dive from the engineering team.',
      cta: 'Get updates',
      placeholder: 'you@company.com',
    },
    images: {
      m1: 'A clean isometric render of a glowing ledger and account graph, cobalt blue fintech data visualization. Soft natural studio light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      m2: 'An abstract network routing diagram with bright cyan nodes on deep navy, sleek technical render. Soft natural studio light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      m3: 'An abstract 3D render of concentric glowing rings and scattered signal points over deep navy, suggesting a risk score without depicting any interface. Absolutely no text, letters, numbers, words, labels, logos or user interface of any kind anywhere in the image. Soft natural studio light, shallow depth of field, high detail.',
    },
  },

  verdant: {
    aboutImage:
      'A bright plant shop corner, tiered shelves of leafy houseplants in terracotta and pale pots, sunlight through a tall window. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
    about: {
      eyebrow: 'Our promise',
      title: 'Plants that actually make it',
      body: [
        'We match every plant to your light before it ships, pot it in peat-free soil, and text you a care plan so nothing gets guessed at.',
        'If it struggles in the first month, we replace it. No receipts, no questions.',
      ],
      points: ['Matched to your light', 'Peat-free potting', '30-day thrive guarantee'],
    },
    features: [
      { title: 'Match', body: 'A two-minute quiz points you to plants that suit your space.' },
      { title: 'Deliver', body: 'Potted, watered, and boxed to arrive standing up and happy.' },
      { title: 'Support', body: 'Text a botanist any time your leaves look unsure.' },
    ],
    testimonials: [
      { quote: 'First plants I have ever managed to keep alive.', name: 'Mei L.', role: 'Customer' },
      { quote: 'The care texts are weirdly delightful.', name: 'Sam P.', role: 'Plant parent' },
    ],
    newsletter: {
      title: 'Grow with us',
      body: 'Seasonal care tips and first dibs on rare drops, about twice a month.',
      cta: 'Sign up',
      placeholder: 'you@email.com',
    },
    images: {
      v1: 'A potted ZZ plant with glossy dark-green leaves in a matte ceramic pot, bright airy interior. Soft natural studio light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      v2: 'A tall fiddle-leaf fig in a woven basket by a sunlit window, fresh green houseplant photography. Soft natural studio light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      v3: 'A tall fiddle-leaf fig in a woven basket against a pale wall, broad glossy leaves, lush and vibrant. This is a houseplant, not an animal, and no birds or creatures appear. Soft natural studio light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
    },
  },

zest: {
    about: {
      eyebrow: 'How Zest works',
      title: 'Short lists, big flavour',
      body: [
        'Every recipe is built around a handful of ingredients you can actually find and a cook time that fits a weeknight. We test each one until a tired person can nail it.',
        'No ten-step reductions, no shopping for one obscure thing. Just fast food that tastes like you tried.',
      ],
      points: ['Ten ingredients or fewer', 'One pan where we can', 'Tested by real weeknight cooks'],
    },
    features: [
      { title: 'Pick', body: 'Filter by time, mood, or what is wilting in the fridge.' },
      { title: 'Cook', body: 'Clear steps, big photos, and a timer built into every recipe.' },
      { title: 'Brag', body: 'Snap it, share it, and pretend it took longer than it did.' },
    ],
    testimonials: [
      { quote: 'I cook from Zest four nights a week now.', name: 'Aya T.', role: 'Subscriber' },
      { quote: 'Finally recipes that respect a Tuesday.', name: 'Marco B.', role: 'Home cook' },
    ],
    newsletter: {
      title: 'Dinner, sorted',
      body: 'One quick recipe in your inbox every weekday afternoon.',
      cta: 'Get the box',
      placeholder: 'you@email.com',
    },
    images: {
      z1: 'A vibrant chili-lime corn bowl in a colorful bowl, fresh and appetizing overhead food photo. Soft natural studio light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      z2: 'A skillet of blistered cherry tomato orzo with basil, bright and saucy weeknight dinner. Soft natural studio light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      z3: 'A tangle of sesame crunch noodles with scallions in a bowl, glossy and colorful food photo. Soft natural studio light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
    },
  },

  nocturne: {
    aboutImage:
      'A dark perfumer\'s organ of amber sample bottles on a lacquered surface, one glass flacon lit in a single pool of light. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
    about: {
      eyebrow: 'The house',
      title: 'Composed like music, worn like memory',
      body: [
        'Nocturne is a small perfume house that works the way a composer does: a few notes, held in balance, that unfold over hours. Each scent is built to change as the night goes on.',
        'We bottle in refillable glass and never test on animals.',
      ],
      points: ['Extrait concentrations', 'Refillable glass', 'Never tested on animals'],
    },
    features: [
      { title: 'Compose', body: 'Our perfumer builds each scent around a single central accord.' },
      { title: 'Age', body: 'Every batch rests for weeks before it is ever bottled.' },
      { title: 'Wear', body: 'A discovery set lets you live with three before you commit.' },
    ],
    testimonials: [
      { quote: 'Strangers stop me to ask what I am wearing.', name: 'Camille D.', role: 'Client' },
      { quote: 'It smells like a memory I have not made yet.', name: 'Iris N.', role: 'Client' },
    ],
    newsletter: {
      title: 'Private previews',
      body: 'Occasional notes on new compositions and members-only releases.',
      cta: 'Request an invitation',
      placeholder: 'you@email.com',
    },
    images: {
      n1: 'A faceted perfume bottle glowing amethyst on black velvet, luxurious moody product photograph. Soft natural studio light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      n2: 'A dark still life of a perfume flacon among night-blooming flowers, deep purple and violet. Soft natural studio light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      n3: 'A minimalist perfume bottle backlit in soft violet haze, elegant and cinematic. Soft natural studio light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
    },
  },

  shoreline: {
    aboutImage:
      'A coastal architecture studio table with balsa massing models, rolled drawings and a wide window onto grey sea light. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
    about: {
      eyebrow: 'Our approach',
      title: 'Build for the wind, plan for the light',
      body: [
        'We start every project by walking the site at different tides and times of day. The building follows from where the light lands and where the weather comes from.',
        'We favour durable, low-maintenance materials that grey gracefully and belong to their coast.',
      ],
      points: ['Site-led, weather-first', 'Materials that age well', 'Low-energy by design'],
    },
    features: [
      { title: 'Listen', body: 'We spend time on the land before we draw a single line.' },
      { title: 'Design', body: 'Low-slung forms that shelter, frame a view, and last.' },
      { title: 'Build', body: 'We stay close through construction so the details survive.' },
    ],
    testimonials: [
      { quote: 'They gave us a house that feels like the coast itself.', name: 'The Aldous family', role: 'Salt House' },
      { quote: 'Calm, rigorous, and a joy to build with.', name: 'J. Reis', role: 'Contractor' },
    ],
    newsletter: {
      title: 'From the studio',
      body: 'Occasional notes on new work, talks, and the odd open house.',
      cta: 'Follow along',
      placeholder: 'you@email.com',
    },
    images: {
      w1: 'A low-slung coastal house in weathered timber against a grey sky, calm architectural photography. Soft natural studio light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      w2: 'A minimalist dune pavilion with large glass facing the sea, soft coastal daylight, architecture photo. Soft natural studio light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      w3: 'A stone harbourside building with deep window reveals at dusk, serene architectural photograph. Soft natural studio light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
    },
  },

  'pixel-playhouse': {
    about: {
      eyebrow: 'The studio',
      title: 'Three friends and a shared drive',
      body: [
        'Pixel Playhouse is a three-person studio that makes the kind of games we want to come home to. Warm, weird, and never in a hurry.',
        'We build in the open, post devlogs every Friday, and put the soundtrack up for free.',
      ],
      points: ['Wishlist-friendly demos', 'Free soundtracks', 'Devlogs every Friday'],
    },
    features: [
      { title: 'Play', body: 'Short, cozy sessions that respect your evening.' },
      { title: 'Wishlist', body: 'Every game ships a demo before it asks for a cent.' },
      { title: 'Follow', body: 'Weekly devlogs, wallpapers, and the odd prototype.' },
    ],
    testimonials: [
      { quote: 'The comfort food of video games. I adore it.', name: 'pixelfox', role: 'Player' },
      { quote: 'Wishlisted on sight, refunded never.', name: 'mossy', role: 'Player' },
    ],
    newsletter: {
      title: 'Join the Playhouse',
      body: 'Devlogs, wallpapers, and the odd free prototype, about one email a month.',
      cta: 'Sign up',
      placeholder: 'you@email.com',
    },
    images: {
      g1: 'A cozy pixel-art town at dusk with glowing streetlights, warm vaporwave pinks and purples, game screenshot. Soft natural studio light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      g2: 'A neon rooftop delivery scene in pixel art, night city with pink and blue glow, indie game art. Soft natural studio light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      g3: 'A colorful pixel-art coral reef aquarium builder scene, playful pastel vaporwave palette. Soft natural studio light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
    },
  },

};
