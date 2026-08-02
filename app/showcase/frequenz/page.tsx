import { TabbiedArtwork } from 'tabbied/react';
import {
  flux, ribline, streaking, dotwash, rungs,
  spraydown,
} from 'tabbied/artworks';
import { Figure } from 'components/Figure';
import s from './frequenz.module.css';

export const metadata = {
  title: 'Frequenz 94,6: Freies Radio, Graz',
  description:
    'Frequenz 94,6 broadcasts from Graz, twenty-four hours a day, on air since 1979. Ninety-one programmes, all of them made by people who are not paid to.',
};

/* Dark ground, cream type, one amber that stands for the on-air lamp. All
   pattern fields take `transparent` in the background slot. */
const CREAM = '#F2EFE6';
const AMBER = '#FFA200';
const GREY = '#6B6560';
const PANEL = '#1D1A20';
/* The two inks the decorative tiles draw with: always the quiet pair, so a
   tile reads as a sample rather than as another headline. */
const TILE_A = GREY;
const TILE_B = PANEL;


const NOW = { time: '14.00', show: 'Zwischenspiel', host: 'Ruth Padberg', kind: 'New music, no talking over the intro' };

const SCHEDULE = [
  ['06.00', 'Frühwerk', 'Miron Salzer', 'Chamber music and weather'],
  ['09.00', 'Der lange Satz', 'Ivo Brand', 'One piece, in full, uninterrupted'],
  ['12.00', 'Mittagsband', 'Rotating', 'Listener requests, read out badly'],
  ['14.00', 'Zwischenspiel', 'Ruth Padberg', 'New music, no talking over the intro'],
  ['17.00', 'Feierabend', 'Nadia Kovač', 'Whatever got us through the week'],
  ['20.00', 'Nachtstück', 'Emil Weiler', 'Long-form, low volume, four hours'],
  ['00.00', 'Bandmaschine', 'Unattended', 'The archive plays itself until six'],
];

const STRANDS = [
  { n: '01', t: 'Live music, weekly', d: 'A band in the small studio every Thursday since 1984. Two takes, one microphone pair, whatever happens happens.' },
  { n: '02', t: 'The archive', d: 'Eleven thousand hours on tape, digitised at four hours a week by two volunteers who refuse to be thanked in public.' },
  { n: '03', t: 'Open desk', d: 'Anyone can propose a programme. About one in five gets a slot, and the first one is always at three in the morning.' },
  { n: '04', t: 'No advertising', d: 'Funded by 2,140 members at €5 a month. If that number drops below 1,800 we go back to twelve hours a day and say so.' },
];

const NUMBERS = [
  ['94,6', 'MHz, Graz and Umgebung'],
  ['1979', 'On air since'],
  ['91', 'Programmes'],
  ['2 140', 'Members'],
];

