import { TabbiedArtwork } from 'tabbied/react';
import { reeding } from 'tabbied/artworks';
import { Figure } from 'components/Figure';
import styles from './wildgrain-bakery.module.css';

export const metadata = {
  title: 'Wildgrain — Naturally Leavened Bakery',
  description:
    'Wildgrain is a naturally leavened bakery on Cinder Lane. Stone-milled flour, a 48-hour ferment, and a deck oven lit at 4 a.m. Baked at dawn, sold by noon.',
};

const CREAM = '#EAE0CC';
const INK = '#1B1B1E';
const TAN = '#C6AC8F';
const UMBER = '#5E503F';
const CLAY = '#A9927D';
const EMBER = '#EB5E28';

const TICKER_ITEMS = [
  'Baked at dawn',
  'Sold by noon',
  'Naturally leavened',
  'Stone-milled flour',
  'No shortcuts',
  '48-hour ferment',
];

const PRINCIPLES = [
  {
    n: '01',
    title: 'Flour first',
    body: 'We buy whole grain from three farms within a morning’s drive and mill it on stone the day before it becomes dough. Fresh flour tastes alive — grassy, sweet, a little wild. Bagged white flour tastes like the bag.',
  },
  {
    n: '02',
    title: 'Water, salt, patience',
    body: 'That’s the whole ingredient list. No yeast from a packet, no dough conditioners, nothing you’d need a chemistry degree to pronounce. The starter is eleven years old and moodier than any of us.',
  },
  {
    n: '03',
    title: 'Time does the work',
    body: 'Every loaf ferments for at least 48 hours before it sees the oven. Long fermentation builds flavour, opens the crumb, and makes the bread easier on your stomach. We just try not to get in the way.',
  },
  {
    n: '04',
    title: 'Fire, then honesty',
    body: 'The deck oven is lit at 4 a.m. and the bread comes out dark. If a bake isn’t right, it doesn’t go on the shelf — it goes to staff toast, which is why the staff never complain about the hours. Almost never.',
  },
];

const BAKES = [
  {
    slug: 'wildgrain-loaf-cutout',
    alt: 'Country sourdough boule with a deeply scored, blistered crust',
    name: 'Country Boule',
    desc: 'Our flagship. 20% fresh-milled wholegrain, open crumb, crust like mahogany.',
    price: '$9',
    tag: 'Every day',
  },
  {
    slug: 'wildgrain-baguette-cutout',
    alt: 'Two slender baguettes with crackled golden crusts',
    name: 'Baguette × 2',
    desc: 'Sold in pairs because nobody has ever made it home with a whole one.',
    price: '$8',
    tag: 'From 8 a.m.',
  },
  {
    slug: 'wildgrain-croissant-cutout',
    alt: 'Deeply laminated croissant with glossy, shattered layers',
    name: 'Croissant',
    desc: 'Cultured butter, 27 layers, audible from across the room.',
    price: '$4.50',
    tag: 'Until they’re gone',
  },
  {
    slug: 'wildgrain-rye-cutout',
    alt: 'Seeded rye tin loaf crowned with sunflower and flax seeds',
    name: 'Seeded Rye Tin',
    desc: 'Dense, dark, Scandinavian at heart. Keeps a full week — it won’t last that long.',
    price: '$10',
    tag: 'Wed / Sat',
  },
];

const BAKERS = [
  {
    slug: 'wildgrain-baker-1-cutout',
    alt: 'Portrait of Maeve Byrne, head baker, auburn hair, wearing a black apron',
    name: 'Maeve Byrne',
    role: 'Head baker & starter custodian',
    bio: 'Maeve mixed her first sourdough at nineteen and has been arguing with fermentation ever since. She names every starter batch after a storm. The current one is called Doris.',
  },
  {
    slug: 'wildgrain-baker-2-cutout',
    alt: 'Portrait of Kenji Hara, oven lead, wearing a chambray shirt',
    name: 'Kenji Hara',
    role: 'Oven lead & lamination whisperer',
    bio: 'Thirty years at the deck oven, first in Osaka, now on Cinder Lane. Kenji can tell a loaf is done by the sound it makes when you knock. We’ve tested him. He’s never wrong.',
  },
];

