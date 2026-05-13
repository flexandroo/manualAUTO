import { Plus, Trash2 } from 'lucide-react';
import type { StickerData, StickerVariant, StickerSpecLine } from './types';
import { FieldGroup } from '../components/ui/FieldGroup';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { IconBtn } from '../components/ui/IconBtn';
import { newId } from '../utils/id';

interface Props {
  data: StickerData;
  onChange: (next: StickerData) => void;
}

export function StickerEditor({ data, onChange }: Props) {
  const setField = <K extends keyof StickerData>(k: K, v: StickerData[K]) =>
    onChange({ ...data, [k]: v });

  const updateVariant = (i: number, patch: Partial<StickerVariant>) => {
    setField(
      'variants',
      data.variants.map((v, idx) => (idx === i ? { ...v, ...patch } : v))
    );
  };
  const addVariant = () =>
    setField('variants', [
      ...data.variants,
      { id: newId('v'), modelCode: '', articleCode: '' },
    ]);
  const removeVariant = (i: number) =>
    setField('variants', data.variants.filter((_, idx) => idx !== i));

  const updateSpec = (i: number, patch: Partial<StickerSpecLine>) => {
    setField(
      'specs',
      data.specs.map((s, idx) => (idx === i ? { ...s, ...patch } : s))
    );
  };
  const addSpec = () => setField('specs', [...data.specs, { label: '', value: '' }]);
  const removeSpec = (i: number) =>
    setField('specs', data.specs.filter((_, idx) => idx !== i));

  const titleAsText = data.titleLines.join('\n');
  const setTitle = (s: string) =>
    setField('titleLines', s.split('\n').filter((line, i, all) => line.trim() || i < all.length - 1));

  return (
    <div className="p-4 overflow-y-auto h-full">
      <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-4">
        Параметри наклейки
      </h3>

      <FieldGroup label="Заголовок (кожен рядок — окремий рядок на наклейці)">
        <Textarea
          value={titleAsText}
          onChange={(e) => setTitle(e.target.value)}
          rows={4}
          placeholder={'Колектор\nрозподільчий\nз виходами вгору'}
        />
      </FieldGroup>

      <FieldGroup label={`Варіанти моделей (${data.variants.length})`}>
        {data.variants.map((v, i) => (
          <div key={v.id} className="flex gap-2 items-center mb-2">
            <Input
              value={v.modelCode}
              onChange={(e) => updateVariant(i, { modelCode: e.target.value })}
              placeholder="К22В.125(200)"
            />
            <Input
              value={v.articleCode}
              onChange={(e) => updateVariant(i, { articleCode: e.target.value })}
              placeholder="84040212"
              className="w-32 font-mono"
            />
            <IconBtn onClick={() => removeVariant(i)} variant="danger" title="Видалити">
              <Trash2 size={12} />
            </IconBtn>
          </div>
        ))}
        <button
          type="button"
          onClick={addVariant}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded text-xs"
        >
          <Plus size={12} /> Додати варіант
        </button>
      </FieldGroup>

      <FieldGroup label="Чекбокси теплоізоляції">
        <label className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={data.showInsulationCheckboxes}
            onChange={(e) => setField('showInsulationCheckboxes', e.target.checked)}
            className="accent-orange-500"
          />
          Показати «В теплоізоляції / Без теплоізоляції»
        </label>
      </FieldGroup>

      <FieldGroup label={`Характеристики (${data.specs.length}) — для простих моделей без варіантів`}>
        {data.specs.map((s, i) => (
          <div key={i} className="flex gap-2 items-center mb-2">
            <Input
              value={s.label}
              onChange={(e) => updateSpec(i, { label: e.target.value })}
              placeholder="Контурів"
              className="w-32"
            />
            <Input
              value={s.value}
              onChange={(e) => updateSpec(i, { value: e.target.value })}
              placeholder="2"
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

      <FieldGroup label="Виноска (необов'язково)">
        <Textarea
          value={data.footnote}
          onChange={(e) => setField('footnote', e.target.value)}
          rows={2}
          placeholder="*Циркуляційний насос у комплект поставки не входить"
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
    </div>
  );
}
