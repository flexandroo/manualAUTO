import { useMemo, useState } from 'react';
import { X, FileText } from 'lucide-react';
import { parseMarkdownToPages } from '../utils/markdownImport';
import type { Page } from '../types/instruction';

interface Props {
  onClose: () => void;
  onImport: (pages: Page[], mode: 'append' | 'replace') => void;
}

const EXAMPLE = `# Опис продукту

## 1.1 Призначення
Розподільчий колектор використовується для розподілення теплоносія між кількома контурами опалення.

## 1.2 Конструкція
Корпус виготовлено з чорної вуглецевої сталі з порошковим покриттям.

### Комплект поставки

- Колектор у зборі
- Кронштейни кріплення
- Заглушки

# Технічні характеристики

## 2.1 Параметри
1. Робочий тиск: до 6 бар
2. Температура теплоносія: до 110 °C

> Не перевищуйте максимальну температуру — це призведе до пошкодження ущільнень.
`;

export function MarkdownImportModal({ onClose, onImport }: Props) {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<'append' | 'replace'>('append');

  const parsed = useMemo(() => parseMarkdownToPages(text), [text]);
  const pageCount = parsed.pages.length;
  const elementCount = parsed.pages.reduce((n, p) => n + p.elements.length, 0);

  const handleImport = () => {
    if (pageCount === 0) return;
    onImport(parsed.pages, mode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[760px] max-w-[95vw] max-h-[90vh] bg-slate-900 border border-slate-700 rounded-lg shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-orange-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider">Імпорт Markdown</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-3 text-[11px] text-slate-400 border-b border-slate-800 leading-relaxed space-y-1">
          <div>
            <span className="font-mono text-slate-300">#</span> сторінка ·{' '}
            <span className="font-mono text-slate-300">## 1.1</span> підрозділ ·{' '}
            <span className="font-mono text-slate-300">###</span> заголовок ·{' '}
            <span className="font-mono text-slate-300">-</span> список ·{' '}
            <span className="font-mono text-slate-300">1.</span> нумерований ·{' '}
            <span className="font-mono text-slate-300">&gt;</span> попередження ·{' '}
            <span className="font-mono text-slate-300">---</span> розділювач
          </div>
          <div>
            <span className="font-mono text-slate-300">| a | b |</span> таблиця ·{' '}
            <span className="font-mono text-slate-300">[kv: T]</span> хар-ки ·{' '}
            <span className="font-mono text-slate-300">[image: підпис]</span> ·{' '}
            <span className="font-mono text-slate-300">[grid: 3]</span> сітка ·{' '}
            <span className="font-mono text-slate-300">[scheme]</span> схема
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={EXAMPLE}
            className="flex-1 bg-slate-950 text-slate-100 px-4 py-3 font-mono text-xs resize-none outline-none border-r border-slate-800"
            spellCheck={false}
          />
          <div className="w-[280px] overflow-y-auto px-4 py-3 text-xs">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2 font-bold">
              Попередній перегляд
            </div>
            {pageCount === 0 ? (
              <div className="text-slate-500 text-[11px]">
                Введіть текст у форматі markdown ліворуч.
              </div>
            ) : (
              <div className="space-y-2">
                {parsed.pages.map((p, i) => (
                  <div key={p.id} className="border border-slate-800 rounded p-2">
                    <div className="font-bold text-slate-200 text-[11px] mb-1">
                      {i + 1}. {p.sectionTitle}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {p.elements.length} елементів
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800 gap-3">
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <button
              onClick={() => setMode('append')}
              className={`px-2.5 py-1 rounded ${
                mode === 'append' ? 'bg-orange-600 text-white' : 'hover:bg-slate-800'
              }`}
            >
              Додати в кінець
            </button>
            <button
              onClick={() => setMode('replace')}
              className={`px-2.5 py-1 rounded ${
                mode === 'replace' ? 'bg-orange-600 text-white' : 'hover:bg-slate-800'
              }`}
            >
              Замінити сторінки
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 mr-2">
              {pageCount > 0
                ? `${pageCount} сторінок · ${elementCount} елементів`
                : 'Нічого розпарсити'}
            </span>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded text-xs font-medium bg-slate-800 hover:bg-slate-700"
            >
              Скасувати
            </button>
            <button
              onClick={handleImport}
              disabled={pageCount === 0}
              className="px-4 py-1.5 rounded text-xs font-bold bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Імпортувати
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
