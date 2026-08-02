import { TabbiedArtwork } from 'tabbied/react';
import { terrain, epicentre, northstar, maze, dipole } from 'tabbied/artworks';
import { Figure } from 'components/Figure';
import s from './nordlicht.module.css';

export const metadata = {
  title: 'Nordlicht: Kartografie und Vermessung',
  description:
    'Nordlicht is a cartography and survey office in Tromsø. Terrain models, coastal charts, and field survey above 69° north since 1998.',
};

/* Four inks and the paper. Pattern fields take the background slot as
   `transparent`, so every field is drawn *in* the page, not on it. */
const INK = '#0E1116';
const BLUE = '#1B4DFF';
const STEEL = '#8A9098';
const PALE = '#C3CBD4';

const NAV = ['Survey', 'Charts', 'Terrain', 'Field', 'Office'];

const SHEETS = [
  { id: 'N-114', name: 'Kvaløya, north coast', scale: '1:25 000', proj: 'ETRS89 / UTM 34N', issue: '4th', year: '2026' },
  { id: 'N-108', name: 'Lyngen, glacier margins', scale: '1:15 000', proj: 'ETRS89 / UTM 34N', issue: '2nd', year: '2025' },
  { id: 'N-097', name: 'Tromsøysundet approaches', scale: '1:10 000', proj: 'ETRS89 / UTM 33N', issue: '7th', year: '2025' },
  { id: 'N-091', name: 'Senja, western fjords', scale: '1:50 000', proj: 'ETRS89 / UTM 33N', issue: '3rd', year: '2024' },
  { id: 'N-083', name: 'Balsfjord, valley floor', scale: '1:25 000', proj: 'ETRS89 / UTM 34N', issue: '5th', year: '2024' },
  { id: 'N-076', name: 'Ringvassøya interior', scale: '1:50 000', proj: 'ETRS89 / UTM 34N', issue: '2nd', year: '2023' },
];

const SERVICES = [
  {
    k: 'A',
    title: 'Control and levelling',
    body: 'Primary and secondary control networks, precise levelling, deformation monitoring on dams and quays. Adjusted in-house, reported with the residuals attached.',
    unit: '±2 mm / km',
  },
  {
    k: 'B',
    title: 'Airborne and terrestrial lidar',
    body: 'Point clouds at 40 to 400 points per square metre, classified and delivered as LAZ with a terrain model on top. We fly our own missions between March and October.',
    unit: '400 pt/m²',
  },
  {
    k: 'C',
    title: 'Hydrographic survey',
    body: 'Multibeam bathymetry to IHO Special Order in sheltered water, Order 1a offshore. Tide-reduced against our own gauges, not the nearest port.',
    unit: 'IHO S-44',
  },
  {
    k: 'D',
    title: 'Cartographic production',
    body: 'Everything above turned into a sheet somebody can fold in a wind. Colour, hierarchy and generalisation are decided by a cartographer, not a default style.',
    unit: '6 colours',
  },
];

const FIELD = [
  ['69°40′ N', '18°57′ E', 'Tromsø, office and store'],
  ['69°47′ N', '18°38′ E', 'Kvaløya, control pillar KV-2'],
  ['69°35′ N', '20°12′ E', 'Lyngen, glacier stakes'],
  ['69°22′ N', '17°25′ E', 'Senja, tide gauge SE-1'],
  ['70°04′ N', '19°02′ E', 'Ringvassøya, GNSS base'],
];

