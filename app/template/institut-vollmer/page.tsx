import { TabbiedPattern } from 'tabbied/react';
import { dotmatrix, moire, perforate, subdivide } from 'tabbied/patterns';
import { Figure } from 'components/Figure';
import s from './institut-vollmer.module.css';

export const metadata = {
  title: 'Institut Vollmer: materials research, Basel',
  description:
    'Institut Vollmer is an independent materials research institute founded in 1951. Four research programmes, 148 staff, 112 peer-reviewed papers in 2025, and contract testing for industry.',
};

/* Six house colours. Every pattern field on the page is drawn from this set
   and no other: the fields differ only in which of the six leads. */
const WHITE = '#FFFFFF';
const INK = '#1A1A1A';
const BLUE = '#0B4EE0';
const STEEL = '#9AA0A6';
const PALE = '#E9EBEE';
const GRAPHITE = '#4A4F55';

/* Background first. Each field is a reordering or subset of the six above:
   blue leads only where the accent is meant to be read. */
const FIELD_STRIP = [WHITE, BLUE, STEEL, PALE, GRAPHITE, INK];
const FIELD_RESEARCH = [WHITE, PALE, STEEL, GRAPHITE];
const FIELD_INSTRUMENT = [PALE, STEEL, BLUE, GRAPHITE];
const FIELD_PEOPLE = [WHITE, BLUE, STEEL, PALE];
const FIELD_SAMPLES = [WHITE, PALE, STEEL, GRAPHITE];
const FIELD_DARK = [INK, BLUE, GRAPHITE, STEEL];

const NAV = [
  { no: '01', label: 'Research', href: '#research' },
  { no: '02', label: 'Facilities', href: '#facilities' },
  { no: '03', label: 'Publications', href: '#publications' },
  { no: '04', label: 'People', href: '#people' },
  { no: '05', label: 'Industry', href: '#industry' },
  { no: '06', label: 'Figures', href: '#figures' },
  { no: '07', label: 'Contact', href: '#contact' },
];

const AREAS = [
  {
    key: 'A',
    title: 'Fatigue and fracture',
    lead: 'Metals under cyclic load, from 10³ to 10⁹ cycles.',
    body: 'Crack initiation and closure in wrought and additively manufactured steels, with variable amplitude spectra taken from real service records rather than laboratory blocks. The programme runs three servohydraulic rigs continuously and publishes its raw load histories.',
    facts: [
      ['Head', 'Dr Katrin Reuss'],
      ['Started', '1974'],
      ['Staff', '21, of which 9 doctoral'],
      ['Funding to', '2029'],
    ],
  },
  {
    key: 'B',
    title: 'Thin films and coatings',
    lead: 'Adhesion, residual stress and wear at thicknesses below 5 µm.',
    body: 'Physical and chemical vapour deposition on tool steels, glass and polymer substrates. Work concentrates on the failure of the interface rather than on the film itself, using nanoindentation, scratch testing and cross-sectional microscopy.',
    facts: [
      ['Head', 'Prof. Samuel Ndiaye'],
      ['Started', '1996'],
      ['Staff', '18, of which 7 doctoral'],
      ['Funding to', '2028'],
    ],
  },
  {
    key: 'C',
    title: 'Polymer ageing',
    lead: 'Thermal, oxidative and photochemical degradation over decades.',
    body: 'Accelerated ageing correlated against field samples recovered from buildings, vehicles and buried pipe. The institute holds a reference archive of 2,900 dated specimens, the oldest exposed in 1963, and adds roughly 60 a year.',
    facts: [
      ['Head', 'Dr Miriam Aeberhard'],
      ['Started', '1963'],
      ['Staff', '16, of which 6 doctoral'],
      ['Funding to', '2030'],
    ],
  },
  {
    key: 'D',
    title: 'Structural ceramics',
    lead: 'Silicon carbide and nitride above 1,200 °C.',
    body: 'Creep, oxidation and thermal shock in components for energy conversion. The group maintains the only four-point bend rig in the region certified for testing at 1,450 °C in controlled atmosphere, and shares it with two universities.',
    facts: [
      ['Head', 'Dr Ilya Brunner'],
      ['Started', '2008'],
      ['Staff', '12, of which 5 doctoral'],
      ['Funding to', '2029'],
    ],
  },
];

