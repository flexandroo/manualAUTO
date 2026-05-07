import { useRef, useState, type ChangeEvent, type ClipboardEvent, type DragEvent } from 'react';
import { ImagePlus, X, Upload, Eraser, Loader2 } from 'lucide-react';
import { BackgroundRemoverModal } from '../BackgroundRemoverModal';
import { compressImage } from '../../utils/imageCompress';

interface Props {
  value: string | undefined;
  onChange: (dataUrl: string | undefined) => void;
  label?: string;
  hint?: string;
  aspectRatio?: string; // e.g. "4/3", "16/9", "1/1"
}

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB safety cap

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function ImageUploader({ value, onChange, label, hint, aspectRatio = '4/3' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hovering, setHovering] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [bgModalOpen, setBgModalOpen] = useState(false);

  const accept = async (file: File | null | undefined) => {
    setError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Це не зображення');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(`Файл завеликий (${Math.round(file.size / 1024 / 1024)} МБ, максимум 8 МБ)`);
      return;
    }
    setBusy(true);
    try {
      const raw = await fileToDataUrl(file);
      // Downscale + re-encode so we don't blow the localStorage quota
      // with full-resolution camera photos.
      const compressed = await compressImage(raw);
      onChange(compressed);
    } catch {
      setError('Помилка зчитування файлу');
    } finally {
      setBusy(false);
    }
  };

  const onFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    accept(e.target.files?.[0]);
    e.target.value = '';
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setHovering(false);
    accept(e.dataTransfer.files?.[0]);
  };

  const onPaste = (e: ClipboardEvent<HTMLDivElement>) => {
    const item = Array.from(e.clipboardData.items).find((it) => it.type.startsWith('image/'));
    if (item) {
      e.preventDefault();
      accept(item.getAsFile());
    }
  };

  return (
    <div className="mb-5">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
          {label}
        </label>
      )}
      <div
        tabIndex={0}
        onPaste={onPaste}
        onDragOver={(e) => {
          e.preventDefault();
          setHovering(true);
        }}
        onDragLeave={() => setHovering(false)}
        onDrop={onDrop}
        className={`relative rounded border-2 border-dashed transition-colors outline-none focus:border-orange-500 ${
          hovering
            ? 'border-orange-500 bg-orange-500/5'
            : value
            ? 'border-slate-700'
            : 'border-slate-700 hover:border-slate-600'
        }`}
        style={{ aspectRatio }}
      >
        {value ? (
          <>
            <img
              src={value}
              alt=""
              className="w-full h-full object-contain rounded"
              style={{ background: 'white' }}
            />
            <button
              onClick={() => onChange(undefined)}
              className="absolute top-2 right-2 bg-slate-900/90 hover:bg-red-700 text-white rounded p-1.5 shadow-lg"
              title="Видалити зображення"
            >
              <X size={14} />
            </button>
            <button
              onClick={() => setBgModalOpen(true)}
              className="absolute bottom-2 left-2 bg-slate-900/90 hover:bg-slate-700 text-white rounded px-2 py-1 text-[11px] flex items-center gap-1.5 shadow-lg"
              title="Прибрати фон"
            >
              <Eraser size={12} /> Прибрати фон
            </button>
            <button
              onClick={() => inputRef.current?.click()}
              className="absolute bottom-2 right-2 bg-slate-900/90 hover:bg-slate-700 text-white rounded px-2 py-1 text-[11px] flex items-center gap-1.5 shadow-lg"
            >
              <Upload size={12} /> Замінити
            </button>
          </>
        ) : (
          <button
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-slate-300 disabled:cursor-wait"
          >
            {busy ? (
              <>
                <Loader2 size={28} className="animate-spin" />
                <div className="text-xs font-medium">Стиснення…</div>
              </>
            ) : (
              <>
                <ImagePlus size={32} />
                <div className="text-xs font-medium">Завантажити зображення</div>
                <div className="text-[10px] text-slate-600 text-center px-4">
                  Клік, перетягніть файл сюди<br />
                  або вставте з буфера (Ctrl+V)
                </div>
              </>
            )}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onFileInput}
        className="hidden"
      />
      {error && <div className="text-[11px] text-red-400 mt-1">{error}</div>}
      {!error && hint && <div className="text-[11px] text-slate-500 mt-1">{hint}</div>}

      {bgModalOpen && value && (
        <BackgroundRemoverModal
          src={value}
          onClose={() => setBgModalOpen(false)}
          onSave={(newSrc) => {
            onChange(newSrc);
            setBgModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
