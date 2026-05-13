import type { StickerData, StickerFontSizes } from './types';

interface Props {
  data: StickerData;
}

const NAVY = '#0D1526';
const ORANGE = '#F25D2A';

// Default font sizes per section (in pt). Editor overrides land in
// data.fontSizes and the renderer multiplies the resolved value by
// data.textScale so the global slider still works end-to-end.
const DEFAULT_SIZES: Required<StickerFontSizes> = {
  title: 9,
  productCode: 13,
  specs: 6,
  translations: 6,
  distributor: 5,
  footer: 6.5,
};

export function StickerPreview({ data }: Props) {
  const hasTitle = data.titleLines.some((l) => l.trim());
  const hasTranslations = data.translations.length > 0;
  const hasSpecs = data.specs.length > 0 || !!data.articleCode;
  const hasBottomBand = data.footer || data.distributorInfo.trim();
  const accent = data.accentColor || ORANGE;
  const scale = data.textScale || 1;
  const sz = (key: keyof StickerFontSizes) => {
    const base = data.fontSizes?.[key] ?? DEFAULT_SIZES[key];
    return `${(base * scale).toFixed(2)}pt`;
  };

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
      }}
    >
      {/* WHITE FRAMED AREA — the accent borders sit only around this,
          so the navy band below is not enclosed by the border. */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          borderTop: `0.75mm solid ${accent}`,
          borderLeft: `0.75mm solid ${accent}`,
          borderRight: `0.75mm solid ${accent}`,
          borderBottom: hasBottomBand ? 'none' : `0.75mm solid ${accent}`,
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
          {/* LEFT — logo + translations */}
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
                  style={{
                    maxHeight: '100%',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    objectPosition: 'left center',
                  }}
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
                    fontSize: sz('translations'),
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
                  fontSize: sz('translations'),
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

          {/* RIGHT — title block + specs table + photo + barcode + certs */}
          <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.5mm' }}>
            {(hasTitle || data.productCode) && (
              <div style={{ flexShrink: 0 }}>
                {hasTitle &&
                  data.titleLines.map((line, i) => (
                    <div
                      key={i}
                      style={{
                        fontSize: sz('title'),
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
                      fontSize: sz('productCode'),
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

            <div style={{ display: 'flex', gap: '2mm', alignItems: 'flex-start', flex: 1, minHeight: 0 }}>
              {hasSpecs && (
                <table
                  style={{
                    flex: 1,
                    borderCollapse: 'collapse',
                    fontSize: sz('specs'),
                    lineHeight: 1.2,
                    tableLayout: 'fixed',
                    fontFamily: 'inherit',
                  }}
                >
                  <tbody>
                    {data.articleCode && (
                      <SpecRow label="Артикул" value={data.articleCode} isFirst />
                    )}
                    {data.specs.map((s, i) => (
                      <SpecRow
                        key={i}
                        label={s.key}
                        value={s.value}
                        isFirst={!data.articleCode && i === 0}
                      />
                    ))}
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
                  <div style={{ fontSize: sz('translations'), color: '#8A8F9A', fontFamily: 'monospace' }}>
                    [ фото ]
                  </div>
                )}
              </div>
            </div>

            {/* Barcode + certifications row (certs always right-aligned) */}
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
                    fontSize: sz('translations'),
                    color: '#8A8F9A',
                    fontFamily: 'monospace',
                  }}
                >
                  [ штрих-код ]
                </div>
              )}
              {data.certifications.length > 0 && (
                <div
                  style={{
                    marginLeft: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2mm',
                  }}
                >
                  {data.certifications.map((c) =>
                    c.imageUrl ? (
                      <img
                        key={c.id}
                        src={c.imageUrl}
                        alt={c.label}
                        style={{ height: '8mm', objectFit: 'contain' }}
                      />
                    ) : (
                      <div
                        key={c.id}
                        style={{
                          fontSize: '5.5mm',
                          fontWeight: 800,
                          color: NAVY,
                          fontFamily:
                            c.label === 'CE' ? 'Times, serif' : '"Arial Black", Impact, sans-serif',
                          letterSpacing: c.label === 'CE' ? '-0.3mm' : '0',
                          lineHeight: 1,
                        }}
                      >
                        {c.label === 'CE' ? 'C€' : c.label}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FOOTNOTE — stays inside the framed area */}
        {data.footnote && (
          <div
            style={{
              padding: '0 4mm 1mm',
              fontSize: sz('distributor'),
              fontStyle: 'italic',
              color: NAVY,
              opacity: 0.7,
              flexShrink: 0,
            }}
          >
            {data.footnote}
          </div>
        )}
      </div>

      {/* BOTTOM NAVY BAND — outside the framed area; full width */}
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
            fontSize: sz('distributor'),
            lineHeight: 1.2,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>{data.distributorInfo}</div>
          {data.footer && (
            <div
              style={{
                color: accent,
                fontWeight: 700,
                fontSize: sz('footer'),
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

  // Local component closes over `sz` for consistent sizing.
  function SpecRow({
    label,
    value,
    isFirst,
  }: {
    label: string;
    value: string;
    isFirst: boolean;
  }) {
    return (
      <tr>
        <td
          style={{
            padding: '0.5mm 1mm',
            color: NAVY,
            opacity: 0.65,
            borderTop: isFirst ? `0.2mm solid ${NAVY}` : 'none',
            borderBottom: `0.2mm solid rgba(13,21,38,0.15)`,
            width: '40%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontFamily: 'inherit',
            fontSize: 'inherit',
          }}
        >
          {label}
        </td>
        <td
          style={{
            padding: '0.5mm 1mm',
            color: NAVY,
            fontWeight: 700,
            borderTop: isFirst ? `0.2mm solid ${NAVY}` : 'none',
            borderBottom: `0.2mm solid rgba(13,21,38,0.15)`,
            fontFamily: 'inherit',
            fontSize: 'inherit',
          }}
        >
          {value}
        </td>
      </tr>
    );
  }
}
