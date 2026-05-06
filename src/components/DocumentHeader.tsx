import type { InstructionData } from '../types/instruction';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { ImageUploader } from './ui/ImageUploader';

interface Props {
  data: InstructionData;
  onChange: (data: InstructionData) => void;
}

// A compact form for document-level metadata (brand, product, models,
// website). Shown above the page list at the top of the editor — these
// values flow into Cover, page headers, and footers via PdfDocContext.
export function DocumentHeader({ data, onChange }: Props) {
  return (
    <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
      <Field label="Бренд">
        <Input value={data.brand} onChange={(e) => onChange({ ...data, brand: e.target.value })} />
      </Field>
      <Field label="Назва продукту">
        <Input
          value={data.productName}
          onChange={(e) => onChange({ ...data, productName: e.target.value })}
        />
      </Field>
      <Field label="Підпис під логотипом" wide>
        <Input
          value={data.brandTagline}
          onChange={(e) => onChange({ ...data, brandTagline: e.target.value })}
        />
      </Field>
      <Field label="Тип документа">
        <Input
          value={data.documentType}
          onChange={(e) => onChange({ ...data, documentType: e.target.value })}
        />
      </Field>
      <Field label="Сайт">
        <Input
          value={data.websiteUrl}
          onChange={(e) => onChange({ ...data, websiteUrl: e.target.value })}
        />
      </Field>
      <Field label="Моделі (через крапку з комою або з нового рядка)" wide>
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
          rows={2}
        />
      </Field>
      <Field label="Логотип бренду" wide>
        <ImageUploader
          value={data.brandLogoUrl}
          onChange={(url) => onChange({ ...data, brandLogoUrl: url })}
          aspectRatio="3/1"
        />
      </Field>
    </div>
  );
}

function Field({
  label,
  children,
  wide,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={wide ? 'col-span-2' : ''}>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
        {label}
      </div>
      {children}
    </div>
  );
}
