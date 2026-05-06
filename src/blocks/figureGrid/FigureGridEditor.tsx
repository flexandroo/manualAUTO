import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import type { FigureGridBlockData, FigureGridItem } from '../../types/instruction';
import { FieldGroup } from '../../components/ui/FieldGroup';
import { Input } from '../../components/ui/Input';
import { ImageUploader } from '../../components/ui/ImageUploader';
import { IconBtn } from '../../components/ui/IconBtn';
import { newId } from '../../utils/id';

interface Props {
  data: FigureGridBlockData;
  onChange: (data: FigureGridBlockData) => void;
}

export function FigureGridEditor({ data, onChange }: Props) {
  const updateFig = (i: number, patch: Partial<FigureGridItem>) => {
    const next = [...data.figures];
    next[i] = { ...next[i], ...patch };
    onChange({ ...data, figures: next });
  };
  const addFig = () => {
    onChange({
      ...data,
      figures: [
        ...data.figures,
        { id: newId('fig'), caption: `рис. ${data.figures.length + 1}`, imageUrl: undefined },
      ],
    });
  };
  const removeFig = (i: number) =>
    onChange({ ...data, figures: data.figures.filter((_, idx) => idx !== i) });
  const moveFig = (i: number, dir: -1 | 1) => {
    const next = [...data.figures];
    const target = i + dir;
    if (target < 0 || target >= next.length) return;
    [next[i], next[target]] = [next[target], next[i]];
    onChange({ ...data, figures: next });
  };

  return (
    <div>
      <FieldGroup label="Заголовок">
        <Input
          value={data.heading}
          onChange={(e) => onChange({ ...data, heading: e.target.value })}
        />
      </FieldGroup>

      <FieldGroup label="Колонок у сітці">
        <div className="flex gap-2">
          {([2, 3, 4] as const).map((n) => (
            <button
              key={n}
              onClick={() => onChange({ ...data, columns: n })}
              className={`flex-1 py-2 rounded text-xs font-bold transition-colors ${
                data.columns === n
                  ? 'bg-orange-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </FieldGroup>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Рисунки ({data.figures.length})
          </label>
          <IconBtn onClick={addFig} variant="primary">
            <Plus size={14} />
          </IconBtn>
        </div>
        <div className="space-y-3">
          {data.figures.map((f, i) => (
            <div key={f.id} className="bg-slate-900 border border-slate-800 rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <Input
                  value={f.caption}
                  onChange={(e) => updateFig(i, { caption: e.target.value })}
                  placeholder="Підпис, наприклад рис. 1"
                />
                <IconBtn onClick={() => moveFig(i, -1)}>
                  <ChevronUp size={14} />
                </IconBtn>
                <IconBtn onClick={() => moveFig(i, 1)}>
                  <ChevronDown size={14} />
                </IconBtn>
                <IconBtn onClick={() => removeFig(i)} variant="danger">
                  <Trash2 size={14} />
                </IconBtn>
              </div>
              <ImageUploader
                value={f.imageUrl}
                onChange={(url) => updateFig(i, { imageUrl: url })}
                aspectRatio="4/3"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
