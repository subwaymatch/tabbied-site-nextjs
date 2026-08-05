import Link from 'next/link';
import LazyPattern from 'components/LazyPattern';
import { TEMPLATE_SITES } from 'components/template/templateData';
import { NEW_TEMPLATE_SITES } from 'lib/templateSites';
import SectionHead from './SectionHead';
import s from './home.module.css';

const TOTAL = TEMPLATE_SITES.length + NEW_TEMPLATE_SITES.length;

// Six sites, picked for how far apart their palettes sit — the point of the
// band is that one component carries wildly different moods.
const PICKS = [
  'kubus',
  'mistral-cycles',
  'maison-ambre',
  'hopscotch-museum',
  'tiefsee',
  'oxbow-workshop',
];

const FEATURED = PICKS.map((slug) => {
  const site = NEW_TEMPLATE_SITES.find((x) => x.slug === slug);

  if (!site) {
    // A renamed or retired template should fail the build, not quietly leave a
    // hole in the band.
    throw new Error(`Unknown template site in the home showcase: ${slug}`);
  }

  return site;
});

export default function TemplateShowcase() {
  return (
    <section className={s.section}>
      <SectionHead
        index="03"
        title="Whole sites, built on one component"
        note={
          <>
            {TOTAL} sample websites, each designed around a single Tabbied
            pattern and one palette. Open any of them, or download the same page
            as plain HTML or as a React project.
          </>
        }
        aside={
          <Link href="/templates/" className={s.sectionLink} prefetch={false}>
            All {TOTAL} templates
            <span aria-hidden="true">→</span>
          </Link>
        }
      />

      <div className={s.templateGrid}>
        {FEATURED.map((site) => (
          <Link
            key={site.slug}
            href={`/template/${site.slug}/`}
            className={s.templateCard}
          >
            <div className={s.templateTile}>
              <LazyPattern
                pattern={site.pattern}
                palette={site.palette}
                seed={site.seed}
              />
            </div>
            <div className={s.templateMeta}>
              <h3>{site.name}</h3>
              <p>{site.topic}</p>
              <span className={s.swatches} aria-hidden="true">
                {site.palette.map((color) => (
                  <i key={color} style={{ background: color }} />
                ))}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
