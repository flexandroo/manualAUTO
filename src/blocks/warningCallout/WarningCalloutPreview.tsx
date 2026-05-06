import type { WarningCalloutData } from '../../types/instruction';
import { warningFontStyle } from './warningCalloutStyles';

interface Props {
  data: WarningCalloutData;
}

const STYLE: Record<
  WarningCalloutData['level'],
  { bg: string; border: string; titleColor: string; eyebrow: string; symbol: string }
> = {
  info: {
    bg: '#eff6ff',
    border: '#3b82f6',
    titleColor: '#1d4ed8',
    eyebrow: 'INFO',
    symbol: 'i',
  },
  warning: {
    bg: '#fff7ed',
    border: '#ff6b1a',
    titleColor: '#c2410c',
    eyebrow: 'УВАГА',
    symbol: '!',
  },
  danger: {
    bg: '#fef2f2',
    border: '#dc2626',
    titleColor: '#991b1b',
    eyebrow: 'НЕБЕЗПЕКА',
    symbol: '!',
  },
};

export function WarningCalloutPreview({ data }: Props) {
  const s = STYLE[data.level];
  const titleStyle = warningFontStyle(data, 'title');
  const bodyStyle = warningFontStyle(data, 'body');

  return (
    <div className="pdf-page">
      <div
        style={{
          background: s.bg,
          borderLeft: `3px solid ${s.border}`,
          padding: '20px 24px',
          borderRadius: '0 8px 8px 0',
          display: 'grid',
          gridTemplateColumns: '36px 1fr',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: s.border,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 800,
            lineHeight: 1,
          }}
        >
          {s.symbol}
        </div>
        <div>
          <div
            style={{
              fontSize: '9px',
              fontWeight: 700,
              color: s.titleColor,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginBottom: '2px',
              opacity: 0.7,
            }}
          >
            {s.eyebrow}
          </div>
          <div
            style={{
              ...titleStyle,
              color: s.titleColor,
              marginBottom: '8px',
            }}
          >
            {data.title}
          </div>
          <div
            style={{
              ...bodyStyle,
              lineHeight: 1.6,
              color: '#1f2937',
              whiteSpace: 'pre-wrap',
            }}
          >
            {data.body}
          </div>
        </div>
      </div>
    </div>
  );
}
