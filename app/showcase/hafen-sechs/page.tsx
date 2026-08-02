import { TabbiedArtwork } from 'tabbied/react';
import { bothways, staple, hurdle, dotmatrix, gravure } from 'tabbied/artworks';
import { Figure } from 'components/Figure';
import s from './hafen-sechs.module.css';

export const metadata = {
  title: 'Hafen Sechs: Container Terminal, Bremerhaven',
  description:
    'Terminal 6, Bremerhaven. Six berths, fourteen gantries, 2.1 million TEU a year. Berth windows, tariffs and gate hours.',
};

/* Dark ground, bone type, signal yellow. Pattern fields take `transparent`
   in the background slot so the night colour of the page shows through. */
const BONE = '#F0EFEA';
const YELLOW = '#FFD400';
const STEEL = '#6E747C';
const DEEP = '#1C2026';

const BERTHS = [
  { no: '61', length: '400 m', depth: '−16.5 m', cranes: '4 × STS', max: '24,000 TEU', status: 'Occupied' },
  { no: '62', length: '400 m', depth: '−16.5 m', cranes: '4 × STS', max: '24,000 TEU', status: 'Free' },
  { no: '63', length: '350 m', depth: '−15.0 m', cranes: '3 × STS', max: '18,000 TEU', status: 'Occupied' },
  { no: '64', length: '350 m', depth: '−15.0 m', cranes: '3 × STS', max: '18,000 TEU', status: 'Free' },
  { no: '65', length: '240 m', depth: '−12.5 m', cranes: '2 × MHC', max: 'Feeder', status: 'Occupied' },
  { no: '66', length: '240 m', depth: '−12.5 m', cranes: '2 × MHC', max: 'Feeder', status: 'Maintenance' },
];

const MOVES = [
  ['2.14 M', 'TEU handled, 2025'],
  ['14', 'Ship-to-shore gantries'],
  ['38.4', 'Moves per crane hour'],
  ['6', 'Berths, 1,980 m of quay'],
];

const SCHEDULE = [
  { vessel: 'Nordkap Express', service: 'NE-3 / Far East', eta: '02.08 04:10', etd: '03.08 19:40', berth: '61' },
  { vessel: 'Mare Frisia', service: 'BAL-1 / Baltic feeder', eta: '02.08 11:25', etd: '02.08 23:00', berth: '65' },
  { vessel: 'Sirius Hanse', service: 'NE-3 / Far East', eta: '03.08 06:00', etd: '04.08 20:15', berth: '63' },
  { vessel: 'Cap Ortegal', service: 'MED-2 / Western Med', eta: '03.08 15:50', etd: '04.08 12:30', berth: '62' },
  { vessel: 'Weserstrom', service: 'BAL-1 / Baltic feeder', eta: '04.08 05:15', etd: '04.08 17:00', berth: '66' },
];

const GATE = [
  ['Road gate', 'Mon to Sat, 05.00 to 23.00', 'Closed Sundays and public holidays'],
  ['Rail head', 'Continuous, 7 days', 'Six tracks, 750 m usable length'],
  ['Barge quay', '06.00 to 22.00', 'Two positions, 110 m each'],
  ['Reefer plugs', 'Continuous', '1,840 positions, monitored at 15 min intervals'],
];