const CLUB_TIERS = [
  {
    name: 'The Crust',
    price: '$14',
    per: '/ week',
    blurb: 'For the household that just needs good bread on the counter.',
    items: ['One loaf of your choice weekly', 'Skip or swap any week', 'First-slice bragging rights'],
  },
  {
    name: 'The Crumb',
    price: '$26',
    per: '/ week',
    blurb: 'Bread plus pastry, because weekends deserve ceremony.',
    items: [
      'One loaf + two pastries weekly',
      'Priority pickup before 9 a.m.',
      'Members-only bake previews',
      'Skip or swap any week',
    ],
    featured: true,
  },
  {
    name: 'The Whole Grain',
    price: '$42',
    per: '/ week',
    blurb: 'The full spread. Popular with big tables and small cafés.',
    items: [
      'Two loaves + four pastries weekly',
      'First dibs on experimental bakes',
      'A bag of our stone-milled flour monthly',
      'Your name chalked on the club board',
    ],
  },
];

const HOURS = [
  ['Monday', 'Ovens resting'],
  ['Tuesday', 'Ovens resting'],
  ['Wednesday', '7:00 — 13:00'],
  ['Thursday', '7:00 — 13:00'],
  ['Friday', '7:00 — 13:00'],
  ['Saturday', '7:00 — 14:00'],
  ['Sunday', '8:00 — 12:00'],
];

