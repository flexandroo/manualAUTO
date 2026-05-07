import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { createPortal } from 'react-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FileDown, Save, Upload, Loader2, Undo2, Redo2, FileCode2, FileInput } from 'lucide-react';
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
import { useHistory } from './utils/useHistory';
import { TemplateMenu } from './components/TemplateMenu';
import { MarkdownImportModal } from './components/MarkdownImportModal';
import { parsePdfToPages } from './utils/pdfImport';

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
  const history = useHistory<InstructionData>(loadFromStorage() ?? initialData);
  const data = history.state;
  const setData = history.set;
  const [activeId, setActiveId] = useState<string | null>(data.pages[0]?.id ?? null);
  const [zoom, setZoom] = useState(0.65);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<{ done: number; total: number } | null>(
    null
  );
  const [mdImportOpen, setMdImportOpen] = useState(false);
  const [pdfImporting, setPdfImporting] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handleImportPdf = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (
      data.pages.length > 0 &&
      !confirm(
        `Імпорт із PDF додасть ${file.name} як нові сторінки в кінець документа. Продовжити?`
      )
    ) {
      return;
    }
    setPdfImporting(true);
    try {
      const newPages = await parsePdfToPages(file);
      if (newPages.length === 0) {
        alert('Не вдалось видобути текст з PDF');
        return;
      }
      setData((d) => ({ ...d, pages: [...d.pages, ...newPages] }), { coalesce: false });
      setActiveId(newPages[0]?.id ?? activeId);
    } catch (err) {
      alert('Помилка читання PDF: ' + (err as Error).message);
    } finally {
      setPdfImporting(false);
    }
  };

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
    setDownloadProgress({ done: 0, total: data.pages.length });
    try {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      // The render target lives off-screen at left: -99999px so html2canvas
      // can capture it but the user can't see it. Some browsers measure
      // off-screen elements as zero-size. Briefly move it onscreen but
      // hidden behind everything (z-index: -1 + visible: hidden); render;
      // then put it back.
      const el = printRef.current;
      const originalCss = el.style.cssText;
      el.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        z-index: -1;
        width: 210mm;
        background: white;
        pointer-events: none;
      `;
      // Two RAF ticks for layout / paint / font load to settle.
      await new Promise((r) => requestAnimationFrame(() => r(undefined)));
      await new Promise((r) => requestAnimationFrame(() => r(undefined)));

      // Wait for every <img> inside the print container to fully load,
      // including async-generated GhostImage data URLs. Without this the
      // canvas snapshot can fire while an image is still 0×0, producing
      // stretched/misshapen output.
      const allImgs = Array.from(el.querySelectorAll<HTMLImageElement>('img'));
      await Promise.all(
        allImgs.map(
          (img) =>
            new Promise<void>((resolve) => {
              if (img.complete && img.naturalWidth > 0) {
                resolve();
                return;
              }
              const done = () => {
                img.removeEventListener('load', done);
                img.removeEventListener('error', done);
                resolve();
              };
              img.addEventListener('load', done);
              img.addEventListener('error', done);
              // Safety: don't block PDF generation forever on a broken image
              setTimeout(done, 5000);
            })
        )
      );

      const pages = Array.from(el.querySelectorAll<HTMLElement>('.pdf-page'));
      if (pages.length === 0) {
        alert('Немає сторінок для експорту');
        return;
      }

      // A4 in mm
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = 210;
      const pageH = 297;
      setDownloadProgress({ done: 0, total: pages.length });

      for (let i = 0; i < pages.length; i++) {
        setDownloadProgress({ done: i, total: pages.length });
        // Yield to the browser so React can repaint the progress label
        // between pages — html2canvas blocks the main thread.
        await new Promise((r) => setTimeout(r, 0));
        const node = pages[i];
        const canvas = await html2canvas(node, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: null,
          width: node.offsetWidth,
          height: node.offsetHeight,
          onclone: (clonedDoc) => {
            // html2canvas's text raster shifts glyph baselines ~2 px
            // lower than the live preview. Compensate by translating
            // every direct child of .pdf-page up by 2 px in the clone
            // only. This generalises across all page types — Standard
            // (which has named .pdf-page-header/content/footer-band
            // children), Cover, and Warranty (which use bespoke
            // inline-styled containers).
            const style = clonedDoc.createElement('style');
            style.textContent = `
              .pdf-page > * {
                transform: translateY(-2px);
              }
            `;
            clonedDoc.head.appendChild(style);
          },
        });
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        if (i > 0) pdf.addPage('a4', 'portrait');
        pdf.addImage(imgData, 'JPEG', 0, 0, pageW, pageH);
      }

      // Restore the hidden positioning before save dialog closes the focus.
      el.style.cssText = originalCss;

      const filename = `${data.productName || 'instruction'}-${Date.now()}.pdf`.replace(
        /[\\/:*?"<>|]/g,
        '_'
      );
      pdf.save(filename);
    } finally {
      setDownloading(false);
      setDownloadProgress(null);
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
    coverCopyright: data.coverCopyright,
    coverLanguage: data.coverLanguage,
    productSubtitle:
      data.modelCodes.length > 0
        ? data.modelCodes.slice(0, 2).join('…') +
          (data.modelCodes.length > 2 ? '…' + data.modelCodes.at(-1) : '')
        : undefined,
    totalPages: data.pages.length,
  };

  return (
    <EditingDocProvider value={{ doc: data, setDoc: setData }}>
      <div className="h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden">
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
            <button
              onClick={history.undo}
              disabled={!history.canUndo}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed rounded text-xs font-medium"
              title="Скасувати (Ctrl+Z)"
            >
              <Undo2 size={14} />
            </button>
            <button
              onClick={history.redo}
              disabled={!history.canRedo}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed rounded text-xs font-medium"
              title="Повторити (Ctrl+Shift+Z)"
            >
              <Redo2 size={14} />
            </button>
            <div className="w-px h-6 bg-slate-800 mx-1" />
            <TemplateMenu
              currentDoc={data}
              onLoad={(d) => {
                setData(d, { coalesce: false });
                setActiveId(d.pages[0]?.id ?? null);
              }}
            />
            <button
              onClick={() => setMdImportOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs font-medium"
              title="Імпорт із Markdown"
            >
              <FileCode2 size={14} /> Markdown
            </button>
            <label
              className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs font-medium ${
                pdfImporting ? 'opacity-50 cursor-wait' : ''
              }`}
              title="Імпорт текстового вмісту з існуючого PDF"
            >
              {pdfImporting ? <Loader2 size={14} className="animate-spin" /> : <FileInput size={14} />}
              {pdfImporting ? 'Парсинг…' : 'Імпорт PDF'}
              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleImportPdf}
                disabled={pdfImporting}
                className="hidden"
              />
            </label>
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
                  <Loader2 size={14} className="animate-spin" />
                  {downloadProgress
                    ? `Сторінка ${Math.min(downloadProgress.done + 1, downloadProgress.total)}/${downloadProgress.total}`
                    : 'Підготовка…'}
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

        {mdImportOpen && (
          <MarkdownImportModal
            onClose={() => setMdImportOpen(false)}
            onImport={(newPages, mode) => {
              setData(
                (d) => ({
                  ...d,
                  pages: mode === 'replace' ? newPages : [...d.pages, ...newPages],
                }),
                { coalesce: false }
              );
              setActiveId(newPages[0]?.id ?? activeId);
            }}
          />
        )}
      </div>
      {/* Print container is portaled directly to <body> so it lives
          outside the App container and isn't affected by the
          h-screen / overflow-hidden constraints on the editor shell.
          Positioned far off-screen, no opacity tricks — html2canvas
          captures real rendered pixels. */}
      {createPortal(
        <div
          ref={printRef}
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            left: '-99999px',
            width: '210mm',
            pointerEvents: 'none',
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
        </div>,
        document.body
      )}
    </EditingDocProvider>
  );
}
