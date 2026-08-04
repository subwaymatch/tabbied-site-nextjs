'use client';

import { useEffect, useRef, useState } from 'react';
import { TabbiedPattern } from 'tabbied/react';
import type { PatternDefinition } from 'tabbied';

/**
 * A directory tile that mounts its css-doodle only when it nears the viewport,
 * so an index of twenty live patterns doesn't pay for all of them on load.
 * Until then it shows the site's background color, which keeps the grid
 * reading as complete while scrolling.
 */
export default function LazyTile({
  pattern,
  palette,
  seed,
}: {
  pattern: PatternDefinition;
  palette: string[];
  seed: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[entries.length - 1].isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: '350px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ width: '100%', height: '100%', backgroundColor: palette[0] }}
    >
      {near && (
        <TabbiedPattern
          pattern={pattern}
          palette={palette}
          seed={seed}
          fit="cover"
          style={{ width: '100%', height: '100%' }}
        />
      )}
    </div>
  );
}
