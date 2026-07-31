import { TabbiedArtwork } from 'tabbied/react';
import { fluting } from 'tabbied/artworks';
import { Figure } from 'components/Figure';
import s from './neve-gelato.module.css';

export const metadata = {
  title: 'Neve — small-batch gelato, churned every morning',
  description:
    'Neve is a pastel corner gelateria in Harbourfields. Eighteen flavours a day, milk from one farm, fruit from the Saturday market, everything churned before the shop opens.',
};

const PALETTE = [
  '#FFF9F5',
  '#FF8FB8',
  '#FFC2D4',
  '#FF8A5C',
  '#D89FFF',
  '#F5C542',
];

const FLAVOURS: { name: string; note: string; dot: string; tag?: string }[] = [
  { name: 'Fior di Latte', note: 'just milk, cream, a little sugar', dot: '#FFF3E4', tag: 'classic' },
  { name: 'Sicilian Pistachio', note: 'stone-ground, unapologetically green', dot: '#A8C686', tag: 'classic' },
  { name: 'Strawberry & Elderflower', note: 'market berries, hedgerow blossom', dot: '#FF8FB8', tag: 'seasonal' },
  { name: 'Roasted Peach', note: 'caramelised in the tray, skins on', dot: '#FF8A5C', tag: 'seasonal' },
  { name: 'Ube Coconut', note: 'purple yam, toasted coconut flakes', dot: '#D89FFF' },
  { name: 'Lemon Curd', note: 'sharp curd rippled through fior', dot: '#F5C542' },
  { name: 'Dark Chocolate Sorbetto', note: '70% and water. That’s it.', dot: '#5A3A32', tag: 'vegan' },
  { name: 'Espresso', note: 'pulled next door at Little Comet', dot: '#8A6A54' },
  { name: 'Salted Caramel', note: 'burnt a shade past sensible', dot: '#D9A05B', tag: 'classic' },
  { name: 'Blackberry Crumble', note: 'oat crumble folded in warm', dot: '#9E6B9E', tag: 'seasonal' },
  { name: 'Melon Sorbetto', note: 'charentais, nothing else', dot: '#FFB48A', tag: 'vegan' },
  { name: 'Stracciatella', note: 'chocolate snapped in by hand', dot: '#F0E7DC', tag: 'classic' },
  { name: 'Hazelnut Gianduja', note: 'Piedmont nuts, milk chocolate', dot: '#B08054' },
  { name: 'Raspberry Ripple', note: 'a ripple you can actually see', dot: '#F26D9C' },
  { name: 'Basil & Lime Sorbetto', note: 'from the pots on the windowsill', dot: '#9FCB8F', tag: 'vegan' },
  { name: 'Honey & Fig', note: 'Harbourfields rooftop honey', dot: '#D9B7A0', tag: 'seasonal' },
  { name: 'Toasted Rice', note: 'like the bottom of the pudding', dot: '#EAD9BF' },
  { name: 'Amarena Cherry', note: 'sour cherries, syrup and all', dot: '#C2455C', tag: 'classic' },
];

const COUNTER: {
  slug: string;
  alt: string;
  name: string;
  desc: string;
  price: string;
  tint: string;
}[] = [
  {
    slug: 'neve-cup-cutout',
    alt: 'A pastel paper cup of ube gelato with a small spoon',
    name: 'The Cup',
    desc: 'Two flavours, one small spoon, zero regrets.',
    price: '£4.80',
    tint: '#F3E6FF',
  },
  {
    slug: 'neve-sundae-cutout',
    alt: 'A tall sundae glass layered with gelato, cream and fruit',
    name: 'Monte Neve Sundae',
    desc: 'Five layers, whipped cream, amarena summit.',
    price: '£9.00',
    tint: '#FFE9DC',
  },
  {
    slug: 'neve-sandwich-cutout',
    alt: 'A gelato sandwich pressed between two soft biscuits',
    name: 'The Sandwich',
    desc: 'Brown-butter biscuits, your flavour, pressed to order.',
    price: '£6.50',
    tint: '#FFF2D6',
  },
  {
    slug: 'neve-pint-cutout',
    alt: 'An open takeaway pint of gelato with the lid off',
    name: 'Take-home Pint',
    desc: 'Packed flat, no air. Heavier than it looks.',
    price: '£12.00',
    tint: '#FFE4EE',
  },
];

