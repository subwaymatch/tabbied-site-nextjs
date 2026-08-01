import { TabbiedArtwork } from 'tabbied/react';
import { stylobate, tidering } from 'tabbied/artworks';
import { Figure } from 'components/Figure';
import styles from './koyo-tea.module.css';

export const metadata = {
  title: 'Koyo — Tea House & Shop',
  description:
    'Koyo is a small tea house and shop on Biwa Lane: single-garden Japanese teas, a six-seat tearoom, and teaware chosen slowly. Steeped precisely, poured quietly.',
};

const PAPER = '#F2EFEA';
const PINE = '#3A5A40';
const LEAF = '#588157';
const SAGE = '#A3B18A';
const INKGREEN = '#344E41';
const MIST = '#DAD7CD';

const LIGHT_PALETTE = [PAPER, SAGE, MIST, LEAF];
const BORDER_PALETTE = [PAPER, PINE, LEAF, SAGE, INKGREEN, MIST];
const DARK_PALETTE = [INKGREEN, SAGE, LEAF, MIST, PINE, PAPER];

const RITUAL = [
  {
    kanji: '一',
    name: 'Warm the vessels',
    detail: 'Pour water just off the boil into the kyūsu and each cup, then back out. The porcelain should feel like sun on a windowsill.',
    figure: 'water at 95°C, then discarded',
  },
  {
    kanji: '二',
    name: 'Measure the leaf',
    detail: 'Five grams for 180 millilitres — a generous spoonful. Trust the scale the first ten times; after that, your hand knows.',
    figure: '5 g · 180 ml',
  },
  {
    kanji: '三',
    name: 'Steep, and leave it be',
    detail: 'Let the water fall to temperature before it meets the leaf. No swirling, no lifting the lid. The tea is doing something; let it.',
    figure: 'sencha 75°C · 1 min 10 s',
  },
  {
    kanji: '四',
    name: 'Pour to the last drop',
    detail: 'Alternate between cups so each holds the same strength, and tip the pot fully — the final drop carries the deepest sweetness.',
    figure: 'saigo no itteki — the last drop',
  },
];

const MENU = [
  { name: 'Gyokuro', kanji: '玉露', temp: '60°C', time: '2:00', price: '¥1,400' },
  { name: 'Kabusecha', kanji: 'かぶせ茶', temp: '70°C', time: '1:30', price: '¥1,100' },
  { name: 'Sencha', kanji: '煎茶', temp: '75°C', time: '1:15', price: '¥900' },
  { name: 'Genmaicha', kanji: '玄米茶', temp: '90°C', time: '0:45', price: '¥800' },
  { name: 'Hōjicha', kanji: 'ほうじ茶', temp: '95°C', time: '0:30', price: '¥800' },
  { name: 'Matcha', kanji: '抹茶', temp: '80°C', time: 'whisked', price: '¥1,200' },
];

const WARES = [
  {
    slug: 'koyo-chawan-cutout',
    alt: 'Celadon-glazed matcha bowl with a soft green rim',
    name: 'Chawan, celadon',
    origin: 'thrown in a two-person studio, fired twice',
    price: '¥12,000',
  },
  {
    slug: 'koyo-whisk-cutout',
    alt: 'Hand-carved bamboo tea whisk with fine curled tines',
    name: 'Chasen, 80 tines',
    origin: 'split from a single node of bamboo',
    price: '¥3,600',
  },
  {
    slug: 'koyo-tin-cutout',
    alt: 'Tall sage-green tea caddy with a tight-fitting lid',
    name: 'Caddy, tall',
    origin: 'double-lidded; keeps leaf for a season',
    price: '¥4,200',
  },
];

const SEASONS = [
  {
    kanji: '春',
    name: 'Spring',
    note: 'Shincha arrives in the last week of April and sells through by June. We portion it into 40 g packets so no one hoards, including us.',
  },
  {
    kanji: '夏',
    name: 'Summer',
    note: 'Mizudashi — sencha steeped overnight in cold water. Six hours, no heat, a sweetness the kettle never finds. Served over one large clear cube.',
  },
  {
    kanji: '秋',
    name: 'Autumn',
    note: 'Our namesake season. We roast hōjicha in small batches every Thursday; the lane smells of it by ten, and the batch is gone by four.',
  },
  {
    kanji: '冬',
    name: 'Winter',
    note: 'Koicha — thick matcha, kneaded rather than whisked — by reservation only. It asks for a quiet stomach and an unhurried hour.',
  },
];

