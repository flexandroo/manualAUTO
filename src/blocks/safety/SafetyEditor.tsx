import { Plus, Trash2, ChevronUp, ChevronDown, RotateCcw } from 'lucide-react';
import type { SafetyBlockData, SafetySubsection, TextStyle } from '../../types/instruction';
import { FieldGroup } from '../../components/ui/FieldGroup';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { IconBtn } from '../../components/ui/IconBtn';
import { TextStyleControls } from '../../components/ui/TextStyleControls';
import { makeStyleUpdater } from '../../utils/blockStyles';
import { SAFETY_TEMPLATE, SAFETY_BLOCK_TITLE } from '../../templates/safetyBlock';
import { SAFETY_DEFAULTS } from './safetyStyles';
import { confirmAction } from '../../utils/confirm';

interface Props {
  data: SafetyBlockData;
  onChange: (data: SafetyBlockData) => void;
}

export function SafetyEditor({ data, onChange }: Props) {
  const styles = data.styles ?? {};
  const updateStyle = makeStyleUpdater(data, onChange);
  const styleFor = (key: string) => (
    <TextStyleControls
      value={styles[key]}
      onChange={(s: TextStyle) => updateStyle(key, s)}
      defaultSize={SAFETY_DEFAULTS[key].fontSize}
      defaultBold={SAFETY_DEFAULTS[key].bold}
    />
  );

  const updateItem = <K extends keyof SafetySubsection>(
    i: number,
    field: K,
    value: SafetySubsection[K]
  ) => {
    const next = [...data.subsections];
    next[i] = { ...next[i], [field]: value };
    onChange({ ...data, subsections: next });
  };
  const addItem = () => {
    const lastNum = data.subsections.at(-1)?.number ?? '1.0';
    const parts = lastNum.split('.');
    const nextNum = `${parts[0]}.${parseInt(parts[1] || '0', 10) + 1}`;
    onChange({
      ...data,
      subsections: [...data.subsections, { number: nextNum, heading: 'Новий підрозділ', body: '' }],
    });
  };
  const removeItem = (i: number) =>
    onChange({ ...data, subsections: data.subsections.filter((_, idx) => idx !== i) });
  const moveItem = (i: number, dir: -1 | 1) => {
    const next = [...data.subsections];
    const target = i + dir;
    if (target < 0 || target >= next.length) return;
    [next[i], next[target]] = [next[target], next[i]];
    onChange({ ...data, subsections: next });
  };
  const resetToTemplate = () => {
    if (
      confirmAction(
        'Замінити весь вміст на стандартний шаблон? Поточні зміни в цьому блоці будуть втрачені.'
      )
    ) {
      onChange({ ...data, title: SAFETY_BLOCK_TITLE, subsections: SAFETY_TEMPLATE.map((s) => ({ ...s })) });
    }
  };

  return (
    <div>
      <FieldGroup label="Заголовок розділу">
        <Input value={data.title} onChange={(e) => onChange({ ...data, title: e.target.value })} />
        {styleFor('title')}
      </FieldGroup>

      <div className="mb-4">
        <button
          onClick={resetToTemplate}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium"
          title="Замінити весь вміст на канонічний шаблон з КГС"
        >
          <RotateCcw size={12} /> Скинути до стандартного шаблону
        </button>
      </div>

      <div className="mb-2 flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Підрозділи ({data.subsections.length})
        </label>
        <IconBtn onClick={addItem} variant="primary" title="Додати підрозділ">
          <Plus size={14} />
        </IconBtn>
      </div>

      <div className="space-y-3">
        {data.subsections.map((s, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded p-3">
            <div className="flex items-center gap-2 mb-2">
              <input
                value={s.number}
                onChange={(e) => updateItem(i, 'number', e.target.value)}
                className="w-14 bg-slate-800 text-orange-300 font-mono font-bold rounded px-2 py-1 text-xs"
              />
              <Input
                value={s.heading}
                onChange={(e) => updateItem(i, 'heading', e.target.value)}
                placeholder="Заголовок"
              />
              <IconBtn onClick={() => moveItem(i, -1)} title="Вгору">
                <ChevronUp size={14} />
              </IconBtn>
              <IconBtn onClick={() => moveItem(i, 1)} title="Вниз">
                <ChevronDown size={14} />
              </IconBtn>
              <IconBtn onClick={() => removeItem(i)} variant="danger" title="Видалити">
                <Trash2 size={14} />
              </IconBtn>
            </div>
            <Textarea
              value={s.body}
              onChange={(e) => updateItem(i, 'body', e.target.value)}
              rows={4}
              placeholder="Текст підрозділу"
            />
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-slate-800">
        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2">
          Стиль підрозділів (на всі)
        </div>
        <div className="space-y-1">
          <div className="text-[11px] text-slate-400">Заголовок підрозділу:</div>
          {styleFor('subsectionHeading')}
          <div className="text-[11px] text-slate-400 mt-2">Текст підрозділу:</div>
          {styleFor('subsectionBody')}
        </div>
      </div>
    </div>
  );
}