const FACILITIES = [
  {
    name: 'Scanning electron microscope',
    detail: 'Field emission, EDS and EBSD, 0.8 nm at 15 kV',
    year: '2019',
    access: 'Open, booked',
  },
  {
    name: 'Transmission electron microscope',
    detail: '200 kV, STEM and tomography, cryo stage',
    year: '2022',
    access: 'Trained users',
  },
  {
    name: 'Servohydraulic fatigue rigs',
    detail: 'Three frames, 100 / 250 / 630 kN, 0.1 to 50 Hz',
    year: '1988, rebuilt 2021',
    access: 'Staff operated',
  },
  {
    name: 'X-ray diffractometer',
    detail: 'Residual stress and texture, Cr and Cu sources',
    year: '2016',
    access: 'Open, booked',
  },
  {
    name: 'Nanoindenter',
    detail: 'Continuous stiffness, 10 µN to 500 mN, heated stage',
    year: '2020',
    access: 'Trained users',
  },
  {
    name: 'Thermogravimetric analyser',
    detail: 'To 1,600 °C, coupled mass spectrometry',
    year: '2018',
    access: 'Staff operated',
  },
  {
    name: 'Climate chambers',
    detail: 'Six units, −70 to +180 °C, 10 to 98 per cent RH',
    year: '2011 to 2024',
    access: 'Open, booked',
  },
  {
    name: 'Clean room',
    detail: 'ISO class 7, 240 m², deposition and lithography',
    year: '2014',
    access: 'Trained users',
  },
];

const PUBLICATIONS = [
  {
    year: '2026',
    authors: 'Reuss, K., Aeberhard, M., Vollmer, T.',
    title:
      'Crack closure in additively manufactured 316L under variable amplitude loading',
    source: 'International Journal of Fatigue 191, 108441',
  },
  {
    year: '2026',
    authors: 'Halter, P., Ndiaye, S.',
    title: 'Oxide scale spallation on ferritic steels above 750 °C',
    source: 'Corrosion Science 238, 111902',
  },
  {
    year: '2026',
    authors: 'Brunner, I., Sigg, R.',
    title:
      'Creep of pressureless sintered silicon carbide in wet air at 1,400 °C',
    source: 'Journal of the European Ceramic Society 46, 3311',
  },
  {
    year: '2025',
    authors: 'Aeberhard, M., Lutz, C., Perrin, N.',
    title:
      'Sixty-two years of polyethylene: field ageing against the accelerated model',
    source: 'Polymer Degradation and Stability 231, 110724',
  },
  {
    year: '2025',
    authors: 'Ndiaye, S., Bircher, A.',
    title:
      'Residual stress and interface failure in AlTiN coatings on hardened tool steel',
    source: 'Surface and Coatings Technology 496, 130603',
  },
  {
    year: '2025',
    authors: 'Reuss, K., Frei, D.',
    title:
      'A round robin on hydrogen-charged martensitic steel across four laboratories',
    source: 'Materials & Design 249, 112558',
  },
  {
    year: '2024',
    authors: 'Vollmer, T., Sigg, R., Halter, P.',
    title:
      'On the reporting of load spectra: a proposal for minimum disclosure',
    source: 'Engineering Fracture Mechanics 302, 110088',
  },
  {
    year: '2024',
    authors: 'Perrin, N., Aeberhard, M.',
    title:
      'Photo-oxidation of glass fibre reinforced polyamide in alpine exposure',
    source: 'Polymer Testing 138, 108211',
  },
  {
    year: '2024',
    authors: 'Bircher, A., Brunner, I.',
    title: 'Thermal shock of silicon nitride: quenching versus cyclic heating',
    source: 'Ceramics International 50, 27904',
  },
  {
    year: '2023',
    authors: 'Lutz, C., Reuss, K.',
    title:
      'Digital image correlation at the scale of a single grain: limits and artefacts',
    source: 'Experimental Mechanics 63, 1411',
  },
];

