import { TabbiedArtwork } from 'tabbied/react';
import {
  ripplering, tidering, lagoon, dotwash, curl,
} from 'tabbied/artworks';
import { Figure } from 'components/Figure';
import s from './kaella.module.css';

export const metadata = {
  title: 'Källa: Kommunalt Vatten, Uppsala',
  description:
    'Källa supplies drinking water to 91,000 households in Uppsala. Source, treatment, network and what came out of the tap this morning.',
};

/* Pale water, dark ink, one aqua. Every pattern field takes `transparent` in
   the background slot so the page colour reads through. */
const INK = '#0F1A1D';
const AQUA = '#00A6A6';
const STEEL = '#7E9296';
const MIST = '#DCE7E7';
/* The two inks the decorative tiles draw with: always the quiet pair, so a
   tile reads as a sample rather than as another headline. */
/* The tiles pin their doodle to a whole multiple of the cell (9 × 72px)
   and let the plate clip it. A fluid box gives fractional grid tracks and
   a hairline seam at every cell edge. */
const TILE_BOX = 648;
const TILE_A = STEEL;
const TILE_B = MIST;


const TODAY = [
  { p: 'Hardness', v: '5.8', u: '°dH', note: 'Medium soft' },
  { p: 'pH', v: '7.9', u: '', note: 'Within 7.5 to 9.0' },
  { p: 'Nitrate', v: '2.1', u: 'mg/l', note: 'Limit 50' },
  { p: 'Turbidity', v: '0.09', u: 'FNU', note: 'Limit 1.0' },
  { p: 'Chloride', v: '11', u: 'mg/l', note: 'Limit 250' },
  { p: 'Temperature', v: '8.4', u: '°C', note: 'At the works' },
];

const CHAIN = [
  { n: '01', t: 'Source', d: 'Fourteen wells in the Uppsala esker, drawing from an aquifer recharged by the Fyris river through two kilometres of glacial sand.' },
  { n: '02', t: 'Aeration', d: 'Cascade aeration to raise oxygen and drive off carbon dioxide, in the open, in whatever weather Uppland provides.' },
  { n: '03', t: 'Filtration', d: 'Rapid sand, then slow sand at 0.1 metres an hour. The slow filters are biological and are cleaned by hand, twice a year.' },
  { n: '04', t: 'UV and distribution', d: 'UV disinfection, no chlorine in normal operation, then 940 kilometres of main to 91,000 households.' },
];

const NUMBERS = [
  ['91 000', 'Households supplied'],
  ['940 km', 'Water main'],
  ['14', 'Wells in the esker'],
  ['0.09', 'FNU turbidity today'],
];

const WORKS = [
  ['Galgbacken', 'Slow sand, 6 beds', '1957', '38 000 m³/d'],
  ['Stadsträdgården', 'Rapid + slow sand', '1971', '52 000 m³/d'],
  ['Bäcklösa', 'Rapid sand, UV', '2004', '24 000 m³/d'],
];

