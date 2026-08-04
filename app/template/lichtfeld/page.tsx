import { TabbiedPattern } from 'tabbied/react';
import {
  beamspread, dimmer, falloff, radiance, spraydown, sunray,
} from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import s from './lichtfeld.module.css';

export const metadata = {
  title: 'Lichtfeld: Lichtplanung, München',
  description:
    'Lichtfeld plans light for buildings and public space. Mock-ups before drawings, measured lux, and a strict position on what should stay dark.',
};

/* Near-black ground, white type, one warm yellow that is the light itself.
   Every field takes `transparent` in the background slot. */
const WHITE = '#FAFAF5';
const WARM = '#F5E663';
const GREY = '#6A6A64';
const PANEL = '#151515';
/* The two inks the decorative tiles draw with: always the quiet pair, so a
   tile reads as a sample rather than as another headline. */
/* The tiles pin their doodle to a whole multiple of the cell (9 × 72px)
   and let the plate clip it. A fluid box gives fractional grid tracks and
   a hairline seam at every cell edge. */
const TILE_BOX = 648;
const TILE_A = GREY;
const TILE_B = PANEL;


const WORK = [
  { code: 'L-118', name: 'Pinakothek, west stair', kind: 'Interior, public', year: '2026', lux: '80 lx' },
  { code: 'L-112', name: 'Hofgarten colonnade', kind: 'Exterior, listed', year: '2025', lux: '12 lx' },
  { code: 'L-104', name: 'Werkhalle 3, Riem', kind: 'Industrial', year: '2025', lux: '500 lx' },
  { code: 'L-097', name: 'Sankt Bonifaz, nave', kind: 'Sacred', year: '2024', lux: '50 lx' },
  { code: 'L-089', name: 'Isar footbridge', kind: 'Exterior, public', year: '2023', lux: '5 lx' },
];

const POSITIONS = [
  { n: '01', t: 'Mock up before you draw', d: 'We build the condition full size, on site, at night, and look at it. Every scheme we have regretted was one that went to drawings first.' },
  { n: '02', t: 'Dark is a material', d: 'The brief usually asks how bright. The useful question is what should stay unlit, and it is almost always more than the client expects.' },
  { n: '03', t: 'One colour temperature', d: 'A single CCT per space, held across every fixture and every replacement lamp for the life of the building. Written into the O&M manual.' },
  { n: '04', t: 'Measure, then argue', d: 'We bring a meter to every handover. An opinion about a lighting scheme is worth having; a reading is worth acting on.' },
];

const NUMBERS = [
  ['118', 'Schemes since 2006'],
  ['2 700 K', 'House warm white'],
  ['5 lx', 'Lowest scheme'],
  ['0', 'Uplighters specified'],
];

