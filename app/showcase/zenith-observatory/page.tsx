import { TabbiedArtwork } from 'tabbied/react';
import { spark } from 'tabbied/artworks';
import { Figure } from 'components/Figure';
import styles from './zenith-observatory.module.css';

export const metadata = {
  title: 'Zenith Observatory & Planetarium',
  description:
    'A public observatory on Cinder Ridge: viewing nights under a 0.61 m telescope, planetarium shows daily, school programs, and the darkest public sky within two hours of the city.',
};

const SPACE = '#10002B';
const NEBULA = '#5A189A';
const VIOLET = '#9D4EDD';
const ORCHID = '#C77DFF';
const LILAC = '#E0AAFF';
const PALE = '#FFD6FF';

const SKY_PALETTE = [SPACE, NEBULA, VIOLET, ORCHID, LILAC, PALE];
const FAINT_PALETTE = [SPACE, '#2A0A55', NEBULA, VIOLET];
const BRIGHT_PALETTE = ['#1B0440', ORCHID, LILAC, PALE, VIOLET];

const SHOWS = [
  {
    time: '18:30',
    name: 'First Light',
    detail: 'Our gentlest show — how eyes adapt to darkness, and what to look for tonight. Recommended before any viewing night.',
    dur: '35 MIN · ALL AGES',
  },
  {
    time: '19:45',
    name: 'The Slow Comets',
    detail: 'Icy visitors on thousand-year clocks: where they sleep, why they wake, and the comet due back the year you turn ninety.',
    dur: '40 MIN · AGES 8+',
  },
  {
    time: '21:00',
    name: 'Deep Field',
    detail: 'One patch of apparently empty sky, magnified until it holds ten thousand galaxies. Quiet, enormous, and our staff favourite.',
    dur: '45 MIN · AGES 12+',
  },
];

const TONIGHT = [
  { obj: 'Saturn', coords: 'RA 23h 04m · DEC −07° 41′', note: 'rings tilted 11° — best after 22:30' },
  { obj: 'M31 · Andromeda', coords: 'RA 00h 42m · DEC +41° 16′', note: 'naked-eye from the ridge on clear nights' },
  { obj: 'Albireo', coords: 'RA 19h 30m · DEC +27° 57′', note: 'gold-and-sapphire double star, crowd favourite' },
  { obj: 'Waxing Moon', coords: 'RA 14h 11m · DEC −12° 03′', note: 'terminator craters through the 20 cm refractor' },
];

const EXHIBITS = [
  {
    slug: 'zenith-planet-cutout',
    alt: 'Model of a ringed gas giant planet',
    name: 'The Ring Room',
    copy: 'A four-metre ringed giant you can walk beneath. Stand under the ring plane and watch it thin to a knife-edge — the same trick Saturn plays every fifteen years.',
  },
  {
    slug: 'zenith-comet-cutout',
    alt: 'Model comet with a bright head and streaming twin tails',
    name: 'Dirty Snowball',
    copy: 'A one-tonne comet nucleus reconstruction, kept at −20 °C behind glass. Touch the meteorite beside it: it is 4.5 billion years old and has been patient.',
  },
  {
    slug: 'zenith-moon-cutout',
    alt: 'Crescent moon model showing crater detail along the terminator',
    name: 'Terminator Line',
    copy: 'A crescent moon two storeys tall, lit by a slow artificial sun. Watch shadows crawl across crater floors — a lunar day compressed into eight minutes.',
  },
];

const PRICES = [
  { who: 'Adults', amt: '$14' },
  { who: 'Under 16', amt: '$8' },
  { who: 'Under 5', amt: 'Free' },
  { who: 'Viewing night add-on', amt: '$6' },
  { who: 'Planetarium show', amt: '$5' },
  { who: 'Ridge parking', amt: 'Free' },
];

const TIERS = [
  {
    name: 'Stargazer',
    price: '$48 / yr',
    perks: ['Unlimited daytime admission', 'Two viewing-night passes', 'Member newsletter, on paper'],
    featured: false,
  },
  {
    name: 'Astronomer',
    price: '$96 / yr',
    perks: [
      'Everything in Stargazer',
      'Unlimited viewing nights',
      'Eyepiece time on the 0.61 m',
      'Guest pass every visit',
    ],
    featured: true,
  },
  {
    name: 'Deep Field',
    price: '$220 / yr',
    perks: ['Everything in Astronomer', 'Annual all-night session', 'Name on a ridge bench', 'Family admission, always'],
    featured: false,
  },
];

