// Discriminated union for all block types in an instruction document.
// Adding a new block type: extend BlockType, add interface, add to Block union,
// register Editor + Preview in src/blocks/registry.ts.

export type BlockType =
  | 'cover'
  | 'safety'
  | 'text'
  | 'installationSteps'
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

export type Block =
  | CoverBlock
  | SafetyBlockData
  | TextBlockData
  | InstallationStepsBlockData
  | WarrantyBlockData;

export interface InstructionData {
  productName: string;
  blocks: Block[];
}
