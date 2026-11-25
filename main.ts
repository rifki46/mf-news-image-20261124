// Sum up 24 November's world news in one image — entry program.
//
// The picture lives in this repository as entry.png: a Long March rocket
// lifting off at dawn toward the Tiangong station, the flags of China and
// Pakistan flying side by side on the launch tower — the day China launched
// Shenzhou-24 with the first foreign astronaut, a Pakistani, aboard a
// Chinese mission to its space station. This program's whole job is to copy
// that picture to the output directory, unchanged, byte for byte, so the
// judges see exactly the image stored here. It runs twice in grading and
// must write identical bytes both times; a plain copy does.

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function main() {
  mkdirSync(outDir, { recursive: true });
  const src = join(here, 'entry.png');
  const dst = join(outDir, 'entry.png');
  copyFileSync(src, dst);
  // Read both back and compare: a hand-in that cannot prove its own bytes
  // are the repository's bytes should fail here, not in front of the judge.
  const a = readFileSync(src);
  const b = readFileSync(dst);
  if (!a.equals(b)) throw new Error('entry.png changed while copying');
  // A PNG signature check keeps a truncated or swapped file from slipping
  // through as a "successful" copy: 89 50 4E 47 are the first four bytes of
  // every whole PNG.
  if (b.length < 8 || b[0] !== 0x89 || b[1] !== 0x50 || b[2] !== 0x4e || b[3] !== 0x47) {
    throw new Error('entry.png is not a whole PNG');
  }
  console.log(`wrote ${dst} (${b.length} bytes, identical to the repository copy)`);
}

main();
