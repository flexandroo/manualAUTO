import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import html2pdf from 'html2pdf.js';
import { FileDown, Save, Upload, Loader2 } from 'lucide-react';
import './styles/pdf-print.css';
import type { InstructionData, Page, PageType } from './types/instruction';
import { initialData } from './data/initialData';
import { PAGE_REGISTRY, getPageSpec } from './pages/pageRegistry';
import { PageList } from './components/PageList';
import { PageEditorPanel } from './components/PageEditorPanel';
import { PreviewPane } from './components/PreviewPane';
import { PdfDocProvider, type PdfDocCtx } from './components/PdfDocContext';
import { EditingDocProvider } from './components/EditingDocContext';
import { migrateOldBlocksToPages } from './utils/migration';

const STORAGE_KEY = 'manualAUTO:document:v2';
const LEGACY_STORAGE_KEY = 'manualAUTO:document:v1';

function loadFromStorage(): InstructionData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as InstructionData;
      if (parsed && Array.isArray(parsed.pages)) return parsed;
    }
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw);
      const migrated = migrateOldBlocksToPages(legacy);
      if (migrated) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        } catch {
          /* quota */
        }
        return migrated;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export default function App() {
  const [data, setData] = useState<InstructionData>(() => loadFromStorage() ?? initialData);
  const [activeId, setActiveId] = useState<string | null>(data.pages[0]?.id ?? null);
  const [zoom, setZoom] = useState(0.65);
  const [downloading, setDownloading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* quota exceeded */
    }
  }, [data]);

  const activePage = useMemo(
    () => data.pages.find((p) => p.id === activeId) ?? null,
    [data.pages, activeId]
  );

  const updatePage = (next: Page) => {
    setData((d) => ({ ...d, pages: d.pages.map((p) => (p.id === next.id ? next : p)) }));
  };

  const addPage = (type: PageType) => {
    const created = PAGE_REGISTRY[type].createNew();
    setData((d) => ({ ...d, pages: [...d.pages, created] }));
    setActiveId(created.id);
  };

  const removePage = (id: string) => {
    setData((d) => ({ ...d, pages: d.pages.filter((p) => p.id !== id) }));
    setActiveId((aid) => (aid === id ? data.pages[0]?.id ?? null : aid));
  };

  const movePage = (id: string, dir: -1 | 1) => {
    setData((d) => {
      const idx = d.pages.findIndex((p) => p.id === id);
      if (idx < 0) return d;
      const t = idx + dir;
      if (t < 0 || t >= d.pages.length) return d;
      const next = [...d.pages];
      [next[idx], next[t]] = [next[t], next[idx]];
      return { ...d, pages: next };
    });
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.productName || 'instruction'}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const raw = JSON.parse(ev.target?.result as string);
        const migrated = migrateOldBlocksToPages(raw) ?? (raw as InstructionData);
        if (Array.isArray(migrated.pages)) {
          setData(migrated);
          setActiveId(migrated.pages[0]?.id ?? null);
        } else {
          alert('Файл має невідомий формат');
        }
      } catch {
        alert('Помилка зчитування файлу');
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    setDownloading(true);
    try {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      const filename = `${data.productName || 'instruction'}-${Date.now()}.pdf`.replace(
        /[\\/:*?"<>|]/g,
        '_'
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const options: any = {
        margin: 0,
        filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'], before: '.pdf-page' },
      };
      await html2pdf().from(printRef.current).set(options).save();
    } finally {
      setDownloading(false);
    }
  };

  const baseCtx: PdfDocCtx = {
    productName: data.productName,
    brand: data.brand,
    brandLogoUrl: data.brandLogoUrl,
    websiteUrl: data.websiteUrl,
    documentType: data.documentType,
    brandTagline: data.brandTagline,
    modelCodes: data.modelCodes,
    productSubtitle:
      data.modelCodes.length > 0
        ? data.modelCodes.slice(0, 2).join('…') +
          (data.modelCodes.length > 2 ? '…' + data.modelCodes.at(-1) : '')
        : undefined,
    totalPages: data.pages.length,
  };

  return (
    <EditingDocProvider value={{ doc: data, setDoc: setData }}>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <header className="no-print bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center font-black text-sm">
              M
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight">manualAUTO</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                Генератор інструкцій · v0.6
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs font-medium">
              <Upload size={14} /> Імпорт JSON
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>
            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs font-medium"
            >
              <Save size={14} /> Експорт JSON
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-orange-600 hover:bg-orange-500 disabled:bg-orange-700 disabled:cursor-wait rounded text-xs font-bold"
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

        <div className="flex-1 flex overflow-hidden no-print">
          <PageList
            pages={data.pages}
            activeId={activeId}
            onSelect={setActiveId}
            onAdd={addPage}
            onRemove={removePage}
            onMove={movePage}
          />
          <PageEditorPanel page={activePage} onChange={updatePage} />
          <PreviewPane doc={data} zoom={zoom} onZoomChange={setZoom} />
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
          {data.pages.map((p, i) => {
            const spec = getPageSpec(p.type);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const Preview = spec.Preview as any;
            const ctx: PdfDocCtx = { ...baseCtx, pageNumber: i + 1 };
            return (
              <PdfDocProvider key={p.id} value={ctx}>
                <Preview data={p} />
              </PdfDocProvider>
            );
          })}
        </div>
      </div>
    </EditingDocProvider>
  );
}
