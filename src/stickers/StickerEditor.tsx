import { Plus, Trash2 } from 'lucide-react';
import type {
  StickerData,
  StickerSpecLine,
  StickerTranslation,
  StickerCertification,
} from './types';
import { FieldGroup } from '../components/ui/FieldGroup';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { ImageUploader } from '../components/ui/ImageUploader';
import { IconBtn } from '../components/ui/IconBtn';
import { newId } from '../utils/id';

interface Props {
  data: StickerData;
  onChange: (next: StickerData) => void;
}

export function StickerEditor({ data, onChange }: Props) {
  const setField = <K extends keyof StickerData>(k: K, v: StickerData[K]) =>
    onChange({ ...data, [k]: v });

  const updateSpec = (i: number, patch: Partial<StickerSpecLine>) => {
    setField(
      'specs',
      data.specs.map((s, idx) => (idx === i ? { ...s, ...patch } : s))
    );
  };
  const addSpec = () => setField('specs', [...data.specs, { key: '', value: '' }]);
  const removeSpec = (i: number) =>
    setField('specs', data.specs.filter((_, idx) => idx !== i));

  const updateTr = (i: number, patch: Partial<StickerTranslation>) => {
    setField(
      'translations',
      data.translations.map((t, idx) => (idx === i ? { ...t, ...patch } : t))
    );
  };
  const addTr = () =>
    setField('translations', [...data.translations, { langCode: '', text: '' }]);
  const removeTr = (i: number) =>
    setField('translations', data.translations.filter((_, idx) => idx !== i));

  const titleAsText = data.titleLines.join('\n');
  const setTitle = (s: string) =>
    setField(
      'titleLines',
      s.split('\n').filter((line, i, all) => line.trim() || i < all.length - 1)
    );

  return (
    <div className="p-4 overflow-y-auto h-full">
      <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-4">
        Параметри наклейки
      </h3>

      <FieldGroup label="Логотип бренду">
        <ImageUploader
          value={data.brandLogoUrl}
          onChange={(url) => setField('brandLogoUrl', url)}
          aspectRatio="3/1"
          hint="Завантажте PNG/SVG логотипа TERMOJET або іншого бренду"
        />
      </FieldGroup>

      <FieldGroup label="Заголовок (кожен рядок — окремий рядок на наклейці)">
        <Textarea
          value={titleAsText}
          onChange={(e) => setTitle(e.target.value)}
          rows={3}
          placeholder={'Колектор\nрозподільчий'}
        />
      </FieldGroup>

      <div className="grid grid-cols-2 gap-2 mb-5">
        <FieldGroup label="Код продукту">
          <Input
            value={data.productCode}
            onChange={(e) => setField('productCode', e.target.value)}
            placeholder="К22В.125(200)"
          />
        </FieldGroup>
        <FieldGroup label="Артикул">
          <Input
            value={data.articleCode}
            onChange={(e) => setField('articleCode', e.target.value)}
            placeholder="84040212"
            className="font-mono"
          />
        </FieldGroup>
      </div>

      <FieldGroup label="Фото продукту">
        <ImageUploader
          value={data.productImageUrl}
          onChange={(url) => setField('productImageUrl', url)}
          aspectRatio="1/1"
        />
      </FieldGroup>

      <FieldGroup label="Штрих-код (зображення)">
        <ImageUploader
          value={data.barcodeImageUrl}
          onChange={(url) => setField('barcodeImageUrl', url)}
          aspectRatio="3/1"
          hint="Завантажте PNG/JPG штрих-коду — система його не генерує"
        />
      </FieldGroup>

      <FieldGroup label={`Сертифікації (${data.certifications.length})`}>
        {data.certifications.map((c, i) => (
          <div key={c.id} className="border border-stone-100 rounded p-2 mb-2">
            <div className="flex gap-2 items-center mb-2">
              <Input
                value={c.label}
                onChange={(e) =>
                  setField(
                    'certifications',
                    data.certifications.map((x, idx) =>
                      idx === i ? { ...x, label: e.target.value } : x
                    )
                  )
                }
                placeholder="CE / EAC / ISO"
                className="font-bold"
              />
              <IconBtn
                onClick={() =>
                  setField(
                    'certifications',
                    data.certifications.filter((_, idx) => idx !== i)
                  )
                }
                variant="danger"
                title="Видалити"
              >
                <Trash2 size={12} />
              </IconBtn>
            </div>
            <ImageUploader
              value={c.imageUrl}
              onChange={(url) =>
                setField(
                  'certifications',
                  data.certifications.map((x, idx) =>
                    idx === i ? { ...x, imageUrl: url } : x
                  )
                )
              }
              aspectRatio="3/2"
              hint="Залиште порожнім, щоб показати текст-лейбл"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const next: StickerCertification = {
              id: newId('crt'),
              label: 'CE',
            };
            setField('certifications', [...data.certifications, next]);
          }}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded text-xs"
        >
          <Plus size={12} /> Додати сертифікацію
        </button>
      </FieldGroup>

      <FieldGroup label={`Технічні характеристики (${data.specs.length})`}>
        {data.specs.map((s, i) => (
          <div key={i} className="flex gap-2 items-center mb-2">
            <Input
              value={s.key}
              onChange={(e) => updateSpec(i, { key: e.target.value })}
              placeholder="Підключення"
              className="w-32"
            />
            <Input
              value={s.value}
              onChange={(e) => updateSpec(i, { value: e.target.value })}
              placeholder="1¼″"
            />
            <IconBtn onClick={() => removeSpec(i)} variant="danger" title="Видалити">
              <Trash2 size={12} />
            </IconBtn>
          </div>
        ))}
        <button
          type="button"
          onClick={addSpec}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded text-xs"
        >
          <Plus size={12} /> Додати характеристику
        </button>
      </FieldGroup>

      <FieldGroup label={`Переклади опису (${data.translations.length})`}>
        {data.translations.map((t, i) => (
          <div key={i} className="flex gap-2 items-center mb-2">
            <Input
              value={t.langCode}
              onChange={(e) =>
                updateTr(i, { langCode: e.target.value.toUpperCase().slice(0, 4) })
              }
              placeholder="UA"
              className="w-16 font-bold"
            />
            <Input
              value={t.text}
              onChange={(e) => updateTr(i, { text: e.target.value })}
              placeholder="Опис продукту цією мовою"
            />
            <IconBtn onClick={() => removeTr(i)} variant="danger" title="Видалити">
              <Trash2 size={12} />
            </IconBtn>
          </div>
        ))}
        <button
          type="button"
          onClick={addTr}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded text-xs"
        >
          <Plus size={12} /> Додати переклад
        </button>
      </FieldGroup>

      <FieldGroup label="Інформація дистриб'ютора (нижня плашка)">
        <Textarea
          value={data.distributorInfo}
          onChange={(e) => setField('distributorInfo', e.target.value)}
          rows={4}
          placeholder="Виробник, гарантійна інформація, контакти..."
        />
      </FieldGroup>

      <FieldGroup label="Виноска (необов'язково)">
        <Textarea
          value={data.footnote}
          onChange={(e) => setField('footnote', e.target.value)}
          rows={2}
          placeholder="*Циркуляційний насос у комплект не входить"
        />
      </FieldGroup>

      <FieldGroup label="Текст у футері">
        <Input
          value={data.footer}
          onChange={(e) => setField('footer', e.target.value)}
          placeholder="www.termojet.com.ua"
        />
      </FieldGroup>

      <div className="grid grid-cols-2 gap-2 mb-5">
        <FieldGroup label="Ширина (мм)">
          <Input
            type="number"
            value={String(data.widthMm)}
            onChange={(e) => setField('widthMm', parseInt(e.target.value, 10) || 100)}
          />
        </FieldGroup>
        <FieldGroup label="Висота (мм)">
          <Input
            type="number"
            value={String(data.heightMm)}
            onChange={(e) => setField('heightMm', parseInt(e.target.value, 10) || 140)}
          />
        </FieldGroup>
      </div>

      <FieldGroup label="Колір ліній (верх, ліво, право)">
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={data.accentColor}
            onChange={(e) => setField('accentColor', e.target.value)}
            className="w-10 h-8 rounded border border-stone-200 cursor-pointer"
          />
          <Input
            value={data.accentColor}
            onChange={(e) => setField('accentColor', e.target.value)}
            placeholder="#F25D2A"
            className="font-mono"
          />
        </div>
      </FieldGroup>

      <FieldGroup label={`Глобальний масштаб тексту: ${Math.round(data.textScale * 100)}%`}>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0.7"
            max="1.5"
            step="0.05"
            value={data.textScale}
            onChange={(e) => setField('textScale', parseFloat(e.target.value))}
            className="flex-1 accent-orange-500"
          />
          <button
            type="button"
            onClick={() => setField('textScale', 1.0)}
            className="px-2 py-1 text-[10px] bg-stone-100 hover:bg-stone-200 rounded"
            title="Скинути на 100%"
          >
            ↺
          </button>
        </div>
      </FieldGroup>

      <FieldGroup label="Розмір тексту по секціях (pt; порожнє = за замовчуванням)">
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <FontSizeInput
            label="Заголовок"
            placeholder="9"
            value={data.fontSizes?.title}
            onChange={(v) => setField('fontSizes', { ...data.fontSizes, title: v })}
          />
          <FontSizeInput
            label="Код продукту"
            placeholder="13"
            value={data.fontSizes?.productCode}
            onChange={(v) =>
              setField('fontSizes', { ...data.fontSizes, productCode: v })
            }
          />
          <FontSizeInput
            label="Таблиця характеристик"
            placeholder="6"
            value={data.fontSizes?.specs}
            onChange={(v) => setField('fontSizes', { ...data.fontSizes, specs: v })}
          />
          <FontSizeInput
            label="Переклади"
            placeholder="6"
            value={data.fontSizes?.translations}
            onChange={(v) =>
              setField('fontSizes', { ...data.fontSizes, translations: v })
            }
          />
          <FontSizeInput
            label="Дистриб'ютор"
            placeholder="5"
            value={data.fontSizes?.distributor}
            onChange={(v) =>
              setField('fontSizes', { ...data.fontSizes, distributor: v })
            }
          />
          <FontSizeInput
            label="URL у футері"
            placeholder="6.5"
            value={data.fontSizes?.footer}
            onChange={(v) => setField('fontSizes', { ...data.fontSizes, footer: v })}
          />
        </div>
      </FieldGroup>
    </div>
  );
}

function FontSizeInput({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
}) {
  return (
    <div>
      <div className="text-[10px] text-stone-500 mb-1">{label}</div>
      <Input
        type="number"
        step="0.5"
        value={value === undefined ? '' : String(value)}
        onChange={(e) => {
          const v = parseFloat(e.target.value);
          onChange(Number.isFinite(v) ? v : undefined);
        }}
        placeholder={placeholder}
      />
    </div>
  );
}
