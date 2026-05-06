import type { ComponentType } from 'react';
import {
  FileText,
  ShieldAlert,
  Layers,
  ListOrdered,
  ScrollText,
  Table2,
  Cog,
  Images,
  AlertTriangle,
  type LucideIcon,
} from 'lucide-react';
import type {
  Block,
  BlockType,
  CoverBlock,
  SafetyBlockData,
  TextBlockData,
  InstallationStepsBlockData,
  TechSpecsBlockData,
  ConstructionLegendData,
  FigureGridBlockData,
  WarningCalloutData,
  WarrantyBlockData,
} from '../types/instruction';
import { newId } from '../utils/id';
import { SAFETY_TEMPLATE, SAFETY_BLOCK_TITLE } from '../templates/safetyBlock';
import { WARRANTY_TEMPLATE, WARRANTY_BLOCK_TITLE } from '../templates/warrantyBlock';

import { CoverEditor } from './cover/CoverEditor';
import { CoverPreview } from './cover/CoverPreview';
import { SafetyEditor } from './safety/SafetyEditor';
import { SafetyPreview } from './safety/SafetyPreview';
import { TextEditor } from './text/TextEditor';
import { TextPreview } from './text/TextPreview';
import { InstallationStepsEditor } from './installationSteps/InstallationStepsEditor';
import { InstallationStepsPreview } from './installationSteps/InstallationStepsPreview';
import { TechSpecsEditor } from './techSpecs/TechSpecsEditor';
import { TechSpecsPreview } from './techSpecs/TechSpecsPreview';
import { ConstructionLegendEditor } from './constructionLegend/ConstructionLegendEditor';
import { ConstructionLegendPreview } from './constructionLegend/ConstructionLegendPreview';
import { FigureGridEditor } from './figureGrid/FigureGridEditor';
import { FigureGridPreview } from './figureGrid/FigureGridPreview';
import { WarningCalloutEditor } from './warningCallout/WarningCalloutEditor';
import { WarningCalloutPreview } from './warningCallout/WarningCalloutPreview';
import { WarrantyEditor } from './warranty/WarrantyEditor';
import { WarrantyPreview } from './warranty/WarrantyPreview';

interface BlockSpec<T extends Block> {
  type: T['type'];
  label: string;
  icon: LucideIcon;
  Editor: ComponentType<{ data: T; onChange: (d: T) => void }>;
  Preview: ComponentType<{ data: T }>;
  createNew: () => T;
  unique?: boolean;
}

const coverSpec: BlockSpec<CoverBlock> = {
  type: 'cover',
  label: 'Титульна',
  icon: FileText,
  Editor: CoverEditor,
  Preview: CoverPreview,
  unique: true,
  createNew: () => ({
    id: newId('cover'),
    type: 'cover',
    brand: 'TERMOJET',
    productName: 'Назва продукту',
    subtitle: 'Інструкція з монтажу та експлуатації',
    modelCodes: [],
    documentType: 'ТЕХНІЧНИЙ СЕРТИФІКАТ',
    bulletPoints: [
      'Просте і надійне з’єднання',
      'Високоефективний робочий діапазон',
      'Сертифікована якість матеріалів',
    ],
    tagline: 'Швидко ● Надійно ● Ефективно',
    websiteUrl: 'WWW.TERMOJET.COM.UA',
    productImages: [],
  }),
};

const safetySpec: BlockSpec<SafetyBlockData> = {
  type: 'safety',
  label: 'Основні положення',
  icon: ShieldAlert,
  Editor: SafetyEditor,
  Preview: SafetyPreview,
  unique: true,
  createNew: () => ({
    id: newId('safety'),
    type: 'safety',
    title: SAFETY_BLOCK_TITLE,
    subsections: SAFETY_TEMPLATE.map((s) => ({ ...s })),
  }),
};

const textSpec: BlockSpec<TextBlockData> = {
  type: 'text',
  label: 'Текстовий блок',
  icon: Layers,
  Editor: TextEditor,
  Preview: TextPreview,
  createNew: () => ({
    id: newId('text'),
    type: 'text',
    heading: 'Призначення',
    body: '',
  }),
};

