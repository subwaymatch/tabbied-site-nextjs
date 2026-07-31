import { TabbiedArtwork } from 'tabbied/react';
import { karst } from 'tabbied/artworks';
import { Figure } from 'components/Figure';
import styles from './piquant-provisions.module.css';

export const metadata = {
  title: 'Piquant Provisions — Small-Batch Hot Sauce',
  description:
    'Fermented, wax-sealed, occasionally unreasonable. Small-batch hot sauce made the slow way in Port Alsey. Three sauces, one waiver.',
};

const INK = '#0F1A20';
const YOLK = '#F4D35E';
const MARIGOLD = '#EE964B';
const FLAME = '#F95738';
const BONE = '#EFE6DD';
const POOL = '#4C8FBD';

type Sauce = {
  num: string;
  name: string;
  tag: string;
  desc: string;
  heat: number;
  heatLabel: string;
  price: string;
  size: string;
  pairs: string;
  slug: string;
  alt: string;
  palette: string[];
  seed: string;
};

const SAUCES: Sauce[] = [
  {
    num: 'Batch № 01',
    name: 'First Alarm',
    tag: 'The everyday ripper',
    desc: 'Fermented jalapeño, tomatillo, and a hard squeeze of lime. Bright, green, and loud enough to open both eyes. This is the bottle that lives on the counter, not in the fridge door.',
    heat: 2,
    heatLabel: 'Polite burn',
    price: '$12',
    size: '150 ml',
    pairs: 'Fried eggs · tacos al pastor · cold pizza',
    slug: 'piquant-bottle-1-cutout',
    alt: 'Wax-sealed glass bottle of First Alarm hot sauce with a hand-drawn yellow label',
    palette: [YOLK, INK, MARIGOLD, BONE],
    seed: 'pq-lineup-01',
  },
  {
    num: 'Batch № 04',
    name: 'Deep Cut',
    tag: 'The slow burner',
    desc: 'Habanero and charred pineapple, aged nine weeks in a bourbon barrel we won in a bet. Sweet first, smoky second, then a long third act that keeps improving your posture.',
    heat: 4,
    heatLabel: 'Committed',
    price: '$14',
    size: '200 ml',
    pairs: 'Smash burgers · grilled corn · brave marinades',
    slug: 'piquant-bottle-2-cutout',
    alt: 'Squat jar of Deep Cut hot sauce tied with twine',
    palette: [MARIGOLD, INK, FLAME, YOLK],
    seed: 'pq-lineup-04',
  },
  {
    num: 'Batch № 07',
    name: 'Last Words',
    tag: 'Sign the waiver',
    desc: 'Scorpion pepper, smoked date, black garlic. Made once a season, 212 cases at a time, each numbered by hand while wearing two pairs of gloves. We are legally proud of it.',
    heat: 5,
    heatLabel: 'Famous last words',
    price: '$16',
    size: '100 ml',
    pairs: 'One drop per taco · dares · apologies',
    slug: 'piquant-chili-cutout',
    alt: 'A single glossy red scorpion chilli, stem up',
    palette: [FLAME, INK, YOLK, BONE],
    seed: 'pq-lineup-07',
  },
];

const HEAT_SCALE = [
  {
    level: 1,
    name: 'Whisper',
    copy: 'A rumor of warmth. Your grandmother could drink it. She has.',
  },
  {
    level: 2,
    name: 'Polite Burn',
    copy: 'Noticeable, friendly, gone in a minute. First Alarm lives here.',
  },
  {
    level: 3,
    name: 'Committed',
    copy: 'You reach for water and then, wisely, decide against making it worse.',
  },
  {
    level: 4,
    name: 'Slow Burner',
    copy: 'Deep Cut territory. Arrives late, stays long, tips generously.',
  },
  {
    level: 5,
    name: 'Last Words',
    copy: 'One drop. We mean it. The label says so in three languages.',
  },
];

const PROCESS = [
  {
    step: '01',
    title: 'The market run',
    copy: 'Every Thursday, 6 a.m., Beckoner Street market. We buy chillies by the crate from the same four growers we started with, and we squeeze every pepper like it owes us money.',
  },
  {
    step: '02',
    title: 'The ferment',
    copy: 'Three weeks minimum in salt brine, in crocks older than the business. Fermentation does the heavy lifting — depth, funk, the tang that vinegar-only sauces fake.',
  },
  {
    step: '03',
    title: 'The blend',
    copy: 'Small kettles, wooden spoons, a radio permanently tuned to the wrong station. Nothing thickened, nothing stabilised, nothing you cannot pronounce with your mouth on fire.',
  },
  {
    step: '04',
    title: 'Wax & number',
    copy: 'Every bottle dipped by hand and numbered in pencil. If the wax drips crooked, that is not a defect. That is provenance.',
  },
];

