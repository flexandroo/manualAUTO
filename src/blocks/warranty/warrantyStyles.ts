import type { TextStyle, WarrantyBlockData } from '../../types/instruction';
import { resolveStyle } from '../../utils/blockStyles';

export const WARRANTY_DEFAULTS: Record<string, Required<TextStyle>> = {
  title: { fontSize: 15, bold: true },
  fieldLabel: { fontSize: 11, bold: true },
  fieldValue: { fontSize: 11, bold: false },
  termText: { fontSize: 12, bold: true },
  conditionText: { fontSize: 11, bold: false },
  caseHeading: { fontSize: 11, bold: true },
  caseDoc: { fontSize: 11, bold: false },
  reviewText: { fontSize: 10, bold: false },
};

export function warrantyFontStyle(data: WarrantyBlockData, key: string) {
  return resolveStyle(data.styles?.[key], WARRANTY_DEFAULTS[key]);
}
