import type { StandardPage } from '../../types/instruction';
import { FieldGroup } from '../../components/ui/FieldGroup';
import { Input } from '../../components/ui/Input';
import { ElementListEditor } from '../../components/ElementListEditor';

interface Props {
  data: StandardPage;
  onChange: (next: StandardPage) => void;
}

export function StandardPageEditor({ data, onChange }: Props) {
  return (
    <div>
      <FieldGroup label="Заголовок розділу">
        <Input
          value={data.sectionTitle}
          onChange={(e) => onChange({ ...data, sectionTitle: e.target.value })}
          placeholder="Наприклад: Основні положення"
        />
      </FieldGroup>

      <FieldGroup label="Підпис у футері (зліва)" hint="Якщо порожнє — використовується заголовок">
        <Input
          value={data.footerLabel ?? ''}
          onChange={(e) => onChange({ ...data, footerLabel: e.target.value })}
        />
      </FieldGroup>

      <FieldGroup label="Додатковий тег у футері" hint='Наприклад "Розд. 1.1–1.5"'>
        <Input
          value={data.footerLabelSecondary ?? ''}
          onChange={(e) => onChange({ ...data, footerLabelSecondary: e.target.value })}
        />
      </FieldGroup>

      <FieldGroup label="Розкладка">
        <div className="flex gap-2">
          <button
            onClick={() => onChange({ ...data, twoColumn: false })}
            className={`flex-1 py-2 rounded text-xs font-bold ${
              !data.twoColumn ? 'bg-orange-600 text-white' : 'bg-stone-100 text-stone-500'
            }`}
          >
            Одна колонка
          </button>
          <button
            onClick={() => onChange({ ...data, twoColumn: true })}
            className={`flex-1 py-2 rounded text-xs font-bold ${
              data.twoColumn ? 'bg-orange-600 text-white' : 'bg-stone-100 text-stone-500'
            }`}
          >
            Дві колонки
          </button>
        </div>
      </FieldGroup>

      <div className="border-t border-stone-100 pt-4 mt-2">
        <ElementListEditor
          elements={data.elements}
          onChange={(elements) => onChange({ ...data, elements })}
        />
      </div>
    </div>
  );
}
