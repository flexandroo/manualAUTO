import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import type { CoverBlock, CoverTextStyles, TextStyle } from '../../types/instruction';
import { FieldGroup } from '../../components/ui/FieldGroup';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { ImageUploader } from '../../components/ui/ImageUploader';
import { IconBtn } from '../../components/ui/IconBtn';
import { TextStyleControls } from '../../components/ui/TextStyleControls';
import { COVER_DEFAULT_STYLES } from './coverStyles';

interface Props {
  data: CoverBlock;
  onChange: (data: CoverBlock) => void;
}

export function CoverEditor({ data, onChange }: Props) {
  const productImages = data.productImages ?? [];
  const modelCodes = data.modelCodes ?? [];
  const bulletPoints = data.bulletPoints ?? [];
  const styles = data.styles ?? {};

  const updateProductImage = (i: number, url: string | undefined) => {
    const next = [...productImages];
    if (url === undefined) {
      next.splice(i, 1);
    } else {
      next[i] = url;
    }
    onChange({ ...data, productImages: next });
  };

  const updateBullet = (i: number, value: string) => {
    const next = [...bulletPoints];
    next[i] = value;
    onChange({ ...data, bulletPoints: next });
  };
  const addBullet = () =>
    onChange({ ...data, bulletPoints: [...bulletPoints, ''] });
  const removeBullet = (i: number) =>
    onChange({ ...data, bulletPoints: bulletPoints.filter((_, idx) => idx !== i) });
  const moveBullet = (i: number, dir: -1 | 1) => {
    const next = [...bulletPoints];
    const target = i + dir;
    if (target < 0 || target >= next.length) return;
    [next[i], next[target]] = [next[target], next[i]];
    onChange({ ...data, bulletPoints: next });
  };

  const updateStyle = (key: keyof CoverTextStyles, next: TextStyle) => {
    const newStyles = { ...styles, [key]: next };
    // Clean up: drop key if both fields are undefined
    if (next.fontSize === undefined && next.bold === undefined) {
      delete newStyles[key];
    }
    onChange({ ...data, styles: newStyles });
  };

  const styleControlsFor = (key: keyof CoverTextStyles) => (
    <TextStyleControls
      value={styles[key]}
      onChange={(s) => updateStyle(key, s)}
      defaultSize={COVER_DEFAULT_STYLES[key].fontSize}
      defaultBold={COVER_DEFAULT_STYLES[key].bold}
    />
  );

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

      <FieldGroup label="Підпис під логотипом" hint='Наприклад "обладнання для котелень"'>
        <Input
          value={data.brandTagline}
          onChange={(e) => onChange({ ...data, brandTagline: e.target.value })}
        />
        {styleControlsFor('brandTagline')}
      </FieldGroup>

      <FieldGroup label="Назва продукту">
        <Input
          value={data.productName}
          onChange={(e) => onChange({ ...data, productName: e.target.value })}
        />
        {styleControlsFor('productName')}
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
        {styleControlsFor('modelCodes')}
      </FieldGroup>

      <FieldGroup label="Тип документа" hint='Наприклад "ТЕХНІЧНИЙ СЕРТИФІКАТ"'>
        <Input
          value={data.documentType}
          onChange={(e) => onChange({ ...data, documentType: e.target.value })}
        />
        {styleControlsFor('documentType')}
      </FieldGroup>

      <FieldGroup label="Підзаголовок" hint="Відображається малим текстом над списком">
        <Input
          value={data.subtitle}
          onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
        />
        {styleControlsFor('subtitle')}
      </FieldGroup>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Особливості / переваги ({bulletPoints.length})
          </label>
          <IconBtn onClick={addBullet} variant="primary" title="Додати пункт">
            <Plus size={14} />
          </IconBtn>
        </div>
        <div className="space-y-2">
          {bulletPoints.map((b, i) => (
            <div key={i} className="flex gap-2 items-center">
              <span className="text-orange-400 text-base font-bold w-4 text-center">◆</span>
              <Input
                value={b}
                onChange={(e) => updateBullet(i, e.target.value)}
                placeholder="Текст пункту"
              />
              <IconBtn onClick={() => moveBullet(i, -1)} title="Вгору">
                <ChevronUp size={14} />
              </IconBtn>
              <IconBtn onClick={() => moveBullet(i, 1)} title="Вниз">
                <ChevronDown size={14} />
              </IconBtn>
              <IconBtn onClick={() => removeBullet(i)} variant="danger" title="Видалити">
                <Trash2 size={14} />
              </IconBtn>
            </div>
          ))}
          {bulletPoints.length === 0 && (
            <div className="text-[11px] text-slate-500 italic">
              Натисніть + щоб додати пункт. Покажуться як список з помаранчевими маркерами на титульній.
            </div>
          )}
        </div>
        <div className="ml-6 mt-2">{styleControlsFor('bulletPoints')}</div>
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
