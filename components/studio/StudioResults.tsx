'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { TabbiedPattern } from 'tabbied/react';
import { isPatternSlug, patterns } from 'tabbied/patterns';
import { apiFetch, ApiError, apiUrl } from 'lib/apiFetch';
import { useSessionUser } from 'lib/authClient';
import { matchDirections, type StudioEntry } from 'lib/studioMatch';
import styles from './StudioResults.module.css';

// One page, two sources.
//
//   ?q=<description>  the matcher — scored in the browser, instant, offline,
//                     and a pure function of the text, which is what made it
//                     shareable.
//   ?g=<id>           a stored generation — an LLM answer is not reproducible,
//                     so shareability moved into storage. The id is the
//                     capability; the read needs no session.
//
// Both arrive as the same card shape, so everything below this point is
// indifferent to which one produced it.

const SWATCHES = 4;

/** The card fields, however they were produced. */
type Direction = {
  slug: string;
  name: string;
  patternSlug: string;
  patternName: string;
  paletteName: string;
  palette: string[];
  descriptors: string[];
  stance?: string;
  why?: string;
  copy?: { brandName: string; headline: string; tagline: string } | null;
  image?: string | null;
  reasons?: string[];
};

type Stored = {
  id: string;
  description: string;
  result: {
    source: 'ai' | 'matched-fallback';
    recommended: number;
    directions: Direction[];
  };
};

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
  const query = searchParams.get('q') ?? '';
  const generationId = searchParams.get('g');

  const { user } = useSessionUser();

  const [stored, setStored] = useState<Stored | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [imaging, setImaging] = useState<number | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    if (!generationId) {
      setStored(null);
      return;
    }

    let live = true;
    setStored(null);
    setLoadError(null);

    apiFetch<Stored>(`/api/studio/generations/${generationId}`)
      .then((body) => {
        if (live) {
          setStored(body);
        }
      })
      .catch((cause) => {
        if (live) {
          setLoadError(
            cause instanceof ApiError && cause.status === 404
              ? 'That link has expired or never existed.'
              : 'Could not load these results.'
          );
        }
      });

    return () => {
      live = false;
    };
  }, [generationId]);

  const matched = useMemo(
    () => (generationId ? [] : matchDirections(entries, query)),
    [entries, query, generationId]
  );

  const directions: Direction[] = generationId
    ? (stored?.result.directions ?? [])
    : matched;

  const description = generationId ? (stored?.description ?? '') : query;
  const loading = Boolean(generationId) && !stored && !loadError;

  /** Imagery is per direction and on request — never three up front. */
  const generateImage = useCallback(
    async (index: number) => {
      if (!generationId || !stored) {
        return;
      }

      setImaging(index);
      setImageError(null);

      try {
        const { key } = await apiFetch<{ key: string }>(
          '/api/studio/direction-image',
          {
            method: 'POST',
            body: JSON.stringify({ generationId, index }),
          }
        );

        setStored((previous) => {
          if (!previous) {
            return previous;
          }

          const directionsNext = previous.result.directions.map((direction, i) =>
            i === index ? { ...direction, image: key } : direction
          );

          return {
            ...previous,
            result: { ...previous.result, directions: directionsNext },
          };
        });
      } catch (cause) {
        setImageError(
          cause instanceof ApiError ? cause.message : 'Could not make an image.'
        );
      } finally {
        setImaging(null);
      }
    },
    [generationId, stored]
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

      {/* A generation that fell back is still three real sites; saying so is
          cheaper than pretending the model chose them. */}
      {stored?.result.source === 'matched-fallback' ? (
        <p className={styles.notice}>
          The model didn&rsquo;t return a usable answer, so these are the
          library&rsquo;s own best matches.
        </p>
      ) : null}

      {loadError ? (
        <p className={styles.notice} role="alert">
          {loadError}{' '}
          <Link href="/studio" className={styles.back}>
            Start again
          </Link>
          .
        </p>
      ) : null}

      <div className={styles.cards}>
        {loading
          ? [0, 1, 2].map((i) => (
              <article key={i} className={styles.card} aria-hidden="true">
                <div className={styles.meta}>
                  <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
                  <div className={`${styles.skeleton} ${styles.skeletonLine}`} />
                </div>
                <div className={styles.body}>
                  <div className={`${styles.skeleton} ${styles.skeletonPreview}`} />
                </div>
              </article>
            ))
          : directions.map((direction, index) => (
              <article key={direction.slug} className={styles.card}>
                <div className={styles.meta}>
                  <h2 className={styles.name}>
                    {direction.stance ?? direction.name}
                  </h2>
                  <p className={styles.descriptors}>
                    {direction.copy?.brandName
                      ? `${direction.copy.brandName} · ${direction.name}`
                      : direction.descriptors.join(' · ')}
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

                  {direction.why ? (
                    <p className={styles.why}>{direction.why}</p>
                  ) : null}

                  {direction.reasons?.length ? (
                    <p className={styles.reasons}>
                      Matched on {direction.reasons.join(', ')}
                    </p>
                  ) : null}
                </div>

                <div className={styles.body}>
                  {direction.copy ? (
                    <p className={styles.headline}>{direction.copy.headline}</p>
                  ) : null}

                  <div className={styles.preview}>
                    {direction.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className={styles.previewImage}
                        src={apiUrl(`/api/media/${direction.image}`)}
                        alt=""
                      />
                    ) : (
                      <DirectionPreview
                        patternSlug={direction.patternSlug}
                        palette={direction.palette}
                        seed={direction.slug}
                      />
                    )}
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

                    {/* Only on your own generation: an image costs money, and
                        the capability link is a read grant, not a spend one. */}
                    {generationId && stored && user && !direction.image ? (
                      <button
                        type="button"
                        className={styles.imageButton}
                        disabled={imaging !== null}
                        onClick={() => void generateImage(index)}
                      >
                        {imaging === index ? 'Making…' : 'Generate imagery'}
                      </button>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
      </div>

      {imageError ? (
        <p className={styles.notice} role="alert">
          {imageError}
        </p>
      ) : null}
    </div>
  );
}
