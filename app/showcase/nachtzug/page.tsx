import { TabbiedArtwork } from 'tabbied/react';
import {
  bothways, dotfield, picket, rungs, sliver, streaking,
} from 'tabbied/artworks';
import { Figure } from 'components/Figure';
import s from './nachtzug.module.css';

export const metadata = {
  title: 'Nachtzug: Schlafwagen quer durch Europa',
  description:
    'Nachtzug runs six sleeper services across Europe. Book a berth, a compartment or a whole carriage. Breakfast is included and the window opens.',
};

/* Night ground, bone type, one warm gold that stands for the reading lamp.
   Every field takes `transparent` in the background slot. */
const BONE = '#EDE8DA';
const GOLD = '#E0A83C';
const STEEL = '#545C74';
const DEEP = '#141827';
/* The two inks the decorative tiles draw with: always the quiet pair, so a
   tile reads as a sample rather than as another headline. */
/* The tiles pin their doodle to a whole multiple of the cell (9 × 72px)
   and let the plate clip it. A fluid box gives fractional grid tracks and
   a hairline seam at every cell edge. */
const TILE_BOX = 648;
const TILE_A = STEEL;
const TILE_B = DEEP;


const LINES = [
  { no: 'NZ 401', from: 'Wien Hbf', to: 'Roma Termini', dep: '19.42', arr: '09.12', nights: '1', runs: 'Daily' },
  { no: 'NZ 412', from: 'Zürich HB', to: 'Zagreb Gl. kol.', dep: '20.55', arr: '10.28', nights: '1', runs: 'Daily' },
  { no: 'NZ 430', from: 'Berlin Hbf', to: 'Kraków Główny', dep: '21.10', arr: '07.44', nights: '1', runs: 'Tue Thu Sat' },
  { no: 'NZ 455', from: 'Hamburg Hbf', to: 'Sofia Central', dep: '18.30', arr: '18.05', nights: '2', runs: 'Fri' },
  { no: 'NZ 470', from: 'Paris Est', to: 'București Nord', dep: '17.48', arr: '20.55', nights: '2', runs: 'Wed Sun' },
  { no: 'NZ 488', from: 'København H', to: 'Ljubljana', dep: '19.05', arr: '11.36', nights: '1', runs: 'Daily' },
];

const BERTHS = [
  { name: 'Couchette, six', price: 'from €49', body: 'Six bunks, a curtain, and the entirely reasonable expectation that somebody will snore.' },
  { name: 'Couchette, four', price: 'from €69', body: 'Four bunks, a washbasin, and enough room to change without choreography.' },
  { name: 'Sleeper, two', price: 'from €139', body: 'Two berths, a proper bed, a door that locks and a window that opens twelve centimetres.' },
  { name: 'Sleeper, single', price: 'from €219', body: 'One berth, one lamp, and the whole compartment. Booked out three months ahead in summer.' },
];

const RULES = [
  'Breakfast is included in every berth, at whatever hour you appear',
  'The window opens. This is not negotiable and never will be',
  'Bicycles travel in the van, six per train, booked separately',
  'Dogs travel free in couchettes if the whole compartment is booked',
  'No wake-up call before 06.30 unless you ask for one',
];

