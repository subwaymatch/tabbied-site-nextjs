import { TabbiedArtwork } from 'tabbied/react';
import {
  bothways, dotmatrix, dotset, fadedbar, hairpin, ring, tailoff, taper,
} from 'tabbied/artworks';
import { Figure } from 'components/Figure';
import s from './seconde.module.css';

export const metadata = {
  title: 'Seconde: Chronométrage Sportif, Lausanne',
  description:
    'Seconde times races. Photo finish to one ten-thousandth, transponder splits, and results published before the athletes reach the barrier.',
};

/* Paper, ink, one magenta, two greys. Every field takes `transparent` in the
   background slot so the paper reads through. */
const INK = '#101010';
const MAGENTA = '#FF0059';
const GREY = '#8E8E8E';
const PALE = '#D6D6D2';
/* The two inks the decorative tiles draw with: always the quiet pair, so a
   tile reads as a sample rather than as another headline. */
/* The tiles pin their doodle to a whole multiple of the cell (9 × 72px)
   and let the plate clip it. A fluid box gives fractional grid tracks and
   a hairline seam at every cell edge. */
const TILE_BOX = 648;
const TILE_A = GREY;
const TILE_B = PALE;


const SYSTEMS = [
  { code: 'PF-4', name: 'Photo finish', res: '1 / 10 000 s', body: 'A 10,000 fps line-scan camera on the finish plane, levelled to 0.2 mm over 8 metres. The image is the result; everything else is a convenience.' },
  { code: 'TR-2', name: 'Transponder', res: '1 / 1 000 s', body: 'Passive tags read by loops in the surface. Ninety-nine point nine nine per cent read rate over 40,000 passings last season.' },
  { code: 'GT-1', name: 'Light gate', res: '1 / 1 000 s', body: 'Twin-beam gates for sprints and training. Sends the split to the coach before the athlete has stopped running.' },
  { code: 'ST-3', name: 'Start detection', res: '1 / 1 000 s', body: 'Force-sensing blocks with a 100 ms reaction threshold. The trace is kept for every start, contested or not.' },
];

const RESULTS = [
  { pos: '1', name: 'Aïcha Bendjebbour', club: 'Stade Lausanne', time: '10.94', gap: '' },
  { pos: '2', name: 'Nina Lindqvist', club: 'IF Kronan', time: '11.02', gap: '+0.08' },
  { pos: '3', name: 'Rosa Marchetti', club: 'CA Bellinzona', time: '11.05', gap: '+0.11' },
  { pos: '4', name: 'Yuki Tanabe', club: 'Kobe TC', time: '11.07', gap: '+0.13' },
  { pos: '5', name: 'Hana Dvořák', club: 'AK Brno', time: '11.19', gap: '+0.25' },
  { pos: '6', name: 'Fenna de Wit', club: 'AV Haarlem', time: '11.22', gap: '+0.28' },
];

const SEASON = [
  ['18.04', 'Meeting de Lausanne', 'Athletics, track and field', 'Pierre-de-Coubertin'],
  ['09.05', 'Tour du Léman', 'Road cycling, 186 km', 'Léman circuit'],
  ['21.06', 'Championnats romands', 'Athletics, two days', 'Yverdon'],
  ['12.09', 'Course de l’Escalade', 'Road running, 7,300 entries', 'Genève'],
  ['04.10', 'Coupe des Alpes', 'Alpine ski, timing trials', 'Verbier'],
];

const FACTS = [
  ['1 / 10 000', 'Second, photo finish'],
  ['40 812', 'Passings timed, 2025'],
  ['0', 'Results withdrawn'],
  ['22', 'Events a season'],
];

