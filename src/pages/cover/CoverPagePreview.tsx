import type { CoverPage, InstructionData } from '../../types/instruction';
import { TermojetLogo } from '../../components/TermojetLogo';
import { usePdfDoc } from '../../components/PdfDocContext';
import { ElementRenderer } from '../../elements/ElementRenderer';

interface Props {
  data: CoverPage;
}

const NAVY = '#0D1526';
const ORANGE = '#F25D2A';
const WHITE = '#FAFAF8';

export function CoverPagePreview({ data }: Props) {
  const ctx = usePdfDoc();
  const meta: Partial<InstructionData> = {
    productName: ctx.productName,
    brand: ctx.brand,
    brandTagline: undefined,
    documentType: undefined,
    modelCodes: undefined,
    websiteUrl: ctx.websiteUrl,
    brandLogoUrl: ctx.brandLogoUrl,
  };
  // Doc-level fields needed by the cover come via context; the page itself
  // only stores the cover-specific bits (subtitle, bullets, images).
  const productName = meta.productName ?? '';
  const brand = meta.brand ?? 'TERMOJET';
  const websiteUrl = meta.websiteUrl ?? 'TERMOJET.COM.UA';
  const brandLogoUrl = meta.brandLogoUrl;
  const documentType = (ctx as { documentType?: string }).documentType ?? '';
  const brandTagline = (ctx as { brandTagline?: string }).brandTagline ?? '';
  const modelCodes = (ctx as { modelCodes?: string[] }).modelCodes ?? [];
  const coverCopyright = (ctx as { coverCopyright?: string }).coverCopyright ?? '';
  const coverLanguage = (ctx as { coverLanguage?: string }).coverLanguage ?? '';

  const images = data.productImages?.length ? data.productImages : [];
  const features = (data.bulletPoints ?? []).filter((b) => b.trim().length > 0);

  return (
    <div
      className="pdf-page"
      style={{
        background: NAVY,
        color: WHITE,
        padding: 0,
        minHeight: '297mm',
      }}
    >
      {/* TOP BAND */}
      <div
        style={{
          background: ORANGE,
          padding: '10mm 14mm 8mm',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ height: '14mm', display: 'flex', alignItems: 'center' }}>
          {brandLogoUrl ? (
            <img
              src={brandLogoUrl}
              alt={brand}
              style={{
                height: '14mm',
                maxWidth: '60mm',
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)',
              }}
            />
          ) : (
            <TermojetLogo height={42} color="white" />
          )}
        </div>
        <div
          style={{
            fontSize: '7pt',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            opacity: 0.85,
            textAlign: 'right',
            lineHeight: 1.5,
            color: 'white',
          }}
        >
          {documentType && <>{documentType}<br /></>}
          {brandTagline}
        </div>
      </div>

      {/* HERO */}
      <div style={{ padding: '10mm 14mm 0' }}>
        <div
          style={{
            fontSize: '7pt',
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: ORANGE,
            marginBottom: '3mm',
          }}
        >
          {productName}
        </div>

        <div
          style={{
            fontSize: '20pt',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
            marginBottom: '2mm',
            color: 'white',
          }}
        >
          {data.heroPrefix}
          {data.heroPrefix && ' '}
          <span style={{ color: ORANGE }}>
            {data.heroAccent ||
              modelCodes[0]?.split('-')[0] ||
              productName.split(' ')[0]}
          </span>
        </div>

        {data.subtitle && (
          <div
            style={{
              fontSize: '9pt',
              fontWeight: 500,
              opacity: 0.55,
              marginBottom: '5mm',
              letterSpacing: '0.02em',
              color: 'white',
            }}
          >
            {data.subtitle}
          </div>
        )}

        {modelCodes.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: '2.5mm',
              flexWrap: 'wrap',
              marginBottom: '6mm',
            }}
          >
            {modelCodes.map((m, i) => (
              <span
                key={i}
                style={{
                  background: 'rgba(242,93,42,0.15)',
                  border: '1px solid rgba(242,93,42,0.4)',
                  color: ORANGE,
                  fontSize: '7.5pt',
                  fontWeight: 700,
                  padding: '1.5mm 3.5mm',
                  borderRadius: '2mm',
                  letterSpacing: '0.06em',
                }}
              >
                {m}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* FEATURES grid */}
      {features.length > 0 && (
        <div
          style={{
            padding: '6mm 14mm 0',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${Math.min(features.length, 3)}, 1fr)`,
              gap: '3mm',
            }}
          >
            {features.slice(0, 3).map((b, i) => (
              <div
                key={i}
                style={{
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '6mm 5mm',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2.5mm',
                  background: 'rgba(255,255,255,0.03)',
                }}
              >
                <div
                  style={{
                    width: '8mm',
                    height: '8mm',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <rect
                      x="1"
                      y="1"
                      width="20"
                      height="20"
                      rx="2"
                      stroke={ORANGE}
                      strokeWidth="1.5"
                    />
                    <line x1="11" y1="5" x2="11" y2="17" stroke={ORANGE} strokeWidth="1.5" />
                    <line x1="5" y1="11" x2="17" y2="11" stroke={ORANGE} strokeWidth="1.5" />
                  </svg>
                </div>
                <div
                  style={{
                    fontSize: '9pt',
                    fontWeight: 700,
                    color: 'white',
                    lineHeight: 1.3,
                    opacity: 0.9,
                  }}
                >
                  {b}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CUSTOM elements zone */}
      {(data.elements ?? []).length > 0 && (
        <div
          style={{
            padding: '4mm 14mm 0',
            color: 'rgba(255,255,255,0.85)',
          }}
        >
          {(data.elements ?? []).map((el) => (
            <ElementRenderer key={el.id} element={el} />
          ))}
        </div>
      )}

      {/* DRAWINGS strip — light "podium" so images render reliably in
          PDF (no blend-mode / filter tricks; those don't survive
          html2canvas capture). Smooth visual transition from the
          dark hero up top to the light strip down here. */}
      <div
        style={{
          marginTop: 'auto',
          background: 'linear-gradient(180deg, #ECEAE5 0%, #D8D5CE 100%)',
          borderTopLeftRadius: '50px',
          borderTopRightRadius: '50px',
          padding: '14mm 14mm 12mm',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          gap: '8mm',
          minHeight: '80mm',
        }}
      >
        {images.length > 0 ? (
          images.map((url, i) => (
            <img
              key={i}
              src={url}
              alt=""
              style={{
                maxHeight: '70mm',
                maxWidth: `${Math.floor(95 / images.length)}%`,
                objectFit: 'contain',
                display: 'block',
              }}
            />
          ))
        ) : (
          <div
            style={{
              color: '#9a9a9a',
              fontSize: '11px',
              fontWeight: 500,
              alignSelf: 'center',
            }}
          >
            [ Зображення продуктів з'являться тут ]
          </div>
        )}
      </div>

      {/* BOTTOM band */}
      <div
        style={{
          background: 'rgba(0,0,0,0.3)',
          padding: '5mm 14mm',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            fontSize: '7pt',
            opacity: 0.5,
            fontWeight: 500,
            letterSpacing: '0.04em',
            color: 'white',
          }}
        >
          {coverCopyright || `${brand} © ${new Date().getFullYear()} — ${websiteUrl}`}
        </div>
        <div style={{ fontSize: '7pt', opacity: 0.5, fontWeight: 500, color: 'white' }}>
          {coverLanguage || 'UA | Українська мова'}
        </div>
      </div>
    </div>
  );
}
