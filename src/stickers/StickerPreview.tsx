import type { StickerData } from './types';

interface Props {
  data: StickerData;
}

const NAVY = '#0D1526';
const ORANGE = '#F25D2A';

// Landscape TERMOJET sticker. All info pushed to the top of the
// content area; the title sits with productCode + articleCode in one
// block. Specs are rendered as a bordered compact table — articleCode
// is the first row inside the table so the article number reads
// alongside the rest of the parameters.
//
// Accent borders (top + left + right) use `data.accentColor`. Every
// font size is multiplied by `data.textScale` so the user can shrink
// or grow the whole sticker's text with a single slider.
export function StickerPreview({ data }: Props) {
  const hasTitle = data.titleLines.some((l) => l.trim());
  const hasTranslations = data.translations.length > 0;
  const hasSpecs = data.specs.length > 0 || !!data.articleCode;
  const hasBottomBand = data.footer || data.distributorInfo.trim();
  const accent = data.accentColor || ORANGE;
  const scale = data.textScale || 1;
  const pt = (n: number) => `${(n * scale).toFixed(2)}pt`;
  const mm = (n: number) => `${(n * scale).toFixed(2)}mm`;

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
        fontFamily: '"Montserrat", "Arial", sans-serif',
        fontWeight: 600,
        display: 'flex',
        flexDirection: 'column',
        borderTop: `0.75mm solid ${accent}`,
        borderLeft: `0.75mm solid ${accent}`,
        borderRight: `0.75mm solid ${accent}`,
      }}
    >
      {/* BODY — two columns */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: '1fr 1.3fr',
          gap: '3mm',
          padding: '2mm 4mm 1.5mm',
          overflow: 'hidden',
        }}
      >
        {/* LEFT column — logo + translations */}
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2mm' }}>
          <div
            style={{
              height: '14mm',
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            {data.brandLogoUrl ? (
              <img
                src={data.brandLogoUrl}
                alt="logo"
                style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', objectPosition: 'left center' }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  border: '0.3mm dashed rgba(13,21,38,0.15)',
                  background: '#FAFAF8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: pt(6),
                  color: '#8A8F9A',
                  fontFamily: 'monospace',
                }}
              >
                [ логотип ]
              </div>
            )}
          </div>

          {hasTranslations && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '6mm 1fr',
                columnGap: '1.5mm',
                rowGap: '0.4mm',
                fontSize: pt(6),
                lineHeight: 1.2,
                minHeight: 0,
                overflow: 'hidden',
              }}
            >
              {data.translations.map((t, i) => (
                <span key={i} style={{ display: 'contents' }}>
                  <span style={{ fontWeight: 700, color: accent }}>{t.langCode}</span>
                  <span style={{ color: NAVY }}>{t.text}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT column */}
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.5mm' }}>
          {/* Title + product code (article moves into the specs table) */}
          {(hasTitle || data.productCode) && (
            <div style={{ flexShrink: 0 }}>
              {hasTitle &&
                data.titleLines.map((line, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: pt(9),
                      fontWeight: 700,
                      lineHeight: 1.1,
                      color: NAVY,
                    }}
                  >
                    {line}
                  </div>
                ))}
              {data.productCode && (
                <div
                  style={{
                    fontSize: pt(13),
                    fontWeight: 700,
                    color: ORANGE,
                    lineHeight: 1.05,
                    marginTop: hasTitle ? '0.5mm' : 0,
                    wordBreak: 'break-word',
                  }}
                >
                  {data.productCode}
                </div>
              )}
            </div>
          )}

          {/* Specs table (with articleCode as first row) + photo */}
          <div style={{ display: 'flex', gap: '2mm', alignItems: 'flex-start', flex: 1, minHeight: 0 }}>
            {hasSpecs && (
              <table
                style={{
                  flex: 1,
                  borderCollapse: 'collapse',
                  fontSize: pt(6),
                  lineHeight: 1.2,
                  tableLayout: 'fixed',
                }}
              >
                <tbody>
                  {data.articleCode && (
                    <tr>
                      <td
                        style={{
                          padding: '0.5mm 1mm',
                          color: NAVY,
                          opacity: 0.65,
                          borderTop: `0.2mm solid ${NAVY}`,
                          borderBottom: `0.2mm solid rgba(13,21,38,0.15)`,
                          width: '40%',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Артикул
                      </td>
                      <td
                        style={{
                          padding: '0.5mm 1mm',
                          color: NAVY,
                          fontWeight: 700,
                          borderTop: `0.2mm solid ${NAVY}`,
                          borderBottom: `0.2mm solid rgba(13,21,38,0.15)`,
                          fontFamily: 'monospace',
                        }}
                      >
                        {data.articleCode}
                      </td>
                    </tr>
                  )}
                  {data.specs.map((s, i) => {
                    const isFirstRow = !data.articleCode && i === 0;
                    return (
                      <tr key={i}>
                        <td
                          style={{
                            padding: '0.5mm 1mm',
                            color: NAVY,
                            opacity: 0.65,
                            borderTop: isFirstRow ? `0.2mm solid ${NAVY}` : 'none',
                            borderBottom: `0.2mm solid rgba(13,21,38,0.15)`,
                            width: '40%',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {s.key}
                        </td>
                        <td
                          style={{
                            padding: '0.5mm 1mm',
                            color: NAVY,
                            fontWeight: 700,
                            borderTop: isFirstRow ? `0.2mm solid ${NAVY}` : 'none',
                            borderBottom: `0.2mm solid rgba(13,21,38,0.15)`,
                          }}
                        >
                          {s.value}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            <div
              style={{
                width: '20mm',
                height: '20mm',
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
                <div style={{ fontSize: pt(5), color: '#8A8F9A', fontFamily: 'monospace' }}>
                  [ фото ]
                </div>
              )}
            </div>
          </div>

          {/* Barcode + CE */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2mm',
              flexShrink: 0,
            }}
          >
            {data.barcodeImageUrl ? (
              <img
                src={data.barcodeImageUrl}
                alt={data.articleCode}
                style={{ maxHeight: '10mm', maxWidth: '40mm' }}
              />
            ) : (
              <div
                style={{
                  width: '36mm',
                  height: '9mm',
                  border: '0.3mm dashed rgba(13,21,38,0.15)',
                  background: '#FAFAF8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: pt(5),
                  color: '#8A8F9A',
                  fontFamily: 'monospace',
                }}
              >
                [ штрих-код ]
              </div>
            )}
            {data.ceMark && (
              <div
                style={{
                  fontSize: mm(7),
                  fontWeight: 700,
                  fontFamily: 'Times, serif',
                  color: NAVY,
                  lineHeight: 1,
                  letterSpacing: '-0.3mm',
                  marginLeft: 'auto',
                }}
              >
                C€
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTNOTE */}
      {data.footnote && (
        <div
          style={{
            padding: '0 4mm 1mm',
            fontSize: pt(5.5),
            fontStyle: 'italic',
            color: NAVY,
            opacity: 0.7,
            flexShrink: 0,
          }}
        >
          {data.footnote}
        </div>
      )}

      {/* BOTTOM band — distributor info + URL */}
      {hasBottomBand && (
        <div
          style={{
            background: NAVY,
            color: 'white',
            padding: '1.5mm 4mm',
            display: 'flex',
            alignItems: 'center',
            gap: '4mm',
            flexShrink: 0,
            fontSize: pt(5),
            lineHeight: 1.2,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>{data.distributorInfo}</div>
          {data.footer && (
            <div
              style={{
                color: accent,
                fontWeight: 700,
                fontSize: pt(6.5),
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
