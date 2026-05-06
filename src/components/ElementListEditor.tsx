import { useState } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import type { PageElement, PageElementType } from '../types/instruction';
import { ELEMENT_ORDER, ELEMENT_SPECS } from '../elements/elementRegistry';
import { ElementEditor } from '../elements/ElementEditor';
import { createElement } from '../elements/elementDefaults';
import { confirmAction } from '../utils/confirm';

interface Props {
  elements: PageElement[];
  onChange: (next: PageElement[]) => void;
}

// Editor for a list of PageElements: add via popup picker, reorder via
// arrows, expand/collapse to edit, delete, etc.
export function ElementListEditor({ elements, onChange }: Props) {
  const [adding, setAdding] = useState(false);
  const [openId, setOpenId] = useState<string | null>(elements[0]?.id ?? null);

  const addElement = (type: PageElementType) => {
    const el = createElement(type);
    onChange([...elements, el]);
    setOpenId(el.id);
    setAdding(false);
  };

  const updateElement = (id: string, next: PageElement) => {
    onChange(elements.map((e) => (e.id === id ? next : e)));
  };

  const removeElement = (id: string) => {
    const el = elements.find((e) => e.id === id);
    if (!el) return;
    if (confirmAction(`Видалити елемент "${ELEMENT_SPECS[el.type].label}"?`)) {
      onChange(elements.filter((e) => e.id !== id));
    }
  };

  const moveElement = (id: string, dir: -1 | 1) => {
    const idx = elements.findIndex((e) => e.id === id);
    if (idx < 0) return;
    const t = idx + dir;
    if (t < 0 || t >= elements.length) return;
    const next = [...elements];
    [next[idx], next[t]] = [next[t], next[idx]];
    onChange(next);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Елементи на сторінці ({elements.length})
        </label>
        <button
          onClick={() => setAdding((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded text-xs font-bold"
        >
          <Plus size={12} /> Додати
        </button>
      </div>

      {adding && (
        <div className="mb-3 bg-slate-950 border border-slate-800 rounded p-2 grid grid-cols-2 gap-1">
          {ELEMENT_ORDER.map((t) => {
            const spec = ELEMENT_SPECS[t];
            const Icon = spec.icon;
            return (
              <button
                key={t}
                onClick={() => addElement(t)}
                className="flex items-start gap-2 px-2 py-2 rounded text-xs text-slate-300 hover:bg-slate-800 text-left"
                title={spec.hint}
              >
                <Icon size={14} className="flex-shrink-0 mt-0.5 text-orange-400" />
                <div>
                  <div className="font-semibold">{spec.label}</div>
                  <div className="text-[10px] text-slate-500">{spec.hint}</div>
                </div>
              </button>
            );
          })}
          <button
            onClick={() => setAdding(false)}
            className="col-span-2 text-[10px] text-slate-500 hover:text-slate-300 mt-1"
          >
            відмінити
          </button>
        </div>
      )}

      <div className="space-y-2">
        {elements.map((el, i) => {
          const spec = ELEMENT_SPECS[el.type];
          const Icon = spec.icon;
          const isOpen = openId === el.id;
          return (
            <div
              key={el.id}
              className={`border rounded ${
                isOpen ? 'border-orange-600/40 bg-slate-900' : 'border-slate-800 bg-slate-950'
              }`}
            >
              <div className="flex items-center gap-1 p-2">
                <Icon size={13} className="text-orange-400 flex-shrink-0" />
                <button
                  onClick={() => setOpenId(isOpen ? null : el.id)}
                  className="flex-1 text-left text-xs font-medium text-slate-200 truncate"
                >
                  {spec.label} <span className="text-slate-500">{summary(el)}</span>
                </button>
                <button
                  onClick={() => moveElement(el.id, -1)}
                  disabled={i === 0}
                  className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-30"
                >
                  <ChevronUp size={11} />
                </button>
                <button
                  onClick={() => moveElement(el.id, 1)}
                  disabled={i === elements.length - 1}
                  className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-30"
                >
                  <ChevronDown size={11} />
                </button>
                <button
                  onClick={() => removeElement(el.id)}
                  className="p-1 text-slate-400 hover:text-red-400"
                >
                  <Trash2 size={11} />
                </button>
              </div>
              {isOpen && (
                <div className="p-3 pt-1 border-t border-slate-800">
                  <ElementEditor
                    element={el}
                    onChange={(next) => updateElement(el.id, next)}
                  />
                </div>
              )}
            </div>
          );
        })}
        {elements.length === 0 && (
          <div className="text-[11px] text-slate-500 italic text-center py-6 border border-dashed border-slate-800 rounded">
            На цій сторінці немає елементів. Натисніть «Додати», щоб вставити перший.
          </div>
        )}
      </div>
    </div>
  );
}

// Short tail-text shown after the element label in the list, e.g. count of items
function summary(el: PageElement): string {
  switch (el.type) {
    case 'heading':
      return el.text ? `· "${truncate(el.text, 24)}"` : '';
    case 'subsection':
      return `· ${el.number} ${truncate(el.heading, 20)}`;
    case 'paragraph':
      return el.text ? `· "${truncate(el.text, 32)}"` : '';
    case 'bulletList':
      return `· ${el.items.length} пункт.`;
    case 'numberedList':
      return `· ${el.items.length} пункт.`;
    case 'table':
      return `· ${el.headers.length}×${el.rows.length}`;
    case 'kvList':
      return `· ${el.rows.length} пар`;
    case 'scheme':
      return `· ${el.items.length} виносок`;
    case 'image':
      return el.caption ? `· "${truncate(el.caption, 20)}"` : '';
    case 'imageGrid':
      return `· ${el.items.length} карток`;
    case 'warning':
      return el.level === 'danger' ? '· заборонено' : el.level === 'info' ? '· інфо' : '· увага';
    case 'twoColumn':
      return `· ${el.left.length}/${el.right.length} елементів`;
    case 'separator':
      return '';
  }
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}
