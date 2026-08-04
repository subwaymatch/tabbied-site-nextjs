import { TabbiedPattern } from 'tabbied/react';
import {
  bias, corduroy, damier, dogtooth, stitch, taper, thickset,
} from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import s from './passform.module.css';

export const metadata = {
  title: 'Passform: Maßschneiderei, Hamburg',
  description:
    'Passform cuts bespoke by hand in Hamburg. Four fittings, sixty-two hours, one pattern kept for life.',
};

/* Linen paper, dark ink, one rust that reads as thread. Pattern fields take
   `transparent` in the background slot, so the linen shows through the weave. */
const INK = '#191512';
const RUST = '#C1440E';
const GREY = '#9A9086';
const PALE = '#E5DFD4';
/* The two inks the decorative tiles draw with: always the quiet pair, so a
   tile reads as a sample rather than as another headline. */
/* The tiles pin their doodle to a whole multiple of the cell (9 × 72px)
   and let the plate clip it. A fluid box gives fractional grid tracks and
   a hairline seam at every cell edge. */
const TILE_BOX = 648;
const TILE_A = GREY;
const TILE_B = PALE;


const STAGES = [
  { n: 'I', t: 'Measure', hrs: '2 h', d: 'Twenty-eight measurements, taken twice, and a long look at how you actually stand rather than how you stand when being measured.' },
  { n: 'II', t: 'Draft', hrs: '6 h', d: 'The pattern is drawn on brown paper by one cutter and kept forever. Your second suit begins from it and takes forty hours instead of sixty-two.' },
  { n: 'III', t: 'Baste', hrs: '14 h', d: 'A first fitting in white thread, deliberately ugly, so nobody is tempted to admire it instead of correcting it.' },
  { n: 'IV', t: 'Forward', hrs: '22 h', d: 'Canvas, padding stitch, and the shoulder. Second and third fittings sit here, a fortnight apart.' },
  { n: 'V', t: 'Finish', hrs: '18 h', d: 'Buttonholes, lining and the last fitting. If the collar is not right we take the whole thing back to the bench, and we have.' },
];

const CLOTHS = [
  ['Worsted, 11 oz', 'Huddersfield', 'Year-round, four seasons'],
  ['Flannel, 14 oz', 'Yorkshire', 'Autumn and winter, drapes and forgives'],
  ['Fresco, 9 oz', 'Huddersfield', 'High twist, open weave, for August'],
  ['Tweed, 16 oz', 'Outer Hebrides', 'Country only. Heavy, and it should be'],
  ['Linen, 8 oz', 'Kortrijk', 'Creases. That is the material working, not failing'],
];

const NUMBERS = [
  ['62 h', 'Hours, first suit'],
  ['4', 'Fittings'],
  ['28', 'Measurements'],
  ['1972', 'Bench opened'],
];

