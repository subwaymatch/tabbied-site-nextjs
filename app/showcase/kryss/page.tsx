import { TabbiedArtwork } from 'tabbied/react';
import { caltrop, metro, bothways, trigram, staple } from 'tabbied/artworks';
import { Figure } from 'components/Figure';
import s from './kryss.module.css';

export const metadata = {
  title: 'Kryss: Wayfinding, Oslo',
  description:
    'Kryss designs wayfinding for stations, hospitals and campuses. Decision points, plain names, and signs we test by asking strangers to find things.',
};

/* Paper, ink, one directional green. Every field takes `transparent` in the
   background slot, so the concourse colour of the page runs through them. */
const INK = '#131416';
const GREEN = '#00843D';
const GREY = '#8E9094';
const PALE = '#E2E2DE';

const PROJECTS = [
  { code: 'K-46', client: 'Bergen Sentralstasjon', kind: 'Rail interchange', pts: '212', year: '2026' },
  { code: 'K-42', client: 'Ullevål sykehus', kind: 'Hospital campus', pts: '486', year: '2025' },
  { code: 'K-38', client: 'Universitetet i Tromsø', kind: 'Campus', pts: '304', year: '2024' },
  { code: 'K-33', client: 'Trondheim Havn', kind: 'Port terminal', pts: '96', year: '2024' },
  { code: 'K-27', client: 'Oslo Rådhus', kind: 'Civic building', pts: '58', year: '2022' },
];

const METHOD = [
  { n: '01', t: 'Walk it as a stranger', d: 'Before anything is drawn, we walk the building the way a first-time visitor does: from the wrong entrance, in a hurry, carrying something.' },
  { n: '02', t: 'Find the decision points', d: 'A sign is only useful where a person has to choose. We map every fork in the building, count them, and then remove the signs that are not at one.' },
  { n: '03', t: 'Say what the place is called', d: 'Not what the department is called on the org chart. If everyone calls it the old wing, the sign says the old wing.' },
  { n: '04', t: 'Test with strangers', d: 'Twelve people who have never been in the building, given a destination and a stopwatch. We publish the failure rate to the client, including the embarrassing one.' },
];

const NUMBERS = [
  ['46', 'Schemes since 2011'],
  ['1 156', 'Decision points mapped'],
  ['12', 'Testers per scheme'],
  ['1', 'Type size on a fingerpost'],
];

