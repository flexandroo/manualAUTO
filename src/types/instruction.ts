// Discriminated union for all block types in an instruction document.
// Adding a new block type: extend BlockType, add interface, add to Block union,
// register Editor + Preview in src/blocks/registry.ts.

export type BlockType =
  | 'cover'
  | 'safety'
  | 'text'
  | 'installationSteps'
  | 'techSpecs'
  | 'constructionLegend'
  | 'figureGrid'
  | 'warningCallout'
  | 'warranty';

export interface BlockBase {
  id: string;
  type: BlockType;
}

export interface CoverBlock extends BlockBase {
  type: 'cover';
  brand: string;
  brandLogoUrl?: string;
  productName: string;
  modelCodes: string[];
  documentType: string;
  subtitle: string;
  tagline: string;
  websiteUrl: string;
  productImages: string[];
  /** @deprecated use productImages */
  imageUrl?: string;
}

export interface SafetySubsection {
  number: string;
  heading: string;
  body: string;
}

export interface SafetyBlockData extends BlockBase {
  type: 'safety';
  title: string;
  subsections: SafetySubsection[];
}

export interface TextBlockData extends BlockBase {
  type: 'text';
  heading: string;
  body: string;
}

export interface InstallationStep {
  number: string;
  body: string;
}

export interface InstallationStepsBlockData extends BlockBase {
  type: 'installationSteps';
  heading: string;
  intro: string;
  steps: InstallationStep[];
}

export interface WarrantyField {
  label: string;
  value: string;
}

export interface WarrantyBlockData extends BlockBase {
  type: 'warranty';
  title: string;
  fields: WarrantyField[];
  termText: string;
  conditionText: string;
  caseHeading: string;
  caseDocs: string[];
  reviewText: string;
}

export interface TechSpecProperty {
  key: string;
  value: string;
}

export interface TechSpecsTable {
  headers: string[];
  rows: string[][];
}

export interface TechSpecsBlockData extends BlockBase {
  type: 'techSpecs';
  heading: string;
  standards: string;
  properties: TechSpecProperty[];
  table: TechSpecsTable;
}

export interface ConstructionLegendItem {
  number: number;
  label: string;
}

export interface ConstructionLegendData extends BlockBase {
  type: 'constructionLegend';
  heading: string;
  imageUrl?: string;
  items: ConstructionLegendItem[];
  flowLines: { color: string; label: string }[];
}

export interface FigureGridItem {
  id: string;
  caption: string;
  imageUrl?: string;
}

export interface FigureGridBlockData extends BlockBase {
  type: 'figureGrid';
  heading: string;
  columns: 2 | 3 | 4;
  figures: FigureGridItem[];
}

export interface WarningCalloutData extends BlockBase {
  type: 'warningCallout';
  level: 'info' | 'warning' | 'danger';
  title: string;
  body: string;
}

export type Block =
  | CoverBlock
  | SafetyBlockData
  | TextBlockData
  | InstallationStepsBlockData
  | TechSpecsBlockData
  | ConstructionLegendData
  | FigureGridBlockData
  | WarningCalloutData
  | WarrantyBlockData;

export interface InstructionData {
  productName: string;
  blocks: Block[];
}
