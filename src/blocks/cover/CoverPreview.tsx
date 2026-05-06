import type { CoverBlock } from '../../types/instruction';
import { TermojetLogo } from '../../components/TermojetLogo';
import { coverFontStyle } from './coverStyles';

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
        background: '#ffffff',
      }}
    >
      {/* Top brand area: small logo left, tagline right (asymmetric) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16mm 18mm 0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {data.brandLogoUrl ? (
            <img
              src={data.brandLogoUrl}
              alt={data.brand}
              style={{ height: '34px', maxWidth: '180px', objectFit: 'contain' }}
            />
          ) : data.brand === 'TERMOJET' ? (
            <TermojetLogo height={38} />
          ) : (
            <div
              style={{
                fontSize: '20px',
                fontWeight: 900,
                color: '#0f172a',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {data.brand}
            </div>
          )}
        </div>
        {data.brandTagline && (
          <div
            style={{
              ...coverFontStyle(data, 'brandTagline'),
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
            }}
          >
            {data.brandTagline}
          </div>
        )}
      </div>

      {/* Thin orange accent line */}
      <div
        style={{
          margin: '14mm 18mm 0',
          height: '1px',
          background: '#e2e8f0',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '64px',
            height: '2px',
            background: '#ff6b1a',
          }}
        />
      </div>

      {/* Hero product image area — dominant whitespace and the product */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '14mm 18mm',
          gap: '10mm',
          minHeight: '120mm',
        }}
      >
        {images.length === 0 ? (
          <div
            style={{
              width: '70%',
              aspectRatio: '4/3',
              background: '#f8fafc',
              border: '1px dashed #cbd5e1',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              fontSize: '11px',
              fontWeight: 500,
            }}
          >
            [ зображення продукту ]
          </div>
        ) : (
          images.map((url, i) => (
            <img
              key={i}
              src={url}
              alt=""
              style={{
                maxHeight: '120mm',
                maxWidth: `${Math.floor(95 / images.length)}%`,
                objectFit: 'contain',
              }}
            />
          ))
        )}
      </div>

      {/* Title block — left-aligned, editorial */}
      <div style={{ padding: '0 18mm 0' }}>
        {data.documentType && (
          <div
            style={{
              ...coverFontStyle(data, 'documentType'),
              color: '#64748b',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            {data.documentType}
          </div>
        )}

        <h1
          style={{
            ...coverFontStyle(data, 'productName'),
            color: '#0f172a',
            letterSpacing: '-0.025em',
            lineHeight: 1.0,
            margin: 0,
            marginBottom: '10px',
          }}
        >
          {data.productName}
        </h1>

        {data.subtitle && (
          <div
            style={{
              ...coverFontStyle(data, 'subtitle'),
              color: '#475569',
              marginBottom: '14px',
              maxWidth: '160mm',
              lineHeight: 1.5,
            }}
          >
            {data.subtitle}
          </div>
        )}

        {modelCodes.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '5px',
              marginBottom: '14px',
              maxWidth: '160mm',
            }}
          >
            {modelCodes.map((m, i) => (
              <span
                key={i}
                style={{
                  ...coverFontStyle(data, 'modelCodes'),
                  background: '#f1f5f9',
                  color: '#0f172a',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                }}
              >
                {m}
              </span>
            ))}
          </div>
        )}

        {bulletPoints.length > 0 && (
          <div
            style={{
              borderTop: '1px solid #e2e8f0',
              paddingTop: '14px',
              maxWidth: '160mm',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '4px 18px',
            }}
          >
            {bulletPoints.map((b, i) => {
              const fs = coverFontStyle(data, 'bulletPoints');
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '8px',
                    fontSize: fs.fontSize,
                    fontWeight: fs.fontWeight,
                    color: '#0f172a',
                    lineHeight: 1.45,
                  }}
                >
                  <span
                    style={{
                      color: '#ff6b1a',
                      fontSize: '8px',
                      flexShrink: 0,
                    }}
                  >
                    ◆
                  </span>
                  <span>{b}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '0 18mm 12mm',
          marginTop: '18mm',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '9px',
          color: '#64748b',
          textTransform: 'uppercase',
          letterSpacing: '0.18em',
          fontWeight: 600,
          borderTop: '1px solid #e2e8f0',
          paddingTop: '8px',
        }}
      >
        <span>{data.websiteUrl}</span>
        <span>01</span>
      </div>
    </div>
  );
}