export default function ZenithObservatoryPage() {
  return (
    <div className={styles.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Unbounded:wght@300;400;600;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
      />

      {/* ——— HERO ——— */}
      <header className={styles.hero}>
        <TabbiedArtwork
          artwork={spark}
          palette={SKY_PALETTE}
          seed="zen-sky-07"
          fit="cover"
          density={2}
          style={{ position: 'absolute', inset: 0 }}
        />
        <div className={styles.heroVeil} aria-hidden="true" />

        <div className={styles.topRow}>
          <p className={styles.brand}>
            <span aria-hidden="true">✦</span> ZENITH
          </p>
          <nav className={styles.nav} aria-label="Sections">
            <a href="#tonight">Tonight</a>
            <a href="#exhibits">Exhibits</a>
            <a href="#telescope">Telescope</a>
            <a href="#visit">Visit</a>
            <a href="#membership">Membership</a>
          </nav>
          <p className={styles.coords}>44.02° N · 121.31° W · ELEV 1 280 M</p>
        </div>

        <div className={styles.heroCenter}>
          <p className={styles.heroEyebrow}>PUBLIC OBSERVATORY &amp; PLANETARIUM · CINDER RIDGE · EST. 1974</p>
          <h1 className={styles.heroTitle}>
            Look up.
            <br />
            We&rsquo;ll handle the rest.
          </h1>
          <p className={styles.heroLede}>
            The darkest public sky within two hours of the city, a telescope
            older than most of our visitors, and staff who will happily point
            at things until you make them stop.
          </p>

          <div className={styles.countdown} role="group" aria-label="Time until the next public viewing night">
            <p className={styles.countLabel}>NEXT PUBLIC VIEWING NIGHT — SAT 09 AUG · GATES 21:00</p>
            <p className={styles.countDigits}>
              <span>
                08<em>DAYS</em>
              </span>
              <span className={styles.countSep} aria-hidden="true">
                :
              </span>
              <span>
                05<em>HRS</em>
              </span>
              <span className={styles.countSep} aria-hidden="true">
                :
              </span>
              <span>
                42<em>MIN</em>
              </span>
            </p>
            <a className={styles.cta} href="#visit">
              Reserve viewing tickets — $6
            </a>
          </div>
        </div>

        <div className={styles.heroDome}>
          <Figure
            slug="zenith-dome-cutout"
            cutout
            priority
            alt="White observatory dome with its shutter open to the night sky"
            className={styles.heroDomeImg}
          />
        </div>
      </header>

      <main>
        {/* ——— TONIGHT ——— */}
        <section id="tonight" className={styles.section} aria-labelledby="tonight-title">
          <p className={styles.kicker}>◍ TONIGHT AT ZENITH</p>
          <h2 id="tonight-title" className={styles.h2}>
            The sky is doing things
          </h2>
          <p className={styles.sub}>
            Planetarium shows run in all weather. The telescope opens when the
            sky cooperates; we post the call at 17:00 sharp.
          </p>

          <div className={styles.showGrid}>
            {SHOWS.map((s) => (
              <article key={s.name} className={styles.showCard}>
                <p className={styles.showTime}>{s.time}</p>
                <h3>{s.name}</h3>
                <p className={styles.showDetail}>{s.detail}</p>
                <p className={styles.showDur}>{s.dur}</p>
              </article>
            ))}
          </div>

          <div className={styles.objectPanel}>
            <h3 className={styles.objectTitle}>ON THE SCHEDULE, WEATHER WILLING</h3>
            <ul className={styles.objectList}>
              {TONIGHT.map((t) => (
                <li key={t.obj}>
                  <span className={styles.objName}>{t.obj}</span>
                  <span className={styles.objCoords}>{t.coords}</span>
                  <span className={styles.objNote}>{t.note}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ——— EXHIBITS ——— */}
        <section id="exhibits" className={styles.sectionWide} aria-labelledby="exhibits-title">
          <p className={styles.kicker}>◍ THE FLOOR</p>
          <h2 id="exhibits-title" className={styles.h2}>
            Exhibits you can stand under
          </h2>
          <p className={styles.sub}>
            Three permanent halls, rebuilt slowly and stubbornly since 1974. No
            screens where an object will do.
          </p>
          <div className={styles.exhibitGrid}>
            {EXHIBITS.map((e, i) => (
              <article key={e.slug} className={styles.exhibit}>
                <div className={styles.orbitTile}>
                  <TabbiedArtwork
                    artwork={spark}
                    palette={i === 1 ? BRIGHT_PALETTE : FAINT_PALETTE}
                    seed={`zen-ex-${i + 1}`}
                    fit="grid"
                    cellSize={52}
                    style={{ position: 'absolute', inset: 0 }}
                  />
                  <div className={styles.orbitRing} aria-hidden="true" />
                  <div className={styles.orbitRingInner} aria-hidden="true" />
                  <Figure slug={e.slug} cutout alt={e.alt} className={styles.exhibitImg} />
                </div>
                <h3>{e.name}</h3>
                <p>{e.copy}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ——— TELESCOPE ——— */}
        <section id="telescope" className={styles.telescope} aria-labelledby="scope-title">
          <div className={styles.scopeGrid}>
            <div className={styles.scopeMedia}>
              <Figure
                slug="zenith-telescope-cutout"
                cutout
                alt="Long brass refracting telescope on an equatorial mount"
                className={styles.scopeImg}
              />
            </div>
            <div className={styles.scopeBody}>
              <p className={styles.kickerLeft}>◍ THE INSTRUMENT</p>
              <h2 id="scope-title" className={styles.h2Left}>
                The Meridian Eye
              </h2>
              <p className={styles.scopeCopy}>
                Our main instrument is a 0.61-metre Cassegrain, installed in
                1974 and resurfaced twice since. It has watched two comets
                arrive unannounced, one supernova in a neighbouring galaxy, and
                roughly four hundred thousand first looks at Saturn — which
                remain, by unanimous staff vote, the best part of the job.
              </p>
              <dl className={styles.scopeSpecs}>
                <div>
                  <dt>APERTURE</dt>
                  <dd>0.61 m</dd>
                </div>
                <div>
                  <dt>FOCAL RATIO</dt>
                  <dd>f/8</dd>
                </div>
                <div>
                  <dt>MOUNT</dt>
                  <dd>Equatorial fork</dd>
                </div>
                <div>
                  <dt>FIRST LIGHT</dt>
                  <dd>14 MAR 1974</dd>
                </div>
                <div>
                  <dt>LIMITING MAG.</dt>
                  <dd>+15.2 visual</dd>
                </div>
                <div>
                  <dt>OLDEST PHOTON SHOWN</dt>
                  <dd>≈ 12 billion yrs</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* ——— PANORAMA ——— */}
        <section className={styles.panorama} aria-label="The night sky from Cinder Ridge">
          <Figure
            slug="zenith-panorama"
            alt="Panorama of the Milky Way arching over the dark ridge line"
            className={styles.panoImg}
          />
          <blockquote className={styles.panoQuote}>
            <p>&ldquo;The first time the dome opened, our six-year-old whispered. She whispered the whole drive home.&rdquo;</p>
            <cite>— Visitor log, 22 June 2025</cite>
          </blockquote>
        </section>

        {/* ——— VISIT ——— */}
        <section id="visit" className={styles.section} aria-labelledby="visit-title">
          <p className={styles.kicker}>◍ PLAN A VISIT</p>
          <h2 id="visit-title" className={styles.h2}>
            Getting here is half the dark
          </h2>
          <div className={styles.visitGrid}>
            <div className={styles.visitCard}>
              <h3>HOURS</h3>
              <ul className={styles.plainList}>
                <li>
                  <span>Wed – Sun</span>
                  <span>13:00 – 23:30</span>
                </li>
                <li>
                  <span>Viewing nights</span>
                  <span>Sat, gates 21:00</span>
                </li>
                <li>
                  <span>Mon – Tue</span>
                  <span>Closed (we sleep)</span>
                </li>
                <li>
                  <span>Full-moon weeks</span>
                  <span>Planetarium only</span>
                </li>
              </ul>
            </div>
            <div className={styles.visitCard}>
              <h3>ADMISSION</h3>
              <ul className={styles.plainList}>
                {PRICES.map((p) => (
                  <li key={p.who}>
                    <span>{p.who}</span>
                    <span>{p.amt}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.visitCardTall}>
              <Figure
                slug="zenith-hero"
                alt="Illustration of the observatory dome on the ridge beneath a star-filled sky"
                className={styles.visitImg}
              />
              <div className={styles.visitCardTallBody}>
                <h3>FINDING US</h3>
                <p>
                  9 Cinder Ridge Road, forty minutes past the last streetlight.
                  Use red headlamp mode on the final path — your eyes will
                  thank you within the hour. Dress for ten degrees colder than
                  town.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ——— MEMBERSHIP ——— */}
        <section id="membership" className={styles.sectionWide} aria-labelledby="member-title">
          <p className={styles.kicker}>◍ MEMBERSHIP</p>
          <h2 id="member-title" className={styles.h2}>
            Adopt a sky
          </h2>
          <p className={styles.sub}>
            Members keep the dome turning. In exchange: the ridge, whenever it
            is dark.
          </p>
          <div className={styles.tierGrid}>
            {TIERS.map((t) => (
              <article key={t.name} className={t.featured ? styles.tierFeatured : styles.tier}>
                {t.featured && (
                  <TabbiedArtwork
                    artwork={spark}
                    palette={FAINT_PALETTE}
                    seed="zen-tier-02"
                    fit="grid"
                    cellSize={48}
                    style={{ position: 'absolute', inset: 0 }}
                  />
                )}
                <div className={styles.tierBody}>
                  <h3>{t.name}</h3>
                  <p className={styles.tierPrice}>{t.price}</p>
                  <ul>
                    {t.perks.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <a className={styles.tierCta} href="mailto:members@zenithridge.example">
                    Join as {t.name}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ——— SCHOOL PROGRAMS ——— */}
        <section className={styles.school} aria-labelledby="school-title">
          <div className={styles.schoolInner}>
            <p className={styles.kickerLeft}>◍ FOR SCHOOLS</p>
            <h2 id="school-title" className={styles.h2Left}>
              Field trips that end in silence
            </h2>
            <p className={styles.schoolCopy}>
              A Zenith school visit is ninety minutes: one planetarium show,
              one exhibit hall, and — for autumn and winter bookings — ten
              minutes of real telescope time per class. Teachers receive a sky
              chart pack keyed to their term. We have hosted 214 schools;
              the record for longest stunned silence is 74 seconds, set by a
              year-five class meeting Saturn.
            </p>
            <dl className={styles.schoolStats}>
              <div>
                <dt>SCHOOLS HOSTED</dt>
                <dd>214</dd>
              </div>
              <div>
                <dt>STUDENTS / YEAR</dt>
                <dd>11 400</dd>
              </div>
              <div>
                <dt>COST PER STUDENT</dt>
                <dd>$4</dd>
              </div>
              <div>
                <dt>BURSARY PLACES</dt>
                <dd>1 IN 5</dd>
              </div>
            </dl>
            <a className={styles.cta} href="mailto:schools@zenithridge.example">
              Book a school visit
            </a>
          </div>
        </section>
      </main>

      {/* ——— FOOTER ——— */}
      <footer className={styles.footer}>
        <div className={styles.footerBand} aria-hidden="true">
          <TabbiedArtwork
            artwork={spark}
            palette={SKY_PALETTE}
            seed="zen-foot-09"
            fit="grid"
            cellSize={44}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
        <div className={styles.footerInner}>
          <p className={styles.footerBrand}>
            <span aria-hidden="true">✦</span> ZENITH OBSERVATORY &amp; PLANETARIUM
          </p>
          <div className={styles.footerCols}>
            <div>
              <h3>VISIT</h3>
              <p>
                9 Cinder Ridge Road
                <br />
                Wed–Sun · 13:00–23:30
              </p>
            </div>
            <div>
              <h3>CONTACT</h3>
              <p>
                <a href="mailto:dome@zenithridge.example">dome@zenithridge.example</a>
                <br />
                <a href="tel:+15415550119">(541) 555-0119</a>
              </p>
            </div>
            <div>
              <h3>SKY CALL</h3>
              <p>
                Posted daily 17:00
                <br />
                Clear-sky line: ext. 2
              </p>
            </div>
          </div>
          <p className={styles.footerFine}>
            © 2026 Zenith Ridge Astronomical Society — a fictional observatory
            under a real sky.
            <span className={styles.credit}>
              {' '}
              Star fields generated with{' '}
              <a href="https://tabbied.com" rel="noopener">
                Tabbied
              </a>
              .
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}
