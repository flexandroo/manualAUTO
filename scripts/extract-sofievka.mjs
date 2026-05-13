// Extracts article + productCode + name from data/Sofievka.xlsx and
// writes public/data/sofievka.json. Run whenever the source xlsx is
// updated; the scraper and the in-app catalog-pull use this JSON to
// know the universe of articles.
//
//   node scripts/extract-sofievka.mjs

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as XLSX from 'xlsx';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = resolve(ROOT, 'data/Sofievka.xlsx');
const OUT = resolve(ROOT, 'public/data/sofievka.json');

const CODE_RE = /^[A-ZА-ЯЁЇІЄҐ0-9][A-ZА-ЯЁЇІЄҐ0-9\-.()/]*$/i;

function splitName(name, fallbackCode) {
  if (!name) return [fallbackCode, ''];
  const tabIdx = name.indexOf('\t');
  if (tabIdx > 0) {
    return [name.slice(0, tabIdx).trim(), name.slice(tabIdx + 1).trim()];
  }
  const m = name.match(/^(\S+)(\s+)([\s\S]*)$/);
  if (m && CODE_RE.test(m[1])) {
    return [m[1], m[3].trim()];
  }
  return [fallbackCode, name];
}

function run() {
  const wb = XLSX.read(readFileSync(SRC));
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: '',
    raw: false,
  });

  const products = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i] || [];
    const article = String(row[0] ?? '').trim();
    const name = String(row[1] ?? '').trim();
    if (!article && !name) continue;
    const [productCode, title] = splitName(name, article);
    products.push({ article, productCode, name: title });
  }

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(
    OUT,
    JSON.stringify(
      { extractedAt: new Date().toISOString(), count: products.length, products },
      null,
      2
    )
  );
  console.log(`wrote ${products.length} products -> ${OUT}`);
}

run();
