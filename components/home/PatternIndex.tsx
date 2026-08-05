import Link from 'next/link';
import { getGalleryItems } from 'lib/pattern';
import GalleryDoodle from 'components/select-pattern-page/GalleryDoodle';
import SectionHead from './SectionHead';
import s from './home.module.css';

// Eleven designs plus the "view all" tile fills two rows of six (and lands
// evenly at four and two columns as well).
const BROWSE_COUNT = 11;

/**
 * The home page's slice of the gallery: live thumbnails in their authored
 * palettes, numbered like an index. The hero is deliberately monochrome, so
 * this is where the page gets its colour.
 */
export default async function PatternIndex() {
  const all = await getGalleryItems();
  const gallery = all.slice(0, BROWSE_COUNT);

  return (
    <section className={s.section} id="section-browse-pattern">
      <SectionHead
        index="02"
        title="Pick a design and start doodling"
        note={
          <>
            {all.length} designs, each one a generative composition rather than
            a static image. Shown here in the colours they were authored in;
            every one of them recolours to your palette.
          </>
        }
        aside={
          <Link href="/patterns/" className={s.sectionLink} prefetch={false}>
            All {all.length} designs
            <span aria-hidden="true">→</span>
          </Link>
        }
      />

      <div className={s.patternGrid}>
        {gallery.map((item, i) => (
          /* The seed param matches the gallery's own links: the editor only
             mirrors customizations into the URL (making them shareable and
             refresh-safe) when the URL already carries a query param.
             prefetch={false} keeps the grid from firing an edge request per
             visible card. */
          <Link
            key={item.slug}
            href={`/patterns/${item.slug}?seed=0000`}
            prefetch={false}
            className={s.patternCard}
          >
            <div className={s.patternTile}>
              <GalleryDoodle item={item} />
            </div>
            <div className={s.patternMeta}>
              <span className={s.patternIndex}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3>{item.name}</h3>
            </div>
          </Link>
        ))}

        {/* The gallery page's payload embeds every design's source, so its
            prefetch is the heaviest single request on the site. */}
        <Link href="/patterns/" prefetch={false} className={s.patternCardAll}>
          <div className={s.patternTile}>
            <span className={s.allInner}>
              View all
              <span aria-hidden="true">→</span>
            </span>
          </div>
          <div className={s.patternMeta}>
            <span className={s.patternIndex}>{all.length}</span>
            <h3>Designs</h3>
          </div>
        </Link>
      </div>
    </section>
  );
}
