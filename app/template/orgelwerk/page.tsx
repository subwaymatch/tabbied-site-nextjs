import { TabbiedPattern } from 'tabbied/react';
import {
  abutment, arris, battlement, cornercut, lobeform, modillion, mutule,
} from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import s from './orgelwerk.module.css';

export const metadata = {
  title: 'Orgelwerk: Pipe organ builders, Ghent',
  description:
    'Organ builders casting their own pipe metal, voicing by hand and tuning to the room. New instruments, restorations, and a stop list that says what it is.',
};

/* Bone ground, ink, one pine green. Every decorative field takes
   `transparent` in the background slot, so the paper of the page — and, in
   the plates, the plate itself — is what shows through the drawing. */
const INK = '#141614';
const ACCENT = '#1d6f5c';
const GREY = '#87887f';
const PANEL = '#dfdcd0';

/* Twelve speaking lengths. `ft` drives the height of the pipe drawn for each,
   on a log scale, because that is how the ear hears them. */
const RANKS = [
  { ft: '16′', name: 'Bourdon', h: 100 },
  { ft: '8′', name: 'Prestant', h: 78 },
  { ft: '8′', name: 'Roerfluit', h: 74 },
  { ft: '5⅓′', name: 'Quint', h: 66 },
  { ft: '4′', name: 'Octaaf', h: 58 },
  { ft: '4′', name: 'Fluit', h: 55 },
  { ft: '2⅔′', name: 'Nasard', h: 47 },
  { ft: '2′', name: 'Doublette', h: 40 },
  { ft: '1⅗′', name: 'Tierce', h: 34 },
  { ft: '1⅓′', name: 'Larigot', h: 29 },
  { ft: '1′', name: 'Sifflet', h: 23 },
  { ft: 'IV', name: 'Mixtuur', h: 17 },
];

const STAGES = [
  { n: '01', t: 'Cast the metal', d: 'Tin and lead poured onto a sand-covered casting bench and drawn off as a sheet, then planed to thickness by hand', weeks: '2 weeks' },
  { n: '02', t: 'Roll and solder', d: 'Each pipe is rolled round a wooden mandrel and soldered along one seam, mouth cut afterwards', weeks: '6 weeks' },
  { n: '03', t: 'Build the chest', d: 'Oak windchest, slider action, every channel made to fit the rank that will stand on it', weeks: '11 weeks' },
  { n: '04', t: 'Voice on the bench', d: 'Every pipe spoken, listened to, adjusted at the languid and spoken again, one at a time', weeks: '9 weeks' },
  { n: '05', t: 'Voice in the room', d: 'All of it again, in the building, because the room is part of the instrument and the workshop is not', weeks: '5 weeks' },
];

const PRINCIPLES = [
  {
    art: arris,
    img: 'orgelwerk-tile-pipe-cutout',
    alt: 'A single tin organ pipe with a soldered foot',
    n: 'I',
    t: 'We make our own metal',
    d: 'Bought pipe metal is rolled, and rolled metal has a grain. Cast metal does not, and it is the only reason a hundred-year-old front pipe still stands up straight.',
  },
  {
    art: abutment,
    img: 'orgelwerk-tile-stopper-cutout',
    alt: 'A wooden organ pipe stopper block with a leather-faced plug',
    n: 'II',
    t: 'Voiced twice',
    d: 'Once on the bench and once in the building. An organ voiced only in the workshop arrives sounding like a workshop, and no amount of tuning afterwards fixes it.',
  },
  {
    art: modillion,
    img: 'orgelwerk-tile-knife-cutout',
    alt: 'A small hand-forged voicing knife with a wooden handle',
    n: 'III',
    t: 'Nothing is nicked',
    d: 'No nicks in the languid, no tape on the flue. Every pipe is made to speak by its own geometry, which takes longer and is the whole difference.',
  },
];

