import { TabbiedArtwork } from 'tabbied/react';
import { hilbert } from 'tabbied/artworks';
import { Figure } from 'components/Figure';
import styles from './quanta-robotics.module.css';

export const metadata = {
  title: 'Quanta Robotics Laboratory — Machines That Learn by Touching',
  description:
    'An independent robotics laboratory in New Arden. Manipulation, locomotion, and fleet learning research on hardware we build ourselves. Status: SYS.OK.',
};

const VOID = '#0B0E14';
const PHOSPHOR = '#25E0C8';
const SLATE = '#4A5568';
const PAPER = '#E8ECF1';
const INDIGO = '#7A88FF';
const PANEL = '#1A2230';

type Platform = {
  id: string;
  codename: string;
  role: string;
  status: string;
  log: string;
  slug: string;
  alt: string;
  seed: string;
  palette: string[];
  specs: [string, string][];
};

const PLATFORMS: Platform[] = [
  {
    id: 'QA-6',
    codename: 'VECTOR',
    role: 'Six-axis manipulator',
    status: 'DEPLOYED',
    log: 'Fourth revision. Learned to fold a shirt in 2024, to fold it well in 2025. Currently unloading dishwashers at partner sites and keeping notes.',
    slug: 'quanta-arm-cutout',
    alt: 'Six-axis robotic arm with teal accents, posed mid-reach',
    seed: 'qx-vector',
    palette: [PANEL, PHOSPHOR, SLATE, VOID],
    specs: [
      ['AXES', '6'],
      ['REACH', '940 mm'],
      ['PAYLOAD', '12 kg'],
      ['REPEATABILITY', '±0.02 mm'],
      ['CONTROL LOOP', '1 kHz / EtherCAT'],
      ['MASS', '38 kg'],
    ],
  },
  {
    id: 'QR-2',
    codename: 'SURVEYOR',
    role: 'All-terrain research rover',
    status: 'FIELD TRIALS',
    log: 'Eleven-hour endurance, four independent drive pods, one incident involving a hedge (resolved). Mapping the Foundry Walk quarry since March.',
    slug: 'quanta-rover-cutout',
    alt: 'Four-wheeled research rover with sensor mast and cargo bay',
    seed: 'qx-surveyor',
    palette: [PANEL, INDIGO, SLATE, VOID],
    specs: [
      ['DRIVE', '4 × independent pods'],
      ['TOP SPEED', '1.8 m/s'],
      ['ENDURANCE', '11 h'],
      ['PAYLOAD BAY', '40 L'],
      ['SENSING', 'LIDAR + stereo + IMU'],
      ['INGRESS', 'IP54'],
    ],
  },
  {
    id: 'QD-9',
    codename: 'KESTREL',
    role: 'Autonomous quadrotor',
    status: 'DEPLOYED',
    log: 'Onboard visual-inertial odometry, no GPS, no excuses. Flies the lab perimeter every morning at 06:10 and files a report nobody asked for.',
    slug: 'quanta-drone-cutout',
    alt: 'Compact quadcopter drone with guarded rotors',
    seed: 'qx-kestrel',
    palette: [PANEL, PHOSPHOR, INDIGO, VOID],
    specs: [
      ['ROTOR SPAN', '620 mm'],
      ['MASS', '1.4 kg'],
      ['FLIGHT TIME', '34 min'],
      ['WIND LIMIT', '12 m/s'],
      ['AUTONOMY', 'Onboard VIO'],
      ['NAVIGATION', 'GPS-denied'],
    ],
  },
  {
    id: 'QC-1',
    codename: 'BASEMENT',
    role: 'Fleet learning cluster',
    status: 'ALWAYS ON',
    log: 'The only platform that never leaves the building. Replays every grasp, fall, and near-miss from the fleet overnight; the robots wake up slightly better.',
    slug: 'quanta-server-cutout',
    alt: 'Tall server rack with cabling and status lights',
    seed: 'qx-basement',
    palette: [PANEL, SLATE, PHOSPHOR, VOID],
    specs: [
      ['NODES', '24'],
      ['ACCELERATORS', '96'],
      ['STORAGE', '2.4 PB'],
      ['INTERCONNECT', '800 Gb/s'],
      ['SIM THROUGHPUT', '40k episodes/day'],
      ['COOLING', 'Rear-door liquid'],
    ],
  },
];

