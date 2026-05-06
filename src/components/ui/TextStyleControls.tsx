import type { TextStyle } from '../../types/instruction';

interface Props {
  value: TextStyle | undefined;
  onChange: (next: TextStyle) => void;
  defaultSize: number;
  defaultBold: boolean;
  /** Default colour shown in the picker swatch when the user hasn't picked
   *  a custom one. Doesn't apply unless they explicitly pick. */
  defaultColor?: string;
}

// Inline row of font controls: numeric size input + bold toggle + colour
// picker. Each control is independent — leaving any of them at default
// means the element's CSS class wins. Reset link nukes the whole override.
export function TextStyleControls({
  value,
  onChange,
  defaultSize,
  defaultBold,
  defaultColor = '#1A2035',
}: Props) {
  const v = value ?? {};
  const effectiveSize = v.fontSize ?? defaultSize;
  const effectiveBold = v.bold !== undefined ? v.bold : defaultBold;
  const colorActive = !!v.color;
  const isCustom =
    v.fontSize !== undefined || v.bold !== undefined || !!v.color;

  return (
    <div className="flex gap-1.5 items-center mt-1 flex-wrap">
      <span className="text-[10px] text-slate-500 uppercase tracking-wider">Стиль:</span>
      <input
        type="number"
        min={6}
        max={200}
        step={1}
        value={effectiveSize}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10);
          onChange({ ...v, fontSize: Number.isFinite(n) ? n : undefined });
        }}
        title="Розмір шрифту, px"
        className="w-14 bg-slate-800 text-slate-200 rounded px-1.5 py-0.5 text-xs"
      />
      <span className="text-[10px] text-slate-500">px</span>
      <button
        onClick={() => onChange({ ...v, bold: !effectiveBold })}
        title={effectiveBold ? 'Жирний' : 'Звичайний'}
        className={`px-2 py-0.5 rounded text-xs font-extrabold transition-colors ${
          effectiveBold
            ? 'bg-orange-600 text-white'
            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
        }`}
      >
        B
      </button>
      <label
        className="relative inline-flex items-center"
        title={colorActive ? `Колір: ${v.color}` : 'Колір тексту'}
      >
        <input
          type="color"
          value={v.color ?? defaultColor}
          onChange={(e) => onChange({ ...v, color: e.target.value })}
          className="w-5 h-5 cursor-pointer rounded border border-slate-700 bg-transparent appearance-none p-0"
          style={{ borderColor: colorActive ? v.color : undefined }}
        />
      </label>
      {colorActive && (
        <button
          onClick={() => {
            const next = { ...v };
            delete next.color;
            onChange(next);
          }}
          title="Скинути колір"
          className="text-[10px] text-slate-500 hover:text-orange-400"
        >
          ×
        </button>
      )}
      {isCustom && (
        <button
          onClick={() => onChange({})}
          title="Скинути все до значень за замовчуванням"
          className="text-[10px] text-slate-500 hover:text-orange-400 underline"
        >
          скинути
        </button>
      )}
    </div>
  );
}
