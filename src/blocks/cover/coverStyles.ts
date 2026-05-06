import type { CoverBlock, TextStyle } from '../../types/instruction';
import { resolveStyle } from '../../utils/blockStyles';

export const COVER_DEFAULTS: Record<string, Required<TextStyle>> = {
  brandTagline: { fontSize: 13, bold: true },
  productName: { fontSize: 48, bold: true },
  modelCodes: { fontSize: 13, bold: true },
  documentType: { fontSize: 14, bold: true },
  subtitle: { fontSize: 14, bold: true },
  bulletPoints: { fontSize: 14, bold: true },
};

// Backwards-compatible alias used by the existing CoverEditor + CoverPreview.
export const COVER_DEFAULT_STYLES = COVER_DEFAULTS;

export function coverFontStyle(data: CoverBlock, key: string) {
  return resolveStyle(data.styles?.[key], COVER_DEFAULTS[key]);
}
