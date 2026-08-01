import { Fragment } from 'react';
import { TabbiedArtwork } from 'tabbied/react';
import { taper } from 'tabbied/artworks';
import { Figure } from 'components/Figure';
import styles from './bogen-papier.module.css';

export const metadata = {
  title: 'Bogen Papier: Paper Merchant, Winterthur',
  description:
    'Bogen Papier holds eleven shades in five weights, cut to size on Wednesdays and delivered across Switzerland. Stock list, mill notes, sample service and delivery zones.',
};

/* Palette. Ground first, as the artwork expects it. */
const PAPER = '#FAFAF7';
const INK = '#14150F';
const GREEN = '#2E7D4F';
const WARM = '#C9C4B4';
const PALE = '#E7E5DC';
const UMBER = '#6B6656';

const NAV = [
  { label: 'Range', href: '#range' },
  { label: 'Mill', href: '#mill' },
  { label: 'Specimens', href: '#specimens' },
  { label: 'Ordering', href: '#ordering' },
  { label: 'Delivery', href: '#delivery' },
];

const HERO_FACTS: [string, string][] = [
  ['Trading since', '1954'],
  ['Held in stock', '11 shades, 5 weights'],
  ['Cutting days', 'Wednesday, from 07:00'],
  ['Zurich delivery', 'Next working day'],
];

type Swatch = {
  ref: string; name: string; tone: string; gloss: string;
  surface: string; weights: string; price: string;
};

/* Eleven stocked shades. Prices are Swiss francs per 100 sheets at 700 x 1000. */
const W5 = '90 · 120 · 170 · 250 · 350';
const W4L = '90 · 120 · 170 · 250';
const W4H = '120 · 170 · 250 · 350';
const W3 = '170 · 250 · 350';

const RANGE: Swatch[] = [
  { ref: 'B.01', name: 'Natur', tone: 't1', surface: 'Matt', weights: W5,
    price: '74.00', gloss: 'Unbleached, no optical brighteners' },
  { ref: 'B.02', name: 'Kreide', tone: 't2', surface: 'Smooth', weights: W4L,
    price: '78.00', gloss: 'A cold white that holds fine rules' },
  { ref: 'B.03', name: 'Hafer', tone: 't3', surface: 'Vellum', weights: W4H,
    price: '82.00', gloss: 'Oat, faint fleck, our steadiest seller' },
  { ref: 'B.04', name: 'Leinen', tone: 't4', surface: 'Laid',
    weights: '120 · 170 · 250', price: '96.00',
    gloss: 'Laid lines at 24 mm, visible against the light' },
  { ref: 'B.05', name: 'Lehm', tone: 't5', surface: 'Vellum', weights: W4H,
    price: '88.00', gloss: 'Clay, warm under tungsten' },
  { ref: 'B.06', name: 'Umbra', tone: 't6', surface: 'Matt', weights: W3,
    price: '104.00', gloss: 'Dyed through, edges match the face' },
  { ref: 'B.07', name: 'Basalt', tone: 't7', surface: 'Matt', weights: W3,
    price: '108.00', gloss: 'Neutral dark, takes white foil cleanly' },
  { ref: 'B.08', name: 'Kohle', tone: 't8', surface: 'Smooth', weights: W3,
    price: '112.00', gloss: 'The darkest we hold, dyed through' },
  { ref: 'B.09', name: 'Nebel', tone: 't9', surface: 'Smooth', weights: W4L,
    price: '80.00', gloss: 'Cool grey, sized for offset' },
  { ref: 'B.10', name: 'Farn', tone: 't10', surface: 'Matt',
    weights: '170 · 250', price: '118.00', gloss: 'The one colour in the range' },
  { ref: 'B.11', name: 'Torf', tone: 't11', surface: 'Laid', weights: W3,
    price: '116.00', gloss: 'Peat, ordered mostly for boxes' },
];

/* The weight ramp. Taper draws it as growing squares; labels sit beneath. */
const WEIGHTS = [
  { gsm: '90', caliper: '0.11 mm', use: 'Letterheads, inners, throw-outs' },
  { gsm: '120', caliper: '0.15 mm', use: 'Text pages, folded leaflets' },
  { gsm: '170', caliper: '0.21 mm', use: 'Covers, posters, wrappers' },
  { gsm: '250', caliper: '0.31 mm', use: 'Cards, tags, menu boards' },
  { gsm: '350', caliper: '0.44 mm', use: 'Boxes, invitations, plates' },
];

