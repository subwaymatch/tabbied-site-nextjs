// Per-site composition for the React showcase sites: a visual "kit" (how the
// page is dressed) and an ordered list of sections, plus the content for the
// new section types. This is what makes the ten sites feel distinct rather than
// one template, they pick different kits, different section orders, and mix in
// manifestos, alternating illustrated rows, icon grids, FAQs, big quotes, logo
// clouds, and galleries. Existing about/features/testimonials/newsletter/images
// live in showcaseContent.ts; stats live in showcaseData.ts.

export type Kit = 'soft' | 'editorial' | 'brutal' | 'bordered' | 'minimal';

// Section keys the page can render (hero is always first, footer always last).
export type SectionKey =
  | 'stats'
  | 'statBand'
  | 'about'
  | 'manifesto'
  | 'altRows'
  | 'iconFeatures'
  | 'items'
  | 'process'
  | 'pricing'
  | 'specs'
  | 'team'
  | 'gallery'
  | 'features'
  | 'testimonials'
  | 'bigQuote'
  | 'faq'
  | 'logos'
  | 'band'
  | 'newsletter';

export type SectionContent = {
  kit: Kit;
  sections: SectionKey[];
  manifesto?: { kicker: string; text: string };
  /** Alternating illustrated rows. `image` is a text-to-image prompt. */
  altRows?: { eyebrow: string; title: string; body: string; image: string }[];
  /** Icon grid. `icon` is a lucide-react icon name. */
  iconFeatures?: { icon: string; title: string; body: string }[];
  faq?: { q: string; a: string }[];
  bigQuote?: { quote: string; name: string; role: string };
  logos?: string[];
  /** Numbered steps: how the thing actually works. */
  process?: { kicker: string; title: string; sub?: string; steps: { title: string; body: string }[] };
  /** Tiers, rates, or ticket types. */
  pricing?: {
    kicker: string; title: string; sub?: string;
    tiers: { name: string; price: string; unit: string; body: string; includes: string[]; cta: string; featured?: boolean }[];
  };
  /** A plain detail table: materials, logistics, specifications. */
  specs?: { kicker: string; title: string; sub?: string; rows: { k: string; v: string }[] };
  /** People, with the site's own artwork standing in for each portrait. */
  team?: { kicker: string; title: string; sub?: string; people: { name: string; role: string; bio: string }[] };
  /** Lookbook of text-to-image prompts. */
  gallery?: string[];
};

const IMG =
  'Soft natural light, shallow depth of field, high detail, no text or logos.';

