import { TabbiedArtwork } from 'tabbied/react';
import { ivy, quire } from 'tabbied/artworks';
import { Figure } from 'components/Figure';
import s from './foxglove-books.module.css';

export const metadata = {
  title: 'Foxglove — booksellers & café, Wrenfield',
  description:
    'Foxglove is a bookshop and café in a former ironmonger’s on Whistler’s Yard: new fiction, nature writing, poetry, proper coffee, and chairs nobody hurries you out of.',
};

const TABLE_BOOKS: {
  title: string;
  author: string;
  blurb: string;
  price: string;
}[] = [
  {
    title: 'The Lighthouse Variations',
    author: 'Ines Calloway',
    blurb: 'Nine linked novellas, one lamp. Our book club’s autumn pick.',
    price: '£18.00',
  },
  {
    title: 'A Field Guide to Vanishing Ponds',
    author: 'Hartley Dunn',
    blurb: 'Nature writing that reads like detective fiction. Edith’s pick.',
    price: '£22.00',
  },
  {
    title: 'Supper with Strangers',
    author: 'Marguerite Osei',
    blurb: 'A memoir in forty dinners. Contains one unforgivable risotto.',
    price: '£16.00',
  },
  {
    title: 'Quire: New & Selected Poems',
    author: 'Ada Thistlewood',
    blurb: 'Folded, gathered, sewn. She reads here on the 12th.',
    price: '£12.00',
  },
  {
    title: 'Small Gods of the Allotment',
    author: 'Wren Okafor',
    blurb: 'Essays on soil, sheds and minor miracles. Quietly devastating.',
    price: '£14.00',
  },
  {
    title: 'The Night Ferry Timetable',
    author: 'Casimir Holt',
    blurb: 'A mystery told in departures. Theo has sold thirty-one copies.',
    price: '£9.99',
  },
];

const SPINES: { title: string; color: string; ink: string; h: number }[] = [
  { title: 'The Lighthouse Variations', color: '#1E3A2F', ink: '#F7F3E8', h: 94 },
  { title: 'Vanishing Ponds', color: '#C25E4C', ink: '#F7F3E8', h: 86 },
  { title: 'Quire', color: '#D9CBA8', ink: '#1E3A2F', h: 72 },
  { title: 'Supper with Strangers', color: '#3E6B54', ink: '#F7F3E8', h: 90 },
  { title: 'The Night Ferry Timetable', color: '#8FA98F', ink: '#1E3A2F', h: 80 },
  { title: 'Small Gods of the Allotment', color: '#1E3A2F', ink: '#D9CBA8', h: 98 },
  { title: 'Letters to a Young Bookseller', color: '#D9CBA8', ink: '#1E3A2F', h: 84 },
  { title: 'The Marginalia Society', color: '#C25E4C', ink: '#F7F3E8', h: 92 },
  { title: 'Winter Readings', color: '#3E6B54', ink: '#F7F3E8', h: 76 },
  { title: 'An Index of Rain', color: '#8FA98F', ink: '#1E3A2F', h: 88 },
  { title: 'The Complete Foxglove Miscellany', color: '#1E3A2F', ink: '#F7F3E8', h: 82 },
  { title: 'Bindings', color: '#D9CBA8', ink: '#1E3A2F', h: 70 },
];

const EVENTS: {
  date: string;
  month: string;
  title: string;
  detail: string;
}[] = [
  {
    date: '02',
    month: 'SEP',
    title: 'Book club: The Lighthouse Variations',
    detail: 'First Tuesday of the month · 19:00 · free, biscuits provided',
  },
  {
    date: '12',
    month: 'SEP',
    title: 'An evening with Ada Thistlewood',
    detail: 'Reading from Quire · 18:30 · £5, includes a glass of wine',
  },
  {
    date: '20',
    month: 'SEP',
    title: 'Story hour for small people',
    detail: 'Ages 3–7, grown-ups welcome on cushions · 10:30 · free',
  },
  {
    date: '25',
    month: 'SEP',
    title: 'Ghost stories by lamplight',
    detail: 'Forgotten Victorian hauntings, read aloud · 20:00 · £4',
  },
  {
    date: '28',
    month: 'SEP',
    title: 'Silent reading night',
    detail: 'Last Sunday monthly · 18:00 · bring a book, we bring the quiet',
  },
];

