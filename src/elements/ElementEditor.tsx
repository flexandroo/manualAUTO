import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import type {
  BulletListElement,
  CardGridElement,
  CardGridItem,
  HeadingElement,
  ImageElement,
  ImageGridElement,
  ImageGridItem,
  KvListElement,
  NumberedListElement,
  PageElement,
  ParagraphElement,
  SchemeElement,
  StepListElement,
  StepListItem,
  SubsectionElement,
  TableElement,
  TextStyle,
  TwoColumnElement,
  WarningElement,
} from '../types/instruction';
import { FieldGroup } from '../components/ui/FieldGroup';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { ImageUploader } from '../components/ui/ImageUploader';
import { IconBtn } from '../components/ui/IconBtn';
import { TextStyleControls } from '../components/ui/TextStyleControls';
import { newId } from '../utils/id';
import { makeStyleUpdater } from '../utils/blockStyles';
import { ELEMENT_STYLE_DEFAULTS } from './elementStyleDefaults';
import { ElementListEditor } from '../components/ElementListEditor';

// Helper: render style controls under a text input. `elType` and `key` look up
// the per-element default; the user override goes into `data.styles[key]`.
function StyleRow<
  T extends { styles?: Record<string, TextStyle> },
  K extends keyof typeof ELEMENT_STYLE_DEFAULTS,