const RESEARCH = [
  {
    code: 'RA-01',
    name: 'Manipulation',
    copy: 'Grasping things that were not designed to be grasped. Deformables, transparents, the lab mug with the broken handle.',
  },
  {
    code: 'RA-02',
    name: 'Locomotion',
    copy: 'Wheels where wheels work, legs where they do not. Recovery behaviors trained on 40,000 simulated falls and eleven real ones.',
  },
  {
    code: 'RA-03',
    name: 'Perception & SLAM',
    copy: 'Maps that survive moved furniture. Long-horizon localization without GPS, beacons, or wishful thinking.',
  },
  {
    code: 'RA-04',
    name: 'Fleet learning',
    copy: 'Every robot’s worst moment becomes every robot’s training data. Nightly consolidation across the whole fleet.',
  },
  {
    code: 'RA-05',
    name: 'Sim-to-real',
    copy: 'Closing the gap between the physics engine and the physics. Domain randomization with a grudge.',
  },
  {
    code: 'RA-06',
    name: 'Human-robot safety',
    copy: 'Force limits, intent signaling, and the hard problem of standing politely in a corridor. Certified before clever.',
  },
];

const TELEMETRY = [
  { value: '2,412', unit: 'days', label: 'Lab uptime' },
  { value: '18.4M', unit: 'episodes', label: 'Logged to BASEMENT' },
  { value: '94.2%', unit: 'grasp', label: 'Success, novel objects' },
  { value: '61,300', unit: 'hours', label: 'Teleop demonstrations' },
  { value: '9.4', unit: 'km', label: 'Rover km per intervention' },
  { value: '0', unit: 'incidents', label: 'Reportable, 36 months' },
];

const PUBLICATIONS = [
  {
    year: '2026',
    title: 'Grasping the Long Tail: Fleet-Scale Consolidation for Household Objects',
    authors: 'Okafor, Lindqvist, Marsh',
    venue: 'Proc. CoRL',
  },
  {
    year: '2026',
    title: 'KESTREL: Perimeter Flight Without GPS, Twelve Months of Mornings',
    authors: 'Marsh, Tran',
    venue: 'Field Robotics Letters 11(2)',
  },
  {
    year: '2025',
    title: 'Eleven Real Falls: What Simulation Still Gets Wrong About Recovery',
    authors: 'Lindqvist, Adeyemi, Okafor',
    venue: 'Proc. RSS',
  },
  {
    year: '2025',
    title: 'Politeness as a Control Objective: Corridor Negotiation at 0.8 m/s',
    authors: 'Tran, Marsh, Whitlock',
    venue: 'HRI Workshop on Shared Spaces',
  },
  {
    year: '2024',
    title: 'VECTOR-3 to VECTOR-4: A Post-Mortem on Folding',
    authors: 'Okafor, Whitlock',
    venue: 'Quanta Technical Report QTR-041',
  },
];

const PARTNERS = [
  { name: 'Meridian Freight Systems', field: 'Depot logistics' },
  { name: 'Halcyon Port Authority', field: 'Container inspection' },
  { name: 'Bluefield Agriculture Group', field: 'Orchard survey' },
  { name: 'Northgate Medical Logistics', field: 'Sterile transport' },
  { name: 'Corvid Aerospace', field: 'Airframe inspection' },
  { name: 'The Ossett Institute', field: 'Assistive research' },
];

const ROLES = [
  { role: 'Research Engineer, Manipulation', team: 'RA-01', type: 'Full-time', loc: 'New Arden' },
  { role: 'Perception Scientist', team: 'RA-03', type: 'Full-time', loc: 'New Arden / hybrid' },
  { role: 'Field Test Lead, Rover', team: 'RA-02', type: 'Full-time', loc: 'New Arden + quarry' },
  { role: 'Machinist & Fabricator', team: 'Workshop', type: 'Full-time', loc: 'New Arden' },
  { role: 'Research Intern', team: 'Any', type: 'Summer 2027', loc: 'New Arden' },
];

