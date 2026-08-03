import { TabbiedArtwork } from 'tabbied/react';
import {
  dustfall, grain, grainfield, halftone, misprint, peppering,
} from 'tabbied/artworks';
import { Figure } from 'components/Figure';
import s from './silbersalz.module.css';

export const metadata = {
  title: 'Silbersalz: Fotolabor, Leipzig',
  description:
    'Silbersalz develops film and makes silver gelatin prints. Hand processing, hand printing, and a price list that has not changed since 2019.',
};

/* Bone paper, near-black ink, one safelight red. Every field takes
   `transparent` in the background slot. */
const INK = '#101010';
const RED = '#C8102E';
const GREY = '#8A8880';
const PALE = '#D9D6CC';
/* The two inks the decorative tiles draw with: always the quiet pair, so a
   tile reads as a sample rather than as another headline. */
/* The tiles pin their doodle to a whole multiple of the cell (9 × 72px)
   and let the plate clip it. A fluid box gives fractional grid tracks and
   a hairline seam at every cell edge. */
const TILE_BOX = 648;
const TILE_A = GREY;
const TILE_B = PALE;


const DEVELOP = [
  { fmt: '135', proc: 'B&W, hand tank', dev: 'ID-11, 1+1', turn: '3 days', price: '€9' },
  { fmt: '135', proc: 'C-41, dip and dunk', dev: 'Standard', turn: '1 day', price: '€8' },
  { fmt: '120', proc: 'B&W, hand tank', dev: 'ID-11 or Rodinal', turn: '3 days', price: '€10' },
  { fmt: '120', proc: 'E-6, hand line', dev: 'Standard', turn: '5 days', price: '€14' },
  { fmt: '4×5', proc: 'B&W, tray', dev: 'By agreement', turn: '5 days', price: '€6 / sheet' },
  { fmt: '8×10', proc: 'B&W, tray', dev: 'By agreement', turn: '7 days', price: '€14 / sheet' },
];

const PRINTS = [
  { size: '18 × 24 cm', paper: 'Fibre, glossy', price: '€28' },
  { size: '24 × 30 cm', paper: 'Fibre, glossy or matt', price: '€38' },
  { size: '30 × 40 cm', paper: 'Fibre, glossy or matt', price: '€54' },
  { size: '40 × 50 cm', paper: 'Fibre, matt only', price: '€86' },
  { size: '50 × 60 cm', paper: 'Fibre, matt only', price: '€128' },
];

const HOUSE = [
  { n: '01', t: 'Everything by hand', d: 'One person, one tank, one film at a time for black and white. It is slower than a machine and the negatives come back the way you exposed them.' },
  { n: '02', t: 'We keep your negatives dry', d: 'Sleeved the same day, in polyester, never PVC. Collected or posted flat, never rolled.' },
  { n: '03', t: 'Test strip first, always', d: 'Every print starts with a strip and a look under the light. Nobody here has ever printed to a number.' },
  { n: '04', t: 'The list does not move', d: 'Prices last changed in 2019 and will change again when the paper does, not when the accountant asks.' },
];

