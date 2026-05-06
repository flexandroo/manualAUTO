import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import type {
  InstallationStep,
  InstallationStepsBlockData,
  TextStyle,
} from '../../types/instruction';
import { FieldGroup } from '../../components/ui/FieldGroup';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { IconBtn } from '../../components/ui/IconBtn';
import { TextStyleControls } from '../../components/ui/TextStyleControls';
import { makeStyleUpdater } from '../../utils/blockStyles';
import { INSTALLATION_DEFAULTS } from './installationStepsStyles';

interface Props {
  data: InstallationStepsBlockData;
  onChange: (data: InstallationStepsBlockData) => void;
}

export function InstallationStepsEditor({ data, onChange }: Props) {
  const styles = data.styles ?? {};
  const updateStyle = makeStyleUpdater(data, onChange);
  const styleFor = (key: string) => (
    <TextStyleControls
      value={styles[key]}
      onChange={(s: TextStyle) => updateStyle(key, s)}
      defaultSize={INSTALLATION_DEFAULTS[key].fontSize}
      defaultBold={INSTALLATION_DEFAULTS[key].bold}
    />
  );

  const updateStep = <K extends keyof InstallationStep>(
    i: number,
    field: K,
    value: InstallationStep[K]
  ) => {
    const next = [...data.steps];
    next[i] = { ...next[i], [field]: value };
    onChange({ ...data, steps: next });
  };
  const addStep = () => {
    const lastNum = data.steps.at(-1)?.number ?? '2.0';
    const parts = lastNum.split('.');
    const nextNum = `${parts[0]}.${parseInt(parts[1] || '0', 10) + 1}`;
    onChange({ ...data, steps: [...data.steps, { number: nextNum, body: '' }] });
  };
  const removeStep = (i: number) =>
    onChange({ ...data, steps: data.steps.filter((_, idx) => idx !== i) });
  const moveStep = (i: number, dir: -1 | 1) => {
    const next = [...data.steps];
    const target = i + dir;
    if (target < 0 || target >= next.length) return;
    [next[i], next[target]] = [next[target], next[i]];
    onChange({ ...data, steps: next });
  };

  return (
    <div>
      <FieldGroup label="Заголовок розділу">
        <Input
          value={data.heading}
          onChange={(e) => onChange({ ...data, heading: e.target.value })}
        />
        {styleFor('heading')}
      </FieldGroup>
      <FieldGroup label="Вступний абзац" hint="Опціонально">
        <Textarea
          value={data.intro}
          onChange={(e) => onChange({ ...data, intro: e.target.value })}
          rows={3}
        />
        {styleFor('intro')}
      </FieldGroup>

      <div className="mb-2 flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Кроки ({data.steps.length})
        </label>
        <IconBtn onClick={addStep} variant="primary" title="Додати крок">
          <Plus size={14} />
        </IconBtn>
      </div>

      <div className="space-y-3">
        {data.steps.map((s, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded p-3">
            <div className="flex items-center gap-2 mb-2">
              <input
                value={s.number}
                onChange={(e) => updateStep(i, 'number', e.target.value)}
                className="w-14 bg-slate-800 text-orange-300 font-mono font-bold rounded px-2 py-1 text-xs"
              />
              <div className="flex-1" />
              <IconBtn onClick={() => moveStep(i, -1)} title="Вгору">
                <ChevronUp size={14} />
              </IconBtn>
              <IconBtn onClick={() => moveStep(i, 1)} title="Вниз">
                <ChevronDown size={14} />
              </IconBtn>
              <IconBtn onClick={() => removeStep(i)} variant="danger" title="Видалити">
                <Trash2 size={14} />
              </IconBtn>
            </div>
            <Textarea
              value={s.body}
              onChange={(e) => updateStep(i, 'body', e.target.value)}
              rows={3}
              placeholder="Текст кроку"
            />
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-slate-800">
        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2">
          Стиль кроків (на всі)
        </div>
        <div className="space-y-1">
          <div className="text-[11px] text-slate-400">Номер кроку:</div>
          {styleFor('stepNumber')}
          <div className="text-[11px] text-slate-400 mt-2">Текст кроку:</div>
          {styleFor('stepBody')}
        </div>
      </div>
    </div>
  );
}