const PEOPLE = [
  {
    slug: 'vollmer-researcher-1',
    alt: 'Studio portrait of Dr Katrin Reuss in a white laboratory coat against a grey wall',
    name: 'Dr Katrin Reuss',
    role: 'Head, Fatigue and fracture',
    body: 'At the institute since 2011. Chairs the working group on load spectrum disclosure and teaches the fracture mechanics course at the technical university two afternoons a week.',
  },
  {
    slug: 'vollmer-researcher-2',
    alt: 'Studio portrait of Prof. Samuel Ndiaye in a white laboratory coat and wire-framed glasses',
    name: 'Prof. Samuel Ndiaye',
    role: 'Head, Thin films and coatings',
    body: 'At the institute since 2003, director since 2021. Responsible for the clean room, for the industry programme and for the decision that all raw data leaves the building with the report.',
  },
];

const INDUSTRY = [
  {
    no: '01',
    title: 'Contract testing',
    body: 'Standard mechanical, thermal and microstructural testing to ISO, ASTM and EN methods. Quoted in writing, fixed price, reported within 15 working days.',
  },
  {
    no: '02',
    title: 'Failure analysis',
    body: 'A component arrives, a written cause arrives back. Median turnaround in 2025 was 11 working days. Urgent intake is possible within 48 hours at a surcharge of 40 per cent.',
  },
  {
    no: '03',
    title: 'Joint projects',
    body: 'Two to four years, cost shared, staff seconded in both directions. Twenty-three are running. Results are published after an embargo of no more than twelve months.',
  },
  {
    no: '04',
    title: 'Instrument access',
    body: 'Booked hours on the microscopes, the diffractometer and the climate chambers, with or without an operator. CHF 180 to CHF 420 per hour depending on instrument.',
  },
];

const FIGURES = [
  { value: 'CHF 24.6 m', label: 'Operating budget, 2025' },
  { value: '148', label: 'Staff, of which 63 doctoral' },
  { value: '112', label: 'Peer-reviewed papers, 2025' },
  { value: '87', label: 'Contract projects completed' },
  { value: '61 %', label: 'Income from external sources' },
  { value: '9', label: 'Patent applications filed' },
];

const CONTACT = [
  { label: 'Address', value: 'Nordstrasse 44, 4058 Basel' },
  { label: 'Telephone', value: '+41 61 720 40 00' },
  { label: 'Reception', value: 'Mon to Fri, 08.00–17.00' },
  { label: 'Sample intake', value: 'Mon to Thu, 09.00–15.00' },
  { label: 'Tram', value: 'Line 8, stop Nordstrasse' },
  { label: 'Rail', value: 'Basel Badischer Bahnhof, 12 minutes on foot' },
  { label: 'Deliveries', value: 'Gate 2, Hafenweg, 07.00–16.00' },
  { label: 'Visitors', value: 'Photographic identification at reception' },
];

function LabelColumn({
  no,
  label,
  note,
}: {
  no: string;
  label: string;
  note: string;
}) {
  return (
    <div className={s.labelCol}>
      <p className={s.labelNo}>{no}</p>
      <p className={s.labelName}>{label}</p>
      <p className={s.labelNote}>{note}</p>
    </div>
  );
}

