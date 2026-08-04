// The preset catalog intentionally does NOT re-export from here: pulling all
// 100+ definitions into the core module graph would make every consumer of
// `createArtwork` carry the whole catalog in unshaken environments. Import
// presets from `tabbied/artworks` instead.
export * from './types.js';
export * from './doodleSource.js';
export * from './seed.js';
export * from './aspectRatio.js';
export * from './sizing.js';
export * from './createArtwork.js';
export * from './hydrate.js';
// The SVG converter itself (~21 KB gzipped) is NOT re-exported here:
// controller.exportSvg() loads it on demand via dynamic import, so consumers
// who never export pay nothing. Import `doodleToSvg` from
// 'tabbied/svg-export' to use the converter directly. Its types are free.
export type { SvgExportOptions, SvgExportResult } from './svgExport.js';
