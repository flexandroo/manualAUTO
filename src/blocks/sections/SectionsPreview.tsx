import type { SectionsData } from '../../types/instruction';

interface Props {
  data: SectionsData;
}

export function SectionsPreview({ data }: Props) {
  return (
    <div className="pdf-page">
      <div className="pdf-section-header">
        <div className="pdf-section-header__bar" />
        <div className="pdf-section-header__text">{data.title}</div>
      </div>

      <div style={{ marginTop: '6px' }}>
        {data.items.map((item, i) => (
          <div key={i} style={{ marginBottom: '14px', display: 'flex', gap: '10px' }}>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 800,
                color: '#ff6b1a',
                minWidth: '24px',
                lineHeight: 1.4,
              }}
            >
              {i + 1}.
            </span>
            <div style={{ flex: 1 }}>
              <h3
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  marginBottom: '3px',
                  color: '#2d2d2d',
                }}
              >
                {item.heading}
              </h3>
              <p
                style={{
                  fontSize: '11px',
                  lineHeight: 1.55,
                  color: '#3a3a3a',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="pdf-footer">
        <span>termojet.com.ua</span>
        <span>3</span>
      </div>
    </div>
  );
}
