'use client';

import { useEffect, useRef, useState } from 'react';
import { TabbiedPattern } from 'tabbied/react';
import type { PatternDefinition } from 'tabbied';

// How far outside the viewport a tile starts rendering. Generous enough that
// normal scrolling never catches an unmounted tile, small enough that the
// initial load only pays for the first screenful.
const MOUNT_MARGIN = '400px';

/**
 * A gallery tile that builds its pattern only once it approaches the viewport,
 * then keeps it mounted. The page carries twenty of these, and rendering them
 * all on load means thousands of cells competing for the main thread before
 * anything is on screen. Until a tile mounts it shows its own background color,
 * so the grid still reads as complete while scrolling.
 *
 * The same treatment the main /patterns gallery uses (see
 * components/select-pattern-page/GalleryDoodle.tsx).
 */
export default function LazyPattern({
  pattern,
  palette,
  seed,
}: {
  pattern: PatternDefinition;
  palette: string[];
  seed: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [approached, setApproached] = useState(false);

  useEffect(() => {
    const el = frameRef.current;

    if (!el) {
      return;
    }

    // Already near the viewport on load (the first rows): mount immediately
    // rather than waiting for the observer's first callback.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[entries.length - 1].isIntersecting) {
          setApproached(true);
          observer.disconnect();
        }
      },
      { rootMargin: MOUNT_MARGIN }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={frameRef}
      style={{ width: '100%', height: '100%', backgroundColor: palette[0] }}
    >
      {approached && (
        <TabbiedPattern
          pattern={pattern}
          palette={palette}
          seed={seed}
          fit="cover"
          density={2}
          style={{ width: '100%', height: '100%' }}
        />
      )}
    </div>
  );
}
