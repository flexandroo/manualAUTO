import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import type { CoverPage } from '../../types/instruction';
import { FieldGroup } from '../../components/ui/FieldGroup';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { ImageUploader } from '../../components/ui/ImageUploader';
import { IconBtn } from '../../components/ui/IconBtn';

interface Props {
  data: CoverPage;
  onChange: (next: CoverPage) => void;
}

export function CoverPageEditor({ data, onChange }: Props) {
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
      <div className="text-[11px] text-slate-500 italic mb-3">
        Більшість полів бренду / продукту редагуються в шапці документа (зверху). Тут — лише вміст
        титульної сторінки.
      </div>

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

      <Textarea value="" onChange={() => {}} rows={1} style={{ display: 'none' }} />
    </div>
  );
}
