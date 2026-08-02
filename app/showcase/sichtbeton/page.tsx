import { TabbiedArtwork } from 'tabbied/react';
import { subdivide, chase, keyway, gritfield, recession } from 'tabbied/artworks';
import { Figure } from 'components/Figure';
import s from './sichtbeton.module.css';

export const metadata = {
  title: 'Sichtbeton: Betontechnologie, Zürich',
  description:
    'Sichtbeton advises on fair-faced concrete: mix design, formwork, curing, and the site trials that decide whether a wall is acceptable before it is poured.',
};

/* Grey paper, near-black ink, one safety orange. Every pattern field takes
   `transparent` in its background slot. */
const INK = '#131313';
const ORANGE = '#FF5A00';
const STEEL = '#8B8B87';
const PALE = '#D3D3CE';

const CLASSES = [
  { c: 'SB 1', use: 'Basements, plant rooms', form: 'Any', tol: 'Joints ± 20 mm', trial: 'None' },
  { c: 'SB 2', use: 'Stair cores, back of house', form: 'Sheet, unspecified', tol: 'Joints ± 15 mm', trial: 'None' },
  { c: 'SB 3', use: 'Visible interiors', form: 'Specified panel, sequenced', tol: 'Joints ± 10 mm', trial: '1 panel' },
  { c: 'SB 4', use: 'Facades, exposed halls', form: 'Board-marked, numbered', tol: 'Joints ± 5 mm', trial: '2 panels' },
];

const CHECKS = [
  { n: '01', t: 'Mix before form', d: 'A mix is chosen for colour, workability and bleed before anyone draws a panel layout. Doing it the other way round is how walls come out mottled.' },
  { n: '02', t: 'One cement, one quarry', d: 'A single delivery source for the whole visible surface. Change the quarry mid-pour and no amount of curing will hide it.' },
  { n: '03', t: 'Trial panels, full height', d: 'Two panels, cast on site, in the weather the real pour will get. Signed off by the architect before the first real lift.' },
  { n: '04', t: 'Curing is the finish', d: 'The wall is decided in the first seven days. We write the curing regime into the contract and inspect it, because nobody else will.' },
];

const NUMBERS = [
  ['SB 1 to 4', 'Classes advised'],
  ['214', 'Trial panels witnessed'],
  ['7 d', 'Curing, minimum'],
  ['0', 'Walls we have agreed to render'],
];

