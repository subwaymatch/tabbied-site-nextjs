import { TabbiedPattern } from 'tabbied/react';
import { gloaming, scumble } from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import styles from './maison-ambre.module.css';

export const metadata = {
  title: 'Maison Ambre · Parfums composés à Grasse',
  description:
    'Maison Ambre composes perfumes in small numbered editions: three eaux, one nose, and an atelier above the old lavender exchange. Founded 1987.',
};

const NOIR = '#141210';
const GOLD = '#C9A227';
const CHAMPAGNE = '#E8D9B0';
const BRONZE = '#8C6A2F';
const IVORY = '#FBF6EA';
const TAUPE = '#5A4632';

const EAUX = [
  {
    numeral: 'I',
    name: 'Ambre Premier',
    form: 'Eau de parfum · 100 ml',
    price: '€210',
    slug: 'ambre-bottle-1-cutout',
    alt: 'Tall amber glass flacon with a brushed gold cap',
    line: 'The house signature. Amber warmed slowly, the way a room holds the last hour of sun.',
    notes: {
      tete: 'Bergamot, pink pepper',
      coeur: 'Labdanum, rose de mai',
      fond: 'Amber accord, vanilla, cedar',
    },
    seed: 'ma-eau-1',
    palette: [NOIR, GOLD, TAUPE, CHAMPAGNE],
  },
  {
    numeral: 'II',
    name: 'Fumée Noire',
    form: 'Eau de parfum · 75 ml',
    price: '€185',
    slug: 'ambre-bottle-2-cutout',
    alt: 'Round smoked-glass flacon with a black lacquer stopper',
    line: 'Smoke without fire. Black tea poured in a cold chapel; leather gloves left on the pew.',
    notes: {
      tete: 'Black tea, cade wood',
      coeur: 'Iris root, suede accord',
      fond: 'Birch tar, tonka bean',
    },
    seed: 'ma-eau-2',
    palette: [NOIR, TAUPE, BRONZE, CHAMPAGNE],
  },
  {
    numeral: 'III',
    name: 'Voyage d’Or',
    form: 'Parfum de voyage · 3 × 10 ml',
    price: '€95',
    slug: 'ambre-bottle-3-cutout',
    alt: 'Slender gold travel atomiser, cap removed',
    line: 'The bright one. Citrus at altitude, honeyed blossom below, made to be refilled, never finished.',
    notes: {
      tete: 'Yuzu, néroli',
      coeur: 'Orange blossom, acacia honey',
      fond: 'Blond woods, white musk',
    },
    seed: 'ma-eau-3',
    palette: [NOIR, GOLD, BRONZE, IVORY],
  },
];

const INGREDIENTS = [
  ['Labdanum', 'Crete · resin, sun-split'],
  ['Vanilla', 'Madagascar · pod, cured 9 months'],
  ['Iris', 'Tuscany · rhizome, aged 3 years'],
  ['Rose de mai', 'Grasse · picked before seven'],
  ['Cedar', 'Atlas · heartwood only'],
  ['Yuzu', 'Shikoku · cold-pressed peel'],
];

const ATELIER_STEPS = [
  {
    numeral: 'I',
    title: 'Composition',
    body: 'Hélène works at the organ each morning between eight and eleven, when her nose is honest. A formula may hold forty materials; most are dismissed by the tenth day.',
  },
  {
    numeral: 'II',
    title: 'Macération',
    body: 'The concentrate rests in alcohol for forty days in the dark, at cellar temperature. Nothing is hurried; the materials must agree with each other before we bottle them.',
  },
  {
    numeral: 'III',
    title: 'Glaçage',
    body: 'Chilled, filtered once through paper, never twice. A perfume over-polished loses its shadow, so we keep a little of the dusk in every flacon.',
  },
  {
    numeral: 'IV',
    title: 'Numérotation',
    body: 'Each edition is bottled by hand and numbered in pencil: batch, day, flacon. Edition sizes are small enough that we remember the weather when we made them.',
  },
];

