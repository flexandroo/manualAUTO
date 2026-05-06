import { useEffect, useState, type CSSProperties } from 'react';

interface Props {
  src: string;
  alt?: string;
  style?: CSSProperties;
  /** 0..1 final alpha multiplier on every pixel. Default 0.5 — matches the
   *  faded "ghost" look without disappearing on dark navy.   */
  alpha?: number;
}

// Applies an "invert + reduce alpha" effect to the source image once via
// a canvas pixel pass and renders the resulting PNG with no CSS filters
// or blend modes. The output looks the same in browser preview and in
// html2canvas-captured PDF, unlike the original mix-blend-mode approach.
export function GhostImage({ src, alt, style, alpha = 0.5 }: Props) {
  const [ghosted, setGhosted] = useState<string | undefined>();

  useEffect(() => {
    if (!src) {
      setGhosted(undefined);
      return;
    }
    let cancelled = false;
    ghostify(src, alpha)
      .then((url) => {
        if (!cancelled) setGhosted(url);
      })
      .catch(() => {
        if (!cancelled) setGhosted(undefined);
      });
    return () => {
      cancelled = true;
    };
  }, [src, alpha]);

  // While processing, fall back to the original src so the layout doesn't
  // pop. The ghosted version is just visually different.
  return <img src={ghosted ?? src} alt={alt ?? ''} style={style} />;
}

function ghostify(src: string, alpha: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('no canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const px = data.data;
      for (let i = 0; i < px.length; i += 4) {
        // Invert RGB so dark products become light silhouettes
        px[i] = 255 - px[i];
        px[i + 1] = 255 - px[i + 1];
        px[i + 2] = 255 - px[i + 2];
        // Soften alpha
        px[i + 3] = Math.round(px[i + 3] * alpha);
      }
      ctx.putImageData(data, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}
