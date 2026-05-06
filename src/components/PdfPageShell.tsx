import type { ReactNode } from 'react';
import { usePdfDoc } from './PdfDocContext';
import { TermojetLogo } from './TermojetLogo';

interface Props {
  children: ReactNode;
  /** Right-side breadcrumb shown in the dark page header. */
  breadcrumb?: string;
  /** Left text in the light footer band — e.g. "Основні положення". */
  footerLabel?: string;
  /** Right text in the footer — overrides default page numbering. */
  footerRight?: string;
  /** Optional override of footer label-2 text after the orange dot. */
  footerLabelSecondary?: string;
  /** Hide the dark top header band (cover and warranty pages do this). */
  hideHeader?: boolean;
  /** Hide the light footer band. */
  hideFooter?: boolean;
}

// Wraps a block in the standard page chrome: dark navy header band with
// brand logo + breadcrumb on the right, light cream footer band with
// section label and page number. Each block's content fills the middle.
export function PdfPageShell({
  children,
  breadcrumb,
  footerLabel,
  footerRight,
  footerLabelSecondary,
  hideHeader,
  hideFooter,
}: Props) {
  const ctx = usePdfDoc();
  const headerRight =
    breadcrumb ??
    [ctx.productName, ctx.productSubtitle].filter(Boolean).join(' · ') ??
    '';
  const pageStr =
    footerRight ??
    (ctx.pageNumber !== undefined && ctx.totalPages !== undefined
      ? `${ctx.pageNumber} / ${ctx.totalPages}`
      : ctx.pageNumber !== undefined
      ? String(ctx.pageNumber)
      : '');

  return (
    <>
      {!hideHeader && (
        <div className="pdf-page-header">
          {ctx.brandLogoUrl ? (
            <img src={ctx.brandLogoUrl} alt={ctx.brand ?? 'TERMOJET'} />
          ) : (
            <div style={{ height: '7mm', display: 'flex', alignItems: 'center' }}>
              <TermojetLogo height={20} color="white" />
            </div>
          )}
          <div className="pdf-page-header-right">{headerRight}</div>
        </div>
      )}

      <div className="pdf-page-content">{children}</div>

      {!hideFooter && (
        <div className="pdf-page-footer-band">
          <div>
            {footerLabel}
            {footerLabelSecondary && (
              <>
                <span className="pdf-footer-dot" />
                {footerLabelSecondary}
              </>
            )}
          </div>
          <div>{pageStr}</div>
        </div>
      )}
    </>
  );
}

interface SectionBarProps {
  children: ReactNode;
  style?: React.CSSProperties;
}

export function SectionBar({ children, style }: SectionBarProps) {
  return (
    <div className="pdf-section-bar" style={style}>
      {children}
    </div>
  );
}
