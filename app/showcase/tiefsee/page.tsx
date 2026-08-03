import { TabbiedArtwork } from 'tabbied/react';
import {
  bowl, comet, dipole, dustfall, lantern, quoit, sandfield, sparkle,
} from 'tabbied/artworks';
import s from './tiefsee.module.css';

export const metadata = {
  title: 'Tiefsee: Deep-sea research programme',
  description:
    'A deep-ocean research programme with one ship and two vehicles. Five depth zones, forty years of station data, everything published within a year.',
};

/* Deep water, bone, one cyan. Every field takes `transparent` in the
   background slot, so the page's own water shows through the pattern — and
   the page gets darker the further down it you read. */
const BONE = '#e6eef0';
const CYAN = '#00d2e0';
const GREY = '#5d7480';
const DEEP = '#0a1f2b';

/* The spine of the page: five zones, each one a section with its own ground.
   The tint on each band is set from `shade`, so the page darkens as it is
   read, which is the only illustration the subject needs. */
const ZONES = [
  {
    id: 'sunlit',
    depth: '0 – 200',
    name: 'Sunlit',
    latin: 'Epipelagic',
    shade: 0,
    art: dipole,
    body:
      'Everything that photosynthesises, and almost everything anybody has ever photographed. We spend as little time here as the ship can manage, because it is already the best-described water on the planet.',
    facts: [['1 %', 'Of ocean volume'], ['96 %', 'Of published papers'], ['18', 'Stations held']],
  },
  {
    id: 'twilight',
    depth: '200 – 1 000',
    name: 'Twilight',
    latin: 'Mesopelagic',
    shade: 22,
    art: bowl,
    body:
      'The layer that moves. Every night the largest migration on Earth rises through it and every dawn it sinks again, and the carbon it carries down is the single biggest number nobody can pin within a factor of two.',
    facts: [['20 %', 'Of ocean volume'], ['×2', 'Uncertainty on carbon flux'], ['31', 'Stations held']],
  },
  {
    id: 'midnight',
    depth: '1 000 – 4 000',
    name: 'Midnight',
    latin: 'Bathypelagic',
    shade: 44,
    art: lantern,
    body:
      'No sunlight at all, and more light than you would expect: something like nine in ten animals down here make their own. Our two vehicles are painted matte black for exactly this reason.',
    facts: [['≈ 90 %', 'Of animals bioluminescent'], ['4 °C', 'Water temperature'], ['26', 'Stations held']],
  },
  {
    id: 'abyss',
    depth: '4 000 – 6 000',
    name: 'Abyss',
    latin: 'Abyssopelagic',
    shade: 66,
    art: sandfield,
    body:
      'Flat, cold and enormous: most of the sea floor on the planet is this, a plain of soft sediment that takes a thousand years to lay down a centimetre. Also where the nodule licences are.',
    facts: [['1 cm', 'Sediment per 1 000 years'], ['600 bar', 'At 6 000 m'], ['44', 'Stations held']],
  },
  {
    id: 'trench',
    depth: '6 000 – 11 000',
    name: 'Trench',
    latin: 'Hadopelagic',
    shade: 88,
    art: quoit,
    body:
      'Twenty-seven separate trenches, each one effectively an island: too deep for anything to cross between them. The last full-depth dive from this programme was in 2024 and it lasted eleven hours.',
    facts: [['27', 'Trench systems'], ['11 h', 'Longest dive'], ['9', 'Stations held']],
  },
];

const FLEET = [
  ['RV Meridian', 'Research vessel', '78 m, ice class 1B', '2009', '32 crew, 24 scientists'],
  ['Nautilus 6000', 'Remote vehicle', 'Rated 6 000 m', '2018', 'Fibre tether, 8 km'],
  ['Kelpie', 'Autonomous glider', 'Rated 1 000 m', '2021', '90-day endurance'],
  ['Vollmer II', 'Crewed submersible', 'Rated 11 000 m', '2023', 'Three seats'],
  ['Lander A – F', 'Free-fall landers', 'Rated 11 000 m', '2016 – 2024', 'Six units, ballast release'],
];

