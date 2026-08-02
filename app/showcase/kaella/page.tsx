import { TabbiedArtwork } from 'tabbied/react';
import { ripplering, tidering, lagoon, dotwash, curl } from 'tabbied/artworks';
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
              cellSize={104}
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
      </main>

      <footer className={s.footer}>
        <div className={s.footField} aria-hidden="true">
          <TabbiedArtwork
            artwork={curl}
            palette={['transparent', AQUA, STEEL]}
            fit="grid"
            cellSize={100}
            redrawInterval={6400}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
        <div className={s.footInner}>
          <p className={s.footMark}>Källa</p>
          <p className={s.footFine}>
            A fictional water utility. Every pattern is a live{' '}
            <a href="https://tabbied.com" rel="noopener">
              Tabbied
            </a>{' '}
            artwork on a transparent ground, redrawn on a timer. © 2026.
          </p>
        </div>
      </footer>
    </div>
  );
}
