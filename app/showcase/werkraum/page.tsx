import { TabbiedArtwork } from 'tabbied/react';
import {
  ortho, windowpane, keyway, subdivide, gravure, mortise, chase, quire,
} from 'tabbied/artworks';
import { Figure } from 'components/Figure';
import s from './werkraum.module.css';

export const metadata = {
  title: 'Werkraum: Architektur, Basel',
  description:
    'Werkraum is an architecture practice in Basel. Eleven people, one room, forty-two built projects since 2009. Housing, schools, and the occasional bridge.',
};

/* Site colours. Every pattern field draws its inks from this set; the
   background slot is always `transparent`, so the pattern sits *in* the page
   colour rather than on a plate of its own. */
const INK = '#16161A';
const RED = '#D6001C';
const GREY = '#8E8E88';
const PALE = '#C9C8C1';

const NAV = [
  ['01', 'Practice', '#practice'],
  ['02', 'Work', '#work'],
  ['03', 'Method', '#method'],
  ['04', 'People', '#people'],
  ['05', 'Materials', '#materials'],
  ['06', 'Awards', '#awards'],
  ['07', 'Office', '#office'],
];

type Project = {
  no: string;
  name: string;
  place: string;
  programme: string;
  year: string;
  area: string;
  status: string;
};

const WORK: Project[] = [
  { no: '42', name: 'Wohnhaus Sperrstrasse', place: 'Basel', programme: 'Housing, 24 units', year: '2026', area: '3,180 m²', status: 'On site' },
  { no: '41', name: 'Primarschule Rüti', place: 'Rüti ZH', programme: 'Primary school', year: '2025', area: '5,940 m²', status: 'Built' },
  { no: '39', name: 'Werkhof Kleinhüningen', place: 'Basel', programme: 'Depot and workshops', year: '2025', area: '2,410 m²', status: 'Built' },
  { no: '37', name: 'Steg über die Birs', place: 'Münchenstein', programme: 'Footbridge, 46 m span', year: '2024', area: '46 m', status: 'Built' },
  { no: '35', name: 'Umbau Haus Vogelsang', place: 'Riehen', programme: 'Conversion, single house', year: '2024', area: '260 m²', status: 'Built' },
  { no: '33', name: 'Genossenschaft Feldrain', place: 'Bern', programme: 'Housing, 61 units', year: '2023', area: '7,720 m²', status: 'Built' },
  { no: '31', name: 'Bibliothek Aarwangen', place: 'Aarwangen', programme: 'Library and archive', year: '2022', area: '1,860 m²', status: 'Built' },
  { no: '28', name: 'Atelierhaus Klybeck', place: 'Basel', programme: 'Studios, 14 units', year: '2021', area: '2,090 m²', status: 'Built' },
];

const METHOD = [
  {
    no: '3.1',
    title: 'One room, one conversation',
    body: 'Everyone works in the same room, at the same long table, on the same drawings. Nothing is presented internally, because nothing was ever hidden.',
  },
  {
    no: '3.2',
    title: 'Draw at 1:20 early',
    body: 'The junction decides the building. We draw the wall build-up in the second week, not the second year, and the plan follows what the wall turned out to want.',
  },
  {
    no: '3.3',
    title: 'Build what the trade knows',
    body: 'A detail no local carpenter has done before costs twice and lasts half. We invent where it matters and borrow everywhere else.',
  },
  {
    no: '3.4',
    title: 'Leave the structure visible',
    body: 'If a slab is doing work, it may as well be seen doing it. Fewer linings, fewer layers, fewer things to go wrong in year fifteen.',
  },
];

const PEOPLE = [
  ['Ines Rüegg', 'Partner, dipl. Arch ETH SIA', '2009'],
  ['Marek Haldemann', 'Partner, dipl. Arch ETH SIA', '2009'],
  ['Sofia Brenner', 'Associate, project lead', '2014'],
  ['Tobias Wyss', 'Associate, construction', '2016'],
  ['Nour Haddad', 'Architect', '2019'],
  ['Lena Fankhauser', 'Architect', '2020'],
  ['Cyril Aebi', 'Architect', '2021'],
  ['Marta Oliveira', 'Architect', '2022'],
  ['Jonas Sieber', 'Draughtsman', '2022'],
  ['Ruth Bächtold', 'Office manager', '2011'],
  ['Emil Stucki', 'Model shop', '2018'],
];

