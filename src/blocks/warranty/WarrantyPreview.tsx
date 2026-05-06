import type { WarrantyBlockData } from '../../types/instruction';
import { PdfSectionHeader, PdfFooter } from '../../components/PdfSectionHeader';
import { warrantyFontStyle } from './warrantyStyles';

interface Props {
  data: WarrantyBlockData;
}

export function WarrantyPreview({ data }: Props) {
  const titleStyle = warrantyFontStyle(data, 'title');
  const labelStyle = warrantyFontStyle(data, 'fieldLabel');
  const valueStyle = warrantyFontStyle(data, 'fieldValue');
  const termStyle = warrantyFontStyle(data, 'termText');
  const condStyle = warrantyFontStyle(data, 'conditionText');
  const caseHeadingStyle = warrantyFontStyle(data, 'caseHeading');
  const caseDocStyle = warrantyFontStyle(data, 'caseDoc');
  const reviewStyle = warrantyFontStyle(data, 'reviewText');

  return (
    <div className="pdf-page">
      <PdfSectionHeader
        eyebrow="Гарантія"
        title={data.title}
        titleStyle={titleStyle}
      />

      {/* Form fields card */}
      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '6px 18px',
          marginBottom: '24px',
        }}
      >
        {data.fields.map((f, i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '40% 1fr',
              gap: '10mm',
              padding: '14px 0',
              borderBottom: i < data.fields.length - 1 ? '1px solid #e2e8f0' : 'none',
            }}
          >
            <div
              style={{
                ...labelStyle,
                color: '#475569',
                fontSize: '10px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {f.label}
            </div>
            <div style={{ ...valueStyle, color: '#0f172a', minHeight: '14px' }}>
              {f.value || ' '}
            </div>
          </div>
        ))}
      </div>

      {/* Highlighted term */}
      <div
        style={{
          ...termStyle,
          color: '#0f172a',
          marginBottom: '6px',
          paddingLeft: '14px',
          borderLeft: '3px solid #ff6b1a',
        }}
      >
        {data.termText}
      </div>
      <div
        style={{
          ...condStyle,
          color: '#475569',
          marginBottom: '24px',
          paddingLeft: '14px',
        }}
      >
        {data.conditionText}
      </div>

      <div
        style={{
          ...caseHeadingStyle,
          color: '#0f172a',
          marginBottom: '10px',
        }}
      >
        {data.caseHeading}
      </div>
      <ol
        style={{
          ...caseDocStyle,
          lineHeight: 1.7,
          marginBottom: '20px',
          paddingLeft: '0',
          listStyle: 'none',
          color: '#1f2937',
        }}
      >
        {data.caseDocs.map((d, i) => (
          <li
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '24px 1fr',
              gap: '10px',
              marginBottom: '4px',
            }}
          >
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '10px',
                fontWeight: 700,
                color: '#ff6b1a',
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <span>{d}</span>
          </li>
        ))}
      </ol>

      <div
        style={{
          ...reviewStyle,
          color: '#64748b',
          lineHeight: 1.6,
          fontStyle: 'italic',
          paddingTop: '14px',
          borderTop: '1px solid #e2e8f0',
        }}
      >
        {data.reviewText}
      </div>

      <PdfFooter url="termojet.com.ua" />
    </div>
  );
}