const installationStepsSpec: BlockSpec<InstallationStepsBlockData> = {
  type: 'installationSteps',
  label: 'Інструкція з монтажу',
  icon: ListOrdered,
  Editor: InstallationStepsEditor,
  Preview: InstallationStepsPreview,
  createNew: () => ({
    id: newId('install'),
    type: 'installationSteps',
    heading: 'Інструкція по монтажу',
    intro: '',
    steps: [
      { number: '2.1', body: '' },
      { number: '2.2', body: '' },
    ],
  }),
};

const techSpecsSpec: BlockSpec<TechSpecsBlockData> = {
  type: 'techSpecs',
  label: 'Технічні характеристики',
  icon: Table2,
  Editor: TechSpecsEditor,
  Preview: TechSpecsPreview,
  createNew: () => ({
    id: newId('specs'),
    type: 'techSpecs',
    heading: 'Технічні характеристики',
    standards: '',
    properties: [],
    table: { headers: ['Модель'], rows: [] },
  }),
};

const constructionLegendSpec: BlockSpec<ConstructionLegendData> = {
  type: 'constructionLegend',
  label: 'Конструкція + легенда',
  icon: Cog,
  Editor: ConstructionLegendEditor,
  Preview: ConstructionLegendPreview,
  createNew: () => ({
    id: newId('construct'),
    type: 'constructionLegend',
    heading: 'Конструкція виробу',
    items: [],
    flowLines: [],
  }),
};

const figureGridSpec: BlockSpec<FigureGridBlockData> = {
  type: 'figureGrid',
  label: 'Сітка рисунків',
  icon: Images,
  Editor: FigureGridEditor,
  Preview: FigureGridPreview,
  createNew: () => ({
    id: newId('figs'),
    type: 'figureGrid',
    heading: 'Рисунки',
    columns: 3,
    figures: [],
  }),
};

const warningCalloutSpec: BlockSpec<WarningCalloutData> = {
  type: 'warningCallout',
  label: 'Попередження',
  icon: AlertTriangle,
  Editor: WarningCalloutEditor,
  Preview: WarningCalloutPreview,
  createNew: () => ({
    id: newId('warn'),
    type: 'warningCallout',
    level: 'warning',
    title: 'Увага!',
    body: '',
  }),
};

const warrantySpec: BlockSpec<WarrantyBlockData> = {
  type: 'warranty',
  label: 'Гарантія',
  icon: ScrollText,
  Editor: WarrantyEditor,
  Preview: WarrantyPreview,
  unique: true,
  createNew: () => ({
    id: newId('warranty'),
    type: 'warranty',
    title: WARRANTY_BLOCK_TITLE,
    fields: WARRANTY_TEMPLATE.fields.map((f) => ({ ...f })),
    termText: WARRANTY_TEMPLATE.termText,
    conditionText: WARRANTY_TEMPLATE.conditionText,
    caseHeading: WARRANTY_TEMPLATE.caseHeading,
    caseDocs: [...WARRANTY_TEMPLATE.caseDocs],
    reviewText: WARRANTY_TEMPLATE.reviewText,
  }),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const BLOCK_REGISTRY: Record<BlockType, BlockSpec<any>> = {
  cover: coverSpec,
  safety: safetySpec,
  text: textSpec,
  installationSteps: installationStepsSpec,
  techSpecs: techSpecsSpec,
  constructionLegend: constructionLegendSpec,
  figureGrid: figureGridSpec,
  warningCallout: warningCalloutSpec,
  warranty: warrantySpec,
};

// Order in the "+ add block" menu
export const BLOCK_TYPE_ORDER: BlockType[] = [
  'cover',
  'safety',
  'text',
  'installationSteps',
  'techSpecs',
  'constructionLegend',
  'figureGrid',
  'warningCallout',
  'warranty',
];

export function getBlockSpec(type: BlockType): BlockSpec<Block> {
  return BLOCK_REGISTRY[type] as BlockSpec<Block>;
}
