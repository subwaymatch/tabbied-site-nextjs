import { TabbiedArtwork } from 'tabbied/react';
import { ripplering } from 'tabbied/artworks';
import { Figure } from 'components/Figure';
import styles from './stillpoint-yoga.module.css';

export const metadata = {
  title: 'Stillpoint — Movement & Breathwork Studio',
  description:
    'A small studio for slow movement and honest breathing. Four class styles, two teachers, one sunlit room with a cork floor and an olive tree. First three weeks, €40.',
};

// Site palette — linen first.
const LINEN = '#F5EFE7';
const CLAY = '#C97B5A';
const STONE = '#8C7A6B';
const SAND = '#E5D5C3';
const BARK = '#4A423A';
const DUNE = '#D9B99F';

const classStyles = [
  {
    name: 'Slow Flow',
    time: '60 min',
    level: 'All levels',
    tone: 'clay',
    desc: 'Continuous movement, kept low to the ground and slower than you expect. One breath per shape. Nobody is watching; everybody is breathing.',
  },
  {
    name: 'Deep Rest',
    time: '75 min',
    level: 'All levels',
    tone: 'sand',
    desc: 'Bolsters, blankets, ten minutes per shape, and the permission to do absolutely nothing well. Ends with warm tea in the corner.',
  },
  {
    name: 'Breath + Ground',
    time: '45 min',
    level: 'All levels',
    tone: 'dune',
    desc: 'Seated practice. We work with the 4-7-8 count until the room slows down together. No incense unless everyone votes yes.',
  },
  {
    name: 'Strong Still',
    time: '60 min',
    level: 'Some practice',
    tone: 'stone',
    desc: 'Strength built by staying: long holds, honest shaking, generous rests. The hardest class we teach, at the slowest speed we teach it.',
  },
];

const schedule = [
  {
    day: 'Monday',
    slots: [
      { time: '06:30', name: 'Slow Flow', teacher: 'Marisol' },
      { time: '12:15', name: 'Breath + Ground', teacher: 'Teo' },
      { time: '18:00', name: 'Strong Still', teacher: 'Teo' },
    ],
  },
  {
    day: 'Tuesday',
    slots: [
      { time: '07:00', name: 'Strong Still', teacher: 'Teo' },
      { time: '17:30', name: 'Slow Flow', teacher: 'Marisol' },
      { time: '19:15', name: 'Deep Rest', teacher: 'Marisol' },
    ],
  },
  {
    day: 'Wednesday',
    slots: [
      { time: '06:30', name: 'Slow Flow', teacher: 'Marisol' },
      { time: '12:15', name: 'Breath + Ground', teacher: 'Teo' },
      { time: '18:00', name: 'Deep Rest', teacher: 'Marisol' },
    ],
  },
  {
    day: 'Thursday',
    slots: [
      { time: '07:00', name: 'Strong Still', teacher: 'Teo' },
      { time: '17:30', name: 'Slow Flow', teacher: 'Marisol' },
    ],
  },
  {
    day: 'Friday',
    slots: [
      { time: '06:30', name: 'Slow Flow', teacher: 'Marisol' },
      { time: '12:15', name: 'Breath + Ground', teacher: 'Teo' },
    ],
  },
  {
    day: 'Saturday',
    slots: [
      { time: '09:00', name: 'Slow Flow', teacher: 'Marisol' },
      { time: '10:30', name: 'Strong Still', teacher: 'Teo' },
    ],
  },
  {
    day: 'Sunday',
    slots: [
      { time: '09:30', name: 'Deep Rest', teacher: 'Marisol' },
      { time: '16:00', name: 'Breath + Ground', teacher: 'Teo' },
    ],
  },
];

const kit = [
  {
    slug: 'stillpoint-mat-cutout',
    alt: 'Rolled cork yoga mat tied with a cotton strap',
    name: 'Cork mat',
    price: '€68',
    note: 'Grippier when your hands are not.',
  },
  {
    slug: 'stillpoint-blocks-cutout',
    alt: 'Two cork yoga blocks stacked at an angle',
    name: 'Cork blocks, pair',
    price: '€26',
    note: 'The floor, brought closer.',
  },
  {
    slug: 'stillpoint-cushion-cutout',
    alt: 'Round buckwheat meditation cushion in oatmeal linen',
    name: 'Sit cushion',
    price: '€44',
    note: 'Buckwheat hulls, linen, patience.',
  },
];

