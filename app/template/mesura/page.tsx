import { TabbiedPattern } from 'tabbied/react';
import {
  abutment, caltrop, doublebar, fulcrum, hilbert, recession, trigram,
} from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import s from './mesura.module.css';

export const metadata = {
  title: 'Mesura: Structural Engineering, Barcelona',
  description:
    'Mesura is a structural engineering office in Barcelona. Long-span steel, post-tensioned concrete, and the arithmetic that holds them up.',
};

/* Paper, ink, one orange, two greys. Pattern fields take `transparent` in the
   background slot so the paper reads through every gap. */
const INK = '#15171A';
const ORANGE = '#FF6A00';
const STEEL = '#8C9096';
const PALE = '#D9D8D2';
/* The two inks the decorative tiles draw with: always the quiet pair, so a
   tile reads as a sample rather than as another headline. */
/* The tiles pin their doodle to a whole multiple of the cell (9 × 72px)
   and let the plate clip it. A fluid box gives fractional grid tracks and
   a hairline seam at every cell edge. */
const TILE_BOX = 648;
const TILE_A = STEEL;
const TILE_B = PALE;


const CAPABILITIES = [
  { n: '01', t: 'Long-span steel', d: 'Trusses, arches and space frames from 30 to 180 metres. Fabrication drawings issued from the same model we analysed.' },
  { n: '02', t: 'Post-tensioned concrete', d: 'Flat slabs and transfer structures. We draw the tendon layout before the architect fixes the column grid, and say why.' },
  { n: '03', t: 'Assessment and reuse', d: 'Load testing and capacity checks on structures older than the codes that would condemn them. Most of them pass.' },
  { n: '04', t: 'Seismic retrofit', d: 'Base isolation, added damping, and the unglamorous work of tying a floor plate back to a wall it was never connected to.' },
  { n: '05', t: 'Facade engineering', d: 'Movement joints, restraint, thermal bridging. The part of the building that everybody photographs and nobody calculates.' },
  { n: '06', t: 'Expert witness', d: 'Twenty-two cases, eleven for claimants. We write the report we would defend at a viva.' },
];

const PROJECTS = [
  { code: 'M-231', name: 'Mercat de la Vall', span: '64 m', mat: 'Steel arch', year: '2026', role: 'Full design' },
  { code: 'M-228', name: 'Pont de Sant Roc', span: '112 m', mat: 'Composite box', year: '2025', role: 'Full design' },
  { code: 'M-219', name: 'Nau 7, Poblenou', span: '31 m', mat: 'Reuse, timber added', year: '2025', role: 'Assessment' },
  { code: 'M-207', name: 'Torre Aigua', span: '9 storeys', mat: 'PT flat slab', year: '2024', role: 'Full design' },
  { code: 'M-198', name: 'Escola Bruguera', span: '22 m', mat: 'Seismic retrofit', year: '2023', role: 'Retrofit' },
];

const NUMBERS = [
  ['231', 'Jobs opened since 2004'],
  ['180 m', 'Longest span built'],
  ['0', 'Structures lost'],
  ['14', 'Engineers'],
];

