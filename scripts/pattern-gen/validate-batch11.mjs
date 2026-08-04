// Rendering gate for batch 11: every design paints, keeps its cells across a
// reseed (so transitions animate), re-inks on that reseed, renders identically
// on a transparent background, and logs no console errors. The harness lives
// in render-sweep.mjs, shared with batch 12; this script points it at batch 11.
//
// validate-svg-batch11.mjs is the export half of the same gate.
// Contact sheets land in /tmp/sheet-b11-*.png. Set CHROMIUM_PATH to use a
// browser other than Playwright's own download, and ONLY=slug,slug to narrow
// the run while authoring.
import { batch11 } from './pattern-defs-11.mjs';
import { runRenderSweep } from './render-sweep.mjs';

await runRenderSweep({ defs: batch11, label: 'b11' });