export default function PassformPage() {
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
          Passform
        </a>
        <nav aria-label="Sections">
          <a href="#how">How</a>
          <a href="#cloth">Cloth</a>
          <a href="#prices">Prices</a>
          <a href="#bench">Bench</a>
        </nav>
        <span className={s.since}>Maßschneiderei seit 1972</span>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={stitch}
              palette={['transparent', PALE, GREY]}
              fit="grid"
              cellSize={52}
              redrawInterval={4400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <p className={s.eyebrow}>Hamburg / Neuer Wall 44, Hinterhof</p>
            <h1>
              A pattern drawn
              <br />
              once and kept
              <br />
              <span>for the rest of it.</span>
            </h1>
            <p className={s.lede}>
              Bespoke, cut by hand, four fittings. Sixty-two hours the first
              time and forty every time after, because the hard part is already
              on paper with your name on it.
            </p>
          </div>
        </section>

        <figure className={s.bleed}>
          <Figure
            slug="passform-table"
            alt="A long tailor's cutting table covered with brown paper pattern pieces, shears and chalk"
            priority
          />
          <figcaption>Bench 1. The pattern for a coat begun in 1996 and altered eleven times.</figcaption>
        </figure>

        <dl className={s.numbers}>
          {NUMBERS.map(([v, k]) => (
            <div key={k}>
              <dt>{v}</dt>
              <dd>{k}</dd>
            </div>
          ))}
        </dl>

        {/* ------------------------------------------------------------ HOW */}
        <section id="how" className={s.how} aria-labelledby="how-h">
          <h2 className={s.h2} id="how-h">
            Five stages
          </h2>
          <ol className={s.stages}>
            {STAGES.map((x) => (
              <li key={x.n}>
                <span className={s.stN}>{x.n}</span>
                <div>
                  <h3>{x.t}</h3>
                  <p>{x.d}</p>
                </div>
                <span className={s.stHrs}>{x.hrs}</span>
              </li>
            ))}
          </ol>
          <div className={s.pair}>
            <figure>
              <Figure
                slug="passform-stand"
                alt="A half-made jacket in canvas basted onto a tailor's dress stand"
              />
              <figcaption>Stage III. White thread, on purpose.</figcaption>
            </figure>
            <figure>
              <Figure
                slug="passform-chalk"
                alt="A close view of chalk marks and basting stitches on dark wool cloth"
              />
              <figcaption>Chalk survives one pressing. Say what you mean the first time.</figcaption>
            </figure>
          </div>
        </section>

        {/* ------------------------------------------------------ WEAVE BAND */}
        <section className={s.weaveBand} aria-hidden="true">
          <div className={s.weaveField}>
            <TabbiedPattern
              pattern={damier}
              palette={['transparent', INK, RUST, GREY]}
              fit="grid"
              cellSize={112}
              redrawInterval={3800}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* ---------------------------------------------------------- CLOTH */}
        <section id="cloth" className={s.cloth} aria-labelledby="cloth-h">
          <div className={s.clothField} aria-hidden="true">
            <TabbiedPattern
              pattern={bias}
              palette={['transparent', GREY, PALE]}
              fit="grid"
              cellSize={88}
              redrawInterval={5600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.clothInner}>
            <h2 className={s.h2} id="cloth-h">
              Cloth we keep on the shelf
            </h2>
            <p className={s.note}>
              About four hundred lengths in the room, and a merchant two streets
              away for everything else. We will talk you out of anything under
              nine ounces for a first suit.
            </p>
            <ol className={s.clothList}>
              {CLOTHS.map(([name, from, note]) => (
                <li key={name}>
                  <span className={s.cName}>{name}</span>
                  <span className={s.cFrom}>{from}</span>
                  <span className={s.cNote}>{note}</span>
                </li>
              ))}
            </ol>
            <figure className={s.wide}>
              <Figure
                slug="passform-threads"
                alt="A wall of thread spools arranged by shade in a tailoring workroom"
              />
              <figcaption>Silk thread, arranged by shade because the light changes.</figcaption>
            </figure>
          </div>
        </section>

        {/* --------------------------------------------------------- PRICES */}
        <section id="prices" className={s.prices} aria-labelledby="prices-h">
          <h2 className={s.h2} id="prices-h">
            Prices
          </h2>
          <ol className={s.priceList}>
            <li>
              <span>Two-piece suit</span>
              <span className={s.pFrom}>from €4,600</span>
              <span className={s.pNote}>62 hours, four fittings, pattern kept</span>
            </li>
            <li>
              <span>Repeat order</span>
              <span className={s.pFrom}>from €3,400</span>
              <span className={s.pNote}>40 hours, two fittings, same pattern</span>
            </li>
            <li>
              <span>Jacket alone</span>
              <span className={s.pFrom}>from €3,200</span>
              <span className={s.pNote}>44 hours, three fittings</span>
            </li>
            <li>
              <span>Overcoat</span>
              <span className={s.pFrom}>from €5,100</span>
              <span className={s.pNote}>70 hours, four fittings</span>
            </li>
            <li>
              <span>Alterations, our work</span>
              <span className={s.pFrom}>free, forever</span>
              <span className={s.pNote}>Bodies change. The pattern is still here.</span>
            </li>
          </ol>
        </section>

        {/* ---------------------------------------------------------- BENCH */}
        <section id="bench" className={s.bench} aria-labelledby="bench-h">
          <div className={s.benchField} aria-hidden="true">
            <TabbiedPattern
              pattern={taper}
              palette={['transparent', RUST, GREY]}
              fit="grid"
              cellSize={104}
              redrawInterval={4800}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.benchInner}>
            <h2 className={s.h2} id="bench-h">
              Come and be measured
            </h2>
            <dl className={s.contact}>
              <div>
                <dt>Workroom</dt>
                <dd>
                  Neuer Wall 44, Hinterhof
                  <br />
                  20354 Hamburg
                </dd>
              </div>
              <div>
                <dt>Write</dt>
                <dd>
                  <a href="mailto:mass@passform.example">mass@passform.example</a>
                </dd>
              </div>
              <div>
                <dt>Appointments</dt>
                <dd>Tue to Fri. Allow two hours for the first.</dd>
              </div>
              <div>
                <dt>Waiting list</dt>
                <dd>Fourteen weeks to the first fitting.</dd>
              </div>
            </dl>
          </div>
        </section>
        {/* ---------------------------------------------------------- TILES */}
        <section id="tiles" className={s.tiles} aria-labelledby="tiles-h">
          <h2 id="tiles-h">Three things a machine cannot do</h2>
          <p className={s.secNote}>Not romance. Three specific operations that decide whether a coat hangs.</p>
          <div className={s.tileGrid}>
              <article key="01">
                <div className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={damier}
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
                  <Figure slug="passform-tile-hanger-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p className={s.tileN}>01</p>
                <h3>The shoulder</h3>
                <p className={s.tileBody}>Pad stitched by hand so the canvas and the cloth move independently. A fused shoulder is flat on the hanger and flat on you.</p>
              </article>
              <article key="02">
                <div className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={bias}
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
                  <Figure slug="passform-tile-canvas-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p className={s.tileN}>02</p>
                <h3>The canvas</h3>
                <p className={s.tileBody}>Floating, not glued. It takes the shape of your chest over about a year, which is a feature and cannot be simulated.</p>
              </article>
              <article key="03">
                <div className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={corduroy}
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
                  <Figure slug="passform-tile-tape-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p className={s.tileN}>03</p>
                <h3>The second fitting</h3>
                <p className={s.tileBody}>Where the coat stops being a size and starts being yours. Nothing measured at the start survives it unchanged.</p>
              </article>
          </div>
        </section>

        {/* ---------------------------------------------------------- INDEX */}
        <section id="index" className={s.idx} aria-labelledby="idx-h">
          <h2 id="idx-h">What we make besides suits</h2>
          <p className={s.secNote}>Same bench, same pattern, smaller commitment. All prices before cloth.</p>
          <ol className={s.idxList}>
            <li className={s.idxHead} aria-hidden="true">
                <span>Garment</span>
                <span>Hours</span>
                <span>Fittings</span>
                <span>From</span>
            </li>
              <li key="Overcoat">
                <span>Overcoat</span>
                <span>70</span>
                <span>4</span>
                <span>€5,100</span>
              </li>
              <li key="Odd jacket">
                <span>Odd jacket</span>
                <span>44</span>
                <span>3</span>
                <span>€3,200</span>
              </li>
              <li key="Trousers, alone">
                <span>Trousers, alone</span>
                <span>16</span>
                <span>2</span>
                <span>€1,150</span>
              </li>
              <li key="Waistcoat">
                <span>Waistcoat</span>
                <span>14</span>
                <span>2</span>
                <span>€980</span>
              </li>
              <li key="Dinner suit">
                <span>Dinner suit</span>
                <span>68</span>
                <span>4</span>
                <span>€5,400</span>
              </li>
              <li key="Alteration, our work">
                <span>Alteration, our work</span>
                <span>n/a</span>
                <span>As needed</span>
                <span>Free</span>
              </li>
          </ol>
        </section>

        {/* ------------------------------------------------------------ FAQ */}
        <section id="faq" className={s.faq} aria-labelledby="faq-h">
          <h2 id="faq-h">Before your first appointment</h2>
          <dl className={s.faqList}>
              <div key="What should I bring?">
                <dt>What should I bring?</dt>
                <dd>The shoes you will wear with it, and a jacket you already like, even if you like it for reasons you cannot articulate. Especially then.</dd>
              </div>
              <div key="How long does it take?">
                <dt>How long does it take?</dt>
                <dd>Fourteen weeks to the first fitting, and about six months to delivery. Repeat orders are half that because the pattern already exists.</dd>
              </div>
              <div key="Can I supply my own clot">
                <dt>Can I supply my own cloth?</dt>
                <dd>Yes, and we will tell you honestly if it is not enough or not suitable. Three and a half metres for a two-piece, more if it has a check.</dd>
              </div>
              <div key="What if I change shape?">
                <dt>What if I change shape?</dt>
                <dd>We alter our own work free, for as long as the garment lasts. Bodies change; the pattern is still in the drawer.</dd>
              </div>
          </dl>
        </section>

      </main>


        {/* A coda: the last thing before the footer is the pattern itself, at
            working size and with nothing to read. Purely decorative. */}
        <section className={s.coda} aria-hidden="true">
          <div className={s.codaField}>
            <TabbiedPattern
              pattern={dogtooth}
              palette={['transparent', PALE, GREY]}
              fit="grid"
              cellSize={102}
              redrawInterval={4914}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p className={s.footName}>Passform</p>
            <p className={s.footTag}>Maßschneiderei, Neuer Wall 44, Hamburg, seit 1972.</p>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Making</h2>
            <ul className={s.footLinks}>
              <li>
                <a href="#how">Five stages</a>
              </li>
              <li>
                <a href="#cloth">Cloth on the shelf</a>
              </li>
              <li>
                <a href="#prices">Prices</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Customers</h2>
            <ul className={s.footLinks}>
              <li>
                <a href="#bench">Be measured</a>
              </li>
              <li>
                <a href="#prices">Alterations</a>
              </li>
              <li>
                <a href="#bench">Waiting list</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Contact</h2>
            <p className={s.footAddr}>
              Neuer Wall 44, Hinterhof
              <br />
              20354 Hamburg
              <br />
              mass@passform.example
              <br />
              Tue to Fri, by appointment
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p>A fictional tailoring house. Prices and times are invented.</p>
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
