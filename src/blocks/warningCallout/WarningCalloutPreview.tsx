import type { WarningCalloutData } from '../../types/instruction';

interface Props {
  data: WarningCalloutData;
}

const STYLE: Record<
  WarningCalloutData['level'],
  { bg: string; border: string; titleColor: string }
> = {
  info: { bg: '#eff6ff', border: '#3b82f6', titleColor: '#1d4ed8' },
  warning: { bg: '#fff7ed', border: '#ff6b1a', titleColor: '#c2410c' },
  danger: { bg: '#fef2f2', border: '#dc2626', titleColor: '#991b1b' },
};

export function WarningCalloutPreview({ data }: Props) {
  const s = STYLE[data.level];
  return (
    <div className="pdf-page">
      <div
        style={{
          background: s.bg,
          borderLeft: `6px solid ${s.border}`,
          padding: '14px 18px',
          borderRadius: '0 4px 4px 0',
        }}
      >
        <div
          style={{
            fontSize: '13px',
            fontWeight: 800,
            color: s.titleColor,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '6px',
          }}
        >
          {data.title}
        </div>
        <div
          style={{
            fontSize: '11px',
            lineHeight: 1.55,
            color: '#2d2d2d',
            whiteSpace: 'pre-wrap',
          }}
        >
          {data.body}
        </div>
      </div>
    </div>
  );
}