const CRUISES = [
  ['ME-114', '2026', 'Iberian Abyssal Plain', '31 days', 'Sediment cores, 44 stations'],
  ['ME-112', '2026', 'Charlie-Gibbs Fracture', '24 days', 'Midwater trawls and imaging'],
  ['ME-109', '2025', 'Puerto Rico Trench', '38 days', 'Full-depth, Vollmer II × 6'],
  ['ME-106', '2025', 'Rockall Trough', '19 days', 'Time-series, station R7'],
  ['ME-103', '2025', 'Azores, Menez Gwen', '22 days', 'Vent chemistry'],
  ['ME-098', '2024', 'Kermadec Trench', '46 days', 'Full-depth, 11 h dive'],
  ['ME-094', '2024', 'Bay of Biscay', '16 days', 'Glider recovery, Kelpie × 3'],
  ['ME-089', '2023', 'Mid-Atlantic Ridge, 45° N', '33 days', 'Vent fauna, first survey'],
  ['ME-085', '2023', 'Porcupine Abyssal Plain', '28 days', 'Time-series, 30th year'],
  ['ME-081', '2022', 'Greenland Basin', '25 days', 'Under-ice, autonomous only'],
];

const POLICY = [
  ['Publication', 'Every dataset is public within twelve months of the ship docking. No exceptions have been granted since 2011.'],
  ['Imagery', 'All video and stills are CC BY. Sixteen thousand hours of it, indexed by station.'],
  ['Berths', 'Four berths on every cruise are held for early-career scientists from outside the consortium.'],
  ['Mining', 'The programme surveys licence areas and publishes what it finds. It does not consult for licence holders.'],
];

const NUMBERS = [
  ['128', 'Stations held'],
  ['11 034', 'Metres, deepest dive'],
  ['16 000', 'Hours of seabed video, public'],
  ['12', 'Months, maximum embargo'],
];

