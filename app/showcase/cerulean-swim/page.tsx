import { TabbiedArtwork } from 'tabbied/react';
import { tidering, wavelet } from 'tabbied/artworks';
import { Figure } from 'components/Figure';
import styles from './cerulean-swim.module.css';

export const metadata = {
  title: 'Cerulean · Swimwear for the Long Swim',
  description:
    'Cerulean is a small swimwear label on the Ligurian coast. Regenerated-nylon suits cut for salt and sewn for sun. Collection № 04, Meltemi, is in the water now.',
};

const FOAM = '#F2FBFC';
const TEAL = '#0FA3B1';
const AQUA = '#B5E2E8';
const CORAL = '#FF8266';
const SUN = '#FFD97D';
const DEEP = '#134D57';

const LOOKS = [
  {
    kind: 'photo' as const,
    slug: 'cerulean-beach',
    alt: 'Rows of striped parasols leaning over pale sand at midday',
    caption: 'Look 01 · parasol lines, Spiaggia di Levante',
    wide: true,
  },
  {
    kind: 'pattern' as const,
    seed: 'cs-look-a',
    palette: [FOAM, TEAL, AQUA, DEEP],
    caption: 'Print · “Shorebreak”, four inks',
    wide: false,
  },
  {
    kind: 'photo' as const,
    slug: 'cerulean-dive',
    alt: 'A swimmer gliding underwater through blue light, trailing a ribbon of bubbles',
    caption: 'Look 02 · the quiet under the surface',
    wide: false,
  },
  {
    kind: 'photo' as const,
    slug: 'cerulean-pool',
    alt: 'A sunlit pool corner with a chrome ladder and rippling tiles',
    caption: 'Look 03 · hotel pool, seven a.m.',
    wide: false,
  },
  {
    kind: 'pattern' as const,
    seed: 'cs-look-b',
    palette: [AQUA, DEEP, TEAL, CORAL],
    caption: 'Print · “Undertow”, coral thread',
    wide: false,
  },
];

const PRODUCTS = [
  {
    slug: 'cerulean-suit-1-cutout',
    alt: 'Deep-teal one-piece swimsuit laid flat',
    name: 'The Ondine',
    kind: 'One-piece · low scooped back',
    price: '$148',
    note: 'Our first cut and still the one we reach for. Holds its line from first length to last.',
    tall: true,
  },
  {
    slug: 'cerulean-suit-2-cutout',
    alt: 'Two-piece swimsuit in aqua and coral laid flat',
    name: 'The Riva',
    kind: 'Two-piece · tie sides',
    price: '$132',
    note: 'Top and bottom sold as a pair, sized separately. Stays put through a proper dive.',
    tall: false,
  },
  {
    slug: 'cerulean-goggles-cutout',
    alt: 'Mirrored swimming goggles with pale straps',
    name: 'Noon Goggles',
    kind: 'Mirrored · anti-fog',
    price: '$38',
    note: 'For the glare hours. Split-seal gaskets, no raccoon rings before lunch.',
    tall: false,
  },
  {
    slug: 'cerulean-towel-cutout',
    alt: 'A rolled beach towel striped in aqua, sun-yellow and coral',
    name: 'The Meridian Towel',
    kind: 'Woven cotton · 90 × 170 cm',
    price: '$56',
    note: 'Loomed dense, hemmed flat, dries before you do. Sand shakes out in one flick.',
    tall: false,
  },
];

const FABRIC_FACTS = [
  { label: 'Regenerated nylon', value: '78%' },
  { label: 'Elastane', value: '22%' },
  { label: 'Sun protection', value: 'UPF 50+' },
  { label: 'Chlorine tested', value: '240 hrs' },
  { label: 'Sizes', value: 'XS to 3XL' },
  { label: 'Cuts', value: 'Low tide / High tide' },
];

const CARE_STEPS = [
  {
    title: 'Rinse before you rest',
    body: 'Fresh, cool water within the hour: salt and chlorine keep working long after you stop swimming.',
  },
  {
    title: 'Hands, not machines',
    body: 'A basin, a drop of mild soap, a gentle press. Never wring; twisting is what ages elastane, not swimming.',
  },
  {
    title: 'Dry flat, in shade',
    body: 'Lay it on the Meridian, roll once, then flat over a rail out of the sun. Direct heat fades a print in a season.',
  },
  {
    title: 'Mind the rough edges',
    body: 'Pool copings, pier ladders, velcro straps: snags love a fine knit. Sit on the towel; that is what it is for.',
  },
  {
    title: 'Let it rest a day',
    body: 'Elastane recovers overnight. Two suits in rotation will outlast four worn back to back.',
  },
];

const STOCKISTS = [
  { shop: 'Baia Baia', city: 'Lisbon' },
  { shop: 'The Swim Library', city: 'Los Angeles' },
  { shop: 'Sonnenbad', city: 'Zürich' },
  { shop: 'Tide & Co.', city: 'Sydney' },
  { shop: 'Mizu Mizu', city: 'Tokyo' },
  { shop: 'Salt Supply', city: 'St Ives' },
];

