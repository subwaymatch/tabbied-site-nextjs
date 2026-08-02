import { TabbiedArtwork } from 'tabbied/react';
import { glazing, tinting, scumble, drybrush, bokeh } from 'tabbied/artworks';
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
            <TabbiedArtwork
              artwork={glazing}
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
            <TabbiedArtwork
              artwork={tinting}
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
            <TabbiedArtwork
              artwork={scumble}
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
            <TabbiedArtwork
              artwork={drybrush}
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
      </main>

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
