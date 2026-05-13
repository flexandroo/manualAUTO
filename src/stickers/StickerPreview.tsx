import type { StickerData } from './types';

interface Props {
  data: StickerData;
}

// Renders the sticker at native size in mm. The card is fixed at
// widthMm × heightMm; html2canvas captures it later for PDF export.
//
// Layout mirrors the FERRO ZMVA230 reference:
//
//   ┌────────────────────────────┬──────────────────────────┐
//   │ Brand logo                 │  productLabelPrefix      │
//   │ ─────────────────          │  PRODUCTCODE        ⬛ N  │
//   │ PL  description...         │  spec1                   │
//   │ CZ  description...         │  spec2          DZ-code  │
//   │ ...                        │  spec3                   │
//   │                            │  [ product image ]   CE  │
//   ├────────────────────────────┼──────────────────────────┤
//   │ Distributor info block...  │  ▌▌▌▌▌▌▌▌ EAN-13 ▌▌▌▌▌▌▌ │
//   └────────────────────────────┴──────────────────────────┘
export function StickerPreview({ data }: Props) {
  return (
    <div
      className="sticker-page"
      style={{
        width: `${data.widthMm}mm`,
        height: `${data.heightMm}mm`,
        background: 'white',
        color: '#111',
        boxSizing: 'border-box',
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr',
        gridTemplateRows: '1fr auto',
        fontFamily: 'Arial, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* LEFT — brand + translations */}
      <div style={{ padding: '4mm 4mm 2mm', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '2mm' }}>
          {data.brandLogoUrl ? (
            <img
              src={data.brandLogoUrl}
              alt={data.brand}
              style={{ height: '9mm', display: 'block' }}
            />
          ) : (
            <div
              style={{
                fontFamily: 'Arial Black, Impact, sans-serif',
                fontSize: '9mm',
                color: '#E2231A',
                fontWeight: 900,
                fontStyle: 'italic',
                letterSpacing: '-0.5mm',
                lineHeight: 1,
              }}
            >
              {data.brand}
              <sup style={{ fontSize: '3mm', verticalAlign: 'top' }}>®</sup>
            </div>
          )}
          <div
            style={{
              height: '0.4mm',
              background: '#E2231A',
              marginTop: '1.5mm',
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '6mm 1fr', columnGap: '2mm', rowGap: '0.5mm', fontSize: '6.5pt', lineHeight: 1.15 }}>
          {data.translations.map((t, i) => (
            <span key={i} style={{ display: 'contents' }}>
              <span style={{ fontWeight: 700 }}>{t.langCode}</span>
              <span>{t.text}</span>
            </span>
          ))}
        </div>
      </div>

      {/* RIGHT — product code + specs + image + CE */}
      <div style={{ padding: '4mm 4mm 2mm', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1mm' }}>
          <div>
            <div style={{ fontSize: '7pt', color: '#666', lineHeight: 1 }}>
              {data.productLabelPrefix}
            </div>
            <div style={{ fontSize: '11mm', fontWeight: 900, lineHeight: 1, marginTop: '0.5mm', letterSpacing: '-0.3mm' }}>
              {data.productCode}
            </div>
          </div>
          {/* Pkg quantity badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5mm', marginTop: '2mm' }}>
            <svg width="9mm" height="9mm" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
            <span style={{ fontSize: '11mm', fontWeight: 900, lineHeight: 1 }}>{data.quantity}</span>
          </div>
        </div>

        {/* Horizontal red line */}
        <div style={{ height: '0.4mm', background: '#E2231A', margin: '1mm 0 2mm' }} />

        <div style={{ display: 'flex', gap: '3mm', flex: 1, minHeight: 0 }}>
          <div style={{ flex: 1, fontSize: '7pt', lineHeight: 1.3, display: 'flex', flexDirection: 'column', gap: '0.5mm' }}>
            {data.specs.map((s, i) => (
              <div key={i}>
                <strong>{s.key}:</strong> {s.value}
              </div>
            ))}
            <div style={{ marginTop: '2mm', fontSize: '7pt' }}>{data.dzCode}</div>
            {data.ceMark && (
              <div style={{ marginTop: 'auto', fontSize: '10mm', fontWeight: 700, fontFamily: 'Times, serif', letterSpacing: '-0.5mm' }}>
                C€
              </div>
            )}
          </div>
          <div style={{ width: '30mm', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {data.productImageUrl ? (
              <img
                src={data.productImageUrl}
                alt={data.productCode}
                style={{ maxWidth: '100%', maxHeight: '30mm', objectFit: 'contain' }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '28mm',
                  border: '1px dashed #ccc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '6pt',
                  color: '#999',
                  fontFamily: 'monospace',
                }}
              >
                [ фото ]
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM-LEFT — distributor info on red band */}
      <div
        style={{
          background: '#E2231A',
          color: 'white',
          padding: '2mm 4mm',
          fontSize: '5.5pt',
          lineHeight: 1.25,
        }}
      >
        {data.distributorInfo}
      </div>

      {/* BOTTOM-RIGHT — barcode */}
      <div style={{ padding: '2mm 4mm', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <BarcodePlaceholder digits={data.barcodeEan13} />
      </div>
    </div>
  );
}

// Visual placeholder for an EAN-13 barcode. We render a faux pattern of
// stripes so the layout has the right footprint; the real barcode (via
// jsbarcode or similar) lands here in the next iteration.
function BarcodePlaceholder({ digits }: { digits: string }) {
  const stripes = digits
    .split('')
    .map((d, i) => ({ d, key: i, w: 0.4 + (parseInt(d, 10) % 4) * 0.15 }));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.2mm', height: '12mm' }}>
        {stripes.map((s) => (
          <div
            key={s.key}
            style={{
              width: `${s.w}mm`,
              height: '100%',
              background: '#111',
            }}
          />
        ))}
      </div>
      <div style={{ fontSize: '7pt', letterSpacing: '0.5mm', marginTop: '0.5mm' }}>
        {digits}
      </div>
    </div>
  );
}
