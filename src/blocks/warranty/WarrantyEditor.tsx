import { Plus, Trash2, RotateCcw } from 'lucide-react';
import type { WarrantyBlockData } from '../../types/instruction';
import { FieldGroup } from '../../components/ui/FieldGroup';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { IconBtn } from '../../components/ui/IconBtn';
import { WARRANTY_TEMPLATE, WARRANTY_BLOCK_TITLE } from '../../templates/warrantyBlock';
import { confirmAction } from '../../utils/confirm';

interface Props {
  data: WarrantyBlockData;
  onChange: (data: WarrantyBlockData) => void;
}

export function WarrantyEditor({ data, onChange }: Props) {
  const updateField = (i: number, key: 'label' | 'value', value: string) => {
    const next = [...data.fields];
    next[i] = { ...next[i], [key]: value };
    onChange({ ...data, fields: next });
  };
  const addField = () =>
    onChange({ ...data, fields: [...data.fields, { label: 'Нове поле', value: '' }] });
  const removeField = (i: number) =>
    onChange({ ...data, fields: data.fields.filter((_, idx) => idx !== i) });

  const updateDoc = (i: number, value: string) => {
    const next = [...data.caseDocs];
    next[i] = value;
    onChange({ ...data, caseDocs: next });
  };
  const addDoc = () => onChange({ ...data, caseDocs: [...data.caseDocs, ''] });
  const removeDoc = (i: number) =>
    onChange({ ...data, caseDocs: data.caseDocs.filter((_, idx) => idx !== i) });

  const resetToTemplate = () => {
    if (confirmAction('Замінити весь вміст блоку гарантії на стандартний шаблон?')) {
      onChange({
        ...data,
        title: WARRANTY_BLOCK_TITLE,
        fields: WARRANTY_TEMPLATE.fields.map((f) => ({ ...f })),
        termText: WARRANTY_TEMPLATE.termText,
        conditionText: WARRANTY_TEMPLATE.conditionText,
        caseHeading: WARRANTY_TEMPLATE.caseHeading,
        caseDocs: [...WARRANTY_TEMPLATE.caseDocs],
        reviewText: WARRANTY_TEMPLATE.reviewText,
      });
    }
  };

  return (
    <div>
      <FieldGroup label="Заголовок розділу">
        <Input value={data.title} onChange={(e) => onChange({ ...data, title: e.target.value })} />
      </FieldGroup>

      <div className="mb-4">
        <button
          onClick={resetToTemplate}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium"
        >
          <RotateCcw size={12} /> Скинути до стандартного шаблону
        </button>
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Поля для заповнення
          </label>
          <IconBtn onClick={addField} variant="primary" title="Додати поле">
            <Plus size={14} />
          </IconBtn>
        </div>
        <div className="space-y-2">
          {data.fields.map((f, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={f.label}
                onChange={(e) => updateField(i, 'label', e.target.value)}
                placeholder="Назва поля"
              />
              <Input
                value={f.value}
                onChange={(e) => updateField(i, 'value', e.target.value)}
                placeholder="Значення (порожнє = заповнити при продажу)"
              />
              <IconBtn onClick={() => removeField(i)} variant="danger" title="Видалити">
                <Trash2 size={14} />
              </IconBtn>
            </div>
          ))}
        </div>
      </div>

      <FieldGroup label="Гарантійний термін">
        <Input
          value={data.termText}
          onChange={(e) => onChange({ ...data, termText: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="Умова надання">
        <Input
          value={data.conditionText}
          onChange={(e) => onChange({ ...data, conditionText: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="Заголовок переліку документів">
        <Input
          value={data.caseHeading}
          onChange={(e) => onChange({ ...data, caseHeading: e.target.value })}
        />
      </FieldGroup>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Перелік документів
          </label>
          <IconBtn onClick={addDoc} variant="primary" title="Додати документ">
            <Plus size={14} />
          </IconBtn>
        </div>
        <div className="space-y-2">
          {data.caseDocs.map((doc, i) => (
            <div key={i} className="flex gap-2">
              <Input value={doc} onChange={(e) => updateDoc(i, e.target.value)} />
              <IconBtn onClick={() => removeDoc(i)} variant="danger" title="Видалити">
                <Trash2 size={14} />
              </IconBtn>
            </div>
          ))}
        </div>
      </div>

      <FieldGroup label="Текст про термін розгляду">
        <Textarea
          value={data.reviewText}
          onChange={(e) => onChange({ ...data, reviewText: e.target.value })}
          rows={3}
        />
      </FieldGroup>
    </div>
  );
}
