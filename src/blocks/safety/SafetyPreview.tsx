import type { SafetyBlockData } from '../../types/instruction';
import { PdfSectionHeader, PdfFooter } from '../../components/PdfSectionHeader';
import { safetyFontStyle } from './safetyStyles';

interface Props {
  data: SafetyBlockData;
}

export function SafetyPreview({ data }: Props) {
  const titleStyle = safetyFontStyle(data, 'title');
  const headingStyle = safetyFontStyle(data, 'subsectionHeading');
  const bodyStyle = safetyFontStyle(data, 'subsectionBody');

  return (
    <div className="pdf-page">
      <PdfSectionHeader
        eyebrow="Безпека · Загальні положення"
        title={data.title}
        titleStyle={titleStyle}
      />

      <div
        style={{
          columnCount: 2,
          columnGap: '10mm',
          color: '#0f172a',
          ...bodyStyle,
          lineHeight: 1.55,
        }}
      >
        {data.subsections.map((s, i) => (
          <div
            key={i}
            style={{
              breakInside: 'avoid',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                fontSize: '9px',
                fontWeight: 700,
                color: '#ff6b1a',
                letterSpacing: '0.1em',
                marginBottom: '2px',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              {s.number}
            </div>
            <h3
              style={{
                ...headingStyle,
                color: '#0f172a',
                margin: 0,
                marginBottom: '4px',
                lineHeight: 1.3,
              }}
            >
              {s.heading}
            </h3>
            <p
              style={{
                whiteSpace: 'pre-wrap',
                margin: 0,
                ...bodyStyle,
                color: '#475569',
              }}
            >
              {s.body}
            </p>
          </div>
        ))}
      </div>

      <PdfFooter url="termojet.com.ua" />
    </div>
  );
}
