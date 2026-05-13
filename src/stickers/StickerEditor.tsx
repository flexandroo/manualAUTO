import { Plus, Trash2 } from 'lucide-react';
import type { StickerData, StickerSpec, StickerTranslation } from './types';
import { FieldGroup } from '../components/ui/FieldGroup';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { ImageUploader } from '../components/ui/ImageUploader';
import { IconBtn } from '../components/ui/IconBtn';

interface Props {
  data: StickerData;
  onChange: (next: StickerData) => void;
}

export function StickerEditor({ data, onChange }: Props) {
  const setField = <K extends keyof StickerData>(k: K, v: StickerData[K]) =>
    onChange({ ...data, [k]: v });

  const updateSpec = (i: number, patch: Partial<StickerSpec>) => {
    const specs = data.specs.map((s, idx) => (idx === i ? { ...s, ...patch } : s));
    setField('specs', specs);
  };
  const addSpec = () =>
    setField('specs', [...data.specs, { key: '', value: '' }]);
  const removeSpec = (i: number) =>
    setField('specs', data.specs.filter((_, idx) => idx !== i));

  const updateTr = (i: number, patch: Partial<StickerTranslation>) => {
    const tr = data.translations.map((t, idx) => (idx === i ? { ...t, ...patch } : t));
    setField('translations', tr);
  };
  const addTr = () =>
    setField('translations', [...data.translations, { langCode: '', text: '' }]);
  const removeTr = (i: number) =>
    setField('translations', data.translations.filter((_, idx) => idx !== i));

  return (
    <div className="p-4 overflow-y-auto h-full">
      <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-4">
        Параметри наклейки
      </h3>

      <FieldGroup label="Бренд">
        <Input value={data.brand} onChange={(e) => setField('brand', e.target.value)} />
      </FieldGroup>

      <FieldGroup label="Логотип бренду (опціонально, замінює текстовий)">
        <ImageUploader
          value={data.brandLogoUrl}
          onChange={(url) => setField('brandLogoUrl', url)}
          aspectRatio="3/1"
        />
      </FieldGroup>

      <div className="grid grid-cols-3 gap-2 mb-5">
        <FieldGroup label="Підпис">
          <Input
            value={data.productLabelPrefix}
            onChange={(e) => setField('productLabelPrefix', e.target.value)}
            placeholder="symbol"
          />
        </FieldGroup>
        <FieldGroup label="Код продукту">
          <Input
            value={data.productCode}
            onChange={(e) => setField('productCode', e.target.value)}
            placeholder="ZMVA230"
          />
        </FieldGroup>
        <FieldGroup label="Кількість">
          <Input
            type="number"
            value={String(data.quantity)}
            onChange={(e) =>
              setField('quantity', Math.max(1, parseInt(e.target.value, 10) || 1))
            }
          />
        </FieldGroup>
      </div>

      <FieldGroup label="DZ-код / додаткове позначення">
        <Input
          value={data.dzCode}
          onChange={(e) => setField('dzCode', e.target.value)}
          placeholder="DZ: 0002"
        />
      </FieldGroup>

      <FieldGroup label={`Технічні характеристики (${data.specs.length})`}>
        {data.specs.map((s, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <Input
              value={s.key}
              onChange={(e) => updateSpec(i, { key: e.target.value })}
              placeholder="P"
              className="w-20"
            />
            <Input
              value={s.value}
              onChange={(e) => updateSpec(i, { value: e.target.value })}
              placeholder="5 W"
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
          <Plus size={12} /> Додати специфікацію
        </button>
      </FieldGroup>

      <FieldGroup label="Фото продукту">
        <ImageUploader
          value={data.productImageUrl}
          onChange={(url) => setField('productImageUrl', url)}
          aspectRatio="1/1"
        />
      </FieldGroup>

      <FieldGroup label="CE-маркування">
        <label className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={data.ceMark}
            onChange={(e) => setField('ceMark', e.target.checked)}
            className="accent-orange-500"
          />
          Показати знак відповідності CE
        </label>
      </FieldGroup>

      <FieldGroup label="Штрих-код EAN-13 (13 цифр)">
        <Input
          value={data.barcodeEan13}
          onChange={(e) => setField('barcodeEan13', e.target.value.replace(/\D/g, '').slice(0, 13))}
          placeholder="5903738245901"
          className="font-mono"
        />
      </FieldGroup>

      <FieldGroup label={`Переклади опису продукту (${data.translations.length})`}>
        {data.translations.map((t, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <Input
              value={t.langCode}
              onChange={(e) => updateTr(i, { langCode: e.target.value.toUpperCase().slice(0, 4) })}
              placeholder="EN"
              className="w-16 font-bold"
            />
            <Input
              value={t.text}
              onChange={(e) => updateTr(i, { text: e.target.value })}
              placeholder="Product description in this language"
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

      <FieldGroup label="Інформація про дистриб'юторів (нижня плашка)">
        <Textarea
          value={data.distributorInfo}
          onChange={(e) => setField('distributorInfo', e.target.value)}
          rows={6}
        />
      </FieldGroup>

      <div className="grid grid-cols-2 gap-2 mb-5">
        <FieldGroup label="Ширина (мм)">
          <Input
            type="number"
            value={String(data.widthMm)}
            onChange={(e) => setField('widthMm', parseInt(e.target.value, 10) || 150)}
          />
        </FieldGroup>
        <FieldGroup label="Висота (мм)">
          <Input
            type="number"
            value={String(data.heightMm)}
            onChange={(e) => setField('heightMm', parseInt(e.target.value, 10) || 90)}
          />
        </FieldGroup>
      </div>
    </div>
  );
}
