import { test, expect, type Page } from '@playwright/test';

// Coverage for the `tabbied` package itself (via the built dist the site
// consumes), driven through app/package-test/page.tsx. The gallery and editor
// already dogfood the cover and fixed fits; this spec covers the adaptive
// grid fit — the package default — plus contain, and the box props that size
// the element the artwork renders into.

const paintedCells = (page: Page, hostSelector: string) =>
  page.evaluate((selector) => {
    const el = document.querySelector(`${selector} css-doodle`);
    if (!el || !el.shadowRoot) return 0;
    return [...el.shadowRoot.querySelectorAll('cssd-cell')].filter((cell) => {
      const bg = getComputedStyle(cell).backgroundColor;
      return bg && bg !== 'rgba(0, 0, 0, 0)';
    }).length;
  }, hostSelector);

const cellCount = (page: Page, hostSelector: string) =>
  page.evaluate((selector) => {
    const el = document.querySelector(`${selector} css-doodle`);
    return el?.shadowRoot?.querySelectorAll('cssd-cell').length ?? 0;
  }, hostSelector);

// The laid-out track sizes of the shadow grid, in CSS px. Fractional tracks
// are what draw a hairline seam at every cell edge.
const gridTrackPx = (page: Page, hostSelector: string) =>
  page.evaluate((selector) => {
    const el = document.querySelector(`${selector} css-doodle`);
    const grid = el?.shadowRoot?.querySelector('cssd-grid');

    if (!grid) return { cols: [] as number[], rows: [] as number[] };

    const cs = getComputedStyle(grid);

    return {
      cols: cs.gridTemplateColumns.split(' ').map(parseFloat),
      rows: cs.gridTemplateRows.split(' ').map(parseFloat),
    };
  }, hostSelector);

