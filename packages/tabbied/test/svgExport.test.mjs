// Unit tests for the pure computed-value parsers behind the native SVG
// export. Run with `npm test --workspace tabbied` (node --test). The DOM
// walker itself is covered by the Playwright parity suite
// (e2e/svg-export.spec.ts), which diffs rendered exports pixel-by-pixel.
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { _internals } from '../dist/core/svgExport.js';
import { supportsSvgExport } from '../dist/core/types.js';

const {
  splitTopLevel,
  parseRgbColor,
  resolveLength,
  angleToDeg,
  parseTransformMatrix,
  roundedRectPath,
  sectorPath,
  parseConicSectors,
  parseBoxShadows,
} = _internals;

const rgb = (r, g, b, a = 1) => ({ r, g, b, a });
const normalize = (raw) => {
  const parsed = parseRgbColor(raw);
  assert.ok(parsed, `expected an rgb() color, got: ${raw}`);
  return parsed;
};

test('supportsSvgExport defaults to true and honors the flag', () => {
  assert.equal(supportsSvgExport({}), true);
  assert.equal(supportsSvgExport({ svgExport: true }), true);
  assert.equal(supportsSvgExport({ svgExport: false }), false);
});

test('splitTopLevel splits at top-level commas only', () => {
  assert.deepEqual(
    splitTopLevel('linear-gradient(rgb(1, 2, 3), red), none'),
    ['linear-gradient(rgb(1, 2, 3), red)', 'none']
  );
  assert.deepEqual(splitTopLevel('url("a,b"), c'), ['url("a,b")', 'c']);
});

test('parseRgbColor handles computed serializations', () => {
  assert.deepEqual(parseRgbColor('rgb(62, 139, 255)'), rgb(62, 139, 255));
  assert.deepEqual(parseRgbColor('rgba(0, 0, 0, 0.25)'), rgb(0, 0, 0, 0.25));
  assert.deepEqual(parseRgbColor('transparent'), rgb(0, 0, 0, 0));
  assert.equal(parseRgbColor('oklch(0.7 0.1 200)'), null);
});

test('resolveLength resolves percentages against the reference', () => {
  assert.equal(resolveLength('25%', 200), 50);
  assert.equal(resolveLength('12.5px', 999), 12.5);
});

test('resolveLength handles the artworks anti-aliasing calc() ramps', () => {
  // curl-style ramp: calc(42% - 0.5px)
  assert.equal(resolveLength('calc(42% - 0.5px)', 100), 41.5);
  assert.equal(resolveLength('calc(42% + 0.5px)', 100), 42.5);
  assert.equal(resolveLength('calc(10px + 25%)', 200), 60);
  assert.throws(
    () => _internals.resolveCalc('calc(100% / 3)', 100),
    /calc\(\) expression/
  );
});

test('angleToDeg converts every CSS angle unit', () => {
  assert.equal(angleToDeg('90deg'), 90);
  assert.equal(angleToDeg('0.25turn'), 90);
  assert.equal(angleToDeg('100grad'), 90);
  assert.ok(Math.abs(angleToDeg(`${Math.PI / 2}rad`) - 90) < 1e-9);
});

test('parseTransformMatrix accepts 2D matrices and flat matrix3d', () => {
  assert.equal(parseTransformMatrix('none'), null);
  assert.deepEqual(
    parseTransformMatrix('matrix(0, 1, -1, 0, 10, 20)'),
    [0, 1, -1, 0, 10, 20]
  );
  assert.deepEqual(
    parseTransformMatrix(
      'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 5, 6, 0, 1)'
    ),
    [1, 0, 0, 1, 5, 6]
  );
  assert.throws(
    () =>
      parseTransformMatrix(
        'matrix3d(1, 0, 0, 0, 0, 0.7, 0.7, 0, 0, -0.7, 0.7, 0, 0, 0, 0, 1)'
      ),
    /3D transform/
  );
});

