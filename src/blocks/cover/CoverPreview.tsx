import type { CoverBlock } from '../../types/instruction';

interface Props {
  data: CoverBlock;
}

export function CoverPreview({ data }: Props) {
  const images = data.productImages?.length
    ? data.productImages
    : data.imageUrl
    ? [data.imageUrl]
    : [];

  return (
    <div
      className="pdf-page"
      style={{ padding: 0, display: 'flex', flexDirection: 'column' }}
    >
      {/* Brand header */}
      <div
        style={{
          background: '#0f172a',
          padding: '22px 14mm 24px',
          textAlign: 'center',
        }}
      >
        {data.brandLogoUrl ? (
          <img
            src={data.brandLogoUrl}
            alt={data.brand}
            style={{ maxHeight: '60px', maxWidth: '70%', objectFit: 'contain' }}
          />
        ) : (
          <>
            <div
              style={{
                color: '#ff6b1a',
                fontSize: '14px',
                letterSpacing: '8px',
                fontWeight: 700,
                marginBottom: '0px',
                lineHeight: 1,
              }}
            >
              ▲ ▲ ▲
            </div>
            <div
              style={{
                color: 'white',
                fontSize: '34px',
                fontWeight: 900,
                letterSpacing: '0.06em',
                lineHeight: 1.05,
              }}
            >
              {data.brand}
            </div>
          </>
        )}
      </div>

      {/* Orange divider bar */}
      <div style={{ height: '6px', background: '#ff6b1a' }} />

      {/* Title + models + doc type */}
      <div style={{ padding: '20px 14mm 0' }}>
        <h1
          style={{
            color: '#ff6b1a',
            fontSize: '40px',
            fontWeight: 900,
            letterSpacing: '-0.01em',
            lineHeight: 1.05,
            margin: 0,
          }}
        >
          {data.productName}
        </h1>

        {data.modelCodes.length > 0 && (
          <div
            style={{
              marginTop: '14px',
              fontSize: '14px',
              color: '#2d2d2d',
              fontWeight: 700,
              lineHeight: 1.5,
            }}
          >
            {data.modelCodes.join('; ')}
          </div>
        )}

        {data.documentType && (
          <div
            style={{
              marginTop: '4px',
              fontSize: '13px',
              color: '#2d2d2d',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {data.documentType}
          </div>
        )}

        {/* Installation pill */}
        {data.subtitle && (
          <div style={{ marginTop: '22px', textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-block',
                padding: '14px 36px',
                border: '1.5px dashed #b0b0b0',
                borderRadius: '999px',
                fontSize: '17px',
                fontWeight: 800,
                color: '#2d2d2d',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                lineHeight: 1.3,
              }}
            >
              {data.subtitle}
            </div>
          </div>
        )}
      </div>

      {/* Three checkmark circles */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '52px',
          marginTop: '22px',
          padding: '0 14mm',
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              border: '2px solid #ff6b1a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ff6b1a',
              fontSize: '22px',
              fontWeight: 900,
              lineHeight: 1,
            }}
          >
            ✓
          </div>
        ))}
      </div>

      {/* Product photos area at bottom */}
      <div
        style={{
          marginTop: 'auto',
          background: 'linear-gradient(180deg, #f0f0f0 0%, #d8d8d8 100%)',
          borderTopLeftRadius: '60px',
          borderTopRightRadius: '60px',
          padding: '24px 14mm 18mm',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          gap: '24px',
          minHeight: '108mm',
        }}
      >
        {images.length === 0 ? (
          <div
            style={{
              color: '#9a9a9a',
              fontSize: '12px',
              fontWeight: 500,
              alignSelf: 'center',
            }}
          >
            [ Фото продукту з'являться тут ]
          </div>
        ) : (
          images.map((url, i) => (
            <img
              key={i}
              src={url}
              alt=""
              style={{
                maxHeight: '92mm',
                maxWidth: `${Math.floor(92 / images.length)}%`,
                objectFit: 'contain',
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
