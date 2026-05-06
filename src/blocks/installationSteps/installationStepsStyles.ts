import type { InstallationStepsBlockData, TextStyle } from '../../types/instruction';
import { resolveStyle } from '../../utils/blockStyles';

export const INSTALLATION_DEFAULTS: Record<string, Required<TextStyle>> = {
  heading: { fontSize: 15, bold: true },
  intro: { fontSize: 11, bold: false },
  stepNumber: { fontSize: 12, bold: true },
  stepBody: { fontSize: 11, bold: false },
};

export function installationFontStyle(data: InstallationStepsBlockData, key: string) {
  return resolveStyle(data.styles?.[key], INSTALLATION_DEFAULTS[key]);
}
