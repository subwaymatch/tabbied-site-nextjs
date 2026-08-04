import { TabbiedArtwork } from 'tabbied/react';
import {
  annulus, beamspread, dotdrift, rimband, ringfield, shading, softedge, spray,
} from 'tabbied/artworks';
import s from './isobar.module.css';

export const metadata = {
  title: 'Isobar: Meteorological service, Bergen',
  description:
    'Isobar runs the west-coast forecast: 62 stations, a warning service that says how sure it is, and a hundred and forty years of daily observations.',
};

/* Cool paper, ink, one violet. Every field takes `transparent` in the
   background slot so the weather chart runs through the page itself. */
const INK = '#0d1418';
const VIOLET = '#6b2be0';
const GREY = '#7c8792';
const PALE = '#d3dae1';

const DAYS = [
  { d: 'Today', t: '11', lo: '6', w: 'Rain, heavy at times', p: '1002', c: 90 },
  { d: 'Tue', t: '9', lo: '5', w: 'Squally showers', p: '996', c: 85 },
  { d: 'Wed', t: '8', lo: '3', w: 'Bright, cold, dry', p: '1008', c: 70 },
  { d: 'Thu', t: '10', lo: '4', w: 'Cloud thickening', p: '1004', c: 60 },
  { d: 'Fri', t: '12', lo: '7', w: 'Rain arriving west', p: '994', c: 55 },
  { d: 'Sat', t: '13', lo: '8', w: 'Wet and windy', p: '988', c: 45 },
  { d: 'Sun', t: '11', lo: '7', w: 'Showers, easing', p: '997', c: 35 },
];

/* Mean temperature by month, °C, 1991–2020 normal for the city station. The
   strip below is drawn from these numbers and nothing else. */
const NORMALS = [
  ['Jan', 1.9], ['Feb', 1.8], ['Mar', 3.7], ['Apr', 6.2],
  ['May', 10.4], ['Jun', 13.2], ['Jul', 15.1], ['Aug', 14.8],
  ['Sep', 12.0], ['Oct', 8.9], ['Nov', 5.1], ['Dec', 2.6],
];

const METHOD = [
  {
    art: ringfield,
    n: '01',
    t: 'Observe first',
    d: 'Sixty-two automatic stations reporting every ten minutes, plus eleven where a person still walks out at 06:00 and reads a thermometer, because the model needs something it did not invent.',
  },
  {
    art: spray,
    n: '02',
    t: 'Run it fifty times',
    d: 'The forecast is an ensemble: the same model from fifty slightly different starting points. What we publish is where those fifty agree and, more usefully, where they do not.',
  },
  {
    art: beamspread,
    n: '03',
    t: 'Say how sure',
    d: 'Every forecast carries a confidence. A confident wrong forecast costs more than an uncertain one, and pretending to certainty is the failure this service was reorganised to stop in 1994.',
  },
];

const WARNINGS = [
  ['Yellow', 'Wind', 'Coast, Sogn to Stad', 'Fri 18:00 – Sat 09:00', '70 %'],
  ['Orange', 'Rain', 'Inner Hordaland', 'Fri 22:00 – Sun 06:00', '55 %'],
  ['Yellow', 'Rain', 'Bergen and environs', 'Sat 03:00 – Sat 21:00', '80 %'],
  ['Yellow', 'Waves', 'Outer coast', 'Sat 00:00 – Sat 18:00', '65 %'],
  ['Green', 'Snow', 'Above 900 m', 'Sun 12:00 – Mon 06:00', '30 %'],
];

const STATIONS = [
  ['SN50540', 'Bergen – Florida', '12 m', '1904–', 'Manned 06:00'],
  ['SN50500', 'Bergen – Sandsli', '48 m', '1979–', 'Automatic'],
  ['SN51530', 'Voss – Bø', '125 m', '1891–', 'Manned 06:00'],
  ['SN52535', 'Modalen', '114 m', '1955–', 'Automatic'],
  ['SN53101', 'Vangsnes', '49 m', '1876–', 'Manned 06:00'],
  ['SN54110', 'Fedje', '39 m', '1949–', 'Automatic'],
  ['SN55290', 'Kvamskogen', '455 m', '1968–', 'Automatic'],
  ['SN56420', 'Ullensvang', '12 m', '1867–', 'Manned 06:00'],
  ['SN57420', 'Slåtterøy fyr', '32 m', '1922–', 'Automatic'],
  ['SN58900', 'Sauda', '18 m', '1895–', 'Automatic'],
  ['SN59800', 'Stad – Kråkenes', '40 m', '1997–', 'Automatic'],
  ['SN60990', 'Takle', '38 m', '1969–', 'Automatic'],
  ['SN61770', 'Sognefjell', '1 413 m', '1978–', 'Automatic'],
  ['SN62480', 'Bulken', '324 m', '1895–', 'Manned 06:00'],
];