const MILL_FACTS: [string, string][] = [
  ['Mill', 'Papierfabrik Ottenbach, Reuss valley'],
  ['Making paper since', '1878'],
  ['Machines', 'Two, both cylinder mould'],
  ['Water', 'Drawn from the Reuss, returned within 1.4 °C'],
  ['Fibre', '68% recycled, 32% certified virgin'],
  ['Shortest run', '2 tonnes, roughly 34 000 sheets'],
];

const SPECIMENS = [
  { no: '01', year: '2025', title: 'Kunsthalle Winterthur, winter programme',
    stock: 'B.03 Hafer, 250 gsm',
    detail: 'Two colours, letterpress, 3 000 copies' },
  { no: '02', year: '2024', title: 'Ottenbach mill, centenary account',
    stock: 'B.01 Natur, 120 gsm and B.06 Umbra, 350 gsm',
    detail: 'Sewn section, uncoated cover, 800 copies' },
  { no: '03', year: '2026', title: 'Zentralbibliothek, reading room signage',
    stock: 'B.08 Kohle, 350 gsm',
    detail: 'White foil, guillotined square, 46 panels' },
];

const FIGURES = [
  { value: '68', unit: '%', label: 'Recycled fibre across the range',
    note: 'Weighted by tonnage delivered in 2025.' },
  { value: '1.4', unit: '°C', label: 'Ceiling on returned water temperature',
    note: 'Measured at the mill outfall, hourly.' },
  { value: '0', unit: 'g', label: 'Optical brighteners in the Natur line',
    note: 'Verified by the mill on every make.' },
  { value: '92', unit: '%', label: 'Deliveries by rail or electric van',
    note: 'Remainder is diesel, mostly Zone 5.' },
];

const ORDER_STEPS = [
  { no: '01', title: 'Ask for the sample box',
    body: 'Eleven shades, five weights, cut to A6 and bound with a screw post. CHF 24, credited against a first order over CHF 300.' },
  { no: '02', title: 'Send a quantity, not a guess',
    body: 'Give us the finished size and the run length. We will work out the sheet plan and tell you what the offcut costs.' },
  { no: '03', title: 'We cut on Wednesday',
    body: 'Cutting is a single pass, once a week. Orders confirmed by 16:00 on Tuesday go on that pass. Everything else waits seven days.' },
  { no: '04', title: 'Collect or have it driven',
    body: 'The trade counter is open Saturday mornings. Otherwise the van runs Thursday and Friday across Zones 1 to 3.' },
];

const TEAM = [
  ['Ilse Brander', 'Merchant, since 1998'],
  ['Marek Novotny', 'Cutting floor and reels'],
  ['Sara Achermann', 'Orders and sample service'],
  ['Tobias Frei', 'Delivery, Zones 1 to 3'],
];

const ZONES = [
  { zone: 'Z1', area: 'Winterthur, Töss, Wülflingen, Seen', cutoff: '15:00',
    arrival: 'Same day, by 18:00', charge: 'Free over CHF 150' },
  { zone: 'Z2', area: 'Zurich, Uster, Bülach, Baden', cutoff: '14:00',
    arrival: 'Next working day', charge: 'CHF 18' },
  { zone: 'Z3', area: 'St. Gallen, Aarau, Zug, Lucerne', cutoff: '12:00',
    arrival: 'Next working day', charge: 'CHF 28' },
  { zone: 'Z4', area: 'Rest of Switzerland', cutoff: '12:00',
    arrival: 'Two working days', charge: 'CHF 34' },
  { zone: 'Z5', area: 'Vorarlberg, Baden-Württemberg', cutoff: '11:00',
    arrival: 'Three working days', charge: 'From CHF 62' },
];

const HOURS: [string, string][] = [
  ['Monday to Thursday', '07:00 – 17:30'],
  ['Friday', '07:00 – 16:00'],
  ['Saturday', 'Trade counter, 08:00 – 12:00'],
  ['Sunday and holidays', 'Closed'],
];

/* The pattern cell is dealt into the swatch grid after the sixth shade. */
const PATTERN_CELL_INDEX = 6;

