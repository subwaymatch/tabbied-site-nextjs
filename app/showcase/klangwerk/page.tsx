import { TabbiedArtwork } from 'tabbied/react';
import { flux, spark, curl, maelstrom, ripplering } from 'tabbied/artworks';
import { Figure } from 'components/Figure';
import s from './klangwerk.module.css';

export const metadata = {
  title: 'Klangwerk: Studio für elektroakustische Musik',
  description:
    'Klangwerk is an electroacoustic studio in Leipzig. Two rooms, one anechoic chamber, residencies for composers working with fixed media and live electronics.',
};

/* Near-black ground, pale type, one acid green. Every pattern field takes
   `transparent` in the background slot and reads as room tone. */
const PALE = '#E9E9E4';
const GREEN = '#00E58A';
const STEEL = '#5A6068';
const PANEL = '#14161A';

const ROOMS = [
  {
    id: 'I',
    name: 'Studio Eins',
    kind: 'Ambisonic room, 3rd order',
    body: 'Sixteen speakers on a half-sphere, decoded in the room and nowhere else. Built in 1998 around a floor that was already there and has never been levelled.',
    specs: [
      ['Speakers', '16, half-sphere'],
      ['Decode', '3rd order, in-room'],
      ['Floor', '38 m², floating'],
      ['Noise floor', '22 dB(A)'],
    ],
  },
  {
    id: 'II',
    name: 'Studio Zwei',
    kind: 'Stereo and quad, tape',
    body: 'The old room. Two Studer machines, a patchbay that predates most of the people using it, and a hard 4 kHz notch in the ceiling nobody has ever managed to fix.',
    specs: [
      ['Format', 'Stereo, quad'],
      ['Tape', '2 × Studer A80'],
      ['Patch', '208 points, bantam'],
      ['Floor', '24 m²'],
    ],
  },
  {
    id: 'III',
    name: 'Reflexionsarmer Raum',
    kind: 'Anechoic chamber',
    body: 'Free-field above 90 Hz. Used for impulse capture, instrument recording and, once a year, a concert for eleven people who sit very still.',
    specs: [
      ['Cutoff', '90 Hz'],
      ['Wedges', '0.9 m, glass wool'],
      ['Volume', '96 m³'],
      ['Access', 'Booked in half-days'],
    ],
  },
];

const RESIDENCIES = [
  { period: 'Jan to Mar', name: 'Ada Køhler', work: 'Fixed media, 8 channels', place: 'Copenhagen' },
  { period: 'Apr to Jun', name: 'Tomás Reiter', work: 'Live electronics and cello', place: 'Vienna' },
  { period: 'Jul to Sep', name: 'Nour El-Sayed', work: 'Field recording, ambisonic', place: 'Cairo' },
  { period: 'Oct to Dec', name: 'Mira Halvorsen', work: 'Tape and feedback systems', place: 'Bergen' },
];

const SERIES = [
  ['24.09', 'Reihe 41 / I', 'Køhler, new work for 16 channels', 'Studio Eins', '20.00'],
  ['22.10', 'Reihe 41 / II', 'Reiter, cello and live electronics', 'Studio Eins', '20.00'],
  ['19.11', 'Reihe 41 / III', 'Tape night: four pieces, no interval', 'Studio Zwei', '21.00'],
  ['17.12', 'Reihe 41 / IV', 'Eleven listeners, anechoic', 'Kammer', '19.00'],
];

