import type { StickerData } from './types';
import { newId } from '../utils/id';
import { CERTIFICATION_LIBRARY } from './certificationLibrary';

// Default sample: TERMOJET-styled but with the FERRO ZMVA230 info shape
// the user wants to support — single product, photo + barcode slots,
// multilingual descriptions, technical specs, distributor info.
export function makeInitialSticker(): StickerData {
  return {
    id: newId('stk'),
    titleLines: ['Колектор', 'розподільчий'],
    productCode: 'К22В.125(200)',
    articleCode: '84040212',
    specs: [
      { key: 'Підключення', value: '1¼″' },
      { key: 'Міжосьова відстань', value: '125 мм' },
      { key: 'Контурів', value: '2' },
    ],
    translations: [
      { langCode: 'UA', text: 'Колектор розподільчий з виходами вгору' },
      { langCode: 'EN', text: 'Distribution manifold with upward outlets' },
      { langCode: 'PL', text: 'Kolektor rozdzielczy z wyjściami do góry' },
    ],
    distributorInfo:
      "Виробник: TERMOJET, Україна, www.termojet.com.ua. " +
      "Гарантія — 24 місяці з дати продажу за умови наявності товарної накладної.",
    selectedCertIds: CERTIFICATION_LIBRARY.map((c) => c.id),
    fontSizes: {},
    footnote: '',
    footer: 'www.termojet.com.ua',
    widthMm: 150,
    heightMm: 90,
    accentColor: '#F25D2A',
    textScale: 1.0,
  };
}