const MATERIALS = [
  { n: 'A', name: 'Fair-faced concrete', art: 'chase', body: 'Board-marked where it is touched, plain where it is not. We draw the tie grid ourselves and it is always on the drawing before tender.' },
  { n: 'B', name: 'Untreated timber', art: 'mortise', body: 'Silver-fir cladding, left to grey. Clients are shown a five-year-old sample and asked to agree to it in writing.' },
  { n: 'C', name: 'Screed and terrazzo', art: 'quire', body: 'Poured on site, ground twice. The aggregate comes from within forty kilometres, which is a constraint and also the whole idea.' },
];

const AWARDS = [
  ['2026', 'Auszeichnung guter Bauten beider Basel', 'Wohnhaus Sperrstrasse', 'Shortlist'],
  ['2025', 'Prix Lignum, Region Mitte', 'Primarschule Rüti', 'Second prize'],
  ['2025', 'Open competition, Schulhaus Aarwangen', 'Aarwangen', 'Won, in progress'],
  ['2024', 'Best Architects 25', 'Steg über die Birs', 'Selected'],
  ['2023', 'Open competition, Genossenschaft Feldrain', 'Bern', 'Won, built'],
  ['2022', 'Swiss Timber Prize', 'Atelierhaus Klybeck', 'Nominated'],
];

const QUESTIONS = [
  { q: 'Do you work outside Switzerland?', a: 'No. Everything is built with people we can visit on a Tuesday, and the furthest site from this desk is one hundred and sixty kilometres.' },
  { q: 'Will you do a house?', a: 'Sometimes. We take one or two a year, usually a conversion, and we are honest that a small house costs proportionally more of our time than a block of twenty-four flats.' },
  { q: 'How much does a competition entry cost you?', a: 'About six weeks of one person, which is why we enter four a year rather than fifteen. We would rather lose slowly than badly.' },
  { q: 'Who draws the details?', a: 'Whoever is running the project, at the same table as everyone else. There is no separate technical department and there never will be.' },
];

const FACTS = [
  ['42', 'Built projects'],
  ['11', 'People'],
  ['17', 'Years'],
  ['1', 'Room'],
];

