import type { CoverBlock } from '../../types/instruction';
import { FieldGroup } from '../../components/ui/FieldGroup';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { ImageUploader } from '../../components/ui/ImageUploader';

interface Props {
  data: CoverBlock;
  onChange: (data: CoverBlock) => void;
}

export function CoverEditor({ data, onChange }: Props) {
  const productImages = data.productImages ?? [];
  const modelCodes = data.modelCodes ?? [];

  const updateProductImage = (i: number, url: string | undefined) => {
    const next = [...productImages];
    if (url === undefined) {
      next.splice(i, 1);
    } else {
      next[i] = url;
    }
    onChange({ ...data, productImages: next });
  };

  return (
    <div>
      <FieldGroup label="Бренд">
        <Input value={data.brand} onChange={(e) => onChange({ ...data, brand: e.target.value })} />
      </FieldGroup>

      <ImageUploader
        label="Логотип бренду (опціонально)"
        hint="Якщо завантажити — заміняє текст з трикутничками у верхній плашці"
        value={data.brandLogoUrl}
        onChange={(url) => onChange({ ...data, brandLogoUrl: url })}
        aspectRatio="3/1"
      />

      <FieldGroup label="Назва продукту">
        <Input
          value={data.productName}
          onChange={(e) => onChange({ ...data, productName: e.target.value })}
        />
      </FieldGroup>

      <FieldGroup label="Перелік моделей" hint="Кожна модель з нового рядка або через крапку з комою">
        <Textarea
          value={modelCodes.join('\n')}
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

      <FieldGroup label="Тип документа" hint='Наприклад "ТЕХНІЧНИЙ СЕРТИФІКАТ"'>
        <Input
          value={data.documentType}
          onChange={(e) => onChange({ ...data, documentType: e.target.value })}
        />
      </FieldGroup>

      <FieldGroup label="Підзаголовок (текст у пілюлі)" hint='Наприклад "Інструкція з монтажу та експлуатації"'>
        <Input
          value={data.subtitle}
          onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
        />
      </FieldGroup>

      <div className="mb-5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Фото продукту (до 3-х)
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <ImageUploader
              key={i}
              value={productImages[i]}
              onChange={(url) => updateProductImage(i, url)}
              aspectRatio="3/4"
            />
          ))}
        </div>
        <div className="text-[11px] text-slate-500 mt-1">
          Перетягніть файли або вставте з буфера (Ctrl+V) у потрібний слот
        </div>
      </div>

      <FieldGroup label="Сайт (для футерів інших сторінок)">
        <Input
          value={data.websiteUrl}
          onChange={(e) => onChange({ ...data, websiteUrl: e.target.value })}
        />
      </FieldGroup>
    </div>
  );
}
