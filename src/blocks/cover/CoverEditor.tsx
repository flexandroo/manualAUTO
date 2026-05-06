import type { CoverBlock } from '../../types/instruction';
import { FieldGroup } from '../../components/ui/FieldGroup';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';

interface Props {
  data: CoverBlock;
  onChange: (data: CoverBlock) => void;
}

export function CoverEditor({ data, onChange }: Props) {
  return (
    <div>
      <FieldGroup label="Назва продукту">
        <Input
          value={data.productName}
          onChange={(e) => onChange({ ...data, productName: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="Підзаголовок">
        <Input
          value={data.subtitle}
          onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="Перелік моделей" hint="Кожна модель з нового рядка або через крапку з комою">
        <Textarea
          value={data.modelCodes.join('\n')}
          onChange={(e) =>
            onChange({
              ...data,
              modelCodes: e.target.value
                .split(/[\n;]+/)
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
          rows={4}
        />
      </FieldGroup>
      <FieldGroup label="Тип документа">
        <Input
          value={data.documentType}
          onChange={(e) => onChange({ ...data, documentType: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="Слоган">
        <Input
          value={data.tagline}
          onChange={(e) => onChange({ ...data, tagline: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="Сайт">
        <Input
          value={data.websiteUrl}
          onChange={(e) => onChange({ ...data, websiteUrl: e.target.value })}
        />
      </FieldGroup>
    </div>
  );
}
