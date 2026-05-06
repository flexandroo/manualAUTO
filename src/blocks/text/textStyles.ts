import type { TextBlockData, TextStyle } from '../../types/instruction';
import { resolveStyle } from '../../utils/blockStyles';

export const TEXT_DEFAULTS: Record<string, Required<TextStyle>> = {
  heading: { fontSize: 15, bold: true },
  body: { fontSize: 11, bold: false },
};

export function textFontStyle(data: TextBlockData, key: string) {
  return resolveStyle(data.styles?.[key], TEXT_DEFAULTS[key]);
}
