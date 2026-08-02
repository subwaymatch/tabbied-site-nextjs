import { TabbiedArtwork } from 'tabbied/react';
import { halftone, grainfield, dustfall, peppering, misprint } from 'tabbied/artworks';
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
              cellSize={64}
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
      </main>

      <footer className={s.footer}>
        <div className={s.footField} aria-hidden="true">
          <TabbiedArtwork
            artwork={misprint}
            palette={['transparent', RED, GREY]}
            fit="grid"
            cellSize={76}
            redrawInterval={6400}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
        <div className={s.footInner}>
          <p className={s.footMark}>Silbersalz</p>
          <p className={s.footFine}>
            A fictional photographic lab. Every pattern is a live{' '}
            <a href="https://tabbied.com" rel="noopener">
              Tabbied
            </a>{' '}
            artwork on a transparent ground, redrawn on a timer. © 2026.
          </p>
        </div>
      </footer>
    </div>
  );
}
