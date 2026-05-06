import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import type { CoverPage } from '../../types/instruction';
import { FieldGroup } from '../../components/ui/FieldGroup';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { ImageUploader } from '../../components/ui/ImageUploader';
import { IconBtn } from '../../components/ui/IconBtn';
import { ElementListEditor } from '../../components/ElementListEditor';
import { useEditingDoc } from '../../components/EditingDocContext';

interface Props {
  data: CoverPage;
  onChange: (next: CoverPage) => void;
}

export function CoverPageEditor({ data, onChange }: Props) {
  const { doc, setDoc } = useEditingDoc();
  const productImages = data.productImages ?? [];
  const bulletPoints = data.bulletPoints ?? [];

  const updateImage = (i: number, url: string | undefined) => {
    const next = [...productImages];
    if (url === undefined) next.splice(i, 1);
    else next[i] = url;
    onChange({ ...data, productImages: next });
  };

  const updateBullet = (i: number, v: string) => {
    const next = [...bulletPoints];
    next[i] = v;
    onChange({ ...data, bulletPoints: next });
  };
  const addBullet = () =>
    onChange({ ...data, bulletPoints: [...bulletPoints, ''] });
  const removeBullet = (i: number) =>
    onChange({ ...data, bulletPoints: bulletPoints.filter((_, idx) => idx !== i) });
  const moveBullet = (i: number, dir: -1 | 1) => {
    const next = [...bulletPoints];
    const t = i + dir;
    if (t < 0 || t >= next.length) return;
    [next[i], next[t]] = [next[t], next[i]];
    onChange({ ...data, bulletPoints: next });
  };

  return (
    <div>
      {/* ─── Document-level fields (used by every page header / footer) ─── */}
      <div
        className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-3 pb-2 border-b border-slate-800"
      >
        Бренд та продукт
      </div>

      <FieldGroup label="Бренд">
        <Input
          value={doc.brand ?? ''}
          onChange={(e) => setDoc({ ...doc, brand: e.target.value })}
        />
      </FieldGroup>

      <ImageUploader
        label="Логотип бренду (опціонально)"
        hint="PNG/SVG. Якщо не завантажити — використовується дефолтний TERMOJET-логотип."
        value={doc.brandLogoUrl}
        onChange={(url) => setDoc({ ...doc, brandLogoUrl: url })}
        aspectRatio="3/1"
      />

      <FieldGroup label="Підпис під логотипом" hint='Наприклад "обладнання для котелень"'>
        <Input
          value={doc.brandTagline ?? ''}
          onChange={(e) => setDoc({ ...doc, brandTagline: e.target.value })}
        />
      </FieldGroup>

      <FieldGroup label="Назва продукту">
        <Input
          value={doc.productName ?? ''}
          onChange={(e) => setDoc({ ...doc, productName: e.target.value })}
        />
      </FieldGroup>

      <FieldGroup label="Перелік моделей" hint="Кожна модель з нового рядка або через крапку з комою">
        <Textarea
          value={(doc.modelCodes ?? []).join('\n')}
          onChange={(e) =>
            setDoc({
              ...doc,
              modelCodes: e.target.value
                .split(/[\n;]+/)
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
          rows={3}
        />
      </FieldGroup>

      <FieldGroup label="Тип документа" hint='Наприклад "ТЕХНІЧНИЙ ПАСПОРТ"'>
        <Input
          value={doc.documentType ?? ''}
          onChange={(e) => setDoc({ ...doc, documentType: e.target.value })}
        />
      </FieldGroup>

      <FieldGroup label="Сайт">
        <Input
          value={doc.websiteUrl ?? ''}
          onChange={(e) => setDoc({ ...doc, websiteUrl: e.target.value })}
        />
      </FieldGroup>

      <FieldGroup
        label="Копірайт (нижня плашка титулки)"
        hint='Залиште порожнім — використається "<бренд> © <рік> — <сайт>"'
      >
        <Input
          value={doc.coverCopyright ?? ''}
          onChange={(e) => setDoc({ ...doc, coverCopyright: e.target.value })}
          placeholder={`${doc.brand ?? 'TERMOJET'} © ${new Date().getFullYear()} — ${doc.websiteUrl ?? 'TERMOJET.COM.UA'}`}
        />
      </FieldGroup>

      <FieldGroup label="Мова" hint="Текст справа на нижній плашці титулки">
        <Input
          value={doc.coverLanguage ?? ''}
          onChange={(e) => setDoc({ ...doc, coverLanguage: e.target.value })}
        />
      </FieldGroup>

      {/* ─── Cover-page-specific fields ─── */}
      <div
        className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-6 mb-3 pb-2 border-b border-slate-800"
      >
        Вміст титульної
      </div>

      <FieldGroup label="Hero — білий префікс" hint='Наприклад "Серія" або "Модель"'>
        <Input
          value={data.heroPrefix}
          onChange={(e) => onChange({ ...data, heroPrefix: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup
        label="Hero — помаранчевий акцент"
        hint="Залиште порожнім — підставиться автоматично з першої моделі або назви продукту"
      >
        <Input
          value={data.heroAccent}
          onChange={(e) => onChange({ ...data, heroAccent: e.target.value })}
          placeholder={(doc.modelCodes ?? [])[0]?.split('-')[0] ?? ''}
        />
      </FieldGroup>

      <FieldGroup label="Підзаголовок" hint='Наприклад "Інструкція з монтажу та експлуатації"'>
        <Input
          value={data.subtitle}
          onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
        />
      </FieldGroup>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Особливості / переваги ({bulletPoints.length})
          </label>
          <IconBtn onClick={addBullet} variant="primary">
            <Plus size={14} />
          </IconBtn>
        </div>
        <div className="space-y-2">
          {bulletPoints.map((b, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Input value={b} onChange={(e) => updateBullet(i, e.target.value)} />
              <IconBtn onClick={() => moveBullet(i, -1)}>
                <ChevronUp size={14} />
              </IconBtn>
              <IconBtn onClick={() => moveBullet(i, 1)}>
                <ChevronDown size={14} />
              </IconBtn>
              <IconBtn onClick={() => removeBullet(i)} variant="danger">
                <Trash2 size={14} />
              </IconBtn>
            </div>
          ))}
        </div>
        <div className="text-[11px] text-slate-500 mt-1">
          Перші 3 пункти показуються як 3 картки на титулці.
        </div>
      </div>

      <div className="mb-5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Фото продукту (до 3-х)
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <ImageUploader
              key={i}
              value={productImages[i]}
              onChange={(url) => updateImage(i, url)}
              aspectRatio="3/4"
            />
          ))}
        </div>
      </div>

      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-6 mb-3 pb-2 border-b border-slate-800">
        Додаткові елементи на титулці
      </div>
      <div className="text-[11px] text-slate-500 italic mb-3">
        Будь-які елементи, які ви додасте сюди, з'являться між блоком фічей та смужкою з фото.
      </div>
      <ElementListEditor
        elements={data.elements ?? []}
        onChange={(elements) => onChange({ ...data, elements })}
      />
    </div>
  );
}
