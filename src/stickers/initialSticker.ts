import type { StickerData } from './types';
import { newId } from '../utils/id';

// Sample data based on a real TERMOJET sticker (Колектор розподільчий
// з виходами вгору, К22В.125(200)/К32В.125(200)/К42В.125(200)/К52В.125(200))
// so the user sees something familiar on first open.
export function makeInitialSticker(): StickerData {
  return {
    id: newId('stk'),
    titleLines: ['Колектор', 'розподільчий', 'з виходами вгору'],
    variants: [
      { id: newId('v'), modelCode: 'К22В.125(200)', articleCode: '84040212' },
      { id: newId('v'), modelCode: 'К32В.125(200)', articleCode: '84040312' },
      { id: newId('v'), modelCode: 'К42В.125(200)', articleCode: '84040412' },
      { id: newId('v'), modelCode: 'К52В.125(200)', articleCode: '84040512' },
    ],
    showInsulationCheckboxes: true,
    specs: [],
    footnote: '',
    footer: 'www.termojet.com.ua',
    widthMm: 100,
    heightMm: 140,
  };
}