const STOPLIST = [
  ['Hoofdwerk', 'Prestant 8′', 'Cast tin, 75 %', '54 pipes', 'Front, speaking'],
  ['Hoofdwerk', 'Roerfluit 8′', 'Lead, chimneyed', '54 pipes', 'Stopped'],
  ['Hoofdwerk', 'Octaaf 4′', 'Cast tin, 75 %', '54 pipes', 'Open'],
  ['Hoofdwerk', 'Mixtuur IV', 'Cast tin, 75 %', '216 pipes', 'Breaks at c′'],
  ['Rugwerk', 'Holpijp 8′', 'Oak, stopped', '54 pipes', 'Wooden'],
  ['Rugwerk', 'Fluit 4′', 'Lead, conical', '54 pipes', 'Open'],
  ['Rugwerk', 'Nasard 2⅔′', 'Lead', '54 pipes', 'Open'],
  ['Rugwerk', 'Tierce 1⅗′', 'Lead', '54 pipes', 'Open'],
  ['Pedaal', 'Bourdon 16′', 'Oak, stopped', '30 pipes', 'Wooden'],
  ['Pedaal', 'Prestant 8′', 'Cast tin, 75 %', '30 pipes', 'Front, speaking'],
  ['Pedaal', 'Trompet 8′', 'Tin, reed', '30 pipes', 'Full-length resonator'],
  ['Couplers', 'RW – HW, HW – P', 'Mechanical', '—', 'Shove coupler'],
];

const BUILT = [
  ['2026', 'Sint-Amandskerk', 'Roeselare', 'New, 22 stops', 'Two manuals and pedal'],
  ['2025', 'Chapelle du Béguinage', 'Ghent', 'Restoration, 1743', 'Returned to mean-tone'],
  ['2025', 'Conservatorium', 'Antwerp', 'New, 14 stops', 'Practice instrument'],
  ['2024', 'Onze-Lieve-Vrouwekerk', 'Damme', 'Restoration, 1889', 'Romantic, kept as found'],
  ['2024', 'Private residence', 'Bruges', 'New, 6 stops', 'One manual, no pedal'],
  ['2023', 'Sint-Baafskathedraal', 'Ghent', 'Chest rebuild', 'Action only'],
  ['2022', 'Protestantse Kerk', 'Kortrijk', 'New, 18 stops', 'Two manuals and pedal'],
  ['2021', 'Abdij van Averbode', 'Averbode', 'Restoration, 1652', 'The oldest we have touched'],
];

const CARE = [
  ['Tuning', 'Twice a year, at the temperatures the building actually reaches.'],
  ['Temperament', 'Yours to choose. We will argue for the historical one and then do as you ask.'],
  ['Humidity', 'Between 45 and 65 %. Everything that ever goes wrong goes wrong outside that.'],
  ['Waiting list', 'Three years for a new instrument. Restorations are quoted after a survey.'],
];

