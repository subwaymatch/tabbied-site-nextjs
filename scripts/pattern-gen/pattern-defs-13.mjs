// Batch 13 — 300 designs that export as native SVG with no caveat at all.
//
// Batches 11 and 12 fixed the *format*: designs that download as true vector
// files with no warning dialog, no filter effects for a design tool to
// mangle, and no sub-pixel deviation from what is on screen. This batch keeps
// that rule and changes the *anchor*: where those batches drew almost
// everything from the middle of the cell outward, this one seats its geometry
// against the cell's corners and edges — coastline in a corner, a skyline on
// an edge, an arch turning through the angle, a frame hugging the perimeter.
//
// Twenty families of fifteen, in the order they ship:
//
//   A. Shore      solid round masses anchored to corners and edges.
//   B. Fell       domes and mounds rising off an edge.
//   C. Roofline   the profiles a pitched roof can take.
//   D. Scantling  sawn timber: beams, planks, joints.
//   E. Shirting   the stripe as woven cloth sets it.
//   F. Metalwork  turned rounds: rings, lobes, crescents, knurling.
//   G. Beacon     hard-stop conic sectors read as thrown light.
//   H. Sheer      the dotted grounds of net and lace.
//   I. Rigging    spars and lines: bars crossing, leaning, beaded.
//   J. Casement   frames, openings, and what surrounds a hole in a wall.
//   K. Terrace    stepped and notched ground, all clip-path.
//   L. Zigzag     the chevron as knitting knows it.
//   M. Facet      lozenges, kites, and cut stones.
//   N. Kilnglow   smooth radial ramps behaving like glazes.
//   O. Silk       linear ramps as sheen on cloth.
//   P. Fresco     the fall of ink quantised into counted levels.
//   Q. Woolwork   a periodic field crossed with a smooth ramp.
//   R. Ropework   two members overlapping, read through opacity.
//   S. Plaidwork  two hard periodic fields intersected.
//   T. Moulding   the classical profile drawn at line weight.
//
// House rules, inherited from every earlier batch and enforced by
// generate-batch13.mjs (via pattern-lints.mjs) and validate-batch13.mjs /
// validate-svg-batch13.mjs: exactly one @random(${shapeFrequency}) gate per
// design; every design samples a transition-able ink per cell so a reseed
// morphs; a randomized custom prop read more than once goes through @var(--x);
// nothing paints var(--color0), because a hole knocked out in the background
// colour stops being a hole the moment the background is transparent.
import { RESERVED, TAKEN13 } from './pattern-defs-13/shared.mjs';
import { sectionA } from './pattern-defs-13/a-shore.mjs';
import { sectionB } from './pattern-defs-13/b-fell.mjs';
import { sectionC } from './pattern-defs-13/c-roofline.mjs';
import { sectionD } from './pattern-defs-13/d-scantling.mjs';
import { sectionE } from './pattern-defs-13/e-shirting.mjs';
import { sectionF } from './pattern-defs-13/f-metalwork.mjs';
import { sectionG } from './pattern-defs-13/g-beacon.mjs';
import { sectionH } from './pattern-defs-13/h-sheer.mjs';
import { sectionI } from './pattern-defs-13/i-rigging.mjs';
import { sectionJ } from './pattern-defs-13/j-casement.mjs';
import { sectionK } from './pattern-defs-13/k-terrace.mjs';
import { sectionL } from './pattern-defs-13/l-zigzag.mjs';
import { sectionM } from './pattern-defs-13/m-facet.mjs';
import { sectionN } from './pattern-defs-13/n-kilnglow.mjs';
import { sectionO } from './pattern-defs-13/o-silk.mjs';
import { sectionP } from './pattern-defs-13/p-fresco.mjs';
import { sectionQ } from './pattern-defs-13/q-woolwork.mjs';
import { sectionR } from './pattern-defs-13/r-ropework.mjs';
import { sectionS } from './pattern-defs-13/s-plaidwork.mjs';
import { sectionT } from './pattern-defs-13/t-moulding.mjs';

const SECTIONS = [
  sectionA,
  sectionB,
  sectionC,
  sectionD,
  sectionE,
  sectionF,
  sectionG,
  sectionH,
  sectionI,
  sectionJ,
  sectionK,
  sectionL,
  sectionM,
  sectionN,
  sectionO,
  sectionP,
  sectionQ,
  sectionR,
  sectionS,
  sectionT,
];

// Batch 13 owns gallery orders 2000-2999; batch 12 stops at 1431.
const FIRST_ORDER = 2000;

let order = FIRST_ORDER;
const seen = new Set();
export const batch13 = [];

for (const { title, all } of SECTIONS) {
  for (const def of all) {
    if (RESERVED.has(def.slug)) {
      throw new Error(`${def.slug}: slug is a JS reserved word`);
    }
    // A name should never come to mean two different things — TAKEN13 carries
    // every motif name used anywhere in the project, batches 11 and 12
    // included, plus the designs cut before they shipped.
    if (TAKEN13.has(def.slug)) {
      throw new Error(`${def.slug} (${title}): name already used elsewhere`);
    }
    if (seen.has(def.slug)) throw new Error(`duplicate slug in batch 13: ${def.slug}`);
    seen.add(def.slug);
    batch13.push({ ...def, order: order++ });
  }
}