const HOURS: { day: string; time: string }[] = [
  { day: 'Monday', time: 'closed (churn day)' },
  { day: 'Tuesday – Thursday', time: '12:00 – 22:00' },
  { day: 'Friday – Saturday', time: '12:00 – 23:00' },
  { day: 'Sunday', time: '12:00 – 21:00' },
];

export default function NeveGelatoPage() {
  return (
    <div className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400..700&family=Nunito:ital,wght@0,400..800;1,400..700&display=swap"
      />

      <header className={s.topbar}>
        <a className={s.wordmark} href="#top">
          Neve<span className={s.wordmarkDot} aria-hidden="true" />
        </a>
        <nav aria-label="Page sections" className={s.nav}>
          <a href="#flavours">Flavours</a>
          <a href="#counter">The Counter</a>
          <a href="#story">Our Story</a>
          <a href="#catering">Catering</a>
          <a href="#visit">Visit</a>
        </nav>
      </header>

      <main id="top">
        {/* ——— Hero ——— */}
        <section className={s.hero} aria-labelledby="hero-title">
          <div className={s.heroPanel}>
            <div className={s.heroArt}>
              <TabbiedArtwork
                artwork={fluting}
                palette={PALETTE}
                seed="neve-scoop-01"
                fit="cover"
                style={{ position: 'absolute', inset: 0 }}
              />
            </div>
            <div className={s.heroInner}>
              <div className={s.heroCopy}>
                <p className={s.heroKicker}>Gelateria · Harbourfields</p>
                <h1 id="hero-title" className={s.heroTitle}>
                  Soft as fresh snow, gone by ten.
                </h1>
                <p className={s.heroLead}>
                  Eighteen flavours churned every morning from one farm’s milk
                  and whatever the Saturday market was proudest of. When a tub
                  runs out, it runs out — that’s the deal.
                </p>
                <div className={s.heroCtas}>
                  <a className={s.btnPrimary} href="#flavours">
                    Today’s flavours
                  </a>
                  <a className={s.btnGhost} href="#visit">
                    Find the shop
                  </a>
                </div>
              </div>
              <div className={s.heroCone}>
                <Figure
                  slug="neve-cone-cutout"
                  cutout
                  alt="A waffle cone with two pastel scoops of gelato, strawberry on ube"
                  className={s.heroConeImg}
                />
                <p className={s.priceTag}>
                  <span className={s.priceTagName}>double scoop</span>
                  <span className={s.priceTagPrice}>£5.50</span>
                </p>
              </div>
            </div>
          </div>
          <div className={s.heroCaseCard}>
            <Figure
              slug="neve-hero"
              alt="The Neve display case filled with trays of pastel gelato"
              priority
              className={s.sceneImg}
            />
            <p className={s.caption}>The case at 11:58, two minutes to open.</p>
          </div>
        </section>

        <div className={s.scallopPink} aria-hidden="true" />

        {/* ——— Flavour board ——— */}
        <section id="flavours" className={s.flavours} aria-labelledby="flavours-title">
          <div className={s.sectionHead}>
            <h2 id="flavours-title">Today’s eighteen</h2>
            <p>
              Written on the board at noon, crossed off one by one. Sorbetti are
              always dairy-free; everything is churned in-house.
            </p>
          </div>
          <ul className={s.flavourGrid}>
            {FLAVOURS.map((f) => (
              <li key={f.name} className={s.flavour}>
                <span
                  className={s.flavourDot}
                  style={{ backgroundColor: f.dot }}
                  aria-hidden="true"
                />
                <span className={s.flavourBody}>
                  <span className={s.flavourName}>{f.name}</span>
                  <span className={s.flavourNote}>{f.note}</span>
                </span>
                {f.tag ? <span className={s.flavourTag}>{f.tag}</span> : null}
              </li>
            ))}
          </ul>
          <p className={s.flavourFootnote}>
            Allergy folder lives on the counter — ask, we like being asked.
          </p>
        </section>

        <div className={s.scallopCream} aria-hidden="true" />

        {/* ——— The counter ——— */}
        <section id="counter" className={s.counter} aria-labelledby="counter-title">
          <div className={s.sectionHead}>
            <h2 id="counter-title">At the counter</h2>
            <p>Everything scooped generously. Cones rolled at 10 a.m. daily.</p>
          </div>
          <div className={s.counterBand}>
            <div className={s.counterBandArt}>
              <TabbiedArtwork
                artwork={fluting}
                palette={['#FFE9F1', '#FFC2D4', '#FF8FB8', '#D89FFF']}
                seed="neve-counter-04"
                fit="grid"
                cellSize={56}
                style={{ position: 'absolute', inset: 0 }}
              />
            </div>
            <ul className={s.counterGrid}>
              {COUNTER.map((item) => (
                <li
                  key={item.slug}
                  className={s.counterCard}
                  style={{ backgroundColor: item.tint }}
                >
                  <div className={s.counterImgWrap}>
                    <Figure
                      slug={item.slug}
                      cutout
                      alt={item.alt}
                      className={s.counterImg}
                    />
                  </div>
                  <h3>{item.name}</h3>
                  <p>{item.desc}</p>
                  <p className={s.counterPrice}>{item.price}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ——— Milk & fruit story ——— */}
        <section id="story" className={s.story} aria-labelledby="story-title">
          <div className={s.storyArtCol}>
            <TabbiedArtwork
              artwork={fluting}
              palette={['#FFF3EA', '#FF8A5C', '#F5C542', '#FFC2D4']}
              seed="neve-story-02"
              fit="grid"
              cellSize={44}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.storyBody}>
            <h2 id="story-title">One farm, one market, one churn</h2>
            <p>
              Our milk arrives before sunrise from Bellwether Farm, eleven miles
              up the valley — the same forty cows, the same grumpy and excellent
              farmer, every day since we opened. We pasteurise it gently, rest
              it overnight, and churn slow so the gelato stays dense and silky
              instead of fluffy and forgettable.
            </p>
            <p>
              The fruit is whatever Rosa’s stall at the Saturday market can’t
              stop talking about. Peaches get roasted, berries get barely
              touched, and anything that isn’t perfect becomes Thursday’s
              ripple. Nothing here has ever met a flavouring bottle.
            </p>
            <dl className={s.storyStats}>
              <div>
                <dt>Litres of milk a week</dt>
                <dd>420</dd>
              </div>
              <div>
                <dt>Miles from farm to churn</dt>
                <dd>11</dd>
              </div>
              <div>
                <dt>Flavouring bottles owned</dt>
                <dd>0</dd>
              </div>
            </dl>
          </div>
        </section>

        <div className={s.scallopLilac} aria-hidden="true" />

        {/* ——— The shop ——— */}
        <section id="shop" className={s.shop} aria-labelledby="shop-title">
          <div className={s.shopBody}>
            <h2 id="shop-title">A small pink room with big spoons</h2>
            <p>
              Twelve seats, one long marble counter, and a window bench that
              catches the afternoon sun. We painted it the colour of the first
              strawberry batch and never looked back. Dogs get a free mini
              scoop of fior di latte; well-behaved humans may too.
            </p>
            <p>
              There’s no wifi password because there’s no wifi. There is,
              however, a shelf of comics, a jar of extra fan wafers, and the
              best people-watching corner in Harbourfields.
            </p>
          </div>
          <div className={s.shopImgWrap}>
            <Figure
              slug="neve-shop"
              alt="Inside the Neve shop: pastel pink walls, a marble counter and window seats"
              className={s.sceneImg}
            />
            <p className={s.caption}>The window bench, reserved by whoever got there first.</p>
          </div>
        </section>

        {/* ——— Catering ——— */}
        <section id="catering" className={s.catering} aria-labelledby="catering-title">
          <div className={s.sectionHead}>
            <h2 id="catering-title">Neve, but at your party</h2>
            <p>
              The little cart travels. Weddings, birthdays, film sets, one
              unforgettable dentists’ conference.
            </p>
          </div>
          <div className={s.cateringGrid}>
            <article className={s.cateringCard}>
              <h3>The Cart</h3>
              <p>
                Our pastel cart, two staff, six flavours of your choosing and
                unlimited scoops for up to three hours.
              </p>
              <p className={s.cateringPrice}>
                from £340 <span>· up to 80 guests</span>
              </p>
            </article>
            <article className={s.cateringCard}>
              <h3>Tubs for Tables</h3>
              <p>
                Insulated party tubs with cones, cups and a scooping lesson for
                whoever draws the short straw.
              </p>
              <p className={s.cateringPrice}>
                from £95 <span>· serves 25</span>
              </p>
            </article>
            <article className={s.cateringCard}>
              <h3>The Wedding Menu</h3>
              <p>
                A bespoke flavour named after the two of you, plus a tasting
                afternoon in the shop to invent it.
              </p>
              <p className={s.cateringPrice}>
                from £520 <span>· includes the recipe card</span>
              </p>
            </article>
          </div>
          <p className={s.cateringNote}>
            Write to <a href="mailto:cart@neve.example">cart@neve.example</a>{' '}
            with a date and a daydream.
          </p>
        </section>

        {/* ——— Gift cards ——— */}
        <section id="gift" className={s.gift} aria-labelledby="gift-title">
          <div className={s.giftCard}>
            <div className={s.giftCardArt}>
              <TabbiedArtwork
                artwork={fluting}
                palette={['#FF8FB8', '#FFC2D4', '#FFF9F5', '#F5C542', '#D89FFF']}
                seed="neve-gift-07"
                fit="grid"
                cellSize={40}
                style={{ position: 'absolute', inset: 0 }}
              />
            </div>
            <p className={s.giftCardLabel}>Neve gift card</p>
            <p className={s.giftCardValue}>£10 – £100</p>
          </div>
          <div className={s.giftBody}>
            <h2 id="gift-title">The gift of a very good afternoon</h2>
            <p>
              A thick little card in a wax-paper sleeve, loaded with whatever
              amount you like. No expiry, no fine print, redeemable for scoops,
              pints, sundaes or one heroic attempt at the Monte Neve.
            </p>
            <a className={s.btnPrimary} href="#visit">
              Pick one up in the shop
            </a>
          </div>
        </section>

        <div className={s.scallopPink} aria-hidden="true" />

        {/* ——— Hours & location ——— */}
        <section id="visit" className={s.visit} aria-labelledby="visit-title">
          <div className={s.visitHead}>
            <h2 id="visit-title">Come before it melts</h2>
          </div>
          <div className={s.visitGrid}>
            <div className={s.visitBlock}>
              <h3>Hours</h3>
              <table className={s.hoursTable}>
                <tbody>
                  {HOURS.map((row) => (
                    <tr key={row.day}>
                      <th scope="row">{row.day}</th>
                      <td>{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className={s.visitNote}>
                We close early the day the last tub empties. Follow the
                chalkboard, not the clock.
              </p>
            </div>
            <div className={s.visitBlock}>
              <h3>Where</h3>
              <address className={s.address}>
                Neve Gelateria
                <br />
                14 Buttermilk Lane
                <br />
                Harbourfields, HB2 4TH
              </address>
              <p className={s.visitNote}>
                Two streets back from the bandstand — follow anyone walking
                with purpose and a napkin.
              </p>
              <p className={s.visitNote}>
                <a href="mailto:hello@neve.example">hello@neve.example</a>
                <br />
                01632 960 214
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ——— Footer ——— */}
      <footer className={s.footer}>
        <div className={s.footerArt}>
          <TabbiedArtwork
            artwork={fluting}
            palette={['#FFC2D4', '#FF8FB8', '#D89FFF', '#FF8A5C', '#F5C542']}
            seed="neve-footer-03"
            fit="grid"
            cellSize={48}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
        <div className={s.footerInner}>
          <p className={s.footerWordmark}>Neve</p>
          <p className={s.footerLine}>
            Churned every morning in Harbourfields since 2019.
          </p>
          <nav aria-label="Footer" className={s.footerNav}>
            <a href="#flavours">Flavours</a>
            <a href="#counter">Counter</a>
            <a href="#catering">Catering</a>
            <a href="#visit">Visit</a>
          </nav>
          <p className={s.credit}>
            Sprinkles on this page: patterns by{' '}
            <a href="https://tabbied.com">Tabbied</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
