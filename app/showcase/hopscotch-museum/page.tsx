import { TabbiedArtwork } from 'tabbied/react';
import { glyph, polkadot } from 'tabbied/artworks';
import { Figure } from 'components/Figure';
import styles from './hopscotch-museum.module.css';

export const metadata = {
  title: 'Hopscotch · The Children’s Discovery Museum',
  description:
    'Three floors of climbing, splashing, launching and why-ing for ages 0–12. Open Tue–Sun at 88 Marble Run Way. Yes, there is coffee.',
};

const CREAM = '#FFF9EF';
const INK = '#2B2B33';
const RED = '#FF5C4D';
const BLUE = '#2E86DE';
const GREEN = '#27C093';
const YELLOW = '#FFC53D';

const todayProgram = [
  {
    time: '9:30',
    color: styles.chipGreen,
    name: 'Tiny Tinkerers',
    ages: 'Ages 0–3',
    blurb: 'Soft blocks, big ramps, zero wrong answers. Socks required, giggling inevitable.',
  },
  {
    time: '11:00',
    color: styles.chipRed,
    name: 'Rocket Countdown',
    ages: 'Ages 4+',
    blurb: 'We launch the foam rocket off the loft. Everybody counts down. Everybody.',
  },
  {
    time: '1:30',
    color: styles.chipBlue,
    name: 'River Deep Dive',
    ages: 'All ages',
    blurb: 'Dams, locks and whirlpools in the water channel. Ponchos provided, mostly worn.',
  },
  {
    time: '3:00',
    color: styles.chipYellow,
    name: 'Dino Dig Story',
    ages: 'Ages 3–8',
    blurb: 'Twenty minutes with Pearl the apatosaurus and a very dramatic librarian.',
  },
];

const exhibits = [
  {
    name: 'Blast-Off Loft',
    ages: 'Ages 4+',
    slug: 'hopscotch-rocket-cutout',
    alt: 'Red and white striped toy rocket standing on its fins',
    blurb:
      'A two-storey rocket you climb through, mission control included. Countdown button pressed roughly 4,000 times a day.',
    tile: 'pattern' as const,
    bg: YELLOW,
    seed: 'hop-rocket',
    palette: [YELLOW, INK, RED, CREAM],
    tall: true,
  },
  {
    name: 'Bones & Stones',
    ages: 'Ages 3–8',
    slug: 'hopscotch-dino-cutout',
    alt: 'Toy dinosaur skeleton mounted on little red wheels',
    blurb:
      'Meet Pearl, our rolling apatosaurus. Brush sand off real-feel fossils, then vote on what dinosaurs sounded like. (Honk, currently.)',
    tile: 'pattern' as const,
    bg: GREEN,
    seed: 'hop-dino',
    palette: [GREEN, INK, CREAM, YELLOW],
    tall: false,
  },
  {
    name: 'The Gear Wall',
    ages: 'All ages',
    slug: 'hopscotch-gears-cutout',
    alt: 'Colourful cluster of interlocking plastic gears',
    blurb:
      'Forty cranks, one wall, infinite clatter. Make the whole thing spin and a bell rings somewhere upstairs. Find the bell.',
    tile: 'flat' as const,
    bg: RED,
    tall: false,
  },
  {
    name: 'Look-Closer Lab',
    ages: 'Ages 5+',
    slug: 'hopscotch-magnifier-cutout',
    alt: 'Magnifying glass with a ladybird sitting on the lens',
    blurb:
      'Microscopes set to “whoa.” Butterfly wings, salt crystals, and whatever interesting leaf you brought in your pocket.',
    tile: 'flat' as const,
    bg: YELLOW,
    tall: false,
  },
  {
    name: 'Light Splitters',
    ages: 'All ages',
    slug: 'hopscotch-prism-cutout',
    alt: 'Glass prism splitting a beam of light into a rainbow',
    blurb:
      'A dark room, a bright beam, and prisms on every table. Rainbows on demand: the good kind of screen time (no screens).',
    tile: 'pattern' as const,
    bg: BLUE,
    seed: 'hop-prism',
    palette: [BLUE, CREAM, YELLOW, RED],
    tall: false,
  },
];