const MENU: { section: string; items: { name: string; price: string }[] }[] = [
  {
    section: 'Coffee & such',
    items: [
      { name: 'Espresso', price: '£2.80' },
      { name: 'Flat white', price: '£3.60' },
      { name: 'Batch filter (bottomless-ish)', price: '£3.00' },
      { name: 'Hot chocolate, proper', price: '£3.80' },
      { name: 'Pot of Assam for one', price: '£3.20' },
      { name: 'Fresh mint tea', price: '£3.00' },
    ],
  },
  {
    section: 'From the tin',
    items: [
      { name: 'Almond biscotto', price: '£1.80' },
      { name: 'Brown-butter shortbread', price: '£2.50' },
      { name: 'Marmalade cake, thick slice', price: '£4.00' },
      { name: 'Cheese scone, warm, salted butter', price: '£3.80' },
    ],
  },
];

export default function FoxgloveBooksPage() {
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
        href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300..700;1,300..700&family=Karla:wght@400;500;700&display=swap"
      />

      {/* ——— Masthead ——— */}
      <header className={s.masthead}>
        <p className={s.mastheadOver}>Booksellers &amp; Café · Est. 2014</p>
        <p className={s.mastheadTitle} aria-hidden="true">
          Foxglove
        </p>
        <h1 className={s.visuallyHidden}>
          Foxglove — booksellers and café, Wrenfield
        </h1>
        <div className={s.mastheadBand}>
          <TabbiedArtwork
            artwork={quire}
            palette={['#F7F3E8', '#3E6B54', '#C25E4C', '#D9CBA8', '#8FA98F']}
            seed="foxglove-band-01"
            fit="grid"
            cellSize={34}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
        <nav aria-label="Page sections" className={s.mastheadNav}>
          <a href="#table">The Table</a>
          <a href="#picks">Staff Picks</a>
          <a href="#cafe">Café</a>
          <a href="#events">Events</a>
          <a href="#story">Our Story</a>
          <a href="#goods">Goods</a>
          <a href="#visit">Visit</a>
        </nav>
      </header>

      <main>
        {/* ——— Hero ——— */}
        <section className={s.hero} aria-label="The shop">
          <div className={s.heroField} aria-hidden="true">
            <TabbiedArtwork
              artwork={ivy}
              palette={['#F7F3E8', '#8FA98F', '#3E6B54', '#D9CBA8', '#1E3A2F']}
              seed="foxglove-ivy-01"
              fit="grid"
              cellSize={84}
              style={{ position: 'absolute', inset: 0 }}
            />
            <span className={s.heroFieldScrim} />
          </div>
          <figure className={s.heroFrame}>
            <div className={s.heroImgWrap}>
              <Figure
                slug="foxglove-hero"
                alt="Tall forest-green bookshelves with a rolling ladder and warm reading lamps"
                priority
                className={s.photo}
              />
            </div>
            <figcaption className={s.heroCaption}>
              The long room at Whistler’s Yard — shelves to the ceiling, ladder
              included, vertigo optional.
            </figcaption>
          </figure>
          <p className={s.heroLede}>
            We are a bookshop with a café attached, or possibly a café with a
            serious book problem. Either way: new fiction, nature writing,
            poetry, one very good espresso machine, and chairs nobody will
            hurry you out of.
          </p>
        </section>

        {/* ——— This month's table ——— */}
        <section id="table" className={s.tableSection} aria-labelledby="t-table">
          <div className={s.sectionHead}>
            <p className={s.overline}>September</p>
            <h2 id="t-table">This month’s table</h2>
            <p className={s.sectionSub}>
              Six books we keep pressing into hands. Arranged, rearranged, and
              defended daily.
            </p>
          </div>
          <div className={s.tableGrid}>
            <div className={s.tableImgWrap}>
              <Figure
                slug="foxglove-table"
                alt="A display table of new books photographed from above"
                className={s.photo}
              />
            </div>
            <ol className={s.bookList}>
              {TABLE_BOOKS.map((b) => (
                <li key={b.title} className={s.bookRow}>
                  <div className={s.bookHead}>
                    <span className={s.bookTitle}>{b.title}</span>
                    <span className={s.bookPrice}>{b.price}</span>
                  </div>
                  <p className={s.bookAuthor}>{b.author}</p>
                  <p className={s.bookBlurb}>{b.blurb}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className={s.shelf} aria-label="A shelf of this season’s spines">
            <div className={s.shelfEndpaper} aria-hidden="true">
              <TabbiedArtwork
                artwork={quire}
                palette={['#F0EAD8', '#D9CBA8', '#8FA98F', '#3E6B54', '#C25E4C']}
                seed="foxglove-endpaper-04"
                fit="grid"
                cellSize={52}
                style={{ position: 'absolute', inset: 0 }}
              />
              <span className={s.shelfEndpaperScrim} />
            </div>
            <ul className={s.spineRow}>
              {SPINES.map((spine, i) => (
                <li
                  key={spine.title}
                  className={i === SPINES.length - 1 ? s.spineTilted : s.spine}
                  style={{
                    backgroundColor: spine.color,
                    color: spine.ink,
                    height: `${spine.h}%`,
                  }}
                >
                  <span>{spine.title}</span>
                </li>
              ))}
            </ul>
            <div className={s.shelfBoard} aria-hidden="true" />
            <p className={s.shelfNote}>
              The season’s shelf, straightened every morning, leaning by noon.
            </p>
          </div>
        </section>

        {/* ——— Staff picks ——— */}
        <section id="picks" className={s.picks} aria-labelledby="t-picks">
          <div className={s.sectionHead}>
            <p className={s.overline}>Underlined twice</p>
            <h2 id="t-picks">Staff picks</h2>
          </div>
          <div className={s.pickGrid}>
            <article className={s.pickCard}>
              <div className={s.pickTile}>
                <Figure
                  slug="foxglove-keeper-1"
                  alt="Portrait of Edith Cray, a woman in her sixties with a silver bun and a green cardigan"
                  className={s.pickPortrait}
                />
              </div>
              <blockquote className={s.pickQuote}>
                <p>
                  “A Field Guide to Vanishing Ponds sounds niche until you
                  realise it’s about everything that quietly disappears while
                  we’re busy. I have bought eleven copies for people who did
                  not ask.”
                </p>
                <footer>
                  <span className={s.pickName}>Edith Cray</span>
                  <span className={s.pickRole}>
                    Founder · fiction &amp; nature
                  </span>
                </footer>
              </blockquote>
            </article>
            <article className={s.pickCard}>
              <div className={s.pickTile}>
                <Figure
                  slug="foxglove-keeper-2"
                  alt="Portrait of Theo Mensah, a young man with short locs wearing a cream jumper"
                  className={s.pickPortrait}
                />
              </div>
              <blockquote className={s.pickQuote}>
                <p>
                  “The Night Ferry Timetable is a mystery where the detective
                  is, essentially, a timetable. I finished it at 2 a.m. and
                  immediately started again from the departures page.”
                </p>
                <footer>
                  <span className={s.pickName}>Theo Mensah</span>
                  <span className={s.pickRole}>
                    Café lead · poetry &amp; crime
                  </span>
                </footer>
              </blockquote>
            </article>
          </div>
        </section>

        {/* ——— Café ——— */}
        <section id="cafe" className={s.cafe} aria-labelledby="t-cafe">
          <div className={s.cafeGrid}>
            <div className={s.cafeIntro}>
              <p className={s.overline}>The espresso bar</p>
              <h2 id="t-cafe">The café at the back</h2>
              <p className={s.cafeText}>
                Four tables, a window bench, and Theo’s espresso machine —
                which he speaks to, and which listens. One coffee buys one
                hour of chair. We have never once checked.
              </p>
              <div className={s.cafeImgWrap}>
                <Figure
                  slug="foxglove-cafe"
                  alt="The espresso bar corner of the shop, with cups stacked beside the machine"
                  className={s.photo}
                />
              </div>
            </div>
            <div className={s.menuCard}>
              <p className={s.menuHeading}>House list</p>
              {MENU.map((group) => (
                <div key={group.section} className={s.menuGroup}>
                  <h3>{group.section}</h3>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item.name}>
                        <span className={s.menuName}>{item.name}</span>
                        <span className={s.menuDots} aria-hidden="true" />
                        <span className={s.menuPrice}>{item.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className={s.menuCup}>
                <Figure
                  slug="foxglove-cup-cutout"
                  cutout
                  alt="A terracotta cup of coffee with a biscotto balanced on the saucer"
                  className={s.menuCupImg}
                />
              </div>
              <p className={s.menuFootnote}>
                Every drink comes with a biscotto. Resistance is impolite.
              </p>
            </div>
          </div>
        </section>

        {/* ——— Events ——— */}
        <section id="events" className={s.events} aria-labelledby="t-events">
          <div className={s.sectionHead}>
            <p className={s.overline}>Chairs in rows</p>
            <h2 id="t-events">September in the long room</h2>
            <p className={s.sectionSub}>
              Readings, clubs and one evening of respectable hauntings. Seats
              are first-come; regulars know to come early.
            </p>
          </div>
          <ul className={s.eventList}>
            {EVENTS.map((e) => (
              <li key={`${e.date}-${e.title}`} className={s.eventRow}>
                <div className={s.eventDate}>
                  <span className={s.eventDay}>{e.date}</span>
                  <span className={s.eventMonth}>{e.month}</span>
                </div>
                <div className={s.eventBody}>
                  <h3>{e.title}</h3>
                  <p>{e.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ——— Story ——— */}
        <section id="story" className={s.storySection} aria-labelledby="t-story">
          <div className={s.sectionHead}>
            <p className={s.overline}>Since 2014</p>
            <h2 id="t-story">A former ironmonger’s, improved</h2>
          </div>
          <div className={s.storyGrid}>
            <div className={s.storyText}>
              <p className={s.dropcap}>
                When Edith Cray bought number three, Whistler’s Yard, it still
                smelled of machine oil and sold precisely one thing she wanted:
                a ladder. She kept the ladder, kept the long oak counter, and
                replaced twelve thousand hinges with roughly the same number of
                books. The ironmonger, now ninety-one, approves, and comes in
                on Thursdays for the cheese scone.
              </p>
              <p>
                The shop runs on a few stubborn convictions: that a bookshop
                should be arranged by enthusiasm rather than strict alphabet;
                that children’s books belong at children’s height; and that
                nobody has ever regretted the hardback. The café arrived in
                2017 when we noticed people were staying all afternoon anyway
                and it seemed rude not to feed them.
              </p>
              <p>
                We stamp every purchase with the foxglove ex libris on the
                flyleaf — ink, never sticker — so that in fifty years, in some
                other shop’s second-hand bin, our books can find their way
                home.
              </p>
            </div>
            <figure className={s.storyFigure}>
              <div className={s.storyImgWrap}>
                <Figure
                  slug="foxglove-nook"
                  alt="A window reading nook with a worn armchair and a stack of books on the sill"
                  className={s.photo}
                />
              </div>
              <figcaption>
                The window nook. House rules: one occupant, no time limit.
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ——— Goods ——— */}
        <section id="goods" className={s.goods} aria-labelledby="t-goods">
          <div className={s.sectionHead}>
            <p className={s.overline}>Take us home</p>
            <h2 id="t-goods">Goods &amp; gifts</h2>
          </div>
          <div className={s.goodsBand}>
            <div className={s.goodsBandArt}>
              <TabbiedArtwork
                artwork={quire}
                palette={['#F0EAD8', '#D9CBA8', '#8FA98F', '#C25E4C']}
                seed="foxglove-goods-05"
                fit="grid"
                cellSize={44}
                style={{ position: 'absolute', inset: 0 }}
              />
            </div>
            <div className={s.goodsGrid}>
              <article className={s.goodsCard}>
                <div className={s.goodsImgWrap}>
                  <Figure
                    slug="foxglove-stack-cutout"
                    cutout
                    alt="A stack of clothbound hardback books tied with string"
                    className={s.goodsImg}
                  />
                </div>
                <h3>The Clothbound Dozen</h3>
                <p>
                  Twelve classics rebound in cloth, chosen by Edith, tied with
                  string and strong opinions.
                </p>
                <p className={s.goodsPrice}>£45.00</p>
              </article>
              <article className={s.goodsCard}>
                <div className={s.goodsImgWrap}>
                  <Figure
                    slug="foxglove-tote-cutout"
                    cutout
                    alt="A canvas tote bag printed with the Foxglove ex libris stamp"
                    className={s.goodsImg}
                  />
                </div>
                <h3>The Ex Libris Tote</h3>
                <p>
                  Heavy canvas, our flyleaf stamp in forest green. Tested to a
                  capacity of nineteen paperbacks.
                </p>
                <p className={s.goodsPrice}>£14.00</p>
              </article>
              <article className={s.goodsCard}>
                <div className={s.goodsCardPlain}>
                  <span className={s.giftMark} aria-hidden="true">
                    ex libris
                  </span>
                </div>
                <h3>Gift Cards</h3>
                <p>
                  Any amount, stamped and wax-sealed at the counter. No expiry
                  — books wait patiently.
                </p>
                <p className={s.goodsPrice}>from £10.00</p>
              </article>
            </div>
          </div>
        </section>

        {/* ——— Visit ——— */}
        <section id="visit" className={s.visit} aria-labelledby="t-visit">
          <div className={s.visitField} aria-hidden="true">
            <TabbiedArtwork
              artwork={ivy}
              palette={['#F7F3E8', '#D9CBA8', '#8FA98F', '#3E6B54', '#C25E4C']}
              seed="foxglove-ivy-07"
              fit="grid"
              cellSize={68}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.visitFrame}>
            <h2 id="t-visit">Hours &amp; whereabouts</h2>
            <div className={s.visitCols}>
              <div>
                <h3>Open</h3>
                <table className={s.hoursTable}>
                  <tbody>
                    <tr>
                      <th scope="row">Monday – Friday</th>
                      <td>09:00 – 19:00</td>
                    </tr>
                    <tr>
                      <th scope="row">Saturday</th>
                      <td>09:00 – 21:00</td>
                    </tr>
                    <tr>
                      <th scope="row">Sunday</th>
                      <td>10:00 – 17:00</td>
                    </tr>
                  </tbody>
                </table>
                <p className={s.visitNote}>
                  Saturday evenings the café stays open late for the shelves —
                  wine by the glass, lamps on, ladder off-limits after eight.
                </p>
              </div>
              <div>
                <h3>Find us</h3>
                <address className={s.address}>
                  Foxglove Booksellers &amp; Café
                  <br />
                  3 Whistler’s Yard
                  <br />
                  Wrenfield WF4 2JR
                </address>
                <p className={s.visitNote}>
                  Through the arch off Pellam Street, past the clockmaker’s —
                  if you can smell coffee and hear pages, you’re close.
                </p>
                <p className={s.visitNote}>
                  <a href="mailto:shop@foxglovebooks.example">
                    shop@foxglovebooks.example
                  </a>{' '}
                  · 01632 960 733
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ——— Footer ——— */}
      <footer className={s.footer}>
        <div className={s.footerBand}>
          <TabbiedArtwork
            artwork={quire}
            palette={['#1E3A2F', '#3E6B54', '#8FA98F', '#C25E4C', '#D9CBA8']}
            seed="foxglove-footer-08"
            fit="grid"
            cellSize={38}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
        <div className={s.footerInner}>
          <p className={s.footerMark}>Foxglove</p>
          <p className={s.footerLine}>
            Booksellers &amp; Café · 3 Whistler’s Yard, Wrenfield · Est. 2014
          </p>
          <nav aria-label="Footer" className={s.footerNav}>
            <a href="#table">The Table</a>
            <a href="#events">Events</a>
            <a href="#goods">Goods</a>
            <a href="#visit">Visit</a>
          </nav>
          <p className={s.colophon}>
            Set in Crimson Pro &amp; Karla. Endpapers &amp; ivy patterned by{' '}
            <a href="https://tabbied.com">Tabbied</a>.
          </p>
        </div>
      </footer>
    </div>
  );
}
