import { Plus, Trash2 } from 'lucide-react';
import type { TechSpecsBlockData } from '../../types/instruction';
import { FieldGroup } from '../../components/ui/FieldGroup';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { IconBtn } from '../../components/ui/IconBtn';

interface Props {
  data: TechSpecsBlockData;
  onChange: (data: TechSpecsBlockData) => void;
}

export function TechSpecsEditor({ data, onChange }: Props) {
  const updateProp = (i: number, field: 'key' | 'value', value: string) => {
    const next = [...data.properties];
    next[i] = { ...next[i], [field]: value };
    onChange({ ...data, properties: next });
  };
  const addProp = () =>
    onChange({ ...data, properties: [...data.properties, { key: '', value: '' }] });
  const removeProp = (i: number) =>
    onChange({ ...data, properties: data.properties.filter((_, idx) => idx !== i) });

  const updateHeader = (i: number, value: string) => {
    const next = [...data.table.headers];
    next[i] = value;
    onChange({ ...data, table: { ...data.table, headers: next } });
  };
  const updateCell = (rowIdx: number, colIdx: number, value: string) => {
    const next = data.table.rows.map((r, i) =>
      i === rowIdx ? r.map((c, j) => (j === colIdx ? value : c)) : r
    );
    onChange({ ...data, table: { ...data.table, rows: next } });
  };
  const addRow = () => {
    const newRow = data.table.headers.map(() => '');
    onChange({ ...data, table: { ...data.table, rows: [...data.table.rows, newRow] } });
  };
  const removeRow = (i: number) =>
    onChange({
      ...data,
      table: { ...data.table, rows: data.table.rows.filter((_, idx) => idx !== i) },
    });
  const addColumn = () => {
    onChange({
      ...data,
      table: {
        headers: [...data.table.headers, 'Нова колонка'],
        rows: data.table.rows.map((r) => [...r, '']),
      },
    });
  };
  const removeColumn = (colIdx: number) => {
    if (colIdx === 0) return;
    onChange({
      ...data,
      table: {
        headers: data.table.headers.filter((_, i) => i !== colIdx),
        rows: data.table.rows.map((r) => r.filter((_, i) => i !== colIdx)),
      },
    });
  };

  return (
    <div>
      <FieldGroup label="Заголовок">
        <Input
          value={data.heading}
          onChange={(e) => onChange({ ...data, heading: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="Стандарти" hint="Через кому">
        <Textarea
          value={data.standards}
          onChange={(e) => onChange({ ...data, standards: e.target.value })}
          rows={2}
        />
      </FieldGroup>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Властивості (список)
          </label>
          <IconBtn onClick={addProp} variant="primary">
            <Plus size={14} />
          </IconBtn>
        </div>
        <div className="space-y-2">
          {data.properties.map((p, i) => (
            <div key={i} className="flex gap-2 items-start">
              <Input
                value={p.key}
                placeholder="Ключ"
                onChange={(e) => updateProp(i, 'key', e.target.value)}
              />
              <Input
                value={p.value}
                placeholder="Значення"
                onChange={(e) => updateProp(i, 'value', e.target.value)}
              />
              <IconBtn onClick={() => removeProp(i)} variant="danger">
                <Trash2 size={14} />
              </IconBtn>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Таблиця характеристик
          </label>
          <div className="flex gap-1">
            <button
              onClick={addColumn}
              className="text-[11px] px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
            >
              + колонка
            </button>
            <button
              onClick={addRow}
              className="text-[11px] px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
            >
              + рядок
            </button>
          </div>
        </div>
        <div className="overflow-x-auto bg-slate-900 rounded p-2">
          <table className="w-full text-xs">
            <thead>
              <tr>
                {data.table.headers.map((h, i) => (
                  <th key={i} className="p-1 relative group">
                    <input
                      value={h}
                      onChange={(e) => updateHeader(i, e.target.value)}
                      className="w-full bg-slate-800 text-orange-300 font-semibold rounded px-2 py-1 text-xs"
                    />
                    {i > 0 && (
                      <button
                        onClick={() => removeColumn(i)}
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
              {data.table.rows.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {row.map((cell, colIdx) => (
                    <td key={colIdx} className="p-1">
                      <textarea
                        value={cell}
                        onChange={(e) => updateCell(rowIdx, colIdx, e.target.value)}
                        rows={1}
                        className="w-full bg-slate-800 text-slate-200 rounded px-2 py-1 text-xs resize-y"
                      />
                    </td>
                  ))}
                  <td>
                    <IconBtn onClick={() => removeRow(rowIdx)} variant="danger">
                      <Trash2 size={12} />
                    </IconBtn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