export default function SichtbetonPage() {
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
          Sichtbeton
        </a>
        <nav aria-label="Sections">
          <a href="#classes">Classes</a>
          <a href="#checks">Checks</a>
          <a href="#trials">Trials</a>
          <a href="#office">Office</a>
        </nav>
        <span className={s.meta}>Betontechnologie / Zürich</span>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div className={s.heroField} aria-hidden="true">
            <TabbiedArtwork
              artwork={subdivide}
              palette={['transparent', PALE, STEEL]}
              fit="grid"
              cellSize={176}
              redrawInterval={6200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <p className={s.eyebrow}>Betontechnologie / seit 1996</p>
            <h1>
              A fair-faced wall
              <br />
              is decided before
              <br />
              <span>anybody pours it.</span>
            </h1>
            <p className={s.lede}>
              Mix design, formwork strategy, trial panels and curing. We are the
              people who say no in week four so nobody has to say it in week
              forty.
            </p>
          </div>
        </section>

        {/* The wall itself, edge to edge, cropped so the tie holes set the
            page's rhythm before any text does. */}
        <figure className={s.bleed}>
          <Figure
            slug="sichtbeton-wall"
            alt="A large board-marked fair-faced concrete wall with tie holes in a regular grid"
            priority
          />
          <figcaption>SB 4, board-marked, tie grid at 1,200 mm. Cast in November.</figcaption>
        </figure>

        <dl className={s.numbers}>
          {NUMBERS.map(([v, k]) => (
            <div key={k}>
              <dt>{v}</dt>
              <dd>{k}</dd>
            </div>
          ))}
        </dl>

        {/* -------------------------------------------------------- CLASSES */}
        <section id="classes" className={s.classes} aria-labelledby="classes-h">
          <h2 className={s.h2} id="classes-h">
            Four classes
          </h2>
          <ol className={s.table}>
            <li className={s.thead} aria-hidden="true">
              <span>Class</span>
              <span>Typical use</span>
              <span>Formwork</span>
              <span>Tolerance</span>
              <span>Trial</span>
            </li>
            {CLASSES.map((c) => (
              <li key={c.c}>
                <span className={s.cls}>{c.c}</span>
                <span className={s.use}>{c.use}</span>
                <span>{c.form}</span>
                <span className={s.num}>{c.tol}</span>
                <span className={c.trial === 'None' ? s.none : s.req}>{c.trial}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------- TIE BAND */}
        <section className={s.tieBand} aria-hidden="true">
          <div className={s.tieField}>
            <TabbiedArtwork
              artwork={chase}
              palette={['transparent', INK, ORANGE, STEEL]}
              fit="grid"
              cellSize={82}
              redrawInterval={3800}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* --------------------------------------------------------- CHECKS */}
        <section id="checks" className={s.checks} aria-labelledby="checks-h">
          <div className={s.checksField} aria-hidden="true">
            <TabbiedArtwork
              artwork={keyway}
              palette={['transparent', STEEL, PALE]}
              fit="grid"
              cellSize={98}
              redrawInterval={5400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.checksInner}>
            <h2 className={s.h2} id="checks-h">
              Four things that decide the wall
            </h2>
            <ol className={s.checkList}>
              {CHECKS.map((c) => (
                <li key={c.n}>
                  <span className={s.chN}>{c.n}</span>
                  <h3>{c.t}</h3>
                  <p>{c.d}</p>
                </li>
              ))}
            </ol>
            <div className={s.pair}>
              <figure>
                <Figure
                  slug="sichtbeton-formwork"
                  alt="Timber formwork panels stacked and braced on a construction site"
                />
                <figcaption>Panels numbered and sequenced. Reuse is capped at four.</figcaption>
              </figure>
              <figure>
                <Figure
                  slug="sichtbeton-rebar"
                  alt="A dense reinforcement cage tied and waiting for a pour, seen from above"
                />
                <figcaption>Cover checked twice: once by the steelfixer, once by us.</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- TRIALS */}
        <section id="trials" className={s.trials} aria-labelledby="trials-h">
          <h2 className={s.h2} id="trials-h">
            Trial panels
          </h2>
          <div className={s.trialGrid}>
            <p className={s.big}>
              Two panels, full height, cast on the site by the crew who will do
              the real pour, in whatever weather turns up. Then everybody stands
              in front of them and agrees, in writing, what acceptable means.
            </p>
            <div className={s.trialCol}>
              <p>
                A photograph is not a trial panel. Neither is a sample from
                another job, another supplier or another season. Concrete is a
                local material and the panel is the only honest specification.
              </p>
              <p>
                The signed panel stays on site until practical completion. When
                a dispute happens, and it does, the wall is compared to the
                panel and not to anybody&rsquo;s memory of the panel.
              </p>
            </div>
          </div>
          <figure className={s.wide}>
            <Figure
              slug="sichtbeton-cylinder"
              alt="Concrete test cylinders standing on a laboratory bench beside a compression machine"
            />
            <figcaption>Cubes at 7 and 28 days. Colour is judged on the panel, not on these.</figcaption>
          </figure>
        </section>

        {/* --------------------------------------------------------- OFFICE */}
        <section id="office" className={s.office} aria-labelledby="office-h">
          <div className={s.officeField} aria-hidden="true">
            <TabbiedArtwork
              artwork={gritfield}
              palette={['transparent', ORANGE, STEEL]}
              fit="grid"
              cellSize={54}
              redrawInterval={4600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.officeInner}>
            <h2 className={s.h2} id="office-h">
              Engaging us
            </h2>
            <dl className={s.contact}>
              <div>
                <dt>Office</dt>
                <dd>
                  Hardturmstrasse 260
                  <br />
                  8005 Zürich
                </dd>
              </div>
              <div>
                <dt>Write</dt>
                <dd>
                  <a href="mailto:beton@sichtbeton.example">beton@sichtbeton.example</a>
                </dd>
              </div>
              <div>
                <dt>When</dt>
                <dd>At concept design. Later is possible and more expensive.</dd>
              </div>
              <div>
                <dt>Site work</dt>
                <dd>Trial panel witnessing, first lift, and a weekly walk.</dd>
              </div>
            </dl>
          </div>
        </section>
      </main>

      <footer className={s.footer}>
        <div className={s.footField} aria-hidden="true">
          <TabbiedArtwork
            artwork={recession}
            palette={['transparent', ORANGE, STEEL]}
            fit="grid"
            cellSize={132}
            redrawInterval={6800}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
        <div className={s.footInner}>
          <p className={s.footMark}>Sichtbeton</p>
          <p className={s.footFine}>
            A fictional consultancy. Every pattern is a live{' '}
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