>({
  data,
  onChange,
  elType,
  styleKey,
}: {
  data: T;
  onChange: (next: T) => void;
  elType: K;
  styleKey: string;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const def = (ELEMENT_STYLE_DEFAULTS as any)[elType][styleKey] as Required<TextStyle>;
  const update = makeStyleUpdater(data, onChange);
  return (
    <TextStyleControls
      value={data.styles?.[styleKey]}
      onChange={(s) => update(styleKey, s)}
      defaultSize={def.fontSize}
      defaultBold={def.bold}
    />
  );
}

interface Props {
  element: PageElement;
  onChange: (next: PageElement) => void;
}

export function ElementEditor({ element, onChange }: Props) {
  switch (element.type) {
    case 'heading':
      return <HeadingEd data={element} onChange={onChange} />;
    case 'subsection':
      return <SubsectionEd data={element} onChange={onChange} />;
    case 'paragraph':
      return <ParagraphEd data={element} onChange={onChange} />;
    case 'bulletList':
      return <BulletListEd data={element} onChange={onChange} />;
    case 'numberedList':
      return <NumberedListEd data={element} onChange={onChange} />;
    case 'table':
      return <TableEd data={element} onChange={onChange} />;
    case 'kvList':
      return <KvListEd data={element} onChange={onChange} />;
    case 'scheme':
      return <SchemeEd data={element} onChange={onChange} />;
    case 'image':
      return <ImageEd data={element} onChange={onChange} />;
    case 'imageGrid':
      return <ImageGridEd data={element} onChange={onChange} />;
    case 'stepList':
      return <StepListEd data={element} onChange={onChange} />;
    case 'cardGrid':
      return <CardGridEd data={element} onChange={onChange} />;
    case 'warning':
      return <WarningEd data={element} onChange={onChange} />;
    case 'twoColumn':
      return <TwoColumnEd data={element} onChange={onChange} />;
    case 'separator':
      return (
        <div className="text-[11px] text-stone-400 italic">
          Розділювач — тонка горизонтальна лінія. Без налаштувань.
        </div>
      );
  }
}

function TwoColumnEd({ data, onChange }: EdProps<TwoColumnElement>) {
  return (
    <div>
      <div className="text-[11px] text-stone-400 italic mb-3">
        Контейнер ділить ширину на дві колонки. У кожну колонку додавайте свої елементи.
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-stone-50 border border-stone-100 rounded p-2">
          <div className="text-[10px] uppercase tracking-wider text-orange-400 font-bold mb-2 px-1">
            Ліва колонка
          </div>
          <ElementListEditor
            elements={data.left}
            onChange={(left) => onChange({ ...data, left })}
          />
        </div>
        <div className="bg-stone-50 border border-stone-100 rounded p-2">
          <div className="text-[10px] uppercase tracking-wider text-orange-400 font-bold mb-2 px-1">
            Права колонка
          </div>
          <ElementListEditor
            elements={data.right}
            onChange={(right) => onChange({ ...data, right })}
          />
        </div>
      </div>
    </div>
  );
}

type EdProps<T> = { data: T; onChange: (next: T) => void };

function HeadingEd({ data, onChange }: EdProps<HeadingElement>) {
  return (
    <FieldGroup label="Текст заголовка">
      <Input value={data.text} onChange={(e) => onChange({ ...data, text: e.target.value })} />
      <StyleRow data={data} onChange={onChange} elType="heading" styleKey="text" />
    </FieldGroup>
  );
}

function SubsectionEd({ data, onChange }: EdProps<SubsectionElement>) {
  return (
    <>
      <FieldGroup label="Номер">
        <Input
          value={data.number}
          onChange={(e) => onChange({ ...data, number: e.target.value })}
          placeholder="1.1"
        />
        <StyleRow data={data} onChange={onChange} elType="subsection" styleKey="number" />
      </FieldGroup>
      <FieldGroup label="Заголовок">
        <Input
          value={data.heading}
          onChange={(e) => onChange({ ...data, heading: e.target.value })}
        />
        <StyleRow data={data} onChange={onChange} elType="subsection" styleKey="heading" />
      </FieldGroup>
      <FieldGroup label="Текст">
        <Textarea
          value={data.body}
          onChange={(e) => onChange({ ...data, body: e.target.value })}
          rows={6}
        />
        <StyleRow data={data} onChange={onChange} elType="subsection" styleKey="body" />
      </FieldGroup>
    </>
  );
}

function ParagraphEd({ data, onChange }: EdProps<ParagraphElement>) {
  return (
    <FieldGroup label="Текст">
      <Textarea
        value={data.text}
        onChange={(e) => onChange({ ...data, text: e.target.value })}
        rows={6}
      />
      <StyleRow data={data} onChange={onChange} elType="paragraph" styleKey="text" />
    </FieldGroup>
  );
}

function BulletListEd({ data, onChange }: EdProps<BulletListElement>) {
  const update = (i: number, v: string) => {
    const next = [...data.items];
    next[i] = v;
    onChange({ ...data, items: next });
  };
  const add = () => onChange({ ...data, items: [...data.items, ''] });
  const remove = (i: number) =>
    onChange({ ...data, items: data.items.filter((_, idx) => idx !== i) });
  const move = (i: number, dir: -1 | 1) => {
    const next = [...data.items];
    const t = i + dir;
    if (t < 0 || t >= next.length) return;
    [next[i], next[t]] = [next[t], next[i]];
    onChange({ ...data, items: next });
  };
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          Пункти ({data.items.length})
        </label>
        <IconBtn onClick={add} variant="primary">
          <Plus size={14} />
        </IconBtn>
      </div>
      <div className="space-y-2">
        {data.items.map((it, i) => (
          <div key={i} className="flex gap-2 items-center">
            <span className="text-orange-400 font-bold w-3">●</span>
            <Input value={it} onChange={(e) => update(i, e.target.value)} />
            <IconBtn onClick={() => move(i, -1)}>
              <ChevronUp size={14} />
            </IconBtn>
            <IconBtn onClick={() => move(i, 1)}>
              <ChevronDown size={14} />
            </IconBtn>
            <IconBtn onClick={() => remove(i)} variant="danger">
              <Trash2 size={14} />
            </IconBtn>
          </div>
        ))}
      </div>
      <div className="mt-2">
        <StyleRow data={data} onChange={onChange} elType="bulletList" styleKey="item" />
      </div>
    </div>
  );
}

