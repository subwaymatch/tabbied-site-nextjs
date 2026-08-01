import { TabbiedArtwork } from 'tabbied/react';
import { gutter, kern } from 'tabbied/artworks';
import { Figure } from 'components/Figure';
import styles from './grotesk-foundry.module.css';

export const metadata = {
  title: 'Grotesk Type Co. — Independent Type Foundry, Basel',
  description:
    'Seven families. Seventy-four styles. One opinion. Grotesk Type Co. cuts sturdy sans-serifs above a print shop in Basel. Specimens, licensing, and no soft edges.',
};

const PAPER = '#F4F1EC';
const INK = '#111111';
const RED = '#D63515';
const STONE = '#B9B3A8';
const ASH = '#8A857C';
const SOOT = '#2E2B27';

const FAMILIES = [
  {
    no: '01',
    name: 'Ledger Grotesk',
    styles: 18,
    year: '2016',
    optical: 'Text · Display',
    status: 'Shipping',
  },
  {
    no: '02',
    name: 'Sechs Condensed',
    styles: 10,
    year: '2018',
    optical: 'Poster',
    status: 'Shipping',
  },
  {
    no: '03',
    name: 'Kilo Mono',
    styles: 8,
    year: '2019',
    optical: 'Code · Caption',
    status: 'Shipping',
  },
  {
    no: '04',
    name: 'Paragon Text',
    styles: 12,
    year: '2021',
    optical: 'Text',
    status: 'Shipping',
  },
  {
    no: '05',
    name: 'Brass Poster',
    styles: 6,
    year: '2022',
    optical: 'Display',
    status: 'Shipping',
  },
  {
    no: '06',
    name: 'Ronde Display',
    styles: 4,
    year: '2024',
    optical: 'Display',
    status: 'Cutting',
  },
  {
    no: '07',
    name: 'Quorum Sans',
    styles: 16,
    year: '2026',
    optical: 'Text · Display',
    status: 'Drawing',
  },
];

const MANIFESTO = [
  'We draw letters. We do not draw attention.',
  'Kerning is not a preference. It is a moral position.',
  'Every family ships with tabular figures, or it does not ship.',
  'A typeface that only works at 200 px is a poster, not a tool.',
  'Hairline to Black. No regrets in between.',
];

const WATERFALL = [
  { size: 'wf1', label: '96', text: 'Hamburgevons' },
  { size: 'wf2', label: '64', text: 'Hamburgevons quickly' },
  { size: 'wf3', label: '44', text: 'Hamburgevons quickly judged' },
  { size: 'wf4', label: '30', text: 'Hamburgevons quickly judged the vexed' },
  {
    size: 'wf5',
    label: '20',
    text: 'Hamburgevons quickly judged the vexed prize on file',
  },
  {
    size: 'wf6',
    label: '14',
    text: 'Hamburgevons quickly judged the vexed prize on file — then set it again, tighter',
  },
];

const MONOFALL = [
  { size: 'wf2', label: '64', text: '0123456789 —> OK' },
  { size: 'wf3', label: '44', text: 'grep -R "soft" ./fonts && rm' },
  { size: 'wf4', label: '30', text: 'kilo --tabular --lining --no-mercy' },
  {
    size: 'wf5',
    label: '20',
    text: 'diff proof_004.pdf proof_005.pdf # the R is fixed',
  },
];

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').concat(['Æ', 'Ø', 'ß', '&']);

const PROCESS_STEPS = [
  {
    no: '001',
    verb: 'Draw',
    body: 'Pencil first. A skeleton earns its place on paper before it touches Bézier handles. Most sketches die here. Good.',
  },
  {
    no: '002',
    verb: 'Cut',
    body: 'Every weight is drawn, not interpolated and forgiven. Masters at Hairline, Regular, and Black; the axis is checked at nine stops.',
  },
  {
    no: '003',
    verb: 'Proof',
    body: 'On the Korrex, at 6 pt and at 12 line, on the same paper stock our licences are printed on. If it fails on paper it fails.',
  },
  {
    no: '004',
    verb: 'Ship',
    body: 'OTF, WOFF2, variable. Hinted by hand where it matters, left alone where it does not. Release notes in plain language.',
  },
];