const STOCKISTS = [
  { shop: 'Marrow & Rind', city: 'Port Alsey', note: 'Full lineup + refills' },
  { shop: 'The Brine Room', city: 'Copperline', note: 'Ferments on tap' },
  { shop: 'Halbury General', city: 'Halbury', note: 'Batches 01 & 04' },
  { shop: 'Night Owl Grocer', city: 'Port Alsey', note: 'Open until 2 a.m.' },
  { shop: 'Sagemoor Deli', city: 'Sagemoor', note: 'Ask for the back shelf' },
  { shop: 'Westhollow Wine Co.', city: 'Westhollow', note: 'Pairing flights' },
  { shop: 'Kettle & Crate', city: 'Ferrow Bay', note: 'Gift boxes' },
  { shop: 'The Corner Torta', city: 'Copperline', note: 'On every table' },
];

const RECIPE_INGREDIENTS = [
  '8 small corn tortillas, doubled up',
  '450 g skirt steak, or mushrooms if it is that kind of week',
  'Deep Cut (№ 04), applied with confidence',
  '1 white onion, minced fine',
  'A fistful of cilantro, stems and all',
  '2 limes, quartered, non-negotiable',
  'Flaky salt, more than feels right',
];

const RECIPE_STEPS = [
  'Salt the steak an hour ahead. Watch a show. Ignore the group chat.',
  'Sear hard in a screaming pan, 3 minutes a side. Rest it as long as you seared it.',
  'Warm tortillas directly on the flame until they smell like a good decision.',
  'Slice against the grain, pile it on, top with onion and cilantro.',
  'Deep Cut in stripes, lime over everything, salt last. Eat standing up at the counter like you mean it.',
];

function HeatMeter({ level, label }: { level: number; label: string }) {
  return (
    <span
      className={styles.heatMeter}
      role="img"
      aria-label={`Heat level ${level} of 5 — ${label}`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={i < level ? `${styles.pip} ${styles.pipOn}` : styles.pip}
        />
      ))}
    </span>
  );
}

