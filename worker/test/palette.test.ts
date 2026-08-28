import { contrastRatio } from 'tabbied-templates';
import { describe, expect, it } from 'vitest';
import { ensurePalette } from '../lib/palette';

// The palette is the one field the model authors freely, so these are the tests
// that stop an unreadable page shipping. The assertions are made against
// `contrastRatio` itself rather than against fixed hexes: the rule is the
// contract, and a repair that satisfies it by another route is still correct.

const FALLBACK = ['#ffffff', '#111111', '#888888'];

describe('ensurePalette', () => {
  it('passes a legible palette through untouched', () => {
    const result = ensurePalette(['#ffffff', '#1a1a1a', '#c04000'], FALLBACK);

    expect(result.status).toBe('clean');
    expect(result.colors).toEqual(['#ffffff', '#1a1a1a', '#c04000']);
  });

  it('repairs a palette whose inks are all too close to the ground', () => {
    // Three near-whites: nothing here is readable on white.
    const result = ensurePalette(['#ffffff', '#f4f4f4', '#eeeeee'], FALLBACK);

    expect(result.status).toBe('repaired');
    expect(result.colors[0]).toBe('#ffffff');

    const best = Math.max(
      ...result.colors.slice(1).map((ink) => contrastRatio(ink, result.colors[0]))
    );
    expect(best).toBeGreaterThanOrEqual(3);
  });

  it('keeps the inks it did not have to touch', () => {
    const result = ensurePalette(['#ffffff', '#fafafa', '#f0f0f0'], FALLBACK);

    // One ink moves; the rest of the model's choice survives.
    expect(result.colors).toHaveLength(3);
    expect(result.colors.filter((c) => c === '#fafafa' || c === '#f0f0f0').length)
      .toBeGreaterThanOrEqual(1);
  });

  it('rejects a palette whose inks all equal the background', () => {
    const result = ensurePalette(['#123456', '#123456'], FALLBACK);

    expect(result.status).toBe('rejected');
    expect(result.colors).toEqual(FALLBACK);
  });

  it.each([
    ['not an array', 'nope'],
    ['too short', ['#ffffff']],
    ['a non-hex entry', ['#ffffff', 'rebeccapurple']],
    ['null', null],
  ])('rejects %s', (_label, value) => {
    expect(ensurePalette(value, FALLBACK)).toEqual({
      colors: FALLBACK,
      status: 'rejected',
    });
  });

  it('normalises case rather than treating it as a different colour', () => {
    const result = ensurePalette(['#FFFFFF', '#1A1A1A'], FALLBACK);

    expect(result.status).toBe('clean');
    expect(result.colors).toEqual(['#ffffff', '#1a1a1a']);
  });

  it('expands shorthand hex, which is valid but not what downstream stores', () => {
    const result = ensurePalette(['#ffffff', '#123456', '#0a0'], FALLBACK);

    expect(result.status).toBe('clean');
    expect(result.colors).toEqual(['#ffffff', '#123456', '#00aa00']);
  });

  it('treats shorthand equal to the background as equal to it', () => {
    // `#fff` and `#ffffff` are one colour. Before shorthand was expanded these
    // compared as different strings, and an invisible ink was "repaired" into
    // a colour nobody chose instead of being rejected.
    const result = ensurePalette(['#ffffff', '#fff'], FALLBACK);

    expect(result.status).toBe('rejected');
    expect(result.colors).toEqual(FALLBACK);
  });
});
