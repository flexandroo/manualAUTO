import type { TechSpecsData, TechSpecsTable } from '../../types/instruction';
import type { PageData } from '../../parsers/pdfExtract';

const PROPERTY_KEYS = [
  'Матеріал',
  'Зварювання',
  'Збірка',
  'Гідравлічне випробування',
  'Максимальний робочий тиск',
  'Максимальна робоча температура',
  'Теплоносій',
  'Використання газового середовища',
  'Покриття',
  'Комплектація',
  'Упаковка',
  'Маркування',
  'Гарантійний термін',
  'Серія моделей',
  'Доступні модифікації',
];

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function parseTechSpecs(pages: PageData[]): TechSpecsData | null {
  const target = pages.find((p) => p.text.includes('Технічні характеристики'));
  if (!target) return null;

  const text = target.text;

  let standards = '';
  const stdMatch = text.match(
    /Відповідно до стандартів:\s*([\s\S]+?)(?=\n\s*Матеріал|\n\s*[А-ЯІЇЄҐ][а-яіїєґ]+\s*:)/
  );
  if (stdMatch) standards = stdMatch[1].replace(/\s+/g, ' ').trim();

  const properties: { key: string; value: string }[] = [];
  for (let i = 0; i < PROPERTY_KEYS.length; i++) {
    const key = PROPERTY_KEYS[i];
    const escapedKey = escape(key);
    const nextKeys = PROPERTY_KEYS.slice(i + 1).map(escape).join('|');
    const stopPattern = nextKeys
      ? `(?=\\n\\s*(?:${nextKeys})\\s*:|\\n\\s*Модель\\s|$)`
      : `(?=\\n\\s*Модель\\s|$)`;
    const re = new RegExp(`${escapedKey}[^:]*:\\s*([\\s\\S]+?)${stopPattern}`);
    const m = text.match(re);
    if (m) properties.push({ key, value: m[1].replace(/\s+/g, ' ').trim() });
  }

  const table = extractTableFromLines(target.lines);

  return {
    title: 'Технічні характеристики та опис виробу',
    standards,
    properties,
    table,
  };
}

function extractTableFromLines(lines: string[]): TechSpecsTable {
  const headerIdx = lines.findIndex(
    (l) => /^Модель\s/.test(l) || /Модель\s+ГС/.test(l)
  );
  if (headerIdx === -1) return { headers: [], rows: [] };

  const headerLine = lines[headerIdx];
  const headerParts = headerLine.split(/\s{2,}/).map((s) => s.trim()).filter(Boolean);
  if (headerParts.length < 2) return { headers: [], rows: [] };

  const rows: string[][] = [];
  const rowKeywords = ['Артикул', 'Qmax', 'Gmax', 'Діаметр'];

  for (let i = headerIdx + 1; i < lines.length; i++) {
    const line = lines[i];
    const startsWithKeyword = rowKeywords.some((kw) => line.startsWith(kw));
    if (startsWithKeyword) {
      const parts = line.split(/\s{2,}/).map((s) => s.trim()).filter(Boolean);
      if (parts.length >= 2) {
        while (parts.length < headerParts.length) parts.push('');
        rows.push(parts);
      }
    }
  }

  return { headers: headerParts, rows };
}
