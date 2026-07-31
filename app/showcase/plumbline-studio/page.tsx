import { TabbiedArtwork } from 'tabbied/react';
import { gutter } from 'tabbied/artworks';
import { Figure } from 'components/Figure';
import s from './plumbline-studio.module.css';

export const metadata = {
  title: 'Plumbline — architecture practice, Guildmoor',
  description:
    'Plumbline is a twelve-person architecture practice in Guildmoor working on civic buildings, houses and careful adaptive reuse. Measured work, exactly documented.',
};

const CHALK = ['#F6F5F1', '#17171A', '#B9B9BE', '#6E6E74', '#DCDCD8'];
const COBALT_ACCENT = ['#F6F5F1', '#17171A', '#2947F0', '#B9B9BE', '#DCDCD8'];
const DARK = ['#17171A', '#DCDCD8', '#6E6E74', '#2947F0', '#B9B9BE'];

const WORK: {
  slug: string;
  alt: string;
  code: string;
  name: string;
  meta: string;
  wide: boolean;
}[] = [
  {
    slug: 'plumbline-pavilion',
    alt: 'A timber pavilion with a deep flat roof over an open public lawn',
    code: 'PL-041',
    name: 'Larch Pavilion',
    meta: 'Guildmoor Commons · landscape · 2024',
    wide: true,
  },
  {
    slug: 'plumbline-library',
    alt: 'A brick library elevation with a single cobalt-blue entrance door',
    code: 'PL-044',
    name: 'Brick & Cobalt Library',
    meta: 'Southquay · civic · 2025',
    wide: true,
  },
  {
    slug: 'plumbline-stair',
    alt: 'A concrete spiral stair photographed from directly below',
    code: 'PL-038',
    name: 'Stair House',
    meta: 'Ferrier Hill · residential · 2024',
    wide: false,
  },
  {
    slug: 'plumbline-courtyard',
    alt: 'A paved courtyard enclosed by glazing, with a single young tree at its centre',
    code: 'PL-033',
    name: 'Courtyard House with Tree',
    meta: 'Guildmoor · residential · 2023',
    wide: false,
  },
];

const INDEX: {
  code: string;
  name: string;
  typology: string;
  location: string;
  year: string;
  status: 'In progress' | 'Complete' | 'Shelved';
}[] = [
  { code: 'PL-052', name: 'Fenland Rowing Club', typology: 'Civic', location: 'Merebeck', year: '2026', status: 'In progress' },
  { code: 'PL-049', name: 'Coastguard Lookout', typology: 'Adaptive reuse', location: 'Cape Alder', year: '2026', status: 'In progress' },
  { code: 'PL-047', name: 'Two Courts House', typology: 'Residential', location: 'Guildmoor', year: '2025', status: 'Complete' },
  { code: 'PL-044', name: 'Brick & Cobalt Library', typology: 'Civic', location: 'Southquay', year: '2025', status: 'Complete' },
  { code: 'PL-041', name: 'Larch Pavilion', typology: 'Landscape', location: 'Guildmoor Commons', year: '2024', status: 'Complete' },
  { code: 'PL-038', name: 'Stair House', typology: 'Residential', location: 'Ferrier Hill', year: '2024', status: 'Complete' },
  { code: 'PL-036', name: 'Printworks Studios', typology: 'Workplace', location: 'Southquay', year: '2023', status: 'Complete' },
  { code: 'PL-033', name: 'Courtyard House with Tree', typology: 'Residential', location: 'Guildmoor', year: '2023', status: 'Complete' },
  { code: 'PL-029', name: 'Tidal Baths Study', typology: 'Research', location: 'Cape Alder', year: '2022', status: 'Shelved' },
  { code: 'PL-027', name: 'Gable Terrace', typology: 'Housing', location: 'Merebeck', year: '2022', status: 'Complete' },
  { code: 'PL-021', name: 'Concrete Glass House', typology: 'Residential', location: 'Ferrier Hill', year: '2021', status: 'Complete' },
  { code: 'PL-014', name: 'Plumbline Studio fit-out', typology: 'Workplace', location: 'Guildmoor', year: '2019', status: 'Complete' },
];

