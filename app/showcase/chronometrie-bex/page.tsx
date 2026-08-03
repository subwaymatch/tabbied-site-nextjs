import { TabbiedArtwork } from 'tabbied/react';
import { annulus, centroid, gravure, torsion } from 'tabbied/artworks';
import { Figure } from 'components/Figure';
import styles from './chronometrie-bex.module.css';

export const metadata = {
  title: 'Chronométrie Bex | Mechanical watch manufacture, Bex',
  description:
    'Chronométrie Bex builds 240 hand-wound watches a year in the Rhône valley. Three references, full specifications, servicing terms and ordering.',
};

const BONE = '#EDEDEB';
const INK = '#0E0E0E';
const STEEL = '#9C9C98';
const PALE = '#DAD9D5';
const SHADOW = '#3A3A38';

const HOUSE_FIGURES = [
  { value: '1974', label: 'Founded in Bex, Vaud' },
  { value: '11', label: 'People, all on one floor' },
  { value: '240', label: 'Watches finished per year' },
  { value: '3', label: 'References in the catalogue' },
];

const MOVEMENT_SPECS = [
  { label: 'Calibre', value: 'CB-14, hand-wound' },
  { label: 'Diameter', value: '11.5 lignes, 25.6 mm' },
  { label: 'Height', value: '3.85 mm' },
  { label: 'Frequency', value: '21 600 A/h, 3 Hz' },
  { label: 'Jewels', value: '22, all set in gold chatons' },
  { label: 'Balance', value: 'Free-sprung, four inertia weights' },
  { label: 'Hairspring', value: 'Breguet overcoil, drawn in house' },
  { label: 'Power reserve', value: '58 hours from a single barrel' },
  { label: 'Components', value: '214, of which 96 are finished by hand' },
  { label: 'Assembly time', value: '6 weeks per movement, one watchmaker' },
];

const COLLECTION = [
  {
    ref: '01',
    slug: 'bex-watch-1-cutout',
    name: 'Type 01 Secteur',
    alt: 'A round wristwatch with a blank dial and a slim polished steel case, isolated on a plain field',
    line: 'The first watch the house made, redrawn in 2019 with a thinner bezel and a flat sapphire.',
    diameter: '37.0 mm',
    calibre: 'CB-11, hand-wound',
    reserve: '62 hours',
    price: 'CHF 8 400',
    seed: 'cb-plate-01',
  },
  {
    ref: '02',
    slug: 'bex-watch-2-cutout',
    name: 'Type 02 Régulateur',
    alt: 'A round wristwatch with a blank regulator dial and a brushed steel case, isolated on a plain field',
    line: 'Hours, minutes and seconds kept apart, so the minute hand carries the whole dial on its own.',
    diameter: '39.0 mm',
    calibre: 'CB-14, hand-wound',
    reserve: '58 hours',
    price: 'CHF 11 900',
    seed: 'cb-plate-02',
  },
  {
    ref: '03',
    slug: 'bex-watch-3-cutout',
    name: 'Type 03 Réserve',
    alt: 'A hunter-cased pocket watch with a blank dial, the cover opened, hanging from a steel chain, isolated on a plain field',
    line: 'Not a wristwatch. A hunter case on a steel chain, with three days of reserve from twin barrels.',
    diameter: '46.0 mm',
    calibre: 'CB-21, hand-wound',
    reserve: '72 hours',
    price: 'CHF 14 600',
    seed: 'cb-plate-03',
  },
];

