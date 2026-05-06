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

      <div style={{ marginTop: '10mm' }}>
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
            marginTop: '12px',
            paddingTop: '10px',
            borderTop: '2px solid #ff6b1a',
            fontSize: '11px',
            fontWeight: 600,
            lineHeight: 1.6,
            columnCount: data.modelCodes.length > 6 ? 2 : 1,
            columnGap: '12mm',
          }}
        >
          {data.modelCodes.map((m, i) => (
            <div key={i} style={{ breakInside: 'avoid' }}>
              {m}
              {i < data.modelCodes.length - 1 ? ';' : '.'}
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          flex: 1,
          marginTop: '14mm',
          marginBottom: '10mm',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '85mm',
        }}
      >
        {data.imageUrl ? (
          <img
            src={data.imageUrl}
            alt=""
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              minHeight: '85mm',
              border: '1px dashed #d4d4d4',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9a9a9a',
              fontSize: '11px',
              fontWeight: 500,
            }}
          >
            [ Фото продукту з'явиться тут ]
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', marginBottom: '12mm' }}>
        <div
          style={{
            display: 'inline-block',
            padding: '10px 36px',
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
              marginTop: '12px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#ff6b1a',
              letterSpacing: '0.06em',
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