export default function KoyoTeaPage() {
  return (
    <div className={styles.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600&family=Zen+Kaku+Gothic+New:wght@300;400;500&display=swap"
      />

      <header className={styles.header}>
        <p className={styles.mark} aria-hidden="true">
          紅葉
        </p>
        <p className={styles.wordmark}>KOYO</p>
        <p className={styles.tagline}>tea house &amp; shop · 12 Biwa Lane</p>
        <nav className={styles.nav} aria-label="Page sections">
          <a href="#ritual">The ritual</a>
          <a href="#teaware">Teaware</a>
          <a href="#visit">Visit</a>
        </nav>
      </header>

      <main>
        {/* ——— HERO ——— */}
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroCopy}>
            <p className={styles.vertical} aria-hidden="true">
              紅葉 — the turning of the leaves
            </p>
            <h1 id="hero-title" className={styles.heroTitle}>
              A quiet room,
              <br />a precise cup.
            </h1>
            <p className={styles.heroLede}>
              Koyo is six seats, one kettle, and the teas of four small gardens.
              We steep by the degree and the second — not out of fussiness, but
              because the leaf notices.
            </p>
          </div>

          <div className={styles.heroField}>
            <TabbiedArtwork
              artwork={tidering}
              palette={LIGHT_PALETTE}
              seed="koyo-nami-13"
              fit="cover"
              density={1}
              style={{ position: 'absolute', inset: 0 }}
            />
            <div className={styles.heroFieldWash} aria-hidden="true" />
            <figure className={styles.heroFigure}>
              <Figure
                slug="koyo-hero"
                priority
                alt="A low wooden table set for tea: kyūsu, two cups, and a folded cloth in soft morning light"
                className={styles.sceneImg}
              />
              <figcaption>The morning table, set before opening.</figcaption>
            </figure>
          </div>

          <div className={styles.textileBand} aria-hidden="true">
            <TabbiedArtwork
              artwork={stylobate}
              palette={BORDER_PALETTE}
              seed="koyo-obi-03"
              fit="grid"
              cellSize={28}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* ——— PHILOSOPHY ——— */}
        <section className={styles.section} aria-labelledby="house-title">
          <h2 id="house-title" className={styles.sectionTitle}>
            <span className={styles.titleKanji} aria-hidden="true">
              家
            </span>
            The house
          </h2>
          <div className={styles.prose}>
            <p>
              The shop occupies a narrow timber building that spent eighty years
              as a paper wholesaler. We kept the shelves, the worn threshold,
              and the habit of wrapping things carefully. What we added is a
              copper kettle, a stone sink, and silence of a workable kind — the
              sort with a kettle ticking underneath it.
            </p>
            <p>
              We buy from four gardens, each small enough that the grower
              answers their own telephone. Every tea on the shelf lists its
              field, its cultivar, and the week it was picked. If a harvest
              disappoints, we simply do not stock it that year, and we say so
              on a small card where the tin would have stood.
            </p>
            <p>
              Nothing here is rare for rarity&rsquo;s sake. A good ordinary
              sencha, steeped attentively, is the whole argument.
            </p>
          </div>
        </section>

        <hr className={styles.rule} />

        {/* ——— RITUAL ——— */}
        <section id="ritual" className={styles.section} aria-labelledby="ritual-title">
          <h2 className={styles.sectionTitle} id="ritual-title">
            <span className={styles.titleKanji} aria-hidden="true">
              点前
            </span>
            The ritual
          </h2>
          <p className={styles.sectionIntro}>
            Four movements, three minutes. We teach them at the counter to
            anyone who asks.
          </p>
          <ol className={styles.ritualList}>
            {RITUAL.map((step) => (
              <li key={step.kanji} className={styles.ritualStep}>
                <span className={styles.ritualKanji} aria-hidden="true">
                  {step.kanji}
                </span>
                <div>
                  <h3>{step.name}</h3>
                  <p>{step.detail}</p>
                  <p className={styles.ritualFigure}>{step.figure}</p>
                </div>
              </li>
            ))}
          </ol>
          <figure className={styles.squareFigure}>
            <Figure
              slug="koyo-pour"
              alt="Pale green sencha being poured from a kyūsu into a small cup"
              className={styles.sceneImg}
            />
            <figcaption>Sencha, second steeping — shorter, hotter, brighter.</figcaption>
          </figure>

          <h3 className={styles.menuTitle}>By the pot</h3>
          <table className={styles.menu}>
            <thead>
              <tr>
                <th scope="col">Tea</th>
                <th scope="col" aria-label="Japanese name" />
                <th scope="col">Water</th>
                <th scope="col">Steep</th>
                <th scope="col">Pot</th>
              </tr>
            </thead>
            <tbody>
              {MENU.map((t) => (
                <tr key={t.name}>
                  <th scope="row">{t.name}</th>
                  <td className={styles.menuKanji}>{t.kanji}</td>
                  <td>{t.temp}</td>
                  <td>{t.time}</td>
                  <td>{t.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={styles.menuNote}>
            Each pot is steeped three times; the second and third are on us.
          </p>
        </section>

        <hr className={styles.rule} />

        {/* ——— TEAWARE ——— */}
        <section id="teaware" className={styles.section} aria-labelledby="ware-title">
          <h2 className={styles.sectionTitle} id="ware-title">
            <span className={styles.titleKanji} aria-hidden="true">
              道具
            </span>
            Teaware
          </h2>
          <p className={styles.sectionIntro}>
            We stock few things and reorder slowly. Everything below is used
            daily at our own counter first.
          </p>

          <figure className={styles.wareFeature}>
            <div className={styles.wareFeatureTile}>
              <TabbiedArtwork
                artwork={stylobate}
                palette={LIGHT_PALETTE}
                seed="koyo-kyusu-08"
                fit="grid"
                cellSize={64}
                style={{ position: 'absolute', inset: 0 }}
              />
              <div className={styles.wareFeatureVeil} aria-hidden="true" />
              <Figure
                slug="koyo-teapot-cutout"
                cutout
                alt="Green-glazed kyūsu teapot with a side handle"
                className={styles.wareFeatureImg}
              />
            </div>
            <figcaption>
              <strong>Kyūsu, side-handle · ¥9,800</strong>
              <span>
                Banko-style clay, 270 ml, with a fine ceramic mesh. The pot we
                reach for sixty times a day, which is the entire review.
              </span>
            </figcaption>
          </figure>

          <ul className={styles.wareGrid}>
            {WARES.map((w) => (
              <li key={w.slug} className={styles.wareCard}>
                <div className={styles.wareTile}>
                  <Figure slug={w.slug} cutout alt={w.alt} className={styles.wareImg} />
                </div>
                <h3>{w.name}</h3>
                <p className={styles.wareOrigin}>{w.origin}</p>
                <p className={styles.warePrice}>{w.price}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ——— FIELD / TERROIR ——— */}
        <section className={styles.field} aria-labelledby="field-title">
          <div className={styles.fieldBand} aria-hidden="true">
            <TabbiedArtwork
              artwork={stylobate}
              palette={DARK_PALETTE}
              seed="koyo-field-05"
              fit="grid"
              cellSize={40}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <figure className={styles.fieldFigure}>
            <Figure
              slug="koyo-field"
              alt="Terraced tea fields stepping down a hillside into morning mist"
              className={styles.sceneImg}
            />
            <figcaption>The Kirigaoka terraces, 480 m, first flush.</figcaption>
          </figure>
          <div className={styles.sectionNarrow}>
            <h2 className={styles.sectionTitle} id="field-title">
              <span className={styles.titleKanji} aria-hidden="true">
                畑
              </span>
              The field
            </h2>
            <div className={styles.prose}>
              <p>
                Our sencha comes from terraces at 480 metres, where mist sits
                until mid-morning and the leaf thickens slowly. The grower,
                Mrs. Hata, shades her gyokuro rows with rice-straw the way her
                grandmother did — twenty-one days under, picked in one morning.
              </p>
              <p>
                Steep terraces cannot be machined, so everything is done by
                hand and the yield is small. We take what we are offered,
                which some years is less than we would like. This is not a
                supply problem. It is the shape of the thing.
              </p>
            </div>
          </div>
        </section>

        <hr className={styles.rule} />

        {/* ——— TEAROOM / VISIT ——— */}
        <section id="visit" className={styles.section} aria-labelledby="visit-title">
          <h2 className={styles.sectionTitle} id="visit-title">
            <span className={styles.titleKanji} aria-hidden="true">
              茶室
            </span>
            The tearoom
          </h2>
          <figure className={styles.heroFigure}>
            <Figure
              slug="koyo-interior"
              alt="Tatami tearoom with a low table, paper screens, and a single hanging scroll"
              className={styles.sceneImg}
            />
            <figcaption>Six seats. Shoes at the step, please.</figcaption>
          </figure>
          <div className={styles.prose}>
            <p>
              Behind the shop, past the noren, is a small tatami room. Three
              seatings a day, six guests at most, forty-five minutes each. A
              seating includes two teas, a sweet from the kashiya two doors
              down, and no music of any kind.
            </p>
          </div>
          <dl className={styles.visitInfo}>
            <div>
              <dt>Open</dt>
              <dd>
                Wednesday – Monday
                <br />
                10:00 – 18:00
              </dd>
            </div>
            <div>
              <dt>Closed</dt>
              <dd>
                Tuesdays,
                <br />
                and the first rain of autumn
              </dd>
            </div>
            <div>
              <dt>Seatings</dt>
              <dd>
                11:00 · 14:00 · 16:30
                <br />
                ¥2,800 · reserve by note or telephone
              </dd>
            </div>
            <div>
              <dt>Find us</dt>
              <dd>
                12 Biwa Lane, Kirigaoka
                <br />
                the doorway with the sage noren
              </dd>
            </div>
          </dl>
        </section>

        <hr className={styles.rule} />

        {/* ——— SEASONAL NOTES ——— */}
        <section className={styles.seasons} aria-labelledby="season-title">
          <div className={styles.seasonsField} aria-hidden="true">
            <TabbiedArtwork
              artwork={tidering}
              palette={LIGHT_PALETTE}
              seed="koyo-shiki-21"
              fit="grid"
              cellSize={110}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={styles.seasonsWash} aria-hidden="true" />
          <div className={styles.section}>
            <h2 className={styles.sectionTitle} id="season-title">
              <span className={styles.titleKanji} aria-hidden="true">
                四季
              </span>
              Seasonal notes
            </h2>
            <ul className={styles.seasonList}>
              {SEASONS.map((s) => (
                <li key={s.name} className={styles.season}>
                  <span className={styles.seasonKanji} aria-hidden="true">
                    {s.kanji}
                  </span>
                  <h3>{s.name}</h3>
                  <p>{s.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      {/* ——— FOOTER ——— */}
      <footer className={styles.footer}>
        <div className={styles.footerBand} aria-hidden="true">
          <TabbiedArtwork
            artwork={stylobate}
            palette={BORDER_PALETTE}
            seed="koyo-hem-11"
            fit="grid"
            cellSize={28}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
        <div className={styles.footerField} aria-hidden="true">
          <TabbiedArtwork
            artwork={tidering}
            palette={LIGHT_PALETTE}
            seed="koyo-suso-29"
            fit="cover"
            density={1}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
        <div className={styles.footerWash} aria-hidden="true" />
        <div className={styles.footerInner}>
          <p className={styles.footerMark} aria-hidden="true">
            紅葉
          </p>
          <p className={styles.footerName}>Koyo — tea house &amp; shop</p>
          <p className={styles.footerLine}>
            12 Biwa Lane, Kirigaoka · <a href="tel:+81555012840">055-501-2840</a> ·{' '}
            <a href="mailto:kettle@koyo.example">kettle@koyo.example</a>
          </p>
          <p className={styles.footerLine}>
            Letters are answered on Tuesdays, when the shop is closed.
          </p>
          <p className={styles.credit}>
            Woven borders by <a href="https://tabbied.com">Tabbied</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