test('roundedRectPath emits plain rects and clamped rounded corners', () => {
  const box = { x: 0, y: 0, w: 10, h: 10 };
  assert.equal(roundedRectPath(box, null, 3), 'M0 0H10V10H0Z');
  const radii = {
    tl: [5, 5],
    tr: [5, 5],
    br: [5, 5],
    bl: [5, 5],
  };
  const d = roundedRectPath(box, radii, 3);
  assert.match(d, /A5 5 0 0 1/);
});

test('sectorPath covers the expected quadrant', () => {
  // CSS bearing 0..90deg (up → right, clockwise) is the top-right quadrant.
  const d = sectorPath(0, 0, 10, 0, 90, 3);
  assert.equal(d, 'M0 0L0 -10A10 10 0 0 1 10 0Z');
  // >180deg spans set the large-arc flag.
  assert.match(sectorPath(0, 0, 10, 0, 270, 3), /A10 10 0 1 1/);
});

test('parseConicSectors decomposes hard-stop conics (computed form)', () => {
  // glyph's quadrants, as serialized by getComputedStyle.
  const { sectors } = parseConicSectors(
    splitTopLevel(
      'rgb(62, 139, 255) 0deg, rgb(62, 139, 255) 90deg, rgb(62, 139, 255) 90deg, rgb(62, 139, 255) 180deg, rgb(255, 61, 139) 180deg, rgb(255, 61, 139) 270deg, rgb(62, 139, 255) 270deg, rgb(62, 139, 255) 360deg'
    ),
    normalize
  );
  assert.deepEqual(
    sectors.map((s) => [s.from, s.to, s.color.r]),
    [
      [0, 90, 62],
      [90, 180, 62],
      [180, 270, 255],
      [270, 360, 62],
    ]
  );
});

test('parseConicSectors handles from/at prefixes (mask sectors)', () => {
  const { cx, cy, sectors } = parseConicSectors(
    splitTopLevel(
      'from 312deg at 50% 100%, rgb(0, 0, 0) 0deg, rgb(0, 0, 0) 96deg, rgba(0, 0, 0, 0) 96deg, rgba(0, 0, 0, 0) 360deg'
    ),
    normalize
  );
  assert.equal(cx, '50%');
  assert.equal(cy, '100%');
  assert.deepEqual(
    sectors.map((s) => [s.from, s.to, s.color.a]),
    [
      [312, 408, 1],
      [408, 672, 0],
    ]
  );
});

test('parseConicSectors rejects smooth sweeps', () => {
  // wedge's independently-rolled stop positions leave a 70deg→180deg blend.
  assert.throws(
    () =>
      parseConicSectors(
        splitTopLevel(
          'from 135deg, rgb(0, 0, 0) 0deg, rgb(0, 0, 0) 70deg, rgba(0, 0, 0, 0) 180deg, rgba(0, 0, 0, 0) 360deg'
        ),
        normalize
      ),
    /smooth color sweep/
  );
  // coil/spectrum-style positionless color runs.
  assert.throws(
    () =>
      parseConicSectors(
        splitTopLevel('rgb(1, 2, 3), rgb(4, 5, 6), rgb(7, 8, 9)'),
        normalize
      ),
    /smooth color sweep/
  );
});

test('parseBoxShadows reads the computed serialization', () => {
  const shadows = parseBoxShadows(
    'rgb(62, 139, 255) 0px 0px 8.88889px 0px, rgba(0, 0, 0, 0.2) 1px 2px 40px 3px',
    normalize
  );
  assert.equal(shadows.length, 2);
  assert.deepEqual(shadows[0], {
    color: rgb(62, 139, 255),
    dx: 0,
    dy: 0,
    blur: 8.88889,
    spread: 0,
    inset: false,
  });
  assert.equal(shadows[1].spread, 3);
  assert.equal(shadows[1].color.a, 0.2);
  assert.equal(parseBoxShadows('none', normalize).length, 0);
  assert.equal(
    parseBoxShadows('rgb(0, 0, 0) 0px 0px 4px 0px inset', normalize)[0].inset,
    true
  );
});
