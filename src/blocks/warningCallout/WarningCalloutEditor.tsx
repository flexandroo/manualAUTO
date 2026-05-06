import type { TextStyle, WarningCalloutData } from '../../types/instruction';
import { FieldGroup } from '../../components/ui/FieldGroup';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { TextStyleControls } from '../../components/ui/TextStyleControls';
import { makeStyleUpdater } from '../../utils/blockStyles';
import { WARNING_DEFAULTS } from './warningCalloutStyles';

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
  const styles = data.styles ?? {};
  const updateStyle = makeStyleUpdater(data, onChange);
  const styleFor = (key: string) => (
    <TextStyleControls
      value={styles[key]}
      onChange={(s: TextStyle) => updateStyle(key, s)}
      defaultSize={WARNING_DEFAULTS[key].fontSize}
      defaultBold={WARNING_DEFAULTS[key].bold}
    />
  );

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
        {styleFor('title')}
      </FieldGroup>
      <FieldGroup label="Текст">
        <Textarea
          value={data.body}
          onChange={(e) => onChange({ ...data, body: e.target.value })}
          rows={5}
        />
        {styleFor('body')}
      </FieldGroup>
    </div>
  );
}