export default function BogenPapierPage() {
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

      {/* MASTHEAD */}
      <header className={styles.masthead}>
        <div className={styles.shell}>
          <div className={styles.grid}>
            <div className={styles.mastMark}>
              <p className={styles.wordmark}>Bogen Papier</p>
              <p className={styles.wordmarkSub}>Papiergrosshandel, Winterthur</p>
            </div>
            <nav className={styles.mastNav} aria-label="Sections">
              <ul className={styles.navList}>
                {NAV.map((item) => (
                  <li key={item.href}>
                    <a className={styles.navLink} href={item.href}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <p className={styles.mastPhone}>
              Lagerstrasse 41
              <br />
              8400 Winterthur
              <br />
              052 214 07 90
            </p>
          </div>
        </div>
        {/* Hairline 1 of 2: a typographic device, not a card edge. */}
        <div className={styles.shell}>
          <div className={styles.hairline} aria-hidden="true" />
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.shell}>
            <div className={styles.grid}>
              <p className={styles.kicker}>Stock list 2026, first edition</p>
              <h1 className={styles.heroTitle} id="hero-title">
                Paper by the sheet, the ream and the reel, sold from a floor in
                Winterthur.
              </h1>
              <p className={styles.heroLede}>
                We hold eleven shades in five weights and nothing else. The
                range is small because we would rather know a paper than list
                it. Everything on this page is in the building today, cut to
                700 x 1000 and stacked by weight.
              </p>
              <dl className={styles.heroFacts}>
                {HERO_FACTS.map(([term, value]) => (
                  <div className={styles.factRow} key={term}>
                    <dt className={styles.factTerm}>{term}</dt>
                    <dd className={styles.factValue}>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* 5 / 7 split: the pattern as a flat field, the floor as a photograph */}
          <div className={styles.heroSplit}>
            <div className={styles.heroField}>
              <TabbiedArtwork
                artwork={taper}
                palette={[PAPER, WARM, PALE, UMBER, GREEN]}
                seed="bogen-hero-01"
                fit="grid"
                cellSize={72}
                style={{ position: 'absolute', inset: 0 }}
              />
            </div>
            <div className={styles.heroPhoto}>
              <Figure
                slug="bogen-hero"
                alt="The warehouse floor at Bogen Papier, with stacked reams under high windows."
                priority
                className={styles.cover}
              />
            </div>
          </div>
        </section>

        {/* 01 STATEMENT */}
        <section className={styles.section} aria-labelledby="statement-title">
          <div className={styles.shell}>
            <div className={styles.grid}>
              <div className={styles.sectionMark}>
                <p className={styles.sectionNo}>01</p>
                <p className={styles.sectionLabel}>The merchant</p>
              </div>
              <div className={styles.statementBody}>
                <h2 className={styles.h2} id="statement-title">
                  A merchant should be able to say why a paper is on the shelf.
                </h2>
                <p className={styles.body}>
                  Bogen Papier was started in 1954 by Anton Brander, who sold
                  offcuts from a handcart outside the Ottenbach mill gate. The
                  business has moved four times and grown slowly. It has never
                  carried more than a dozen shades.
                </p>
                <p className={styles.body}>
                  A large catalogue is a way of avoiding a decision. Our range
                  is edited once a year, in January. A shade stays if printers
                  keep asking for it and the mill can still make it to the same
                  shade. Two papers were dropped in 2025, one for fading in
                  window displays and one because the mill changed its sizing.
                </p>
                <ol className={styles.principles}>
                  <li className={styles.principle}>
                    <span className={styles.principleNo}>i</span>
                    <span className={styles.principleText}>
                      Every shade is dyed through, so a cut edge matches the
                      face. We do not stock surface-coloured board.
                    </span>
                  </li>
                  <li className={styles.principle}>
                    <span className={styles.principleNo}>ii</span>
                    <span className={styles.principleText}>
                      Prices are per 100 sheets and printed here. There is no
                      trade tier and no annual rebate to negotiate.
                    </span>
                  </li>
                  <li className={styles.principle}>
                    <span className={styles.principleNo}>iii</span>
                    <span className={styles.principleText}>
                      If a paper is wrong for the job we will say so before we
                      cut it, which is the only moment it helps.
                    </span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* 02 THE RANGE: swatch grid */}
        <section
          className={`${styles.section} ${styles.sectionPale}`}
          id="range"
          aria-labelledby="range-title"
        >
          <div className={styles.shell}>
            <div className={styles.grid}>
              <div className={styles.sectionMark}>
                <p className={styles.sectionNo}>02</p>
                <p className={styles.sectionLabel}>The range</p>
              </div>
              <div className={styles.rangeIntro}>
                <h2 className={styles.h2} id="range-title">
                  Eleven shades, five weights, one sheet size.
                </h2>
                <p className={styles.body}>
                  Everything is held at 700 x 1000 mm and cut down on request.
                  Weights run from 90 to 350 gsm; not every shade is made in
                  every weight, and the weights that exist are listed under each
                  swatch. Colours below are printed representations. Order the
                  sample box before you commit a run.
                </p>
              </div>
            </div>
          </div>

          {/* Weight ramp: taper is literally a scale of growing squares */}
          <div className={styles.rampBand}>
            <div className={styles.rampField}>
              <TabbiedArtwork
                artwork={taper}
                palette={[PALE, WARM, PAPER, UMBER, INK]}
                seed="bogen-ramp-04"
                fit="grid"
                cellSize={96}
                style={{ position: 'absolute', inset: 0 }}
              />
            </div>
          </div>
          <div className={styles.shell}>
            <ol className={styles.rampScale}>
              {WEIGHTS.map((w) => (
                <li className={styles.rampStep} key={w.gsm}>
                  <p className={styles.rampGsm}>
                    {w.gsm}
                    <span className={styles.rampUnit}>gsm</span>
                  </p>
                  <p className={styles.rampCaliper}>{w.caliper}</p>
                  <p className={styles.rampUse}>{w.use}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className={styles.shell}>
            <div className={styles.swatchLegendRow}>
              <p className={styles.swatchLegendLabel}>Stock list</p>
              <p className={styles.swatchLegend}>
                Each entry gives the reference, the shade name, the surface, the
                weights we hold in gsm, and the price in Swiss francs per 100
                sheets at 700 x 1000 mm.
              </p>
            </div>
            <ul className={styles.swatchGrid}>
              {RANGE.map((s, i) => (
                <Fragment key={s.ref}>
                  {i === PATTERN_CELL_INDEX && (
                    <li className={styles.swatchCell}>
                      <div className={styles.patternField}>
                        <TabbiedArtwork
                          artwork={taper}
                          palette={[PAPER, WARM, PALE, UMBER]}
                          seed="bogen-swatch-07"
                          fit="grid"
                          cellSize={30}
                          style={{ position: 'absolute', inset: 0 }}
                        />
                        <span className={styles.swatchRefInside}>Scale</span>
                      </div>
                      <div className={styles.swatchMeta}>
                        <p className={styles.swatchName}>
                          <span className={styles.swatchRef}>B.00</span>
                          Weight scale
                        </p>
                        <p className={styles.swatchGloss}>
                          Ninety through three fifty, drawn to size
                        </p>
                        <div className={styles.swatchSpecs}>
                          <span className={styles.specTerm}>Surface</span>
                          <span className={styles.specValue}>Not stocked</span>
                          <span className={styles.specTerm}>Weights</span>
                          <span className={styles.specValue}>
                            90 · 120 · 170 · 250 · 350
                          </span>
                          <span className={styles.specTerm}>Per 100</span>
                          <span className={styles.specValue}>Reference</span>
                        </div>
                      </div>
                    </li>
                  )}
                  <li className={styles.swatchCell}>
                    <div
                      className={`${styles.swatchField} ${styles[s.tone]}`}
                      aria-hidden="true"
                    >
                      <span className={styles.swatchRefInside}>{s.ref}</span>
                    </div>
                    <div className={styles.swatchMeta}>
                      <h3 className={styles.swatchName}>
                        <span className={styles.swatchRef}>{s.ref}</span>
                        {s.name}
                      </h3>
                      <p className={styles.swatchGloss}>{s.gloss}</p>
                      <div className={styles.swatchSpecs}>
                        <span className={styles.specTerm}>Surface</span>
                        <span className={styles.specValue}>{s.surface}</span>
                        <span className={styles.specTerm}>Weights</span>
                        <span className={styles.specValue}>{s.weights}</span>
                        <span className={styles.specTerm}>Per 100</span>
                        <span className={styles.specValue}>{s.price}</span>
                      </div>
                    </div>
                  </li>
                </Fragment>
              ))}
            </ul>
          </div>

          <div className={styles.shell}>
            <div className={styles.grid}>
              <p className={styles.rangeNote}>
                All prices are per 100 sheets at 700 x 1000 mm, excluding VAT,
                collected from Lagerstrasse. Cutting to a smaller format is
                CHF 12 per 100 sheets per cut. Reels are quoted separately by
                the tonne. Prices hold to 31 December 2026 unless the mill
                repasses a make.
              </p>
              <div className={styles.rangeCut}>
                <Figure
                  slug="bogen-swatches-cutout"
                  cutout
                  alt="A fan of paper swatches in the eleven stocked shades, spread open."
                  className={styles.cut}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 03 THE MILL */}
        <section className={styles.section} id="mill" aria-labelledby="mill-title">
          <div className={styles.shell}>
            <div className={styles.grid}>
              <div className={styles.sectionMark}>
                <p className={styles.sectionNo}>03</p>
                <p className={styles.sectionLabel}>The mill</p>
              </div>
              <div className={styles.millBody}>
                <h2 className={styles.h2} id="mill-title">
                  Everything we sell is made 38 kilometres away.
                </h2>
                <p className={styles.body}>
                  The Ottenbach mill has run on the Reuss since 1878 and has
                  made our range since 1961. Two cylinder mould machines, one
                  for the light weights and one for board. We visit on the first
                  Tuesday of the month and watch the make.
                </p>
                <dl className={styles.millFacts}>
                  {MILL_FACTS.map(([term, value]) => (
                    <div className={styles.millRow} key={term}>
                      <dt className={styles.millTerm}>{term}</dt>
                      <dd className={styles.millValue}>{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>

          <div className={styles.shell}>
            <div className={styles.grid}>
              <figure className={styles.millPhoto}>
                <div className={styles.millPhotoFrame}>
                  <Figure
                    slug="bogen-mill"
                    alt="The Ottenbach paper mill beside the Reuss, seen across the water."
                    className={styles.cover}
                  />
                </div>
                <figcaption className={styles.caption}>
                  Papierfabrik Ottenbach, Reuss valley. The lower building holds
                  the board machine.
                </figcaption>
              </figure>
              <div className={styles.millCut}>
                <div className={styles.millCutField}>
                  <TabbiedArtwork
                    artwork={taper}
                    palette={[PALE, WARM, PAPER]}
                    seed="bogen-mill-02"
                    fit="grid"
                    cellSize={44}
                    style={{ position: 'absolute', inset: 0 }}
                  />
                  <span className={styles.veil} aria-hidden="true" />
                  <Figure
                    slug="bogen-roll-cutout"
                    cutout
                    alt="A standing reel of uncoated paper, cut out against the pattern field."
                    className={styles.cutTall}
                  />
                </div>
                <p className={styles.caption}>
                  Reel, 1 400 mm face. Reels are quoted by the tonne and
                  delivered from the mill direct.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 04 SPECIMENS */}
        <section
          className={`${styles.section} ${styles.sectionPale}`}
          id="specimens"
          aria-labelledby="specimens-title"
        >
          <div className={styles.shell}>
            <div className={styles.grid}>
              <div className={styles.sectionMark}>
                <p className={styles.sectionNo}>04</p>
                <p className={styles.sectionLabel}>Specimens</p>
              </div>
              <div className={styles.specimenIntro}>
                <h2 className={styles.h2} id="specimens-title">
                  Printed work, with the stock named.
                </h2>
                <p className={styles.body}>
                  Three recent jobs, kept in the sample cabinet at the counter.
                  Ask for any of them and we will pull the sheet so you can see
                  the shade under the light you are printing for.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.shell}>
            <div className={styles.specimenGrid}>
              <div className={styles.specimenPhoto}>
                <Figure
                  slug="bogen-sheets"
                  alt="Loose printed sheets fanned across a bench, showing several stocked shades."
                  className={styles.cover}
                />
              </div>
              <div className={styles.specimenPattern}>
                <TabbiedArtwork
                  artwork={taper}
                  palette={[PAPER, PALE, WARM, GREEN]}
                  seed="bogen-specimen-03"
                  fit="grid"
                  cellSize={52}
                  style={{ position: 'absolute', inset: 0 }}
                />
              </div>
              <ol className={styles.specimenList}>
                {SPECIMENS.map((sp) => (
                  <li className={styles.specimenItem} key={sp.no}>
                    <p className={styles.specimenNo}>{sp.no}</p>
                    <div className={styles.specimenText}>
                      <h3 className={styles.specimenTitle}>{sp.title}</h3>
                      <p className={styles.specimenStock}>{sp.stock}</p>
                      <p className={styles.specimenDetail}>{sp.detail}</p>
                    </div>
                    <p className={styles.specimenYear}>{sp.year}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* 05 FIGURES */}
        <section className={styles.section} aria-labelledby="figures-title">
          <div className={styles.shell}>
            <div className={styles.grid}>
              <div className={styles.sectionMark}>
                <p className={styles.sectionNo}>05</p>
                <p className={styles.sectionLabel}>Figures</p>
              </div>
              <div className={styles.figuresIntro}>
                <h2 className={styles.h2} id="figures-title">
                  Four numbers we are prepared to publish.
                </h2>
                <p className={styles.body}>
                  Taken from the 2025 delivery ledger and the mill&rsquo;s own
                  monthly returns. They are audited by nobody. They are here
                  because a merchant who will not print a number is asking you
                  to take the rest on trust.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.shell}>
            <ul className={styles.figureRow}>
              {FIGURES.map((f) => (
                <li className={styles.figureCell} key={f.label}>
                  <p className={styles.figureValue}>
                    {f.value}
                    <span className={styles.figureUnit}>{f.unit}</span>
                  </p>
                  <p className={styles.figureLabel}>{f.label}</p>
                  <p className={styles.figureNote}>{f.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 06 ORDERING */}
        <section
          className={`${styles.section} ${styles.sectionInk}`}
          id="ordering"
          aria-labelledby="ordering-title"
        >
          <div className={styles.shell}>
            <div className={styles.grid}>
              <div className={styles.sectionMark}>
                <p className={styles.sectionNo}>06</p>
                <p className={styles.sectionLabel}>Ordering</p>
              </div>
              <div className={styles.orderIntro}>
                <h2 className={styles.h2} id="ordering-title">
                  The sample box first, the order second.
                </h2>
                <p className={styles.body}>
                  Nobody should buy 8 000 sheets from a screen. The box holds
                  every shade in every weight we stock, cut to A6 and bound at
                  the corner, and it is the fastest way to settle an argument
                  about warmth.
                </p>
                <div className={styles.orderActions}>
                  <a className={styles.buttonFilled} href="#delivery">
                    Order the sample box, CHF 24
                  </a>
                  <a className={styles.buttonPlain} href="tel:+41522140790">
                    Or call 052 214 07 90
                  </a>
                </div>
              </div>
              <div className={styles.orderCut}>
                <div className={styles.orderCutField}>
                  <Figure
                    slug="bogen-ream-cutout"
                    cutout
                    alt="A wrapped ream of paper with its label facing forward."
                    className={styles.cut}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.shell}>
            <ol className={styles.stepRow}>
              {ORDER_STEPS.map((step) => (
                <li className={styles.step} key={step.no}>
                  <p className={styles.stepNo}>{step.no}</p>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepBody}>{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 07 THE COUNTER */}
        <section className={styles.section} aria-labelledby="people-title">
          <div className={styles.shell}>
            <div className={styles.grid}>
              <div className={styles.sectionMark}>
                <p className={styles.sectionNo}>07</p>
                <p className={styles.sectionLabel}>The counter</p>
              </div>
              <figure className={styles.portraitFrame}>
                <Figure
                  slug="bogen-merchant"
                  alt="Ilse Brander, the merchant, standing at the cutting bench."
                  className={styles.portrait}
                />
              </figure>
              <div className={styles.peopleBody}>
                <h2 className={styles.h2} id="people-title">
                  Four people, one telephone line.
                </h2>
                <blockquote className={styles.quote}>
                  <p className={styles.quoteText}>
                    I have sold the same eleven papers for twenty-eight years.
                    What changes is the work people bring to them, and that is
                    the interesting part.
                  </p>
                  <footer className={styles.quoteAttr}>
                    Ilse Brander, merchant
                  </footer>
                </blockquote>
                <dl className={styles.teamList}>
                  {TEAM.map(([name, role]) => (
                    <div className={styles.teamRow} key={name}>
                      <dt className={styles.teamName}>{name}</dt>
                      <dd className={styles.teamRole}>{role}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* 08 DELIVERY */}
        <section
          className={`${styles.section} ${styles.sectionPale}`}
          id="delivery"
          aria-labelledby="delivery-title"
        >
          <div className={styles.shell}>
            <div className={styles.grid}>
              <div className={styles.sectionMark}>
                <p className={styles.sectionNo}>08</p>
                <p className={styles.sectionLabel}>Delivery</p>
              </div>
              <div className={styles.deliveryIntro}>
                <h2 className={styles.h2} id="delivery-title">
                  Five zones, one van, no surprises on the invoice.
                </h2>
                <p className={styles.body}>
                  Cut-off is the time an order must be confirmed on the day it
                  is to be loaded. Anything over 300 kg goes by pallet carrier
                  and is quoted before it leaves.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.shell}>
            {/* A table by role, a grid by layout: no rules, no cell edges. */}
            <div
              className={styles.zoneTable}
              role="table"
              aria-label="Delivery zones"
            >
              <div className={styles.zoneHead} role="row">
                <p className={styles.zoneHeadCell} role="columnheader">
                  Zone
                </p>
                <p className={styles.zoneHeadCell} role="columnheader">
                  Area covered
                </p>
                <p className={styles.zoneHeadCell} role="columnheader">
                  Cut-off
                </p>
                <p className={styles.zoneHeadCell} role="columnheader">
                  Arrival
                </p>
                <p className={styles.zoneHeadCell} role="columnheader">
                  Charge
                </p>
              </div>
              {ZONES.map((z) => (
                <div className={styles.zoneRow} role="row" key={z.zone}>
                  <p className={styles.zoneCode} role="cell">
                    {z.zone}
                  </p>
                  <p className={styles.zoneArea} role="cell">
                    {z.area}
                  </p>
                  <p className={styles.zoneNum} role="cell">
                    {z.cutoff}
                  </p>
                  <p className={styles.zoneCell} role="cell">
                    {z.arrival}
                  </p>
                  <p className={styles.zoneNum} role="cell">
                    {z.charge}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.shell}>
            <div className={styles.grid}>
              <dl className={styles.hoursList}>
                {HOURS.map(([day, time]) => (
                  <div className={styles.hoursRow} key={day}>
                    <dt className={styles.hoursDay}>{day}</dt>
                    <dd className={styles.hoursTime}>{time}</dd>
                  </div>
                ))}
              </dl>
              <div className={styles.findUs}>
                <h3 className={styles.h3}>Finding the warehouse</h3>
                <p className={styles.body}>
                  Lagerstrasse 41 sits behind the goods yard. From Winterthur
                  station take bus 3 to Zelgli, four stops, then walk 200 m
                  north. Loading bay two is signed for collection. There is no
                  customer parking on the ramp.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* COLOPHON */}
      <footer className={styles.footer}>
        <div className={styles.footField} aria-hidden="true">
          <TabbiedArtwork
            artwork={taper}
            palette={[INK, UMBER, WARM]}
            seed="bogen-foot-09"
            fit="grid"
            cellSize={64}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
        <div className={styles.footInner}>
          <div className={styles.shell}>
            {/* Hairline 2 of 2 */}
            <div className={styles.hairlineFoot} aria-hidden="true" />
            <div className={styles.grid}>
              <div className={styles.footMark}>
                <p className={styles.footWord}>Bogen Papier</p>
                <p className={styles.footSub}>
                  Papiergrosshandel
                  <br />
                  Established 1954
                </p>
              </div>
              <address className={styles.footAddress}>
                Lagerstrasse 41
                <br />
                8400 Winterthur
                <br />
                Switzerland
              </address>
              <div className={styles.footContact}>
                <p className={styles.footLine}>052 214 07 90</p>
                <p className={styles.footLine}>
                  <a className={styles.footLink} href="mailto:kontakt@bogenpapier.ch">
                    kontakt@bogenpapier.ch
                  </a>
                </p>
                <p className={styles.footLine}>VAT CHE-114.702.338</p>
              </div>
              <p className={styles.colophon}>
                Set in Inter. Fields drawn with the Tabbied artwork Taper, a
                scale of squares growing one step at a time, used here for the
                weight ramp. Photography by Roman Keller, 2025. Prices valid to
                31 December 2026.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
