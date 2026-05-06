import type { CoverBlock } from '../../types/instruction';
import { TermojetLogo } from '../../components/TermojetLogo';

interface Props {
  data: CoverBlock;
}

export function CoverPreview({ data }: Props) {
  const images = data.productImages?.length
    ? data.productImages
    : data.imageUrl
    ? [data.imageUrl]
    : [];
  const modelCodes = data.modelCodes ?? [];
  const bulletPoints = (data.bulletPoints ?? []).filter((b) => b.trim().length > 0);

  return (
    <div
      className="pdf-page"
      style={{
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '297mm',
      }}
    >
      {/* Brand header */}
      <div
        style={{
          background: '#0f172a',
          padding: '32px 14mm 36px',
          textAlign: 'center',
        }}
      >
        {data.brandLogoUrl ? (
          <img
            src={data.brandLogoUrl}
            alt={data.brand}
            style={{ maxHeight: '90px', maxWidth: '70%', objectFit: 'contain' }}
          />
        ) : data.brand === 'TERMOJET' ? (
          <TermojetLogo height={96} />
        ) : (
          <>
            <div
              style={{
                color: '#ff6b1a',
                fontSize: '18px',
                letterSpacing: '12px',
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              ▲ ▲ ▲
            </div>
            <div
              style={{
                color: 'white',
                fontSize: '46px',
                fontWeight: 900,
                letterSpacing: '0.06em',
                lineHeight: 1.05,
                marginTop: '6px',
              }}
            >
              {data.brand}
            </div>
          </>
        )}
      </div>

      {/* Orange divider bar */}
      <div style={{ height: '8px', background: '#ff6b1a' }} />

      {/* Title + models + doc type — all centered */}
      <div style={{ padding: '32px 14mm 0', textAlign: 'center' }}>
        <h1
          style={{
            color: '#ff6b1a',
            fontSize: '48px',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            margin: 0,
          }}
        >
          {data.productName}
        </h1>

        {modelCodes.length > 0 && (
          <div
            style={{
              marginTop: '16px',
              fontSize: '13px',
              color: '#2d2d2d',
              fontWeight: 700,
              lineHeight: 1.5,
              maxWidth: '170mm',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            {modelCodes.join('; ')}
          </div>
        )}

        {data.documentType && (
          <div
            style={{
              marginTop: '4px',
              fontSize: '14px',
              color: '#2d2d2d',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {data.documentType}
          </div>
        )}
      </div>

      {/* Subtitle + bullet points */}
      {(data.subtitle || bulletPoints.length > 0) && (
        <div style={{ padding: '28px 14mm 0', textAlign: 'center' }}>
          {data.subtitle && (
            <div
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#2d2d2d',
                letterSpacing: '0.03em',
                marginBottom: '14px',
              }}
            >
              {data.subtitle}
            </div>
          )}

          {bulletPoints.length > 0 && (
            <div
              style={{
                display: 'inline-block',
                textAlign: 'left',
              }}
            >
              {bulletPoints.map((b, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '12px',
                    marginBottom: '6px',
                    fontSize: '14px',
                    color: '#2d2d2d',
                    lineHeight: 1.45,
                  }}
                >
                  <span
                    style={{
                      color: '#ff6b1a',
                      fontSize: '12px',
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    ◆
                  </span>
                  <span style={{ fontWeight: 600 }}>{b}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Product photos area at bottom */}
      <div
        style={{
          marginTop: 'auto',
          background: 'linear-gradient(180deg, #f0f0f0 0%, #d8d8d8 100%)',
          borderTopLeftRadius: '70px',
          borderTopRightRadius: '70px',
          padding: '28px 14mm 18mm',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          gap: '28px',
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
