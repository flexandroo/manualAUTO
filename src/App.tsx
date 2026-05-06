import { useRef, useState, type ChangeEvent } from 'react';
import html2pdf from 'html2pdf.js';
import {
  FileDown,
  Settings,
  Eye,
  FileText,
  Layers,
  Save,
  Upload,
  FileUp,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import './styles/pdf-print.css';
import type { BlockId, InstructionData, ParseResult } from './types/instruction';
import { initialData } from './data/initialData';
import { CoverEditor } from './blocks/cover/CoverEditor';
import { CoverPreview } from './blocks/cover/CoverPreview';
import { TechSpecsEditor } from './blocks/techSpecs/TechSpecsEditor';
import { TechSpecsPreview } from './blocks/techSpecs/TechSpecsPreview';
import { SectionsEditor } from './blocks/sections/SectionsEditor';
import { SectionsPreview } from './blocks/sections/SectionsPreview';
import { ImportReport } from './components/ImportReport';
import { parsePdfToData } from './parsers/parsePdf';

type ParseStatus = 'idle' | 'loading' | 'error';

const BLOCKS: { id: BlockId; label: string; icon: typeof FileText }[] = [
  { id: 'cover', label: 'Титульна', icon: FileText },
  { id: 'techSpecs', label: 'Технічні характеристики', icon: Layers },
  { id: 'sections', label: 'Текстові розділи', icon: FileText },
];

const TODO_BLOCKS = [
  'Інструкція з монтажу',
  'Будова виробу',
  'Габаритні розміри',
  'Гарантія',
];

export default function App() {
  const [data, setData] = useState<InstructionData>(initialData);
  const [activeBlock, setActiveBlock] = useState<BlockId>('cover');
  const [zoom, setZoom] = useState(0.65);
  const [parseStatus, setParseStatus] = useState<ParseStatus>('idle');
  const [parseError, setParseError] = useState('');
  const [pendingImport, setPendingImport] = useState<ParseResult | null>(null);
  const [downloading, setDownloading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    setDownloading(true);
    try {
      // Wait for fonts to be ready so html2canvas captures them correctly.
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      const filename = `${data.cover.title || 'instruction'}-${Date.now()}.pdf`
        .replace(/[\\/:*?"<>|]/g, '_');
      await html2pdf()
        .from(printRef.current)
        .set({
          margin: 0,
          filename,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .save();
    } finally {
      setDownloading(false);
    }
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `instruction-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        setData(JSON.parse(ev.target?.result as string));
      } catch {
        alert('Помилка зчитування файлу');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleImportPdf = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setParseStatus('loading');
    setParseError('');
    try {
      const result = await parsePdfToData(file);
      setPendingImport(result);
      setParseStatus('idle');
    } catch (err) {
      console.error(err);
      setParseError(err instanceof Error ? err.message : 'Не вдалося розпарсити PDF');
      setParseStatus('error');
    }
    e.target.value = '';
  };

  const applyImport = () => {
    if (pendingImport) {
      setData(pendingImport.data);
      setPendingImport(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="no-print bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center font-black text-sm">
            PDF
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight">Генератор інструкцій</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">
              manualAUTO · v0.3
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label
            className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              parseStatus === 'loading'
                ? 'bg-orange-600/30 text-orange-300 cursor-wait'
                : 'bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border border-orange-600/40'
            }`}
          >
            {parseStatus === 'loading' ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Парсинг...
              </>
            ) : (
              <>
                <FileUp size={14} /> Імпорт з PDF
              </>
            )}
            <input
              type="file"
              accept=".pdf"
              onChange={handleImportPdf}
              className="hidden"
              disabled={parseStatus === 'loading'}
            />
          </label>

          <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs font-medium transition-colors">
            <Upload size={14} /> Імпорт JSON
            <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
          </label>
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs font-medium transition-colors"
          >
            <Save size={14} /> Експорт JSON
          </button>
          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-orange-600 hover:bg-orange-500 disabled:bg-orange-700 disabled:cursor-wait rounded text-xs font-bold transition-colors"
          >
            {downloading ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Генерація...
              </>
            ) : (
              <>
                <FileDown size={14} /> Завантажити PDF
              </>
            )}
          </button>
        </div>
      </header>

      {parseStatus === 'error' && (
        <div className="no-print bg-red-950/50 border-b border-red-800 px-6 py-2 text-sm text-red-300 flex items-center gap-2">
          <AlertCircle size={16} /> Помилка: {parseError}
          <button onClick={() => setParseStatus('idle')} className="ml-auto text-xs underline">
            ×
          </button>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden no-print">
        <aside className="w-56 bg-slate-900 border-r border-slate-800 p-3 flex flex-col">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2 px-2">
            Блоки
          </div>
          <div className="space-y-1">
            {BLOCKS.map((b) => {
              const Icon = b.icon;
              return (
                <button
                  key={b.id}
                  onClick={() => setActiveBlock(b.id)}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 rounded text-xs font-medium text-left transition-colors ${
                    activeBlock === b.id
                      ? 'bg-orange-600/20 text-orange-300 border border-orange-600/40'
                      : 'text-slate-300 hover:bg-slate-800 border border-transparent'
                  }`}
                >
                  <Icon size={14} /> {b.label}
                </button>
              );
            })}
          </div>
          <div className="mt-auto pt-4 border-t border-slate-800 space-y-1">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2 px-2">
              + інші блоки (todo)
            </div>
            {TODO_BLOCKS.map((b) => (
              <div key={b} className="px-2.5 py-1.5 text-[11px] text-slate-600 italic">
                {b}
              </div>
            ))}
          </div>
        </aside>

        <main className="w-[420px] bg-slate-950 overflow-y-auto p-6 border-r border-slate-800">
          <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-800">
            <Settings size={16} className="text-orange-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              {BLOCKS.find((b) => b.id === activeBlock)?.label}
            </h2>
          </div>
          {activeBlock === 'cover' && (
            <CoverEditor data={data.cover} onChange={(d) => setData({ ...data, cover: d })} />
          )}
          {activeBlock === 'techSpecs' && (
            <TechSpecsEditor
              data={data.techSpecs}
              onChange={(d) => setData({ ...data, techSpecs: d })}
            />
          )}
          {activeBlock === 'sections' && (
            <SectionsEditor
              data={data.sections}
              onChange={(d) => setData({ ...data, sections: d })}
            />
          )}
        </main>

        <section className="flex-1 bg-slate-800 overflow-auto relative">
          <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye size={14} className="text-orange-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Live preview</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Zoom</span>
              <input
                type="range"
                min="0.4"
                max="1"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-24 accent-orange-500"
              />
              <span className="text-[11px] text-slate-400 font-mono w-10">
                {Math.round(zoom * 100)}%
              </span>
            </div>
          </div>
          <div className="p-6 flex flex-col items-center gap-2">
            {[
              <CoverPreview key="cover" data={data.cover} />,
              <TechSpecsPreview key="tech" data={data.techSpecs} />,
              <SectionsPreview key="sec" data={data.sections} />,
            ].map((page, i) => (
              <div
                key={i}
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.2s',
                  height: `calc(297mm * ${zoom})`,
                  marginBottom: i < 2 ? '8px' : 0,
                }}
              >
                <div style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>{page}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div
        ref={printRef}
        aria-hidden
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: -10,
          opacity: 0,
          pointerEvents: 'none',
          width: '210mm',
          background: 'white',
        }}
      >
        <CoverPreview data={data.cover} />
        <TechSpecsPreview data={data.techSpecs} />
        <SectionsPreview data={data.sections} />
      </div>

      {pendingImport && (
        <ImportReport
          report={pendingImport.report}
          pages={pendingImport.pages}
          onClose={() => setPendingImport(null)}
          onApply={applyImport}
        />
      )}
    </div>
  );
}
