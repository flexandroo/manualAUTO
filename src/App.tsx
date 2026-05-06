import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import html2pdf from 'html2pdf.js';
import { FileDown, Save, Upload, Loader2, FileUp, AlertCircle } from 'lucide-react';
import './styles/pdf-print.css';
import type { Block, BlockType, InstructionData } from './types/instruction';
import { initialData } from './data/initialData';
import { BLOCK_REGISTRY, getBlockSpec } from './blocks/registry';
import { BlockList } from './components/BlockList';
import { BlockEditorPanel } from './components/BlockEditorPanel';
import { PreviewPane } from './components/PreviewPane';
import { ImportReport } from './components/ImportReport';
import { parsePdfToBlocks, type PdfParseResult } from './parsers/parsePdf';

const STORAGE_KEY = 'manualAUTO:document:v1';

function migrateBlock(block: Block): Block {
  if (block.type === 'cover') {
    const c = block as Block & {
      brand?: string;
      modelCodes?: string[];
      productImages?: string[];
      imageUrl?: string;
      subtitle?: string;
      tagline?: string;
      websiteUrl?: string;
      documentType?: string;
    };
    return {
      ...block,
      type: 'cover',
      brand: c.brand ?? 'TERMOJET',
      modelCodes: Array.isArray(c.modelCodes) ? c.modelCodes : [],
      productImages: Array.isArray(c.productImages)
        ? c.productImages
        : c.imageUrl
        ? [c.imageUrl]
        : [],
      subtitle: c.subtitle ?? 'Інструкція з монтажу та експлуатації',
      tagline: c.tagline ?? 'Швидко ● Надійно ● Ефективно',
      websiteUrl: c.websiteUrl ?? 'WWW.TERMOJET.COM.UA',
      documentType: c.documentType ?? 'ТЕХНІЧНИЙ СЕРТИФІКАТ',
    } as Block;
  }
  return block;
}

function loadFromStorage(): InstructionData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as InstructionData;
    if (!parsed || !Array.isArray(parsed.blocks)) return null;
    return { ...parsed, blocks: parsed.blocks.map(migrateBlock) };
  } catch {
    return null;
  }
}

export default function App() {
  const [data, setData] = useState<InstructionData>(() => loadFromStorage() ?? initialData);
  const [activeId, setActiveId] = useState<string | null>(data.blocks[0]?.id ?? null);
  const [zoom, setZoom] = useState(0.65);
  const [downloading, setDownloading] = useState(false);
  const [pdfParsing, setPdfParsing] = useState(false);
  const [pdfError, setPdfError] = useState('');
  const [pendingImport, setPendingImport] = useState<PdfParseResult | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  // Local autosave.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // quota exceeded: ignore
    }
  }, [data]);

  const activeBlock = useMemo(
    () => data.blocks.find((b) => b.id === activeId) ?? null,
    [data.blocks, activeId]
  );

  const updateBlock = (next: Block) => {
    setData((d) => ({
      ...d,
      blocks: d.blocks.map((b) => (b.id === next.id ? next : b)),
      productName: next.type === 'cover' ? next.productName : d.productName,
    }));
  };

  const addBlock = (type: BlockType) => {
    const created = BLOCK_REGISTRY[type].createNew();
    setData((d) => ({ ...d, blocks: [...d.blocks, created] }));
    setActiveId(created.id);
  };

  const removeBlock = (id: string) => {
    setData((d) => ({ ...d, blocks: d.blocks.filter((b) => b.id !== id) }));
    setActiveId((aid) => (aid === id ? data.blocks[0]?.id ?? null : aid));
  };

  const moveBlock = (id: string, dir: -1 | 1) => {
    setData((d) => {
      const idx = d.blocks.findIndex((b) => b.id === id);
      if (idx === -1) return d;
      const target = idx + dir;
      if (target < 0 || target >= d.blocks.length) return d;
      const next = [...d.blocks];
      [next[idx], next[target]] = [next[target], next[idx]];
      return { ...d, blocks: next };
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

  const handleImportPdf = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setPdfParsing(true);
    setPdfError('');
    try {
      const result = await parsePdfToBlocks(file);
      setPendingImport(result);
    } catch (err) {
      console.error(err);
      setPdfError(err instanceof Error ? err.message : 'Не вдалося розпарсити PDF');
    } finally {
      setPdfParsing(false);
    }
  };

  const applyPdfImport = () => {
    if (!pendingImport) return;
    const newCover = pendingImport.blocks.find((b) => b.type === 'cover');
    setData({
      productName:
        newCover && newCover.type === 'cover' ? newCover.productName : data.productName,
      blocks: pendingImport.blocks,
    });
    setActiveId(pendingImport.blocks[0]?.id ?? null);
    setPendingImport(null);
  };

  const handleImportJson = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string) as InstructionData;
        setData(parsed);
        setActiveId(parsed.blocks[0]?.id ?? null);
      } catch {
        alert('Помилка зчитування файлу');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="no-print bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center font-black text-sm">
            M
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight">manualAUTO</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">
              Генератор інструкцій · v0.4
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label
            className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              pdfParsing
                ? 'bg-orange-600/30 text-orange-300 cursor-wait'
                : 'bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border border-orange-600/40'
            }`}
            title="Витягне з PDF титульну, основні положення, інструкцію з монтажу і гарантію"
          >
            {pdfParsing ? (
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
              disabled={pdfParsing}
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

      {pdfError && (
        <div className="no-print bg-red-950/50 border-b border-red-800 px-6 py-2 text-sm text-red-300 flex items-center gap-2">
          <AlertCircle size={16} /> Помилка PDF: {pdfError}
          <button onClick={() => setPdfError('')} className="ml-auto text-xs underline">
            ×
          </button>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden no-print">
        <BlockList
          blocks={data.blocks}
          activeId={activeId}
          onSelect={setActiveId}
          onAdd={addBlock}
          onRemove={removeBlock}
          onMove={moveBlock}
        />
        <BlockEditorPanel block={activeBlock} onChange={updateBlock} />
        <PreviewPane blocks={data.blocks} zoom={zoom} onZoomChange={setZoom} />
      </div>

      {pendingImport && (
        <ImportReport
          report={pendingImport.report}
          onClose={() => setPendingImport(null)}
          onApply={applyPdfImport}
        />
      )}

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
        {data.blocks.map((b) => {
          const spec = getBlockSpec(b.type);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const Preview = spec.Preview as any;
          return <Preview key={b.id} data={b} />;
        })}
      </div>
    </div>
  );
}
