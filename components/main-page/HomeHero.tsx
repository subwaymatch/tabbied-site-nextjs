'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import useMediaQuery from 'lib/useMediaQuery';
import {
  PALETTE_ACCENTS,
  PALETTE_CYCLE,
  TIMING,
  randomMarginCell,
  randomSilhouette,
  reshuffle,
  seededRandom,
  stopForCell,
  type MarginCell,
} from './homeMotion';
import styles from './HomeHero.module.css';

// The hero and the stats strip are one component because they share a clock:
// the palette that recolors the skyline is the same one that tints the three
// numbers underneath it. Splitting them would mean two timers drifting apart.

const COLS = 10;
const ROWS = 3;
const SKYLINE_CELLS = COLS * ROWS;
const MARGIN_CELLS = 8;

/** Arbitrary but fixed, so the prerendered grid and the hydrated one agree. */
const SEED = 0x7abb1ed;

function initialState() {
  const rand = seededRandom(SEED);
  const palette = PALETTE_CYCLE[0];

  return {
    skyline: Array.from({ length: SKYLINE_CELLS }, () => randomSilhouette(rand)),
    marginLeft: Array.from({ length: MARGIN_CELLS }, () => randomMarginCell(rand, palette)),
    marginRight: Array.from({ length: MARGIN_CELLS }, () => randomMarginCell(rand, palette)),
  };
}

function MarginColumn({ cells }: { cells: MarginCell[] }) {
  return (
    <div className={styles.marginGrid}>
      {cells.map((cell, i) => (
        <div
          key={i}
          className={styles.marginCell}
          style={{ background: cell.bg, borderRadius: cell.radius, clipPath: cell.clip }}
        />
      ))}
    </div>
  );
}

export default function HomeHero({
  patternCount,
  templateCount,
}: {
  patternCount: number;
  templateCount: number;
}) {
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [paletteIdx, setPaletteIdx] = useState(0);
  const [{ skyline, marginLeft, marginRight }, setGrids] = useState(initialState);

  const palette = PALETTE_CYCLE[paletteIdx];
  const [accentA, accentB] = PALETTE_ACCENTS[palette];

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const paletteTimer = setInterval(() => {
      setPaletteIdx((i) => (i + 1) % PALETTE_CYCLE.length);
    }, TIMING.palette);

    return () => clearInterval(paletteTimer);
  }, [reduceMotion]);

  // Read through a ref rather than a dependency: the cell timer runs three times
  // per palette step, and restarting it on every step would swallow the tick
  // that lands on the changeover.
  const paletteRef = useRef(palette);
  paletteRef.current = palette;

  // Cells are replaced rather than recolored, so a palette change washes through
  // the margins gradually instead of repainting every cell at once.
  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const cellTimer = setInterval(() => {
      const rand = Math.random;
      const current = paletteRef.current;

      setGrids((grids) => ({
        skyline: reshuffle(grids.skyline, 2 + Math.floor(rand() * 3), () =>
          randomSilhouette(rand)
        ),
        marginLeft: reshuffle(grids.marginLeft, 1, () => randomMarginCell(rand, current)),
        marginRight: reshuffle(grids.marginRight, 1, () => randomMarginCell(rand, current)),
      }));
    }, TIMING.cell);

    return () => clearInterval(cellTimer);
  }, [reduceMotion]);

  return (
    <>
      <div className={styles.hero}>
        <div className={`${styles.margin} ${styles.marginLeft}`} aria-hidden="true">
          <MarginColumn cells={marginLeft} />
        </div>
        <div className={`${styles.margin} ${styles.marginRight}`} aria-hidden="true">
          <MarginColumn cells={marginRight} />
        </div>

        <div className={styles.heroPad}>
          <div className={styles.inner}>
            <div className={styles.eyebrowRow}>
              <span className={styles.eyebrow}>About tabbied</span>
              <span className={styles.scrollHint}>(scroll)</span>
            </div>

            <h1 className={styles.title}>
              Free patterns and websites,{' '}
              <span className={styles.titleAccent}>yours to shape.</span>
            </h1>

            <p className={styles.lede}>
              Explore a growing library of {patternCount} customizable patterns
              and {templateCount} free website templates, ready to edit,
              download, and use.
            </p>
          </div>
        </div>

        {/* The skyline runs edge to edge under the headline, fading out at both
            ends so it reads as a slice of something larger. */}
        <div className={styles.skylineRow} aria-hidden="true">
          <div className={styles.skylineGutter} />
          <div className={styles.skyline}>
            {skyline.map((cell, i) => (
              <div
                key={i}
                className={styles.skylineCell}
                style={{
                  background: stopForCell(palette, i % COLS, Math.floor(i / COLS)),
                  borderRadius: cell.radius,
                  clipPath: cell.clip,
                }}
              />
            ))}
          </div>
          <div className={styles.skylineGutter} />
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statsGrid}>
          <Link href="/patterns" prefetch={false} className={styles.stat}>
            <span className={styles.statArrow} aria-hidden="true">
              &rarr;
            </span>
            <span className={styles.statNumber} style={{ color: accentA }}>
              {patternCount}
            </span>
            <span className={styles.statLabel}>Patterns</span>
          </Link>

          <Link href="/templates" prefetch={false} className={styles.stat}>
            <span className={styles.statArrow} aria-hidden="true">
              &rarr;
            </span>
            <span className={styles.statNumber} style={{ color: accentB }}>
              {templateCount}
            </span>
            <span className={styles.statLabel}>Free website templates</span>
          </Link>

          {/* No destination yet — the generator is the "Soon" item in the nav. */}
          <div className={styles.stat}>
            <span className={styles.statNumber}>1</span>
            <span className={styles.statLabel}>Pattern engine</span>
          </div>
        </div>
      </div>
    </>
  );
}
