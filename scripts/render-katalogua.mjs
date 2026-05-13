// One-off: renders every page of katalogua.pdf to PNG so we can
// visually parse product spec tables that exist nowhere else in
// machine-readable form. Output goes to a temp folder; not committed.
import { pdfToPng } from 'pdf-to-png-converter';
import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const SRC = 'C:/Users/Admin/Downloads/katalogua.pdf';
const OUT = 'C:/Users/Admin/AppData/Local/Temp/katpages';

const args = process.argv.slice(2);
const fromArg = args.find((a) => a.startsWith('--from='));
const toArg = args.find((a) => a.startsWith('--to='));
const FROM = fromArg ? parseInt(fromArg.split('=')[1], 10) : 1;
const TO = toArg ? parseInt(toArg.split('=')[1], 10) : 360;

const skip = new Set();
if (existsSync(OUT)) {
  for (const f of readdirSync(OUT)) {
    const m = f.match(/_page_(\d+)\.png$/);
    if (m) skip.add(parseInt(m[1], 10));
  }
}
const pages = [];
for (let i = FROM; i <= TO; i++) if (!skip.has(i)) pages.push(i);
console.log(`Pages ${FROM}-${TO}: ${pages.length} to render (${skip.size} already cached).`);

const BATCH = 20;
for (let i = 0; i < pages.length; i += BATCH) {
  const slice = pages.slice(i, i + BATCH);
  console.log(`  batch ${i / BATCH + 1}: pages ${slice[0]}..${slice[slice.length - 1]}`);
  await pdfToPng(SRC, {
    outputFolder: OUT,
    outputFileMask: 'page',
    pagesToProcess: slice,
    viewportScale: 1.6,
  });
}
console.log('done. Files in', resolve(OUT));