export default function KryssPage() {
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
          <span className={s.arrow} aria-hidden="true" />
          Kryss
        </a>
        <nav aria-label="Sections">
          <a href="#method">Method</a>
          <a href="#work">Work</a>
          <a href="#testing">Testing</a>
          <a href="#studio">Studio</a>
        </nav>
        <span className={s.tag}>Skiltdesign / Oslo</span>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div className={s.heroField} aria-hidden="true">
            <TabbiedArtwork
              artwork={caltrop}
              palette={['transparent', PALE, GREY]}
              fit="grid"
              cellSize={130}
              redrawInterval={4600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <p className={s.eyebrow}>Wayfinding / Oslo / siden 2011</p>
            <h1>
              A sign is only
              <br />
              useful where
              <br />
              <span>somebody chooses.</span>
            </h1>
            <p className={s.lede}>
              We map every fork in a building, name things the way people
              already name them, and then hand a stranger a stopwatch.
            </p>
          </div>
        </section>

        <figure className={s.bleed}>
          <Figure
            slug="kryss-sign"
            alt="A large suspended wayfinding sign panel in a bright station concourse seen straight on"
            priority
          />
          <figcaption>K-46, concourse level. One panel, four destinations, no logos.</figcaption>
        </figure>

        <dl className={s.numbers}>
          {NUMBERS.map(([v, k]) => (
            <div key={k}>
              <dt>{v}</dt>
              <dd>{k}</dd>
            </div>
          ))}
        </dl>

        {/* --------------------------------------------------------- METHOD */}
        <section id="method" className={s.method} aria-labelledby="method-h">
          <h2 className={s.h2} id="method-h">
            Four steps
          </h2>
          <ol className={s.methodList}>
            {METHOD.map((m) => (
              <li key={m.n}>
                <span className={s.mN}>{m.n}</span>
                <div>
                  <h3>{m.t}</h3>
                  <p>{m.d}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className={s.pair}>
            <figure>
              <Figure
                slug="kryss-totem"
                alt="A tall freestanding sign totem outdoors on a paved plaza under overcast light"
              />
              <figcaption>Totem, K-42. Read at 30 m, 12 m and 2 m, in that order.</figcaption>
            </figure>
            <figure>
              <Figure
                slug="kryss-model"
                alt="A small scale model of a station concourse with miniature sign panels"
              />
              <figcaption>1:100. Cheaper than being wrong at full size.</figcaption>
            </figure>
          </div>
        </section>

        {/* ---------------------------------------------------- ROUTE BAND */}
        <section className={s.routeBand} aria-hidden="true">
          <div className={s.routeField}>
            <TabbiedArtwork
              artwork={metro}
              palette={['transparent', GREEN, INK, GREY]}
              fit="grid"
              cellSize={96}
              redrawInterval={3200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* ----------------------------------------------------------- WORK */}
        <section id="work" className={s.work} aria-labelledby="work-h">
          <div className={s.workField} aria-hidden="true">
            <TabbiedArtwork
              artwork={bothways}
              palette={['transparent', GREY, PALE]}
              fit="grid"
              cellSize={112}
              redrawInterval={5600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.workInner}>
            <h2 className={s.h2} id="work-h">
              Recent schemes
            </h2>
            <ol className={s.table}>
              <li className={s.thead} aria-hidden="true">
                <span>Job</span>
                <span>Client</span>
                <span>Type</span>
                <span>Decision points</span>
                <span>Year</span>
              </li>
              {PROJECTS.map((p) => (
                <li key={p.code}>
                  <span className={s.code}>{p.code}</span>
                  <span className={s.client}>{p.client}</span>
                  <span className={s.kind}>{p.kind}</span>
                  <span className={s.pts}>{p.pts}</span>
                  <span className={s.year}>{p.year}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* -------------------------------------------------------- TESTING */}
        <section id="testing" className={s.testing} aria-labelledby="testing-h">
          <h2 className={s.h2} id="testing-h">
            Testing
          </h2>
          <div className={s.testGrid}>
            <p className={s.big}>
              Twelve strangers, one destination each, one stopwatch. If more than
              two of them stop and look around, the sign is in the wrong place
              and we move it before anyone signs off.
            </p>
            <div className={s.testCol}>
              <p>
                The report goes to the client with the failure rate on the first
                page, not in an appendix. In eleven of forty-six schemes the
                first round failed, and saying so is the entire value of doing
                it.
              </p>
              <p>
                We test again after installation, with different people, in the
                weather the building actually gets. Signs that work in June and
                fail in a January afternoon are a real category.
              </p>
            </div>
          </div>
          <figure className={s.wide}>
            <Figure
              slug="kryss-floor"
              alt="A painted green directional stripe running across a pale concrete floor"
            />
            <figcaption>K-33. When the ceiling is too high to hang from, use the floor.</figcaption>
          </figure>
        </section>

        {/* --------------------------------------------------------- STUDIO */}
        <section id="studio" className={s.studio} aria-labelledby="studio-h">
          <div className={s.studioField} aria-hidden="true">
            <TabbiedArtwork
              artwork={trigram}
              palette={['transparent', GREEN, GREY]}
              fit="grid"
              cellSize={88}
              redrawInterval={4200}
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
                  Youngstorget 3
                  <br />
                  0181 Oslo
                </dd>
              </div>
              <div>
                <dt>Write</dt>
                <dd>
                  <a href="mailto:skilt@kryss.example">skilt@kryss.example</a>
                </dd>
              </div>
              <div>
                <dt>Engage us</dt>
                <dd>At plan stage. Signs cannot fix a corridor that lies.</dd>
              </div>
              <div>
                <dt>Team</dt>
                <dd>Seven, of whom two are always on site somewhere</dd>
              </div>
            </dl>
          </div>
        </section>
      </main>

      <footer className={s.footer}>
        <div className={s.footField} aria-hidden="true">
          <TabbiedArtwork
            artwork={staple}
            palette={['transparent', GREEN, GREY]}
            fit="grid"
            cellSize={72}
            redrawInterval={6600}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
        <div className={s.footInner}>
          <p className={s.footMark}>Kryss</p>
          <p className={s.footFine}>
            A fictional wayfinding studio. Every pattern is a live{' '}
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
