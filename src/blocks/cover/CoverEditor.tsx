import type { CoverData } from '../../types/instruction';
import { FieldGroup } from '../../components/ui/FieldGroup';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';

interface Props {
  data: CoverData;
  onChange: (data: CoverData) => void;
}

export function CoverEditor({ data, onChange }: Props) {
  return (
    <div>
      <FieldGroup label="Бренд">
        <Input value={data.brand} onChange={(e) => onChange({ ...data, brand: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Заголовок">
        <Input value={data.title} onChange={(e) => onChange({ ...data, title: e.target.value })} />
      </FieldGroup>
      <FieldGroup label="Перелік моделей" hint="Розділяйте крапкою з комою">
        <Textarea
          value={data.models}
          onChange={(e) => onChange({ ...data, models: e.target.value })}
          rows={3}
        />
      </FieldGroup>
      <FieldGroup label="Тип документа">
        <Input
          value={data.documentType}
          onChange={(e) => onChange({ ...data, documentType: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="Підзаголовок">
        <Input
          value={data.subtitle}
          onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
        />
      </FieldGroup>
    </div>
  );
}
