import type { StickerData } from './types';

interface Props {
  data: StickerData;
}

const NAVY = '#0D1526';
const ORANGE = '#F25D2A';

// Landscape TERMOJET sticker, compact two-column layout modeled after
// the FERRO ZMVA230 reference. Section sizes are tuned for ~150×90 mm
// (the default) but the relative grid stays sensible at other sizes too.
//
// Grid (top-to-bottom, then left-to-right inside the body):
//   [ orange band — 2 mm ]
//   [ TITLE (full width, centered) — ~10 mm ]
//   [ left col          ][ right col          ]
//   [ translations list ][ product code +     ]
//   [                   ][ specs + photo +    ]
//   [                   ][ CE + barcode       ]
//   [ navy band — distributor info + URL ]
export function StickerPreview({ data }: Props) {
  const hasTitle = data.titleLines.some((l) => l.trim());
  const hasTranslations = data.translations.length > 0;
  const hasSpecs = data.specs.length > 0;
  const hasFooter = data.footer || data.distributorInfo.trim();

  return (
    <div
      className="sticker-page"
      style={{
        width: `${data.widthMm}mm`,
        height: `${data.heightMm}mm`,
        background: 'white',
        color: NAVY,
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: '"Montserrat", "Arial Black", Impact, sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top orange accent */}
      <div style={{ height: '2mm', background: ORANGE, flexShrink: 0 }} />

      {/* TITLE row across full width */}
      {hasTitle && (
        <div
          style={{
            padding: '2mm 5mm 1mm',
            textAlign: 'center',
            flexShrink: 0,
          }}
        >
          {data.titleLines.map((line, i) => (
            <div
              key={i}
              style={{
                fontSize: '11pt',
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
                color: NAVY,
              }}
            >
              {line}
            </div>
          ))}
        </div>
      )}

      {/* BODY — two columns */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: '1.1fr 1fr',
          gap: '3mm',
          padding: '1mm 4mm 2mm',
          overflow: 'hidden',
        }}
      >
        {/* LEFT — translations list */}
        <div style={{ minWidth: 0, overflow: 'hidden' }}>
          {hasTranslations ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '6mm 1fr',
                columnGap: '1.5mm',
                rowGap: '0.4mm',
                fontSize: '6pt',
                lineHeight: 1.2,
              }}
            >
              {data.translations.map((t, i) => (
                <span key={i} style={{ display: 'contents' }}>
                  <span style={{ fontWeight: 800, color: ORANGE }}>{t.langCode}</span>
                  <span style={{ color: NAVY }}>{t.text}</span>
                </span>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '6pt', color: '#999', fontFamily: 'monospace' }}>
              [ переклади ]
            </div>
          )}
        </div>

        {/* RIGHT — product code, photo, specs, CE, barcode */}
        <div
          style={{
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5mm',
          }}
        >
          {/* Code row: code+article on the left, photo on the right */}
          <div style={{ display: 'flex', gap: '2mm', alignItems: 'flex-start' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              {data.productCode && (
                <div
                  style={{
                    fontSize: '13pt',
                    fontWeight: 800,
                    color: ORANGE,
                    lineHeight: 1.05,
                    wordBreak: 'break-word',
                  }}
                >
                  {data.productCode}
                </div>
              )}
              {data.articleCode && (
                <div
                  style={{
                    fontSize: '7pt',
                    fontWeight: 600,
                    color: NAVY,
                    marginTop: '0.5mm',
                  }}
                >
                  ({data.articleCode})
                </div>
              )}
            </div>
            <div
              style={{
                width: '22mm',
                height: '22mm',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#FAFAF8',
                border: data.productImageUrl ? 'none' : '0.3mm dashed rgba(13,21,38,0.15)',
              }}
            >
              {data.productImageUrl ? (
                <img
                  src={data.productImageUrl}
                  alt={data.productCode}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              ) : (
                <div style={{ fontSize: '5pt', color: '#8A8F9A', fontFamily: 'monospace' }}>
                  [ фото ]
                </div>
              )}
            </div>
          </div>

          {/* Specs — compact 2-col */}
          {hasSpecs && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                columnGap: '2mm',
                rowGap: '0.3mm',
                fontSize: '6.5pt',
                lineHeight: 1.25,
              }}
            >
              {data.specs.map((s, i) => (
                <div key={i}>
                  <span style={{ color: NAVY, opacity: 0.65 }}>{s.key}:</span>{' '}
                  <span style={{ fontWeight: 700, color: NAVY }}>{s.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* CE + Barcode row at the bottom of the right column */}
          <div
            style={{
              marginTop: 'auto',
              display: 'flex',
              alignItems: 'flex-end',
              gap: '2mm',
            }}
          >
            {data.ceMark && (
              <div
                style={{
                  fontSize: '8mm',
                  fontWeight: 700,
                  fontFamily: 'Times, serif',
                  color: NAVY,
                  lineHeight: 1,
                  letterSpacing: '-0.4mm',
                }}
              >
                C€
              </div>
            )}
            {data.barcodeImageUrl ? (
              <img
                src={data.barcodeImageUrl}
                alt={data.articleCode}
                style={{ maxHeight: '12mm', maxWidth: '45mm', marginLeft: 'auto' }}
              />
            ) : (
              <div
                style={{
                  marginLeft: 'auto',
                  width: '40mm',
                  height: '10mm',
                  border: '0.3mm dashed rgba(13,21,38,0.15)',
                  background: '#FAFAF8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '5pt',
                  color: '#8A8F9A',
                  fontFamily: 'monospace',
                }}
              >
                [ штрих-код ]
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTNOTE — above the bottom band */}
      {data.footnote && (
        <div
          style={{
            padding: '0 5mm 1mm',
            fontSize: '5.5pt',
            fontStyle: 'italic',
            color: NAVY,
            opacity: 0.7,
            flexShrink: 0,
          }}
        >
          {data.footnote}
        </div>
      )}

      {/* BOTTOM band — distributor info + footer URL on the right */}
      {hasFooter && (
        <div
          style={{
            background: NAVY,
            color: 'white',
            padding: '1.5mm 5mm',
            display: 'flex',
            alignItems: 'center',
            gap: '4mm',
            flexShrink: 0,
            fontSize: '5pt',
            lineHeight: 1.2,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>{data.distributorInfo}</div>
          {data.footer && (
            <div
              style={{
                color: ORANGE,
                fontWeight: 700,
                fontSize: '6.5pt',
                whiteSpace: 'nowrap',
                letterSpacing: '0.04em',
              }}
            >
              {data.footer}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