export default function InstitutVollmerPage() {
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
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..800&display=swap"
      />

      <header className={s.masthead}>
        <div className={s.wrap}>
          <div className={s.grid}>
            <p className={s.wordmark}>Institut Vollmer</p>
            <p className={s.mastheadMeta}>
              Materials research since 1951
              <br />
              Nordstrasse 44, 4058 Basel
            </p>
            <nav className={s.nav} aria-label="Sections">
              <ul>
                {NAV.map((item) => (
                  <li key={item.no}>
                    <a href={item.href}>
                      <span className={s.navNo}>{item.no}</span> {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main>
        {/* Hero statement */}
        <section className={s.hero} aria-labelledby="t-hero">
          <div className={s.wrap}>
            <div className={s.grid}>
              <LabelColumn
                no="00"
                label="Statement"
                note="Independent foundation, Basel, established 1951"
              />
              <h1 id="t-hero" className={s.heroTitle}>
                Materials fail in ways that are boring, repeatable and worth
                measuring properly.
              </h1>
              <p className={s.lead}>
                Institut Vollmer tests metals, coatings, polymers and ceramics
                for anyone willing to pay for an honest number. We are a
                foundation, not a department. Four research programmes, 148
                staff, and a rule that raw data leaves the building with every
                report.
              </p>
              <p className={s.heroActions}>
                <a className={s.button} href="#industry">
                  Work with the institute
                </a>
                <a className={s.textLink} href="#publications">
                  Recent publications
                </a>
              </p>
            </div>
          </div>
          <div className={s.heroImage}>
            <Figure
              slug="vollmer-hero"
              alt="A materials testing hall at Institut Vollmer, load frames in a row under high windows"
              priority
              className={s.bleedPhoto}
            />
          </div>
          <div className={s.strip}>
            <div className={`${s.stripField} ${s.fieldWhite}`} aria-hidden="true">
              <TabbiedPattern
                pattern={perforate}
                palette={FIELD_STRIP}
                seed="iv-strip-1"
                fit="cover"
                options={{ grid: '10x15', frequency: 0.85 }}
                style={{ position: 'absolute', inset: 0 }}
              />
            </div>
          </div>
        </section>

        {/* 01 Research areas */}
        <section id="research" className={s.section} aria-labelledby="t-research">
          <div className={s.wrap}>
            <div className={s.grid}>
              <LabelColumn
                no="01"
                label="Research"
                note="Four programmes, reviewed every five years"
              />
              <h2 id="t-research" className={s.sectionTitle}>
                Four programmes. No fifth one until one of these closes.
              </h2>
            </div>

            {AREAS.map((area) => (
              <div key={area.key} className={`${s.grid} ${s.areaRow}`}>
                <div className={s.areaKey}>
                  <p className={s.areaLetter}>{area.key}</p>
                  <h3>{area.title}</h3>
                </div>
                <div className={s.areaBody}>
                  <p className={s.areaLead}>{area.lead}</p>
                  <p>{area.body}</p>
                </div>
                <dl className={s.areaFacts}>
                  {area.facts.map(([k, v]) => (
                    <div key={k} className={s.factRow}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}

            <div className={`${s.grid} ${s.researchFigures}`}>
              <figure className={s.researchPhoto}>
                <Figure
                  slug="vollmer-microscopy"
                  alt="A researcher at the scanning electron microscope, screens showing a fracture surface"
                  className={s.photo}
                />
                <figcaption className={s.caption}>
                  Fig. 1. The scanning electron microscope in Hall B. A 316L
                  specimen goes on the stage at 15 kV after 4.1 million cycles.
                </figcaption>
              </figure>
              <figure className={s.researchArt}>
                <Figure
                  slug="vollmer-porosity"
                  alt="A greyscale micrograph of a polished cross-section scattered with dark pores"
                  className={s.photo}
                />
                <figcaption className={s.caption}>
                  Fig. 2. Porosity in the same specimen, imaged after sectioning.
                  Every dark mark is a void.
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* 02 Facilities */}
        <section
          id="facilities"
          className={s.section}
          aria-labelledby="t-facilities"
        >
          <div className={s.wrap}>
            <div className={s.grid}>
              <LabelColumn
                no="02"
                label="Facilities"
                note="Eight principal instruments, all bookable"
              />
              <h2 id="t-facilities" className={s.sectionTitle}>
                Instruments, what they do, and when they were installed.
              </h2>

              <ul className={s.facilities}>
                {FACILITIES.map((f) => (
                  <li key={f.name} className={s.facility}>
                    <span className={s.facName}>{f.name}</span>
                    <span className={s.facDetail}>{f.detail}</span>
                    <span className={`${s.facYear} ${s.tabular}`}>{f.year}</span>
                    <span className={s.facAccess}>{f.access}</span>
                  </li>
                ))}
              </ul>

              <p className={s.facilitiesNote}>
                Hourly rates and the booking calendar are published at the
                reception desk and revised each January. Academic users from
                partner institutions pay the marginal cost of consumables only.
              </p>
              <div className={s.instrumentStage}>
                <div className={`${s.stageField} ${s.fieldPale}`} aria-hidden="true">
                  <TabbiedPattern
                    pattern={moire}
                    palette={FIELD_INSTRUMENT}
                    seed="iv-instrument-3"
                    fit="cover"
                    options={{ grid: '4x6', frequency: 0.9 }}
                    style={{ position: 'absolute', inset: 0 }}
                  />
                </div>
                <span className={s.veil} aria-hidden="true" />
                <Figure
                  slug="vollmer-instrument-cutout"
                  cutout
                  alt="A benchtop testing instrument with a sample stage, cut out against the pattern field"
                  className={s.cutoutPhoto}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 03 Publications */}
        <section
          id="publications"
          className={s.section}
          aria-labelledby="t-publications"
        >
          <div className={s.wrap}>
            <div className={s.grid}>
              <LabelColumn
                no="03"
                label="Publications"
                note="Ten of 112 papers, 2023 to 2026"
              />
              <h2 id="t-publications" className={s.sectionTitle}>
                Selected publications.
              </h2>
              <p className={s.sectionNote}>
                Every paper below is deposited open access within six months of
                acceptance. Underlying data is deposited at the same time.
              </p>
            </div>

            <span className={s.rule} aria-hidden="true" />

            <ol className={s.publications}>
              {PUBLICATIONS.map((p, i) => (
                <li key={`${p.year}-${i}`} className={s.publication}>
                  <span className={`${s.pubYear} ${s.tabular}`}>{p.year}</span>
                  <span className={s.pubTitle}>{p.title}</span>
                  <span className={s.pubAuthors}>{p.authors}</span>
                  <span className={s.pubSource}>{p.source}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 04 People */}
        <section id="people" className={s.section} aria-labelledby="t-people">
          <div className={s.wrap}>
            <div className={s.grid}>
              <LabelColumn
                no="04"
                label="People"
                note="148 staff, 22 nationalities, 63 doctoral"
              />
              <h2 id="t-people" className={s.sectionTitle}>
                Programme heads.
              </h2>
            </div>
            <div className={`${s.grid} ${s.peopleRow}`}>
              {PEOPLE.map((p, i) => (
                <article
                  key={p.name}
                  className={i === 0 ? s.personA : s.personB}
                >
                  <div className={s.portraitFrame}>
                    <Figure slug={p.slug} alt={p.alt} className={s.portrait} />
                  </div>
                  <h3>{p.name}</h3>
                  <p className={s.personRole}>{p.role}</p>
                  <p>{p.body}</p>
                </article>
              ))}
              <figure className={s.peopleArt}>
                <Figure
                  slug="vollmer-team"
                  alt="Four researchers in white coats in conversation around a laboratory bench"
                  className={s.photo}
                />
                <figcaption className={s.caption}>
                  Fig. 3. The fatigue group at the Tuesday bench review. Ninety-two
                  of the 148 staff sit in one programme; the rest work across all four.
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* 05 Industry */}
        <section id="industry" className={s.section} aria-labelledby="t-industry">
          <div className={s.wrap}>
            <div className={s.grid}>
              <LabelColumn
                no="05"
                label="Industry"
                note="Ninety-one companies, 23 joint projects running"
              />
              <h2 id="t-industry" className={s.sectionTitle}>
                Four ways to use the institute.
              </h2>

              <ol className={s.industryList}>
                {INDUSTRY.map((item) => (
                  <li key={item.no}>
                    <span className={s.industryNo}>{item.no}</span>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </li>
                ))}
              </ol>

              <p className={s.industryTerms}>
                Terms are the same for every client: fixed price, written scope,
                no exclusivity beyond twelve months, and no result withheld
                because it is unwelcome. Contracts that require otherwise are
                declined, which happened four times in 2025.
              </p>
              <div className={s.samplesStage}>
                <div className={`${s.stageField} ${s.fieldWhite}`} aria-hidden="true">
                  <TabbiedPattern
                    pattern={subdivide}
                    palette={FIELD_SAMPLES}
                    seed="iv-samples-5"
                    fit="cover"
                    options={{ grid: '8x12', frequency: 0.85 }}
                    style={{ position: 'absolute', inset: 0 }}
                  />
                </div>
                <span className={s.veil} aria-hidden="true" />
                <Figure
                  slug="vollmer-samples-cutout"
                  cutout
                  alt="A row of prepared metal test coupons, cut out against the pattern field"
                  className={s.cutoutPhoto}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 06 Annual figures */}
        <section id="figures" className={s.section} aria-labelledby="t-figures">
          <div className={s.wrap}>
            <div className={s.grid}>
              <LabelColumn
                no="06"
                label="Figures"
                note="Financial year 2025, audited March 2026"
              />
              <h2 id="t-figures" className={s.sectionTitle}>
                The year in six numbers.
              </h2>
              <ul className={s.figuresList}>
                {FIGURES.map((f) => (
                  <li key={f.label}>
                    <span className={s.figureValue}>{f.value}</span>
                    <span className={s.figureLabel}>{f.label}</span>
                  </li>
                ))}
              </ul>
              <p className={s.figuresNote}>
                The full annual report, 64 pages including the auditor&rsquo;s
                statement and every project title, is available on request and
                is posted to members of the foundation council each April.
              </p>
            </div>
          </div>
        </section>

        {/* 07 Contact */}
        <section id="contact" className={s.section} aria-labelledby="t-contact">
          <div className={s.wrap}>
            <div className={s.grid}>
              <LabelColumn
                no="07"
                label="Contact"
                note="Reception, sample intake and deliveries"
              />
              <h2 id="t-contact" className={s.sectionTitle}>
                Where we are.
              </h2>
              <dl className={s.contactList}>
                {CONTACT.map((row) => (
                  <div key={row.label} className={s.factRow}>
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
              <figure className={s.contactPhoto}>
                <Figure
                  slug="vollmer-building"
                  alt="The Institut Vollmer building, a low concrete laboratory block with a long band of glazing"
                  className={s.photo}
                />
                <figcaption className={s.caption}>
                  Nordstrasse 44, built 1968, laboratory wing added 2014.
                </figcaption>
              </figure>
              <p className={s.contactMail}>
                <a href="mailto:kontakt@institut-vollmer.ch">
                  kontakt@institut-vollmer.ch
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className={s.footer}>
        <div className={s.wrap}>
          <div className={s.grid}>
            <div className={s.footBrand}>
              <p className={s.footWordmark}>Institut Vollmer</p>
              <p>
                Nordstrasse 44
                <br />
                4058 Basel
                <br />
                Switzerland
              </p>
            </div>
            <div className={s.footContact}>
              <p className={s.footLabel}>Enquiries</p>
              <p>
                <a href="tel:+41617204000">+41 61 720 40 00</a>
                <br />
                <a href="mailto:kontakt@institut-vollmer.ch">
                  kontakt@institut-vollmer.ch
                </a>
                <br />
                Mon to Fri, 08.00–17.00
              </p>
            </div>
            <div className={s.footColophon}>
              <p className={s.footLabel}>Colophon</p>
              <p>
                Stiftung Institut Vollmer, established 1951 by Anna Vollmer
                (1899–1981). Registered as a non-profit foundation under federal
                supervision. Set in Inter. Pattern fields generated with
                Tabbied.
              </p>
            </div>
            <div className={s.footArt}>
              <div className={`${s.artField} ${s.fieldInk}`} aria-hidden="true">
                <TabbiedPattern
                  pattern={dotmatrix}
                  palette={FIELD_DARK}
                  seed="iv-foot-6"
                  fit="cover"
                  options={{ grid: '6x9', frequency: 0.55 }}
                  style={{ position: 'absolute', inset: 0 }}
                />
              </div>
            </div>
            <span className={s.ruleLight} aria-hidden="true" />
            <p className={s.footFine}>
              A fictional institute, built to demonstrate Tabbied pattern
              fields. Names, figures and publications are invented.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