test.describe('tabbied package (component test page)', () => {
  test('fit="grid" adapts the cell grid to the container size', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/package-test');

    await page.waitForFunction(() => !!window.customElements.get('css-doodle'));
    const doodle = page.locator('#fit-grid [data-artwork="radius"] css-doodle');
    await expect(doodle).toBeAttached({ timeout: 15000 });

    // The canvas covers its host box and is snapped up to a whole number of
    // grid tracks, so no cell boundary lands on a sub-pixel (which would draw
    // a hairline seam at every cell edge). The overflow is under one cell and
    // the host clips it.
    const host = page.locator('#fit-grid [data-artwork="radius"]');
    const hostBox = (await host.boundingBox())!;
    const doodleBox = (await doodle.boundingBox())!;
    const {
      cols: cols_px,
      rows: rows_px,
    } = await gridTrackPx(page, '#fit-grid [data-artwork="radius"]');
    const cols = cols_px.length;
    const rows = rows_px.length;

    expect(doodleBox.width).toBeGreaterThanOrEqual(hostBox.width - 1);
    expect(doodleBox.height).toBeGreaterThanOrEqual(hostBox.height - 1);
    // The cell is even (designs that halve their cell land on whole pixels)
    // and square (a quarter-turn rotation of an oblong swaps its axes and
    // leaves a strip of the cell uncovered).
    expect((doodleBox.width / cols) % 2).toBeCloseTo(0, 1);
    expect((doodleBox.height / rows) % 2).toBeCloseTo(0, 1);
    expect(doodleBox.width / cols).toBeCloseTo(doodleBox.height / rows, 1);
    await expect(page.locator('#fit-grid [data-artwork="radius"]')).toHaveCSS(
      'overflow',
      'hidden'
    );

    // Every track is a whole pixel — the property the snap exists to hold.
    for (const px of [...cols_px, ...rows_px]) {
      expect(Math.abs(px - Math.round(px))).toBeLessThan(0.01);
    }

    // ~36px target cells: a ~1152×320 box must get a clearly 2-D grid, and
    // the pattern must actually paint.
    const wideCount = await cellCount(page, '#fit-grid [data-artwork="radius"]');
    expect(wideCount).toBeGreaterThan(100);
    await expect
      .poll(() => paintedCells(page, '#fit-grid [data-artwork="radius"]'), {
        timeout: 10000,
      })
      .toBeGreaterThan(1);

    // Shrinking the container re-derives a coarser grid (debounced ~180ms).
    await page.setViewportSize({ width: 480, height: 800 });
    await expect
      .poll(() => cellCount(page, '#fit-grid [data-artwork="radius"]'), {
        timeout: 10000,
      })
      .toBeLessThan(wideCount);
  });

  test('fit="cover" tiles a grid artwork with whole cells (no mid-cell crop)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/package-test');

    const selector = '#fit-cover [data-artwork="radius"]';
    const doodle = page.locator(`${selector} css-doodle`);
    await expect(doodle).toBeAttached({ timeout: 15000 });

    await expect
      .poll(() => paintedCells(page, selector), { timeout: 10000 })
      .toBeGreaterThan(1);

    // The adapted render matches the host's aspect ratio, so the scaled canvas
    // covers the wide box instead of overflowing vertically (the old fixed
    // 800×800 render was ~72% cropped at this shape). It overshoots by under
    // one scaled cell: the scale is quantised so a cell lands on a whole
    // device pixel, which rounds up and is what cover crops for.
    const hostBox = (await page.locator(selector).boundingBox())!;
    const doodleBox = (await doodle.boundingBox())!;
    const { cell, scale } = await page.evaluate((sel) => {
      const d = document.querySelector(`${sel} css-doodle`)!;
      const grid = d.shadowRoot!.querySelector('cssd-grid')!;
      return {
        cell: parseFloat(getComputedStyle(grid).gridTemplateColumns),
        scale: new DOMMatrixReadOnly(getComputedStyle(d).transform).a,
      };
    }, selector);

    expect(doodleBox.width).toBeGreaterThanOrEqual(hostBox.width - 1);
    expect(doodleBox.height).toBeGreaterThanOrEqual(hostBox.height - 1);
    expect(doodleBox.width - hostBox.width).toBeLessThan(cell * scale);
    expect(doodleBox.height - hostBox.height).toBeLessThan(cell * scale);

    // The invariant the quantisation exists for: a cell edge lands on a whole
    // pixel after the transform. Snapping the render box alone does not give
    // this — an isolated test measured 6 interior seams with integral tracks
    // under a fractional scale, and 0 once the scale was quantised.
    const scaledCell = cell * scale;
    expect(Math.abs(scaledCell - Math.round(scaledCell))).toBeLessThan(0.02);

    // And the cells it is tiled with stay near-square (the on-screen cell
    // rect includes the cover scaling transform).
    const cellRatio = await page.evaluate((sel) => {
      const el = document.querySelector(`${sel} css-doodle`);
      const cell = el?.shadowRoot?.querySelector('cssd-cell');
      if (!cell) return 0;
      const rect = cell.getBoundingClientRect();
      return rect.width / rect.height;
    }, selector);
    expect(cellRatio).toBeGreaterThan(0.8);
    expect(cellRatio).toBeLessThan(1.25);
  });

  test('maxWidth + aspectRatio size the box without a sized parent', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/package-test');

    const selector = '#box-bounded [data-artwork="radius"]';
    await expect(page.locator(`${selector} css-doodle`)).toBeAttached({
      timeout: 15000,
    });

    await expect
      .poll(() => paintedCells(page, selector), { timeout: 10000 })
      .toBeGreaterThan(1);

    // The section is far wider than 480px, so maxWidth is what's binding, and
    // the height comes from aspect-ratio rather than from any parent.
    const hostBox = (await page.locator(selector).boundingBox())!;
    expect(hostBox.width).toBeCloseTo(480, 0);
    expect(hostBox.height).toBeCloseTo(320, 0);

    // Narrower than the cap: the box tracks the container again, and the
    // ratio still sets the height.
    await page.setViewportSize({ width: 420, height: 800 });
    await expect
      .poll(async () => (await page.locator(selector).boundingBox())!.width, {
        timeout: 10000,
      })
      .toBeLessThan(480);

    const narrowBox = (await page.locator(selector).boundingBox())!;
    expect(narrowBox.width / narrowBox.height).toBeCloseTo(3 / 2, 1);
  });

  test('fit="contain" letterboxes symmetry at its authored ratio', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/package-test');

    const doodle = page.locator(
      '#fit-contain [data-artwork="symmetry"] css-doodle'
    );
    await expect(doodle).toBeAttached({ timeout: 15000 });

    // Letterboxed inside a wide box: the visible artwork keeps its authored
    // 2:3 (800×1200 render) proportions instead of stretching.
    const host = page.locator('#fit-contain [data-artwork="symmetry"]');
    const hostBox = (await host.boundingBox())!;
    const doodleBox = (await doodle.boundingBox())!;
    const ratio = doodleBox.width / doodleBox.height;
    expect(Math.abs(ratio - 2 / 3)).toBeLessThan(0.02);
    expect(doodleBox.height).toBeLessThanOrEqual(hostBox.height + 1);

    // Non-decorative mode exposes an accessible image role.
    await expect(host).toHaveRole('img');
    await expect(host).toHaveAccessibleName('Symmetry');
  });
});
