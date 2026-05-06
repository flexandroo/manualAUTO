import { Eye } from 'lucide-react';
import type { Block, CoverBlock } from '../types/instruction';
import { getBlockSpec } from '../blocks/registry';
import { PdfDocProvider, type PdfDocCtx } from './PdfDocContext';

interface Props {
  blocks: Block[];
  zoom: number;
  onZoomChange: (z: number) => void;
}

function deriveDocContext(blocks: Block[]): PdfDocCtx {
  const cover = blocks.find((b) => b.type === 'cover') as CoverBlock | undefined;
  return {
    productName: cover?.productName,
    productSubtitle:
      cover && cover.modelCodes && cover.modelCodes.length > 0
        ? cover.modelCodes.slice(0, 2).join('…') +
          (cover.modelCodes.length > 2 ? '…' + cover.modelCodes.at(-1) : '')
        : undefined,
    brand: cover?.brand,
    brandLogoUrl: cover?.brandLogoUrl,
    websiteUrl: cover?.websiteUrl,
    totalPages: blocks.length,
  };
}

export function PreviewPane({ blocks, zoom, onZoomChange }: Props) {
  const baseCtx = deriveDocContext(blocks);

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
      <div className="p-6 flex flex-col items-center gap-3">
        {blocks.map((b, i) => {
          const spec = getBlockSpec(b.type);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const Preview = spec.Preview as any;
          const ctx: PdfDocCtx = { ...baseCtx, pageNumber: i + 1 };
          return (
            <div
              key={b.id}
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'top center',
                transition: 'transform 0.2s',
                height: `calc(297mm * ${zoom})`,
              }}
            >
              <div style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
                <PdfDocProvider value={ctx}>
                  <Preview data={b} />
                </PdfDocProvider>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