const SPEC_ROWS = [
  { label: 'Case material', values: ['Steel 316L', 'Steel 316L', 'Steel 316L'] },
  { label: 'Worn', values: ['Wrist', 'Wrist', 'Pocket'] },
  { label: 'Diameter', values: ['37.0 mm', '39.0 mm', '46.0 mm'] },
  { label: 'Height', values: ['8.4 mm', '9.1 mm', '11.8 mm'] },
  { label: 'Lug or bow', values: ['18 mm', '19 mm', 'Bow, 6 mm'] },
  { label: 'Crystal', values: ['Sapphire', 'Sapphire', 'Sapphire'] },
  { label: 'Water resistance', values: ['30 m', '30 m', 'Dust-tight'] },
  { label: 'Calibre', values: ['CB-11', 'CB-14', 'CB-21'] },
  { label: 'Winding', values: ['Hand', 'Hand', 'Hand'] },
  { label: 'Frequency', values: ['18 000 A/h', '21 600 A/h', '18 000 A/h'] },
  { label: 'Jewels', values: ['19', '22', '25'] },
  { label: 'Power reserve', values: ['62 h', '58 h', '72 h'] },
  { label: 'Strap or chain', values: ['Calf', 'Calf', 'Steel chain'] },
  { label: 'Made per year', values: ['90', '110', '40'] },
  { label: 'Price', values: ['CHF 8 400', 'CHF 11 900', 'CHF 14 600'] },
];

const SERVICE_STEPS = [
  {
    no: '1',
    title: 'Send it back',
    body: 'Insured post or hand delivery at the atelier. We acknowledge receipt within two working days and photograph the watch before anything is opened.',
  },
  {
    no: '2',
    title: 'Estimate',
    body: 'A written estimate follows within three weeks. Nothing is done until it is signed. Declining costs nothing beyond return postage.',
  },
  {
    no: '3',
    title: 'Full service',
    body: 'The movement is stripped to 214 parts, cleaned, worn parts replaced, oiled, regulated in five positions over ten days and cased with new gaskets.',
  },
  {
    no: '4',
    title: 'Return',
    body: 'Eight to ten weeks from signature. The watch comes back with its timing certificate and the old parts in a labelled envelope.',
  },
];

const SERVICE_TERMS = [
  { label: 'Interval', value: 'Every five to seven years of daily wear' },
  { label: 'Full service, CB-11 and CB-14', value: 'CHF 780' },
  { label: 'Full service, CB-21', value: 'CHF 940' },
  { label: 'Turnaround', value: '8 to 10 weeks from signed estimate' },
  { label: 'Parts availability', value: 'Guaranteed 25 years from delivery' },
  { label: 'Loan watch', value: 'On request, no charge, deposit waived' },
];

const ORDER_STEPS = [
  {
    label: 'Waiting list',
    value:
      'Open for all three references. Current wait: 9 months for Type 01, 11 months for Type 02, 14 months for Type 03.',
  },
  {
    label: 'Deposit',
    value:
      '20 % on joining the list, refundable in full until the case is engraved.',
  },
  {
    label: 'Fitting',
    value:
      'Bracelet sizing and strap choice are settled at the atelier, or by post if you cannot travel.',
  },
  {
    label: 'Delivery',
    value:
      'Collected in Bex or sent insured. Every watch leaves with a timing sheet in six positions.',
  },
  {
    label: 'Guarantee',
    value: 'Five years, transferable, void only if opened by someone else.',
  },
];

