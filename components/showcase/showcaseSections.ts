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
  /**
   * People, each with a generated portrait (see Team in ShowcaseSite.tsx).
   *
   * `portraitScene` is the half of the prompt the whole team shares — where
   * they are and how it is lit — and each person's `role` completes it. One
   * line per team instead of one prompt per person, and it keeps a site's
   * people looking like colleagues rather than a stock-photo grab bag.
   */
  team?: {
    kicker: string;
    title: string;
    sub?: string;
    portraitScene: string;
    /** `look` is the authored appearance for this person's generated portrait. */
    people: { name: string; role: string; bio: string; look: string }[];
  };
  /** Lookbook of text-to-image prompts. */
  gallery?: string[];
  /**
   * A generated photograph behind the hero's art panel, with an artwork drawn
   * over it (see HeroArt). Without it the panel is the artwork alone, which is
   * what the other nineteen sites do.
   */
  heroImage?: string;
  /**
   * Artwork slug drawn over `heroImage`, defaulting to the site's last. It is
   * named rather than inferred because the choice is load-bearing: the overlay
   * is opaque, so the design has to be a sparse one whose gaps are real
   * negative space (lines, frames, scattered marks) rather than a dense field
   * that would simply cover the photograph.
   */
  heroOverlayArtwork?: string;
};

