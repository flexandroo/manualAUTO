import { useState } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import type { Page, PageType } from '../types/instruction';
import { PAGE_REGISTRY, PAGE_TYPE_ORDER, getPageSpec } from '../pages/pageRegistry';
import { confirmAction } from '../utils/confirm';

interface Props {
  pages: Page[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onAdd: (type: PageType) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, dir: -1 | 1) => void;
}

export function PageList({ pages, activeId, onSelect, onAdd, onRemove, onMove }: Props) {
  const [adding, setAdding] = useState(false);
  const usedUnique = new Set(pages.filter((p) => PAGE_REGISTRY[p.type].unique).map((p) => p.type));
  const available = PAGE_TYPE_ORDER.filter((t) => !usedUnique.has(t));

  return (
    <aside className="w-60 bg-slate-900 border-r border-slate-800 p-3 flex flex-col">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
          Сторінки документа ({pages.length})
        </span>
        <button
          onClick={() => setAdding((v) => !v)}
          className="p-1 rounded bg-orange-600 hover:bg-orange-500 text-white"
          title="Додати сторінку"
        >
          <Plus size={12} />
        </button>
      </div>

      {adding && (
        <div className="mb-3 bg-slate-950 border border-slate-800 rounded p-2 space-y-1">
          {available.length === 0 && (
            <div className="text-[11px] text-slate-500 px-1">Усі унікальні типи додані</div>
          )}
          {available.map((t) => {
            const spec = PAGE_REGISTRY[t];
            const Icon = spec.icon;
            return (
              <button
                key={t}
                onClick={() => {
                  onAdd(t);
                  setAdding(false);
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs text-slate-300 hover:bg-slate-800 text-left"
              >
                <Icon size={12} /> {spec.label}
              </button>
            );
          })}
          <button
            onClick={() => setAdding(false)}
            className="w-full text-[10px] text-slate-500 hover:text-slate-300 mt-1"
          >
            відмінити
          </button>
        </div>
      )}

      <div className="space-y-1 overflow-y-auto flex-1">
        {pages.map((p, i) => {
          const spec = getPageSpec(p.type);
          const Icon = spec.icon;
          const isActive = p.id === activeId;
          const canRemove = !spec.unique || pages.filter((x) => x.type === p.type).length > 1;
          const label = pageLabel(p, spec.label);
          return (
            <div
              key={p.id}
              className={`group flex items-center gap-1 rounded border ${
                isActive
                  ? 'bg-orange-600/15 border-orange-600/40'
                  : 'border-transparent hover:bg-slate-800'
              }`}
            >
              <button
                onClick={() => onSelect(p.id)}
                className={`flex-1 flex items-center gap-2 px-2 py-2 text-xs font-medium text-left ${
                  isActive ? 'text-orange-300' : 'text-slate-300'
                }`}
              >
                <span className="text-[10px] text-slate-500 font-mono w-4">{i + 1}</span>
                <Icon size={13} className="flex-shrink-0" />
                <span className="truncate">{label}</span>
              </button>
              <div className="flex opacity-0 group-hover:opacity-100 pr-1 transition-opacity">
                <button
                  onClick={() => onMove(p.id, -1)}
                  disabled={i === 0}
                  className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-30"
                >
                  <ChevronUp size={11} />
                </button>
                <button
                  onClick={() => onMove(p.id, 1)}
                  disabled={i === pages.length - 1}
                  className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-30"
                >
                  <ChevronDown size={11} />
                </button>
                {canRemove && (
                  <button
                    onClick={() => {
                      if (confirmAction(`Видалити сторінку "${label}"?`)) onRemove(p.id);
                    }}
                    className="p-1 text-slate-400 hover:text-red-400"
                  >
                    <Trash2 size={11} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

function pageLabel(p: Page, fallback: string): string {
  if (p.type === 'standard' && p.sectionTitle) return p.sectionTitle;
  return fallback;
}
