import { TabbiedArtwork } from 'tabbied/react';
import { grain, halftone } from 'tabbied/artworks';
import { Figure } from 'components/Figure';
import styles from './analog-dept.module.css';

export const metadata = {
  title: 'Analog Dept. — Film Lab, Darkroom & Scans',
  description:
    'Hand-processed C-41, E-6 and black & white. Dev, scan and print for 35mm, 120 and 4×5. Unit 3, 117 Fixer Lane — behind the arcade, follow the red light.',
};

const CHARCOAL = '#0F0F10';
const SILVER = '#E8E6E1';
const RED = '#E63946';

const devPrices = [
  { item: 'C-41 colour · 35mm or 120', price: '$12' },
  { item: 'B&W · hand-inverted, small tank', price: '$14' },
  { item: 'E-6 slide · runs Thursdays', price: '$18' },
  { item: 'Push / pull, per stop', price: '+$3' },
  { item: '4×5 sheet · per sheet, any soup', price: '$6' },
];

const scanPrices = [
  { item: 'Standard scan · 2400 dpi JPEG', price: '$8' },
  { item: 'Premium scan · 4800 dpi TIFF', price: '$14' },
  { item: 'Rescan of old negs · per roll', price: '$10' },
  { item: 'Border scans (yes, the sprockets)', price: '+$4' },
];

const printPrices = [
  { item: 'RC print · 5×7, machine', price: '$4' },
  { item: 'Fibre print · 8×10, by hand', price: '$28' },
  { item: 'Contact sheet · 8×10', price: '$9' },
  { item: 'Test strip you can keep', price: '$0' },
];

const turnaround = [
  { service: 'C-41 dev + scan', time: 'Next day', note: 'In by 3 pm, out by open' },
  { service: 'B&W dev + scan', time: '2–3 days', note: 'Hand tanks. Worth it.' },
  { service: 'E-6 slide', time: 'Weekly', note: 'Chemistry runs Thursdays' },
  { service: 'Fibre prints', time: '4–5 days', note: 'Dry-down takes what it takes' },
  { service: 'Rush, any of the above', time: '×1.5', note: 'Ask nicely. Bring coffee.' },
];

const scans = [
  {
    slug: 'analog-street',
    alt: 'Rainy city street at dusk, neon reflections on wet asphalt',
    frame: '12A',
    meta: 'TRI-X · 400 · PUSHED +1',
    credit: 'M. Okafor',
  },
  {
    slug: 'analog-diner',
    alt: 'Diner counter with chrome stools and a slice of pie under glass',
    frame: '18A',
    meta: 'PORTRA · 160 · BOX SPEED',
    credit: 'J. Reyes',
  },
  {
    slug: 'analog-window',
    alt: 'A cat sitting on a windowsill in soft side light',
    frame: '27A',
    meta: 'HP5+ · 400 · YELLOW FILTER',
    credit: 'the lab cat, by staff',
  },
];

const gear = [
  {
    slug: 'analog-camera-cutout',
    alt: 'Classic 35mm single-lens-reflex camera with 50mm lens',
    name: '35mm SLR · CLA’d',
    spec: 'New seals · meter within ⅓ stop · 50/1.8',
    price: '$260',
  },
  {
    slug: 'analog-film-cutout',
    alt: 'Single 35mm film canister',
    name: 'House B&W 400',
    spec: 'Hand-rolled 36 exp · souped here for $10',
    price: '$7',
  },
  {
    slug: 'analog-loupe-cutout',
    alt: 'Glass focusing loupe for checking negatives',
    name: 'Focusing loupe · 8×',
    spec: 'For the lightbox · scratch-free, coveted',
    price: '$38',
  },
];

const dropSteps = [
  {
    n: '01',
    title: 'Bag it',
    body: 'Rolls in the bag, name on the bag. Undeveloped film is precious cargo — we treat the bin like a vault.',
  },
  {
    n: '02',
    title: 'Tick the form',
    body: 'Dev, scan, print, push, pull — tick what you want, guess if you must. We will call before doing anything irreversible.',
  },
  {
    n: '03',
    title: 'Get the email',
    body: 'Scans land in your inbox as a download link. Negatives wait on the shelf for 90 days. After that, they become Wall Art (see: our wall).',
  },
];

