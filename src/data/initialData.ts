import type { InstructionData, StandardPage } from '../types/instruction';
import { PAGE_REGISTRY } from '../pages/pageRegistry';
import { newId } from '../utils/id';
import {
  makeSafetyPage1Elements,
  makeSafetyPage2Elements,
} from '../templates/safetyBlock';

// Builds a brand-new instruction document with the canonical TERMOJET spine:
// Cover -> Safety (1.1-1.12 prefilled, with warnings and bullet lists as
// proper element types) -> Warranty.
export function makeInitialData(): InstructionData {
  const cover = PAGE_REGISTRY.cover.createNew();
  const warranty = PAGE_REGISTRY.warranty.createNew();

  const safety: StandardPage = {
    id: newId('page'),
    type: 'standard',
    sectionTitle: 'Основні положення',
    footerLabel: 'Основні положення',
    footerLabelSecondary: 'Розд. 1.1–1.5',
    twoColumn: false,
    elements: makeSafetyPage1Elements(),
  };

  const safety2: StandardPage = {
    id: newId('page'),
    type: 'standard',
    sectionTitle: 'Основні положення (продовження)',
    footerLabel: 'Основні положення',
    footerLabelSecondary: 'Розд. 1.6–1.12',
    twoColumn: true,
    elements: makeSafetyPage2Elements(),
  };

  return {
    brand: 'TERMOJET',
    brandTagline: 'обладнання для котелень',
    productName: 'Назва продукту',
    modelCodes: [],
    documentType: 'ТЕХНІЧНИЙ ПАСПОРТ',
    websiteUrl: 'TERMOJET.COM.UA',
    coverCopyright: '',
    coverLanguage: 'UA | Українська мова',
    pages: [cover, safety, safety2, warranty],
  };
}

export const initialData: InstructionData = makeInitialData();