const RECOGNITIONS: { year: string; text: string }[] = [
  { year: '2026', text: 'Civic Architecture Prize — shortlist, Brick & Cobalt Library' },
  { year: '2025', text: 'National Timber Awards — winner, public buildings, Larch Pavilion' },
  { year: '2024', text: 'Housing Design Medal — commendation, Gable Terrace' },
  { year: '2023', text: 'Emerging Practice of the Year — finalist' },
  { year: '2022', text: 'Concrete Annual — best private house, Concrete Glass House' },
  { year: '2021', text: 'Guildmoor Design Review Panel — appointed members (M. Kang, E. Thorne)' },
];

function SectionMark({ n, label }: { n: string; label: string }) {
  return (
    <div className={s.sectionMark}>
      <span className={s.sectionNum}>{n}</span>
      <span className={s.sectionLabel}>{label}</span>
    </div>
  );
}

export default function PlumblineStudioPage() {
  return (
    <div className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        precedence="default"
        href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
      />

      <header className={s.masthead}>
        <p className={s.wordmark}>
          Plumbline<span aria-hidden="true">*</span>
        </p>
        <p className={s.mastheadNote}>Architecture · Guildmoor</p>
        <nav aria-label="Page sections" className={s.mastheadNav}>
          <a href="#practice">01 Practice</a>
          <a href="#work">02 Work</a>
          <a href="#index">03 Index</a>
          <a href="#approach">04 Approach</a>
          <a href="#studio">05 Studio</a>
          <a href="#contact">07 Contact</a>
        </nav>
      </header>

      <main>
        {/* ——— 01 Practice ——— */}
        <section id="practice" className={s.section} aria-labelledby="t-practice">
          <SectionMark n="01" label="Practice" />
          <div className={s.heroGrid}>
            <h1 id="t-practice" className={s.statement}>
              Buildings that hold their line — drawn once, checked twice,
              built to be kept.
            </h1>
            <div className={s.heroArtCol}>
              <div className={s.artInsert}>
                <TabbiedArtwork
                  artwork={gutter}
                  palette={COBALT_ACCENT}
                  seed="plumbline-01"
                  fit="grid"
                  cellSize={34}
                  style={{ position: 'absolute', inset: 0 }}
                />
              </div>
              <p className={s.mono}>
                Fig. 0 — the page grid, repeated spread after spread.
              </p>
            </div>
          </div>
          <p className={s.practiceText}>
            Plumbline is a twelve-person practice founded in 2019. We work on
            civic buildings, houses and careful adaptive reuse, mostly within
            an hour of our studio. We draw everything ourselves, we visit site
            weekly, and we would rather refine one detail than invent five.
          </p>
          <figure className={s.heroFigure}>
            <div className={s.heroImgWrap}>
              <Figure
                slug="plumbline-hero"
                alt="A concrete and glass house at dusk, its interior lit warmly"
                priority
                className={s.photo}
              />
            </div>
            <figcaption className={s.mono}>
              PL-021 — Concrete Glass House, Ferrier Hill, 2021. Photograph at
              dusk, north elevation.
            </figcaption>
          </figure>
        </section>

        {/* ——— 02 Selected work ——— */}
        <section id="work" className={s.section} aria-labelledby="t-work">
          <SectionMark n="02" label="Selected work" />
          <h2 id="t-work" className={s.sectionTitle}>
            Four projects, 2023–2025
          </h2>
          <div className={s.workGrid}>
            {WORK.map((w) => (
              <figure
                key={w.slug}
                className={w.wide ? s.workItemWide : s.workItem}
              >
                <div className={w.wide ? s.workImgWide : s.workImg}>
                  <Figure slug={w.slug} alt={w.alt} className={s.photo} />
                </div>
                <figcaption className={s.workCaption}>
                  <span className={s.mono}>{w.code}</span>
                  <span className={s.workName}>{w.name}</span>
                  <span className={s.workMeta}>{w.meta}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ——— 03 Project index ——— */}
        <section id="index" className={s.section} aria-labelledby="t-index">
          <SectionMark n="03" label="Project index" />
          <h2 id="t-index" className={s.sectionTitle}>
            Every job number since 2019
          </h2>
          <div className={s.tableWrap}>
            <table className={s.indexTable}>
              <thead>
                <tr>
                  <th scope="col">No.</th>
                  <th scope="col">Project</th>
                  <th scope="col">Typology</th>
                  <th scope="col">Location</th>
                  <th scope="col">Year</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {INDEX.map((row) => (
                  <tr key={row.code}>
                    <td className={s.mono}>{row.code}</td>
                    <td className={s.indexName}>{row.name}</td>
                    <td>{row.typology}</td>
                    <td>{row.location}</td>
                    <td className={s.mono}>{row.year}</td>
                    <td>
                      <span
                        className={
                          row.status === 'In progress'
                            ? s.statusActive
                            : s.status
                        }
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={s.tableFootnote}>
            Numbers are sequential and none are skipped; the gaps are projects
            clients prefer we keep quiet about.
          </p>
        </section>

        {/* ——— 04 Approach ——— */}
        <section id="approach" className={s.section} aria-labelledby="t-approach">
          <SectionMark n="04" label="Approach" />
          <h2 id="t-approach" className={s.sectionTitle}>
            Three rules we have never broken
          </h2>
          <div className={s.approachGrid}>
            <article className={s.approachItem}>
              <p className={s.mono}>4.1</p>
              <h3>Measure the place first</h3>
              <p>
                Every project begins with a full measured survey done by the
                people who will draw the building — sun paths, sight lines,
                the neighbour’s bathroom window. The survey is the first
                design decision.
              </p>
            </article>
            <article className={s.approachItem}>
              <p className={s.mono}>4.2</p>
              <h3>One structural idea</h3>
              <p>
                A building gets one clear way of standing up, legible from the
                street and from the attic. If the structure needs a paragraph
                to explain, it needs another week on the drawing board.
              </p>
            </article>
            <article className={s.approachItem}>
              <p className={s.mono}>4.3</p>
              <h3>Details you can maintain</h3>
              <p>
                We detail for the person repainting in 2046: accessible
                fixings, honest junctions, materials that weather rather than
                fail. Buildings are kept by being keepable.
              </p>
            </article>
          </div>
          <div className={s.approachBand}>
            <TabbiedArtwork
              artwork={gutter}
              palette={CHALK}
              seed="plumbline-04"
              fit="grid"
              cellSize={30}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <p className={s.mono}>
            Fig. 1 — column rhythm study, set in the office grid.
          </p>
        </section>

        {/* ——— 05 Studio & principals ——— */}
        <section id="studio" className={s.section} aria-labelledby="t-studio">
          <SectionMark n="05" label="Studio" />
          <h2 id="t-studio" className={s.sectionTitle}>
            Twelve people, one long table
          </h2>
          <div className={s.studioGrid}>
            <div className={s.studioText}>
              <p>
                The studio occupies the first floor of a former print works on
                Setline Row: one long oak table, a model bench under the north
                windows, and a materials library organised by weight. We keep
                a working model of every live project on the table — arguments
                are settled by moving cardboard, not by raising voices.
              </p>
              <p>
                We are deliberately small. Twelve people means both principals
                still draw, every project is known by everyone, and the Friday
                site-visit rota fits on one index card.
              </p>
            </div>
            <figure className={s.modelFigure}>
              <div className={s.modelStage}>
                <TabbiedArtwork
                  artwork={gutter}
                  palette={['#DCDCD8', '#6E6E74', '#B9B9BE', '#F6F5F1']}
                  seed="plumbline-05"
                  fit="grid"
                  cellSize={38}
                  style={{ position: 'absolute', inset: 0 }}
                />
                <Figure
                  slug="plumbline-model-cutout"
                  cutout
                  alt="A white card massing model of a stepped building"
                  className={s.modelImg}
                />
              </div>
              <figcaption className={s.mono}>
                PL-052 — Fenland Rowing Club, massing model 1:200, card and
                lime basswood.
              </figcaption>
            </figure>
          </div>
          <div className={s.principals}>
            <figure className={s.principal}>
              <div className={s.principalTile}>
                <Figure
                  slug="plumbline-principal-1-cutout"
                  cutout
                  alt="Portrait of Mihee Kang, a woman in her forties with a black bob, wearing an ink-blue jacket"
                  className={s.principalImg}
                />
              </div>
              <figcaption>
                <span className={s.principalName}>Mihee Kang</span>
                <span className={s.mono}>Principal · founded the practice, 2019</span>
                <p className={s.principalBio}>
                  Leads the civic work. Trained in Seoul and Copenhagen;
                  believes every public building owes the street a bench.
                </p>
              </figcaption>
            </figure>
            <figure className={s.principal}>
              <div className={s.principalTile}>
                <Figure
                  slug="plumbline-principal-2-cutout"
                  cutout
                  alt="Portrait of Elias Thorne, a man in his fifties with grey cropped hair and glasses, wearing a white shirt"
                  className={s.principalImg}
                />
              </div>
              <figcaption>
                <span className={s.principalName}>Elias Thorne</span>
                <span className={s.mono}>Principal · joined 2020</span>
                <p className={s.principalBio}>
                  Leads the houses and the details library. Twenty years of
                  site experience; carries a folding rule, distrusts lasers.
                </p>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ——— 06 Recognitions ——— */}
        <section id="recognitions" className={s.section} aria-labelledby="t-recognitions">
          <SectionMark n="06" label="Recognitions" />
          <h2 id="t-recognitions" className={s.sectionTitle}>
            Noted, filed, back to work
          </h2>
          <ul className={s.recognitionList}>
            {RECOGNITIONS.map((r) => (
              <li key={r.text} className={s.recognitionRow}>
                <span className={s.mono}>{r.year}</span>
                <span>{r.text}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ——— 07 Contact ——— */}
        <section id="contact" className={s.section} aria-labelledby="t-contact">
          <SectionMark n="07" label="Contact" />
          <div className={s.contactGrid}>
            <div>
              <h2 id="t-contact" className={s.sectionTitle}>
                New commissions, considered quarterly
              </h2>
              <p className={s.contactText}>
                We take on four to six new projects a year and read every
                enquiry at the same Monday meeting. Tell us the site, the
                budget you actually have, and what the building must still be
                doing in thirty years.
              </p>
              <p className={s.contactLink}>
                <a href="mailto:enquiries@plumbline.example">
                  enquiries@plumbline.example
                </a>
              </p>
            </div>
            <div className={s.contactMeta}>
              <address className={s.address}>
                Plumbline Architecture
                <br />
                First floor, 8 Setline Row
                <br />
                Guildmoor GM1 6EP
              </address>
              <p className={s.mono}>
                +44 (0)1632 960 448
                <br />
                Mon–Fri 09:00–18:00
              </p>
              <p className={s.contactNote}>
                Visits by appointment. The stair is original, 1911, and worth
                the climb.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ——— Footer ——— */}
      <footer className={s.footer}>
        <div className={s.footerArt}>
          <TabbiedArtwork
            artwork={gutter}
            palette={DARK}
            seed="plumbline-99"
            fit="grid"
            cellSize={36}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>
        <div className={s.footerInner}>
          <p className={s.footerWordmark}>
            Plumbline<span aria-hidden="true">*</span>
          </p>
          <div className={s.footerCols}>
            <p>
              © 2026 Plumbline Architecture Ltd.
              <br />
              Registered practice no. 8841-GM.
            </p>
            <p>
              8 Setline Row, Guildmoor
              <br />
              <a href="mailto:enquiries@plumbline.example">
                enquiries@plumbline.example
              </a>
            </p>
            <p className={s.footerCredit}>
              * The ruled inserts on this page are the pattern “Gutter”, drawn
              by <a href="https://tabbied.com">Tabbied</a>.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