export default function KlangwerkPage() {
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
          Klangwerk
        </a>
        <nav aria-label="Sections">
          <a href="#rooms">Räume</a>
          <a href="#residencies">Residencies</a>
          <a href="#series">Reihe</a>
          <a href="#apply">Apply</a>
        </nav>
        <span className={s.hz}>90 Hz to 20 kHz</span>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div className={s.heroField} aria-hidden="true">
            <TabbiedArtwork
              artwork={flux}
              palette={['transparent', GREEN, STEEL]}
              fit="grid"
              cellSize={150}
              redrawInterval={3000}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <p className={s.eyebrow}>Studio für elektroakustische Musik / Leipzig / seit 1998</p>
          <h1>
            A room is an
            <br />
            instrument you
            <br />
            <span>cannot pack away.</span>
          </h1>
          <p className={s.lede}>
            Three listening spaces, four residencies a year, and a concert
            series that has never once started late.
          </p>
        </section>

        {/* Full-bleed plate. On a dark page the photograph is the brightest
            thing on the screen, so it gets the whole width and a long crop. */}
        <figure className={s.bleed}>
          <Figure
            slug="klangwerk-desk"
            alt="A large analogue mixing desk in a darkened studio lit by a single green indicator glow"
            priority
          />
          <figcaption>Studio Zwei, 02.40. Reel two of four.</figcaption>
        </figure>

        {/* --------------------------------------------------------- ROOMS */}
        <section id="rooms" className={s.rooms} aria-labelledby="rooms-h">
          <div className={s.secHead}>
            <span>01</span>
            <h2 id="rooms-h">Three rooms</h2>
          </div>
          <div className={s.roomList}>
            {ROOMS.map((r) => (
              <article key={r.id}>
                <p className={s.rId}>{r.id}</p>
                <div>
                  <h3>{r.name}</h3>
                  <p className={s.rKind}>{r.kind}</p>
                  <p className={s.rBody}>{r.body}</p>
                </div>
                <dl className={s.rSpecs}>
                  {r.specs.map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
          <div className={s.pair}>
            <figure>
              <Figure
                slug="klangwerk-modular"
                alt="A wall of modular synthesiser panels with patch cables, lit low"
              />
              <figcaption>The wall in Studio Zwei. Patched by whoever is in.</figcaption>
            </figure>
            <figure>
              <Figure
                slug="klangwerk-chamber"
                alt="The interior of an anechoic chamber, wedge foam on every surface"
              />
              <figcaption>Free field above 90 Hz. Bring a jumper.</figcaption>
            </figure>
          </div>
        </section>

        {/* ---------------------------------------------------- TONE BAND */}
        <section className={s.tone} aria-hidden="true">
          <div className={s.toneField}>
            <TabbiedArtwork
              artwork={spark}
              palette={['transparent', GREEN, PALE, STEEL]}
              fit="grid"
              cellSize={70}
              redrawInterval={2600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* --------------------------------------------------- RESIDENCIES */}
        <section id="residencies" className={s.res} aria-labelledby="res-h">
          <div className={s.resField} aria-hidden="true">
            <TabbiedArtwork
              artwork={curl}
              palette={['transparent', STEEL, GREEN]}
              fit="grid"
              cellSize={104}
              redrawInterval={5200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.resInner}>
            <div className={s.secHead}>
              <span>02</span>
              <h2 id="res-h">Residencies, 2026</h2>
            </div>
            <p className={s.note}>
              Three months, one room, a small fee and no obligation to produce
              anything. Applications open each September and close when the
              inbox becomes unmanageable.
            </p>
            <ol className={s.resList}>
              {RESIDENCIES.map((r) => (
                <li key={r.name}>
                  <span className={s.rPeriod}>{r.period}</span>
                  <span className={s.rName}>{r.name}</span>
                  <span className={s.rWork}>{r.work}</span>
                  <span className={s.rPlace}>{r.place}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* -------------------------------------------------------- SERIES */}
        <section id="series" className={s.series} aria-labelledby="series-h">
          <div className={s.secHead}>
            <span>03</span>
            <h2 id="series-h">Reihe 41</h2>
          </div>
          <ol className={s.dates}>
            {SERIES.map(([date, no, what, room, time]) => (
              <li key={no}>
                <span className={s.dDate}>{date}</span>
                <span className={s.dNo}>{no}</span>
                <span className={s.dWhat}>{what}</span>
                <span className={s.dRoom}>{room}</span>
                <span className={s.dTime}>{time}</span>
              </li>
            ))}
          </ol>
          <figure className={s.wide}>
            <Figure
              slug="klangwerk-tape"
              alt="A reel-to-reel tape machine on a rack in a dark control room"
            />
            <figcaption>A80 number two. Aligned every Monday, whether it needs it or not.</figcaption>
          </figure>
        </section>

        {/* --------------------------------------------------------- APPLY */}
        <section id="apply" className={s.apply} aria-labelledby="apply-h">
          <div className={s.applyField} aria-hidden="true">
            <TabbiedArtwork
              artwork={maelstrom}
              palette={['transparent', GREEN, STEEL, PALE]}
              fit="grid"
              cellSize={96}
              redrawInterval={4400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.applyInner}>
            <h2 id="apply-h">Ask for a room</h2>
            <div className={s.applyGrid}>
              <p className={s.big}>
                Send a link to something you have made and a paragraph about
                what you want the room for. No proposal template, no budget
                narrative, no letters of support.
              </p>
              <dl>
                <div>
                  <dt>Write</dt>
                  <dd>
                    <a href="mailto:raum@klangwerk.example">raum@klangwerk.example</a>
                  </dd>
                </div>
                <div>
                  <dt>Studio</dt>
                  <dd>
                    Karl-Heine-Str. 41, Halle 4
                    <br />
                    04229 Leipzig
                  </dd>
                </div>
                <div>
                  <dt>Day rate</dt>
                  <dd>€90 Studio Eins, €60 Zwei, €140 Kammer</dd>
                </div>
                <div>
                  <dt>Residents</dt>
                  <dd>Free, with a key</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
      </main>

      <footer className={s.footer}>
        <div className={s.footField} aria-hidden="true">
          <TabbiedArtwork
            artwork={ripplering}
            palette={['transparent', STEEL, GREEN]}
            fit="grid"
            cellSize={128}
            redrawInterval={6800}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
        <div className={s.footInner}>
          <p className={s.footMark}>Klangwerk</p>
          <p className={s.footFine}>
            A fictional studio. Every pattern here is a live{' '}
            <a href="https://tabbied.com" rel="noopener">
              Tabbied
            </a>{' '}
            artwork on a transparent ground, redrawing on its own timer. © 2026.
          </p>
        </div>
      </footer>
    </div>
  );
}
