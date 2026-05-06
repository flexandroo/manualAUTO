import type { TextStyle } from '../types/instruction';

export interface ResolvedStyle {
  fontSize: string;
  fontWeight: number;
  color?: string;
}

// Merges optional user override over the per-element defaults and returns
// a CSS-ready style object. `color` is included only if the user set one
// — otherwise we leave it undefined so the element's CSS class colour
// (e.g. orange numbers, navy headers) is preserved.
export function resolveStyle(
  userStyle: TextStyle | undefined,
  defaults: Required<Pick<TextStyle, 'fontSize' | 'bold'>>
): ResolvedStyle {
  const size = userStyle?.fontSize ?? defaults.fontSize;
  const bold = userStyle?.bold !== undefined ? userStyle.bold : defaults.bold;
  const out: ResolvedStyle = {
    fontSize: `${size}px`,
    fontWeight: bold ? 800 : 400,
  };
  if (userStyle?.color) out.color = userStyle.color;
  return out;
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
    const empty =
      next.fontSize === undefined && next.bold === undefined && !next.color;
    if (empty) {
      delete newStyles[key];
    } else {
      newStyles[key] = next;
    }
    onChange({ ...data, styles: newStyles });
  };
}
