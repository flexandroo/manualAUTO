import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import type { ConstructionLegendData } from '../../types/instruction';
import { FieldGroup } from '../../components/ui/FieldGroup';
import { Input } from '../../components/ui/Input';
import { ImageUploader } from '../../components/ui/ImageUploader';
import { IconBtn } from '../../components/ui/IconBtn';

interface Props {
  data: ConstructionLegendData;
  onChange: (data: ConstructionLegendData) => void;
}

export function ConstructionLegendEditor({ data, onChange }: Props) {
  const updateItem = (i: number, field: 'number' | 'label', value: string) => {
    const next = [...data.items];
    if (field === 'number') {
      next[i] = { ...next[i], number: parseInt(value, 10) || 0 };
    } else {
      next[i] = { ...next[i], label: value };
    }
    onChange({ ...data, items: next });
  };
  const addItem = () => {
    const lastNum = data.items.at(-1)?.number ?? 0;
    onChange({ ...data, items: [...data.items, { number: lastNum + 1, label: '' }] });
  };
  const removeItem = (i: number) =>
    onChange({ ...data, items: data.items.filter((_, idx) => idx !== i) });
  const moveItem = (i: number, dir: -1 | 1) => {
    const next = [...data.items];
    const target = i + dir;
    if (target < 0 || target >= next.length) return;
    [next[i], next[target]] = [next[target], next[i]];
    onChange({ ...data, items: next });
  };

  const updateFlow = (i: number, field: 'color' | 'label', value: string) => {
    const next = [...data.flowLines];
    next[i] = { ...next[i], [field]: value };
    onChange({ ...data, flowLines: next });
  };
  const addFlow = () =>
    onChange({ ...data, flowLines: [...data.flowLines, { color: '#ff0000', label: '' }] });
  const removeFlow = (i: number) =>
    onChange({ ...data, flowLines: data.flowLines.filter((_, idx) => idx !== i) });

  return (
    <div>
      <FieldGroup label="Заголовок">
        <Input
          value={data.heading}
          onChange={(e) => onChange({ ...data, heading: e.target.value })}
        />
      </FieldGroup>

      <ImageUploader
        label="Зображення / схема"
        hint="PNG/JPG, до 8 МБ"
        value={data.imageUrl}
        onChange={(url) => onChange({ ...data, imageUrl: url })}
        aspectRatio="4/3"
      />

      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Виноски ({data.items.length})
          </label>
          <IconBtn onClick={addItem} variant="primary">
            <Plus size={14} />
          </IconBtn>
        </div>
        <div className="space-y-2">
          {data.items.map((it, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="number"
                value={it.number}
                onChange={(e) => updateItem(i, 'number', e.target.value)}
                className="w-12 bg-slate-800 text-orange-300 font-mono font-bold rounded px-2 py-1.5 text-xs"
              />
              <Input
                value={it.label}
                onChange={(e) => updateItem(i, 'label', e.target.value)}
                placeholder="Назва компонента"
              />
              <IconBtn onClick={() => moveItem(i, -1)}>
                <ChevronUp size={14} />
              </IconBtn>
              <IconBtn onClick={() => moveItem(i, 1)}>
                <ChevronDown size={14} />
              </IconBtn>
              <IconBtn onClick={() => removeItem(i)} variant="danger">
                <Trash2 size={14} />
              </IconBtn>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Лінії потоку (опціонально)
          </label>
          <IconBtn onClick={addFlow} variant="primary">
            <Plus size={14} />
          </IconBtn>
        </div>
        <div className="space-y-2">
          {data.flowLines.map((f, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="color"
                value={f.color}
                onChange={(e) => updateFlow(i, 'color', e.target.value)}
                className="w-10 h-9 bg-slate-900 rounded cursor-pointer"
              />
              <Input
                value={f.label}
                onChange={(e) => updateFlow(i, 'label', e.target.value)}
                placeholder='Наприклад "Лінія подачі Т1"'
              />
              <IconBtn onClick={() => removeFlow(i)} variant="danger">
                <Trash2 size={14} />
              </IconBtn>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
