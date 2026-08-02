import { TabbiedArtwork } from 'tabbied/react';
import {
  weave, plait, corduroy, damier, thickset,
} from 'tabbied/artworks';
import { Figure } from 'components/Figure';
import s from './meterware.module.css';

export const metadata = {
  title: 'Meterware: Weberei seit 1908, Vorarlberg',
  description:
    'Meterware weaves cloth by the metre in Vorarlberg. Forty-one qualities on the shelf, indigo dyed in the house, minimum order one metre.',
};

/* Ecru cloth, dark ink, one indigo. Every field takes `transparent` in the
   background slot so the ecru shows through the weave. */
const INK = '#14161F';
const INDIGO = '#2B3FAE';
const GREY = '#8E8A7E';
const PALE = '#DCD7C9';
/* The two inks the decorative tiles draw with: always the quiet pair, so a
   tile reads as a sample rather than as another headline. */
/* The tiles pin their doodle to a whole multiple of the cell (9 × 72px)
   and let the plate clip it. A fluid box gives fractional grid tracks and
   a hairline seam at every cell edge. */
const TILE_BOX = 648;
const TILE_A = GREY;
const TILE_B = PALE;


const QUALITIES = [
  { art: '1104', name: 'Zwirnköper', comp: 'Cotton 100 %', weight: '340 g/m²', width: '150 cm', price: '€28 / m' },
  { art: '1140', name: 'Panamabindung', comp: 'Linen 60, cotton 40', weight: '260 g/m²', width: '150 cm', price: '€34 / m' },
  { art: '2011', name: 'Halbleinen grob', comp: 'Linen 55, cotton 45', weight: '420 g/m²', width: '140 cm', price: '€41 / m' },
  { art: '2208', name: 'Feinköper indigo', comp: 'Cotton 100 %', weight: '310 g/m²', width: '150 cm', price: '€38 / m' },
  { art: '3017', name: 'Wollflanell', comp: 'Wool 100 %', weight: '480 g/m²', width: '145 cm', price: '€62 / m' },
  { art: '3140', name: 'Doppelgewebe', comp: 'Wool 70, cotton 30', weight: '520 g/m²', width: '145 cm', price: '€71 / m' },
];

const HOUSE = [
  { n: '01', t: 'We dye before we weave', d: 'Yarn-dyed, not piece-dyed. It costs more, it fades in a way people like, and it is why our indigo goes grey rather than patchy.' },
  { n: '02', t: 'One metre is a real order', d: 'The minimum is one metre and always has been. A cutting length is not a nuisance; it is how people find out whether they want forty.' },
  { n: '03', t: 'Forty-one qualities, no seasons', d: 'The book does not change in spring. Articles are retired only when a yarn stops being made, and we announce it a year ahead.' },
  { n: '04', t: 'The loom is the limit', d: 'One hundred and fifty centimetres, because that is the reed. Anything wider is somebody else’s mill and we will tell you which.' },
];

const NUMBERS = [
  ['1908', 'Weaving since'],
  ['41', 'Qualities in the book'],
  ['150 cm', 'Loom width'],
  ['1 m', 'Minimum order'],
];