const RECORDS = [
  ['33.4 °C', 'Highest, Ullensvang, 1947'],
  ['−26.1 °C', 'Lowest, Sognefjell, 1987'],
  ['229 mm', 'Wettest day, Modalen, 2005'],
  ['62.4 m/s', 'Strongest gust, Kråkenes, 1992'],
];

const SERVICE = [
  ['Free', 'Every observation and every forecast, as an API and as a file.'],
  ['Marine', 'A separate coastal product, issued four times a day, in Norwegian and English.'],
  ['Aviation', 'TAF and METAR for six aerodromes, on the international schedule.'],
  ['Archive', 'Daily observations back to 1867, digitised from the ledgers by hand.'],
];

/* x and y are percentages of the locator box, not coordinates —
   the schematic is a diagram of relative position, nothing more. */
const OFFICES = [
  { city: 'Bergen', role: 'Forecast desk, staffed always', addr: 'Allégaten 70, 5007', fix: '60.39 N  5.32 E', x: 22, y: 68, head: true },
  { city: 'Ålesund', role: 'Coastal radar', addr: 'Nedre Strandgate 8, 6002', fix: '62.47 N  6.15 E', x: 38, y: 48 },
  { city: 'Tromsø', role: 'Northern synoptic', addr: 'Kirkegata 2, 9008', fix: '69.65 N  18.96 E', x: 66, y: 18 },
  { city: 'Bjørnøya', role: 'Automatic, visited twice a year', addr: 'Herwighamna', fix: '74.50 N  19.00 E', x: 52, y: 8 },
];

/* When, what, and where — the footer dateline. */
const NEXT_UP: [string, string, string][] = [
  ['04:00', 'Coastal waters, twelve hours ahead', 'Daily'],
  ['11:00', 'Offshore and open sea, thirty-six hours', 'Daily'],
  ['16:00', 'Warnings, only when there are any', 'As required'],
];

