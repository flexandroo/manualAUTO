import { CheckCircle2, AlertCircle } from 'lucide-react';
import type { ParseReport } from '../types/instruction';

interface Props {
  report: ParseReport;
  pages: number;
  onClose: () => void;
  onApply: () => void;
}

export function ImportReport({ report, pages, onClose, onApply }: Props) {
  const checks = [
    { label: 'Заголовок', ok: report.cover.title },
    { label: 'Перелік моделей', ok: report.cover.models },
    { label: 'Тип документа', ok: report.cover.documentType },
    { label: 'Стандарти', ok: report.techSpecs.standards },
    {
      label: `Властивості (${report.techSpecs.properties} шт.)`,
      ok: report.techSpecs.properties >= 5,
    },
    {
      label: `Таблиця характеристик (${report.techSpecs.tableHeaders}×${report.techSpecs.tableRows})`,
      ok: report.techSpecs.tableHeaders >= 2 && report.techSpecs.tableRows >= 1,
    },
    {
      label: `Пронумеровані розділи (${report.sections.items} шт.)`,
      ok: report.sections.items >= 3,
    },
  ];
  const successCount = checks.filter((c) => c.ok).length;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 no-print">
      <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-bold mb-1">Звіт парсингу</h3>
        <div className="text-xs text-slate-400 mb-4">
          Розпарсено {pages} сторінок. Розпізнано {successCount} з {checks.length} блоків.
        </div>
        <div className="space-y-2 mb-5">
          {checks.map((c, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              {c.ok ? (
                <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
              ) : (
                <AlertCircle size={16} className="text-amber-500 flex-shrink-0" />
              )}
              <span className={c.ok ? 'text-slate-200' : 'text-amber-300'}>{c.label}</span>
            </div>
          ))}
        </div>
        <div className="text-xs text-slate-500 mb-5 leading-relaxed">
          Дані будуть завантажені у форму. Усе можна підкоригувати вручну після імпорту.
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm"
          >
            Скасувати
          </button>
          <button
            onClick={onApply}
            className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded text-sm font-bold"
          >
            Застосувати
          </button>
        </div>
      </div>
    </div>
  );
}