const pricing = [
  {
    name: 'First three weeks',
    price: '€40',
    per: 'unlimited classes',
    featured: true,
    note: 'For newcomers only. Come as often as you like; twice is enough to know.',
  },
  {
    name: 'Drop-in',
    price: '€18',
    per: 'per class',
    featured: false,
    note: 'No commitment, no questions. Mats and props always included.',
  },
  {
    name: 'Ten classes',
    price: '€150',
    per: 'valid six months',
    featured: false,
    note: 'Shareable with one other person, because practice is easier in pairs.',
  },
  {
    name: 'Monthly',
    price: '€98',
    per: 'unlimited, pause anytime',
    featured: false,
    note: 'Pausing takes one email and zero explanations.',
  },
];

export default function StillpointPage() {
  return (
    <div className={styles.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..700;1,300..700&family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600&display=swap"
      />

      <header className={styles.header}>
        <a className={styles.wordmark} href="#top">
          <span className={styles.ringMark} aria-hidden="true" />
          stillpoint
        </a>
        <nav className={styles.nav} aria-label="Sections">
          <a href="#philosophy">Why slow</a>
          <a href="#classes">Classes</a>
          <a href="#schedule">Schedule</a>
          <a href="#teachers">Teachers</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <a className={styles.bookPill} href="#pricing">
          Book a mat
        </a>
      </header>

      <main id="top">
        {/* ————— Hero ————— */}
        <section className={styles.hero} aria-labelledby="hero-heading">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>A movement &amp; breathwork studio</p>
            <h1 id="hero-heading" className={styles.heroTitle}>
              Move slowly.
              <br />
              <em>Breathe wide.</em>
            </h1>
            <p className={styles.heroLead}>
              One sunlit room, a cork floor, an olive tree, and classes that
              never rush you anywhere. We practice slow movement and honest
              breathing — nothing to achieve, plenty to notice.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.btnPrimary} href="#schedule">
                See the week
              </a>
              <a className={styles.btnQuiet} href="#breath">
                Try one breath first
              </a>
            </div>
            <p className={styles.heroNote}>
              New: a 6:30 dawn practice, Mondays to Fridays. Tea after, always.
            </p>
          </div>

          <div className={styles.heroArt}>
            <div className={styles.heroRings} aria-hidden="true">
              <TabbiedArtwork
                artwork={ripplering}
                palette={[LINEN, CLAY, DUNE, SAND]}
                seed="sp-hero-04"
                fit="cover"
                style={{ position: 'absolute', inset: 0 }}
              />
            </div>
            <div className={styles.heroPhoto}>
              <Figure
                slug="stillpoint-hero"
                alt="Sunlit studio with cork floor, rolled mats along a lime-washed wall and long morning shadows"
                priority
              />
            </div>
            <p className={styles.heroBadge}>
              in <span aria-hidden="true">·</span> hold{' '}
              <span aria-hidden="true">·</span> out
            </p>
          </div>
        </section>

        {/* ————— Philosophy ————— */}
        <section
          id="philosophy"
          className={styles.philosophy}
          aria-labelledby="philosophy-heading"
        >
          <p className={styles.sideLabel} aria-hidden="true">
            why slow
          </p>
          <h2 id="philosophy-heading" className={styles.visuallyHidden}>
            Why slow
          </h2>
          <p className={styles.pullLine}>
            Most of your day asks you to be <em>faster</em>. This is the hour
            that asks for nothing at all.
          </p>
          <div className={styles.principles}>
            <div className={styles.principle}>
              <h3>Slow is thorough</h3>
              <p>
                At half speed you feel twice as much — where weight lands, where
                breath snags, where effort hides. We move slowly because it
                tells the truth.
              </p>
            </div>
            <div className={styles.principle}>
              <h3>Breath leads</h3>
              <p>
                The breath sets the pace and the body follows, not the other way
                round. When in doubt, we all just breathe out longer.
              </p>
            </div>
            <div className={styles.principle}>
              <h3>Nothing to win</h3>
              <p>
                No levels to climb, no poses to collect, no mirrors to check.
                Progress here feels like sleeping better and gripping the day a
                little less.
              </p>
            </div>
          </div>
        </section>

        <div className={styles.rippleStrip} aria-hidden="true">
          <TabbiedArtwork
            artwork={ripplering}
            palette={[LINEN, DUNE, SAND, CLAY]}
            seed="sp-strip-11"
            fit="grid"
            cellSize={72}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>

        {/* ————— Classes ————— */}
        <section
          id="classes"
          className={styles.classes}
          aria-labelledby="classes-heading"
        >
          <div className={styles.sectionIntro}>
            <h2 id="classes-heading">Four ways in</h2>
            <p>
              Every class includes mats, props, tea, and time to lie still at
              the end. Wear anything you can breathe in.
            </p>
          </div>
          <div className={styles.classGrid}>
            {classStyles.map((cls) => (
              <article
                key={cls.name}
                className={`${styles.classCard} ${styles[`tone_${cls.tone}`]}`}
              >
                <div className={styles.classMeta}>
                  <span>{cls.time}</span>
                  <span>{cls.level}</span>
                </div>
                <h3>{cls.name}</h3>
                <p>{cls.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ————— Schedule ————— */}
        <section
          id="schedule"
          className={styles.schedule}
          aria-labelledby="schedule-heading"
        >
          <div className={styles.sectionIntro}>
            <h2 id="schedule-heading">The week</h2>
            <p>
              Doors open twenty minutes before class. Arrive early, claim a
              corner, leave your phone in the basket by the door.
            </p>
          </div>
          <div className={styles.scheduleTableWrap} tabIndex={0}>
            <table className={styles.scheduleTable}>
              <caption>
                Weekly schedule. Book ahead for Deep Rest — the bolsters run
                out before the room does.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Day</th>
                  <th scope="col">Classes</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((day) => (
                  <tr key={day.day}>
                    <th scope="row">{day.day}</th>
                    <td>
                      <ul className={styles.slotList}>
                        {day.slots.map((slot) => (
                          <li key={slot.time} className={styles.slot}>
                            <span className={styles.slotTime}>{slot.time}</span>
                            <span className={styles.slotName}>{slot.name}</span>
                            <span className={styles.slotTeacher}>
                              {slot.teacher}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ————— Teachers ————— */}
        <section
          id="teachers"
          className={styles.teachers}
          aria-labelledby="teachers-heading"
        >
          <div className={styles.sectionIntro}>
            <h2 id="teachers-heading">Two teachers</h2>
            <p>
              Small on purpose. You will be known by name within a week and by
              breathing pattern within two.
            </p>
          </div>
          <div className={styles.teacherRow}>
            <article className={styles.teacherCard}>
              <div className={`${styles.teacherTile} ${styles.tileClay}`}>
                <Figure
                  slug="stillpoint-teacher-1-cutout"
                  cutout
                  alt="Portrait of Marisol, a woman in her thirties with a low bun, wearing an oatmeal wrap top"
                  className={styles.teacherImg}
                />
              </div>
              <h3>Marisol Vega</h3>
              <p className={styles.teacherRole}>Founder — Slow Flow, Deep Rest</p>
              <p className={styles.teacherBio}>
                Marisol opened Stillpoint after ten years of teaching in rooms
                that were always too loud. She counts slower than any metronome
                and believes savasana is the whole point.
              </p>
            </article>
            <article className={styles.teacherCard}>
              <div className={`${styles.teacherTile} ${styles.tileSand}`}>
                <Figure
                  slug="stillpoint-teacher-2-cutout"
                  cutout
                  alt="Portrait of Teo, a man in his forties with a shaved head, wearing a clay-colored tee"
                  className={styles.teacherImg}
                />
              </div>
              <h3>Teo Larsen</h3>
              <p className={styles.teacherRole}>
                Breathwork lead — Breath + Ground, Strong Still
              </p>
              <p className={styles.teacherBio}>
                A former rowing coach who discovered that the exhale was doing
                most of the work all along. Teo teaches the strongest class we
                have and the quietest one, and insists they are the same class.
              </p>
            </article>
          </div>
        </section>

        {/* ————— The space ————— */}
        <section
          id="space"
          className={styles.space}
          aria-labelledby="space-heading"
        >
          <div className={styles.spaceCopy}>
            <h2 id="space-heading">One room, kept simple</h2>
            <p>
              Lime-washed walls, a cork floor warm underfoot, radiant heat in
              winter, windows that actually open in summer. No mirrors — your
              body already knows where it is. The olive tree is called Olga and
              she is doing fine.
            </p>
            <p>
              After class there is clay-cup tea in the corner and no hurry to
              leave. Most conversations happen there, at half volume.
            </p>
          </div>
          <div className={styles.spaceGallery}>
            <div className={`${styles.spacePhoto} ${styles.spaceWide}`}>
              <Figure
                slug="stillpoint-class"
                alt="A class resting in warm backlight, mats arranged loosely across the studio floor"
              />
            </div>
            <div className={styles.spacePhoto}>
              <Figure
                slug="stillpoint-corner"
                alt="Cushion corner of the studio beside a potted olive tree"
              />
            </div>
            <div className={styles.spacePhoto}>
              <Figure
                slug="stillpoint-tea"
                alt="Two clay cups of herbal tea on a wooden tray"
              />
            </div>
          </div>
        </section>

        {/* ————— Kit ————— */}
        <section id="kit" className={styles.kit} aria-labelledby="kit-heading">
          <div className={styles.kitBand}>
            <div className={styles.kitPattern} aria-hidden="true">
              <TabbiedArtwork
                artwork={ripplering}
                palette={[SAND, CLAY, STONE, DUNE]}
                seed="sp-kit-27"
                fit="cover"
                style={{ position: 'absolute', inset: 0 }}
              />
            </div>
            <div className={styles.kitInner}>
              <div className={styles.kitIntro}>
                <h2 id="kit-heading">Take the quiet home</h2>
                <p>
                  The same props we use in the room, sold at the door. Nothing
                  you must buy — studio props are always free to use.
                </p>
              </div>
              <ul className={styles.kitRow}>
                {kit.map((item) => (
                  <li key={item.slug} className={styles.kitCard}>
                    <div className={styles.kitImgWrap}>
                      <Figure
                        slug={item.slug}
                        cutout
                        alt={item.alt}
                        className={styles.kitImg}
                      />
                    </div>
                    <div className={styles.kitLine}>
                      <span className={styles.kitName}>{item.name}</span>
                      <span className={styles.kitPrice}>{item.price}</span>
                    </div>
                    <p className={styles.kitNote}>{item.note}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ————— Pricing ————— */}
        <section
          id="pricing"
          className={styles.pricing}
          aria-labelledby="pricing-heading"
        >
          <div className={styles.sectionIntro}>
            <h2 id="pricing-heading">Plain prices</h2>
            <p>
              No joining fees, no contracts, no surprise tiers. If money is the
              only thing keeping you away, write to us — we keep two mats free
              in every class.
            </p>
          </div>
          <div className={styles.priceGrid}>
            {pricing.map((tier) => (
              <article
                key={tier.name}
                className={
                  tier.featured
                    ? `${styles.priceCard} ${styles.priceFeatured}`
                    : styles.priceCard
                }
              >
                {tier.featured && (
                  <p className={styles.priceFlag}>Start here</p>
                )}
                <h3>{tier.name}</h3>
                <p className={styles.priceAmount}>
                  {tier.price}
                  <span> {tier.per}</span>
                </p>
                <p className={styles.priceNote}>{tier.note}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ————— Breathwork moment ————— */}
        <section
          id="breath"
          className={styles.breath}
          aria-labelledby="breath-heading"
        >
          <div className={styles.breathPattern} aria-hidden="true">
            <TabbiedArtwork
              artwork={ripplering}
              palette={[BARK, CLAY, DUNE, STONE]}
              seed="sp-breath-478"
              fit="cover"
              density={2}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={styles.breathInner}>
            <div className={styles.breathRings} aria-hidden="true">
              <span className={styles.breathHalo} />
              <span className={styles.breathCircle} />
            </div>
            <div className={styles.breathCopy}>
              <h2 id="breath-heading">One round, right now</h2>
              <p className={styles.breathLead}>
                Follow the circle. It breathes at the pace we use in class —
                you are welcome to join it.
              </p>
              <ol className={styles.breathSteps}>
                <li>
                  <span className={styles.breathCount}>4</span> In through the
                  nose, unhurried
                </li>
                <li>
                  <span className={styles.breathCount}>7</span> Hold, soft in
                  the shoulders
                </li>
                <li>
                  <span className={styles.breathCount}>8</span> Out slowly,
                  longer than feels natural
                </li>
              </ol>
              <p className={styles.breathFoot}>
                That is the whole technique. Everything else is repetition.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ————— Footer ————— */}
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerBlock}>
            <p className={styles.footerWordmark}>
              <span className={styles.ringMarkSmall} aria-hidden="true" />
              stillpoint
            </p>
            <p className={styles.footerText}>
              A movement &amp; breathwork studio.
              <br />
              Slow on purpose since 2021.
            </p>
          </div>
          <div className={styles.footerBlock}>
            <h3>Find us</h3>
            <p className={styles.footerText}>
              14 Alder Lane, over the bakery
              <br />
              Doors open 20 minutes before class
            </p>
          </div>
          <div className={styles.footerBlock}>
            <h3>Say hello</h3>
            <p className={styles.footerText}>
              hello@stillpoint.studio
              <br />
              (0)44 218 07 — mornings only
            </p>
          </div>
          <div className={styles.footerBlock}>
            <h3>Hours</h3>
            <p className={styles.footerText}>
              Mon — Fri · 06:00 – 20:30
              <br />
              Sat — Sun · 08:30 – 17:30
            </p>
          </div>
        </div>
        <div className={styles.footerBase}>
          <p>
            A fictional studio, breathing quietly. ·{' '}
            <a
              className={styles.credit}
              href="https://tabbied.com"
              target="_blank"
              rel="noreferrer"
            >
              Patterns by Tabbied
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
