import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import type { SectionsData } from '../../types/instruction';
import { FieldGroup } from '../../components/ui/FieldGroup';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { IconBtn } from '../../components/ui/IconBtn';

interface Props {
  data: SectionsData;
  onChange: (data: SectionsData) => void;
}

export function SectionsEditor({ data, onChange }: Props) {
  const updateItem = (i: number, field: 'heading' | 'text', value: string) => {
    const newItems = [...data.items];
    newItems[i] = { ...newItems[i], [field]: value };
    onChange({ ...data, items: newItems });
  };
  const addItem = () =>
    onChange({ ...data, items: [...data.items, { heading: 'Новий розділ', text: '' }] });
  const removeItem = (i: number) =>
    onChange({ ...data, items: data.items.filter((_, idx) => idx !== i) });
  const moveItem = (i: number, dir: -1 | 1) => {
    const newItems = [...data.items];
    const target = i + dir;
    if (target < 0 || target >= newItems.length) return;
    [newItems[i], newItems[target]] = [newItems[target], newItems[i]];
    onChange({ ...data, items: newItems });
  };

  return (
    <div>
      <FieldGroup label="Заголовок розділу">
        <Input value={data.title} onChange={(e) => onChange({ ...data, title: e.target.value })} />
      </FieldGroup>
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Пронумеровані пункти
          </label>
          <IconBtn onClick={addItem} variant="primary">
            <Plus size={14} />
          </IconBtn>
        </div>
        <div className="space-y-3">
          {data.items.map((item, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-orange-400 font-mono text-sm font-bold w-6">{i + 1}.</span>
                <Input
                  value={item.heading}
                  onChange={(e) => updateItem(i, 'heading', e.target.value)}
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
              <Textarea
                value={item.text}
                onChange={(e) => updateItem(i, 'text', e.target.value)}
                rows={3}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
