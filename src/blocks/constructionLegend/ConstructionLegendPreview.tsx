import type { ConstructionLegendData } from '../../types/instruction';
import { PdfPageShell, SectionBar } from '../../components/PdfPageShell';
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
    <PdfPageShell footerLabel={data.heading} footerLabelSecondary="Конструкція">
      <SectionBar style={headingStyle}>{data.heading}</SectionBar>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '5mm',
          marginBottom: '5mm',
          border: '0.5px solid rgba(13,21,38,0.1)',
          padding: '4mm',
          background: 'rgba(13,21,38,0.015)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: '7pt',
              fontWeight: 700,
              color: 'var(--pdf-navy)',
              opacity: 0.7,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '2mm',
              alignSelf: 'flex-start',
            }}
          >
            Схема
          </div>
          {data.imageUrl ? (
            <img
              src={data.imageUrl}
              alt=""
              style={{
                maxHeight: '90mm',
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                minHeight: '50mm',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--pdf-mid)',
                fontSize: '7pt',
                fontFamily: 'monospace',
                border: '1px dashed rgba(13,21,38,0.15)',
                background: 'rgba(13,21,38,0.02)',
              }}
            >
              [ Схема ]
            </div>
          )}
        </div>

        <div>
          <div
            style={{
              fontSize: '7pt',
              fontWeight: 700,
              color: 'var(--pdf-navy)',
              opacity: 0.7,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '3mm',
            }}
          >
            Конструктивні елементи
          </div>
          <ul className="pdf-component-list">
            {data.items.map((it, i) => (
              <li key={i}>
                <span className="pdf-component-num" style={numberStyle}>
                  {it.number}
                </span>
                <span style={labelStyle}>{it.label}</span>
              </li>
            ))}
          </ul>

          {data.flowLines.length > 0 && (
            <div
              style={{
                marginTop: '4mm',
                paddingTop: '3mm',
                borderTop: '0.5px solid rgba(13,21,38,0.08)',
              }}
            >
              {data.flowLines.map((f, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '2mm',
                    ...flowStyle,
                    fontSize: '7pt',
                  }}
                >
                  <span
                    style={{
                      width: '20px',
                      height: '3px',
                      background: f.color,
                      borderRadius: '2px',
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                  />
                  <span>{f.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PdfPageShell>
  );
}