export default function NachtzugPage() {
  return (
    <div className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..700&display=swap"
      />

      <header className={s.bar}>
        <a className={s.mark} href="#top">
          Nachtzug
        </a>
        <nav aria-label="Sections">
          <a href="#lines">Lines</a>
          <a href="#berths">Berths</a>
          <a href="#aboard">Aboard</a>
          <a href="#book">Book</a>
        </nav>
        <span className={s.tag}>Schlafwagen seit 1994</span>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div className={s.heroField} aria-hidden="true">
            <TabbiedArtwork
              artwork={rungs}
              palette={['transparent', STEEL, GOLD]}
              fit="grid"
              cellSize={96}
              redrawInterval={5000}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <p className={s.eyebrow}>Six lines / eleven countries / one timetable</p>
            <h1>
              Go to sleep in
              <br />
              one country and
              <br />
              <span>wake in another.</span>
            </h1>
            <p className={s.lede}>
              Six sleeper services across Europe, every one of them slower than
              flying and better than arriving.
            </p>
          </div>
        </section>

        {/* The compartment at night, full width and tall: the single image the
            whole proposition rests on. */}
        <figure className={s.bleed}>
          <Figure
            slug="nachtzug-compartment"
            alt="A sleeper compartment at night with a made-up bunk, a warm reading lamp and a dark window"
            priority
          />
          <figcaption>NZ 401, compartment 7. Somewhere south of Villach, 02.10.</figcaption>
        </figure>

        {/* ---------------------------------------------------------- LINES */}
        <section id="lines" className={s.lines} aria-labelledby="lines-h">
          <h2 className={s.h2} id="lines-h">
            The six lines
          </h2>
          <ol className={s.table}>
            <li className={s.thead} aria-hidden="true">
              <span>Service</span>
              <span>From</span>
              <span>To</span>
              <span>Dep</span>
              <span>Arr</span>
              <span>Nights</span>
              <span>Runs</span>
            </li>
            {LINES.map((l) => (
              <li key={l.no}>
                <span className={s.no}>{l.no}</span>
                <span className={s.from}>{l.from}</span>
                <span className={s.to}>{l.to}</span>
                <span className={s.time}>{l.dep}</span>
                <span className={s.time}>{l.arr}</span>
                <span className={s.nights}>{l.nights}</span>
                <span className={s.runs}>{l.runs}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------ RAIL BAND */}
        <section className={s.railBand} aria-hidden="true">
          <div className={s.railField}>
            <TabbiedArtwork
              artwork={bothways}
              palette={['transparent', GOLD, BONE, STEEL]}
              fit="grid"
              cellSize={104}
              redrawInterval={3200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* --------------------------------------------------------- BERTHS */}
        <section id="berths" className={s.berths} aria-labelledby="berths-h">
          <div className={s.berthsField} aria-hidden="true">
            <TabbiedArtwork
              artwork={dotfield}
              palette={['transparent', STEEL, GOLD]}
              fit="grid"
              cellSize={40}
              redrawInterval={6000}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.berthsInner}>
            <h2 className={s.h2} id="berths-h">
              Four ways to lie down
            </h2>
            <ol className={s.berthList}>
              {BERTHS.map((b) => (
                <li key={b.name}>
                  <h3>{b.name}</h3>
                  <p className={s.bPrice}>{b.price}</p>
                  <p className={s.bBody}>{b.body}</p>
                </li>
              ))}
            </ol>
            <div className={s.pair}>
              <figure>
                <Figure
                  slug="nachtzug-platform"
                  alt="A long sleeper train standing at a lit platform late at night"
                />
                <figcaption>Wien Hbf, platform 9. Boarding from 19.10.</figcaption>
              </figure>
              <figure>
                <Figure
                  slug="nachtzug-dining"
                  alt="An empty dining car set for breakfast with lamps lit and night outside"
                />
                <figcaption>The dining car opens at 06.30 and closes when it empties.</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- ABOARD */}
        <section id="aboard" className={s.aboard} aria-labelledby="aboard-h">
          <h2 className={s.h2} id="aboard-h">
            Aboard
          </h2>
          <div className={s.aboardGrid}>
            <ul className={s.rules}>
              {RULES.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <figure className={s.tall}>
              <Figure
                slug="nachtzug-corridor"
                alt="The narrow corridor of a sleeping car at night with warm lamps receding"
              />
              <figcaption>Carriage 274, built 1988, refitted 2019.</figcaption>
            </figure>
          </div>
        </section>

        {/* ----------------------------------------------------------- BOOK */}
        <section id="book" className={s.book} aria-labelledby="book-h">
          <div className={s.bookField} aria-hidden="true">
            <TabbiedArtwork
              artwork={sliver}
              palette={['transparent', GOLD, STEEL]}
              fit="grid"
              cellSize={120}
              redrawInterval={4400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.bookInner}>
            <h2 className={s.h2} id="book-h">
              Booking
            </h2>
            <dl className={s.contact}>
              <div>
                <dt>Reservations</dt>
                <dd>
                  <a href="mailto:schlafwagen@nachtzug.example">schlafwagen@nachtzug.example</a>
                </dd>
              </div>
              <div>
                <dt>Telephone</dt>
                <dd>+43 1 000 000, 07.00 to 21.00</dd>
              </div>
              <div>
                <dt>Opens</dt>
                <dd>Six months ahead, at 08.00 Vienna time</dd>
              </div>
              <div>
                <dt>Whole carriage</dt>
                <dd>Thirty berths, by arrangement, six weeks notice</dd>
              </div>
            </dl>
          </div>
        </section>
        {/* ---------------------------------------------------------- TILES */}
        <section id="tiles" className={s.tiles} aria-labelledby="tiles-h">
          <h2 id="tiles-h">Three reasons the night train survived</h2>
          <p className={s.secNote}>It was written off four times between 1998 and 2016. Here is what kept it running.</p>
          <div className={s.tileGrid}>
              <article key="01">
                <div className={s.tilePlate} aria-hidden="true">
                  <TabbiedArtwork
                    artwork={dotfield}
                    palette={['transparent', TILE_A, TILE_B]}
                    fit="grid"
                    cellSize={72}
                    redrawInterval={5400}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: TILE_BOX,
                      height: TILE_BOX,
                    }}
                  />
                </div>
                <p className={s.tileN}>01</p>
                <h3>The bed</h3>
                <p className={s.tileBody}>A night on a train is a night of accommodation. Costed that way, the sleeper stops looking expensive and starts looking obvious.</p>
              </article>
              <article key="02">
                <div className={s.tilePlate} aria-hidden="true">
                  <TabbiedArtwork
                    artwork={sliver}
                    palette={['transparent', TILE_A, TILE_B]}
                    fit="grid"
                    cellSize={72}
                    redrawInterval={6200}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: TILE_BOX,
                      height: TILE_BOX,
                    }}
                  />
                </div>
                <p className={s.tileN}>02</p>
                <h3>The border</h3>
                <p className={s.tileBody}>Nobody wakes you. Schengen did more for the sleeper than any marketing campaign, and a whole generation has never been asked for a passport at 03.00.</p>
              </article>
              <article key="03">
                <div className={s.tilePlate} aria-hidden="true">
                  <TabbiedArtwork
                    artwork={rungs}
                    palette={['transparent', TILE_A, TILE_B]}
                    fit="grid"
                    cellSize={72}
                    redrawInterval={4800}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: TILE_BOX,
                      height: TILE_BOX,
                    }}
                  />
                </div>
                <p className={s.tileN}>03</p>
                <h3>The arithmetic</h3>
                <p className={s.tileBody}>Twelve hours that would otherwise be spent awake, in an airport, being processed. The train is slower and the day is longer.</p>
              </article>
          </div>
        </section>

        {/* ---------------------------------------------------------- INDEX */}
        <section id="index" className={s.idx} aria-labelledby="idx-h">
          <h2 id="idx-h">Rolling stock</h2>
          <p className={s.secNote}>Everything is owned and maintained at Wien Simmering. Ages are honest.</p>
          <ol className={s.idxList}>
            <li className={s.idxHead} aria-hidden="true">
                <span>Type</span>
                <span>Built</span>
                <span>Refit</span>
                <span>In service</span>
            </li>
              <li key="Sleeping car, WLABmz">
                <span>Sleeping car, WLABmz</span>
                <span>1988</span>
                <span>2019</span>
                <span>24</span>
              </li>
              <li key="Couchette, Bcmz">
                <span>Couchette, Bcmz</span>
                <span>1991</span>
                <span>2021</span>
                <span>31</span>
              </li>
              <li key="Seating, Bmz">
                <span>Seating, Bmz</span>
                <span>1986</span>
                <span>2017</span>
                <span>12</span>
              </li>
              <li key="Dining, WRmz">
                <span>Dining, WRmz</span>
                <span>1978</span>
                <span>2015</span>
                <span>6</span>
              </li>
              <li key="Van, Dms">
                <span>Van, Dms</span>
                <span>1994</span>
                <span>2020</span>
                <span>8</span>
              </li>
              <li key="Locomotive, hired">
                <span>Locomotive, hired</span>
                <span>n/a</span>
                <span>n/a</span>
                <span>Per section</span>
              </li>
          </ol>
        </section>

        {/* ------------------------------------------------------------ FAQ */}
        <section id="faq" className={s.faq} aria-labelledby="faq-h">
          <h2 id="faq-h">Before you board</h2>
          <dl className={s.faqList}>
              <div key="Is there a shower?">
                <dt>Is there a shower?</dt>
                <dd>In the two-berth and single sleepers, yes, at the end of the carriage. In couchettes, a washbasin in the compartment and nothing else.</dd>
              </div>
              <div key="Can I book a compartment">
                <dt>Can I book a compartment to myself?</dt>
                <dd>Yes, at the whole-compartment rate, which is less than the sum of the berths. Most solo travellers who have tried it never go back.</dd>
              </div>
              <div key="What if I miss my connec">
                <dt>What if I miss my connection?</dt>
                <dd>Our tickets are through-ticketed, so the next service is on us. This is not generosity; it is the rule the whole network runs on.</dd>
              </div>
              <div key="Does the window really o">
                <dt>Does the window really open?</dt>
                <dd>Twelve centimetres, in every sleeper and every couchette. We have replaced entire carriages and kept the mechanism.</dd>
              </div>
          </dl>
        </section>

      </main>


        {/* A coda: the last thing before the footer is the pattern itself, at
            working size and with nothing to read. Purely decorative. */}
        <section className={s.coda} aria-hidden="true">
          <div className={s.codaField}>
            <TabbiedArtwork
              artwork={picket}
              palette={['transparent', BONE, STEEL]}
              fit="grid"
              cellSize={110}
              redrawInterval={4970}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p className={s.footName}>Nachtzug</p>
            <p className={s.footTag}>Schlafwagen quer durch Europa, six lines, since 1994.</p>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Travel</h2>
            <ul className={s.footLinks}>
              <li>
                <a href="#lines">The six lines</a>
              </li>
              <li>
                <a href="#berths">Four kinds of berth</a>
              </li>
              <li>
                <a href="#aboard">Aboard</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Booking</h2>
            <ul className={s.footLinks}>
              <li>
                <a href="#book">Reservations</a>
              </li>
              <li>
                <a href="#book">Whole carriage</a>
              </li>
              <li>
                <a href="#aboard">Bicycles and dogs</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Contact</h2>
            <p className={s.footAddr}>
              Reservations, 07.00 to 21.00
              <br />
              schlafwagen@nachtzug.example
              <br />
              +43 1 000 000
              <br />
              Opens six months ahead
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p>A fictional sleeper operator. Prices and times are invented.</p>
          <p>
            Patterns by{' '}
            <a href="https://tabbied.com" rel="noopener">
              Tabbied
            </a>
            , drawn live on a transparent ground and redrawn on a timer.
          </p>
        </div>
      </footer>
    </div>
  );
}
