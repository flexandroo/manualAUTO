import type { TextStyle, WarningCalloutData } from '../../types/instruction';
import { resolveStyle } from '../../utils/blockStyles';

export const WARNING_DEFAULTS: Record<string, Required<TextStyle>> = {
  title: { fontSize: 13, bold: true },
  body: { fontSize: 11, bold: false },
};

export function warningFontStyle(data: WarningCalloutData, key: string) {
  return resolveStyle(data.styles?.[key], WARNING_DEFAULTS[key]);
}