const IMG =
  'Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.';

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
      { eyebrow: 'Evenings', title: 'Wind down as the light goes', body: 'A long, slow restorative practice closes each day as the sky turns amber and the tide comes in.', image: `A candle-lit restorative yoga room at dusk with floor cushions, bolsters and folded blankets arranged on the floor, warm amber tones. The room is empty, with no people or bodies in the frame. ${IMG}` },
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
    heroImage:
      'A warm harbourside natural wine bar at golden hour, low evening sun across a zinc counter, ' +
      'open bottles and stemmed glasses, weathered timber and water visible through tall windows. ' +
      'The room is empty, with no people or body parts in the frame. ' +
      'Soft natural light, shallow depth of field, high detail, no text or logos. ' +
      'Any person in the frame is shown whole and uncropped — no disembodied hands, ' +
      'no limbs cut off by the edge, and no bodies without heads.',
    heroOverlayArtwork: 'comet',
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
      portraitScene:
        'behind the zinc counter of a harbourside natural wine bar at golden hour, open bottles and stemmed glasses around them',
      people: [
        { name: 'Mara Ellis', role: 'Owner', bio: 'Spent nine years importing from the Loire before deciding she would rather pour it herself.', look: 'a woman in her late forties, silver-streaked dark hair tied back, denim shirt' },
        { name: 'Tomas Vidal', role: 'Wine director', bio: 'Rewrites the glass list every Tuesday and will happily talk you out of your usual.', look: 'a man in his thirties with a close beard and rolled shirtsleeves' },
        { name: 'June Park', role: 'Kitchen', bio: 'Cooks six things a night, all of them meant to be eaten with your hands.', look: 'a woman in her twenties with a short black bob, chef whites' },
        { name: 'Wes Abara', role: 'Floor', bio: 'Remembers what you drank last time and whether you actually liked it.', look: 'a Black man in his thirties with cropped hair and a linen apron' },
      ],
    },
    logos: ['DECANTER', 'PUNCH', 'EATER', 'THE INFATUATION', 'PELLICLE', 'SEVENFIFTY'],
    altRows: [
      { eyebrow: 'The cellar', title: 'We taste everything before it hits the list', body: 'Two of us sit down every Tuesday and taste the week in. If it does not move us, it does not get poured.', image: `A cozy wine bar cellar with rows of natural wine bottles, warm moody light. ${IMG}` },
      { eyebrow: 'The kitchen', title: 'Snacks built for the bottle', body: 'A short menu of things that make the wine sing: cured meats, funky cheese, and whatever the market gave us.', image: `A rustic charcuterie and cheese board on a marble bar with a glass of orange wine. ${IMG}` },
    ],
    gallery: [
      `A candlelit natural wine bar interior at night, warm and intimate. ${IMG}`,
      `A glass of cloudy pet-nat on a zinc counter beside its open bottle, condensation beading on the glass, low evening light. ${IMG}`,
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
      portraitScene:
        'on the working deck of an ocean research vessel under bright overcast light, instrument cases and coiled line behind them',
      people: [
        { name: 'Dr. Ana Reyes', role: 'Chief scientist', bio: 'Physical oceanographer, twenty-two seasons at sea and still counting them.', look: 'a Latina woman in her fifties, weathered face, grey hair under a cap, waterproof jacket' },
        { name: 'Nils Haugen', role: 'Fleet engineer', bio: 'Keeps two boats and fourteen moorings alive on a nonprofit budget.', look: 'a broad, fair-haired man in his forties in a worn boiler suit' },
        { name: 'Priya Raman', role: 'Data lead', bio: 'Built the pipeline that gets raw sensor data public in under a month.', look: 'a South Asian woman in her thirties with glasses and a long dark plait, fleece over a shirt' },
        { name: 'Kai Toledo', role: 'Field ecologist', bio: 'Runs the acoustic survey and can name a whale from its call alone.', look: 'a young Filipino man in his twenties with a wetsuit half-unzipped' },
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
      { eyebrow: 'The data', title: 'Clean, documented, reusable', body: 'Every release ships with methods, calibration, and code, so another lab can build on it the same day.', image: `A laptop on a chart table in a ship cabin showing an abstract ocean data plot, notebooks and a mug beside it, teal tones, nobody at the desk. ${IMG}` },
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
      portraitScene:
        'in the open kitchen of a wood-fired restaurant, warm firelight from the hearth behind them',
      people: [
        { name: 'Sofia Marchetti', role: 'Chef, owner', bio: 'Learned fire cooking in Piedmont, then spent a decade getting it wrong before this room.', look: 'a woman in her fifties with grey curls pinned up, sleeves pushed back, chef whites' },
        { name: 'Daniel Osei', role: 'Head of hearth', bio: 'Runs the coals, and has opinions about oak he will share unprompted.', look: 'a Black man in his forties with a shaved head and a heavy canvas apron' },
        { name: 'Reiko Tanaka', role: 'Pastry', bio: 'Bakes in the falling heat after service, which is why the bread tastes like that.', look: 'a Japanese woman in her thirties with straight hair under a bandana, pastry whites' },
        { name: 'Marco Silva', role: 'General manager', bio: 'Front of house, the wine list, and the person who finds you a table.', look: 'a man in his forties in a dark shirt, warm and unhurried' },
      ],
    },
    altRows: [
      { eyebrow: 'The fire', title: 'One hearth, all night', body: 'Oak for heat, fruitwood for the finish. The fire is the pilot light of the whole kitchen and the center of the room.', image: `A glowing wood-fired restaurant hearth with flames and embers, deep amber light. ${IMG}` },
      { eyebrow: 'The counter', title: 'The best seat faces the flame', body: 'Eight stools at the pass, close enough to feel the heat and watch every plate leave the fire.', image: `A chef plating a dish on the pass of a fire-lit restaurant kitchen, dark and moody, warm glow. The person at work is shown whole with their head and upper body in frame. ${IMG}` },
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
      { eyebrow: 'The paper', title: 'Pressed one sheet at a time', body: 'Our cards are letterpressed in-house on a hundred-year-old press, so every one carries a little bite of ink.', image: `A vintage letterpress printing a soft pink greeting card, close-up, warm light. A single large capital letter A is the only character anywhere in the image, on the press and on the card; no other letters, words, numbers or logos appear. ${IMG}` },
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
      `A florist wrapping a bouquet in brown paper at a sunlit counter, twine and scissors beside them. The person at work is shown whole with their head and upper body in frame. ${IMG}`,
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
      { eyebrow: 'The guarantee', title: 'We fix it, for life', body: 'Send in a worn-out piece and we patch it and send it back. No receipt, no expiry, no fine print.', image: `A repair technician patching a green outdoor jacket at a workshop bench, patch kit and seam tape beside them, warm workshop light. The person at work is shown whole with their head and upper body in frame. ${IMG}` },
    ],
    iconFeatures: [
      { icon: 'ShieldCheck', title: 'Lifetime guarantee', body: 'Repairs included, for as long as you own it.' },
      { icon: 'Recycle', title: 'Recycled shells', body: 'Bluesign fabrics from post-consumer materials.' },
      { icon: 'Mountain', title: 'Field-tested', body: 'Proven above the treeline before it ships.' },
      { icon: 'Leaf', title: 'Carbon neutral', body: 'Every order, offset at no cost to you.' },
    ],
    gallery: [
      `A three-layer hardshell jacket laid out alone on a rocky alpine ridge, dramatic overcast light. No people, no hands, no body parts and no mannequin appear — the jacket by itself. ${IMG}`,
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
      `A cartoon meadow scene with friendly bees and rounded honeycomb shapes, warm honey-gold palette. Absolutely no text, letters, words, numbers or logos appear anywhere in the image — no lettering on any object, sign, page or screen. ${IMG}`,
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
      { eyebrow: 'The setting', title: 'Drawn around your stone', body: 'Every setting is designed for its stone, never pulled from a tray, then set by hand in gold or platinum.', image: `A gold ring with a freshly set gemstone resting on a jeweller's workbench beside fine setting tools, elegant macro. No people, no hands and no body parts appear in the frame. ${IMG}` },
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

  // ---- Ported from the static-HTML samples (sites 1-10) ----
  'aurora-sound': {
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
      'A glowing liquid light-wave album cover in vivid neon, abstract and futuristic. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      'A dark club dancefloor lit by teal and pink lasers, atmospheric. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      'A close-up of a colored vinyl record catching neon light. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      'A neon-lit DJ booth at night, glowing knobs and faders. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
    ],
    altRows: [
      {
        eyebrow: 'The label',
        title: 'We press what we would play',
        body: 'Every release is a record we would drop ourselves at 2am. If it does not move the floor, it does not get a catalogue number.',
        image: 'A DJ playing a glowing neon-lit set in a dark club, cinematic. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      },
      {
        eyebrow: 'The artists',
        title: 'First on every split',
        body: 'Artists keep the lion’s share and the masters. We are here to press it, push it, and get out of the way.',
        image: 'A glowing studio mixing console photographed head-on at night, faders and knobs lit by neon accents, the studio empty behind it. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      },
    ],
    bigQuote: { quote: 'The only label whose whole catalogue I buy on sight.', name: 'DJ Verre', role: 'Resident, Basement FM' },
    faq: [
      { q: 'Do you take demos?', a: 'Always. Send a private link, not an attachment, and give us two weeks.' },
      { q: 'Is everything on vinyl?', a: 'Most releases, in short coloured runs, plus lossless digital.' },
      { q: 'Do you book the label nights?', a: 'We do. Join the list for dates and guest slots.' },
      { q: 'Where do you ship?', a: 'Worldwide, from the plant nearest you.' },
    ],
  },

  'terra-ceramics': {
    kit: 'soft',
    sections: [
      'stats',
      'about',
      'altRows',
      'items',
      'process',
      'iconFeatures',
      'gallery',
      'pricing',
      'testimonials',
      'faq',
      'band',
      'newsletter',
    ],
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
        {
          name: 'One evening',
          price: '75 GBP',
          unit: 'per person',
          body: 'Three hours, one wheel, everything fired and posted to you afterwards.',
          includes: ['All clay and glazes', 'Two pieces fired', 'Wine, obviously'],
          cta: 'Book an evening',
        },
        {
          name: 'Six weeks',
          price: '390 GBP',
          unit: 'per course',
          body: 'The proper introduction, from centring to a glazed set you actually use.',
          includes: ['Six sessions of three hours', 'Ten kilos of clay', 'Open studio on Sundays'],
          cta: 'Book a course',
          featured: true,
        },
        {
          name: 'Studio member',
          price: '180 GBP',
          unit: 'per month',
          body: 'A shelf, a key, and the run of the place outside class hours.',
          includes: ['Access around the clock', 'Firing at cost', 'Your own shelf and locker'],
          cta: 'Ask about space',
        },
      ],
    },
    altRows: [
      {
        eyebrow: 'On the wheel',
        title: 'Thrown, trimmed, and glazed by hand',
        body: 'Every piece is thrown one day and trimmed the next, then dipped by hand in glaze we mix ourselves. The little marks are the maker saying hello.',
        image: "A half-thrown clay vessel standing on a potter's wheel, water bowl and ribs on the splash pan, warm studio light, the wheel at rest. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.",
      },
      {
        eyebrow: 'In the kiln',
        title: 'A slow fire sets the colour',
        body: 'A long stoneware firing pulls the glaze into its final tone, so the batch shifts gently with the season and the kiln.',
        image: 'Glazed ceramic pieces glowing inside a hot kiln, warm amber light. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      },
    ],
    iconFeatures: [
      { icon: 'Palette', title: 'Mixed in-house', body: 'Glazes blended from local mineral oxides.' },
      { icon: 'Flame', title: 'Stoneware fired', body: 'A slow high firing that makes it last.' },
      { icon: 'ShieldCheck', title: 'Food-safe', body: 'Lead-free, dishwasher-friendly glazes.' },
    ],
    gallery: [
      'A ripple bowl in warm terracotta glaze on linen, artisanal ceramics. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      'A row of hand-thrown mugs drying on a studio shelf. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      'A potter trimming a leather-hard bowl on the wheel, curls of clay around the wheel head, warm light. The person at work is shown whole with their head and upper body in frame. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      'A matte dune-toned vase with a single dried stem. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
    ],
    faq: [
      { q: 'Are the pieces dishwasher safe?', a: 'Yes, though hand-washing keeps the glaze its best.' },
      { q: 'Why does my piece look slightly different?', a: 'Each is thrown and glazed by hand, so no two match exactly.' },
      { q: 'Do you take custom orders?', a: 'For sets of six or more, with a few weeks’ notice.' },
      { q: 'Do you run classes?', a: 'Weekly beginner wheel classes, spots open each season.' },
    ],
  },

  meridian: {
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
        {
          name: 'Standard',
          price: '2.4%',
          unit: 'plus 20p',
          body: 'Everything switched on from the first transaction.',
          includes: ['All payment methods', 'Full API and dashboard', 'Next day settlement'],
          cta: 'Start building',
        },
        {
          name: 'Scale',
          price: '1.9%',
          unit: 'plus 15p',
          body: 'From one million a month, applied automatically, no renegotiation.',
          includes: ['Everything in Standard', 'Same day settlement', 'A named engineer'],
          cta: 'Talk to us',
          featured: true,
        },
        {
          name: 'Platform',
          price: 'Custom',
          unit: 'interchange plus',
          body: 'For marketplaces moving money on behalf of other people.',
          includes: ['Split payments and payouts', 'Onboarding APIs', 'Dedicated infrastructure'],
          cta: 'Contact sales',
        },
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
      {
        eyebrow: 'The ledger',
        title: 'Correct by construction',
        body: 'We start with a double-entry ledger and expose payments on top, so your balances reconcile in real time and an audit is a query.',
        image: 'A clean isometric render of a glowing financial ledger graph, cobalt blue fintech. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      },
      {
        eyebrow: 'The routing',
        title: 'Every cent takes the best path',
        body: 'Adaptive routing sends each transaction down the rail most likely to succeed, and retries the smart way when it does not.',
        image: 'An abstract network routing diagram with cyan nodes on deep navy. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      },
    ],
    bigQuote: { quote: 'We replaced three vendors and a spreadsheet with one API.', name: 'Priya S.', role: 'CTO, Cascade' },
    faq: [
      { q: 'How long to integrate?', a: 'Sandbox in a minute, production after one review call.' },
      { q: 'What does it cost?', a: 'Usage-based, with volume pricing and no minimums.' },
      { q: 'Is there a real ledger?', a: 'Yes, double-entry, queryable, and correct in real time.' },
      { q: 'Which regions?', a: 'Forty-plus currencies across North America, EU, and APAC.' },
    ],
  },

  verdant: {
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
      {
        eyebrow: 'Matched to you',
        title: 'The right plant for your light',
        body: 'Tell us which way your windows face and how much sun you get, and we point you to plants that will actually be happy there.',
        image: 'A sunlit windowsill lined with healthy green houseplants, bright and airy. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      },
      {
        eyebrow: 'Delivered thriving',
        title: 'Potted, watered, ready',
        body: 'Every plant arrives in peat-free soil, watered and boxed to stand up straight, with a care card in the leaves.',
        image: 'A potted plant standing in an open cardboard delivery box on a pale floor, packing paper folded back around it, fresh green. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      },
    ],
    iconFeatures: [
      { icon: 'Leaf', title: 'Light-matched', body: 'A quick quiz points you to plants that suit your space.' },
      { icon: 'Truck', title: 'Next-day local', body: 'Potted and delivered across the city.' },
      { icon: 'MessagesSquare', title: 'Text a botanist', body: 'Real care advice whenever a leaf looks unsure.' },
      { icon: 'Recycle', title: 'Peat-free', body: 'Kinder soil, sturdier roots.' },
    ],
    gallery: [
      'A ZZ plant with glossy leaves in a matte pot, bright airy interior. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      'A tall fiddle-leaf fig in a woven basket by a window. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      'A cluster of small potted succulents on a shelf. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      'A large monstera deliciosa in a simple ceramic pot against a pale wall, broad glossy split leaves. This is a houseplant, not an animal, and no birds or creatures appear. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
    ],
    faq: [
      { q: 'What if my plant struggles?', a: 'Our 30-day thrive promise replaces it, no receipt needed.' },
      { q: 'Do you deliver everywhere?', a: 'Next-day within the city, standard shipping nationwide.' },
      { q: 'Are the plants pet-safe?', a: 'Each listing flags pet-safe options clearly.' },
      { q: 'Can I gift a plant?', a: 'Yes, with a hand-written note and gift wrap.' },
    ],
  },

zest: {
    kit: 'soft',
    sections: [
      'stats',
      'manifesto',
      'iconFeatures',
      'items',
      'process',
      'altRows',
      'gallery',
      'pricing',
      'testimonials',
      'faq',
      'band',
      'newsletter',
    ],
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
        {
          name: 'Free',
          price: '0 GBP',
          unit: 'forever',
          body: 'Two new recipes a week and the whole basics section.',
          includes: ['Two recipes weekly', 'Every technique guide', 'No account needed'],
          cta: 'Start cooking',
        },
        {
          name: 'Member',
          price: '5 GBP',
          unit: 'per month',
          body: 'Everything, plus the shopping list that actually adds up.',
          includes: ['The full archive', 'Shopping lists built for you', 'Seasonal meal plans'],
          cta: 'Join',
          featured: true,
        },
        {
          name: 'Household',
          price: '40 GBP',
          unit: 'per year',
          body: 'Up to five people, one bill, lists shared across everyone phones.',
          includes: ['Everything in Member', 'Five accounts', 'One shared weekly plan'],
          cta: 'Join',
        },
      ],
    },
    manifesto: {
      kicker: 'The Zest rule',
      text: 'If a tired person cannot cook it on a Tuesday, it does not go in the box. Short lists, big flavour, every time.',
    },
    iconFeatures: [
      { icon: 'Timer', title: '30 minutes', body: 'Most recipes, start to plate, in half an hour.' },
      { icon: 'Flame', title: 'One pan', body: 'Less washing up, more eating.' },
      { icon: 'Salad', title: 'Ten ingredients', body: 'Things you can actually find, nothing obscure.' },
    ],
    altRows: [
      {
        eyebrow: 'Tested',
        title: 'Cooked until a beginner can nail it',
        body: 'Every recipe gets made again and again until the steps are foolproof and the timing is honest.',
        image: 'A bright overhead shot of a colorful fresh weeknight dinner in a bowl. The food itself is warm and natural — reds, oranges, yellows, greens and browns only. No blue or teal anywhere on the food; the teal in the palette belongs to props and linens in the background, never to anything edible. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      },
      {
        eyebrow: 'Fast',
        title: 'Built for a real weeknight',
        body: 'Short ingredient lists, short cook times, and a timer baked into every step so nothing burns.',
        image: 'A skillet of vibrant vegetables sizzling on a stovetop, bright and fresh. The food itself is warm and natural — reds, oranges, yellows, greens and browns only. No blue or teal anywhere on the food; the teal in the palette belongs to props and linens in the background, never to anything edible. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      },
    ],
    gallery: [
      'A vibrant chili-lime corn bowl, appetizing overhead food photo. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      'A skillet of blistered tomato orzo with basil. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      'A bowl of glossy sesame crunch noodles with scallions. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      'Charred broccoli tacos on a bright plate. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
    ],
    faq: [
      { q: 'How does the box work?', a: 'A recipe lands in your inbox every weekday afternoon.' },
      { q: 'Can I filter for diet?', a: 'Yes, vegetarian, vegan, and quick filters on everything.' },
      { q: 'Do I need special equipment?', a: 'A pan, a pot, and a knife. That is the whole kit.' },
      { q: 'Is it free?', a: 'The weekday recipe is free. Members get the full archive.' },
    ],
  },

  nocturne: {
    kit: 'minimal',
    sections: [
      'manifesto',
      'about',
      'items',
      'specs',
      'altRows',
      'bigQuote',
      'iconFeatures',
      'process',
      'gallery',
      'faq',
      'band',
      'newsletter',
    ],
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
    manifesto: {
      kicker: 'The house',
      text: 'A perfume should change as the night does. We compose in a few notes, held in balance, that unfold for hours.',
    },
    altRows: [
      {
        eyebrow: 'The composition',
        title: 'Built around one accord',
        body: 'Each scent begins with a single idea and a few materials, layered so it opens, turns, and settles like a piece of music.',
        image: 'A dark still life of a faceted perfume bottle among night flowers, deep violet. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      },
      {
        eyebrow: 'The maturation',
        title: 'Rested before it is bottled',
        body: 'Every batch sits for weeks so the materials marry, then it is decanted into refillable glass by hand.',
        image: "A perfumer's dim atelier with amber bottles and a single lamp, moody violet. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.",
      },
    ],
    bigQuote: { quote: 'It smells like a memory I have not made yet.', name: 'Iris N.', role: 'Client' },
    iconFeatures: [
      { icon: 'Moon', title: 'Composed for night', body: 'Deeper materials that speak after dark.' },
      { icon: 'FlaskConical', title: 'Extrait strength', body: 'High concentration, long on the skin.' },
      { icon: 'Recycle', title: 'Refillable glass', body: 'Bring the bottle back, we fill it again.' },
    ],
    gallery: [
      'A faceted perfume bottle glowing amethyst on black velvet, luxurious. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      'A dark arrangement of night-blooming flowers, deep purple. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      'A minimalist flacon backlit in soft violet haze. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      'A close-up of perfume being sprayed, a fine violet mist. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
    ],
    faq: [
      { q: 'How long does it last?', a: 'Our extraits sit close to the skin for eight hours or more.' },
      { q: 'Can I try before buying?', a: 'The discovery set holds three, redeemable against a bottle.' },
      { q: 'Do you refill?', a: 'Bring any Nocturne bottle back for a refill at a lower price.' },
      { q: 'Are they vegan?', a: 'Fully vegan and never tested on animals.' },
    ],
  },

  shoreline: {
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
      portraitScene:
        'in a sunlit coastal architecture studio, drawings and balsa massing models on the table behind them',
      people: [
        {
          name: 'Elin Vasser',
          role: 'Founding partner',
          bio: 'Twenty years of coastal work and a stubborn dislike of the word seamless.',
          look: 'a woman in her fifties with a sharp grey bob and architect blacks',
        },
        {
          name: 'Rhys Ostrander',
          role: 'Partner',
          bio: 'Runs the technical side and knows what salt air does to every fixing we specify.',
          look: 'a man in his fifties with weathered skin and a rumpled linen shirt',
        },
        { name: 'Aoife Brennan', role: 'Associate', bio: 'Leads the housing work and the practice research into coastal erosion.', look: 'a red-haired woman in her twenties with freckles, wool jumper' },
        {
          name: 'Sam Iwu',
          role: 'Project architect',
          bio: 'On site more than in the studio, which is how the details survive the build.',
          look: 'a Black man in his thirties with round glasses and a rolled sketch under one arm',
        },
      ],
    },
    altRows: [
      {
        eyebrow: 'The site',
        title: 'We walk the land first',
        body: 'Every project starts on the ground at different tides and times of day. The building follows the light and the weather, not the other way round.',
        image: 'An architect walking a windswept coastal site at golden hour, wide and calm. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      },
      {
        eyebrow: 'The materials',
        title: 'Chosen to grey gracefully',
        body: 'Timber, stone, and lime that weather into the coast instead of fighting it, and ask little of the years.',
        image: 'A close-up of weathered timber cladding on a coastal house, soft grey light. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      },
    ],
    iconFeatures: [
      { icon: 'Wind', title: 'Built for weather', body: 'Low, sheltering forms that hold the wind.' },
      { icon: 'Sun', title: 'Planned for light', body: 'Rooms placed where the light lands.' },
      { icon: 'Compass', title: 'Site-led', body: 'Every design begins on the land.' },
      { icon: 'Ruler', title: 'Low-energy', body: 'Fabric-first, quiet on running costs.' },
    ],
    bigQuote: { quote: 'They gave us a house that feels like the coast itself.', name: 'The Aldous family', role: 'Salt House' },
    gallery: [
      'A low-slung timber coastal house against a grey sky, calm architecture. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      'A minimalist dune pavilion with glass facing the sea. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      'A stone harbourside building at dusk with deep window reveals. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      'An interior with a large window framing the ocean, soft light. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
    ],
    faq: [
      { q: 'Where do you work?', a: 'Coastlines, mostly. We travel for the right project.' },
      { q: 'Do you do renovations?', a: 'Yes, alongside new-builds and civic work.' },
      { q: 'How do fees work?', a: 'A percentage of build cost, staged by RIBA work stage.' },
      { q: 'How long does a house take?', a: 'Typically eighteen months from first sketch to keys.' },
    ],
  },

  'pixel-playhouse': {
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
      portraitScene:
        'at a desk in a small indie game studio, monitors glowing behind them in a warm, cluttered room',
      people: [
        { name: 'Bex Nowak', role: 'Director', bio: 'Designed the levels and wrote most of the dialogue, then rewrote all of it.', look: 'a woman in her thirties with an undercut and tattooed forearms, band t-shirt' },
        { name: 'Tunde Alabi', role: 'Engine', bio: 'Built the renderer that makes 32 by 32 sprites look the way they do.', look: 'a Black man in his twenties with short locs and headphones round his neck' },
        { name: 'Ivy Chen', role: 'Art', bio: 'Every sprite, every tile, and every frame of the animation.', look: 'a Chinese woman in her twenties with dyed pastel hair and a hoodie' },
        { name: 'Marek Dolny', role: 'Audio', bio: 'Composed the score on hardware older than most of the team.', look: 'a man in his forties with a greying ponytail and a knitted cardigan' },
      ],
    },
    iconFeatures: [
      { icon: 'Gamepad2', title: 'Cozy by design', body: 'Short sessions that respect your evening.' },
      { icon: 'Heart', title: 'Demo first', body: 'Every game ships a demo before it asks for a cent.' },
      { icon: 'Music', title: 'Free soundtracks', body: 'Every score up on Bandcamp, name your price.' },
      { icon: 'Sparkles', title: 'Built in the open', body: 'Devlogs every Friday, no exceptions.' },
    ],
    gallery: [
      'A cozy pixel-art town at dusk with glowing streetlights, warm vaporwave pinks. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      'A neon rooftop delivery scene in pixel art, night city with pink and blue glow. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      'A colorful pixel-art coral reef aquarium scene, pastel vaporwave. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      'A retro falling-blocks arcade game screen in vivid neon. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
    ],
    altRows: [
      {
        eyebrow: 'The studio',
        title: 'Three friends, no publisher',
        body: 'We make the games we want to come home to. Warm, weird, and never in a hurry, funded by the players who love them.',
        image: 'A cozy indie game studio room with pixel-art posters and warm lamps, night. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      },
      {
        eyebrow: 'The vibe',
        title: 'No crunch, just vibes',
        body: 'We ship when it is ready and rest when it is not. Turns out you can make good games and sleep too.',
        image: 'A relaxed desk at night: a handheld games console propped on a stand, a warm mug and a small lamp beside it, cozy glow. Soft natural light, shallow depth of field, high detail, no text or logos. Any person in the frame is shown whole and uncropped — no disembodied hands, no limbs cut off by the edge, and no bodies without heads.',
      },
    ],
    bigQuote: { quote: 'The comfort food of video games. I adore it.', name: 'pixelfox', role: 'Player' },
    faq: [
      { q: 'What platforms?', a: 'PC and Mac now, Switch for the next one.' },
      { q: 'Is there a demo?', a: 'Always, on the store page before you buy.' },
      { q: 'Where is the soundtrack?', a: 'On Bandcamp, name your price, all of it to the composer.' },
      { q: 'Can I follow development?', a: 'Devlogs land every Friday, join the list.' },
    ],
  },

};
