import { useEffect, useRef, useState } from 'react';
import { LayoutTemplate, Plus, Trash2, FileText } from 'lucide-react';
import {
  listTemplates,
  saveTemplate,
  deleteTemplate,
  instantiateTemplate,
  type Template,
} from '../utils/templates';
import type { InstructionData } from '../types/instruction';

interface Props {
  currentDoc: InstructionData;
  onLoad: (data: InstructionData) => void;
}

export function TemplateMenu({ currentDoc, onLoad }: Props) {
  const [open, setOpen] = useState(false);
  const [templates, setTemplates] = useState<Template[]>(() => listTemplates());
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const refresh = () => setTemplates(listTemplates());

  const handleSave = () => {
    const suggested = currentDoc.productName?.trim() || 'Новий шаблон';
    const name = prompt('Назва шаблону:', suggested);
    if (name === null) return;
    saveTemplate(name, currentDoc);
    refresh();
  };

  const handleLoad = (t: Template) => {
    if (
      !confirm(
        `Замінити поточний документ шаблоном «${t.name}»? Незбережені зміни буде втрачено.`
      )
    ) {
      return;
    }
    onLoad(instantiateTemplate(t));
    setOpen(false);
  };

  const handleDelete = (e: React.MouseEvent, t: Template) => {
    e.stopPropagation();
    if (!confirm(`Видалити шаблон «${t.name}»?`)) return;
    deleteTemplate(t.id);
    refresh();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded text-xs font-medium"
        title="Шаблони продуктів"
      >
        <LayoutTemplate size={14} /> Шаблони
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-72 bg-white border border-stone-200 rounded shadow-xl z-50 overflow-hidden">
          <button
            onClick={handleSave}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium hover:bg-stone-100 border-b border-stone-100 text-left"
          >
            <Plus size={14} className="text-orange-500" />
            Зберегти поточний як шаблон
          </button>
          {templates.length === 0 ? (
            <div className="px-3 py-4 text-[11px] text-stone-400 text-center">
              Збережених шаблонів немає
            </div>
          ) : (
            <div className="max-h-72 overflow-y-auto">
              {templates.map((t) => (
                <div
                  key={t.id}
                  onClick={() => handleLoad(t)}
                  className="group flex items-center gap-2 px-3 py-2 hover:bg-stone-100 cursor-pointer text-xs border-b border-stone-100 last:border-b-0"
                >
                  <FileText size={13} className="text-stone-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{t.name}</div>
                    <div className="text-[10px] text-stone-400">
                      {t.data.pages.length} сторінок · {formatDate(t.createdAt)}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, t)}
                    className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-700 text-stone-500 hover:text-white"
                    title="Видалити"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
