import { CheckCircle2, AlertCircle } from 'lucide-react';
import type { PdfParseReport } from '../parsers/parsePdf';

interface Props {
  report: PdfParseReport;
  onClose: () => void;
  onApply: () => void;
}

export function ImportReport({ report, onClose, onApply }: Props) {
  const okCount = report.detected.filter((d) => d.ok).length;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 no-print">
      <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-bold mb-1">Звіт парсингу</h3>
        <div className="text-xs text-slate-400 mb-4">
          Розпарсено {report.pages} сторінок. Розпізнано {okCount} з {report.detected.length} блоків.
        </div>
        <div className="space-y-2 mb-5">
          {report.detected.map((d, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              {d.ok ? (
                <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <span className={d.ok ? 'text-slate-200' : 'text-amber-300'}>{d.label}</span>
                {d.details && (
                  <div className="text-[11px] text-slate-500 mt-0.5">{d.details}</div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="text-xs text-slate-500 mb-5 leading-relaxed">
          Усі блоки додадуться у документ. Ті, що не розпізнались, будуть заповнені стандартним
          шаблоном — підкоригуйте їх вручну після імпорту.
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
