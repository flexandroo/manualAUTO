import type { TextStyle } from '../../types/instruction';

interface Props {
  value: TextStyle | undefined;
  onChange: (next: TextStyle) => void;
  defaultSize: number;
  defaultBold: boolean;
}

// Inline row of font controls: numeric size input + bold toggle.
// Size left empty = use default; bold toggle is tri-state via reset link.
export function TextStyleControls({ value, onChange, defaultSize, defaultBold }: Props) {
  const v = value ?? {};
  const effectiveSize = v.fontSize ?? defaultSize;
  const effectiveBold = v.bold !== undefined ? v.bold : defaultBold;
  const isCustom = v.fontSize !== undefined || v.bold !== undefined;

  return (
    <div className="flex gap-1.5 items-center mt-1">
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
      {isCustom && (
        <button
          onClick={() => onChange({})}
          title="Скинути до значення за замовчуванням"
          className="text-[10px] text-slate-500 hover:text-orange-400 underline"
        >
          скинути
        </button>
      )}
    </div>
  );
}
