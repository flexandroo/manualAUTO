import { useCallback, useEffect, useRef, useState } from 'react';
import { Tag } from 'lucide-react';
import type { StickerData } from './types';
import { makeInitialSticker } from './initialSticker';
import { StickerEditor } from './StickerEditor';
import { StickerPreview } from './StickerPreview';
import { StickerList } from './StickerList';
import { importCatalogFile } from './catalogImport';
import { applyCatalogProduct, loadCatalog } from './catalogPull';
import {
  listStickers,
  putSticker,
  putStickers,
  deleteSticker as idbDeleteSticker,
  type StickerRow,
} from '../utils/storage';

// Three-pane layout: sticker list (left), editor (middle), live preview
// with zoom (right). State holds the full list; the active sticker is
// edited in-place and persisted to IndexedDB with a short debounce so
// fast typing doesn't hammer the store.
export function StickersTab() {
  const [stickers, setStickers] = useState<StickerData[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1.5);
  const [importing, setImporting] = useState(false);
  const [pullingAll, setPullingAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const saveTimers = useRef<Map<string, number>>(new Map());

  // Initial load: pull from IDB; if empty, seed with the sample sticker.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const rows = await listStickers();
      if (cancelled) return;
      if (rows.length === 0) {
        const initial = makeInitialSticker();
        const row: StickerRow = {
          id: initial.id,
          data: initial,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        await putSticker(row);
        setStickers([initial]);
        setActiveId(initial.id);
      } else {
        const loaded = rows.map((r) => r.data);
        setStickers(loaded);
        setActiveId(loaded[0]?.id ?? null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const active = stickers.find((s) => s.id === activeId) || null;

  const scheduleSave = useCallback((sticker: StickerData) => {
    const timers = saveTimers.current;
    const existing = timers.get(sticker.id);
    if (existing) window.clearTimeout(existing);
    const t = window.setTimeout(async () => {
      timers.delete(sticker.id);
      await putSticker({
        id: sticker.id,
        data: sticker,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }, 400);
    timers.set(sticker.id, t);
  }, []);

  const handleEdit = useCallback(
    (next: StickerData) => {
      setStickers((prev) => prev.map((s) => (s.id === next.id ? next : s)));
      scheduleSave(next);
    },
    [scheduleSave]
  );

  const handleAdd = useCallback(() => {
    const fresh = makeInitialSticker();
    fresh.titleLines = [];
    fresh.productCode = '';
    fresh.articleCode = '';
    setStickers((prev) => [fresh, ...prev]);
    setActiveId(fresh.id);
    scheduleSave(fresh);
  }, [scheduleSave]);

  const handleDelete = useCallback(
    (id: string) => {
      setStickers((prev) => {
        const next = prev.filter((s) => s.id !== id);
        if (activeId === id) {
          setActiveId(next[0]?.id ?? null);
        }
        return next;
      });
      idbDeleteSticker(id);
    },
    [activeId]
  );

  const handleImport = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handlePullAll = useCallback(
    async (visibleIds: string[]) => {
      setPullingAll(true);
      try {
        const cat = await loadCatalog();
        if (!cat) {
          alert('Не вдалося завантажити каталог.');
          return;
        }
        let filled = 0;
        let skipped = 0;
        let notFound = 0;
        const updates: StickerData[] = [];
        setStickers((prev) => {
          const next = prev.map((s) => {
            if (!visibleIds.includes(s.id)) return s;
            const article = s.articleCode.trim();
            if (!article) {
              skipped++;
              return s;
            }
            const product = cat.productsByArticle[article];
            if (!product) {
              notFound++;
              return s;
            }
            const { sticker } = applyCatalogProduct(s, product);
            updates.push(sticker);
            filled++;
            return sticker;
          });
          return next;
        });
        if (updates.length > 0) {
          const now = Date.now();
          await putStickers(
            updates.map((s) => ({
              id: s.id,
              data: s,
              createdAt: now,
              updatedAt: now,
            }))
          );
        }
        alert(
          `Заповнено: ${filled}\nНемає у каталозі: ${notFound}\nБез артикула: ${skipped}`
        );
      } catch (e) {
        console.error(e);
        alert('Помилка: ' + (e instanceof Error ? e.message : 'невідома'));
      } finally {
        setPullingAll(false);
      }
    },
    []
  );

  const handleFileChosen = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = '';
      if (!file) return;
      setImporting(true);
      try {
        const { stickers: imported, skipped } = await importCatalogFile(file);
        if (imported.length === 0) {
          alert('Не знайдено жодного рядка для імпорту.');
          return;
        }
        const now = Date.now();
        const rows: StickerRow[] = imported.map((s) => ({
          id: s.id,
          data: s,
          createdAt: now,
          updatedAt: now,
        }));
        await putStickers(rows);
        setStickers((prev) => [...imported, ...prev]);
        setActiveId(imported[0].id);
        if (skipped > 0) {
          alert(`Імпортовано ${imported.length} наклейок (пропущено ${skipped} порожніх рядків).`);
        } else {
          alert(`Імпортовано ${imported.length} наклейок.`);
        }
      } catch (err) {
        console.error('Catalog import failed', err);
        alert('Помилка імпорту: ' + (err instanceof Error ? err.message : 'невідома'));
      } finally {
        setImporting(false);
      }
    },
    []
  );

  return (
    <div className="flex-1 flex overflow-hidden no-print">
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        onChange={handleFileChosen}
        className="hidden"
      />

      <StickerList
        stickers={stickers}
        activeId={activeId}
        onSelect={setActiveId}
        onAdd={handleAdd}
        onImport={handleImport}
        onDelete={handleDelete}
        onPullAll={handlePullAll}
        importing={importing}
        pullingAll={pullingAll}
      />

      <aside className="w-[420px] bg-white border-r border-stone-100 flex flex-col">
        {active ? (
          <StickerEditor data={active} onChange={handleEdit} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-stone-400 text-xs p-6 text-center">
            Виберіть наклейку зліва або створіть нову
          </div>
        )}
      </aside>

      <section className="flex-1 bg-stone-100 overflow-auto relative">
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-stone-100 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag size={14} className="text-orange-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Preview</span>
            {active && (
              <span className="text-[11px] text-stone-500 ml-2">
                {active.widthMm}×{active.heightMm} мм
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-stone-500">Zoom</span>
            <input
              type="range"
              min="0.6"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-24 accent-orange-500"
            />
            <span className="text-[11px] text-stone-500 font-mono w-12">
              {Math.round(zoom * 100)}%
            </span>
          </div>
        </div>
        {active ? (
          <div className="p-8 flex justify-center">
            <div style={{ zoom, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
              <StickerPreview data={active} />
            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-stone-400 text-sm">
            Немає активної наклейки
          </div>
        )}
      </section>
    </div>
  );
}