export default function IsobarPage() {
  const lo = Math.min(...NORMALS.map(([, v]) => Number(v)));
  const hi = Math.max(...NORMALS.map(([, v]) => Number(v)));

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
        <a className={s.mark} href="#top">Isobar</a>
        <nav aria-label="Sections">
          <a href="#forecast">Forecast</a>
          <a href="#warnings">Warnings</a>
          <a href="#stations">Stations</a>
          <a href="#climate">Climate</a>
        </nav>
        <span className={s.now}>Meteorologisk / Bergen</span>
      </header>

      <main id="top">
        {/* ------------------------------------------------------------ HERO */}
        <section className={s.hero}>
          <div className={s.heroField} aria-hidden="true">
            <TabbiedArtwork
              artwork={annulus}
              palette={['transparent', PALE, GREY, VIOLET]}
              fit="grid"
              cellSize={172}
              redrawInterval={6200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <p className={s.heroKicker}>Meteorological service / the west coast / since 1867</p>
          <h1 className={s.heroType}>
            <span>988</span>
            <span className={s.violet}>hPa</span>
          </h1>
          <div className={s.heroFoot}>
            <p>
              Falling. A deep low crossing on Saturday, sixty-two stations
              watching it, and a forecast that will tell you how sure it is.
            </p>
            <a className={s.cta} href="#forecast">
              Seven days
            </a>
          </div>
        </section>

        {/* -------------------------------------------------------- FORECAST
            Seven full-height columns across the whole viewport. The
            confidence is drawn as the height of a violet foot, so the row
            can be read as a chart before it is read as a table. */}
        <section id="forecast" className={s.week} aria-label="Seven day forecast">
          {DAYS.map((d) => (
            <div key={d.d} className={s.day}>
              <p className={s.dName}>{d.d}</p>
              <p className={s.dTemp}>
                {d.t}
                <span>°</span>
              </p>
              <p className={s.dLo}>{d.lo}° overnight</p>
              <p className={s.dW}>{d.w}</p>
              <p className={s.dP}>{d.p} hPa</p>
              <div className={s.dConf} aria-hidden="true">
                <div style={{ height: `${d.c}%` }} />
              </div>
              <p className={s.dConfN}>{d.c} % confidence</p>
            </div>
          ))}
        </section>

        {/* ------------------------------------------------------- STATEMENT */}
        <section className={s.statement}>
          <p className={s.big}>
            The useful part of a forecast is not the number. It is how far the
            fifty runs of the model disagreed with each other, and we have
            published that on the front page since 1994.
          </p>
          <div className={s.statementMeta}>
            <p>
              Isobar is the regional meteorological service for the western
              seaboard. It keeps sixty-two stations, eleven of them still read
              by hand at six in the morning, and an archive going back to 1867.
            </p>
            <p>
              Everything the service produces is free to use, including the
              observations, the model output and the mistakes, which are
              catalogued in the same archive as everything else.
            </p>
          </div>
        </section>

        {/* ---------------------------------------------------------- METHOD */}
        <section id="method" className={s.method} aria-labelledby="method-h">
          <div className={s.secHead}>
            <h2 id="method-h">How a forecast is made</h2>
            <p>Three steps, and the third is the one that took a reorganisation to get right.</p>
          </div>
          <div className={s.mGrid}>
            {METHOD.map((m) => (
              <article key={m.n}>
                <div className={s.mPlate} aria-hidden="true">
                  <TabbiedArtwork
                    artwork={m.art}
                    palette={['transparent', GREY, VIOLET]}
                    fit="grid"
                    cellSize={68}
                    redrawInterval={5600}
                    style={{ position: 'absolute', inset: 0 }}
                  />
                </div>
                <p className={s.mN}>{m.n}</p>
                <h3>{m.t}</h3>
                <p className={s.mBody}>{m.d}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------ BAND */}
        <div className={s.band} aria-hidden="true">
          <TabbiedArtwork
            artwork={rimband}
            palette={['transparent', VIOLET, PALE, GREY]}
            fit="grid"
            cellSize={124}
            redrawInterval={4200}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>

        {/* -------------------------------------------------------- WARNINGS */}
        <section id="warnings" className={s.listing} aria-labelledby="warn-h">
          <div className={s.secHead}>
            <h2 id="warn-h">In force this week</h2>
            <p>Colour is severity. The percentage is how likely the event is, not how bad it will be.</p>
          </div>
          <ol className={s.table}>
            {WARNINGS.map((r, i) => (
              <li key={i}>
                <span className={s.tLevel} data-level={r[0].toLowerCase()}>{r[0]}</span>
                <span className={s.tMain}>{r[1]}</span>
                <span className={s.tMid}>{r[2]}</span>
                <span className={s.tMid}>{r[3]}</span>
                <span className={s.tEnd}>{r[4]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* --------------------------------------------------------- CLIMATE
            Twelve blocks, tinted by the number they carry. A chart with no
            axis, which is all a normal needs. */}
        <section id="climate" className={s.climate} aria-labelledby="climate-h">
          <div className={s.secHead}>
            <h2 id="climate-h">The 1991–2020 normal</h2>
            <p>Mean temperature by month at the city station, in degrees. The tint is the number.</p>
          </div>
          <div className={s.strip}>
            {NORMALS.map(([m, v]) => {
              const k = (Number(v) - lo) / (hi - lo);
              // Mixed against the pale, not against transparent: an opaque
              // swatch is the only way the label's contrast is predictable.
              const dark = k > 0.5;
              return (
                <div
                  key={String(m)}
                  className={s.stripCell}
                  style={{ background: `color-mix(in srgb, ${VIOLET} ${10 + k * 82}%, ${PALE})` }}
                >
                  <span className={s.stripV} style={{ color: dark ? '#fff' : INK }}>
                    {Number(v).toFixed(1)}
                  </span>
                  <span
                    className={s.stripK}
                    style={{ color: dark ? 'rgb(255 255 255 / 0.78)' : 'rgb(13 20 24 / 0.55)' }}
                  >
                    {m}
                  </span>
                </div>
              );
            })}
          </div>
          <dl className={s.records}>
            {RECORDS.map(([v, k]) => (
              <div key={k}>
                <dt>{v}</dt>
                <dd>{k}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ------------------------------------------------------- QUOTE BAND */}
        <section className={s.quote}>
          <div className={s.quoteField} aria-hidden="true">
            <TabbiedArtwork
              artwork={softedge}
              palette={['transparent', VIOLET, GREY]}
              fit="grid"
              cellSize={120}
              redrawInterval={4800}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <blockquote>
            <p>A forecast that is right and was lucky is worth less than one that was wrong and said so.</p>
            <cite>Ingrid Hovden, chief forecaster</cite>
          </blockquote>
        </section>

        {/* -------------------------------------------------------- STATIONS */}
        <section id="stations" className={s.listing} aria-labelledby="st-h">
          <div className={s.secHead}>
            <h2 id="st-h">Sixty-two stations</h2>
            <p>Fourteen of the long-running ones. Every reading any of them has ever made is downloadable.</p>
          </div>
          <ol className={s.table}>
            {STATIONS.map((r) => (
              <li key={r[0]}>
                <span className={s.tId}>{r[0]}</span>
                <span className={s.tMain}>{r[1]}</span>
                <span className={s.tMid}>{r[2]}</span>
                <span className={s.tMid}>{r[3]}</span>
                <span className={s.tEnd}>{r[4]}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* --------------------------------------------------------- SERVICE */}
        <section id="service" className={s.service} aria-labelledby="service-h">
          <div className={s.serviceField} aria-hidden="true">
            <TabbiedArtwork
              artwork={dotdrift}
              palette={['transparent', GREY, PALE]}
              fit="grid"
              cellSize={104}
              redrawInterval={6400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.serviceInner}>
            <h2 id="service-h">What we publish</h2>
            <dl className={s.serviceList}>
              {SERVICE.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* --------------------------------------------------------- CONTACT */}
        <section id="contact" className={s.contact} aria-labelledby="contact-h">
          <p className={s.contactPre}>Observations, data, corrections</p>
          <h2 id="contact-h" className={s.officesHead}>Four stations on the watch</h2>
          <div className={s.officeCols}>
            <ul className={s.offices}>
              {OFFICES.map((o) => (
                <li key={o.city}>
                  <p className={s.oCity}>{o.city}</p>
                  <p className={s.oRole}>{o.role}</p>
                  <p className={s.oAddr}>{o.addr}</p>
                  <p className={s.oFix}>{o.fix}</p>
                </li>
              ))}
            </ul>
            <div className={s.locator} aria-hidden="true">
              <div className={s.locatorField}>
                <TabbiedArtwork
                  artwork={ringfield}
                  palette={['transparent', GREY, VIOLET]}
                  fit="grid"
                  cellSize={128}
                  redrawInterval={6200}
                  style={{ position: 'absolute', inset: 0 }}
                />
              </div>
              {OFFICES.map((o) => (
                <span
                  key={o.city}
                  className={o.head ? `${s.pin} ${s.pinHead}` : s.pin}
                  style={{ left: `${o.x}%`, top: `${o.y}%` }}
                >
                  <span className={s.pinDot} />
                  <span>{o.city}</span>
                </span>
              ))}
            </div>
          </div>
          <p className={s.contactFine}>
            The forecast desk is staffed at all hours; everybody else answers
            between eight and four, and the archive answers when it can.
          </p>
        </section>
      </main>

      <div className={s.coda} aria-hidden="true">
        <TabbiedArtwork
          artwork={shading}
          palette={['transparent', VIOLET, PALE, GREY]}
          fit="grid"
          cellSize={110}
          redrawInterval={5000}
          style={{ position: 'absolute', inset: 0 }}
        />
      </div>

      <footer className={s.footer}>
        <ol className={s.footNext} aria-label="Issue times">
          {NEXT_UP.map(([when, what, tag]) => (
            <li key={when}>
              <span className={s.fnWhen}>{when}</span>
              <span className={s.fnWhat}>{what}</span>
              <span className={s.fnTag}>{tag}</span>
            </li>
          ))}
        </ol>
        <div className={s.footGrid}>
          <div>
            <h2>Forecast</h2>
            <ul>
              <li><a href="#forecast">Seven days</a></li>
              <li><a href="#warnings">Warnings</a></li>
              <li><a href="#climate">Normals</a></li>
            </ul>
          </div>
          <div>
            <h2>Network</h2>
            <ul>
              <li><a href="#stations">Stations</a></li>
              <li><a href="#service">Data and API</a></li>
              <li><a href="#method">Method</a></li>
            </ul>
          </div>
          <div>
            <h2>Here</h2>
            <p>
              Allégaten 70
              <br />
              5007 Bergen
              <br />
              varsel@isobar.example
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p>A fictional weather service. Every observation on this page is invented.</p>
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
