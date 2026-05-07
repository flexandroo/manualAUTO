// Brand mark used on Cover, Warranty and Standard page headers when no
// custom brandLogoUrl is uploaded. Renders inline SVG so html2canvas
// captures the wordmark via its SVG pipeline (browser SVG -> canvas via
// drawImage), which uses the browser's native glyph painter — more
// reliable than html2canvas's HTML text renderer that drops
// -webkit-text-stroke and renders multi-stop text-shadow inconsistently.
//
// Boldness is guaranteed by an explicit white stroke on the <text> in
// addition to the fill, so even if Montserrat 900 fails to load in the
// captured SVG context the wordmark still prints heavy and crisp.

interface Props {
  height?: number;
  color?: string;
}

export function TermojetLogo({ height = 70, color = '#F25D2A' }: Props) {
  // Tuned so the SVG viewBox matches the visual proportions of the
  // original Montserrat 900 wordmark + 3 arrows.
  const viewW = 600;
  const viewH = 200;
  const strokeW = 4; // ~4% of font-size; thickens glyph without distorting

  return (
    <svg
      viewBox={`0 0 ${viewW} ${viewH}`}
      style={{ height, width: 'auto', display: 'block' }}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="TERMOJET"
    >
      {/* 3 upward arrows */}
      <g fill={color}>
        <polygon points="195,40 215,5 235,40 225,40 225,80 205,80 205,40" />
        <polygon points="285,40 305,5 325,40 315,40 315,80 295,80 295,40" />
        <polygon points="375,40 395,5 415,40 405,40 405,80 385,80 385,40" />
      </g>
      {/* Wordmark — explicit fill+stroke so the glyph is heavy even when
          the captured SVG falls back to a thinner font weight. */}
      <text
        x="300"
        y="180"
        textAnchor="middle"
        fontSize="100"
        fontFamily='"Montserrat", "Arial Black", Impact, sans-serif'
        fontWeight="900"
        letterSpacing="-2"
        fill={color}
        stroke={color}
        strokeWidth={strokeW}
        paintOrder="stroke"
        strokeLinejoin="round"
      >
        TERMOJET
      </text>
    </svg>
  );
}