const admission = [
  { who: 'Grown-ups', price: '$14' },
  { who: 'Kids (1–12)', price: '$12' },
  { who: 'Babies under 1', price: '$0' },
  { who: 'Members', price: 'Free, forever' },
  { who: 'First Fridays, 5–8 pm', price: 'Pay what you wish' },
];

const hours = [
  { day: 'Monday', open: 'Closed (we mop)' },
  { day: 'Tue – Fri', open: '9 am – 5 pm' },
  { day: 'Saturday', open: '9 am – 6 pm' },
  { day: 'Sunday', open: '10 am – 5 pm' },
];

const parties = [
  {
    name: 'The Sprinkle',
    price: '$225',
    color: styles.partyCardYellow,
    perks: [
      'Up to 10 kids, 90 minutes',
      'Private party room + host',
      'Museum admission all day',
      'You bring the cake, we bring the wow',
    ],
  },
  {
    name: 'The Big Bang',
    price: '$325',
    color: styles.partyCardCream,
    perks: [
      'Up to 16 kids, 2 hours',
      'Private rocket-room countdown',
      'A science demo with (safe) explosions',
      'Paper crowns. Non-negotiable.',
    ],
  },
];

const memberships = [
  { name: 'Duo', price: '$95', per: '/year', note: '1 grown-up + 1 kid' },
  { name: 'Crew', price: '$145', per: '/year', note: 'Up to 5 people, any mix' },
  { name: 'Grand Crew', price: '$185', per: '/year', note: 'Crew + grandparents ride free' },
];

const memberPerks = [
  'Unlimited visits, all year',
  'Members-only early hour every Saturday',
  '10% off birthday parties & the café',
  'Free entry at 40 partner museums',
  'First dibs on camp sign-ups',
];

const faqs = [
  {
    q: 'Do grown-ups need a ticket too?',
    a: 'Yes, every visitor gets a ticket, sized small or tall. Kids must bring at least one grown-up; grown-ups must bring at least one kid (or their inner one, on First Fridays).',
  },
  {
    q: 'Is there somewhere to park the stroller fleet?',
    a: 'A whole garage of it, just past the ticket desk. Valet not included, snack retrieval encouraged before docking.',
  },
  {
    q: 'What about lunch?',
    a: 'The Snack Orbit café does grilled cheese, fruit rockets and flat whites. You may also bring your own picnic; the lunchroom on Floor 2 has bibs and a very forgiving floor.',
  },
  {
    q: 'Will my kid get wet at River Works?',
    a: 'Statistically, yes. Ponchos hang at the door and the dryers by the exit are, per our visitors, “the best exhibit.”',
  },
  {
    q: 'Can we leave and come back the same day?',
    a: 'Absolutely. Your wristband is good all day. Nap, regroup, return for the 3 pm dino story.',
  },
];

