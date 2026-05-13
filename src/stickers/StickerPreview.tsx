import type { StickerData } from './types';

interface Props {
  data: StickerData;
}

const NAVY = '#0D1526';
const ORANGE = '#F25D2A';

// TERMOJET-style sticker: portrait, white background, navy title block,
// orange variant codes, navy article numbers, optional insulation
// checkboxes, footer with URL. Mirrors the existing 94-page sticker pack
// from "Наліпки UA.pdf" so the generated output drops into the same
// print run as the user's hand-made ones.
export function StickerPreview({ data }: Props) {
  const hasVariants = data.variants.length > 0;
  const hasSpecs = data.specs.length > 0;

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
      {/* Top orange accent band */}
      <div style={{ height: '3mm', background: ORANGE }} />

      {/* TITLE — big bold navy, 2-4 lines */}
      <div
        style={{
          padding: '5mm 6mm 3mm',
          textAlign: 'center',
          color: NAVY,
        }}
      >
        {data.titleLines.map((line, i) => (
          <div
            key={i}
            style={{
              fontSize: '14pt',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.01em',
            }}
          >
            {line}
          </div>
        ))}
      </div>

      {/* Decorative orange underline */}
      <div
        style={{
          width: '40%',
          height: '0.8mm',
          background: ORANGE,
          margin: '0 auto 4mm',
        }}
      />

      {/* VARIANTS — list of model codes (orange) + article numbers (navy) */}
      {hasVariants && (
        <div
          style={{
            flex: 1,
            padding: '0 6mm',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '3mm',
          }}
        >
          {data.variants.map((v) => (
            <div
              key={v.id}
              style={{
                textAlign: 'center',
                lineHeight: 1.1,
              }}
            >
              <div
                style={{
                  fontSize: '13pt',
                  fontWeight: 800,
                  color: ORANGE,
                  letterSpacing: '0.01em',
                }}
              >
                {v.modelCode}
              </div>
              <div
                style={{
                  fontSize: '10pt',
                  fontWeight: 600,
                  color: NAVY,
                  marginTop: '0.5mm',
                }}
              >
                ({v.articleCode})
              </div>
              {v.barcodeImageUrl && (
                <img
                  src={v.barcodeImageUrl}
                  alt={v.articleCode}
                  style={{
                    display: 'block',
                    margin: '1mm auto 0',
                    maxHeight: '10mm',
                    maxWidth: '70%',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* SPECS — for single-product stickers without variants */}
      {hasSpecs && (
        <div
          style={{
            flex: 1,
            padding: '0 6mm',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '2mm',
          }}
        >
          {data.specs.map((s, i) => (
            <div
              key={i}
              style={{
                textAlign: 'center',
                fontSize: '11pt',
                fontWeight: 600,
                color: NAVY,
              }}
            >
              <span style={{ opacity: 0.7 }}>{s.label}:</span>{' '}
              <span style={{ color: ORANGE, fontWeight: 800 }}>{s.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* INSULATION CHECKBOXES */}
      {data.showInsulationCheckboxes && (
        <div
          style={{
            padding: '0 8mm 3mm',
            display: 'flex',
            flexDirection: 'column',
            gap: '2.5mm',
          }}
        >
          <CheckboxRow label="В теплоізоляції" />
          <CheckboxRow label="Без теплоізоляції" />
        </div>
      )}

      {/* FOOTNOTE */}
      {data.footnote && (
        <div
          style={{
            padding: '0 6mm 2mm',
            fontSize: '7pt',
            fontStyle: 'italic',
            color: NAVY,
            opacity: 0.7,
            textAlign: 'center',
          }}
        >
          {data.footnote}
        </div>
      )}

      {/* FOOTER — URL */}
      <div
        style={{
          padding: '2mm 6mm',
          textAlign: 'center',
          color: ORANGE,
          fontSize: '8pt',
          fontWeight: 700,
          letterSpacing: '0.08em',
          borderTop: `0.4mm solid ${ORANGE}`,
        }}
      >
        {data.footer}
      </div>
    </div>
  );
}

function CheckboxRow({ label }: { label: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '2.5mm',
      }}
    >
      <div
        style={{
          width: '5mm',
          height: '5mm',
          border: `0.5mm solid ${NAVY}`,
          flexShrink: 0,
        }}
      />
      <div
        style={{
          fontSize: '10pt',
          fontWeight: 600,
          color: NAVY,
        }}
      >
        {label}
      </div>
    </div>
  );
}