export default function SilbersalzPage() {
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
          Silbersalz
          <i>Fotolabor, Leipzig</i>
        </a>
        <nav aria-label="Sections">
          <a href="#develop">Developing</a>
          <a href="#print">Printing</a>
          <a href="#house">House rules</a>
          <a href="#counter">Counter</a>
        </nav>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div className={s.heroField} aria-hidden="true">
            <TabbiedArtwork
              artwork={halftone}
              palette={['transparent', PALE, GREY]}
              fit="grid"
              cellSize={40}
              redrawInterval={3000}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <p className={s.eyebrow}>Hand processing / seit 1998</p>
            <h1>
              One film at a
              <br />
              time, in a tank,
              <br />
              <span>by somebody.</span>
            </h1>
            <p className={s.lede}>
              Black and white, colour negative and transparency. Silver gelatin
              prints made under an enlarger by a person who looks at them.
            </p>
          </div>
        </section>

        {/* The darkroom, full width. Red safelight against a bone page: the
            one place the accent colour is allowed to fill the frame. */}
        <figure className={s.bleed}>
          <Figure
            slug="silbersalz-darkroom"
            alt="A darkroom under a red safelight with developing trays in a row and an enlarger"
            priority
          />
          <figcaption>Darkroom 1. Three trays, one clock, no windows.</figcaption>
        </figure>

        {/* -------------------------------------------------------- DEVELOP */}
        <section id="develop" className={s.develop} aria-labelledby="develop-h">
          <h2 className={s.h2} id="develop-h">
            Developing
          </h2>
          <ol className={s.table}>
            <li className={s.thead} aria-hidden="true">
              <span>Format</span>
              <span>Process</span>
              <span>Developer</span>
              <span>Turnaround</span>
              <span>Price</span>
            </li>
            {DEVELOP.map((d) => (
              <li key={`${d.fmt}-${d.proc}`}>
                <span className={s.fmt}>{d.fmt}</span>
                <span className={s.proc}>{d.proc}</span>
                <span className={s.dev}>{d.dev}</span>
                <span className={s.turn}>{d.turn}</span>
                <span className={s.price}>{d.price}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ----------------------------------------------------- GRAIN BAND */}
        <section className={s.grainBand} aria-hidden="true">
          <div className={s.grainField}>
            <TabbiedArtwork
              artwork={grainfield}
              palette={['transparent', INK, RED, GREY]}
              fit="grid"
              cellSize={112}
              redrawInterval={2400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* ----------------------------------------------------------- PRINT */}
        <section id="print" className={s.print} aria-labelledby="print-h">
          <div className={s.printField} aria-hidden="true">
            <TabbiedArtwork
              artwork={dustfall}
              palette={['transparent', GREY, PALE]}
              fit="grid"
              cellSize={54}
              redrawInterval={5200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.printInner}>
            <h2 className={s.h2} id="print-h">
              Silver gelatin prints
            </h2>
            <div className={s.printGrid}>
              <ol className={s.prices}>
                {PRINTS.map((p) => (
                  <li key={p.size}>
                    <span className={s.pSize}>{p.size}</span>
                    <span className={s.pPaper}>{p.paper}</span>
                    <span className={s.pPrice}>{p.price}</span>
                  </li>
                ))}
              </ol>
              <div className={s.printText}>
                <p className={s.big}>
                  Every print begins with a test strip and ends with somebody
                  standing under the inspection light deciding whether it is
                  finished.
                </p>
                <p>
                  Prices are for a straight print with normal dodging and
                  burning. Anything that needs more than four operations on one
                  sheet is quoted, and we will tell you before we start.
                </p>
                <p>
                  Fibre paper only. We stopped stocking resin coated in 2014 and
                  have not been asked for it since 2017.
                </p>
              </div>
            </div>
            <div className={s.pair}>
              <figure>
                <Figure
                  slug="silbersalz-contacts"
                  alt="Contact sheets spread on a glowing light table with a loupe"
                />
                <figcaption>Contacts come with every roll, whether you asked or not.</figcaption>
              </figure>
              <figure>
                <Figure
                  slug="silbersalz-enlarger"
                  alt="A large format enlarger standing on a bench with lens and bellows"
                />
                <figcaption>Enlarger 2, 5×7, condenser head. Aligned in March.</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- HOUSE */}
        <section id="house" className={s.house} aria-labelledby="house-h">
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
          <figure className={s.wide}>
            <Figure
              slug="silbersalz-drying"
              alt="Strips of developed film hanging to dry from a line with weighted clips"
            />
            <figcaption>Drying cabinet. Two hours, no heat, no hurry.</figcaption>
          </figure>
        </section>

        {/* -------------------------------------------------------- COUNTER */}
        <section id="counter" className={s.counter} aria-labelledby="counter-h">
          <div className={s.counterField} aria-hidden="true">
            <TabbiedArtwork
              artwork={peppering}
              palette={['transparent', RED, GREY]}
              fit="grid"
              cellSize={38}
              redrawInterval={4200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.counterInner}>
            <h2 className={s.h2} id="counter-h">
              The counter
            </h2>
            <dl className={s.contact}>
              <div>
                <dt>Lab</dt>
                <dd>
                  Karl-Liebknecht-Str. 62
                  <br />
                  04275 Leipzig
                </dd>
              </div>
              <div>
                <dt>Write</dt>
                <dd>
                  <a href="mailto:labor@silbersalz.example">labor@silbersalz.example</a>
                </dd>
              </div>
              <div>
                <dt>Open</dt>
                <dd>Tue to Fri 11.00 to 18.00, Sat 11.00 to 15.00</dd>
              </div>
              <div>
                <dt>Post</dt>
                <dd>Send film in a padded envelope. We return it the same way.</dd>
              </div>
            </dl>
          </div>
        </section>
        {/* ---------------------------------------------------------- TILES */}
        <section id="tiles" className={s.tiles} aria-labelledby="tiles-h">
          <h2 id="tiles-h">Three things that ruin a negative</h2>
          <p className={s.secNote}>None of them happens in the camera, and all of them are avoidable.</p>
          <div className={s.tileGrid}>
              <article key="01">
                <div className={s.tilePlate} aria-hidden="true">
                  <TabbiedArtwork
                    artwork={peppering}
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
                  <Figure slug="silbersalz-tile-film-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p className={s.tileN}>01</p>
                <h3>Heat in transit</h3>
                <p className={s.tileBody}>A film left in a car in July shifts before it is ever developed. Post it, or bring it; do not leave it on the parcel shelf for a fortnight.</p>
              </article>
              <article key="02">
                <div className={s.tilePlate} aria-hidden="true">
                  <TabbiedArtwork
                    artwork={dustfall}
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
                  <Figure slug="silbersalz-tile-tank-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p className={s.tileN}>02</p>
                <h3>Time in the tank</h3>
                <p className={s.tileBody}>Thirty seconds either way at twenty degrees is nothing. Three minutes is a different film. This is why we do one at a time.</p>
              </article>
              <article key="03">
                <div className={s.tilePlate} aria-hidden="true">
                  <TabbiedArtwork
                    artwork={halftone}
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
                  <Figure slug="silbersalz-tile-reel-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p className={s.tileN}>03</p>
                <h3>Water</h3>
                <p className={s.tileBody}>Drying marks are the single most common fault we see on home-developed film, and they are permanent. Final rinse, wetting agent, hang, leave it.</p>
              </article>
          </div>
        </section>

        {/* ---------------------------------------------------------- INDEX */}
        <section id="index" className={s.idx} aria-labelledby="idx-h">
          <h2 id="idx-h">What we stock at the counter</h2>
          <p className={s.secNote}>Small quantities, at roughly what we pay, because a lab with no film in it is a strange place.</p>
          <ol className={s.idxList}>
            <li className={s.idxHead} aria-hidden="true">
                <span>Stock</span>
                <span>Format</span>
                <span>Speed</span>
                <span>Price</span>
            </li>
              <li key="HP5 Plus">
                <span>HP5 Plus</span>
                <span>135-36, 120</span>
                <span>400</span>
                <span>€7.50</span>
              </li>
              <li key="FP4 Plus">
                <span>FP4 Plus</span>
                <span>135-36, 120</span>
                <span>125</span>
                <span>€7.20</span>
              </li>
              <li key="Delta 3200">
                <span>Delta 3200</span>
                <span>135-36</span>
                <span>3200</span>
                <span>€10.90</span>
              </li>
              <li key="Portra 400">
                <span>Portra 400</span>
                <span>135-36, 120</span>
                <span>400</span>
                <span>€14.80</span>
              </li>
              <li key="Ektachrome E100">
                <span>Ektachrome E100</span>
                <span>135-36</span>
                <span>100</span>
                <span>€18.40</span>
              </li>
              <li key="Ilford MG fibre">
                <span>Ilford MG fibre</span>
                <span>24 × 30, 50 sheets</span>
                <span>n/a</span>
                <span>€96</span>
              </li>
          </ol>
        </section>

        {/* ------------------------------------------------------------ FAQ */}
        <section id="faq" className={s.faq} aria-labelledby="faq-h">
          <h2 id="faq-h">Sending film in</h2>
          <dl className={s.faqList}>
              <div key="How should I post it?">
                <dt>How should I post it?</dt>
                <dd>A padded envelope, canisters in a freezer bag, and a note with your name in the bag rather than only on the outside.</dd>
              </div>
              <div key="Do you push and pull?">
                <dt>Do you push and pull?</dt>
                <dd>Two stops either way on black and white, one on colour negative. Tell us on the note; we cannot tell by looking.</dd>
              </div>
              <div key="Will you scan as well?">
                <dt>Will you scan as well?</dt>
                <dd>Yes, at two sizes, but we would rather make you a print. A scan is a proposal; a print is a decision.</dd>
              </div>
              <div key="What happens to a blank ">
                <dt>What happens to a blank roll?</dt>
                <dd>We tell you, we do not charge you, and we say what we think went wrong. It is nearly always the film not catching on the take-up spool.</dd>
              </div>
          </dl>
        </section>

      </main>


        {/* A coda: the last thing before the footer is the pattern itself, at
            working size and with nothing to read. Purely decorative. */}
        <section className={s.coda} aria-hidden="true">
          <div className={s.codaField}>
            <TabbiedArtwork
              artwork={grain}
              palette={['transparent', PALE, GREY]}
              fit="grid"
              cellSize={104}
              redrawInterval={4928}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p className={s.footName}>Silbersalz</p>
            <p className={s.footTag}>Fotolabor, Karl-Liebknecht-Str. 62, Leipzig, seit 1998.</p>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Services</h2>
            <ul className={s.footLinks}>
              <li>
                <a href="#develop">Developing</a>
              </li>
              <li>
                <a href="#print">Silver gelatin prints</a>
              </li>
              <li>
                <a href="#house">House rules</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Counter</h2>
            <ul className={s.footLinks}>
              <li>
                <a href="#counter">The counter</a>
              </li>
              <li>
                <a href="#counter">Send film by post</a>
              </li>
              <li>
                <a href="#develop">Turnarounds</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Contact</h2>
            <p className={s.footAddr}>
              Karl-Liebknecht-Str. 62
              <br />
              04275 Leipzig
              <br />
              labor@silbersalz.example
              <br />
              Tue to Fri 11.00 to 18.00
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p>A fictional photographic lab. Prices and times are invented.</p>
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
