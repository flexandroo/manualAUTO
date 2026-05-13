import { useEffect, useRef, useState } from 'react';
import { X, Check, Pipette } from 'lucide-react';

interface Props {
  src: string;
  onClose: () => void;
  onSave: (newDataUrl: string) => void;
}

// Simple chroma-key style background removal. User clicks a pixel on the
// image to pick the colour to remove; all pixels within `tolerance` colour
// distance become transparent. A soft edge band makes the result less
// blocky. Live preview updates as the user clicks / drags the slider.
export function BackgroundRemoverModal({ src, onClose, onSave }: Props) {
  const [tolerance, setTolerance] = useState(30);
  const [pickedColor, setPickedColor] = useState<[number, number, number] | null>(null);
  const [resultUrl, setResultUrl] = useState<string>(src);
  const [busy, setBusy] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!pickedColor) {
      setResultUrl(src);
      return;
    }
    let cancelled = false;
    setBusy(true);
    removeColor(src, pickedColor, tolerance)
      .then((url) => {
        if (!cancelled) setResultUrl(url);
      })
      .finally(() => {
        if (!cancelled) setBusy(false);
      });
    return () => {
      cancelled = true;
    };
  }, [src, pickedColor, tolerance]);

  const handlePick = (e: React.MouseEvent<HTMLImageElement>) => {
    const img = imgRef.current;
    if (!img) return;
    const rect = img.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * img.naturalWidth;
    const y = ((e.clientY - rect.top) / rect.height) * img.naturalHeight;
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(Math.max(0, Math.floor(x)), Math.max(0, Math.floor(y)), 1, 1).data;
    setPickedColor([data[0], data[1], data[2]]);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 no-print">
      <div className="bg-white border border-stone-200 rounded-lg max-w-3xl w-full p-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold">Прибрати фон зображення</h3>
            <p className="text-xs text-stone-500 mt-1">
              Клацніть на колір фону який хочете прибрати. Працює найкраще зі суцільним фоном.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-white"
            title="Закрити"
          >
            <X size={18} />
          </button>
        </div>

        <div
          className="relative bg-no-repeat rounded mb-4 overflow-hidden"
          style={{
            // Checkerboard so transparency is obvious
            backgroundImage:
              'linear-gradient(45deg, #475569 25%, transparent 25%), linear-gradient(-45deg, #475569 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #475569 75%), linear-gradient(-45deg, transparent 75%, #475569 75%)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0',
            backgroundColor: '#334155',
          }}
        >
          <img
            ref={imgRef}
            src={resultUrl}
            alt=""
            onClick={handlePick}
            crossOrigin="anonymous"
            style={{
              display: 'block',
              maxWidth: '100%',
              maxHeight: '50vh',
              margin: '0 auto',
              cursor: 'crosshair',
              userSelect: 'none',
            }}
          />
          {!pickedColor && (
            <div className="absolute top-2 left-2 bg-orange-600/90 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
              <Pipette size={12} /> Клацніть на фон
            </div>
          )}
          {busy && (
            <div className="absolute top-2 right-2 bg-white/90 text-white text-xs px-2 py-1 rounded">
              Обробка...
            </div>
          )}
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Толерантність ({tolerance})
            </label>
            {pickedColor && (
              <div className="flex items-center gap-2 text-[11px] text-stone-500">
                Колір:
                <span
                  className="w-4 h-4 rounded border border-stone-300"
                  style={{
                    background: `rgb(${pickedColor.join(',')})`,
                  }}
                />
                <button
                  onClick={() => setPickedColor(null)}
                  className="text-stone-400 hover:text-orange-400 underline ml-2"
                >
                  скинути
                </button>
              </div>
            )}
          </div>
          <input
            type="range"
            min={5}
            max={150}
            value={tolerance}
            onChange={(e) => setTolerance(parseInt(e.target.value, 10))}
            className="w-full accent-orange-500"
          />
          <div className="text-[11px] text-stone-400 mt-1">
            Менше — точніше, більше — захоплює більший діапазон близьких кольорів.
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded text-sm"
          >
            Скасувати
          </button>
          <button
            onClick={() => onSave(resultUrl)}
            disabled={!pickedColor || busy}
            className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-500 disabled:bg-orange-700 disabled:cursor-not-allowed rounded text-sm font-bold flex items-center justify-center gap-2"
          >
            <Check size={14} /> Застосувати
          </button>
        </div>
      </div>
    </div>
  );
}

function removeColor(
  src: string,
  color: [number, number, number],
  tolerance: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('no ctx'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const px = imgData.data;
      for (let i = 0; i < px.length; i += 4) {
        const dr = px[i] - color[0];
        const dg = px[i + 1] - color[1];
        const db = px[i + 2] - color[2];
        const dist = Math.sqrt(dr * dr + dg * dg + db * db);
        if (dist < tolerance) {
          px[i + 3] = 0;
        } else if (dist < tolerance * 2) {
          // Soft edge: linearly fade alpha across the next half-tolerance
          // band so chroma-key edges aren't pixel-perfect blocks.
          const t = (dist - tolerance) / tolerance;
          px[i + 3] = Math.round(px[i + 3] * t);
        }
      }
      ctx.putImageData(imgData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}
