import { TabbiedArtwork } from 'tabbied/react';
import { dotmatrix, halftone, ortho, thickset, stitch } from 'tabbied/artworks';
import { Figure } from 'components/Figure';
import s from './halbfett.module.css';

export const metadata = {
  title: 'Halbfett: Schriftgiesserei, Zürich',
  description:
    'Halbfett is a type foundry in Zürich. Eleven families, drawn slowly, licensed plainly. Trials are free and never expire.',
};

/* Black, white, one vermilion, two greys. Every pattern field takes
   `transparent` in the background slot so the white page shows through. */
const INK = '#000000';
const RED = '#FF3B14';
const GREY = '#9A9A9A';
const PALE = '#DCDCDC';

const FAMILIES = [
  { name: 'Halbfett Grotesk', styles: 18, axes: 'Weight, Width', year: '2019', note: 'The house workhorse. Drawn for signage first, screens second, and it shows in the counters.' },
  { name: 'Halbfett Text', styles: 12, axes: 'Weight, Optical size', year: '2020', note: 'For long settings at 9 to 12 point. Slightly tall x-height, deliberately dull.' },
  { name: 'Halbfett Display', styles: 9, axes: 'Weight', year: '2021', note: 'Tight, high-contrast, unusable below 40 point. That is the intention.' },
  { name: 'Halbfett Mono', styles: 8, axes: 'Weight', year: '2022', note: 'Fixed pitch with real italics, drawn for code review rather than for terminals.' },
  { name: 'Halbfett Stencil', styles: 4, axes: 'Weight, Bridge', year: '2023', note: 'The bridge axis moves the cuts, not the strokes. Nobody asked for this. We enjoyed it.' },
  { name: 'Halbfett Serif', styles: 14, axes: 'Weight, Optical size', year: '2024', note: 'A quiet transitional. Our first serif in nine years and our slowest project.' },
];

const WEIGHTS = [
  ['100', 'Thin'],
  ['200', 'Extraleicht'],
  ['300', 'Leicht'],
  ['400', 'Normal'],
  ['500', 'Kräftig'],
  ['600', 'Halbfett'],
  ['700', 'Fett'],
  ['800', 'Extrafett'],
];

const LICENCES = [
  { name: 'Desktop', unit: 'per style, 5 users', price: 'CHF 60', body: 'Install and set anything. Print, logos, packaging. No annual renewal, ever.' },
  { name: 'Web', unit: 'per style, 500k views / month', price: 'CHF 60', body: 'Self-hosted WOFF2. We do not run a CDN and will not watch your traffic.' },
  { name: 'App', unit: 'per style, per app', price: 'CHF 240', body: 'Embed in a shipped binary. Updates included for the life of the app.' },
  { name: 'Broadcast', unit: 'per family, per production', price: 'CHF 480', body: 'Titles, lower thirds, motion. One production, unlimited episodes.' },
];

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ÄÖÜÆØÅßfiflÐÞ&@#§'.split('');

