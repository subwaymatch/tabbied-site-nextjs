import { TabbiedArtwork } from 'tabbied/react';
import { lantern, windowpane, quire, recession, veil } from 'tabbied/artworks';
import { Figure } from 'components/Figure';
import s from './sammlung-weiss.module.css';

export const metadata = {
  title: 'Sammlung Weiss: Private Collection, Winterthur',
  description:
    'The Weiss collection holds 411 works of postwar abstraction. Open eleven days a year, by ballot, twelve visitors at a time.',
};

/* Achromatic except for the paper's warmth. No accent colour anywhere: the
   pattern fields, all on a `transparent` ground, are the only figure. */
const INK = '#111111';
const STONE = '#6E6A60';
const PALE = '#CFCBBF';
const LIGHT = '#EAE7DD';

const ROOMS = [
  { n: 'I', name: 'The long room', hangs: '14 works', note: 'North light, no artificial source. Closed on days when the meter reads under 180 lux at noon.' },
  { n: 'II', name: 'The small room', hangs: '6 works', note: 'One bench. The hang changes twice a year and is never announced in advance.' },
  { n: 'III', name: 'The stone room', hangs: '3 works', note: 'Sculpture only. The floor is the original 1962 screed and it is not to be walked on in heels.' },
  { n: 'IV', name: 'The store', hangs: '388 works', note: 'Not open. Researchers may request a viewing of up to four works, in writing, twice a year.' },
];

const HOLDINGS = [
  ['Painting', '186', '1948 to 1979'],
  ['Works on paper', '154', '1946 to 1988'],
  ['Sculpture', '38', '1951 to 1974'],
  ['Photography', '27', '1955 to 1969'],
  ['Editions', '6', '1962 to 1970'],
];

const DAYS = [
  ['14.03', 'Room I and II', 'Ballot closes 01.02'],
  ['11.04', 'Room I and II', 'Ballot closes 01.03'],
  ['09.05', 'Room I, II and III', 'Ballot closes 01.04'],
  ['13.06', 'Room I and II', 'Ballot closes 01.05'],
  ['12.09', 'Room I, II and III', 'Ballot closes 01.08'],
  ['10.10', 'Room I and II', 'Ballot closes 01.09'],
];

