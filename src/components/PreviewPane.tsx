import { Eye } from 'lucide-react';
import type { InstructionData, Page } from '../types/instruction';
import { getPageSpec } from '../pages/pageRegistry';
import { PdfDocProvider, type PdfDocCtx } from './PdfDocContext';

interface Props {
  doc: InstructionData;
  zoom: number;
  onZoomChange: (z: number) => void;
}

export function PreviewPane({ doc, zoom, onZoomChange }: Props) {
  const baseCtx: PdfDocCtx = {
    productName: doc.productName,
    brand: doc.brand,
    brandLogoUrl: doc.brandLogoUrl,
    websiteUrl: doc.websiteUrl,
    documentType: doc.documentType,
    brandTagline: doc.brandTagline,
    modelCodes: doc.modelCodes,
    coverCopyright: doc.coverCopyright,
    coverLanguage: doc.coverLanguage,
    productSubtitle:
      doc.modelCodes.length > 0
        ? doc.modelCodes.slice(0, 2).join('…') +
          (doc.modelCodes.length > 2 ? '…' + doc.modelCodes.at(-1) : '')
        : undefined,
    totalPages: doc.pages.length,
  };

  return (
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
            onChange={(e) => onZoomChange(parseFloat(e.target.value))}
            className="w-24 accent-orange-500"
          />
          <span className="text-[11px] text-slate-400 font-mono w-10">
            {Math.round(zoom * 100)}%
          </span>
        </div>
      </div>
      <div className="p-6 flex flex-col items-center gap-4">
        {doc.pages.map((p: Page, i) => {
          const spec = getPageSpec(p.type);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const Preview = spec.Preview as any;
          const ctx: PdfDocCtx = {
            ...baseCtx,
            pageNumber: i + 1,
          };
          return (
            <div key={p.id} style={{ zoom }}>
              <div style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
                <PdfDocProvider value={ctx}>
                  <Preview data={p} />
                </PdfDocProvider>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