const STOCKISTS = [
  {
    city: 'Grasse',
    lines: ['Maison Ambre · Atelier', '7 rue du Miel Doré', 'Tue – Sat · 10h – 18h'],
    note: 'Private visits by appointment',
  },
  {
    city: 'Paris',
    lines: ['Comptoir de la Brume', '14 passage des Orfèvres', 'Mon – Sat · 11h – 19h'],
    note: 'Full collection & engraving',
  },
  {
    city: 'Kyoto',
    lines: ['Salon Hakuro', '2-9 Kagerō-dōri, Higashiyama', 'Thu – Mon · 12h – 18h'],
    note: 'Eaux I and II only',
  },
];

export default function MaisonAmbrePage() {
  return (
    <div className={styles.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Jost:wght@200..500&display=swap"
      />

      <header className={styles.masthead}>
        <p className={styles.mastheadOrigin}>Grasse · Paris · Kyoto</p>
        <p className={styles.wordmark}>
          <span className={styles.wordmarkRule} aria-hidden="true" />
          Maison&nbsp;Ambre
          <span className={styles.wordmarkRule} aria-hidden="true" />
        </p>
        <nav aria-label="Sections" className={styles.mastheadNav}>
          <a href="#maison">La Maison</a>
          <a href="#eaux">Les Eaux</a>
          <a href="#nez">Le Nez</a>
          <a href="#atelier">L’Atelier</a>
          <a href="#visites">Visites</a>
        </nav>
      </header>

      <main>
        {/* ------------------------------------------------------------ hero */}
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroImage}>
            <Figure
              slug="ambre-hero"
              alt="An amber perfume bottle on dark marble, a thread of smoke rising behind it"
              priority
            />
          </div>
          <div className={styles.heroMist} aria-hidden="true">
            <TabbiedPattern
              pattern={scumble}
              palette={[NOIR, BRONZE, GOLD, TAUPE]}
              seed="ma-hero-mist-06"
              fit="grid"
              cellSize={30}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={styles.heroVeil} aria-hidden="true" />
          <div className={styles.heroContent}>
            <p className={styles.heroOverline}>Parfums composés à Grasse · depuis MCMLXXXVII</p>
            <h1 id="hero-title" className={styles.heroTitle}>
              Light, held
              <br />
              <em>in shadow</em>
            </h1>
            <p className={styles.heroLine}>
              Three eaux. One nose. Small numbered editions,
              <br />
              composed above the old lavender exchange.
            </p>
            <a href="#eaux" className={styles.heroCue}>
              Descendre
              <span aria-hidden="true"> ↓</span>
            </a>
          </div>
        </section>

        {/* ------------------------------------------------------- la maison */}
        <section id="maison" className={styles.maison} aria-labelledby="maison-title">
          <header className={styles.sectionHead}>
            <span className={styles.sectionNumeral} aria-hidden="true">
              I
            </span>
            <h2 id="maison-title">La Maison</h2>
            <p className={styles.sectionSub}>Founded 1987 · Independent since</p>
          </header>
          <div className={styles.maisonColumns}>
            <p className={styles.maisonLead}>
              <span className={styles.dropCap} aria-hidden="true">
                M
              </span>
              aison Ambre began in a single rented room above the old lavender exchange in
              Grasse, with a copper still, a north-facing window, and the conviction that a
              perfume should behave like dusk: arriving slowly, and leaving something behind.
            </p>
            <div className={styles.maisonBody}>
              <p>
                We have grown carefully since: one atelier, three eaux, and editions small
                enough to number in pencil. We do not launch by season. A composition joins the
                house when it is finished, which has happened eleven times in thirty-nine years,
                and been reversed eight.
              </p>
              <p>
                What remains of each attempt is kept in the archive, four hundred amber vials
                we call <i>la mémoire</i>. Visitors may smell them. Nothing in the archive is
                for sale, which is precisely why it matters.
              </p>
            </div>
          </div>
          <dl className={styles.maisonFigures}>
            <div>
              <dt>Editions composed</dt>
              <dd>XI</dd>
            </div>
            <div>
              <dt>Kept in the collection</dt>
              <dd>III</dd>
            </div>
            <div>
              <dt>Materials in the organ</dt>
              <dd>412</dd>
            </div>
            <div>
              <dt>Rooms in the atelier</dt>
              <dd>IV</dd>
            </div>
          </dl>
        </section>

        {/* ------------------------------------------------------- les eaux */}
        <section id="eaux" className={styles.eaux} aria-labelledby="eaux-title">
          <div className={styles.eauxField} aria-hidden="true">
            <TabbiedPattern
              pattern={scumble}
              palette={[NOIR, TAUPE, BRONZE, GOLD]}
              seed="ma-eaux-field-03"
              fit="grid"
              cellSize={34}
              style={{ position: 'absolute', inset: 0 }}
            />
            <div className={styles.eauxFieldScrim} />
          </div>
          <header className={styles.sectionHead}>
            <span className={styles.sectionNumeral} aria-hidden="true">
              II
            </span>
            <h2 id="eaux-title">Les Trois Eaux</h2>
            <p className={styles.sectionSub}>The collection entire; nothing else is made</p>
          </header>
          <p className={styles.eauxHint} aria-hidden="true">
            Faites glisser <span>⟶</span>
          </p>
          <div className={styles.eauxRow} role="list">
            {EAUX.map((eau) => (
              <article key={eau.name} className={styles.eauCard} role="listitem">
                <div className={styles.eauStage}>
                  <div className={styles.eauPattern} aria-hidden="true">
                    <TabbiedPattern
                      pattern={gloaming}
                      palette={eau.palette}
                      seed={eau.seed}
                      fit="cover"
                      style={{ position: 'absolute', inset: 0, opacity: 0.85 }}
                    />
                  </div>
                  <div className={styles.eauBottle}>
                    <Figure slug={eau.slug} cutout alt={eau.alt} />
                  </div>
                  <span className={styles.eauNumeral} aria-hidden="true">
                    {eau.numeral}
                  </span>
                </div>
                <div className={styles.eauBody}>
                  <h3>{eau.name}</h3>
                  <p className={styles.eauForm}>{eau.form}</p>
                  <p className={styles.eauLine}>{eau.line}</p>
                  <dl className={styles.eauNotes}>
                    <div>
                      <dt>Tête</dt>
                      <dd>{eau.notes.tete}</dd>
                    </div>
                    <div>
                      <dt>Cœur</dt>
                      <dd>{eau.notes.coeur}</dd>
                    </div>
                    <div>
                      <dt>Fond</dt>
                      <dd>{eau.notes.fond}</dd>
                    </div>
                  </dl>
                  <p className={styles.eauPrice}>{eau.price}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------ ingredient band */}
        <section className={styles.matieres} aria-labelledby="matieres-title">
          <div className={styles.matieresImage}>
            <Figure
              slug="ambre-ingredients"
              alt="A still life of amber resin, vanilla pods, and dried blossom on dark cloth"
            />
          </div>
          <div className={styles.matieresPanel}>
            <h2 id="matieres-title" className={styles.matieresTitle}>
              Les Matières
            </h2>
            <p className={styles.matieresLine}>
              Bought from growers we can name, in quantities they can bear.
            </p>
            <dl className={styles.matieresList}>
              {INGREDIENTS.map(([name, origin]) => (
                <div key={name}>
                  <dt>{name}</dt>
                  <dd>{origin}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* --------------------------------------------------- archive band */}
        <aside className={styles.archive} aria-label="L’archive">
          <div className={styles.archiveField} aria-hidden="true">
            <TabbiedPattern
              pattern={gloaming}
              palette={[NOIR, BRONZE, GOLD, TAUPE]}
              seed="ma-archive-07"
              fit="grid"
              style={{ position: 'absolute', inset: 0 }}
            />
            <div className={styles.archiveScrim} />
          </div>
          <p className={styles.archiveLine}>
            <span className={styles.archiveLabel}>La mémoire</span>
            Four hundred amber vials, kept and never sold
          </p>
        </aside>

        {/* -------------------------------------------------------- le nez */}
        <section id="nez" className={styles.nez} aria-labelledby="nez-title">
          <header className={styles.sectionHead}>
            <span className={styles.sectionNumeral} aria-hidden="true">
              III
            </span>
            <h2 id="nez-title">Le Nez</h2>
            <p className={styles.sectionSub}>Hélène Verdier · perfumer since 1994</p>
          </header>
          <div className={styles.nezGrid}>
            <figure className={styles.nezPortrait}>
              <div className={styles.portraitFrame}>
                <Figure
                  slug="ambre-nose"
                  alt="Portrait of Hélène Verdier, silver chignon, black jacket, photographed against a charcoal wall"
                />
              </div>
              <figcaption>Hélène Verdier · atelier, Grasse</figcaption>
            </figure>
            <div className={styles.nezText}>
              <blockquote className={styles.nezQuote}>
                <p>
                  “A perfume is finished when removing one material ruins it, and not one
                  moment before. Most of my work is removal.”
                </p>
              </blockquote>
              <p>
                Hélène Verdier trained beside her grandmother’s copper still and spent a decade
                matching lost scents for the great houses before Maison Ambre gave her the one
                thing the great houses could not: time. She has composed every edition since
                1994, declines all briefs, and keeps office hours only for the archive.
              </p>
              <p>
                Her rule for the house is unchanged in three decades: <i>one nose, no
                committees, no focus groups. A perfume is an opinion, not a poll.</i>
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ l'atelier */}
        <section id="atelier" className={styles.atelier} aria-labelledby="atelier-title">
          <header className={styles.sectionHead}>
            <span className={styles.sectionNumeral} aria-hidden="true">
              IV
            </span>
            <h2 id="atelier-title">L’Atelier</h2>
            <p className={styles.sectionSub}>Four movements, forty days</p>
          </header>
          <figure className={styles.atelierFigure}>
            <Figure
              slug="ambre-atelier"
              alt="The perfumer’s organ: tiered shelves of labelled amber vials in low light"
            />
            <figcaption>The organ, photographed at closing. 412 materials, one chair.</figcaption>
          </figure>
          <ol className={styles.atelierSteps}>
            {ATELIER_STEPS.map((step) => (
              <li key={step.numeral}>
                <span className={styles.stepNumeral} aria-hidden="true">
                  {step.numeral}
                </span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* -------------------------------------------------------- visites */}
        <section id="visites" className={styles.visites} aria-labelledby="visites-title">
          <header className={styles.sectionHead}>
            <span className={styles.sectionNumeral} aria-hidden="true">
              V
            </span>
            <h2 id="visites-title">Stockists &amp; Visites</h2>
            <p className={styles.sectionSub}>Found in few places, on purpose</p>
          </header>
          <div className={styles.stockistRow}>
            {STOCKISTS.map((stockist) => (
              <article key={stockist.city} className={styles.stockist}>
                <h3>{stockist.city}</h3>
                {stockist.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
                <p className={styles.stockistNote}>{stockist.note}</p>
              </article>
            ))}
          </div>
          <p className={styles.visitesCoda}>
            The atelier receives twelve visitors a week, in pairs, for the archive and a
            reading of the three eaux. Write to{' '}
            <a href="mailto:visites@maison-ambre.example">visites@maison-ambre.example</a>;
            allow us a fortnight to reply; we are few.
          </p>
        </section>
      </main>

      {/* -------------------------------------------------------------- footer */}
      <footer className={styles.footer}>
        <div className={styles.footerBand} aria-hidden="true">
          <TabbiedPattern
            pattern={gloaming}
            palette={[NOIR, BRONZE, GOLD]}
            seed="ma-footer-02"
            fit="grid"
            style={{ position: 'absolute', inset: 0, opacity: 0.9 }}
          />
        </div>
        <div className={styles.footerInner}>
          <p className={styles.footerMark}>Maison&nbsp;Ambre</p>
          <p className={styles.footerLine}>
            MCMLXXXVII to MMXXVI · A fictional house, faithfully imagined
          </p>
          <nav aria-label="Footer" className={styles.footerNav}>
            <a href="#maison">La Maison</a>
            <a href="#eaux">Les Eaux</a>
            <a href="#visites">Visites</a>
          </nav>
          <p className={styles.footerCredit}>
            Motifs de fumée, patterns by{' '}
            <a href="https://tabbied.com" rel="noopener">
              Tabbied
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
