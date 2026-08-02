import { TabbiedArtwork } from 'tabbied/react';
import { quire, stitch, subdivide, dotfield, chain } from 'tabbied/artworks';
import { Figure } from 'components/Figure';
import s from './fonds-aubert.module.css';

export const metadata = {
  title: 'Fonds Aubert: Archives Privées, Lausanne',
  description:
    'Fonds Aubert holds 4.2 linear kilometres of private and business records. Deposit, conservation, and a reading room open four days a week.',
};

/* Pale paper, dark ink, one olive that only ever appears on a reference.
   Pattern fields take `transparent` in the background slot. */
const INK = '#1A1C18';
const OLIVE = '#4C6B2F';
const GREY = '#8C8F84';
const PALE = '#DEDED4';

const FONDS = [
  { ref: 'FA 001', name: 'Aubert et Fils, négoce', span: '1861 to 1974', extent: '312 m', state: 'Catalogued' },
  { ref: 'FA 014', name: 'Papeteries de la Broye', span: '1903 to 1991', extent: '486 m', state: 'Catalogued' },
  { ref: 'FA 022', name: 'Fonds Marthe Vionnet', span: '1919 to 1988', extent: '46 m', state: 'Catalogued' },
  { ref: 'FA 031', name: 'Chemins de fer du Jorat', span: '1889 to 1963', extent: '204 m', state: 'In progress' },
  { ref: 'FA 040', name: 'Coopérative du Léman', span: '1932 to 2004', extent: '618 m', state: 'In progress' },
  { ref: 'FA 047', name: 'Atelier Perrin, photographie', span: '1948 to 1997', extent: '91 m', state: 'Uncatalogued' },
];

const SERVICES = [
  { n: 'A', t: 'Deposit', d: 'We accept records of lasting value from businesses, associations and families in the canton. Appraisal is free and honest: most of what people offer us should be recycled, and we say so.' },
  { n: 'B', t: 'Conservation', d: 'Rehousing, surface cleaning, paper repair and a bindery for anything a reader would otherwise tear. Nothing is treated that does not need it.' },
  { n: 'C', t: 'Cataloguing', d: 'To ISAD(G), at fonds, series and file level. Item level only where a researcher has already asked twice.' },
  { n: 'D', t: 'Access', d: 'A reading room of eight places, four days a week. Anything catalogued can be ordered the same morning.' },
];

const NUMBERS = [
  ['4.2 km', 'Linear extent'],
  ['47', 'Fonds held'],
  ['1861', 'Earliest record'],
  ['8', 'Reading places'],
];

