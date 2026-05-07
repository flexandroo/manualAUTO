// HTML/CSS-only brand mark used on Cover and Warranty when no custom
// brandLogoUrl is uploaded. Bold weight is faked via 8-direction
// text-shadow (which html2canvas DOES support) rather than
// -webkit-text-stroke (which html2canvas silently ignores). Also adds
// "Arial Black"/Impact as a fallback so we still get a heavy glyph
// when Montserrat 900 fails to load inside the cloned document.

interface Props {
  height?: number;
  color?: string;
}

export function TermojetLogo({ height = 70, color = '#F25D2A' }: Props) {
  const arrowSize = Math.round(height * 0.22);
  const wordSize = Math.round(height * 0.55);
  // ~6% of glyph height, capped to a sensible minimum at small sizes.
  const sw = Math.max(0.5, wordSize * 0.06);
  const fakeBoldShadow = [
    `${sw}px 0 0 currentColor`,
    `-${sw}px 0 0 currentColor`,
    `0 ${sw}px 0 currentColor`,
    `0 -${sw}px 0 currentColor`,
    `${sw}px ${sw}px 0 currentColor`,
    `-${sw}px -${sw}px 0 currentColor`,
    `${sw}px -${sw}px 0 currentColor`,
    `-${sw}px ${sw}px 0 currentColor`,
  ].join(', ');

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        lineHeight: 1,
        color,
        fontFamily:
          '"Montserrat", "Arial Black", "Helvetica Neue", Impact, sans-serif',
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
      <div
        style={{
          fontSize: `${wordSize}px`,
          fontWeight: 900,
          letterSpacing: '0.04em',
          textShadow: fakeBoldShadow,
        }}
      >
        TERMOJET
      </div>
    </div>
  );
}
