import { TabbiedPattern } from 'tabbied/react';
import {
  bokeh, drybrush, glazing, grainfield, scumble, tinting, toning,
} from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import s from './cobalt-works.module.css';

export const metadata = {
  title: 'Cobalt Works: Dry Pigment, Sheffield',
  description:
    'Cobalt Works has milled dry pigment in Sheffield since 1911. Eleven blues, forty earths, ground to order and sold by the kilo.',
};

/* Bone paper, near-black ink, one saturated cobalt. Every pattern field takes
   `transparent` in its background slot so the paper carries through. */
const INK = '#14161C';
const BLUE = '#0033CC';
const STEEL = '#7E8494';
const PALE = '#DEDBD0';
/* The two inks the decorative tiles draw with: always the quiet pair, so a
   tile reads as a sample rather than as another headline. */
/* The tiles pin their doodle to a whole multiple of the cell (9 × 72px)
   and let the plate clip it. A fluid box gives fractional grid tracks and
   a hairline seam at every cell edge. */
const TILE_BOX = 648;
const TILE_A = STEEL;
const TILE_B = PALE;


const PIGMENTS = [
  { ref: 'PB 28', name: 'Cobalt Blue', family: 'Blue', origin: 'Synthetic oxide', grind: '4 µm', price: '£142 / kg' },
  { ref: 'PB 29', name: 'Ultramarine', family: 'Blue', origin: 'Synthetic', grind: '3 µm', price: '£38 / kg' },
  { ref: 'PB 27', name: 'Prussian Blue', family: 'Blue', origin: 'Synthetic', grind: '2 µm', price: '£46 / kg' },
  { ref: 'PB 15', name: 'Phthalo Blue', family: 'Blue', origin: 'Organic', grind: '1 µm', price: '£52 / kg' },
  { ref: 'PBr 7', name: 'Raw Umber, Cyprus', family: 'Earth', origin: 'Natural, washed', grind: '9 µm', price: '£18 / kg' },
  { ref: 'PY 43', name: 'Yellow Ochre, Roussillon', family: 'Earth', origin: 'Natural, levigated', grind: '11 µm', price: '£24 / kg' },
  { ref: 'PR 102', name: 'Red Oxide, Sinopia', family: 'Earth', origin: 'Natural, calcined', grind: '8 µm', price: '£21 / kg' },
  { ref: 'PBk 9', name: 'Bone Black', family: 'Black', origin: 'Calcined bone', grind: '5 µm', price: '£29 / kg' },
];

const STEPS = [
  { n: 'I', t: 'Source', d: 'Earths from six quarries we have bought from for longer than any of us has worked here. Synthetics from two makers, both named on the label.' },
  { n: 'II', t: 'Wash and levigate', d: 'Natural earths are settled through four tanks over eleven days. What comes out of the last tank is what we sell.' },
  { n: 'III', t: 'Mill', d: 'Roller mill for the earths, jet mill for anything under 3 µm. Grind is measured on every batch and printed on the tin.' },
  { n: 'IV', t: 'Draw down', d: 'Every batch is drawn down beside the retained standard in daylight. If a colourist can see the difference, the batch goes back.' },
];

const FACTS = [
  ['1911', 'Milling since'],
  ['11', 'Blues in stock'],
  ['4 µm', 'Finest routine grind'],
  ['1 kg', 'Smallest order'],
];