export default function AnalogDeptPage() {
  return (
    <div className={styles.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
      />

      <header className={styles.masthead}>
        <a href="#top" className={styles.wordmark}>
          Analog Dept.
        </a>
        <p className={styles.mastheadStatus}>
          <span className={styles.statusDot} aria-hidden="true" />
          LAB STATUS: OPEN · TUE–SAT 11:00–19:00
        </p>
        <nav className={styles.mastheadNav} aria-label="Site">
          <a href="#prices">Prices</a>
          <a href="#darkroom">Darkroom</a>
          <a href="#scans">Scans</a>
          <a href="#gear">Gear</a>
          <a href="#dropoff">Drop-off</a>
        </nav>
      </header>

      <main id="top">
        {/* HERO */}
        <section className={styles.hero} aria-labelledby="hero-title">
          <TabbiedArtwork
            artwork={grain}
            palette={[CHARCOAL, SILVER, RED]}
            seed="analog-hero"
            fit="cover"
            density={2}
            className={styles.heroGrain}
          />
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <p className={styles.heroKicker}>FILM LAB · DARKROOM · SCANS — EST. 2014</p>
              <h1 id="hero-title" className={styles.heroTitle}>
                We treat your negatives like our own.
                <span className={styles.heroTitleRed}> Better, actually.</span>
              </h1>
              <p className={styles.heroLede}>
                Hand tanks for black & white, dip-and-dunk for colour, fresh chemistry on a
                schedule we actually keep. Bring us the roll that has been in your jacket
                since March. We do not judge. (We judge a little. Silently.)
              </p>
              <div className={styles.heroActions}>
                <a href="#prices" className={styles.btnRed}>
                  Price list
                </a>
                <a href="#dropoff" className={styles.btnLine}>
                  How to drop off
                </a>
              </div>
              <p className={styles.heroFormats}>C-41 · E-6 · B&W — 35MM / 120 / 4×5</p>
            </div>
            <figure className={styles.heroFigure}>
              <div className={styles.heroPhoto}>
                <Figure
                  slug="analog-hero"
                  alt="A lightbox desk at night covered in negative strips and a loupe"
                  priority
                />
              </div>
              <figcaption className={styles.heroCaption}>
                FIG. 01 — THE LIGHT DESK, 02:14 AM. SOMEONE’S WEDDING ROLLS.
              </figcaption>
            </figure>
          </div>
        </section>

        <div className={styles.cutLine} role="presentation" />

        {/* PRICES */}
        <section id="prices" className={styles.priceSection} aria-labelledby="prices-title">
          <TabbiedArtwork
            artwork={halftone}
            palette={[CHARCOAL, SILVER, RED]}
            seed="analog-prices"
            fit="cover"
            density={2}
            className={styles.priceScreen}
          />
          <div className={styles.priceScrim} aria-hidden="true" />
          <div className={styles.priceInner}>
            <div className={styles.sectionHead}>
              <h2 id="prices-title" className={styles.h2}>
                Services & prices
              </h2>
              <p className={styles.sectionNote}>
                EFFECTIVE 01·07 — CHEMISTRY COSTS WHAT IT COSTS
              </p>
            </div>
            <div className={styles.orderLayout}>
              <div className={styles.orderForm}>
                <header className={styles.orderHead}>
                  <span>ORDER FORM</span>
                  <span>№ 0847</span>
                </header>
                <div className={styles.orderCols}>
                  <div className={styles.orderGroup}>
                    <h3>Develop</h3>
                    <ul>
                      {devPrices.map((row) => (
                        <li key={row.item}>
                          <span className={styles.box} aria-hidden="true" />
                          <span className={styles.orderItem}>{row.item}</span>
                          <span className={styles.leader} aria-hidden="true" />
                          <span className={styles.orderPrice}>{row.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.orderGroup}>
                    <h3>Scan</h3>
                    <ul>
                      {scanPrices.map((row) => (
                        <li key={row.item}>
                          <span className={styles.box} aria-hidden="true" />
                          <span className={styles.orderItem}>{row.item}</span>
                          <span className={styles.leader} aria-hidden="true" />
                          <span className={styles.orderPrice}>{row.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.orderGroup}>
                    <h3>Print</h3>
                    <ul>
                      {printPrices.map((row) => (
                        <li key={row.item}>
                          <span className={styles.box} aria-hidden="true" />
                          <span className={styles.orderItem}>{row.item}</span>
                          <span className={styles.leader} aria-hidden="true" />
                          <span className={styles.orderPrice}>{row.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <footer className={styles.orderFoot}>
                  NAME: ______________ · PHONE: ______________ · PUSH? Y / N / “WHAT’S PUSHING”
                </footer>
              </div>
              <aside className={styles.turnaroundCard} aria-labelledby="turnaround-title">
                <h3 id="turnaround-title" className={styles.turnaroundTitle}>
                  Turnaround
                </h3>
                <table className={styles.turnTable}>
                  <thead>
                    <tr>
                      <th scope="col">Service</th>
                      <th scope="col">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {turnaround.map((t) => (
                      <tr key={t.service}>
                        <th scope="row">
                          {t.service}
                          <span className={styles.turnNote}>{t.note}</span>
                        </th>
                        <td>{t.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </aside>
            </div>
          </div>
        </section>

        {/* DARKROOM */}
        <section id="darkroom" className={styles.darkroom} aria-labelledby="darkroom-title">
          <div className={styles.darkroomMedia}>
            <Figure
              slug="analog-darkroom"
              alt="A darkroom bathed in red safelight, enlarger and trays ready"
            />
            <p className={styles.photoTag}>FIG. 02 — BAY 2, SAFELIGHT ON</p>
          </div>
          <div className={styles.darkroomCopy}>
            <h2 id="darkroom-title" className={styles.h2}>
              The darkroom
            </h2>
            <p>
              Two enlarger bays, one stubborn dehumidifier, and the best-smelling fixer in the
              county. Black & white runs through small hand tanks — four inversions a minute,
              timed by a clock older than most of our customers’ cameras.
            </p>
            <p>
              Fibre prints are made one at a time, dodged and burned by a human with opinions.
              If your negative is thin, we will get something out of it. If it is very thin, we
              will get something out of it and tell you about metering.
            </p>
            <div className={styles.safelightPanel}>
              <TabbiedArtwork
                artwork={grain}
                palette={[CHARCOAL, RED]}
                seed="analog-safelight"
                fit="grid"
                className={styles.safelightGrain}
              />
              <p>
                <strong>SAFELIGHT ON —</strong> when the red lamp above Bay 2 is lit, the door
                stays shut. No exceptions, not even for the mail carrier. Especially not for
                the mail carrier.
              </p>
            </div>
            <ul className={styles.darkroomFacts}>
              <li>Chemistry replenished on schedule, logged on the wall</li>
              <li>Rental bay: $14/hr incl. paper-safe & tunes</li>
              <li>Intro to printing class, first Sunday monthly · $60</li>
            </ul>
          </div>
        </section>

        <div className={styles.cutLine} role="presentation" />

        {/* RECENT SCANS */}
        <section id="scans" className={styles.scansSection} aria-labelledby="scans-title">
          <div className={styles.sectionHead}>
            <h2 id="scans-title" className={styles.h2}>
              Recent scans
            </h2>
            <p className={styles.sectionNote}>
              CUSTOMER WORK, SHARED WITH PERMISSION · SOUPED & SCANNED HERE
            </p>
          </div>
          <div className={styles.filmStrip}>
            <div className={styles.sprockets} role="presentation" />
            <div className={styles.filmFrames}>
              <p className={styles.filmEdge} aria-hidden="true">
                ANALOG DEPT · SAFETY FILM 5063 →
              </p>
              {scans.map((s) => (
                <figure key={s.slug} className={styles.frame}>
                  <div className={styles.frameImg}>
                    <Figure slug={s.slug} alt={s.alt} />
                  </div>
                  <figcaption className={styles.frameCaption}>
                    <span className={styles.frameNum}>▸ {s.frame}</span>
                    <span>{s.meta}</span>
                    <span className={styles.frameCredit}>shot by {s.credit}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
            <div className={styles.sprockets} role="presentation" />
          </div>
        </section>

        {/* GEAR */}
        <section id="gear" className={styles.gearSection} aria-labelledby="gear-title">
          <div className={styles.sectionHead}>
            <h2 id="gear-title" className={styles.h2}>
              Gear we sell
            </h2>
            <p className={styles.sectionNote}>
              TESTED ON THE BENCH, GUARANTEED 6 MONTHS · NO “PARTS ONLY” MYSTERY BOXES
            </p>
          </div>
          <div className={styles.gearField}>
            <TabbiedArtwork
              artwork={grain}
              palette={[CHARCOAL, SILVER, RED]}
              seed="analog-gear"
              fit="grid"
              className={styles.gearGrain}
            />
            <div className={styles.gearRow}>
              {gear.map((g) => (
                <figure key={g.slug} className={styles.gearCard}>
                  <Figure slug={g.slug} cutout alt={g.alt} className={styles.gearImg} />
                  <figcaption>
                    <strong>{g.name}</strong>
                    <span className={styles.gearSpec}>{g.spec}</span>
                    <span className={styles.gearPrice}>{g.price}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
          <p className={styles.gearFine}>
            Stock rotates weekly — what is on the shelf is on the shelf. Trade-ins welcome if
            the shutter fires and the story is good.
          </p>
        </section>

        <div className={styles.cutLine} role="presentation" />

        {/* DROP-OFF */}
        <section id="dropoff" className={styles.dropSection} aria-labelledby="drop-title">
          <TabbiedArtwork
            artwork={halftone}
            palette={[CHARCOAL, SILVER, RED]}
            seed="analog-dropoff"
            fit="cover"
            density={2}
            className={styles.dropScreen}
          />
          <div className={styles.dropScrim} aria-hidden="true" />
          <div className={styles.dropInner}>
            <div className={styles.dropIntro}>
              <h2 id="drop-title" className={styles.h2}>
                Drop-off & mail-in
              </h2>
              <p>
                The slot in the door works 24/7. The humans work Tuesday to Saturday, 11:00 to
                19:00, and answer the phone when the tanks allow.
              </p>
              <address className={styles.address}>
                ANALOG DEPT.
                <br />
                UNIT 3 · 117 FIXER LANE
                <br />
                (BACK OF THE ARCADE — FOLLOW THE RED LIGHT)
              </address>
              <p className={styles.addressMeta}>
                MAIL-IN: SAME ADDRESS. PAD YOUR ROLLS. WRITE “FILM — DO NOT X-RAY” AND HOPE.
              </p>
            </div>
            <ol className={styles.dropSteps}>
              {dropSteps.map((s) => (
                <li key={s.n} className={styles.dropStep}>
                  <span className={styles.dropNum}>{s.n}</span>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerGrain} role="presentation">
          <TabbiedArtwork
            artwork={grain}
            palette={[CHARCOAL, SILVER]}
            seed="analog-footer"
            fit="grid"
          />
        </div>
        <div className={styles.footerInner}>
          <p className={styles.footerWordmark}>Analog Dept.</p>
          <nav className={styles.footerNav} aria-label="Footer">
            <a href="#prices">Prices</a>
            <a href="#darkroom">Darkroom</a>
            <a href="#scans">Scans</a>
            <a href="#gear">Gear</a>
            <a href="#dropoff">Drop-off</a>
          </nav>
          <p className={styles.footerFine}>
            © Analog Dept. · We develop everything except disposable excuses. Negatives
            unclaimed after 90 days join the Wall of Orphans, where they are loved but
            mocked. · dept@analogdept.example · (555) 019-2741
          </p>
          <p className={styles.credit}>
            GRAIN & HALFTONE BY{' '}
            <a href="https://tabbied.com" rel="noopener">
              TABBIED
            </a>{' '}
            — THE PATTERN KIND, NOT THE PUSHED-TWO-STOPS KIND
          </p>
        </div>
      </footer>
    </div>
  );
}
