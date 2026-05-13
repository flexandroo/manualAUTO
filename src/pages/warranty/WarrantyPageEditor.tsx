import { Plus, Trash2 } from 'lucide-react';
import type { WarrantyPage } from '../../types/instruction';
import { FieldGroup } from '../../components/ui/FieldGroup';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { IconBtn } from '../../components/ui/IconBtn';

interface Props {
  data: WarrantyPage;
  onChange: (next: WarrantyPage) => void;
}

export function WarrantyPageEditor({ data, onChange }: Props) {
  const updateField = (i: number, key: 'label' | 'value', v: string) => {
    const next = [...data.fields];
    next[i] = { ...next[i], [key]: v };
    onChange({ ...data, fields: next });
  };
  const addField = () =>
    onChange({ ...data, fields: [...data.fields, { label: 'Нове поле', value: '' }] });
  const removeField = (i: number) =>
    onChange({ ...data, fields: data.fields.filter((_, idx) => idx !== i) });

  const updateDoc = (i: number, v: string) => {
    const next = [...data.caseDocs];
    next[i] = v;
    onChange({ ...data, caseDocs: next });
  };
  const addDoc = () => onChange({ ...data, caseDocs: [...data.caseDocs, ''] });
  const removeDoc = (i: number) =>
    onChange({ ...data, caseDocs: data.caseDocs.filter((_, idx) => idx !== i) });

  const updateExcl = (i: number, v: string) => {
    const next = [...data.exclusions];
    next[i] = v;
    onChange({ ...data, exclusions: next });
  };
  const addExcl = () =>
    onChange({ ...data, exclusions: [...data.exclusions, ''] });
  const removeExcl = (i: number) =>
    onChange({ ...data, exclusions: data.exclusions.filter((_, idx) => idx !== i) });

  return (
    <div>
      <FieldGroup label="Заголовок (велика плашка)">
        <Input value={data.title} onChange={(e) => onChange({ ...data, title: e.target.value })} />
      </FieldGroup>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Поля для заповнення
          </label>
          <IconBtn onClick={addField} variant="primary">
            <Plus size={14} />
          </IconBtn>
        </div>
        <div className="space-y-2">
          {data.fields.map((f, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={f.label}
                onChange={(e) => updateField(i, 'label', e.target.value)}
                placeholder="Назва"
              />
              <Input
                value={f.value}
                onChange={(e) => updateField(i, 'value', e.target.value)}
                placeholder="Значення"
              />
              <IconBtn onClick={() => removeField(i)} variant="danger">
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
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Документи для гарантії
          </label>
          <IconBtn onClick={addDoc} variant="primary">
            <Plus size={14} />
          </IconBtn>
        </div>
        <div className="space-y-2">
          {data.caseDocs.map((d, i) => (
            <div key={i} className="flex gap-2">
              <Input value={d} onChange={(e) => updateDoc(i, e.target.value)} />
              <IconBtn onClick={() => removeDoc(i)} variant="danger">
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
          rows={2}
        />
      </FieldGroup>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Гарантія не поширюється на:
          </label>
          <IconBtn onClick={addExcl} variant="primary">
            <Plus size={14} />
          </IconBtn>
        </div>
        <div className="space-y-2">
          {data.exclusions.map((d, i) => (
            <div key={i} className="flex gap-2">
              <Input value={d} onChange={(e) => updateExcl(i, e.target.value)} />
              <IconBtn onClick={() => removeExcl(i)} variant="danger">
                <Trash2 size={14} />
              </IconBtn>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
