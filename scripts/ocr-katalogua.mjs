// OCRs every rendered page of katalogua.pdf with Tesseract (Ukrainian +
// English) and writes one .txt per page to a temp folder. Used to scan
// for Sofievka article codes in a catalog that has no extractable
// text layer.
import { createWorker } from 'tesseract.js';
import { readdirSync, mkdirSync, existsSync, writeFileSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const INPUT_DIR = 'C:/Users/Admin/AppData/Local/Temp/katpages';
const OUT_DIR = 'C:/Users/Admin/AppData/Local/Temp/katocr';
mkdirSync(OUT_DIR, { recursive: true });

const pages = readdirSync(INPUT_DIR)
  .filter((f) => /_page_\d+\.png$/.test(f))
  .map((f) => ({ file: f, n: parseInt(f.match(/_page_(\d+)/)[1], 10) }))
  .sort((a, b) => a.n - b.n);
console.log(`OCR'ing ${pages.length} pages…`);

const worker = await createWorker(['ukr', 'eng']);

for (const { file, n } of pages) {
  const outPath = resolve(OUT_DIR, `page_${n}.txt`);
  if (existsSync(outPath)) {
    process.stdout.write(`.`);
    continue;
  }
  const { data } = await worker.recognize(resolve(INPUT_DIR, file));
  writeFileSync(outPath, data.text);
  process.stdout.write(`${n} `);
}
console.log('\nDone.');
await worker.terminate();
