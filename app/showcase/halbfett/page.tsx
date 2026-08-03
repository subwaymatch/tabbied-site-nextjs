import { TabbiedArtwork } from 'tabbied/react';
import {
  dotmatrix, dotset, halftone, kern, misprint, ortho, peppering, stitch, thickset,
} from 'tabbied/artworks';
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
/* The two inks the decorative tiles draw with: always the quiet pair, so a
   tile reads as a sample rather than as another headline. */
/* The tiles pin their doodle to a whole multiple of the cell (9 × 72px)
   and let the plate clip it. A fluid box gives fractional grid tracks and
   a hairline seam at every cell edge. */
const TILE_BOX = 648;
const TILE_A = GREY;
const TILE_B = PALE;


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
        {/* ---------------------------------------------------------- TILES */}
        <section id="tiles" className={s.tiles} aria-labelledby="tiles-h">
          <h2 id="tiles-h">Three things we test before release</h2>
          <p className={s.secNote}>A family ships when these three pass. There is no schedule that overrules them.</p>
          <div className={s.tileGrid}>
              <article key="01">
                <div className={s.tilePlate} aria-hidden="true">
                  <TabbiedArtwork
                    artwork={dotset}
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
                </div>
                <p className={s.tileN}>01</p>
                <h3>Spacing, at text size</h3>
                <p className={s.tileBody}>Set the same paragraph at nine point in every style and read it on paper. Screen proofing hides spacing faults that paper finds in a second.</p>
              </article>
              <article key="02">
                <div className={s.tilePlate} aria-hidden="true">
                  <TabbiedArtwork
                    artwork={misprint}
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
                </div>
                <p className={s.tileN}>02</p>
                <h3>Hinting and rendering</h3>
                <p className={s.tileBody}>Every style through four rasterisers at eight sizes. We keep the ugly screenshots and fix them rather than filing them.</p>
              </article>
              <article key="03">
                <div className={s.tilePlate} aria-hidden="true">
                  <TabbiedArtwork
                    artwork={peppering}
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
                </div>
                <p className={s.tileN}>03</p>
                <h3>The awkward pairs</h3>
                <p className={s.tileBody}>Two hundred kern pairs nobody remembers to check, including the ones with quotes, and the Swiss ones with numbers in them.</p>
              </article>
          </div>
        </section>

        {/* ---------------------------------------------------------- INDEX */}
        <section id="index" className={s.idx} aria-labelledby="idx-h">
          <h2 id="idx-h">Character set</h2>
          <p className={s.secNote}>What is in every family. Extended Latin as standard; Greek and Cyrillic on the Grotesk only.</p>
          <ol className={s.idxList}>
            <li className={s.idxHead} aria-hidden="true">
                <span>Set</span>
                <span>Glyphs</span>
                <span>In</span>
                <span>Note</span>
            </li>
              <li key="Latin, basic">
                <span>Latin, basic</span>
                <span>230</span>
                <span>All families</span>
                <span>ISO 8859-1 and then some</span>
              </li>
              <li key="Latin, extended">
                <span>Latin, extended</span>
                <span>412</span>
                <span>All families</span>
                <span>Central and eastern European</span>
              </li>
              <li key="Greek">
                <span>Greek</span>
                <span>188</span>
                <span>Grotesk</span>
                <span>Monotonic</span>
              </li>
              <li key="Cyrillic">
                <span>Cyrillic</span>
                <span>204</span>
                <span>Grotesk</span>
                <span>Russian and Ukrainian</span>
              </li>
              <li key="Figures">
                <span>Figures</span>
                <span>5 sets</span>
                <span>All families</span>
                <span>Lining, oldstyle, tabular, fractions, superior</span>
              </li>
              <li key="Arrows and symbols">
                <span>Arrows and symbols</span>
                <span>96</span>
                <span>All families</span>
                <span>Drawn, not borrowed</span>
              </li>
          </ol>
        </section>

        {/* ------------------------------------------------------------ FAQ */}
        <section id="faq" className={s.faq} aria-labelledby="faq-h">
          <h2 id="faq-h">Licensing questions</h2>
          <dl className={s.faqList}>
              <div key="Can I test before buying">
                <dt>Can I test before buying?</dt>
                <dd>Yes. The trial pack is the full library with a limited character set, it is free, and it does not expire. We have never asked anyone to delete one.</dd>
              </div>
              <div key="What counts as one app?">
                <dt>What counts as one app?</dt>
                <dd>One product on one storefront. Ship it on three platforms and it is still one app; ship a second product and it is a second licence.</dd>
              </div>
              <div key="Do you do exclusive comm">
                <dt>Do you do exclusive commissions?</dt>
                <dd>Two a year. Exclusivity is for five years, after which the family joins the library unless you buy the extension.</dd>
              </div>
              <div key="What if my traffic goes ">
                <dt>What if my traffic goes over?</dt>
                <dd>Nothing happens automatically. Write to us at the end of the year and we will invoice the difference at the same rate.</dd>
              </div>
          </dl>
        </section>

      </main>


        {/* A coda: the last thing before the footer is the pattern itself, at
            working size and with nothing to read. Purely decorative. */}
        <section className={s.coda} aria-hidden="true">
          <div className={s.codaField}>
            <TabbiedArtwork
              artwork={kern}
              palette={['transparent', PALE, GREY]}
              fit="grid"
              cellSize={120}
              redrawInterval={5040}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p className={s.footName}>Halbfett</p>
            <p className={s.footTag}>A type foundry at Rämistrasse 40, Zürich, since 2016.</p>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Library</h2>
            <ul className={s.footLinks}>
              <li>
                <a href="#library">The library</a>
              </li>
              <li>
                <a href="#specimen">Weight ladder</a>
              </li>
              <li>
                <a href="#licences">Trial fonts</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Licensing</h2>
            <ul className={s.footLinks}>
              <li>
                <a href="#licences">Desktop and web</a>
              </li>
              <li>
                <a href="#licences">App and broadcast</a>
              </li>
              <li>
                <a href="#studio">Custom work</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Contact</h2>
            <p className={s.footAddr}>
              Rämistrasse 40
              <br />
              8001 Zürich
              <br />
              post@halbfett.example
              <br />
              By appointment
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p>A fictional type foundry. Prices and times are invented.</p>
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