export default function NordlichtPage() {
  return (
    <div className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..700&display=swap"
      />

      <header className={s.top}>
        <a className={s.brand} href="#top">
          Nordlicht
          <span>Kartografi &amp; Oppmåling</span>
        </a>
        <nav aria-label="Sections">
          {NAV.map((n) => (
            <a key={n} href={`#${n.toLowerCase()}`}>
              {n}
            </a>
          ))}
        </nav>
      </header>

      {/* The page is ruled like a sheet: a fixed graticule of hairlines runs
          the full height behind everything, and every section lands on it. */}
      <div className={s.graticule} aria-hidden="true" />

      <main id="top">
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div className={s.heroField} aria-hidden="true">
            <TabbiedArtwork
              artwork={terrain}
              palette={['transparent', STEEL, PALE, BLUE]}
              fit="grid"
              cellSize={220}
              redrawInterval={6500}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <p className={s.coords}>69°38′55″ N &nbsp; 18°57′10″ E &nbsp; / &nbsp; est. 1998</p>
          <h1>
            We measure the coast
            <br />
            and draw what is
            <br />
            actually there.
          </h1>
          <p className={s.lede}>
            A survey and cartography office in Tromsø. Six people, two boats,
            one plotter that has never once jammed on a Friday.
          </p>
          <ul className={s.ticker}>
            <li>
              <b>114</b> sheets published
            </li>
            <li>
              <b>28</b> years above the Arctic Circle
            </li>
            <li>
              <b>6</b> cartographers and surveyors
            </li>
            <li>
              <b>2</b> survey vessels
            </li>
          </ul>
        </section>

        <figure className={s.wide}>
          <Figure
            slug="nordlicht-coast"
            alt="An aerial view of an Arctic coastline, pale water and dark rock under flat light"
            priority
          />
          <figcaption>Kvaløya, north coast. Flown 04.06.2025, 1,200 m AGL.</figcaption>
        </figure>

        {/* -------------------------------------------------------- SURVEY */}
        <section id="survey" className={s.survey} aria-labelledby="survey-h">
          <div className={s.secHead}>
            <span className={s.secNo}>01</span>
            <h2 id="survey-h">What we do, in four parts</h2>
          </div>
          <div className={s.services}>
            {SERVICES.map((x) => (
              <article key={x.k}>
                <p className={s.sKey}>{x.k}</p>
                <h3>{x.title}</h3>
                <p className={s.sBody}>{x.body}</p>
                <p className={s.sUnit}>{x.unit}</p>
              </article>
            ))}
          </div>
        </section>

        {/* --------------------------------------------------- BAND / CHARTS */}
        <section className={s.rule} aria-hidden="true">
          <div className={s.ruleField}>
            <TabbiedArtwork
              artwork={epicentre}
              palette={['transparent', BLUE, INK, STEEL]}
              fit="grid"
              cellSize={104}
              redrawInterval={3800}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        <section id="charts" className={s.charts} aria-labelledby="charts-h">
          <div className={s.secHead}>
            <span className={s.secNo}>02</span>
            <h2 id="charts-h">Published sheets</h2>
          </div>
          <p className={s.note}>
            Sold at the office and by six chandlers along the coast. Every sheet
            carries its survey date on the reverse; we do not reprint without
            resurveying.
          </p>
          <table className={s.sheets}>
            <thead>
              <tr>
                <th>Sheet</th>
                <th>Area</th>
                <th>Scale</th>
                <th>Projection</th>
                <th>Ed.</th>
                <th>Year</th>
              </tr>
            </thead>
            <tbody>
              {SHEETS.map((x) => (
                <tr key={x.id}>
                  <td className={s.mono}>{x.id}</td>
                  <td className={s.sheetName}>{x.name}</td>
                  <td className={s.mono}>{x.scale}</td>
                  <td>{x.proj}</td>
                  <td className={s.mono}>{x.issue}</td>
                  <td className={s.mono}>{x.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ------------------------------------------------------- TERRAIN */}
        <section id="terrain" className={s.terrain} aria-labelledby="terrain-h">
          <div className={s.terrainField} aria-hidden="true">
            <TabbiedArtwork
              artwork={northstar}
              palette={['transparent', PALE, STEEL]}
              fit="grid"
              cellSize={90}
              redrawInterval={5400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.terrainInner}>
            <div className={s.secHead}>
              <span className={s.secNo}>03</span>
              <h2 id="terrain-h">Terrain, honestly generalised</h2>
            </div>
            <div className={s.terrainGrid}>
              <p className={s.big}>
                A contour is an opinion about where a slope stops being one
                slope. We publish ours at three generalisation levels and say
                which one you are looking at.
              </p>
              <div className={s.terrainCol}>
                <p>
                  Our terrain models come out of lidar we flew ourselves, so we
                  know what the vegetation was doing that week and how much of
                  the ground we actually saw through it.
                </p>
                <p>
                  Where the point cloud is thin, the sheet says so. There is a
                  small grey tint on the reverse index for every square
                  kilometre we would not stake a boat on.
                </p>
              </div>
            </div>
            <div className={s.pair}>
              <figure>
                <Figure
                  slug="nordlicht-plotter"
                  alt="A wide-format plotter drawing a contour map in a survey office"
                />
                <figcaption>Sheet N-114 coming off the plotter, third proof.</figcaption>
              </figure>
              <figure>
                <Figure
                  slug="nordlicht-model"
                  alt="A milled physical relief model of a fjord landscape on a table"
                />
                <figcaption>Milled relief model, Lyngen, 1:60 000.</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- FIELD */}
        <section id="field" className={s.field} aria-labelledby="field-h">
          <div className={s.secHead}>
            <span className={s.secNo}>04</span>
            <h2 id="field-h">Where the instruments are</h2>
          </div>
          <div className={s.fieldGrid}>
            <ol className={s.stations}>
              {FIELD.map(([lat, lon, what]) => (
                <li key={what}>
                  <span className={s.mono}>{lat}</span>
                  <span className={s.mono}>{lon}</span>
                  <span>{what}</span>
                </li>
              ))}
            </ol>
            <figure className={s.tall}>
              <Figure
                slug="nordlicht-field"
                alt="A survey tripod and total station set up on bare rock above a fjord"
              />
              <figcaption>Control pillar KV-2, occupied 11 hours.</figcaption>
            </figure>
          </div>
        </section>

        {/* -------------------------------------------------------- OFFICE */}
        <section id="office" className={s.office} aria-labelledby="office-h">
          <div className={s.officeField} aria-hidden="true">
            <TabbiedArtwork
              artwork={maze}
              palette={['transparent', BLUE, STEEL, PALE]}
              fit="grid"
              cellSize={62}
              redrawInterval={4200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.officeInner}>
            <div className={s.secHead}>
              <span className={s.secNo}>05</span>
              <h2 id="office-h">Storgata 62, Tromsø</h2>
            </div>
            <dl className={s.contact}>
              <div>
                <dt>Office</dt>
                <dd>
                  Storgata 62, 9008 Tromsø
                  <br />
                  Mon to Fri, 08.00 to 16.00
                </dd>
              </div>
              <div>
                <dt>Enquiries</dt>
                <dd>
                  <a href="mailto:post@nordlicht.example">post@nordlicht.example</a>
                  <br />
                  +47 00 00 00 00
                </dd>
              </div>
              <div>
                <dt>Sheets</dt>
                <dd>
                  Over the counter, or by post anywhere in Norway.
                  <br />
                  NOK 180 flat, folded or rolled.
                </dd>
              </div>
              <div>
                <dt>Field season</dt>
                <dd>
                  Airborne work March to October.
                  <br />
                  Hydrographic work all year, weather allowing.
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </main>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p className={s.footName}>Nordlicht</p>
            <p className={s.footTag}>Survey and cartography from Storgata 62, Tromsø, since 1998.</p>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Survey</h2>
            <ul className={s.footLinks}>
              <li>
                <a href="#survey">What we do</a>
              </li>
              <li>
                <a href="#terrain">Terrain models</a>
              </li>
              <li>
                <a href="#field">Field stations</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Sheets</h2>
            <ul className={s.footLinks}>
              <li>
                <a href="#charts">Published sheets</a>
              </li>
              <li>
                <a href="#office">Buy over the counter</a>
              </li>
              <li>
                <a href="#office">By post</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Contact</h2>
            <p className={s.footAddr}>
              Storgata 62
              <br />
              9008 Tromsø
              <br />
              post@nordlicht.example
              <br />
              +47 00 00 00 00
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p>A fictional survey office. Prices and times are invented.</p>
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
