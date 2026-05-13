import { useEffect, useRef, useState } from 'react';
import { Eye, AlertTriangle } from 'lucide-react';
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
    <section className="flex-1 bg-stone-100 overflow-auto relative">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-stone-100 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye size={14} className="text-orange-500" />
          <span className="text-xs font-bold uppercase tracking-wider">Live preview</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-stone-500">Zoom</span>
          <input
            type="range"
            min="0.4"
            max="1"
            step="0.05"
            value={zoom}
            onChange={(e) => onZoomChange(parseFloat(e.target.value))}
            className="w-24 accent-orange-500"
          />
          <span className="text-[11px] text-stone-500 font-mono w-10">
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
            <PageThumbnail key={p.id} zoom={zoom} pageIndex={i}>
              <PdfDocProvider value={ctx}>
                <Preview data={p} />
              </PdfDocProvider>
            </PageThumbnail>
          );
        })}
      </div>
    </section>
  );
}

interface ThumbnailProps {
  zoom: number;
  pageIndex: number;
  children: React.ReactNode;
}

function PageThumbnail({ zoom, pageIndex, children }: ThumbnailProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const page = wrapper.querySelector<HTMLElement>('.pdf-page');
    if (!page) return;
    const check = () => {
      // A4 height is 297mm. Page's scrollHeight reports actual content
      // height; if it exceeds the page height, content is being clipped
      // by overflow:hidden on .pdf-page.
      const overflowing = page.scrollHeight > page.clientHeight + 1;
      setOverflow(overflowing);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(page);
    // Children content edits don't always trigger ResizeObserver if
    // total height stays same — observe subtree mutations too.
    const mo = new MutationObserver(check);
    mo.observe(page, { childList: true, subtree: true, characterData: true });
    return () => {
      ro.disconnect();
      mo.disconnect();
    };
  }, []);

  return (
    <div className="relative" style={{ zoom }}>
      <div
        ref={wrapperRef}
        style={{
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          outline: overflow ? '3px solid #ef4444' : 'none',
          outlineOffset: '-3px',
        }}
      >
        {children}
      </div>
      {overflow && (
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: '#ef4444',
            color: 'white',
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            // Counter-zoom so the badge stays readable at every zoom
            // level (the parent element scales everything via CSS zoom).
            zoom: 1 / Math.max(zoom, 0.01),
          }}
          title={`Сторінка ${pageIndex + 1} переповнена — частина контенту обрізається в PDF`}
        >
          <AlertTriangle size={12} />
          Переповнення
        </div>
      )}
    </div>
  );
}