function SectionHeader({
  index,
  name,
  id,
}: {
  index: string;
  name: string;
  id?: string;
}) {
  return (
    <h2 className={styles.sectionHeader} id={id}>
      <span className={styles.sectionIndex}>[{index}]</span>
      <span className={styles.sectionRule} aria-hidden="true" />
      <span className={styles.sectionName}>{name}</span>
    </h2>
  );
}

export default function QuantaRoboticsPage() {
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
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap"
      />

      <header className={styles.statusBar}>
        <a href="#sys-top" className={styles.wordmark}>
          QUANTA<span className={styles.wordmarkDim}>.LAB</span>
        </a>
        <p className={styles.sysOk}>
          <span className={styles.okDot} aria-hidden="true" />
          SYS.OK
        </p>
        <nav aria-label="Sections" className={styles.statusNav}>
          <a href="#platforms">platforms</a>
          <a href="#research">research</a>
          <a href="#pubs">pubs</a>
          <a href="#careers">careers</a>
        </nav>
        <p className={styles.statusClock}>T+2412d</p>
      </header>

      <main id="sys-top">
        {/* ------------------------------------------------------- HERO */}
        <section className={styles.hero} aria-labelledby="hero-h">
          <div className={styles.heroPattern}>
            <TabbiedArtwork
              artwork={hilbert}
              palette={[VOID, PHOSPHOR, PANEL, SLATE]}
              seed="qx-hero"
              fit="cover"
              style={{ position: 'absolute', inset: 0 }}
            />
            <div className={styles.heroFade} aria-hidden="true" />
          </div>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.heroBoot} aria-hidden="true">
                &gt; boot sequence complete · 06:12:04
              </p>
              <h1 id="hero-h" className={styles.heroTitle}>
                Machines that learn the world by touching it
                <span className={styles.cursor} aria-hidden="true" />
              </h1>
              <p className={styles.heroSub}>
                Quanta is an independent robotics laboratory in New Arden.
                We design our own platforms, run them until they fail, log the
                failure, and ship the lesson to the whole fleet by morning.
              </p>
              <dl className={styles.heroReadout}>
                <div>
                  <dt>FLEET</dt>
                  <dd>31 units / 4 platforms</dd>
                </div>
                <div>
                  <dt>MODE</dt>
                  <dd>continuous field trials</dd>
                </div>
                <div>
                  <dt>FUNDING</dt>
                  <dd>independent, partner-backed</dd>
                </div>
              </dl>
              <div className={styles.heroActions}>
                <a href="#platforms" className={styles.cmdPrimary}>
                  ./view --platforms
                </a>
                <a href="#careers" className={styles.cmdSecondary}>
                  ./join
                </a>
              </div>
            </div>
            <figure className={styles.heroViewport}>
              <Figure
                slug="quanta-hero"
                alt="Isometric view of the Quanta laboratory floor: robot arms at benches, a rover dock, and cable trays overhead"
                priority
                className={styles.heroImg}
              />
              <figcaption className={styles.heroCaption}>
                FIG.0 — LAB FLOOR, BUILDING 4 / 06:10 PERIMETER FLIGHT IN PROGRESS
              </figcaption>
            </figure>
          </div>
        </section>

        {/* -------------------------------------------------- PLATFORMS */}
        <section className={styles.platforms} aria-labelledby="platforms">
          <SectionHeader index="01" name="PLATFORMS" id="platforms" />
          <p className={styles.sectionLede}>
            Four platforms, all designed and machined in-house. Spec sheets
            below are measured, not aspirational.
          </p>
          <div className={styles.platformGrid}>
            {PLATFORMS.map((p) => (
              <article key={p.id} className={styles.platformCard}>
                <header className={styles.platformHead}>
                  <h3 className={styles.platformName}>
                    <span className={styles.platformId}>{p.id}</span> “{p.codename}”
                  </h3>
                  <p className={styles.platformStatus} data-status={p.status}>
                    {p.status}
                  </p>
                </header>
                <div className={styles.platformStage} style={{ backgroundColor: p.palette[0] }}>
                  <TabbiedArtwork
                    artwork={hilbert}
                    palette={p.palette}
                    seed={p.seed}
                    fit="grid"
                    cellSize={26}
                    style={{ position: 'absolute', inset: 0, opacity: 0.55 }}
                  />
                  <Figure
                    slug={p.slug}
                    cutout
                    alt={p.alt}
                    className={styles.platformCutout}
                  />
                </div>
                <p className={styles.platformRole}>{p.role}</p>
                <p className={styles.platformLog}>{p.log}</p>
                <table className={styles.specTable}>
                  <caption className={styles.specCaption}>
                    {p.id} measured specification
                  </caption>
                  <tbody>
                    {p.specs.map(([k, v]) => (
                      <tr key={k}>
                        <th scope="row">{k}</th>
                        <td>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </article>
            ))}
          </div>
        </section>

        {/* --------------------------------------------------- RESEARCH */}
        <section className={styles.research} aria-labelledby="research">
          <SectionHeader index="02" name="RESEARCH AREAS" id="research" />
          <ul className={styles.researchGrid}>
            {RESEARCH.map((r) => (
              <li key={r.code} className={styles.researchCell}>
                <p className={styles.researchCode}>{r.code}</p>
                <h3 className={styles.researchName}>{r.name}</h3>
                <p className={styles.researchCopy}>{r.copy}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* -------------------------------------------------- TELEMETRY */}
        <section className={styles.telemetry} aria-labelledby="telemetry-h">
          <div className={styles.telemetryPattern}>
            <TabbiedArtwork
              artwork={hilbert}
              palette={[VOID, INDIGO, PHOSPHOR, PANEL]}
              seed="qx-telemetry"
              fit="grid"
              cellSize={30}
              style={{ position: 'absolute', inset: 0, opacity: 0.5 }}
            />
          </div>
          <div className={styles.telemetryInner}>
            <h2 id="telemetry-h" className={styles.telemetryTitle}>
              LAB TELEMETRY <span className={styles.telemetryStamp}>SNAPSHOT 2026-07-31 06:12 UTC</span>
            </h2>
            <dl className={styles.telemetryGrid}>
              {TELEMETRY.map((t) => (
                <div key={t.label} className={styles.telemetryStat}>
                  <dd className={styles.telemetryValue}>
                    {t.value}
                    <span className={styles.telemetryUnit}> {t.unit}</span>
                  </dd>
                  <dt className={styles.telemetryLabel}>{t.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* --------------------------------------------------- FACILITY */}
        <section className={styles.facility} aria-labelledby="facility-h">
          <SectionHeader index="03" name="THE LINE" id="facility-h" />
          <div className={styles.facilitySplit}>
            <figure className={styles.facilityFigure}>
              <Figure
                slug="quanta-line"
                alt="The small-batch assembly line at Quanta: partially built arms on fixtures under task lighting"
                className={styles.facilityImg}
              />
              <figcaption className={styles.heroCaption}>
                FIG.3 — ASSEMBLY LINE, EAST BAY. BATCH 7 OF VECTOR REV D.
              </figcaption>
            </figure>
            <div className={styles.facilityCopy}>
              <p>
                We build in batches of eight. Small enough that every unit gets
                torqued by a person who cares, large enough that the fixtures
                pay for themselves. Machining, harness, and calibration happen
                within forty meters of the researchers who will file the bug
                reports.
              </p>
              <p>
                The line runs two weeks per quarter. The rest of the time it is
                a repair bay, which tells you most of what field robotics is.
              </p>
              <ul className={styles.facilityList}>
                <li>CNC + wire EDM in-house</li>
                <li>Harnesses hand-built, continuity-tested twice</li>
                <li>Every joint serialized and torque-logged</li>
                <li>Calibration rig shared with RA-01</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------- PUBLICATIONS */}
        <section className={styles.pubs} aria-labelledby="pubs">
          <SectionHeader index="04" name="PUBLICATIONS" id="pubs" />
          <ol className={styles.pubList}>
            {PUBLICATIONS.map((pub) => (
              <li key={pub.title} className={styles.pubRow}>
                <span className={styles.pubYear}>{pub.year}</span>
                <div className={styles.pubBody}>
                  <h3 className={styles.pubTitle}>{pub.title}</h3>
                  <p className={styles.pubMeta}>
                    {pub.authors} · <cite>{pub.venue}</cite>
                  </p>
                </div>
                <span className={styles.pubLinks} aria-hidden="true">
                  [PDF] [BIB]
                </span>
              </li>
            ))}
          </ol>
          <p className={styles.pubNote}>
            Preprints on request. QTR series available under NDA, except
            QTR-041, which is mostly an apology to a shirt.
          </p>
        </section>

        {/* ------------------------------------------------ PARTNERSHIPS */}
        <section className={styles.partners} aria-labelledby="partners-h">
          <SectionHeader index="05" name="PARTNERSHIPS" id="partners-h" />
          <p className={styles.sectionLede}>
            We deploy with partners whose problems are boring, repetitive, and
            therefore perfect. Pilots run 90 days with our engineers on-site.
          </p>
          <ul className={styles.partnerGrid}>
            {PARTNERS.map((p) => (
              <li key={p.name} className={styles.partnerCell}>
                <span className={styles.partnerName}>{p.name}</span>
                <span className={styles.partnerField}>{p.field}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------------------------------------------------- CAREERS */}
        <section className={styles.careers} aria-labelledby="careers">
          <SectionHeader index="06" name="CAREERS" id="careers" />
          <p className={styles.sectionLede}>
            Five open positions. We hire people who fix the thing before
            writing the ticket, then write the ticket anyway.
          </p>
          <div className={styles.rolesScroll}>
            <table className={styles.rolesTable}>
              <thead>
                <tr>
                  <th scope="col">ROLE</th>
                  <th scope="col">TEAM</th>
                  <th scope="col">TYPE</th>
                  <th scope="col">LOCATION</th>
                </tr>
              </thead>
              <tbody>
                {ROLES.map((r) => (
                  <tr key={r.role}>
                    <th scope="row">{r.role}</th>
                    <td>{r.team}</td>
                    <td>{r.type}</td>
                    <td>{r.loc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={styles.careersApply}>
            Apply with something you have built:{' '}
            <a href="mailto:join@quanta.example">join@quanta.example</a>
            <span className={styles.cursor} aria-hidden="true" />
          </p>
        </section>
      </main>

      {/* ------------------------------------------------------- FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div>
            <p className={styles.footerWordmark}>QUANTA.LAB</p>
            <p className={styles.footerAddr}>
              Building 4, 220 Foundry Walk
              <br />
              New Arden, NA2 4QX
            </p>
          </div>
          <dl className={styles.footerMeta}>
            <div>
              <dt>GENERAL</dt>
              <dd>
                <a href="mailto:hello@quanta.example">hello@quanta.example</a>
              </dd>
            </div>
            <div>
              <dt>PARTNERSHIPS</dt>
              <dd>
                <a href="mailto:deploy@quanta.example">deploy@quanta.example</a>
              </dd>
            </div>
            <div>
              <dt>VISITS</dt>
              <dd>By appointment. Closed during batch weeks.</dd>
            </div>
          </dl>
          <p className={styles.footerLog}>
            &gt; session.end — © 2026 Quanta Robotics Laboratory. Fictional
            lab; real affection for robots.
            <br />
            &gt; pattern.src ={' '}
            <a href="https://tabbied.com" rel="noopener" className={styles.footerCredit}>
              tabbied.com
            </a>{' '}
            // hilbert curve, rendered live
          </p>
        </div>
      </footer>
    </div>
  );
}
