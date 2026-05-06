import type { CoverBlock } from '../../types/instruction';

interface Props {
  data: CoverBlock;
}

export function CoverPreview({ data }: Props) {
  return (
    <div className="pdf-page" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="pdf-section-header">
        <div className="pdf-section-header__bar" />
        <div className="pdf-section-header__text">обладнання для котельні</div>
      </div>

      <div style={{ marginTop: '14mm' }}>
        <h1 className="pdf-cover-title">{data.productName}</h1>
        {data.subtitle && (
          <div
            style={{
              marginTop: '4px',
              fontSize: '13px',
              fontWeight: 500,
              color: '#6b6b6b',
            }}
          >
            {data.subtitle}
          </div>
        )}
      </div>

      {data.modelCodes.length > 0 && (
        <div
          style={{
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '2px solid #ff6b1a',
            fontSize: '11px',
            fontWeight: 600,
            lineHeight: 1.65,
          }}
        >
          {data.modelCodes.join('; ')}
        </div>
      )}

      <div
        style={{
          marginTop: 'auto',
          marginBottom: '24mm',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            padding: '10px 32px',
            background: '#2d2d2d',
            color: 'white',
            fontSize: '14px',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {data.documentType}
        </div>
        {data.tagline && (
          <div
            style={{
              marginTop: '14px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#ff6b1a',
              letterSpacing: '0.05em',
            }}
          >
            {data.tagline}
          </div>
        )}
      </div>

      <div className="pdf-footer">
        <span>{data.websiteUrl}</span>
      </div>
    </div>
  );
}