export default function SammlungWeissPage() {
  return (
    <div className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,200..600&display=swap"
      />

      <header className={s.bar}>
        <a className={s.mark} href="#top">
          Sammlung Weiss
        </a>
        <nav aria-label="Sections">
          <a href="#collection">Collection</a>
          <a href="#rooms">Rooms</a>
          <a href="#visiting">Visiting</a>
          <a href="#research">Research</a>
        </nav>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div className={s.heroField} aria-hidden="true">
            <TabbiedArtwork
              artwork={lantern}
              palette={['transparent', PALE, STONE]}
              fit="grid"
              cellSize={168}
              redrawInterval={7200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <p className={s.eyebrow}>Winterthur / 411 works / open eleven days a year</p>
            <h1>
              A collection is
              <br />
              a long argument
              <br />
              with one taste.
            </h1>
            <p className={s.lede}>
              Postwar abstraction, bought slowly between 1961 and 1994 by two
              people who never once agreed in public.
            </p>
          </div>
        </section>

        {/* The gallery room, full width and tall. It is the only image on the
            page that is allowed to be big. */}
        <figure className={s.bleed}>
          <Figure
            slug="weiss-room"
            alt="An empty gallery room under a skylight with bare walls and a pale timber floor"
            priority
          />
        </figure>

        {/* ---------------------------------------------------- COLLECTION */}
        <section id="collection" className={s.collection} aria-labelledby="collection-h">
          <h2 className={s.h2} id="collection-h">
            What is here
          </h2>
          <div className={s.colGrid}>
            <ol className={s.holdings}>
              {HOLDINGS.map(([kind, n, span]) => (
                <li key={kind}>
                  <span className={s.hKind}>{kind}</span>
                  <span className={s.hN}>{n}</span>
                  <span className={s.hSpan}>{span}</span>
                </li>
              ))}
            </ol>
            <div className={s.colText}>
              <p className={s.big}>
                Elsa and Martin Weiss bought their first painting in 1961 with
                money set aside for a car, and their last in 1994, three weeks
                before Martin died.
              </p>
              <p>
                They collected against the market rather than with it: the
                unfashionable years of artists who later became fashionable, and
                a stubborn number of artists who never did. Roughly a third of
                the collection is by people with no monograph.
              </p>
              <p>
                Nothing has been sold. Nothing will be. The foundation deed
                forbids deaccession in terms a lawyer described, admiringly, as
                unhelpfully absolute.
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ HANG BAND */}
        <section className={s.hangBand} aria-hidden="true">
          <div className={s.hangField}>
            <TabbiedArtwork
              artwork={windowpane}
              palette={['transparent', INK, STONE, PALE]}
              fit="grid"
              cellSize={136}
              redrawInterval={5000}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* --------------------------------------------------------- ROOMS */}
        <section id="rooms" className={s.rooms} aria-labelledby="rooms-h">
          <div className={s.roomsField} aria-hidden="true">
            <TabbiedArtwork
              artwork={quire}
              palette={['transparent', PALE, LIGHT]}
              fit="grid"
              cellSize={112}
              redrawInterval={6000}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.roomsInner}>
            <h2 className={s.h2} id="rooms-h">
              Four rooms
            </h2>
            <ol className={s.roomList}>
              {ROOMS.map((r) => (
                <li key={r.n}>
                  <span className={s.rN}>{r.n}</span>
                  <div>
                    <h3>{r.name}</h3>
                    <p>{r.note}</p>
                  </div>
                  <span className={s.rHangs}>{r.hangs}</span>
                </li>
              ))}
            </ol>
            <div className={s.pair}>
              <figure>
                <Figure
                  slug="weiss-plinth"
                  alt="A rough grey stone sculpture on a plain white plinth in a bare room"
                />
                <figcaption>Room III. One work, one bench, no label.</figcaption>
              </figure>
              <figure>
                <Figure
                  slug="weiss-crate"
                  alt="A plywood art crate standing closed in an empty white room"
                />
                <figcaption>Arrived Tuesday. Opens Friday, once it has acclimatised.</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- VISITING */}
        <section id="visiting" className={s.visiting} aria-labelledby="visiting-h">
          <h2 className={s.h2} id="visiting-h">
            Eleven days
          </h2>
          <p className={s.note}>
            Twelve visitors per day, ninety minutes each, allocated by ballot.
            Entry is free. There is no shop, no café, and no photography.
          </p>
          <ol className={s.days}>
            {DAYS.map(([d, what, ballot]) => (
              <li key={d}>
                <span className={s.dDate}>{d}</span>
                <span className={s.dWhat}>{what}</span>
                <span className={s.dBallot}>{ballot}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------- RESEARCH */}
        <section id="research" className={s.research} aria-labelledby="research-h">
          <div className={s.resField} aria-hidden="true">
            <TabbiedArtwork
              artwork={recession}
              palette={['transparent', STONE, PALE]}
              fit="grid"
              cellSize={140}
              redrawInterval={5400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.resInner}>
            <h2 className={s.h2} id="research-h">
              Research and enquiries
            </h2>
            <div className={s.resGrid}>
              <p className={s.big}>
                The full catalogue is on paper, in one copy, in the reading room.
                We have been meaning to digitise it since 2009.
              </p>
              <dl>
                <div>
                  <dt>Foundation</dt>
                  <dd>
                    Rychenbergstrasse 210
                    <br />
                    8400 Winterthur
                  </dd>
                </div>
                <div>
                  <dt>Write</dt>
                  <dd>
                    <a href="mailto:stiftung@sammlung-weiss.example">
                      stiftung@sammlung-weiss.example
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>Ballot</dt>
                  <dd>One entry per person per day. Results by post.</dd>
                </div>
                <div>
                  <dt>Loans</dt>
                  <dd>Two a year, to public institutions, for exhibitions with a catalogue.</dd>
                </div>
              </dl>
            </div>
            <figure className={s.wide}>
              <Figure
                slug="weiss-racks"
                alt="Sliding storage racks holding framed works in a windowless art store"
              />
              <figcaption>The store. Three hundred and eighty-eight works, waiting their turn.</figcaption>
            </figure>
          </div>
        </section>
      </main>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p className={s.footName}>Sammlung Weiss</p>
            <p className={s.footTag}>A private collection of 411 works at Rychenbergstrasse 210, Winterthur.</p>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Collection</h2>
            <ul className={s.footLinks}>
              <li>
                <a href="#collection">What is here</a>
              </li>
              <li>
                <a href="#rooms">Four rooms</a>
              </li>
              <li>
                <a href="#research">Research</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Visiting</h2>
            <ul className={s.footLinks}>
              <li>
                <a href="#visiting">Eleven days</a>
              </li>
              <li>
                <a href="#visiting">The ballot</a>
              </li>
              <li>
                <a href="#research">Loans</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Contact</h2>
            <p className={s.footAddr}>
              Rychenbergstrasse 210
              <br />
              8400 Winterthur
              <br />
              stiftung@sammlung-weiss.example
              <br />
              Entry free, by ballot
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p>A fictional foundation. Prices and times are invented.</p>
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
