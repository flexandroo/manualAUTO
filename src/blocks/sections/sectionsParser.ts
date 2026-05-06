import type { SectionsData } from '../../types/instruction';
import type { PageData } from '../../parsers/pdfExtract';

const NEXT_BLOCK_KEYWORDS = [
  'Інструкція з монтажу',
  'Будова',
  'Габаритні розміри',
  'Гарантія',
];

export function parseSections(pages: PageData[]): SectionsData {
  const sectionPages: PageData[] = [];
  let inSection = false;
  for (const p of pages) {
    if (p.text.includes('Основні положення')) {
      inSection = true;
      sectionPages.push(p);
    } else if (inSection) {
      if (NEXT_BLOCK_KEYWORDS.some((b) => p.text.includes(b))) break;
      sectionPages.push(p);
    }
  }

  const fullText = sectionPages.map((p) => p.text).join('\n');
  const items: { heading: string; text: string }[] = [];

  const re = /(?:^|\n)(\d{1,2})\.\s+([^\n]+?)\n([\s\S]*?)(?=\n\d{1,2}\.\s+|\n[А-ЯІЇЄҐ][^.\n]{4,30}$|$)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(fullText)) !== null) {
    const heading = m[2].trim();
    const body = m[3]
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .replace('Основні положення', '')
      .trim();
    items.push({ heading, text: body });
  }

  return {
    title: 'Основні положення',
    items:
      items.length > 0
        ? items
        : [{ heading: '(не розпізнано)', text: 'Перевірте PDF вручну' }],
  };
}