export default function KaellaPage() {
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
          Källa
          <i>Kommunalt vatten, Uppsala</i>
        </a>
        <nav aria-label="Sections">
          <a href="#today">Today</a>
          <a href="#chain">Treatment</a>
          <a href="#works">Works</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div className={s.heroField} aria-hidden="true">
            <TabbiedArtwork
              artwork={ripplering}
              palette={['transparent', MIST, STEEL]}
              fit="grid"
              cellSize={150}
              redrawInterval={4800}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <p className={s.eyebrow}>Uppsala vatten / sedan 1876</p>
            <h1>
              It comes out of
              <br />
              a hill, and we try
              <br />
              <span>not to spoil it.</span>
            </h1>
            <p className={s.lede}>
              Fourteen wells in the esker, three works, nine hundred and forty
              kilometres of main. No chlorine in normal operation, because the
              water does not need it.
            </p>
          </div>
        </section>

        <figure className={s.bleed}>
          <Figure
            slug="kaella-basin"
            alt="A still rectangular water treatment basin seen from a walkway at dawn with mist on the surface"
            priority
          />
          <figcaption>Slow filter 3, Galgbacken. 0.1 metres an hour, since 1957.</figcaption>
        </figure>

        {/* ---------------------------------------------------------- TODAY */}
        <section id="today" className={s.today} aria-labelledby="today-h">
          <div className={s.secHead}>
            <h2 id="today-h">This morning, at the works</h2>
            <p>Sampled 06.00, published unedited. Yesterday and every day back to 2011 are in the archive.</p>
          </div>
          <ol className={s.readings}>
            {TODAY.map((t) => (
              <li key={t.p}>
                <span className={s.rP}>{t.p}</span>
                <span className={s.rV}>
                  {t.v}
                  <i>{t.u}</i>
                </span>
                <span className={s.rNote}>{t.note}</span>
              </li>
            ))}
          </ol>
          <dl className={s.numbers}>
            {NUMBERS.map(([v, k]) => (
              <div key={k}>
                <dt>{v}</dt>
                <dd>{k}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ----------------------------------------------------- FLOW BAND */}
        <section className={s.flowBand} aria-hidden="true">
          <div className={s.flowField}>
            <TabbiedArtwork
              artwork={tidering}
              palette={['transparent', AQUA, INK, STEEL]}
              fit="grid"
              cellSize={120}
              redrawInterval={3000}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* ---------------------------------------------------------- CHAIN */}
        <section id="chain" className={s.chain} aria-labelledby="chain-h">
          <div className={s.chainField} aria-hidden="true">
            <TabbiedArtwork
              artwork={lagoon}
              palette={['transparent', STEEL, MIST]}
              fit="grid"
              cellSize={110}
              redrawInterval={5600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.chainInner}>
            <div className={s.secHead}>
              <h2 id="chain-h">Well to tap, in four steps</h2>
            </div>
            <ol className={s.chainList}>
              {CHAIN.map((c) => (
                <li key={c.n}>
                  <span className={s.cN}>{c.n}</span>
                  <h3>{c.t}</h3>
                  <p>{c.d}</p>
                </li>
              ))}
            </ol>
            <div className={s.pair}>
              <figure>
                <Figure
                  slug="kaella-valves"
                  alt="A valve hall of large painted pipework and hand wheels, evenly lit"
                />
                <figcaption>Valve hall, Bäcklösa. Everything here is turned by hand.</figcaption>
              </figure>
              <figure>
                <Figure
                  slug="kaella-reservoir"
                  alt="An open service reservoir at first light with flat water and a low concrete edge"
                />
                <figcaption>Service reservoir, 14,000 m³, covered since 1988.</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- WORKS */}
        <section id="works" className={s.works} aria-labelledby="works-h">
          <div className={s.secHead}>
            <h2 id="works-h">Three works</h2>
          </div>
          <ol className={s.worksList}>
            {WORKS.map(([name, kind, year, cap]) => (
              <li key={name}>
                <span className={s.wName}>{name}</span>
                <span className={s.wKind}>{kind}</span>
                <span className={s.wYear}>{year}</span>
                <span className={s.wCap}>{cap}</span>
              </li>
            ))}
          </ol>
          <figure className={s.wide}>
            <Figure
              slug="kaella-sample"
              alt="A rack of clear water sample bottles on a laboratory bench"
            />
            <figcaption>Ninety-four samples a week, six of them from taps chosen at random.</figcaption>
          </figure>
        </section>

        {/* -------------------------------------------------------- CONTACT */}
        <section id="contact" className={s.contact} aria-labelledby="contact-h">
          <div className={s.contactField} aria-hidden="true">
            <TabbiedArtwork
              artwork={dotwash}
              palette={['transparent', AQUA, STEEL]}
              fit="grid"
              cellSize={46}
              redrawInterval={4200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.contactInner}>
            <div className={s.secHead}>
              <h2 id="contact-h">If something is wrong with the water</h2>
            </div>
            <dl className={s.dl}>
              <div>
                <dt>Report a fault, 24 h</dt>
                <dd>018 000 000</dd>
              </div>
              <div>
                <dt>Write</dt>
                <dd>
                  <a href="mailto:vatten@kaella.example">vatten@kaella.example</a>
                </dd>
              </div>
              <div>
                <dt>Office</dt>
                <dd>
                  Kungsängsvägen 27
                  <br />
                  753 23 Uppsala
                </dd>
              </div>
              <div>
                <dt>Discoloured water</dt>
                <dd>Run the cold tap for five minutes. If it persists, call the number above.</dd>
              </div>
            </dl>
          </div>
        </section>
        {/* ---------------------------------------------------------- TILES */}
        <section id="tiles" className={s.tiles} aria-labelledby="tiles-h">
          <h2 id="tiles-h">Three things we test for that nobody asks about</h2>
          <p className={s.secNote}>The parameters on the front page are the ones people know. These are the ones that actually keep the supply safe.</p>
          <div className={s.tileGrid}>
              <article key="01">
                <div className={s.tilePlate} aria-hidden="true">
                  <TabbiedArtwork
                    artwork={ripplering}
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
                <h3>Coliforms</h3>
                <p className={s.tileBody}>Ninety-four samples a week, six from taps chosen at random across the network. A single positive closes a zone until three consecutive clears.</p>
              </article>
              <article key="02">
                <div className={s.tilePlate} aria-hidden="true">
                  <TabbiedArtwork
                    artwork={dotwash}
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
                <h3>Trihalomethanes</h3>
                <p className={s.tileBody}>A by-product of chlorination, which is one of several reasons we do not chlorinate in normal operation. Measured anyway, monthly.</p>
              </article>
              <article key="03">
                <div className={s.tilePlate} aria-hidden="true">
                  <TabbiedArtwork
                    artwork={lagoon}
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
                <h3>Pressure</h3>
                <p className={s.tileBody}>Not a quality parameter, but a low-pressure event is how contamination gets into a main. Logged continuously at forty points.</p>
              </article>
          </div>
        </section>

        {/* ---------------------------------------------------------- INDEX */}
        <section id="index" className={s.idx} aria-labelledby="idx-h">
          <h2 id="idx-h">Network</h2>
          <p className={s.secNote}>What the nine hundred and forty kilometres are actually made of, oldest first.</p>
          <ol className={s.idxList}>
            <li className={s.idxHead} aria-hidden="true">
                <span>Material</span>
                <span>Length</span>
                <span>Laid</span>
                <span>Replacement</span>
            </li>
              <li key="Cast iron">
                <span>Cast iron</span>
                <span>118 km</span>
                <span>1876 to 1955</span>
                <span>Priority, 4 km a year</span>
              </li>
              <li key="Asbestos cement">
                <span>Asbestos cement</span>
                <span>96 km</span>
                <span>1950 to 1974</span>
                <span>Priority, on failure</span>
              </li>
              <li key="Ductile iron">
                <span>Ductile iron</span>
                <span>341 km</span>
                <span>1970 to 2000</span>
                <span>As required</span>
              </li>
              <li key="PE 100">
                <span>PE 100</span>
                <span>372 km</span>
                <span>1995 onward</span>
                <span>None expected</span>
              </li>
              <li key="Steel, trunk">
                <span>Steel, trunk</span>
                <span>13 km</span>
                <span>1962</span>
                <span>Relined 2018</span>
              </li>
              <li key="Service pipes">
                <span>Service pipes</span>
                <span>n/a</span>
                <span>Various</span>
                <span>Lead: none remaining</span>
              </li>
          </ol>
        </section>

        {/* ------------------------------------------------------------ FAQ */}
        <section id="faq" className={s.faq} aria-labelledby="faq-h">
          <h2 id="faq-h">Questions from households</h2>
          <dl className={s.faqList}>
              <div key="Why is my water cloudy?">
                <dt>Why is my water cloudy?</dt>
                <dd>Almost always air, not dirt. Fill a glass and leave it for two minutes; if it clears from the bottom up it was air and there is nothing wrong.</dd>
              </div>
              <div key="Do I need a filter?">
                <dt>Do I need a filter?</dt>
                <dd>No. If you dislike the taste, a jug in the fridge for an hour does more than any filter, and costs nothing.</dd>
              </div>
              <div key="Is it hard water?">
                <dt>Is it hard water?</dt>
                <dd>Five point eight degrees, which is medium soft. You will use less detergent here than almost anywhere else in the country.</dd>
              </div>
              <div key="Why does it taste differ">
                <dt>Why does it taste different in summer?</dt>
                <dd>Slightly warmer at the tap and slightly longer in the main. Same water, same source, different residence time.</dd>
              </div>
          </dl>
        </section>

      </main>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p className={s.footName}>Källa</p>
            <p className={s.footTag}>Kommunalt vatten, Kungsängsvägen 27, Uppsala, sedan 1876.</p>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Water</h2>
            <ul className={s.footLinks}>
              <li>
                <a href="#today">This morning</a>
              </li>
              <li>
                <a href="#chain">Well to tap</a>
              </li>
              <li>
                <a href="#works">Three works</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Customers</h2>
            <ul className={s.footLinks}>
              <li>
                <a href="#contact">Report a fault</a>
              </li>
              <li>
                <a href="#contact">Discoloured water</a>
              </li>
              <li>
                <a href="#today">The archive</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Contact</h2>
            <p className={s.footAddr}>
              Kungsängsvägen 27
              <br />
              753 23 Uppsala
              <br />
              vatten@kaella.example
              <br />
              018 000 000, 24 h
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p>A fictional water utility. Prices and times are invented.</p>
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