export default function HalbfettPage() {
  return (
    <div className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
      />

      <header className={s.bar}>
        <span className={s.logo}>Halbfett</span>
        <nav aria-label="Sections">
          <a href="#library">Library</a>
          <a href="#specimen">Specimen</a>
          <a href="#licences">Licences</a>
          <a href="#studio">Studio</a>
        </nav>
        <a className={s.trial} href="#licences">
          Free trial fonts
        </a>
      </header>

      <main>
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div className={s.heroField} aria-hidden="true">
            <TabbiedArtwork
              artwork={dotmatrix}
              palette={['transparent', PALE, GREY]}
              fit="grid"
              cellSize={34}
              redrawInterval={3200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <p className={s.kicker}>Schriftgiesserei / Zürich / gegr. 2016</p>
          <h1 className={s.hero1}>
            Type drawn at the
            <br />
            speed it wants
            <br />
            <span>to be drawn.</span>
          </h1>
          <p className={s.heroLede}>
            Eleven families, sixty-five styles, three people. We release a
            family when it is finished, which is roughly once every eighteen
            months and never in September.
          </p>
        </section>

        {/* A full-bleed plate at the top of the page: the specimen wall, run
            edge to edge and cropped hard so it reads as a poster. */}
        <figure className={s.bleed}>
          <Figure
            slug="halbfett-wall"
            alt="A studio wall pinned edge to edge with large printed type specimen sheets"
            priority
          />
        </figure>

        {/* ------------------------------------------------------- LIBRARY */}
        <section id="library" className={s.library} aria-labelledby="library-h">
          <div className={s.head}>
            <h2 id="library-h">The library</h2>
            <p>Six families shown. Five more are in the trial pack.</p>
          </div>
          <ol className={s.families}>
            {FAMILIES.map((f, i) => (
              <li key={f.name}>
                <span className={s.fNo}>{String(i + 1).padStart(2, '0')}</span>
                <div className={s.fMain}>
                  <h3>{f.name}</h3>
                  <p>{f.note}</p>
                </div>
                <span className={s.fMeta}>{f.styles} styles</span>
                <span className={s.fMeta}>{f.axes}</span>
                <span className={s.fYear}>{f.year}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------- WEIGHT LADDER */}
        <section id="specimen" className={s.specimen} aria-labelledby="specimen-h">
          <div className={s.specField} aria-hidden="true">
            <TabbiedArtwork
              artwork={halftone}
              palette={['transparent', GREY, PALE]}
              fit="grid"
              cellSize={46}
              redrawInterval={4600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.specInner}>
            <div className={s.head}>
              <h2 id="specimen-h">Eight weights, one skeleton</h2>
              <p>Halbfett Grotesk, set at 96 point. The name of the foundry is the sixth one.</p>
            </div>
            <ol className={s.ladder}>
              {WEIGHTS.map(([w, label]) => (
                <li key={w} style={{ fontWeight: Number(w) }}>
                  <span className={s.lWord}>Schriftgiesserei</span>
                  <span className={s.lMeta}>
                    {w} <i>{label}</i>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* -------------------------------------------------- CHARACTER SET */}
        <section className={s.glyphs} aria-label="Character set">
          <div className={s.glyphField} aria-hidden="true">
            <TabbiedArtwork
              artwork={ortho}
              palette={['transparent', RED, INK]}
              fit="grid"
              cellSize={68}
              redrawInterval={5800}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.glyphGrid}>
            {GLYPHS.map((g, i) => (
              <span key={`${g}-${i}`}>{g}</span>
            ))}
          </div>
        </section>

        <div className={s.trioWrap}>
          <figure>
            <Figure slug="halbfett-sorts" alt="Loose metal type sorts spilled on a steel surface" />
            <figcaption>Sorts from the old Zürich foundry, kept for reference.</figcaption>
          </figure>
          <figure>
            <Figure slug="halbfett-proof" alt="A desk with proof sheets, a loupe and a red marker" />
            <figcaption>Proofing Serif, third pass, week forty-one.</figcaption>
          </figure>
          <figure>
            <Figure slug="halbfett-press" alt="A proofing press with a fresh black print on the bed" />
            <figcaption>Every release is pulled once on the press.</figcaption>
          </figure>
        </div>

        {/* ------------------------------------------------------ LICENCES */}
        <section id="licences" className={s.licences} aria-labelledby="licences-h">
          <div className={s.head}>
            <h2 id="licences-h">Licences, in plain terms</h2>
            <p>
              One page, no legal counsel required. Buy once, use forever; we have
              never revoked a licence and would not know how.
            </p>
          </div>
          <div className={s.lic}>
            {LICENCES.map((l) => (
              <article key={l.name}>
                <h3>{l.name}</h3>
                <p className={s.licUnit}>{l.unit}</p>
                <p className={s.licPrice}>{l.price}</p>
                <p className={s.licBody}>{l.body}</p>
              </article>
            ))}
          </div>
          <p className={s.licNote}>
            Students and typography courses pay nothing. Write from an
            institutional address and say what the class is; we will send the
            whole library.
          </p>
        </section>

        {/* -------------------------------------------------------- STUDIO */}
        <section id="studio" className={s.studio} aria-labelledby="studio-h">
          <div className={s.studioField} aria-hidden="true">
            <TabbiedArtwork
              artwork={thickset}
              palette={['transparent', INK, RED]}
              fit="grid"
              cellSize={120}
              redrawInterval={4000}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.studioInner}>
            <h2 id="studio-h">Three people, Rämistrasse 40</h2>
            <div className={s.studioGrid}>
              <p className={s.big}>
                Vera Zumbrunn draws. Ilja Brand engineers and hints. Sara Moretti
                answers everything else, usually the same day.
              </p>
              <dl>
                <div>
                  <dt>Studio</dt>
                  <dd>
                    Rämistrasse 40, 8001 Zürich
                    <br />
                    By appointment
                  </dd>
                </div>
                <div>
                  <dt>Write</dt>
                  <dd>
                    <a href="mailto:post@halbfett.example">post@halbfett.example</a>
                  </dd>
                </div>
                <div>
                  <dt>Custom work</dt>
                  <dd>Two commissions a year. The 2027 slots are open.</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
      </main>

      <footer className={s.footer}>
        <div className={s.footField} aria-hidden="true">
          <TabbiedArtwork
            artwork={stitch}
            palette={['transparent', RED, GREY]}
            fit="grid"
            cellSize={54}
            redrawInterval={6400}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
        <p className={s.footWord}>Halbfett</p>
        <p className={s.footFine}>
          A fictional type foundry. Patterns are live{' '}
          <a href="https://tabbied.com" rel="noopener">
            Tabbied
          </a>{' '}
          artworks with a transparent ground, redrawn every few seconds. © 2026.
        </p>
      </footer>
    </div>
  );
}
