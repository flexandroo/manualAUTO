import type { CoverBlock, CoverTextStyles, TextStyle } from '../../types/instruction';

// Per-element default font sizes (px) and bold state.
// Used when the user hasn't customised a particular element's style.
export const COVER_DEFAULT_STYLES: Record<keyof CoverTextStyles, Required<TextStyle>> = {
  brandTagline: { fontSize: 13, bold: true },
  productName: { fontSize: 48, bold: true },
  modelCodes: { fontSize: 13, bold: true },
  documentType: { fontSize: 14, bold: true },
  subtitle: { fontSize: 14, bold: true },
  bulletPoints: { fontSize: 14, bold: true },
};

// Resolves "what fontSize/bold should I render for element X" by merging
// the user's CoverTextStyles override (if any) with the element default.
export function resolveCoverStyle(
  data: CoverBlock,
  key: keyof CoverTextStyles
): Required<TextStyle> {
  const userStyle = data.styles?.[key] ?? {};
  const def = COVER_DEFAULT_STYLES[key];
  return {
    fontSize: userStyle.fontSize ?? def.fontSize,
    bold: userStyle.bold !== undefined ? userStyle.bold : def.bold,
  };
}

// Translates the resolved bold/fontSize into actual CSS values.
export function coverFontStyle(data: CoverBlock, key: keyof CoverTextStyles) {
  const r = resolveCoverStyle(data, key);
  return {
    fontSize: `${r.fontSize}px`,
    fontWeight: r.bold ? 800 : 400,
  };
}