export default function WerkraumPage() {
  return (
    <div className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..800&display=swap"
      />

      <header className={s.bar}>
        <a className={s.mark} href="#top">
          Werkraum
        </a>
        <nav className={s.nav} aria-label="Sections">
          {NAV.map(([no, label, href]) => (
            <a key={href} href={href}>
              <span>{no}</span>
              {label}
            </a>
          ))}
        </nav>
        <span className={s.barMeta}>Basel</span>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div className={s.field} aria-hidden="true">
            <TabbiedArtwork
              artwork={ortho}
              palette={['transparent', PALE, GREY]}
              fit="grid"
              cellSize={132}
              redrawInterval={5200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroGrid}>
            <p className={s.heroTag}>Architektur / Basel / seit 2009</p>
            <h1 className={s.heroTitle}>
              We draw buildings that
              <br />
              are easy to build and
              <br />
              <em>hard to throw away.</em>
            </h1>
            <p className={s.heroLede}>
              Werkraum is eleven people in one room on Klybeckstrasse. Housing,
              schools, workshops, one footbridge. We take on six projects a year
              and finish them.
            </p>
            <dl className={s.facts}>
              {FACTS.map(([v, k]) => (
                <div key={k}>
                  <dt>{v}</dt>
                  <dd>{k}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* The one full-bleed photograph on the page, held to a letterbox so it
            reads as a plate between two pattern fields rather than as a hero. */}
        <figure className={s.plate}>
          <Figure
            slug="werkraum-hero"
            alt="A concrete housing block with deep window reveals under an overcast sky"
            priority
          />
          <figcaption>
            42 / Wohnhaus Sperrstrasse, Basel. On site, completion autumn 2026.
          </figcaption>
        </figure>

        {/* ------------------------------------------------------ PRACTICE */}
        <section id="practice" className={s.practice} aria-labelledby="practice-h">
          <div className={s.rail}>
            <span>01</span>
            <span className={s.railRule} aria-hidden="true" />
          </div>
          <div className={s.practiceBody}>
            <h2 id="practice-h">The practice</h2>
            <div className={s.twoCol}>
              <p className={s.lead}>
                We were two people and a borrowed plotter in 2009. The plotter
                is still here. So is the habit of drawing every project at full
                size before anybody talks about a facade.
              </p>
              <p>
                The office takes work in three sizes: a house, a block, and a
                building the town has to live with. We do not chase competitions
                we would not want to win, which means we enter about four a
                year and lose most of them cheerfully.
              </p>
              <p>
                Everything is built in Switzerland with people we can visit on a
                Tuesday. The furthest site from this desk is one hundred and
                sixty kilometres, and we would rather it stayed that way.
              </p>
            </div>
            <div className={s.pair}>
              <figure>
                <Figure
                  slug="werkraum-room"
                  alt="A long studio table under north light with rolled drawings and cardboard models"
                />
                <figcaption>The room, Tuesday, half past nine.</figcaption>
              </figure>
              <figure>
                <Figure
                  slug="werkraum-model"
                  alt="A grey cardboard massing model of six housing blocks on a plywood base"
                />
                <figcaption>Massing study, 1:500, Feldrain.</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- BAND / WORK */}
        <section className={s.band} aria-hidden="true">
          <div className={s.bandField}>
            <TabbiedArtwork
              artwork={windowpane}
              palette={['transparent', INK, RED, GREY]}
              fit="grid"
              cellSize={144}
              redrawInterval={4400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        <section id="work" className={s.work} aria-labelledby="work-h">
          <div className={s.rail}>
            <span>02</span>
            <span className={s.railRule} aria-hidden="true" />
          </div>
          <div className={s.workBody}>
            <h2 id="work-h">Selected work</h2>
            <p className={s.workNote}>
              Forty-two built projects. Eight shown, newest first. Numbering runs
              in the order jobs were opened, which is why it skips.
            </p>
            <ol className={s.table}>
              <li className={s.tableHead} aria-hidden="true">
                <span>No.</span>
                <span>Project</span>
                <span>Place</span>
                <span>Programme</span>
                <span>Area</span>
                <span>Year</span>
              </li>
              {WORK.map((p) => (
                <li key={p.no} className={s.row}>
                  <span className={s.rowNo}>{p.no}</span>
                  <span className={s.rowName}>
                    {p.name}
                    <i className={p.status === 'On site' ? s.live : undefined}>
                      {p.status}
                    </i>
                  </span>
                  <span>{p.place}</span>
                  <span>{p.programme}</span>
                  <span className={s.num}>{p.area}</span>
                  <span className={s.num}>{p.year}</span>
                </li>
              ))}
            </ol>
            <div className={s.trio}>
              <figure>
                <Figure
                  slug="werkraum-school"
                  alt="A school courtyard with a concrete colonnade and pale timber soffits"
                />
                <figcaption>41 / Primarschule Rüti</figcaption>
              </figure>
              <figure>
                <Figure
                  slug="werkraum-bridge"
                  alt="A slender steel footbridge crossing a river between bare trees"
                />
                <figcaption>37 / Steg über die Birs</figcaption>
              </figure>
              <figure>
                <Figure
                  slug="werkraum-detail"
                  alt="A close view of a timber-to-concrete junction left visible on a facade"
                />
                <figcaption>39 / Werkhof, junction at 1:20</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- METHOD */}
        <section id="method" className={s.method} aria-labelledby="method-h">
          <div className={s.methodField} aria-hidden="true">
            <TabbiedArtwork
              artwork={keyway}
              palette={['transparent', GREY, PALE]}
              fit="grid"
              cellSize={104}
              redrawInterval={6100}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.methodInner}>
            <div className={s.rail}>
              <span>03</span>
              <span className={s.railRule} aria-hidden="true" />
            </div>
            <div>
              <h2 id="method-h">Four working rules</h2>
              <div className={s.methodGrid}>
                {METHOD.map((m) => (
                  <article key={m.no}>
                    <p className={s.mNo}>{m.no}</p>
                    <h3>{m.title}</h3>
                    <p>{m.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- PEOPLE */}
        <section id="people" className={s.people} aria-labelledby="people-h">
          <div className={s.rail}>
            <span>04</span>
            <span className={s.railRule} aria-hidden="true" />
          </div>
          <div className={s.peopleBody}>
            <h2 id="people-h">Eleven people</h2>
            <ul className={s.peopleList}>
              {PEOPLE.map(([name, role, since]) => (
                <li key={name}>
                  <span className={s.pName}>{name}</span>
                  <span className={s.pRole}>{role}</span>
                  <span className={s.pSince}>{since}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ----------------------------------------------------- MATERIALS */}
        <section id="materials" className={s.materials} aria-labelledby="materials-h">
          <div className={s.rail}>
            <span>05</span>
            <span className={s.railRule} aria-hidden="true" />
          </div>
          <div className={s.materialsBody}>
            <h2 id="materials-h">Three materials, mostly</h2>
            <p className={s.workNote}>
              A short palette is not a style. It is what happens when the same
              eleven people specify the same things for seventeen years and get
              better at them.
            </p>
            <div className={s.matGrid}>
              {MATERIALS.map((m) => (
                <article key={m.n}>
                  {/* The decorative plate: a Tabbied artwork on a transparent
                      ground, standing in for a material sample. */}
                  <div className={s.matTile} aria-hidden="true">
                    <TabbiedArtwork
                      artwork={m.art === 'chase' ? chase : m.art === 'mortise' ? mortise : quire}
                      palette={['transparent', GREY, PALE]}
                      fit="grid"
                      cellSize={72}
                      redrawInterval={5600}
                      style={{ position: 'absolute', inset: 0 }}
                    />
                  </div>
                  <p className={s.matN}>{m.n}</p>
                  <h3>{m.name}</h3>
                  <p className={s.matBody}>{m.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- AWARDS */}
        <section id="awards" className={s.awards} aria-labelledby="awards-h">
          <div className={s.rail}>
            <span>06</span>
            <span className={s.railRule} aria-hidden="true" />
          </div>
          <div className={s.awardsBody}>
            <h2 id="awards-h">Competitions and prizes</h2>
            <ol className={s.awardList}>
              {AWARDS.map(([year, what, where, result]) => (
                <li key={`${year}-${what}`}>
                  <span className={s.aYear}>{year}</span>
                  <span className={s.aWhat}>{what}</span>
                  <span className={s.aWhere}>{where}</span>
                  <span className={result.startsWith('Won') ? s.aWon : s.aResult}>
                    {result}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ------------------------------------------------------ QUESTIONS */}
        <section id="questions" className={s.questions} aria-labelledby="questions-h">
          <div className={s.rail}>
            <span>07</span>
            <span className={s.railRule} aria-hidden="true" />
          </div>
          <div className={s.questionsBody}>
            <h2 id="questions-h">Four questions we get</h2>
            <dl className={s.qList}>
              {QUESTIONS.map((x) => (
                <div key={x.q}>
                  <dt>{x.q}</dt>
                  <dd>{x.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* -------------------------------------------------------- OFFICE */}
        <section id="office" className={s.office} aria-labelledby="office-h">
          <div className={s.officeField} aria-hidden="true">
            <TabbiedArtwork
              artwork={subdivide}
              palette={['transparent', RED, INK]}
              fit="grid"
              cellSize={190}
              redrawInterval={5000}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.officeInner}>
            <div className={s.rail}>
              <span>08</span>
              <span className={s.railRule} aria-hidden="true" />
            </div>
            <div className={s.officeGrid}>
              <div>
                <h2 id="office-h">Klybeckstrasse 191</h2>
                <p className={s.officeLead}>
                  Ground floor, courtyard side. Model shop at the back, plotter
                  by the window, the good coffee on the shelf nobody can reach.
                </p>
              </div>
              <dl className={s.contact}>
                <div>
                  <dt>Post</dt>
                  <dd>
                    Klybeckstrasse 191
                    <br />
                    4057 Basel
                  </dd>
                </div>
                <div>
                  <dt>Write</dt>
                  <dd>
                    <a href="mailto:buero@werkraum.example">buero@werkraum.example</a>
                  </dd>
                </div>
                <div>
                  <dt>Call</dt>
                  <dd>+41 61 000 00 00</dd>
                </div>
                <div>
                  <dt>Open</dt>
                  <dd>Mon to Thu, 09.00 to 17.00</dd>
                </div>
              </dl>
            </div>
            <p className={s.officeApply}>
              We read every application. Portfolios as one PDF under 10 MB, to
              the address above, any time of year.
            </p>
          </div>
        </section>
      </main>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p className={s.footName}>Werkraum</p>
            <p className={s.footTag}>An architecture practice at Klybeckstrasse 191, Basel, since 2009.</p>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Practice</h2>
            <ul className={s.footLinks}>
              <li>
                <a href="#work">Selected work</a>
              </li>
              <li>
                <a href="#method">Working rules</a>
              </li>
              <li>
                <a href="#people">Eleven people</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Office</h2>
            <ul className={s.footLinks}>
              <li>
                <a href="#office">Klybeckstrasse 191</a>
              </li>
              <li>
                <a href="#office">Applications</a>
              </li>
              <li>
                <a href="#practice">About the practice</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Contact</h2>
            <p className={s.footAddr}>
              Klybeckstrasse 191
              <br />
              4057 Basel
              <br />
              buero@werkraum.example
              <br />
              +41 61 000 00 00
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p>A fictional architecture practice. Prices and times are invented.</p>
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
