import type { ComponentType } from 'react';
import { FileText, Layers, ScrollText, type LucideIcon } from 'lucide-react';
import type { CoverPage, Page, PageType, StandardPage, WarrantyPage } from '../types/instruction';
import { newId } from '../utils/id';
import { CoverPageEditor } from './cover/CoverPageEditor';
import { CoverPagePreview } from './cover/CoverPagePreview';
import { StandardPageEditor } from './standard/StandardPageEditor';
import { StandardPagePreview } from './standard/StandardPagePreview';
import { WarrantyPageEditor } from './warranty/WarrantyPageEditor';
import { WarrantyPagePreview } from './warranty/WarrantyPagePreview';
import { WARRANTY_TEMPLATE, WARRANTY_BLOCK_TITLE } from '../templates/warrantyBlock';

interface PageSpec<T extends Page> {
  type: T['type'];
  label: string;
  icon: LucideIcon;
  Editor: ComponentType<{ data: T; onChange: (next: T) => void }>;
  Preview: ComponentType<{ data: T }>;
  createNew: () => T;
  unique?: boolean;
}

const coverSpec: PageSpec<CoverPage> = {
  type: 'cover',
  label: 'Титульна',
  icon: FileText,
  Editor: CoverPageEditor,
  Preview: CoverPagePreview,
  unique: true,
  createNew: () => ({
    id: newId('cover'),
    type: 'cover',
    subtitle: 'Інструкція з монтажу та експлуатації',
    bulletPoints: [
      'Простота встановлення',
      'Висока надійність',
      'Сертифікована якість',
    ],
    productImages: [],
    elements: [],
  }),
};

const standardSpec: PageSpec<StandardPage> = {
  type: 'standard',
  label: 'Сторінка з елементами',
  icon: Layers,
  Editor: StandardPageEditor,
  Preview: StandardPagePreview,
  createNew: () => ({
    id: newId('page'),
    type: 'standard',
    sectionTitle: 'Новий розділ',
    elements: [],
  }),
};

const warrantySpec: PageSpec<WarrantyPage> = {
  type: 'warranty',
  label: 'Гарантійний талон',
  icon: ScrollText,
  Editor: WarrantyPageEditor,
  Preview: WarrantyPagePreview,
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
    exclusions: [
      'Пошкодження внаслідок неправильного монтажу',
      'Недотримання умов експлуатації',
      'Використання не за призначенням',
      'Механічні пошкодження при транспортуванні',
      'Самостійне втручання в конструкцію',
    ],
  }),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PAGE_REGISTRY: Record<PageType, PageSpec<any>> = {
  cover: coverSpec,
  standard: standardSpec,
  warranty: warrantySpec,
};

export const PAGE_TYPE_ORDER: PageType[] = ['cover', 'standard', 'warranty'];

export function getPageSpec(type: PageType): PageSpec<Page> {
  return PAGE_REGISTRY[type] as PageSpec<Page>;
}