export default function HopscotchMuseumPage() {
  return (
    <div className={styles.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,400..800;1,14..32,400..800&display=swap"
      />

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a href="#top" className={styles.logo}>
            <span className={styles.logoHopRed}>hop</span>
            <span className={styles.logoHopBlue}>scotch</span>
            <span className={styles.logoBang}>!</span>
          </a>
          <nav className={styles.nav} aria-label="Site">
            <a href="#exhibits">Exhibits</a>
            <a href="#visit">Visit</a>
            <a href="#birthdays">Birthdays</a>
            <a href="#membership">Membership</a>
            <a href="#faq">FAQ</a>
          </nav>
          <a href="#visit" className={styles.ticketBtn}>
            Get tickets
          </a>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroPattern} role="presentation">
            <TabbiedArtwork
              artwork={glyph}
              palette={[CREAM, RED, BLUE, GREEN, YELLOW]}
              seed="hop-hero"
              fit="grid"
            />
          </div>
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <h1 id="hero-title" className={styles.heroTitle}>
                Where <span className={styles.underRed}>“don’t touch”</span> isn’t a thing.
              </h1>
              <p className={styles.heroLede}>
                Three floors of climbing, splashing, launching and why-ing for ages 0–12, and
                the lucky grown-ups they bring along.
              </p>
              <div className={styles.heroBtns}>
                <a href="#visit" className={styles.bigBtn}>
                  Plan a visit
                </a>
                <a href="#today" className={styles.bigBtnGhost}>
                  What’s on today
                </a>
              </div>
              <p className={styles.heroSmall}>
                Open today 9 – 5 · 88 Marble Run Way, Pemberton Falls
              </p>
            </div>
            <div className={styles.heroPhotoWrap}>
              <div className={styles.heroPhoto}>
                <Figure
                  slug="hopscotch-hero"
                  alt="Children gazing up at a glowing model solar system hanging from the museum ceiling"
                  priority
                />
              </div>
              <span className={`${styles.sticker} ${styles.stickerYellow}`}>open today 9–5</span>
              <span className={`${styles.sticker} ${styles.stickerGreen}`}>ages 0–12ish</span>
              <span className={`${styles.sticker} ${styles.stickerRed}`}>yes, there’s coffee</span>
            </div>
          </div>
        </section>

        {/* TODAY */}
        <section id="today" className={styles.today} aria-labelledby="today-title">
          <h2 id="today-title" className={styles.h2}>
            Today at the museum
          </h2>
          <p className={styles.sectionLede}>
            Drop-in, no sign-up, included with admission. Times are firm-ish; enthusiasm is
            guaranteed.
          </p>
          <div className={styles.todayGrid}>
            {todayProgram.map((slot, i) => (
              <article key={slot.name} className={styles.todayCard} data-tilt={i % 2}>
                <span className={`${styles.timeChip} ${slot.color}`}>{slot.time}</span>
                <h3>{slot.name}</h3>
                <p className={styles.todayAges}>{slot.ages}</p>
                <p>{slot.blurb}</p>
              </article>
            ))}
          </div>
        </section>

        {/* EXHIBITS */}
        <section id="exhibits" className={styles.exhibits} aria-labelledby="exhibits-title">
          <h2 id="exhibits-title" className={styles.h2}>
            The exhibits
          </h2>
          <p className={styles.sectionLede}>
            Built for small hands, sturdy enough for big ones. Every single thing is a
            please-touch thing.
          </p>
          <div className={styles.exhibitGrid}>
            {exhibits.map((ex, i) => (
              <article key={ex.name} className={styles.exhibitCard} data-tilt={i % 3}>
                <div
                  className={[
                    ex.tall ? styles.exhibitTileTall : styles.exhibitTile,
                    ex.tile === 'pattern' ? styles.patternTile : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={{ backgroundColor: ex.bg }}
                >
                  {ex.tile === 'pattern' && ex.palette && (
                    <TabbiedArtwork
                      artwork={glyph}
                      palette={ex.palette}
                      seed={ex.seed}
                      fit="grid"
                      className={styles.exhibitPattern}
                    />
                  )}
                  <Figure slug={ex.slug} cutout alt={ex.alt} className={styles.exhibitImg} />
                </div>
                <div className={styles.exhibitBody}>
                  <h3>{ex.name}</h3>
                  <span className={styles.ageBadge}>{ex.ages}</span>
                  <p>{ex.blurb}</p>
                </div>
              </article>
            ))}
            <article className={styles.exhibitCard} data-tilt={2}>
              <div className={styles.exhibitPhoto}>
                <Figure
                  slug="hopscotch-water"
                  alt="Kids steering boats and building dams along a winding water channel exhibit"
                />
              </div>
              <div className={styles.exhibitBody}>
                <h3>River Works</h3>
                <span className={styles.ageBadge}>All ages</span>
                <p>
                  Forty feet of winding water: dams to build, locks to open, boats to race.
                  The dryers by the exit are, honestly, also very popular.
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* VISIT */}
        <section id="visit" className={styles.visit} aria-labelledby="visit-title">
          <div className={styles.zigTopBlue} role="presentation" />
          <div className={styles.visitBand}>
            <TabbiedArtwork
              artwork={polkadot}
              palette={[BLUE, CREAM, YELLOW, GREEN]}
              seed="hop-visit"
              fit="cover"
              density={1}
              className={styles.visitPattern}
            />
            <div className={styles.visitScrim} aria-hidden="true" />
            <h2 id="visit-title" className={styles.h2Light}>
              Plan your visit
            </h2>
            <div className={styles.visitGrid}>
              <div className={styles.visitCard}>
                <h3>Admission</h3>
                <ul className={styles.priceList}>
                  {admission.map((row) => (
                    <li key={row.who}>
                      <span>{row.who}</span>
                      <span className={styles.priceDots} aria-hidden="true" />
                      <strong>{row.price}</strong>
                    </li>
                  ))}
                </ul>
                <p className={styles.visitFine}>
                  Tickets at the door or online; online skips the queue, which on rainy
                  Saturdays is a superpower.
                </p>
              </div>
              <div className={styles.visitCard}>
                <h3>Hours</h3>
                <ul className={styles.hourList}>
                  {hours.map((h) => (
                    <li key={h.day}>
                      <span>{h.day}</span>
                      <strong>{h.open}</strong>
                    </li>
                  ))}
                </ul>
                <p className={styles.visitFine}>
                  Quietest: weekday afternoons. Liveliest: Saturday 10 am, bring snacks and
                  a plan.
                </p>
              </div>
              <div className={styles.visitCard}>
                <h3>Getting here</h3>
                <p className={styles.visitAddress}>
                  88 Marble Run Way
                  <br />
                  Pemberton Falls
                </p>
                <ul className={styles.funList}>
                  <li>Two blocks from Fountain Square station</li>
                  <li>Free stroller garage past the ticket desk</li>
                  <li>Bike racks shaped like dinosaurs (really)</li>
                  <li>Accessible entrance & lifts to every floor</li>
                </ul>
              </div>
            </div>
          </div>
          <div className={styles.zigBottomBlue} role="presentation" />
        </section>

        {/* BIRTHDAYS */}
        <section id="birthdays" className={styles.birthdays} aria-labelledby="birthdays-title">
          <TabbiedArtwork
            artwork={polkadot}
            palette={[CREAM, YELLOW, RED, GREEN, BLUE]}
            seed="hop-birthdays"
            fit="cover"
            density={1}
            className={styles.birthdayConfetti}
          />
          <div className={styles.birthdayScrim} aria-hidden="true" />
          <div className={styles.birthdaysInner}>
            <h2 id="birthdays-title" className={styles.h2}>
              Birthdays & parties
            </h2>
            <p className={styles.sectionLede}>
              You bring the birthday kid. We bring a museum. Cake crumbs are cleaned by
              professionals (us).
            </p>
            <div className={styles.partyGrid}>
              {parties.map((p) => (
                <article key={p.name} className={`${styles.partyCard} ${p.color}`}>
                  <h3>{p.name}</h3>
                  <p className={styles.partyPrice}>{p.price}</p>
                  <ul className={styles.funList}>
                    {p.perks.map((perk) => (
                      <li key={perk}>{perk}</li>
                    ))}
                  </ul>
                  <a href="#footer-contact" className={styles.partyBtn}>
                    Book this one
                  </a>
                </article>
              ))}
            </div>
            <p className={styles.partyFine}>
              Saturdays book out about six weeks ahead. Sundays are the sleeper hit.
            </p>
          </div>
        </section>

        {/* MEMBERSHIP */}
        <section id="membership" className={styles.membership} aria-labelledby="membership-title">
          <div className={styles.memberPanel}>
            <TabbiedArtwork
              artwork={glyph}
              palette={[INK, RED, BLUE, GREEN, YELLOW]}
              seed="hop-member"
              fit="grid"
              className={styles.memberPattern}
            />
            <div className={styles.memberInner}>
              <h2 id="membership-title" className={styles.h2Light}>
                Come back every
                <br />
                single week
              </h2>
              <p className={styles.memberLede}>
                Members break even in three visits. Most break even by February.
              </p>
              <div className={styles.memberTiers}>
                {memberships.map((m) => (
                  <div key={m.name} className={styles.memberTier}>
                    <h3>{m.name}</h3>
                    <p className={styles.memberPrice}>
                      {m.price}
                      <span>{m.per}</span>
                    </p>
                    <p className={styles.memberNote}>{m.note}</p>
                  </div>
                ))}
              </div>
              <ul className={styles.memberPerks}>
                {memberPerks.map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>
              <a href="#footer-contact" className={styles.bigBtnYellow}>
                Become a member
              </a>
            </div>
          </div>
        </section>

        {/* FIELD TRIPS */}
        <section id="fieldtrips" className={styles.fieldTrips} aria-labelledby="ft-title">
          <div className={styles.ftCopy}>
            <h2 id="ft-title" className={styles.h2}>
              Field trips that don’t feel like worksheets
            </h2>
            <p>
              Teachers: we run curriculum-linked visits for pre-K through grade 6, led by our
              educators, timed to your bus. Every trip ends with a build challenge and begins
              with the rule we are famous for: <em>go ahead, touch it.</em>
            </p>
            <ul className={styles.funList}>
              <li>$8 per student, chaperones free, 1 per 5 kids</li>
              <li>Science, water, light & simple machines modules</li>
              <li>Reserved lunchroom slot, bus drop-off at the door</li>
              <li>Scholarship spots every term, just ask</li>
            </ul>
            <a href="#footer-contact" className={styles.bigBtn}>
              Book a school visit
            </a>
          </div>
          <div className={styles.ftStats}>
            <div className={styles.ftStat}>
              <strong>212</strong>
              <span>school visits last year</span>
            </div>
            <div className={styles.ftStat}>
              <strong>14</strong>
              <span>school districts served</span>
            </div>
            <div className={styles.ftStat}>
              <strong>1</strong>
              <span>rule: go ahead, touch it</span>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className={styles.faq} aria-labelledby="faq-title">
          <h2 id="faq-title" className={styles.h2}>
            Questions grown-ups ask
          </h2>
          <div className={styles.faqList}>
            {faqs.map((f) => (
              <details key={f.q} className={styles.faqItem}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer id="footer-contact" className={styles.footer}>
        <div className={styles.zigTopInk} role="presentation" />
        <div className={styles.footerBand}>
          <div className={styles.footerGrid}>
            <div>
              <p className={styles.footerLogo}>
                hopscotch<span>!</span>
              </p>
              <p className={styles.footerTag}>The children’s discovery museum</p>
            </div>
            <div>
              <h3>Find us</h3>
              <p>
                88 Marble Run Way
                <br />
                Pemberton Falls
              </p>
            </div>
            <div>
              <h3>Say hi</h3>
              <p>
                hello@hopscotchmuseum.example
                <br />
                (555) 014-8890
              </p>
            </div>
            <div>
              <h3>Open</h3>
              <p>
                Tue – Sun, from 9 am
                <br />
                Closed Mondays (we mop)
              </p>
            </div>
          </div>
          <div className={styles.footerField} role="presentation">
            <TabbiedArtwork
              artwork={polkadot}
              palette={[INK, YELLOW, RED, BLUE, GREEN]}
              seed="hop-footer"
              fit="grid"
            />
          </div>
          <p className={styles.footerCredit}>
            Confetti patterns by{' '}
            <a href="https://tabbied.com" rel="noopener">
              Tabbied
            </a>{' '}
            · © Hopscotch Discovery Museum
          </p>
        </div>
      </footer>
    </div>
  );
}