export default function CeruleanSwimPage() {
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
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..800;1,400..800&family=Karla:ital,wght@0,300..700;1,300..700&display=swap"
      />

      <header className={styles.masthead}>
        <nav className={styles.navRow} aria-label="Site">
          <div className={styles.navSide}>
            <a href="#lookbook">Lookbook</a>
            <a href="#shop">Shop</a>
          </div>
          <p className={styles.logo}>Cerulean</p>
          <div className={`${styles.navSide} ${styles.navSideRight}`}>
            <a href="#fabric">Fabric</a>
            <a href="#club" className={styles.navPill}>
              The Water Club
            </a>
          </div>
        </nav>
      </header>

      <main>
        {/* HERO */}
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroField} aria-hidden="true">
            <TabbiedArtwork
              artwork={wavelet}
              palette={[FOAM, TEAL, AQUA, SUN]}
              seed="cs-hero-07"
              fit="grid"
              cellSize={96}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={styles.heroScrim} aria-hidden="true" />
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>Collection № 04 · Meltemi</p>
            <h1 id="hero-title" className={styles.heroTitle}>
              Cut for salt.
              <br />
              <em>Sewn for sun.</em>
            </h1>
            <p className={styles.heroLede}>
              Swimwear made slowly on the Ligurian coast from regenerated nylon,
              built to outlast summers, tides, and the hotel pool you were not
              strictly a guest of.
            </p>
            <div className={styles.heroFrame}>
              <Figure
                slug="cerulean-hero"
                alt="A swimmer floating on her back in clear turquoise water, photographed from above"
                priority
                className={styles.coverImg}
              />
              <p className={styles.heroBadge} aria-hidden="true">
                <span>UPF</span>
                <strong>50+</strong>
                <span>salt-tested</span>
              </p>
            </div>
          </div>
        </section>

        {/* LOOKBOOK */}
        <section
          id="lookbook"
          className={styles.section}
          aria-labelledby="lookbook-title"
        >
          <header className={styles.secHead}>
            <h2 id="lookbook-title" className={styles.secTitle}>
              The <em>Meltemi</em> lookbook
            </h2>
            <p className={styles.secLede}>
              Named for the dry summer wind that flattens the Aegean by
              afternoon. Three looks, two prints, one long season.
            </p>
          </header>
          <div className={styles.lookGrid}>
            {LOOKS.map((look) => (
              <figure
                key={look.caption}
                className={`${styles.lookCard} ${look.wide ? styles.lookWide : ''}`}
              >
                {look.kind === 'photo' ? (
                  <div className={styles.lookMedia}>
                    <Figure
                      slug={look.slug}
                      alt={look.alt}
                      className={styles.coverImg}
                    />
                  </div>
                ) : (
                  <div
                    className={styles.lookMedia}
                    style={{ backgroundColor: look.palette[0] }}
                  >
                    <TabbiedArtwork
                      artwork={wavelet}
                      palette={look.palette}
                      seed={look.seed}
                      fit="grid"
                      cellSize={46}
                      style={{ position: 'absolute', inset: 0 }}
                    />
                  </div>
                )}
                <figcaption>{look.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* SHOP */}
        <section
          id="shop"
          className={styles.section}
          aria-labelledby="shop-title"
        >
          <header className={styles.secHead}>
            <h2 id="shop-title" className={styles.secTitle}>
              In the <em>water</em> now
            </h2>
            <p className={styles.secLede}>
              Everything below is sewn in editions of a few hundred. When a
              colour is gone it waits for next summer, like the rest of us.
            </p>
          </header>
          <div className={styles.shopGrid}>
            {PRODUCTS.map((p) => (
              <article key={p.slug} className={styles.productCard}>
                <div
                  className={`${styles.productStage} ${p.tall ? styles.productStageTall : ''}`}
                >
                  <Figure
                    slug={p.slug}
                    cutout
                    alt={p.alt}
                    className={styles.productImg}
                  />
                </div>
                <div className={styles.productMeta}>
                  <h3 className={styles.productName}>{p.name}</h3>
                  <p className={styles.productKind}>{p.kind}</p>
                  <p className={styles.productNote}>{p.note}</p>
                  <p className={styles.productPrice}>{p.price}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* RIBBON DIVIDER */}
        <div className={styles.ribbon} aria-hidden="true">
          <TabbiedArtwork
            artwork={tidering}
            palette={[AQUA, FOAM, TEAL]}
            seed="cs-ribbon-03"
            fit="grid"
            cellSize={110}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>

        {/* FABRIC & FIT */}
        <section
          id="fabric"
          className={styles.section}
          aria-labelledby="fabric-title"
        >
          <div className={styles.fabricCols}>
            <div>
              <h2 id="fabric-title" className={styles.secTitle}>
                Fabric &amp; <em>fit</em>
              </h2>
              <p className={styles.fabricBody}>
                Every Cerulean piece is knitted from Aqualith™, a regenerated
                nylon spun from recovered fishing nets and carpet offcuts. It
                arrives on our cutting tables in Sestri as a dense, matte knit
                that holds its colour through two hundred and forty hours of
                chlorine testing, roughly three summers of daily lengths.
              </p>
              <p className={styles.fabricBody}>
                We cut two ways. <strong>Low tide</strong> sits lighter: higher
                leg, open back, for floating and warm bays.{' '}
                <strong>High tide</strong> is our training cut: locked seams,
                full back, straps that stay crossed at the flip turn. Both are
                sewn flat so nothing chafes at kilometre three.
              </p>
              <p className={styles.fabricFine}>
                Offcuts go back into the loop; last season we returned 312 kg.
              </p>
            </div>
            <dl className={styles.fabricFacts}>
              {FABRIC_FACTS.map((f) => (
                <div key={f.label} className={styles.fact}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* CARE GUIDE — white card floating on a full-width tide field */}
        <div className={styles.careBand}>
          <div className={styles.careField} aria-hidden="true">
            <TabbiedArtwork
              artwork={tidering}
              palette={[AQUA, FOAM, TEAL]}
              seed="cs-care-11"
              fit="grid"
              cellSize={132}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <section className={styles.sectionAlt} aria-labelledby="care-title">
            <div className={styles.careInner}>
              <header className={styles.secHead}>
                <h2 id="care-title" className={styles.secTitle}>
                  Care, in <em>five</em> slow steps
                </h2>
                <p className={styles.secLede}>
                  A suit is a small machine for holding you together at speed.
                  Treat it like this and it will do ten seasons.
                </p>
              </header>
              <ol className={styles.careList}>
                {CARE_STEPS.map((step, i) => (
                  <li key={step.title} className={styles.careStep}>
                    <span className={styles.careNo} aria-hidden="true">
                      {i + 1}
                    </span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </div>

        {/* WATER CLUB */}
        <section id="club" className={styles.club} aria-labelledby="club-title">
          <div className={styles.clubField} aria-hidden="true">
            <TabbiedArtwork
              artwork={wavelet}
              palette={[DEEP, AQUA, TEAL, SUN]}
              seed="cs-club-09"
              fit="cover"
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={styles.clubCard}>
            <h2 id="club-title" className={styles.clubTitle}>
              The <em>Water Club</em>
            </h2>
            <p className={styles.clubLede}>
              One letter a month: sea temperatures we trust, a swim worth
              travelling for, and first call on new editions. No sales voice,
              ever; we are usually in the water by eight.
            </p>
            <form className={styles.clubForm} aria-label="Join the Water Club">
              <label className={styles.clubLabel} htmlFor="club-email">
                Your email
              </label>
              <div className={styles.clubRow}>
                <input
                  id="club-email"
                  type="email"
                  name="email"
                  placeholder="you@somewhere-sunny.example"
                  autoComplete="email"
                  className={styles.clubInput}
                />
                <button type="button" className={styles.clubButton}>
                  Wade in
                </button>
              </div>
            </form>
            <p className={styles.clubFine}>
              1,900 swimmers already float here. Leave whenever the water gets
              cold.
            </p>
          </div>
        </section>

        {/* STOCKISTS */}
        <section className={styles.section} aria-labelledby="stockists-title">
          <header className={styles.secHead}>
            <h2 id="stockists-title" className={styles.secTitle}>
              Where we <em>wash up</em>
            </h2>
            <p className={styles.secLede}>
              Six shops we would visit even if they did not carry us. Call
              ahead for sizes; small editions travel unevenly.
            </p>
          </header>
          <ul className={styles.stockists}>
            {STOCKISTS.map((s) => (
              <li key={s.shop} className={styles.stockist}>
                <span className={styles.stockShop}>{s.shop}</span>
                <span className={styles.stockCity}>{s.city}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerWave} aria-hidden="true">
          <TabbiedArtwork
            artwork={tidering}
            palette={[FOAM, AQUA, TEAL]}
            seed="cs-foot-05"
            fit="grid"
            cellSize={130}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
        <div className={styles.footerInner}>
          <p className={styles.footerLogo}>Cerulean</p>
          <div className={styles.footerCols}>
            <div>
              <h2 className={styles.footerHead}>Atelier</h2>
              <address className={styles.footerAddress}>
                Via delle Reti 9<br />
                Sestri Levante, Italy
                <br />
                ciao@cerulean.example
              </address>
            </div>
            <div>
              <h2 className={styles.footerHead}>Paddle over</h2>
              <ul className={styles.footerList}>
                <li>
                  <a href="#lookbook">Lookbook № 04</a>
                </li>
                <li>
                  <a href="#shop">Shop the edition</a>
                </li>
                <li>
                  <a href="#fabric">Aqualith™ fabric</a>
                </li>
                <li>
                  <a href="#club">The Water Club</a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className={styles.footerHead}>Small print</h2>
              <p className={styles.footerNote}>
                Free repairs for the life of every suit. Postage both ways on
                us within the EU; everywhere else we split it, like a good
                lunch bill.
              </p>
            </div>
          </div>
          <div className={styles.footerBase}>
            <p>© 2026 Cerulean Swim S.r.l. · sewn by six people and the sea.</p>
            <p className={styles.tabbiedCredit}>
              “Wavelet” and “Tidering” patterns by{' '}
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