export default function MeterwarePage() {
  return (
    <div className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..700&display=swap"
      />

      <header className={s.bar}>
        <a className={s.mark} href="#top">
          Meterware
          <i>Weberei, Vorarlberg</i>
        </a>
        <nav aria-label="Sections">
          <a href="#book">The book</a>
          <a href="#house">House rules</a>
          <a href="#mill">Mill</a>
          <a href="#order">Order</a>
        </nav>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div className={s.heroField} aria-hidden="true">
            <TabbiedArtwork
              artwork={weave}
              palette={['transparent', PALE, GREY]}
              fit="grid"
              cellSize={56}
              redrawInterval={5200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <p className={s.eyebrow}>Weberei seit 1908 / Bregenzerwald</p>
            <h1>
              Cloth by the metre,
              <br />
              and one metre
              <br />
              <span>is a real order.</span>
            </h1>
            <p className={s.lede}>
              Forty-one qualities, yarn-dyed in the house, woven on looms a
              hundred and fifty centimetres wide because that is the reed.
            </p>
          </div>
        </section>

        <figure className={s.bleed}>
          <Figure
            slug="meterware-loom"
            alt="A wide industrial loom mid-weave with warp threads stretched under even light"
            priority
          />
          <figcaption>Loom 4, article 2208. Eleven metres an hour, on a good day.</figcaption>
        </figure>

        <dl className={s.numbers}>
          {NUMBERS.map(([v, k]) => (
            <div key={k}>
              <dt>{v}</dt>
              <dd>{k}</dd>
            </div>
          ))}
        </dl>

        {/* ----------------------------------------------------------- BOOK */}
        <section id="book" className={s.book} aria-labelledby="book-h">
          <h2 className={s.h2} id="book-h">
            Six from the book
          </h2>
          <ol className={s.table}>
            <li className={s.thead} aria-hidden="true">
              <span>Art.</span>
              <span>Quality</span>
              <span>Composition</span>
              <span>Weight</span>
              <span>Width</span>
              <span>Price</span>
            </li>
            {QUALITIES.map((q) => (
              <li key={q.art}>
                <span className={s.art}>{q.art}</span>
                <span className={s.qname}>{q.name}</span>
                <span>{q.comp}</span>
                <span className={s.num}>{q.weight}</span>
                <span className={s.num}>{q.width}</span>
                <span className={s.price}>{q.price}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------ WARP BAND */}
        <section className={s.warpBand} aria-hidden="true">
          <div className={s.warpField}>
            <TabbiedArtwork
              artwork={plait}
              palette={['transparent', INDIGO, INK, GREY]}
              fit="grid"
              cellSize={112}
              redrawInterval={3600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* ---------------------------------------------------------- HOUSE */}
        <section id="house" className={s.house} aria-labelledby="house-h">
          <div className={s.houseField} aria-hidden="true">
            <TabbiedArtwork
              artwork={corduroy}
              palette={['transparent', GREY, PALE]}
              fit="grid"
              cellSize={44}
              redrawInterval={6000}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.houseInner}>
            <h2 className={s.h2} id="house-h">
              Four house rules
            </h2>
            <ol className={s.houseList}>
              {HOUSE.map((h) => (
                <li key={h.n}>
                  <span className={s.hN}>{h.n}</span>
                  <h3>{h.t}</h3>
                  <p>{h.d}</p>
                </li>
              ))}
            </ol>
            <div className={s.pair}>
              <figure>
                <Figure
                  slug="meterware-creel"
                  alt="A warping creel filled with cones of indigo and undyed yarn"
                />
                <figcaption>Creel, 384 ends. Set up takes longer than the weaving.</figcaption>
              </figure>
              <figure>
                <Figure
                  slug="meterware-rolls"
                  alt="Rolls of woven cloth stacked on end in a mill store"
                />
                <figcaption>The store. Nothing here is dyed after weaving.</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------- MILL */}
        <section id="mill" className={s.mill} aria-labelledby="mill-h">
          <h2 className={s.h2} id="mill-h">
            The mill
          </h2>
          <div className={s.millGrid}>
            <p className={s.big}>
              Six looms, two warping frames, one indigo vat and eleven people,
              three of whom are the grandchildren of people who worked the same
              floor.
            </p>
            <div className={s.millCol}>
              <p>
                The building is on the Bregenzerach because the water used to
                turn the wheel. It now cools the dye house, which is a less
                romantic job and a more useful one.
              </p>
              <p>
                We sell direct and to about sixty makers. There is no wholesale
                price and no retail price. There is a price, and it is on the
                list above.
              </p>
            </div>
          </div>
          <figure className={s.wide}>
            <Figure
              slug="meterware-swatch"
              alt="An open swatch book of woven cloth samples on a plain table"
            />
            <figcaption>The book. Posted free anywhere, once, to anyone who asks.</figcaption>
          </figure>
        </section>

        {/* ---------------------------------------------------------- ORDER */}
        <section id="order" className={s.order} aria-labelledby="order-h">
          <div className={s.orderField} aria-hidden="true">
            <TabbiedArtwork
              artwork={damier}
              palette={['transparent', INDIGO, GREY]}
              fit="grid"
              cellSize={78}
              redrawInterval={4400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.orderInner}>
            <h2 className={s.h2} id="order-h">
              Ordering
            </h2>
            <dl className={s.contact}>
              <div>
                <dt>Mill</dt>
                <dd>
                  Achstrasse 8
                  <br />
                  6870 Bezau, Vorarlberg
                </dd>
              </div>
              <div>
                <dt>Write</dt>
                <dd>
                  <a href="mailto:weberei@meterware.example">weberei@meterware.example</a>
                </dd>
              </div>
              <div>
                <dt>Swatch book</dt>
                <dd>Free, once per address. Ask by post or by mail.</dd>
              </div>
              <div>
                <dt>Lead time</dt>
                <dd>From stock, three days. Woven to order, five weeks.</dd>
              </div>
            </dl>
          </div>
        </section>
        {/* ---------------------------------------------------------- TILES */}
        <section id="tiles" className={s.tiles} aria-labelledby="tiles-h">
          <h2 id="tiles-h">Three decisions before the loom</h2>
          <p className={s.secNote}>By the time the shuttle moves, the cloth has already been decided.</p>
          <div className={s.tileGrid}>
              <article key="01">
                <div className={s.tilePlate} aria-hidden="true">
                  <TabbiedArtwork
                    artwork={weave}
                    palette={['transparent', TILE_A, TILE_B]}
                    fit="grid"
                    cellSize={72}
                    redrawInterval={5400}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: TILE_BOX,
                      height: TILE_BOX,
                    }}
                  />
                </div>
                <p className={s.tileN}>01</p>
                <h3>The yarn</h3>
                <p className={s.tileBody}>Count, twist and origin. A high-twist cotton and a low-twist cotton at the same weight make two completely different cloths.</p>
              </article>
              <article key="02">
                <div className={s.tilePlate} aria-hidden="true">
                  <TabbiedArtwork
                    artwork={plait}
                    palette={['transparent', TILE_A, TILE_B]}
                    fit="grid"
                    cellSize={72}
                    redrawInterval={6200}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: TILE_BOX,
                      height: TILE_BOX,
                    }}
                  />
                </div>
                <p className={s.tileN}>02</p>
                <h3>The dye</h3>
                <p className={s.tileBody}>Yarn dyed, in the house, before warping. It costs more and it is the only way to get an indigo that goes grey rather than patchy.</p>
              </article>
              <article key="03">
                <div className={s.tilePlate} aria-hidden="true">
                  <TabbiedArtwork
                    artwork={thickset}
                    palette={['transparent', TILE_A, TILE_B]}
                    fit="grid"
                    cellSize={72}
                    redrawInterval={4800}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: TILE_BOX,
                      height: TILE_BOX,
                    }}
                  />
                </div>
                <p className={s.tileN}>03</p>
                <h3>The sett</h3>
                <p className={s.tileBody}>Ends per centimetre. Too open and it grins; too close and it boards. This is the number that takes the longest to get right.</p>
              </article>
          </div>
        </section>

        {/* ---------------------------------------------------------- INDEX */}
        <section id="index" className={s.idx} aria-labelledby="idx-h">
          <h2 id="idx-h">Finishing</h2>
          <p className={s.secNote}>What happens after the loom. Every article is finished the same way every time, which is why repeat orders match.</p>
          <ol className={s.idxList}>
            <li className={s.idxHead} aria-hidden="true">
                <span>Step</span>
                <span>Method</span>
                <span>Duration</span>
                <span>Effect</span>
            </li>
              <li key="Mending">
                <span>Mending</span>
                <span>By hand, on a frame</span>
                <span>2 h per 30 m</span>
                <span>Faults marked and repaired</span>
              </li>
              <li key="Scour">
                <span>Scour</span>
                <span>Warm, mild</span>
                <span>40 min</span>
                <span>Removes size and oil</span>
              </li>
              <li key="Full">
                <span>Full</span>
                <span>Mechanical, wool only</span>
                <span>20 to 90 min</span>
                <span>Density and handle</span>
              </li>
              <li key="Dry">
                <span>Dry</span>
                <span>Frame, no tension</span>
                <span>12 h</span>
                <span>Stable width</span>
              </li>
              <li key="Press">
                <span>Press</span>
                <span>Steam, one pass</span>
                <span>15 min</span>
                <span>Surface only</span>
              </li>
              <li key="Measure">
                <span>Measure</span>
                <span>Twice, by two people</span>
                <span>n/a</span>
                <span>Printed on the ticket</span>
              </li>
          </ol>
        </section>

        {/* ------------------------------------------------------------ FAQ */}
        <section id="faq" className={s.faq} aria-labelledby="faq-h">
          <h2 id="faq-h">Ordering questions</h2>
          <dl className={s.faqList}>
              <div key="Will the next roll match">
                <dt>Will the next roll match?</dt>
                <dd>Within a batch, yes. Across batches there is a shade difference we will show you before shipping. Order the whole quantity at once if it matters.</dd>
              </div>
              <div key="Do you sell to the trade">
                <dt>Do you sell to the trade?</dt>
                <dd>There is no trade price and no retail price. There is a price, and it is the one on the list.</dd>
              </div>
              <div key="Can you weave my design?">
                <dt>Can you weave my design?</dt>
                <dd>Above four hundred metres, yes, on 150 cm. Below that it is our book or another mill, and we will tell you which mill.</dd>
              </div>
              <div key="Will it shrink?">
                <dt>Will it shrink?</dt>
                <dd>Everything is finished before sale, so about one per cent. Wash the sample we send you before you cut forty metres.</dd>
              </div>
          </dl>
        </section>

      </main>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p className={s.footName}>Meterware</p>
            <p className={s.footTag}>Weberei seit 1908, Achstrasse 8, Bezau, Vorarlberg.</p>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Cloth</h2>
            <ul className={s.footLinks}>
              <li>
                <a href="#book">Six from the book</a>
              </li>
              <li>
                <a href="#house">House rules</a>
              </li>
              <li>
                <a href="#mill">The mill</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Ordering</h2>
            <ul className={s.footLinks}>
              <li>
                <a href="#order">Ordering</a>
              </li>
              <li>
                <a href="#order">Swatch book</a>
              </li>
              <li>
                <a href="#order">Lead times</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Contact</h2>
            <p className={s.footAddr}>
              Achstrasse 8
              <br />
              6870 Bezau, Vorarlberg
              <br />
              weberei@meterware.example
              <br />
              Minimum order one metre
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p>A fictional weaving mill. Prices and times are invented.</p>
          <p>
            Patterns by{' '}
            <a href="https://tabbied.com" rel="noopener">
              Tabbied
            </a>
            , drawn live on a transparent ground and redrawn on a timer.
          </p>
        </div>
      </footer>
    </div>
  );
}