export const SHOWCASE_SECTIONS: Record<string, SectionContent> = {
  solstice: {
    kit: 'soft',
    sections: ['stats', 'manifesto', 'altRows', 'iconFeatures', 'items', 'process', 'bigQuote', 'pricing', 'gallery', 'faq', 'band', 'newsletter'],
    process: {
      kicker: 'A day here',
      title: 'The shape of a Solstice day',
      sub: 'Loose enough to breathe, structured enough that you never have to decide anything.',
      steps: [
        { title: 'First light', body: 'Tea on the deck at 6:30, then an hour of breath and slow movement while the fog burns off.' },
        { title: 'The long table', body: 'Breakfast is one seating, family style, cooked from whatever the farm sent up that morning.' },
        { title: 'Open hours', body: 'Trail, tide pools, hammock, or nothing at all. Teachers are around if you want them.' },
        { title: 'Closing practice', body: 'A restorative hour as the light goes amber, then dinner and an early, honest bedtime.' },
      ],
    },
    pricing: {
      kicker: 'Rates',
      title: 'What a week costs',
      sub: 'Every rate covers seven nights, all meals, and all practices. Nothing is sold to you once you arrive.',
      tiers: [
        { name: 'Shared room', price: '$2,400', unit: 'per person', body: 'Two guests to a room, both beds facing the water.', includes: ['Seven nights', 'All meals and practices', 'Shuttle from the airport'], cta: 'Check dates' },
        { name: 'Private room', price: '$3,200', unit: 'per person', body: 'Your own room, your own deck, the same long table.', includes: ['Everything in Shared', 'Private ocean-view room', 'One session with a teacher, just you'], cta: 'Check dates', featured: true },
        { name: 'Whole house', price: '$26,000', unit: 'per week', body: 'Take the property for your studio, family, or team.', includes: ['Twelve guests', 'A schedule built with you', 'Dedicated chef and two teachers'], cta: 'Enquire' },
      ],
    },
    manifesto: {
      kicker: 'Our philosophy',
      text: 'Rest is not a reward for finishing. It is the practice. We build every retreat around that one idea.',
    },
    altRows: [
      { eyebrow: 'Mornings', title: 'Start with the sun, not an alarm', body: 'Practice opens on the deck at first light, then breakfast, then the whole day is yours. No schedule to outrun.', image: `A peaceful sunrise yoga session on a wooden deck facing the ocean, warm dawn glow. ${IMG}` },
      { eyebrow: 'Evenings', title: 'Wind down as the light goes', body: 'A long, slow restorative practice closes each day as the sky turns amber and the tide comes in.', image: `A candle-lit restorative yoga room at dusk with floor cushions, warm amber tones. ${IMG}` },
    ],
    iconFeatures: [
      { icon: 'Sunrise', title: 'All levels', body: 'Every practice bends to the room, first-timers to teachers.' },
      { icon: 'Leaf', title: 'Plant-forward', body: 'Chef-cooked meals from the garden and the market.' },
      { icon: 'Waves', title: 'On the water', body: 'Ocean-view rooms and a private stretch of coast.' },
      { icon: 'HeartHandshake', title: 'Small groups', body: 'Twelve guests, two teachers, nobody lost in a crowd.' },
    ],
    bigQuote: { quote: 'I arrived wound tight and left feeling like myself for the first time in years.', name: 'Priya N.', role: 'Spring 2025 guest' },
    faq: [
      { q: 'Do I need to be flexible?', a: 'Not at all. We meet you where you are, every single practice.' },
      { q: 'What is included?', a: 'All practices, meals, and your room for the week. You just get here.' },
      { q: 'Can I come alone?', a: 'Most guests do. You will not feel alone by the second morning.' },
      { q: 'What about dietary needs?', a: 'Tell us when you book and our chef will take care of it.' },
    ],
    gallery: [
      `A serene ocean-view retreat cabin interior with linen bedding, soft morning light. ${IMG}`,
      `A quiet coastal trail through wildflowers at golden hour. ${IMG}`,
      `A group meditating on a cliff at sunset, silhouettes against warm sky. ${IMG}`,
      `A rustic wooden table set with a colorful plant-based breakfast outdoors. ${IMG}`,
    ],
  },

  'harbor-and-vine': {
    kit: 'editorial',
    sections: ['logos', 'about', 'altRows', 'items', 'specs', 'testimonials', 'team', 'gallery', 'faq', 'band', 'newsletter'],
    specs: {
      kicker: 'The list',
      title: 'How we buy',
      sub: 'Everything by the glass, and most of what sits on the shelf, follows these rules.',
      rows: [
        { k: 'Farming', v: 'Organic or biodynamic in practice, certified or not. We visit the ones we can drive to.' },
        { k: 'Cellar', v: 'Native yeast, nothing added, nothing stripped. Sulfur only at bottling, and only if the wine asks for it.' },
        { k: 'The shelf', v: 'Around 180 labels, forty of them under thirty dollars, twelve open on any given night.' },
        { k: 'Producers', v: 'Two thirds are farms under ten hectares. Half are the first generation to bottle their own fruit.' },
        { k: 'Turnover', v: 'The by-the-glass list changes every Tuesday. Nothing stays open longer than two days.' },
        { k: 'Corkage', v: 'Twenty dollars, waived if you bring something we do not carry and pour us a taste.' },
      ],
    },
    team: {
      kicker: 'Behind the bar',
      title: 'Who is pouring',
      sub: 'Four people, one room, no sommelier theatre.',
      people: [
        { name: 'Mara Ellis', role: 'Owner', bio: 'Spent nine years importing from the Loire before deciding she would rather pour it herself.' },
        { name: 'Tomas Vidal', role: 'Wine director', bio: 'Rewrites the glass list every Tuesday and will happily talk you out of your usual.' },
        { name: 'June Park', role: 'Kitchen', bio: 'Cooks six things a night, all of them meant to be eaten with your hands.' },
        { name: 'Wes Abara', role: 'Floor', bio: 'Remembers what you drank last time and whether you actually liked it.' },
      ],
    },
    logos: ['DECANTER', 'PUNCH', 'EATER', 'THE INFATUATION', 'PELLICLE', 'SEVENFIFTY'],
    altRows: [
      { eyebrow: 'The cellar', title: 'We taste everything before it hits the list', body: 'Two of us sit down every Tuesday and taste the week in. If it does not move us, it does not get poured.', image: `A cozy wine bar cellar with rows of natural wine bottles, warm moody light. ${IMG}` },
      { eyebrow: 'The kitchen', title: 'Snacks built for the bottle', body: 'A short menu of things that make the wine sing: cured meats, funky cheese, and whatever the market gave us.', image: `A rustic charcuterie and cheese board on a marble bar with a glass of orange wine. ${IMG}` },
    ],
    gallery: [
      `A candlelit natural wine bar interior at night, warm and intimate. ${IMG}`,
      `A close-up of a hand pouring cloudy pet-nat into a glass. ${IMG}`,
      `A shelf of hand-labeled low-intervention wine bottles. ${IMG}`,
      `A small marble table with two wine glasses and a cheese plate. ${IMG}`,
    ],
    faq: [
      { q: 'Do you take reservations?', a: 'For parties of four or more. Otherwise, pull up a stool.' },
      { q: 'Can I buy bottles to go?', a: 'Yes, everything on the list is available as retail.' },
      { q: 'What is natural wine?', a: 'Low-intervention: organic fruit, wild ferment, little to nothing added.' },
      { q: 'Is there food?', a: 'A short snack menu, always built to match what is open.' },
    ],
  },

  lumen: {
    kit: 'brutal',
    sections: ['logos', 'stats', 'iconFeatures', 'items', 'process', 'gallery', 'altRows', 'bigQuote', 'pricing', 'faq', 'band', 'newsletter'],
    process: {
      kicker: 'The format',
      title: 'Three days, three shapes',
      sub: 'One track at a time, so there is never a talk you had to miss to see another.',
      steps: [
        { title: 'Day one, talks', body: 'Twenty minutes each, hard cut at twenty. Two stages, one room, nothing running against it.' },
        { title: 'Day two, labs', body: 'Hands on keyboards. Twelve labs, twenty seats each, claimed at the door on the morning.' },
        { title: 'Day three, the city', body: 'Studio visits across Lisbon in small groups, ending on a rooftop above the water.' },
        { title: 'Afterwards', body: 'Every talk goes online within a week, free, with transcripts and the slides.' },
      ],
    },
    pricing: {
      kicker: 'Tickets',
      title: 'Three ways in',
      sub: 'Prices move when a block sells out, never on a countdown timer.',
      tiers: [
        { name: 'Community', price: '180 EUR', unit: 'all three days', body: 'For students, non-profits, and anyone paying out of their own pocket.', includes: ['All talks and labs', 'Lunch on days one and two', 'Recordings the day they land'], cta: 'Apply' },
        { name: 'Standard', price: '520 EUR', unit: 'all three days', body: 'The normal ticket. Most of the room is holding one.', includes: ['Everything in Community', 'Studio visit day', 'Rooftop closing party'], cta: 'Get tickets', featured: true },
        { name: 'Team of five', price: '2,200 EUR', unit: 'five passes', body: 'Bring the whole product team and spread them across the labs.', includes: ['Five standard passes', 'Reserved lab seats', 'A table of your own at the party'], cta: 'Buy for a team' },
      ],
    },
    logos: ['FIGMA', 'VERCEL', 'LINEAR', 'STRIPE', 'RETOOL', 'RAYCAST'],
    iconFeatures: [
      { icon: 'Presentation', title: 'Two stages', body: 'Sharp twenty-minute talks with no wasted slide.' },
      { icon: 'FlaskConical', title: 'Hands-on labs', body: 'Build something real in a room of twenty.' },
      { icon: 'Users', title: 'The hallway', body: 'The best track, moved to a rooftop over the harbour.' },
      { icon: 'Ticket', title: 'One pass', body: 'Every session and workshop, no upsells.' },
    ],
    gallery: [
      `A packed modern conference auditorium lit in vivid magenta and cyan stage light. ${IMG}`,
      `A speaker gesturing on a dark stage with bold neon graphics behind. ${IMG}`,
      `A hands-on design workshop with laptops under bright neon accent lighting. ${IMG}`,
      `A rooftop networking party at night with a harbour view and colored lights. ${IMG}`,
    ],
    altRows: [
      { eyebrow: 'The city', title: 'Three days on the Lisbon waterfront', body: 'The venue opens onto the river. Sessions by day, the whole industry spilling onto the terrace by night.', image: `The Lisbon waterfront at dusk with warm lights and a modern venue, vivid sky. ${IMG}` },
    ],
    bigQuote: { quote: 'The rare conference where the hallway is as good as the stage.', name: 'Ana R.', role: '2025 speaker' },
    faq: [
      { q: 'When do tickets go on sale?', a: 'Early-bird is live now. Prices step up on the first of each month.' },
      { q: 'Are talks recorded?', a: 'Yes, ticket holders get the full library two weeks after.' },
      { q: 'Is there a student rate?', a: 'A limited block of student passes at half price.' },
      { q: 'Where should I stay?', a: 'We publish a hotel guide walking distance from the venue.' },
    ],
  },

  fathom: {
    kit: 'minimal',
    sections: ['manifesto', 'stats', 'iconFeatures', 'altRows', 'items', 'specs', 'gallery', 'team', 'bigQuote', 'faq', 'band', 'newsletter'],
    specs: {
      kicker: 'The work',
      title: 'What we run, and where',
      sub: 'Every figure here is pulled from the fleet log at the close of each quarter.',
      rows: [
        { k: 'Vessels', v: 'Two research catamarans, out of Monterey and Kodiak, crewed year round.' },
        { k: 'Moorings', v: 'Fourteen fixed sensor arrays between 200 and 2,800 metres, reporting hourly.' },
        { k: 'Coverage', v: 'A 1,900 kilometre transect of the eastern Pacific shelf, resurveyed twice a year.' },
        { k: 'Instruments', v: 'Temperature, salinity, oxygen, pH, and passive acoustics on every station.' },
        { k: 'Data', v: 'Raw and open inside thirty days. No embargo, no login, no licence fee.' },
        { k: 'Funding', v: 'Sixty-one percent public grants, thirty-two percent individual gifts, seven percent licensing.' },
      ],
    },
    team: {
      kicker: 'The crew',
      title: 'Who goes out',
      sub: 'Small teams, long rotations, and everybody stands a watch.',
      people: [
        { name: 'Dr. Ana Reyes', role: 'Chief scientist', bio: 'Physical oceanographer, twenty-two seasons at sea and still counting them.' },
        { name: 'Nils Haugen', role: 'Fleet engineer', bio: 'Keeps two boats and fourteen moorings alive on a nonprofit budget.' },
        { name: 'Priya Raman', role: 'Data lead', bio: 'Built the pipeline that gets raw sensor data public in under a month.' },
        { name: 'Kai Toledo', role: 'Field ecologist', bio: 'Runs the acoustic survey and can name a whale from its call alone.' },
      ],
    },
    manifesto: {
      kicker: 'Why open data',
      text: 'The deep sea belongs to everyone, so the data should too. We publish every reading the day it is verified.',
    },
    iconFeatures: [
      { icon: 'Waves', title: 'Full water column', body: 'Standardised sensors from surface to a thousand metres.' },
      { icon: 'Database', title: 'Open by default', body: 'Every dataset released under a permissive license.' },
      { icon: 'GraduationCap', title: 'Students aboard', body: 'Grants that put early-career scientists on the water.' },
      { icon: 'Globe', title: 'Global reach', body: 'Partners on four oceans and counting.' },
    ],
    altRows: [
      { eyebrow: 'The expedition', title: 'Real ships, real readings', body: 'We buy ship time on working research vessels and instrument them to a shared standard, so the data lines up.', image: `A marine research vessel at sea deploying instruments, cool teal water, overcast. ${IMG}` },
      { eyebrow: 'The data', title: 'Clean, documented, reusable', body: 'Every release ships with methods, calibration, and code, so another lab can build on it the same day.', image: `A scientist reviewing ocean data charts on a laptop in a ship cabin, teal tones. ${IMG}` },
    ],
    gallery: [
      `Bioluminescent creatures in the deep ocean twilight zone, teal and gold on black. ${IMG}`,
      `A coral reef survey with a diver and measuring tape, bright teal water. ${IMG}`,
      `The edge of Arctic sea ice meeting dark cold water, pale mint and navy. ${IMG}`,
      `A CTD rosette sampler being lowered into a calm teal sea. ${IMG}`,
    ],
    bigQuote: { quote: 'Their open data saved my lab a year of fieldwork.', name: 'Dr. Lena S.', role: 'Marine biologist' },
    faq: [
      { q: 'How is Fathom funded?', a: 'Members, grants, and philanthropy. No paywalls, ever.' },
      { q: 'Can I use the data commercially?', a: 'Yes, the license permits commercial reuse with attribution.' },
      { q: 'How do I propose an expedition?', a: 'We open a grant round twice a year, applications on the site.' },
      { q: 'Do you take volunteers?', a: 'Occasionally for shore work. Join the list to hear first.' },
    ],
  },

  'ember-and-oak': {
    kit: 'editorial',
    sections: ['about', 'items', 'process', 'altRows', 'bigQuote', 'iconFeatures', 'gallery', 'team', 'faq', 'band', 'newsletter'],
    process: {
      kicker: 'The fire',
      title: 'Everything starts at the hearth',
      sub: 'One fire, lit before the first delivery, feeding every station on the line.',
      steps: [
        { title: 'Split and season', body: 'Oak and almond, air dried for eighteen months in the yard behind the building.' },
        { title: 'Build at six', body: 'Lit before the first delivery arrives and never allowed to go out until close.' },
        { title: 'Cook on coals', body: 'No gas on the line at all. Everything is grilled, ember roasted, or buried in ash.' },
        { title: 'Finish in the ash', body: 'Whole vegetables go in overnight and come out for the next day menu.' },
      ],
    },
    team: {
      kicker: 'The kitchen',
      title: 'Who is cooking',
      sub: 'A short line, all of it within arm reach of the fire.',
      people: [
        { name: 'Sofia Marchetti', role: 'Chef, owner', bio: 'Learned fire cooking in Piedmont, then spent a decade getting it wrong before this room.' },
        { name: 'Daniel Osei', role: 'Head of hearth', bio: 'Runs the coals, and has opinions about oak he will share unprompted.' },
        { name: 'Reiko Tanaka', role: 'Pastry', bio: 'Bakes in the falling heat after service, which is why the bread tastes like that.' },
        { name: 'Marco Silva', role: 'General manager', bio: 'Front of house, the wine list, and the person who finds you a table.' },
      ],
    },
    altRows: [
      { eyebrow: 'The fire', title: 'One hearth, all night', body: 'Oak for heat, fruitwood for the finish. The fire is the pilot light of the whole kitchen and the center of the room.', image: `A glowing wood-fired restaurant hearth with flames and embers, deep amber light. ${IMG}` },
      { eyebrow: 'The counter', title: 'The best seat faces the flame', body: 'Eight stools at the pass, close enough to feel the heat and watch every plate leave the fire.', image: `A chef plating at a fire-lit restaurant counter, dark and moody, warm glow. ${IMG}` },
    ],
    bigQuote: { quote: 'You taste the smoke in everything, and you never want it to stop.', name: 'Sofia D.', role: 'Diner' },
    iconFeatures: [
      { icon: 'Flame', title: 'Live fire', body: 'Everything meets the flame, nothing meets a gas ring.' },
      { icon: 'Leaf', title: 'Market-led', body: 'The menu changes with whatever came in this morning.' },
      { icon: 'Utensils', title: 'Eight seats at the pass', body: 'Sit at the counter and watch the whole thing happen an arm away.' },
    ],
    gallery: [
      `A charred whole leek with ember cream on dark ceramic, moody restaurant light. ${IMG}`,
      `A wood-fired rib chop resting over glowing coals, amber firelight. ${IMG}`,
      `A smoked pear dessert with burnt honey cream, warm low light. ${IMG}`,
      `A dim dining room glowing around an open hearth, intimate and warm. ${IMG}`,
    ],
    faq: [
      { q: 'How far ahead should I book?', a: 'Counter seats go two weeks out. We hold a few for walk-ins.' },
      { q: 'Is the menu fixed?', a: 'A short a la carte plus a chef tasting at the counter.' },
      { q: 'Do you cater to dietary needs?', a: 'Tell us when you book and we will build around it.' },
      { q: 'Is there parking?', a: 'Street parking after 6, and a lot two doors down.' },
    ],
  },

  'petal-and-post': {
    kit: 'soft',
    sections: ['stats', 'about', 'altRows', 'items', 'process', 'iconFeatures', 'gallery', 'pricing', 'testimonials', 'band', 'newsletter'],
    process: {
      kicker: 'How it works',
      title: 'From the market to your table',
      sub: 'Four days, most of them spent making sure nothing sits in a cooler.',
      steps: [
        { title: 'Monday market', body: 'We buy at dawn from six growers inside ninety miles. Whatever is best that week sets the palette.' },
        { title: 'You give us a mood', body: 'Not a stem list. A colour, a room, a feeling, and we build toward it.' },
        { title: 'Cut that morning', body: 'Every arrangement is made the day it goes out. Nothing is held over to the next.' },
        { title: 'Hand delivered', body: 'In the city, by us, standing in water. Everywhere else, packed dry and boxed carefully.' },
      ],
    },
    pricing: {
      kicker: 'Standing orders',
      title: 'Flowers on a schedule',
      sub: 'Pause any week, cancel whenever. We never charge for a week you skipped.',
      tiers: [
        { name: 'Desk', price: '$45', unit: 'per delivery', body: 'A small jar of whatever was best that week.', includes: ['Six to eight stems', 'Reusable jar', 'Weekly or fortnightly'], cta: 'Start a standing order' },
        { name: 'Table', price: '$85', unit: 'per delivery', body: 'The arrangement we would put on our own table.', includes: ['Fifteen to twenty stems', 'Seasonal foliage', 'A note card, handwritten'], cta: 'Start a standing order', featured: true },
        { name: 'Shopfront', price: '$260', unit: 'per week', body: 'Weekly flowers for a counter, a lobby, or a studio.', includes: ['Three arrangements', 'Vessels included', 'Swapped and refreshed on site'], cta: 'Talk to us' },
      ],
    },
    altRows: [
      { eyebrow: 'The flowers', title: 'Cut this morning, in your hands by evening', body: 'We buy at the market at dawn and arrange to order, so nothing sits in a bucket for a week before it reaches you.', image: `A bright florist studio bench with fresh-cut seasonal blooms and kraft paper. ${IMG}` },
      { eyebrow: 'The paper', title: 'Pressed one sheet at a time', body: 'Our cards are letterpressed in-house on a hundred-year-old press, so every one carries a little bite of ink.', image: `A vintage letterpress printing a soft pink greeting card, close-up, warm light. ${IMG}` },
    ],
    iconFeatures: [
      { icon: 'Flower2', title: 'Seasonal only', body: 'Whatever is best at the market that morning.' },
      { icon: 'Mail', title: 'Hand-pressed', body: 'Letterpress cards printed on our own press.' },
      { icon: 'Truck', title: 'Same-day local', body: 'Cycled across the city, often the same afternoon.' },
    ],
    gallery: [
      `A soft blush bouquet of ranunculus and sweet pea in kraft paper, airy studio. ${IMG}`,
      `A bright coral arrangement of dahlias in a ceramic vase, cheerful daylight. ${IMG}`,
      `A stack of pastel letterpress cards tied with ribbon. ${IMG}`,
      `A florist wrapping a bouquet at a sunlit counter. ${IMG}`,
    ],
  },

  northwind: {
    kit: 'bordered',
    sections: ['logos', 'stats', 'about', 'items', 'specs', 'altRows', 'iconFeatures', 'gallery', 'process', 'bigQuote', 'faq', 'band', 'newsletter'],
    specs: {
      kicker: 'Materials',
      title: 'What the shell is made of',
      sub: 'The same spec sheet we hand the factory, printed on the hangtag.',
      rows: [
        { k: 'Face fabric', v: '70D recycled nylon ripstop, holding 2,300mm hydrostatic head after fifty washes.' },
        { k: 'Membrane', v: 'Solvent-free polyurethane, PFAS free, rated at 20,000g per square metre per day.' },
        { k: 'Seams', v: 'Fully taped with 13mm heat-bonded tape. Nine seams total, which is as few as we could get to.' },
        { k: 'Hardware', v: 'Waterproof YKK zips, bar-tacked pulls, and a hem cord you can work with gloves on.' },
        { k: 'Weight', v: '412 grams in a medium. The hood is not removable, because removable hoods leak.' },
        { k: 'Repair', v: 'Free for life. Send it back muddy and we will patch it and post it home.' },
      ],
    },
    process: {
      kicker: 'How it is made',
      title: 'Four factories, all of them named',
      sub: 'We publish the list because a supply chain you cannot see is one nobody is checking.',
      steps: [
        { title: 'Yarn', body: 'Recycled nylon spun in Taiwan from post-industrial waste, certified to the global standard.' },
        { title: 'Fabric', body: 'Woven and coated in Suzhou, at a mill we have used since our first season.' },
        { title: 'Cut and sew', body: 'Assembled in Da Nang, in a factory we visit twice a year and audit annually.' },
        { title: 'Finish', body: 'Washed, taped, and spray tested in the same building. Every shell gets checked.' },
      ],
    },
    logos: ['OUTSIDE', 'GEAR PATROL', 'ALPINIST', 'BACKPACKER', 'FIELD MAG', 'THE DIRTBAG'],
    altRows: [
      { eyebrow: 'The build', title: 'Heavier than it needs to be', body: 'We spec heavier fabric, bigger zips, and double the stitching. The best gear is the gear you never think about.', image: `A close-up of rugged technical jacket fabric with reinforced seams, moody green light. ${IMG}` },
      { eyebrow: 'The guarantee', title: 'We fix it, for life', body: 'Send in a worn-out piece and we patch it and send it back. No receipt, no expiry, no fine print.', image: `A repair workshop hand-patching a green outdoor jacket, warm workshop light. ${IMG}` },
    ],
    iconFeatures: [
      { icon: 'ShieldCheck', title: 'Lifetime guarantee', body: 'Repairs included, for as long as you own it.' },
      { icon: 'Recycle', title: 'Recycled shells', body: 'Bluesign fabrics from post-consumer materials.' },
      { icon: 'Mountain', title: 'Field-tested', body: 'Proven above the treeline before it ships.' },
      { icon: 'Leaf', title: 'Carbon neutral', body: 'Every order, offset at no cost to you.' },
    ],
    gallery: [
      `A three-layer hardshell jacket on a rocky alpine ridge, dramatic overcast light. ${IMG}`,
      `A packed green down jacket beside a summit backdrop, crisp cold daylight. ${IMG}`,
      `A folded merino base layer on weathered wood, earthy green tones. ${IMG}`,
      `A hiker on a misty ridgeline in a green shell, wind and cloud. ${IMG}`,
    ],
    bigQuote: { quote: 'Six winters in and it looks better than my newer jackets.', name: 'Rowan A.', role: 'Alpinist' },
    faq: [
      { q: 'How does the guarantee work?', a: 'Send it in any time. We repair or replace, free.' },
      { q: 'How should I size?', a: 'True to size with room to layer. Full guide on each product.' },
      { q: 'Do you ship internationally?', a: 'Yes, carbon-neutral shipping to most countries.' },
      { q: 'Can I return it?', a: '90 days, worn or unworn, no questions.' },
    ],
  },

  honeycomb: {
    kit: 'soft',
    sections: ['stats', 'manifesto', 'iconFeatures', 'altRows', 'items', 'process', 'gallery', 'pricing', 'testimonials', 'faq', 'band', 'newsletter'],
    process: {
      kicker: 'How it works',
      title: 'Fifteen minutes, then it stops',
      sub: 'The app is built to end. That is the whole design.',
      steps: [
        { title: 'Pick a path', body: 'Reading, numbers, or the world. Kids choose, and the choice holds for the week.' },
        { title: 'Play the loop', body: 'Three short activities that adapt in real time to what they just got right or wrong.' },
        { title: 'Hit the wall', body: 'At fifteen minutes the session closes itself. No streak to protect, no way to buy more.' },
        { title: 'Talk about it', body: 'One prompt lands in the parent app: a specific thing to ask about at dinner.' },
      ],
    },
    pricing: {
      kicker: 'Plans',
      title: 'One price, no coins',
      sub: 'Nothing inside the app can be bought from inside the app. Not now, not later.',
      tiers: [
        { name: 'Family', price: '$8', unit: 'per month', body: 'Up to four kids, any ages, one bill.', includes: ['Every path and activity', 'Parent app and weekly notes', 'Works with no signal'], cta: 'Start a free month', featured: true },
        { name: 'Family, yearly', price: '$72', unit: 'per year', body: 'Exactly the same thing, two months cheaper.', includes: ['Everything in Family', 'Printable progress notes', 'Cancel any time, prorated'], cta: 'Start a free month' },
        { name: 'Classroom', price: 'Free', unit: 'for schools', body: 'Public schools and libraries, at no cost and with no strings.', includes: ['Up to thirty seats', 'Teacher dashboard', 'No data sold, ever'], cta: 'Request access' },
      ],
    },
    manifesto: {
      kicker: 'What we believe',
      text: 'The best learning does not feel like learning. It feels like five more minutes of a game they love.',
    },
    iconFeatures: [
      { icon: 'Sparkles', title: 'Adaptive', body: 'Every right answer nudges the next one a little further.' },
      { icon: 'Clock', title: 'Five minutes', body: 'Bite-size lessons that are easy to start and stop.' },
      { icon: 'ShieldCheck', title: 'No ads', body: 'No chat, no ads, nothing to buy inside. Ever.' },
      { icon: 'Baby', title: 'Ages 4 to 9', body: 'Grows with your child, year after year.' },
    ],
    altRows: [
      { eyebrow: 'For kids', title: 'A world that grows with them', body: 'Reading and number games wrapped in a friendly world that gets a little bigger every time they play.', image: `A cheerful cartoon learning-app world with friendly characters, bright honey-gold. ${IMG}` },
      { eyebrow: 'For parents', title: 'A weekly note, not a dashboard', body: 'A short, plain summary of what your child worked on and what clicked, no metrics to decode.', image: `A parent and child smiling at a tablet together on a cozy couch, warm light. ${IMG}` },
    ],
    gallery: [
      `A cartoon meadow reading game with friendly letters, warm honey-gold palette. ${IMG}`,
      `A playful counting game with a honeycomb and cartoon bees, sunny yellows. ${IMG}`,
      `A colorful pattern-matching puzzle grove for kids, rounded shapes. ${IMG}`,
      `A happy cartoon mascot bee waving, bright gold background. ${IMG}`,
    ],
    faq: [
      { q: 'Is it really free to try?', a: 'Two weeks free, cancel in one tap, no card tricks.' },
      { q: 'How much screen time is it?', a: 'Designed for five to fifteen minutes a day.' },
      { q: 'Can siblings share it?', a: 'One plan covers up to four child profiles.' },
      { q: 'Is my child’s data safe?', a: 'No ads, no third-party tracking, COPPA compliant.' },
    ],
  },

  facet: {
    kit: 'minimal',
    sections: ['manifesto', 'about', 'items', 'process', 'altRows', 'bigQuote', 'iconFeatures', 'specs', 'gallery', 'faq', 'band', 'newsletter'],
    process: {
      kicker: 'Commissions',
      title: 'How a piece gets made',
      sub: 'Eight to twelve weeks, from the first conversation to the box.',
      steps: [
        { title: 'Talk', body: 'An hour, in the studio or on a call, about the person it is for and how they live.' },
        { title: 'Draw', body: 'Two or three directions in pencil and wax. You pick one and we refine it together.' },
        { title: 'Set', body: 'Cast in the studio, stones set by hand, finished across three or four days.' },
        { title: 'Look after', body: 'Cleaned and checked free, forever. Resizing is free for the first two years.' },
      ],
    },
    specs: {
      kicker: 'Materials',
      title: 'What is in it',
      sub: 'Provenance on request for every stone over half a carat.',
      rows: [
        { k: 'Gold', v: '18 carat, recycled, refined in the UK. We have not bought newly mined gold since 2019.' },
        { k: 'Diamonds', v: 'Lab grown as standard. Natural stones only from single-mine traceable sources.' },
        { k: 'Coloured stones', v: 'Bought at origin in Sri Lanka and Malawi, with no auction house in between.' },
        { k: 'Setting', v: 'Set by hand in the studio. Nothing is sent out to a trade bench.' },
        { k: 'Sizing', v: 'Free for two years, then at cost. Most bands move two sizes either way.' },
        { k: 'Boxes', v: 'Ash and wool felt, made forty miles away, designed to be kept rather than binned.' },
      ],
    },
    manifesto: {
      kicker: 'The idea',
      text: 'One remarkable stone, set by hand, made to outlast every trend and be handed down after that.',
    },
    altRows: [
      { eyebrow: 'The stone', title: 'Traceable to the source', body: 'We buy from cutters we know and can trace every stone to its origin. Beauty should not cost the earth or anyone on it.', image: `A single brilliant gemstone held in tweezers under jeweller's light, jewel tones. ${IMG}` },
      { eyebrow: 'The setting', title: 'Drawn around your stone', body: 'Every setting is designed for its stone, never pulled from a tray, then set by hand in gold or platinum.', image: `A jeweller hand-setting a gemstone into a gold ring at a workbench, elegant macro. ${IMG}` },
    ],
    bigQuote: { quote: 'They turned my grandmother’s stone into something I will never take off.', name: 'Eleanor V.', role: 'Bespoke client' },
    iconFeatures: [
      { icon: 'Gem', title: 'Traceable stones', body: 'Ethically sourced, with a name and an origin.' },
      { icon: 'PenTool', title: 'Bespoke design', body: 'A setting drawn around your stone, together.' },
      { icon: 'Sparkles', title: 'Lifetime care', body: 'Cleaning, re-tipping, and resizing, always free.' },
    ],
    gallery: [
      `A sapphire solitaire ring on black velvet, jewel-toned reflections, macro. ${IMG}`,
      `A tourmaline pendant on platinum against midnight blue, sparkling facets. ${IMG}`,
      `A diamond band in rose gold catching prismatic light. ${IMG}`,
      `A loose emerald on dark stone under a jeweller's loupe. ${IMG}`,
    ],
    faq: [
      { q: 'Can I bring my own stone?', a: 'Absolutely. Many of our pieces begin with an heirloom.' },
      { q: 'How long does bespoke take?', a: 'Six to ten weeks, from first sketch to final polish.' },
      { q: 'Do you offer financing?', a: 'Yes, interest-free over six or twelve months.' },
      { q: 'What about resizing?', a: 'Free for the life of the piece.' },
    ],
  },

  seabright: {
    kit: 'soft',
    sections: ['stats', 'altRows', 'about', 'iconFeatures', 'items', 'specs', 'gallery', 'process', 'bigQuote', 'faq', 'band', 'newsletter'],
    specs: {
      kicker: 'Formulas',
      title: 'What is actually in the bottle',
      sub: 'Full percentages, because an ingredient list without them tells you very little.',
      rows: [
        { k: 'Actives', v: 'Named at percentage on every carton. Niacinamide at 4 percent, not "contains niacinamide".' },
        { k: 'Base', v: 'Cold-pressed sea buckthorn and squalane derived from sugarcane, never from shark.' },
        { k: 'Fragrance', v: 'None. Not unscented, which usually means a masking scent. Nothing at all.' },
        { k: 'Preservation', v: 'Broad spectrum, at the lowest effective load, tested to twelve months open.' },
        { k: 'Testing', v: 'On four hundred volunteers across six skin types. Never on animals, in any market.' },
        { k: 'Packaging', v: 'Aluminium and glass, refillable at any stockist, no plastic in the outer carton.' },
      ],
    },
    process: {
      kicker: 'The routine',
      title: 'Four steps, twice a day',
      sub: 'If a fifth step were worth doing, we would happily sell you one.',
      steps: [
        { title: 'Rinse', body: 'Lukewarm water and the gel cleanser. Thirty seconds is plenty.' },
        { title: 'One active', body: 'A single treatment at a time, on damp skin, while it still holds water.' },
        { title: 'Seal', body: 'The cream, applied thin, while the treatment underneath is still tacky.' },
        { title: 'Then SPF', body: 'Mineral SPF 30 every morning, the last thing before you walk out the door.' },
      ],
    },
    altRows: [
      { eyebrow: 'The formula', title: 'Short lists, on purpose', body: 'Nine ingredients or fewer, each one there for a reason. If it does not earn its place, it does not go in.', image: `A minimalist skincare bottle on wet stone with water droplets, pale seaglass green. ${IMG}` },
      { eyebrow: 'The coast', title: 'Made where it belongs', body: 'We batch on the coast we are trying to protect, and leave out anything that should not wash back into the sea.', image: `A calm rocky tide pool on a quiet coast, muted teal and slate tones. ${IMG}` },
    ],
    iconFeatures: [
      { icon: 'Droplet', title: 'Reef-safe', body: 'Non-nano minerals the reef can live with.' },
      { icon: 'Leaf', title: 'Fragrance-free', body: 'No synthetic fragrance, ever.' },
      { icon: 'ShieldCheck', title: 'For sensitive skin', body: 'Short formulas that calm, not react.' },
      { icon: 'Recycle', title: 'Refillable', body: 'Glass bottles, refill pouches, less waste.' },
    ],
    gallery: [
      `A frosted bottle of cleansing gel on wet stone, pale seaglass green, coastal light. ${IMG}`,
      `A dropper of mineral serum over a tide pool, cool teal and slate. ${IMG}`,
      `A tube of mineral SPF on smooth beach pebbles, soft overcast daylight. ${IMG}`,
      `A flat-lay of the full skincare set on pale linen with a sprig of seaweed. ${IMG}`,
    ],
    bigQuote: { quote: 'The first routine my reactive skin has ever actually liked.', name: 'Amara J.', role: 'Customer' },
    faq: [
      { q: 'Is it good for sensitive skin?', a: 'That is exactly who we make it for. Short, gentle formulas.' },
      { q: 'What does reef-safe mean?', a: 'No oxybenzone or octinoxate, non-nano minerals only.' },
      { q: 'Do you offer refills?', a: 'Yes, refill pouches for every product at a lower price.' },
      { q: 'Are you cruelty-free?', a: 'Always. Never tested on animals, fully vegan.' },
    ],
  },
};
