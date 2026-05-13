import { useState } from 'react';
import { Tag } from 'lucide-react';
import type { StickerData } from './types';
import { makeInitialSticker } from './initialSticker';
import { StickerEditor } from './StickerEditor';
import { StickerPreview } from './StickerPreview';

// Top-level container for the stickers tab. Lives alongside the manuals
// editor; the App shell switches between them via tab navigation.
//
// For now it holds a single in-memory sticker (the FERRO ZMVA230 sample)
// and re-renders the preview live as the form changes. Storage and PDF
// export land in the next iteration.
export function StickersTab() {
  const [sticker, setSticker] = useState<StickerData>(makeInitialSticker());
  const [zoom, setZoom] = useState(1.5);

  return (
    <div className="flex-1 flex overflow-hidden no-print">
      <aside className="w-[420px] bg-white border-r border-stone-100 flex flex-col">
        <StickerEditor data={sticker} onChange={setSticker} />
      </aside>
      <section className="flex-1 bg-stone-100 overflow-auto relative">
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-stone-100 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag size={14} className="text-orange-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Preview</span>
            <span className="text-[11px] text-stone-500 ml-2">
              {sticker.widthMm}×{sticker.heightMm} мм
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-stone-500">Zoom</span>
            <input
              type="range"
              min="0.6"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-24 accent-orange-500"
            />
            <span className="text-[11px] text-stone-500 font-mono w-12">
              {Math.round(zoom * 100)}%
            </span>
          </div>
        </div>
        <div className="p-8 flex justify-center">
          <div style={{ zoom, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
            <StickerPreview data={sticker} />
          </div>
        </div>
      </section>
    </div>
  );
}
