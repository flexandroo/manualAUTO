import type { TechSpecsBlockData, TextStyle } from '../../types/instruction';
import { resolveStyle } from '../../utils/blockStyles';

export const TECH_SPECS_DEFAULTS: Record<string, Required<TextStyle>> = {
  heading: { fontSize: 15, bold: true },
  standards: { fontSize: 11, bold: false },
  property: { fontSize: 11, bold: false },
  tableHeader: { fontSize: 11, bold: true },
  tableCell: { fontSize: 11, bold: false },
};

export function techSpecsFontStyle(data: TechSpecsBlockData, key: string) {
  return resolveStyle(data.styles?.[key], TECH_SPECS_DEFAULTS[key]);
}