export default function OrgelwerkPage() {
  return (
    <div className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,200..900&display=swap"
      />

      <header className={s.bar}>
        <a className={s.mark} href="#top">Orgelwerk</a>
        <nav aria-label="Sections">
          <a href="#ranks">Ranks</a>
          <a href="#making">Building</a>
          <a href="#stoplist">Stop list</a>
          <a href="#built">Built here</a>
        </nav>
        <span className={s.now}>Orgelbouw / Gent</span>
      </header>

      <main id="top">
        {/* ------------------------------------------------------------ HERO */}
        <section className={s.hero}>
          <div className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={battlement}
              palette={['transparent', PANEL, GREY, ACCENT]}
              fit="grid"
              cellSize={156}
              redrawInterval={6200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <p className={s.heroKicker}>Organ builders / Ghent / since 1934</p>
          <h1 className={s.heroType}>
            <span>Cast, rolled,</span>
            <span className={s.hi}>spoken to.</span>
          </h1>
          <div className={s.heroFoot}>
            <p>
              We pour our own pipe metal onto a sand bench, roll it round a
              mandrel, and then spend nine weeks making each pipe speak by
              itself.
            </p>
            <a className={s.cta} href="#making">
              How it is built
            </a>
          </div>
        </section>

        {/* ------------------------------------------------------ BLEED SCENE */}
        <figure className={s.bleed}>
          <Figure
            slug="orgelwerk-rack"
            alt="Ranks of tin organ pipes standing in a wooden rack in a tall workshop"
            priority
          />
          <figcaption>A rank in the rack, waiting for a chest. Nothing is nicked, nothing is taped.</figcaption>
        </figure>

        {/* ----------------------------------------------------------- RANKS */}
        <section id="ranks" className={s.ranks} aria-labelledby="ranks-h">
          <div className={s.secHead}>
            <h2 id="ranks-h">Twelve lengths</h2>
            <p>
              Speaking length, drawn to relative height. The mixture at the end
              is four ranks in one stop, which is why it is numbered rather
              than measured.
            </p>
          </div>
          <ol className={s.rankRow}>
            {RANKS.map((r) => (
              <li key={`${r.ft}-${r.name}`} className={s.rank}>
                <div className={s.rankPipe} style={{ height: `${r.h}%` }} aria-hidden="true" />
                <p className={s.rankFt}>{r.ft}</p>
                <p className={s.rankName}>{r.name}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------- STATEMENT */}
        <section className={s.statement}>
          <p className={s.big}>
            An organ is the only instrument that is built into a room, and the
            room is not an acoustic afterthought — it is part of the
            instrument. That is why the last five weeks of every job happen on
            a ladder in a cold church rather than in a warm workshop.
          </p>
          <div className={s.statementMeta}>
            <p>
              Orgelwerk has built on the Nieuwevaart since 1934. Nine people:
              four on the bench, two on the metal, one in the drawing office
              and two who are almost always away voicing.
            </p>
            <p>
              We cast our own pipe metal, which almost nobody does at this size
              any more, and it is the single decision the workshop has never
              once reconsidered.
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------------ BAND */}
        <div className={s.band} aria-hidden="true">
          <TabbiedPattern
            pattern={mutule}
            palette={['transparent', ACCENT, PANEL, GREY]}
            fit="grid"
            cellSize={120}
            redrawInterval={4200}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>

        {/* ---------------------------------------------------------- MAKING */}
        <section id="making" className={s.making} aria-labelledby="making-h">
          <div className={s.secHead}>
            <h2 id="making-h">Five stages</h2>
            <p>Thirty-three weeks for a two-manual instrument, of which fourteen are listening.</p>
          </div>
          <ol className={s.rows}>
            {STAGES.map((x) => (
              <li key={x.n}>
                <span className={s.rowN}>{x.n}</span>
                <h3 className={s.rowTitle}>{x.t}</h3>
                <span className={s.rowSub}>{x.d}</span>
                <span className={s.rowDays}>{x.weeks}</span>
              </li>
            ))}
          </ol>
          <div className={s.pair}>
            <figure>
              <Figure
                slug="orgelwerk-voicing"
                alt="A voicing bench with a single organ pipe standing on a small windchest and hand tools beside it"
              />
              <figcaption>The voicing bench. One pipe, one ear, and no hurry at all.</figcaption>
            </figure>
            <figure>
              <Figure
                slug="orgelwerk-case"
                alt="The upper case of a pipe organ in a church loft seen from below"
              />
              <figcaption>In the loft at Damme. Restored, and left sounding like 1889.</figcaption>
            </figure>
          </div>
        </section>

        {/* ------------------------------------------------------ PRINCIPLES */}
        <section className={s.principles} aria-labelledby="pr-h">
          <div className={s.secHead}>
            <h2 id="pr-h">Three refusals</h2>
            <p>Each of them makes an instrument slower to build and longer to last.</p>
          </div>
          <div className={s.pGrid}>
            {PRINCIPLES.map((p) => (
              <article key={p.n}>
                <div className={s.pPlate}>
                  <div className={s.pField} aria-hidden="true">
                    <TabbiedPattern
                      pattern={p.art}
                      palette={['transparent', GREY, ACCENT]}
                      fit="grid"
                      cellSize={66}
                      redrawInterval={5400}
                      style={{ position: 'absolute', inset: 0 }}
                    />
                  </div>
                  <Figure slug={p.img} alt={p.alt} cutout className={s.pObject} />
                </div>
                <p className={s.pN}>{p.n}</p>
                <h3>{p.t}</h3>
                <p className={s.pBody}>{p.d}</p>
              </article>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------------- STOP LIST */}
        <section id="stoplist" className={s.listing} aria-labelledby="stop-h">
          <div className={s.secHead}>
            <h2 id="stop-h">The stop list</h2>
            <p>Roeselare, 2026. Twenty-two stops over two manuals and pedal, mechanical throughout.</p>
          </div>
          <ol className={s.table}>
            {STOPLIST.map((r, i) => (
              <li key={i}>
                <span className={s.tKey}>{r[0]}</span>
                <span className={s.tMain}>{r[1]}</span>
                <span className={s.tMid}>{r[2]}</span>
                <span className={s.tMid}>{r[3]}</span>
                <span className={s.tEnd}>{r[4]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------- QUOTE BAND */}
        <section className={s.quote}>
          <div className={s.quoteField} aria-hidden="true">
            <TabbiedPattern
              pattern={cornercut}
              palette={['transparent', ACCENT, GREY]}
              fit="grid"
              cellSize={118}
              redrawInterval={4600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <blockquote>
            <p>You cannot voice an organ in a workshop. You can only stop it from being obviously wrong there.</p>
            <cite>Wim Descamps, voicing</cite>
          </blockquote>
        </section>

        {/* ----------------------------------------------------------- BUILT */}
        <section id="built" className={s.listing} aria-labelledby="built-h">
          <div className={s.secHead}>
            <h2 id="built-h">Built and restored</h2>
            <p>A restoration keeps whatever the instrument already is. We do not improve them.</p>
          </div>
          <ol className={s.table}>
            {BUILT.map((r, i) => (
              <li key={i}>
                <span className={s.tKey}>{r[0]}</span>
                <span className={s.tMain}>{r[1]}</span>
                <span className={s.tMid}>{r[2]}</span>
                <span className={s.tMid}>{r[3]}</span>
                <span className={s.tEnd}>{r[4]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------------ CARE */}
        <section id="care" className={s.visit} aria-labelledby="care-h">
          <div className={s.visitField} aria-hidden="true">
            <TabbiedPattern
              pattern={arris}
              palette={['transparent', GREY, PANEL]}
              fit="grid"
              cellSize={102}
              redrawInterval={5400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <h2 id="care-h">Living with one</h2>
          <dl className={s.visitList}>
            {CARE.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* --------------------------------------------------------- CONTACT */}
        <section className={s.contact}>
          <p className={s.contactPre}>Surveys, quotations, tuning visits</p>
          <a className={s.contactMail} href="mailto:werkplaats@orgelwerk.example">
            werkplaats@orgelwerk.example
          </a>
          <p className={s.contactFine}>
            Nieuwevaart 118, 9000 Gent. Two of us are usually up a ladder
            somewhere, so a letter is answered faster than a telephone.
          </p>
        </section>
      </main>

      <div className={s.coda} aria-hidden="true">
        <TabbiedPattern
          pattern={lobeform}
          palette={['transparent', ACCENT, PANEL, GREY]}
          fit="grid"
          cellSize={106}
          redrawInterval={5000}
          style={{ position: 'absolute', inset: 0 }}
        />
      </div>

      <footer className={s.footer}>
        <div className={s.footObject}>
          <div className={s.footPlate}>
            <div className={s.footPlateField} aria-hidden="true">
              <TabbiedPattern
                pattern={mutule}
                palette={['transparent', GREY, ACCENT]}
                fit="grid"
                cellSize={74}
                redrawInterval={6000}
                style={{ position: 'absolute', inset: 0 }}
              />
            </div>
            <Figure slug="orgelwerk-tile-cone-cutout" alt="A brass organ tuning cone with a turned wooden handle" cutout className={s.footCut} />
          </div>
          <p className={s.footLine}>Nothing in an organ is finished until it has been listened to in the room.</p>
        </div>
        <div className={s.footGrid}>
          <div>
            <h2>Workshop</h2>
            <ul>
              <li><a href="#making">Five stages</a></li>
              <li><a href="#ranks">Twelve lengths</a></li>
              <li><a href="#built">Built and restored</a></li>
            </ul>
          </div>
          <div>
            <h2>Instruments</h2>
            <ul>
              <li><a href="#stoplist">A stop list</a></li>
              <li><a href="#care">Tuning and care</a></li>
              <li><a href="#care">Waiting list</a></li>
            </ul>
          </div>
          <div>
            <h2>Here</h2>
            <p>
              Nieuwevaart 118
              <br />
              9000 Gent
              <br />
              werkplaats@orgelwerk.example
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p>A fictional organ workshop. Instruments, dates and stop lists are invented.</p>
          <p>
            Patterns by{' '}
            <a href="https://tabbied.com" rel="noopener">
              Tabbied
            </a>
            , drawn live on a transparent ground; imagery generated with GPT Image 2.
          </p>
        </div>
      </footer>
    </div>
  );
}
