// Rendering gate for batch 12: every design paints, keeps its cells across a
// reseed (so transitions animate), re-inks on that reseed, renders identically
// on a transparent background, and logs no console errors. The harness lives
// in render-sweep.mjs, shared with batch 11; this script points it at batch 12.
//
// The transparent-background pass matters more here than in any earlier batch:
// half of batch 12 fades its ink out with a mask, and a masked fade is only a
// real hole if nothing behind it is painted in the background colour. Contact
// sheets land in /tmp/sheet-b12-*.png, the transparent pass over a
// checkerboard so a soft edge that is genuinely see-through looks it.
//
// validate-svg-batch12.mjs is the export half of the same gate.
// Set CHROMIUM_PATH to use a browser other than Playwright's own download, and
// ONLY=slug,slug to narrow the run while authoring.
import { batch12 } from './artwork-defs-12.mjs';
import { runRenderSweep } from './render-sweep.mjs';

await runRenderSweep({ defs: batch12, label: 'b12' });