export default function ChronometrieBexPage() {
  return (
    <div className={styles.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..800&display=swap"
      />

      {/* Masthead and hero share one full-bleed pattern field. */}
      <div className={styles.top}>
        <div className={styles.topField} aria-hidden="true">
          <TabbiedArtwork
            artwork={torsion}
            palette={[BONE, PALE]}
            seed="cb-hero-01"
            options={{ grid: '10x15', frequency: 0.55 }}
            fit="grid"
            cellSize={64}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>

        <header className={styles.masthead}>
          <div className={`${styles.container} ${styles.grid}`}>
            <p className={styles.wordmark}>
              Chronométrie
              <br />
              Bex
            </p>
            <nav className={styles.nav} aria-label="Sections">
              <a href="#manufacture">Manufacture</a>
              <a href="#movement">Movement</a>
              <a href="#collection">Collection</a>
              <a href="#specifications">Specifications</a>
              <a href="#ordering">Ordering</a>
            </nav>
            <p className={styles.mastMeta}>
              Rue du Jura 12
              <br />
              1880 Bex, Vaud
            </p>
          </div>
        </header>

        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={`${styles.container} ${styles.grid}`}>
            <p className={styles.kicker}>Manufacture since 1974</p>
            <h1 id="hero-title" className={styles.heroTitle}>
              Two hundred and forty watches a year, and no plans to make more.
            </h1>
            <p className={styles.heroLede}>
              Eleven people on one floor above the old salt road. Three
              references, three calibres, every escapement adjusted by hand in
              five positions. We do not run a boutique, we do not run a
              waiting-list auction, and we answer letters.
            </p>
            <dl className={styles.heroFigures}>
              {HOUSE_FIGURES.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </div>

      <div className={styles.heroPhoto}>
        <Figure
          slug="bex-hero"
          priority
          alt="A watchmaker's bench in daylight with hand tools laid out in a row and a movement under a loupe"
          className={styles.img}
        />
      </div>

      <main>
        {/* 01 The manufacture */}
        <section
          id="manufacture"
          className={styles.section}
          aria-labelledby="manufacture-title"
        >
          <div className={`${styles.container} ${styles.grid}`}>
            <div className={styles.secHead}>
              <span className={styles.secNo}>01</span>
              <h2 id="manufacture-title" className={styles.secTitle}>
                The manufacture
              </h2>
              <p className={styles.secLede}>
                Bex sits at the point where the Rhône valley narrows. The house
                has occupied the same second floor since 1974.
              </p>
            </div>

            <div className={styles.proseCol}>
              <p>
                Chronométrie Bex was founded by Henri Delessert, who had spent
                nineteen years repairing pocket watches for the railway and
                decided that a wristwatch could be made to the same standard if
                nobody was in a hurry. The first Type 01 left the bench in
                March 1976. The design has been altered twice since, both times
                by less than a millimetre.
              </p>
              <p>
                Cases are turned in Le Sentier by a supplier we have used since
                1981. Hairsprings, balance staffs, wheels and bridges are made
                here on machines that predate all of us: a Schaublin 102 lathe
                from 1959, a jig borer from 1966, and a rose engine that was
                already second-hand when Delessert bought it.
              </p>
              <p>
                Output is capped at 240 watches. Not as a marketing position:
                that is what eleven people can finish properly in a working
                year.
              </p>
            </div>

            <figure className={styles.atelierFig}>
              <div className={styles.frameWide}>
                <Figure
                  slug="bex-atelier"
                  alt="The atelier interior with a row of watchmakers' benches under tall windows"
                  className={styles.img}
                />
              </div>
              <figcaption>
                The atelier. Eight benches, three machines, one window per
                bench.
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Machined wells: the plate, run full width between sections. */}
        <div className={styles.band}>
          <TabbiedArtwork
            artwork={gravure}
            palette={['transparent', STEEL, PALE]}
            seed="cb-band-02"
            options={{ grid: '4x6', frequency: 0.9 }}
            fit="grid"
            cellSize={60}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>

        {/* 02 The movement */}
        <section
          id="movement"
          className={styles.section}
          aria-labelledby="movement-title"
        >
          <div className={`${styles.container} ${styles.grid}`}>
            <div className={styles.secHead}>
              <span className={styles.secNo}>02</span>
              <h2 id="movement-title" className={styles.secTitle}>
                Calibre CB-14
              </h2>
              <p className={styles.secLede}>
                The middle calibre, and the one the house is judged on. In
                production since 2008, revised in 2017.
              </p>
            </div>

            <figure className={styles.movementFig}>
              <div className={styles.frameSquare}>
                <Figure
                  slug="bex-movement"
                  alt="Macro view of a hand-finished mechanical watch movement showing bridges, jewels and the balance wheel"
                  className={styles.img}
                />
              </div>
              <figcaption>
                CB-14 before casing. Bridges are bevelled by hand at 45
                degrees; the flanks are polished on a tin lap.
              </figcaption>
            </figure>

            <dl className={styles.specPairs}>
              {MOVEMENT_SPECS.map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>

            <p className={styles.movementNote}>
              Every CB-14 is regulated over ten days in five positions and
              leaves the bench inside minus one to plus six seconds a day. The
              timing sheet that comes with the watch is the sheet from your
              watch, not a specimen.
            </p>
          </div>
        </section>

        {/* 03 The collection */}
        <section
          id="collection"
          className={styles.section}
          aria-labelledby="collection-title"
        >
          <div className={`${styles.container} ${styles.grid}`}>
            <div className={styles.secHead}>
              <span className={styles.secNo}>03</span>
              <h2 id="collection-title" className={styles.secTitle}>
                The collection
              </h2>
              <p className={styles.secLede}>
                Three references, photographed on the pattern field. The dials
                are blank in these plates; the reference is set beside the
                picture, not on it.
              </p>
            </div>

            <div className={styles.plates}>
              {COLLECTION.map((w) => (
                <article key={w.ref} className={styles.plate}>
                  <p className={styles.plateNo}>Plate {w.ref}</p>
                  <div className={styles.plateField}>
                    {/* Rings, one treatment for all three plates. */}
                    <TabbiedArtwork
                      artwork={annulus}
                      palette={[PALE, BONE, STEEL]}
                      seed={w.seed}
                      options={{ grid: '4x6', frequency: 0.8 }}
                      fit="grid"
                      cellSize={44}
                      style={{ position: 'absolute', inset: 0 }}
                    />
                    <div className={styles.veil} aria-hidden="true" />
                    <Figure
                      slug={w.slug}
                      cutout
                      alt={w.alt}
                      className={styles.cutout}
                    />
                  </div>
                  <h3 className={styles.plateName}>{w.name}</h3>
                  <p className={styles.plateLine}>{w.line}</p>
                  <dl className={styles.plateSpecs}>
                    <div>
                      <dt>Diameter</dt>
                      <dd>{w.diameter}</dd>
                    </div>
                    <div>
                      <dt>Calibre</dt>
                      <dd>{w.calibre}</dd>
                    </div>
                    <div>
                      <dt>Power reserve</dt>
                      <dd>{w.reserve}</dd>
                    </div>
                    <div>
                      <dt>Price</dt>
                      <dd className={styles.platePrice}>{w.price}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 04 Specifications */}
        <section
          id="specifications"
          className={styles.section}
          aria-labelledby="specifications-title"
        >
          <div className={`${styles.container} ${styles.grid}`}>
            <div className={styles.secHead}>
              <span className={styles.secNo}>04</span>
              <h2 id="specifications-title" className={styles.secTitle}>
                Specifications
              </h2>
              <p className={styles.secLede}>
                All figures measured on finished watches, not on drawings.
                Prices include Swiss VAT and are held for the calendar year.
              </p>
            </div>

            <div
              className={styles.specTable}
              role="table"
              aria-label="Reference specifications compared"
            >
              <div className={`${styles.specRow} ${styles.specHead}`} role="row">
                <span role="columnheader">Reference</span>
                <span role="columnheader">Type 01</span>
                <span role="columnheader">Type 02</span>
                <span role="columnheader">Type 03</span>
              </div>
              {SPEC_ROWS.map((r) => (
                <div key={r.label} className={styles.specRow} role="row">
                  <span className={styles.specLabel} role="rowheader">
                    {r.label}
                  </span>
                  {r.values.map((v, i) => (
                    <span
                      key={`${r.label}-${i}`}
                      className={styles.specValue}
                      role="cell"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              ))}
            </div>

            <p className={styles.specNote}>
              Steel 316L is bar stock, not cast. Water resistance is tested at
              the stated depth plus 25 % and again after any service. Lug width
              is quoted between the lugs, so a 19 mm strap fits Type 02 without
              persuasion. Type 03 is a pocket watch and is sealed against dust,
              not water.
            </p>
          </div>
        </section>

        {/* 05 Servicing */}
        <section
          id="servicing"
          className={styles.section}
          aria-labelledby="servicing-title"
        >
          <div className={`${styles.container} ${styles.grid}`}>
            <div className={styles.secHead}>
              <span className={styles.secNo}>05</span>
              <h2 id="servicing-title" className={styles.secTitle}>
                Servicing
              </h2>
              <p className={styles.secLede}>
                A watch made here is expected to outlive the person who ordered
                it, which only works if it comes back.
              </p>
            </div>

            <ol className={styles.steps}>
              {SERVICE_STEPS.map((s) => (
                <li key={s.no} className={styles.step}>
                  <span className={styles.stepNo}>{s.no}</span>
                  <h3 className={styles.stepTitle}>{s.title}</h3>
                  <p>{s.body}</p>
                </li>
              ))}
            </ol>

            <dl className={styles.termsList}>
              {SERVICE_TERMS.map((t) => (
                <div key={t.label} className={styles.termRow}>
                  <dt>{t.label}</dt>
                  <dd>{t.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* 06 The watchmaker */}
        <section
          id="watchmaker"
          className={styles.section}
          aria-labelledby="watchmaker-title"
        >
          <div className={`${styles.container} ${styles.grid}`}>
            <div className={styles.secHead}>
              <span className={styles.secNo}>06</span>
              <h2 id="watchmaker-title" className={styles.secTitle}>
                The watchmaker
              </h2>
              <p className={styles.secLede}>
                Claire Reymond runs the bench. She joined in 2003 and has
                assembled roughly 2 900 movements since.
              </p>
            </div>

            <figure className={styles.portraitFig}>
              <div className={styles.framePortrait}>
                <Figure
                  slug="bex-watchmaker"
                  alt="Portrait of a watchmaker in a light coat at a bench, photographed straight on in daylight"
                  className={styles.img}
                />
              </div>
              <figcaption>
                Claire Reymond, head watchmaker.
                <br />
                At the bench since 2003.
              </figcaption>
            </figure>

            <div className={styles.proseColWide}>
              <p>
                Reymond trained at the technical school in Le Locle and spent
                four years on restoration before coming to Bex. She sets the
                house standard for finishing, which is written down in a folder
                nobody has ever updated because it has not needed updating.
              </p>
              <p>
                Three of the eleven people here were trained by her from
                scratch. The apprenticeship is four years. The first year is
                filing steel by hand until a surface is flat under a straight
                edge, which she considers the only test worth setting.
              </p>
              <p>
                She keeps the timing certificates of every watch she has
                assembled in a drawer under the bench. If you send yours back
                for service she will find the original sheet and compare it.
              </p>
            </div>
          </div>
        </section>

        {/* 07 Ordering */}
        <section
          id="ordering"
          className={styles.section}
          aria-labelledby="ordering-title"
        >
          <div className={`${styles.container} ${styles.grid}`}>
            <div className={styles.secHead}>
              <span className={styles.secNo}>07</span>
              <h2 id="ordering-title" className={styles.secTitle}>
                Ordering
              </h2>
              <p className={styles.secLede}>
                There is no shop. Watches are ordered from the atelier, in
                person or by post, and made in the order the list was joined.
              </p>
            </div>

            <dl className={styles.orderList}>
              {ORDER_STEPS.map((o) => (
                <div key={o.label} className={styles.orderRow}>
                  <dt>{o.label}</dt>
                  <dd>{o.value}</dd>
                </div>
              ))}
            </dl>

            <div className={styles.orderAside}>
              <p className={styles.orderPrompt}>
                Appointments are held on Tuesday and Thursday afternoons and
                last an hour. Bring the watch you wear now.
              </p>
              <p>
                <a href="#visiting" className={styles.buttonFilled}>
                  Request an appointment
                </a>
              </p>
              <p className={styles.note}>
                atelier@chronometrie-bex.example
                <br />
                +41 24 000 00 00, weekdays 09:00 to 12:00
              </p>
            </div>
          </div>
        </section>

        {/* 08 Visiting */}
        <section
          id="visiting"
          className={styles.section}
          aria-labelledby="visiting-title"
        >
          <div className={`${styles.container} ${styles.grid}`}>
            <div className={styles.secHead}>
              <span className={styles.secNo}>08</span>
              <h2 id="visiting-title" className={styles.secTitle}>
                Visiting
              </h2>
              <p className={styles.secLede}>
                Second floor, no lift, forty-one steps. Tell us in advance if
                that is a problem and we will meet you on the ground floor.
              </p>
            </div>

            <dl className={styles.visitPairs}>
              <div>
                <dt>Address</dt>
                <dd>
                  Rue du Jura 12
                  <br />
                  1880 Bex, Vaud
                </dd>
              </div>
              <div>
                <dt>Open</dt>
                <dd>
                  Tuesday and Thursday, 14:00 to 18:00
                  <br />
                  By appointment only
                </dd>
              </div>
              <div>
                <dt>By train</dt>
                <dd>
                  Bex station, 48 minutes from Lausanne
                  <br />
                  Nine minutes on foot from the platform
                </dd>
              </div>
              <div>
                <dt>By car</dt>
                <dd>
                  A9, exit Bex
                  <br />
                  Public parking at Place du Marché, 300 m
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerField} aria-hidden="true">
          <TabbiedArtwork
            artwork={centroid}
            palette={[SHADOW, STEEL, PALE, BONE]}
            seed="cb-foot-09"
            options={{ grid: '8x12', frequency: 0.9 }}
            fit="grid"
            cellSize={44}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
        <div className={`${styles.container} ${styles.grid} ${styles.footerGrid}`}>
          <div className={styles.footBrand}>
            <p className={styles.footWordmark}>Chronométrie Bex</p>
            <p className={styles.footTag}>
              Mechanical watches, made and serviced at Rue du Jura 12 since
              1974.
            </p>
          </div>
          <div className={styles.footCol}>
            <h2 className={styles.footHead}>Catalogue</h2>
            <ul className={styles.footLinks}>
              <li>
                <a href="#collection">Type 01 Secteur</a>
              </li>
              <li>
                <a href="#collection">Type 02 Régulateur</a>
              </li>
              <li>
                <a href="#collection">Type 03 Réserve</a>
              </li>
              <li>
                <a href="#specifications">Full specifications</a>
              </li>
            </ul>
          </div>
          <div className={styles.footCol}>
            <h2 className={styles.footHead}>Owners</h2>
            <ul className={styles.footLinks}>
              <li>
                <a href="#servicing">Book a service</a>
              </li>
              <li>
                <a href="#servicing">Parts and guarantee</a>
              </li>
              <li>
                <a href="#visiting">Find the atelier</a>
              </li>
            </ul>
          </div>
          <div className={styles.footCol}>
            <h2 className={styles.footHead}>Contact</h2>
            <address className={styles.footAddress}>
              Rue du Jura 12
              <br />
              1880 Bex, Vaud
              <br />
              atelier@chronometrie-bex.example
              <br />
              +41 24 000 00 00
            </address>
          </div>
          <div className={styles.footBase}>
            <p>
              Prices in Swiss francs, valid to 31 December 2026. Timing figures
              measured at 23 degrees, fully wound.
            </p>
            <p>
              Patterns by{' '}
              <a
                href="https://tabbied.com"
                target="_blank"
                rel="noreferrer noopener"
              >
                Tabbied
              </a>
              . Design fiction, not a real manufacture.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
