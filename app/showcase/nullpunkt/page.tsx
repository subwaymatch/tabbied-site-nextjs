import { TabbiedArtwork } from 'tabbied/react';
import {
  ortho, gimbal, ring, dipole, protractor,
} from 'tabbied/artworks';
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
/* The two inks the decorative tiles draw with: always the quiet pair, so a
   tile reads as a sample rather than as another headline. */
const TILE_A = GREY;
const TILE_B = PALE;


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
        {/* ---------------------------------------------------------- TILES */}
        <section id="tiles" className={s.tiles} aria-labelledby="tiles-h">
          <h2 id="tiles-h">Three sources of uncertainty</h2>
          <p className={s.secNote}>Every certificate states these. The budget is published in full with each result.</p>
          <div className={s.tileGrid}>
              <article key="01">
                <div className={s.tilePlate} aria-hidden="true">
                  <TabbiedArtwork
                    artwork={ring}
                    palette={['transparent', TILE_A, TILE_B]}
                    fit="grid"
                    cellSize={78}
                    redrawInterval={5400}
                    style={{ position: 'absolute', inset: 0 }}
                  />
                </div>
                <p className={s.tileN}>01</p>
                <h3>The reference</h3>
                <p className={s.tileBody}>How well the standard itself is known, and how long since it was compared upward. This is usually the smallest term and the hardest to improve.</p>
              </article>
              <article key="02">
                <div className={s.tilePlate} aria-hidden="true">
                  <TabbiedArtwork
                    artwork={gimbal}
                    palette={['transparent', TILE_A, TILE_B]}
                    fit="grid"
                    cellSize={64}
                    redrawInterval={6200}
                    style={{ position: 'absolute', inset: 0 }}
                  />
                </div>
                <p className={s.tileN}>02</p>
                <h3>The environment</h3>
                <p className={s.tileBody}>Temperature, and then temperature again. Twenty degrees is a definition, not a room, and holding it to a tenth costs more than the instrument.</p>
              </article>
              <article key="03">
                <div className={s.tilePlate} aria-hidden="true">
                  <TabbiedArtwork
                    artwork={protractor}
                    palette={['transparent', TILE_A, TILE_B]}
                    fit="grid"
                    cellSize={92}
                    redrawInterval={4800}
                    style={{ position: 'absolute', inset: 0 }}
                  />
                </div>
                <p className={s.tileN}>03</p>
                <h3>The operator</h3>
                <p className={s.tileBody}>Repeatability across three runs and two people. If the operator term dominates, the method is wrong, not the person.</p>
              </article>
          </div>
        </section>

        {/* ---------------------------------------------------------- INDEX */}
        <section id="index" className={s.idx} aria-labelledby="idx-h">
          <h2 id="idx-h">Reference standards held</h2>
          <p className={s.secNote}>What sits at the top of our chain, and when each was last compared upward.</p>
          <ol className={s.idxList}>
            <li className={s.idxHead} aria-hidden="true">
                <span>Standard</span>
                <span>Quantity</span>
                <span>Traceable to</span>
                <span>Last compared</span>
            </li>
              <li key="Gauge block set, grade K">
                <span>Gauge block set, grade K</span>
                <span>Length</span>
                <span>PTB</span>
                <span>Sep 2025</span>
              </li>
              <li key="E1 mass set, 1 mg to 20 kg">
                <span>E1 mass set, 1 mg to 20 kg</span>
                <span>Mass</span>
                <span>PTB</span>
                <span>Jun 2025</span>
              </li>
              <li key="SPRT with fixed points">
                <span>SPRT with fixed points</span>
                <span>Temperature</span>
                <span>PTB</span>
                <span>Mar 2025</span>
              </li>
              <li key="Caesium standard">
                <span>Caesium standard</span>
                <span>Frequency</span>
                <span>PTB via GNSS</span>
                <span>Continuous</span>
              </li>
              <li key="Piston gauge, two ranges">
                <span>Piston gauge, two ranges</span>
                <span>Pressure</span>
                <span>PTB</span>
                <span>Nov 2025</span>
              </li>
              <li key="Josephson array">
                <span>Josephson array</span>
                <span>Voltage</span>
                <span>PTB</span>
                <span>Apr 2025</span>
              </li>
          </ol>
        </section>

        {/* ------------------------------------------------------------ FAQ */}
        <section id="faq" className={s.faq} aria-labelledby="faq-h">
          <h2 id="faq-h">Before you send an instrument</h2>
          <dl className={s.faqList}>
              <div key="How should it be packed?">
                <dt>How should it be packed?</dt>
                <dd>In its own case, in a box, with the case not touching the box. Most damage we see happens in transit and none of it is dramatic.</dd>
              </div>
              <div key="Will you adjust it as we">
                <dt>Will you adjust it as well as calibrate it?</dt>
                <dd>Only if you ask in writing. Calibration and adjustment are different jobs, and an adjusted instrument has no history.</dd>
              </div>
              <div key="What if it is out of tol">
                <dt>What if it is out of tolerance?</dt>
                <dd>The certificate says so on the first line and we telephone you the same day, because the interesting question is what you measured with it last month.</dd>
              </div>
              <div key="Can I watch?">
                <dt>Can I watch?</dt>
                <dd>Yes. Ask when you book. Most people stay twenty minutes and leave with a better feel for why it takes fifteen days.</dd>
              </div>
          </dl>
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
