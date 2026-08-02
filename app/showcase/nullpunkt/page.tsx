import { TabbiedArtwork } from 'tabbied/react';
import { ortho, gimbal, ring, dipole, protractor } from 'tabbied/artworks';
import { Figure } from 'components/Figure';
import s from './nullpunkt.module.css';

export const metadata = {
  title: 'Nullpunkt: Institut für Messtechnik',
  description:
    'Nullpunkt is a national calibration laboratory in Braunschweig. Length, mass, temperature and time, traceable to the SI and stated with an uncertainty.',
};

/* White, black, one red used exactly four times on the page. Pattern fields
   take `transparent` in the background slot; nothing here is tinted. */
const INK = '#0A0A0A';
const RED = '#E10600';
const GREY = '#9EA2A6';
const PALE = '#DBDBD9';

const SERVICES = [
  { q: 'Length', range: '0.5 mm to 1 000 mm', unc: '± (0.05 + L/2000) µm', kit: 'Gauge blocks, CMM, interferometer' },
  { q: 'Mass', range: '1 mg to 50 kg', unc: '± 0.15 mg at 1 kg', kit: 'E1 weights, comparator' },
  { q: 'Temperature', range: '−80 °C to 660 °C', unc: '± 4 mK at fixed points', kit: 'SPRT, fixed-point cells' },
  { q: 'Time and frequency', range: '10 MHz to 10 GHz', unc: '± 2 × 10⁻¹³ / day', kit: 'Caesium standard, GNSS link' },
  { q: 'Pressure', range: '1 Pa to 100 MPa', unc: '± 12 ppm', kit: 'Piston gauges, two ranges' },
  { q: 'Electrical', range: '1 µV to 1 kV', unc: '± 0.6 ppm at 10 V', kit: 'Josephson standard' },
];

const PRINCIPLES = [
  { n: '1', t: 'A number without an uncertainty is not a measurement', d: 'Every certificate we issue states the uncertainty, the coverage factor and the confidence level. There is no house style that omits them.' },
  { n: '2', t: 'The chain is only as good as its weakest link', d: 'We publish our own traceability chain, upward to the national standard and downward to the instrument on your bench.' },
  { n: '3', t: 'Repeat before you believe', d: 'Every calibration is run at least three times, at least once by a second metrologist, on a different day.' },
  { n: '4', t: 'Report the failures too', d: 'If your instrument is out of tolerance, the certificate says so on the first line and not in an annexe.' },
];

const TURNAROUND = [
  ['Standard', '15 working days', 'Included'],
  ['Priority', '5 working days', '+ 60 %'],
  ['Same week', '3 working days', '+ 140 %'],
  ['On site', 'By arrangement', 'Quoted'],
];

