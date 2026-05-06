import type { CoverBlock } from '../../types/instruction';
import { TermojetLogo } from '../../components/TermojetLogo';

interface Props {
  data: CoverBlock;
}

// Decorative SVG: 3 dashed lines fanning down from the pill bottom-center
// to the three checkmark circles, spread wide across the page.
function ConnectorLines() {
  return (
    <svg
      width="100%"
      height="42"
      viewBox="0 0 600 42"
      preserveAspectRatio="none"
      style={{ display: 'block' }}
      aria-hidden
    >
      <g stroke="#b0b0b0" strokeWidth="1.4" strokeDasharray="3 3" fill="none">
        <path d="M300 0 L 90 42" />
        <path d="M300 0 L 300 42" />
        <path d="M300 0 L 510 42" />
      </g>
    </svg>
  );
}

export function CoverPreview({ data }: Props) {
  const images = data.productImages?.length
    ? data.productImages
    : data.imageUrl
    ? [data.imageUrl]
    : [];
  const modelCodes = data.modelCodes ?? [];

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
            fontSize: '56px',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            lineHeight: 1.02,
            margin: 0,
          }}
        >
          {data.productName}
        </h1>

        {modelCodes.length > 0 && (
          <div
            style={{
              marginTop: '20px',
              fontSize: '15px',
              color: '#2d2d2d',
              fontWeight: 700,
              lineHeight: 1.5,
            }}
          >
            {modelCodes.join('; ')}
          </div>
        )}

        {data.documentType && (
          <div
            style={{
              marginTop: '4px',
              fontSize: '15px',
              color: '#2d2d2d',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {data.documentType}
          </div>
        )}

        {/* Installation pill — wider, centered */}
        {data.subtitle && (
          <div style={{ marginTop: '32px' }}>
            <div
              style={{
                display: 'inline-block',
                padding: '20px 64px',
                border: '1.5px dashed #b0b0b0',
                borderRadius: '999px',
                fontSize: '22px',
                fontWeight: 800,
                color: '#2d2d2d',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                lineHeight: 1.25,
              }}
            >
              {data.subtitle}
            </div>
          </div>
        )}
      </div>

      {/* Connector lines from pill bottom to checkmark circles */}
      <div style={{ padding: '14px 14mm 0' }}>
        <ConnectorLines />
      </div>

      {/* Three checkmark circles — spread wide */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '0 22mm',
          marginTop: '4px',
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: '58px',
              height: '58px',
              borderRadius: '50%',
              border: '2.5px solid #ff6b1a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ff6b1a',
              fontSize: '28px',
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
