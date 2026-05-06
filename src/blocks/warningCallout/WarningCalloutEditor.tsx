import type { WarningCalloutData } from '../../types/instruction';
import { FieldGroup } from '../../components/ui/FieldGroup';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';

interface Props {
  data: WarningCalloutData;
  onChange: (data: WarningCalloutData) => void;
}

const LEVELS: { value: WarningCalloutData['level']; label: string; color: string }[] = [
  { value: 'info', label: 'Інформація', color: 'bg-blue-600' },
  { value: 'warning', label: 'Увага', color: 'bg-amber-500' },
  { value: 'danger', label: 'Небезпека', color: 'bg-red-600' },
];

export function WarningCalloutEditor({ data, onChange }: Props) {
  return (
    <div>
      <FieldGroup label="Рівень">
        <div className="flex gap-2">
          {LEVELS.map((lvl) => (
            <button
              key={lvl.value}
              onClick={() => onChange({ ...data, level: lvl.value })}
              className={`flex-1 py-2 rounded text-xs font-bold transition-colors ${
                data.level === lvl.value
                  ? `${lvl.color} text-white`
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {lvl.label}
            </button>
          ))}
        </div>
      </FieldGroup>
      <FieldGroup label="Заголовок">
        <Input
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="Текст">
        <Textarea
          value={data.body}
          onChange={(e) => onChange({ ...data, body: e.target.value })}
          rows={5}
        />
      </FieldGroup>
    </div>
  );
}
