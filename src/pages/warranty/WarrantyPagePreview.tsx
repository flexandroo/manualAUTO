import type { WarrantyPage } from '../../types/instruction';
import { usePdfDoc } from '../../components/PdfDocContext';
import { TermojetLogo } from '../../components/TermojetLogo';

interface Props {
  data: WarrantyPage;
}

export function WarrantyPagePreview({ data }: Props) {
  const ctx = usePdfDoc();
  return (
    <div
      className="pdf-page"
      style={{ background: '#FAFAF8', padding: 0, minHeight: '297mm' }}
    >
      {/* Orange hero band */}
      <div
        style={{
          background: '#F25D2A',
          padding: '7mm 14mm 6mm',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '6.5pt',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.7)',
              marginBottom: '1.5mm',
            }}
          >
            {ctx.brand ?? 'TERMOJET'}
          </div>
          <div
            style={{
              fontSize: '20pt',
              fontWeight: 900,
              color: 'white',
              lineHeight: 1,
              letterSpacing: '-0.01em',
            }}
          >
            {data.title}
          </div>
        </div>
        {ctx.brandLogoUrl ? (
          <img
            src={ctx.brandLogoUrl}
            alt={ctx.brand}
            style={{
              height: '10mm',
              filter: 'brightness(0) invert(1)',
              opacity: 0.9,
            }}
          />
        ) : (
          <TermojetLogo height={28} color="white" />
        )}
      </div>

      <div style={{ padding: '7mm 14mm', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Form fields */}
        {data.fields.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '6mm',
              marginBottom: '6mm',
            }}
          >
            {data.fields.map((f, i) => (
              <div key={i}>
                <div
                  style={{
                    fontSize: '6.5pt',
                    fontWeight: 700,
                    color: '#8A8F9A',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '1.5mm',
                  }}
                >
                  {f.label}
                </div>
                <div
                  style={{
                    fontSize: '9pt',
                    color: '#0D1526',
                    marginBottom: '2mm',
                    minHeight: '5mm',
                  }}
                >
                  {f.value || ' '}
                </div>
                <div style={{ borderBottom: '1.5px solid rgba(13,21,38,0.2)' }} />
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6mm',
            marginBottom: '6mm',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '6.5pt',
                fontWeight: 700,
                color: '#8A8F9A',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '1.5mm',
              }}
            >
              Підпис та печатка продавця
            </div>
            <div
              style={{
                height: '22mm',
                border: '1.5px dashed rgba(13,21,38,0.15)',
                background: 'rgba(13,21,38,0.015)',
              }}
            />
          </div>
          <div>
            <div
              style={{
                fontSize: '6.5pt',
                fontWeight: 700,
                color: '#8A8F9A',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '1.5mm',
              }}
            >
              Підпис монтажника
            </div>
            <div
              style={{
                height: '22mm',
                border: '1.5px dashed rgba(13,21,38,0.15)',
                background: 'rgba(13,21,38,0.015)',
              }}
            />
          </div>
        </div>

        <div
          style={{
            height: '0.5px',
            background: 'rgba(13,21,38,0.1)',
            marginBottom: '5mm',
          }}
        />

        <div className="pdf-section-bar" style={{ marginBottom: '4mm' }}>
          Умови гарантії
        </div>

        <div className="pdf-two-col" style={{ flex: 1 }}>
          <div>
            <div className="pdf-subsection-body" style={{ marginBottom: '3mm' }}>
              <strong>{data.termText}.</strong> {data.conditionText}
            </div>
            <div className="pdf-subsection-title" style={{ marginBottom: '2mm' }}>
              {data.caseHeading}
            </div>
            {data.caseDocs.length > 0 && (
              <ul className="pdf-bullet-list">
                {data.caseDocs.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            )}
            <div
              className="pdf-subsection-body"
              style={{ marginTop: '3mm', fontSize: '7.5pt', opacity: 0.55 }}
            >
              {data.reviewText}
            </div>
          </div>
          <div>
            <div className="pdf-subsection-title" style={{ marginBottom: '2mm' }}>
              Гарантія не поширюється на:
            </div>
            {data.exclusions.length > 0 && (
              <ul className="pdf-bullet-list">
                {data.exclusions.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="pdf-page-footer-band">
        <div>
          {ctx.brand ?? 'TERMOJET'}
          <span className="pdf-footer-dot" />
          {ctx.websiteUrl ?? 'TERMOJET.COM.UA'}
        </div>
        <div>
          {ctx.pageNumber !== undefined && ctx.totalPages !== undefined
            ? `${ctx.pageNumber} / ${ctx.totalPages}`
            : ''}
        </div>
      </div>
    </div>
  );
}
