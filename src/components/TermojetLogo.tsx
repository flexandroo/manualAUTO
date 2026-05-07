import { useEffect, useState } from 'react';

// Brand mark used on Cover and Warranty when no custom brandLogoUrl is
// uploaded. The wordmark "TERMOJET" is pre-rendered to a <canvas> and
// shown as an <img>, because html2canvas's text renderer ignores
// -webkit-text-stroke and renders multi-stop text-shadow unreliably,
// which left the wordmark looking thin/transparent over the orange
// band. Native canvas glyph painting uses the actually-loaded font
// weight, and html2canvas captures <img> elements pixel-perfect.

interface Props {
  height?: number;
  color?: string;
}

export function TermojetLogo({ height = 70, color = '#F25D2A' }: Props) {
  const arrowSize = Math.round(height * 0.22);
  const wordSize = Math.round(height * 0.55);
  // Keep the rendered <img> the same visual height as the original
  // text glyphs would have been, so existing layouts don't shift.
  const imgHeight = Math.round(wordSize * 1.15);
  const wordImg = useTermojetWordImage(wordSize, color);

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        lineHeight: 1,
        color,
        fontFamily: '"Montserrat", "Arial Black", Impact, sans-serif',
      }}
      aria-label="TERMOJET"
    >
      <div
        style={{
          fontSize: `${arrowSize}px`,
          letterSpacing: `${arrowSize * 0.4}px`,
          paddingLeft: `${arrowSize * 0.4}px`,
          fontWeight: 700,
          marginBottom: `${arrowSize * 0.1}px`,
        }}
      >
        ▲▲▲
      </div>
      {wordImg ? (
        <img
          src={wordImg}
          alt="TERMOJET"
          style={{ height: `${imgHeight}px`, width: 'auto', display: 'block' }}
        />
      ) : (
        // Until the canvas-rendered word is ready (sub-frame on first
        // paint) fall back to plain HTML text so layout has the right
        // size from the start.
        <div
          style={{
            fontSize: `${wordSize}px`,
            fontWeight: 900,
            letterSpacing: '0.04em',
            height: `${imgHeight}px`,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          TERMOJET
        </div>
      )}
    </div>
  );
}

function useTermojetWordImage(wordSize: number, color: string) {
  const [src, setSrc] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    const render = async () => {
      // Wait for Montserrat to actually load before rasterising;
      // otherwise the canvas falls back to system sans-serif and the
      // wordmark looks generic.
      try {
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }
      } catch {
        /* ignore — fall through to canvas render anyway */
      }
      if (cancelled) return;

      const dpr = 3; // oversample so the captured PDF stays crisp
      const fontPx = wordSize * dpr;
      const fontStr = `900 ${fontPx}px "Montserrat", "Arial Black", Impact, sans-serif`;
      const letterSpacingPx = wordSize * 0.04 * dpr;

      const measureCanvas = document.createElement('canvas');
      const measureCtx = measureCanvas.getContext('2d');
      if (!measureCtx) return;
      measureCtx.font = fontStr;
      // ctx.letterSpacing is supported in Chromium-based browsers
      // (which is the user's target). measureText accounts for it.
      try {
        (measureCtx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing =
          `${letterSpacingPx}px`;
      } catch {
        /* older browsers — ignore */
      }
      const metrics = measureCtx.measureText('TERMOJET');
      const ascent = metrics.actualBoundingBoxAscent || fontPx * 0.8;
      const descent = metrics.actualBoundingBoxDescent || fontPx * 0.2;
      const padX = Math.ceil(fontPx * 0.08);
      const padY = Math.ceil(fontPx * 0.08);
      const w = Math.ceil(metrics.width + padX * 2);
      const h = Math.ceil(ascent + descent + padY * 2);

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.font = fontStr;
      try {
        (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing =
          `${letterSpacingPx}px`;
      } catch {
        /* ignore */
      }
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      // Stroke first then fill so the visible glyph is a fill on top
      // of a same-colour stroke — effectively thickens the glyph by
      // the stroke width regardless of the loaded font weight.
      ctx.lineWidth = Math.max(1, fontPx * 0.06);
      ctx.lineJoin = 'round';
      ctx.miterLimit = 2;
      ctx.strokeText('TERMOJET', padX, padY + ascent);
      ctx.fillText('TERMOJET', padX, padY + ascent);

      if (!cancelled) setSrc(canvas.toDataURL('image/png'));
    };
    render();
    return () => {
      cancelled = true;
    };
  }, [wordSize, color]);

  return src;
}
