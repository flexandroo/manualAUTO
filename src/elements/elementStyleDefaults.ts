import type { TextStyle } from '../types/instruction';

// Default {fontSize, bold} for every "style key" of every element type.
// Editors render TextStyleControls below each text field; the renderer
// reads the resolved style via resolveStyle(userOverride, default).
export const ELEMENT_STYLE_DEFAULTS = {
  heading: {
    text: { fontSize: 10, bold: true },
  },
  subsection: {
    number: { fontSize: 9, bold: true },
    heading: { fontSize: 11, bold: true },
    body: { fontSize: 11, bold: false },
  },
  paragraph: {
    text: { fontSize: 11, bold: false },
  },
  bulletList: {
    item: { fontSize: 11, bold: false },
  },
  numberedList: {
    number: { fontSize: 13, bold: true },
    text: { fontSize: 11, bold: false },
  },
  table: {
    header: { fontSize: 9, bold: true },
    cell: { fontSize: 10, bold: false },
  },
  kvList: {
    title: { fontSize: 9, bold: true },
    key: { fontSize: 9, bold: true },
    value: { fontSize: 9, bold: false },
  },
  scheme: {
    number: { fontSize: 9, bold: true },
    label: { fontSize: 10, bold: false },
    flow: { fontSize: 9, bold: false },
  },
  image: {
    caption: { fontSize: 9, bold: true },
  },
  imageGrid: {
    caption: { fontSize: 9, bold: true },
  },
  warning: {
    title: { fontSize: 10, bold: true },
    body: { fontSize: 10, bold: false },
  },
} as const;

export type ElementStyleKey<T extends keyof typeof ELEMENT_STYLE_DEFAULTS> =
  keyof typeof ELEMENT_STYLE_DEFAULTS[T];

export function getDefault(
  elType: keyof typeof ELEMENT_STYLE_DEFAULTS,
  key: string
): Required<TextStyle> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (ELEMENT_STYLE_DEFAULTS as any)[elType]?.[key] ?? { fontSize: 11, bold: false };
}
