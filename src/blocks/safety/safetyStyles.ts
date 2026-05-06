import type { SafetyBlockData, TextStyle } from '../../types/instruction';
import { resolveStyle } from '../../utils/blockStyles';

export const SAFETY_DEFAULTS: Record<string, Required<TextStyle>> = {
  title: { fontSize: 15, bold: true },
  subsectionHeading: { fontSize: 10, bold: true },
  subsectionBody: { fontSize: 10, bold: false },
};

export function safetyFontStyle(data: SafetyBlockData, key: string) {
  return resolveStyle(data.styles?.[key], SAFETY_DEFAULTS[key]);
}