export default function FrequenzPage() {
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
          Frequenz <span>94,6</span>
        </a>
        <nav aria-label="Sections">
          <a href="#schedule">Programm</a>
          <a href="#strands">What we do</a>
          <a href="#support">Support</a>
          <a href="#studio">Studio</a>
        </nav>
        <p className={s.onair}>
          <span aria-hidden="true" />
          On air
        </p>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div className={s.heroField} aria-hidden="true">
            <TabbiedArtwork
              artwork={flux}
              palette={['transparent', AMBER, GREY]}
              fit="grid"
              cellSize={136}
              redrawInterval={2600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <p className={s.eyebrow}>Freies Radio Graz / seit 1979</p>
            <h1>
              Twenty-four hours
              <br />
              a day, and nobody
              <br />
              <span>here is paid.</span>
            </h1>
            <div className={s.nowBox}>
              <p className={s.nowLabel}>On air now</p>
              <p className={s.nowShow}>
                <b>{NOW.time}</b> {NOW.show}
              </p>
              <p className={s.nowMeta}>
                {NOW.host} · {NOW.kind}
              </p>
            </div>
          </div>
        </section>

        <figure className={s.bleed}>
          <Figure
            slug="frequenz-studio"
            alt="A radio broadcast studio at night with a microphone on a boom and an amber on-air lamp"
            priority
          />
          <figcaption>Studio 1, 23.48. Nachtstück, hour three.</figcaption>
        </figure>

        <dl className={s.numbers}>
          {NUMBERS.map(([v, k]) => (
            <div key={k}>
              <dt>{v}</dt>
              <dd>{k}</dd>
            </div>
          ))}
        </dl>

        {/* ------------------------------------------------------ SCHEDULE */}
        <section id="schedule" className={s.schedule} aria-labelledby="schedule-h">
          <h2 className={s.h2} id="schedule-h">
            Today
          </h2>
          <ol className={s.grid}>
            {SCHEDULE.map(([t, show, host, note]) => (
              <li key={t} className={show === NOW.show ? s.live : undefined}>
                <span className={s.gTime}>{t}</span>
                <span className={s.gShow}>{show}</span>
                <span className={s.gHost}>{host}</span>
                <span className={s.gNote}>{note}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------------------------------------------------- CARRIER BAND */}
        <section className={s.carrier} aria-hidden="true">
          <div className={s.carrierField}>
            <TabbiedArtwork
              artwork={ribline}
              palette={['transparent', AMBER, CREAM, GREY]}
              fit="grid"
              cellSize={104}
              redrawInterval={2200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* ------------------------------------------------------- STRANDS */}
        <section id="strands" className={s.strands} aria-labelledby="strands-h">
          <div className={s.strandsField} aria-hidden="true">
            <TabbiedArtwork
              artwork={streaking}
              palette={['transparent', GREY, AMBER]}
              fit="grid"
              cellSize={116}
              redrawInterval={5200}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.strandsInner}>
            <h2 className={s.h2} id="strands-h">
              Four things we insist on
            </h2>
            <ol className={s.strandList}>
              {STRANDS.map((x) => (
                <li key={x.n}>
                  <span className={s.stN}>{x.n}</span>
                  <h3>{x.t}</h3>
                  <p>{x.d}</p>
                </li>
              ))}
            </ol>
            <div className={s.pair}>
              <figure>
                <Figure
                  slug="frequenz-archive"
                  alt="Shelves of tape reels and record sleeves in a station archive lit by one lamp"
                />
                <figcaption>The archive. Eleven thousand hours, four a week.</figcaption>
              </figure>
              <figure>
                <Figure
                  slug="frequenz-desk"
                  alt="A close view of a broadcast mixing desk with faders and amber meter lamps"
                />
                <figcaption>Desk 2. Channel 7 has been crackling since 2011.</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- SUPPORT */}
        <section id="support" className={s.support} aria-labelledby="support-h">
          <h2 className={s.h2} id="support-h">
            Membership
          </h2>
          <div className={s.supGrid}>
            <p className={s.big}>
              Five euro a month keeps the transmitter on, the licence paid and
              the coffee tin full. There is no other tier and no premium feed.
            </p>
            <div className={s.supCol}>
              <p>
                Members get nothing extra, on purpose. The point of a free radio
                station is that the person who pays and the person who does not
                hear exactly the same thing.
              </p>
              <p>
                Our accounts are posted every January on the noticeboard by the
                door and, since 2016, on this website as a scan of the
                noticeboard.
              </p>
            </div>
          </div>
          <figure className={s.tall}>
            <Figure
              slug="frequenz-mast"
              alt="A lattice transmitter mast against a deep dusk sky with a single warning light"
            />
            <figcaption>Schöckl, 1,445 m. 300 W ERP, which is plenty.</figcaption>
          </figure>
        </section>

        {/* -------------------------------------------------------- STUDIO */}
        <section id="studio" className={s.studio} aria-labelledby="studio-h">
          <div className={s.studioField} aria-hidden="true">
            <TabbiedArtwork
              artwork={dotwash}
              palette={['transparent', AMBER, GREY]}
              fit="grid"
              cellSize={44}
              redrawInterval={3800}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.studioInner}>
            <h2 className={s.h2} id="studio-h">
              Come in
            </h2>
            <dl className={s.contact}>
              <div>
                <dt>Studio</dt>
                <dd>
                  Lendkai 94, Hof
                  <br />
                  8020 Graz
                </dd>
              </div>
              <div>
                <dt>Write</dt>
                <dd>
                  <a href="mailto:studio@frequenz946.example">studio@frequenz946.example</a>
                </dd>
              </div>
              <div>
                <dt>Studio line</dt>
                <dd>+43 316 000 000, open during live shows</dd>
              </div>
              <div>
                <dt>Open desk</dt>
                <dd>First Monday of the month, 19.00. Bring an idea.</dd>
              </div>
            </dl>
          </div>
        </section>
        {/* ---------------------------------------------------------- TILES */}
        <section id="tiles" className={s.tiles} aria-labelledby="tiles-h">
          <h2 id="tiles-h">Three rules of the desk</h2>
          <p className={s.secNote}>Pinned above the fader panel since 1984 and never once revised.</p>
          <div className={s.tileGrid}>
              <article key="01">
                <div className={s.tilePlate} aria-hidden="true">
                  <TabbiedArtwork
                    artwork={spraydown}
                    palette={['transparent', TILE_A, TILE_B]}
                    fit="grid"
                    cellSize={78}
                    redrawInterval={5400}
                    style={{ position: 'absolute', inset: 0 }}
                  />
                </div>
                <p className={s.tileN}>01</p>
                <h3>Do not talk over the intro</h3>
                <p className={s.tileBody}>If the piece has a beginning, let it begin. The listener came for the music and can read the time on their own phone.</p>
              </article>
              <article key="02">
                <div className={s.tilePlate} aria-hidden="true">
                  <TabbiedArtwork
                    artwork={dotwash}
                    palette={['transparent', TILE_A, TILE_B]}
                    fit="grid"
                    cellSize={64}
                    redrawInterval={6200}
                    style={{ position: 'absolute', inset: 0 }}
                  />
                </div>
                <p className={s.tileN}>02</p>
                <h3>Silence is allowed</h3>
                <p className={s.tileBody}>Four seconds of nothing is not dead air. It is four seconds. The transmitter is fine and so is everybody listening.</p>
              </article>
              <article key="03">
                <div className={s.tilePlate} aria-hidden="true">
                  <TabbiedArtwork
                    artwork={ribline}
                    palette={['transparent', TILE_A, TILE_B]}
                    fit="grid"
                    cellSize={92}
                    redrawInterval={4800}
                    style={{ position: 'absolute', inset: 0 }}
                  />
                </div>
                <p className={s.tileN}>03</p>
                <h3>Say what it was</h3>
                <p className={s.tileBody}>Every track, back-announced, with the label. Somebody is always trying to find it again and we are the only record.</p>
              </article>
          </div>
        </section>

        {/* ---------------------------------------------------------- INDEX */}
        <section id="index" className={s.idx} aria-labelledby="idx-h">
          <h2 id="idx-h">Technical</h2>
          <p className={s.secNote}>What the station runs on. Most of it is older than most of the presenters.</p>
          <ol className={s.idxList}>
            <li className={s.idxHead} aria-hidden="true">
                <span>Item</span>
                <span>Detail</span>
                <span>Since</span>
                <span>State</span>
            </li>
              <li key="Transmitter, Schöckl">
                <span>Transmitter, Schöckl</span>
                <span>300 W ERP, 94.6 MHz</span>
                <span>1979</span>
                <span>Rebuilt 2011</span>
              </li>
              <li key="Studio desk 1">
                <span>Studio desk 1</span>
                <span>Analogue, 24 channel</span>
                <span>1998</span>
                <span>Channel 7 crackles</span>
              </li>
              <li key="Studio desk 2">
                <span>Studio desk 2</span>
                <span>Analogue, 16 channel</span>
                <span>1991</span>
                <span>Spare, and fine</span>
              </li>
              <li key="Playout">
                <span>Playout</span>
                <span>Own software, on Linux</span>
                <span>2007</span>
                <span>Nobody understands it</span>
              </li>
              <li key="Archive, tape">
                <span>Archive, tape</span>
                <span>11 000 hours</span>
                <span>1979</span>
                <span>Digitising, slowly</span>
              </li>
              <li key="Stream">
                <span>Stream</span>
                <span>Ogg and AAC, self hosted</span>
                <span>2004</span>
                <span>Same audio as air</span>
              </li>
          </ol>
        </section>

        {/* ------------------------------------------------------------ FAQ */}
        <section id="faq" className={s.faq} aria-labelledby="faq-h">
          <h2 id="faq-h">Getting involved</h2>
          <dl className={s.faqList}>
              <div key="How do I propose a progr">
                <dt>How do I propose a programme?</dt>
                <dd>Come to the open desk on the first Monday of the month with an idea and, ideally, twenty minutes of something you have already made.</dd>
              </div>
              <div key="Will I be paid?">
                <dt>Will I be paid?</dt>
                <dd>No. Nobody here is, including the people who have been doing it since the eighties. The membership pays the transmitter and the licence.</dd>
              </div>
              <div key="Do I need experience?">
                <dt>Do I need experience?</dt>
                <dd>No. You will be shown the desk twice, then left alone with it at three in the morning, which is how everybody learned.</dd>
              </div>
              <div key="Can I play whatever I wa">
                <dt>Can I play whatever I want?</dt>
                <dd>Within the licence, yes. Nobody vets a running order and nobody ever has.</dd>
              </div>
          </dl>
        </section>

      </main>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p className={s.footName}>Frequenz 94,6</p>
            <p className={s.footTag}>Freies Radio Graz, Lendkai 94, on air since 1979.</p>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>On air</h2>
            <ul className={s.footLinks}>
              <li>
                <a href="#schedule">Today</a>
              </li>
              <li>
                <a href="#strands">What we do</a>
              </li>
              <li>
                <a href="#studio">Open desk</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Support</h2>
            <ul className={s.footLinks}>
              <li>
                <a href="#support">Membership</a>
              </li>
              <li>
                <a href="#support">Our accounts</a>
              </li>
              <li>
                <a href="#studio">Come in</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Contact</h2>
            <p className={s.footAddr}>
              Lendkai 94, Hof
              <br />
              8020 Graz
              <br />
              studio@frequenz946.example
              <br />
              +43 316 000 000
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p>A fictional radio station. Prices and times are invented.</p>
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
