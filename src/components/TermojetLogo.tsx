// Default Termojet brand mark used on Cover when user hasn't uploaded a custom
// logo. Approximates the official TERMOJET wordmark + 3 upward arrows.
// For pixel-accurate logo, user should upload their PNG/SVG via the Cover
// editor's "Логотип бренду" field.

interface Props {
  height?: number;
  color?: string;
}

export function TermojetLogo({ height = 70, color = '#ff6b1a' }: Props) {
  return (
    <svg
      viewBox="0 0 600 200"
      style={{ height, width: 'auto', display: 'block' }}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="TERMOJET"
    >
      <g fill={color}>
        <polygon points="195,40 215,5 235,40 225,40 225,80 205,80 205,40" />
        <polygon points="285,40 305,5 325,40 315,40 315,80 295,80 295,40" />
        <polygon points="375,40 395,5 415,40 405,40 405,80 385,80 385,40" />
        <text
          x="300"
          y="180"
          textAnchor="middle"
          fontSize="100"
          fontFamily="Montserrat, system-ui, sans-serif"
          fontWeight="900"
          letterSpacing="-2"
        >
          TERMOJET
        </text>
      </g>
    </svg>
  );
}
