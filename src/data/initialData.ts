import type { InstructionData, StandardPage, PageElement } from '../types/instruction';
import { PAGE_REGISTRY } from '../pages/pageRegistry';
import { newId } from '../utils/id';
import { SAFETY_TEMPLATE } from '../templates/safetyBlock';

// Builds a brand-new instruction document with the canonical TERMOJET spine:
// Cover -> Safety (1.1-1.12 prefilled) -> empty Standard pages for Specs +
// Construction + ... -> Warranty.
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
    elements: SAFETY_TEMPLATE.slice(0, 5).map(
      (s): PageElement => ({
        id: newId('s'),
        type: 'subsection',
        number: s.number,
        heading: s.heading,
        body: s.body,
      })
    ),
  };

  const safety2: StandardPage = {
    id: newId('page'),
    type: 'standard',
    sectionTitle: 'Основні положення (продовження)',
    footerLabel: 'Основні положення',
    footerLabelSecondary: 'Розд. 1.6–1.12',
    twoColumn: true,
    elements: SAFETY_TEMPLATE.slice(5).map(
      (s): PageElement => ({
        id: newId('s'),
        type: 'subsection',
        number: s.number,
        heading: s.heading,
        body: s.body,
      })
    ),
  };

  return {
    brand: 'TERMOJET',
    brandTagline: 'обладнання для котелень',
    productName: 'Назва продукту',
    modelCodes: [],
    documentType: 'ТЕХНІЧНИЙ ПАСПОРТ',
    websiteUrl: 'TERMOJET.COM.UA',
    pages: [cover, safety, safety2, warranty],
  };
}

export const initialData: InstructionData = makeInitialData();