export default function LichtfeldPage() {
  return (
    <div className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,200..700&display=swap"
      />

      <header className={s.bar}>
        <a className={s.mark} href="#top">
          Lichtfeld
        </a>
        <nav aria-label="Sections">
          <a href="#work">Work</a>
          <a href="#positions">Positions</a>
          <a href="#method">Method</a>
          <a href="#studio">Studio</a>
        </nav>
        <span className={s.tag}>Lichtplanung / München</span>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={falloff}
              palette={['transparent', WARM, GREY]}
              fit="grid"
              cellSize={168}
              redrawInterval={5800}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <p className={s.eyebrow}>Lichtplanung / seit 2006</p>
            <h1>
              The question is
              <br />
              never how bright.
              <br />
              <span>It is what stays dark.</span>
            </h1>
            <p className={s.lede}>
              Light for buildings, streets and one footbridge. We mock up on
              site before we draw, and we bring a meter to the handover.
            </p>
          </div>
        </section>

        <figure className={s.bleed}>
          <Figure
            slug="lichtfeld-stair"
            alt="A concrete stair at night lit only by a continuous recessed line of warm light"
            priority
          />
          <figcaption>L-118, west stair. 80 lx on the tread, nothing on the wall.</figcaption>
        </figure>

        <dl className={s.numbers}>
          {NUMBERS.map(([v, k]) => (
            <div key={k}>
              <dt>{v}</dt>
              <dd>{k}</dd>
            </div>
          ))}
        </dl>

        {/* ----------------------------------------------------------- WORK */}
        <section id="work" className={s.work} aria-labelledby="work-h">
          <h2 className={s.h2} id="work-h">
            Recent schemes
          </h2>
          <ol className={s.table}>
            <li className={s.thead} aria-hidden="true">
              <span>Job</span>
              <span>Scheme</span>
              <span>Type</span>
              <span>Design level</span>
              <span>Year</span>
            </li>
            {WORK.map((w) => (
              <li key={w.code}>
                <span className={s.code}>{w.code}</span>
                <span className={s.name}>{w.name}</span>
                <span className={s.kind}>{w.kind}</span>
                <span className={s.lux}>{w.lux}</span>
                <span className={s.year}>{w.year}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ----------------------------------------------------- GLOW BAND */}
        <section className={s.glowBand} aria-hidden="true">
          <div className={s.glowField}>
            <TabbiedPattern
              pattern={radiance}
              palette={['transparent', WARM, WHITE, GREY]}
              fit="grid"
              cellSize={136}
              redrawInterval={3400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* ------------------------------------------------------ POSITIONS */}
        <section id="positions" className={s.positions} aria-labelledby="positions-h">
          <div className={s.posField} aria-hidden="true">
            <TabbiedPattern
              pattern={sunray}
              palette={['transparent', GREY, WARM]}
              fit="grid"
              cellSize={140}
              redrawInterval={6200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.posInner}>
            <h2 className={s.h2} id="positions-h">
              Four positions
            </h2>
            <ol className={s.posList}>
              {POSITIONS.map((p) => (
                <li key={p.n}>
                  <span className={s.pN}>{p.n}</span>
                  <h3>{p.t}</h3>
                  <p>{p.d}</p>
                </li>
              ))}
            </ol>
            <div className={s.pair}>
              <figure>
                <Figure
                  slug="lichtfeld-mockup"
                  alt="A lighting mock-up room with several fixtures aimed at a sample wall"
                />
                <figcaption>Mock-up, L-112. Four options, one night, one decision.</figcaption>
              </figure>
              <figure>
                <Figure
                  slug="lichtfeld-fixture"
                  alt="A single machined luminaire on a plain workbench lit from the side"
                />
                <figcaption>Bespoke, 2,700 K, machined in Augsburg.</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- METHOD */}
        <section id="method" className={s.method} aria-labelledby="method-h">
          <h2 className={s.h2} id="method-h">
            How a scheme happens
          </h2>
          <div className={s.methodGrid}>
            <p className={s.big}>
              Walk the site after dark. Build the mock-up. Look at it with the
              people who will use the building, not only the ones paying for it.
              Then draw.
            </p>
            <div className={s.methodCol}>
              <p>
                We do not issue a lighting layout until a full-size condition has
                been seen at night by somebody with the authority to change their
                mind. It costs a fortnight and saves a year.
              </p>
              <p>
                Commissioning is part of the fee, not an extra. We aim every
                fixture ourselves, at night, and we come back once in the first
                winter to do it again.
              </p>
            </div>
          </div>
          <figure className={s.wide}>
            <Figure
              slug="lichtfeld-facade"
              alt="A building facade at dusk washed with warm light from below"
            />
            <figcaption>L-112, colonnade. 12 lx, and the sky still legible above it.</figcaption>
          </figure>
        </section>

        {/* --------------------------------------------------------- STUDIO */}
        <section id="studio" className={s.studio} aria-labelledby="studio-h">
          <div className={s.studioField} aria-hidden="true">
            <TabbiedPattern
              pattern={dimmer}
              palette={['transparent', WARM, GREY]}
              fit="grid"
              cellSize={86}
              redrawInterval={4600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.studioInner}>
            <h2 className={s.h2} id="studio-h">
              Studio
            </h2>
            <dl className={s.contact}>
              <div>
                <dt>Office</dt>
                <dd>
                  Baaderstrasse 18, Rgb.
                  <br />
                  80469 München
                </dd>
              </div>
              <div>
                <dt>Write</dt>
                <dd>
                  <a href="mailto:licht@lichtfeld.example">licht@lichtfeld.example</a>
                </dd>
              </div>
              <div>
                <dt>Appointments</dt>
                <dd>After dark, on site, by preference</dd>
              </div>
              <div>
                <dt>Fees</dt>
                <dd>Percentage or lump sum. Commissioning always included.</dd>
              </div>
            </dl>
          </div>
        </section>
        {/* ---------------------------------------------------------- TILES */}
        <section id="tiles" className={s.tiles} aria-labelledby="tiles-h">
          <h2 id="tiles-h">Three things we will not specify</h2>
          <p className={s.secNote}>Not taste. Each of these causes a specific, measurable problem we have been called back to fix.</p>
          <div className={s.tileGrid}>
              <article key="01">
                <div className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={dimmer}
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
                  <Figure slug="lichtfeld-tile-uplighter-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p className={s.tileN}>01</p>
                <h3>Uplighters</h3>
                <p className={s.tileBody}>They light the sky, the underside of leaves and the inside of your eye, in that order. Nothing that matters is above the fixture.</p>
              </article>
              <article key="02">
                <div className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={falloff}
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
                  <Figure slug="lichtfeld-tile-bollard-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p className={s.tileN}>02</p>
                <h3>Cool white outdoors</h3>
                <p className={s.tileBody}>Four thousand kelvin outdoors reads as institutional at any level, disturbs insects far more than warm white, and never flatters a facade.</p>
              </article>
              <article key="03">
                <div className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={spraydown}
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
                  <Figure slug="lichtfeld-tile-lamp-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p className={s.tileN}>03</p>
                <h3>Above 3 000 K near a bed</h3>
                <p className={s.tileBody}>It is not about atmosphere. It is about the hour before sleep, and it is the one thing clients thank us for two years later.</p>
              </article>
          </div>
        </section>

        {/* ---------------------------------------------------------- INDEX */}
        <section id="index" className={s.idx} aria-labelledby="idx-h">
          <h2 id="idx-h">What we hand over</h2>
          <p className={s.secNote}>At practical completion, on paper and as files. The O&M is written to be read by a caretaker, not a lawyer.</p>
          <ol className={s.idxList}>
            <li className={s.idxHead} aria-hidden="true">
                <span>Document</span>
                <span>Format</span>
                <span>For</span>
                <span>Note</span>
            </li>
              <li key="Lighting layout">
                <span>Lighting layout</span>
                <span>PDF, DWG</span>
                <span>Installer</span>
                <span>Aiming angles marked</span>
              </li>
              <li key="Schedule">
                <span>Schedule</span>
                <span>PDF, XLSX</span>
                <span>Client</span>
                <span>With replacement lamps</span>
              </li>
              <li key="Control strategy">
                <span>Control strategy</span>
                <span>PDF</span>
                <span>Facilities</span>
                <span>Scenes, times, overrides</span>
              </li>
              <li key="Commissioning record">
                <span>Commissioning record</span>
                <span>PDF</span>
                <span>Client</span>
                <span>Measured, not designed, levels</span>
              </li>
              <li key="O&M">
                <span>O&M</span>
                <span>PDF, paper</span>
                <span>Caretaker</span>
                <span>Twelve pages, plain language</span>
              </li>
              <li key="Spares list">
                <span>Spares list</span>
                <span>PDF</span>
                <span>Facilities</span>
                <span>Ten years of availability</span>
              </li>
          </ol>
        </section>

        {/* ------------------------------------------------------------ FAQ */}
        <section id="faq" className={s.faq} aria-labelledby="faq-h">
          <h2 id="faq-h">Questions from clients</h2>
          <dl className={s.faqList}>
              <div key="Why do you insist on a m">
                <dt>Why do you insist on a mock-up?</dt>
                <dd>Because everybody, including us, is wrong about light on paper. A fortnight of mock-up has saved every project we have run it on.</dd>
              </div>
              <div key="Is LED still improving?">
                <dt>Is LED still improving?</dt>
                <dd>The chips, marginally. The drivers and the optics, considerably. We specify for the driver being replaceable, which most fittings still do not allow.</dd>
              </div>
              <div key="Can you work with our el">
                <dt>Can you work with our electrical engineer?</dt>
                <dd>Always. We do the design intent and the aiming; they do the distribution and the compliance. It only goes wrong when nobody says which is which.</dd>
              </div>
              <div key="What does it cost?">
                <dt>What does it cost?</dt>
                <dd>Percentage or lump sum, and commissioning is always inside it. A scheme we do not commission is a scheme we did not design.</dd>
              </div>
          </dl>
        </section>

      </main>


        {/* A coda: the last thing before the footer is the pattern itself, at
            working size and with nothing to read. Purely decorative. */}
        <section className={s.coda} aria-hidden="true">
          <div className={s.codaField}>
            <TabbiedPattern
              pattern={beamspread}
              palette={['transparent', WHITE, GREY]}
              fit="grid"
              cellSize={116}
              redrawInterval={5012}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p className={s.footName}>Lichtfeld</p>
            <p className={s.footTag}>Lichtplanung, Baaderstrasse 18, München, seit 2006.</p>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Work</h2>
            <ul className={s.footLinks}>
              <li>
                <a href="#work">Recent schemes</a>
              </li>
              <li>
                <a href="#positions">Four positions</a>
              </li>
              <li>
                <a href="#method">How a scheme happens</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Studio</h2>
            <ul className={s.footLinks}>
              <li>
                <a href="#studio">Baaderstrasse 18</a>
              </li>
              <li>
                <a href="#studio">Fees</a>
              </li>
              <li>
                <a href="#studio">Appointments after dark</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Contact</h2>
            <p className={s.footAddr}>
              Baaderstrasse 18, Rgb.
              <br />
              80469 München
              <br />
              licht@lichtfeld.example
              <br />
              House warm white, 2 700 K
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p>A fictional lighting practice. Prices and times are invented.</p>
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