export default function MesuraPage() {
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
          Mesura
          <i>Enginyeria d&rsquo;Estructures</i>
        </a>
        <nav aria-label="Sections">
          <a href="#what">Capabilities</a>
          <a href="#work">Work</a>
          <a href="#method">Method</a>
          <a href="#office">Office</a>
        </nav>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------- HERO */}
        <section className={s.hero}>
          <div className={s.heroField} aria-hidden="true">
            <TabbiedPattern
              pattern={trigram}
              palette={['transparent', STEEL, ORANGE]}
              fit="grid"
              cellSize={118}
              redrawInterval={4600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.heroInner}>
            <p className={s.eyebrow}>Barcelona / est. 2004</p>
            <h1>
              Every structure is
              <br />
              an argument about
              <br />
              <span>where the load goes.</span>
            </h1>
            <p className={s.lede}>
              We make that argument in writing, with numbers anyone in the room
              can check, before anybody orders steel.
            </p>
          </div>
          <dl className={s.numbers}>
            {NUMBERS.map(([v, k]) => (
              <div key={k}>
                <dt>{v}</dt>
                <dd>{k}</dd>
              </div>
            ))}
          </dl>
        </section>

        <figure className={s.bleed}>
          <Figure
            slug="mesura-truss"
            alt="A steel roof truss under construction against an overcast sky, joints in orange primer"
            priority
          />
          <figcaption>M-231 / Mercat de la Vall. Arch closed 14.03.2026.</figcaption>
        </figure>

        {/* ---------------------------------------------------- CAPABILITIES */}
        <section id="what" className={s.what} aria-labelledby="what-h">
          <h2 id="what-h" className={s.h2}>
            Six things we do
          </h2>
          <ol className={s.caps}>
            {CAPABILITIES.map((c) => (
              <li key={c.n}>
                <span className={s.capN}>{c.n}</span>
                <h3>{c.t}</h3>
                <p>{c.d}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* --------------------------------------------------- LOAD-PATH BAND */}
        <section className={s.loadBand} aria-hidden="true">
          <div className={s.loadField}>
            <TabbiedPattern
              pattern={caltrop}
              palette={['transparent', INK, ORANGE, STEEL]}
              fit="grid"
              cellSize={120}
              redrawInterval={3600}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

        {/* ---------------------------------------------------------- WORK */}
        <section id="work" className={s.work} aria-labelledby="work-h">
          <h2 id="work-h" className={s.h2}>
            Recent work
          </h2>
          <ol className={s.projects}>
            <li className={s.projHead} aria-hidden="true">
              <span>Job</span>
              <span>Name</span>
              <span>Span</span>
              <span>Structure</span>
              <span>Role</span>
              <span>Year</span>
            </li>
            {PROJECTS.map((p) => (
              <li key={p.code}>
                <span className={s.pCode}>{p.code}</span>
                <span className={s.pName}>{p.name}</span>
                <span className={s.pSpan}>{p.span}</span>
                <span>{p.mat}</span>
                <span>{p.role}</span>
                <span className={s.pYear}>{p.year}</span>
              </li>
            ))}
          </ol>
          <div className={s.pair}>
            <figure>
              <Figure
                slug="mesura-testrig"
                alt="A laboratory load test rig pressing a concrete beam to failure"
              />
              <figcaption>Beam test to failure, 486 kN. The model said 471.</figcaption>
            </figure>
            <figure>
              <Figure
                slug="mesura-bearing"
                alt="A close view of a large steel bridge bearing between abutment and deck"
              />
              <figcaption>M-228, pot bearing at abutment B. ±48 mm.</figcaption>
            </figure>
          </div>
        </section>

        {/* -------------------------------------------------------- METHOD */}
        <section id="method" className={s.method} aria-labelledby="method-h">
          <div className={s.methodField} aria-hidden="true">
            <TabbiedPattern
              pattern={fulcrum}
              palette={['transparent', STEEL, PALE]}
              fit="grid"
              cellSize={112}
              redrawInterval={5400}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.methodInner}>
            <h2 id="method-h" className={s.h2}>
              How the work is checked
            </h2>
            <div className={s.methodGrid}>
              <div>
                <p className={s.big}>
                  Every load path is calculated twice, by two people, in two
                  ways. If the answers differ by more than five per cent, we stop
                  and find out which of us is wrong.
                </p>
                <p className={s.small}>
                  The second calculation is done by hand, on paper, at a scale
                  the first engineer cannot see. It catches modelling errors that
                  no amount of mesh refinement will.
                </p>
              </div>
              <ol className={s.steps}>
                <li>
                  <span>A</span>
                  <div>
                    <h3>Scheme by hand</h3>
                    <p>Sketch, span-to-depth, a load take-down on one sheet. Before any model exists.</p>
                  </div>
                </li>
                <li>
                  <span>B</span>
                  <div>
                    <h3>Model and analyse</h3>
                    <p>Linear first, non-linear only where the answer depends on it. Every model is archived with its inputs.</p>
                  </div>
                </li>
                <li>
                  <span>C</span>
                  <div>
                    <h3>Independent check</h3>
                    <p>A second engineer, a different method, no sight of the first result until both are finished.</p>
                  </div>
                </li>
                <li>
                  <span>D</span>
                  <div>
                    <h3>On site</h3>
                    <p>We attend the first of every connection type. Drawings are wrong until proven otherwise.</p>
                  </div>
                </li>
              </ol>
            </div>
            <figure className={s.wide}>
              <Figure
                slug="mesura-drawings"
                alt="Structural drawings and a scale rule laid out on a plain table"
              />
              <figcaption>Issue C, M-231. Twelve sheets, one revision cloud.</figcaption>
            </figure>
          </div>
        </section>

        {/* -------------------------------------------------------- OFFICE */}
        <section id="office" className={s.office} aria-labelledby="office-h">
          <div className={s.officeField} aria-hidden="true">
            <TabbiedPattern
              pattern={hilbert}
              palette={['transparent', ORANGE, STEEL]}
              fit="grid"
              cellSize={78}
              redrawInterval={4000}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          <div className={s.officeInner}>
            <h2 className={s.h2} id="office-h">
              Carrer de Pujades 118
            </h2>
            <dl className={s.contact}>
              <div>
                <dt>Office</dt>
                <dd>
                  Carrer de Pujades 118, 3r
                  <br />
                  08005 Barcelona
                </dd>
              </div>
              <div>
                <dt>Write</dt>
                <dd>
                  <a href="mailto:calcul@mesura.example">calcul@mesura.example</a>
                </dd>
              </div>
              <div>
                <dt>Call</dt>
                <dd>+34 900 000 000</dd>
              </div>
              <div>
                <dt>Hiring</dt>
                <dd>Two engineers, any level. Send calculations, not a CV.</dd>
              </div>
            </dl>
          </div>
        </section>
        {/* ---------------------------------------------------------- TILES */}
        <section id="tiles" className={s.tiles} aria-labelledby="tiles-h">
          <h2 id="tiles-h">Three failure modes we design against</h2>
          <p className={s.secNote}>Collapse is rare. These three are what actually goes wrong and what most of the calculation is really for.</p>
          <div className={s.tileGrid}>
              <article key="01">
                <div className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={trigram}
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
                  <Figure slug="mesura-tile-rule-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p className={s.tileN}>01</p>
                <h3>Serviceability, not strength</h3>
                <p className={s.tileBody}>Almost nothing fails in bending. Things fail by deflecting, cracking, or vibrating enough that people stop using the room.</p>
              </article>
              <article key="02">
                <div className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={doublebar}
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
                  <Figure slug="mesura-tile-beam-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p className={s.tileN}>02</p>
                <h3>The connection, not the member</h3>
                <p className={s.tileBody}>The member is a catalogue page. The joint is a decision, and it is where the load actually has to be believed.</p>
              </article>
              <article key="03">
                <div className={s.tilePlate} aria-hidden="true">
                  <TabbiedPattern
                    pattern={recession}
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
                  <Figure slug="mesura-tile-calipers-cutout" alt="" cutout className={s.tileObject} />
                </div>
                <p className={s.tileN}>03</p>
                <h3>Time</h3>
                <p className={s.tileBody}>Creep, shrinkage, thermal cycling, and the fact that a building is loaded for eighty years and analysed for an afternoon.</p>
              </article>
          </div>
        </section>

        {/* ---------------------------------------------------------- INDEX */}
        <section id="index" className={s.idx} aria-labelledby="idx-h">
          <h2 id="idx-h">Codes and software</h2>
          <p className={s.secNote}>What we work to and what we work in. Listed because clients and checking engineers both ask.</p>
          <ol className={s.idxList}>
            <li className={s.idxHead} aria-hidden="true">
                <span>Standard</span>
                <span>Scope</span>
                <span>Version</span>
                <span>Note</span>
            </li>
              <li key="Eurocode 0 to 8">
                <span>Eurocode 0 to 8</span>
                <span>All work</span>
                <span>EN, Spanish NA</span>
                <span>Plus CTE where it applies</span>
              </li>
              <li key="CTE DB SE">
                <span>CTE DB SE</span>
                <span>Buildings</span>
                <span>2019</span>
                <span>National</span>
              </li>
              <li key="EHE-08">
                <span>EHE-08</span>
                <span>Concrete</span>
                <span>2008</span>
                <span>Still current</span>
              </li>
              <li key="FEM, in house">
                <span>FEM, in house</span>
                <span>Analysis</span>
                <span>Linear and non-linear</span>
                <span>Every model archived with inputs</span>
              </li>
              <li key="Hand check">
                <span>Hand check</span>
                <span>Everything</span>
                <span>Paper</span>
                <span>A second engineer, a different method</span>
              </li>
              <li key="BIM">
                <span>BIM</span>
                <span>Coordination</span>
                <span>IFC 4</span>
                <span>We issue the model and the drawings</span>
              </li>
          </ol>
        </section>

        {/* ------------------------------------------------------------ FAQ */}
        <section id="faq" className={s.faq} aria-labelledby="faq-h">
          <h2 id="faq-h">Questions from architects</h2>
          <dl className={s.faqList}>
              <div key="When do you want to be i">
                <dt>When do you want to be involved?</dt>
                <dd>At the sketch. A structural scheme costs almost nothing in week two and costs a redesign in week forty.</dd>
              </div>
              <div key="Will you tell us it cann">
                <dt>Will you tell us it cannot be done?</dt>
                <dd>Rarely. We will tell you what it costs, in depth, in money and in programme, and let you decide whether the idea is worth it.</dd>
              </div>
              <div key="Can we use your model?">
                <dt>Can we use your model?</dt>
                <dd>Yes, as IFC, with a note saying what it is and is not for. It is an analysis model, not a fabrication model, and confusing the two is expensive.</dd>
              </div>
              <div key="Do you do the site work?">
                <dt>Do you do the site work?</dt>
                <dd>We attend the first of every connection type and then monthly. Drawings are wrong until somebody has stood under them.</dd>
              </div>
          </dl>
        </section>

      </main>


        {/* A coda: the last thing before the footer is the pattern itself, at
            working size and with nothing to read. Purely decorative. */}
        <section className={s.coda} aria-hidden="true">
          <div className={s.codaField}>
            <TabbiedPattern
              pattern={abutment}
              palette={['transparent', PALE, STEEL]}
              fit="grid"
              cellSize={104}
              redrawInterval={4928}
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
        </section>

      <footer className={s.footer}>
        <div className={s.footGrid}>
          <div className={s.footBrand}>
            <p className={s.footName}>Mesura</p>
            <p className={s.footTag}>Structural engineering at Carrer de Pujades 118, Barcelona, since 2004.</p>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Engineering</h2>
            <ul className={s.footLinks}>
              <li>
                <a href="#what">Capabilities</a>
              </li>
              <li>
                <a href="#work">Recent work</a>
              </li>
              <li>
                <a href="#method">How work is checked</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Practice</h2>
            <ul className={s.footLinks}>
              <li>
                <a href="#office">Carrer de Pujades 118</a>
              </li>
              <li>
                <a href="#office">Hiring</a>
              </li>
              <li>
                <a href="#what">Expert witness</a>
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footHead}>Contact</h2>
            <p className={s.footAddr}>
              Carrer de Pujades 118, 3r
              <br />
              08005 Barcelona
              <br />
              calcul@mesura.example
              <br />
              +34 900 000 000
            </p>
          </div>
        </div>
        <div className={s.footFine}>
          <p>A fictional engineering office. Prices and times are invented.</p>
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
