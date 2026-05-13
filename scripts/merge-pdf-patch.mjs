// Merges manually-curated PDF spec extractions (data/pdf-catalog-patch.json)
// into the scraped catalog (public/data/termojet-catalog.json). Used for
// articles that exist in Sofievka but aren't on termojet.com.ua — the
// PDF catalog is the only structured source for their specs.
//
// Strategy: PDF entries augment, never overwrite. If termojet.com.ua
// already has specs for an article, we keep them.
//
//   node scripts/merge-pdf-patch.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CAT = resolve(ROOT, 'public/data/termojet-catalog.json');
const PATCH = resolve(ROOT, 'data/pdf-catalog-patch.json');

const cat = JSON.parse(readFileSync(CAT, 'utf8'));
const patch = JSON.parse(readFileSync(PATCH, 'utf8'));

let added = 0;
let skipped = 0;
for (const [article, p] of Object.entries(patch.products)) {
  if (cat.productsByArticle[article]) {
    skipped++;
    continue;
  }
  cat.productsByArticle[article] = {
    url: '',
    article,
    productCode: p.productCode || '',
    name: p.name || '',
    specs: p.specs || [],
    imageUrl: '',
    source: 'pdf-catalog-2024',
    pdfPage: p.pdfPage || null,
  };
  added++;
}

cat.mergedAt = new Date().toISOString();
cat.pdfPatch = {
  source: patch.source,
  added,
  skipped,
};
cat.matched = Object.keys(cat.productsByArticle).length;

writeFileSync(CAT, JSON.stringify(cat, null, 2));
console.log(`Merged: +${added} new, ${skipped} already present.`);
console.log(`Catalog now covers ${cat.matched} products.`);
