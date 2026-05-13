import { useEffect, useRef, useState } from 'react';
import { FileText, Plus, Trash2, Edit2, Check, ChevronDown } from 'lucide-react';
import type { DocumentRow } from '../utils/storage';

interface Props {
  docs: DocumentRow[];
  activeId: string | null;
  onSwitch: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export function DocumentSwitcher({
  docs,
  activeId,
  onSwitch,
  onCreate,
  onDelete,
  onRename,
}: Props) {
  const [open, setOpen] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setRenamingId(null);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const active = docs.find((d) => d.id === activeId);

  const startRename = (e: React.MouseEvent, doc: DocumentRow) => {
    e.stopPropagation();
    setRenamingId(doc.id);
    setRenameValue(doc.name);
  };

  const commitRename = (e: React.FormEvent | React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (renamingId && renameValue.trim()) {
      onRename(renamingId, renameValue.trim());
    }
    setRenamingId(null);
  };

  const handleDelete = (e: React.MouseEvent, doc: DocumentRow) => {
    e.stopPropagation();
    if (docs.length === 1) {
      alert('Не можна видалити останній документ');
      return;
    }
    if (!confirm(`Видалити документ «${doc.name}»? Цю дію не можна скасувати.`)) {
      return;
    }
    onDelete(doc.id);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded text-xs font-medium min-w-0 max-w-[280px]"
        title="Переключити документ"
      >
        <FileText size={14} className="text-orange-500 flex-shrink-0" />
        <span className="truncate">{active?.name ?? 'Без документа'}</span>
        <ChevronDown size={12} className="flex-shrink-0 text-stone-500" />
      </button>
      {open && (
        <div className="absolute left-0 mt-1 w-80 bg-white border border-stone-200 rounded shadow-xl z-50 overflow-hidden">
          <button
            onClick={() => {
              onCreate();
              setOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium hover:bg-stone-100 border-b border-stone-100 text-left"
          >
            <Plus size={14} className="text-orange-500" />
            Новий документ
          </button>
          <div className="max-h-80 overflow-y-auto">
            {docs.map((d) => {
              const isActive = d.id === activeId;
              const isRenaming = d.id === renamingId;
              return (
                <div
                  key={d.id}
                  onClick={() => {
                    if (isRenaming) return;
                    onSwitch(d.id);
                    setOpen(false);
                  }}
                  className={`group flex items-center gap-2 px-3 py-2 cursor-pointer text-xs border-b border-stone-100 last:border-b-0 ${
                    isActive ? 'bg-orange-600/15' : 'hover:bg-stone-100'
                  }`}
                >
                  <FileText
                    size={13}
                    className={`flex-shrink-0 ${isActive ? 'text-orange-500' : 'text-stone-400'}`}
                  />
                  <div className="flex-1 min-w-0">
                    {isRenaming ? (
                      <form onSubmit={commitRename} className="flex items-center gap-1">
                        <input
                          autoFocus
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                              e.stopPropagation();
                              setRenamingId(null);
                            }
                          }}
                          className="flex-1 bg-stone-50 border border-stone-200 rounded px-2 py-1 text-xs outline-none focus:border-orange-500"
                        />
                        <button
                          type="submit"
                          onClick={commitRename}
                          className="p-1 text-orange-500 hover:bg-stone-100 rounded"
                        >
                          <Check size={12} />
                        </button>
                      </form>
                    ) : (
                      <>
                        <div className="font-medium truncate">{d.name}</div>
                        <div className="text-[10px] text-stone-400">
                          {d.data.pages.length} сторінок · {formatDate(d.updatedAt)}
                        </div>
                      </>
                    )}
                  </div>
                  {!isRenaming && (
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={(e) => startRename(e, d)}
                        className="p-1 rounded hover:bg-stone-200 text-stone-500 hover:text-white"
                        title="Перейменувати"
                      >
                        <Edit2 size={11} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, d)}
                        className="p-1 rounded hover:bg-red-700 text-stone-500 hover:text-white"
                        title="Видалити"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  const now = Date.now();
  const diff = now - ts;
  if (diff < 60_000) return 'щойно';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} хв тому`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} год тому`;
  return d.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: '2-digit' });
}
