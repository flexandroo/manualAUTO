import type { ConstructionLegendData, TextStyle } from '../../types/instruction';
import { resolveStyle } from '../../utils/blockStyles';

export const CONSTRUCTION_DEFAULTS: Record<string, Required<TextStyle>> = {
  heading: { fontSize: 15, bold: true },
  itemNumber: { fontSize: 11, bold: true },
  itemLabel: { fontSize: 11, bold: false },
  flowLine: { fontSize: 11, bold: false },
};

export function constructionFontStyle(data: ConstructionLegendData, key: string) {
  return resolveStyle(data.styles?.[key], CONSTRUCTION_DEFAULTS[key]);
}
