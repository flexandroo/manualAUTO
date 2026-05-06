import type { CoverData } from '../../types/instruction';

interface Props {
  data: CoverData;
}

export function CoverPreview({ data }: Props) {
  return (
    <div className="pdf-page" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="pdf-section-header">
        <div className="pdf-section-header__bar" />
        <div className="pdf-section-header__text">{data.brand}</div>
      </div>

      <div style={{ marginTop: '8mm' }}>
        <h1 className="pdf-cover-title">{data.title}</h1>
        {data.subtitle && (
          <div
            style={{
              marginTop: '6px',
              fontSize: '13px',
              fontWeight: 500,
              color: '#6b6b6b',
            }}
          >
            {data.subtitle}
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: '18px',
          paddingTop: '14px',
          borderTop: '2px solid #ff6b1a',
          fontSize: '11px',
          fontWeight: 600,
          color: '#2d2d2d',
          lineHeight: 1.65,
        }}
      >
        <div
          style={{
            fontSize: '10px',
            fontWeight: 700,
            color: '#6b6b6b',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '4px',
          }}
        >
          Перелік моделей
        </div>
        {data.models}
      </div>

      <div
        style={{
          marginTop: 'auto',
          marginBottom: '20mm',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            padding: '8px 28px',
            background: '#2d2d2d',
            color: 'white',
            fontSize: '14px',
            fontWeight: 700,
            letterSpacing: '0.08em',
          }}
        >
          {data.documentType}
        </div>
      </div>

      <div className="pdf-footer">
        <span>termojet.com.ua</span>
        <span>1</span>
      </div>
    </div>
  );
}
