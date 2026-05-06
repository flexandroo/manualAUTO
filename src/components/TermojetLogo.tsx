// HTML/CSS-based brand mark used on Cover and Warranty when no custom
// brandLogoUrl is uploaded. Originally an inline SVG with <text>, but
// html2canvas renders SVG <text> unreliably (faded glyphs, missing
// fonts) — switching to plain styled HTML guarantees the captured PDF
// looks identical to live preview.

interface Props {
  height?: number;
  color?: string;
}

export function TermojetLogo({ height = 70, color = '#F25D2A' }: Props) {
  // Geometric scaling — the logo is roughly 3:1 wide:tall, with the
  // arrow row at ~22 % of total height and the wordmark at ~50 %.
  const arrowSize = Math.round(height * 0.22);
  const wordSize = Math.round(height * 0.55);
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
        }}
      >
        ▲▲▲
      </div>
      <div
        style={{
          fontSize: `${wordSize}px`,
          fontWeight: 900,
          letterSpacing: '0.04em',
          // Slight optical kerning matching the reference logo
        }}
      >
        TERMOJET
      </div>
    </div>
  );
}
