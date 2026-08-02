import test from 'node:test';
import assert from 'node:assert/strict';

import {
  deriveGridForBox,
  snapSpanToTracks,
} from '../dist/core/sizing.js';

// css-doodle lays a grid out as `repeat(n, 1fr)`. A container that isn't
// divisible by n puts every cell boundary on a sub-pixel and the browser
// draws a hairline seam at each one, so the canvas is rounded up to a whole
// multiple of the track count and the host clips the remainder.

test('snapSpanToTracks returns whole tracks', async (t) => {
  await t.test('leaves an already-divisible span alone', () => {
    assert.equal(snapSpanToTracks(1440, 12), 1440);
    assert.equal(snapSpanToTracks(648, 9), 648);
  });

  await t.test('rounds up to the next whole multiple', () => {
    assert.equal(snapSpanToTracks(1441, 12), 1452);
    assert.equal(snapSpanToTracks(1000, 7), 1001);
  });

  await t.test('every track is a whole pixel', () => {
    for (let span = 1; span <= 2000; span += 7) {
      for (const tracks of [1, 3, 7, 12, 22, 36, 64]) {
        const snapped = snapSpanToTracks(span, tracks);

        assert.equal(
          snapped % tracks,
          0,
          `${span}/${tracks} -> ${snapped} is not a whole number of tracks`
        );
        assert.ok(snapped >= span, `${snapped} must still cover ${span}`);
        assert.ok(
          snapped - span < tracks,
          `overflow ${snapped - span} must stay under one cell (${tracks} tracks)`
        );
      }
    }
  });

  await t.test('degenerate spans and track counts stay finite', () => {
    assert.equal(snapSpanToTracks(0, 8), 0);
    assert.equal(snapSpanToTracks(-10, 8), 0);
    assert.equal(snapSpanToTracks(100, 0), 100);
  });
});

test('a snapped box divides evenly by its derived grid', () => {
  // The boxes that showed seams on the showcase pages: full-width bands and
  // content-height section fields at common viewport widths.
  const boxes = [
    [1440, 240],
    [1440, 355.78],
    [1280, 419],
    [1024, 613],
    [768, 297],
    [390, 812],
  ];

  for (const [width, height] of boxes) {
    for (const cell of [36, 48, 72, 104, 120, 144]) {
      const { cols, rows } = deriveGridForBox(width, height, cell);

      assert.equal(snapSpanToTracks(width, cols) % cols, 0);
      assert.equal(snapSpanToTracks(height, rows) % rows, 0);
    }
  }
});