export default function WildgrainBakeryPage() {
  return (
    <div className={styles.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Karla:ital,wght@0,300..800;1,300..800&display=swap"
      />

      <header className={styles.topbar}>
        <a href="#top" className={styles.wordmark}>
          Wildgrain<span className={styles.wordmarkDot}>*</span>
        </a>
        <nav aria-label="Page sections" className={styles.nav}>
          <a href="#bakes">Today’s bakes</a>
          <a href="#oven">The oven</a>
          <a href="#bakers">Bakers</a>
          <a href="#club">Bread club</a>
          <a href="#find-us">Find us</a>
        </nav>
        <a href="#club" className={styles.topbarCta}>
          Join the club
        </a>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- hero */}
        <section className={styles.hero} aria-labelledby="hero-heading">
          <div className={styles.heroText}>
            <p className={styles.heroKicker}>Naturally leavened · Cinder Lane · est. 2014</p>
            <h1 id="hero-heading" className={styles.heroHeading}>
              Bread with a<br />
              <em>will of its own.</em>
            </h1>
            <p className={styles.heroLede}>
              We mill, mix, and bake on one street corner — flour from three nearby farms, an
              eleven-year-old starter, and a deck oven lit at 4&nbsp;a.m. Baked at dawn. Sold by
              noon. Gone by lunch, usually.
            </p>
            <div className={styles.heroActions}>
              <a href="#bakes" className={styles.btnPrimary}>
                See today’s bakes
              </a>
              <a href="#find-us" className={styles.btnGhost}>
                Hours &amp; directions
              </a>
            </div>
          </div>

          <div className={styles.heroCollage}>
            <div className={styles.heroScene}>
              <Figure
                slug="wildgrain-hero"
                alt="Freshly baked sourdough loaves cooling on a flour-dusted counter"
                priority
              />
            </div>
            <div className={styles.heroPattern} aria-hidden="true">
              <TabbiedArtwork
                artwork={reeding}
                palette={[TAN, UMBER, CREAM, EMBER]}
                seed="wg-hero-07"
                fit="grid"
                style={{ position: 'absolute', inset: 0 }}
              />
            </div>
            <div className={styles.heroLoaf}>
              <Figure
                slug="wildgrain-loaf-cutout"
                cutout
                alt="Country boule with a flour-dusted, deeply scored crust"
              />
            </div>
            <p className={styles.heroStamp}>
              <span>240°C</span> deck-baked
            </p>
          </div>
        </section>

        {/* -------------------------------------------------------- ticker */}
        <div className={styles.ticker} aria-hidden="true">
          <div className={styles.tickerTrack}>
            {[0, 1].map((copy) => (
              <div className={styles.tickerGroup} key={copy}>
                {TICKER_ITEMS.map((item) => (
                  <span key={item} className={styles.tickerItem}>
                    {item.toUpperCase()}
                    <span className={styles.tickerStar}>✳</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ----------------------------------------------------- manifesto */}
        <section className={styles.manifesto} aria-labelledby="manifesto-heading">
          <p className={styles.sectionKicker}>The Wildgrain manifesto</p>
          <h2 id="manifesto-heading" className={styles.manifestoHeading}>
            Four ingredients.
            <br />
            Three of them are patience.
          </h2>
          <div className={styles.principles}>
            {PRINCIPLES.map((p) => (
              <article key={p.n} className={styles.principle}>
                <span className={styles.principleNumber} aria-hidden="true">
                  {p.n}
                </span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </article>
            ))}
          </div>
          <blockquote className={styles.pullQuote}>
            <p>
              “Good bread isn’t made. It’s <em>waited for.</em>”
            </p>
            <cite>— Maeve, at roughly 4:15 every morning</cite>
          </blockquote>
        </section>

        {/* --------------------------------------------------------- bakes */}
        <section id="bakes" className={styles.bakes} aria-labelledby="bakes-heading">
          <div className={styles.bakesBackdrop} aria-hidden="true">
            <TabbiedArtwork
              artwork={reeding}
              palette={[INK, UMBER, EMBER, CLAY]}
              seed="wg-board-03"
              fit="grid"
              density={1}
              style={{ position: 'absolute', inset: 0, opacity: 0.55 }}
            />
          </div>
          <div className={styles.bakesInner}>
            <header className={styles.bakesHeader}>
              <p className={styles.sectionKickerLight}>Chalked up fresh each morning</p>
              <h2 id="bakes-heading">Today’s bakes</h2>
              <p className={styles.bakesNote}>
                The board changes with the seasons and the miller’s mood. When the shelf is
                empty, it’s empty — set an alarm.
              </p>
            </header>
            <ul className={styles.bakeGrid}>
              {BAKES.map((bake) => (
                <li key={bake.slug} className={styles.bakeCard}>
                  <div className={styles.bakeImage}>
                    <Figure slug={bake.slug} cutout alt={bake.alt} />
                  </div>
                  <div className={styles.bakeMeta}>
                    <span className={styles.bakeTag}>{bake.tag}</span>
                    <h3>{bake.name}</h3>
                    <p>{bake.desc}</p>
                    <span className={styles.bakePrice}>{bake.price}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------------------------------------------------- oven */}
        <section id="oven" className={styles.oven} aria-labelledby="oven-heading">
          <div className={styles.ovenMedia}>
            <Figure
              slug="wildgrain-oven"
              alt="A baker loading shaped loaves into the deck oven with a long peel"
            />
            <p className={styles.ovenCaption}>The deck, loaded at 6:05 a.m. Third bake of nine.</p>
          </div>
          <div className={styles.ovenText}>
            <p className={styles.sectionKicker}>The oven story</p>
            <h2 id="oven-heading">
              Lit at four.
              <br />
              Loyal ever since.
            </h2>
            <p>
              Our deck oven came out of a shuttered bakery two towns over, weighed as much as a
              small car, and took six people and one very patient forklift to get through the door.
              We rebuilt the hearth, named her Brigid, and lit her in the winter of 2014. She has
              not had a day off since — which makes her the hardest-working member of staff by
              a comfortable margin.
            </p>
            <p>
              Every bake rides her falling heat: lean sourdoughs first while she’s furious,
              enriched doughs as she mellows, granola last on the ember’s afterthought. Nothing
              is wasted, least of all the fire.
            </p>
            <dl className={styles.ovenStats}>
              <div>
                <dt>Deck temperature</dt>
                <dd>240°C</dd>
              </div>
              <div>
                <dt>First light</dt>
                <dd>4:00 a.m.</dd>
              </div>
              <div>
                <dt>Loaves per day</dt>
                <dd>~320</dd>
              </div>
              <div>
                <dt>Days off since 2014</dt>
                <dd>0</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* ------------------------------------------------- divider band */}
        <div className={styles.dividerBand} aria-hidden="true">
          <TabbiedArtwork
            artwork={reeding}
            palette={[EMBER, INK, CREAM]}
            seed="wg-band-11"
            fit="grid"
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>

        {/* --------------------------------------------------------- crumb */}
        <section className={styles.crumb} aria-labelledby="crumb-heading">
          <p className={styles.sectionKicker}>Exhibit A</p>
          <h2 id="crumb-heading">The crumb speaks for itself</h2>
          <div className={styles.crumbCollage}>
            <figure className={styles.crumbShotBig}>
              <Figure
                slug="wildgrain-crumb"
                alt="Close-up of an open, glossy sourdough crumb with irregular holes"
              />
              <figcaption>Wednesday’s country boule, halved at 7:40 a.m.</figcaption>
            </figure>
            <figure className={styles.crumbShotWide}>
              <Figure
                slug="wildgrain-cafe"
                alt="Morning light in the Wildgrain café, customers at small wooden tables"
              />
              <figcaption>The café corner — coffee, toast, quiet gossip.</figcaption>
            </figure>
            <blockquote className={styles.crumbQuote}>
              <p>
                “I moved apartments to be closer to this bakery. I am not exaggerating and I
                would do it again.”
              </p>
              <cite>— Priya, Crumb-tier member since 2019</cite>
            </blockquote>
          </div>
        </section>

        {/* -------------------------------------------------------- bakers */}
        <section id="bakers" className={styles.bakers} aria-labelledby="bakers-heading">
          <p className={styles.sectionKicker}>Floury hands</p>
          <h2 id="bakers-heading">The people at the peel</h2>
          <div className={styles.bakerGrid}>
            {BAKERS.map((baker, i) => (
              <article key={baker.slug} className={styles.bakerCard}>
                <div className={styles.bakerTile}>
                  <div className={styles.bakerTilePattern} aria-hidden="true">
                    <TabbiedArtwork
                      artwork={reeding}
                      palette={i === 0 ? [CLAY, UMBER, CREAM] : [TAN, INK, CREAM]}
                      seed={`wg-baker-${i + 1}`}
                      fit="grid"
                      style={{ position: 'absolute', inset: 0, opacity: 0.8 }}
                    />
                  </div>
                  <Figure slug={baker.slug} cutout alt={baker.alt} />
                </div>
                <h3>{baker.name}</h3>
                <p className={styles.bakerRole}>{baker.role}</p>
                <p className={styles.bakerBio}>{baker.bio}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------- club */}
        <section id="club" className={styles.club} aria-labelledby="club-heading">
          <header className={styles.clubHeader}>
            <p className={styles.sectionKicker}>The Wildgrain Bread Club</p>
            <h2 id="club-heading">Never face an empty shelf again</h2>
            <p className={styles.clubLede}>
              Members get their bread set aside before the doors open. Pause, skip, or swap
              whenever — the starter holds no grudges. Cancel any time (Doris might sulk).
            </p>
          </header>
          <div className={styles.tierRow}>
            {CLUB_TIERS.map((tier) => (
              <article
                key={tier.name}
                className={tier.featured ? `${styles.tier} ${styles.tierFeatured}` : styles.tier}
              >
                {tier.featured && <span className={styles.tierBadge}>Most loved</span>}
                <h3>{tier.name}</h3>
                <p className={styles.tierPrice}>
                  {tier.price}
                  <span> {tier.per}</span>
                </p>
                <p className={styles.tierBlurb}>{tier.blurb}</p>
                <ul>
                  {tier.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <a href="#find-us" className={styles.tierCta}>
                  Sign up at the counter
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------- find us */}
        <section id="find-us" className={styles.findUs} aria-labelledby="find-heading">
          <div className={styles.findIntro}>
            <p className={styles.sectionKicker}>Find us</p>
            <h2 id="find-heading">Follow the smell of toast</h2>
            <address className={styles.address}>
              Wildgrain Bakery
              <br />
              14 Cinder Lane, Millbrook Quarter
              <br />
              <a href="mailto:hello@wildgrain.example">hello@wildgrain.example</a>
            </address>
            <p className={styles.marketNote}>
              <strong>Market days:</strong> find our stall at the Millbrook Farmers’ Market
              every Saturday, 8 a.m. until the crates are empty — usually around 11.
            </p>
          </div>
          <table className={styles.hoursTable}>
            <caption className={styles.hoursCaption}>Opening hours</caption>
            <tbody>
              {HOURS.map(([day, hours]) => (
                <tr key={day}>
                  <th scope="row">{day}</th>
                  <td>{hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {/* ------------------------------------------------------------ footer */}
      <footer className={styles.footer}>
        <div className={styles.footerPattern} aria-hidden="true">
          <TabbiedArtwork
            artwork={reeding}
            palette={[INK, UMBER, CLAY, EMBER]}
            seed="wg-footer-05"
            fit="grid"
            style={{ position: 'absolute', inset: 0, opacity: 0.6 }}
          />
        </div>
        <div className={styles.footerInner}>
          <p className={styles.footerWordmark}>
            Wildgrain<span aria-hidden="true">*</span>
          </p>
          <p className={styles.footerLine}>
            Baked at dawn. Sold by noon. © 2026 Wildgrain Bakery — a fictional bakery
            with a very real appetite.
          </p>
          <p className={styles.credit}>
            Ribbed patterns by{' '}
            <a href="https://tabbied.com" rel="noopener">
              Tabbied
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
