import type { CoverData } from '../../types/instruction';
import type { PageData } from '../../parsers/pdfExtract';

export function parseCover(pageData: PageData): CoverData {
  const lines = pageData.lines;
  const cover: CoverData = {
    brand: 'TERMOJET',
    title: '',
    models: '',
    documentType: '',
    subtitle: '',
  };

  for (const l of lines) {
    if (/[А-ЯІЇЄҐ]/.test(l) && !l.includes('ГС-') && !l.includes('СЕРТИФІКАТ') && l.length > 8) {
      cover.title = l;
      break;
    }
  }

  cover.models = lines
    .filter((l) => l.includes('ГС-') && (l.includes(';') || l.endsWith('.')))
    .join(' ');
  cover.documentType = lines.find((l) => /СЕРТИФІКАТ|CERTIFICATE/i.test(l)) ?? '';
  cover.subtitle = lines.find((l) => /Інструкція.*експлуатаці/i.test(l)) ?? '';

  return cover;
}
