// HTML/CSS-based brand mark used on Cover and Warranty when no custom
// brandLogoUrl is uploaded. Uses webkit-text-stroke as a fallback to
// guarantee a bold-looking wordmark even when html2canvas's clone
// doesn't load Montserrat at 900 weight (a common cause of the
// faded-TERMOJET-on-orange-band PDF artifact).

interface Props {
  height?: number;
  color?: string;
}

export function TermojetLogo({ height = 70, color = '#F25D2A' }: Props) {
  const arrowSize = Math.round(height * 0.22);
  const wordSize = Math.round(height * 0.55);
  // Stroke width scales with text size, ~7 % of glyph height. With
  // currentColor, the stroke matches the fill so it just thickens
  // the visible glyph rather than producing an outline.
  const strokeWidth = Math.max(0.4, wordSize * 0.07);
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        lineHeight: 1,
        color,
        fontFamily: 'Montserrat, sans-serif',
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
          // Triangles are reliably bold without help; stroke would
          // make them too chunky.
        }}
      >
        ▲▲▲
      </div>
      <div
        style={{
          fontSize: `${wordSize}px`,
          fontWeight: 900,
          letterSpacing: '0.04em',
          // Belt-and-braces "make it bold" — even when Montserrat 900
          // fails to load in the html2canvas clone and the browser
          // falls back to regular weight, the stroke keeps the
          // wordmark visually heavy.
          WebkitTextStroke: `${strokeWidth}px currentColor`,
          // textShadow as a second layer in case some renderers
          // ignore -webkit-text-stroke.
          textShadow: `0 0 ${strokeWidth / 2}px currentColor`,
          // paint-order ensures the stroke goes around the fill
          // rather than overlapping it (looks cleaner in canvas
          // rasterisation).
          paintOrder: 'stroke fill',
        }}
      >
        TERMOJET
      </div>
    </div>
  );
}
