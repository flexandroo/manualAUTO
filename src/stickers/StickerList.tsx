import { useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Download,
  FileText,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react';
import type { StickerData } from './types';
import { getStickerCategory, listCategories } from './categories';

interface Props {
  stickers: StickerData[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onImport: () => void;
  onDelete: (id: string) => void;
  onPullAll: (visibleIds: string[]) => void;
  importing?: boolean;
  pullingAll?: boolean;
}

// Left sidebar in the stickers tab. Groups stickers by category derived
// from the article prefix; collapsible sections, search across article
// + productCode + title; toolbar for "new" and "import".
export function StickerList({
  stickers,
  activeId,
  onSelect,
  onAdd,
  onImport,
  onDelete,
  onPullAll,
  importing,
  pullingAll,
}: Props) {
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return stickers;
    return stickers.filter((s) => {
      const hay = (
        s.articleCode +
        ' ' +
        s.productCode +
        ' ' +
        s.titleLines.join(' ')
      ).toLowerCase();
      return hay.includes(q);
    });
  }, [stickers, search]);

  const grouped = useMemo(() => {
    const map = new Map<string, StickerData[]>();
    for (const s of filtered) {
      const cat = getStickerCategory(s);
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(s);
    }
    // Order: predefined category order, then any unknowns at the end.
    const order = listCategories();
    const known = order.filter((c) => map.has(c));
    const extras = Array.from(map.keys()).filter((c) => !order.includes(c));
    return [...known, ...extras].map((cat) => ({
      cat,
      items: (map.get(cat) || []).sort((a, b) =>
        a.articleCode.localeCompare(b.articleCode)
      ),
    }));
  }, [filtered]);

  const toggle = (cat: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  return (
    <aside className="w-[260px] bg-white border-r border-stone-100 flex flex-col">
      <div className="p-3 border-b border-stone-100 space-y-2">
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={onAdd}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs rounded font-semibold"
            title="Створити порожню наклейку"
          >
            <Plus size={12} /> Нова
          </button>
          <button
            type="button"
            onClick={onImport}
            disabled={importing}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-stone-200 hover:bg-stone-300 border border-stone-300 disabled:opacity-50 text-xs rounded font-semibold text-stone-700"
            title="Імпорт каталогу з .xlsx"
          >
            <Upload size={12} /> {importing ? 'Імпорт…' : 'Імпорт'}
          </button>
        </div>
        <input
          type="search"
          placeholder="Пошук за артикулом, кодом, назвою"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-2 py-1.5 text-xs border border-stone-200 rounded focus:outline-none focus:border-orange-400"
        />
        <div className="flex items-center justify-between gap-2">
          <div className="text-[10px] text-stone-500">
            {filtered.length} / {stickers.length} наклейок
          </div>
          {filtered.length > 0 && (
            <button
              type="button"
              onClick={() => onPullAll(filtered.map((s) => s.id))}
              disabled={pullingAll}
              className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-stone-800 hover:bg-stone-900 disabled:opacity-40 text-white rounded"
              title="Підтягнути специфікації + фото з termojet.com.ua для всіх показаних"
            >
              <Download size={10} />
              {pullingAll ? 'Завантаження…' : 'Каталог'}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {stickers.length === 0 && (
          <EmptyState onAdd={onAdd} onImport={onImport} />
        )}
        {grouped.map(({ cat, items }) => {
          const isCollapsed = collapsed.has(cat);
          return (
            <div key={cat} className="border-b border-stone-100 last:border-b-0">
              <button
                type="button"
                onClick={() => toggle(cat)}
                className="w-full flex items-center gap-1 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-stone-700 bg-stone-50 hover:bg-stone-100"
              >
                {isCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                <span className="flex-1 text-left">{cat}</span>
                <span className="text-stone-400 font-normal">{items.length}</span>
              </button>
              {!isCollapsed && (
                <div>
                  {items.map((s) => (
                    <StickerRow
                      key={s.id}
                      sticker={s}
                      active={s.id === activeId}
                      onSelect={() => onSelect(s.id)}
                      onDelete={() => onDelete(s.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

function StickerRow({
  sticker,
  active,
  onSelect,
  onDelete,
}: {
  sticker: StickerData;
  active: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`group px-3 py-1.5 cursor-pointer flex items-start gap-2 text-xs border-l-2 ${
        active
          ? 'bg-orange-50 border-orange-500'
          : 'border-transparent hover:bg-stone-50'
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="font-bold text-stone-800 truncate">
          {sticker.productCode || '(без коду)'}
        </div>
        <div className="text-[10px] text-stone-500 font-mono truncate">
          {sticker.articleCode || '—'}
        </div>
        {sticker.titleLines.length > 0 && (
          <div className="text-[10px] text-stone-500 truncate">
            {sticker.titleLines.join(' ')}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (confirm(`Видалити наклейку ${sticker.productCode || sticker.articleCode}?`)) {
            onDelete();
          }
        }}
        className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-red-500 transition-opacity p-1"
        title="Видалити"
      >
        <Trash2 size={11} />
      </button>
    </div>
  );
}

function EmptyState({ onAdd, onImport }: { onAdd: () => void; onImport: () => void }) {
  return (
    <div className="p-6 text-center text-stone-500 text-xs space-y-3">
      <FileText size={32} className="mx-auto text-stone-300" />
      <p>Ще немає наклейок.</p>
      <div className="flex flex-col gap-1.5">
        <button
          type="button"
          onClick={onAdd}
          className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded font-semibold"
        >
          Створити нову
        </button>
        <button
          type="button"
          onClick={onImport}
          className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 border border-stone-300 rounded font-semibold text-stone-700"
        >
          Імпорт з Excel
        </button>
      </div>
    </div>
  );
}