export default function SecondePage() {
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
          Seconde
        </a>
        <nav aria-label="Sections">
          <a href="#systems">Systems</a>
          <a href="#results">Results</a>
          <a href="#season">Season</a>
          <a href="#book">Book</a>
        </nav>
        <span className={s.clock}>Chronométrage sportif</span>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div className={s.heroField} aria-hidden="true">
            <TabbiedArtwork
              artwork={fadedbar}
              palette={['transparent', PALE, MAGENTA]}
              fit="grid"
              cellSize={64}
              redrawInterval={2800}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <p className={s.eyebrow}>Lausanne / depuis 1991</p>
            <h1>
              The result exists
              <br />
              before the crowd
              <br />
              <span>finishes shouting.</span>
            </h1>
            <p className={s.lede}>
              We time races to one ten-thousandth of a second and publish inside
              four. Thirty-five seasons, no result ever withdrawn.
            </p>
          </div>
        </section>

        {/* Full-bleed, and deliberately the tallest thing on the page: the
            finish line down the lanes, cropped to a long strip. */}
        <figure className={s.strip}>
          <Figure
            slug="seconde-gate"
            alt="A photo-finish timing gate at the end of an empty athletics track seen down the lanes"
            priority
          />
        </figure>

        <dl className={s.facts}>
          {FACTS.map(([v, k]) => (
            <div key={k}>
              <dt>{v}</dt>
              <dd>{k}</dd>
            </div>
          ))}
        </dl>

        {/* ------------------------------------------------------- SYSTEMS */}
        <section id="systems" className={s.systems} aria-labelledby="systems-h">
          <h2 className={s.h2} id="systems-h">
            Four systems
          </h2>
          <ol className={s.sysList}>
            {SYSTEMS.map((x) => (
              <li key={x.code}>
                <span className={s.sysCode}>{x.code}</span>
                <div>
                  <h3>{x.name}</h3>
                  <p>{x.body}</p>
                </div>
                <span className={s.sysRes}>{x.res}</span>
              </li>
            ))}
          </ol>
          <div className={s.pair}>
            <figure>
              <Figure
                slug="seconde-console"
                alt="A timing console with cables and a small screen on a folding table beside a track"
              />
              <figcaption>Console 2, trackside. Two operators, one kettle.</figcaption>
            </figure>
            <figure>
              <Figure
                slug="seconde-lane"
                alt="A close overhead view of painted lane numbers on a running track surface"
              />
              <figcaption>Lane 4, surveyed to 0.2 mm before every meeting.</figcaption>
            </figure>
          </div>
        </section>

        {/* ------------------------------------------------------ LANE BAND */}
        <section className={s.laneBand} aria-hidden="true">
          <div className={s.laneField}>
            <TabbiedArtwork
              artwork={tailoff}
              palette={['transparent', MAGENTA, INK, GREY]}
              fit="grid"
              cellSize={104}
              redrawInterval={2400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* ------------------------------------------------------- RESULTS */}
        <section id="results" className={s.results} aria-labelledby="results-h">
          <div className={s.resField} aria-hidden="true">
            <TabbiedArtwork
              artwork={taper}
              palette={['transparent', PALE, GREY]}
              fit="grid"
              cellSize={120}
              redrawInterval={5000}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.resInner}>
            <h2 className={s.h2} id="results-h">
              100 m women, final
            </h2>
            <p className={s.note}>
              Meeting de Lausanne, 18.04.2026, 19:42. Wind +0.4 m/s. Times
              official four seconds after the last athlete crossed.
            </p>
            <ol className={s.table}>
              {RESULTS.map((r) => (
                <li key={r.pos}>
                  <span className={s.pos}>{r.pos}</span>
                  <span className={s.athlete}>{r.name}</span>
                  <span className={s.club}>{r.club}</span>
                  <span className={s.time}>{r.time}</span>
                  <span className={s.gap}>{r.gap}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* -------------------------------------------------------- SEASON */}
        <section id="season" className={s.season} aria-labelledby="season-h">
          <h2 className={s.h2} id="season-h">
            Season 2026
          </h2>
          <ol className={s.dates}>
            {SEASON.map(([d, name, kind, place]) => (
              <li key={name}>
                <span className={s.dDate}>{d}</span>
                <span className={s.dName}>{name}</span>
                <span className={s.dKind}>{kind}</span>
                <span className={s.dPlace}>{place}</span>
              </li>
            ))}
          </ol>
          <figure className={s.wide}>
            <Figure
              slug="seconde-board"
              alt="A large blank stadium scoreboard against an overcast sky seen from below"
            />
            <figcaption>The board waits. It is the only part of the job that does.</figcaption>
          </figure>
        </section>

        {/* ---------------------------------------------------------- BOOK */}
        <section id="book" className={s.book} aria-labelledby="book-h">
          <div className={s.bookField} aria-hidden="true">
            <TabbiedArtwork
              artwork={dotset}
              palette={['transparent', MAGENTA, GREY]}
              fit="grid"
              cellSize={52}
              redrawInterval={3600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.bookInner}>
            <h2 className={s.h2} id="book-h">
              Book the timing
            </h2>
            <div className={s.bookGrid}>
              <p className={s.big}>
                Tell us the discipline, the field size and the date. We reply
                with a crew, a rate and the list of things your venue needs to
                have flat.
              </p>
              <dl>
                <div>
                  <dt>Write</dt>
                  <dd>
                    <a href="mailto:chrono@seconde.example">chrono@seconde.example</a>
                  </dd>
                </div>
                <div>
                  <dt>Office</dt>
                  <dd>
                    Avenue de Rhodanie 12
                    <br />
                    1007 Lausanne
                  </dd>
                </div>
                <div>
                  <dt>Day rate</dt>
                  <dd>From CHF 2,400, crew of three, all systems</dd>
                </div>
                <div>
                  <dt>Notice</dt>
                  <dd>Six weeks. Four if the surface is already surveyed.</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
        {/* ---------------------------------------------------------- TILES */}
        <section id="tiles" className={s.tiles} aria-labelledby="tiles-h">
          <h2 id="tiles-h">Where a hundredth actually goes</h2>
          <p className={s.secNote}>Three places a result is won or lost before anybody runs.</p>
          <div className={s.tileGrid}>
              <article key="01">
                <div className={s.tilePlate} aria-hidden="true">
                  <TabbiedArtwork
                    artwork={dotmatrix}
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
                  <Figure slug="seconde-tile-watch-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p className={s.tileN}>01</p>
                <h3>The finish plane</h3>
                <p className={s.tileBody}>Levelled to 0.2 mm over eight metres. A finish line that is two millimetres out of plumb is worth more than most tailwinds.</p>
              </article>
              <article key="02">
                <div className={s.tilePlate} aria-hidden="true">
                  <TabbiedArtwork
                    artwork={ring}
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
                  <Figure slug="seconde-tile-block-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p className={s.tileN}>02</p>
                <h3>The start</h3>
                <p className={s.tileBody}>Force-sensing blocks at 1 kHz. We keep the trace for every start, contested or not, and hand it over on request.</p>
              </article>
              <article key="03">
                <div className={s.tilePlate} aria-hidden="true">
                  <TabbiedArtwork
                    artwork={fadedbar}
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
                  <Figure slug="seconde-tile-chip-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p className={s.tileN}>03</p>
                <h3>Synchronisation</h3>
                <p className={s.tileBody}>One clock, distributed by cable, never by wireless. Two clocks agreeing is not the same as one clock being right.</p>
              </article>
          </div>
        </section>

        {/* ---------------------------------------------------------- INDEX */}
        <section id="index" className={s.idx} aria-labelledby="idx-h">
          <h2 id="idx-h">What we bring</h2>
          <p className={s.secNote}>One van, two crew, and the list below. Venues supply power and a flat place to put it.</p>
          <ol className={s.idxList}>
            <li className={s.idxHead} aria-hidden="true">
                <span>Item</span>
                <span>Count</span>
                <span>Detail</span>
                <span>Weight</span>
            </li>
              <li key="Line-scan camera">
                <span>Line-scan camera</span>
                <span>2</span>
                <span>10 000 fps, twin plane</span>
                <span>14 kg</span>
              </li>
              <li key="Timing console">
                <span>Timing console</span>
                <span>2</span>
                <span>Primary and hot spare</span>
                <span>22 kg</span>
              </li>
              <li key="Start blocks, sensing">
                <span>Start blocks, sensing</span>
                <span>8</span>
                <span>1 kHz force trace</span>
                <span>96 kg</span>
              </li>
              <li key="Transponder loops">
                <span>Transponder loops</span>
                <span>6</span>
                <span>Surface or buried</span>
                <span>40 kg</span>
              </li>
              <li key="Light gates">
                <span>Light gates</span>
                <span>12</span>
                <span>Twin beam</span>
                <span>18 kg</span>
              </li>
              <li key="Cable, distribution">
                <span>Cable, distribution</span>
                <span>1 200 m</span>
                <span>Fibre and copper</span>
                <span>140 kg</span>
              </li>
          </ol>
        </section>

        {/* ------------------------------------------------------------ FAQ */}
        <section id="faq" className={s.faq} aria-labelledby="faq-h">
          <h2 id="faq-h">Asked by organisers</h2>
          <dl className={s.faqList}>
              <div key="How long do you need on ">
                <dt>How long do you need on site?</dt>
                <dd>Half a day before the first event for a track, a full day for a road course. Most of it is surveying the finish, not plugging things in.</dd>
              </div>
              <div key="Can we use our own score">
                <dt>Can we use our own scoreboard?</dt>
                <dd>Yes, if it speaks a protocol from this century. We will test it the day before, not on the morning.</dd>
              </div>
              <div key="What happens if a system">
                <dt>What happens if a system fails?</dt>
                <dd>Two of everything, hot. The photo finish and the transponders are independent chains, so losing one never loses the meeting.</dd>
              </div>
              <div key="Do you publish results y">
                <dt>Do you publish results yourselves?</dt>
                <dd>To your board and your feed, four seconds after the last athlete. What happens after that is your press officer, not us.</dd>
              </div>
          </dl>
        </section>

      </main>


        {/* A coda: the last thing before the footer is the pattern itself, at
            working size and with nothing to read. Purely decorative. */}
        <section className={s.coda} aria-hidden="true">
          <div className={s.codaField}>
            <TabbiedArtwork
              artwork={hairpin}
              palette={['transparent', PALE, GREY]}
              fit="grid"
              cellSize={110}
              redrawInterval={4970}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p className={s.footName}>Seconde</p>
            <p className={s.footTag}>Chronométrage sportif, Avenue de Rhodanie 12, Lausanne, depuis 1991.</p>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Timing</h2>
            <ul className={s.footLinks}>
              <li>
                <a href="#systems">Four systems</a>
              </li>
              <li>
                <a href="#results">Live results</a>
              </li>
              <li>
                <a href="#season">Season 2026</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Organisers</h2>
            <ul className={s.footLinks}>
              <li>
                <a href="#book">Book the timing</a>
              </li>
              <li>
                <a href="#book">Day rates</a>
              </li>
              <li>
                <a href="#systems">Start detection</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Contact</h2>
            <p className={s.footAddr}>
              Avenue de Rhodanie 12
              <br />
              1007 Lausanne
              <br />
              chrono@seconde.example
              <br />
              +41 21 000 00 00
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p>A fictional timing company. Prices and times are invented.</p>
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