export default function HafenSechsPage() {
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
        <div className={s.brand}>
          <span className={s.brandNo}>06</span>
          <span>
            Hafen Sechs
            <i>Containerterminal Bremerhaven</i>
          </span>
        </div>
        <nav aria-label="Sections">
          <a href="#berths">Berths</a>
          <a href="#schedule">Schedule</a>
          <a href="#gate">Gate</a>
          <a href="#contact">Contact</a>
        </nav>
        <p className={s.live}>
          <span aria-hidden="true" />
          Operating normally
        </p>
      </header>

      <main>
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div className={s.heroField} aria-hidden="true">
            <TabbiedArtwork
              artwork={bothways}
              palette={['transparent', STEEL, YELLOW]}
              fit="grid"
              cellSize={112}
              redrawInterval={4800}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <p className={s.eyebrow}>53°32′ N &nbsp;8°34′ E &nbsp;/&nbsp; Terminal 6</p>
          <h1>
            Six berths.
            <br />
            Nineteen hundred
            <br />
            <span>and eighty metres.</span>
          </h1>
          <p className={s.lede}>
            The deepwater terminal at the mouth of the Weser. Two point one
            million TEU last year, every one of them counted twice.
          </p>
          <dl className={s.moves}>
            {MOVES.map(([v, k]) => (
              <div key={k}>
                <dt>{v}</dt>
                <dd>{k}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* A full-height plate: the terminal at night, run edge to edge and
            tall enough to be a page of its own. */}
        <figure className={s.bleedTall}>
          <Figure
            slug="hafen-stacks"
            alt="Stacked shipping containers at a port at dusk under floodlights"
            priority
          />
          <figcaption>Block 4C, 21.40. Discharge running two hours ahead.</figcaption>
        </figure>

        {/* -------------------------------------------------------- BERTHS */}
        <section id="berths" className={s.berths} aria-labelledby="berths-h">
          <div className={s.secHead}>
            <span>01</span>
            <h2 id="berths-h">Berth register</h2>
          </div>
          <ol className={s.berthList}>
            <li className={s.berthHead} aria-hidden="true">
              <span>Berth</span>
              <span>Quay</span>
              <span>Depth</span>
              <span>Cranes</span>
              <span>Max call</span>
              <span>Now</span>
            </li>
            {BERTHS.map((b) => (
              <li key={b.no}>
                <span className={s.bNo}>{b.no}</span>
                <span>{b.length}</span>
                <span>{b.depth}</span>
                <span>{b.cranes}</span>
                <span>{b.max}</span>
                <span
                  className={
                    b.status === 'Free'
                      ? s.free
                      : b.status === 'Maintenance'
                        ? s.maint
                        : s.busy
                  }
                >
                  {b.status}
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------------------------------------------------- CRANE BAND */}
        <section className={s.craneBand} aria-hidden="true">
          <div className={s.craneField}>
            <TabbiedArtwork
              artwork={staple}
              palette={['transparent', YELLOW, BONE, STEEL]}
              fit="grid"
              cellSize={120}
              redrawInterval={3400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* ------------------------------------------------------ SCHEDULE */}
        <section id="schedule" className={s.schedule} aria-labelledby="schedule-h">
          <div className={s.scheduleField} aria-hidden="true">
            <TabbiedArtwork
              artwork={hurdle}
              palette={['transparent', STEEL, DEEP]}
              fit="grid"
              cellSize={130}
              redrawInterval={5600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.scheduleInner}>
            <div className={s.secHead}>
              <span>02</span>
              <h2 id="schedule-h">Expected this week</h2>
            </div>
            <p className={s.note}>
              Times are local, updated at 06.00 and 18.00. A vessel inside its
              window keeps its berth; a vessel outside it takes the next free one.
            </p>
            <ol className={s.calls}>
              {SCHEDULE.map((c) => (
                <li key={c.vessel}>
                  <span className={s.vessel}>{c.vessel}</span>
                  <span className={s.service}>{c.service}</span>
                  <span className={s.time}>
                    <i>ETA</i>
                    {c.eta}
                  </span>
                  <span className={s.time}>
                    <i>ETD</i>
                    {c.etd}
                  </span>
                  <span className={s.berthTag}>{c.berth}</span>
                </li>
              ))}
            </ol>
            <div className={s.pair}>
              <figure>
                <Figure
                  slug="hafen-crane"
                  alt="A tall yellow gantry crane against a dark evening sky"
                />
                <figcaption>Gantry 09, boom raised between calls.</figcaption>
              </figure>
              <figure>
                <Figure
                  slug="hafen-control"
                  alt="A dim port control room at night with monitors and a wide window"
                />
                <figcaption>Tower, night shift. Six screens, one kettle.</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- GATE */}
        <section id="gate" className={s.gate} aria-labelledby="gate-h">
          <div className={s.secHead}>
            <span>03</span>
            <h2 id="gate-h">Gate and hinterland</h2>
          </div>
          <ul className={s.gateList}>
            {GATE.map(([what, when, note]) => (
              <li key={what}>
                <span className={s.gWhat}>{what}</span>
                <span className={s.gWhen}>{when}</span>
                <span className={s.gNote}>{note}</span>
              </li>
            ))}
          </ul>
          <figure className={s.wide}>
            <Figure
              slug="hafen-bollard"
              alt="A heavy mooring rope over a steel bollard on a wet concrete quay"
            />
            <figcaption>Bollard 61-04. Rated 200 tonnes, inspected quarterly.</figcaption>
          </figure>
        </section>

        {/* ------------------------------------------------------- CONTACT */}
        <section id="contact" className={s.contact} aria-labelledby="contact-h">
          <div className={s.contactField} aria-hidden="true">
            <TabbiedArtwork
              artwork={dotmatrix}
              palette={['transparent', YELLOW, STEEL]}
              fit="grid"
              cellSize={40}
              redrawInterval={4200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.contactInner}>
            <h2 id="contact-h">Terminal office</h2>
            <dl>
              <div>
                <dt>Operations, 24 h</dt>
                <dd>+49 471 000 000</dd>
              </div>
              <div>
                <dt>Berth booking</dt>
                <dd>
                  <a href="mailto:berth@hafen-sechs.example">berth@hafen-sechs.example</a>
                </dd>
              </div>
              <div>
                <dt>Address</dt>
                <dd>
                  Senator-Borttscheller-Str. 6
                  <br />
                  27568 Bremerhaven
                </dd>
              </div>
              <div>
                <dt>VHF</dt>
                <dd>Channel 14, call sign HAFEN SECHS</dd>
              </div>
            </dl>
          </div>
        </section>
      </main>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p className={s.footName}>Hafen Sechs</p>
            <p className={s.footTag}>Container Terminal 6, Bremerhaven. Six berths, 1,980 m of quay.</p>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Operations</h2>
            <ul className={s.footLinks}>
              <li>
                <a href="#berths">Berth register</a>
              </li>
              <li>
                <a href="#schedule">Expected this week</a>
              </li>
              <li>
                <a href="#gate">Gate and hinterland</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Shipping</h2>
            <ul className={s.footLinks}>
              <li>
                <a href="#contact">Berth booking</a>
              </li>
              <li>
                <a href="#gate">Rail and barge</a>
              </li>
              <li>
                <a href="#gate">Reefer plugs</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Contact</h2>
            <p className={s.footAddr}>
              Senator-Borttscheller-Str. 6
              <br />
              27568 Bremerhaven
              <br />
              berth@hafen-sechs.example
              <br />
              +49 471 000 000, 24 h
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p>A fictional container terminal. Prices and times are invented.</p>
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
