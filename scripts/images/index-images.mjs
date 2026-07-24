// Refresh components/showcase/generatedImages.ts from whatever is currently in
// public/images/showcase. import-batch.mjs does this automatically; run it by
// hand after adding, replacing or deleting an image outside the batch flow.
//
//   npm run images:index
import path from 'node:path';
import { IMAGE_INDEX, ROOT, writeImageIndex } from './common.mjs';

const ids = writeImageIndex();
console.log(`${ids.length} image(s) -> ${path.relative(ROOT, IMAGE_INDEX)}`);