export default function CobaltWorksPage() {
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
          Cobalt Works
          <i>Dry pigment, Sheffield</i>
        </a>
        <nav aria-label="Sections">
          <a href="#stock">Stock</a>
          <a href="#making">Making</a>
          <a href="#matching">Matching</a>
          <a href="#order">Order</a>
        </nav>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={glazing}
              palette={['transparent', BLUE, STEEL]}
              fit="grid"
              cellSize={140}
              redrawInterval={5000}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <p className={s.eyebrow}>Est. 1911 / Attercliffe</p>
            <h1>
              Colour is a
              <br />
              <span>material</span> before
              <br />
              it is an effect.
            </h1>
            <p className={s.lede}>
              We mill dry pigment and sell it by the kilo, unbound and
              unadulterated. What you do with it afterwards is your business.
            </p>
          </div>
        </section>

        {/* The loudest image on the page and the reason the site exists: raw
            pigment, full width, no crop apology. */}
        <figure className={s.bleed}>
          <Figure
            slug="cobalt-powder"
            alt="Heaps of intense dry blue pigment powder on a pale worktop"
            priority
          />
          <figcaption>PB 28, batch 26-114. Ground to 4 µm on Tuesday.</figcaption>
        </figure>

        <dl className={s.facts}>
          {FACTS.map(([v, k]) => (
            <div key={k}>
              <dt>{v}</dt>
              <dd>{k}</dd>
            </div>
          ))}
        </dl>

        {/* ---------------------------------------------------------- STOCK */}
        <section id="stock" className={s.stock} aria-labelledby="stock-h">
          <h2 className={s.h2} id="stock-h">
            In stock this week
          </h2>
          <ol className={s.list}>
            <li className={s.listHead} aria-hidden="true">
              <span>Index</span>
              <span>Pigment</span>
              <span>Family</span>
              <span>Origin</span>
              <span>Grind</span>
              <span>Price</span>
            </li>
            {PIGMENTS.map((p) => (
              <li key={p.ref}>
                <span className={s.ref}>{p.ref}</span>
                <span className={s.pname}>{p.name}</span>
                <span className={p.family === 'Blue' ? s.fam : undefined}>{p.family}</span>
                <span>{p.origin}</span>
                <span className={s.num}>{p.grind}</span>
                <span className={s.num}>{p.price}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------ WASH BAND */}
        <section className={s.washBand} aria-hidden="true">
          <div className={s.washField}>
            <TabbiedPattern
              pattern={tinting}
              palette={['transparent', BLUE, STEEL, PALE]}
              fit="grid"
              cellSize={136}
              redrawInterval={3400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* --------------------------------------------------------- MAKING */}
        <section id="making" className={s.making} aria-labelledby="making-h">
          <div className={s.makingField} aria-hidden="true">
            <TabbiedPattern
              pattern={scumble}
              palette={['transparent', STEEL, PALE]}
              fit="grid"
              cellSize={96}
              redrawInterval={5800}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.makingInner}>
            <h2 className={s.h2} id="making-h">
              Four steps, eleven days
            </h2>
            <ol className={s.steps}>
              {STEPS.map((x) => (
                <li key={x.n}>
                  <span className={s.stepN}>{x.n}</span>
                  <h3>{x.t}</h3>
                  <p>{x.d}</p>
                </li>
              ))}
            </ol>
            <div className={s.pair}>
              <figure>
                <Figure
                  slug="cobalt-mill"
                  alt="An industrial roller mill grinding blue pigment in a workshop"
                />
                <figcaption>Number 3 roller mill, in service since 1957.</figcaption>
              </figure>
              <figure>
                <Figure
                  slug="cobalt-drums"
                  alt="Rows of sealed steel drums on pallets in a bright warehouse"
                />
                <figcaption>Bay 2. Everything here is sold by weight, not by story.</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- MATCHING */}
        <section id="matching" className={s.matching} aria-labelledby="matching-h">
          <h2 className={s.h2} id="matching-h">
            Matching
          </h2>
          <div className={s.matchGrid}>
            <p className={s.big}>
              Send a chip, a fragment, or a photograph of a wall you cannot
              remove. We will mill against it and send three drawdowns before
              you commit to a kilo.
            </p>
            <div className={s.matchCol}>
              <p>
                Conservation work is quoted separately and always includes the
                analysis: what we think the original was, how confident we are,
                and what we would use instead if the original is now illegal.
              </p>
              <p>
                We do not tint to a screen value. If your reference is a hex
                code, we will ask you for something physical first.
              </p>
            </div>
          </div>
          <figure className={s.wide}>
            <Figure
              slug="cobalt-chips"
              alt="A fan of painted colour chip cards ranging from pale to deep blue"
            />
            <figcaption>Standards for PB 28, drawn down in daylight, kept for forty years.</figcaption>
          </figure>
        </section>

        {/* ---------------------------------------------------------- ORDER */}
        <section id="order" className={s.order} aria-labelledby="order-h">
          <div className={s.orderField} aria-hidden="true">
            <TabbiedPattern
              pattern={drybrush}
              palette={['transparent', BLUE, STEEL]}
              fit="grid"
              cellSize={72}
              redrawInterval={4200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.orderInner}>
            <h2 className={s.h2} id="order-h">
              Ordering
            </h2>
            <dl className={s.contact}>
              <div>
                <dt>Works</dt>
                <dd>
                  Effingham Lane, Attercliffe
                  <br />
                  Sheffield S9 2QP
                </dd>
              </div>
              <div>
                <dt>Write</dt>
                <dd>
                  <a href="mailto:mill@cobaltworks.example">mill@cobaltworks.example</a>
                </dd>
              </div>
              <div>
                <dt>Counter</dt>
                <dd>Mon to Thu, 08.00 to 16.00. Bring a container.</dd>
              </div>
              <div>
                <dt>Post</dt>
                <dd>1 kg minimum, 25 kg maximum per parcel.</dd>
              </div>
            </dl>
          </div>
        </section>
        {/* ---------------------------------------------------------- TILES */}
        <section id="tiles" className={s.tiles} aria-labelledby="tiles-h">
          <h2 id="tiles-h">Three ways a pigment goes wrong</h2>
          <p className={s.secNote}>Not adulteration, which is rare. These are the everyday faults that make a batch unusable.</p>
          <div className={s.tileGrid}>
              <article key="01">
                <div className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={bokeh}
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
                  <Figure slug="cobalt-works-tile-grind-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p className={s.tileN}>01</p>
                <h3>Grind drift</h3>
                <p className={s.tileBody}>Two microns coarser and the same pigment reads paler and chalkier. Grind is measured on every batch and printed on the tin.</p>
              </article>
              <article key="02">
                <div className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={grainfield}
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
                  <Figure slug="cobalt-works-tile-moisture-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p className={s.tileN}>02</p>
                <h3>Moisture</h3>
                <p className={s.tileBody}>Earths take up water and cake. Warehouse bays are checked weekly and anything above six per cent goes back through the dryer.</p>
              </article>
              <article key="03">
                <div className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={glazing}
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
                  <Figure slug="cobalt-works-tile-settling-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p className={s.tileN}>03</p>
                <h3>Settling</h3>
                <p className={s.tileBody}>A tinted mix separates in the tin. That is the pigment behaving, not failing, and it is why we sell dry and let you bind it.</p>
              </article>
          </div>
        </section>

        {/* ---------------------------------------------------------- INDEX */}
        <section id="index" className={s.idx} aria-labelledby="idx-h">
          <h2 id="idx-h">Binders we stock</h2>
          <p className={s.secNote}>Sold alongside the pigment because people ask, and because the wrong binder wastes good colour.</p>
          <ol className={s.idxList}>
            <li className={s.idxHead} aria-hidden="true">
                <span>Binder</span>
                <span>For</span>
                <span>Unit</span>
                <span>Price</span>
            </li>
              <li key="Linseed, cold pressed">
                <span>Linseed, cold pressed</span>
                <span>Oil paint</span>
                <span>1 L</span>
                <span>£24</span>
              </li>
              <li key="Stand oil">
                <span>Stand oil</span>
                <span>Glazes</span>
                <span>500 ml</span>
                <span>£19</span>
              </li>
              <li key="Gum arabic, solution">
                <span>Gum arabic, solution</span>
                <span>Watercolour</span>
                <span>500 ml</span>
                <span>£16</span>
              </li>
              <li key="Rabbit skin glue">
                <span>Rabbit skin glue</span>
                <span>Distemper, size</span>
                <span>1 kg</span>
                <span>£31</span>
              </li>
              <li key="Casein powder">
                <span>Casein powder</span>
                <span>Limewash, secco</span>
                <span>1 kg</span>
                <span>£28</span>
              </li>
              <li key="Acrylic dispersion">
                <span>Acrylic dispersion</span>
                <span>Modern media</span>
                <span>1 L</span>
                <span>£22</span>
              </li>
          </ol>
        </section>

        {/* ------------------------------------------------------------ FAQ */}
        <section id="faq" className={s.faq} aria-labelledby="faq-h">
          <h2 id="faq-h">Ordering questions</h2>
          <dl className={s.faqList}>
              <div key="Is one kilo really the m">
                <dt>Is one kilo really the minimum?</dt>
                <dd>Yes, and it always has been. A cutting quantity is how people find out whether they want twenty-five.</dd>
              </div>
              <div key="Can you match a historic">
                <dt>Can you match a historic colour?</dt>
                <dd>Send a chip or a fragment. We will mill against it and send three drawdowns, with a note on what we think the original was.</dd>
              </div>
              <div key="Are your earths natural?">
                <dt>Are your earths natural?</dt>
                <dd>The ones marked natural are washed and levigated only. The synthetics say so on the label, with the maker named.</dd>
              </div>
              <div key="Do you ship abroad?">
                <dt>Do you ship abroad?</dt>
                <dd>Within Europe, yes, up to 25 kg a parcel. Some pigments are restricted in some countries and we check before taking money.</dd>
              </div>
          </dl>
        </section>

      </main>


        {/* A coda: the last thing before the footer is the pattern itself, at
            working size and with nothing to read. Purely decorative. */}
        <section className={s.coda} aria-hidden="true">
          <div className={s.codaField}>
            <TabbiedPattern
              pattern={toning}
              palette={['transparent', PALE, STEEL]}
              fit="grid"
              cellSize={118}
              redrawInterval={5026}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p className={s.footName}>Cobalt Works</p>
            <p className={s.footTag}>Dry pigment milled at Effingham Lane, Sheffield, since 1911.</p>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Pigment</h2>
            <ul className={s.footLinks}>
              <li>
                <a href="#stock">In stock</a>
              </li>
              <li>
                <a href="#making">How it is made</a>
              </li>
              <li>
                <a href="#matching">Matching</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Trade</h2>
            <ul className={s.footLinks}>
              <li>
                <a href="#order">Ordering</a>
              </li>
              <li>
                <a href="#order">Counter hours</a>
              </li>
              <li>
                <a href="#order">Post and carriage</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Contact</h2>
            <p className={s.footAddr}>
              Effingham Lane, Attercliffe
              <br />
              Sheffield S9 2QP
              <br />
              mill@cobaltworks.example
              <br />
              Mon to Thu, 08.00 to 16.00
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p>A fictional pigment mill. Prices and times are invented.</p>
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
