import { Eye } from 'lucide-react';
import type { Block } from '../types/instruction';
import { getBlockSpec } from '../blocks/registry';

interface Props {
  blocks: Block[];
  zoom: number;
  onZoomChange: (z: number) => void;
}

export function PreviewPane({ blocks, zoom, onZoomChange }: Props) {
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
        {blocks.map((b) => {
          const spec = getBlockSpec(b.type);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const Preview = spec.Preview as any;
          // CSS `zoom` (vs transform: scale) actually changes the layout box
          // size, so the wrapper takes only the scaled height — no leftover
          // A4-shaped empty space when blocks are short. Supported in
          // Chromium-based browsers and Safari.
          return (
            <div
              key={b.id}
              style={{
                zoom,
              }}
            >
              <div style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
                <Preview data={b} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
