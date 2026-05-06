export interface CoverData {
  brand: string;
  title: string;
  models: string;
  documentType: string;
  subtitle: string;
}

export interface TechSpecProperty {
  key: string;
  value: string;
}

export interface TechSpecsTable {
  headers: string[];
  rows: string[][];
}

export interface TechSpecsData {
  title: string;
  standards: string;
  properties: TechSpecProperty[];
  table: TechSpecsTable;
}

export interface SectionItem {
  heading: string;
  text: string;
}

export interface SectionsData {
  title: string;
  items: SectionItem[];
}

export interface InstructionData {
  cover: CoverData;
  techSpecs: TechSpecsData;
  sections: SectionsData;
}

export interface ParseReport {
  cover: { title: boolean; models: boolean; documentType: boolean };
  techSpecs: { standards: boolean; properties: number; tableHeaders: number; tableRows: number };
  sections: { items: number };
}

export interface ParseResult {
  data: InstructionData;
  report: ParseReport;
  pages: number;
}

export type BlockId = 'cover' | 'techSpecs' | 'sections';
