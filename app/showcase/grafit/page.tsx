import { TabbiedArtwork } from 'tabbied/react';
import {
  bevelset, charcoal, drypoint, kerf, louvre, nosing, reeding, schist,
} from 'tabbied/artworks';
import s from './grafit.module.css';

export const metadata = {
  title: 'Grafit: Pencil works, Nuremberg',
  description:
    'Seventeen grades from 9H to 9B, cedar from one forest, graphite from one mine. A pencil factory that has changed its recipe twice since 1868.',
};

/* Warm grey paper, ink, one ochre. Fields take `transparent` in the
   background slot so the paper of the page is the paper of the pattern. */
const INK = '#131313';
const OCHRE = '#e5a000';
const GREY = '#8a887f';
const PALE = '#dcdad0';

/* Seventeen grades, hardest to softest, and how dark each one lays down.
   The strip below is drawn from the second number and nothing else. */
const GRADES: [string, number][] = [
  ['9H', 6], ['8H', 9], ['7H', 12], ['6H', 16], ['5H', 20], ['4H', 25],
  ['3H', 31], ['2H', 38], ['H', 46], ['F', 52], ['HB', 58], ['B', 65],
  ['2B', 72], ['3B', 78], ['4B', 84], ['6B', 91], ['9B', 97],
];

const LINES = [
  { n: '01', t: 'Zeichner', d: 'The drawing pencil. Seventeen grades, hexagonal, unlacquered cedar', price: '€ 2.40', made: '1868' },
  { n: '02', t: 'Kontor', d: 'The office pencil. HB only, round, ochre lacquer, red-dipped end', price: '€ 1.60', made: '1904' },
  { n: '03', t: 'Zimmermann', d: 'The carpenter. Flat, 2H core, will not roll off a joist', price: '€ 2.10', made: '1931' },
  { n: '04', t: 'Karton', d: 'The layout pencil. Four grades, thick core, for people who draw fast', price: '€ 3.20', made: '1978' },
  { n: '05', t: 'Neun', d: 'The soft one. 9B only, 5.6 mm core, sold singly and in threes', price: '€ 4.80', made: '2011' },
];

const MAKING = [
  {
    art: reeding,
    n: 'I',
    t: 'Slats',
    d: 'Incense cedar, quarter-sawn, from one forest in California and no other. It is the only wood that sharpens without splintering and it has been the only wood since 1868.',
  },
  {
    art: schist,
    n: 'II',
    t: 'Core',
    d: 'Graphite and clay, milled for sixty hours, extruded and fired at 1 100 °C. The ratio of clay to graphite is the grade, and it is the only thing that makes a 4H a 4H.',
  },
  {
    art: drypoint,
    n: 'III',
    t: 'Glue and cut',
    d: 'Two slats, grooved, glued around the core under a tonne of pressure, then milled into hexagons. A pencil that has been rushed at this stage will break in the sharpener forever after.',
  },
  {
    art: bevelset,
    n: 'IV',
    t: 'Finish',
    d: 'Eight coats on the lacquered lines and none at all on the Zeichner, because a drawing pencil should show its own grain and take a name stamped into the wood.',
  },
];

const SPEC = [
  ['Core diameter', '2.0 mm', 'Zeichner, all grades', 'Extruded'],
  ['Core diameter', '2.2 mm', 'Kontor, Zimmermann', 'Extruded'],
  ['Core diameter', '3.8 mm', 'Karton', 'Extruded'],
  ['Core diameter', '5.6 mm', 'Neun', 'Extruded'],
  ['Length', '175 mm', 'All lines except Zimmermann', 'Before sharpening'],
  ['Length', '245 mm', 'Zimmermann', 'Before sharpening'],
  ['Section', 'Hexagon, 7.4 mm', 'Zeichner, Karton, Neun', 'Across flats'],
  ['Section', 'Round, 7.0 mm', 'Kontor', 'Diameter'],
  ['Section', 'Oval, 12 × 7 mm', 'Zimmermann', 'Across axes'],
  ['Wood', 'Incense cedar', 'All lines', 'FSC, single source'],
  ['Firing', '1 100 °C', 'All cores', '9 hours'],
  ['Milling', '60 hours', 'All cores', 'Wet, ball mill'],
];

const HISTORY = [
  ['1868', 'Founded on the Pegnitz', 'Six workers, one water wheel', 'Zeichner, nine grades'],
  ['1904', 'Kontor introduced', 'The office pencil, ochre lacquer', 'Two lines'],
  ['1919', 'Grades extended to seventeen', 'The range as it stands today', 'Two lines'],
  ['1931', 'Zimmermann introduced', 'For the building trade', 'Three lines'],
  ['1954', 'Recipe changed, first time', 'Clay source moved to Bavaria', 'Three lines'],
  ['1978', 'Karton introduced', 'For studios and layout artists', 'Four lines'],
  ['1993', 'Lacquer changed to water-based', 'The building smelled different for a year', 'Four lines'],
  ['2007', 'Recipe changed, second time', 'Binder reformulated, grades re-matched by hand', 'Four lines'],
  ['2011', 'Neun introduced', 'One grade, 5.6 mm, for charcoal refugees', 'Five lines'],
  ['2024', 'New extruder', 'The first machine replaced since 1978', 'Five lines'],
];

