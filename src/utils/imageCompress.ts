// Resize an image data URL so its longest side fits within `maxSide`,
// then re-encode as JPEG at the given quality. Used on upload to keep
// localStorage usage bounded — the user's source photos are typically
// 4000+ px and ~5 MB, which would blow past the 5 MB localStorage quota
// after just one or two uploads.
//
// Transparent inputs (PNGs with cut-outs from the background remover)
// are kept as PNG so the alpha channel is preserved.

interface CompressOptions {
  maxSide?: number;
  quality?: number;
}

export async function compressImage(
  src: string,
  { maxSide = 2000, quality = 0.85 }: CompressOptions = {}
): Promise<string> {
  const img = await loadImage(src);
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const longest = Math.max(w, h);
  const scale = longest > maxSide ? maxSide / longest : 1;
  const targetW = Math.round(w * scale);
  const targetH = Math.round(h * scale);

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) return src;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, targetW, targetH);

  const hasAlpha = await detectAlpha(img, ctx, targetW, targetH);
  const out = hasAlpha
    ? canvas.toDataURL('image/png')
    : canvas.toDataURL('image/jpeg', quality);

  // If compression actually made the file larger (rare — e.g. a tiny PNG
  // re-encoded as base64 JPEG), keep the original.
  return out.length < src.length ? out : src;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function detectAlpha(
  img: HTMLImageElement,
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number
): Promise<boolean> {
  // Quick mime sniff — JPEGs cannot have alpha.
  if (img.src.startsWith('data:image/jpeg')) return false;
  // Sample the corners + center; if any pixel has alpha < 255, treat as
  // transparent. Cheap heuristic, avoids scanning every pixel.
  const points = [
    [0, 0],
    [w - 1, 0],
    [0, h - 1],
    [w - 1, h - 1],
    [Math.floor(w / 2), Math.floor(h / 2)],
  ];
  for (const [x, y] of points) {
    const d = ctx.getImageData(x, y, 1, 1).data;
    if (d[3] < 255) return true;
  }
  return false;
}
