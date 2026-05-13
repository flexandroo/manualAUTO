import * as XLSX from 'xlsx';
import type { StickerData } from './types';
import { newId } from '../utils/id';
import { CERTIFICATION_LIBRARY } from './certificationLibrary';

// Parses a Sofievka-style product list xlsx into a batch of fresh
// stickers. The source columns we rely on:
//   col 1 (A): Артикул       -> sticker.articleCode
//   col 2 (B): Наименование  -> productCode + titleLines
//
// Наименование commonly looks like  "TJ-R-W-08\tКолектор Termojet..."
// (tab between product code and description) or  "НГ-37 (пряма)"
// (single string). We split on the first whitespace block; if the
// first token looks like a code (only uppercase/digits/dash/dot/
// brackets) we treat it as productCode and the rest as title;
// otherwise the article itself stands in as the code and the full
// string becomes the title.

const CODE_RE = /^[A-ZА-ЯЁЇІЄҐ0-9][A-ZА-ЯЁЇІЄҐ0-9\-.()/]*$/i;

export interface CatalogRow {
  article: string;
  productCode: string;
  title: string;
}

export interface ImportResult {
  stickers: StickerData[];
  skipped: number;
}

export function parseCatalogRows(workbook: XLSX.WorkBook): CatalogRow[] {
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) return [];
  const rows = XLSX.utils.sheet_to_json<string[]>(sheet, {
    header: 1,
    defval: '',
    raw: false,
  });

  const result: CatalogRow[] = [];
  // Skip header row 0; iterate rest.
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i] || [];
    const article = String(row[0] ?? '').trim();
    const name = String(row[1] ?? '').trim();
    if (!article && !name) continue;

    const [productCode, title] = splitNaimenovanie(name, article);
    result.push({ article, productCode, title });
  }
  return result;
}

function splitNaimenovanie(name: string, fallbackCode: string): [string, string] {
  if (!name) return [fallbackCode, ''];

  // Tab is the strongest separator — TJ-W-08\tКолектор...
  const tabIdx = name.indexOf('\t');
  if (tabIdx > 0) {
    return [name.slice(0, tabIdx).trim(), name.slice(tabIdx + 1).trim()];
  }

  // Otherwise inspect the first whitespace-delimited token.
  const m = name.match(/^(\S+)(\s+)([\s\S]*)$/);
  if (m && CODE_RE.test(m[1])) {
    return [m[1], m[3].trim()];
  }

  // No detectable code in the name — fall back to the article.
  return [fallbackCode, name];
}

/** Defaults applied to every imported sticker. The user can override
 *  any of these in the editor afterwards. */
const DEFAULT_DISTRIBUTOR =
  "Виробник: TERMOJET, Україна. Гарантія — 24 місяці з дати продажу " +
  "за умови наявності товарної накладної.";
const DEFAULT_FOOTER = 'www.termojet.com.ua';

export function rowToSticker(row: CatalogRow): StickerData {
  return {
    id: newId('stk'),
    titleLines: row.title ? [row.title] : [],
    productCode: row.productCode,
    articleCode: row.article,
    specs: [],
    translations: [],
    distributorInfo: DEFAULT_DISTRIBUTOR,
    selectedCertIds: CERTIFICATION_LIBRARY.map((c) => c.id),
    fontSizes: {},
    footnote: '',
    footer: DEFAULT_FOOTER,
    widthMm: 150,
    heightMm: 90,
    accentColor: '#F25D2A',
    textScale: 1.0,
  };
}

export async function importCatalogFile(file: File): Promise<ImportResult> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: 'array' });
  const rows = parseCatalogRows(wb);

  const stickers: StickerData[] = [];
  let skipped = 0;
  for (const row of rows) {
    if (!row.article && !row.productCode) {
      skipped++;
      continue;
    }
    stickers.push(rowToSticker(row));
  }
  return { stickers, skipped };
}
