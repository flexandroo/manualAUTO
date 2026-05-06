import type { ConstructionLegendData } from '../../types/instruction';
import { PdfSectionHeader, PdfFooter } from '../../components/PdfSectionHeader';
import { constructionFontStyle } from './constructionLegendStyles';

interface Props {
  data: ConstructionLegendData;
}

export function ConstructionLegendPreview({ data }: Props) {
  const headingStyle = constructionFontStyle(data, 'heading');
  const numberStyle = constructionFontStyle(data, 'itemNumber');
  const labelStyle = constructionFontStyle(data, 'itemLabel');
  const flowStyle = constructionFontStyle(data, 'flowLine');

  return (
    <div className="pdf-page">
      <PdfSectionHeader
        eyebrow="Конструкція"
        title={data.heading}
        titleStyle={headingStyle}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12mm',
          alignItems: 'flex-start',
        }}
      >
        {/* Diagram card */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '120mm',
          }}
        >
          {data.imageUrl ? (
            <img
              src={data.imageUrl}
              alt=""
              style={{
                maxWidth: '100%',
                maxHeight: '150mm',
                objectFit: 'contain',
              }}
            />
          ) : (
            <div
              style={{
                color: '#94a3b8',
                fontSize: '11px',
                fontWeight: 500,
              }}
            >
              [ Схема ]
            </div>
          )}
        </div>

        {/* Legend card */}
        <div>
          <div
            style={{
              fontSize: '9px',
              fontWeight: 700,
              color: '#ff6b1a',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            Компоненти
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.items.map((it, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '32px 1fr',
                  gap: '12px',
                  alignItems: 'baseline',
                  paddingBottom: '6px',
                  borderBottom: '1px solid #e2e8f0',
                }}
              >
                <div
                  style={{
                    ...numberStyle,
                    color: '#ff6b1a',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '13px',
                  }}
                >
                  {String(it.number).padStart(2, '0')}
                </div>
                <div style={{ ...labelStyle, color: '#0f172a', lineHeight: 1.45 }}>
                  {it.label}
                </div>
              </div>
            ))}
          </div>

          {data.flowLines.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <div
                style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  color: '#ff6b1a',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}
              >
                Лінії потоку
              </div>
              {data.flowLines.map((f, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '4px',
                    ...flowStyle,
                    color: '#475569',
                  }}
                >
                  <span
                    style={{
                      width: '20px',
                      height: '3px',
                      background: f.color,
                      borderRadius: '2px',
                      display: 'inline-block',
                    }}
                  />
                  <span>{f.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <PdfFooter url="termojet.com.ua" />
    </div>
  );
}