const FACTS = [
  ['17', 'Grades, 9H to 9B'],
  ['1 100°', 'Firing temperature, °C'],
  ['60 h', 'Milling, per batch'],
  ['2', 'Recipe changes since 1868'],
];

const SHOP = [
  ['Singly', 'Any grade, any line, over the counter or by post.'],
  ['By the dozen', 'In the paper sleeve the factory has used since 1919.'],
  ['Seconds', 'Cosmetic faults only, half price, Thursdays, no post.'],
  ['Tours', 'Fridays at 14:00. Closed shoes. It is loud and it is dusty.'],
];

export default function GrafitPage() {
  return (
    <div className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,200..900&display=swap"
      />

      <header className={s.bar}>
        <a className={s.mark} href="#top">Grafit</a>
        <nav aria-label="Sections">
          <a href="#grades">Grades</a>
          <a href="#lines">Lines</a>
          <a href="#making">Making</a>
          <a href="#history">History</a>
        </nav>
        <span className={s.now}>Bleistiftfabrik / Nürnberg</span>
      </header>

      <main id="top">
        {/* ------------------------------------------------------------ HERO */}
        <section className={s.hero}>
          <div className={s.heroField} aria-hidden="true">
            <TabbiedArtwork
              artwork={reeding}
              palette={['transparent', PALE, GREY, OCHRE]}
              fit="grid"
              cellSize={144}
              redrawInterval={6000}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <p className={s.heroKicker}>Pencil works / Nuremberg / since 1868</p>
          <h1 className={s.heroType}>
            <span>Nine H</span>
            <span className={s.ochre}>to nine B.</span>
          </h1>
          <div className={s.heroFoot}>
            <p>
              Seventeen grades, one wood, one graphite, and a recipe we have
              changed twice in a hundred and fifty-eight years.
            </p>
            <a className={s.cta} href="#grades">
              The scale
            </a>
          </div>
        </section>

        {/* ---------------------------------------------------------- GRADES
            Seventeen blocks running the full width of the page, each tinted
            by how dark that grade actually lays down. It is a swatch card,
            and it is also the navigation for everything below. */}
        <section id="grades" className={s.gradeStrip} aria-label="The seventeen grades">
          {GRADES.map(([g, k]) => (
            <div
              key={g}
              className={s.grade}
              style={{ background: `color-mix(in srgb, ${INK} ${k}%, ${PALE})` }}
            >
              <span style={{ color: k > 52 ? '#f2f0ea' : INK }}>{g}</span>
            </div>
          ))}
        </section>

        {/* ------------------------------------------------------- STATEMENT */}
        <section className={s.statement}>
          <p className={s.big}>
            A pencil is clay and graphite in a ratio, wrapped in a wood that
            sharpens cleanly. Everything else — the lacquer, the ferrule, the
            name on the side — is decoration, and we would rather spend the
            money on the clay.
          </p>
          <div className={s.statementMeta}>
            <p>
              Grafit has made pencils on the Pegnitz since 1868. Eighty-one
              people work in the building, the extruder is two years old and the
              mill it feeds is from 1954.
            </p>
            <p>
              Every grade is matched by hand against a reference card that lives
              in a drawer in the laboratory. When the recipe changed in 2007 it
              took eleven months to match all seventeen again.
            </p>
          </div>
        </section>

        {/* ----------------------------------------------------------- FACTS */}
        <section className={s.facts} aria-label="The works in numbers">
          {FACTS.map(([v, k]) => (
            <div key={k}>
              <p className={s.fVal}>{v}</p>
              <p className={s.fKey}>{k}</p>
            </div>
          ))}
        </section>

        {/* ----------------------------------------------------------- LINES */}
        <section id="lines" className={s.lines} aria-labelledby="lines-h">
          <div className={s.secHead}>
            <h2 id="lines-h">Five lines</h2>
            <p>The year is when the line was introduced. None has ever been withdrawn.</p>
          </div>
          <ol className={s.rows}>
            {LINES.map((l) => (
              <li key={l.n}>
                <span className={s.rowN}>{l.n}</span>
                <h3 className={s.rowTitle}>{l.t}</h3>
                <span className={s.rowSub}>{l.d}</span>
                <span className={s.rowYear}>Since {l.made}</span>
                <span className={s.rowPrice}>{l.price}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------------ BAND */}
        <div className={s.band} aria-hidden="true">
          <TabbiedArtwork
            artwork={louvre}
            palette={['transparent', OCHRE, PALE, GREY]}
            fit="grid"
            cellSize={112}
            redrawInterval={4200}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>

        {/* ---------------------------------------------------------- MAKING */}
        <section id="making" className={s.making} aria-labelledby="making-h">
          <div className={s.secHead}>
            <h2 id="making-h">Four operations</h2>
            <p>Slats, core, glue, finish. Nine days from cedar board to a pencil in a sleeve.</p>
          </div>
          <div className={s.mGrid}>
            {MAKING.map((m) => (
              <article key={m.n}>
                <div className={s.mPlate} aria-hidden="true">
                  <TabbiedArtwork
                    artwork={m.art}
                    palette={['transparent', GREY, OCHRE]}
                    fit="grid"
                    cellSize={58}
                    redrawInterval={5400}
                    style={{ position: 'absolute', inset: 0 }}
                  />
                </div>
                <p className={s.mN}>{m.n}</p>
                <h3>{m.t}</h3>
                <p className={s.mBody}>{m.d}</p>
              </article>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------------- THE SPEC */}
        <section id="spec" className={s.listing} aria-labelledby="spec-h">
          <div className={s.secHead}>
            <h2 id="spec-h">Dimensions, published</h2>
            <p>The whole specification. If a pencil of ours is out by more than a tenth, send it back.</p>
          </div>
          <ol className={s.table}>
            {SPEC.map((r, i) => (
              <li key={i}>
                <span className={s.tKey}>{r[0]}</span>
                <span className={s.tMain}>{r[1]}</span>
                <span className={s.tMid}>{r[2]}</span>
                <span className={s.tEnd}>{r[3]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------- QUOTE BAND */}
        <section className={s.quote}>
          <div className={s.quoteField} aria-hidden="true">
            <TabbiedArtwork
              artwork={charcoal}
              palette={['transparent', OCHRE, GREY]}
              fit="grid"
              cellSize={122}
              redrawInterval={4600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <blockquote>
            <p>Nobody has ever asked us for a harder pencil. They ask for a blacker one, and then they buy an H.</p>
            <cite>Renate Föhr, laboratory</cite>
          </blockquote>
        </section>

        {/* --------------------------------------------------------- HISTORY */}
        <section id="history" className={s.listing} aria-labelledby="hist-h">
          <div className={s.secHead}>
            <h2 id="hist-h">A hundred and fifty-eight years</h2>
            <p>Everything that changed. It is a short list on purpose.</p>
          </div>
          <ol className={s.table}>
            {HISTORY.map((r) => (
              <li key={r[0]}>
                <span className={s.tKey}>{r[0]}</span>
                <span className={s.tMain}>{r[1]}</span>
                <span className={s.tMid}>{r[2]}</span>
                <span className={s.tEnd}>{r[3]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------------ SHOP */}
        <section id="shop" className={s.shop} aria-labelledby="shop-h">
          <div className={s.shopField} aria-hidden="true">
            <TabbiedArtwork
              artwork={nosing}
              palette={['transparent', GREY, PALE]}
              fit="grid"
              cellSize={106}
              redrawInterval={6400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.shopInner}>
            <h2 id="shop-h">The factory shop</h2>
            <dl className={s.shopList}>
              {SHOP.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* --------------------------------------------------------- CONTACT */}
        <section className={s.contact}>
          <p className={s.contactPre}>Orders, grades, complaints about a 6B</p>
          <a className={s.contactMail} href="mailto:kern@grafit.example">
            kern@grafit.example
          </a>
          <p className={s.contactFine}>
            Pegnitzstrasse 22, 90429 Nürnberg. The shop is open Tuesday to
            Friday; the works are shut for two weeks in August.
          </p>
        </section>
      </main>

      <div className={s.coda} aria-hidden="true">
        <TabbiedArtwork
          artwork={kerf}
          palette={['transparent', PALE, OCHRE, GREY]}
          fit="grid"
          cellSize={100}
          redrawInterval={5000}
          style={{ position: 'absolute', inset: 0 }}
        />
      </div>

      <footer className={s.footer}>
        <p className={s.footMark}>9B</p>
        <div className={s.footGrid}>
          <div>
            <h2>Product</h2>
            <ul>
              <li><a href="#grades">Seventeen grades</a></li>
              <li><a href="#lines">Five lines</a></li>
              <li><a href="#spec">Dimensions</a></li>
            </ul>
          </div>
          <div>
            <h2>Works</h2>
            <ul>
              <li><a href="#making">Four operations</a></li>
              <li><a href="#history">History</a></li>
              <li><a href="#shop">Factory shop</a></li>
            </ul>
          </div>
          <div>
            <h2>Here</h2>
            <p>
              Pegnitzstrasse 22
              <br />
              90429 Nürnberg
              <br />
              kern@grafit.example
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p>A fictional pencil factory. Grades, prices and dates are invented.</p>
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