function NumberedListEd({ data, onChange }: EdProps<NumberedListElement>) {
  const update = (i: number, field: 'number' | 'text', v: string) => {
    const next = [...data.items];
    next[i] = { ...next[i], [field]: v };
    onChange({ ...data, items: next });
  };
  const add = () => {
    const last = data.items.at(-1)?.number ?? '2.0';
    const parts = last.split('.');
    const nextNum = `${parts[0]}.${parseInt(parts[1] || '0', 10) + 1}`;
    onChange({ ...data, items: [...data.items, { number: nextNum, text: '' }] });
  };
  const remove = (i: number) =>
    onChange({ ...data, items: data.items.filter((_, idx) => idx !== i) });
  const move = (i: number, dir: -1 | 1) => {
    const next = [...data.items];
    const t = i + dir;
    if (t < 0 || t >= next.length) return;
    [next[i], next[t]] = [next[t], next[i]];
    onChange({ ...data, items: next });
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          Пункти ({data.items.length})
        </label>
        <IconBtn onClick={add} variant="primary">
          <Plus size={14} />
        </IconBtn>
      </div>
      <div className="space-y-2">
        {data.items.map((it, i) => (
          <div key={i} className="bg-white border border-stone-100 rounded p-2 space-y-2">
            <div className="flex items-center gap-2">
              <input
                value={it.number}
                onChange={(e) => update(i, 'number', e.target.value)}
                className="w-14 bg-stone-100 text-orange-300 font-mono font-bold rounded px-2 py-1 text-xs"
              />
              <div className="flex-1" />
              <IconBtn onClick={() => move(i, -1)}>
                <ChevronUp size={14} />
              </IconBtn>
              <IconBtn onClick={() => move(i, 1)}>
                <ChevronDown size={14} />
              </IconBtn>
              <IconBtn onClick={() => remove(i)} variant="danger">
                <Trash2 size={14} />
              </IconBtn>
            </div>
            <Textarea
              value={it.text}
              onChange={(e) => update(i, 'text', e.target.value)}
              rows={2}
            />
          </div>
        ))}
      </div>
      <div className="mt-3 space-y-1">
        <div className="text-[11px] text-stone-500">Номер кроку:</div>
        <StyleRow data={data} onChange={onChange} elType="numberedList" styleKey="number" />
        <div className="text-[11px] text-stone-500 mt-1">Текст кроку:</div>
        <StyleRow data={data} onChange={onChange} elType="numberedList" styleKey="text" />
      </div>
    </div>
  );
}

