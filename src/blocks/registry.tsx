import type { ComponentType } from 'react';
import {
  FileText,
  ShieldAlert,
  Layers,
  ListOrdered,
  ScrollText,
  type LucideIcon,
} from 'lucide-react';
import type {
  Block,
  BlockType,
  CoverBlock,
  SafetyBlockData,
  TextBlockData,
  InstallationStepsBlockData,
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
import { WarrantyEditor } from './warranty/WarrantyEditor';
import { WarrantyPreview } from './warranty/WarrantyPreview';

interface BlockSpec<T extends Block> {
  type: T['type'];
  label: string;
  icon: LucideIcon;
  Editor: ComponentType<{ data: T; onChange: (d: T) => void }>;
  Preview: ComponentType<{ data: T }>;
  createNew: () => T;
  unique?: boolean; // some blocks should appear at most once
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
  warranty: warrantySpec,
};

export const BLOCK_TYPE_ORDER: BlockType[] = [
  'cover',
  'safety',
  'text',
  'installationSteps',
  'warranty',
];

export function getBlockSpec(type: BlockType): BlockSpec<Block> {
  return BLOCK_REGISTRY[type] as BlockSpec<Block>;
}
