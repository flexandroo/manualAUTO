import type { FigureGridBlockData, TextStyle } from '../../types/instruction';
import { resolveStyle } from '../../utils/blockStyles';

export const FIGURE_GRID_DEFAULTS: Record<string, Required<TextStyle>> = {
  heading: { fontSize: 15, bold: true },
  caption: { fontSize: 10, bold: true },
};

export function figureGridFontStyle(data: FigureGridBlockData, key: string) {
  return resolveStyle(data.styles?.[key], FIGURE_GRID_DEFAULTS[key]);
}
