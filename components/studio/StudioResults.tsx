'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { TabbiedPattern } from 'tabbied/react';
import { isPatternSlug, patterns } from 'tabbied/patterns';
import { matchDirections, type StudioEntry } from 'lib/studioMatch';
import styles from './StudioResults.module.css';

// Three real template sites, matched to the description in the query string.
// Every card leads somewhere that already exists: Preview opens the site's own
// page, Download is the zip the build packages for it.

/** How many swatches of a palette the card shows. */
const SWATCHES = 4;

function DirectionPreview({
  patternSlug,
  palette,
  seed,
}: {
  patternSlug: string;
  palette: string[];
  seed: string;
}) {
  if (!isPatternSlug(patternSlug)) {
    return <div className={styles.previewFallback} />;
  }

  return (
    <TabbiedPattern
      pattern={patterns[patternSlug]}
      palette={palette}
      seed={seed}
      fit="cover"
      density={2}
      style={{ width: '100%', height: '100%' }}
    />
  );
}

export default function StudioResults({ entries }: { entries: StudioEntry[] }) {
  const searchParams = useSearchParams();
  const description = searchParams.get('q') ?? '';

  const directions = useMemo(
    () => matchDirections(entries, description),
    [entries, description]
  );

  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Three websites, ready to use</h1>
      <p className={styles.lede}>
        Preview and download any &mdash; or all &mdash; of these. Want other
        options?{' '}
        <Link href="/studio" prefetch={false} className={styles.back}>
          Go back
        </Link>{' '}
        and describe it differently.
      </p>

      {description ? (
        <p className={styles.echo}>
          <span className={styles.echoLabel}>You described</span>
          {description}
        </p>
      ) : null}

      <div className={styles.cards}>
        {directions.map((direction) => (
          <article key={direction.slug} className={styles.card}>
            <div className={styles.meta}>
              <h2 className={styles.name}>{direction.name}</h2>
              <p className={styles.descriptors}>
                {direction.descriptors.join(' · ')}
              </p>

              <div className={styles.swatches} aria-hidden="true">
                {direction.palette.slice(0, SWATCHES).map((color) => (
                  <span key={color} style={{ background: color }} />
                ))}
              </div>

              <p className={styles.recipe}>
                {direction.patternName}
                <br />
                {direction.paletteName}
              </p>

              {/* Only shown when the description actually drove the choice —
                  with nothing to go on, the three are simply a spread. */}
              {direction.reasons.length ? (
                <p className={styles.reasons}>
                  Matched on {direction.reasons.join(', ')}
                </p>
              ) : null}
            </div>

            <div className={styles.body}>
              <div className={styles.preview}>
                <DirectionPreview
                  patternSlug={direction.patternSlug}
                  palette={direction.palette}
                  seed={direction.slug}
                />
              </div>

              <div className={styles.actions}>
                <Link
                  href={`/template/${direction.slug}/`}
                  prefetch={false}
                  className={styles.action}
                >
                  <span className={styles.disc} aria-hidden="true">
                    <span className={styles.eye} />
                  </span>
                  <span>Preview</span>
                </Link>

                <a
                  href={`/downloads/${direction.slug}-html.zip`}
                  className={styles.action}
                  download
                >
                  <span className={styles.disc} aria-hidden="true">
                    &darr;
                  </span>
                  <span>Download</span>
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
