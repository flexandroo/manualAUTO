import type { StickerData } from './types';

interface Props {
  data: StickerData;
}

const NAVY = '#0D1526';
const ORANGE = '#F25D2A';

// TERMOJET-styled sticker with FERRO-ZMVA230-shaped info: title at top,
// product code + photo + barcode + specs in the middle, multilingual
// descriptions list, distributor info on a coloured band, footer URL.
// Sections are conditional — empty arrays/strings collapse so the
// generator works equally for simple (just title + photo) and dense
// (everything filled) stickers.
export function StickerPreview({ data }: Props) {
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
      <div style={{ height: '3mm', background: ORANGE, flexShrink: 0 }} />

      {/* TITLE — big bold navy, centered */}
      {data.titleLines.some((l) => l.trim()) && (
        <div style={{ padding: '4mm 5mm 1mm', textAlign: 'center', flexShrink: 0 }}>
          {data.titleLines.map((line, i) => (
            <div
              key={i}
              style={{
                fontSize: '13pt',
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
              }}
            >
              {line}
            </div>
          ))}
          <div
            style={{
              width: '40%',
              height: '0.6mm',
              background: ORANGE,
              margin: '2mm auto 0',
            }}
          />
        </div>
      )}

      {/* PRODUCT CODE + PHOTO + CE */}
      <div
        style={{
          padding: '2mm 5mm 0',
          display: 'flex',
          gap: '3mm',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        {/* Photo on the left */}
        <div
          style={{
            width: '32mm',
            height: '32mm',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#FAFAF8',
            border: data.productImageUrl ? 'none' : '1px dashed rgba(13,21,38,0.15)',
          }}
        >
          {data.productImageUrl ? (
            <img
              src={data.productImageUrl}
              alt={data.productCode}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          ) : (
            <div style={{ fontSize: '6pt', color: '#8A8F9A', fontFamily: 'monospace' }}>
              [ фото ]
            </div>
          )}
        </div>

        {/* Right: product code + article + CE */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {data.productCode && (
            <div
              style={{
                fontSize: '13pt',
                fontWeight: 800,
                color: ORANGE,
                lineHeight: 1.1,
                wordBreak: 'break-word',
              }}
            >
              {data.productCode}
            </div>
          )}
          {data.articleCode && (
            <div
              style={{
                fontSize: '9pt',
                fontWeight: 600,
                color: NAVY,
                marginTop: '1mm',
              }}
            >
              ({data.articleCode})
            </div>
          )}
          {data.ceMark && (
            <div
              style={{
                fontSize: '11mm',
                fontWeight: 700,
                fontFamily: 'Times, serif',
                color: NAVY,
                lineHeight: 1,
                marginTop: '2mm',
                letterSpacing: '-0.5mm',
              }}
            >
              C€
            </div>
          )}
        </div>
      </div>

      {/* SPECS — compact 2-column key/value list */}
      {data.specs.length > 0 && (
        <div style={{ padding: '3mm 5mm 0', flexShrink: 0 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              columnGap: '3mm',
              rowGap: '0.5mm',
              fontSize: '7pt',
              lineHeight: 1.3,
            }}
          >
            {data.specs.map((s, i) => (
              <div key={i}>
                <span style={{ color: NAVY, opacity: 0.7 }}>{s.key}:</span>{' '}
                <span style={{ fontWeight: 700, color: NAVY }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TRANSLATIONS — lang code + description list */}
      {data.translations.length > 0 && (
        <div style={{ padding: '3mm 5mm 0', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '7mm 1fr',
              columnGap: '2mm',
              rowGap: '0.8mm',
              fontSize: '7pt',
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
        </div>
      )}

      {/* BARCODE — uploaded image */}
      {data.barcodeImageUrl && (
        <div style={{ padding: '2mm 5mm', textAlign: 'center', flexShrink: 0 }}>
          <img
            src={data.barcodeImageUrl}
            alt={data.articleCode}
            style={{ maxWidth: '80%', maxHeight: '12mm' }}
          />
        </div>
      )}

      {/* FOOTNOTE */}
      {data.footnote && (
        <div
          style={{
            padding: '0 5mm 1mm',
            fontSize: '6pt',
            fontStyle: 'italic',
            color: NAVY,
            opacity: 0.7,
            textAlign: 'center',
            flexShrink: 0,
          }}
        >
          {data.footnote}
        </div>
      )}

      {/* DISTRIBUTOR INFO — navy band */}
      {data.distributorInfo.trim() && (
        <div
          style={{
            padding: '2mm 5mm',
            background: NAVY,
            color: 'white',
            fontSize: '5.5pt',
            lineHeight: 1.25,
            flexShrink: 0,
          }}
        >
          {data.distributorInfo}
        </div>
      )}

      {/* FOOTER URL */}
      {data.footer && (
        <div
          style={{
            padding: '1.5mm 5mm',
            textAlign: 'center',
            color: ORANGE,
            fontSize: '7pt',
            fontWeight: 700,
            letterSpacing: '0.06em',
            flexShrink: 0,
          }}
        >
          {data.footer}
        </div>
      )}
    </div>
  );
}
