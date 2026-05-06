import type { TextStyle } from '../types/instruction';

export interface ResolvedStyle {
  fontSize: string;
  fontWeight: number;
}

// Merges optional user override over the per-element defaults and returns
// CSS-ready { fontSize, fontWeight }.
export function resolveStyle(
  userStyle: TextStyle | undefined,
  defaults: Required<TextStyle>
): ResolvedStyle {
  const size = userStyle?.fontSize ?? defaults.fontSize;
  const bold = userStyle?.bold !== undefined ? userStyle.bold : defaults.bold;
  return {
    fontSize: `${size}px`,
    fontWeight: bold ? 800 : 400,
  };
}

// Returns an updater that any block editor can call from a TextStyleControls
// onChange handler. Handles the "delete the key when override is empty" case
// so JSON exports don't accumulate empty {} entries.
export function makeStyleUpdater<T extends { styles?: Record<string, TextStyle> }>(
  data: T,
  onChange: (d: T) => void
): (key: string, next: TextStyle) => void {
  return (key, next) => {
    const styles = data.styles ?? {};
    const newStyles: Record<string, TextStyle> = { ...styles };
    if (next.fontSize === undefined && next.bold === undefined) {
      delete newStyles[key];
    } else {
      newStyles[key] = next;
    }
    onChange({ ...data, styles: newStyles });
  };
}