export default function NullpunktPage() {
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
          <span className={s.dot} aria-hidden="true" />
          Nullpunkt
        </a>
        <nav aria-label="Sections">
          <a href="#scope">Scope</a>
          <a href="#principles">Principles</a>
          <a href="#turnaround">Turnaround</a>
          <a href="#lab">Laboratory</a>
        </nav>
        <span className={s.accred}>Akkreditiert · D-K-00000-00-00</span>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div className={s.heroField} aria-hidden="true">
            <TabbiedArtwork
              artwork={ortho}
              palette={['transparent', PALE, GREY]}
              fit="grid"
              cellSize={160}
              redrawInterval={7000}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <p className={s.eyebrow}>Institut für Messtechnik / Braunschweig</p>
            <h1>
              Zero is a
              <br />
              <span>decision</span>, and
              <br />
              somebody has to
              <br />
              make it.
            </h1>
            <p className={s.lede}>
              We calibrate the instruments that other laboratories calibrate
              against. Six quantities, one uncertainty budget each, published in
              full.
            </p>
          </div>
        </section>

        <figure className={s.bleed}>
          <Figure
            slug="nullpunkt-gauges"
            alt="A fitted case of precision steel gauge blocks opened on a white laboratory bench"
            priority
          />
          <figcaption>Set 04, grade K. Wrung, measured, and put back the same afternoon.</figcaption>
        </figure>

        {/* --------------------------------------------------------- SCOPE */}
        <section id="scope" className={s.scope} aria-labelledby="scope-h">
          <h2 className={s.h2} id="scope-h">
            Scope of accreditation
          </h2>
          <ol className={s.table}>
            <li className={s.thead} aria-hidden="true">
              <span>Quantity</span>
              <span>Range</span>
              <span>Best uncertainty</span>
              <span>Reference</span>
            </li>
            {SERVICES.map((x) => (
              <li key={x.q}>
                <span className={s.q}>{x.q}</span>
                <span className={s.num}>{x.range}</span>
                <span className={s.unc}>{x.unc}</span>
                <span className={s.kit}>{x.kit}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ----------------------------------------------------- ZERO BAND */}
        <section className={s.zeroBand} aria-hidden="true">
          <div className={s.zeroField}>
            <TabbiedArtwork
              artwork={ring}
              palette={['transparent', INK, RED, GREY]}
              fit="grid"
              cellSize={112}
              redrawInterval={4000}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* ---------------------------------------------------- PRINCIPLES */}
        <section id="principles" className={s.principles} aria-labelledby="principles-h">
          <div className={s.prField} aria-hidden="true">
            <TabbiedArtwork
              artwork={gimbal}
              palette={['transparent', GREY, PALE]}
              fit="grid"
              cellSize={106}
              redrawInterval={5600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.prInner}>
            <h2 className={s.h2} id="principles-h">
              Four things we will not negotiate
            </h2>
            <ol className={s.prList}>
              {PRINCIPLES.map((p) => (
                <li key={p.n}>
                  <span className={s.prN}>{p.n}</span>
                  <div>
                    <h3>{p.t}</h3>
                    <p>{p.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ------------------------------------------------------- LAB PAIR */}
        <div className={s.pair}>
          <figure>
            <Figure
              slug="nullpunkt-cmm"
              alt="A coordinate measuring machine with a probe over a metal part in a clean laboratory"
            />
            <figcaption>CMM 2, granite table, 20.0 °C ± 0.1.</figcaption>
          </figure>
          <figure>
            <Figure
              slug="nullpunkt-artefact"
              alt="A polished metal cylinder standing under a glass bell jar on a black granite table"
            />
            <figcaption>Transfer artefact, checked every ninety days.</figcaption>
          </figure>
        </div>

        {/* ---------------------------------------------------- TURNAROUND */}
        <section id="turnaround" className={s.turn} aria-labelledby="turn-h">
          <h2 className={s.h2} id="turn-h">
            Turnaround
          </h2>
          <ol className={s.turnList}>
            {TURNAROUND.map(([tier, days, cost]) => (
              <li key={tier}>
                <span className={s.tTier}>{tier}</span>
                <span className={s.tDays}>{days}</span>
                <span className={s.tCost}>{cost}</span>
              </li>
            ))}
          </ol>
          <p className={s.turnNote}>
            The clock starts when the instrument reaches the laboratory and has
            reached room temperature, which for a steel artefact from a cold van
            is not the same morning.
          </p>
        </section>

        {/* ----------------------------------------------------------- LAB */}
        <section id="lab" className={s.lab} aria-labelledby="lab-h">
          <div className={s.labField} aria-hidden="true">
            <TabbiedArtwork
              artwork={dipole}
              palette={['transparent', RED, GREY]}
              fit="grid"
              cellSize={124}
              redrawInterval={4800}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.labInner}>
            <h2 className={s.h2} id="lab-h">
              Bundesallee 100
            </h2>
            <div className={s.labGrid}>
              <p className={s.big}>
                Four measurement rooms held at 20.0 °C, two of them to a tenth.
                Deliveries to the rear, and please do not open the case in the
                corridor.
              </p>
              <dl>
                <div>
                  <dt>Laboratory</dt>
                  <dd>
                    Bundesallee 100
                    <br />
                    38116 Braunschweig
                  </dd>
                </div>
                <div>
                  <dt>Submissions</dt>
                  <dd>
                    <a href="mailto:kalibrierung@nullpunkt.example">
                      kalibrierung@nullpunkt.example
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>Goods in</dt>
                  <dd>Mon to Thu, 07.30 to 15.00</dd>
                </div>
                <div>
                  <dt>Certificates</dt>
                  <dd>Signed PDF, and paper on request, at no charge</dd>
                </div>
              </dl>
            </div>
            <figure className={s.wide}>
              <Figure
                slug="nullpunkt-lab"
                alt="An empty temperature-controlled measurement laboratory with white surfaces"
              />
              <figcaption>Room 2, empty and at temperature. This is what good looks like.</figcaption>
            </figure>
          </div>
        </section>
      </main>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p className={s.footName}>Nullpunkt</p>
            <p className={s.footTag}>Institut für Messtechnik, Bundesallee 100, Braunschweig.</p>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Calibration</h2>
            <ul className={s.footLinks}>
              <li>
                <a href="#scope">Scope of accreditation</a>
              </li>
              <li>
                <a href="#turnaround">Turnaround</a>
              </li>
              <li>
                <a href="#principles">Principles</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Laboratory</h2>
            <ul className={s.footLinks}>
              <li>
                <a href="#lab">Bundesallee 100</a>
              </li>
              <li>
                <a href="#lab">Goods in</a>
              </li>
              <li>
                <a href="#lab">Certificates</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Contact</h2>
            <p className={s.footAddr}>
              Bundesallee 100
              <br />
              38116 Braunschweig
              <br />
              kalibrierung@nullpunkt.example
              <br />
              D-K-00000-00-00
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p>A fictional calibration laboratory. Prices and times are invented.</p>
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