const PRESS_PROPS = [
  {
    slug: 'grotesk-block-cutout',
    alt: 'Carved wooden letter block for letterpress printing',
    name: 'Wood block, 12-line',
    note: 'Cut 1911. Still sharper than your rendering stack.',
    palette: [PAPER, SOOT, STONE],
    seed: 'gk-prop-a',
  },
  {
    slug: 'grotesk-stick-cutout',
    alt: 'Brass composing stick holding a line of metal type',
    name: 'Composing stick',
    note: 'Where letter-spacing was a physical act with consequences.',
    palette: [PAPER, ASH, STONE],
    seed: 'gk-prop-b',
  },
  {
    slug: 'grotesk-specimen-cutout',
    alt: 'Clothbound type specimen book with an embossed cover',
    name: 'Specimen No. 4',
    note: '224 pages, one red page. Sold out twice. Reprinting never.',
    palette: [PAPER, SOOT, ASH],
    seed: 'gk-prop-c',
  },
];

const LICENSES = [
  {
    tier: 'Print & Desktop',
    price: '€60',
    unit: 'per style',
    alt: '€340 per family',
    terms: [
      'OTF + variable, all figures sets',
      'Up to 5 workstations',
      'Logos, packaging, print runs — unlimited',
      'Free updates, forever',
    ],
  },
  {
    tier: 'Web',
    price: '€120',
    unit: 'per family / year',
    alt: 'self-hosted WOFF2',
    terms: [
      'Subset builder included',
      'Up to 500 k pageviews / month',
      'No tracking pixel. We do not care where you deploy',
      'Cancel any time; files stop, opinions remain',
    ],
  },
  {
    tier: 'App & OEM',
    price: 'Ask',
    unit: 'bring a budget',
    alt: 'quoted per project',
    terms: [
      'Embedding, devices, broadcast',
      'Custom cuts and exclusivity windows',
      'We answer email within one working day',
      'We say no more often than yes',
    ],
  },
];

const FAQ_RULES = [
  ['Can we get it free for exposure?', 'No.'],
  ['Do you do scripts?', 'Ronde is as far as we bend.'],
  ['Will you widen the L?', 'The L is correct.'],
  ['Student discount?', 'Yes — 60 %, no questions, valid ID.'],
];