function TableEd({ data, onChange }: EdProps<TableElement>) {
  const updateHeader = (i: number, v: string) => {
    const next = [...data.headers];
    next[i] = v;
    onChange({ ...data, headers: next });
  };
  const updateCell = (r: number, c: number, v: string) => {
    const next = data.rows.map((row, ri) =>
      ri === r ? row.map((cell, ci) => (ci === c ? v : cell)) : row
    );
    onChange({ ...data, rows: next });
  };
  const addRow = () => onChange({ ...data, rows: [...data.rows, data.headers.map(() => '')] });
  const removeRow = (i: number) =>
    onChange({ ...data, rows: data.rows.filter((_, idx) => idx !== i) });
  const addCol = () =>
    onChange({
      ...data,
      headers: [...data.headers, 'Нова колонка'],
      rows: data.rows.map((r) => [...r, '']),
    });
  const removeCol = (c: number) => {
    if (c === 0) return;
    onChange({
      ...data,
      headers: data.headers.filter((_, i) => i !== c),
      rows: data.rows.map((r) => r.filter((_, i) => i !== c)),
    });
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          Таблиця ({data.headers.length}×{data.rows.length})
        </label>
        <div className="flex gap-1">
          <button
            onClick={addCol}
            className="text-[11px] px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded"
          >
            + колонка
          </button>
          <button
            onClick={addRow}
            className="text-[11px] px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded"
          >
            + рядок
          </button>
        </div>
      </div>
      <div className="overflow-x-auto bg-white rounded p-2">
        <table className="w-full text-xs">
          <thead>
            <tr>
              {data.headers.map((h, i) => (
                <th key={i} className="p-1 relative group">
                  <input
                    value={h}
                    onChange={(e) => updateHeader(i, e.target.value)}
                    className="w-full bg-stone-100 text-orange-300 font-semibold rounded px-2 py-1 text-xs"
                  />
                  {i > 0 && (
                    <button
                      onClick={() => removeCol(i)}
                      className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 bg-red-600 text-white rounded-full w-4 h-4 text-[10px]"
                    >
                      ×
                    </button>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td key={c} className="p-1">
                    <textarea
                      value={cell}
                      onChange={(e) => updateCell(r, c, e.target.value)}
                      rows={1}
                      className="w-full bg-stone-100 text-stone-700 rounded px-2 py-1 text-xs resize-y"
                    />
                  </td>
                ))}
                <td>
                  <IconBtn onClick={() => removeRow(r)} variant="danger">
                    <Trash2 size={12} />
                  </IconBtn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 space-y-1">
        <div className="text-[11px] text-stone-500">Заголовки колонок:</div>
        <StyleRow data={data} onChange={onChange} elType="table" styleKey="header" />
        <div className="text-[11px] text-stone-500 mt-1">Клітинки:</div>
        <StyleRow data={data} onChange={onChange} elType="table" styleKey="cell" />
      </div>
    </div>
  );
}

function KvListEd({ data, onChange }: EdProps<KvListElement>) {
  const update = (i: number, field: 'key' | 'value', v: string) => {
    const next = [...data.rows];
    next[i] = { ...next[i], [field]: v };
    onChange({ ...data, rows: next });
  };
  const add = () => onChange({ ...data, rows: [...data.rows, { key: '', value: '' }] });
  const remove = (i: number) =>
    onChange({ ...data, rows: data.rows.filter((_, idx) => idx !== i) });
  return (
    <>
      <FieldGroup label="Заголовок (опціонально)">
        <Input
          value={data.title ?? ''}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
        />
        <StyleRow data={data} onChange={onChange} elType="kvList" styleKey="title" />
      </FieldGroup>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Пари ключ-значення ({data.rows.length})
          </label>
          <IconBtn onClick={add} variant="primary">
            <Plus size={14} />
          </IconBtn>
        </div>
        <div className="space-y-2">
          {data.rows.map((r, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={r.key}
                onChange={(e) => update(i, 'key', e.target.value)}
                placeholder="Ключ"
              />
              <Input
                value={r.value}
                onChange={(e) => update(i, 'value', e.target.value)}
                placeholder="Значення"
              />
              <IconBtn onClick={() => remove(i)} variant="danger">
                <Trash2 size={14} />
              </IconBtn>
            </div>
          ))}
        </div>
        <div className="mt-3 space-y-1">
          <div className="text-[11px] text-stone-500">Стиль ключів:</div>
          <StyleRow data={data} onChange={onChange} elType="kvList" styleKey="key" />
          <div className="text-[11px] text-stone-500 mt-1">Стиль значень:</div>
          <StyleRow data={data} onChange={onChange} elType="kvList" styleKey="value" />
        </div>
      </div>
    </>
  );
}

function SchemeEd({ data, onChange }: EdProps<SchemeElement>) {
  const updateItem = (i: number, field: 'number' | 'label', v: string) => {
    const next = [...data.items];
    if (field === 'number') next[i] = { ...next[i], number: parseInt(v, 10) || 0 };
    else next[i] = { ...next[i], label: v };
    onChange({ ...data, items: next });
  };
  const addItem = () => {
    const last = data.items.at(-1)?.number ?? 0;
    onChange({ ...data, items: [...data.items, { number: last + 1, label: '' }] });
  };
  const removeItem = (i: number) =>
    onChange({ ...data, items: data.items.filter((_, idx) => idx !== i) });
  const moveItem = (i: number, dir: -1 | 1) => {
    const next = [...data.items];
    const t = i + dir;
    if (t < 0 || t >= next.length) return;
    [next[i], next[t]] = [next[t], next[i]];
    onChange({ ...data, items: next });
  };

  const updateFlow = (i: number, field: 'color' | 'label', v: string) => {
    const next = [...data.flowLines];
    next[i] = { ...next[i], [field]: v };
    onChange({ ...data, flowLines: next });
  };
  const addFlow = () =>
    onChange({ ...data, flowLines: [...data.flowLines, { color: '#dc2626', label: '' }] });
  const removeFlow = (i: number) =>
    onChange({ ...data, flowLines: data.flowLines.filter((_, idx) => idx !== i) });

  return (
    <>
      <ImageUploader
        label="Зображення / схема"
        hint="PNG/JPG, до 8 МБ"
        value={data.imageUrl}
        onChange={(url) => onChange({ ...data, imageUrl: url })}
        aspectRatio="4/3"
      />
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Виноски ({data.items.length})
          </label>
          <IconBtn onClick={addItem} variant="primary">
            <Plus size={14} />
          </IconBtn>
        </div>
        <div className="space-y-2">
          {data.items.map((it, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="number"
                value={it.number}
                onChange={(e) => updateItem(i, 'number', e.target.value)}
                className="w-12 bg-stone-100 text-orange-300 font-mono font-bold rounded px-2 py-1.5 text-xs"
              />
              <Input
                value={it.label}
                onChange={(e) => updateItem(i, 'label', e.target.value)}
                placeholder="Назва компонента"
              />
              <IconBtn onClick={() => moveItem(i, -1)}>
                <ChevronUp size={14} />
              </IconBtn>
              <IconBtn onClick={() => moveItem(i, 1)}>
                <ChevronDown size={14} />
              </IconBtn>
              <IconBtn onClick={() => removeItem(i)} variant="danger">
                <Trash2 size={14} />
              </IconBtn>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Лінії потоку (опціонально)
          </label>
          <IconBtn onClick={addFlow} variant="primary">
            <Plus size={14} />
          </IconBtn>
        </div>
        <div className="space-y-2">
          {data.flowLines.map((f, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="color"
                value={f.color}
                onChange={(e) => updateFlow(i, 'color', e.target.value)}
                className="w-10 h-9 bg-white rounded cursor-pointer"
              />
              <Input
                value={f.label}
                onChange={(e) => updateFlow(i, 'label', e.target.value)}
              />
              <IconBtn onClick={() => removeFlow(i)} variant="danger">
                <Trash2 size={14} />
              </IconBtn>
            </div>
          ))}
        </div>
        <div className="mt-3 space-y-1">
          <div className="text-[11px] text-stone-500">Номер виноски:</div>
          <StyleRow data={data} onChange={onChange} elType="scheme" styleKey="number" />
          <div className="text-[11px] text-stone-500 mt-1">Назва компонента:</div>
          <StyleRow data={data} onChange={onChange} elType="scheme" styleKey="label" />
          <div className="text-[11px] text-stone-500 mt-1">Лінії потоку:</div>
          <StyleRow data={data} onChange={onChange} elType="scheme" styleKey="flow" />
        </div>
      </div>
    </>
  );
}

function ImageEd({ data, onChange }: EdProps<ImageElement>) {
  return (
    <>
      <ImageUploader
        label="Зображення"
        value={data.imageUrl}
        onChange={(url) => onChange({ ...data, imageUrl: url })}
        aspectRatio="4/3"
      />
      <FieldGroup label="Підпис (опціонально)">
        <Input
          value={data.caption ?? ''}
          onChange={(e) => onChange({ ...data, caption: e.target.value })}
        />
        <StyleRow data={data} onChange={onChange} elType="image" styleKey="caption" />
      </FieldGroup>
      <FieldGroup label="Розмір">
        <div className="flex gap-2">
          {(['sm', 'md', 'lg', 'full'] as const).map((s) => (
            <button
              key={s}
              onClick={() => onChange({ ...data, size: s })}
              className={`flex-1 py-2 rounded text-xs font-bold ${
                (data.size ?? 'md') === s
                  ? 'bg-orange-600 text-white'
                  : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
              }`}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </FieldGroup>
      <FieldGroup label="Вирівнювання">
        <div className="flex gap-2">
          {(['left', 'center', 'right'] as const).map((a) => (
            <button
              key={a}
              onClick={() => onChange({ ...data, align: a })}
              className={`flex-1 py-2 rounded text-xs font-bold ${
                (data.align ?? 'center') === a
                  ? 'bg-orange-600 text-white'
                  : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
              }`}
            >
              {a === 'left' ? 'Зліва' : a === 'center' ? 'По центру' : 'Справа'}
            </button>
          ))}
        </div>
      </FieldGroup>
    </>
  );
}

function ImageGridEd({ data, onChange }: EdProps<ImageGridElement>) {
  const updateItem = (i: number, patch: Partial<ImageGridItem>) => {
    const next = [...data.items];
    next[i] = { ...next[i], ...patch };
    onChange({ ...data, items: next });
  };
  const addItem = () =>
    onChange({
      ...data,
      items: [...data.items, { id: newId('f'), caption: `рис. ${data.items.length + 1}` }],
    });
  const removeItem = (i: number) =>
    onChange({ ...data, items: data.items.filter((_, idx) => idx !== i) });
  const moveItem = (i: number, dir: -1 | 1) => {
    const next = [...data.items];
    const t = i + dir;
    if (t < 0 || t >= next.length) return;
    [next[i], next[t]] = [next[t], next[i]];
    onChange({ ...data, items: next });
  };

  return (
    <>
      <FieldGroup label="Колонок у сітці">
        <div className="flex gap-2">
          {([2, 3, 4] as const).map((n) => (
            <button
              key={n}
              onClick={() => onChange({ ...data, columns: n })}
              className={`flex-1 py-2 rounded text-xs font-bold ${
                data.columns === n
                  ? 'bg-orange-600 text-white'
                  : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </FieldGroup>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Картки ({data.items.length})
          </label>
          <IconBtn onClick={addItem} variant="primary">
            <Plus size={14} />
          </IconBtn>
        </div>
        <div className="space-y-3">
          {data.items.map((f, i) => (
            <div key={f.id} className="bg-white border border-stone-100 rounded p-2">
              <div className="flex items-center gap-2 mb-2">
                <Input
                  value={f.caption}
                  onChange={(e) => updateItem(i, { caption: e.target.value })}
                />
                <IconBtn onClick={() => moveItem(i, -1)}>
                  <ChevronUp size={14} />
                </IconBtn>
                <IconBtn onClick={() => moveItem(i, 1)}>
                  <ChevronDown size={14} />
                </IconBtn>
                <IconBtn onClick={() => removeItem(i)} variant="danger">
                  <Trash2 size={14} />
                </IconBtn>
              </div>
              <ImageUploader
                value={f.imageUrl}
                onChange={(url) => updateItem(i, { imageUrl: url })}
                aspectRatio="4/3"
              />
            </div>
          ))}
        </div>
        <div className="mt-3">
          <div className="text-[11px] text-stone-500 mb-1">Підпис карток:</div>
          <StyleRow data={data} onChange={onChange} elType="imageGrid" styleKey="caption" />
        </div>
      </div>
    </>
  );
}

function WarningEd({ data, onChange }: EdProps<WarningElement>) {
  const levels: { v: WarningElement['level']; label: string; cls: string }[] = [
    { v: 'info', label: 'Інфо', cls: 'bg-blue-600' },
    { v: 'warning', label: 'Увага', cls: 'bg-amber-500' },
    { v: 'danger', label: 'Заборонено', cls: 'bg-red-600' },
  ];
  return (
    <>
      <FieldGroup label="Рівень">
        <div className="flex gap-2">
          {levels.map((l) => (
            <button
              key={l.v}
              onClick={() => onChange({ ...data, level: l.v })}
              className={`flex-1 py-2 rounded text-xs font-bold ${
                data.level === l.v ? `${l.cls} text-white` : 'bg-stone-100 text-stone-500'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </FieldGroup>
      <FieldGroup label="Заголовок">
        <Input value={data.title} onChange={(e) => onChange({ ...data, title: e.target.value })} />
        <StyleRow data={data} onChange={onChange} elType="warning" styleKey="title" />
      </FieldGroup>
      <FieldGroup label="Текст">
        <Textarea
          value={data.body}
          onChange={(e) => onChange({ ...data, body: e.target.value })}
          rows={4}
        />
        <StyleRow data={data} onChange={onChange} elType="warning" styleKey="body" />
      </FieldGroup>
    </>
  );
}

function StepListEd({ data, onChange }: EdProps<StepListElement>) {
  const updateStep = (idx: number, patch: Partial<StepListItem>) => {
    const next = data.steps.map((s, i) => (i === idx ? { ...s, ...patch } : s));
    onChange({ ...data, steps: next });
  };
  const addStep = () => {
    const nextNum = String(data.steps.length + 1);
    onChange({
      ...data,
      steps: [...data.steps, { id: newId('step'), number: nextNum, text: '' }],
    });
  };
  const removeStep = (idx: number) => {
    onChange({ ...data, steps: data.steps.filter((_, i) => i !== idx) });
  };
  const moveStep = (idx: number, dir: -1 | 1) => {
    const t = idx + dir;
    if (t < 0 || t >= data.steps.length) return;
    const next = [...data.steps];
    [next[idx], next[t]] = [next[t], next[idx]];
    onChange({ ...data, steps: next });
  };
  return (
    <>
      <FieldGroup label="Положення фото">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onChange({ ...data, imagePosition: 'right' })}
            className={`px-2.5 py-1 text-xs rounded ${
              (data.imagePosition ?? 'right') === 'right'
                ? 'bg-orange-600 text-white'
                : 'bg-stone-100 hover:bg-stone-200'
            }`}
          >
            Праворуч від тексту
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...data, imagePosition: 'below' })}
            className={`px-2.5 py-1 text-xs rounded ${
              data.imagePosition === 'below'
                ? 'bg-orange-600 text-white'
                : 'bg-stone-100 hover:bg-stone-200'
            }`}
          >
            Під текстом
          </button>
        </div>
      </FieldGroup>
      <FieldGroup label={`Кроки (${data.steps.length})`}>
        {data.steps.map((step, idx) => (
          <div key={step.id} className="border border-stone-100 rounded p-2 mb-2">
            <div className="flex gap-2 items-start mb-2">
              <Input
                value={step.number}
                onChange={(e) => updateStep(idx, { number: e.target.value })}
                placeholder="1"
                className="w-16 flex-shrink-0"
              />
              <Textarea
                value={step.text}
                onChange={(e) => updateStep(idx, { text: e.target.value })}
                rows={2}
                placeholder="Текст кроку"
              />
              <div className="flex flex-col gap-1 flex-shrink-0">
                <IconBtn onClick={() => moveStep(idx, -1)} title="Вгору">
                  <ChevronUp size={12} />
                </IconBtn>
                <IconBtn onClick={() => moveStep(idx, 1)} title="Вниз">
                  <ChevronDown size={12} />
                </IconBtn>
                <IconBtn onClick={() => removeStep(idx)} title="Видалити" variant="danger">
                  <Trash2 size={12} />
                </IconBtn>
              </div>
            </div>
            <ImageUploader
              value={step.imageUrl}
              onChange={(url) => updateStep(idx, { imageUrl: url })}
              hint="Фото для кроку (опціонально)"
              aspectRatio="4/3"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addStep}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded text-xs"
        >
          <Plus size={12} /> Додати крок
        </button>
      </FieldGroup>
    </>
  );
}

function CardGridEd({ data, onChange }: EdProps<CardGridElement>) {
  const updateCard = (idx: number, patch: Partial<CardGridItem>) => {
    const next = data.cards.map((c, i) => (i === idx ? { ...c, ...patch } : c));
    onChange({ ...data, cards: next });
  };
  const addCard = () => {
    onChange({
      ...data,
      cards: [
        ...data.cards,
        { id: newId('card'), title: 'Назва', body: '', bullets: [] },
      ],
    });
  };
  const removeCard = (idx: number) => {
    onChange({ ...data, cards: data.cards.filter((_, i) => i !== idx) });
  };
  const moveCard = (idx: number, dir: -1 | 1) => {
    const t = idx + dir;
    if (t < 0 || t >= data.cards.length) return;
    const next = [...data.cards];
    [next[idx], next[t]] = [next[t], next[idx]];
    onChange({ ...data, cards: next });
  };
  const updateBullets = (idx: number, value: string) => {
    const items = value.split('\n').map((l) => l.trim()).filter(Boolean);
    updateCard(idx, { bullets: items });
  };
  return (
    <>
      <FieldGroup label="Колонки">
        <div className="flex gap-1">
          {[2, 3].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onChange({ ...data, columns: n as 2 | 3 })}
              className={`px-3 py-1 text-xs rounded ${
                data.columns === n
                  ? 'bg-orange-600 text-white'
                  : 'bg-stone-100 hover:bg-stone-200'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </FieldGroup>
      <FieldGroup label={`Картки (${data.cards.length})`}>
        {data.cards.map((card, idx) => (
          <div key={card.id} className="border border-stone-100 rounded p-2 mb-2">
            <div className="flex gap-2 items-start mb-2">
              <Input
                value={card.title}
                onChange={(e) => updateCard(idx, { title: e.target.value })}
                placeholder="Назва картки"
              />
              <div className="flex flex-col gap-1 flex-shrink-0">
                <IconBtn onClick={() => moveCard(idx, -1)} title="Вгору">
                  <ChevronUp size={12} />
                </IconBtn>
                <IconBtn onClick={() => moveCard(idx, 1)} title="Вниз">
                  <ChevronDown size={12} />
                </IconBtn>
                <IconBtn onClick={() => removeCard(idx)} title="Видалити" variant="danger">
                  <Trash2 size={12} />
                </IconBtn>
              </div>
            </div>
            <Textarea
              value={card.body ?? ''}
              onChange={(e) => updateCard(idx, { body: e.target.value })}
              rows={2}
              placeholder="Короткий опис"
            />
            <div className="mt-2">
              <div className="text-[10px] uppercase tracking-wider text-stone-400 mb-1">
                Буллети (рядок = пункт)
              </div>
              <Textarea
                value={(card.bullets ?? []).join('\n')}
                onChange={(e) => updateBullets(idx, e.target.value)}
                rows={3}
                placeholder={'Особливість 1\nОсобливість 2'}
              />
            </div>
            <div className="mt-2">
              <ImageUploader
                value={card.imageUrl}
                onChange={(url) => updateCard(idx, { imageUrl: url })}
                hint="Фото картки"
                aspectRatio="4/3"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addCard}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded text-xs"
        >
          <Plus size={12} /> Додати картку
        </button>
      </FieldGroup>
    </>
  );
}
