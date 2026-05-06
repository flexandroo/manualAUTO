import type { ConstructionLegendData } from '../../types/instruction';

interface Props {
  data: ConstructionLegendData;
}

export function ConstructionLegendPreview({ data }: Props) {
  return (
    <div className="pdf-page">
      <div className="pdf-section-header">
        <div className="pdf-section-header__bar" />
        <div className="pdf-section-header__text">{data.heading}</div>
      </div>

      <div style={{ display: 'flex', gap: '14mm', alignItems: 'flex-start' }}>
        <div style={{ flex: '0 0 45%' }}>
          {data.imageUrl ? (
            <img
              src={data.imageUrl}
              alt=""
              style={{
                width: '100%',
                maxHeight: '160mm',
                objectFit: 'contain',
                background: 'white',
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '120mm',
                border: '1px dashed #d4d4d4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9a9a9a',
                fontSize: '11px',
              }}
            >
              [ Схема ]
            </div>
          )}
        </div>

        <div style={{ flex: 1, fontSize: '11px', lineHeight: 1.6 }}>
          {data.items.map((it, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '4px',
              }}
            >
              <span
                style={{
                  fontWeight: 800,
                  color: '#ff6b1a',
                  minWidth: '20px',
                }}
              >
                {it.number} -
              </span>
              <span style={{ color: '#2d2d2d' }}>{it.label}</span>
            </div>
          ))}

          {data.flowLines.length > 0 && (
            <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #e4e4e4' }}>
              {data.flowLines.map((f, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '4px',
                  }}
                >
                  <span
                    style={{
                      width: '24px',
                      height: '4px',
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

      <div className="pdf-footer">
        <span>termojet.com.ua</span>
      </div>
    </div>
  );
}