export default function TiefseePage() {
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
        <a className={s.mark} href="#top">Tiefsee</a>
        <nav aria-label="Sections">
          <a href="#zones">Zones</a>
          <a href="#fleet">Fleet</a>
          <a href="#cruises">Cruises</a>
          <a href="#policy">Data</a>
        </nav>
        <span className={s.now}>Deep-sea programme</span>
      </header>

      <main id="top">
        {/* ------------------------------------------------------------ HERO */}
        <section className={s.hero}>
          <div className={s.heroField} aria-hidden="true">
            <TabbiedArtwork
              artwork={dipole}
              palette={['transparent', DEEP, GREY, CYAN]}
              fit="grid"
              cellSize={168}
              redrawInterval={6400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <p className={s.heroKicker}>Deep-sea research / one ship, two vehicles / since 1986</p>
          <h1 className={s.heroType}>
            <span>Eleven</span>
            <span>thousand</span>
            <span className={s.cyan}>metres down.</span>
          </h1>
          <div className={s.heroFoot}>
            <p>
              Five zones, a hundred and twenty-eight standing stations, and
              everything we find published inside a year of the ship docking.
            </p>
            <a className={s.cta} href="#zones">
              Go down
            </a>
          </div>
        </section>

        {/* ------------------------------------------------------------ ZONES
            The page is the water column. Each zone is a full-bleed band and
            each one is darker than the last, so scrolling is descending. */}
        <section id="zones" aria-label="The five zones">
          {ZONES.map((z, i) => (
            <article
              key={z.id}
              id={z.id}
              className={s.zone}
              style={{ background: `color-mix(in srgb, #000 ${z.shade}%, ${DEEP})` }}
            >
              <div className={s.zoneField} aria-hidden="true">
                <TabbiedArtwork
                  artwork={z.art}
                  palette={['transparent', CYAN, GREY, BONE]}
                  fit="grid"
                  cellSize={128 - i * 8}
                  redrawInterval={5200 + i * 340}
                  style={{ position: 'absolute', inset: 0 }}
                />
              </div>
              <div className={s.zoneInner}>
                <p className={s.zDepth}>
                  {z.depth}
                  <span>m</span>
                </p>
                <div className={s.zBody}>
                  <h2>{z.name}</h2>
                  <p className={s.zLatin}>{z.latin}</p>
                  <p className={s.zText}>{z.body}</p>
                  <dl className={s.zFacts}>
                    {z.facts.map(([v, k]) => (
                      <div key={k}>
                        <dt>{v}</dt>
                        <dd>{k}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* ------------------------------------------------------- STATEMENT */}
        <section className={s.statement}>
          <p className={s.big}>
            Below a thousand metres there is no seasonality, no daylight and
            almost no data. Four fifths of the living space on this planet is
            down there and we have looked at a fraction of one per cent of it
            with our own eyes.
          </p>
          <div className={s.statementMeta}>
            <p>
              Tiefsee is a consortium programme: one ship, two crewed and
              uncrewed vehicles, six landers, and a hundred and twenty-eight
              stations that have been reoccupied on the same coordinates since
              1986.
            </p>
            <p>
              The oldest of those time-series is now forty years long, which is
              the only reason anybody can say anything at all about whether the
              abyssal plain is changing.
            </p>
          </div>
        </section>

        {/* --------------------------------------------------------- NUMBERS */}
        <section className={s.numbers} aria-label="The programme in numbers">
          {NUMBERS.map(([v, k]) => (
            <div key={k}>
              <p className={s.nVal}>{v}</p>
              <p className={s.nKey}>{k}</p>
            </div>
          ))}
        </section>

        {/* ----------------------------------------------------------- FLEET */}
        <section id="fleet" className={s.listing} aria-labelledby="fleet-h">
          <div className={s.secHead}>
            <h2 id="fleet-h">What goes down</h2>
            <p>One ship, five kinds of vehicle. The landers are the cheapest and have done the most work.</p>
          </div>
          <ol className={s.table}>
            {FLEET.map((r) => (
              <li key={r[0]}>
                <span className={s.tKey}>{r[1]}</span>
                <span className={s.tMain}>{r[0]}</span>
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
            <TabbiedArtwork
              artwork={comet}
              palette={['transparent', CYAN, GREY, BONE]}
              fit="grid"
              cellSize={126}
              redrawInterval={4600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <blockquote>
            <p>We have better maps of Mars. Mars does not have four kilometres of water on top of it.</p>
            <cite>Dr Salla Vainio, chief scientist</cite>
          </blockquote>
        </section>

        {/* --------------------------------------------------------- CRUISES */}
        <section id="cruises" className={s.listing} aria-labelledby="cr-h">
          <div className={s.secHead}>
            <h2 id="cr-h">Recent cruises</h2>
            <p>Every one of these has its full dataset online. The number is the cruise, not the year.</p>
          </div>
          <ol className={s.table}>
            {CRUISES.map((r) => (
              <li key={r[0]}>
                <span className={s.tKey}>{r[0]}</span>
                <span className={s.tMain}>{r[2]}</span>
                <span className={s.tMid}>{r[1]}</span>
                <span className={s.tMid}>{r[3]}</span>
                <span className={s.tEnd}>{r[4]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------------------------------------------------------- POLICY */}
        <section id="policy" className={s.policy} aria-labelledby="policy-h">
          <div className={s.policyField} aria-hidden="true">
            <TabbiedArtwork
              artwork={dustfall}
              palette={['transparent', GREY, CYAN]}
              fit="grid"
              cellSize={104}
              redrawInterval={6400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.policyInner}>
            <h2 id="policy-h">What we do with it</h2>
            <dl className={s.policyList}>
              {POLICY.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* --------------------------------------------------------- CONTACT */}
        <section className={s.contact}>
          <p className={s.contactPre}>Berths, data, collaboration</p>
          <a className={s.contactMail} href="mailto:station@tiefsee.example">
            station@tiefsee.example
          </a>
          <p className={s.contactFine}>
            The ship is at sea about two hundred days a year and the shore
            office answers within a week, faster if the request is for data
            that should already be public.
          </p>
        </section>
      </main>

      <div className={s.coda} aria-hidden="true">
        <TabbiedArtwork
          artwork={sparkle}
          palette={['transparent', CYAN, BONE, GREY]}
          fit="grid"
          cellSize={110}
          redrawInterval={5000}
          style={{ position: 'absolute', inset: 0 }}
        />
      </div>

      <footer className={s.footer}>
        <p className={s.footMark}>11 034</p>
        <div className={s.footGrid}>
          <div>
            <h2>Science</h2>
            <ul>
              <li><a href="#zones">The five zones</a></li>
              <li><a href="#cruises">Cruises</a></li>
              <li><a href="#policy">Data policy</a></li>
            </ul>
          </div>
          <div>
            <h2>Programme</h2>
            <ul>
              <li><a href="#fleet">The fleet</a></li>
              <li><a href="#policy">Berths</a></li>
              <li><a href="#policy">Imagery</a></li>
            </ul>
          </div>
          <div>
            <h2>Ashore</h2>
            <p>
              Kaianlage 3
              <br />
              At sea 200 days a year
              <br />
              station@tiefsee.example
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p>A fictional research programme. Ships, cruises and figures are invented.</p>
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
