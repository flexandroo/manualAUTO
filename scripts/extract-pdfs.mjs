import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SOURCE = process.argv[2] || 'D:/Сортувати/Библиотека TERMOJET/Инструкции/Украинский';
const OUT = join(__dirname, 'extracted');

if (!existsSync(OUT)) await mkdir(OUT, { recursive: true });

const files = (await readdir(SOURCE)).filter((f) => f.toLowerCase().endsWith('.pdf'));

console.log(`Found ${files.length} PDFs in ${SOURCE}`);

for (const file of files) {
  const path = join(SOURCE, file);
  const data = new Uint8Array(await readFile(path));
  const pdf = await pdfjsLib.getDocument({ data }).promise;

  const pages = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    const lineMap = new Map();
    for (const item of content.items) {
      if (!('transform' in item)) continue;
      const y = Math.round(item.transform[5]);
      if (!lineMap.has(y)) lineMap.set(y, []);
      lineMap.get(y).push({ x: item.transform[4], text: item.str });
    }
    const sortedLines = [...lineMap.entries()]
      .sort((a, b) => b[0] - a[0])
      .map(([, items]) =>
        items
          .sort((a, b) => a.x - b.x)
          .map((it) => it.text)
          .join(' ')
          .trim()
      )
      .filter((l) => l.length > 0);

    pages.push({ pageNumber: i, lines: sortedLines });
  }

  const outName = basename(file, '.pdf') + '.txt';
  const outPath = join(OUT, outName);
  const text = pages
    .map(
      (p) =>
        `===== PAGE ${p.pageNumber} =====\n` + p.lines.join('\n')
    )
    .join('\n\n');
  await writeFile(outPath, text, 'utf8');
  console.log(`✓ ${file} -> ${outName} (${pdf.numPages} pages)`);
}

console.log(`\nDone. Output: ${OUT}`);