export default function GroteskFoundryPage() {
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
        href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,100..900;1,100..900&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
      />

      <header className={styles.topbar}>
        <p className={styles.wordmark}>
          GROTESK<span className={styles.tm}>™</span>
        </p>
        <nav aria-label="Sections" className={styles.topnav}>
          <a href="#index">Index</a>
          <a href="#specimens">Specimens</a>
          <a href="#studio">Studio</a>
          <a href="#licensing">Licensing</a>
        </nav>
        <p className={styles.topmeta}>BASEL · EST. MMXVI</p>
      </header>

      <main>
        {/* 00 — HERO */}
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroField} aria-hidden="true">
            <TabbiedArtwork
              artwork={kern}
              palette={[PAPER, INK, STONE, ASH]}
              seed="gk-hero-04"
              fit="grid"
              cellSize={118}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={styles.heroScrim} aria-hidden="true" />
          <h1 id="hero-title" className={styles.heroWord}>
            <span className={styles.heroLine}>GROT</span>
            <span className={styles.heroLine}>
              ESK<span className={styles.heroStop}>.</span>
            </span>
          </h1>
          <p className={styles.heroTag}>
            Seven families cut above a print shop in Basel.
          </p>
          <div className={styles.heroFoot}>
            <p className={styles.heroDef}>
              grotesk <em>(n.)</em> — a letter stripped of serifs; a foundry
              stripped of patience.
            </p>
            <p className={styles.heroCount}>
              07 FAMILIES / 74 STYLES / 1 OPINION
            </p>
          </div>
        </section>

        {/* 01 — MANIFESTO */}
        <section className={styles.section} aria-labelledby="manifesto-title">
          <div className={styles.secHead}>
            <span className={styles.secNo}>01</span>
            <h2 id="manifesto-title" className={styles.secTitle}>
              Position
            </h2>
          </div>
          <ul className={styles.manifesto}>
            {MANIFESTO.map((line, i) => (
              <li key={line}>
                <span className={styles.manifestoNo}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {line}
              </li>
            ))}
          </ul>
        </section>

        {/* 02 — INDEX */}
        <section
          id="index"
          className={styles.section}
          aria-labelledby="index-title"
        >
          <div className={styles.secHead}>
            <span className={styles.secNo}>02</span>
            <h2 id="index-title" className={styles.secTitle}>
              Foundry index
            </h2>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.index}>
              <thead>
                <tr>
                  <th scope="col">№</th>
                  <th scope="col">Family</th>
                  <th scope="col">Styles</th>
                  <th scope="col">Year</th>
                  <th scope="col">Optical</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {FAMILIES.map((f) => (
                  <tr key={f.no}>
                    <td className={styles.cellMono}>{f.no}</td>
                    <td className={styles.cellName}>{f.name}</td>
                    <td className={styles.cellMono}>{f.styles}</td>
                    <td className={styles.cellMono}>{f.year}</td>
                    <td>{f.optical}</td>
                    <td className={styles.cellMono}>
                      {f.status === 'Shipping' ? (
                        f.status
                      ) : (
                        <em className={styles.wip}>{f.status}</em>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={styles.tableNote}>
            Hover a row: that is what a clean proof feels like. Families in{' '}
            <em>Cutting</em> or <em>Drawing</em> can be reserved by mail.
          </p>
        </section>

        {/* DIVIDER BAND */}
        <div className={styles.inkBand} aria-hidden="true">
          <TabbiedArtwork
            artwork={gutter}
            palette={[INK, PAPER, STONE, ASH]}
            seed="gk-band-02"
            fit="grid"
            cellSize={46}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>

        {/* 03 — SPECIMENS */}
        <section
          id="specimens"
          className={styles.section}
          aria-labelledby="specimens-title"
        >
          <div className={styles.secHead}>
            <span className={styles.secNo}>03</span>
            <h2 id="specimens-title" className={styles.secTitle}>
              Specimens
            </h2>
          </div>

          <article className={styles.feature}>
            <header className={styles.featureHead}>
              <h3 className={styles.featureName}>Ledger Grotesk</h3>
              <p className={styles.featureMeta}>
                18 STYLES · HAIRLINE—BLACK · 2016, REVISED 2023
              </p>
            </header>
            <p className={styles.featureBlurb}>
              Our workhorse. Drawn for annual reports that refuse to whisper.
              The a is double-storey, the G has a spur, and the numerals line up
              like a ledger — hence the name, obviously.
            </p>
            <div className={styles.waterfall} aria-label="Ledger Grotesk size waterfall">
              {WATERFALL.map((row) => (
                <p key={row.label} className={styles.wfRow}>
                  <span className={styles.wfLabel}>{row.label}</span>
                  <span className={`${styles.wfText} ${styles[row.size]}`}>
                    {row.text}
                  </span>
                </p>
              ))}
            </div>
          </article>

          <article className={styles.feature}>
            <header className={styles.featureHead}>
              <h3 className={`${styles.featureName} ${styles.featureMono}`}>
                Kilo Mono
              </h3>
              <p className={styles.featureMeta}>
                8 STYLES · TABULAR EVERYTHING · 2019
              </p>
            </header>
            <p className={styles.featureBlurb}>
              A monospace that admits it is one. No cute slashed zero debate:
              you get both, as stylistic sets, and you will pick the dotted one.
            </p>
            <div className={styles.waterfall} aria-label="Kilo Mono size waterfall">
              {MONOFALL.map((row) => (
                <p key={row.label} className={styles.wfRow}>
                  <span className={styles.wfLabel}>{row.label}</span>
                  <span
                    className={`${styles.wfText} ${styles.wfMonoText} ${styles[row.size]}`}
                  >
                    {row.text}
                  </span>
                </p>
              ))}
            </div>
          </article>

          <div className={styles.glyphHead}>
            <h3 className={styles.glyphTitle}>A—Z, once, loudly</h3>
            <p className={styles.glyphNote}>
              Ledger Grotesk Black. One letter is set in red. It is the R. The R
              took eleven months.
            </p>
          </div>
          <ul className={styles.glyphRun} aria-label="Alphabet glyph run">
            {GLYPHS.map((g) => (
              <li
                key={g}
                className={g === 'R' ? styles.glyphRed : undefined}
              >
                {g}
              </li>
            ))}
          </ul>
        </section>

        {/* 04 — STUDIO */}
        <section
          id="studio"
          className={styles.section}
          aria-labelledby="studio-title"
        >
          <div className={styles.secHead}>
            <span className={styles.secNo}>04</span>
            <h2 id="studio-title" className={styles.secTitle}>
              The studio
            </h2>
          </div>
          <div className={styles.studioHeroWrap}>
            <Figure
              slug="grotesk-hero"
              alt="The Grotesk letterpress studio photographed straight on: type cabinets, a proofing press, and pinned proof sheets"
              priority
              className={styles.coverImg}
            />
          </div>
          <div className={styles.studioCols}>
            <div className={styles.studioText}>
              <p>
                Grotesk Type Co. occupies the third floor at 41 Setzergasse,
                above a print shop that still smells of solvent at eight in the
                morning. Two of us draw, one of us engineers, all of us proof.
                The landlord prints our specimens at cost; we set his invoices
                for free. This arrangement has outlasted three of our
                competitors.
              </p>
              <p>
                We bought the Korrex proofing press in 2017 from a retiring
                compositor who made us promise to use it. We use it weekly.
                Digital outlines that have never been dragged across paper have
                a certain smugness we do not tolerate in the catalogue.
              </p>
              <p>
                Visitors are welcome on Friday afternoons. Bring printed
                matter. Coffee is black; the small talk is about counters.
              </p>
            </div>
            <dl className={styles.studioFacts}>
              <div>
                <dt>Founded</dt>
                <dd>2016</dd>
              </div>
              <div>
                <dt>People</dt>
                <dd>3 + one press</dd>
              </div>
              <div>
                <dt>Rejected sketches</dt>
                <dd>1 118 and counting</dd>
              </div>
              <div>
                <dt>Open studio</dt>
                <dd>Fridays 14—18</dd>
              </div>
            </dl>
          </div>
          <div className={styles.studioPair}>
            <figure className={styles.studioFig}>
              <Figure
                slug="grotesk-press"
                alt="Close view of the proofing press cylinder with a freshly pulled specimen sheet"
                className={styles.coverImg}
              />
              <figcaption>The Korrex. Weekly, as promised.</figcaption>
            </figure>
            <figure className={styles.studioFig}>
              <Figure
                slug="grotesk-wall"
                alt="A wall of pinned proof sheets, all black on white except a single red print"
                className={styles.coverImg}
              />
              <figcaption>Proof wall. One red per wall — house rule.</figcaption>
            </figure>
          </div>
        </section>

        {/* 05 — PROCESS */}
        <section
          id="process"
          className={styles.section}
          aria-labelledby="process-title"
        >
          <div className={styles.secHead}>
            <span className={styles.secNo}>05</span>
            <h2 id="process-title" className={styles.secTitle}>
              How a family gets made
            </h2>
          </div>
          <ol className={styles.steps}>
            {PROCESS_STEPS.map((s) => (
              <li key={s.no} className={styles.step}>
                <span className={styles.stepNo}>{s.no}</span>
                <h3 className={styles.stepVerb}>{s.verb}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
          <div className={styles.propsRow}>
            {PRESS_PROPS.map((p) => (
              <figure key={p.slug} className={styles.propCard}>
                <div className={styles.propTile}>
                  <TabbiedArtwork
                    artwork={gutter}
                    palette={p.palette}
                    seed={p.seed}
                    fit="grid"
                    cellSize={52}
                    style={{ position: 'absolute', inset: 0, opacity: 0.9 }}
                  />
                  <Figure
                    slug={p.slug}
                    cutout
                    alt={p.alt}
                    className={styles.propImg}
                  />
                </div>
                <figcaption>
                  <strong>{p.name}</strong>
                  <span>{p.note}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <figure className={styles.caseFig}>
            <Figure
              slug="grotesk-case"
              alt="A California job case of metal type photographed from directly above"
              className={styles.coverImg}
            />
            <figcaption>
              The case that taught us our sorting order. Lowercase e wins,
              always has.
            </figcaption>
          </figure>
        </section>

        {/* 06 — LICENSING */}
        <section
          id="licensing"
          className={styles.section}
          aria-labelledby="licensing-title"
        >
          <div className={styles.secHead}>
            <span className={styles.secNo}>06</span>
            <h2 id="licensing-title" className={styles.secTitle}>
              Licensing
            </h2>
          </div>
          <p className={styles.licLede}>
            Three tiers. Plain language. The EULA fits on two pages because we
            typeset it properly.
          </p>
          <div className={styles.licField}>
            <TabbiedArtwork
              artwork={gutter}
              palette={[SOOT, STONE, ASH, PAPER]}
              seed="gk-lic-06"
              fit="grid"
              cellSize={54}
              style={{ position: 'absolute', inset: 0, opacity: 0.85 }}
            />
            <div className={styles.licGrid}>
              {LICENSES.map((l) => (
                <article key={l.tier} className={styles.licCard}>
                  <h3 className={styles.licTier}>{l.tier}</h3>
                  <p className={styles.licPrice}>
                    {l.price} <span>{l.unit}</span>
                  </p>
                  <p className={styles.licAlt}>{l.alt}</p>
                  <ul>
                    {l.terms.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
          <dl className={styles.rules}>
            {FAQ_RULES.map(([q, a]) => (
              <div key={q} className={styles.rule}>
                <dt>{q}</dt>
                <dd>{a}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.licCta}>
            <a href="#colophon" className={styles.ctaLink}>
              Write to the foundry —&gt; trials@grotesk.example
            </a>
          </p>
        </section>
      </main>

      {/* FOOTER / COLOPHON */}
      <footer id="colophon" className={styles.footer}>
        <div className={styles.footerField} aria-hidden="true">
          <TabbiedArtwork
            artwork={kern}
            palette={[SOOT, PAPER, STONE, RED]}
            seed="gk-foot-09"
            fit="grid"
            cellSize={48}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
        <div className={styles.colophon}>
          <p className={styles.colWordmark}>GROTESK™</p>
          <div className={styles.colCols}>
            <div>
              <h2 className={styles.colHead}>Colophon</h2>
              <p>
                This page is set in Ledger Grotesk and Kilo Mono, which do not
                exist, rendered in Archivo and Space Mono, which do. Two
                patterns carry it: “Kern”, two letterform blocks tucked
                together, at poster scale behind the masthead and down here;
                and “Gutter”, a page grid repeated spread after spread, for the
                bands and the licence field. Both felt on the nose in the best
                way.
              </p>
            </div>
            <div>
              <h2 className={styles.colHead}>Foundry</h2>
              <address className={styles.colAddress}>
                Grotesk Type Co.
                <br />
                Loft 3, 41 Setzergasse
                <br />
                Basel, Switzerland
                <br />
                trials@grotesk.example
              </address>
            </div>
            <div>
              <h2 className={styles.colHead}>Elsewhere</h2>
              <ul className={styles.colList}>
                <li>
                  <a href="#index">Complete index</a>
                </li>
                <li>
                  <a href="#specimens">Printed specimens</a>
                </li>
                <li>
                  <a href="#licensing">EULA, two pages</a>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.colBase}>
            <p>© MMXXVI Grotesk Type Co. No soft edges.</p>
            <p className={styles.tabbiedCredit}>
              Patterns by{' '}
              <a
                href="https://tabbied.com"
                target="_blank"
                rel="noreferrer noopener"
              >
                Tabbied
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
