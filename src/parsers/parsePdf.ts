import type { ParseResult } from '../types/instruction';
import { extractStructuredText } from './pdfExtract';
import { parseCover } from '../blocks/cover/coverParser';
import { parseTechSpecs } from '../blocks/techSpecs/techSpecsParser';
import { parseSections } from '../blocks/sections/sectionsParser';
import { initialData } from '../data/initialData';

export async function parsePdfToData(pdfFile: File): Promise<ParseResult> {
  const pages = await extractStructuredText(pdfFile);
  const cover = parseCover(pages[0]);
  const techSpecs = parseTechSpecs(pages);
  const sections = parseSections(pages);

  const report = {
    cover: {
      title: !!cover.title,
      models: !!cover.models,
      documentType: !!cover.documentType,
    },
    techSpecs: {
      standards: !!techSpecs?.standards,
      properties: techSpecs?.properties.length ?? 0,
      tableHeaders: techSpecs?.table.headers.length ?? 0,
      tableRows: techSpecs?.table.rows.length ?? 0,
    },
    sections: { items: sections.items.length },
  };

  return {
    data: {
      cover,
      techSpecs: techSpecs ?? initialData.techSpecs,
      sections,
    },
    report,
    pages: pages.length,
  };
}
