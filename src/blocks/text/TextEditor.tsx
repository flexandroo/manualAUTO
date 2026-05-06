import type { TextBlockData } from '../../types/instruction';
import { FieldGroup } from '../../components/ui/FieldGroup';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';

interface Props {
  data: TextBlockData;
  onChange: (data: TextBlockData) => void;
}

export function TextEditor({ data, onChange }: Props) {
  return (
    <div>
      <FieldGroup label="Заголовок" hint='Наприклад "Призначення", "Опис", "Вступ"'>
        <Input
          value={data.heading}
          onChange={(e) => onChange({ ...data, heading: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="Текст">
        <Textarea
          value={data.body}
          onChange={(e) => onChange({ ...data, body: e.target.value })}
          rows={12}
        />
      </FieldGroup>
    </div>
  );
}