export default function PiquantProvisionsPage() {
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
        href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@400;500;700&display=swap"
      />

      <header className={styles.topbar}>
        <a href="#top" className={styles.brand}>
          Piquant<span className={styles.brandDot}>*</span>
        </a>
        <nav aria-label="Page sections" className={styles.nav}>
          <a href="#lineup">The Lineup</a>
          <a href="#heat">Heat Scale</a>
          <a href="#process">How It&rsquo;s Made</a>
          <a href="#recipe">Recipe</a>
          <a href="#stockists">Stockists</a>
        </nav>
        <a href="#wholesale" className={styles.topbarCta}>
          Wholesale
        </a>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- HERO */}
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroPattern}>
            <TabbiedArtwork
              artwork={karst}
              palette={[INK, YOLK, MARIGOLD, FLAME, POOL]}
              seed="pq-hero"
              fit="cover"
              style={{ position: 'absolute', inset: 0 }}
            />
            <div className={styles.heroScrim} aria-hidden="true" />
          </div>
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <p className={styles.heroKicker}>Small-batch hot sauce · Port Alsey</p>
              <h1 id="hero-title" className={styles.heroTitle}>
                <span className={styles.heroLine1}>Good food</span>
                <span className={styles.heroLine2}>deserves a little</span>
                <span className={styles.heroLine3}>danger.</span>
              </h1>
              <p className={styles.heroSub}>
                Fermented three weeks, bottled by hand, sealed in wax. Three
                sauces, five heat levels, zero apologies — well, one apology,
                but that was about Batch № 03 and we have all agreed to move on.
              </p>
              <div className={styles.heroActions}>
                <a href="#lineup" className={styles.btnPrimary}>
                  Meet the lineup
                </a>
                <a href="#stockists" className={styles.btnGhost}>
                  Find a bottle
                </a>
              </div>
            </div>
            <div className={styles.heroBottle}>
              <Figure
                slug="piquant-bottle-1-cutout"
                cutout
                alt="Wax-sealed bottle of First Alarm hot sauce, tilted, with drips of red wax down the neck"
                priority
                className={styles.heroBottleImg}
              />
              <p className={`${styles.sticker} ${styles.stickerBatch}`} aria-hidden="true">
                Small batch <strong>№ 7</strong>
              </p>
              <p className={`${styles.sticker} ${styles.stickerFerment}`} aria-hidden="true">
                21-day ferment
              </p>
            </div>
          </div>
        </section>

        <p className={styles.statusStrip}>
          Batch № 7 bottled Thursday &mdash; 212 cases &mdash; gone by Sunday,
          historically speaking
        </p>

        {/* -------------------------------------------------------- LINEUP */}
        <section id="lineup" className={styles.lineup} aria-labelledby="lineup-title">
          <div className={styles.sectionHead}>
            <p className={styles.sectionKicker}>The lineup</p>
            <h2 id="lineup-title" className={styles.sectionTitle}>
              Three sauces. No filler episodes.
            </h2>
          </div>
          <ul className={styles.sauceGrid}>
            {SAUCES.map((sauce) => (
              <li key={sauce.name} className={styles.sauceCard}>
                <div className={styles.sauceArt} style={{ backgroundColor: sauce.palette[0] }}>
                  <TabbiedArtwork
                    artwork={karst}
                    palette={sauce.palette}
                    seed={sauce.seed}
                    fit="grid"
                    cellSize={30}
                    style={{ position: 'absolute', inset: 0 }}
                  />
                  <Figure
                    slug={sauce.slug}
                    cutout
                    alt={sauce.alt}
                    className={styles.sauceCutout}
                  />
                  <p className={styles.saucePrice} aria-hidden="true">
                    {sauce.price}
                  </p>
                </div>
                <div className={styles.sauceBody}>
                  <p className={styles.sauceNum}>{sauce.num}</p>
                  <h3 className={styles.sauceName}>{sauce.name}</h3>
                  <p className={styles.sauceTag}>{sauce.tag}</p>
                  <p className={styles.sauceDesc}>{sauce.desc}</p>
                  <div className={styles.sauceHeatRow}>
                    <HeatMeter level={sauce.heat} label={sauce.heatLabel} />
                    <span className={styles.sauceHeatLabel}>{sauce.heatLabel}</span>
                  </div>
                  <dl className={styles.sauceMeta}>
                    <div>
                      <dt>Bottle</dt>
                      <dd>
                        {sauce.size} &middot; {sauce.price}
                      </dd>
                    </div>
                    <div>
                      <dt>Put it on</dt>
                      <dd>{sauce.pairs}</dd>
                    </div>
                  </dl>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------------------------------------------------- HEAT SCALE */}
        <section id="heat" className={styles.heat} aria-labelledby="heat-title">
          <div className={styles.heatInner}>
            <div className={styles.heatIntro}>
              <p className={styles.sectionKicker}>The heat scale</p>
              <h2 id="heat-title" className={styles.sectionTitle}>
                Calibrated by our own tears
              </h2>
              <p className={styles.heatLede}>
                Every batch is tasted by the same three people in the same order
                on the same stools. It is not science, but it is rigorous, and
                two of us have notarised the results.
              </p>
              <div className={styles.heatChili}>
                <Figure
                  slug="piquant-chili-cutout"
                  cutout
                  alt="A single bright red chilli with a curled green stem"
                  className={styles.heatChiliImg}
                />
              </div>
            </div>
            <ol className={styles.heatList}>
              {HEAT_SCALE.map((row) => (
                <li key={row.level} className={styles.heatRow}>
                  <span className={styles.heatLevel} aria-hidden="true">
                    {row.level}
                  </span>
                  <div className={styles.heatRowBody}>
                    <div className={styles.heatRowTop}>
                      <h3 className={styles.heatName}>{row.name}</h3>
                      <HeatMeter level={row.level} label={row.name} />
                    </div>
                    <p className={styles.heatCopy}>{row.copy}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ------------------------------------------------------- PROCESS */}
        <section id="process" className={styles.process} aria-labelledby="process-title">
          <div className={styles.sectionHead}>
            <p className={styles.sectionKicker}>How it&rsquo;s made</p>
            <h2 id="process-title" className={styles.sectionTitle}>
              Slow sauce, fast opinions
            </h2>
          </div>
          <div className={styles.processCollage}>
            <figure className={styles.processFigureA}>
              <Figure
                slug="piquant-hero"
                alt="A market stall stacked with crates of red, orange and green chillies, printed in riso style"
                className={styles.processImg}
              />
              <figcaption>Beckoner Street market, Thursday, before coffee.</figcaption>
            </figure>
            <figure className={styles.processFigureB}>
              <Figure
                slug="piquant-kitchen"
                alt="A big pot of red sauce bubbling on a kitchen range, steam rising"
                className={styles.processImg}
              />
              <figcaption>Kettle two, doing its loud little job.</figcaption>
            </figure>
            <div className={styles.processCrate}>
              <Figure
                slug="piquant-crate-cutout"
                cutout
                alt="A wooden crate piled high with fresh chillies"
                className={styles.processCrateImg}
              />
            </div>
          </div>
          <ol className={styles.processSteps}>
            {PROCESS.map((p) => (
              <li key={p.step} className={styles.processStep}>
                <span className={styles.processNum} aria-hidden="true">
                  {p.step}
                </span>
                <h3 className={styles.processTitle}>{p.title}</h3>
                <p className={styles.processCopy}>{p.copy}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* -------------------------------------------------------- RECIPE */}
        <section id="recipe" className={styles.recipe} aria-labelledby="recipe-title">
          <div className={styles.recipeCard}>
            <div className={styles.recipeHead}>
              <p className={styles.sectionKicker}>From the test kitchen</p>
              <h2 id="recipe-title" className={styles.recipeTitle}>
                Midnight tacos
              </h2>
              <p className={styles.recipeMeta}>
                Serves 2, generously &middot; 25 minutes &middot; uses № 04 Deep Cut
              </p>
            </div>
            <div className={styles.recipeBody}>
              <div className={styles.recipeIngredients}>
                <h3 className={styles.recipeSubhead}>You will need</h3>
                <ul>
                  {RECIPE_INGREDIENTS.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.recipeSteps}>
                <h3 className={styles.recipeSubhead}>Then</h3>
                <ol>
                  {RECIPE_STEPS.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
            <div className={styles.recipeTaco}>
              <Figure
                slug="piquant-taco-cutout"
                cutout
                alt="An overstuffed taco with steak, onion, cilantro and stripes of hot sauce"
                className={styles.recipeTacoImg}
              />
              <p className={`${styles.sticker} ${styles.stickerTaco}`} aria-hidden="true">
                Counter-tested
              </p>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------- STOCKISTS */}
        <section id="stockists" className={styles.stockists} aria-labelledby="stockists-title">
          <div className={styles.sectionHead}>
            <p className={styles.sectionKicker}>Stockists</p>
            <h2 id="stockists-title" className={styles.sectionTitle}>
              Shops with excellent judgement
            </h2>
          </div>
          <ul className={styles.stockistGrid}>
            {STOCKISTS.map((s) => (
              <li key={`${s.shop}-${s.city}`} className={styles.stockistCard}>
                <h3 className={styles.stockistShop}>{s.shop}</h3>
                <p className={styles.stockistCity}>{s.city}</p>
                <p className={styles.stockistNote}>{s.note}</p>
              </li>
            ))}
          </ul>
          <p className={styles.stockistFoot}>
            Somewhere we should be? Tell your favourite shop to write to{' '}
            <a href="mailto:shelves@piquant.example">shelves@piquant.example</a>.
          </p>
        </section>

        {/* ----------------------------------------------------- WHOLESALE */}
        <section id="wholesale" className={styles.wholesale} aria-labelledby="wholesale-title">
          <div className={styles.wholesalePattern}>
            <TabbiedArtwork
              artwork={karst}
              palette={[INK, POOL, BONE, YOLK]}
              seed="pq-wholesale"
              fit="grid"
              cellSize={34}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={styles.wholesaleInner}>
            <h2 id="wholesale-title" className={styles.wholesaleTitle}>
              Put us on your shelf
            </h2>
            <p className={styles.wholesaleCopy}>
              Case of 12, mixed or single-sauce, wholesale from $84. We deliver
              ourselves within forty miles of Port Alsey and we always bring a
              tester bottle for the staff. That last part is strategy, not
              generosity.
            </p>
            <a
              href="mailto:wholesale@piquant.example"
              className={styles.btnPrimary}
            >
              wholesale@piquant.example
            </a>
            <p className={styles.wholesaleFine}>
              Replies within two working days, faster if you mention tacos.
            </p>
          </div>
        </section>
      </main>

      {/* ------------------------------------------------------------ FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p className={styles.footerBrand}>
            Piquant<span className={styles.brandDot}>*</span> Provisions
          </p>
          <p className={styles.footerBlurb}>
            Made in small batches at 14 Beckoner Street, Port Alsey. Open
            Fridays 12&ndash;6 for refills, arguments about heat levels, and
            the occasional free taco.
          </p>
          <nav aria-label="Footer" className={styles.footerNav}>
            <a href="#lineup">Lineup</a>
            <a href="#heat">Heat scale</a>
            <a href="#recipe">Recipe</a>
            <a href="#stockists">Stockists</a>
            <a href="#wholesale">Wholesale</a>
          </nav>
          <p className={styles.footerFine}>
            &copy; 2026 Piquant Provisions. A fictional brand, sadly &mdash;
            the tacos were real.{' '}
            <span className={styles.credit}>
              Patterns by{' '}
              <a href="https://tabbied.com" rel="noopener">
                Tabbied
              </a>
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}