export default function FondsAubertPage() {
  return (
    <div className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..600&display=swap"
      />

      <header className={s.bar}>
        <a className={s.mark} href="#top">
          Fonds Aubert
          <i>Archives privées, Lausanne</i>
        </a>
        <nav aria-label="Sections">
          <a href="#holdings">Holdings</a>
          <a href="#services">Services</a>
          <a href="#reading">Reading room</a>
          <a href="#deposit">Deposit</a>
        </nav>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div className={s.heroField} aria-hidden="true">
            <TabbiedArtwork
              artwork={quire}
              palette={['transparent', PALE, GREY]}
              fit="grid"
              cellSize={124}
              redrawInterval={6800}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <p className={s.eyebrow}>Fondation privée / depuis 1974</p>
            <h1>
              Four point two
              <br />
              kilometres of paper
              <br />
              <span>somebody kept.</span>
            </h1>
            <p className={s.lede}>
              Business ledgers, family correspondence, a photographer&rsquo;s
              negatives, and the minutes of a cooperative that argued for
              seventy years.
            </p>
          </div>
        </section>

        <figure className={s.bleed}>
          <Figure
            slug="aubert-stacks"
            alt="Long rows of grey archive boxes on steel shelving receding into the distance"
            priority
          />
          <figcaption>Repository 2, aisle 14. 16 °C, 45 % RH, no daylight.</figcaption>
        </figure>

        <dl className={s.numbers}>
          {NUMBERS.map(([v, k]) => (
            <div key={k}>
              <dt>{v}</dt>
              <dd>{k}</dd>
            </div>
          ))}
        </dl>

        {/* -------------------------------------------------------- HOLDINGS */}
        <section id="holdings" className={s.holdings} aria-labelledby="holdings-h">
          <h2 className={s.h2} id="holdings-h">
            Selected fonds
          </h2>
          <p className={s.note}>
            Six of forty-seven. The full finding aid is in the reading room and,
            for anything catalogued, online as a plain list.
          </p>
          <ol className={s.table}>
            <li className={s.thead} aria-hidden="true">
              <span>Reference</span>
              <span>Fonds</span>
              <span>Dates</span>
              <span>Extent</span>
              <span>State</span>
            </li>
            {FONDS.map((f) => (
              <li key={f.ref}>
                <span className={s.ref}>{f.ref}</span>
                <span className={s.fname}>{f.name}</span>
                <span className={s.span}>{f.span}</span>
                <span className={s.extent}>{f.extent}</span>
                <span
                  className={
                    f.state === 'Catalogued'
                      ? s.done
                      : f.state === 'In progress'
                        ? s.wip
                        : s.todo
                  }
                >
                  {f.state}
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------ SHELF BAND */}
        <section className={s.shelfBand} aria-hidden="true">
          <div className={s.shelfField}>
            <TabbiedArtwork
              artwork={stitch}
              palette={['transparent', INK, OLIVE, GREY]}
              fit="grid"
              cellSize={104}
              redrawInterval={4600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* -------------------------------------------------------- SERVICES */}
        <section id="services" className={s.services} aria-labelledby="services-h">
          <div className={s.svcField} aria-hidden="true">
            <TabbiedArtwork
              artwork={subdivide}
              palette={['transparent', PALE, GREY]}
              fit="grid"
              cellSize={166}
              redrawInterval={5800}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.svcInner}>
            <h2 className={s.h2} id="services-h">
              What the foundation does
            </h2>
            <ol className={s.svcList}>
              {SERVICES.map((x) => (
                <li key={x.n}>
                  <span className={s.svcN}>{x.n}</span>
                  <div>
                    <h3>{x.t}</h3>
                    <p>{x.d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className={s.pair}>
              <figure>
                <Figure
                  slug="aubert-bench"
                  alt="A paper conservation bench with tools and a sheet under repair"
                />
                <figcaption>Conservation. Two days a week, one pair of hands.</figcaption>
              </figure>
              <figure>
                <Figure
                  slug="aubert-door"
                  alt="A heavy steel strongroom door standing ajar in a plain corridor"
                />
                <figcaption>Repository 1. Closed at 16.00, checked twice.</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- READING ROOM */}
        <section id="reading" className={s.reading} aria-labelledby="reading-h">
          <h2 className={s.h2} id="reading-h">
            Reading room
          </h2>
          <div className={s.readGrid}>
            <p className={s.big}>
              Eight places, Tuesday to Friday, 09.00 to 17.00. Pencils are
              provided because pens are not permitted, and we would rather give
              you one than have the conversation.
            </p>
            <ul className={s.rules}>
              <li>Order by 11.00 for the same afternoon</li>
              <li>Five boxes on the desk at a time</li>
              <li>Photography without flash, for private study</li>
              <li>Foam supports and weights on every desk</li>
              <li>No appointment needed for catalogued material</li>
            </ul>
          </div>
          <figure className={s.wide}>
            <Figure
              slug="aubert-reading"
              alt="An empty reading room desk with a single open document, foam supports and weights"
            />
            <figcaption>Desk 3. North light, which is the only kind we trust.</figcaption>
          </figure>
        </section>

        {/* --------------------------------------------------------- DEPOSIT */}
        <section id="deposit" className={s.deposit} aria-labelledby="deposit-h">
          <div className={s.depField} aria-hidden="true">
            <TabbiedArtwork
              artwork={dotfield}
              palette={['transparent', OLIVE, GREY]}
              fit="grid"
              cellSize={48}
              redrawInterval={4000}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.depInner}>
            <h2 className={s.h2} id="deposit-h">
              Depositing records
            </h2>
            <dl className={s.contact}>
              <div>
                <dt>Foundation</dt>
                <dd>
                  Chemin des Croix-Rouges 14
                  <br />
                  1007 Lausanne
                </dd>
              </div>
              <div>
                <dt>Write</dt>
                <dd>
                  <a href="mailto:depot@fonds-aubert.example">depot@fonds-aubert.example</a>
                </dd>
              </div>
              <div>
                <dt>Appraisal</dt>
                <dd>Free, on site, usually within a month of asking</dd>
              </div>
              <div>
                <dt>Terms</dt>
                <dd>Deposit or gift. Closure periods up to fifty years, agreed in writing.</dd>
              </div>
            </dl>
          </div>
        </section>
      </main>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p className={s.footName}>Fonds Aubert</p>
            <p className={s.footTag}>Archives privées, Chemin des Croix-Rouges 14, Lausanne, depuis 1974.</p>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Holdings</h2>
            <ul className={s.footLinks}>
              <li>
                <a href="#holdings">Selected fonds</a>
              </li>
              <li>
                <a href="#services">What we do</a>
              </li>
              <li>
                <a href="#reading">Reading room</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Depositing</h2>
            <ul className={s.footLinks}>
              <li>
                <a href="#deposit">Depositing records</a>
              </li>
              <li>
                <a href="#deposit">Appraisal</a>
              </li>
              <li>
                <a href="#deposit">Terms and closure</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Contact</h2>
            <p className={s.footAddr}>
              Chemin des Croix-Rouges 14
              <br />
              1007 Lausanne
              <br />
              depot@fonds-aubert.example
              <br />
              Tue to Fri, 09.00 to 17.00
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p>A fictional archive. Prices and times are invented.</p>
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
